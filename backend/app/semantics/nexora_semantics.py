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


def infer_allowed_objects_from_text(text: str) -> list[str]:
    if not text or not isinstance(text, str):
        return []

    t = " ".join(text.lower().strip().split())
    if not t:
        return []

    hits: list[str] = []

    # phrase matches first
    for phrase, cid in NEXORA_SYNONYM_PHRASES:
        if phrase in t and cid not in hits:
            hits.append(cid)

    # token matches fallback
    tokens = set(
        t.replace("/", " ")
         .replace("-", " ")
         .replace(",", " ")
         .replace(".", " ")
         .split()
    )
    for cid, terms in NEXORA_SYNONYMS.items():
        if cid in hits:
            continue
        for term in terms:
            if " " in term:
                continue
            if term in tokens:
                hits.append(cid)
                break

    return hits
