from __future__ import annotations

from fastapi.testclient import TestClient

import main
from engines.system_intelligence.intelligence_models import SystemIntelligenceInput
from engines.system_intelligence.intelligence_service import run_system_intelligence


def test_system_intelligence_ranks_source_and_bottleneck():
    result = run_system_intelligence(
        SystemIntelligenceInput(
            mode="decision",
            propagation={
                "source_object_id": "obj_delivery",
                "impacted_nodes": [
                    {"object_id": "obj_delivery", "depth": 0, "strength": 1.0, "role": "source"},
                    {"object_id": "obj_inventory", "depth": 1, "strength": 0.74, "role": "impacted"},
                ],
                "impacted_edges": [
                    {"from_id": "obj_delivery", "to_id": "obj_inventory", "depth": 1, "strength": 0.74}
                ],
            },
            decision_path={
                "source_object_id": "obj_delivery",
                "nodes": [
                    {"object_id": "obj_delivery", "role": "source", "depth": 0, "strength": 1.0},
                    {"object_id": "obj_inventory", "role": "bottleneck", "depth": 1, "strength": 0.82},
                ],
                "edges": [
                    {
                        "from_id": "obj_delivery",
                        "to_id": "obj_inventory",
                        "depth": 1,
                        "strength": 0.82,
                        "path_role": "primary_path",
                    }
                ],
            },
            scanner_summary={"fragility_score": 0.68, "scanner_primary_target_id": "obj_delivery"},
        )
    )

    assert result.active is True
    assert result.object_insights[0].object_id in {"obj_delivery", "obj_inventory"}
    assert any(item.role == "bottleneck" for item in result.object_insights)
    assert result.summary.suggested_focus_object_id is not None
    assert len(result.advice) >= 1


def test_system_intelligence_handles_empty_input_softly():
    result = run_system_intelligence(SystemIntelligenceInput())

    assert result.active is False
    assert result.object_insights == []
    assert result.path_insights == []
    assert result.summary.headline


def test_system_intelligence_route_returns_payload():
    client = TestClient(main.app)
    response = client.post(
        "/system/intelligence/run",
        json={
            "mode": "simulation",
            "propagation": {
                "source_object_id": "obj_delivery",
                "impacted_nodes": [
                    {"object_id": "obj_delivery", "depth": 0, "strength": 1.0, "role": "source"},
                    {"object_id": "obj_inventory", "depth": 1, "strength": 0.74, "role": "impacted"},
                ],
                "impacted_edges": [
                    {"from_id": "obj_delivery", "to_id": "obj_inventory", "depth": 1, "strength": 0.74}
                ],
            },
        },
    )

    assert response.status_code == 200
    payload = response.json()["intelligence"]
    assert payload["meta"]["engine_version"] == "system_intelligence_v1"
    assert isinstance(payload["object_insights"], list)
