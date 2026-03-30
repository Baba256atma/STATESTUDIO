"""Service orchestration for the Nexora ingestion layer."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from ingestion.extractors import csv_extractor, pdf_extractor, text_extractor, web_extractor
from ingestion.schemas import SignalBundle, SourceDocument, SourceDocumentType
from ingestion.signal_builder import build_signals


logger = logging.getLogger(__name__)


class IngestionService:
    """Convert raw inputs into canonical signal bundles."""

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
        source = SourceDocument(
            type=input_type,
            raw_content=raw_text,
            metadata=self._build_metadata(
                input_type=input_type,
                payload=extractor_payload,
                metadata=metadata,
            ),
        )
        signals = build_signals(source.raw_content, source.id)

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

        return SignalBundle(source=source, signals=signals)

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
