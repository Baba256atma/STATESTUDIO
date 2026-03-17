"""Rank evaluated strategies and select a recommendation."""

from __future__ import annotations

from backend.engines.decision_engine.decision_schema import RecommendedAction, StrategyEvaluation


class DecisionRanker:
    """Rank strategies using weighted evaluation output."""

    def rank(self, strategies: list[StrategyEvaluation]) -> list[StrategyEvaluation]:
        """Return strategies ordered from strongest to weakest."""
        return sorted(
            strategies,
            key=lambda item: (item.decision_score, item.stability_score, item.resilience_score, -item.risk, -item.cost),
            reverse=True,
        )

    def recommend(self, strategies: list[StrategyEvaluation]) -> RecommendedAction | None:
        """Return the top-ranked strategy recommendation."""
        ranked = self.rank(strategies)
        if not ranked:
            return None
        winner = ranked[0]
        return RecommendedAction(
            id=winner.id,
            reason=(
                f"{winner.id} offers the strongest trade-off with stability {winner.stability_score:.2f}, "
                f"resilience {winner.resilience_score:.2f}, risk {winner.risk:.2f}, and cost {winner.cost:.2f}."
            ),
        )
