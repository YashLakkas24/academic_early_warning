from ai_student.career_pivot.schemas import (
    CareerPivotAnalysis,
    PotentialDirection,
    TransferableSkill,
    SkillGap,
    RoadmapPhase,
)


analysis = CareerPivotAnalysis(
    previous_interest="data_analytics",
    new_interest="gaming_development",
    pivot_type="related_pivot",
    pivot_summary="The student is moving from data analytics toward gaming development.",

    potential_directions=[
        PotentialDirection(
            direction="Gameplay Programmer",
            score=86,
            reason="Strong programming and problem-solving background."
        )
    ],

    transferable_skills=[
        TransferableSkill(
            skill="Python",
            source="data_analytics",
            transferability="high",
            reason="Python programming can support game logic and game AI."
        )
    ],

    skill_gaps=[
        SkillGap(
            skill="Game Engine",
            current_level=20,
            required_level=80,
            gap=60,
            priority="high",
            reason="The student has no demonstrated game-engine experience."
        )
    ],

    transition_roadmap=[
        RoadmapPhase(
            phase=1,
            title="Game Development Fundamentals",
            objective="Understand basic game development concepts.",
            actions=[
                "Learn Unity or Unreal basics",
                "Build a simple 2D game"
            ]
        )
    ],

    summary="The student has transferable programming skills but needs game-specific experience."
)


print(
    analysis.model_dump_json(indent=2)
)
