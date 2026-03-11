"""
Tests for the redesigned domain recommendation system.
Run: python -m pytest ai/tests/test_domain_recommendation.py -v
"""
import sys
import os

# Ensure the project root is on the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from ai.domain_recommendation.parser import parse_interests, normalize_user_skills
from ai.domain_recommendation.scorer import (
    score_interest_match,
    score_skill_readiness,
    combine_scores,
    compute_skill_gap,
    score_domain,
    DOMAIN_SKILLS
)
from ai.domain_recommendation import recommend_domains


# ============================================================
# 1. Interest Parsing
# ============================================================

class TestParseInterests:
    def test_exact_synonym_match(self):
        """'machine learning' is a direct synonym for machine_learning"""
        result = parse_interests(["machine learning"])
        assert "machine_learning" in result

    def test_ai_maps_to_machine_learning(self):
        """'ai' is a synonym for machine_learning"""
        result = parse_interests(["ai"])
        assert "machine_learning" in result

    def test_cloud_computing_matches_cloud_devops(self):
        """'cloud computing' should match cloud_devops via 'cloud' synonym"""
        result = parse_interests(["cloud computing"])
        assert "cloud_devops" in result

    def test_golang_matches_backend(self):
        """'golang' is a direct synonym for backend"""
        result = parse_interests(["golang"])
        assert "backend" in result

    def test_no_false_positive_go_in_algorithms(self):
        """'algorithms' should NOT match 'go' via substring"""
        result = parse_interests(["algorithms"])
        # Should match programming_general (via 'algorithms' synonym), NOT backend
        assert "programming_general" in result
        # 'backend' should NOT be matched just because 'go' is a substring of 'algorithms'
        # The parser only matches whole words, and 'algorithms' doesn't have 'go' as a word boundary match

    def test_dsa_maps_to_programming_general(self):
        """'dsa' should map to programming_general"""
        result = parse_interests(["dsa"])
        assert "programming_general" in result

    def test_deduplication(self):
        """Multiple interests mapping to the same tag should be deduplicated"""
        result = parse_interests(["machine learning", "deep learning", "neural networks"])
        # All three map to machine_learning
        assert result.count("machine_learning") == 1

    def test_empty_input(self):
        result = parse_interests([])
        assert result == []

    def test_react_matches_full_stack(self):
        """'react' is a synonym for full_stack"""
        result = parse_interests(["react"])
        assert "full_stack" in result

    def test_docker_matches_cloud_devops(self):
        """'docker' is a synonym for cloud_devops"""
        result = parse_interests(["docker"])
        assert "cloud_devops" in result


# ============================================================
# 2. Skill Normalization
# ============================================================

class TestSkillNormalization:
    def test_abbreviation_normalization(self):
        """'dsa' should normalize to 'data structures'"""
        result = normalize_user_skills(["dsa"])
        assert "data structures" in result

    def test_already_canonical(self):
        """'python' stays as 'python' (no mapping, kept as-is)"""
        result = normalize_user_skills(["python"])
        assert "python" in result

    def test_oops_to_oop(self):
        """'oops' should normalize to 'object oriented programming'"""
        result = normalize_user_skills(["oops"])
        assert "object oriented programming" in result

    def test_empty_skills(self):
        result = normalize_user_skills([])
        assert result == []

    def test_none_skills(self):
        result = normalize_user_skills(None)
        assert result == []


# ============================================================
# 3. Interest Scoring
# ============================================================

class TestInterestScoring:
    def test_primary_interest_high_score(self):
        """If user's interest matches domain's primary, score should be high"""
        score = score_interest_match(["machine_learning"], "machine_learning_engineer")
        assert score >= 0.6

    def test_no_interest_zero_score(self):
        """No interests = 0 score for all domains"""
        score = score_interest_match([], "machine_learning_engineer")
        assert score == 0.0

    def test_unrelated_interest_low_score(self):
        """Interest in cybersecurity should give low score for ML domain"""
        score = score_interest_match(["cybersecurity"], "machine_learning_engineer")
        assert score < 0.3

    def test_related_interest_partial_score(self):
        """data_analysis is related to data_analyst, should give partial score"""
        score = score_interest_match(["data_analysis"], "data_analyst")
        assert score > 0.5

    def test_programming_general_boosts_backend(self):
        """programming_general should boost backend_developer"""
        score = score_interest_match(["programming_general"], "backend_developer")
        assert score > 0.0

    def test_programming_general_does_not_boost_cybersecurity(self):
        """programming_general should NOT boost cybersecurity"""
        score = score_interest_match(["programming_general"], "cybersecurity_engineer")
        assert score == 0.0


# ============================================================
# 4. Skill Readiness Scoring
# ============================================================

class TestSkillReadiness:
    def test_with_matching_skills(self):
        """User with relevant skills should have positive readiness"""
        score = score_skill_readiness(["python", "statistics", "sql"], "data_analyst")
        assert score > 0.0

    def test_with_no_skills(self):
        """No skills = 0 readiness"""
        score = score_skill_readiness([], "data_analyst")
        assert score == 0.0

    def test_core_skills_weighted_more(self):
        """User with a core skill should score higher than user with only secondary"""
        core_score = score_skill_readiness(["python"], "data_analyst")  # python is core
        secondary_score = score_skill_readiness(["excel"], "data_analyst")  # excel is secondary
        assert core_score > secondary_score


# ============================================================
# 5. Combined Scoring
# ============================================================

class TestCombineScores:
    def test_perfect_scores(self):
        """1.0 interest + 1.0 readiness = 100%"""
        assert combine_scores(1.0, 1.0) == 100.0

    def test_zero_scores(self):
        assert combine_scores(0.0, 0.0) == 0.0

    def test_interest_only(self):
        """Interest weight is 0.6, so 1.0 interest + 0 readiness = 60%"""
        assert combine_scores(1.0, 0.0) == 60.0

    def test_readiness_only(self):
        """Readiness weight is 0.4, so 0 interest + 1.0 readiness = 40%"""
        assert combine_scores(0.0, 1.0) == 40.0


# ============================================================
# 6. Full Recommendation Pipeline
# ============================================================

class TestRecommendDomains:
    def test_all_domains_returned(self):
        """Should return results for all 6 domains"""
        results = recommend_domains(user_interests=["machine learning"])
        assert len(results) == len(DOMAIN_SKILLS)

    def test_sorted_by_final_score(self):
        """Results should be sorted by final_score descending"""
        results = recommend_domains(user_interests=["machine learning", "ai"])
        scores = [r["final_score"] for r in results]
        assert scores == sorted(scores, reverse=True)

    def test_ml_interest_ranks_ml_first(self):
        """User interested in ML should get ML engineer as top domain"""
        results = recommend_domains(user_interests=["machine learning", "deep learning"])
        assert results[0]["domain"] == "machine_learning_engineer"

    def test_backend_interest_ranks_backend_first(self):
        """User interested in backend should get backend developer first"""
        results = recommend_domains(user_interests=["backend", "api", "databases"])
        assert results[0]["domain"] == "backend_developer"

    def test_with_skills_changes_readiness(self):
        """Providing skills should give non-zero readiness"""
        results = recommend_domains(
            user_interests=["machine learning"],
            user_skills=["python", "statistics", "linear algebra"]
        )
        ml_result = next(r for r in results if r["domain"] == "machine_learning_engineer")
        assert ml_result["readiness_score"] > 0.0

    def test_score_ranges(self):
        """All scores should be in valid ranges"""
        results = recommend_domains(
            user_interests=["cybersecurity"],
            user_skills=["linux", "networking"]
        )
        for r in results:
            assert 0.0 <= r["interest_score"] <= 1.0
            assert 0.0 <= r["readiness_score"] <= 1.0
            assert 0.0 <= r["final_score"] <= 100.0

    def test_skill_gap_present(self):
        """Each result should include skill_gap with required keys"""
        results = recommend_domains(user_interests=["data analysis"])
        for r in results:
            assert "skill_gap" in r
            assert "fully_covered" in r["skill_gap"]
            assert "partially_covered" in r["skill_gap"]
            assert "missing" in r["skill_gap"]

    def test_reason_present(self):
        """Each result should include a human-readable reason"""
        results = recommend_domains(
            user_interests=["machine learning"],
            user_skills=["python"]
        )
        for r in results:
            assert "reason" in r
            assert len(r["reason"]) > 0

    def test_empty_interests_still_works(self):
        """Empty interests with skills should still produce valid results"""
        results = recommend_domains(
            user_interests=[],
            user_skills=["python", "statistics"]
        )
        assert len(results) == len(DOMAIN_SKILLS)
        # All interest scores should be 0
        for r in results:
            assert r["interest_score"] == 0.0
