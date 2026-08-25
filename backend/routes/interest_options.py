from fastapi import APIRouter


router = APIRouter(
    prefix="/api/interests",
    tags=["Interest Options"]
)


INTEREST_OPTIONS = [
    "Government & Public Services",
    "IT & Technology",
    "Coding & Software",
    "Business & Entrepreneurship",
    "Finance",
    "Creative & Media",
    "Healthcare",
    "Education",
    "Law",
    "Marketing"
]

@router.get("/options")
def get_interest_options():

    return {
        "options": INTEREST_OPTIONS
    }