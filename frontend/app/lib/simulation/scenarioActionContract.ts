import { normalizePropagationOverlay } from "./propagationOverlay";
import type {
  ScenarioActionContract,
  ScenarioActionIntent,
  ScenarioActionResponsePayload,
  DecisionPathResult,
  ScenarioOverlayPackage,
  DecisionPathNode,
  DecisionPathEdge,
} from "./scenarioActionTypes";

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

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readSimulationBranch(payload: Record<string, unknown>): Record<string, unknown> | null {
  return readRecord(payload.simulation);
}

function readDecisionPathCandidate(payload: Record<string, unknown>): Record<string, unknown> | null {
  const simulation = readSimulationBranch(payload);
  const candidate = simulation?.decision_path ?? payload.decision_path ?? null;
  return readRecord(candidate);
}

function readScenarioActionCandidate(payload: Record<string, unknown>): Partial<ScenarioActionContract> | null {
  const simulation = readSimulationBranch(payload);
  const candidate = simulation?.scenario_action ?? payload.scenario_action ?? null;
  return readRecord(candidate) as Partial<ScenarioActionContract> | null;
}

function readDecisionPathNodeRole(value: unknown): DecisionPathNode["role"] {
  const role = String(value ?? "context");
  if (
    role === "source" ||
    role === "impacted" ||
    role === "protected" ||
    role === "leverage" ||
    role === "bottleneck" ||
    role === "destination" ||
    role === "context"
  ) {
    return role;
  }
  return "context";
}

function readDecisionPathEdgeRole(value: unknown): DecisionPathEdge["path_role"] | undefined {
  if (
    value === "primary_path" ||
    value === "secondary_path" ||
    value === "tradeoff_path" ||
    value === "feedback_path"
  ) {
    return value;
  }
  return undefined;
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
  const raw = readRecord(payload);
  if (!raw) return null;
  const candidate = readDecisionPathCandidate(raw);
  if (!candidate) return null;

  const nodes = Array.isArray(candidate.nodes)
    ? candidate.nodes
        .map((node): DecisionPathNode | null => {
          const record = readRecord(node);
          if (!record) return null;
          const objectId = normalizeId(typeof record.object_id === "string" ? record.object_id : null);
          if (!objectId) return null;
          const direction =
            record.direction === "upstream" || record.direction === "downstream" || record.direction === "mixed"
              ? record.direction
              : undefined;
          return {
            object_id: objectId,
            role: readDecisionPathNodeRole(record.role),
            depth: Math.max(0, Number(record.depth ?? 0)),
            strength: clamp01(Number(record.strength ?? 0)),
            direction,
            rationale: typeof record.rationale === "string" ? record.rationale : null,
          };
        })
        .filter((node): node is DecisionPathNode => node !== null)
    : [];

  const edges = Array.isArray(candidate.edges)
    ? candidate.edges
        .map((edge): DecisionPathEdge | null => {
          const record = readRecord(edge);
          if (!record) return null;
          const fromId = normalizeId(typeof record.from_id === "string" ? record.from_id : null);
          const toId = normalizeId(typeof record.to_id === "string" ? record.to_id : null);
          if (!fromId || !toId) return null;
          return {
            from_id: fromId,
            to_id: toId,
            depth: Math.max(1, Number(record.depth ?? 1)),
            strength: clamp01(Number(record.strength ?? 0)),
            path_role: readDecisionPathEdgeRole(record.path_role),
          };
        })
        .filter((edge): edge is DecisionPathEdge => edge !== null)
    : [];

  const sourceObjectId = normalizeId(
    typeof candidate.source_object_id === "string" ? candidate.source_object_id : null
  );
  if (!sourceObjectId && nodes.length === 0 && edges.length === 0) return null;

  const metaRecord = readRecord(candidate.meta) ?? {};
  return {
    active: candidate.active !== false && (!!sourceObjectId || nodes.length > 0),
    source_object_id: sourceObjectId,
    nodes,
    edges,
    meta: {
      mode: typeof metaRecord.mode === "string" ? metaRecord.mode : undefined,
      interpretation: typeof metaRecord.interpretation === "string" ? metaRecord.interpretation : undefined,
      engine_version: typeof metaRecord.engine_version === "string" ? metaRecord.engine_version : undefined,
      action_id: typeof metaRecord.action_id === "string" ? metaRecord.action_id : undefined,
      action_kind: typeof metaRecord.action_kind === "string" ? metaRecord.action_kind : undefined,
    },
  };
}

export function normalizeScenarioActionResponsePayload(payload: unknown): ScenarioActionResponsePayload | null {
  const raw = readRecord(payload);
  if (!raw) return null;
  const propagation = normalizePropagationOverlay(payload);
  const decisionPath = normalizeDecisionPathResult(payload);
  const scenarioAction = normalizeScenarioActionContract(readScenarioActionCandidate(raw));
  const analysisRaw = readRecord(raw.analysis);
  const analysis =
    analysisRaw && (typeof analysisRaw.summary === "string" || Array.isArray(analysisRaw.advice))
      ? {
          summary: typeof analysisRaw.summary === "string" ? analysisRaw.summary : null,
          advice: Array.isArray(analysisRaw.advice)
            ? analysisRaw.advice
                .map((item) => {
                  const record = readRecord(item);
                  if (!record) return null;
                  const label =
                    typeof record.label === "string"
                      ? record.label
                      : typeof record.title === "string"
                      ? record.title
                      : "";
                  if (!label) return null;
                  return {
                    label,
                    rationale: typeof record.rationale === "string" ? record.rationale : null,
                  };
                })
                .filter((item): item is { label: string; rationale: string | null } => item !== null)
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
