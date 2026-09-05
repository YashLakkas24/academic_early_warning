from ai_student.career_pivot.pipeline import (
    discover_career_directions,
)


def main():

    print("\n")
    print("=" * 70)
    print("CAREER PIVOT — STAGE 1 TEST")
    print("=" * 70)

    # ---------------------------------------------------------
    # Simulated Interest Analysis
    # ---------------------------------------------------------

    interest_analysis = {
        "interest": "public_speaking",
        "interest_score": 88,
        "confidence_score": 50,
        "experience_score": 65,
        "capability_score": 70,

        "strengths": [
            "Communication and debate skills",
            "Experience participating in Model United Nations",
            "Persuasive argumentation",
        ],

        "skill_gaps": [
            "Impromptu speaking",
            "Responding to unexpected counter-arguments",
        ],

        "summary": (
            "The student shows strong interest in public speaking "
            "with some practical experience and room to improve "
            "spontaneous communication."
        ),
    }

    existing_skills = [
        "Python",
        "Communication",
        "Public Speaking",
        "Presentation",
        "Teamwork",
    ]

    previous_interests = [
        "technology",
        "communication",
        "public speaking",
    ]

    # ---------------------------------------------------------
    # DISCOVER 5 DIRECTIONS
    # ---------------------------------------------------------

    result = discover_career_directions(
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )

    # ---------------------------------------------------------
    # PRINT RESULT
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("FINAL DISCOVERED DIRECTIONS")
    print("=" * 70)

    print(f"\nNumber of directions: {len(result.directions)}")

    for index, direction in enumerate(
        result.directions,
        start=1,
    ):
        print("\n" + "-" * 50)
        print(f"Direction {index}")
        print(f"Name      : {direction.name}")
        print(f"Fit Score : {direction.fit_score}")
        print(f"Reason    : {direction.reason}")

    # ---------------------------------------------------------
    # VALIDATION
    # ---------------------------------------------------------

    if len(result.directions) != 5:
        raise AssertionError(
            f"Expected exactly 5 directions, "
            f"but received {len(result.directions)}"
        )

    print("\n")
    print("=" * 70)
    print("STAGE 1 TEST PASSED")
    print("Exactly 5 career directions were discovered.")
    print("=" * 70)


if __name__ == "__main__":
    main()

