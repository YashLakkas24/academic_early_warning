from ai_student.quiz.schemas import QuizSession, QuizAnswer
from ai_student.interest_analysis.pipeline import run_interest_pipeline


session = QuizSession(
    interest="public_speaking",

    answers=[
        QuizAnswer(
            question_id="interest_level",
            question="How interested are you in public speaking?",
            answer="5/5"
        ),

        QuizAnswer(
            question_id="confidence",
            question="How confident are you?",
            answer="2/5"
        ),

        QuizAnswer(
            question_id="experience",
            question="How much experience do you have in public speaking?",
            answer="once"
        ),
        
        QuizAnswer(
            question_id="experience_detail",
            question="What related activities have you participated in?",
            answer="MUN"
        ),

        QuizAnswer(
            question_id="experience_detail",
            question="What did you enjoy about the experience?",
            answer="I enjoyed arguing my country's position and convincing other people."
        ),

        QuizAnswer(
            question_id="motivation",
            question="What interests you about public speaking?",
            answer="I enjoy convincing people and presenting arguments."
        ),

        QuizAnswer(
            question_id="development_goal",
            question="What would you like to improve?",
            answer="I want to become more confident."
        ),
    ],

    completed=True
)


result = run_interest_pipeline(
    session=session,
    existing_skills=[
        "communication",
        "debate"
    ],
    previous_interests=[]
)


print("\nINTEREST+ PIPELINE RESULT\n")
print(result.model_dump_json(indent=2))