"""Public service API for deterministic signal-to-object mapping."""

from __future__ import annotations

import logging

from ingestion.schemas import SignalBundle
from mapping.mapper import map_signal_bundle
from mapping.rules import classify_role, limit_role_buckets
from mapping.schemas import ObjectImpact, ObjectImpactSet


logger = logging.getLogger(__name__)


def map_signals_to_objects(
    signal_bundle: SignalBundle,
    domain: str | None = None,
) -> ObjectImpactSet:
    """Map canonical signals to explainable Nexora object impacts."""
    raw_matches = map_signal_bundle(signal_bundle=signal_bundle, domain=domain)
    ranked_matches = sorted(
        raw_matches.values(),
        key=lambda item: (round(item.score, 6), item.object_id),
        reverse=True,
    )

    impacts_by_role: dict[str, list[ObjectImpact]] = {
        "primary": [],
        "affected": [],
        "context": [],
    }

    for rank, match in enumerate(ranked_matches):
        role = classify_role(rank=rank, score=match.score, direct_match_count=match.direct_match_count)
        if role is None:
            continue
        impacts_by_role[role].append(
            ObjectImpact(
                object_id=match.object_id,
                role=role,
                score=round(match.score, 4),
                reasons=match.reasons,
                source_signal_ids=sorted(match.source_signal_ids),
            )
        )

    bounded_impacts = limit_role_buckets(impacts_by_role)
    result = ObjectImpactSet(
        primary=bounded_impacts["primary"],
        affected=bounded_impacts["affected"],
        context=bounded_impacts["context"],
    )

    logger.info(
        "mapping_completed signal_count=%s matched_objects=%s primary=%s",
        len(signal_bundle.signals),
        [impact.object_id for impact in [*result.primary, *result.affected, *result.context]],
        [impact.object_id for impact in result.primary],
    )

    return result
