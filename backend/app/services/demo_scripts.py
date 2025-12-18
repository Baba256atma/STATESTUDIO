"""Deterministic demo scripts for replay seeding."""
from __future__ import annotations

from typing import Dict, List, Literal

DemoId = Literal["growth", "fixes", "escalation"]

DEMO_TITLES: Dict[DemoId, str] = {
    "growth": "Demo: Limits to Growth",
    "fixes": "Demo: Fixes that Fail",
    "escalation": "Demo: Escalation",
}

DEMO_SCRIPTS: Dict[DemoId, List[str]] = {
    "growth": [
        "We are growing quickly with steady demand.",
        "Delivery is slowing down as workload increases.",
        "Resource overload builds and quality issues are rising.",
        "Latency keeps climbing as we push harder.",
        "The constraint becomes visible and growth stalls.",
        "We introduce a capacity lever and stabilize throughput.",
        "Flow improves and quality starts recovering.",
        "Growth resumes with steadier delivery.",
    ],
    "fixes": [
        "Operations are stable but small issues appear.",
        "We push quick fixes to reduce symptoms.",
        "Short-term relief improves output briefly.",
        "Side effects keep returning and rework grows.",
        "The underlying problem strengthens the failure loop.",
        "We slow changes and invest in a fundamental fix.",
        "Symptoms decline and stability improves.",
    ],
    "escalation": [
        "Teams are aligned with manageable tension.",
        "Pressure rises and decisions become reactive.",
        "Each side responds to the other with faster moves.",
        "Conflict escalates and volatility increases.",
        "Reaction loops dominate the system dynamics.",
        "We introduce a cooling-off step and shared goals.",
        "Responses slow down and coordination improves.",
        "Escalation eases and stability returns.",
    ],
}
