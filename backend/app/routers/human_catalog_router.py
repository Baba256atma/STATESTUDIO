"""Routers for editable human catalog and bridge configuration."""
from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.models.bridge import BridgeConfig
from app.models.human_catalog import HumanCatalog
from app.services.catalog_store import CatalogStore
from app.models.system_archetype_config import SystemArchetypeCatalog

router = APIRouter()
store = CatalogStore()


def _read_json(path: Path) -> dict:
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Version not found") from None
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Stored JSON is invalid") from None


@router.get("/human/catalog")
def get_human_catalog() -> HumanCatalog:
    return store.load_human_catalog()


@router.put("/human/catalog")
def put_human_catalog(catalog: HumanCatalog) -> HumanCatalog:
    return store.save_human_catalog(catalog)


@router.get("/human/catalog/history")
def get_human_catalog_history() -> dict:
    history_dir = store.human_dir / "history"
    versions = sorted([p.stem for p in history_dir.glob("*.json")])
    return {"versions": versions}


@router.get("/human/catalog/{version}")
def get_human_catalog_version(version: str) -> HumanCatalog:
    path = store.human_dir / "history" / f"{version}.json"
    payload = _read_json(path)
    return HumanCatalog.model_validate(payload)


@router.get("/bridge/config")
def get_bridge_config() -> BridgeConfig:
    return store.load_bridge_config()


@router.put("/bridge/config")
def put_bridge_config(cfg: BridgeConfig) -> BridgeConfig:
    return store.save_bridge_config(cfg)


@router.get("/bridge/config/history")
def get_bridge_config_history() -> dict:
    history_dir = store.bridge_dir / "history"
    versions = sorted([p.stem for p in history_dir.glob("*.json")])
    return {"versions": versions}


@router.get("/bridge/config/{version}")
def get_bridge_config_version(version: str) -> BridgeConfig:
    path = store.bridge_dir / "history" / f"{version}.json"
    payload = _read_json(path)
    return BridgeConfig.model_validate(payload)


@router.get("/system/archetypes")
def get_system_archetypes() -> SystemArchetypeCatalog:
    return store.load_system_archetypes()


@router.put("/system/archetypes")
def put_system_archetypes(catalog: SystemArchetypeCatalog) -> SystemArchetypeCatalog:
    return store.save_system_archetypes(catalog)


@router.get("/system/archetypes/history")
def get_system_archetypes_history() -> dict:
    history_dir = store.system_dir / "history"
    versions = sorted([p.stem for p in history_dir.glob("*.json")])
    return {"versions": versions}


@router.get("/system/archetypes/{version}")
def get_system_archetypes_version(version: str) -> SystemArchetypeCatalog:
    path = store.system_dir / "history" / f"{version}.json"
    payload = _read_json(path)
    return SystemArchetypeCatalog.model_validate(payload)
