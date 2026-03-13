from __future__ import annotations

from typing import Any, Dict, List


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def _safe_dict(x: Any) -> Dict[str, Any]:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> List[Any]:
    return x if isinstance(x, list) else []


def build_memory_v2(memory_context, conflicts, object_selection):
    summary = _safe_dict(_safe_dict(memory_context).get("summary"))
    similar = _safe_dict(_safe_dict(memory_context).get("similar"))
    top_focused = _safe_list(summary.get("top_focused_objects"))

    similar_patterns: List[Dict[str, Any]] = []
    if similar.get("episode_id"):
        similar_patterns.append(
            {
                "episode_id": similar.get("episode_id"),
                "score": round(_fnum(similar.get("score", 0.0), 0.0), 3),
                "label": str(similar.get("why") or "Similar prior pattern"),
            }
        )

    repeated_conflicts: List[Dict[str, Any]] = []
    for c in _safe_list(conflicts):
        if not isinstance(c, dict):
            continue
        repeated_conflicts.append(
            {
                "pair": [c.get("a"), c.get("b")],
                "count": 1,
                "avg_score": round(_fnum(c.get("score", 0.0), 0.0), 3),
            }
        )

    object_bias: List[Dict[str, Any]] = []
    for obj in top_focused:
        if not isinstance(obj, dict):
            continue
        oid = obj.get("id")
        if not isinstance(oid, str) or not oid:
            continue
        count = int(_fnum(obj.get("count", 0), 0))
        object_bias.append(
            {
                "id": oid,
                "boost": round(min(0.25, 0.03 * count), 3),
            }
        )

    return {
        "similar_patterns": similar_patterns,
        "repeated_conflicts": repeated_conflicts,
        "object_bias": object_bias,
        "memory_reasoning": "Memory v2 uses similar scenarios, repeated conflicts, and object recurrence.",
    }
