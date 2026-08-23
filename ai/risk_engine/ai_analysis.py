import os
from pathlib import Path

from openai import OpenAI
from dotenv import load_dotenv


# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Load backend/.env explicitly
ENV_PATH = PROJECT_ROOT / "backend" / ".env"

load_dotenv(ENV_PATH)

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(
    base_url="https://ai.tcetcercd.in/v1",
    api_key=api_key
)

def generate_ai_analysis(student, risk_result):
    prompt = f"""You are an academic early-warning assistant for a college.

        Analyze the following VERIFIED student risk data.

        Student:
        - Name: {student["name"]}
        - Risk score: {risk_result["risk_score"]}
        - Risk level: {risk_result["risk_level"]}
        - Trend: {risk_result["trend"]}

        Risk factors:
        {risk_result["risk_factors"]}

        Risk contribution:
        {risk_result["risk_contribution"]}

        Academic data:
        - Attendance: {student["attendance"]}%
        - Internal marks: {student["internal_marks"]}%
        - Assignment score: {student["assignment_score"]}%
        - Practical marks: {student["practical_marks"]}%
        - Previous semester CGPA: {student["previous_sem_cgpa"]}
        - Test scores: {student["test_1"]} → {student["test_2"]} → {student["test_3"]}

        Engagement:
        - Hackathons: {student["hackathon_count"]}
        - Extracurricular activities: {student["extracurricular_count"]}

        Write a concise academic risk analysis.

        Rules:
        1. Do not invent facts.
        2. Do not change the risk score or risk level.
        3. Only use the supplied data.
        4. Explain the main reasons behind the risk.
        5. Mention the trend when relevant.
        6. "Suggest a practical faculty intervention based only on the supplied risk factors."
        7. Keep the response between 60 and 100 words.
        8. Do not diagnose the student or make claims about personal circumstances.
        9. Do not introduce new severity labels such as "critical", "severe", or "urgent". Use only the supplied risk level and trend.
        10. Do not describe a trend as "critical" unless the supplied data explicitly says so.
        11. Prioritize the 2–3 largest risk contributors when explaining the student's risk.
        12. Do not claim that a factor is a major contributor unless the supplied risk contribution supports it.
    """

    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return "AI analysis unavailable: OPENAI_API_KEY environment variable is not set."
        response = client.chat.completions.create(
            model="qwen3.6", messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI analysis unavailable: {str(e)}"

