from ai_student.quiz.adaptive_logic import choose_next_question


answers = {}

print("Next:", choose_next_question(answers))


answers["interest_level"] = 5

print("Next:", choose_next_question(answers))


answers["confidence"] = 2

print("Next:", choose_next_question(answers))


answers["experience"] = "Once"

print("Next:", choose_next_question(answers))


answers["experience_detail"] = "MUN"

print("Next:", choose_next_question(answers))


answers["motivation"] = "I enjoy debating and convincing people."

print("Next:", choose_next_question(answers))