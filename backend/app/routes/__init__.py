from app.routes.authRoutes import router as auth_router
from app.routes.adminRoutes import router as admin_router

__all__ = [
    "auth_router",
    "admin_router"
]