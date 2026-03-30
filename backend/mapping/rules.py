"""Role assignment rules for the Nexora mapping engine."""

from __future__ import annotations

from typing import Any


def classify_role(rank: int, score: float, direct_match_count: int) -> str | None:
    """Return the deterministic role for one ranked object match."""
    if score >= 0.68 and rank < 2 and direct_match_count > 0:
        return "primary"
    if score >= 0.4 and rank < 5:
        return "affected"
    if score >= 0.2 and rank < 7:
        return "context"
    return None


def limit_role_buckets(impacts_by_role: dict[str, list[Any]]) -> dict[str, list[Any]]:
    """Keep the mapping focused and deterministic."""
    return {
        "primary": impacts_by_role.get("primary", [])[:2],
        "affected": impacts_by_role.get("affected", [])[:3],
        "context": impacts_by_role.get("context", [])[:3],
    }
