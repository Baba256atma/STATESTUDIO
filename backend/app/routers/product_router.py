from __future__ import annotations

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.product_store_v0 import (
    create_saved_report_v0,
    create_saved_scenario_v0,
    ensure_default_workspace_v0,
    get_workspace_report_v0,
    list_workspace_reports_v0,
    list_workspace_scenarios_v0,
)


router = APIRouter()


class SaveScenarioIn(BaseModel):
    label: str = Field(default="Saved scenario", min_length=1, max_length=200)
    episode_id: str = Field(min_length=1, max_length=200)
    scenario_inputs: list[dict[str, Any]] = Field(default_factory=list)


class SaveReportIn(BaseModel):
    label: str = Field(default="Saved report", min_length=1, max_length=200)
    episode_id: str = Field(min_length=1, max_length=200)
    summary: dict[str, Any] = Field(default_factory=dict)


@router.get("/product/workspace")
def get_default_workspace():
    return {"workspace": ensure_default_workspace_v0()}


@router.get("/product/workspace/{workspace_id}/scenarios")
def get_workspace_scenarios(workspace_id: str):
    return {"items": list_workspace_scenarios_v0(workspace_id)}


@router.get("/product/workspace/{workspace_id}/reports")
def get_workspace_reports(workspace_id: str):
    return {"items": list_workspace_reports_v0(workspace_id)}


@router.get("/product/workspace/{workspace_id}/report/{report_id}")
def get_workspace_report(workspace_id: str, report_id: str):
    item = get_workspace_report_v0(workspace_id, report_id)
    if not item:
        return {"item": None}
    return {"item": item}


@router.post("/product/workspace/{workspace_id}/scenario")
def post_workspace_scenario(workspace_id: str, body: SaveScenarioIn):
    item = create_saved_scenario_v0(
        workspace_id=workspace_id,
        label=body.label,
        episode_id=body.episode_id,
        scenario_inputs=body.scenario_inputs,
    )
    return item


@router.post("/product/workspace/{workspace_id}/report")
def post_workspace_report(workspace_id: str, body: SaveReportIn):
    item = create_saved_report_v0(
        workspace_id=workspace_id,
        label=body.label,
        episode_id=body.episode_id,
        summary=body.summary,
    )
    return item
