import pandas as pd

from .validator import validate_data
from .risk_calculator import calculate_risk


def analyze_student(student):
    return calculate_risk(student)


def analyze_dataset(df):
    validate_data(df)

    results = []

    for _, student in df.iterrows():
        result = analyze_student(student)

        result["student_id"] = student["student_id"]
        result["name"] = student["name"]

        results.append(result)

    return results


if __name__ == "__main__":
    df = pd.read_csv("ai/data/students.csv")

    results = analyze_dataset(df)

    for result in results:
        print(result)
