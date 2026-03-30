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

from ingestion.router import router as ingestion_router
from ingestion.service import IngestionService


def _client() -> TestClient:
    app = FastAPI()
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
    assert any(signal.type in {"delay", "risk", "supply", "cost"} for signal in result.signals)
    assert all(signal.source_id == result.source.id for signal in result.signals)


def test_ingestion_csv_flattens_rows_into_signals(tmp_path: Path) -> None:
    csv_path = tmp_path / "sample.csv"
    csv_path.write_text("item,cost,delay\nwidget,120,3 days\n", encoding="utf-8")

    service = IngestionService()
    result = service.ingest(input_type="csv", payload={"path": str(csv_path)})

    assert result.source.type == "csv"
    assert "cost" in result.source.raw_content.lower()
    assert "delay" in result.source.raw_content.lower()
    assert any(signal.type in {"cost", "delay"} for signal in result.signals)


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
    assert payload["detail"]["error"]["type"] == "INGESTION_INPUT_ERROR"
