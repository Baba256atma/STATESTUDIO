from __future__ import annotations

from app.models.typec_sandbox_models import TypeCSandboxRequest, TypeCSandboxResult
from app.services.typec_sandbox.sandbox_clone import clone_scene_snapshot
from app.services.typec_sandbox.sandbox_evaluator import choose_best_strategy, summarize_sandbox
from app.services.typec_sandbox.strategy_generator import generate_sandbox_strategies


def run_typec_sandbox(request: TypeCSandboxRequest) -> TypeCSandboxResult:
    sandbox_scene = clone_scene_snapshot(request.sceneSnapshot)
    strategies = generate_sandbox_strategies(sandbox_scene)
    best_strategy_id = choose_best_strategy(strategies)
    return TypeCSandboxResult(
        strategies=strategies,
        bestStrategyId=best_strategy_id,
        summary=summarize_sandbox(strategies, best_strategy_id),
    )
