"""Pure propagation engine for lightweight what-if consequence previews.

This module intentionally stays heuristic and graph-local so it can later be
replaced or augmented by richer scenario and war-room engines without changing
the frontend overlay contract.
"""

from __future__ import annotations

from collections import deque
from typing import Any

from engines.scenario_simulation.propagation_models import (
    PropagationEdgeImpact,
    PropagationGraphEdge,
    PropagationNodeImpact,
    PropagationObjectGraph,
)


PROPAGATION_MIN_STRENGTH = 0.08


def _clamp01(value: Any) -> float:
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return 0.0
    if numeric <= 0.0:
        return 0.0
    if numeric >= 1.0:
        return 1.0
    return numeric


def extract_relation_graph_from_scene(
    scene_json: dict[str, Any] | None,
    *,
    relation_weight_default: float = 1.0,
) -> PropagationObjectGraph:
    """Build a normalized undirected relation graph from a scene payload."""

    if not isinstance(scene_json, dict):
        return PropagationObjectGraph()

    scene_section = scene_json.get("scene")
    if not isinstance(scene_section, dict):
        return PropagationObjectGraph()

    object_ids = [
        str(obj.get("id")).strip()
        for obj in scene_section.get("objects", [])
        if isinstance(obj, dict) and str(obj.get("id") or "").strip()
    ]

    normalized_edges: list[PropagationGraphEdge] = []
    candidate_edge_groups = []
    loops = scene_section.get("loops")
    if isinstance(loops, list):
        candidate_edge_groups.extend(
            loop.get("edges", [])
            for loop in loops
            if isinstance(loop, dict) and isinstance(loop.get("edges"), list)
        )

    for edge_group in candidate_edge_groups:
        for raw_edge in edge_group:
            if not isinstance(raw_edge, dict):
                continue
            from_id = str(raw_edge.get("from") or raw_edge.get("from_id") or "").strip()
            to_id = str(raw_edge.get("to") or raw_edge.get("to_id") or "").strip()
            if not from_id or not to_id:
                continue
            weight = _clamp01(raw_edge.get("weight", relation_weight_default))
            if weight <= 0.0:
                weight = _clamp01(relation_weight_default) or 1.0
            normalized_edges.append(
                PropagationGraphEdge(
                    from_id=from_id,
                    to_id=to_id,
                    weight=weight,
                )
            )

    return PropagationObjectGraph(object_ids=object_ids, edges=normalized_edges)


def simulate_propagation_graph(
    *,
    source_object_id: str,
    graph: PropagationObjectGraph,
    max_depth: int = 2,
    decay: float = 0.74,
    threshold: float = PROPAGATION_MIN_STRENGTH,
) -> tuple[list[PropagationNodeImpact], list[PropagationEdgeImpact]]:
    """Run a small deterministic BFS-style propagation over a normalized graph."""

    source_object_id = str(source_object_id or "").strip()
    if not source_object_id:
        return [], []

    adjacency: dict[str, list[tuple[str, float]]] = {}
    for edge in graph.edges:
        from_id = str(edge.from_id).strip()
        to_id = str(edge.to_id).strip()
        if not from_id or not to_id:
            continue
        weight = _clamp01(edge.weight) or 1.0
        adjacency.setdefault(from_id, []).append((to_id, weight))
        adjacency.setdefault(to_id, []).append((from_id, weight))

    node_state: dict[str, tuple[int, float]] = {source_object_id: (0, 1.0)}
    edge_state: dict[tuple[str, str, int], float] = {}
    best_depth: dict[str, int] = {source_object_id: 0}
    queue: deque[tuple[str, int, float]] = deque([(source_object_id, 0, 1.0)])

    while queue:
        current_id, depth, strength = queue.popleft()
        if depth >= max_depth:
            continue

        for neighbor_id, edge_weight in adjacency.get(current_id, []):
            next_depth = depth + 1
            next_strength = _clamp01(strength * decay * edge_weight)
            if next_strength < threshold:
                continue

            edge_key = (current_id, neighbor_id, next_depth)
            edge_state[edge_key] = max(edge_state.get(edge_key, 0.0), next_strength)

            previous = node_state.get(neighbor_id)
            if previous is None or next_strength > previous[1]:
                node_state[neighbor_id] = (next_depth, next_strength)

            seen_depth = best_depth.get(neighbor_id)
            if seen_depth is not None and seen_depth < next_depth:
                continue
            best_depth[neighbor_id] = next_depth
            queue.append((neighbor_id, next_depth, next_strength))

    impacted_nodes = [
        PropagationNodeImpact(
            object_id=object_id,
            depth=depth,
            strength=strength,
            role="source" if depth == 0 else "impacted",
        )
        for object_id, (depth, strength) in sorted(node_state.items(), key=lambda item: (item[1][0], -item[1][1], item[0]))
    ]
    impacted_edges = [
        PropagationEdgeImpact(
            from_id=from_id,
            to_id=to_id,
            depth=depth,
            strength=strength,
        )
        for (from_id, to_id, depth), strength in sorted(
            edge_state.items(),
            key=lambda item: (item[0][2], -item[1], item[0][0], item[0][1]),
        )
    ]

    return impacted_nodes, impacted_edges
