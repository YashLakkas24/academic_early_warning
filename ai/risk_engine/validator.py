import pandas as pd

REQUIRED_COLUMNS = [
    "student_id",
    "name",
    "attendance",
    "internal_marks",
    "assignment_score",
    "test_1",
    "test_2",
    "test_3",
]


def validate_columns(df):
    missing_columns = [
        column for column in REQUIRED_COLUMNS if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(f"Missing columns: {missing_columns}")


def validate_ranges(df):
    score_columns = [
        "attendance",
        "internal_marks",
        "assignment_score",
        "test_1",
        "test_2",
        "test_3",
    ]

    for column in score_columns:
        if not df[column].between(0, 100).all():
            raise ValueError(f"Invalid values in {column}")


def validate_data(df):
    validate_columns(df)
    validate_ranges(df)

    if df["student_id"].duplicated().any():
        raise ValueError("Duplicate student IDs found")

    if df.isnull().any().any():
        raise ValueError("Missing values found")

    return True