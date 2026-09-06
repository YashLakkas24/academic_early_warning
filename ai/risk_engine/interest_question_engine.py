import json
import os

from openai import OpenAI

OPENAI_MODEL = "gpt-5-nano"

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


def generate_next_question(
    selected_interests,
    answers,
    current_interest,
):
    """
    Generate the next Interest+ question using the student's
    selected interests and previous answers.
    """

    if client is None:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    prompt = f"""
You are the adaptive question engine for a college Interest+ system.

Your job is to generate ONE useful question that helps understand:

1. Genuine interest
2. Current capability/readiness
3. Practical experience
4. What specifically attracts the student to the area

Do not judge or reject the student because of low capability.

Selected interests:
{selected_interests}

Current interest:
{current_interest}

Previous answers:
{json.dumps(answers, indent=2)}

Rules:

- Ask only ONE question.
- Do not repeat a question already answered.
- Adapt the question based on previous answers.
- If the student shows experience in an area, ask a deeper follow-up.
- If capability is low but interest is high, explore learning/readiness rather than rejecting the interest.
- Keep questions understandable for college students.
- Prefer multiple-choice questions.
- Use 3–5 options.
- Do not ask about sensitive personal information.

Return ONLY valid JSON in this exact format:

{{
  "question": "Question text",
  "subtitle": "Short explanation",
  "type": "single",
  "options": [
    {{"value": "option_1", "label": "Option 1"}},
    {{"value": "option_2", "label": "Option 2"}},
    {{"value": "option_3", "label": "Option 3"}}
  ],
  "is_final": false
}}
"""

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a precise adaptive education question engine. "
                    "Return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        timeout=30.0,
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError("AI returned an empty question.")

    try:
        result = json.loads(content)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"AI returned invalid JSON: {exc}")

    required_fields = [
        "question",
        "subtitle",
        "type",
        "options",
        "is_final",
    ]

    for field in required_fields:
        if field not in result:
            raise RuntimeError(f"AI question response missing field: {field}")

    return result
