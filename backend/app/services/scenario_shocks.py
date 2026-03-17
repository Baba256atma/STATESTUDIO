"""Deterministic shock application rules for Scenario Studio MVP."""

from __future__ import annotations

from typing import Any

from app.models.scenario import ScenarioState


def _clamp_unit(value: float) -> float:
    """Clamp a numeric value into the normalized scenario range."""
    return max(0.0, min(1.0, value))


def _get_field(value: Any, field: str, default: Any = None) -> Any:
    """Read a field from either a dict-like or object-like payload."""
    if isinstance(value, dict):
        return value.get(field, default)
    return getattr(value, field, default)


def _resolve_shock_type(shock: Any) -> str:
    """Resolve the supported shock type from the incoming payload."""
    raw = (
        _get_field(shock, "shock_type")
        or _get_field(shock, "type")
        or _get_field(shock, "kind")
        or _get_field(shock, "name")
        or ""
    )
    return str(raw).strip().lower()


def _resolve_severity(shock: Any) -> float:
    """Resolve and clamp shock severity into the normalized range."""
    raw = _get_field(shock, "severity", 0.4)
    try:
        return _clamp_unit(float(raw))
    except (TypeError, ValueError):
        return 0.4


def _severity_label(value: float) -> str:
    """Map normalized severity into an event label."""
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
    severity: float,
    metric: str,
    value: float,
    message: str,
) -> dict[str, Any]:
    """Build a ScenarioEvent-compatible payload."""
    return {
        "tick": max(0, tick),
        "event_type": "shock_applied",
        "severity": _severity_label(severity),
        "message": message,
        "metric": metric,
        "value": _clamp_unit(value),
    }


def apply_shock_to_state(state: ScenarioState, shock: Any) -> tuple[ScenarioState, list[dict[str, Any]]]:
    """Apply one deterministic business shock to the current scenario state."""
    next_state = state.model_copy(deep=True)
    events: list[dict[str, Any]] = []

    shock_type = _resolve_shock_type(shock)
    severity = _resolve_severity(shock)
    tick = int(_get_field(shock, "start_tick", 0) or 0)

    if shock_type == "supplier_failure":
        next_state.inventory = _clamp_unit(next_state.inventory - (0.30 * severity))
        next_state.delivery = _clamp_unit(next_state.delivery - (0.18 * severity))
        next_state.fragility = _clamp_unit(next_state.fragility + (0.22 * severity))
        next_state.risk = _clamp_unit(next_state.risk + (0.16 * severity))
        events.append(
            _event(
                tick=tick,
                severity=severity,
                metric="inventory",
                value=next_state.inventory,
                message="Supplier failure reduced available inventory and increased operating pressure.",
            )
        )

    elif shock_type == "delivery_delay":
        next_state.delivery = _clamp_unit(next_state.delivery - (0.32 * severity))
        next_state.risk = _clamp_unit(next_state.risk + (0.18 * severity))
        next_state.fragility = _clamp_unit(next_state.fragility + (0.12 * severity))
        events.append(
            _event(
                tick=tick,
                severity=severity,
                metric="delivery",
                value=next_state.delivery,
                message="Delivery delay weakened service flow and raised immediate execution risk.",
            )
        )

    elif shock_type == "demand_spike":
        next_state.inventory = _clamp_unit(next_state.inventory - (0.28 * severity))
        next_state.volatility = _clamp_unit(next_state.volatility + (0.20 * severity))
        next_state.fragility = _clamp_unit(next_state.fragility + (0.10 * severity))
        events.append(
            _event(
                tick=tick,
                severity=severity,
                metric="inventory",
                value=next_state.inventory,
                message="Demand spike consumed buffer capacity faster than normal demand conditions.",
            )
        )

    elif shock_type == "price_increase":
        next_state.risk = _clamp_unit(next_state.risk + (0.20 * severity))
        next_state.fragility = _clamp_unit(next_state.fragility + (0.16 * severity))
        next_state.volatility = _clamp_unit(next_state.volatility + (0.12 * severity))
        events.append(
            _event(
                tick=tick,
                severity=severity,
                metric="risk",
                value=next_state.risk,
                message="Price increase raised cost pressure and made the system less stable.",
            )
        )

    elif shock_type == "risk_event":
        next_state.risk = _clamp_unit(next_state.risk + (0.34 * severity))
        next_state.volatility = _clamp_unit(next_state.volatility + (0.24 * severity))
        next_state.fragility = _clamp_unit(next_state.fragility + (0.18 * severity))
        events.append(
            _event(
                tick=tick,
                severity=severity,
                metric="risk",
                value=next_state.risk,
                message="Risk event sharply raised exposure and increased uncertainty across the system.",
            )
        )

    else:
        events.append(
            {
                "tick": max(0, tick),
                "event_type": "runner_note",
                "severity": "low",
                "message": f"Unsupported shock type '{shock_type or 'unknown'}' was ignored.",
                "metric": None,
                "value": None,
            }
        )

    return next_state, events
