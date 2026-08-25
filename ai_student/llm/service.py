import json

from ai_student.llm.client import client
from ai_student.llm.schemas import (
    GeneratedQuestion,
    InterestAnalysis,
)
from ai_student.llm.prompts import (
    ADAPTIVE_QUESTION_SYSTEM_PROMPT,
)
from ai_student.quiz.question_engine import validate_question


# ============================================================
# ADAPTIVE QUESTION GENERATION
# ============================================================

def generate_next_question(
    interest: str,
    conversation: list[dict],
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
) -> GeneratedQuestion | None:
    """
    Ask Qwen to generate the next adaptive question.

    Returns:
        GeneratedQuestion
        or None when the AI decides the quiz is complete.
    """

    existing_skills = existing_skills or []
    previous_interests = previous_interests or []

    user_prompt = f"""
Student interest:
{interest}

Existing skills:
{existing_skills}

Previous interests:
{previous_interests}

Previous questions and answers:
{json.dumps(conversation, indent=2)}

Generate the next question based on the information
already collected.

Remember:

- Do not repeat previous questions.
- Ask only ONE question.
- Adapt the question based on previous answers.
- Use options only when appropriate.
- Text questions must not have options.
- If enough information has been collected,
  return {{"completed": true}}.
"""

    response = client.chat.completions.create(
        model="qwen3.6",
        messages=[
            {
                "role": "system",
                "content": ADAPTIVE_QUESTION_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        max_tokens=800,
        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": False,
                "reasoning_effort": "medium",
            }
        },
    )

    content = response.choices[0].message.content.strip()

    # --------------------------------------------------------
    # Remove markdown fences if the model adds them
    # --------------------------------------------------------

    if content.startswith("```"):
        content = content.replace("```json", "", 1)
        content = content.replace("```", "", 1)
        content = content.strip()

    # --------------------------------------------------------
    # Parse JSON
    # --------------------------------------------------------

    try:
        data = json.loads(content)

    except json.JSONDecodeError as e:
        raise ValueError(
            "LLM did not return valid JSON.\n\n"
            f"Response:\n{content}"
        ) from e

    # --------------------------------------------------------
    # Check completion
    # --------------------------------------------------------

    if data.get("completed") is True:
        return None

    # --------------------------------------------------------
    # Validate generated question schema
    # --------------------------------------------------------

    try:
        question = GeneratedQuestion.model_validate(data)

    except Exception as e:
        raise ValueError(
            "LLM output does not match GeneratedQuestion schema.\n\n"
            f"Data:\n{data}"
        ) from e

    # --------------------------------------------------------
    # Validate question rules
    # --------------------------------------------------------

    return validate_question(question)


# ============================================================
# FINAL INTEREST ANALYSIS
# ============================================================

def generate_interest_analysis(
    system_prompt: str,
    user_prompt: str,
    thinking: bool = False,
    reasoning_effort: str = "medium",
) -> InterestAnalysis:

    response = client.chat.completions.create(
        model="qwen3.6",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        max_tokens=1500,
        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": thinking,
                "reasoning_effort": reasoning_effort,
            }
        },
    )

    content = response.choices[0].message.content.strip()

    # --------------------------------------------------------
    # Remove markdown fences
    # --------------------------------------------------------

    if content.startswith("```"):
        content = content.replace("```json", "", 1)
        content = content.replace("```", "", 1)
        content = content.strip()

    # --------------------------------------------------------
    # Parse JSON
    # --------------------------------------------------------

    try:
        data = json.loads(content)

    except json.JSONDecodeError as e:
        raise ValueError(
            "LLM did not return valid JSON.\n\n"
            f"Response:\n{content}"
        ) from e

    # --------------------------------------------------------
    # Validate final analysis
    # --------------------------------------------------------

    try:
        return InterestAnalysis.model_validate(data)

    except Exception as e:
        raise ValueError(
            "LLM output does not match InterestAnalysis schema.\n\n"
            f"Data:\n{data}"
        ) from e