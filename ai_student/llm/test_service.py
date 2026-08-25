from ai_student.llm.service import generate_interest_analysis
from ai_student.llm.prompts import INTEREST_ANALYSIS_SYSTEM_PROMPT


user_prompt = """
Analyze the following student's interest.

Interest:
public_speaking

Answers:
[
    {
        "question_id": "q1",
        "question": "How interested are you?",
        "answer": "5/5"
    },
    {
        "question_id": "q2",
        "question": "How confident are you?",
        "answer": "2/5"
    },
    {
        "question_id": "q3",
        "question": "Have you participated in related activities?",
        "answer": "MUN"
    },
    {
        "question_id": "q4",
        "question": "What did you enjoy about the experience?",
        "answer": "I enjoyed arguing my country's position and convincing other people."
    }
]

Existing skills:
[
    "communication",
    "debate"
]

Previous interests:
[]
"""


result = generate_interest_analysis(
    system_prompt=INTEREST_ANALYSIS_SYSTEM_PROMPT,
    user_prompt=user_prompt,
    thinking=False
)

print("\nAI RESULT:\n")
print(result.model_dump_json(indent=2))