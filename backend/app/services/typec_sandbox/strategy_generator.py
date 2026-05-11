from __future__ import annotations

import re
from typing import Any

from app.models.typec_sandbox_models import TypeCSandboxStrategy


def _sanitize_id(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_") or "strategy"


def _objects(scene: dict[str, Any]) -> list[dict[str, Any]]:
    raw = scene.get("scene", {}).get("objects", []) if isinstance(scene.get("scene"), dict) else []
    return [item for item in raw if isinstance(item, dict)]


def _edges(scene: dict[str, Any]) -> list[dict[str, Any]]:
    loops = scene.get("scene", {}).get("loops", []) if isinstance(scene.get("scene"), dict) else []
    edges: list[dict[str, Any]] = []
    for loop in loops if isinstance(loops, list) else []:
        if not isinstance(loop, dict):
            continue
        for edge in loop.get("edges", []) if isinstance(loop.get("edges"), list) else []:
            if isinstance(edge, dict):
                edges.append(edge)
    return edges


def _label(obj: dict[str, Any]) -> str:
    return str(obj.get("label") or obj.get("name") or obj.get("display_label") or obj.get("id") or "Object")


def _top_connected_object(scene: dict[str, Any]) -> str:
    labels = {str(obj.get("id")): _label(obj) for obj in _objects(scene) if obj.get("id")}
    counts: dict[str, int] = {}
    for edge in _edges(scene):
        for key in ("from", "to"):
            node = str(edge.get(key) or "")
            if node:
                counts[node] = counts.get(node, 0) + 1
    if not counts:
        return next((_label(obj) for obj in _objects(scene) if "core" not in _label(obj).lower()), "the main dependency")
    best = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]
    return labels.get(best, best)


def _has_supply_chain_language(scene: dict[str, Any]) -> bool:
    text = " ".join(_label(obj).lower() for obj in _objects(scene))
    return any(term in text for term in ("supplier", "inventory", "delivery", "demand"))


def _strategy(
    title: str,
    description: str,
    proposed_actions: list[str],
    expected_benefits: list[str],
    risks: list[str],
    confidence: float,
) -> TypeCSandboxStrategy:
    return TypeCSandboxStrategy(
        id=f"sandbox_{_sanitize_id(title)}",
        title=title,
        description=description,
        proposedActions=proposed_actions,
        expectedBenefits=expected_benefits,
        risks=risks,
        confidence=confidence,
    )


def generate_sandbox_strategies(scene: dict[str, Any]) -> list[TypeCSandboxStrategy]:
    objects = _objects(scene)
    edges = _edges(scene)
    strategies: list[TypeCSandboxStrategy] = []
    focus = _top_connected_object(scene)

    if _has_supply_chain_language(scene):
        strategies.append(
            _strategy(
                "Add secondary supply path",
                "Introduce a backup path around the most exposed supply dependency inside the sandbox clone.",
                ["Add secondary supplier option", "Route inventory through alternate delivery path"],
                ["Lower propagation risk", "Reduced single-point-of-failure exposure"],
                ["Higher short-term cost", "More operational coordination"],
                0.78,
            )
        )

    if len(edges) >= 2:
        strategies.append(
            _strategy(
                f"Buffer propagation around {focus}",
                f"Stress-test a resilience buffer around {focus} before it affects downstream nodes.",
                ["Add monitoring threshold", "Create temporary buffer capacity"],
                ["Reduced cascade sensitivity", "Earlier warning before disruption"],
                ["May slow execution speed", "Requires clear signal ownership"],
                0.72,
            )
        )

    if len(objects) >= 2:
        strategies.append(
            _strategy(
                "Stabilize critical dependency cluster",
                "Explore a lower-risk operating mode by reducing dependency concentration across connected objects.",
                ["Identify top dependency", "Shift load to less fragile nodes"],
                ["Improved resilience", "Better executive visibility"],
                ["Can reduce near-term efficiency", "May require manual review"],
                0.66,
            )
        )

    if not strategies:
        strategies.append(
            _strategy(
                "Create baseline monitoring strategy",
                "Sandbox has limited structure, so the safest autonomous move is to improve observability first.",
                ["Add more objects or connections", "Run a scenario draft before execution"],
                ["Better future simulation quality", "Lower chance of false confidence"],
                ["No immediate operational change"],
                0.38,
            )
        )

    deduped: list[TypeCSandboxStrategy] = []
    seen: set[str] = set()
    for strategy in strategies:
        if strategy.id in seen:
            continue
        seen.add(strategy.id)
        deduped.append(strategy)
    return deduped[:4]
