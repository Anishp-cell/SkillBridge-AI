import json
from pathlib import Path

from ai.config.weights import (
    INTEREST_WEIGHT,
    READINESS_WEIGHT,
    SKILL_WEIGHTS,
    ROUNDING_PRECISION
)

# -----------------------
# Interest-domain mappings
# -----------------------

# Each domain's primary interest (strongest signal)
PRIMARY_DOMAIN_INTEREST = {
    "machine_learning_engineer": "machine_learning",
    "data_analyst": "data_analysis",
    "backend_developer": "backend",
    "full_stack_developer": "full_stack",
    "cybersecurity_engineer": "cybersecurity",
    "cloud_devops_engineer": "cloud_devops"
}

# Each domain's related interests (includes primary + secondary signals)
DOMAIN_INTEREST_MAP = {
    "machine_learning_engineer": ["machine_learning", "data_analysis", "programming_general"],
    "data_analyst": ["data_analysis", "machine_learning"],
    "backend_developer": ["backend", "programming_general"],
    "full_stack_developer": ["backend", "full_stack", "programming_general"],
    "cybersecurity_engineer": ["cybersecurity"],
    "cloud_devops_engineer": ["cloud_devops", "backend"]
}

# -----------------------
# Load domain skill config
# -----------------------

CONFIG_PATH = Path(__file__).resolve().parents[1] / "config"

def load_domain_skills():
    with open(CONFIG_PATH / "domain_skills.json", "r") as f:
        return json.load(f)

DOMAIN_SKILLS = load_domain_skills()

# -----------------------
# Interest score
# -----------------------

def score_interest_match(parsed_interests: list[str], domain: str) -> float:
    """
    Score how well the user's interests align with a given domain.
    
    Strategy: For each domain, check how many of its mapped interests 
    the user expressed. This way, a user with diverse interests is NOT
    penalized — each domain is scored independently.
    
    Returns a score in [0, 1].
    """
    if not parsed_interests:
        return 0.0

    domain_interests = DOMAIN_INTEREST_MAP.get(domain, [])
    primary_interest = PRIMARY_DOMAIN_INTEREST.get(domain)

    if not domain_interests:
        return 0.0

    user_interest_set = set(parsed_interests)

    # Count matches
    primary_match = primary_interest in user_interest_set
    related_matches = sum(1 for i in domain_interests if i in user_interest_set and i != primary_interest)

    # Score: primary match is worth full credit, related matches are partial
    score = 0.0
    if primary_match:
        score += 0.7  # Strong signal: user's interest directly maps to this domain
    
    # Related matches contribute the remaining 0.3, scaled by how many matched
    non_primary = [i for i in domain_interests if i != primary_interest]
    if non_primary:
        related_ratio = related_matches / len(non_primary)
        score += 0.3 * related_ratio

    return min(score, 1.0)


# -----------------------
# Skill readiness score
# -----------------------

def score_skill_readiness(normalized_skills: list[str], domain: str) -> float:
    """
    Compute how ready the user is for a domain based on their current skills.
    Core skills are weighted more heavily than secondary skills.
    
    Returns a score in [0, 1].
    """
    if domain not in DOMAIN_SKILLS:
        return 0.0

    domain_data = DOMAIN_SKILLS[domain]
    user_skill_set = set(normalized_skills)

    score = 0.0
    max_score = 0.0

    for level in ["core", "secondary"]:
        weight = SKILL_WEIGHTS[level]
        for skill in domain_data.get(level, []):
            max_score += weight
            if skill in user_skill_set:
                score += weight

    return round(score / max_score, ROUNDING_PRECISION) if max_score > 0 else 0.0


# -----------------------
# Combine interest + readiness
# -----------------------

def combine_scores(interest_score: float, readiness_score: float) -> float:
    """
    Weighted combination of interest and readiness.
    Returns final score as a percentage [0, 100].
    """
    final = (INTEREST_WEIGHT * interest_score) + (READINESS_WEIGHT * readiness_score)
    return round(final * 100, ROUNDING_PRECISION)


# -----------------------
# Skill gap analysis
# -----------------------

def compute_skill_gap(normalized_skills: list[str], domain: str) -> dict:
    """
    Determine which domain skills the user has fully covered,
    partially covered (close match), or is missing entirely.
    """
    if domain not in DOMAIN_SKILLS:
        return {
            "fully_covered": [],
            "partially_covered": [],
            "missing": []
        }

    domain_data = DOMAIN_SKILLS[domain]
    user_skill_set = set(normalized_skills)

    fully_covered = []
    missing = []

    for level in ["core", "secondary"]:
        for skill in domain_data.get(level, []):
            if skill in user_skill_set:
                fully_covered.append(skill)
            else:
                missing.append(skill)

    return {
        "fully_covered": fully_covered,
        "partially_covered": [],  # Can be enhanced later with fuzzy matching
        "missing": missing
    }


# -----------------------
# Final domain scoring API
# -----------------------

def score_domain(
    domain: str,
    parsed_interests: list[str],
    normalized_skills: list[str] = None,
    readiness_score: float = None
) -> dict:
    """
    Single entry point for scoring a domain.
    
    If readiness_score is provided (e.g. from syllabus analysis), use it directly.
    Otherwise, compute it from normalized_skills.
    """
    interest_score = score_interest_match(parsed_interests, domain)

    if readiness_score is None:
        readiness_score = score_skill_readiness(normalized_skills or [], domain)

    final_score = combine_scores(interest_score, readiness_score)
    skill_gap = compute_skill_gap(normalized_skills or [], domain)

    return {
        "domain": domain,
        "interest_score": round(interest_score, ROUNDING_PRECISION),
        "readiness_score": round(readiness_score, ROUNDING_PRECISION),
        "final_score": final_score,
        "skill_gap": skill_gap
    }
