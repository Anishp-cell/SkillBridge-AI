import re
import json
from pathlib import Path

# -----------------------
# Config loading
# -----------------------

CONFIG_PATH = Path(__file__).resolve().parents[1] / "config"

def load_interest_taxonomy():
    with open(CONFIG_PATH / "interest_taxonomy.json", "r") as f:
        return json.load(f)

def load_skill_normalization():
    with open(CONFIG_PATH / "skill_normalization.json", "r") as f:
        return json.load(f)

INTEREST_TAXONOMY = load_interest_taxonomy()
SKILL_NORMALIZATION = load_skill_normalization()

# -----------------------
# Interest Parsing
# -----------------------

def _is_whole_phrase_match(synonym: str, interest: str) -> bool:
    """
    Check if synonym appears as a whole word/phrase inside interest.
    Uses word-boundary regex to prevent 'go' matching 'algorithms'.
    """
    pattern = r'\b' + re.escape(synonym) + r'\b'
    return bool(re.search(pattern, interest))


def parse_interests(user_interests: list[str]) -> list[str]:
    """
    Map raw user interests to canonical taxonomy tags.
    Returns deduplicated list of matched canonical tags.
    """
    matched_tags = set()

    for interest in user_interests:
        interest = interest.lower().strip()
        if not interest:
            continue

        # 1. Direct synonym match (exact equality)
        found = False
        for tag, synonyms in INTEREST_TAXONOMY.items():
            if interest in synonyms:
                matched_tags.add(tag)
                found = True
                break

        if found:
            continue

        # 2. Whole-phrase matching fallback
        #    Only match if the synonym appears as complete words
        #    e.g. "cloud computing" matches "cloud" but "algorithms" does NOT match "go"
        for tag, synonyms in INTEREST_TAXONOMY.items():
            for synonym in synonyms:
                if len(synonym) >= 2 and _is_whole_phrase_match(synonym, interest):
                    matched_tags.add(tag)
                    found = True
                    break
            if found:
                break

    return list(matched_tags)


# -----------------------
# Skill Normalization
# -----------------------

def normalize_user_skills(user_skills: list[str]) -> list[str]:
    """
    Normalize user-provided skill strings using skill_normalization.json.
    Returns deduplicated list of canonical skill names.
    """
    normalized = set()

    for skill in (user_skills or []):
        skill_lower = skill.lower().strip()
        if skill_lower in SKILL_NORMALIZATION:
            normalized.add(SKILL_NORMALIZATION[skill_lower])
        else:
            # Keep as-is if no normalization mapping exists
            normalized.add(skill_lower)

    return list(normalized)
