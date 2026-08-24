from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Student

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/{student_id}")
def get_student(
    student_id: str,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.student_id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "student_id": student.student_id,
        "name": student.name,
        "roll_number": student.roll_number,
        "attendance": student.attendance,
        "previous_sem_cgpa": student.previous_sem_cgpa,
        "extracurricular_count": student.extracurricular_count
    }