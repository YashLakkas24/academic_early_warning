import json
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal

from models import (
    Student,
    StudentInterest,
    QuizAnswer,
    InterestAnalysis,
)

from ai_student.llm.service import generate_next_question

from ai_student.quiz.question_engine import validate_question

from ai_student.interest_analysis.analyzer import analyze_interest
router = APIRouter(
    prefix="/api/students",
    tags=["Interest+"]
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class InterestRequest(BaseModel):
    interest: str


class AnswerRequest(BaseModel):
    interest: str
    question_id: str
    question: str
    answer: Any
    question_order: int


# ============================================================
# CHECK INTEREST+ STATUS
# ============================================================

@router.get("/{student_id}/interests/status")
def get_interest_status(
    student_id: str,
    db: Session = Depends(get_db)
):

    interests = (
        db.query(StudentInterest)
        .filter(
            StudentInterest.student_id == student_id
        )
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


# ============================================================
# SAVE NEW INTEREST
# ============================================================

@router.post("/{student_id}/interests")
def add_interest(
    student_id: str,
    interest_data: InterestRequest,
    db: Session = Depends(get_db)
):

    # Check student exists
    student = (
        db.query(Student)
        .filter(
            Student.student_id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Check whether this interest already exists
    existing_interest = (
        db.query(StudentInterest)
        .filter(
            StudentInterest.student_id == student_id,
            StudentInterest.interest == interest_data.interest
        )
        .first()
    )


    if existing_interest:
        return {
            "message": "Interest already exists",
            "student_id": student_id,
            "interest": existing_interest.interest,
            "status": existing_interest.status
        }

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


# ============================================================
# START INTEREST+ SESSION
# ============================================================

@router.post("/{student_id}/interest-session/start")
def start_interest_session(
    student_id: str,
    interest_data: InterestRequest,
    reset: bool = False,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # 1. Check whether student exists
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.student_id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # --------------------------------------------------------
    # 2. Reset previous answers if requested
    # --------------------------------------------------------

    if reset:
        db.query(QuizAnswer).filter(
            QuizAnswer.student_id == student_id,
            QuizAnswer.interest == interest_data.interest
        ).delete()
        db.commit()

    # --------------------------------------------------------
    # 3. Ensure student interest record exists
    # --------------------------------------------------------

    existing_interest = (
        db.query(StudentInterest)
        .filter(
            StudentInterest.student_id == student_id,
            StudentInterest.interest == interest_data.interest
        )
        .first()
    )

    if not existing_interest:
        new_interest = StudentInterest(
            student_id=student_id,
            interest=interest_data.interest,
            status="active"
        )
        db.add(new_interest)
        db.commit()

    # --------------------------------------------------------
    # 4. Get previous answers for this interest
    # --------------------------------------------------------

    previous_answers = (
        db.query(QuizAnswer)
        .filter(
            QuizAnswer.student_id == student_id,
            QuizAnswer.interest == interest_data.interest
        )
        .order_by(
            QuizAnswer.question_order
        )
        .all()
    )

    # --------------------------------------------------------
    # 5. Build conversation for the AI safely
    # --------------------------------------------------------

    conversation = []
    for answer in previous_answers:
        try:
            parsed_answer = json.loads(answer.answer)
        except (json.JSONDecodeError, TypeError):
            parsed_answer = answer.answer

        conversation.append({
            "question_id": answer.question_id,
            "question": answer.question,
            "answer": parsed_answer
        })

    # --------------------------------------------------------
    # 6. Ask AI for the next question
    # --------------------------------------------------------

    question = generate_next_question(
        interest=interest_data.interest,
        conversation=conversation,
        existing_skills=[],
        previous_interests=[]
    )

    # --------------------------------------------------------
    # 7. AI says assessment is complete
    # --------------------------------------------------------

    if question is None:

        return {
            "completed": True,
            "question_number": len(conversation),
            "total_questions": 5,
            "next_question": None
        }

    # --------------------------------------------------------
    # 8. Validate AI-generated question
    # --------------------------------------------------------

    question = validate_question(question)

    return {
        "completed": False,
        "question_number": len(conversation) + 1,
        "total_questions": 5,
        "next_question": question.model_dump()
    }


# ============================================================
# SUBMIT ANSWER + GENERATE NEXT QUESTION
# ============================================================
@router.post("/{student_id}/interest-session/answer")
def submit_interest_answer(
    student_id: str,
    answer_data: AnswerRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # 1. Check student
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.student_id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # --------------------------------------------------------
    # 2. Save answer
    # --------------------------------------------------------

    new_answer = QuizAnswer(
        student_id=student_id,
        interest=answer_data.interest,
        question_id=answer_data.question_id,
        question=answer_data.question,
        answer=json.dumps(answer_data.answer),
        question_order=answer_data.question_order
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    # --------------------------------------------------------
    # 3. Get ALL answers for this interest
    # --------------------------------------------------------

    previous_answers = (
        db.query(QuizAnswer)
        .filter(
            QuizAnswer.student_id == student_id,
            QuizAnswer.interest == answer_data.interest
        )
        .order_by(
            QuizAnswer.question_order
        )
        .all()
    )

    question_count = len(previous_answers)

    # --------------------------------------------------------
    # 4. Build conversation
    # --------------------------------------------------------

    conversation = []

    for answer in previous_answers:

        try:
            parsed_answer = json.loads(answer.answer)
        except (json.JSONDecodeError, TypeError):
            parsed_answer = answer.answer

        conversation.append({
            "question_id": answer.question_id,
            "question": answer.question,
            "answer": parsed_answer
        })

    # ========================================================
    # 5. EXACTLY 5 QUESTIONS → FINAL ANALYSIS
    # ========================================================

    if question_count >= 5:

        analysis_result = analyze_interest(
            interest=answer_data.interest,
            answers=conversation,
            existing_skills=[],
            previous_interests=[]
        )

        # ----------------------------------------------------
        # Save analysis
        # ----------------------------------------------------

        analysis_record = InterestAnalysis(
            student_id=student_id,
            interest=analysis_result.interest,
            interest_score=analysis_result.interest_score,
            confidence_score=analysis_result.confidence_score,
            experience_score=analysis_result.experience_score,
            capability_score=analysis_result.capability_score,

            strengths=json.dumps(
                analysis_result.strengths
            ),

            skill_gaps=json.dumps(
                analysis_result.skill_gaps
            ),

            potential_directions=json.dumps(
                analysis_result.potential_directions
            ),

            next_steps=json.dumps(
                analysis_result.next_steps
            ),

            evidence=json.dumps(
                analysis_result.evidence
            ),

            summary=analysis_result.summary
        )

        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

        # ----------------------------------------------------
        # Return final analysis
        # ----------------------------------------------------

        return {
            "completed": True,
            "next_question": None,
            "message": "Interest+ assessment completed.",
            "analysis": analysis_result.model_dump()
        }

    # ========================================================
    # 6. LESS THAN 5 QUESTIONS → GET NEXT QUESTION
    # ========================================================

    next_question = generate_next_question(
        interest=answer_data.interest,
        conversation=conversation,
        existing_skills=[],
        previous_interests=[]
    )

    # --------------------------------------------------------
    # Safety check
    # --------------------------------------------------------

    if next_question is None:

        raise HTTPException(
            status_code=500,
            detail=(
                f"AI attempted to finish the assessment after "
                f"{question_count} questions. "
                f"The assessment requires 5 questions."
            )
        )

    # --------------------------------------------------------
    # Validate question
    # --------------------------------------------------------

    next_question = validate_question(next_question)

    return {
        "completed": False,
        "next_question": next_question.model_dump(),
        "result": None
    }
# ============================================================
# GET INTEREST ANALYSIS
# ============================================================

@router.get("/{student_id}/interest-analysis")
def get_interest_analysis(
    student_id: str,
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # 1. Check whether student exists
    # --------------------------------------------------------

    student = (
        db.query(Student)
        .filter(
            Student.student_id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # --------------------------------------------------------
    # 2. Get all interest analyses for this student
    # --------------------------------------------------------

    analyses = (
        db.query(InterestAnalysis)
        .filter(
            InterestAnalysis.student_id == student_id
        )
        .order_by(
            InterestAnalysis.id.desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # 3. No analysis found
    # --------------------------------------------------------

    if not analyses:
        return {
            "student_id": student_id,
            "has_analysis": False,
            "analyses": []
        }

    def parse_json_safely(val):
        if not val:
            return None
        try:
            return json.loads(val)
        except Exception:
            return val

    return {
        "student_id": student_id,
        "has_analysis": True,
        "analyses": [
            {
                "id": analysis.id,
                "interest": analysis.interest,
                "interest_score": analysis.interest_score,
                "confidence_score": analysis.confidence_score,
                "experience_score": analysis.experience_score,
                "capability_score": analysis.capability_score,
                "strengths": parse_json_safely(analysis.strengths),
                "skill_gaps": parse_json_safely(analysis.skill_gaps),
                "potential_directions": parse_json_safely(analysis.potential_directions),
                "next_steps": parse_json_safely(analysis.next_steps),
                "evidence": parse_json_safely(analysis.evidence),
                "summary": analysis.summary,
                "analysis": analysis.analysis or analysis.summary
            }
            for analysis in analyses
        ]
    }