"""
Integration tests for complete registration and email verification flow.
Tests both student and company registration with persistence verification.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from io import BytesIO

from app.main import app
from app.database import Base, get_db
from app.models.student import Student
from app.models.company import Company
from app.models.establishment import Establishment
from app.models.otp import OTP
from app.utils.security import get_password_hash


# In-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override the dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

# Initialize TestClient properly - app is passed as positional argument in newer versions
try:
    client = TestClient(app)
except TypeError:
    # Fallback for different versions
    client = TestClient(app=app)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    # Clear all tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    
    # Add default establishment for student registration
    establishment = Establishment(
        establishment_id=1,
        name="Test University",
        establishment_type="University"
    )
    db.add(establishment)
    db.commit()
    
    yield db
    db.close()


@pytest.fixture
def sample_student_doc():
    """Create a sample document file for upload"""
    content = b"Sample PDF content"
    file = BytesIO(content)
    file.name = "sample.pdf"
    return file


class TestStudentRegistrationFlow:
    """Test complete student registration and verification flow"""
    
    def test_student_registration_creates_persisted_record(self, db_session):
        """
        Test that student registration successfully persists the user.
        This verifies the db.flush() and SELECT verification fix works.
        """
        # Prepare test data
        test_email = "student.test@example.com"
        test_password = "SecurePassword123!"
        test_first_name = "John"
        test_last_name = "Doe"
        
        # Create student registration request
        response = client.post(
            "/auth/register/student",
            data={
                "email": test_email,
                "password": test_password,
                "confirm_password": test_password,
                "first_name": test_first_name,
                "last_name": test_last_name,
                "establishment_id": 1,
            },
            files={"document": ("test.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        
        # Should succeed
        assert response.status_code == 200, f"Registration failed: {response.text}"
        assert "message" in response.json()
        
        # Verify student was actually persisted in database
        db = TestingSessionLocal()
        student = db.query(Student).filter(Student.email == test_email).first()
        assert student is not None, f"Student {test_email} not found in database after registration!"
        assert student.first_name == test_first_name
        assert student.last_name == test_last_name
        assert student.status == "pending"
        assert student.is_email_verified == False
        db.close()
    
    def test_student_otp_stored_after_registration(self, db_session):
        """
        Test that OTP is generated and stored after student registration.
        This ensures email verification code is available.
        """
        test_email = "student.otp@example.com"
        
        # Register student
        response = client.post(
            "/auth/register/student",
            data={
                "email": test_email,
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!",
                "first_name": "Jane",
                "last_name": "Smith",
                "establishment_id": 1,
            },
            files={"document": ("test.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        
        assert response.status_code == 200
        
        # Check OTP was stored
        db = TestingSessionLocal()
        otp_record = db.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None, "OTP not stored after registration"
        assert otp_record.code is not None
        assert otp_record.user_type == "student"
        assert otp_record.purpose == "verification"
        db.close()
    
    def test_student_can_verify_email_with_otp(self, db_session):
        """
        Test that student can verify email using OTP after registration.
        This is the critical flow that was broken by the "user not found" bug.
        """
        test_email = "student.verify@example.com"
        
        # Step 1: Register student
        response = client.post(
            "/auth/register/student",
            data={
                "email": test_email,
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!",
                "first_name": "Bob",
                "last_name": "Johnson",
                "establishment_id": 1,
            },
            files={"document": ("test.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        
        assert response.status_code == 200
        
        # Step 2: Get the OTP that was generated
        db = TestingSessionLocal()
        otp_record = db.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None
        otp_code = otp_record.code
        db.close()
        
        # Step 3: Verify email with OTP (THIS IS WHERE "USER NOT FOUND" ERROR OCCURRED)
        response = client.post(
            "/auth/verify-email",
            json={"email": test_email, "otp": otp_code}
        )
        
        # Should succeed without "user not found" error
        assert response.status_code == 200, f"Email verification failed: {response.text}"
        assert "message" in response.json()
        
        # Step 4: Verify student is now marked as email_verified
        db = TestingSessionLocal()
        student = db.query(Student).filter(Student.email == test_email).first()
        assert student is not None
        assert student.is_email_verified == True
        db.close()
    
    def test_duplicate_student_email_rejected(self, db_session):
        """Test that duplicate email registration is rejected"""
        test_email = "duplicate@example.com"
        
        # Register first student
        response1 = client.post(
            "/auth/register/student",
            data={
                "email": test_email,
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!",
                "first_name": "First",
                "last_name": "User",
                "establishment_id": 1,
            },
            files={"document": ("test.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        assert response1.status_code == 200
        
        # Try to register with same email
        response2 = client.post(
            "/auth/register/student",
            data={
                "email": test_email,
                "password": "Different123!",
                "confirm_password": "Different123!",
                "first_name": "Second",
                "last_name": "User",
                "establishment_id": 1,
            },
            files={"document": ("test.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        
        # Should fail with 400
        assert response2.status_code == 400


class TestCompanyRegistrationFlow:
    """Test complete company registration and verification flow"""
    
    def test_company_registration_creates_persisted_record(self, db_session):
        """
        Test that company registration successfully persists the user.
        This verifies the db.flush() and SELECT verification fix works for companies.
        """
        test_email = "company.test@example.com"
        test_company_name = "TechCorp Inc"
        
        # Create company registration request
        response = client.post(
            "/auth/register/company",
            data={
                "email": test_email,
                "password": "CompanyPass123!",
                "confirm_password": "CompanyPass123!",
                "company_name": test_company_name,
                "sector": "Technology",
                "address": "123 Tech Street",
            },
            files={"document": ("company.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        
        # Should succeed
        assert response.status_code == 200, f"Registration failed: {response.text}"
        assert "message" in response.json()
        
        # Verify company was actually persisted in database
        db = TestingSessionLocal()
        company = db.query(Company).filter(Company.email == test_email).first()
        assert company is not None, f"Company {test_email} not found in database after registration!"
        assert company.company_name == test_company_name
        assert company.status == "pending"
        assert company.is_email_verified == False
        db.close()
    
    def test_company_can_verify_email_with_otp(self, db_session):
        """
        Test that company can verify email using OTP after registration.
        This is the critical flow that was broken by the "user not found" bug.
        """
        test_email = "company.verify@example.com"
        
        # Step 1: Register company
        response = client.post(
            "/auth/register/company",
            data={
                "email": test_email,
                "password": "CompanyPass123!",
                "confirm_password": "CompanyPass123!",
                "company_name": "TestCorp",
                "sector": "Finance",
                "address": "456 Finance Ave",
            },
            files={"document": ("company.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        
        assert response.status_code == 200
        
        # Step 2: Get the OTP that was generated
        db = TestingSessionLocal()
        otp_record = db.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None
        otp_code = otp_record.code
        db.close()
        
        # Step 3: Verify email with OTP (THIS IS WHERE "USER NOT FOUND" ERROR OCCURRED)
        response = client.post(
            "/auth/verify-email",
            json={"email": test_email, "otp": otp_code}
        )
        
        # Should succeed without "user not found" error
        assert response.status_code == 200, f"Email verification failed: {response.text}"
        assert "message" in response.json()
        
        # Step 4: Verify company is now marked as email_verified
        db = TestingSessionLocal()
        company = db.query(Company).filter(Company.email == test_email).first()
        assert company is not None
        assert company.is_email_verified == True
        db.close()


class TestInvalidOTPHandling:
    """Test OTP validation and error handling"""
    
    def test_verify_email_with_invalid_otp(self, db_session):
        """Test that invalid OTP is rejected"""
        test_email = "invalid.otp@example.com"
        
        # Register student
        response = client.post(
            "/auth/register/student",
            data={
                "email": test_email,
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!",
                "first_name": "Test",
                "last_name": "User",
                "establishment_id": 1,
            },
            files={"document": ("test.pdf", BytesIO(b"test content"), "application/pdf")}
        )
        assert response.status_code == 200
        
        # Try to verify with wrong OTP
        response = client.post(
            "/auth/verify-email",
            json={"email": test_email, "otp": "000000"}  # Wrong OTP
        )
        
        # Should fail
        assert response.status_code == 400
        assert "Invalid OTP" in response.json()["detail"]
    
    def test_verify_email_for_unregistered_user(self, db_session):
        """Test that verifying email for non-existent user fails with helpful message"""
        
        response = client.post(
            "/auth/verify-email",
            json={"email": "nonexistent@example.com", "otp": "123456"}
        )
        
        # Should fail with 404
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        # Should suggest registration
        assert "register" in response.json()["detail"].lower()
