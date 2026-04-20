"""Static connector definitions for Phase B.1 (scaffold only — no external execution)."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ConnectorStatus = Literal["planned", "beta", "stable"]


class ConnectorSourceDefinition(BaseModel):
    """Descriptor for a future connector; definitions only in B.1."""

    model_config = ConfigDict(extra="forbid")

    connector_id: str
    label: str
    type: str
    status: ConnectorStatus = "planned"
    config_schema: str = Field(
        default="{}",
        description="JSON-schema string or placeholder for future validation.",
    )
    enabled: bool = False
    description: str = Field(default="", description="B.10.a — one-line connector purpose for catalogs.")


def list_connector_definitions() -> list[ConnectorSourceDefinition]:
    """Stable catalog for UI and planning; rows mirror B.10.a registry (no execution here)."""
    from app.connectors.catalog_bridge import build_connector_definitions

    return build_connector_definitions()
