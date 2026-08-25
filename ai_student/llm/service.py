import json

from ai_student.llm.client import client
from ai_student.llm.schemas import InterestAnalysis


def generate_interest_analysis(
    system_prompt: str,
    user_prompt: str,
    thinking: bool = False,
    reasoning_effort: str = "medium"
) -> InterestAnalysis:

    response = client.chat.completions.create(
        model="qwen3.6",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        max_tokens=1500,
        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": thinking,
                "reasoning_effort": reasoning_effort
            }
        }
    )

    content = response.choices[0].message.content

    # Remove markdown code fences if Qwen adds them
    content = content.strip()

    if content.startswith("```"):
        content = content.replace("```json", "", 1)
        content = content.replace("```", "", 1)
        content = content.strip()

    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"LLM did not return valid JSON.\n\nResponse:\n{content}"
        ) from e

    try:
        return InterestAnalysis.model_validate(data)
    except Exception as e:
        raise ValueError(
            f"LLM output does not match InterestAnalysis schema.\n\n"
            f"Data:\n{data}"
        ) from e