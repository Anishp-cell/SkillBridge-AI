def build_user_prompt(payload: dict) -> str:
    return f"""
Generate a learning roadmap using the following data:

Domain: {payload['domain']}
Readiness score: {payload['readiness_score']}
Fully covered skills: {payload['fully_covered']}
Partially covered skills: {payload['partially_covered']}
Missing skills: {payload['missing_skills']}
Weekly available hours: {payload['weekly_hours']}
Total duration (weeks): {payload['duration_weeks']}

Constraints:
- Prioritize missing skills first
- Reinforce partially covered skills
- Skip fully covered skills
- Each week must have clear deliverables
- Keep difficulty progressive

Return ONLY valid JSON following the predefined schema.
"""
