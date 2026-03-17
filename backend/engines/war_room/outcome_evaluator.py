"""Outcome aggregation for the war-room engine."""

from __future__ import annotations

from collections import Counter

from backend.engines.war_room.war_room_schema import (
    DominantStrategy,
    WarRoomActor,
    WarRoomActorOutcome,
    WarRoomStrategy,
)


class WarRoomOutcomeEvaluator:
    """Evaluate actor payoffs and identify dominant strategy outcomes."""

    def evaluate_actor_outcomes(
        self,
        *,
        actors: list[WarRoomActor],
        strategy_history: dict[str, list[WarRoomStrategy]],
        final_state: dict[str, float],
        baseline_stability: float,
        final_stability: float,
        conflict_count: int,
    ) -> list[WarRoomActorOutcome]:
        """Aggregate actor outcomes over the full simulation horizon."""
        outcomes: list[WarRoomActorOutcome] = []
        for actor in actors:
            history = strategy_history.get(actor.id, [])
            strategy_names = [item.name for item in history]
            selected_strategy = Counter(strategy_names).most_common(1)[0][0] if strategy_names else "none"
            payoff = self._payoff(actor, final_state, final_stability, conflict_count)
            risk_exposure = self._risk(actor, final_state, conflict_count)
            outcomes.append(
                WarRoomActorOutcome(
                    actor_id=actor.id,
                    selected_strategy=selected_strategy,
                    payoff=payoff,
                    risk_exposure=risk_exposure,
                    stability_impact=round(final_stability - baseline_stability, 4),
                    strategy_history=strategy_names,
                )
            )
        return outcomes

    def dominant_strategy(self, outcomes: list[WarRoomActorOutcome]) -> DominantStrategy | None:
        """Return the strongest actor strategy observed."""
        if not outcomes:
            return None
        ranked = sorted(
            outcomes,
            key=lambda item: (item.payoff - item.risk_exposure + (0.5 * item.stability_impact)),
            reverse=True,
        )
        winner = ranked[0]
        score = round(winner.payoff - winner.risk_exposure + (0.5 * winner.stability_impact), 4)
        return DominantStrategy(
            actor_id=winner.actor_id,
            strategy=winner.selected_strategy,
            reason=(
                f"{winner.selected_strategy} produced the strongest payoff to risk trade-off "
                f"with payoff {winner.payoff:.2f} and risk {winner.risk_exposure:.2f}."
            ),
            score=score,
        )

    def _payoff(self, actor: WarRoomActor, final_state: dict[str, float], final_stability: float, conflict_count: int) -> float:
        value = 0.4 * final_stability
        if actor.type.lower() in {"company", "competitor", "market"}:
            value += 0.2 * final_state.get("demand", 0.5)
            value += 0.15 * final_state.get("margin", 0.5)
        if actor.type.lower() == "government":
            value += 0.2 * final_state.get("legitimacy", 0.5)
        if actor.type.lower() in {"company", "alliance"}:
            value += 0.15 * final_state.get("reliability", 0.5)
        value -= min(conflict_count * 0.02, 0.15)
        return round(min(max(value, 0.0), 1.0), 4)

    def _risk(self, actor: WarRoomActor, final_state: dict[str, float], conflict_count: int) -> float:
        value = (
            0.35 * final_state.get("system risk", final_state.get("security risk", 0.3))
            + 0.25 * final_state.get("system pressure", 0.35)
            + 0.2 * final_state.get("operational cost", 0.4)
            + min(conflict_count * 0.03, 0.2)
        )
        if actor.type.lower() == "government":
            value += 0.15 * (1.0 - final_state.get("legitimacy", 0.5))
        return round(min(max(value, 0.0), 1.0), 4)
