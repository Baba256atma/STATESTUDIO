"""Main orchestrator for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any

try:
    from app.engines.fragility_scoring import compute_fragility_score
    from app.models.scanner_input import FragilityScanRequest
    from app.models.scanner_output import FragilityDriver, FragilityFinding, FragilityScanResponse
    from app.services.scanner.findings_builder import (
        build_fragility_findings,
        build_fragility_summary,
        build_recommended_actions,
    )
    from app.services.scanner.input_normalizer import normalize_scanner_input
    from app.services.scanner.object_suggester import suggest_objects_from_fragility
    from app.services.scanner.scene_payload_builder import build_fragility_scene_payload
    from app.services.scanner.signal_extractor import extract_fragility_signals
except ModuleNotFoundError:
    from backend.app.engines.fragility_scoring import compute_fragility_score
    from backend.app.models.scanner_input import FragilityScanRequest
    from backend.app.models.scanner_output import FragilityDriver, FragilityFinding, FragilityScanResponse
    from backend.app.services.scanner.findings_builder import (
        build_fragility_findings,
        build_fragility_summary,
        build_recommended_actions,
    )
    from backend.app.services.scanner.input_normalizer import normalize_scanner_input
    from backend.app.services.scanner.object_suggester import suggest_objects_from_fragility
    from backend.app.services.scanner.scene_payload_builder import build_fragility_scene_payload
    from backend.app.services.scanner.signal_extractor import extract_fragility_signals


class FragilityScannerOrchestrator:
    """Coordinate the end-to-end Fragility Scanner MVP pipeline."""

    def run_scan(self, request_data: dict) -> dict[str, Any]:
        """Execute the scanner pipeline and return a packaged response payload."""
        request = FragilityScanRequest.model_validate(request_data)
        normalized_input = normalize_scanner_input(
            text=request.text,
            source_type=request.source_type,
            source_name=request.source_name,
            source_url=request.source_url,
            metadata=request.metadata,
        )
        analysis_text = self._analysis_text(normalized_input)
        signals = extract_fragility_signals(analysis_text, mode=request.mode)
        scoring = compute_fragility_score(signals)
        findings_payload = build_fragility_findings(signals, scoring)
        summary = build_fragility_summary(signals, scoring)
        suggested_actions = build_recommended_actions(signals, scoring)
        suggested_objects = suggest_objects_from_fragility(
            signals,
            scoring,
            allowed_objects=request.allowed_objects,
        )
        scene_payload = build_fragility_scene_payload(
            suggested_objects=suggested_objects,
            fragility_score=float(scoring.get("fragility_score", 0.0) or 0.0),
            drivers=scoring.get("top_drivers", []) or [],
            findings=findings_payload,
        )

        response = FragilityScanResponse(
            ok=True,
            summary=summary,
            fragility_score=float(scoring.get("fragility_score", 0.0) or 0.0),
            fragility_level=str(scoring.get("fragility_level", "low") or "low"),
            drivers=self._build_drivers(scoring),
            findings=self._build_findings(findings_payload, suggested_objects),
            suggested_objects=suggested_objects,
            suggested_actions=suggested_actions,
            scene_payload=scene_payload,
            debug={
                "normalized_input": normalized_input,
                "signal_count": len(signals),
                "dimension_scores": scoring.get("dimension_scores", {}),
            },
        )
        return response.model_dump()

    @staticmethod
    def _analysis_text(normalized_input: dict[str, Any]) -> str:
        """Build the text payload used for rule-based scanner analysis."""
        if normalized_input.get("text"):
            return str(normalized_input["text"])
        fallback_parts = [
            normalized_input.get("source_name"),
            normalized_input.get("source_url"),
        ]
        return " ".join(str(part) for part in fallback_parts if part)

    @staticmethod
    def _build_drivers(scoring: dict[str, Any]) -> list[FragilityDriver]:
        """Convert weighted top drivers into response models."""
        drivers = []
        for item in scoring.get("top_drivers", []) or []:
            if not isinstance(item, dict):
                continue
            drivers.append(
                FragilityDriver(
                    id=str(item.get("id", "fragility_driver") or "fragility_driver"),
                    label=str(item.get("label", "Fragility Driver") or "Fragility Driver"),
                    score=float(item.get("score", 0.0) or 0.0),
                    severity=str(item.get("severity", "medium") or "medium"),
                    dimension=str(item.get("dimension")) if item.get("dimension") is not None else None,
                    evidence_text=item.get("evidence_text"),
                )
            )
        return drivers

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
