from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4


PRODUCT_DIR = Path(__file__).resolve().parents[2] / "data" / "product"
WORKSPACES_FILE = PRODUCT_DIR / "workspaces.json"
SCENARIOS_FILE = PRODUCT_DIR / "saved_scenarios.json"
REPORTS_FILE = PRODUCT_DIR / "saved_reports.json"


def _ensure_dir() -> None:
    PRODUCT_DIR.mkdir(parents=True, exist_ok=True)


def _load_list(path: Path) -> list[dict[str, Any]]:
    _ensure_dir()
    if not path.exists():
        return []
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(raw, list):
            return [x for x in raw if isinstance(x, dict)]
    except Exception:
        pass
    return []


def _save_list(path: Path, items: list[dict[str, Any]]) -> None:
    _ensure_dir()
    out = [x for x in items if isinstance(x, dict)]
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def load_workspaces_v0() -> list[dict[str, Any]]:
    return _load_list(WORKSPACES_FILE)


def save_workspaces_v0(items: list[dict[str, Any]]) -> None:
    _save_list(WORKSPACES_FILE, items)


def load_saved_scenarios_v0() -> list[dict[str, Any]]:
    return _load_list(SCENARIOS_FILE)


def save_saved_scenarios_v0(items: list[dict[str, Any]]) -> None:
    _save_list(SCENARIOS_FILE, items)


def load_saved_reports_v0() -> list[dict[str, Any]]:
    return _load_list(REPORTS_FILE)


def save_saved_reports_v0(items: list[dict[str, Any]]) -> None:
    _save_list(REPORTS_FILE, items)


def ensure_default_workspace_v0() -> dict[str, Any]:
    items = load_workspaces_v0()
    for ws in items:
        if ws.get("id") == "ws_default":
            return ws

    ws = {
        "id": "ws_default",
        "label": "Default Workspace",
        "owner": "local_user",
        "role": "admin",
    }
    items.append(ws)
    save_workspaces_v0(items)
    return ws


def create_saved_scenario_v0(
    workspace_id: str, label: str, episode_id: str, scenario_inputs: list[dict[str, Any]]
) -> dict[str, Any]:
    items = load_saved_scenarios_v0()
    item = {
        "id": f"scn_{uuid4().hex}",
        "workspace_id": str(workspace_id or "").strip(),
        "label": str(label or "").strip() or "Saved scenario",
        "episode_id": str(episode_id or "").strip(),
        "scenario_inputs": scenario_inputs if isinstance(scenario_inputs, list) else [],
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    items.append(item)
    save_saved_scenarios_v0(items)
    return item


def create_saved_report_v0(
    workspace_id: str, label: str, episode_id: str, summary: dict[str, Any]
) -> dict[str, Any]:
    items = load_saved_reports_v0()
    item = {
        "id": f"rpt_{uuid4().hex}",
        "workspace_id": str(workspace_id or "").strip(),
        "label": str(label or "").strip() or "Saved report",
        "episode_id": str(episode_id or "").strip(),
        "summary": summary if isinstance(summary, dict) else {},
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    items.append(item)
    save_saved_reports_v0(items)
    return item


def list_workspace_scenarios_v0(workspace_id: str) -> list[dict[str, Any]]:
    wsid = str(workspace_id or "").strip()
    return [x for x in load_saved_scenarios_v0() if str(x.get("workspace_id", "")) == wsid]


def list_workspace_reports_v0(workspace_id: str) -> list[dict[str, Any]]:
    wsid = str(workspace_id or "").strip()
    return [x for x in load_saved_reports_v0() if str(x.get("workspace_id", "")) == wsid]


def get_workspace_report_v0(workspace_id: str, report_id: str) -> dict[str, Any] | None:
    wsid = str(workspace_id or "").strip()
    rid = str(report_id or "").strip()
    if not wsid or not rid:
        return None
    for item in load_saved_reports_v0():
        if str(item.get("workspace_id", "")) == wsid and str(item.get("id", "")) == rid:
            return item
    return None
