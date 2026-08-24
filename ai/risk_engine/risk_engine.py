import pandas as pd

from .validator import validate_data
from .risk_calculator import calculate_risk
from .explainability import generate_explanation
from .ai_analysis import generate_ai_analysis


def analyze_student(student):
    return calculate_risk(student)


def analyze_dataset(df):
    validate_data(df)

    results = []

    for _, student in df.iterrows():
        result = analyze_student(student)

        explanation = generate_explanation(
            student, result["trend"], result["risk_level"]
        )

        result["explanation"] = explanation
        
        ai_analysis = generate_ai_analysis(student, result)

        result["ai_analysis"] = ai_analysis

        result["student_id"] = student["student_id"]
        result["name"] = student["name"]

        results.append(result)

    return results


if __name__ == "__main__":
    df = pd.read_csv("ai/data/students.csv")

    results = analyze_dataset(df)

    for result in results:
        print(result)
