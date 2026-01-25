"""
Direct integration tests for user registration and email verification.
Tests the registration persistence fix without HTTP layer complications.
"""

import pytest
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from io import BytesIO
from unittest.mock import patch, AsyncMock

from app.database import Base
from app.models.student import Student
from app.models.company import Company
from app.models.establishment import Establishment
from app.models.otp import OTP
from app.services.authServices import AuthService


# In-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)


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
        type="University"
    )
    db.add(establishment)
    db.commit()
    
    yield db
    db.close()


class TestStudentRegistrationPersistence:
    """Test that student registration properly persists users"""
    
    def test_student_registration_saves_to_database(self, db_session):
        """
        Test that student registration creates a record that persists in database.
        This is the core test for the db.flush() + SELECT verification fix.
        """
        test_email = "student.persist@example.com"
        test_password = "SecurePass123!"
        
        # Mock the document upload
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            # Call register_student (async function)
            async def run_registration():
                result = await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password=test_password,
                    first_name="John",
                    last_name="Doe",
                    establishment_id=1,
                    document=None  # Mocked
                )
                return result
            
            # Run the async function
            student = asyncio.run(run_registration())
            
            # Assert registration was successful
            assert student is not None
            assert student.email == test_email
            assert student.student_id is not None
            
            # Verify student can be retrieved from database (this was failing before the fix)
            retrieved_student = db_session.query(Student).filter(
                Student.email == test_email
            ).first()
            
            assert retrieved_student is not None, "Student not found in database after registration!"
            assert retrieved_student.student_id == student.student_id
            assert retrieved_student.first_name == "John"
            assert retrieved_student.last_name == "Doe"
            assert retrieved_student.is_email_verified == False
    
    def test_student_otp_generated_and_stored(self, db_session):
        """
        Test that OTP is generated and stored during registration.
        This enables the email verification step.
        """
        test_email = "student.otp@example.com"
        
        # Mock the document upload
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            async def run_registration():
                return await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password="SecurePass123!",
                    first_name="Jane",
                    last_name="Smith",
                    establishment_id=1,
                    document=None
                )
            
            student = asyncio.run(run_registration())
            
            # Check OTP was stored
            otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
            assert otp_record is not None, "OTP not stored after registration"
            assert otp_record.otp_code is not None
            assert otp_record.user_type == "student"
            assert otp_record.purpose == "verification"


class TestCompanyRegistrationPersistence:
    """Test that company registration properly persists users"""
    
    def test_company_registration_saves_to_database(self, db_session):
        """
        Test that company registration creates a record that persists in database.
        This verifies the same db.flush() + SELECT verification fix works for companies.
        """
        test_email = "company.persist@example.com"
        test_company_name = "TechCorp Inc"
        
        # Mock the document upload
        with patch('app.services.authServices.upload_company_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/company-doc.pdf"
            
            async def run_registration():
                return await AuthService.register_company(
                    db=db_session,
                    email=test_email,
                    password="CompanyPass123!",
                    company_name=test_company_name,
                    sector="Technology",
                    address="123 Tech Street",
                    document=None  # Mocked
                )
            
            company = asyncio.run(run_registration())
            
            # Assert registration was successful
            assert company is not None
            assert company.email == test_email
            assert company.company_id is not None
            
            # Verify company can be retrieved from database (this was failing before the fix)
            retrieved_company = db_session.query(Company).filter(
                Company.email == test_email
            ).first()
            
            assert retrieved_company is not None, "Company not found in database after registration!"
            assert retrieved_company.company_id == company.company_id
            assert retrieved_company.company_name == test_company_name
            assert retrieved_company.is_email_verified == False
    
    def test_company_otp_generated_and_stored(self, db_session):
        """
        Test that OTP is generated and stored during company registration.
        """
        test_email = "company.otp@example.com"
        
        with patch('app.services.authServices.upload_company_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            async def run_registration():
                return await AuthService.register_company(
                    db=db_session,
                    email=test_email,
                    password="CompanyPass123!",
                    company_name="TestCorp",
                    sector="Finance",
                    address="456 Finance Ave",
                    document=None
                )
            
            company = asyncio.run(run_registration())
            
            # Check OTP was stored
            otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
            assert otp_record is not None, "OTP not stored after company registration"
            assert otp_record.otp_code is not None
            assert otp_record.user_type == "company"
            assert otp_record.purpose == "verification"


class TestEmailVerificationFlow:
    """Test email verification with OTP"""
    
    def test_student_email_verification_succeeds(self, db_session):
        """
        Test that student email verification succeeds after registration.
        This was the broken flow - "user not found" error.
        """
        test_email = "student.verify@example.com"
        
        # Step 1: Register student
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            async def run_registration():
                return await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password="SecurePass123!",
                    first_name="Bob",
                    last_name="Johnson",
                    establishment_id=1,
                    document=None
                )
            
            student = asyncio.run(run_registration())
            assert student is not None
        
        # Step 2: Get the OTP code
        otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None
        otp_code = otp_record.otp_code
        
        # Step 3: Verify email (THIS IS WHERE THE BUG WAS)
        result = AuthService.verify_email(db=db_session, email=test_email, otp=otp_code)
        
        assert result is not None
        assert result.is_email_verified == True
        
        # Step 4: Verify student is marked as verified in database
        verified_student = db_session.query(Student).filter(Student.email == test_email).first()
        assert verified_student is not None
        assert verified_student.is_email_verified == True
    
    def test_company_email_verification_succeeds(self, db_session):
        """
        Test that company email verification succeeds after registration.
        """
        test_email = "company.verify@example.com"
        
        # Step 1: Register company
        with patch('app.services.authServices.upload_company_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            async def run_registration():
                return await AuthService.register_company(
                    db=db_session,
                    email=test_email,
                    password="CompanyPass123!",
                    company_name="VerifyTest Corp",
                    sector="Technology",
                    address="789 Test Lane",
                    document=None
                )
            
            company = asyncio.run(run_registration())
            assert company is not None
        
        # Step 2: Get the OTP code
        otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None
        otp_code = otp_record.otp_code
        
        # Step 3: Verify email
        result = AuthService.verify_email(db=db_session, email=test_email, otp=otp_code)
        
        assert result is not None
        # Check if either student or company was verified
        verified_company = db_session.query(Company).filter(Company.email == test_email).first()
        assert verified_company is not None
        assert verified_company.is_email_verified == True
    
    def test_verify_email_with_invalid_otp_fails(self, db_session):
        """
        Test that verification fails with wrong OTP.
        """
        test_email = "student.invalid@example.com"
        
        # Register student
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            async def run_registration():
                return await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password="SecurePass123!",
                    first_name="Test",
                    last_name="User",
                    establishment_id=1,
                    document=None
                )
            
            asyncio.run(run_registration())
        
        # Try to verify with wrong OTP
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc_info:
            AuthService.verify_email(db=db_session, email=test_email, otp="000000")
        
        assert "Invalid OTP" in str(exc_info.value.detail)
    
    def test_verify_email_for_unregistered_user_fails(self, db_session):
        """
        Test that verification fails for non-existent user with helpful message.
        """
        from fastapi import HTTPException
        
        with pytest.raises(HTTPException) as exc_info:
            AuthService.verify_email(db=db_session, email="nonexistent@example.com", otp="123456")
        
        assert exc_info.value.status_code == 404
        assert "not found" in str(exc_info.value.detail).lower()
