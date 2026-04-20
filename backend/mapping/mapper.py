"""Deterministic matcher from canonical signals to Nexora object ids."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
import json
import re

from ingestion.schemas import SignalBundle
from mapping.domain.domain_signal_enricher import enrich_signal_bundle_for_mapping
from mapping.domain.finance_mapping import FINANCE_OBJECT_VOCABULARY
from mapping.domain.retail_mapping import RETAIL_OBJECT_VOCABULARY
from mapping.domain.supply_chain_mapping import SUPPLY_CHAIN_OBJECT_VOCABULARY


_OBJECT_DICTIONARY_PATH = Path(__file__).resolve().parents[1] / "data" / "object_dictionary_v1.json"


@dataclass
class RawObjectMatch:
    object_id: str
    score: float = 0.0
    direct_match_count: int = 0
    reasons: list[str] = field(default_factory=list)
    source_signal_ids: set[str] = field(default_factory=set)


def _load_dictionary_vocabulary() -> dict[str, dict[str, object]]:
    if not _OBJECT_DICTIONARY_PATH.exists():
        return {}

    payload = json.loads(_OBJECT_DICTIONARY_PATH.read_text(encoding="utf-8"))
    instances = payload.get("instances", [])
    dictionary: dict[str, dict[str, object]] = {}
    for instance in instances:
        if not isinstance(instance, dict):
            continue
        object_id = str(instance.get("id", "")).strip()
        if not object_id:
            continue
        keywords = {
            *[str(item).strip().lower() for item in instance.get("tags", []) if str(item).strip()],
            *[str(item).strip().lower() for item in instance.get("synonyms", []) if str(item).strip()],
            *[
                str(item).strip().lower()
                for item in (instance.get("domain_hints", {}) or {}).get("business", [])
                if str(item).strip()
            ],
            str(instance.get("label", "")).strip().lower(),
        }
        dictionary[object_id] = {
            "keywords": tuple(keyword for keyword in keywords if keyword),
            "weight": 0.7,
            "related_objects": (),
        }
    return dictionary


_BASE_OBJECT_VOCABULARY = _load_dictionary_vocabulary()

_DOMAIN_VOCABULARY = {
    "retail": {**_BASE_OBJECT_VOCABULARY, **RETAIL_OBJECT_VOCABULARY},
    "finance": {**_BASE_OBJECT_VOCABULARY, **FINANCE_OBJECT_VOCABULARY},
    "supply_chain": {**_BASE_OBJECT_VOCABULARY, **SUPPLY_CHAIN_OBJECT_VOCABULARY},
    "default": {**_BASE_OBJECT_VOCABULARY, **RETAIL_OBJECT_VOCABULARY},
}


def _normalize_text(value: str | None) -> str:
    return " ".join(str(value or "").strip().lower().split())


def _build_signal_match_text(signal_type: str, description: str, entities: list[str]) -> str:
    normalized_description = _normalize_text(description)
    normalized_description = re.sub(
        rf"^detected\s+{re.escape(_normalize_text(signal_type))}\s+pressure\s+from:\s*",
        "",
        normalized_description,
    )
    return _normalize_text(" ".join([normalized_description, *entities]))


def get_domain_vocabulary(domain: str | None) -> dict[str, dict[str, object]]:
    domain_key = _normalize_text(domain)
    if domain_key in ("supply chain", "supply-chain"):
        domain_key = "supply_chain"
    return _DOMAIN_VOCABULARY.get(domain_key, _DOMAIN_VOCABULARY["default"])


def map_signal_bundle(
    signal_bundle: SignalBundle,
    domain: str | None = None,
) -> dict[str, RawObjectMatch]:
    """Return raw deterministic object matches with scores and reasons."""
    enriched, _b13 = enrich_signal_bundle_for_mapping(
        signal_bundle,
        domain or signal_bundle.source.metadata.get("domain"),
    )
    vocabulary = get_domain_vocabulary(domain or enriched.source.metadata.get("domain"))
    raw_matches: dict[str, RawObjectMatch] = {}

    for signal in enriched.signals:
        signal_text = _build_signal_match_text(signal.type, signal.description, signal.entities)
        if not signal_text:
            continue

        for object_id, config in vocabulary.items():
            keywords = tuple(str(keyword).strip().lower() for keyword in config.get("keywords", ()))
            matched_keywords = [keyword for keyword in keywords if keyword and keyword in signal_text]
            if not matched_keywords:
                continue

            weight = float(config.get("weight", 0.65) or 0.65)
            keyword_score = min(1.0, 0.22 * len(matched_keywords))
            score_gain = min(1.0, signal.strength * weight + keyword_score)

            match = raw_matches.setdefault(object_id, RawObjectMatch(object_id=object_id))
            match.score = min(1.0, match.score + score_gain)
            match.direct_match_count += len(matched_keywords)
            match.source_signal_ids.add(signal.id)

            for keyword in matched_keywords:
                reason = f"matched keyword: {keyword}"
                if reason not in match.reasons:
                    match.reasons.append(reason)
            signal_reason = f"signal: {signal.type}"
            if signal_reason not in match.reasons:
                match.reasons.append(signal_reason)

            for related_object_id in config.get("related_objects", ()):
                related_object_id = str(related_object_id).strip()
                if not related_object_id or related_object_id == object_id:
                    continue
                related_match = raw_matches.setdefault(related_object_id, RawObjectMatch(object_id=related_object_id))
                related_gain = min(0.32, signal.strength * 0.28)
                related_match.score = min(1.0, related_match.score + related_gain)
                related_match.source_signal_ids.add(signal.id)
                reason = f"related to: {object_id}"
                if reason not in related_match.reasons:
                    related_match.reasons.append(reason)
                signal_reason = f"signal: {signal.type}"
                if signal_reason not in related_match.reasons:
                    related_match.reasons.append(signal_reason)

    return raw_matches
