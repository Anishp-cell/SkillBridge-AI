from ai.domain_recommendation.parser import parse_interests
from ai.domain_recommendation.scorer import score_domain, DOMAIN_SKILLS
from ai.domain_recommendation.explainability import generate_reason


def calculate_skill_gap(user_skills, domain):
    """
    Calculate which skills are covered, partially covered, or missing
    for a given domain based on user's current skills.
    """
    if domain not in DOMAIN_SKILLS:
        return {
            "fully_covered": [],
            "partially_covered": [],
            "missing": []
        }
    
    domain_data = DOMAIN_SKILLS[domain]
    user_skill_set = set(skill.lower() for skill in (user_skills or []))
    
    fully_covered = []
    missing = []
    
    # Check core skills
    for skill in domain_data.get("core", []):
        if skill.lower() in user_skill_set:
            fully_covered.append(skill)
        else:
            missing.append(skill)
    
    # Check secondary skills
    for skill in domain_data.get("secondary", []):
        if skill.lower() in user_skill_set:
            fully_covered.append(skill)
        else:
            missing.append(skill)
    
    return {
        "fully_covered": fully_covered,
        "partially_covered": [],  # Can be enhanced later with fuzzy matching
        "missing": missing
    }


def recommend_domains(user_interests, user_skills=None, syllabus_score=0.0):
    """
    SINGLE authoritative domain recommender.
    Interests have PRIORITY over syllabus.
    """

    parsed_interests = parse_interests(user_interests)

    results = []

    for domain in DOMAIN_SKILLS.keys():
        scored = score_domain(
            domain=domain,
            parsed_interests=parsed_interests,
            readiness_score=syllabus_score
        )

        scored["reason"] = generate_reason(
            domain,
            scored["interest_score"],
            scored["readiness_score"]
        )
        
        # Add skill gap analysis
        scored["skill_gap"] = calculate_skill_gap(user_skills, domain)

        results.append(scored)

    # 🔥 CRITICAL FIX:
    # Sort ONLY by interest_score first
    results.sort(
        key=lambda x: (
            x["interest_score"],
            x["final_score"]
        ),
        reverse=True
    )

    return results
