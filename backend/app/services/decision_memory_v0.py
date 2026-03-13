from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.services.decision_memory_store import DecisionMemoryStore


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def _safe_dict(x: Any) -> Dict[str, Any]:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> List[Any]:
    return x if isinstance(x, list) else []


def summarize_memory(events: List[dict]) -> dict:
    events = events if isinstance(events, list) else []
    recent_episode_ids: List[str] = []
    seen_eps = set()
    driver_stats: Dict[str, Dict[str, float]] = {}
    focus_counts: Dict[str, int] = {}
    last_seen: Optional[str] = None

    for ev in reversed(events):
        if not isinstance(ev, dict):
            continue
        eid = ev.get("episode_id")
        if isinstance(eid, str) and eid and eid not in seen_eps and len(recent_episode_ids) < 5:
            seen_eps.add(eid)
            recent_episode_ids.append(eid)
        foc = ev.get("focused_object_id")
        if isinstance(foc, str) and foc:
            focus_counts[foc] = int(focus_counts.get(foc, 0)) + 1

        frag = _safe_dict(ev.get("fragility"))
        drivers = _safe_dict(frag.get("drivers"))
        for code, val in drivers.items():
            c = str(code)
            v = _fnum(val, 0.0)
            slot = driver_stats.get(c, {"sum": 0.0, "count": 0.0})
            slot["sum"] = _fnum(slot.get("sum"), 0.0) + v
            slot["count"] = _fnum(slot.get("count"), 0.0) + 1.0
            driver_stats[c] = slot

    if events:
        last_ev = events[-1] if isinstance(events[-1], dict) else {}
        ts = last_ev.get("ts")
        last_seen = str(ts) if isinstance(ts, str) else None

    recurring = []
    for code, stat in driver_stats.items():
        cnt = int(_fnum(stat.get("count"), 0.0))
        if cnt <= 0:
            continue
        avg = _fnum(stat.get("sum"), 0.0) / max(1, cnt)
        recurring.append({"code": code, "avg": avg, "count": cnt})
    recurring.sort(key=lambda x: (x.get("count", 0), x.get("avg", 0.0)), reverse=True)

    top_focus = [{"id": oid, "count": cnt} for oid, cnt in sorted(focus_counts.items(), key=lambda kv: kv[1], reverse=True)[:5]]

    return {
        "recent_episode_ids": recent_episode_ids,
        "recurring_drivers": recurring[:5],
        "top_focused_objects": top_focus,
        "last_seen": last_seen,
        "note": "Memory v0 is heuristic.",
    }


def find_similar_episode_v0(events, *, kpi, fragility, focused_object_id) -> dict | None:
    events = events if isinstance(events, list) else []
    if not events:
        return None

    kpi_now = _safe_dict(kpi)
    frag_now = _safe_dict(fragility)
    level_now = frag_now.get("level")
    score_now = _fnum(frag_now.get("score"), 0.0)
    focus_now = focused_object_id if isinstance(focused_object_id, str) else None

    best = None
    best_val = -1e9
    for ev in events[-100:]:
        if not isinstance(ev, dict):
            continue
        ev_frag = _safe_dict(ev.get("fragility"))
        ev_kpi = _safe_dict(ev.get("kpi"))
        ev_focus = ev.get("focused_object_id")
        val = 0.0

        if focus_now and ev_focus == focus_now:
            val += 2.0
        if level_now and ev_frag.get("level") == level_now:
            val += 2.0

        score_dist = abs(score_now - _fnum(ev_frag.get("score"), 0.0))
        val += max(0.0, 1.0 - score_dist)

        l1 = (
            abs(_fnum(kpi_now.get("inventory"), 0.5) - _fnum(ev_kpi.get("inventory"), 0.5))
            + abs(_fnum(kpi_now.get("delivery"), 0.5) - _fnum(ev_kpi.get("delivery"), 0.5))
            + abs(_fnum(kpi_now.get("risk"), 0.5) - _fnum(ev_kpi.get("risk"), 0.5))
        )
        val += max(0.0, 1.0 - l1 / 3.0)

        if val > best_val:
            best_val = val
            best = ev

    if not isinstance(best, dict):
        return None
    eid = best.get("episode_id")
    if not isinstance(eid, str) or not eid:
        return None
    return {
        "episode_id": eid,
        "score": float(best_val / 6.0),
        "why": "focus+fragility+KPI proximity",
    }


def record_decision_event_v0(
    *,
    user_id: str,
    episode_id: str | None,
    text: str,
    mode: str,
    focused_object_id: str | None,
    allowed_objects: list[str] | None,
    fragility: dict | None,
    kpi: dict | None,
    actions: list[dict] | None,
) -> None:
    store = DecisionMemoryStore()
    safe_actions = actions if isinstance(actions, list) else []
    actions_summary: List[str] = []
    for a in safe_actions[:5]:
        if not isinstance(a, dict):
            continue
        typ = str(a.get("type") or "unknown")
        obj = a.get("object") or a.get("target")
        if isinstance(obj, str) and obj:
            actions_summary.append(f"{typ}:{obj}")
        else:
            actions_summary.append(typ)

    ev = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "episode_id": str(episode_id or ""),
        "text": str(text or ""),
        "mode": str(mode or "business"),
        "focused_object_id": focused_object_id if isinstance(focused_object_id, str) else None,
        "allowed_objects": [x for x in (allowed_objects or []) if isinstance(x, str)],
        "fragility": _safe_dict(fragility),
        "kpi": _safe_dict(kpi),
        "actions_summary": actions_summary,
    }
    store.upsert_event(user_id or "anon", ev)


def build_memory_context_v0(user_id, *, kpi, fragility, focused_object_id) -> dict:
    store = DecisionMemoryStore()
    events = store.get_events(user_id or "anon")
    summary = summarize_memory(events)
    similar = find_similar_episode_v0(
        events,
        kpi=_safe_dict(kpi),
        fragility=_safe_dict(fragility),
        focused_object_id=focused_object_id,
    )
    return {"summary": summary, "similar": similar}
