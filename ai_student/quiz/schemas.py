from typing import Any

from pydantic import BaseModel, Field


# ============================================================
# QUIZ ANSWER
# ============================================================

class QuizAnswer(BaseModel):
    """
    A single answer provided by the student.
    """

    question_id: str = Field(
        description="Unique identifier of the question."
    )

    question: str = Field(
        description="The question shown to the student."
    )

    answer: Any = Field(
        description="The student's answer."
    )


# ============================================================
# QUIZ SESSION
# ============================================================

class QuizSession(BaseModel):
    """
    Current state of an interest-discovery session.
    """

    interest: str = Field(
        description="Interest currently being explored."
    )

    answers: list[QuizAnswer] = Field(
        default_factory=list,
        description="Answers collected during the session."
    )

    completed: bool = Field(
        default=False,
        description="Whether the adaptive quiz is complete."
    )
