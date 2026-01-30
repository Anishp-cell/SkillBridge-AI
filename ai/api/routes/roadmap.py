import shutil
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from ai.api.services.pipeline import run_full_pipeline

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


@router.post("/generate")
def generate_roadmap(
    syllabus: UploadFile = File(...),
    interests: list[str] = Form(...),
    weekly_hours: int = Form(...),
    duration_weeks: int = Form(...)
):
    if syllabus.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    syllabus_path = None

    try:
        # 1️⃣ Save uploaded PDF to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(syllabus.file, tmp)
            syllabus_path = tmp.name

        # 2️⃣ Run full pipeline
        result = run_full_pipeline(
            syllabus_path=syllabus_path,
            interests=interests,
            weekly_hours=weekly_hours,
            duration_weeks=duration_weeks
        )

        return result

    finally:
        # ✅ Explicitly close and clean resources (Cloud Run safe)
        try:
            syllabus.file.close()
        except Exception:
            pass

        if syllabus_path and os.path.exists(syllabus_path):
            os.remove(syllabus_path)
