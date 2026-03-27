import google.generativeai as genai
import os
import json
import logging

from ai.backlog.gemini_prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-flash-lite-latest"

def generate_backlog_plan_gemini(subject: str, weeks_available: int, syllabus_text: str, resources_text: str) -> dict:
    model = genai.GenerativeModel(
        MODEL_NAME,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "top_p": 0.9
        }
    )

    full_prompt = f"""
{SYSTEM_PROMPT}

--------------------
Subject: {subject}
Weeks Available: {weeks_available}

--- Syllabus Extracted Text ---
{syllabus_text}

--- Available Resources Extracted Text ---
{resources_text}
"""

    try:
        response = model.generate_content(full_prompt)
        text = response.text
        if not text:
            raise ValueError("Gemini returned empty response")
        return json.loads(text)
    except Exception as e:
        logger.error(f"Gemini generation failed for backlog plan: {e}")
        raise
