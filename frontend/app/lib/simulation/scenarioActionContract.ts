import { normalizePropagationOverlay } from "./propagationOverlay";
import type { ScenarioActionContract, ScenarioActionIntent, ScenarioActionResponsePayload, DecisionPathResult, ScenarioOverlayPackage } from "./scenarioActionTypes";

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function buildScenarioActionIntent(
  input: Partial<ScenarioActionIntent> & { action_kind: ScenarioActionIntent["action_kind"] }
): ScenarioActionIntent | null {
  const sourceObjectId = normalizeId(input.source_object_id);
  const actionKind = String(input.action_kind ?? "").trim() as ScenarioActionIntent["action_kind"];
  if (!actionKind || !sourceObjectId) return null;
  const createdAt = Number.isFinite(input.created_at) ? Number(input.created_at) : Date.now();
  const actionId =
    normalizeId(input.action_id) ??
    `scenario:${actionKind}:${sourceObjectId}:${createdAt}`;
  return {
    action_id: actionId,
    action_kind: actionKind,
    source_object_id: sourceObjectId,
    target_object_ids: Array.isArray(input.target_object_ids)
      ? input.target_object_ids.map(String).filter(Boolean)
      : [],
    label: typeof input.label === "string" ? input.label : undefined,
    description: typeof input.description === "string" ? input.description : undefined,
    parameters: input.parameters && typeof input.parameters === "object" ? input.parameters : {},
    mode: input.mode ?? "what_if",
    requested_outputs:
      Array.isArray(input.requested_outputs) && input.requested_outputs.length > 0
        ? input.requested_outputs
        : ["propagation"],
    created_at: createdAt,
    priority: Number.isFinite(input.priority) ? Number(input.priority) : 100,
  };
}

export function normalizeScenarioActionContract(
  input: Partial<ScenarioActionContract> | null | undefined
): ScenarioActionContract | null {
  if (!input?.intent) return null;
  const intent = buildScenarioActionIntent(input.intent);
  if (!intent) return null;
  return {
    intent,
    route_policy: {
      reuse_payload_if_available: input.route_policy?.reuse_payload_if_available !== false,
      request_backend: input.route_policy?.request_backend !== false,
      allow_preview_fallback: input.route_policy?.allow_preview_fallback === true,
    },
    visualization_hints: {
      preferred_focus_object_id:
        normalizeId(input.visualization_hints?.preferred_focus_object_id ?? intent.source_object_id) ?? null,
      preserve_existing_scene: input.visualization_hints?.preserve_existing_scene !== false,
      emphasis_mode: input.visualization_hints?.emphasis_mode ?? "mixed",
    },
    metadata: {
      origin: input.metadata?.origin ?? "scenario_studio",
      version: input.metadata?.version ?? "scenario_action_v1",
    },
    payload: input.payload,
  };
}

export function normalizeDecisionPathResult(payload: unknown): DecisionPathResult | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  if (!raw) return null;
  const candidate =
    (raw.simulation as any)?.decision_path ??
    (raw.decision_path as any) ??
    null;
  if (!candidate || typeof candidate !== "object") return null;
  const nodes = Array.isArray((candidate as any).nodes)
    ? (candidate as any).nodes
        .map((node: any) => {
          const objectId = normalizeId(node?.object_id);
          if (!objectId) return null;
          return {
            object_id: objectId,
            role: (node?.role ?? "context") as DecisionPathResult["nodes"][number]["role"],
            depth: Math.max(0, Number(node?.depth ?? 0)),
            strength: clamp01(Number(node?.strength ?? 0)),
            direction:
              node?.direction === "upstream" || node?.direction === "downstream" || node?.direction === "mixed"
                ? node.direction
                : undefined,
            rationale: typeof node?.rationale === "string" ? node.rationale : null,
          };
        })
        .filter(Boolean)
    : [];
  const edges = Array.isArray((candidate as any).edges)
    ? (candidate as any).edges
        .map((edge: any) => {
          const fromId = normalizeId(edge?.from_id);
          const toId = normalizeId(edge?.to_id);
          if (!fromId || !toId) return null;
          return {
            from_id: fromId,
            to_id: toId,
            depth: Math.max(1, Number(edge?.depth ?? 1)),
            strength: clamp01(Number(edge?.strength ?? 0)),
            path_role:
              edge?.path_role === "primary_path" ||
              edge?.path_role === "secondary_path" ||
              edge?.path_role === "tradeoff_path" ||
              edge?.path_role === "feedback_path"
                ? edge.path_role
                : undefined,
          };
        })
        .filter(Boolean)
    : [];
  const sourceObjectId = normalizeId((candidate as any).source_object_id);
  if (!sourceObjectId && nodes.length === 0 && edges.length === 0) return null;
  return {
    active: (candidate as any).active !== false && (!!sourceObjectId || nodes.length > 0),
    source_object_id: sourceObjectId,
    nodes: nodes as DecisionPathResult["nodes"],
    edges: edges as DecisionPathResult["edges"],
    meta: {
      mode: typeof (candidate as any)?.meta?.mode === "string" ? (candidate as any).meta.mode : undefined,
      interpretation:
        typeof (candidate as any)?.meta?.interpretation === "string"
          ? (candidate as any).meta.interpretation
          : undefined,
      engine_version:
        typeof (candidate as any)?.meta?.engine_version === "string"
          ? (candidate as any).meta.engine_version
          : undefined,
      action_id:
        typeof (candidate as any)?.meta?.action_id === "string"
          ? (candidate as any).meta.action_id
          : undefined,
      action_kind:
        typeof (candidate as any)?.meta?.action_kind === "string"
          ? (candidate as any).meta.action_kind
          : undefined,
    },
  };
}

export function normalizeScenarioActionResponsePayload(payload: unknown): ScenarioActionResponsePayload | null {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  if (!raw) return null;
  const propagation = normalizePropagationOverlay(payload);
  const decisionPath = normalizeDecisionPathResult(payload);
  const scenarioAction = normalizeScenarioActionContract(
    ((raw.simulation as any)?.scenario_action ?? raw.scenario_action ?? null) as Partial<ScenarioActionContract> | null
  );
  const analysisRaw = ((raw.analysis as any) ?? null) as Record<string, unknown> | null;
  const analysis =
    analysisRaw && (typeof analysisRaw.summary === "string" || Array.isArray(analysisRaw.advice))
      ? {
          summary: typeof analysisRaw.summary === "string" ? analysisRaw.summary : null,
          advice: Array.isArray(analysisRaw.advice)
            ? analysisRaw.advice
                .map((item: any) => ({
                  label: typeof item?.label === "string" ? item.label : typeof item?.title === "string" ? item.title : "",
                  rationale: typeof item?.rationale === "string" ? item.rationale : null,
                }))
                .filter((item) => item.label)
            : [],
        }
      : null;
  if (!propagation && !decisionPath && !scenarioAction && !analysis) return null;
  return {
    scenario_action: scenarioAction,
    propagation,
    decisionPath,
    analysis,
  };
}

export function buildScenarioOverlayPackage(
  payload: ScenarioActionResponsePayload | null,
  fallbackPropagation: import("./propagationTypes").PropagationOverlayState | null
): ScenarioOverlayPackage {
  const propagation = payload?.propagation ?? fallbackPropagation ?? null;
  const decisionPath = payload?.decisionPath ?? null;
  const sourceAction = payload?.scenario_action ?? null;
  const mode =
    propagation && decisionPath
      ? "mixed"
      : decisionPath
      ? "decision_path"
      : propagation
      ? "propagation"
      : "idle";
  return {
    propagation,
    decisionPath,
    sourceAction,
    mode,
  };
}
