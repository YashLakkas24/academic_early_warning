from fastapi import APIRouter
from pydantic import BaseModel
from typing import List


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Interest"]
)


class ConversationItem(BaseModel):
    question: str
    answer: str


class AIInterestRequest(BaseModel):
    student_id: str
    interest: str
    conversation: List[ConversationItem]


@router.post("/next-question")
def get_next_question(data: AIInterestRequest):

    # TEMPORARY RESPONSE
    # Later this will come from the actual AI model.

    return {
        "question": "How comfortable are you with programming?",
        "options": [
            "I have never programmed",
            "Beginner",
            "Intermediate",
            "Advanced"
        ],
        "is_final": False
    }