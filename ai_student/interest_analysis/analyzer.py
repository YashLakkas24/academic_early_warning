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
    # 1. Send the COMPLETE adaptive conversation to the LLM
    # --------------------------------------------------------

    user_prompt = f"""
Analyze the following student's interest.

Interest:
{interest}

Adaptive Questions and Answers:
{answers}

Existing skills:
{existing_skills}

Previous interests:
{previous_interests}

IMPORTANT:

The questions were generated dynamically by an adaptive
question-generation system.

Therefore, DO NOT assume that specific question IDs such as
"interest_level", "confidence", or "experience" exist.

Use the actual questions and answers provided above.

Your analysis must be based only on the information available
in the student's responses and profile.

Analyze:

- interest strength
- confidence
- practical experience
- current capability
- strengths
- skill gaps
- potential directions
- next steps
- evidence
- summary

IMPORTANT DISTINCTION:

Interest is NOT the same as capability.

A student may have very high interest but low experience
or confidence. This should be treated as a development
opportunity, not as evidence that the student is unsuitable.

Do not invent information that is not present in the input.
"""

    # --------------------------------------------------------
    # 2. Ask Qwen for qualitative analysis
    # --------------------------------------------------------

    result = generate_interest_analysis(
        system_prompt=INTEREST_ANALYSIS_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        thinking=False,
    )

    # --------------------------------------------------------
    # 3. Return validated AI analysis
    # --------------------------------------------------------

    return result