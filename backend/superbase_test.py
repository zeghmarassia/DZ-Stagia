from supabase import create_client
from app.config import settings

try:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    
    # List buckets
    buckets = supabase.storage.list_buckets()
    print("✅ Supabase Storage connected!")
    print(f"Buckets: {[b['name'] for b in buckets]}")
    
except Exception as e:
    print(f"❌ Connection failed!")
    print(f"Error: {e}")