from ai_student.interest_analysis.scoring import (
    scale_1_to_5,
    calculate_experience_score,
)


print("Interest 5/5:", scale_1_to_5(5))
print("Confidence 2/5:", scale_1_to_5(2))

print(
    "Experience MUN once:",
    calculate_experience_score("once")
)

print(
    "Experience frequently:",
    calculate_experience_score("frequently")
)