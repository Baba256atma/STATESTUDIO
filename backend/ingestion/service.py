"""Service orchestration for the Nexora ingestion layer."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from ingestion.extractors import csv_extractor, pdf_extractor, text_extractor, web_extractor
from ingestion.schemas import SignalBundle, SourceDocument, SourceDocumentType
from ingestion.signal_builder import build_signals


logger = logging.getLogger(__name__)


def _trim(value: str | None) -> str | None:
    if value is None:
        return None
    t = value.strip()
    return t or None


class IngestionService:
    """Convert raw inputs into canonical signal bundles."""

    def ingest_text(
        self,
        text: str,
        *,
        title: str | None = None,
        source_label: str | None = None,
        domain: str | None = None,
    ) -> SignalBundle:
        """Phase B.1 entry: manual text → canonical bundle (same pipeline as type=text)."""
        metadata: dict[str, Any] = {}
        if title:
            metadata["title"] = title
        if source_label:
            metadata["source_label"] = source_label
        if domain:
            metadata["domain"] = domain
        return self.ingest("text", text, metadata=metadata or None)

    def ingest(
        self,
        input_type: SourceDocumentType,
        payload: str | dict[str, Any],
        metadata: dict | None = None,
    ) -> SignalBundle:
        extractor = self._resolve_extractor(input_type)
        extractor_payload = self._resolve_extractor_payload(input_type=input_type, payload=payload)
        raw_text = extractor(extractor_payload)
        if not raw_text.strip():
            raise ValueError(f"{input_type} payload did not produce readable text")

        md_in = dict(metadata or {})
        _title_raw = md_in.pop("title", None)
        title = _trim(_title_raw) if isinstance(_title_raw, str) else None
        _sl_raw = md_in.pop("source_label", None)
        source_label = _trim(_sl_raw) if isinstance(_sl_raw, str) else None
        _dom_raw = md_in.pop("domain", None)
        domain = _trim(_dom_raw) if isinstance(_dom_raw, str) else None

        if source_label:
            md_in.setdefault("source_label", source_label)
        if domain:
            md_in.setdefault("domain", domain)

        source = SourceDocument(
            type=input_type,
            title=title,
            raw_content=raw_text,
            metadata=self._build_metadata(
                input_type=input_type,
                payload=extractor_payload,
                metadata=md_in,
            ),
        )
        signals = build_signals(source.raw_content, source.id)

        logger.debug(
            "[Nexora][Ingestion] extraction_complete source_type=%s signal_count=%s types=%s",
            source.type,
            len(signals),
            [s.type for s in signals],
        )

        warnings: list[str] = []
        if not signals:
            warnings.append("no_meaningful_signals")
            logger.debug(
                "[Nexora][Ingestion] no_meaningful_signals source_id=%s",
                source.id,
            )

        summary_parts = [
            f"Ingested {input_type} source ({len(source.raw_content)} chars)",
            f"with {len(signals)} canonical signal(s).",
        ]
        if warnings:
            summary_parts.append("Warnings: " + "; ".join(warnings))

        bundle = SignalBundle(
            source=source,
            signals=signals,
            summary=" ".join(summary_parts),
            warnings=warnings,
            ingestion_meta={
                "input_type": input_type,
                "signal_types": [s.type for s in signals],
                "extracted_chars": len(source.raw_content),
            },
        )

        logger.info(
            "ingestion_extracted source_type=%s raw_text_length=%s",
            source.type,
            len(source.raw_content),
        )
        logger.info(
            "ingestion_completed source_type=%s signal_count=%s signal_types=%s",
            source.type,
            len(signals),
            [signal.type for signal in signals],
        )

        return bundle

    @staticmethod
    def _resolve_extractor_payload(
        input_type: SourceDocumentType,
        payload: str | dict[str, Any],
    ) -> str:
        if isinstance(payload, str):
            normalized = payload.strip()
            if not normalized:
                raise ValueError(f"{input_type} payload is required")
            return normalized

        field_candidates: dict[SourceDocumentType, tuple[str, ...]] = {
            "text": ("text", "content", "raw_content", "value"),
            "web": ("url", "href", "source_ref", "value"),
            "pdf": ("path", "file_path", "value"),
            "csv": ("path", "file_path", "value"),
        }
        for field_name in field_candidates[input_type]:
            value = payload.get(field_name)
            if not isinstance(value, str):
                continue
            normalized = value.strip()
            if normalized:
                return normalized

        expected_field = field_candidates[input_type][0]
        raise ValueError(f"{input_type} payload must include a non-empty '{expected_field}' field")

    @staticmethod
    def _resolve_extractor(input_type: SourceDocumentType):
        extractors = {
            "text": text_extractor.extract_text,
            "pdf": pdf_extractor.extract_text,
            "csv": csv_extractor.extract_text,
            "web": web_extractor.extract_text,
        }
        return extractors[input_type]

    @staticmethod
    def _build_metadata(
        input_type: SourceDocumentType,
        payload: str,
        metadata: dict | None,
    ) -> dict:
        next_metadata = dict(metadata or {})
        if input_type in {"pdf", "csv"}:
            next_metadata.setdefault("path", str(Path(payload).expanduser()))
        elif input_type == "web":
            next_metadata.setdefault("url", payload)
        next_metadata.setdefault("source_type", input_type)
        return next_metadata
