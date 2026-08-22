from .trend import calculate_trend
from .risk_factors import get_risk_factors
from .risk_contribution import calculate_risk_contribution


def calculate_risk(student):
    attendance_risk = 100 - student["attendance"]
    internal_risk = 100 - student["internal_marks"]
    assignment_risk = 100 - student["assignment_score"]
    previous_sem_risk = (10 - student["previous_sem_cgpa"]) * 10
    practical_risk = 100 - student["practical_marks"]

    test_scores = [student["test_1"], student["test_2"], student["test_3"]]

    slope, trend = calculate_trend(test_scores)

    if trend == "DECLINING":
        trend_risk = 100
    elif trend == "STABLE":
        trend_risk = 50
    else:
        trend_risk = 0

    risk_contribution = calculate_risk_contribution(
        attendance_risk,
        internal_risk,
        assignment_risk,
        practical_risk,
        previous_sem_risk,
        trend_risk,
    )

    risk_score = (
        attendance_risk * 0.25
        + internal_risk * 0.20
        + assignment_risk * 0.15
        + practical_risk * 0.10
        + previous_sem_risk * 0.10
        + trend_risk * 0.20
    )

    if risk_score <= 30:
        risk_level = "LOW"
    elif risk_score <= 60:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    risk_factors = get_risk_factors(student, trend)

    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "trend": trend,
        "risk_factors": risk_factors,
        "risk_contribution": risk_contribution,
        "hackathon_count": student["hackathon_count"],
        "extracurricular_count": student["extracurricular_count"],
    }
