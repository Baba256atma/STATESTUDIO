import type { StrategicCouncilResult } from "../council/strategicCouncilTypes";
import type {
  DecisionPathEdge,
  DecisionPathNode,
  DecisionPathResult,
  ScenarioActionContract,
} from "../simulation/scenarioActionTypes";
import type { PropagationOverlayState } from "../simulation/propagationTypes";
import type {
  DecisionImpactEdge,
  DecisionImpactEdgeRole,
  DecisionImpactNode,
  DecisionImpactNodeRole,
  DecisionImpactState,
  DecisionImpactSummary,
} from "./decisionImpactTypes";

type DecisionImpactMapperInput = {
  propagation?: PropagationOverlayState | null;
  decisionPath?: DecisionPathResult | null;
  strategicAdvice?: any | null;
  strategicCouncil?: StrategicCouncilResult | null;
  scenarioAction?: ScenarioActionContract | null;
  sceneJson?: any | null;
  source?: string;
};

type ImpactSelection = {
  highlighted_objects: string[];
  risk_sources: string[];
  risk_targets: string[];
  dim_unrelated_objects: boolean;
};

const VERSION = "decision_impact_v1";

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function rolePriority(role: DecisionImpactNodeRole) {
  switch (role) {
    case "source":
      return 6;
    case "primary_effect":
      return 5;
    case "downstream_risk":
      return 4;
    case "stabilizer":
      return 3;
    case "secondary_effect":
      return 2;
    default:
      return 1;
  }
}

function edgePriority(role: DecisionImpactEdgeRole) {
  switch (role) {
    case "impact_path":
      return 4;
    case "risk_path":
      return 3;
    case "tradeoff_path":
      return 2;
    default:
      return 1;
  }
}

function mapPropagationRole(node: { role?: string; depth?: number }): DecisionImpactNodeRole {
  if (node.role === "source" || Number(node.depth ?? 0) <= 0) return "source";
  if (Number(node.depth ?? 1) <= 1) return "primary_effect";
  return "downstream_risk";
}

function mapDecisionRole(role?: string): DecisionImpactNodeRole {
  switch (role) {
    case "source":
      return "source";
    case "leverage":
    case "protected":
      return "stabilizer";
    case "bottleneck":
      return "downstream_risk";
    case "impacted":
      return "primary_effect";
    case "destination":
      return "secondary_effect";
    default:
      return "context";
  }
}

function mapDecisionEdgeRole(role?: string): DecisionImpactEdgeRole {
  switch (role) {
    case "tradeoff_path":
      return "tradeoff_path";
    case "feedback_path":
      return "risk_path";
    case "supporting":
      return "stabilizing_path";
    default:
      return "impact_path";
  }
}

function addNode(
  map: Map<string, DecisionImpactNode>,
  next: DecisionImpactNode,
  sceneObjectIds: Set<string>
) {
  const id = String(next.object_id ?? "").trim();
  if (!id || (sceneObjectIds.size > 0 && !sceneObjectIds.has(id))) return;
  const normalized: DecisionImpactNode = {
    ...next,
    object_id: id,
    strength: clamp01(next.strength),
    depth: Math.max(0, Number(next.depth ?? 0)),
  };
  const existing = map.get(id);
  if (!existing) {
    map.set(id, normalized);
    return;
  }
  const preferredRole =
    rolePriority(normalized.role) > rolePriority(existing.role) ? normalized.role : existing.role;
  map.set(id, {
    object_id: id,
    role: preferredRole,
    strength: Math.max(existing.strength, normalized.strength),
    depth: Math.min(existing.depth, normalized.depth),
    direction: normalized.direction ?? existing.direction,
    rationale: existing.rationale ?? normalized.rationale ?? null,
  });
}

function addEdge(
  map: Map<string, DecisionImpactEdge>,
  next: DecisionImpactEdge,
  sceneObjectIds: Set<string>
) {
  const from = String(next.from_id ?? "").trim();
  const to = String(next.to_id ?? "").trim();
  if (!from || !to) return;
  if (sceneObjectIds.size > 0 && (!sceneObjectIds.has(from) || !sceneObjectIds.has(to))) return;
  const key = `${from}::${to}`;
  const normalized: DecisionImpactEdge = {
    ...next,
    from_id: from,
    to_id: to,
    strength: clamp01(next.strength),
    depth: Math.max(0, Number(next.depth ?? 0)),
  };
  const existing = map.get(key);
  if (!existing) {
    map.set(key, normalized);
    return;
  }
  const preferredRole =
    edgePriority(normalized.role) > edgePriority(existing.role) ? normalized.role : existing.role;
  map.set(key, {
    from_id: from,
    to_id: to,
    strength: Math.max(existing.strength, normalized.strength),
    depth: Math.min(existing.depth, normalized.depth),
    role: preferredRole,
  });
}

function getActionLabel(input: DecisionImpactMapperInput) {
  const advicePrimary = String(input.strategicAdvice?.primary_recommendation?.action ?? "").trim();
  if (advicePrimary) return advicePrimary;
  const adviceFirst = String(input.strategicAdvice?.recommended_actions?.[0]?.action ?? "").trim();
  if (adviceFirst) return adviceFirst;
  const councilAction = String(input.strategicCouncil?.synthesis?.top_actions?.[0] ?? "").trim();
  if (councilAction) return councilAction;
  const councilDirection = String(input.strategicCouncil?.synthesis?.recommended_direction ?? "").trim();
  if (councilDirection) return councilDirection;
  const scenarioLabel = String(input.scenarioAction?.intent?.label ?? "").trim();
  if (scenarioLabel) return scenarioLabel;
  return null;
}

function getConfidence(input: DecisionImpactMapperInput) {
  return clamp01(
    Number(
      input.strategicCouncil?.synthesis?.confidence ??
        input.strategicAdvice?.confidence ??
        input.sceneJson?.decision_impact?.meta?.confidence ??
        0.62
    )
  );
}

export function mapDecisionImpact(input: DecisionImpactMapperInput): DecisionImpactState | null {
  const sceneObjects = Array.isArray(input.sceneJson?.scene?.objects) ? input.sceneJson.scene.objects : [];
  const sceneObjectIds = new Set<string>(
    sceneObjects.map((item: any, index: number) => String(item?.id ?? item?.name ?? `obj_${index}`)).filter(Boolean)
  );
  const nodeMap = new Map<string, DecisionImpactNode>();
  const edgeMap = new Map<string, DecisionImpactEdge>();

  (input.propagation?.impacted_nodes ?? []).forEach((node) => {
    addNode(
      nodeMap,
      {
        object_id: String(node?.object_id ?? ""),
        role: mapPropagationRole(node),
        strength: Number(node?.strength ?? 0),
        depth: Number(node?.depth ?? 0),
        direction: "downstream",
        rationale: null,
      },
      sceneObjectIds
    );
  });

  (input.decisionPath?.nodes ?? []).forEach((node: DecisionPathNode) => {
    addNode(
      nodeMap,
      {
        object_id: String(node?.object_id ?? ""),
        role: mapDecisionRole(node?.role),
        strength: Number(node?.strength ?? 0),
        depth: Number(node?.depth ?? 0),
        direction: node?.direction,
        rationale: typeof node?.rationale === "string" ? node.rationale : null,
      },
      sceneObjectIds
    );
  });

  (input.propagation?.impacted_edges ?? []).forEach((edge) => {
    addEdge(
      edgeMap,
      {
        from_id: String(edge?.from ?? ""),
        to_id: String(edge?.to ?? ""),
        strength: Number(edge?.strength ?? 0),
        depth: Number(edge?.depth ?? 0),
        role: Number(edge?.depth ?? 0) <= 1 ? "impact_path" : "risk_path",
      },
      sceneObjectIds
    );
  });

  (input.decisionPath?.edges ?? []).forEach((edge: DecisionPathEdge) => {
    addEdge(
      edgeMap,
      {
        from_id: String(edge?.from_id ?? ""),
        to_id: String(edge?.to_id ?? ""),
        strength: Number(edge?.strength ?? 0),
        depth: Number(edge?.depth ?? 0),
        role: mapDecisionEdgeRole(edge?.path_role),
      },
      sceneObjectIds
    );
  });

  const nodes = Array.from(nodeMap.values()).sort((a, b) => b.strength - a.strength || a.depth - b.depth);
  const edges = Array.from(edgeMap.values()).sort((a, b) => b.strength - a.strength || a.depth - b.depth);
  const sourceObjectId =
    String(input.propagation?.source_object_id ?? input.decisionPath?.source_object_id ?? input.scenarioAction?.intent?.source_object_id ?? "").trim() ||
    nodes.find((node) => node.role === "source")?.object_id ||
    null;

  if (!sourceObjectId && nodes.length === 0 && edges.length === 0) {
    return null;
  }

  return {
    active: nodes.length > 0 || edges.length > 0,
    source_object_id: sourceObjectId,
    action_label: getActionLabel(input),
    nodes,
    edges,
    mode: "impact",
    meta: {
      version: VERSION,
      source: input.source ?? "frontend_composed",
      confidence: getConfidence(input),
      timestamp: Date.now(),
    },
  };
}

export function buildDecisionImpactSelection(impact: DecisionImpactState | null): ImpactSelection | null {
  if (!impact?.active) return null;
  const rankedNodes = [...impact.nodes].sort((a, b) => {
    const roleDelta = rolePriority(b.role) - rolePriority(a.role);
    if (roleDelta !== 0) return roleDelta;
    return b.strength - a.strength || a.depth - b.depth;
  });
  const sourceNode = impact.source_object_id
    ? rankedNodes.find((node) => node.object_id === impact.source_object_id) ?? null
    : rankedNodes.find((node) => node.role === "source") ?? null;
  const strongestEffects = rankedNodes
    .filter((node) => node.object_id !== sourceNode?.object_id && node.role !== "context")
    .slice(0, 3);
  const highlighted_objects = Array.from(
    new Set(
      [sourceNode?.object_id, ...strongestEffects.map((node) => node.object_id)].filter(
        (value): value is string => typeof value === "string" && value.length > 0
      )
    )
  );
  const risk_sources = rankedNodes
    .filter((node) => node.role === "source" || node.role === "stabilizer")
    .slice(0, 2)
    .map((node) => node.object_id);
  const risk_targets = rankedNodes
    .filter((node) => node.role === "primary_effect" || node.role === "secondary_effect" || node.role === "downstream_risk")
    .slice(0, 4)
    .map((node) => node.object_id);
  return {
    highlighted_objects,
    risk_sources,
    risk_targets,
    dim_unrelated_objects: highlighted_objects.length > 0,
  };
}

export function summarizeDecisionImpact(impact: DecisionImpactState | null): DecisionImpactSummary | null {
  if (!impact?.active) return null;
  const sourceId = impact.source_object_id;
  const topAffected = impact.nodes
    .filter((node) => node.role !== "context" && node.object_id !== sourceId)
    .slice(0, 3)
    .map((node) => node.object_id);
  const strongestDownstream =
    impact.nodes.find((node) => node.role === "downstream_risk")?.object_id ??
    impact.nodes.find((node) => node.role === "secondary_effect")?.object_id ??
    null;
  const strongestPath = impact.edges[0] ? `${impact.edges[0].from_id} -> ${impact.edges[0].to_id}` : null;
  const summary =
    strongestDownstream && sourceId
      ? `Decision force is spreading from ${sourceId} into ${strongestDownstream}.`
      : sourceId
      ? `Decision force is concentrated around ${sourceId}.`
      : "Decision impact is active across connected objects.";
  return {
    title: impact.action_label ?? "Decision Impact",
    summary,
    topAffectedObjectIds: topAffected,
    strongestDownstreamObjectId: strongestDownstream,
    strongestPathLabel: strongestPath,
    actionLabel: impact.action_label ?? null,
    confidence: impact.meta.confidence,
  };
}
