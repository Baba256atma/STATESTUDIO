"""Deterministic state transition rules for Scenario Studio MVP."""

from __future__ import annotations

from typing import Any

from app.models.scenario import ScenarioState


def _clamp_unit(value: float) -> float:
    """Clamp a numeric value into the normalized scenario range."""
    return max(0.0, min(1.0, value))


def _resolve_tick(parameters: Any) -> int:
    """Resolve the current tick from common parameter payload shapes."""
    if isinstance(parameters, dict):
        return max(0, int(parameters.get("tick", 0) or 0))
    return max(0, int(getattr(parameters, "tick", 0) or 0))


def _severity_label(value: float) -> str:
    """Map a normalized severity value to an event label."""
    if value >= 0.85:
        return "critical"
    if value >= 0.6:
        return "high"
    if value >= 0.3:
        return "medium"
    return "low"


def _event(
    *,
    tick: int,
    metric: str,
    value: float,
    message: str,
    event_type: str = "state_change",
    event_code: str | None = None,
) -> dict[str, Any]:
    """Build a ScenarioEvent-compatible payload."""
    normalized_value = _clamp_unit(value)
    payload: dict[str, Any] = {
        "tick": tick,
        "event_type": event_type,
        "severity": _severity_label(normalized_value),
        "message": message,
        "metric": metric,
        "value": normalized_value,
    }
    if event_code:
        payload["event_code"] = event_code
    return payload


def update_state_for_tick(state: ScenarioState, parameters: Any) -> tuple[ScenarioState, list[dict[str, Any]]]:
    """Advance the business state by one deterministic timeline tick."""
    next_state = state.model_copy(deep=True)
    events: list[dict[str, Any]] = []
    tick = _resolve_tick(parameters)

    inventory_gap = max(0.0, 0.35 - next_state.inventory)
    delivery_gap = max(0.0, 0.40 - next_state.delivery)
    risk_gap = max(0.0, next_state.risk - 0.55)
    fragility_lock = max(0.0, next_state.fragility - 0.75)

    if inventory_gap > 0:
        next_state.fragility = _clamp_unit(next_state.fragility + (0.32 * inventory_gap))
        next_state.risk = _clamp_unit(next_state.risk + (0.12 * inventory_gap))
        events.append(
            _event(
                tick=tick,
                metric="fragility",
                value=next_state.fragility,
                message="Low inventory increased structural fragility.",
            )
        )

    if delivery_gap > 0:
        next_state.risk = _clamp_unit(next_state.risk + (0.28 * delivery_gap))
        next_state.volatility = _clamp_unit(next_state.volatility + (0.16 * delivery_gap))
        events.append(
            _event(
                tick=tick,
                metric="risk",
                value=next_state.risk,
                message="Weak delivery performance increased time pressure and operating risk.",
            )
        )

    if risk_gap > 0:
        next_state.fragility = _clamp_unit(next_state.fragility + (0.22 * risk_gap))
        events.append(
            _event(
                tick=tick,
                metric="fragility",
                value=next_state.fragility,
                message="Elevated risk continued to increase fragility.",
            )
        )

    if inventory_gap > 0 and delivery_gap > 0:
        coupled_risk = 0.08 * min(inventory_gap, delivery_gap)
        next_state.risk = _clamp_unit(next_state.risk + coupled_risk)
        events.append(
            _event(
                tick=tick,
                metric="risk",
                value=next_state.risk,
                message="Low inventory and weak delivery combined to create extra risk pressure.",
                event_code="coupled_risk_spike",
            )
        )

    if next_state.risk > 0.65 and next_state.fragility > 0.60:
        acceleration = 0.06 * min(next_state.risk - 0.65, next_state.fragility - 0.60)
        next_state.fragility = _clamp_unit(next_state.fragility + acceleration)
        events.append(
            _event(
                tick=tick,
                metric="fragility",
                value=next_state.fragility,
                message="High risk and high fragility reinforced each other and accelerated system stress.",
                event_code="coupled_fragility_acceleration",
            )
        )

    if fragility_lock > 0:
        next_state.inventory = _clamp_unit(next_state.inventory - (0.10 * fragility_lock))
        next_state.delivery = _clamp_unit(next_state.delivery - (0.10 * fragility_lock))
        next_state.volatility = _clamp_unit(next_state.volatility + (0.18 * fragility_lock))
        events.append(
            _event(
                tick=tick,
                metric="volatility",
                value=next_state.volatility,
                message="Very high fragility reduced recovery capacity and made stabilization harder.",
                event_type="threshold_warning",
            )
        )

    in_collapse_zone = (
        next_state.inventory < 0.15
        or next_state.delivery < 0.15
        or next_state.fragility > 0.9
        or next_state.risk > 0.9
    )

    if not in_collapse_zone:
        inventory_recovery = 0.015 * (1.0 - next_state.fragility)
        delivery_recovery = 0.018 * (1.0 - next_state.fragility)
        risk_recovery = 0.016 * (1.0 - next_state.volatility)
        volatility_recovery = 0.012 * (1.0 - next_state.fragility)

        next_state.inventory = _clamp_unit(next_state.inventory + inventory_recovery)
        next_state.delivery = _clamp_unit(next_state.delivery + delivery_recovery)
        next_state.risk = _clamp_unit(next_state.risk - risk_recovery)
        next_state.volatility = _clamp_unit(next_state.volatility - volatility_recovery)

        if next_state.delivery >= 0.65 and next_state.risk <= 0.35:
            next_state.fragility = _clamp_unit(next_state.fragility - 0.02)
            next_state.volatility = _clamp_unit(next_state.volatility - 0.01)
            events.append(
                _event(
                    tick=tick,
                    metric="fragility",
                    value=next_state.fragility,
                    message="Good delivery and contained risk created a slight stabilization effect.",
                    event_type="runner_note",
                    event_code="stabilization_effect",
                )
            )

        events.append(
            {
                "tick": tick,
                "event_type": "runner_note",
                "severity": "low",
                "message": "Partial recovery occurred because the system remained outside collapse range.",
                "metric": None,
                "value": None,
            }
        )
    else:
        events.append(
            {
                "tick": tick,
                "event_type": "threshold_warning",
                "severity": "high",
                "message": "Recovery stayed limited because the system remained in a collapse range.",
                "metric": None,
                "value": None,
            }
        )

    return next_state, events
