from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.database import engine, Base
from app.routes import authRoutes, adminRoutes, studentRoutes, companyRoutes
from app.routes import offerRoutes, applicationRoutes, notificationRoutes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DZ-Stagia API",
    description="Backend API for Stagia platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers with appropriate prefixes
app.include_router(authRoutes.router, prefix="/auth")
app.include_router(adminRoutes.router, prefix="/admin")
app.include_router(studentRoutes.router)  # Router already has /student prefix
app.include_router(companyRoutes.router)
app.include_router(offerRoutes.router, prefix="/api/v1")  
app.include_router(applicationRoutes.router, prefix="/api/v1")
app.include_router(notificationRoutes.router, prefix="/api/v1")


# Custom OpenAPI schema to add JWT authentication in docs
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="DZ-Stagia API",
        version="1.0.0",
        description="Backend API for Stagia platform with JWT authentication",
        routes=app.routes,
    )
    
    # Add Bearer token security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token (without 'Bearer' prefix)"
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi



@app.get("/")
def root():
    return {
        "message": "Welcome to DZ-Stagia API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }