from app.routes.authRoutes import router as auth_router
from app.routes.adminRoutes import router as admin_router
from app.routes.establishment import router as establishment_router
from app.routes.studentRoutes import router as student_router

__all__ = [
    "auth_router",
    "admin_router",
    "establishment_router",
    "student_router"
]