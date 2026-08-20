def get_risk_factors(student, trend):
    factors = []

    if student["attendance"] < 75:
        factors.append("Low attendance")

    if student["internal_marks"] < 60:
        factors.append("Low internal marks")

    if student["assignment_score"] < 60:
        factors.append("Low assignment performance")

    if trend == "DECLINING":
        factors.append("Declining academic performance")

    return factors
