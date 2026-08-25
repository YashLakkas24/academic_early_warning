import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]
# Load backend/.env
load_dotenv(PROJECT_ROOT / "backend" / ".env")

AI_KEY = os.getenv("AI_KEY")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://ai.tcetcercd.in/v1")

if not AI_KEY:
    raise ValueError("AI_KEY is not set in the environment.")
if not AI_BASE_URL:
    raise ValueError("AI_BASE_URL is not set in backend/.env")

client = OpenAI(
    base_url=AI_BASE_URL,
    api_key=AI_KEY
)