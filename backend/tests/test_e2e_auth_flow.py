"""
End-to-end integration tests for complete authentication flow.
Tests the full signup → OTP verification → account setup workflow.
"""

import pytest
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from io import BytesIO
from unittest.mock import patch, AsyncMock, MagicMock

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


class TestCompleteStudentAuthFlow:
    """Test complete student authentication workflow"""
    
    def test_student_signup_and_email_verification_flow(self, db_session):
        """
        Test the complete flow:
        1. Student registers with document upload
        2. OTP is generated and stored
        3. Student verifies email with OTP
        4. Email is marked as verified
        """
        test_email = "complete.flow@example.com"
        test_password = "SecurePass123!"
        
        # Step 1: Student Registration
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/student_doc.pdf"
            
            async def run_registration():
                result = await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password=test_password,
                    first_name="Jane",
                    last_name="Smith",
                    establishment_id=1,
                    document=None  # Mocked
                )
                return result
            
            student = asyncio.run(run_registration())
            assert student is not None
            assert student.email == test_email
            assert student.is_email_verified == False
            print(f"✓ Step 1 Complete: Student {test_email} registered")
        
        # Step 2: Verify OTP was generated and stored
        otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None, "OTP not generated after registration"
        assert otp_record.otp_code is not None
        assert otp_record.user_type == "student"
        otp_code = otp_record.otp_code
        print(f"✓ Step 2 Complete: OTP generated and stored: {otp_code}")
        
        # Step 3: Verify email with OTP
        response = AuthService.verify_email(db_session, test_email, otp_code)
        assert response is not None
        assert "message" in response
        print(f"✓ Step 3 Complete: Email verified with OTP")
        
        # Step 4: Confirm email_verified flag is set
        verified_student = db_session.query(Student).filter(Student.email == test_email).first()
        assert verified_student is not None
        assert verified_student.is_email_verified == True
        print(f"✓ Step 4 Complete: Email marked as verified in database")
    
    def test_invalid_otp_fails_verification(self, db_session):
        """Test that invalid OTP is rejected"""
        test_email = "invalid.otp@example.com"
        
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
        with pytest.raises(Exception) as exc_info:
            AuthService.verify_email(db_session, test_email, "000000")
        
        assert "Invalid or expired OTP" in str(exc_info.value)
        print(f"✓ Invalid OTP correctly rejected")
    
    def test_user_not_found_error_message(self, db_session):
        """Test that non-existent user gets proper error message"""
        nonexistent_email = "nonexistent@example.com"
        
        with pytest.raises(Exception) as exc_info:
            AuthService.verify_email(db_session, nonexistent_email, "123456")
        
        assert "Please register first" in str(exc_info.value)
        print(f"✓ Non-existent user error message correct")


class TestCompleteCompanyAuthFlow:
    """Test complete company authentication workflow"""
    
    def test_company_signup_and_email_verification_flow(self, db_session):
        """
        Test the complete company flow:
        1. Company registers with document upload
        2. OTP is generated and stored
        3. Company verifies email with OTP
        4. Email is marked as verified
        """
        test_email = "company.flow@example.com"
        test_company_name = "TechCorp Inc"
        
        # Step 1: Company Registration
        with patch('app.services.authServices.upload_company_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/company_doc.pdf"
            
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
            assert company is not None
            assert company.email == test_email
            assert company.company_name == test_company_name
            assert company.is_email_verified == False
            print(f"✓ Step 1 Complete: Company {test_company_name} registered")
        
        # Step 2: Verify OTP was generated and stored
        otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
        assert otp_record is not None
        assert otp_record.user_type == "company"
        otp_code = otp_record.otp_code
        print(f"✓ Step 2 Complete: OTP generated and stored")
        
        # Step 3: Verify email with OTP
        response = AuthService.verify_email(db_session, test_email, otp_code)
        assert response is not None
        print(f"✓ Step 3 Complete: Email verified with OTP")
        
        # Step 4: Confirm email_verified flag is set
        verified_company = db_session.query(Company).filter(Company.email == test_email).first()
        assert verified_company is not None
        assert verified_company.is_email_verified == True
        print(f"✓ Step 4 Complete: Email marked as verified in database")


class TestOTPExpiry:
    """Test OTP expiry and reuse prevention"""
    
    def test_otp_cannot_be_reused(self, db_session):
        """Test that OTP is deleted after successful verification and cannot be reused"""
        test_email = "otp.reuse@example.com"
        
        # Register student
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc.pdf"
            
            async def run_registration():
                return await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password="SecurePass123!",
                    first_name="OTP",
                    last_name="Test",
                    establishment_id=1,
                    document=None
                )
            
            asyncio.run(run_registration())
        
        # Get the OTP
        otp_record = db_session.query(OTP).filter(OTP.email == test_email).first()
        otp_code = otp_record.otp_code
        
        # Verify email with OTP (this deletes the OTP)
        AuthService.verify_email(db_session, test_email, otp_code)
        
        # Try to use the same OTP again - should fail
        with pytest.raises(Exception) as exc_info:
            AuthService.verify_email(db_session, test_email, otp_code)
        
        # OTP should be deleted, so it will say "Invalid or expired OTP"
        assert "Invalid" in str(exc_info.value) or "expired" in str(exc_info.value)
        print(f"✓ OTP correctly cannot be reused after verification")
    
    def test_duplicate_registration_rejected(self, db_session):
        """Test that duplicate email registration is rejected"""
        test_email = "duplicate@example.com"
        
        # First registration
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc1.pdf"
            
            async def run_first_registration():
                return await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password="Pass123!",
                    first_name="First",
                    last_name="User",
                    establishment_id=1,
                    document=None
                )
            
            asyncio.run(run_first_registration())
        
        # Try second registration with same email
        with patch('app.services.authServices.upload_student_document', new_callable=AsyncMock) as mock_upload:
            mock_upload.return_value = "https://example.com/doc2.pdf"
            
            async def run_second_registration():
                return await AuthService.register_student(
                    db=db_session,
                    email=test_email,
                    password="Different123!",
                    first_name="Second",
                    last_name="User",
                    establishment_id=1,
                    document=None
                )
            
            with pytest.raises(Exception) as exc_info:
                asyncio.run(run_second_registration())
        
        assert "already registered" in str(exc_info.value)
        print(f"✓ Duplicate registration correctly rejected")
