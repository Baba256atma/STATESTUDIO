"""Service wrapper for Nexora what-if propagation scaffolding."""

from __future__ import annotations

import logging

from engines.scenario_simulation.propagation_engine import (
    PROPAGATION_MIN_STRENGTH,
    extract_relation_graph_from_scene,
    simulate_propagation_graph,
)
from engines.scenario_simulation.propagation_models import (
    PropagationObjectGraph,
    PropagationRequest,
    PropagationResult,
)

logger = logging.getLogger(__name__)


def _resolve_graph(request: PropagationRequest) -> PropagationObjectGraph:
    if request.object_graph is not None:
        return request.object_graph
    return extract_relation_graph_from_scene(
        request.scene_json,
        relation_weight_default=request.relation_weight_default,
    )


def run_propagation_simulation(request: PropagationRequest) -> PropagationResult:
    """Run the lightweight propagation scaffold and normalize the output."""

    graph = _resolve_graph(request)
    impacted_nodes, impacted_edges = simulate_propagation_graph(
        source_object_id=request.source_object_id,
        graph=graph,
        max_depth=request.max_depth,
        decay=request.decay,
        threshold=PROPAGATION_MIN_STRENGTH,
    )

    if logger.isEnabledFor(logging.DEBUG):
        logger.debug(
            "[Nexora][PropagationEngine] source=%s nodes=%s edges=%s mode=%s",
            request.source_object_id,
            len(impacted_nodes),
            len(impacted_edges),
            request.mode,
        )

    return PropagationResult(
        active=bool(impacted_nodes),
        source_object_id=request.source_object_id,
        impacted_nodes=impacted_nodes,
        impacted_edges=impacted_edges,
        meta={
            "mode": request.mode,
            "max_depth": request.max_depth,
            "decay": request.decay,
            "threshold": PROPAGATION_MIN_STRENGTH,
            "relation_weight_default": request.relation_weight_default,
            "interpretation": "heuristic propagation scaffold",
            "engine_version": "propagation_v1",
            "object_count": len(graph.object_ids),
            "edge_count": len(graph.edges),
        },
    )
