from ai_student.career_pivot.pipeline import (
    analyze_selected_direction,
)


def main():

    print("\n")
    print("=" * 70)
    print("CAREER PIVOT — STAGE 2 TEST")
    print("SELECTED DIRECTION ANALYSIS")
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

    # ---------------------------------------------------------
    # Existing Student Skills
    # ---------------------------------------------------------

    existing_skills = [
        "Python",
        "Communication",
        "Public Speaking",
        "Presentation",
        "Teamwork",
    ]

    # ---------------------------------------------------------
    # Previous Interests
    # ---------------------------------------------------------

    previous_interests = [
        "technology",
        "communication",
        "public speaking",
    ]

    # ---------------------------------------------------------
    # SELECT ONE DIRECTION
    # ---------------------------------------------------------
    # This should be ONE of the 5 directions discovered
    # in Stage 1.
    # ---------------------------------------------------------

    selected_direction = (
        "Developer Relations (DevRel) & Technical Evangelism"
    )

    print("\n")
    print("=" * 70)
    print("SELECTED DIRECTION")
    print("=" * 70)

    print(f"\n{selected_direction}")

    # ---------------------------------------------------------
    # RUN SELECTED DIRECTION ANALYSIS
    # ---------------------------------------------------------

    result = analyze_selected_direction(
        selected_direction=selected_direction,
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )

    # ---------------------------------------------------------
    # PRINT FINAL RESULT
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("FINAL CAREER DIRECTION ANALYSIS")
    print("=" * 70)

    print(f"\nDirection:")
    print(result.direction)

    # ---------------------------------------------------------
    # REQUIRED SKILLS
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("REQUIRED SKILLS")
    print("=" * 70)

    print(
        f"\nTotal required skills: "
        f"{len(result.required_skills)}"
    )

    for skill in result.required_skills:
        print(
            f"\n- {skill.skill}"
            f"\n  Importance: {skill.importance}"
            f"\n  Required Level: {skill.required_level}"
            f"\n  Reason: {skill.reason}"
        )

    # ---------------------------------------------------------
    # SKILL ASSESSMENTS
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("SKILL ASSESSMENTS")
    print("=" * 70)

    print(
        f"\nTotal assessments: "
        f"{len(result.skill_assessments)}"
    )

    for assessment in result.skill_assessments:
        print(
            f"\n- {assessment.skill}"
            f"\n  Current Level: {assessment.current_level}"
            f"\n  Basis: {assessment.assessment_basis}"
            f"\n  Confidence: {assessment.confidence}"
            f"\n  Evidence: {assessment.evidence}"
        )

    # ---------------------------------------------------------
    # TRANSFERABLE SKILLS
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("TRANSFERABLE SKILLS")
    print("=" * 70)

    print(
        f"\nTotal transferable skills: "
        f"{len(result.transferable_skills)}"
    )

    for skill in result.transferable_skills:
        print(
            f"\n- {skill.skill}"
            f"\n  Source: {skill.source}"
            f"\n  Relevance: {skill.relevance}"
            f"\n  Explanation: {skill.explanation}"
        )

    # ---------------------------------------------------------
    # SKILL GAPS
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("SKILL GAPS")
    print("=" * 70)

    print(
        f"\nTotal skill gaps: "
        f"{len(result.skill_gaps)}"
    )

    for gap in result.skill_gaps:
        print(
            f"\n- {gap.skill}"
            f"\n  Current Level: {gap.current_level}"
            f"\n  Required Level: {gap.required_level}"
            f"\n  Status: {gap.status}"
            f"\n  Explanation: {gap.explanation}"
        )

    # ---------------------------------------------------------
    # TRANSITION DIFFICULTY
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("TRANSITION DIFFICULTY")
    print("=" * 70)

    print(
        f"\nDifficulty: "
        f"{result.transition_difficulty}"
    )

    print(
        f"\nReason:"
        f"\n{result.transition_reason}"
    )

    # ---------------------------------------------------------
    # ROADMAP
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("ROADMAP")
    print("=" * 70)

    print(
        f"\nTotal roadmap steps: "
        f"{len(result.roadmap)}"
    )

    for step in result.roadmap:
        print(
            f"\nStep {step.step}: {step.title}"
            f"\nDescription: {step.description}"
            f"\nSkills: {', '.join(step.skills)}"
        )

    # ---------------------------------------------------------
    # BASIC VALIDATION
    # ---------------------------------------------------------

    assert result.direction == selected_direction

    assert len(result.required_skills) > 0

    assert len(result.skill_assessments) > 0

    assert len(result.transferable_skills) >= 0

    assert len(result.skill_gaps) > 0

    assert result.transition_difficulty in {
        "low",
        "moderate",
        "high",
    }

    assert len(result.roadmap) > 0

    # ---------------------------------------------------------
    # SUCCESS
    # ---------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("STAGE 2 TEST PASSED")
    print("=" * 70)

    print(
        "\nSuccessfully analyzed ONE selected career direction."
    )

    print(
        "\nPipeline completed:"
        "\n✓ Skill Discovery"
        "\n✓ Skill Assessment"
        "\n✓ Transferable Skills"
        "\n✓ Skill Gap Analysis"
        "\n✓ Transition Difficulty + Roadmap"
    )

    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()