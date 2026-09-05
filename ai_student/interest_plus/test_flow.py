import json
import time

from ai_student.interest_plus.flow import InterestPlusFlow
from ai_student.llm.schemas import GeneratedQuestion


flow = InterestPlusFlow(
    interest="public_speaking",
    existing_skills=[
        "communication",
        "debate"
    ],
    previous_interests=[]
)


print("\n")
print("=" * 60)
print("INTEREST+ ADAPTIVE FLOW")
print("=" * 60)


# ------------------------------------------------------------
# First question
# ------------------------------------------------------------

question = flow.get_next_question()


# ------------------------------------------------------------
# Simulated student answers
#
# IMPORTANT:
# No question IDs are hardcoded.
# The answer is given to whatever question
# the AI generated.
# ------------------------------------------------------------

simulated_answers = [
    5,
    2,
    ["MUN"],
    "I enjoyed arguing my country's position and convincing other people.",
    "I want to become more confident.",
    "Managing nerves and speaking confidently.",
    "I become nervous when speaking in front of a large audience.",
    "I would like guided practice and feedback."
]


answer_index = 0


while question is not None:

    print("\n")
    print("-" * 60)
    print("QUESTION")
    print("-" * 60)

    print("Question ID :", question.question_id)
    print("Question    :", question.question)
    print("Type        :", question.response_type)
    print("Options     :", question.options)

    # --------------------------------------------------------
    # Get simulated answer
    # --------------------------------------------------------

    if answer_index >= len(simulated_answers):

        print("\nNo more simulated answers.")
        print("Stopping test.")

        break

    answer = simulated_answers[answer_index]

    answer_index += 1

    print("Student Answer:", answer)

    # --------------------------------------------------------
    # Submit answer
    # --------------------------------------------------------

    result = flow.submit_answer(
        question_id=question.question_id,
        question=question.question,
        answer=answer
    )

    time.sleep(1)

    print("Completed:", result["completed"])

    # --------------------------------------------------------
    # QUIZ COMPLETED
    # --------------------------------------------------------

    if result["completed"]:

        print("\n")
        print("=" * 60)
        print("QUIZ COMPLETED")
        print("=" * 60)

        print("\nFINAL INTEREST ANALYSIS\n")

        print(
            json.dumps(
                result["result"],
                indent=2
            )
        )

        break

    # --------------------------------------------------------
    # Convert dictionary back into GeneratedQuestion
    # --------------------------------------------------------

    question = GeneratedQuestion.model_validate(
        result["next_question"]
    )