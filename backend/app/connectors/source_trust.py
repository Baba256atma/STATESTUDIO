"""B.10.e.6 — deterministic source trust scores for multi-source merge weighting (no ML)."""

from __future__ import annotations

import math
from typing import Any

from ingestion.schemas import Signal

# Product trust band: explainable numeric weights applied to signal.strength.
_TRUST_WEB_VERIFIED = 1.0
_TRUST_WEB_UNKNOWN = 0.5
_TRUST_WEB_DEFAULT = 0.65
_TRUST_CSV = 0.7
_TRUST_MANUAL = 0.7
_TRUST_PDF = 0.7
_TRUST_API = 0.78
_TRUST_LOW_FLOOR = 0.4


def resolve_source_trust_score(connector_id: str, metadata: dict[str, Any] | None) -> float:
    """
    Return a trust multiplier in ~[0.4, 1.0] used to scale signal strength during merge.
    Incorporates connector role and policy hints (e.g. web trust_level from allowlist gate).
    """
    cid = (connector_id or "").strip()
    meta = metadata if isinstance(metadata, dict) else {}

    if cid == "web_source":
        tl = str(meta.get("trust_level") or "").strip().lower()
        if tl == "verified":
            return _TRUST_WEB_VERIFIED
        if tl == "unknown":
            return _TRUST_WEB_UNKNOWN
        return _TRUST_WEB_DEFAULT

    if cid == "csv_upload":
        return _TRUST_CSV
    if cid == "manual_text":
        return _TRUST_MANUAL
    if cid == "pdf_upload":
        return _TRUST_PDF
    if cid == "api_feed":
        return _TRUST_API

    # Unregistered / test connector ids: lowest deterministic tier (product "low" trust).
    return _TRUST_LOW_FLOOR


def trust_tier_from_score(score: float) -> str:
    """Discrete label for merge_meta / logs."""
    s = float(score)
    if s >= 0.9:
        return "high"
    if s >= 0.65:
        return "medium"
    return "low"


def resolve_source_trust_label(connector_id: str, metadata: dict[str, Any] | None) -> str:
    """Human-readable tier derived from the same rules as `resolve_source_trust_score`."""
    return trust_tier_from_score(resolve_source_trust_score(connector_id, metadata))


def apply_source_weight_to_signal(signal: Signal, trust_score: float, connector_id: str) -> Signal:
    """
    Scale signal.strength by trust, clamp to [0, 1]. Does not mutate the input signal.
    Adds compact merge provenance on `signal.metadata`.
    """
    ts = max(0.0, min(1.0, float(trust_score)))
    if not math.isfinite(signal.strength):
        raw = 0.0
    else:
        raw = float(signal.strength)
    weighted = min(1.0, max(0.0, raw * ts))
    meta = dict(signal.metadata) if signal.metadata else {}
    meta["merge_source_connector"] = connector_id.strip() or "unknown"
    meta["merge_trust_score"] = round(ts, 4)
    meta["merge_weighted_from_strength"] = round(raw, 6)
    return signal.model_copy(update={"strength": round(weighted, 6), "metadata": meta})
