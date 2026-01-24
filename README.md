# 🎓 DZ-Stagia - Internship Management Platform

Welcome to **DZ-Stagia**, a comprehensive internship management platform that connects students with internship opportunities across Algeria. This platform addresses the critical gap between student job seekers and employers in Algeria's competitive academic and professional landscape. The platform streamlines recruitment by providing a centralized hub where students can showcase their skills and companies can efficiently identify promising young talent.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
  - [Using Docker Compose](#using-docker-compose)
  - [Running Locally](#running-locally)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Database & Migrations](#database--migrations)
- [Common Issues](#common-issues)
- [Support](#support)

---

## 🎯 Project Overview

DZ-Stagia is a full-stack web application designed to streamline the internship process in Algeria. Students can:
- Browse and search internship offers
- Apply for positions
- Track application status
- Receive notifications

Companies can:
- Post internship offers
- Manage applications
- Track candidate progress
- Communicate with candidates

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- **Docker & Docker Compose** (recommended for easy setup)
- **Node.js 18+** (if running frontend locally)
- **Python 3.9+** (if running backend locally)
- **Git**
- **PostgreSQL** (if running locally without Docker)

### Clone the Repository

1. Open your terminal
2. Navigate to where you want to store the project
3. Copy and paste this command:
   ```bash
   git clone https://github.com/zeghmarassia/DZ-Stagia.git
   ```
4. Enter the project folder:
   ```bash
   cd DZ-Stagia
   ```

**Using GitHub Desktop?**
1. Click on `File` > `Clone Repository`
2. Paste the repository URL: `https://github.com/zeghmarassia/DZ-Stagia.git`
3. Choose where to save it on your computer
4. Click "Clone"

### Installation

#### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start both frontend and backend services
docker-compose up --build
```

#### Option 2: Running Locally

**Backend Setup:**

```bash
cd backend

# Create a virtual environment
python3 -m venv venv
venv\Scripts\activate  # On Linux: source venv/bin/activate 

# Install dependencies
pip install -r requirements.txt

# Create a .env file with the following variables:
# DATABASE_URL=postgresql://user:password@localhost:5432/dz_stagiaire_db
# JWT_SECRET_KEY=your_secret_key_here
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASSWORD=your_app_password

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
# Backend will run on http://localhost:8000
```

**Frontend Setup:**

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# Frontend will run on http://localhost:3000
```

---

## 📁 Project Structure

### Backend (`/backend`)

The backend is built with **FastAPI** following a modular architecture:

- **`app/`** - Main application code
  - **`models/`** - SQLAlchemy database models (Student, Company, Offer, Application, etc.)
  - **`routes/`** - API route handlers (authRoutes, studentRoutes, companyRoutes, etc.)
  - **`schemas/`** - Pydantic validation schemas
  - **`services/`** - Business logic layer (authServices, emailService, notificationService, etc.)
  - **`utils/`** - Utility functions (security, storage)
  - `main.py`, `config.py`, `database.py` - Core setup files
- **`alembic/`** - Database migrations and schema management
- **`scripts/`** - Utility SQL scripts for initial data setup

### Frontend (`/frontend`)

The frontend is built with **React**, **Vite**, and **Tailwind CSS**:

- **`src/components/`** - Reusable React components (Cards, Navbar, Footer, etc.)
- **`src/pages/`** - Page-level components
- **`src/services/`** - API service calls
- **`src/config/`** - Configuration files
- **`src/assets/`** - Images and static files
- `i18n.js` - Internationalization setup
- `store.js` - Redux state management
- Configuration files: `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`

---

## 🏃 Running the Application

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# In another terminal, to stop the services:
docker-compose down

# To view logs from specific service:
docker-compose logs backend
docker-compose logs frontend

# To rebuild only one service:
docker-compose up --build backend
```

### Running Locally

**Backend:**

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

---

## ✨ Key Features

### Student Features
- 📝 Create and manage student profiles
- 🔍 Search and filter internship offers
- 📤 Submit applications to internships
- 📢 Receive notifications about application status
- ⭐ Save favorite offers
- 📊 Track application history

### Company Features
- 🏢 Register and manage company profile
- ➕ Post internship offers
- 📋 Review and manage applications
- 💬 Communicate with candidates
- 📊 View candidate profiles and qualifications

### Admin Features
- 👥 Manage users and accounts
- 🏛️ Manage establishments and domains
- 🛡️ Moderate content
- 📈 View platform statistics

---

## 🛠️ Technologies Used

### Backend
- **FastAPI** - Modern web framework for building APIs
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Alembic** - Database migration tool
- **Python-Jose** - JWT token handling
- **PassLib & Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **Cloudinary** - Cloud file storage
- **aiosmtplib** - Email sending

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **Lucide React** - Icon library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 🗄️ Database & Migrations

### Running Migrations

```bash
cd backend

# Create a new migration after modifying models
alembic revision --autogenerate -m "Description of changes"

# Apply pending migrations
alembic upgrade head

# Rollback to previous migration
alembic downgrade -1

# View migration history
alembic history
```

---
## 🤝 Team Collaboration

When multiple team members work on the project:
1. Always pull the latest changes before starting work
2. Test changes on your local machine before sharing
3. Make sure file names match exactly (including capitalization)
4. Report any issues in the project's issue tracker


## 🐛 Common Issues and Solutions

### Issue: "Connection refused" when starting Docker

**Solution**: Ensure Docker daemon is running and all ports (3000, 8000) are available.

```bash
# Check if Docker is running
docker --version

# Kill any process using ports 3000 or 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Issue: "ModuleNotFoundError" in Backend

**Solution**: Ensure virtual environment is activated and dependencies are installed.

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "npm install" takes too long

**Solution**: Clear npm cache and try again.

```bash
npm cache clean --force
npm install
```

### Issue: Database migration fails

**Solution**: Check DATABASE_URL in `.env` file and ensure PostgreSQL is running.

```bash
# Verify database connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: Frontend shows blank page

**Solution**: Clear browser cache and restart the dev server.

```bash
cd frontend
npm run dev
```

---

## 📧 Support

If you encounter any issues:
- Check the common issues section above
- Look for error messages in the terminal
- Contact our team at [stagia.dz@gmail.com]

Created with ❤️ by [Stagia Team]

---

**Last Updated**: January 2026
