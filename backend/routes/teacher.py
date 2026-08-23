from pathlib import Path
import sys

import pandas as pd
from fastapi import APIRouter, HTTPException


# =========================================================
# PROJECT PATH
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# =========================================================
# EXISTING AI / RISK ENGINE
# =========================================================

from ai.risk_engine.risk_engine import analyze_dataset


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/teacher",
    tags=["Teacher"]
)


# =========================================================
# DATASET
# =========================================================

CSV_PATH = (
    PROJECT_ROOT
    / "ai"
    / "data"
    / "students.csv"
)

analysis_cache = None


# =========================================================
# AI SECTION PARSER
# =========================================================

def extract_ai_section(
    ai_text,
    section_name,
    next_section=None
):
    """
    Extract a section from the AI response.

    Example:

    AI Intervention:
    Monitor attendance.
    Support test performance.

    AI Suggestion:
    Review the student weekly.
    """

    if not ai_text:
        return ""

    text = str(ai_text).strip()

    marker = f"{section_name}:"

    if marker not in text:
        return ""

    content = text.split(
        marker,
        1
    )[1].strip()

    if next_section:

        next_marker = f"{next_section}:"

        if next_marker in content:

            content = content.split(
                next_marker,
                1
            )[0].strip()

    return content


# =========================================================
# EXTRACT AI INTERVENTION
# =========================================================

def extract_ai_intervention(ai_text):

    content = extract_ai_section(
        ai_text,
        "AI Intervention",
        "AI Suggestion"
    )

    if not content:
        return []

    # Convert the two AI lines into frontend-friendly
    # array items.

    lines = [
        line.strip()
        for line in content.splitlines()
        if line.strip()
    ]

    # Remove accidental bullets.
    cleaned = []

    for line in lines:

        line = line.lstrip(
            "-•*123456789. "
        ).strip()

        if line:
            cleaned.append(line)

    # Frontend expects an array.
    return cleaned[:2]


# =========================================================
# EXTRACT AI SUGGESTION
# =========================================================

def extract_ai_suggestion(ai_text):

    suggestion = extract_ai_section(
        ai_text,
        "AI Suggestion"
    )

    if not suggestion:
        return ""

    return suggestion.strip()


# =========================================================
# LOAD ANALYSIS
# =========================================================

def load_analysis():

    global analysis_cache

    # -----------------------------------------------------
    # CACHE HIT
    # -----------------------------------------------------

    if analysis_cache is not None:

        print(
            "Teacher analytics: using cached AI results."
        )

        return analysis_cache

    # -----------------------------------------------------
    # DATASET CHECK
    # -----------------------------------------------------

    if not CSV_PATH.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                "Student dataset not found at: "
                f"{CSV_PATH}"
            )
        )

    # -----------------------------------------------------
    # READ CSV
    # -----------------------------------------------------

    try:

        df = pd.read_csv(
            CSV_PATH
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to read student dataset: "
                f"{str(e)}"
            )
        )

    # -----------------------------------------------------
    # REAL AI / RISK ANALYSIS
    # -----------------------------------------------------

    try:

        print(
            "Teacher analytics: "
            "running AI analysis..."
        )

        results = analyze_dataset(
            df
        )

    except Exception as e:

        print(
            "Teacher analytics AI error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "AI/risk analysis failed: "
                f"{str(e)}"
            )
        )

    # -----------------------------------------------------
    # STORE CACHE
    # -----------------------------------------------------

    analysis_cache = results

    print(
        "Teacher analytics: "
        "AI results cached successfully."
    )

    return analysis_cache


# =========================================================
# CLEAR CACHE
# =========================================================

@router.post("/clear-cache")
def clear_analysis_cache():

    global analysis_cache

    analysis_cache = None

    return {
        "status": "success",
        "message": (
            "AI analysis cache cleared. "
            "The next analytics request will "
            "run the AI again."
        )
    }


# =========================================================
# REPORT
# =========================================================

@router.get("/report")
def get_student_report():

    if not CSV_PATH.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                f"Student dataset not found at: "
                f"{CSV_PATH}"
            )
        )

    try:

        df = pd.read_csv(
            CSV_PATH
        )

        students = df.to_dict(
            orient="records"
        )

        return {
            "status": "success",
            "total_students": len(students),
            "students": students
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ANALYTICS
# =========================================================

@router.get("/analytics")
def get_teacher_analytics():

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

        risk_level = result.get(
            "risk_level"
        )

        if risk_level not in risk_summary:
            continue

        risk_summary[risk_level] += 1

        ai_analysis = result.get(
            "ai_analysis",
            ""
        )

        # -------------------------------------------------
        # REAL AI-GENERATED INTERVENTION
        # -------------------------------------------------

        ai_intervention = (
            extract_ai_intervention(
                ai_analysis
            )
        )

        # -------------------------------------------------
        # REAL AI-GENERATED SUGGESTION
        # -------------------------------------------------

        ai_suggestion = (
            extract_ai_suggestion(
                ai_analysis
            )
        )

        # -------------------------------------------------
        # FALLBACK
        # -------------------------------------------------

        # If AI somehow failed to provide an intervention,
        # still give the frontend a useful indication.

        if not ai_intervention:

            risk_factors = result.get(
                "risk_factors",
                []
            )

            ai_intervention = [
                str(factor)
                for factor in risk_factors[:2]
            ]

        if not ai_suggestion:

            ai_suggestion = (
                result.get(
                    "explanation",
                    ""
                )
            )

        student_info = {

            "student_id": result.get(
                "student_id"
            ),

            "student_name": result.get(
                "name"
            ),

            "risk_level": risk_level,

            "risk_score": result.get(
                "risk_score"
            ),

            "performance_trend": result.get(
                "trend",
                "STABLE"
            ),

            # ---------------------------------------------
            # AI INTERVENTION
            # ---------------------------------------------

            "intervention": {
                "reasons": ai_intervention,
                "recommendation": ""
            },

            # ---------------------------------------------
            # AI SUGGESTION
            # ---------------------------------------------

            "ai_analysis": ai_suggestion
        }

        students[risk_level].append(
            student_info
        )

    return {
        "status": "success",
        "total_students": len(results),
        "risk_summary": risk_summary,
        "students": students
    }


# =========================================================
# RISK SUMMARY
# =========================================================

@router.get("/risk-summary")
def get_risk_summary():

    results = load_analysis()

    summary = {
        "high": 0,
        "medium": 0,
        "low": 0
    }

    for result in results:

        risk_level = result.get(
            "risk_level"
        )

        if risk_level == "HIGH":
            summary["high"] += 1

        elif risk_level == "MEDIUM":
            summary["medium"] += 1

        elif risk_level == "LOW":
            summary["low"] += 1

    return summary


# =========================================================
# PERFORMANCE TREND
# =========================================================

@router.get("/performance-trend")
def get_performance_trend():

    results = load_analysis()

    trend_data = []

    for result in results:

        trend_data.append({

            "student_id": result.get(
                "student_id"
            ),

            "student_name": result.get(
                "name"
            ),

            "trend_score": result.get(
                "risk_score",
                0
            ),

            "trend": result.get(
                "trend",
                "STABLE"
            )
        })

    return trend_data


# =========================================================
# STUDENTS BY RISK
# =========================================================

@router.get("/students")
def get_students_by_risk(
    risk: str
):

    risk = risk.upper()

    if risk not in {
        "HIGH",
        "MEDIUM",
        "LOW"
    }:

        raise HTTPException(
            status_code=400,
            detail=(
                "Risk must be HIGH, MEDIUM or LOW."
            )
        )

    results = load_analysis()

    students = []

    for result in results:

        if result.get(
            "risk_level"
        ) == risk:

            students.append({

                "student_id": result.get(
                    "student_id"
                ),

                "student_name": result.get(
                    "name"
                ),

                "risk_level": result.get(
                    "risk_level"
                )
            })

    return students


# =========================================================
# STUDENT DETAILS
# =========================================================

@router.get(
    "/students/{student_id}"
)
def get_student_details(
    student_id: str
):

    results = load_analysis()

    for result in results:

        if str(
            result.get("student_id")
        ) == str(student_id):

            ai_analysis = result.get(
                "ai_analysis",
                ""
            )

            # ---------------------------------------------
            # AI INTERVENTION
            # ---------------------------------------------

            ai_intervention = (
                extract_ai_intervention(
                    ai_analysis
                )
            )

            # ---------------------------------------------
            # AI SUGGESTION
            # ---------------------------------------------

            ai_suggestion = (
                extract_ai_suggestion(
                    ai_analysis
                )
            )

            # ---------------------------------------------
            # FALLBACK
            # ---------------------------------------------

            if not ai_intervention:

                ai_intervention = [
                    str(factor)
                    for factor in result.get(
                        "risk_factors",
                        []
                    )[:2]
                ]

            if not ai_suggestion:

                ai_suggestion = (
                    result.get(
                        "explanation",
                        ""
                    )
                )

            return {

                "student_id": result.get(
                    "student_id"
                ),

                "student_name": result.get(
                    "name"
                ),

                "risk_level": result.get(
                    "risk_level"
                ),

                "performance_trend": result.get(
                    "trend",
                    "STABLE"
                ),

                # -----------------------------------------
                # TWO-LINE AI INTERVENTION
                # -----------------------------------------

                "intervention": {

                    "reasons": ai_intervention,

                    # Keep empty because the recommendation
                    # belongs in AI Suggestion.
                    "recommendation": ""
                },

                # -----------------------------------------
                # AI SUGGESTION
                # -----------------------------------------

                "ai_analysis": ai_suggestion
            }

    raise HTTPException(
        status_code=404,
        detail=(
            f"Student {student_id} not found."
        )
    )