from pathlib import Path
import sys

import pandas as pd
from fastapi import APIRouter, HTTPException,Depends
from auth_dependencies import require_teacher


# =========================================================
# PROJECT PATH
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# =========================================================
# RISK ENGINE
# =========================================================

from ai.risk_engine.risk_engine import analyze_dataset


# =========================================================
# AI ANALYSIS
# =========================================================

from ai.risk_engine.ai_analysis import generate_ai_analysis


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


# =========================================================
# DETERMINISTIC ANALYSIS CACHE
# =========================================================
#
# IMPORTANT:
#
# This cache contains ONLY:
# - risk score
# - risk level
# - trend
# - risk factors
# - deterministic explanation
#
# AI results are NOT stored here.
#
# Therefore opening Analytics does NOT run AI.
#
# AI runs only when a teacher opens a particular student.
# =========================================================

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

    Expected format:

    AI Intervention:
    First short line.
    Second short line.

    AI Suggestion:
    One practical recommendation.
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
    """
    Extract exactly two short intervention lines.
    """

    content = extract_ai_section(
        ai_text,
        "AI Intervention",
        "AI Suggestion"
    )

    if not content:
        return []

    lines = [
        line.strip()
        for line in content.splitlines()
        if line.strip()
    ]

    cleaned = []

    for line in lines:

        # Remove markdown/list numbering
        line = line.lstrip(
            "-•*123456789. "
        ).strip()

        if line:
            cleaned.append(line)

    return cleaned[:2]


# =========================================================
# EXTRACT AI SUGGESTION
# =========================================================

def extract_ai_suggestion(ai_text):
    """
    Extract the AI Suggestion separately.
    """

    suggestion = extract_ai_section(
        ai_text,
        "AI Suggestion"
    )

    if not suggestion:
        return ""

    return suggestion.strip()


# =========================================================
# LOAD DETERMINISTIC ANALYSIS
# =========================================================

def load_analysis():
    """
    Load the student dataset and calculate:

    - Risk score
    - Risk level
    - Trend
    - Risk factors
    - Explanation

    NO AI CALLS happen here.

    This is why the Analytics page can load quickly.
    """

    global analysis_cache

    # -----------------------------------------------------
    # CACHE HIT
    # -----------------------------------------------------

    if analysis_cache is not None:

        print(
            "Teacher analytics: "
            "using cached risk analysis."
        )

        return analysis_cache

    # -----------------------------------------------------
    # CHECK DATASET
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
    # RUN RISK ENGINE
    # -----------------------------------------------------
    #
    # IMPORTANT:
    # analyze_dataset() now performs ONLY
    # deterministic risk analysis.
    #
    # It does NOT call OpenAI.
    # -----------------------------------------------------

    try:

        print(
            "Teacher analytics: "
            "calculating student risk levels..."
        )

        results = analyze_dataset(
            df
        )

    except Exception as e:

        print(
            "Teacher analytics risk error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Risk analysis failed: "
                f"{str(e)}"
            )
        )

    # -----------------------------------------------------
    # STORE DETERMINISTIC RESULTS
    # -----------------------------------------------------

    analysis_cache = results

    print(
        "Teacher analytics: "
        "risk analysis completed."
    )

    return analysis_cache


# =========================================================
# GET RAW STUDENT RECORD
# =========================================================

def get_student_from_csv(student_id):
    """
    Get the original student record from students.csv.

    This is required because the AI needs the complete
    academic data when the teacher opens a student.
    """

    if not CSV_PATH.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                "Student dataset not found at: "
                f"{CSV_PATH}"
            )
        )

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

    for _, student in df.iterrows():

        if str(
            student["student_id"]
        ) == str(student_id):

            return student

    raise HTTPException(
        status_code=404,
        detail=(
            f"Student {student_id} not found."
        )
    )


# =========================================================
# CLEAR CACHE
# =========================================================

@router.post("/clear-cache")
def clear_analysis_cache(current_user:dict=Depends(require_teacher)):

    global analysis_cache

    analysis_cache = None

    return {
        "status": "success",
        "message": (
            "Risk analysis cache cleared. "
            "No AI results are stored in this cache."
        )
    }


# =========================================================
# GET /api/teacher/report
# =========================================================

@router.get("/report")
def get_student_report(
    current_user:dict=Depends(require_teacher)
    ):
    
    if not CSV_PATH.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                "Student dataset not found at: "
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
# GET /api/teacher/analytics
# =========================================================

@router.get("/analytics")
def get_teacher_analytics(current_user:dict=Depends(require_teacher)):

   

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

    # -----------------------------------------------------
    # PROCESS STUDENTS
    # -----------------------------------------------------

    for result in results:

        risk_level = result.get(
            "risk_level"
        )

        if risk_level not in risk_summary:
            continue

        risk_summary[risk_level] += 1

        # -------------------------------------------------
        # IMPORTANT:
        # NO AI ANALYSIS HERE
        # -------------------------------------------------

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

            # AI will be generated later
            # when teacher opens student.
            "intervention": {
                "reasons":result.get("risk_factors",[]
                ),
                "recommendation": ""
            },

            "ai_analysis": None
        }

        students[risk_level].append(
            student_info
        )

    # -----------------------------------------------------
    # RETURN ANALYTICS
    # -----------------------------------------------------

    return {
        "status": "success",
        "total_students": len(results),
        "risk_summary": risk_summary,
        "students": students
    }


# =========================================================
# GET /api/teacher/risk-summary
# =========================================================

@router.get("/risk-summary")
def get_risk_summary(current_user:dict=Depends(require_teacher)):

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
# GET /api/teacher/performance-trend
# =========================================================

@router.get("/performance-trend")
def get_performance_trend(current_user:dict=Depends(require_teacher)):

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
# GET /api/teacher/students
# =========================================================

@router.get("/students")
def get_students_by_risk(
    risk: str,
    current_user:dict=Depends(require_teacher)
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
# GET /api/teacher/students/{student_id}
# =========================================================
#
# THIS IS WHERE AI RUNS.
#
# The teacher has clicked a specific student.
#
# Example:
#
# /api/teacher/students/ST005
#
# Only ST005 gets an AI request.
#
# =========================================================

@router.get(
    "/students/{student_id}"
)
def get_student_details(
    student_id: str,
    current_user:dict=Depends(require_teacher)
):

    # -----------------------------------------------------
    # STEP 1:
    # Get deterministic risk results
    # -----------------------------------------------------

    results = load_analysis()

    # -----------------------------------------------------
    # STEP 2:
    # Find selected student
    # -----------------------------------------------------

    selected_result = None

    for result in results:

        if str(
            result.get("student_id")
        ) == str(student_id):

            selected_result = result
            break

    if selected_result is None:

        raise HTTPException(
            status_code=404,
            detail=(
                f"Student {student_id} not found."
            )
        )

    # -----------------------------------------------------
    # STEP 3:
    # Get complete original student data
    # -----------------------------------------------------

    student = get_student_from_csv(
        student_id
    )

    # -----------------------------------------------------
    # STEP 4:
    # RUN AI ONLY NOW
    # -----------------------------------------------------
    #
    # This happens only because the teacher clicked
    # this particular student.
    # -----------------------------------------------------

    print(
        f"AI analysis requested for student "
        f"{student_id}..."
    )

    try:

        ai_text = generate_ai_analysis(
            student,
            selected_result
        )

    except Exception as e:

        print(
            "Student AI analysis error:",
            repr(e)
        )

        ai_text = (
            "AI analysis unavailable.\n"
            f"AI error: {str(e)}"
        )

    # -----------------------------------------------------
    # STEP 5:
    # Extract AI Intervention
    # -----------------------------------------------------

    ai_intervention = extract_ai_intervention(
        ai_text
    )

    # -----------------------------------------------------
    # STEP 6:
    # Extract AI Suggestion
    # -----------------------------------------------------

    ai_suggestion = extract_ai_suggestion(
        ai_text
    )

    # -----------------------------------------------------
    # STEP 7:
    # SAFETY FALLBACK
    # -----------------------------------------------------
    #
    # If the AI gives malformed output, the frontend
    # should still receive something useful.
    #
    # This fallback does NOT change the risk level.
    # -----------------------------------------------------

    if len(ai_intervention) == 0:

        risk_factors = selected_result.get(
            "risk_factors",
            []
        )

        ai_intervention = [
            str(factor)
            for factor in risk_factors[:2]
        ]

    # LOW-risk students may have very few/no risk factors.
    # They still need an intervention.

    if len(ai_intervention) == 0:

        ai_intervention = [
            "Continue monitoring the student's academic performance.",
            "Review future attendance and assessment trends."
        ]

    # Make sure there are exactly two lines
    # for the frontend.

    while len(ai_intervention) < 2:

        ai_intervention.append(
            "Continue monitoring the student's academic progress."
        )

    ai_intervention = ai_intervention[:2]

    # -----------------------------------------------------
    # AI SUGGESTION FALLBACK
    # -----------------------------------------------------

    if not ai_suggestion:

        ai_suggestion = (
            "Continue monitoring the student's "
            "academic performance and review progress "
            "during the next assessment."
        )

    # -----------------------------------------------------
    # FINAL STUDENT RESPONSE
    # -----------------------------------------------------

    return {

        "student_id": selected_result.get(
            "student_id"
        ),

        "student_name": selected_result.get(
            "name"
        ),

        "risk_level": selected_result.get(
            "risk_level"
        ),

        "performance_trend": selected_result.get(
            "trend",
            "STABLE"
        ),

        # ---------------------------------------------
        # AI INTERVENTION
        # Exactly two short lines
        # ---------------------------------------------

        "intervention": {

            "reasons": ai_intervention,

            # Recommendation does NOT belong here.
            "recommendation": ""
        },

        # ---------------------------------------------
        # AI SUGGESTION
        # Shown separately in the frontend
        # ---------------------------------------------

        "ai_analysis": ai_suggestion
    }