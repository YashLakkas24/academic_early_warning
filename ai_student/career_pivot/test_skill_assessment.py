from ai_student.llm.service import (
    generate_direction_discovery,
    generate_skill_discovery,
    generate_skill_assessment,
)


# ============================================================
# STUDENT INPUT
# ============================================================

interest = "gaming development"

previous_interests = [
    "data analytics"
]

existing_skills = [
    "python",
    "problem solving",
    "communication"
]

interest_analysis = {
    "interest_score": 90,
    "confidence_score": 60,
    "experience_score": 30,
    "capability_score": 55,

    "strengths": [
        "Python",
        "Problem solving",
        "Analytical thinking"
    ],

    "skill_gaps": [
        "Game development experience"
    ],

    "evidence": [
        "Student has Python experience.",
        "Student previously explored data analytics.",
        "Student currently wants to explore gaming development."
    ],

    "summary": (
        "Student is exploring gaming development "
        "after previous interest in data analytics."
    )
}


# ============================================================
# STAGE 1 — DIRECTION DISCOVERY
# ============================================================

direction_result = generate_direction_discovery(
    interest=interest,
    existing_skills=existing_skills,
    previous_interests=previous_interests,
    interest_analysis=interest_analysis,
)


print()
print("=" * 60)
print("STAGE 1 — DIRECTION DISCOVERY")
print("=" * 60)
print()

for direction in direction_result.directions:

    print(f"Direction: {direction.name}")
    print(f"Fit: {direction.fit_score}")
    print(f"Reason: {direction.reason}")
    print()


# ============================================================
# STAGE 2 + STAGE 3
# ============================================================

print("=" * 60)
print("STAGE 2 + STAGE 3 — SKILL PIPELINE")
print("=" * 60)


for direction in direction_result.directions:

    # ========================================================
    # CURRENT DIRECTION
    # ========================================================

    print()
    print("=" * 60)
    print(f"DIRECTION: {direction.name}")
    print("=" * 60)


    # ========================================================
    # STAGE 2 — SKILL DISCOVERY
    # ========================================================

    skill_result = generate_skill_discovery(
        direction=direction.name,

        interest=interest,

        previous_interests=previous_interests,

        existing_skills=existing_skills,

        interest_analysis=interest_analysis,
    )


    print()
    print("STAGE 2 — SKILL DISCOVERY")
    print("-" * 60)


    for skill in skill_result.skills:

        print(f"Skill: {skill.skill}")

        print(
            f"Importance: {skill.importance}"
        )

        print(
            f"Required Level: {skill.required_level}"
        )

        print(
            f"Reason: {skill.reason}"
        )

        print()


    # ========================================================
    # STAGE 3 — SKILL ASSESSMENT
    # ========================================================

    # IMPORTANT:
    #
    # Stage 3 receives ONLY the skills discovered
    # by Stage 2 for THIS direction.
    #
    # No predefined skill list.
    #
    # Stage 2 → Stage 3
    #

    skills = [
        skill.skill
        for skill in skill_result.skills
    ]


    assessment_result = generate_skill_assessment(
        direction=direction.name,

        skills=skills,

        interest=interest,

        previous_interests=previous_interests,

        existing_skills=existing_skills,

        interest_analysis=interest_analysis,
    )


    print()
    print("STAGE 3 — SKILL ASSESSMENT")
    print("-" * 60)


    for assessment in assessment_result.skill_assessments:

        print(
            f"Skill: {assessment.skill}"
        )

        print(
            f"Current Level: "
            f"{assessment.current_level}"
        )

        print(
            f"Assessment Basis: "
            f"{assessment.assessment_basis}"
        )

        print(
            f"Confidence: "
            f"{assessment.confidence}"
        )

        print(
            f"Evidence: "
            f"{assessment.evidence}"
        )

        print()


# ============================================================
# END
# ============================================================

print()
print("=" * 60)
print("STAGE 1 → STAGE 2 → STAGE 3 COMPLETE")
print("=" * 60)