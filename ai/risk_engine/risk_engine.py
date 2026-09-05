import pandas as pd

from .validator import validate_data
from .risk_calculator import calculate_risk
from .explainability import generate_explanation
from .ai_analysis import generate_ai_analysis


def analyze_student(student):
 
    result = calculate_risk(student)
 
    explanation = generate_explanation(student, result["trend"], result["risk_level"])

    result["explanation"] = explanation
 
    result["student_id"] = student["student_id"]
    result["name"] = student["name"]

    return result


def generate_student_ai_analysis(student):
    """
    Generate AI analysis for one selected student.

    Risk values are calculated deterministically first.
    The AI only explains the verified result and provides
    faculty intervention guidance.
    """

    risk_result = analyze_student(student)

    ai_analysis = generate_ai_analysis(student, risk_result)
    risk_result["ai_analysis"] = ai_analysis
    return risk_result


def analyze_dataset(df):
    
    validate_data(df)
 
    students = [student for _, student in df.iterrows()]

    results = []
 
    for student in students:

        result = analyze_student(student)

        results.append(result)
 
    return results
