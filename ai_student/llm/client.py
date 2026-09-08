import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = PROJECT_ROOT / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
base_url = "https://api.openai.com/v1"

client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url=base_url,
    timeout=60.0,
)
