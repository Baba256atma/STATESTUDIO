"""B.13.b — deterministic domain phrase normalization for signal text (dictionary only, no ML)."""

from __future__ import annotations

import logging
import re
from typing import Final

from ingestion.schemas import Signal, SignalBundle

logger = logging.getLogger(__name__)

_LAST_B13_TRACE_SIG: str | None = None

# (needle pattern, replacement) — applied in order; longest / specific first within domain.
_RULES: Final[dict[str, list[tuple[str, str]]]] = {
    "retail": [
        (r"\bstockout\b", "inventory shortage"),
        (r"\boos\b", "out of stock inventory shortage"),
        (r"\bbackorder\b", "fulfillment backlog delay"),
    ],
    "finance": [
        (r"\bmargin compression\b", "cost pressure margin"),
        (r"\bwc squeeze\b", "working capital strain"),
        (r"\brate shock\b", "interest rate exposure"),
    ],
    "supply_chain": [
        (r"\blead time spike\b", "delivery delay lead time"),
        (r"\btier[- ]?2 supplier\b", "upstream supplier dependency"),
        (r"\bmaterial flow disruption\b", "throughput constraint"),
        (r"\bupstream bottleneck\b", "supplier delay"),
    ],
    "default": [
        (r"\bstockout\b", "inventory shortage"),
        (r"\blead time spike\b", "delivery delay"),
    ],
}


def _resolve_bucket(domain: str | None, metadata_domain: str | None) -> str:
    raw = " ".join(str(domain or metadata_domain or "").strip().lower().split())
    if not raw:
        return "default"
    if "supply_chain" in raw or raw == "scm" or "supplier network" in raw:
        return "supply_chain"
    if "finance" in raw or "finops" in raw or "treasury" in raw:
        return "finance"
    if "retail" in raw or "commerce" in raw or "merchant" in raw:
        return "retail"
    return "default"


def _apply_rules(text: str, bucket: str) -> tuple[str, bool]:
    if not text:
        return text, False
    out = text
    changed = False
    rules = _RULES.get(bucket, []) + _RULES.get("default", [])
    for pattern, repl in rules:
        new_out, n = re.subn(pattern, repl, out, flags=re.IGNORECASE)
        if n:
            out = new_out
            changed = True
    return out, changed


def enrich_signal_bundle_for_mapping(
    signal_bundle: SignalBundle,
    domain: str | None,
) -> tuple[SignalBundle, bool]:
    """Return a shallow-updated bundle when any signal / source text was enriched."""
    meta_dom = signal_bundle.source.metadata.get("domain")
    if hasattr(meta_dom, "strip"):
        meta_dom = str(meta_dom).strip().lower()
    else:
        meta_dom = str(meta_dom or "").strip().lower()
    bucket = _resolve_bucket(domain, meta_dom)
    any_changed = False

    new_signals: list[Signal] = []
    for sig in signal_bundle.signals:
        desc, dch = _apply_rules(sig.description, bucket)
        lab, lch = _apply_rules(sig.label, bucket)
        if dch or lch:
            any_changed = True
            new_signals.append(sig.model_copy(update={"description": desc, "label": lab}))
        else:
            new_signals.append(sig)

    raw = signal_bundle.source.raw_content or ""
    raw2, rch = _apply_rules(raw, bucket)
    new_source = signal_bundle.source
    if rch:
        any_changed = True
        new_source = signal_bundle.source.model_copy(update={"raw_content": raw2})

    if not any_changed:
        return signal_bundle, False

    out = signal_bundle.model_copy(update={"signals": new_signals, "source": new_source})
    trace_sig = f"{bucket}:{hash(out.source.raw_content) & 0xFFFF}:{len(out.signals)}"
    global _LAST_B13_TRACE_SIG
    if trace_sig != _LAST_B13_TRACE_SIG:
        _LAST_B13_TRACE_SIG = trace_sig
        logger.info("[Nexora][B13] domain_applied bucket=%s signals=%s", bucket, len(new_signals))
    return out, True
