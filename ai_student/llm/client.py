import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_BASE_URL = os.getenv("AI_BASE_URL")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")
if not AI_BASE_URL:
    raise RuntimeError("AI_BASE_URL is not set")

client = OpenAI(
    api_key=GEMINI_API_KEY,
    base_url=AI_BASE_URL,
    timeout=60.0,
)