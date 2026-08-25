from ai_student.llm.service import generate_interest_analysis
from ai_student.llm.prompts import INTEREST_ANALYSIS_SYSTEM_PROMPT
from ai_student.llm.schemas import InterestAnalysis

from ai_student.interest_analysis.scoring import (
    scale_1_to_5,
    calculate_experience_score,
)


def analyze_interest(
    interest: str,
    answers: list[dict],
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
) -> InterestAnalysis:

    existing_skills = existing_skills or []
    previous_interests = previous_interests or []

    # --------------------------------------------------------
    # 1. Find answers needed for deterministic scoring
    # --------------------------------------------------------

    interest_answer = None
    confidence_answer = None
    experience_answer = None

    for answer in answers:
        question_id = answer.get("question_id")

        if question_id == "interest_level":
            interest_answer = answer.get("answer")

        elif question_id == "confidence":
            confidence_answer = answer.get("answer")

        elif question_id == "experience":
            experience_answer = answer.get("answer")

    # --------------------------------------------------------
    # 2. Calculate objective scores using Python
    # --------------------------------------------------------

    if interest_answer is None:
        raise ValueError("Missing interest_level answer.")

    if confidence_answer is None:
        raise ValueError("Missing confidence answer.")

    if experience_answer is None:
        raise ValueError("Missing experience answer.")

    # Convert "5/5" → 5
    interest_value = int(str(interest_answer).split("/")[0])
    confidence_value = int(str(confidence_answer).split("/")[0])

    interest_score = scale_1_to_5(interest_value)
    confidence_score = scale_1_to_5(confidence_value)

    experience_score = calculate_experience_score(
        str(experience_answer)
    )

    # --------------------------------------------------------
    # 3. Ask Qwen for qualitative analysis
    # --------------------------------------------------------

    user_prompt = f"""
Analyze the following student's interest.

Interest:
{interest}

Answers:
{answers}

Existing skills:
{existing_skills}

Previous interests:
{previous_interests}

IMPORTANT:

The following scores have already been calculated
deterministically by the application:

interest_score = {interest_score}

confidence_score = {confidence_score}

experience_score = {experience_score}

Do NOT change these scores.

Use the student's answers and profile to analyze:

- strengths
- skill gaps
- potential directions
- next steps
- evidence
- summary
- capability_score

Capability should be based only on the evidence provided.
Do not assume capability from interest alone.
"""

    result = generate_interest_analysis(
        system_prompt=INTEREST_ANALYSIS_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        thinking=False
    )

    # --------------------------------------------------------
    # 4. Override Qwen's scores with our deterministic scores
    # --------------------------------------------------------

    result.interest_score = interest_score
    result.confidence_score = confidence_score
    result.experience_score = experience_score

    return result