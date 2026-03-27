import google.generativeai as genai
import os
import json
import logging

from ai.resume.gemini_prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-flash-lite-latest"

def analyze_resume_gemini(resume_text: str, target_domain: str) -> dict:
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
Target Domain: {target_domain}

Resume Text:
{resume_text}
"""

    try:
        response = model.generate_content(full_prompt)
        text = response.text
        if not text:
            raise ValueError("Gemini returned empty response")
        return json.loads(text)
    except Exception as e:
        logger.error(f"Gemini generation failed for resume analysis: {e}")
        raise
