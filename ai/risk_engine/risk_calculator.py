from trend import calculate_trend
from risk_factors import get_risk_factors


def calculate_risk(student):
    attendance_risk = 100 - student["attendance"]
    internal_risk = 100 - student["internal_marks"]
    assignment_risk = 100 - student["assignment_score"]

    test_scores = [student["test_1"], student["test_2"], student["test_3"]]

    slope, trend = calculate_trend(test_scores)

    if trend == "DECLINING":
        trend_risk = 100
    elif trend == "STABLE":
        trend_risk = 400
    else:
        trend_risk = 0

    risk_score = (
        attendance_risk * 0.30
        + internal_risk * 0.30
        + assignment_risk * 0.20
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
    }
