from ai_student.llm.schemas import GeneratedQuestion


ALLOWED_RESPONSE_TYPES = {
    "scale",
    "single_choice",
    "multiple_choice",
    "text",
}


def validate_question(
    question: GeneratedQuestion
) -> GeneratedQuestion:
    """
    Validate an LLM-generated question before it
    is sent to the frontend.
    """

    if question.completed:
        return question

    if question.response_type not in ALLOWED_RESPONSE_TYPES:
        raise ValueError(
            f"Invalid response type: {question.response_type}"
        )

    # Text questions don't need options.
    if question.response_type == "text":
        question.options = None

    # Structured questions must have options.
    else:
        if not question.options:
            raise ValueError(
                f"Options are required for "
                f"{question.response_type} questions."
            )

    return question