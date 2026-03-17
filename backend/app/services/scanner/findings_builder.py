"""Business-facing findings builder for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any


def build_fragility_findings(signals: list[dict], scoring: dict) -> list[dict]:
    """Build concise manager-friendly findings from signals and scoring output."""
    normalized_signals = _sorted_signals(signals)
    findings: list[dict[str, Any]] = []

    for signal in normalized_signals[:5]:
        findings.append(
            {
                "id": signal.get("id", "fragility_finding"),
                "title": signal.get("label", "Fragility Risk"),
                "severity": signal.get("severity", "medium"),
                "explanation": _explanation_for(signal),
                "recommendation": _recommendation_for(signal),
            }
        )
    return findings


def build_fragility_summary(signals: list[dict], scoring: dict) -> str:
    """Return a short executive summary of the scan result."""
    score = float(scoring.get("fragility_score", 0.0) or 0.0)
    level = str(scoring.get("fragility_level", "low") or "low")
    drivers = scoring.get("top_drivers", []) or []

    if not signals:
        return "The scanner found limited fragility pressure in the current material."

    driver_labels = [item.get("label", "fragility driver") for item in drivers[:2] if isinstance(item, dict)]
    if level == "critical":
        return (
            f"The system shows critical fragility exposure, led by {', '.join(driver_labels) if driver_labels else 'multiple structural risks'}. "
            "Immediate stabilization action is advised."
        )
    if level == "high":
        return (
            f"The system shows elevated fragility risk with pressure centered on {', '.join(driver_labels) if driver_labels else 'several core drivers'}. "
            "Management intervention is recommended."
        )
    if level == "medium":
        return (
            f"The system shows moderate fragility exposure with emerging pressure in {', '.join(driver_labels) if driver_labels else 'key operating areas'}. "
            "Targeted mitigation should be planned."
        )
    return (
        f"The system currently shows low fragility exposure with an overall score of {score:.2f}. "
        "Continue monitoring the identified pressure points."
    )


def build_recommended_actions(signals: list[dict], scoring: dict) -> list[str]:
    """Return short business actions prioritized by the strongest signals."""
    actions: list[str] = []
    for signal in _sorted_signals(signals):
        recommendation = _recommendation_for(signal)
        if recommendation not in actions:
            actions.append(recommendation)
        if len(actions) >= 5:
            break

    if not actions and float(scoring.get("fragility_score", 0.0) or 0.0) >= 0.35:
        actions.append("Review operating dependencies and add practical resilience buffers.")
    return actions


def _sorted_signals(signals: list[dict]) -> list[dict]:
    """Return signals sorted by business importance."""
    normalized = [item for item in signals if isinstance(item, dict)]
    return sorted(
        normalized,
        key=lambda item: (float(item.get("score", 0.0) or 0.0), str(item.get("label", ""))),
        reverse=True,
    )


def _explanation_for(signal: dict) -> str:
    """Build a concise explanation for one signal."""
    label = str(signal.get("label", "Fragility Risk") or "Fragility Risk")
    evidence_text = str(signal.get("evidence_text", "") or "").strip().rstrip(".")
    matched_terms = signal.get("matched_terms", []) or []
    if evidence_text:
        return f"{label} is visible in the source material: {evidence_text}."
    if matched_terms:
        return f"{label} is indicated by terms such as {', '.join(matched_terms[:3])}."
    return f"{label} is materially increasing system fragility."


def _recommendation_for(signal: dict) -> str:
    """Map a signal to a short business action."""
    signal_id = str(signal.get("id", "") or "").lower()
    label = str(signal.get("label", "") or "").lower()

    if "delay" in signal_id or "delay" in label:
        return "Reduce delivery friction and tighten timeline control on critical flows."
    if "inventory" in signal_id or "inventory" in label:
        return "Increase buffer coverage for critical inventory and improve replenishment discipline."
    if "supplier" in signal_id or "dependency" in signal_id or "concentration" in signal_id:
        return "Diversify concentrated dependencies and add fallback supply options."
    if "volatility" in signal_id or "volatility" in label:
        return "Strengthen monitoring and shorten response cycles for volatile conditions."
    if "quality" in signal_id or "quality" in label:
        return "Stabilize quality controls and reduce rework at the source."
    if "bottleneck" in signal_id or "bottleneck" in label:
        return "Relieve the operational bottleneck with targeted capacity or process changes."
    if "recovery" in signal_id or "resilience" in label:
        return "Improve recovery readiness with backup plans, buffers, and response ownership."
    return "Reduce the identified pressure point with a focused resilience action plan."
