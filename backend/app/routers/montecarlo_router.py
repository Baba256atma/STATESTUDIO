"""Monte Carlo endpoints (v0)."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Any, List, Optional
import random
import math

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.engines.fragility_v1 import compute_fragility_v1
from app.services.replay_store import ReplayStore
from app.utils import responses

router = APIRouter()
store = ReplayStore()


class MonteCarloRunIn(BaseModel):
    episode_id: str = Field(..., description="Episode to sample from (uses last frame system_state)")
    n: int = Field(200, ge=10, le=5000)
    sigma: float = Field(0.08, ge=0.0, le=1.0, description="Noise scale for KPI perturbations")
    seed: Optional[int] = None
    # Which KPIs to perturb (if missing, defaults to inventory/delivery/risk)
    kpi_keys: Optional[List[str]] = None
    # Threshold for 'high' probability if level missing (score threshold)
    high_score_threshold: float = Field(0.65, ge=0.0, le=1.0)


def _clamp01(x: float) -> float:
    return 0.0 if x < 0.0 else 1.0 if x > 1.0 else x


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def _safe_dict(x: Any) -> Dict[str, Any]:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> List[Any]:
    return x if isinstance(x, list) else []


def _extract_last_state(episode) -> Dict[str, Any]:
    frames = episode.frames or []
    if not frames:
        return {}
    fr = frames[-1]
    ss = fr.system_state if isinstance(fr.system_state, dict) else {}
    return ss


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
    return sorted_vals[lo] * (1 - w) + sorted_vals[hi] * w


def compute_fragility_local(kpi: Dict[str, float], base_fragility: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calls the shared fragility engine used by chat/scenario.
    Keeps Monte Carlo output minimal: score + level.
    """
    class _ChaosShim:
        def __init__(self, intensity: float, volatility: float):
            self.intensity = intensity
            self.volatility = volatility

    chaos_dict = _safe_dict(base_fragility.get("chaos"))
    intensity = _clamp01(_fnum(chaos_dict.get("intensity"), 0.0))
    volatility = _clamp01(_fnum(chaos_dict.get("volatility"), intensity))
    chaos = _ChaosShim(intensity=intensity, volatility=volatility)

    loops = _safe_list(base_fragility.get("loops"))
    allowed_objects = _safe_list(base_fragility.get("allowed_objects"))

    out = compute_fragility_v1(
        kpi=kpi,
        loops=loops,
        chaos=chaos,
        allowed_objects=[x for x in allowed_objects if isinstance(x, str)],
    )
    return {"score": _fnum(out.get("score"), 0.0), "level": out.get("level")}


@router.post("/montecarlo/run")
def run_montecarlo(payload: MonteCarloRunIn) -> Dict[str, Any]:
    try:
        episode = store.get_episode(payload.episode_id)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None

    ss = _extract_last_state(episode)
    base_kpi = _safe_dict(ss.get("kpi"))
    base_fragility = _safe_dict(ss.get("fragility"))
    base_fragility["loops"] = _safe_list(ss.get("loops"))
    base_fragility["allowed_objects"] = _safe_list(ss.get("allowed_objects"))
    base_fragility["chaos"] = _safe_dict(ss.get("chaos"))

    keys = payload.kpi_keys or ["inventory", "delivery", "risk"]
    base_vec = {k: _clamp01(_fnum(base_kpi.get(k, 0.5))) for k in keys}

    rng = random.Random(payload.seed)

    samples: List[Dict[str, Any]] = []
    scores: List[float] = []
    high_count = 0

    for i in range(int(payload.n)):
        kpi = dict(base_vec)

        # Gaussian noise per KPI
        for k in keys:
            kpi[k] = _clamp01(kpi[k] + rng.gauss(0.0, float(payload.sigma)))

        fr = compute_fragility_local(kpi=kpi, base_fragility=base_fragility)
        score = _fnum(fr.get("score"), 0.0)
        level = fr.get("level")

        scores.append(score)
        is_high = (level == "high") or (score >= float(payload.high_score_threshold))
        if is_high:
            high_count += 1

        # Keep small per-sample payload (for debugging); store only top/worst later
        samples.append({"kpi": kpi, "fragility": {"score": score, "level": level}})

    scores_sorted = sorted(scores)
    mean = sum(scores) / len(scores) if scores else 0.0
    var = sum((x - mean) ** 2 for x in scores) / len(scores) if scores else 0.0
    std = math.sqrt(var)

    p50 = _percentile(scores_sorted, 0.50)
    p90 = _percentile(scores_sorted, 0.90)
    p95 = _percentile(scores_sorted, 0.95)

    # Worst cases: pick 3 samples with highest fragility score
    worst = sorted(samples, key=lambda s: float(s["fragility"]["score"]), reverse=True)[:3]

    result = {
        "episode_id": payload.episode_id,
        "n": int(payload.n),
        "sigma": float(payload.sigma),
        "high_score_threshold": float(payload.high_score_threshold),
        "stats": {
            "mean": mean,
            "std": std,
            "p50": p50,
            "p90": p90,
            "p95": p95,
            "min": scores_sorted[0] if scores_sorted else 0.0,
            "max": scores_sorted[-1] if scores_sorted else 0.0,
        },
        "prob": {
            "p_high": high_count / len(scores) if scores else 0.0,
            "high_count": high_count,
        },
        "worst_cases": worst,
    }

    return responses.ok(result)
