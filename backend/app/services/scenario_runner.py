"""Core deterministic scenario runner for Scenario Studio MVP."""

from __future__ import annotations

from typing import Any

from app.models.scenario import (
    ScenarioEvent,
    ScenarioParameters,
    ScenarioRunResult,
    ScenarioShock,
    ScenarioState,
    ScenarioTick,
)
from app.services.scenario_shocks import apply_shock_to_state
from app.services.scenario_summary import build_scenario_summary
from app.services.scenario_transitions import update_state_for_tick


def _clamp_unit(value: float) -> float:
    """Clamp a numeric value into the normalized scenario range."""
    return max(0.0, min(1.0, value))


def _normalize_state(base_state: Any) -> ScenarioState:
    """Normalize a base state payload into a ScenarioState instance."""
    if isinstance(base_state, ScenarioState):
        return base_state.model_copy(deep=True)
    return ScenarioState.model_validate(base_state)


def clone_state(state: ScenarioState) -> ScenarioState:
    """Return a deep copy of the current scenario state."""
    return state.model_copy(deep=True)


def _normalize_shocks(shocks: list[Any] | None) -> list[ScenarioShock]:
    """Normalize incoming shocks into ScenarioShock models when possible."""
    normalized: list[ScenarioShock] = []
    for shock in shocks or []:
        if isinstance(shock, ScenarioShock):
            normalized.append(shock.model_copy(deep=True))
            continue
        normalized.append(ScenarioShock.model_validate(shock))
    return normalized


def _normalize_parameters(parameters: Any, shocks: list[ScenarioShock]) -> ScenarioParameters:
    """Normalize run parameters and bind the resolved shock list."""
    if isinstance(parameters, ScenarioParameters):
        normalized = parameters.model_copy(deep=True)
    else:
        payload = dict(parameters or {})
        payload["shocks"] = payload.get("shocks") or shocks
        normalized = ScenarioParameters.model_validate(payload)

    if shocks:
        normalized.shocks = shocks
    return normalized


def _is_shock_active(shock: ScenarioShock, tick: int) -> bool:
    """Return whether a shock should apply during the current tick."""
    return shock.start_tick <= tick < shock.start_tick + shock.duration_ticks


def _to_event_models(events: list[dict[str, Any]]) -> list[ScenarioEvent]:
    """Convert raw event payloads into validated ScenarioEvent models."""
    return [ScenarioEvent.model_validate(event) for event in events]


def _build_tick_parameters(parameters: ScenarioParameters, tick: int) -> dict[str, Any]:
    """Build per-tick transition parameters."""
    return {
        "tick": tick,
        "time_steps": parameters.time_steps,
        "stop_on_critical": parameters.stop_on_critical,
        "scenario_name": parameters.scenario_name,
    }


def determine_outcome(state: ScenarioState) -> str:
    """Classify the final run outcome from the resulting business state."""
    if (
        state.fragility >= 0.9
        or state.risk >= 0.9
        or state.inventory <= 0.1
        or state.delivery <= 0.1
    ):
        return "collapse"
    if state.fragility <= 0.35 and state.risk <= 0.35 and state.inventory >= 0.55 and state.delivery >= 0.55:
        return "stabilized"
    return "unstable"


def _compute_stability_score(state: ScenarioState) -> float:
    """Compute a simple stability score from the final business state."""
    return _clamp_unit(
        (
            state.inventory
            + state.delivery
            + (1.0 - state.risk)
            + (1.0 - state.fragility)
            + (1.0 - state.volatility)
        )
        / 5.0
    )


def build_tick_snapshot(
    tick: int,
    state: ScenarioState,
    events: list[ScenarioEvent] | None = None,
) -> ScenarioTick:
    """Build a complete tick snapshot from state and validated events."""
    return ScenarioTick(
        tick=tick,
        state=clone_state(state),
        events=list(events or []),
    )


def _apply_active_shocks(
    state: ScenarioState,
    shocks: list[ScenarioShock],
    tick: int,
) -> tuple[ScenarioState, list[dict[str, Any]]]:
    """Apply all active shocks for the current tick."""
    next_state = clone_state(state)
    tick_events: list[dict[str, Any]] = []

    for shock in shocks:
        if not _is_shock_active(shock, tick):
            continue
        next_state, shock_events = apply_shock_to_state(next_state, shock)
        for event in shock_events:
            event["tick"] = tick
        tick_events.extend(shock_events)

    return next_state, tick_events


def _evaluate_tick_extensions(
    state: ScenarioState,
    tick: int,
    parameters: ScenarioParameters,
) -> tuple[ScenarioState, list[dict[str, Any]]]:
    """Provide stable extension seams for future Scenario Studio systems."""
    next_state = clone_state(state)
    extension_events: list[dict[str, Any]] = []

    # Future loop evaluation can attach here once loop contracts are finalized.
    # Future risk propagation can attach here once propagation contracts are stabilized.
    # Keep the MVP path deterministic and side-effect free for now.
    _ = tick
    _ = parameters

    return next_state, extension_events


def _build_stop_event(tick: int, state: ScenarioState) -> ScenarioEvent:
    """Build the event emitted when the run stops on critical fragility."""
    return ScenarioEvent(
        tick=tick,
        event_type="threshold_warning",
        severity="critical",
        message="Scenario runner stopped early because fragility reached a critical level.",
        metric="fragility",
        value=state.fragility,
    )


def _build_summary_event(tick: int, summary: dict[str, str], state: ScenarioState) -> ScenarioEvent:
    """Build the final manager-facing event attached to the run result."""
    outcome = summary.get("outcome", "unstable")
    severity = "medium" if outcome == "unstable" else "high" if outcome == "collapse" else "low"
    return ScenarioEvent(
        tick=tick,
        event_type="runner_note",
        severity=severity,
        message=summary.get("key_message", "Scenario completed."),
        metric="fragility",
        value=state.fragility,
    )


def run_scenario(
    base_state: Any,
    shocks: list[Any] | None,
    parameters: Any,
) -> ScenarioRunResult:
    """Run a deterministic multi-tick business scenario."""
    initial_state = _normalize_state(base_state)
    normalized_shocks = _normalize_shocks(shocks)
    normalized_parameters = _normalize_parameters(parameters, normalized_shocks)

    tick_models: list[ScenarioTick] = [build_tick_snapshot(0, initial_state)]
    all_events: list[ScenarioEvent] = []
    current_state = clone_state(initial_state)

    for tick in range(1, normalized_parameters.time_steps + 1):
        current_state, shock_events = _apply_active_shocks(
            current_state,
            normalized_parameters.shocks,
            tick,
        )

        current_state, transition_events = update_state_for_tick(
            current_state,
            _build_tick_parameters(normalized_parameters, tick),
        )

        current_state, extension_events = _evaluate_tick_extensions(
            current_state,
            tick,
            normalized_parameters,
        )

        tick_event_models = _to_event_models(shock_events + transition_events + extension_events)
        all_events.extend(tick_event_models)
        tick_models.append(build_tick_snapshot(tick, current_state, tick_event_models))

        # The ordered tick snapshots are the current MVP replay/timeline artifact.
        # Future replay integration can consume this stream directly.

        if normalized_parameters.stop_on_critical and current_state.fragility >= 0.95:
            all_events.append(_build_stop_event(tick, current_state))
            break

    summary_payload = build_scenario_summary(
        {
            "parameters": normalized_parameters,
            "final_state": current_state,
            "events": all_events,
        }
    )
    all_events.append(_build_summary_event(tick_models[-1].tick, summary_payload, current_state))

    return ScenarioRunResult(
        ok=True,
        scenario_id=None,
        scenario_name=normalized_parameters.scenario_name,
        parameters=normalized_parameters,
        initial_state=initial_state,
        ticks=tick_models,
        final_state=current_state,
        events=all_events,
        summary=summary_payload,
        stability_score=_compute_stability_score(current_state),
    )


# Example usage:
# from app.models.scenario import ScenarioParameters, ScenarioShock, ScenarioState
#
# base_state = ScenarioState(inventory=0.75, delivery=0.72, risk=0.25, fragility=0.22, volatility=0.20)
# shocks = [
#     ScenarioShock(
#         shock_type="supplier_failure",
#         severity=0.6,
#         start_tick=1,
#         duration_ticks=2,
#     )
# ]
# parameters = ScenarioParameters(time_steps=6, scenario_name="Supplier disruption review")
# result = run_scenario(base_state=base_state, shocks=shocks, parameters=parameters)
