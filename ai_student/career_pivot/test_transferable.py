import json

from ai_student.llm.service import (
    generate_direction_discovery,
    generate_skill_discovery,
    generate_skill_assessment,
    generate_transferable_skills,
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

print()
print("=" * 60)
print("STAGE 1 — DIRECTION DISCOVERY")
print("=" * 60)
print()

direction_result = generate_direction_discovery(
    interest=interest,
    existing_skills=existing_skills,
    previous_interests=previous_interests,
    interest_analysis=interest_analysis,
)

for direction in direction_result.directions:

    print(f"Direction: {direction.name}")
    print(f"Fit: {direction.fit_score}")
    print(f"Reason: {direction.reason}")
    print()


# ============================================================
# CONNECTED PIPELINE
# STAGE 2 → STAGE 3 → STAGE 4
# FOR EACH DIRECTION
# ============================================================

final_results = []


for direction in direction_result.directions:

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
        print(f"Importance: {skill.importance}")
        print(f"Required Level: {skill.required_level}")
        print(f"Reason: {skill.reason}")
        print()


    # ========================================================
    # STAGE 3 — SKILL ASSESSMENT
    # ========================================================

    # IMPORTANT:
    # Stage 3 receives ONLY the skills discovered
    # for THIS direction by Stage 2.

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

        print(f"Skill: {assessment.skill}")
        print(f"Current Level: {assessment.current_level}")
        print(f"Assessment Basis: {assessment.assessment_basis}")
        print(f"Confidence: {assessment.confidence}")
        print(f"Evidence: {assessment.evidence}")
        print()


    # ========================================================
    # STAGE 4 — TRANSFERABLE SKILLS
    # ========================================================

    # IMPORTANT:
    # Stage 4 receives:
    #
    # 1. ONLY this direction
    # 2. Stage 2 skills for this direction
    # 3. Stage 3 assessments for this direction
    #
    # It does NOT receive skills/assessments
    # from other directions.

    transferable_result = generate_transferable_skills(
        direction=direction.name,

        required_skills=[
            skill.model_dump()
            for skill in skill_result.skills
        ],

        skill_assessments=[
            assessment.model_dump()
            for assessment
            in assessment_result.skill_assessments
        ],

        existing_skills=existing_skills,

        previous_interests=previous_interests,

        interest_analysis=interest_analysis,
    )

    print()
    print("STAGE 4 — TRANSFERABLE SKILLS")
    print("-" * 60)

    for transferable in transferable_result.transferable_skills:

        print(f"Skill: {transferable.skill}")
        print(f"Source: {transferable.source}")
        print(f"Relevance: {transferable.relevance}")
        print(f"Explanation: {transferable.explanation}")
        print()


    # ========================================================
    # STORE COMPLETE RESULT FOR THIS DIRECTION
    # ========================================================

    final_results.append(
        {
            "direction": direction.name,

            "skills": [
                skill.model_dump()
                for skill in skill_result.skills
            ],

            "skill_assessments": [
                assessment.model_dump()
                for assessment
                in assessment_result.skill_assessments
            ],

            "transferable_skills": [
                transferable.model_dump()
                for transferable
                in transferable_result.transferable_skills
            ],
        }
    )


# ============================================================
# FINAL CONNECTED RESULT
# ============================================================

print()
print("=" * 60)
print("FINAL CONNECTED CAREER PIVOT RESULT")
print("=" * 60)
print()

print(
    json.dumps(
        final_results,
        indent=2
    )
)