"""MVP AI input safety guard for Nexora.

This module provides a lightweight first-pass filter before AI reasoning runs.
It is intentionally simple for the MVP stage and can be expanded later as the
backend safety model becomes more advanced.
"""

from __future__ import annotations


# This is a simple first-layer safety filter for the MVP. It is intentionally
# string-based and easy to extend as the backend safety policy evolves.
BLOCKED_PATTERNS: dict[str, str] = {
    "ignore previous instructions": "prompt_abuse",
    "ignore all previous instructions": "prompt_abuse",
    "reveal system prompt": "system_prompt_exfiltration",
    "show system prompt": "system_prompt_exfiltration",
    "developer message": "developer_context_probe",
    "hidden instructions": "hidden_instructions_probe",
    "act as root": "privilege_escalation_prompt",
    "bypass safety": "safety_bypass_attempt",
    "show hidden rules": "hidden_rules_probe",
    "reveal your rules": "hidden_rules_probe",
}


def check_ai_input_safety(text: str) -> dict:
    """Return a basic safety verdict for user-provided AI input."""
    normalized_text = (text or "").strip().lower()

    # Empty input is treated as safe here. Validation belongs elsewhere.
    if not normalized_text:
        return {
            "ok": True,
            "blocked": False,
            "reason": None,
        }

    for pattern, reason in BLOCKED_PATTERNS.items():
        if pattern in normalized_text:
            return {
                "ok": False,
                "blocked": True,
                "reason": reason,
            }

    return {
        "ok": True,
        "blocked": False,
        "reason": None,
    }
