import pandas as pd

DATA_PATH = "ai/data/students.csv"


def load_student_data():
    df = pd.read_csv(DATA_PATH)
    return df


if __name__ == "__main__":
    df = load_student_data()
    print(df)