"""B.10.e.2 — Multi-source ingestion merge service."""

from __future__ import annotations

import logging
from typing import Any

from ingestion.schemas import Signal, SignalBundle
from ingestion.service import IngestionService

from app.connectors.connector_runner import run_connector
from app.connectors.merge_contract import (
    ConnectorRunResult,
    MergedSignalBundle,
    MultiSourceIngestionRequest,
    MultiSourceIngestionResponse,
)
from app.connectors.source_trust import (
    apply_source_weight_to_signal,
    resolve_source_trust_score,
    trust_tier_from_score,
)

logger = logging.getLogger(__name__)


def _signal_dedupe_key(signal: Signal) -> str:
    return f"{signal.type.strip().lower()}::{signal.label.strip().lower()}::{signal.description.strip().lower()}"


def _with_trust_weighted_bundles(
    results: list[ConnectorRunResult],
) -> tuple[list[ConnectorRunResult], dict[str, float]]:
    """Per successful source: scale signals by trust; track max trust per connector_id."""
    weighted: list[ConnectorRunResult] = []
    source_weights: dict[str, float] = {}
    for r in results:
        if not r.ok or r.bundle is None:
            weighted.append(r)
            continue
        combined_meta: dict[str, Any] = {**dict(r.bundle.source.metadata), **dict(r.metadata)}
        trust = resolve_source_trust_score(r.connector_id, combined_meta)
        prev = source_weights.get(r.connector_id)
        if prev is None or trust > prev:
            source_weights[r.connector_id] = trust
        w_signals = [apply_source_weight_to_signal(s, trust, r.connector_id) for s in r.bundle.signals]
        new_bundle = r.bundle.model_copy(update={"signals": w_signals})
        weighted.append(r.model_copy(update={"bundle": new_bundle}))
    return weighted, dict(sorted(source_weights.items()))


def merge_signals(results: list[ConnectorRunResult]) -> list[Signal]:
    """Deterministic signal merge with simple stable dedupe."""
    merged_by_key: dict[str, Signal] = {}
    source_order = results
    for result in source_order:
        if not result.ok or result.bundle is None:
            continue
        for signal in result.bundle.signals:
            key = _signal_dedupe_key(signal)
            existing = merged_by_key.get(key)
            if existing is None:
                merged_by_key[key] = signal
                continue
            # Keep stronger signal if duplicated and strength differs.
            if signal.strength > existing.strength:
                merged_by_key[key] = signal
    # Stable deterministic ordering independent of dict insertion details.
    return sorted(
        merged_by_key.values(),
        key=lambda s: (s.type.lower(), s.label.lower(), s.description.lower(), s.id),
    )


def _build_warnings(results: list[ConnectorRunResult]) -> list[str]:
    warnings: list[str] = []
    failed_ids = [r.connector_id for r in results if not r.ok]
    zero_signal_ids = [r.connector_id for r in results if r.ok and r.bundle is not None and len(r.bundle.signals) == 0]
    if failed_ids:
        warnings.append(f"failed_sources:{','.join(failed_ids)}")
    if zero_signal_ids:
        warnings.append(f"zero_signal_sources:{','.join(zero_signal_ids)}")
    return warnings


async def run_multi_source_ingestion(
    request: MultiSourceIngestionRequest,
) -> MultiSourceIngestionResponse:
    """Run all requested connectors, merge results, and keep partial failures."""
    service = IngestionService()
    source_results: list[ConnectorRunResult] = []
    top_level_errors: list[str] = []

    for source in request.sources:
        run_meta: dict[str, Any] = {"config_keys": sorted(source.config.keys())}
        if request.domain:
            run_meta["domain"] = request.domain
        try:
            bundle: SignalBundle = await run_connector(source.connector_id, source.config, service)
            source_results.append(
                ConnectorRunResult(
                    connector_id=source.connector_id,
                    ok=True,
                    bundle=bundle,
                    errors=[],
                    metadata=run_meta,
                )
            )
        except Exception as exc:
            err = str(exc).strip() or "connector_run_failed"
            top_level_errors.append(f"{source.connector_id}: {err}")
            source_results.append(
                ConnectorRunResult(
                    connector_id=source.connector_id,
                    ok=False,
                    bundle=None,
                    errors=[err],
                    metadata=run_meta,
                )
            )

    weighted_results, source_weights = _with_trust_weighted_bundles(source_results)
    merged_signals = merge_signals(weighted_results)
    successful_source_count = sum(1 for r in source_results if r.ok)
    failed_source_count = len(source_results) - successful_source_count
    source_count = len(source_results)
    trust_summary = "; ".join(
        f"{cid}:{trust_tier_from_score(score)}({round(score, 4)})" for cid, score in source_weights.items()
    )
    merge_meta: dict[str, Any] = {
        "source_count": source_count,
        "successful_source_count": successful_source_count,
        "failed_source_count": failed_source_count,
        "merged_signal_count": len(merged_signals),
        "weighted_signal_count": len(merged_signals),
        "source_weights": {k: round(v, 4) for k, v in source_weights.items()},
        "source_trust_summary": trust_summary,
    }
    if successful_source_count > 0:
        logger.info(
            "[Nexora][MultiSourceTrust] weighting_applied merged_signals=%s source_weights=%s",
            len(merged_signals),
            merge_meta["source_weights"],
        )
    merged_bundle = MergedSignalBundle(
        sources=source_results,
        signals=merged_signals,
        summary=f"Merged {successful_source_count} sources with {len(merged_signals)} signals" if source_count > 0 else None,
        warnings=_build_warnings(source_results),
        merge_meta=merge_meta,
    )
    return MultiSourceIngestionResponse(
        ok=successful_source_count > 0,
        bundle=merged_bundle,
        errors=top_level_errors,
    )

