from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import StudentInterest, QuizAnswer
from database import SessionLocal


router = APIRouter(
    prefix="/api/students",
    tags=["Interest+"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


class InterestRequest(BaseModel):
    interest: str


# Check whether student has completed Interest+
@router.get("/{student_id}/interests/status")
def get_interest_status(
    student_id: str,
    db: Session = Depends(get_db)
):

    interests = (
        db.query(StudentInterest)
        .filter(StudentInterest.student_id == student_id)
        .all()
    )

    if not interests:
        return {
            "student_id": student_id,
            "completed": False,
            "interests": []
        }

    return {
        "student_id": student_id,
        "completed": True,
        "interests": [
            {
                "interest": interest.interest,
                "status": interest.status
            }
            for interest in interests
        ]
    }


# Save a new interest
@router.post("/{student_id}/interests")
def add_interest(
    student_id: str,
    interest_data: InterestRequest,
    db: Session = Depends(get_db)
):

    new_interest = StudentInterest(
        student_id=student_id,
        interest=interest_data.interest,
        status="active"
    )

    db.add(new_interest)
    db.commit()
    db.refresh(new_interest)

    return {
        "message": "Interest saved successfully",
        "student_id": student_id,
        "interest": new_interest.interest,
        "status": new_interest.status
    }
class AnswerRequest(BaseModel):
    interest: str
    question: str
    answer: str
    question_order: int


@router.post("/{student_id}/interest-session/answer")
def save_answer(
    student_id: str,
    answer_data: AnswerRequest,
    db: Session = Depends(get_db)
):

    new_answer = QuizAnswer(
        student_id=student_id,
        interest=answer_data.interest,
        question=answer_data.question,
        answer=answer_data.answer,
        question_order=answer_data.question_order
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    return {
        "message": "Answer saved successfully",
        "student_id": student_id,
        "interest": answer_data.interest,
        "question_order": answer_data.question_order
    }