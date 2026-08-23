import pandas as pd

from .validator import validate_data
from .risk_calculator import calculate_risk
from .explainability import generate_explanation


def analyze_student(student):

    # -----------------------------------------------------
    # STEP 1: Calculate deterministic risk
    # -----------------------------------------------------

    result = calculate_risk(student)

    # -----------------------------------------------------
    # STEP 2: Generate deterministic explanation
    # -----------------------------------------------------

    explanation = generate_explanation(
        student,
        result["trend"],
        result["risk_level"]
    )

    result["explanation"] = explanation

    # -----------------------------------------------------
    # STEP 3: Student identity
    # -----------------------------------------------------

    result["student_id"] = student["student_id"]
    result["name"] = student["name"]

    return result

def analyze_dataset(df):

    # -----------------------------------------------------
    # Validate dataset
    # -----------------------------------------------------

    validate_data(df)

    # -----------------------------------------------------
    # Convert dataframe rows into student records
    # -----------------------------------------------------

    students = [
        student
        for _, student in df.iterrows()
    ]

    results = []

    # -----------------------------------------------------
    # Calculate deterministic risk for every student
    # -----------------------------------------------------

    for student in students:

        result = analyze_student(student)

        results.append(result)

    # -----------------------------------------------------
    # Return results in original CSV order
    # -----------------------------------------------------

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