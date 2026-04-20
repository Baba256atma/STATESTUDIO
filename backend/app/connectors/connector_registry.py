"""Register and resolve connector implementations (B.10.a)."""

from __future__ import annotations

from typing import Iterable

from app.connectors.connector_contract import NexoraConnector
from app.connectors.csv_connector import CsvConnector
from app.connectors.web_connector import WebConnector
from app.connectors.connector_stubs import (
    ApiConnectorStub,
    ManualTextConnector,
    PdfConnectorStub,
)

# Stable order matches Phase B.1 catalog tests: manual_text, web_source, pdf_upload, csv_upload, api_feed
_CONNECTOR_ORDER: tuple[str, ...] = (
    "manual_text",
    "web_source",
    "pdf_upload",
    "csv_upload",
    "api_feed",
)

_CONNECTORS: dict[str, NexoraConnector] = {
    "manual_text": ManualTextConnector(),
    "web_source": WebConnector(),
    "pdf_upload": PdfConnectorStub(),
    "csv_upload": CsvConnector(),
    "api_feed": ApiConnectorStub(),
}


def get_connector(connector_id: str) -> NexoraConnector:
    connector = _CONNECTORS.get(connector_id)
    if connector is None:
        raise KeyError(f"unknown_connector:{connector_id}")
    return connector


def list_connectors() -> list[NexoraConnector]:
    return [get_connector(cid) for cid in _CONNECTOR_ORDER]


def iter_registered_ids() -> Iterable[str]:
    return iter(_CONNECTOR_ORDER)
