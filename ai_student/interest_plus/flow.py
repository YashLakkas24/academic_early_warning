from ai_student.quiz.schemas import QuizSession, QuizAnswer
from ai_student.quiz.adaptive_logic import choose_next_question
from ai_student.interest_analysis.pipeline import run_interest_pipeline


class InterestPlusFlow:

    def __init__(
        self,
        interest: str,
        existing_skills: list[str] | None = None,
        previous_interests: list[str] | None = None,
    ):
        self.session = QuizSession(
            interest=interest
        )

        self.existing_skills = existing_skills or []
        self.previous_interests = previous_interests or []

    def get_next_question(self):
        """
        Return the next question based on the answers collected so far.
        """

        answers = {
            answer.question_id: answer.answer
            for answer in self.session.answers
        }

        question_id = choose_next_question(answers)

        if question_id is None:
            self.session.completed = True
            return None

        return question_id

    def submit_answer(
        self,
        question_id: str,
        question: str,
        answer
    ):
        """
        Save the student's answer and continue the Interest+ flow.

        If the quiz is complete, automatically run the
        interest analysis pipeline.
        """

        # ---------------------------------------------
        # 1. Save answer
        # ---------------------------------------------

        self.session.answers.append(
            QuizAnswer(
                question_id=question_id,
                question=question,
                answer=answer
            )
        )

        # ---------------------------------------------
        # 2. Check what question comes next
        # ---------------------------------------------

        next_question = self.get_next_question()

        # ---------------------------------------------
        # 3. Quiz completed
        # ---------------------------------------------

        if next_question is None:

            self.session.completed = True

            result = run_interest_pipeline(
                session=self.session,
                existing_skills=self.existing_skills,
                previous_interests=self.previous_interests,
            )

            return {
                "completed": True,
                "next_question": None,
                "result": result,
            }

        # ---------------------------------------------
        # 4. Quiz continues
        # ---------------------------------------------

        return {
            "completed": False,
            "next_question": next_question,
            "result": None,
        }