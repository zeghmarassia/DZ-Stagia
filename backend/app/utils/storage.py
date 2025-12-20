import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.config import settings
import uuid
from pathlib import Path

# Initialize Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class StorageService:
    
    ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.webp'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    @staticmethod
    def _validate_file(file: UploadFile) -> None:
        """Validate file extension and size"""
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in StorageService.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(StorageService.ALLOWED_EXTENSIONS)}"
            )
        
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > StorageService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max: 5MB"
            )
    
    @staticmethod
    async def upload_file(
        file: UploadFile,
        folder: str,
        user_id: int,
        resource_type: str = "image"  # "image" or "raw" for PDFs/docs
    ) -> str:
        """
        Upload file to Cloudinary
        
        Args:
            file: Uploaded file
            folder: Folder name (e.g., 'student-documents', 'company-logos')
            user_id: User ID
            resource_type: "image" for images, "raw" for PDFs/documents
        
        Returns:
            Secure URL of uploaded file
        """
        try:
            StorageService._validate_file(file)
            
            # Read file content
            file_content = await file.read()
            
            # Create unique public_id: folder/user_id/uuid
            file_ext = Path(file.filename).suffix.lower()
            public_id = f"{folder}/{user_id}/{uuid.uuid4()}"
            
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file_content,
                folder=folder,
                public_id=f"{user_id}/{uuid.uuid4()}",
                resource_type=resource_type,
                format=file_ext.replace('.', ''),  # Remove the dot
            )
            
            # Return secure URL
            return upload_result['secure_url']
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
        finally:
            await file.seek(0)
    
    @staticmethod
    def delete_file(file_url: str) -> bool:
        """Delete a file from Cloudinary"""
        try:
            # Extract public_id from URL
            # URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/user_id/uuid.jpg
            parts = file_url.split('/')
            # Get everything after 'upload/' and before file extension
            upload_index = parts.index('upload')
            public_id_parts = parts[upload_index + 2:]  # Skip version number
            public_id = '/'.join(public_id_parts).rsplit('.', 1)[0]  # Remove extension
            
            cloudinary.uploader.destroy(public_id)
            return True
        except Exception as e:
            print(f"Delete failed: {str(e)}")
            return False


# Helper functions for specific upload types
async def upload_student_document(file: UploadFile, student_id: int) -> str:
    """Upload student documents (PDFs, images)"""
    file_ext = Path(file.filename).suffix.lower()
    resource_type = "image" if file_ext in {'.jpg', '.jpeg', '.png', '.webp'} else "raw"
    return await StorageService.upload_file(file, "student-documents", student_id, resource_type)

async def upload_company_document(file: UploadFile, company_id: int) -> str:
    """Upload company documents (PDFs, images)"""
    file_ext = Path(file.filename).suffix.lower()
    resource_type = "image" if file_ext in {'.jpg', '.jpeg', '.png', '.webp'} else "raw"
    return await StorageService.upload_file(file, "company-documents", company_id, resource_type)

async def upload_student_profile(file: UploadFile, student_id: int) -> str:
    """Upload student profile pictures (images only)"""
    return await StorageService.upload_file(file, "student-pfps", student_id, "image")

async def upload_company_logo(file: UploadFile, company_id: int) -> str:
    """Upload company logos (images only)"""
    return await StorageService.upload_file(file, "company-logos", company_id, "image")

async def upload_admin_profile(file: UploadFile, admin_id: int) -> str:
    """Upload admin profile pictures (images only)"""
    return await StorageService.upload_file(file, "admin-pics", admin_id, "image")


# Delete functions
def delete_student_document(url: str) -> bool:
    return StorageService.delete_file(url)

def delete_company_document(url: str) -> bool:
    return StorageService.delete_file(url)

def delete_student_profile(url: str) -> bool:
    return StorageService.delete_file(url)

def delete_company_logo(url: str) -> bool:
    return StorageService.delete_file(url)

def delete_admin_profile(url: str) -> bool:
    return StorageService.delete_file(url)