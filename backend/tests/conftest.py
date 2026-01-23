import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.database import Base, get_db
from app.main import app
from app.config import settings
from unittest.mock import patch, AsyncMock
import os

# Use a test database (SQLite in memory for fast tests)
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///./test.db")

# Create test engine
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {}
)

TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test"""
    # Create all tables
    Base.metadata.create_all(bind=test_engine)
    
    # Create a new session
    session = TestSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database override"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Mock file upload functions to avoid Cloudinary calls in tests
    # Patch at the source module level so it works for all imports
    with patch('app.utils.storage.upload_student_document', new_callable=AsyncMock) as mock_student_upload, \
         patch('app.utils.storage.upload_company_document', new_callable=AsyncMock) as mock_company_upload:
        
        # Return a fake URL for uploads
        mock_student_upload.return_value = "https://example.com/test-document.pdf"
        mock_company_upload.return_value = "https://example.com/test-company-doc.pdf"
        
        with TestClient(app) as test_client:
            yield test_client
    
    # Clean up
    app.dependency_overrides.clear()


@pytest.fixture
def sample_establishment(db_session):
    """Create a sample establishment for testing"""
    from app.models.establishment import Establishment
    
    establishment = Establishment(
        name="Test University",
        abbreviation="TU",
        type="university",
        address="123 Test St"
    )
    db_session.add(establishment)
    db_session.commit()
    db_session.refresh(establishment)
    return establishment


@pytest.fixture
def sample_student_data():
    """Sample student registration data"""
    return {
        "email": "test.student@example.com",
        "password": "TestPassword123!",
        "first_name": "Test",
        "last_name": "Student",
        "establishment_id": 1  # Will be set by fixture
    }


@pytest.fixture
def sample_company_data():
    """Sample company registration data"""
    return {
        "email": "test.company@example.com",
        "password": "TestPassword123!",
        "company_name": "Test Company",
        "sector": "Technology",
        "address": "456 Business Ave"
    }

