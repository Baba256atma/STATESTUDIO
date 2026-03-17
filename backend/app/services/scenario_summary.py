"""Manager-friendly summary builder for Scenario Studio MVP runs."""

from __future__ import annotations

from typing import Any


def _get_field(value: Any, field: str, default: Any = None) -> Any:
    """Read a field from either a dict-like or object-like payload."""
    if isinstance(value, dict):
        return value.get(field, default)
    return getattr(value, field, default)


def _metric_level(value: float) -> str:
    """Map a normalized metric into a readable business level."""
    if value >= 0.8:
        return "critical"
    if value >= 0.6:
        return "high"
    if value >= 0.3:
        return "medium"
    return "low"


def _extract_final_state(run_result: Any) -> dict[str, float]:
    """Return the final scenario state as a normalized dict."""
    final_state = _get_field(run_result, "final_state", None) or {}
    return {
        "inventory": float(_get_field(final_state, "inventory", 0.0) or 0.0),
        "delivery": float(_get_field(final_state, "delivery", 0.0) or 0.0),
        "risk": float(_get_field(final_state, "risk", 0.0) or 0.0),
        "fragility": float(_get_field(final_state, "fragility", 0.0) or 0.0),
        "volatility": float(_get_field(final_state, "volatility", 0.0) or 0.0),
    }


def _extract_events(run_result: Any) -> list[Any]:
    """Return the event list from a run result payload."""
    events = _get_field(run_result, "events", None)
    return events if isinstance(events, list) else []


def _extract_shocks(run_result: Any) -> list[Any]:
    """Return the configured shock list from the run parameters."""
    parameters = _get_field(run_result, "parameters", None) or {}
    shocks = _get_field(parameters, "shocks", None)
    return shocks if isinstance(shocks, list) else []


def _infer_outcome(final_state: dict[str, float]) -> str:
    """Infer the final outcome label from business state values."""
    if (
        final_state["fragility"] >= 0.9
        or final_state["risk"] >= 0.9
        or final_state["inventory"] <= 0.1
        or final_state["delivery"] <= 0.1
    ):
        return "collapse"
    if (
        final_state["fragility"] <= 0.35
        and final_state["risk"] <= 0.35
        and final_state["inventory"] >= 0.55
        and final_state["delivery"] >= 0.55
    ):
        return "stabilized"
    return "unstable"


def _normalize_driver_label(raw: str) -> str:
    """Convert a driver identifier into a readable label."""
    return raw.replace("_", " ").strip()


def _infer_main_driver(run_result: Any, final_state: dict[str, float]) -> str:
    """Infer the dominant driver from shocks first, then events, then final state."""
    shocks = _extract_shocks(run_result)
    if shocks:
        raw_shock = (
            _get_field(shocks[0], "shock_type")
            or _get_field(shocks[0], "type")
            or _get_field(shocks[0], "kind")
            or _get_field(shocks[0], "name")
        )
        if raw_shock:
            return str(raw_shock).strip().lower()

    metric_counts: dict[str, int] = {}
    for event in _extract_events(run_result):
        metric = _get_field(event, "metric", None)
        if not metric:
            continue
        key = str(metric).strip().lower()
        metric_counts[key] = metric_counts.get(key, 0) + 1

    if metric_counts:
        return max(metric_counts.items(), key=lambda item: item[1])[0]

    if final_state["fragility"] >= max(final_state["risk"], final_state["volatility"]):
        return "fragility"
    if final_state["risk"] >= final_state["volatility"]:
        return "risk"
    return "volatility"


def _build_key_message(outcome: str, main_driver: str, final_state: dict[str, float]) -> str:
    """Build a concise business-readable manager message."""
    driver_label = _normalize_driver_label(main_driver)

    if outcome == "collapse":
        return (
            f"The scenario moved into collapse conditions, driven primarily by {driver_label}, "
            "and would likely require immediate intervention."
        )
    if outcome == "unstable":
        if final_state["inventory"] <= 0.35:
            return (
                f"The system remained unstable because {driver_label} contributed to weak inventory cover "
                "and rising operating exposure."
            )
        if final_state["delivery"] <= 0.35:
            return (
                f"The system remained unstable because {driver_label} continued to weaken delivery performance "
                "and raise operational risk."
            )
        return (
            f"The scenario stayed unstable, with {driver_label} continuing to increase fragility and management pressure."
        )
    return (
        f"The scenario stabilized overall, although {driver_label} remained the main source of pressure during the run."
    )


def build_scenario_summary(run_result: Any) -> dict[str, str]:
    """Return a concise manager-friendly scenario summary payload."""
    final_state = _extract_final_state(run_result)
    outcome = _infer_outcome(final_state)
    main_driver = _infer_main_driver(run_result, final_state)

    return {
        "outcome": outcome,
        "main_driver": _normalize_driver_label(main_driver),
        "key_message": _build_key_message(outcome, main_driver, final_state),
        "risk_level": _metric_level(final_state["risk"]),
        "fragility_level": _metric_level(final_state["fragility"]),
    }
