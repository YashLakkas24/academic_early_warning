import json

from ai_student.llm.service import (
    generate_direction_discovery,
    generate_skill_discovery,
    generate_skill_assessment,
    generate_transferable_skills,
    generate_skill_gap_analysis,
)


# ============================================================
# STUDENT INPUT
# ============================================================

interest = "Gaming"

existing_skills = [
    "Python Programming",
    "Problem Solving",
    "Communication",
]

previous_interests = [
    "Data Analytics",
]

interest_analysis = {
    "interest_score": 85,
    "confidence_score": 75,
    "experience_score": 60,
    "capability_score": 80,
    "strengths": [
        "Analytical Thinking",
        "Problem Solving",
        "Python Programming",
    ],
    "skill_gaps": [],
    "potential_directions": [],
    "next_steps": [],
    "evidence": [
        "The student has Python programming experience.",
        "The student previously explored Data Analytics.",
        "The student has a strong interest in Gaming.",
    ],
    "summary": (
        "The student shows strong interest in gaming and has "
        "a Python and analytical background."
    ),
}


# ============================================================
# STAGE 1 — DIRECTION DISCOVERY
# ============================================================

print("\n")
print("=" * 60)
print("STAGE 1 — DIRECTION DISCOVERY")
print("=" * 60)

direction_result = generate_direction_discovery(
    interest=interest,
    existing_skills=existing_skills,
    previous_interests=previous_interests,
    interest_analysis=interest_analysis,
)


for direction in direction_result.directions:
    print(f"\nDirection: {direction.name}")
    print(f"Fit: {direction.fit_score}")
    print(f"Reason: {direction.reason}")


# ============================================================
# LOOP THROUGH EACH DIRECTION
# ============================================================

final_results = []


for direction in direction_result.directions:

    direction_name = direction.name

    print("\n")
    print("=" * 60)
    print(f"DIRECTION: {direction_name}")
    print("=" * 60)


    # ========================================================
    # STAGE 2 — SKILL DISCOVERY
    # ========================================================

    print("\nSTAGE 2 — SKILL DISCOVERY")
    print("-" * 60)

    skill_result = generate_skill_discovery(
        direction=direction_name,
        interest=interest,
        previous_interests=previous_interests,
        existing_skills=existing_skills,
        interest_analysis=interest_analysis,
    )


    for skill in skill_result.skills:
        print(f"\nSkill: {skill.skill}")
        print(f"Importance: {skill.importance}")
        print(f"Required Level: {skill.required_level}")
        print(f"Reason: {skill.reason}")


    # ========================================================
    # STAGE 3 — SKILL ASSESSMENT
    # ========================================================

    print("\n")
    print("STAGE 3 — SKILL ASSESSMENT")
    print("-" * 60)

    # IMPORTANT:
    # Pass ONLY the skills discovered for THIS direction.

    skill_assessment_result = generate_skill_assessment(
        direction=direction_name,
        skills=[skill.skill for skill in skill_result.skills],
        interest=interest,
        previous_interests=previous_interests,
        existing_skills=existing_skills,
        interest_analysis=interest_analysis,
    )


    for assessment in skill_assessment_result.skill_assessments:
        print(f"\nSkill: {assessment.skill}")
        print(f"Current Level: {assessment.current_level}")
        print(f"Assessment Basis: {assessment.assessment_basis}")
        print(f"Confidence: {assessment.confidence}")
        print(f"Evidence: {assessment.evidence}")


    # ========================================================
    # STAGE 4 — TRANSFERABLE SKILLS
    # ========================================================

    print("\n")
    print("STAGE 4 — TRANSFERABLE SKILLS")
    print("-" * 60)

    transferable_result = generate_transferable_skills(
        direction=direction_name,

        # Stage 2 skills for THIS direction
        required_skills=[
            skill.model_dump()
            for skill in skill_result.skills
        ],

        # Stage 3 assessments for THIS direction
        skill_assessments=[
            assessment.model_dump()
            for assessment in skill_assessment_result.skill_assessments
        ],

        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )


    for transferable in transferable_result.transferable_skills:
        print(f"\nSkill: {transferable.skill}")
        print(f"Source: {transferable.source}")
        print(f"Relevance: {transferable.relevance}")
        print(f"Explanation: {transferable.explanation}")


    # ========================================================
    # STAGE 5 — SKILL GAP
    # ========================================================

    print("\n")
    print("STAGE 5 — SKILL GAP ANALYSIS")
    print("-" * 60)

    skill_gap_result = generate_skill_gap_analysis(
        direction=direction_name,

        # Stage 2
        required_skills=[
            skill.model_dump()
            for skill in skill_result.skills
        ],

        # Stage 3
        skill_assessments=[
            assessment.model_dump()
            for assessment in skill_assessment_result.skill_assessments
        ],

        # Stage 4
        transferable_skills=[
            transferable.model_dump()
            for transferable in transferable_result.transferable_skills
        ],
    )


    for gap in skill_gap_result.skill_gaps:
        print(f"\nSkill: {gap.skill}")
        print(f"Current Level: {gap.current_level}")
        print(f"Required Level: {gap.required_level}")
        print(f"Status: {gap.status}")
        print(f"Explanation: {gap.explanation}")


    # ========================================================
    # STORE FINAL RESULT FOR THIS DIRECTION
    # ========================================================

    final_results.append(
        {
            "direction": direction_name,

            "skills": [
                skill.model_dump()
                for skill in skill_result.skills
            ],

            "skill_assessments": [
                assessment.model_dump()
                for assessment in skill_assessment_result.skill_assessments
            ],

            "transferable_skills": [
                transferable.model_dump()
                for transferable in transferable_result.transferable_skills
            ],

            "skill_gaps": [
                gap.model_dump()
                for gap in skill_gap_result.skill_gaps
            ],
        }
    )


# ============================================================
# FINAL CONNECTED RESULT
# ============================================================

print("\n")
print("=" * 60)
print("FINAL CONNECTED CAREER PIVOT RESULT")
print("=" * 60)

print(
    json.dumps(
        final_results,
        indent=2,
    )
)