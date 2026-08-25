QUESTION_ORDER = [
    "interest_level",
    "confidence",
    "experience",
    "experience_detail",
    "motivation",
    "development_goal",
]


def choose_next_question(answers: dict):
    """
    Choose the next question based on the information
    already collected.
    """

    # 1. Always establish interest first.
    if "interest_level" not in answers:
        return "interest_level"

    # 2. If interest is very low, further exploration
    # may not be useful.
    if answers["interest_level"] <= 2:
        return None

    # 3. Confidence helps distinguish interest from
    # current self-perceived ability.
    if "confidence" not in answers:
        return "confidence"

    # 4. Experience helps understand practical exposure.
    if "experience" not in answers:
        return "experience"

    # 5. If the student has experience, ask about it.
    if answers["experience"] != "Never":
        if "experience_detail" not in answers:
            return "experience_detail"

    # 6. Understand intrinsic motivation.
    if "motivation" not in answers:
        return "motivation"

    # 7. If confidence is low, understand the
    # student's development goal.
    if answers["confidence"] <= 2:
        if "development_goal" not in answers:
            return "development_goal"

    return None