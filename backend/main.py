from fastapi import FastAPI
from sqlalchemy import text

from database import engine

app = FastAPI()


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