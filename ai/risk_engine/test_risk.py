import pandas as pd
from risk_calculator import calculate_risk

df = pd.read_csv("ai/data/students.csv")

for _, student in df.iterrows():
    result = calculate_risk(student)

    print(student["name"], "→", result)
