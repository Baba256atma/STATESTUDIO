"""Build `ConnectorSourceDefinition` rows from the B.10.a registry (keeps catalog DRY)."""

from __future__ import annotations

from ingestion.connectors.catalog import ConnectorSourceDefinition, ConnectorStatus

from app.connectors.connector_registry import list_connectors


def _status_and_enabled(connector_id: str) -> tuple[ConnectorStatus, bool]:
    if connector_id == "manual_text":
        return "stable", True
    return "planned", False


def _config_schema(connector_id: str) -> str:
    schemas = {
        "manual_text": '{"type":"object","properties":{"text":{"type":"string"},"title":{"type":"string"},"source_label":{"type":"string"},"domain":{"type":"string"}}}',
        "web_source": '{"type":"object","properties":{"url":{"type":"string","format":"uri"}}}',
        "pdf_upload": '{"type":"object","properties":{"path":{"type":"string"}}}',
        "csv_upload": '{"type":"object","properties":{"file_path":{"type":"string"},"path":{"type":"string"}}}',
        "api_feed": '{"type":"object","properties":{"endpoint":{"type":"string"}}}',
    }
    return schemas.get(connector_id, "{}")


def _label(connector_id: str) -> str:
    labels = {
        "manual_text": "Manual text",
        "web_source": "Web source",
        "pdf_upload": "PDF upload",
        "csv_upload": "CSV upload",
        "api_feed": "API feed",
    }
    return labels.get(connector_id, connector_id.replace("_", " ").title())


def build_connector_definitions() -> list[ConnectorSourceDefinition]:
    rows: list[ConnectorSourceDefinition] = []
    for connector in list_connectors():
        cid = connector.id
        status, enabled = _status_and_enabled(cid)
        # Map connector_type to catalog `type` (historical B.1 field; manual uses "text")
        catalog_type = connector.connector_type if cid != "manual_text" else "text"
        rows.append(
            ConnectorSourceDefinition(
                connector_id=cid,
                label=_label(cid),
                type=catalog_type,
                status=status,
                config_schema=_config_schema(cid),
                enabled=enabled,
                description=connector.description,
            )
        )
    return rows
