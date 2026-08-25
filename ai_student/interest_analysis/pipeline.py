from ai_student.quiz.schemas import QuizSession
from ai_student.interest_analysis.analyzer import analyze_interest
from ai_student.llm.schemas import InterestAnalysis


def run_interest_pipeline(
    session: QuizSession,
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
) -> InterestAnalysis:

    # --------------------------------------------------------
    # 1. Quiz must be completed
    # --------------------------------------------------------

    if not session.completed:
        raise ValueError(
            "Interest analysis cannot start before the quiz is completed."
        )

    # --------------------------------------------------------
    # 2. Convert QuizAnswer objects → dictionaries
    # --------------------------------------------------------

    answers = [
        answer.model_dump()
        for answer in session.answers
    ]

    # --------------------------------------------------------
    # 3. Send completed quiz to interest analyzer
    # --------------------------------------------------------

    result = analyze_interest(
        interest=session.interest,
        answers=answers,
        existing_skills=existing_skills or [],
        previous_interests=previous_interests or [],
    )

    return result