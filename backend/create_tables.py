from app.database import engine, Base
from app.models import *
import time

def create_tables():
    """Create all tables in the database"""
    print(" Creating tables in Neon database...")
    print(" Testing connection first...")
    
    try:
        # Test connection
        with engine.connect() as conn:
            print(" Connection successful!")
        
        print("Starting table creation...")
        start = time.time()
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        elapsed = time.time() - start
        print(f"All tables created successfully in {elapsed:.2f} seconds!")
        
        # List tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n Created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"  - {table}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_tables()