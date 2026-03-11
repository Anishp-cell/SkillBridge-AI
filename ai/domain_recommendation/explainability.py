from ai.domain_recommendation.scorer import PRIMARY_DOMAIN_INTEREST


def generate_reason(
    domain: str,
    interest_score: float,
    readiness_score: float,
    parsed_interests: list[str] = None,
    matched_skills: list[str] = None
) -> str:
    """
    Generate a human-readable reason for why this domain was recommended.
    Uses the user's actual interests and skills rather than generic text.
    """
    domain_label = domain.replace("_", " ").title()
    parts = []

    # --- Interest explanation ---
    if interest_score > 0.5 and parsed_interests:
        # Find which of the user's interests are relevant to this domain
        readable = [i.replace("_", " ") for i in parsed_interests]
        interest_str = ", ".join(readable[:3])  # Limit to top 3 for readability
        parts.append(f"strong alignment with your interests in {interest_str}")
    elif interest_score > 0.2:
        parts.append("partial alignment with your interests")
    elif interest_score > 0:
        parts.append("some indirect alignment with your interests")

    # --- Readiness explanation ---
    if readiness_score > 0.5 and matched_skills:
        skill_str = ", ".join(s.title() for s in matched_skills[:4])
        parts.append(f"you already have foundational skills like {skill_str}")
    elif readiness_score > 0.2:
        parts.append("you have some relevant skills to build on")
    elif readiness_score > 0:
        parts.append("you have a few related skills")
    else:
        parts.append("this domain will require learning new skills")

    if not parts:
        return f"{domain_label} is a potential career path to explore."

    reason = f"{domain_label} recommended because " + " and ".join(parts) + "."
    return reason
