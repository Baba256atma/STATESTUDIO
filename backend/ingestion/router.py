"""FastAPI router for the Nexora ingestion layer."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status

from ingestion.schemas import IngestionRunRequest, IngestionRunResponse
from ingestion.service import IngestionService


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


def get_ingestion_service() -> IngestionService:
    """Return the shared ingestion service."""
    return IngestionService()


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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "INGESTION_INPUT_ERROR",
                    "message": str(exc),
                },
            },
        ) from exc
    except RuntimeError as exc:
        logger.warning("ingestion_runtime_blocked source_type=%s error=%s", payload.type, exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "ok": False,
                "error": {
                    "type": "INGESTION_RUNTIME_ERROR",
                    "message": str(exc),
                },
            },
        ) from exc
    except Exception:
        logger.exception("ingestion_failed source_type=%s", payload.type)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "INGESTION_ERROR",
                    "message": "Ingestion is currently unavailable.",
                },
            },
        )
