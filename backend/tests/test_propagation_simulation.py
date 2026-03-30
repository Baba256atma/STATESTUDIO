from __future__ import annotations

from fastapi.testclient import TestClient

import main
from engines.scenario_simulation.propagation_engine import extract_relation_graph_from_scene
from engines.scenario_simulation.propagation_models import (
    PropagationGraphEdge,
    PropagationObjectGraph,
    PropagationRequest,
)
from engines.scenario_simulation.propagation_service import run_propagation_simulation


def test_propagation_source_only_when_no_edges():
    result = run_propagation_simulation(
        PropagationRequest(
            source_object_id="obj_delivery_1",
            object_graph=PropagationObjectGraph(object_ids=["obj_delivery_1"], edges=[]),
        )
    )

    assert result.active is True
    assert len(result.impacted_nodes) == 1
    assert result.impacted_nodes[0].object_id == "obj_delivery_1"
    assert result.impacted_nodes[0].depth == 0
    assert result.impacted_edges == []


def test_propagation_one_hop():
    result = run_propagation_simulation(
        PropagationRequest(
            source_object_id="obj_delivery_1",
            object_graph=PropagationObjectGraph(
                object_ids=["obj_delivery_1", "obj_inventory_1"],
                edges=[PropagationGraphEdge(from_id="obj_delivery_1", to_id="obj_inventory_1", weight=1.0)],
            ),
        )
    )

    node_by_id = {node.object_id: node for node in result.impacted_nodes}
    assert "obj_inventory_1" in node_by_id
    assert node_by_id["obj_inventory_1"].depth == 1
    assert node_by_id["obj_inventory_1"].strength == 0.74
    assert len(result.impacted_edges) == 1
    assert result.impacted_edges[0].from_id == "obj_delivery_1"


def test_propagation_two_hop_with_decay():
    result = run_propagation_simulation(
        PropagationRequest(
            source_object_id="obj_supplier_1",
            object_graph=PropagationObjectGraph(
                object_ids=["obj_supplier_1", "obj_delivery_1", "obj_inventory_1"],
                edges=[
                    PropagationGraphEdge(from_id="obj_supplier_1", to_id="obj_delivery_1", weight=1.0),
                    PropagationGraphEdge(from_id="obj_delivery_1", to_id="obj_inventory_1", weight=1.0),
                ],
            ),
        )
    )

    node_by_id = {node.object_id: node for node in result.impacted_nodes}
    assert node_by_id["obj_delivery_1"].strength == 0.74
    assert round(node_by_id["obj_inventory_1"].strength, 4) == round(0.74 * 0.74, 4)


def test_extract_relation_graph_ignores_malformed_edges():
    graph = extract_relation_graph_from_scene(
        {
            "scene": {
                "objects": [{"id": "obj_a"}, {"id": "obj_b"}],
                "loops": [
                    {"edges": [{"from": "obj_a", "to": "obj_b", "weight": 0.8}, {"from": "obj_a"}, None]}
                ],
            }
        }
    )

    assert graph.object_ids == ["obj_a", "obj_b"]
    assert len(graph.edges) == 1
    assert graph.edges[0].from_id == "obj_a"
    assert graph.edges[0].to_id == "obj_b"


def test_duplicate_edges_do_not_break_output():
    result = run_propagation_simulation(
        PropagationRequest(
            source_object_id="obj_delivery_1",
            object_graph=PropagationObjectGraph(
                object_ids=["obj_delivery_1", "obj_inventory_1"],
                edges=[
                    PropagationGraphEdge(from_id="obj_delivery_1", to_id="obj_inventory_1", weight=1.0),
                    PropagationGraphEdge(from_id="obj_delivery_1", to_id="obj_inventory_1", weight=0.9),
                ],
            ),
        )
    )

    assert any(edge.to_id == "obj_inventory_1" for edge in result.impacted_edges)
    assert len([node for node in result.impacted_nodes if node.object_id == "obj_inventory_1"]) == 1


def test_simulation_propagation_route_returns_normalized_payload():
    client = TestClient(main.app)
    response = client.post(
        "/simulation/propagation",
        json={
            "source_object_id": "obj_delivery_1",
            "object_graph": {
                "object_ids": ["obj_delivery_1", "obj_inventory_1"],
                "edges": [{"from_id": "obj_delivery_1", "to_id": "obj_inventory_1", "weight": 1.0}],
            },
        },
    )

    assert response.status_code == 200
    body = response.json()
    propagation = body["simulation"]["propagation"]
    assert propagation["active"] is True
    assert propagation["source_object_id"] == "obj_delivery_1"
    assert propagation["meta"]["engine_version"] == "propagation_v1"
