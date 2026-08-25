from ai_student.llm.schemas import (
    InterestAnalysisInput,
    InterestAnalysis
)


input_data = InterestAnalysisInput(
    interest="public_speaking",
    answers=[
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
        }
    ],
    existing_skills=[
        "communication",
        "debate"
    ],
    previous_interests=[]
)


result = InterestAnalysis(
    interest="public_speaking",
    interest_score=100,
    confidence_score=40,
    experience_score=25,
    capability_score=45,
    strengths=[
        "Persuasion",
        "Communication",
        "Debate"
    ],
    skill_gaps=[
        "Confidence",
        "Improvisation",
        "Non-verbal communication"
    ],
    potential_directions=[
        "Public Relations",
        "Event Hosting",
        "Marketing"
    ],
    next_steps=[
        "Participate in debate activities",
        "Practice impromptu speaking",
        "Take part in presentations"
    ],
    evidence=[
        "Participated in MUN",
        "Enjoyed convincing others",
        "Reported high interest"
    ],
    summary=(
        "The student has strong interest in public speaking "
        "but has relatively low confidence and limited experience."
    )
)


print("INPUT:")
print(input_data.model_dump_json(indent=2))

print("\nOUTPUT:")
print(result.model_dump_json(indent=2))