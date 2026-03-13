from __future__ import annotations

from fastapi import APIRouter, Query

from app.services.company_config import load_company_config

router = APIRouter(tags=["config"])

_CACHE: dict[str, dict] = {}


@router.get("/config/{company_id}")
def get_company_config(company_id: str, refresh: int = Query(0, ge=0, le=1)):
    if not refresh and company_id in _CACHE:
        return {"ok": True, "data": _CACHE[company_id]}
    data = load_company_config(company_id)
    _CACHE[company_id] = data
    return {"ok": True, "data": data}
