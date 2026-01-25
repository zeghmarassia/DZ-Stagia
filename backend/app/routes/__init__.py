# This exports the modules themselves, not the routers
from app.routes import authRoutes
from app.routes import adminRoutes
from app.routes import establishment
from app.routes import studentRoutes
from app.routes import companyRoutes
from app.routes import mainRoutes
from app.routes import offerRoutes
from app.routes import applicationRoutes
from app.routes import notificationRoutes

__all__ = [
    "authRoutes",
    "adminRoutes",
    "establishment",
    "studentRoutes",
    "companyRoutes",
    "mainRoutes",
    "offerRoutes",
    "applicationRoutes",
    "notificationRoutes"
]