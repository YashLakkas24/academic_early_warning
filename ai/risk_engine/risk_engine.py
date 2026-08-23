import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed

from .validator import validate_data
from .risk_calculator import calculate_risk
from .explainability import generate_explanation
from .ai_analysis import generate_ai_analysis


# =========================================================
# CONFIGURATION
# =========================================================

# Number of AI requests that can run simultaneously.
#
# 5 is deliberately moderate so that we do not overload
# the AI service with 10 simultaneous requests.
AI_WORKERS = 5


# =========================================================
# ANALYZE ONE STUDENT
# =========================================================

def analyze_student(student):

    # -----------------------------------------------------
    # STEP 1: Existing deterministic risk calculation
    # -----------------------------------------------------

    result = calculate_risk(student)

    # -----------------------------------------------------
    # STEP 2: Existing explainability
    # -----------------------------------------------------

    explanation = generate_explanation(
        student,
        result["trend"],
        result["risk_level"]
    )

    result["explanation"] = explanation

    # -----------------------------------------------------
    # STEP 3: REAL AI ANALYSIS
    # -----------------------------------------------------

    result["ai_analysis"] = generate_ai_analysis(
        student,
        result
    )

    # -----------------------------------------------------
    # STEP 4: Student identity
    # -----------------------------------------------------

    result["student_id"] = student["student_id"]
    result["name"] = student["name"]

    return result


# =========================================================
# ANALYZE DATASET
# =========================================================

def analyze_dataset(df):

    validate_data(df)

    students = [
        student
        for _, student in df.iterrows()
    ]

    results = []

    # =====================================================
    # RUN AI ANALYSIS IN PARALLEL
    # =====================================================

    with ThreadPoolExecutor(
        max_workers=AI_WORKERS
    ) as executor:

        futures = {
            executor.submit(
                analyze_student,
                student
            ): index
            for index, student in enumerate(students)
        }

        completed_results = {}

        for future in as_completed(futures):

            index = futures[future]

            try:

                completed_results[index] = future.result()

            except Exception as e:

                # Do not allow one student to break the
                # complete analytics page.

                student = students[index]

                completed_results[index] = {
                    "student_id": student["student_id"],
                    "name": student["name"],
                    "risk_level": "LOW",
                    "risk_score": 0,
                    "trend": "STABLE",
                    "risk_factors": [],
                    "risk_contribution": {},
                    "explanation": "",
                    "ai_analysis": (
                        "AI analysis unavailable: "
                        f"{str(e)}"
                    )
                }

    # =====================================================
    # KEEP ORIGINAL CSV ORDER
    # =====================================================

    for index in range(len(students)):

        results.append(
            completed_results[index]
        )

    return results


# =========================================================
# LOCAL TEST
# =========================================================

if __name__ == "__main__":

    df = pd.read_csv(
        "ai/data/students.csv"
    )

    results = analyze_dataset(df)

    for result in results:

        print(
            result
        )