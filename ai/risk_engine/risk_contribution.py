def calculate_risk_contribution(
    attendance_risk,
    internal_risk,
    assignment_risk,
    practical_risk,
    previous_sem_risk,
    trend_risk,
):

    return {
        "attendance": round(attendance_risk * 0.25, 2),
        "internal_marks": round(internal_risk * 0.20, 2),
        "assignment": round(assignment_risk * 0.15, 2),
        "practical": round(practical_risk * 0.10, 2),
        "previous_sem_cgpa": round(previous_sem_risk * 0.10, 2),
        "trend": round(trend_risk * 0.20, 2),
    }
