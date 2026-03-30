"""Deterministic strategy synthesis from system intelligence signals."""

from __future__ import annotations

from typing import Any

from engines.scenario_simulation.scenario_action_models import ScenarioActionIntent
from engines.strategy_generation.strategy_models import GeneratedStrategy, StrategyGenerationInput
from engines.strategy_generation.strategy_policy import derive_object_label


def _normalize_id(value: Any) -> str | None:
    normalized = str(value or "").strip()
    return normalized or None


def _top_by_role(intelligence: dict[str, Any], role: str) -> dict[str, Any] | None:
    items = [item for item in (intelligence.get("object_insights", []) or []) if str(item.get("role")) == role]
    ranked = sorted(items, key=lambda item: float(item.get("strategic_priority", 0.0)), reverse=True)
    return ranked[0] if ranked else None


def _top_fragile(intelligence: dict[str, Any]) -> dict[str, Any] | None:
    items = intelligence.get("object_insights", []) or []
    ranked = sorted(
        items,
        key=lambda item: (
            float(item.get("fragility_score", 0.0) or 0.0),
            float(item.get("pressure_score", 0.0)),
        ),
        reverse=True,
    )
    return ranked[0] if ranked else None


def _top_pressure(intelligence: dict[str, Any]) -> dict[str, Any] | None:
    items = intelligence.get("object_insights", []) or []
    ranked = sorted(
        items,
        key=lambda item: (
            float(item.get("pressure_score", 0.0)),
            float(item.get("strategic_priority", 0.0)),
        ),
        reverse=True,
    )
    return ranked[0] if ranked else None


def _build_action(
    *,
    strategy_id: str,
    action_kind: str,
    source_object_id: str,
    label: str,
    description: str,
    requested_outputs: list[str],
    intensity: float,
    focus: str,
) -> ScenarioActionIntent:
    return ScenarioActionIntent(
        action_id=f"{strategy_id}:action:0",
        action_kind=action_kind,  # type: ignore[arg-type]
        source_object_id=source_object_id,
        label=label,
        description=description,
        parameters={
            "intensity": intensity,
            "generated_by": "strategy_generation_v1",
            "preferred_focus": focus,
        },
        mode="what_if" if "propagation" in requested_outputs else "decision_path",
        requested_outputs=requested_outputs,
        priority=850,
    )


def generate_candidate_strategies(input_data: StrategyGenerationInput) -> list[GeneratedStrategy]:
    intelligence = input_data.intelligence.model_dump(mode="python")
    constraints = input_data.constraints
    preferred_focus = constraints.preferredFocus
    candidates: list[GeneratedStrategy] = []
    seen_source_and_kind: set[tuple[str, str]] = set()

    bottleneck = _top_by_role(intelligence, "bottleneck")
    leverage = _top_by_role(intelligence, "leverage")
    fragile = _top_fragile(intelligence)
    pressure = _top_pressure(intelligence)

    def add_candidate(
        kind: str,
        object_row: dict[str, Any] | None,
        *,
        title: str,
        description: str,
        rationale: str,
        action_kind: str,
        outputs: list[str],
        intensity: float,
    ) -> None:
        if not object_row:
            return
        object_id = _normalize_id(object_row.get("object_id"))
        if not object_id:
            return
        dedupe_key = (kind, object_id)
        if dedupe_key in seen_source_and_kind:
            return
        seen_source_and_kind.add(dedupe_key)
        strategy_id = f"strategy:{kind}:{object_id}"
        candidates.append(
            GeneratedStrategy(
                strategy_id=strategy_id,
                title=title.format(label=derive_object_label(object_id)),
                description=description.format(label=derive_object_label(object_id)),
                actions=[
                    _build_action(
                        strategy_id=strategy_id,
                        action_kind=action_kind,
                        source_object_id=object_id,
                        label=title.format(label=derive_object_label(object_id)),
                        description=description.format(label=derive_object_label(object_id)),
                        requested_outputs=outputs,
                        intensity=intensity,
                        focus=preferred_focus,
                    )
                ],
                expected_focus=object_id,
                rationale=rationale.format(label=derive_object_label(object_id)),
            )
        )

    add_candidate(
        "bottleneck_relief",
        bottleneck,
        title="Relieve {label} bottleneck",
        description="Reduce pressure and inspect the downstream consequence path from {label}.",
        rationale="{label} is the strongest bottleneck in the current system reading.",
        action_kind="stress_reduce",
        outputs=["propagation", "decision_path"],
        intensity=0.46,
    )
    add_candidate(
        "leverage_amplify",
        leverage,
        title="Amplify {label} leverage",
        description="Apply a strategic intervention around {label} to improve system control and downstream flow.",
        rationale="{label} appears as the highest-leverage object available for strategic gain.",
        action_kind="strategy_apply",
        outputs=["propagation", "decision_path"],
        intensity=0.62,
    )
    add_candidate(
        "fragility_shield",
        fragile,
        title="Protect {label} fragility zone",
        description="Stabilize {label} before pressure spreads into a wider fragility surface.",
        rationale="{label} carries the highest fragility signal in the current system reading.",
        action_kind="stress_reduce",
        outputs=["propagation"],
        intensity=0.42,
    )
    add_candidate(
        "flow_optimize",
        pressure,
        title="Optimize flow from {label}",
        description="Re-route pressure around {label} and inspect the strongest consequence paths.",
        rationale="{label} is the most active pressure source and a natural flow-optimization candidate.",
        action_kind="strategy_apply",
        outputs=["propagation", "decision_path"],
        intensity=0.58,
    )

    return candidates[: constraints.maxStrategies]
