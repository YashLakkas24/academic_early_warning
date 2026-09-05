from ai_student.llm.service import generate_transition_roadmap


# ============================================================
# STAGE 6 — TRANSITION DIFFICULTY + ROADMAP
# ============================================================

print()
print("=" * 60)
print("STAGE 6 — TRANSITION DIFFICULTY + ROADMAP")
print("=" * 60)


# ============================================================
# INPUT FROM PREVIOUS STAGES
# ============================================================

direction = "Gameplay Programming with Python"

existing_skills = [
    "Python",
    "Problem Solving",
    "Analytical Thinking",
]


previous_interests = [
    "Data Analytics",
]


# ------------------------------------------------------------
# STAGE 2 — REQUIRED SKILLS
# ------------------------------------------------------------

required_skills = [
    {
        "skill": "Game Engine Proficiency",
        "importance": 90,
        "required_level": "intermediate",
        "reason": (
            "Implementing gameplay mechanics requires familiarity "
            "with a game engine."
        ),
    },
    {
        "skill": "Object-Oriented Programming",
        "importance": 85,
        "required_level": "intermediate",
        "reason": (
            "Game entities, states, and behaviors are commonly "
            "structured using OOP."
        ),
    },
    {
        "skill": "Game Logic Implementation",
        "importance": 95,
        "required_level": "intermediate",
        "reason": (
            "Gameplay programming requires implementing rules, "
            "movement, interactions, and game mechanics."
        ),
    },
    {
        "skill": "Debugging and Testing",
        "importance": 80,
        "required_level": "developing",
        "reason": (
            "Gameplay code requires systematic debugging and "
            "testing of interactive systems."
        ),
    },
    {
        "skill": "Mathematics for Games",
        "importance": 70,
        "required_level": "beginner",
        "reason": (
            "Vectors, coordinates, and basic mathematics are "
            "useful for movement and game mechanics."
        ),
    },
]


# ------------------------------------------------------------
# STAGE 3 — SKILL ASSESSMENTS
# ------------------------------------------------------------

skill_assessments = [
    {
        "skill": "Game Engine Proficiency",
        "current_level": "unknown",
        "assessment_basis": "unknown",
        "confidence": "low",
        "evidence": (
            "No evidence of experience with Unity, Unreal, "
            "Godot, or another game engine."
        ),
    },
    {
        "skill": "Object-Oriented Programming",
        "current_level": "developing",
        "assessment_basis": "estimated",
        "confidence": "medium",
        "evidence": (
            "The student has Python experience. Python supports "
            "object-oriented programming, but there is no direct "
            "evidence of advanced OOP usage."
        ),
    },
    {
        "skill": "Game Logic Implementation",
        "current_level": "unknown",
        "assessment_basis": "unknown",
        "confidence": "low",
        "evidence": (
            "No direct evidence of implementing gameplay systems "
            "or game mechanics."
        ),
    },
    {
        "skill": "Debugging and Testing",
        "current_level": "developing",
        "assessment_basis": "estimated",
        "confidence": "medium",
        "evidence": (
            "Python and problem-solving experience provide some "
            "foundation for debugging, but game-specific "
            "debugging experience is not confirmed."
        ),
    },
    {
        "skill": "Mathematics for Games",
        "current_level": "unknown",
        "assessment_basis": "unknown",
        "confidence": "low",
        "evidence": (
            "No direct evidence of applying vectors, coordinates, "
            "or game mathematics."
        ),
    },
]


# ------------------------------------------------------------
# STAGE 4 — TRANSFERABLE SKILLS
# ------------------------------------------------------------

transferable_skills = [
    {
        "skill": "Python Programming",
        "source": "Existing skill",
        "relevance": "high",
        "explanation": (
            "The student's Python experience provides a useful "
            "programming foundation for gameplay scripting and "
            "game-development tools."
        ),
    },
    {
        "skill": "Problem Solving",
        "source": "Existing skill",
        "relevance": "high",
        "explanation": (
            "Gameplay programming requires breaking complex "
            "mechanics into logical steps and debugging problems."
        ),
    },
    {
        "skill": "Analytical Thinking",
        "source": "Previous interest: Data Analytics",
        "relevance": "medium",
        "explanation": (
            "Analytical thinking can support debugging, system "
            "analysis, and understanding game behavior."
        ),
    },
]


# ------------------------------------------------------------
# STAGE 5 — SKILL GAPS
# ------------------------------------------------------------

skill_gaps = [
    {
        "skill": "Game Engine Proficiency",
        "current_level": "unknown",
        "required_level": "intermediate",
        "status": "assessment_needed",
        "explanation": (
            "There is no evidence of experience with a game engine."
        ),
    },
    {
        "skill": "Object-Oriented Programming",
        "current_level": "developing",
        "required_level": "intermediate",
        "status": "small_gap",
        "explanation": (
            "The student has a programming foundation through "
            "Python but needs stronger OOP capability for the "
            "target direction."
        ),
    },
    {
        "skill": "Game Logic Implementation",
        "current_level": "unknown",
        "required_level": "intermediate",
        "status": "assessment_needed",
        "explanation": (
            "There is no direct evidence of implementing "
            "gameplay logic."
        ),
    },
    {
        "skill": "Debugging and Testing",
        "current_level": "developing",
        "required_level": "developing",
        "status": "no_gap",
        "explanation": (
            "The assessed developing level meets the required "
            "developing level."
        ),
    },
    {
        "skill": "Mathematics for Games",
        "current_level": "unknown",
        "required_level": "beginner",
        "status": "assessment_needed",
        "explanation": (
            "There is insufficient evidence to determine the "
            "student's game-mathematics ability."
        ),
    },
]


# ============================================================
# CALL STAGE 6
# ============================================================

result = generate_transition_roadmap(
    direction=direction,
    existing_skills=existing_skills,
    previous_interests=previous_interests,
    required_skills=required_skills,
    skill_assessments=skill_assessments,
    transferable_skills=transferable_skills,
    skill_gaps=skill_gaps,
)


# ============================================================
# DISPLAY RESULT
# ============================================================

print()
print(f"Direction: {direction}")

print()
print("TRANSITION DIFFICULTY")
print("-" * 60)
print(result.transition_difficulty)

print()
print("TRANSITION REASON")
print("-" * 60)
print(result.transition_reason)

print()
print("ROADMAP")
print("-" * 60)

for step in result.roadmap:
    print()
    print(f"Step {step.step}: {step.title}")
    print(f"Description: {step.description}")
    print(f"Skills: {', '.join(step.skills)}")


# ============================================================
# STRUCTURED RESULT
# ============================================================

print()
print("=" * 60)
print("STRUCTURED RESULT")
print("=" * 60)

print(result.model_dump_json(indent=2))