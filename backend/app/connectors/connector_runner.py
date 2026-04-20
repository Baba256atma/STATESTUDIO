"""Run a registered connector and delegate to `IngestionService` (no duplicated ingestion logic)."""

from __future__ import annotations

import logging
from typing import Any

from ingestion.schemas import SignalBundle
from ingestion.service import IngestionService

from app.connectors.connector_registry import get_connector

logger = logging.getLogger(__name__)


async def run_connector(connector_id: str, config: dict[str, Any], service: IngestionService) -> SignalBundle:
    connector = get_connector(connector_id)
    logger.info("[Nexora][Connector] fetch_started connector_id=%s", connector_id)
    raw = await connector.fetch(config)
    logger.info("[Nexora][Connector] normalized connector_id=%s", connector_id)
    normalized = await connector.normalize(raw, config)
    logger.info(
        "[Nexora][Connector] passed_to_ingestion connector_id=%s input_type=%s",
        connector_id,
        normalized.input_type,
    )
    return service.ingest(
        input_type=normalized.input_type,
        payload=normalized.payload,
        metadata=normalized.metadata,
    )
