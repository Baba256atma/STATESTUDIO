import type { PropagationOverlayState } from "../simulation/propagationTypes";
import type { DecisionPathOverlayState } from "../simulation/decisionPathOverlayTypes";

/** Merge propagation bridge output with backend simulation overlay links (extracted from SceneCanvas). */
export function mergePropagationOverlayState(
  propagationOverlay: PropagationOverlayState | null,
  simulation: {
    highlightedIds: string[];
    intensityMap: Record<string, number>;
    links: Array<{ source: string; target: string; weight: number }>;
  }
): PropagationOverlayState | null {
  if (simulation.highlightedIds.length === 0 && simulation.links.length === 0) {
    return propagationOverlay;
  }

  const baseNodes = propagationOverlay?.impacted_nodes ?? [];
  const baseEdges = propagationOverlay?.impacted_edges ?? [];
  const nodeMap = new Map(baseNodes.map((node) => [node.object_id, node] as const));

  simulation.highlightedIds.forEach((id, index) => {
    const strength = Math.max(simulation.intensityMap[id] ?? 0.72, nodeMap.get(id)?.strength ?? 0);
    nodeMap.set(id, {
      object_id: id,
      depth: nodeMap.get(id)?.depth ?? (index === 0 ? 0 : 1),
      strength,
      role: nodeMap.get(id)?.role ?? (index === 0 ? "source" : "impacted"),
    });
  });

  const edgeMap = new Map(baseEdges.map((edge) => [`${edge.from}:${edge.to}`, edge] as const));
  simulation.links.forEach((link) => {
    edgeMap.set(`${link.source}:${link.target}`, {
      from: link.source,
      to: link.target,
      depth: 1,
      strength: Math.max(0.15, Math.min(1, link.weight)),
    });
  });

  return {
    active: true,
    source_object_id:
      propagationOverlay?.source_object_id ??
      simulation.links[0]?.source ??
      simulation.highlightedIds[0] ??
      null,
    mode: propagationOverlay?.mode ?? "backend",
    impacted_nodes: Array.from(nodeMap.values()),
    impacted_edges: Array.from(edgeMap.values()),
    meta: {
      label: propagationOverlay?.meta?.label ?? "Simulation propagation",
      timestamp: propagationOverlay?.meta?.timestamp ?? 0,
      source_kind: propagationOverlay?.meta?.source_kind ?? "backend_payload",
    },
  };
}

export function propagationOverlayToEdges(
  overlay: PropagationOverlayState | null | undefined
): Array<{ from: string; to: string; strength: number; depth: number }> {
  if (!overlay?.active) return [];
  return (overlay.impacted_edges ?? [])
    .map((edge) => ({
      from: String(edge.from ?? "").trim(),
      to: String(edge.to ?? "").trim(),
      depth: Math.max(1, Number(edge.depth ?? 1)),
      strength: Math.max(0, Math.min(1, Number(edge.strength ?? 0))),
    }))
    .filter((edge) => edge.from && edge.to);
}

export function decisionPathOverlayToEdges(
  overlay: DecisionPathOverlayState | null | undefined
): Array<{ from: string; to: string; strength: number; depth: number }> {
  if (!overlay?.active) return [];
  return (overlay.edges ?? [])
    .map((edge) => ({
      from: String(edge.from ?? "").trim(),
      to: String(edge.to ?? "").trim(),
      depth: Math.max(1, Number(edge.depth ?? 1)),
      strength: Math.max(0, Math.min(1, Number(edge.strength ?? 0))),
    }))
    .filter((edge) => edge.from && edge.to);
}
