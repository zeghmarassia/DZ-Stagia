import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_supabase_connection():
    """Test if Supabase is connected properly"""
    print("🧪 Testing Supabase Storage...")
    
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    
    print(f"📍 Supabase URL: {SUPABASE_URL}")
    print(f"🔑 API Key: {SUPABASE_KEY[:20]}... (length: {len(SUPABASE_KEY)})")
    
    # Check if it's anon or service_role
    if "anon" in SUPABASE_KEY:
        print("⚠️  WARNING: You're using the 'anon' key!")
        print("   You need the 'service_role' key to list buckets")
        print("   Get it from: Dashboard → Settings → API → service_role key")
    elif "service_role" in SUPABASE_KEY:
        print("✅ Using service_role key (correct!)")
    
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("\n🔌 Attempting to connect...")
        buckets = supabase.storage.list_buckets()
        
        print(f"\n✅ Connection successful!")
        print(f"📦 Found {len(buckets)} buckets:")
        
        if len(buckets) == 0:
            print("\n❌ No buckets found!")
            print("   Possible reasons:")
            print("   1. Wrong API key (need service_role, not anon)")
            print("   2. Buckets not created yet")
            print("   3. Wrong Supabase project URL")
        else:
            for bucket in buckets:
                # Access as object attributes, not dictionary
                bucket_name = getattr(bucket, 'name', bucket.get('name') if hasattr(bucket, 'get') else 'unknown')
                bucket_public = getattr(bucket, 'public', bucket.get('public', False) if hasattr(bucket, 'get') else False)
                print(f"   - {bucket_name} ({'public' if bucket_public else 'private'})")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed!")
        print(f"Error: {str(e)}")
        print(f"\nFull error type: {type(e).__name__}")
        
        if "401" in str(e) or "Unauthorized" in str(e):
            print("\n💡 This is an authentication error!")
            print("   Make sure you're using the service_role key, not anon key")
        
        return False

if __name__ == "__main__":
    asyncio.run(test_supabase_connection())