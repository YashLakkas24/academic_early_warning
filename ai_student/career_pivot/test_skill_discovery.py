from ai_student.llm.service import (
    generate_direction_discovery,
    generate_skill_discovery,
)


interest = "gaming development"

previous_interests = [
    "data analytics"
]

existing_skills = [
    "python",
    "problem solving",
    "communication",
]

interest_analysis = {
    "interest_score": 90,
    "confidence_score": 60,
    "experience_score": 30,
    "capability_score": 55,
    "strengths": [
        "Python",
        "Problem solving",
        "Analytical thinking",
    ],
    "skill_gaps": [
        "Game development experience",
    ],
    "evidence": [
        "Student previously explored data analytics.",
        "Student currently wants to explore gaming development.",
    ],
    "summary": (
        "Student is exploring gaming development "
        "after previous interest in data analytics."
    ),
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


print("\n")
print("=" * 60)
print("STAGE 1 — DIRECTION DISCOVERY")
print("=" * 60)

for direction in direction_result.directions:
    print(
        f"\n{direction.name}"
        f" | Fit: {direction.fit_score}"
    )
    print(f"Reason: {direction.reason}")


# ============================================================
# STAGE 2 — SKILL DISCOVERY FOR EACH DIRECTION
# ============================================================

print("\n")
print("=" * 60)
print("STAGE 2 — SKILL DISCOVERY")
print("=" * 60)


for direction in direction_result.directions:

    print(f"\n\nDIRECTION: {direction.name}")
    print("-" * 60)

    skill_result = generate_skill_discovery(
        direction=direction.name,
        interest=interest,
        previous_interests=previous_interests,
        existing_skills=existing_skills,
        interest_analysis=interest_analysis,
    )

    for skill in skill_result.skills:
        print(
            f"\nSkill: {skill.skill}"
            f"\nImportance: {skill.importance}"
            f"\nRequired Level: {skill.required_level}"
            f"\nReason: {skill.reason}"
        )