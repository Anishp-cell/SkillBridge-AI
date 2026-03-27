import shutil
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ai.syllabus_intelligence.pdf_extractor import extract_text_from_pdf

from ai.backlog.gemini_client import generate_backlog_plan_gemini

router = APIRouter(prefix="/backlog", tags=["Backlog"])

@router.post("/plan")
def get_backlog_plan(
    subject: str = Form(...),
    weeks_available: int = Form(...),
    syllabus_file: UploadFile = File(...),
    resources_file: UploadFile = File(...)
):
    if not subject:
        raise HTTPException(status_code=400, detail="Subject is required.")
    if weeks_available <= 0:
        raise HTTPException(status_code=400, detail="Weeks available must be > 0.")
    if syllabus_file.content_type != "application/pdf" or resources_file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    syl_path = None
    res_path = None

    try:
        # Save uploaded PDFs to temp files
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_syl:
            shutil.copyfileobj(syllabus_file.file, tmp_syl)
            syl_path = tmp_syl.name
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_res:
            shutil.copyfileobj(resources_file.file, tmp_res)
            res_path = tmp_res.name

        # Extract text from PDFs
        syllabus_text = extract_text_from_pdf(syl_path)
        resources_text = extract_text_from_pdf(res_path)
        
        if not syllabus_text or not syllabus_text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from the provided syllabus PDF.")
        if not resources_text or not resources_text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from the provided resources PDF.")

        # Call Gemini
        result = generate_backlog_plan_gemini(subject, weeks_available, syllabus_text, resources_text)
        return result

    finally:
        try:
            syllabus_file.file.close()
            resources_file.file.close()
        except Exception:
            pass

        if syl_path and os.path.exists(syl_path):
            os.remove(syl_path)
        if res_path and os.path.exists(res_path):
            os.remove(res_path)
