from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database import engine
from routes.auth import router as auth_router
from routes.teacher import router as teacher_router
from routes.student import router as student_router
from routes.interest import router as interest_router
from routes.interest_options import router as interest_options_router
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Existing routes
app.include_router(auth_router)
app.include_router(teacher_router)
app.include_router(interest_router)
app.include_router(interest_options_router)
# Student routes
app.include_router(student_router)


@app.get("/")
def home():
    return {
        "message": "Academic Early Warning Backend is running!"
    }


@app.get("/api/test")
def api_test():
    return {
        "project": "Academic Early Warning",
        "status": "Backend working",
        "member": "Member 1"
    }


@app.get("/api/test-db")
def test_database():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "success",
            "message": "FastAPI is connected to PostgreSQL!"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }