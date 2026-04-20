"""FastAPI router for the Nexora ingestion layer."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, status

from app.utils.responses import http_error
from app.connectors.merge_contract import MultiSourceIngestionRequest, MultiSourceIngestionResponse
from app.connectors.merge_service import run_multi_source_ingestion
from ingestion.connectors.catalog import list_connector_definitions
from app.connectors.connector_runner import run_connector
from ingestion.schemas import (
    ConnectorCatalogResponse,
    ConnectorRunRequest,
    IngestionRunRequest,
    IngestionRunResponse,
    TextIngestionRequest,
    TextIngestionResponse,
)
from ingestion.service import IngestionService


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


def get_ingestion_service() -> IngestionService:
    """Return the shared ingestion service."""
    return IngestionService()


@router.get(
    "/connectors",
    response_model=ConnectorCatalogResponse,
    summary="List connector definitions (scaffold)",
)
async def list_connectors() -> ConnectorCatalogResponse:
    """Connector catalog (B.1 + B.10.a registry); definitions only on this route."""
    definitions = list_connector_definitions()
    logger.log(logging.DEBUG, "[Nexora][Ingestion] connector_catalog_loaded count=%s", len(definitions))
    return ConnectorCatalogResponse(connectors=definitions)


@router.post(
    "/connector/run",
    response_model=TextIngestionResponse,
    summary="Run a registered connector via shared ingestion (B.10.a)",
)
async def run_registered_connector(
    body: ConnectorRunRequest,
    service: IngestionService = Depends(get_ingestion_service),
) -> TextIngestionResponse:
    """fetch → normalize → `IngestionService.ingest` (no duplicated pipeline)."""
    try:
        bundle = await run_connector(body.connector_id, body.config, service)
        return TextIngestionResponse(ok=True, bundle=bundle, errors=[])
    except KeyError:
        logger.warning("connector_run_unknown connector_id=%s", body.connector_id)
        raise http_error(
            status.HTTP_404_NOT_FOUND,
            "CONNECTOR_NOT_FOUND",
            f"Unknown connector_id: {body.connector_id}",
            code="CONNECTOR_NOT_FOUND",
        ) from None
    except ValueError as exc:
        logger.warning("connector_run_rejected connector_id=%s error=%s", body.connector_id, exc)
        raise http_error(
            status.HTTP_400_BAD_REQUEST,
            "INGESTION_INPUT_ERROR",
            str(exc),
            code="INGESTION_INPUT_ERROR",
        ) from exc
    except RuntimeError as exc:
        logger.warning("connector_run_runtime_blocked connector_id=%s error=%s", body.connector_id, exc)
        raise http_error(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "INGESTION_RUNTIME_ERROR",
            str(exc),
            code="INGESTION_RUNTIME_ERROR",
        ) from exc
    except Exception:
        logger.exception("connector_run_failed connector_id=%s", body.connector_id)
        raise http_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "INGESTION_ERROR",
            "Connector run is currently unavailable.",
            code="INGESTION_ERROR",
        )


@router.post(
    "/multi/run",
    response_model=MultiSourceIngestionResponse,
    summary="Run multi-source connector ingestion with merge (B.10.e.3)",
)
async def run_multi_source_ingestion_route(
    body: MultiSourceIngestionRequest,
) -> MultiSourceIngestionResponse:
    """Delegate to merge service; partial source failures stay in the response body."""
    try:
        return await run_multi_source_ingestion(body)
    except Exception:
        logger.exception("multi_source_ingestion_failed")
        raise http_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "INGESTION_ERROR",
            "Multi-source ingestion is currently unavailable.",
            code="INGESTION_ERROR",
        )


@router.post(
    "/text",
    response_model=TextIngestionResponse,
    summary="Run manual text ingestion (Phase B.1)",
)
async def run_text_ingestion(
    body: TextIngestionRequest,
    service: IngestionService = Depends(get_ingestion_service),
) -> TextIngestionResponse:
    """Deterministic text → SignalBundle (canonical B.1 entry)."""
    logger.debug("[Nexora][Ingestion] request_received path=text chars=%s", len(body.text))
    try:
        bundle = service.ingest_text(
            body.text,
            title=body.title,
            source_label=body.source_label,
            domain=body.domain,
        )
        return TextIngestionResponse(ok=True, bundle=bundle, errors=[])
    except ValueError as exc:
        logger.warning("ingestion_text_rejected error=%s", exc)
        raise http_error(
            status.HTTP_400_BAD_REQUEST,
            "INGESTION_INPUT_ERROR",
            str(exc),
            code="INGESTION_INPUT_ERROR",
        ) from exc
    except RuntimeError as exc:
        logger.warning("ingestion_text_runtime_blocked error=%s", exc)
        raise http_error(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "INGESTION_RUNTIME_ERROR",
            str(exc),
            code="INGESTION_RUNTIME_ERROR",
        ) from exc
    except Exception:
        logger.exception("ingestion_text_failed")
        raise http_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "INGESTION_ERROR",
            "Ingestion is currently unavailable.",
            code="INGESTION_ERROR",
        )


@router.post(
    "/run",
    response_model=IngestionRunResponse,
    summary="Run canonical ingestion",
    description="Extract source text and build canonical signals for Nexora engines.",
)
async def run_ingestion(
    payload: IngestionRunRequest,
    service: IngestionService = Depends(get_ingestion_service),
) -> IngestionRunResponse:
    """Run the deterministic ingestion pipeline and return a signal bundle."""
    logger.debug("[Nexora][Ingestion] request_received path=run source_type=%s", payload.type)
    logger.info("ingestion_requested source_type=%s", payload.type)
    try:
        bundle = service.ingest(
            input_type=payload.type,
            payload=payload.payload,
            metadata=payload.metadata,
        )
        return IngestionRunResponse.model_validate(bundle.model_dump())
    except ValueError as exc:
        logger.warning("ingestion_rejected source_type=%s error=%s", payload.type, exc)
        raise http_error(
            status.HTTP_400_BAD_REQUEST,
            "INGESTION_INPUT_ERROR",
            str(exc),
            code="INGESTION_INPUT_ERROR",
        ) from exc
    except RuntimeError as exc:
        logger.warning("ingestion_runtime_blocked source_type=%s error=%s", payload.type, exc)
        raise http_error(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "INGESTION_RUNTIME_ERROR",
            str(exc),
            code="INGESTION_RUNTIME_ERROR",
        ) from exc
    except Exception:
        logger.exception("ingestion_failed source_type=%s", payload.type)
        raise http_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "INGESTION_ERROR",
            "Ingestion is currently unavailable.",
            code="INGESTION_ERROR",
        )
