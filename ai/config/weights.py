# -------------------------------
# SkillBridge AI - Scoring Weights
# -------------------------------

# Primary scoring weights (must sum to 1.0)
INTEREST_WEIGHT = 0.6
READINESS_WEIGHT = 0.4

# Skill-level importance (core skills worth more than secondary)
SKILL_WEIGHTS = {
    "core": 2.0,
    "secondary": 1.0
}

# Interest scoring parameters
INTEREST_SCORING = {
    "exact_match": 1.0,
    "partial_match": 0.5
}

# Score normalization
NORMALIZATION = {
    "min_score": 0.0,
    "max_score": 1.0
}

# Output formatting
ROUNDING_PRECISION = 2
