"""Scenario action service scaffold for decision-path-ready Nexora overlays."""

from __future__ import annotations

from engines.scenario_simulation.propagation_models import PropagationRequest
from engines.scenario_simulation.propagation_service import run_propagation_simulation
from engines.scenario_simulation.scenario_action_models import (
    DecisionPathEdge,
    DecisionPathNode,
    DecisionPathResult,
    ScenarioAnalysisPayload,
    ScenarioActionContract,
    ScenarioActionRequest,
    ScenarioActionResultBundle,
)


def _build_decision_path_from_propagation(
    contract: ScenarioActionContract,
    propagation_result,
) -> DecisionPathResult:
    """Lightweight decision-path scaffold derived from propagation v1.

    This is intentionally heuristic scaffolding so the backend can return
    a stable contract without claiming full strategic truth yet.
    """

    nodes = []
    for impact in propagation_result.impacted_nodes:
        role = "source" if impact.depth == 0 else "impacted" if impact.depth == 1 else "context"
        rationale = (
            "Scenario action source node."
            if impact.depth == 0
            else "First-order consequence path."
            if impact.depth == 1
            else "Supporting downstream context."
        )
        nodes.append(
            DecisionPathNode(
                object_id=impact.object_id,
                role=role,
                depth=impact.depth,
                strength=impact.strength,
                direction="downstream",
                rationale=rationale,
            )
        )

    edges = [
        DecisionPathEdge(
            from_id=edge.from_id,
            to_id=edge.to_id,
            depth=edge.depth,
            strength=edge.strength,
            path_role="primary_path" if edge.depth == 1 else "secondary_path",
        )
        for edge in propagation_result.impacted_edges
    ]

    return DecisionPathResult(
        active=bool(nodes),
        source_object_id=propagation_result.source_object_id,
        nodes=nodes,
        edges=edges,
        meta={
            "mode": contract.intent.mode,
            "interpretation": "heuristic decision-path scaffold derived from propagation",
            "engine_version": "decision_path_v1",
            "action_id": contract.intent.action_id,
            "action_kind": contract.intent.action_kind,
        },
    )


def run_scenario_action(request: ScenarioActionRequest) -> ScenarioActionResultBundle:
    contract = ScenarioActionContract(intent=request.scenario_action)
    propagation = None
    requested_outputs = set(request.scenario_action.requested_outputs or ["propagation"])
    source_object_id = (request.scenario_action.source_object_id or "").strip()

    if source_object_id and {"propagation", "decision_path"} & requested_outputs:
        propagation = run_propagation_simulation(
            PropagationRequest(
                source_object_id=source_object_id,
                scene_json=request.scene_json,
                object_graph=request.object_graph,
                max_depth=request.max_depth,
                decay=request.decay,
                mode=request.scenario_action.mode,
            )
        )

    decision_path = (
        _build_decision_path_from_propagation(contract, propagation)
        if propagation is not None and "decision_path" in requested_outputs
        else None
    )

    analysis = (
        ScenarioAnalysisPayload(
            summary=f"Scenario action '{request.scenario_action.action_kind}' prepared as a heuristic overlay scaffold.",
            advice=[],
        )
        if "summary" in requested_outputs or "advice" in requested_outputs
        else None
    )

    return ScenarioActionResultBundle(
        scenario_action=contract,
        propagation=propagation,
        decision_path=decision_path,
        analysis=analysis,
    )
