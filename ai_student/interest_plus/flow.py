from ai_student.quiz.schemas import QuizSession, QuizAnswer

from ai_student.llm.service import generate_next_question

from ai_student.interest_analysis.pipeline import (
    run_interest_pipeline,
)

MAX_QUESTIONS = 5


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

    # ========================================================
    # GET NEXT QUESTION
    # ========================================================

    def get_next_question(self):
        """
        Ask the LLM to generate the next question based on
        the selected interest and all previous answers.

        Gemini decides: 
        - what to ask 
        - what information is missing 
        - which topic to explore
        - question type 
        - options 
        - whether enough information has been collected
        Python only enforces the hard maximum of 5 questions.
        """
    # ---------------------------------------------------- 
    # HARD LIMIT: maximum 5 questions 
    # ----------------------------------------------------
        question_count = len(self.session.answers) 
        if question_count >= MAX_QUESTIONS: 
            self.session.completed = True
            return None

        # ----------------------------------------------------
        # Build conversation from all previous answers 
        # ----------------------------------------------------
        conversation = [
            {
                "question_id": answer.question_id,
                "question": answer.question,
                "answer": answer.answer,
            }
            for answer in self.session.answers
        ]

        generated_question = generate_next_question(
            interest=self.session.interest,
            conversation=conversation,
            existing_skills=self.existing_skills,
            previous_interests=self.previous_interests,
        )

        # ----------------------------------------------------
        # Quiz completed
        # ----------------------------------------------------

        if generated_question is None:

            self.session.completed = True

            return None
            

        # ----------------------------------------------------
        # Return generated question
        # ----------------------------------------------------

        return generated_question

    # ========================================================
    # SUBMIT ANSWER
    # ========================================================

    def submit_answer(
        self,
        question_id: str,
        question: str,
        answer,
    ):
        """
        Save the student's answer and generate the
        next adaptive question.

        Maximum questions = 5.
        """

        # ----------------------------------------------------
        # 1. Save answer
        # ----------------------------------------------------

        self.session.answers.append(
            QuizAnswer(
                question_id=question_id,
                question=question,
                answer=answer,
            )
        )
        
        # ----------------------------------------------------
        # 2. Generate next question
        # ----------------------------------------------------
        question_count = len(self.session.answers) 
        if question_count >= MAX_QUESTIONS:
            self.session.completed = True
            result = run_interest_pipeline(
                session=self.session,
                existing_skills=self.existing_skills,
                previous_interests=self.previous_interests,
            )
            return {
                "completed": True,
                "next_question": None,
                "result": result.model_dump(),
            }

        # ----------------------------------------------------
        # 3. Ask Gemini for the next adaptive question
        # ----------------------------------------------------
        next_question = self.get_next_question()

        # ----------------------------------------------------
        # 4. Quiz completed
        # ----------------------------------------------------

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
                "result": result.model_dump(),
            }
        # ----------------------------------------------------
        # 5. Quiz continues
        # ----------------------------------------------------

        return {
            "completed": False,
            "next_question": next_question.model_dump(),
            "result": None,
        }