from __future__ import annotations

import asyncio
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

for path in (BACKEND_DIR, ROOT_DIR):
    normalized = str(path)
    if normalized not in sys.path:
        sys.path.insert(0, normalized)

from app.connectors.merge_contract import ConnectorRunInput, MultiSourceIngestionRequest
from app.connectors.merge_service import run_multi_source_ingestion
from ingestion.schemas import Signal, SignalBundle, SourceDocument


def _bundle(
    source_type: str,
    source_id: str,
    signals: list[Signal],
    *,
    source_metadata: dict | None = None,
) -> SignalBundle:
    return SignalBundle(
        source=SourceDocument(
            id=source_id,
            type=source_type,  # type: ignore[arg-type]
            title="test",
            raw_content="sample",
            metadata=source_metadata if source_metadata is not None else {"connector_id": source_id},
        ),
        signals=signals,
        summary=f"bundle:{source_id}",
        warnings=[],
        ingestion_meta={"input_type": "text"},
    )


def _signal(*, sid: str, typ: str, label: str, description: str, strength: float, source_id: str) -> Signal:
    return Signal(
        id=sid,
        type=typ,
        label=label,
        description=description,
        entities=[],
        strength=strength,
        source_id=source_id,
        metadata={},
    )


def test_merge_service_two_successful_sources(monkeypatch) -> None:
    async def _fake_run_connector(connector_id, config, service):  # noqa: ARG001
        if connector_id == "manual_text":
            return _bundle(
                "text",
                "src_manual",
                [_signal(sid="s1", typ="delay", label="Delay", description="Delivery delayed", strength=0.6, source_id="src_manual")],
            )
        return _bundle(
            "text",
            "src_csv",
            [_signal(sid="s2", typ="risk", label="Risk", description="Inventory risk", strength=0.7, source_id="src_csv")],
        )

    from app.connectors import merge_service

    monkeypatch.setattr(merge_service, "run_connector", _fake_run_connector)

    req = MultiSourceIngestionRequest(
        sources=[
            ConnectorRunInput(connector_id="manual_text", config={"text": "a"}),
            ConnectorRunInput(connector_id="csv_upload", config={"file_path": "/tmp/a.csv"}),
        ],
        domain="retail",
    )
    res = asyncio.run(run_multi_source_ingestion(req))
    assert res.ok is True
    assert len(res.bundle.sources) == 2
    assert len(res.bundle.signals) == 2
    assert res.bundle.merge_meta["source_count"] == 2
    assert res.bundle.merge_meta["successful_source_count"] == 2
    assert res.bundle.merge_meta["failed_source_count"] == 0
    assert res.bundle.merge_meta["merged_signal_count"] == 2
    assert res.bundle.merge_meta["weighted_signal_count"] == 2
    assert "manual_text" in res.bundle.merge_meta["source_weights"]
    assert "csv_upload" in res.bundle.merge_meta["source_weights"]
    assert res.bundle.merge_meta["source_trust_summary"]
    strengths = sorted(round(s.strength, 5) for s in res.bundle.signals)
    assert strengths == [0.42, 0.49]


def test_merge_service_one_success_one_failure(monkeypatch) -> None:
    async def _fake_run_connector(connector_id, config, service):  # noqa: ARG001
        if connector_id == "web_source":
            raise ValueError("blocked")
        return _bundle(
            "text",
            "src_manual",
            [_signal(sid="s1", typ="delay", label="Delay", description="Delivery delayed", strength=0.6, source_id="src_manual")],
        )

    from app.connectors import merge_service

    monkeypatch.setattr(merge_service, "run_connector", _fake_run_connector)

    req = MultiSourceIngestionRequest(
        sources=[
            ConnectorRunInput(connector_id="manual_text", config={"text": "a"}),
            ConnectorRunInput(connector_id="web_source", config={"url": "https://bad.example"}),
        ]
    )
    res = asyncio.run(run_multi_source_ingestion(req))
    assert res.ok is True
    assert len(res.bundle.signals) == 1
    assert res.bundle.merge_meta["successful_source_count"] == 1
    assert res.bundle.merge_meta["failed_source_count"] == 1
    assert any("web_source" in e for e in res.errors)


def test_merge_service_dedupes_duplicate_signals_deterministically(monkeypatch) -> None:
    async def _fake_run_connector(connector_id, config, service):  # noqa: ARG001
        if connector_id == "a":
            return _bundle(
                "text",
                "src_a",
                [_signal(sid="s1", typ="risk", label="Risk", description="Inventory risk", strength=0.4, source_id="src_a")],
            )
        return _bundle(
            "text",
            "src_b",
            [_signal(sid="s2", typ="risk", label="Risk", description="Inventory risk", strength=0.8, source_id="src_b")],
        )

    from app.connectors import merge_service

    monkeypatch.setattr(merge_service, "run_connector", _fake_run_connector)

    req = MultiSourceIngestionRequest(
        sources=[
            ConnectorRunInput(connector_id="a", config={}),
            ConnectorRunInput(connector_id="b", config={}),
        ]
    )
    res = asyncio.run(run_multi_source_ingestion(req))
    assert res.ok is True
    assert len(res.bundle.signals) == 1
    # Unknown connector ids use low trust (0.4): 0.8*0.4=0.32 beats 0.4*0.4=0.16
    assert abs(res.bundle.signals[0].strength - 0.32) < 1e-5
    assert res.bundle.signals[0].metadata.get("merge_source_connector") in ("a", "b")


def test_merge_service_all_failures_returns_not_ok(monkeypatch) -> None:
    async def _fake_run_connector(connector_id, config, service):  # noqa: ARG001
        raise ValueError("failed")

    from app.connectors import merge_service

    monkeypatch.setattr(merge_service, "run_connector", _fake_run_connector)

    req = MultiSourceIngestionRequest(
        sources=[
            ConnectorRunInput(connector_id="manual_text", config={}),
            ConnectorRunInput(connector_id="web_source", config={}),
        ]
    )
    res = asyncio.run(run_multi_source_ingestion(req))
    assert res.ok is False
    assert len(res.bundle.signals) == 0
    assert res.bundle.merge_meta["successful_source_count"] == 0
    assert res.bundle.merge_meta["failed_source_count"] == 2
    assert len(res.errors) == 2
    assert res.bundle.merge_meta.get("weighted_signal_count") == 0
    assert res.bundle.merge_meta.get("source_weights") == {}


def test_merge_service_verified_web_beats_higher_raw_csv_on_duplicate(monkeypatch) -> None:
    """Same dedupe key: Reuters-tier web trust (1.0) should outrank CSV (0.7) when weighted."""

    async def _fake_run_connector(connector_id, config, service):  # noqa: ARG001
        if connector_id == "web_source":
            return _bundle(
                "text",
                "src_web",
                [
                    _signal(
                        sid="w1",
                        typ="delay",
                        label="Delay",
                        description="Delivery delay risk",
                        strength=0.72,
                        source_id="src_web",
                    )
                ],
                source_metadata={"trust_level": "verified", "domain": "www.reuters.com"},
            )
        return _bundle(
            "text",
            "src_csv",
            [
                _signal(
                    sid="c1",
                    typ="delay",
                    label="Delay",
                    description="Delivery delay risk",
                    strength=0.95,
                    source_id="src_csv",
                )
            ],
            source_metadata={"connector_id": "csv_upload"},
        )

    from app.connectors import merge_service

    monkeypatch.setattr(merge_service, "run_connector", _fake_run_connector)

    req = MultiSourceIngestionRequest(
        sources=[
            ConnectorRunInput(connector_id="web_source", config={"url": "https://www.reuters.com/x"}),
            ConnectorRunInput(connector_id="csv_upload", config={"file_path": "/tmp/x.csv"}),
        ]
    )
    res = asyncio.run(run_multi_source_ingestion(req))
    assert res.ok is True
    assert len(res.bundle.signals) == 1
    # web0.72 * 1.0 = 0.72 ; csv 0.95 * 0.7 = 0.665 → web wins
    assert abs(res.bundle.signals[0].strength - 0.72) < 1e-5
    assert res.bundle.signals[0].metadata.get("merge_source_connector") == "web_source"
    assert res.bundle.merge_meta["source_weights"]["web_source"] == 1.0
    assert res.bundle.merge_meta["source_weights"]["csv_upload"] == 0.7


def test_merge_service_successful_sources_zero_signals(monkeypatch) -> None:
    async def _fake_run_connector(connector_id, config, service):  # noqa: ARG001
        return _bundle("text", f"src_{connector_id}", [], source_metadata={})

    from app.connectors import merge_service

    monkeypatch.setattr(merge_service, "run_connector", _fake_run_connector)

    req = MultiSourceIngestionRequest(
        sources=[
            ConnectorRunInput(connector_id="manual_text", config={"text": "a"}),
            ConnectorRunInput(connector_id="csv_upload", config={"file_path": "/tmp/a.csv"}),
        ]
    )
    res = asyncio.run(run_multi_source_ingestion(req))
    assert res.ok is True
    assert res.bundle.signals == []
    assert res.bundle.merge_meta["weighted_signal_count"] == 0
    assert "manual_text" in res.bundle.merge_meta["source_weights"]

