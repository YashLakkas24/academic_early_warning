from ai_student.interest_plus.flow import InterestPlusFlow


flow = InterestPlusFlow(
    interest="public_speaking",
    existing_skills=[
        "communication",
        "debate"
    ],
    previous_interests=[]
)


print("\nINTEREST+ FLOW\n")


# ---------------------------------------------
# Question 1
# ---------------------------------------------

question = flow.get_next_question()

print("Question:", question)


# ---------------------------------------------
# Submit answers
# ---------------------------------------------

answers = {
    "interest_level": 5,
    "confidence": 2,
    "experience": "Once",
    "experience_detail": (
        "I participated in MUN and enjoyed arguing "
        "my country's position and convincing other people."
    ),
    "motivation": (
        "I enjoy persuading people and presenting arguments."
    ),
    "development_goal": (
        "I want to become more confident."
    )
}


# ---------------------------------------------
# Simulate the complete student interaction
# ---------------------------------------------

question_texts = {
    "interest_level": "How interested are you?",
    "confidence": "How confident are you?",
    "experience": "Have you participated in related activities?",
    "experience_detail": "Tell us about your experience.",
    "motivation": "What do you enjoy about this area?",
    "development_goal": "What would you like to improve?"
}


for question_id, answer in answers.items():

    result = flow.submit_answer(
        question_id=question_id,
        question=question_texts[question_id],
        answer=answer
    )

    print(
        f"\nAnswered: {question_id}"
    )

    print(
        "Completed:",
        result["completed"]
    )

    print(
        "Next question:",
        result["next_question"]
    )

    if result["completed"]:

        print("\nFINAL INTEREST ANALYSIS:\n")

        print(
            result["result"].model_dump_json(indent=2)
        )

        break