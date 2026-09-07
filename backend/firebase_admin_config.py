import firebase_admin
from firebase_admin import credentials
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SERVICE_ACCOUNT_FILE = BASE_DIR / "firebase-service-account.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(str(SERVICE_ACCOUNT_FILE))
    firebase_admin.initialize_app(cred)