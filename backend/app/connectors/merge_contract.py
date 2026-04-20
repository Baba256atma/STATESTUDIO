"""B.10.e.1 — Typed contract for multi-source ingestion merge (no merge logic)."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator

from ingestion.schemas import Signal, SignalBundle


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


class ConnectorRunInput(BaseModel):
    """One connector invocation request in a multi-source ingestion run."""

    model_config = ConfigDict(extra="forbid")

    connector_id: str
    config: dict[str, Any] = Field(default_factory=dict)

    @field_validator("connector_id", mode="before")
    @classmethod
    def _trim_connector_id(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("connector_id is required")
        return trimmed


class ConnectorRunResult(BaseModel):
    """Per-source execution result compatible with existing connector runner output."""

    model_config = ConfigDict(extra="forbid")

    connector_id: str
    ok: bool
    bundle: SignalBundle | None = None
    errors: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("connector_id", mode="before")
    @classmethod
    def _trim_connector_id(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("connector_id is required")
        return trimmed


class MergedSignalBundle(BaseModel):
    """Merged canonical signals across multiple connector sources."""

    model_config = ConfigDict(extra="forbid")

    sources: list[ConnectorRunResult] = Field(default_factory=list)
    signals: list[Signal] = Field(default_factory=list)
    summary: str | None = None
    warnings: list[str] = Field(default_factory=list)
    merge_meta: dict[str, Any] = Field(
        default_factory=lambda: {
            "source_count": 0,
            "successful_source_count": 0,
            "failed_source_count": 0,
            "merged_signal_count": 0,
        }
    )


class MultiSourceIngestionRequest(BaseModel):
    """Request contract for running multiple connectors then merging outputs."""

    model_config = ConfigDict(extra="forbid")

    sources: list[ConnectorRunInput] = Field(default_factory=list)
    domain: str | None = None

    @field_validator("domain", mode="before")
    @classmethod
    def _trim_domain(cls, value: str | None) -> str | None:
        return _trim_string(value)


class MultiSourceIngestionResponse(BaseModel):
    """Response contract for multi-source merged ingestion execution."""

    model_config = ConfigDict(extra="forbid")

    ok: bool
    bundle: MergedSignalBundle
    errors: list[str] = Field(default_factory=list)

