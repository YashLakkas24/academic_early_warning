from pathlib import Path
import pandas as pd 
from fastapi import APIRouter,HTTPException

router = APIRouter(
    prefix="/api/teacher",
    tags=["Teacher"]
)

CSV_PATH = Path(__file__).resolve().parents[2] / "ai" / "data" / "students.csv"
#root for csv students 

@router.get("/report")
def get_student_report():
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
    try:
        if not CSV_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Student dataset not found at: {CSV_PATH}"
            )

        df = pd.read_csv(CSV_PATH)

        return {
            "status": "success",
            "total_students": len(df),

            "risk_summary": {
                "HIGH": 0,
                "MEDIUM": 0,
                "LOW": 0
            },

            "students": {
                "HIGH": [],
                "MEDIUM": [],
                "LOW": []
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
