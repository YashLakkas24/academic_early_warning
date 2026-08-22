def generate_explanation(student, trend, risk_level):
    reasons = []

    if student["attendance"] < 75:
        reasons.append(
            f"Attendance is {student['attendance']}%, below the 75% threshold."
        )

    if student["internal_marks"] < 60:
        reasons.append(
            f"Internal marks are {student['internal_marks']}%, below the 60% threshold."
        )

    if student["assignment_score"] < 60:
        reasons.append(
            f"Assignment performance is {student['assignment_score']}%, below the 60% threshold."
        )

    if student["practical_marks"] < 60:
        reasons.append(
            f"Practical marks are {student['practical_marks']}%, below the 60% threshold."
        )

    if student["previous_sem_cgpa"] < 6.0:
        reasons.append(
            f"Previous semester CGPA is {student['previous_sem_cgpa']}, below the 6.0 threshold."
        )

    test_scores = [
        student["test_1"],
        student["test_2"],
        student["test_3"],
    ]

    if trend == "DECLINING":
        reasons.append(
            f"Test performance is declining across the three assessments: "
            f"{test_scores[0]} → {test_scores[1]} → {test_scores[2]}."
        )

    elif trend == "IMPROVING":
        reasons.append(
            f"Test performance is improving across the three assessments: "
            f"{test_scores[0]} → {test_scores[1]} → {test_scores[2]}."
        )

    else:
        reasons.append(
            f"Test performance is relatively stable: "
            f"{test_scores[0]} → {test_scores[1]} → {test_scores[2]}."
        )

    if risk_level == "HIGH":
        recommendation = (
            "Immediate faculty intervention is recommended, "
            "with focused academic and attendance support."
        )

    elif risk_level == "MEDIUM":
        recommendation = (
            "Faculty monitoring and early academic intervention are recommended."
        )

    else:
        recommendation = (
            "Continue regular monitoring and encourage consistent academic performance."
        )

    return {"reasons": reasons, "recommendation": recommendation}
