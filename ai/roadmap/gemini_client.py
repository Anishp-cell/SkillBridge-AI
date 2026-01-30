import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-flash-lite-latest"

def generate_roadmap(system_prompt: str, user_prompt: str) -> str:
    model = genai.GenerativeModel(
        MODEL_NAME,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "top_p": 0.9
        }
    )

    full_prompt = f"""
{system_prompt}

--------------------

{user_prompt}
"""

    response = model.generate_content(full_prompt)

    return response.text
