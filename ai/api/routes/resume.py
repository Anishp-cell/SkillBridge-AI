import shutil
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ai.syllabus_intelligence.pdf_extractor import extract_text_from_pdf
from ai.resume.gemini_client import analyze_resume_gemini

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/analyze")
def analyze_resume(
    resume: UploadFile = File(...),
    target_domain: str = Form(...)
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    resume_path = None

    try:
        # Save uploaded PDF to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(resume.file, tmp)
            resume_path = tmp.name

        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume_path)
        
        if not resume_text or not resume_text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from the provided PDF.")

        # Call Gemini
        result = analyze_resume_gemini(resume_text, target_domain)
        return result

    finally:
        try:
            resume.file.close()
        except Exception:
            pass

        if resume_path and os.path.exists(resume_path):
            os.remove(resume_path)
