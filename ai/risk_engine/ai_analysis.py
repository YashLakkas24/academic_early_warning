import os
from pathlib import Path

from openai import OpenAI
from dotenv import load_dotenv


# =========================================================
# PROJECT ROOT
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ENV_PATH = PROJECT_ROOT / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)


# =========================================================
# AI CLIENT — GOOGLE GEMINI
# =========================================================

api_key = os.getenv("GEMINI_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


# =========================================================
# AI ANALYSIS
# =========================================================


def generate_ai_analysis(student, risk_result):

    prompt = f"""
You are an academic early-warning AI assistant for a college.

Analyze ONLY the VERIFIED student data provided below.

The backend risk engine has already calculated the final
risk score, risk level and performance trend.

You MUST NOT change those values.

=========================================================
STUDENT
=========================================================

Name: {student["name"]}

=========================================================
RISK RESULT
=========================================================

Risk score: {risk_result["risk_score"]}
Risk level: {risk_result["risk_level"]}
Trend: {risk_result["trend"]}

Risk factors:
{risk_result["risk_factors"]}

Risk contribution:
{risk_result["risk_contribution"]}

=========================================================
ACADEMIC DATA
=========================================================

Attendance: {student["attendance"]}%
Internal marks: {student["internal_marks"]}%
Assignment score: {student["assignment_score"]}%
Practical marks: {student["practical_marks"]}%
Previous semester CGPA: {student["previous_sem_cgpa"]}

Test scores:
{student["test_1"]} → {student["test_2"]} → {student["test_3"]}

=========================================================
ENGAGEMENT
=========================================================

Hackathons: {student["hackathon_count"]}
Extracurricular activities: {student["extracurricular_count"]}

=========================================================
RULES
=========================================================

1. Use ONLY the supplied data.

2. Never invent facts.

3. Never change the supplied risk score.

4. Never change the supplied risk level.

5. Never change the supplied trend.

6. Do not diagnose the student.

7. Do not make claims about personal circumstances.

8. Do not use words such as:
   critical, severe, urgent.

9. EVERY student MUST receive an AI Intervention.

10. LOW-risk students MUST receive an intervention.
    For LOW-risk students, make it preventive and focused
    on maintaining or improving their current performance.

11. MEDIUM-risk students MUST receive an intervention.

12. HIGH-risk students MUST receive an intervention.

13. Base the intervention on the strongest supported
    academic risk factors.

14. Do not claim something is a major problem unless the
    supplied risk contribution supports it.

=========================================================
REQUIRED OUTPUT
=========================================================

Return EXACTLY these sections:

Analysis:
Write 50–70 words explaining the student's academic
situation using ONLY the supplied data.

AI Intervention:
Write EXACTLY TWO short lines, use the data to give reference.

Each line must describe a practical action that faculty
can take.

Do NOT write a paragraph.

Do NOT include the word "Recommendation" here.

AI Suggestion:
Write EXACTLY ONE short practical recommendation for
faculty based ONLY on the supplied data.

Do not add any other sections.
"""

    try:

        # -------------------------------------------------
        # CHECK API KEY
        # -------------------------------------------------

        if not api_key:
            return (
                "AI analysis unavailable: "
                "GEMINI_API_KEY environment variable is not set."
            )

        # -------------------------------------------------
        # GEMINI API REQUEST
        # -------------------------------------------------

        response = client.chat.completions.create(
            model="gemini-3.8-flash",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.2,
            timeout=30.0,
        )

        # -------------------------------------------------
        # EXTRACT RESPONSE
        # -------------------------------------------------

        content = response.choices[0].message.content

        if not content:
            return (
                "AI analysis unavailable: "
                "The AI returned an empty response."
            )

        return content.strip()

    except Exception as e:

        return (
            "AI analysis unavailable.\n"
            f"AI error: {str(e)}"
        )


# =========================================================
# GEMINI CONNECTION TEST
# =========================================================

if __name__ == "__main__":

    print("Gemini API key loaded:", bool(api_key))
    print("Testing Gemini API...")

    if not api_key:
        print("ERROR: GEMINI_API_KEY is not set in .env")

    else:

        try:

            response = client.chat.completions.create(
                model="gemini-3.8-flash",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an AI career guidance assistant."
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            "Analyze this student's interests."
                        ),
                    },
                ],
                temperature=0.2,
                timeout=30.0,
            )

            content = response.choices[0].message.content

            print("\nGemini responded successfully:")
            print("----------------------------------------")
            print(content)
            print("----------------------------------------")
            print("Gemini API connection successful.")

        except Exception as e:

            print("\nRequest failed:")
            print("Error type:", type(e).__name__)
            print("Error:", str(e))