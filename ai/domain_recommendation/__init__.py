from ai.domain_recommendation.parser import parse_interests, normalize_user_skills
from ai.domain_recommendation.scorer import score_domain, DOMAIN_SKILLS
from ai.domain_recommendation.explainability import generate_reason
from ai.skill_gap.gap_analyzer import build_skill_frequency, analyze_skill_gap


def recommend_domains(
    user_interests: list[str],
    user_skills: list[str] = None,
    unit_skill_map: dict = None
):
    """
    SINGLE authoritative domain recommender.

    Two modes of operation:
    1. Initial recommendation (API route):
       - user_interests + user_skills → interest score + skill-based readiness
    2. Pipeline recommendation (after syllabus upload):
       - user_interests + unit_skill_map → interest score + syllabus-based readiness

    Returns a list of all domains sorted by final_score (descending).
    """
    parsed_interests = parse_interests(user_interests)
    normalized_skills = normalize_user_skills(user_skills) if user_skills else []

    results = []

    for domain in DOMAIN_SKILLS.keys():

        if unit_skill_map is not None:
            # --- Pipeline mode: compute readiness from syllabus ---
            domain_data = DOMAIN_SKILLS[domain]
            required_skills = (
                domain_data.get("core", []) +
                domain_data.get("secondary", [])
            )
            skill_freq = build_skill_frequency(unit_skill_map)
            gap_result = analyze_skill_gap(
                domain_skills=required_skills,
                skill_freq=skill_freq
            )
            scored = score_domain(
                domain=domain,
                parsed_interests=parsed_interests,
                normalized_skills=normalized_skills,
                readiness_score=gap_result["readiness_score"]
            )
            # Use syllabus-derived skill gap
            scored["skill_gap"] = gap_result
        else:
            # --- API mode: compute readiness from user-provided skills ---
            scored = score_domain(
                domain=domain,
                parsed_interests=parsed_interests,
                normalized_skills=normalized_skills
            )

        # Generate contextual reason
        scored["reason"] = generate_reason(
            domain=domain,
            interest_score=scored["interest_score"],
            readiness_score=scored["readiness_score"],
            parsed_interests=parsed_interests,
            matched_skills=scored["skill_gap"]["fully_covered"]
        )

        results.append(scored)

    # Sort by final_score descending
    results.sort(key=lambda x: x["final_score"], reverse=True)

    return results
