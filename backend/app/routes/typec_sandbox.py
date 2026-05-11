from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.typec_sandbox_models import TypeCSandboxRequest, TypeCSandboxResult
from app.services.typec_sandbox import run_typec_sandbox

router = APIRouter(prefix="/typec/sandbox", tags=["typec-sandbox"])


@router.post("/run", response_model=TypeCSandboxResult)
def run_sandbox(payload: TypeCSandboxRequest) -> TypeCSandboxResult:
    if not payload.sceneSnapshot:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "INVALID_INPUT", "message": "Scene snapshot is required"}},
        )
    return run_typec_sandbox(payload)
