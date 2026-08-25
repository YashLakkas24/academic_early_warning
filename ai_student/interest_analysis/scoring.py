def scale_1_to_5(value: int) -> int:
    """
    Convert a 1-5 score into a 0-100 score.
    """

    if value < 1 or value > 5:
        raise ValueError("Score must be between 1 and 5.")

    return value * 20
def calculate_experience_score(experience: str) -> int:
    """
    Convert reported experience level into a score.
    """

    experience = experience.strip().lower()

    scores = {
        "never": 0,
        "once": 25,
        "occasionally": 50,
        "frequently": 75,
        "regularly": 100,
    }

    if experience not in scores:
        raise ValueError(
            f"Unknown experience level: {experience}"
        )

    return scores[experience]