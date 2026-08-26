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


MAX_QUESTIONS = 5


# ============================================================
# ADAPTIVE QUESTION GENERATION
# ============================================================

def generate_next_question(
    interest: str,
    conversation: list[dict],
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
) -> GeneratedQuestion | None:

    existing_skills = existing_skills or []
    previous_interests = previous_interests or []

    # --------------------------------------------------------
    # NEVER generate Q6
    # --------------------------------------------------------

    if len(conversation) >= MAX_QUESTIONS:
        return None

    question_number = len(conversation) + 1

    # --------------------------------------------------------
    # Tell AI exactly how much information remains
    # --------------------------------------------------------

    user_prompt = f"""
Student interest:
{interest}

Existing skills:
{existing_skills}

Previous interests:
{previous_interests}

Previous questions and answers:
{json.dumps(conversation, indent=2)}

Current question number:
{question_number}

Maximum questions:
{MAX_QUESTIONS}

You MUST collect enough information within exactly 5 questions.

The assessment should understand:

1. Interest level
2. Practical experience
3. Confidence
4. Motivation / strengths
5. Development needs / relevant skills

IMPORTANT:

- Ask exactly ONE question.
- Do NOT repeat previous questions.
- Adapt the question based on previous answers.
- Make each question useful for the final analysis.
- Prefer scale, single_choice, or multiple_choice when appropriate.
- Use text only when a detailed answer is genuinely useful.
- Do NOT ask unnecessary questions.
- Do NOT finish the assessment before question 5.
- Question 5 MUST collect the final information needed for analysis.
- After question 5, the application will automatically perform the analysis.
- Therefore, NEVER return {{"completed": true}} before question 5.

For question {question_number}, return:

{{
    "completed": false,
    "question_id": "...",
    "question": "...",
    "response_type": "...",
    "options": [...]
}}

Return ONLY valid JSON.
Do not use markdown.
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
    # IMPORTANT:
    # Ignore completed=true before Q5
    # --------------------------------------------------------

    if data.get("completed") is True:

        if question_number < MAX_QUESTIONS:
            raise ValueError(
                f"LLM tried to finish the quiz after "
                f"{question_number} questions. "
                f"The quiz requires exactly {MAX_QUESTIONS} questions."
            )

        return None

    # --------------------------------------------------------
    # Validate generated question
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