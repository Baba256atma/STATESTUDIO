from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

import ingestion.router as ingestion_router_mod
from ingestion.router import router as ingestion_router
from ingestion.service import IngestionService
from app.utils.responses import install_exception_handlers
from app.connectors.merge_contract import (
    ConnectorRunResult,
    MergedSignalBundle,
    MultiSourceIngestionRequest,
    MultiSourceIngestionResponse,
)
from ingestion.schemas import Signal, SignalBundle, SourceDocument


def _client() -> TestClient:
    app = FastAPI()
    install_exception_handlers(app)
    app.include_router(ingestion_router)
    return TestClient(app)


def test_ingestion_text_returns_signal_bundle() -> None:
    service = IngestionService()

    result = service.ingest(
        input_type="text",
        payload={"text": "inventory shortage may delay delivery and increase cost pressure"},
    )

    assert result.source.type == "text"
    assert result.source.raw_content
    assert len(result.signals) >= 1
    assert any(
        signal.type
        in {
            "delay",
            "risk",
            "shortage",
            "cost_pressure",
            "supplier_impact",
            "customer_impact",
            "operational_instability",
            "demand_shift",
        }
        for signal in result.signals
    )
    assert all(signal.source_id == result.source.id for signal in result.signals)


def test_ingestion_csv_flattens_rows_into_signals(tmp_path: Path) -> None:
    csv_path = tmp_path / "sample.csv"
    csv_path.write_text("item,cost,delay\nwidget,120,3 days\n", encoding="utf-8")

    service = IngestionService()
    result = service.ingest(input_type="csv", payload={"path": str(csv_path)})

    assert result.source.type == "csv"
    assert "cost" in result.source.raw_content.lower()
    assert "delay" in result.source.raw_content.lower()
    assert any(signal.type in {"cost_pressure", "delay"} for signal in result.signals)


def test_ingestion_web_extracts_text_and_signals(monkeypatch) -> None:
    from ingestion.extractors import web_extractor

    class _FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def read(self) -> bytes:
            return b"""
            <html>
              <body>
                <article>
                  <h1>Supply Chain Warning</h1>
                  <p>Supplier delays are raising inventory risk and cost pressure.</p>
                </article>
              </body>
            </html>
            """

    monkeypatch.setattr(web_extractor, "urlopen", lambda request, timeout=10: _FakeResponse())

    service = IngestionService()
    result = service.ingest(input_type="web", payload={"url": "https://example.com/news"})

    assert result.source.type == "web"
    assert "supplier delays" in result.source.raw_content.lower()
    assert len(result.signals) >= 1


def test_ingestion_router_returns_canonical_bundle() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/run",
            json={
                "type": "text",
                "payload": {
                    "text": "Supplier instability is increasing cost and delaying delivery",
                },
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert "source" in payload
    assert "signals" in payload
    assert payload["source"]["type"] == "text"
    assert isinstance(payload["signals"], list)
    assert "created_at" in payload


def test_ingestion_router_rejects_empty_text_payload() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/run",
            json={
                "type": "text",
                "payload": {
                    "text": "   ",
                },
            },
        )

    assert response.status_code == 400
    payload = response.json()
    assert payload["ok"] is False
    assert payload["error"]["type"] == "INGESTION_INPUT_ERROR"
    assert payload["error"]["message"]
    assert payload["error"]["details"] is None


def test_ingestion_router_rejects_missing_csv_path_without_500() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/run",
            json={
                "type": "csv",
                "payload": {
                    "path": "   ",
                },
            },
        )

    assert response.status_code == 400
    payload = response.json()
    assert payload["ok"] is False
    assert payload["error"]["type"] == "INGESTION_INPUT_ERROR"
    assert "non-empty 'path' field" in payload["error"]["message"]


def test_ingestion_connectors_catalog_stable() -> None:
    with _client() as client:
        response = client.get("/ingestion/connectors")

    assert response.status_code == 200
    data = response.json()
    assert "connectors" in data
    ids = [c["connector_id"] for c in data["connectors"]]
    assert ids == ["manual_text", "web_source", "pdf_upload", "csv_upload", "api_feed"]
    assert data["connectors"][0]["enabled"] is True
    assert data["connectors"][0].get("description")


def test_ingestion_connector_run_manual_text() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={
                "connector_id": "manual_text",
                "config": {
                    "text": "Supplier delay and inventory risk are increasing operational pressure.",
                    "title": "connector_test",
                    "domain": "retail",
                },
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload.get("ok") is True
    assert len(payload["bundle"]["signals"]) >= 1


def test_ingestion_connector_run_unknown_returns_404() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "not_a_real_connector", "config": {}},
        )

    assert response.status_code == 404
    body = response.json()
    assert body["ok"] is False
    assert body["error"]["type"] == "CONNECTOR_NOT_FOUND"


def test_ingestion_connector_run_csv_upload_real_file(tmp_path) -> None:
    csv_path = tmp_path / "ops.csv"
    csv_path.write_text(
        "inventory,delay_days,supplier\nlow,5,Acme Corp\nmedium,2,Beta Logistics\n",
        encoding="utf-8",
    )
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "csv_upload", "config": {"file_path": str(csv_path)}},
        )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload.get("ok") is True
    assert len(payload["bundle"]["signals"]) >= 1


def test_ingestion_connector_run_csv_missing_file_returns_400() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "csv_upload", "config": {"file_path": "/nonexistent/nexora_missing.csv"}},
        )

    assert response.status_code == 400
    body = response.json()
    assert body["ok"] is False
    assert body["error"]["type"] == "INGESTION_INPUT_ERROR"


def test_ingestion_connector_run_web_source_real_fetch(monkeypatch) -> None:
    from app.connectors import web_connector

    class _FakeHeaders:
        def get(self, key: str, default=None):
            if key.lower() == "content-type":
                return "text/html; charset=utf-8"
            return default

        def get_content_charset(self):
            return "utf-8"

    class _FakeResponse:
        headers = _FakeHeaders()

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def read(self, size: int = -1) -> bytes:  # noqa: ARG002
            return b"""
            <html>
              <head><title>News</title><style>body { display:none; }</style></head>
              <body>
                <h1>Supplier Delay Warning</h1>
                <p>Inventory pressure is rising due to delayed shipments.</p>
                <script>console.log('ignore');</script>
              </body>
            </html>
            """

    monkeypatch.setattr(web_connector, "urlopen", lambda request, timeout=6: _FakeResponse())

    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "web_source", "config": {"url": "https://www.reuters.com/world/"}},
        )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload.get("ok") is True
    assert len(payload["bundle"]["signals"]) >= 1
    assert payload["bundle"]["ingestion_meta"]["input_type"] == "text"
    assert payload["bundle"]["source"]["metadata"]["url"] == "https://www.reuters.com/world/"
    assert payload["bundle"]["source"]["metadata"]["domain"] == "www.reuters.com"
    assert payload["bundle"]["source"]["metadata"]["trust_level"] == "verified"


def test_ingestion_connector_run_web_source_invalid_url_returns_400() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "web_source", "config": {"url": "not-a-url"}},
        )

    assert response.status_code == 400
    body = response.json()
    assert body["ok"] is False
    assert body["error"]["type"] == "INGESTION_INPUT_ERROR"


def test_ingestion_connector_run_web_source_blocked_localhost_returns_400() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "web_source", "config": {"url": "http://localhost/news"}},
        )

    assert response.status_code == 400
    body = response.json()
    assert body["ok"] is False
    assert body["error"]["type"] == "INGESTION_INPUT_ERROR"
    assert "Blocked domain" in body["error"]["message"]


def test_ingestion_connector_run_web_source_unknown_domain_returns_400() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/connector/run",
            json={"connector_id": "web_source", "config": {"url": "https://randomsite.xyz/article"}},
        )

    assert response.status_code == 400
    body = response.json()
    assert body["ok"] is False
    assert body["error"]["type"] == "INGESTION_INPUT_ERROR"
    assert "Domain not allowed" in body["error"]["message"]


def test_ingestion_text_route_returns_typed_wrapper() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/text",
            json={
                "text": "Supplier delay and cost pressure are increasing operational risk.",
                "title": "unit",
                "domain": "retail",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload.get("ok") is True
    assert "bundle" in payload
    assert isinstance(payload["bundle"]["signals"], list)
    assert len(payload["bundle"]["signals"]) >= 1
    types = {s["type"] for s in payload["bundle"]["signals"]}
    assert "delay" in types or "cost_pressure" in types or "risk" in types


def test_ingestion_neutral_text_warns_without_signals() -> None:
    service = IngestionService()
    result = service.ingest_text("the weather is pleasant today with blue skies")
    assert result.signals == []
    assert "no_meaningful_signals" in result.warnings


def _multi_run_signal(
    sid: str,
    typ: str,
    label: str,
    description: str,
    strength: float,
    source_id: str,
) -> Signal:
    return Signal(
        id=sid,
        type=typ,
        label=label,
        description=description,
        strength=strength,
        source_id=source_id,
    )


def _multi_run_bundle(source_id: str, signals: list[Signal]) -> SignalBundle:
    return SignalBundle(
        source=SourceDocument(
            id=source_id,
            type="text",
            title="api_test",
            raw_content="sample",
            metadata={"test": source_id},
        ),
        signals=signals,
        summary=f"bundle:{source_id}",
        warnings=[],
        ingestion_meta={"input_type": "text"},
    )


def test_ingestion_multi_run_two_sources_happy_path(monkeypatch) -> None:
    s1 = _multi_run_signal("sig_1", "delay", "Delay", "Late delivery", 0.55, "src_a")
    s2 = _multi_run_signal("sig_2", "risk", "Risk", "Stockout risk", 0.66, "src_b")
    b1 = _multi_run_bundle("src_a", [s1])
    b2 = _multi_run_bundle("src_b", [s2])

    async def fake_run(request: MultiSourceIngestionRequest) -> MultiSourceIngestionResponse:  # noqa: ARG001
        return MultiSourceIngestionResponse(
            ok=True,
            bundle=MergedSignalBundle(
                sources=[
                    ConnectorRunResult(
                        connector_id="manual_text",
                        ok=True,
                        bundle=b1,
                        errors=[],
                        metadata={},
                    ),
                    ConnectorRunResult(
                        connector_id="csv_upload",
                        ok=True,
                        bundle=b2,
                        errors=[],
                        metadata={},
                    ),
                ],
                signals=[s1, s2],
                summary="Merged 2 sources",
                warnings=[],
                merge_meta={
                    "source_count": 2,
                    "successful_source_count": 2,
                    "failed_source_count": 0,
                    "merged_signal_count": 2,
                },
            ),
            errors=[],
        )

    monkeypatch.setattr(ingestion_router_mod, "run_multi_source_ingestion", fake_run)

    with _client() as client:
        response = client.post(
            "/ingestion/multi/run",
            json={
                "sources": [
                    {"connector_id": "manual_text", "config": {"text": "x"}},
                    {"connector_id": "csv_upload", "config": {"file_path": "/tmp/x.csv"}},
                ],
                "domain": "retail",
            },
        )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["ok"] is True
    assert len(data["bundle"]["sources"]) == 2
    assert len(data["bundle"]["signals"]) == 2
    assert data["bundle"]["merge_meta"]["successful_source_count"] == 2
    assert data["errors"] == []


def test_ingestion_multi_run_partial_failure_still_200_and_ok_true(monkeypatch) -> None:
    s1 = _multi_run_signal("sig_1", "delay", "Delay", "Late delivery", 0.55, "src_a")
    b1 = _multi_run_bundle("src_a", [s1])

    async def fake_run(request: MultiSourceIngestionRequest) -> MultiSourceIngestionResponse:  # noqa: ARG001
        return MultiSourceIngestionResponse(
            ok=True,
            bundle=MergedSignalBundle(
                sources=[
                    ConnectorRunResult(
                        connector_id="manual_text",
                        ok=True,
                        bundle=b1,
                        errors=[],
                        metadata={},
                    ),
                    ConnectorRunResult(
                        connector_id="web_source",
                        ok=False,
                        bundle=None,
                        errors=["blocked"],
                        metadata={},
                    ),
                ],
                signals=[s1],
                summary="Merged 1 sources with 1 signals",
                warnings=["failed_sources:web_source"],
                merge_meta={
                    "source_count": 2,
                    "successful_source_count": 1,
                    "failed_source_count": 1,
                    "merged_signal_count": 1,
                },
            ),
            errors=["web_source: blocked"],
        )

    monkeypatch.setattr(ingestion_router_mod, "run_multi_source_ingestion", fake_run)

    with _client() as client:
        response = client.post(
            "/ingestion/multi/run",
            json={
                "sources": [
                    {"connector_id": "manual_text", "config": {"text": "x"}},
                    {"connector_id": "web_source", "config": {"url": "https://example.com/"}},
                ],
            },
        )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["ok"] is True
    assert data["bundle"]["merge_meta"]["failed_source_count"] == 1
    assert any("web_source" in e for e in data["errors"])


def test_ingestion_multi_run_all_sources_fail_still_200_and_ok_false(monkeypatch) -> None:
    async def fake_run(request: MultiSourceIngestionRequest) -> MultiSourceIngestionResponse:  # noqa: ARG001
        return MultiSourceIngestionResponse(
            ok=False,
            bundle=MergedSignalBundle(
                sources=[
                    ConnectorRunResult(
                        connector_id="manual_text",
                        ok=False,
                        bundle=None,
                        errors=["bad"],
                        metadata={},
                    ),
                    ConnectorRunResult(
                        connector_id="csv_upload",
                        ok=False,
                        bundle=None,
                        errors=["missing"],
                        metadata={},
                    ),
                ],
                signals=[],
                summary=None,
                warnings=["failed_sources:manual_text,csv_upload"],
                merge_meta={
                    "source_count": 2,
                    "successful_source_count": 0,
                    "failed_source_count": 2,
                    "merged_signal_count": 0,
                },
            ),
            errors=["manual_text: bad", "csv_upload: missing"],
        )

    monkeypatch.setattr(ingestion_router_mod, "run_multi_source_ingestion", fake_run)

    with _client() as client:
        response = client.post(
            "/ingestion/multi/run",
            json={
                "sources": [
                    {"connector_id": "manual_text", "config": {}},
                    {"connector_id": "csv_upload", "config": {}},
                ],
            },
        )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["ok"] is False
    assert data["bundle"]["signals"] == []
    assert len(data["errors"]) == 2


def test_ingestion_multi_run_malformed_body_validation_error() -> None:
    with _client() as client:
        response = client.post(
            "/ingestion/multi/run",
            json={"sources": [], "unexpected_top_level_field": True},
        )

    assert response.status_code == 422
