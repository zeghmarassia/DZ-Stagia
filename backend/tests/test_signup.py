import pytest
from fastapi import status
from io import BytesIO
from app.models import Student


def test_student_signup(client, db_session, sample_establishment):
    """Test student signup with file upload"""
    # Create a PDF file for upload
    file_content = b"%PDF-1.4 fake document content for testing"
    files = {
        "document": ("test_document.pdf", BytesIO(file_content), "application/pdf")
    }
    
    # Signup data
    data = {
        "email": "student@example.com",
        "password": "TestPassword123!",
        "first_name": "John",
        "last_name": "Doe",
        "establishment_id": sample_establishment.establishment_id
    }
    
    # Make signup request with file
    response = client.post("/auth/student/register", data=data, files=files)
    
    # Check signup was successful
    assert response.status_code == status.HTTP_201_CREATED
    result = response.json()
    assert result["email"] == "student@example.com"
    assert result["first_name"] == "John"
    assert result["last_name"] == "Doe"
    
    # Verify student was saved in database
    student = db_session.query(Student).filter(Student.email == "student@example.com").first()
    assert student is not None
    assert student.status == "pending"

