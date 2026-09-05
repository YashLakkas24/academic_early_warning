import pandas as pd
from validator import validate_data

DATA_PATH = "ai/data/students.csv"


def load_student_data():
    return pd.read_csv(DATA_PATH)
 