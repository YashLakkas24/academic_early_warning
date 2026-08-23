from pathlib import Path
import sys

import pandas as pd
from fastapi import APIRouter, HTTPException

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.risk_engine.risk_engine import analyze_dataset


router = APIRouter(
    prefix="/api/teacher",
    tags=["Teacher"]
)

CSV_PATH = (
    Path(__file__).resolve().parents[2]
    / "ai"
    / "data"
    / "students.csv"
)


def load_analysis():
    """
    Read the fixed CSV and run Member 2's risk engine.
    """
    if not CSV_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Student dataset not found at: {CSV_PATH}"
        )

    df = pd.read_csv(CSV_PATH)

    try:
        results = analyze_dataset(df)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI/risk analysis failed: {str(e)}"
        )

    return results


@router.get("/report")
def get_student_report():
    """
    Returns the complete CSV data.

    This endpoint is mainly for backend testing.
    Do NOT use this endpoint for the teacher dashboard,
    because it contains raw academic data.
    """
    try:
        if not CSV_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Student dataset not found at: {CSV_PATH}"
            )

        df = pd.read_csv(CSV_PATH)

        students = df.to_dict(orient="records")

        return {
            "status": "success",
            "total_students": len(students),
            "students": students
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/analytics")
def get_teacher_analytics():
    """
    Complete teacher analytics response.

    Used mainly for backend testing.
    The teacher dashboard can use the smaller endpoints below.
    """

    results = load_analysis()

    risk_summary = {
        "HIGH": 0,
        "MEDIUM": 0,
        "LOW": 0
    }

    students = {
        "HIGH": [],
        "MEDIUM": [],
        "LOW": []
    }

    for result in results:

        risk_level = result["risk_level"]

        risk_summary[risk_level] += 1

        student_info = {
            "student_id": result["student_id"],
            "student_name": result["name"],
            "risk_level": risk_level,
            "intervention": {
                "reasons": result.get("risk_factors", []),
                "recommendation": result.get("explanation", "")
            },
            "ai_analysis": result.get("ai_analysis")
        }

        students[risk_level].append(student_info)

    return {
        "status": "success",
        "total_students": len(results),
        "risk_summary": risk_summary,
        "students": students
    }


@router.get("/risk-summary")
def get_risk_summary():
    """
    Used by the frontend RiskDistributionChart.

    Returns ONLY the number of students in each risk category.
    """

    results = load_analysis()

    summary = {
        "high": 0,
        "medium": 0,
        "low": 0
    }

    for result in results:

        risk_level = result["risk_level"]

        if risk_level == "HIGH":
            summary["high"] += 1

        elif risk_level == "MEDIUM":
            summary["medium"] += 1

        elif risk_level == "LOW":
            summary["low"] += 1

    return summary


@router.get("/performance-trend")
def get_performance_trend():
    """
    Used by the frontend PerformanceTrendChart.

    Returns trend information calculated by the risk engine.
    """

    results = load_analysis()

    trend_data = []

    for result in results:

        trend_data.append({
            "student_id": result["student_id"],
            "student_name": result["name"],
            "trend_score": result.get("risk_score", 0),
            "trend": result["trend"]
        })

    return trend_data


@router.get("/students")
def get_students_by_risk(risk: str):
    """
    Returns students belonging to HIGH, MEDIUM or LOW risk.

    Does NOT return marks, attendance, CGPA, etc.
    """

    risk = risk.upper()

    if risk not in {"HIGH", "MEDIUM", "LOW"}:
        raise HTTPException(
            status_code=400,
            detail="Risk must be HIGH, MEDIUM or LOW."
        )

    results = load_analysis()

    students = []

    for result in results:

        if result["risk_level"] == risk:

            students.append({
                "student_id": result["student_id"],
                "student_name": result["name"],
                "risk_level": result["risk_level"]
            })

    return students


@router.get("/students/{student_id}")
def get_student_details(student_id: str):
    """
    Returns teacher-safe information for one student.

    Raw academic data is NOT returned.
    """

    results = load_analysis()

    for result in results:

        if result["student_id"] == student_id:

            return {
                "student_id": result["student_id"],
                "student_name": result["name"],
                "risk_level": result["risk_level"],

                "performance_trend": result.get("trend"),

                "intervention": {
                    "reasons": result.get("risk_factors", []),
                    "recommendation": result.get("explanation", "")
                },

                "ai_analysis": result.get("ai_analysis")
            }

    raise HTTPException(
        status_code=404,
        detail=f"Student {student_id} not found."
    )