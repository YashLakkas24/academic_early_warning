from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Student
from auth_dependencies import require_student
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
    db: Session = Depends(get_db),
    current_user=Depends(require_student)
):
    if current_user.get("uid") != student_id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own student profile"
        )
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