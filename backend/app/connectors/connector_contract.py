"""Phase B.10.a — Nexora connector contract (infrastructure only, no real I/O)."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

SourceDocumentType = Literal["text", "pdf", "csv", "web"]


class NormalizedIngestionInput(BaseModel):
    """Canonical shape for `IngestionService.ingest` after connector normalize."""

    model_config = ConfigDict(extra="forbid")

    input_type: SourceDocumentType
    payload: str | dict[str, Any]
    metadata: dict[str, Any] = Field(default_factory=dict)


class NexoraConnector(ABC):
    """Fetch external/raw data, normalize to canonical ingestion input, then reuse `IngestionService.ingest`."""

    @property
    @abstractmethod
    def id(self) -> str:
        """Stable registry key (e.g. manual_text, csv_upload)."""

    @property
    @abstractmethod
    def connector_type(self) -> str:
        """High-level kind: manual, csv, web, api, pdf, etc."""

    @property
    @abstractmethod
    def description(self) -> str:
        """Human-readable one-liner for catalogs."""

    @abstractmethod
    async def fetch(self, config: dict[str, Any]) -> dict[str, Any]:
        """Load or receive raw connector-specific data (stubs return placeholders)."""

    @abstractmethod
    async def normalize(self, raw: dict[str, Any], config: dict[str, Any]) -> NormalizedIngestionInput:
        """Map raw payload → `NormalizedIngestionInput` for the shared ingestion service."""
