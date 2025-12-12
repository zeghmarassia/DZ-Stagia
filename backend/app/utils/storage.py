from supabase import create_client, Client
from fastapi import UploadFile, HTTPException
from app.config import settings
import uuid
from pathlib import Path

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

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
        bucket: str,
        user_id: int,
        folder: str
    ) -> str:
        """
        Upload any file to Supabase (I made all buckets are public)
        
        Args:
            file: Uploaded file
            bucket: Bucket name
            user_id: User ID
            folder: Folder name (e.g., 'student', 'company', 'admin')
        
        Returns:
            Public URL of uploaded file
        """
        try:
            StorageService._validate_file(file)
            
            # Create path: folder/user_id/uuid_filename.ext
            file_ext = Path(file.filename).suffix
            filename = f"{folder}/{user_id}/{uuid.uuid4()}{file_ext}"
            
            # Upload
            file_content = await file.read()
            supabase.storage.from_(bucket).upload(
                path=filename,
                file=file_content,
                file_options={"content-type": file.content_type}
            )
            
            # Return public URL
            return supabase.storage.from_(bucket).get_public_url(filename)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
        finally:
            await file.seek(0)
    
    @staticmethod
    def delete_file(file_url: str, bucket: str) -> bool:
        """Delete a file"""
        try:
            file_path = file_url.split(f'/object/public/{bucket}/')[-1]
            supabase.storage.from_(bucket).remove([file_path])
            return True
        except:
            return False


async def upload_student_document(file: UploadFile, student_id: int) -> str:
    return await StorageService.upload_file(file, "student-documents", student_id, "student")

async def upload_company_document(file: UploadFile, company_id: int) -> str:
    return await StorageService.upload_file(file, "company-documents", company_id, "company")

async def upload_student_profile(file: UploadFile, student_id: int) -> str:
    return await StorageService.upload_file(file, "student-pfps", student_id, "student")

async def upload_company_logo(file: UploadFile, company_id: int) -> str:
    return await StorageService.upload_file(file, "company-logos", company_id, "company")

async def upload_admin_profile(file: UploadFile, admin_id: int) -> str:
    return await StorageService.upload_file(file, "admin-pics", admin_id, "admin")

def delete_student_document(url: str) -> bool:
    return StorageService.delete_file(url, "student-documents")

def delete_company_document(url: str) -> bool:
    return StorageService.delete_file(url, "company-documents")

def delete_student_profile(url: str) -> bool:
    return StorageService.delete_file(url, "student-pfps")

def delete_company_logo(url: str) -> bool:
    return StorageService.delete_file(url, "company-logos")

def delete_admin_profile(url: str) -> bool:
    return StorageService.delete_file(url, "admin-pics")