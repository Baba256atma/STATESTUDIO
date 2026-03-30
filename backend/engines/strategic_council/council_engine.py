from __future__ import annotations

import time
from typing import Any

from engines.strategic_council.council_models import (
    CouncilAgentInput,
    CouncilAgentOpinion,
    CouncilDisagreement,
    CouncilMeta,
    CouncilSynthesis,
    StrategicCouncilResult,
)
from engines.strategic_council.council_policy import (
    clamp01,
    compare_tradeoffs,
    confidence_floor,
    propagation_chain,
    resolve_scene_label,
    role_weight,
    strategy_actions,
    top_fragility_drivers,
)


def _fragility_level(input_data: CouncilAgentInput) -> str:
    level = str((input_data.fragility or {}).get("level") or "").strip().lower()
    return level or "unknown"


def _focus_label(input_data: CouncilAgentInput) -> str | None:
    return resolve_scene_label(input_data.scene_json, input_data.focused_object_id)


def _base_signals(input_data: CouncilAgentInput) -> dict[str, Any]:
    return {
        "fragility_level": _fragility_level(input_data),
        "drivers": top_fragility_drivers(input_data.fragility),
        "propagation_chain": propagation_chain(input_data),
        "tradeoffs": compare_tradeoffs(input_data.compare_result),
        "strategy_actions": strategy_actions(input_data.strategy_result),
        "focus_label": _focus_label(input_data),
    }


def _compact_summary(parts: list[str]) -> str:
    return " ".join(part.strip() for part in parts if isinstance(part, str) and part.strip())


def _build_ceo_opinion(input_data: CouncilAgentInput, signals: dict[str, Any]) -> tuple[CouncilAgentOpinion, dict[str, str]]:
    drivers = signals["drivers"]
    focus_label = signals["focus_label"] or "current system focus"
    propagation = signals["propagation_chain"]
    fragility_level = signals["fragility_level"]
    headline = (
        f"{focus_label} is becoming a strategic weakness"
        if fragility_level in {"high", "critical"}
        else f"{focus_label} needs resilience discipline"
    )
    summary = _compact_summary(
        [
            f"Supplier concentration and fragility around {focus_label} are weakening long-term resilience."
            if "supplier" in focus_label.lower()
            else f"Nexora is signaling that {focus_label} is carrying disproportionate strategic pressure.",
            f"Propagation is already visible through {' -> '.join(propagation)}." if propagation else "",
        ]
    )
    priorities = [
        "Protect strategic resilience",
        f"Reduce dependence around {drivers[0]}" if drivers else "Reduce structural concentration",
    ]
    concerns = [
        f"{drivers[0]} is now shaping system direction" if drivers else "Strategic concentration risk is rising",
        "A reactive response could lock in a weaker future position",
    ]
    actions = []
    if signals["strategy_actions"]:
        actions.append(signals["strategy_actions"][0])
    actions.extend(
        [
            "Phase supplier diversification",
            "Protect customer-facing continuity while resilience measures ramp",
        ]
    )
    opinion = CouncilAgentOpinion(
        role="ceo",
        headline=headline,
        summary=summary,
        priorities=priorities[:2],
        concerns=concerns[:2],
        recommended_actions=actions[:2],
        confidence=clamp01(confidence_floor(input_data) + role_weight("ceo")),
    )
    return opinion, {
        "pace_of_change": "Move now, but in phased strategic steps",
        "investment_posture": "Accept near-term spend to reduce concentrated fragility",
    }


def _build_cfo_opinion(input_data: CouncilAgentInput, signals: dict[str, Any]) -> tuple[CouncilAgentOpinion, dict[str, str]]:
    drivers = signals["drivers"]
    tradeoffs = signals["tradeoffs"]
    fragility_level = signals["fragility_level"]
    headline = "Cost exposure is rising faster than buffer capacity" if fragility_level in {"high", "critical"} else "Capital discipline should stay ahead of the response"
    summary = _compact_summary(
        [
            f"The main cost pressure is tied to {drivers[0]}." if drivers else "The current system picture does not justify an open-ended response.",
            f"Tradeoffs are clustering around {tradeoffs[0]}." if tradeoffs else "Resilience actions should be staged so they do not create unnecessary capital drag.",
        ]
    )
    priorities = [
        "Contain downside exposure",
        "Stage spend behind measurable risk reduction",
    ]
    concerns = [
        "A full-scale mitigation move could front-load cost before fragility falls",
        f"{drivers[1]} may create a second-order cost burden" if len(drivers) > 1 else "Weak signals should not trigger expensive overcorrection",
    ]
    actions = [
        "Use targeted buffers before large structural spend",
        "Link diversification or capacity moves to measurable fragility reduction",
    ]
    opinion = CouncilAgentOpinion(
        role="cfo",
        headline=headline,
        summary=summary,
        priorities=priorities[:2],
        concerns=concerns[:2],
        recommended_actions=actions[:2],
        confidence=clamp01(confidence_floor(input_data) + role_weight("cfo") - (0.04 if fragility_level == "unknown" else 0)),
    )
    return opinion, {
        "pace_of_change": "Stage the response and control near-term spend",
        "investment_posture": "Require targeted ROI before expanding mitigation",
    }


def _build_coo_opinion(input_data: CouncilAgentInput, signals: dict[str, Any]) -> tuple[CouncilAgentOpinion, dict[str, str]]:
    propagation = signals["propagation_chain"]
    drivers = signals["drivers"]
    focus_label = signals["focus_label"] or "execution flow"
    headline = "Execution pressure is already moving through the system" if propagation else f"{focus_label} needs an operational containment plan"
    summary = _compact_summary(
        [
            f"Operations are seeing pressure move through {' -> '.join(propagation)}." if propagation else "",
            f"The near-term bottleneck is {drivers[0]}." if drivers else "Implementation should stay narrow until the pressure source is clearer.",
        ]
    )
    priorities = [
        "Protect delivery continuity",
        "Sequence changes so operations can absorb them safely",
    ]
    concerns = [
        "A sudden supplier or process swap can amplify delivery risk",
        "Teams need a phased operational handoff, not a simultaneous reset",
    ]
    actions = [
        "Use a phased mitigation rollout",
        "Stabilize the immediate bottleneck before broader structural change",
    ]
    opinion = CouncilAgentOpinion(
        role="coo",
        headline=headline,
        summary=summary,
        priorities=priorities[:2],
        concerns=concerns[:2],
        recommended_actions=actions[:2],
        confidence=clamp01(confidence_floor(input_data) + role_weight("coo")),
    )
    return opinion, {
        "pace_of_change": "Sequence execution in phases",
        "investment_posture": "Back only the changes operations can absorb now",
    }


def _build_disagreements(positions: dict[str, dict[str, str]], fragility_level: str) -> list[CouncilDisagreement]:
    disagreements: list[CouncilDisagreement] = []
    pace = {role: stance.get("pace_of_change") for role, stance in positions.items()}
    if len({value for value in pace.values() if value}) > 1:
        disagreements.append(
            CouncilDisagreement(
                dimension="pace_of_change",
                ceo_position=pace.get("ceo"),
                cfo_position=pace.get("cfo"),
                coo_position=pace.get("coo"),
                tension_level=0.72 if fragility_level in {"high", "critical"} else 0.58,
                summary="Leadership agrees action is needed, but disagrees on how quickly the system can absorb it.",
            )
        )
    investment = {role: stance.get("investment_posture") for role, stance in positions.items()}
    if len({value for value in investment.values() if value}) > 1:
        disagreements.append(
            CouncilDisagreement(
                dimension="investment_posture",
                ceo_position=investment.get("ceo"),
                cfo_position=investment.get("cfo"),
                coo_position=investment.get("coo"),
                tension_level=0.68 if fragility_level in {"high", "critical"} else 0.52,
                summary="The council is balancing resilience investment against near-term cost and operating bandwidth.",
            )
        )
    return disagreements[:2]


def _build_synthesis(
    input_data: CouncilAgentInput,
    signals: dict[str, Any],
    opinions: list[CouncilAgentOpinion],
    disagreements: list[CouncilDisagreement],
) -> CouncilSynthesis:
    focus_label = signals["focus_label"] or "the current system"
    fragility_level = signals["fragility_level"]
    shared_actions: list[str] = []
    for opinion in opinions:
        shared_actions.extend(opinion.recommended_actions)
    top_actions = []
    for action in shared_actions:
        if action not in top_actions:
            top_actions.append(action)
    if not top_actions:
        top_actions.append("Maintain current posture while gathering stronger signals")
    recommended_direction = (
        "Use a phased mitigation plan that stabilizes immediate pressure before structural expansion."
        if fragility_level in {"high", "critical"}
        else "Take a targeted response now and expand only as stronger evidence accumulates."
    )
    tradeoffs = [item.summary for item in disagreements] or [
        "Balance resilience gains against short-term cost and operational capacity."
    ]
    headline = (
        f"Council recommends phased mitigation around {focus_label}"
        if fragility_level in {"high", "critical"}
        else f"Council recommends a measured response around {focus_label}"
    )
    summary = _compact_summary(
        [
            f"The CEO wants structural resilience, the CFO wants controlled spend, and the COO wants a sequence the system can absorb.",
            f"Top pressure is coming from {signals['drivers'][0]}." if signals["drivers"] else "",
        ]
    )
    return CouncilSynthesis(
        headline=headline,
        summary=summary,
        recommended_direction=recommended_direction,
        top_actions=top_actions[:3],
        tradeoffs=tradeoffs[:3],
        confidence=clamp01(sum(opinion.confidence for opinion in opinions) / max(len(opinions), 1)),
    )


def run_strategic_council(input_data: CouncilAgentInput) -> StrategicCouncilResult:
    signals = _base_signals(input_data)
    ceo, ceo_positions = _build_ceo_opinion(input_data, signals)
    cfo, cfo_positions = _build_cfo_opinion(input_data, signals)
    coo, coo_positions = _build_coo_opinion(input_data, signals)
    opinions = [ceo, cfo, coo]
    disagreements = _build_disagreements(
        {"ceo": ceo_positions, "cfo": cfo_positions, "coo": coo_positions},
        signals["fragility_level"],
    )
    synthesis = _build_synthesis(input_data, signals, opinions, disagreements)
    active = bool(
        input_data.text.strip()
        or signals["drivers"]
        or signals["propagation_chain"]
        or signals["tradeoffs"]
        or signals["strategy_actions"]
        or input_data.focused_object_id
    )
    if not active:
        synthesis = CouncilSynthesis(
            headline="Council is waiting for stronger signals",
            summary="Current evidence is light, so the council is keeping its recommendation cautious.",
            recommended_direction="Hold the current plan and gather stronger fragility, propagation, or comparison evidence.",
            top_actions=["Monitor leading indicators", "Refresh the current system assessment"],
            tradeoffs=["Avoid overcommitting before stronger evidence appears."],
            confidence=0.34,
        )
        opinions = [
            CouncilAgentOpinion(
                role=role,
                headline="Signals are still weak",
                summary="This view remains cautious until Nexora has stronger system evidence.",
                priorities=["Collect stronger evidence"],
                concerns=["The current picture is too weak for a high-confidence move"],
                recommended_actions=["Monitor the current system state"],
                confidence=0.32,
            )
            for role in ("ceo", "cfo", "coo")
        ]
        disagreements = []
    return StrategicCouncilResult(
        active=active,
        opinions=opinions,
        disagreements=disagreements,
        synthesis=synthesis,
        meta=CouncilMeta(
            mode=input_data.mode or "business",
            source="strategic_council_engine",
            timestamp=int(time.time() * 1000),
        ),
    )
