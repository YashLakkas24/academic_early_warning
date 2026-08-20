import pandas as pd
from validator import validate_data

DATA_PATH = "ai/data/students.csv"


def load_student_data():
    return pd.read_csv(DATA_PATH)


if __name__ == "__main__":
    df = load_student_data()

    validate_data(df)

    print("Data validation successful!")

    print("Shape:", df.shape)
    print("\nMissing values:")
    print(df.isnull().sum())

    print("\nDuplicates:", df.duplicated().sum())

    print("\nData types:")
    print(df)
