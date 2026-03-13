from __future__ import annotations

import json
from pathlib import Path
from typing import Any

_BASE_DIR = Path(__file__).resolve().parents[2] / "data"


def _safe_company_id(company_id: str) -> str:
    if not isinstance(company_id, str):
        return "default"
    cleaned = "".join(ch for ch in company_id.lower().strip() if ch.isalnum() or ch in ("-", "_"))
    return cleaned or "default"


def _ensure_company_dir(company_id: str) -> Path:
    root = _BASE_DIR / _safe_company_id(company_id)
    root.mkdir(parents=True, exist_ok=True)
    return root


def _read_json_list(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    try:
        raw = path.read_text(encoding="utf-8")
        data = json.loads(raw)
        if isinstance(data, list):
            return [d for d in data if isinstance(d, dict)]
    except Exception:
        return []
    return []


def _write_json_list(path: Path, data: list[dict[str, Any]]) -> None:
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    payload = json.dumps(data, ensure_ascii=True, indent=2)
    tmp_path.write_text(payload, encoding="utf-8")
    tmp_path.replace(path)


def read_decisions(company_id: str) -> list[dict[str, Any]]:
    root = _ensure_company_dir(company_id)
    return _read_json_list(root / "decisions.json")


def read_events(company_id: str) -> list[dict[str, Any]]:
    root = _ensure_company_dir(company_id)
    return _read_json_list(root / "events.json")


def add_decision(company_id: str, snapshot: dict[str, Any]) -> dict[str, Any]:
    root = _ensure_company_dir(company_id)
    path = root / "decisions.json"
    data = _read_json_list(path)
    data.append(snapshot)
    _write_json_list(path, data)
    return snapshot


def add_event(company_id: str, event: dict[str, Any]) -> dict[str, Any]:
    root = _ensure_company_dir(company_id)
    path = root / "events.json"
    data = _read_json_list(path)
    data.append(event)
    _write_json_list(path, data)
    return event
