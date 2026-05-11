from __future__ import annotations

from app.models.typec_sandbox_models import TypeCSandboxStrategy


def choose_best_strategy(strategies: list[TypeCSandboxStrategy]) -> str | None:
    if not strategies:
        return None
    best = sorted(
        strategies,
        key=lambda strategy: (
            -strategy.confidence,
            len(strategy.risks),
            strategy.title,
        ),
    )[0]
    return best.id


def summarize_sandbox(strategies: list[TypeCSandboxStrategy], best_strategy_id: str | None) -> str:
    if not strategies:
        return "Sandbox produced no strategic alternatives; the real system was not changed."
    best = next((strategy for strategy in strategies if strategy.id == best_strategy_id), strategies[0])
    return (
        f"Sandbox explored {len(strategies)} reversible strategic future"
        f"{'' if len(strategies) == 1 else 's'}. Strongest candidate: {best.title}."
    )
