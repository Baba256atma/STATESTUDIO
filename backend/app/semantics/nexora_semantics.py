# backend/app/semantics/nexora_semantics.py

# ==============================
# Nexora MVP: Synonym → Canonical Focus Resolver
# Canonical scene object IDs:
#   - obj_inventory  (Warehouse load)
#   - obj_delivery   (Delivery)
#   - obj_risk_zone  (Exposure)
# ==============================

NEXORA_SYNONYMS = {
    "obj_inventory": {
        "inventory", "stock", "storage", "warehouse", "warehouse load",
        "stockout", "stock-out", "backorder", "back-order",
        "reorder", "re-order", "supply", "materials", "spares",
    },
    "obj_delivery": {
        "delivery", "deliver", "shipping", "shipment",
        "schedule", "deadline", "delay", "late",
        "lead time", "leadtime", "eta", "due",
        "on time", "ontime", "time pressure", "time",
    },
    "obj_risk_zone": {
        "exposure", "risk", "vulnerability",
        "quality", "defect", "defects", "rework", "scrap",
        "incident", "failure", "issue",
        "nonconformance", "non-conformance",
    },
    "obj_cashflow": {
        "cashflow", "cash flow", "liquidity", "runway", "burn rate", "burn-rate",
        "revenue", "income", "sales", "expenses", "cost", "costs", "profit", "loss",
        "margin", "budget", "capex", "opex",
    },
    "obj_capacity": {
        "capacity", "throughput", "utilization", "utilisation", "workload", "load",
        "bottleneck", "constraint", "bandwidth", "resources", "headcount", "staffing",
        "availability", "backlog",
    },
}

NEXORA_SYNONYM_PHRASES: list[tuple[str, str]] = []
for _cid, _terms in NEXORA_SYNONYMS.items():
    for _t in _terms:
        if " " in _t:
            NEXORA_SYNONYM_PHRASES.append((_t, _cid))
NEXORA_SYNONYM_PHRASES.sort(key=lambda x: len(x[0]), reverse=True)

_GREETING_PREFIXES = ("hello", "hi", "hey", "thanks", "thank you", "salam", "درود", "سلام")


def _normalize_tokens(text: str) -> list[str]:
    return [
        token
        for token in (
            text.replace("/", " ")
            .replace("-", " ")
            .replace(",", " ")
            .replace(".", " ")
            .split()
        )
        if token
    ]


def _token_variants(token: str) -> set[str]:
    token = token.strip()
    variants = {token}
    if token.endswith("s") and len(token) > 4:
        variants.add(token[:-1])
    return {variant for variant in variants if variant}


def infer_allowed_objects_from_text(text: str) -> list[str]:
    if not text or not isinstance(text, str):
        return []

    t = " ".join(text.lower().strip().split())
    if not t:
        return []
    if any(t.startswith(prefix) for prefix in _GREETING_PREFIXES):
        return []

    scores: dict[str, float] = {}

    # phrase matches first
    for phrase, cid in NEXORA_SYNONYM_PHRASES:
        if phrase in t:
            scores[cid] = max(scores.get(cid, 0.0), 2.4)

    # token matches fallback
    tokens = set(_normalize_tokens(t))
    for cid, terms in NEXORA_SYNONYMS.items():
        for term in terms:
            normalized_term = " ".join(term.lower().strip().split())
            if " " in normalized_term:
                phrase_tokens = _normalize_tokens(normalized_term)
                if phrase_tokens and all(any(candidate in _token_variants(token) for token in tokens) for candidate in phrase_tokens):
                    scores[cid] = max(scores.get(cid, 0.0), 1.8)
                continue
            term_variants = _token_variants(normalized_term)
            if any(token in term_variants or any(token.startswith(variant) or variant.startswith(token) for variant in term_variants) for token in tokens):
                scores[cid] = max(scores.get(cid, 0.0), 1.1)

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    return [cid for cid, score in ranked if score >= 1.0][:4]
