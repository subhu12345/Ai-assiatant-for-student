import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Gemini API Configuration
GEMINI_API_KEY = os.environ.get("AQ.Ab8RN6IUPTs9DJRoVhDH9_3-kvp0x-0xOkW77MpZP0z2kV8RRA", "")

# Flask Secret Key for Session Management
SECRET_KEY = os.environ.get("SECRET_KEY", "student-ai-assistant-secret-key-2026")

# Optional path to Firebase service account key JSON file
FIREBASE_CREDENTIALS_PATH = os.environ.get("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
