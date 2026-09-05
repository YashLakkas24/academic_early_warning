from ai_student.llm.service import (
    generate_direction_discovery,
    generate_skill_discovery,
    generate_skill_assessment,
    generate_transferable_skills,
    generate_skill_gap_analysis,
    generate_transition_roadmap,
)

from ai_student.career_pivot.schemas import (
    DirectionDiscoveryResult,
    CareerDirectionAnalysis,
)


# ============================================================
# STAGE 1 — DISCOVER CAREER DIRECTIONS
# ============================================================

def discover_career_directions(
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
    interest_analysis: dict | None = None,
) -> DirectionDiscoveryResult:

    existing_skills = existing_skills or []
    previous_interests = previous_interests or []
    interest_analysis = interest_analysis or {}

    interest = interest_analysis.get("interest", "")

    print("\n" + "=" * 60)
    print("CAREER DIRECTION DISCOVERY")
    print("=" * 60)

    # ========================================================
    # Generate career directions
    # ========================================================

    direction_result = generate_direction_discovery(
        interest=interest,
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )

    # ========================================================
    # Safety guard
    #
    # The prompt should ask Gemini for 5 directions.
    # This prevents accidentally processing more than 5.
    # ========================================================

    direction_result.directions = direction_result.directions[:5]

    print("\nDISCOVERED DIRECTIONS:")

    for index, direction in enumerate(
        direction_result.directions,
        start=1,
    ):
        print(
            f"{index}. {direction.name} "
            f"(fit: {direction.fit_score})"
        )

    return direction_result


# ============================================================
# STAGES 2–6 — ANALYZE ONLY THE SELECTED DIRECTION
# ============================================================

def analyze_selected_direction(
    selected_direction: str,
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
    interest_analysis: dict | None = None,
) -> CareerDirectionAnalysis:

    existing_skills = existing_skills or []
    previous_interests = previous_interests or []
    interest_analysis = interest_analysis or {}

    interest = interest_analysis.get("interest", "")

    # ========================================================
    # Validate selected direction
    # ========================================================

    selected_direction = selected_direction.strip()

    if not selected_direction:
        raise ValueError(
            "Selected direction cannot be empty."
        )

    print("\n" + "=" * 60)
    print(
        f"ANALYZING SELECTED DIRECTION: "
        f"{selected_direction}"
    )
    print("=" * 60)

    # ========================================================
    # STAGE 2 — SKILL DISCOVERY
    # ========================================================

    print("\n[STAGE 2] Skill Discovery")

    skill_result = generate_skill_discovery(
        interest=interest,
        direction=selected_direction,
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )

    print(
        f"Discovered {len(skill_result.skills)} "
        f"required skills."
    )

    # ========================================================
    # STAGE 3 — SKILL ASSESSMENT
    # ========================================================

    print("\n[STAGE 3] Skill Assessment")

    assessment_result = generate_skill_assessment(
        direction=selected_direction,
        skills=[
            skill.skill
            for skill in skill_result.skills
        ],
        interest=interest,
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )

    print(
        f"Assessed "
        f"{len(assessment_result.skill_assessments)} "
        f"skills."
    )

    # ========================================================
    # STAGE 4 — TRANSFERABLE SKILLS
    # ========================================================

    print("\n[STAGE 4] Transferable Skills")

    transferable_result = generate_transferable_skills(
        direction=selected_direction,
        required_skills=skill_result.skills,
        skill_assessments=assessment_result.skill_assessments,
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )

    print(
        f"Found "
        f"{len(transferable_result.transferable_skills)} "
        f"transferable skills."
    )

    # ========================================================
    # STAGE 5 — SKILL GAP ANALYSIS
    # ========================================================

    print("\n[STAGE 5] Skill Gap Analysis")

    skill_gap_result = generate_skill_gap_analysis(
        direction=selected_direction,
        required_skills=skill_result.skills,
        skill_assessments=assessment_result.skill_assessments,
        transferable_skills=transferable_result.transferable_skills,
    )

    print(
        f"Identified "
        f"{len(skill_gap_result.skill_gaps)} "
        f"skill gaps."
    )

    # ========================================================
    # STAGE 6 — TRANSITION DIFFICULTY + ROADMAP
    # ========================================================

    print(
        "\n[STAGE 6] "
        "Transition Difficulty + Roadmap"
    )

    roadmap_result = generate_transition_roadmap(
        direction=selected_direction,
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        required_skills=skill_result.skills,
        skill_assessments=assessment_result.skill_assessments,
        transferable_skills=transferable_result.transferable_skills,
        skill_gaps=skill_gap_result.skill_gaps,
    )

    # ========================================================
    # FINAL CAREER DIRECTION ANALYSIS
    # ========================================================

    career_analysis = CareerDirectionAnalysis(
        direction=selected_direction,
        required_skills=skill_result.skills,
        skill_assessments=assessment_result.skill_assessments,
        transferable_skills=transferable_result.transferable_skills,
        skill_gaps=skill_gap_result.skill_gaps,
        transition_difficulty=(
            roadmap_result.transition_difficulty
        ),
        transition_reason=(
            roadmap_result.transition_reason
        ),
        roadmap=roadmap_result.roadmap,
    )

    print("\n" + "=" * 60)
    print("CAREER DIRECTION ANALYSIS COMPLETED")
    print("=" * 60)

    print(
        f"Direction: "
        f"{career_analysis.direction}"
    )

    print(
        f"Transition difficulty: "
        f"{career_analysis.transition_difficulty}"
    )

    return career_analysis


# ============================================================
# BACKWARD-COMPATIBILITY WRAPPER
# ============================================================

def run_career_pivot_pipeline(
    existing_skills: list[str] | None = None,
    previous_interests: list[str] | None = None,
    interest_analysis: dict | None = None,
):
    """
    Backward-compatible wrapper.

    This now performs ONLY direction discovery.

    It does NOT analyze every direction.

    After the student selects one direction,
    call analyze_selected_direction().
    """

    return discover_career_directions(
        existing_skills=existing_skills,
        previous_interests=previous_interests,
        interest_analysis=interest_analysis,
    )