import pandas as pd

from .risk_calculator import calculate_risk
from .ai_analysis import generate_ai_analysis

df = pd.read_csv("ai/data/students.csv")

student = df.iloc[1]
risk_result = calculate_risk(student)

analysis = generate_ai_analysis(student, risk_result)

print("\nAI ANALYSIS")
print("-----------")
print(analysis)
