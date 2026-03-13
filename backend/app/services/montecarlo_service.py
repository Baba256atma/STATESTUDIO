from __future__ import annotations

import random
import math
from typing import Dict, Any, List, Optional

from app.services.replay_store import ReplayStore
from app.services.montecarlo_report_adapter import build_manager_report


def _clamp01(x: float) -> float:
    return 0.0 if x < 0.0 else 1.0 if x > 1.0 else x


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def _percentile(sorted_vals: List[float], p: float) -> float:
    if not sorted_vals:
        return 0.0
    if p <= 0:
        return sorted_vals[0]
    if p >= 1:
        return sorted_vals[-1]
    idx = (len(sorted_vals) - 1) * p
    lo = int(math.floor(idx))
    hi = int(math.ceil(idx))
    if lo == hi:
        return sorted_vals[lo]
    w = idx - lo
    return sorted_vals[lo] * (1.0 - w) + sorted_vals[hi] * w


def _fragility_for_kpi(kpi: Dict[str, float], base_fragility: Dict[str, Any], ss: Dict[str, Any] | None = None) -> Dict[str, Any]:
    try:
        from app.engines.fragility_v1 import compute_fragility_v1

        ss = ss if isinstance(ss, dict) else {}
        loops = ss.get("loops") if isinstance(ss.get("loops"), list) else []
        allowed_objects = ss.get("allowed_objects") if isinstance(ss.get("allowed_objects"), list) else []
        chaos_dict = ss.get("chaos") if isinstance(ss.get("chaos"), dict) else {}

        class _ChaosShim:
            def __init__(self, intensity: float, volatility: float):
                self.intensity = intensity
                self.volatility = volatility

        intensity = _clamp01(_fnum(chaos_dict.get("intensity", 0.0)))
        volatility = _clamp01(_fnum(chaos_dict.get("volatility", intensity)))
        chaos = _ChaosShim(intensity=intensity, volatility=volatility)

        out = compute_fragility_v1(
            kpi=kpi,
            loops=loops,
            chaos=chaos,
            allowed_objects=[x for x in allowed_objects if isinstance(x, str)],
        )
        score = _clamp01(_fnum(out.get("score", 0.0)))
        level = out.get("level")
        return {"score": score, "level": level}
    except Exception:
        risk = _fnum(kpi.get("risk"), 0.5)
        inv = _fnum(kpi.get("inventory"), 0.5)
        dlv = _fnum(kpi.get("delivery"), 0.5)
        base_score = _fnum(base_fragility.get("score"), 0.5)
        score = _clamp01(base_score + 0.35 * (risk - 0.5) - 0.20 * (inv - 0.5) - 0.20 * (dlv - 0.5))
        level = "high" if score >= 0.65 else "medium" if score >= 0.40 else "low"
        return {"score": score, "level": level}


def run_simulation(
    *,
    kpi: Dict[str, float],
    fragility: Dict[str, Any],
    n: int = 200,
    sigma: float = 0.08,
    seed: Optional[int] = None,
    high_score_threshold: float = 0.65,
) -> Dict[str, Any]:
    base_vec = {
        "inventory": _clamp01(_fnum(kpi.get("inventory"), 0.5)),
        "delivery": _clamp01(_fnum(kpi.get("delivery"), 0.5)),
        "risk": _clamp01(_fnum(kpi.get("risk"), 0.5)),
    }
    ss = {
        "loops": _safe_list(fragility.get("loops")) if isinstance(fragility, dict) else [],
        "allowed_objects": _safe_list(fragility.get("allowed_objects")) if isinstance(fragility, dict) else [],
        "chaos": _safe_dict(fragility.get("chaos")) if isinstance(fragility, dict) else {},
    }
    base_fragility = fragility if isinstance(fragility, dict) else {}

    rng = random.Random(seed)
    n_runs = max(1, int(n))
    sigma_v = float(sigma)

    samples: List[Dict[str, Any]] = []
    scores: List[float] = []
    high_count = 0

    for _ in range(n_runs):
        kv = dict(base_vec)
        for kk in ("inventory", "delivery", "risk"):
            kv[kk] = _clamp01(kv[kk] + rng.gauss(0.0, sigma_v))
        fr = _fragility_for_kpi(kpi=kv, base_fragility=base_fragility, ss=ss)
        score = _clamp01(_fnum(fr.get("score"), 0.0))
        level = fr.get("level")
        scores.append(score)
        if level == "high" or score >= float(high_score_threshold):
            high_count += 1
        samples.append({"kpi": kv, "fragility": {"score": score, "level": level}})

    scores_sorted = sorted(scores)
    mean = sum(scores) / len(scores) if scores else 0.0
    var = sum((x - mean) ** 2 for x in scores) / len(scores) if scores else 0.0
    std = math.sqrt(var)
    return {
        "n": n_runs,
        "sigma": sigma_v,
        "stats": {
            "mean": mean,
            "std": std,
            "p50": _percentile(scores_sorted, 0.50),
            "p90": _percentile(scores_sorted, 0.90),
            "p95": _percentile(scores_sorted, 0.95),
            "min": scores_sorted[0] if scores_sorted else 0.0,
            "max": scores_sorted[-1] if scores_sorted else 0.0,
        },
        "prob": {"p_high": (high_count / len(scores)) if scores else 0.0, "high_count": high_count},
        "worst_cases": sorted(samples, key=lambda s: float(s["fragility"]["score"]), reverse=True)[:3],
        "scores": scores,
    }


def _safe_dict(x: Any) -> Dict[str, Any]:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> List[Any]:
    return x if isinstance(x, list) else []


def run_montecarlo_v0(
    *,
    episode_id: str,
    n: int = 200,
    sigma: float = 0.08,
    seed: Optional[int] = None,
    kpi_keys: Optional[List[str]] = None,
    high_score_threshold: float = 0.65,
) -> Dict[str, Any]:
    store = ReplayStore()
    episode = store.get_episode(episode_id)

    frames = episode.frames or []
    ss = frames[-1].system_state if frames and isinstance(frames[-1].system_state, dict) else {}
    base_kpi = ss.get("kpi") if isinstance(ss.get("kpi"), dict) else {}
    base_fragility = ss.get("fragility") if isinstance(ss.get("fragility"), dict) else {}

    keys = kpi_keys or ["inventory", "delivery", "risk"]
    base_vec = {k: _clamp01(_fnum(base_kpi.get(k, 0.5))) for k in keys}

    sim_fragility = dict(base_fragility)
    sim_fragility["loops"] = ss.get("loops", [])
    sim_fragility["allowed_objects"] = ss.get("allowed_objects", [])
    sim_fragility["chaos"] = ss.get("chaos", {})
    mc_result = run_simulation(
        kpi={k: base_vec.get(k, 0.5) for k in ("inventory", "delivery", "risk")},
        fragility=sim_fragility,
        n=n,
        sigma=sigma,
        seed=seed,
        high_score_threshold=high_score_threshold,
    )
    mc_result["episode_id"] = episode_id

    manager_report = build_manager_report(mc_result)
    return {"result": mc_result, "manager_report": manager_report}
