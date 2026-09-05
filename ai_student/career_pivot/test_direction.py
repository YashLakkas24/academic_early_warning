import json
import time
from ai_student.llm.service import generate_direction_discovery

print("1. TEST STARTED", flush=True)

start = time.time()

print("2. ABOUT TO CALL generate_direction_discovery()", flush=True)

result = generate_direction_discovery(
    interest="gaming development",

    existing_skills=[
        "python",
        "problem solving"
    ],

    previous_interests=[
        "data analytics"
    ],

    interest_analysis={
        "interest": "strong",
        "interest_score": 90,
        "confidence_score": 55,
        "experience_score": 20,
        "capability_score": 50,
        "strengths": [
            "Python",
            "problem solving",
            "analytical thinking"
        ],
        "skill_gaps": [
            "game engines",
            "game development"
        ],
        "evidence": [
            "Student has experience with Python",
            "Student reports strong interest in gaming"
        ],
        "summary": (
            "Student wants to explore gaming development "
            "and has an analytical programming background."
        )
    }
)

print(
    f"3. FUNCTION FINISHED - {time.time() - start:.2f} seconds",
    flush=True
)

print(
    json.dumps(
        result.model_dump(),
        indent=2
    )
)