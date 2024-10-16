import os
from dotenv import load_dotenv

load_dotenv()


SPEECH_KEY = os.getenv("SPEECH_KEY")
SPEECH_REGION = os.getenv("SPEECH_REGION")
SERVER_URL = os.getenv("SERVER_URL")
