"""Adapter to convert Monte Carlo output into a manager-ready HUD report."""
from __future__ import annotations

from typing import Any


def clamp(x: Any, lo: float = 0.0, hi: float = 1.0) -> float:
    try:
        v = float(x)
    except Exception:
        return float(lo)
    if v < lo:
        return float(lo)
    if v > hi:
        return float(hi)
    return float(v)


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def _safe_dict(x: Any) -> dict:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> list:
    return x if isinstance(x, list) else []


def percentile(values: list[float], p: float) -> float:
    vals = sorted(_fnum(v, 0.0) for v in values)
    if not vals:
        return 0.0
    p = clamp(p, 0.0, 1.0)
    idx = (len(vals) - 1) * p
    lo = int(idx)
    hi = min(lo + 1, len(vals) - 1)
    if lo == hi:
        return vals[lo]
    w = idx - lo
    return vals[lo] * (1.0 - w) + vals[hi] * w


def _build_histogram(values: list[float], n_bins: int = 12) -> list[dict]:
    counts = [0 for _ in range(n_bins)]
    for v in values:
        x = clamp(v, 0.0, 1.0)
        i = min(int(x * n_bins), n_bins - 1)
        counts[i] += 1
    bins: list[dict] = []
    w = 1.0 / n_bins
    for i, c in enumerate(counts):
        x0 = i * w
        x1 = (i + 1) * w
        bins.append({"x0": round(x0, 3), "x1": round(x1, 3), "count": int(c)})
    return bins


def _infer_recommendations(worst_cases: list[dict]) -> list[dict]:
    recs: list[dict] = []
    if not worst_cases:
        return recs
    seen: set[str] = set()
    for wc in worst_cases[:3]:
        kpi = _safe_dict(_safe_dict(wc).get("kpi"))
        inv = clamp(kpi.get("inventory", 0.5))
        risk = clamp(kpi.get("risk", 0.5))
        dlv = clamp(kpi.get("delivery", 0.5))
        if inv < 0.4 and "inventory" not in seen:
            seen.add("inventory")
            recs.append({"title": "Increase inventory buffer", "why": "Low inventory appears in worst cases.", "action": "Raise safety stock for critical items."})
        if risk > 0.6 and "risk" not in seen:
            seen.add("risk")
            recs.append({"title": "Reduce exposure / add controls", "why": "Risk is elevated in worst-case scenarios.", "action": "Add controls and mitigation checkpoints."})
        if dlv < 0.4 and "delivery" not in seen:
            seen.add("delivery")
            recs.append({"title": "Reduce schedule pressure", "why": "Delivery is stressed in worst-case runs.", "action": "Rebalance deadlines and protect critical path."})
    if not recs:
        recs.append({"title": "Stabilize top driver", "why": "Worst cases cluster at higher fragility.", "action": "Target the strongest KPI pressure first."})
    return recs[:3]


def build_manager_report(mc: dict) -> dict:
    mc = _safe_dict(mc)
    stats_in = _safe_dict(mc.get("stats"))
    worst_cases = _safe_list(mc.get("worst_cases"))[:3]

    scores = [clamp(_safe_dict(x).get("fragility", {}).get("score", 0.0)) for x in worst_cases]
    p_high = clamp(_safe_dict(mc.get("prob")).get("p_high", 0.0))

    mean = _fnum(stats_in.get("mean", 0.0))
    std = _fnum(stats_in.get("std", 0.0))
    p50 = _fnum(stats_in.get("p50", percentile(scores, 0.50)))
    p90 = _fnum(stats_in.get("p90", percentile(scores, 0.90)))
    p95 = _fnum(stats_in.get("p95", percentile(scores, 0.95)))
    mn = _fnum(stats_in.get("min", min(scores) if scores else 0.0))
    mx = _fnum(stats_in.get("max", max(scores) if scores else 0.0))

    if p_high >= 0.40:
        level = "danger"
        headline = "Fragility is unstable under uncertainty"
    elif p_high >= 0.20:
        level = "warning"
        headline = "Fragility is sensitive to small changes"
    else:
        level = "safe"
        headline = "Fragility looks stable under uncertainty"

    bins = _build_histogram(scores if scores else [mean], n_bins=12)

    return {
        "badge": {"level": level, "p_high": p_high},
        "stats": {"mean": mean, "std": std, "p50": p50, "p90": p90, "p95": p95, "min": mn, "max": mx},
        "chart": {"type": "histogram", "bins": bins},
        "worst_cases": worst_cases,
        "recommendations": _infer_recommendations(worst_cases),
        "hud": {
            "primary_metric": {"label": "P(high risk)", "value": p_high},
            "secondary_metrics": [
                {"label": "P90 fragility", "value": p90},
                {"label": "Mean fragility", "value": mean},
            ],
        },
        "summary": {"headline": headline},
    }
