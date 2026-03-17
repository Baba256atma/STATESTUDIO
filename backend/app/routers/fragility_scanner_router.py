"""FastAPI router for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError

from app.models.scanner_input import FragilityScanRequest
from app.models.scanner_output import FragilityScanResponse
from app.services.scanner.scanner_orchestrator import FragilityScannerOrchestrator


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/scanner", tags=["fragility-scanner"])


def get_fragility_scanner_orchestrator() -> FragilityScannerOrchestrator:
    """Return the shared fragility scanner orchestrator."""
    return FragilityScannerOrchestrator()


@router.post(
    "/fragility",
    response_model=FragilityScanResponse,
    summary="Run fragility scanner",
    description="Runs the Nexora Fragility Scanner MVP over text or source metadata.",
)
async def run_fragility_scan(
    payload: FragilityScanRequest,
    orchestrator: FragilityScannerOrchestrator = Depends(get_fragility_scanner_orchestrator),
) -> FragilityScanResponse:
    """Run a fragility scan and return a frontend-friendly response payload."""
    logger.info(
        "fragility_scan_requested workspace_id=%s user_id=%s source_type=%s mode=%s",
        payload.workspace_id,
        payload.user_id,
        payload.source_type,
        payload.mode,
    )
    try:
        result = orchestrator.run_scan(payload.model_dump())
        response = FragilityScanResponse.model_validate(result)
        logger.info(
            "fragility_scan_completed workspace_id=%s user_id=%s fragility_score=%.4f fragility_level=%s",
            payload.workspace_id,
            payload.user_id,
            response.fragility_score,
            response.fragility_level,
        )
        return response
    except ValidationError as exc:
        logger.warning(
            "fragility_scan_invalid workspace_id=%s user_id=%s error=%s",
            payload.workspace_id,
            payload.user_id,
            exc,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "FRAGILITY_SCANNER_INVALID_INPUT",
                    "message": "Fragility scanner input is invalid.",
                },
            },
        )
    except ValueError as exc:
        logger.warning(
            "fragility_scan_rejected workspace_id=%s user_id=%s error=%s",
            payload.workspace_id,
            payload.user_id,
            exc,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "FRAGILITY_SCANNER_INPUT_ERROR",
                    "message": str(exc),
                },
            },
        )
    except Exception:
        logger.exception(
            "fragility_scan_failed workspace_id=%s user_id=%s",
            payload.workspace_id,
            payload.user_id,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "FRAGILITY_SCANNER_ERROR",
                    "message": "Fragility scanner is currently unavailable.",
                },
            },
        )
