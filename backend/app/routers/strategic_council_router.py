from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from engines.strategic_council.council_models import CouncilAgentInput, StrategicCouncilResult
from engines.strategic_council.council_service import run_strategic_council_service


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/system/strategic-council", tags=["strategic-council"])


class StrategicCouncilRunResponse(BaseModel):
    council: StrategicCouncilResult


@router.post("/run", response_model=StrategicCouncilRunResponse)
async def run_strategic_council_route(payload: CouncilAgentInput) -> StrategicCouncilRunResponse:
    try:
        result = run_strategic_council_service(payload)
        return StrategicCouncilRunResponse(council=result)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "STRATEGIC_COUNCIL_INPUT_ERROR", "message": str(exc)}},
        ) from exc
    except Exception:
        logger.exception("strategic council run failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "STRATEGIC_COUNCIL_ERROR",
                    "message": "Strategic council is currently unavailable.",
                },
            },
        )
