import json
import logging

from ai.syllabus_intelligence.pdf_extractor import extract_text_from_pdf
from ai.syllabus_intelligence.text_cleaner import clean_syllabus_text
from ai.syllabus_intelligence.topic_extractor import (
    split_into_courses,
    extract_topics_from_unit
)
from ai.syllabus_intelligence.unit_parser import split_into_units
from ai.syllabus_intelligence.skill_mapper import normalize_topics

from ai.domain_recommendation.parser import recommend_domains
from ai.roadmap.generator import generate_learning_roadmap
from ai.exports.sheet_exporter import export_roadmap_to_sheets

# Configure logging
logger = logging.getLogger(__name__)

def run_full_pipeline(
    syllabus_path: str,
    interests: list[str],
    weekly_hours: int,
    duration_weeks: int
):
    logger.info(f"Starting pipeline for syllabus: {syllabus_path}")

    # --------------------------------------------------
    # 1️⃣ Extract & clean syllabus
    # --------------------------------------------------
    raw = extract_text_from_pdf(syllabus_path)
    clean = clean_syllabus_text(raw)
    courses = split_into_courses(clean)

    if not courses:
        logger.warning("No courses detected by pattern matcher. Using full text as fallback.")
        courses = {"Detected Course": clean}

    unit_skill_map = {}

    for course_name, course_text in courses.items():
        units = split_into_units(course_text)
        if not units:
            units = {f"{course_name} - Content": course_text}

        for unit_name, text in units.items():
            raw_topics = extract_topics_from_unit(text)
            skills = normalize_topics(raw_topics)
            if skills:
                unit_skill_map[f"{course_name} : {unit_name}"] = skills

    if not unit_skill_map:
        unit_skill_map["Unknown"] = []

    # --------------------------------------------------
    # 2️⃣ Domain recommendation (SAFE SELECTION)
    # --------------------------------------------------
    domain_results = recommend_domains(
        user_interests=interests,
        unit_skill_map=unit_skill_map
    )

    if not domain_results:
        logger.error("No domain recommendations generated.")
        raise ValueError("No domain recommendations generated")

    # 🚨 IMPORTANT FIX:
    # If all domains score 0 → pick based on interests only
    top_domain = max(
        domain_results,
        key=lambda d: (d["interest_score"], d["final_score"])
    )

    logger.info("====== DOMAIN RECOMMENDATION ======")
    for d in domain_results:
        logger.info(
            f"{d['domain']} | "
            f"interest={d['interest_score']} | "
            f"readiness={d['readiness_score']} | "
            f"final={d['final_score']}"
        )
    logger.info(f"SELECTED DOMAIN: {top_domain['domain']}")
    logger.info("=================================")

    # --------------------------------------------------
    # 3️⃣ Roadmap generation (resources attached internally)
    # --------------------------------------------------
    roadmap = generate_learning_roadmap({
        "domain": top_domain["domain"],
        "readiness_score": top_domain["readiness_score"],
        "fully_covered": top_domain["skill_gap"]["fully_covered"],
        "partially_covered": top_domain["skill_gap"]["partially_covered"],
        "missing_skills": top_domain["skill_gap"]["missing"],
        "weekly_hours": weekly_hours,
        "duration_weeks": duration_weeks
    })

    logger.info("====== FINAL ROADMAP OBJECT ======")
    logger.info(json.dumps(roadmap, indent=2))
    logger.info("=================================")

    # 🚨 CRITICAL FRONTEND SYNC: 
    # The frontend expects 'totalDurationWeeks' and 'weeklyHours' inside the roadmap object.
    # It also currently expects a 'phases' structure, but Gemini returns a flat 'weeks' array.
    
    roadmap["totalDurationWeeks"] = duration_weeks
    roadmap["weeklyHours"] = weekly_hours
    
    if "weeks" in roadmap and "phases" not in roadmap:
        # Simple grouping logic: every 4 weeks is a phase, or just one phase if short
        weeks = roadmap["weeks"]
        phases = []
        phase_size = 4
        for i in range(0, len(weeks), phase_size):
            chunk = weeks[i : i + phase_size]
            phases.append({
                "phaseName": f"Phase {len(phases) + 1}",
                "weeklyPlan": [
                    {
                        "week": w["weekNumber"],
                        "topic": w["title"],
                        "skillsCovered": w["skillsCovered"],
                        "deliverable": w.get("actionItems", ["Complete week objectives"])[0] if w.get("actionItems") else "Weekly review",
                        "learning_resources": w.get("learning_resources", []) 
                    } for w in chunk
                ]
            })
        roadmap["phases"] = phases
    # --------------------------------------------------
    # 4️⃣ Export to Google Sheets
    # --------------------------------------------------
    sheet_url = "skipped-due-to-error"
    try:
        sheet_url = export_roadmap_to_sheets(roadmap)
    except Exception as e:
        logger.error(f"Sheet export failed, returning without sheet URL. Error: {e}")

    return {
        "domain": top_domain["domain"],
        "readiness_score": top_domain["readiness_score"],
        "match_score": top_domain["final_score"], # Return overall score (Interests + Syllabus)
        "google_sheet_url": sheet_url,
        "missing_skills": top_domain["skill_gap"]["missing"],
        "roadmap": roadmap
    }
