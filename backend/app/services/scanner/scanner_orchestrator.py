"""Main orchestrator for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

import logging
from typing import Any

try:
    from app.models.scanner_input import FragilityScanRequest
    from app.models.scanner_output import FragilityDriver, FragilityFinding, FragilityScanResponse
    from app.services.scanner.findings_builder import (
        build_fragility_findings,
        build_panel_advice_slice,
        build_panel_timeline_slice,
        build_panel_war_room_slice,
        build_fragility_summary,
        build_recommended_actions,
    )
    from app.services.scanner.fragility_evaluator import evaluate_fragility
    from app.services.scanner.scene_payload_builder import build_fragility_scene_payload
    from ingestion.schemas import SignalBundle, SourceDocument
    from ingestion.service import IngestionService
    from mapping.service import map_signals_to_objects
except ModuleNotFoundError:
    from app.models.scanner_input import FragilityScanRequest
    from app.models.scanner_output import FragilityDriver, FragilityFinding, FragilityScanResponse
    from app.services.scanner.findings_builder import (
        build_fragility_findings,
        build_panel_advice_slice,
        build_panel_timeline_slice,
        build_panel_war_room_slice,
        build_fragility_summary,
        build_recommended_actions,
    )
    from app.services.scanner.fragility_evaluator import evaluate_fragility
    from app.services.scanner.scene_payload_builder import build_fragility_scene_payload
    from ingestion.schemas import SignalBundle, SourceDocument
    from ingestion.service import IngestionService
    from mapping.service import map_signals_to_objects


class FragilityScannerOrchestrator:
    """Coordinate the end-to-end Fragility Scanner MVP pipeline."""

    def run_scan(self, request_data: dict) -> dict[str, Any]:
        """Execute the scanner pipeline and return a packaged response payload."""
        request = FragilityScanRequest.model_validate(request_data)
        signal_bundle = self._resolve_signal_bundle(request)
        object_impacts = map_signals_to_objects(
            signal_bundle=signal_bundle,
            domain=request.metadata.get("domain") if isinstance(request.metadata, dict) else None,
        )
        scoring = evaluate_fragility(signal_bundle, object_impacts)
        signal_dicts = self._serialize_signals(signal_bundle)
        findings_payload = build_fragility_findings(signal_dicts, scoring)
        summary_text = build_fragility_summary(signal_dicts, scoring)
        suggested_actions = build_recommended_actions(signal_dicts, scoring)
        suggested_objects = [
            *[impact.object_id for impact in object_impacts.primary],
            *[impact.object_id for impact in object_impacts.affected],
        ]
        reasons_by_object = self._reasons_by_object(object_impacts)
        scene_payload = build_fragility_scene_payload(
            object_impacts=object_impacts,
            fragility_score=float(scoring.get("fragility_score", 0.0) or 0.0),
            drivers=self._build_driver_payloads(signal_bundle, scoring),
            findings=findings_payload,
            reasons_by_object=reasons_by_object,
        )
        drivers = self._build_drivers(signal_bundle, scoring)
        confidence = float(scoring.get("confidence", 0.0) or 0.0)
        related_object_ids = [impact.object_id for impact in object_impacts.primary + object_impacts.affected]
        driver_payloads = [driver.model_dump() for driver in drivers]
        advice_slice = build_panel_advice_slice(summary_text, suggested_actions, driver_payloads)
        advice_slice["related_object_ids"] = related_object_ids[:5]
        advice_slice["confidence"] = {
            "level": confidence,
            "score": float(scoring.get("fragility_score", 0.0) or 0.0),
        }
        timeline_slice = build_panel_timeline_slice(
            driver_payloads,
            related_object_ids,
            confidence,
        )
        war_room_slice = build_panel_war_room_slice(
            str(scoring.get("fragility_level", "low") or "low"),
            driver_payloads,
            suggested_actions,
            related_object_ids,
            summary_text,
        )

        if not advice_slice.get("recommendations"):
            logging.warning("scanner_panel_slice_missing_recommendations source_type=%s", signal_bundle.source.type)
        if not timeline_slice.get("events"):
            logging.warning("scanner_panel_slice_missing_events source_type=%s", signal_bundle.source.type)
        if not war_room_slice.get("headline"):
            logging.warning("scanner_panel_slice_missing_headline source_type=%s", signal_bundle.source.type)

        response = FragilityScanResponse(
            ok=True,
            summary=summary_text,
            summary_detail={
                "text": summary_text,
                "confidence": confidence,
            },
            fragility_score=float(scoring.get("fragility_score", 0.0) or 0.0),
            fragility_level=str(scoring.get("fragility_level", "low") or "low"),
            drivers=drivers,
            signals=[signal.type for signal in signal_bundle.signals],
            object_impacts=object_impacts,
            findings=self._build_findings(findings_payload, suggested_objects),
            suggested_objects=suggested_objects,
            suggested_actions=suggested_actions,
            scene_payload=scene_payload,
            advice_slice=advice_slice,
            timeline_slice=timeline_slice,
            war_room_slice=war_room_slice,
            debug={
                "source_type": signal_bundle.source.type,
                "signal_count": len(signal_bundle.signals),
                "category_scores": scoring.get("category_scores", {}),
                "score_reasons": scoring.get("score_reasons", []),
                "primary_objects": [impact.object_id for impact in object_impacts.primary],
            },
        )
        return response.model_dump()

    @staticmethod
    def _resolve_signal_bundle(request: FragilityScanRequest) -> SignalBundle:
        """Build canonical signals through ingestion or accept them directly."""
        if request.signal_bundle is not None:
            return SignalBundle.model_validate(request.signal_bundle)

        ingestion_service = IngestionService()
        metadata = dict(request.metadata or {})
        if request.source_name:
            metadata.setdefault("source_name", request.source_name)
        if request.mode:
            metadata.setdefault("scanner_mode", request.mode)

        if request.source_url:
            metadata.setdefault("source_url", request.source_url)
            return ingestion_service.ingest("web", request.source_url, metadata)

        payload = request.payload or request.text or ""
        input_type = request.source_type if request.source_type in {"text", "pdf", "csv", "web"} else "text"
        return ingestion_service.ingest(input_type, payload, metadata)

    @staticmethod
    def _serialize_signals(signal_bundle: SignalBundle) -> list[dict[str, Any]]:
        """Convert canonical signals into legacy finding inputs."""
        return [
            {
                "id": signal.id,
                "label": signal.type.replace("_", " ").title(),
                "score": signal.strength,
                "severity": "high" if signal.strength >= 0.8 else "moderate" if signal.strength >= 0.45 else "low",
                "dimension": signal.type,
                "matched_terms": signal.entities,
                "evidence_text": signal.description,
            }
            for signal in signal_bundle.signals
        ]

    @classmethod
    def _build_driver_payloads(cls, signal_bundle: SignalBundle, scoring: dict[str, Any]) -> list[dict[str, Any]]:
        return [driver.model_dump() for driver in cls._build_drivers(signal_bundle, scoring)]

    @staticmethod
    def _build_drivers(signal_bundle: SignalBundle, scoring: dict[str, Any]) -> list[FragilityDriver]:
        """Convert category diagnostics into canonical driver models."""
        category_scores = scoring.get("category_scores", {}) or {}
        category_reasons = scoring.get("category_reasons", {}) or {}
        signal_ids_by_category: dict[str, list[str]] = {}

        for signal in signal_bundle.signals:
            category = _signal_type_to_category(signal.type)
            signal_ids_by_category.setdefault(category, []).append(signal.id)

        drivers: list[FragilityDriver] = []
        for category, score in sorted(category_scores.items(), key=lambda item: (item[1], item[0]), reverse=True)[:5]:
            reason = (
                category_reasons.get(category, [f"{category} is contributing to overall fragility."])[0]
            )
            severity = (
                "critical"
                if score >= 0.82
                else "high"
                if score >= 0.6
                else "moderate"
                if score >= 0.3
                else "low"
            )
            drivers.append(
                FragilityDriver(
                    id=f"driver_{category}",
                    label=category.replace("_", " ").title(),
                    category=category,
                    strength=float(score),
                    reason=str(reason),
                    source_signal_ids=signal_ids_by_category.get(category, []),
                    score=float(score),
                    severity=severity,
                    dimension=category,
                    evidence_text=str(reason),
                )
            )
        return drivers

    @staticmethod
    def _reasons_by_object(object_impacts) -> dict[str, list[str]]:
        reasons: dict[str, list[str]] = {}
        for impact in [*object_impacts.primary, *object_impacts.affected, *object_impacts.context]:
            reasons[impact.object_id] = impact.reasons
        return reasons

    @staticmethod
    def _build_findings(findings_payload: list[dict], suggested_objects: list[str]) -> list[FragilityFinding]:
        """Convert business findings into response models."""
        findings = []
        for item in findings_payload:
            if not isinstance(item, dict):
                continue
            findings.append(
                FragilityFinding(
                    id=str(item.get("id", "fragility_finding") or "fragility_finding"),
                    title=str(item.get("title", "Fragility Finding") or "Fragility Finding"),
                    severity=str(item.get("severity", "medium") or "medium"),
                    explanation=str(item.get("explanation", "") or ""),
                    recommendation=str(item.get("recommendation", "Review this fragility driver.") or "Review this fragility driver."),
                )
            )
        return findings


def _signal_type_to_category(signal_type: str) -> str:
    normalized = str(signal_type or "").strip().lower()
    if normalized == "delay":
        return "delay_pressure"
    if normalized == "cost":
        return "cost_pressure"
    if normalized == "supply":
        return "supply_fragility"
    if normalized == "demand":
        return "demand_instability"
    if normalized == "finance":
        return "financial_pressure"
    if normalized == "regulation":
        return "regulatory_pressure"
    return "supply_fragility" if normalized == "risk" else "operational_weakness"
