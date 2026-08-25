from ai_student.interest_analysis.analyzer import analyze_interest


answers = [
    {
        "question_id": "interest_level",
        "question": "How interested are you in this area?",
        "answer": "5/5"
    },
    {
        "question_id": "confidence",
        "question": "How confident are you in your current ability?",
        "answer": "2/5"
    },
    {
        "question_id": "experience",
        "question": "How frequently have you participated in related activities?",
        "answer": "once"
    },
    {
        "question_id": "experience_detail",
        "question": "What activity did you participate in?",
        "answer": "Model United Nations (MUN)"
    },
    {
        "question_id": "motivation",
        "question": "What did you enjoy about the experience?",
        "answer": "I enjoyed arguing my country's position and convincing other people."
    },
    {
        "question_id": "development_goal",
        "question": "What would you like to improve?",
        "answer": "I want to become more confident."
    }
]


result = analyze_interest(
    interest="public_speaking",
    answers=answers,
    existing_skills=[
        "communication",
        "debate"
    ],
    previous_interests=[]
)


print("\nINTEREST ANALYSIS\n")
print(result.model_dump_json(indent=2))