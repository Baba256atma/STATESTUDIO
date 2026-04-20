"""Nexora connector foundation (B.10.a)."""

from app.connectors.connector_contract import NexoraConnector, NormalizedIngestionInput
from app.connectors.connector_registry import get_connector, list_connectors
from app.connectors.connector_runner import run_connector

__all__ = [
    "NexoraConnector",
    "NormalizedIngestionInput",
    "get_connector",
    "list_connectors",
    "run_connector",
]
