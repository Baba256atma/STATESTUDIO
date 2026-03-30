import type { DecisionPathResult } from "./scenarioActionTypes";
import type {
  DecisionPathEdgeOverlay,
  DecisionPathNodeOverlay,
  DecisionPathOverlayState,
} from "./decisionPathOverlayTypes";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

const INACTIVE_OVERLAY: DecisionPathOverlayState = {
  active: false,
  sourceId: null,
  nodes: [],
  edges: [],
  emphasisMode: "decision_path",
  meta: {
    version: "decision_path_overlay_v1",
  },
};

export function mapDecisionPathResultToOverlay(
  result: DecisionPathResult | null | undefined
): DecisionPathOverlayState {
  if (!result?.active) return INACTIVE_OVERLAY;

  const nodeMap = new Map<string, DecisionPathNodeOverlay>();
  (result.nodes ?? []).forEach((node) => {
    const id = normalizeId(node?.object_id);
    if (!id) return;
    const nextNode: DecisionPathNodeOverlay = {
      id,
      role: node.role,
      depth: Math.max(0, Number(node.depth ?? 0)),
      strength: clamp01(Number(node.strength ?? 0)),
      direction:
        node.direction === "upstream" || node.direction === "downstream" || node.direction === "mixed"
          ? node.direction
          : undefined,
      label: typeof (node as any)?.label === "string" ? (node as any).label : null,
      rationale: typeof node.rationale === "string" ? node.rationale : null,
    };
    const existing = nodeMap.get(id);
    if (!existing || nextNode.strength > existing.strength) {
      nodeMap.set(id, nextNode);
    }
  });

  const validNodeIds = new Set(nodeMap.keys());
  const edgeMap = new Map<string, DecisionPathEdgeOverlay>();
  (result.edges ?? []).forEach((edge) => {
    const from = normalizeId(edge?.from_id);
    const to = normalizeId(edge?.to_id);
    if (!from || !to || !validNodeIds.has(from) || !validNodeIds.has(to)) return;
    const nextEdge: DecisionPathEdgeOverlay = {
      from,
      to,
      role:
        edge.path_role === "primary_path" ||
        edge.path_role === "secondary_path" ||
        edge.path_role === "feedback_path" ||
        edge.path_role === "tradeoff_path"
          ? edge.path_role === "feedback_path"
            ? "feedback"
            : edge.path_role === "tradeoff_path"
            ? "tradeoff"
            : edge.path_role
          : "supporting",
      depth: Math.max(1, Number(edge.depth ?? 1)),
      strength: clamp01(Number(edge.strength ?? 0)),
    };
    const key = `${from}::${to}`;
    const existing = edgeMap.get(key);
    if (!existing || nextEdge.strength > existing.strength) {
      edgeMap.set(key, nextEdge);
    }
  });

  const nodes = Array.from(nodeMap.values());
  const edges = Array.from(edgeMap.values());
  const sourceId =
    normalizeId(result.source_object_id) ??
    nodes.find((node) => node.role === "source" || node.role === "destination")?.id ??
    null;

  if (!sourceId && nodes.length === 0 && edges.length === 0) {
    return INACTIVE_OVERLAY;
  }

  return {
    active: nodes.length > 0 || edges.length > 0,
    sourceId,
    nodes,
    edges,
    emphasisMode: "decision_path",
    meta: {
      actionId: typeof result.meta?.action_id === "string" ? result.meta.action_id : undefined,
      mode: typeof result.meta?.mode === "string" ? result.meta.mode : undefined,
      version: "decision_path_overlay_v1",
    },
  };
}
