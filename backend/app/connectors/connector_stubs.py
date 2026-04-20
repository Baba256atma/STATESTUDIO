"""Stub connectors — no real network or file I/O; B.10.a scaffolding only."""

from __future__ import annotations

from typing import Any

from app.connectors.connector_contract import NexoraConnector, NormalizedIngestionInput


class ManualTextConnector(NexoraConnector):
    """Passes configured text through to the existing text ingestion path."""

    @property
    def id(self) -> str:
        return "manual_text"

    @property
    def connector_type(self) -> str:
        return "manual"

    @property
    def description(self) -> str:
        return "Manual text input; reuses the canonical B.1 text → signals pipeline."

    async def fetch(self, config: dict[str, Any]) -> dict[str, Any]:
        text = config.get("text")
        if not isinstance(text, str):
            text = ""
        return {"text": text.strip(), "title": config.get("title"), "source_label": config.get("source_label"), "domain": config.get("domain")}

    async def normalize(self, raw: dict[str, Any], config: dict[str, Any]) -> NormalizedIngestionInput:
        text = (raw.get("text") or config.get("text") or "").strip()
        meta: dict[str, Any] = {"connector_id": self.id}
        for key in ("title", "source_label", "domain"):
            val = raw.get(key) if key in raw else config.get(key)
            if isinstance(val, str) and val.strip():
                meta[key] = val.strip()
        return NormalizedIngestionInput(input_type="text", payload={"text": text}, metadata=meta)


class PdfConnectorStub(NexoraConnector):
    """Placeholder until real PDF extraction is wired through the connector layer."""

    @property
    def id(self) -> str:
        return "pdf_upload"

    @property
    def connector_type(self) -> str:
        return "pdf"

    @property
    def description(self) -> str:
        return "PDF upload (stub): returns synthetic text; real parsing comes in a later phase."

    async def fetch(self, config: dict[str, Any]) -> dict[str, Any]:
        return {"stub": True, "path_hint": config.get("path") or "mock://document.pdf"}

    async def normalize(self, raw: dict[str, Any], config: dict[str, Any]) -> NormalizedIngestionInput:
        _ = raw
        body = (
            "Stub PDF connector: simulated executive summary. "
            "Supplier lead times are stretched; inventory coverage is below target; cost pressure is elevated."
        )
        meta = {"connector_id": self.id, "stub": True}
        if isinstance(config.get("path"), str) and config["path"].strip():
            meta["path"] = config["path"].strip()
        return NormalizedIngestionInput(input_type="text", payload={"text": body}, metadata=meta)


class ApiConnectorStub(NexoraConnector):
    """Placeholder for REST / feed APIs."""

    @property
    def id(self) -> str:
        return "api_feed"

    @property
    def connector_type(self) -> str:
        return "api"

    @property
    def description(self) -> str:
        return "API feed (stub): synthetic payload text; no outbound calls yet."

    async def fetch(self, config: dict[str, Any]) -> dict[str, Any]:
        return {"stub": True, "endpoint_hint": config.get("endpoint") or "https://api.example.com/v0/stub"}

    async def normalize(self, raw: dict[str, Any], config: dict[str, Any]) -> NormalizedIngestionInput:
        _ = raw
        meta: dict[str, Any] = {"connector_id": self.id, "stub": True}
        if isinstance(config.get("endpoint"), str) and config["endpoint"].strip():
            meta["endpoint"] = config["endpoint"].strip()
        text = (
            "Stub API connector: demand_signal up 12 percent; fulfillment_slippage trending; recommended watch on supplier tier-2 stability."
        )
        return NormalizedIngestionInput(input_type="text", payload={"text": text}, metadata=meta)
