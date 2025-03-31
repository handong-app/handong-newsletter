import os
from dotenv import load_dotenv

load_dotenv()

TEST_RUN = os.getenv("TEST")

FIREBASE_CONFIG = os.getenv("FIREBASE_CONFIG")
EMAIL_SENDER_NAME = os.getenv("EMAIL_SENDER_NAME")
EMAIL_SENDER_EMAIL = os.getenv("EMAIL_SENDER_EMAIL")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_ID = os.getenv("SMTP_ID")
SMTP_PW = os.getenv("SMTP_PW")

API_FEED_URL = os.getenv("API_FEED_URL")