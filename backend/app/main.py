from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_router  # ← Fixed import
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DZ-Stagia API",
    description="Backend API for DZ-Stagia internship platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)  # ← Clean!

@app.get("/")
def root():
    return {
        "message": "Welcome to DZ-Stagia API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }