import { normalizeScenarioActionContract } from "../simulation/scenarioActionContract";
import { normalizeScenarioActionResponsePayload } from "../simulation/scenarioActionContract";
import { resolveScannerPrimarySource } from "../simulation/propagationOverlay";
import type { SceneJson } from "../sceneTypes";
import type { ScenarioActionContract, ScenarioActionKind, ScenarioRequestedOutput } from "../simulation/scenarioActionTypes";
import type {
  ManualTriggerInput,
  Scenario,
  ScenarioAction,
  UnifiedTriggerInput,
  WarRoomActionKind,
  WarRoomDraftState,
  WarRoomOutputMode,
} from "./warRoomTypes";

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function clamp01(value: number, fallback = 0.6): number {
  if (!Number.isFinite(value)) return fallback;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function mapWarRoomActionKindToScenarioActionKind(
  actionType: WarRoomActionKind,
  outputMode: WarRoomOutputMode
): ScenarioActionKind {
  if (outputMode === "decision_path") return "decision_path_request";
  if (outputMode === "mixed") return "strategy_apply";
  switch (actionType) {
    case "stress":
      return "stress_increase";
    case "stabilize":
      return "stress_reduce";
    case "redistribute":
      return "strategy_apply";
    case "optimize":
    default:
      return "propagation_request";
  }
}

function mapRequestedOutputs(outputMode: WarRoomOutputMode): ScenarioRequestedOutput[] {
  if (outputMode === "decision_path") return ["decision_path"];
  if (outputMode === "mixed") return ["propagation", "decision_path"];
  return ["propagation"];
}

function defaultObjective(actionType: WarRoomActionKind, targetId: string): string {
  switch (actionType) {
    case "optimize":
      return `Optimize throughput around ${targetId}`;
    case "redistribute":
      return `Redistribute pressure around ${targetId}`;
    case "stabilize":
      return `Stabilize ${targetId} and protect downstream context`;
    case "stress":
    default:
      return `Trace consequence pressure from ${targetId}`;
  }
}

function scenarioTitle(action: ScenarioAction): string {
  const verb =
    action.type === "optimize"
      ? "Optimize"
      : action.type === "redistribute"
      ? "Redistribute"
      : action.type === "stabilize"
      ? "Stabilize"
      : "Stress";
  return `${verb} ${action.targetId}`;
}

function mapScenarioOriginToContractOrigin(origin: Scenario["origin"]): "war_room" | "scenario_studio" | "manual_action" {
  if (origin === "manual") return "manual_action";
  return "war_room";
}

export function resolveUnifiedTrigger(input: UnifiedTriggerInput): ScenarioAction | null {
  if (input.kind === "manual") {
    const manual = input as ManualTriggerInput;
    const targetId = normalizeId(manual.targetId);
    if (!targetId) return null;
    return {
      type: manual.actionType ?? "stress",
      targetId,
      intensity: clamp01(manual.intensity ?? 0.6),
      context: manual.context ?? {},
    };
  }

  if (input.kind === "scanner") {
    const payload = input.payload as any;
    const targetId =
      normalizeId(input.targetId) ??
      normalizeId(payload?.scanner_primary_target_id) ??
      normalizeId(payload?.scanner_primary?.id) ??
      null;
    if (!targetId) return null;
    const intensity = clamp01(
      Number(payload?.fragility_score ?? payload?.fragility_scan?.fragility_score ?? 0.66),
      0.66
    );
    return {
      type: "stabilize",
      targetId,
      intensity,
      context: {
        source: "scanner",
      },
    };
  }

  const payload = normalizeScenarioActionResponsePayload(input.payload);
  const contract = normalizeScenarioActionContract(payload?.scenario_action ?? null);
  const targetId =
    normalizeId(contract?.intent.source_object_id) ??
    normalizeId(payload?.propagation?.source_object_id) ??
    normalizeId(input.selectedObjectId) ??
    null;
  if (!targetId) return null;

  const existingKind = String(contract?.intent.action_kind ?? "").trim();
  const mappedType: WarRoomActionKind =
    existingKind === "stress_reduce"
      ? "stabilize"
      : existingKind === "strategy_apply"
      ? "optimize"
      : existingKind === "decision_path_request"
      ? "optimize"
      : existingKind === "propagation_request"
      ? "redistribute"
      : "stress";
  const impacted = Array.isArray(payload?.propagation?.impacted_nodes) ? payload!.propagation!.impacted_nodes : [];
  const strongestNode = impacted.find((node) => node.object_id === targetId) ?? impacted[0] ?? null;
  return {
    type: mappedType,
    targetId,
    intensity: clamp01(Number(strongestNode?.strength ?? 0.62), 0.62),
    context: {
      source: "chat",
      message: input.message ?? null,
      existing_action_id: contract?.intent.action_id ?? null,
    },
  };
}

export function buildScenarioFromAction(params: {
  action: ScenarioAction;
  outputMode: WarRoomOutputMode;
  label?: string | null;
  description?: string | null;
  targetObjectIds?: string[];
  parameters?: Record<string, unknown>;
  origin?: Scenario["origin"];
  actionId?: string | null;
  createdAt?: number;
}): Scenario {
  const createdAt = Number.isFinite(params.createdAt) ? Number(params.createdAt) : Date.now();
  const outputMode = params.outputMode;
  const scenarioId =
    normalizeId(params.actionId) ??
    `scenario:${params.origin ?? "composer"}:${params.action.type}:${params.action.targetId}:${outputMode}`;
  const intensity = clamp01(params.action.intensity, 0.6);
  const spreadModel = outputMode === "decision_path" ? "linear" : outputMode === "mixed" ? "exponential" : "linear";
  const title = String(params.label ?? "").trim() || scenarioTitle(params.action);
  const description = String(params.description ?? "").trim();
  const contract = normalizeScenarioActionContract({
    intent: {
      action_id: scenarioId,
      action_kind: mapWarRoomActionKindToScenarioActionKind(params.action.type, outputMode),
      source_object_id: params.action.targetId,
      target_object_ids: Array.isArray(params.targetObjectIds) ? params.targetObjectIds : [],
      label: title,
      description: description || undefined,
      parameters: {
        ...(params.parameters ?? {}),
        intensity,
        normalized_action_type: params.action.type,
        ...(params.action.context ?? {}),
      },
      mode: outputMode === "decision_path" ? "decision_path" : outputMode === "mixed" ? "what_if" : "preview",
      requested_outputs: mapRequestedOutputs(outputMode),
      created_at: createdAt,
      priority: 700,
    },
    route_policy: {
      reuse_payload_if_available: true,
      request_backend: true,
      allow_preview_fallback: outputMode !== "decision_path",
    },
    visualization_hints: {
      preferred_focus_object_id: params.action.targetId,
      preserve_existing_scene: true,
      emphasis_mode: outputMode === "mixed" ? "mixed" : outputMode,
    },
      metadata: {
      origin: mapScenarioOriginToContractOrigin(params.origin ?? "composer"),
      version: "scenario_action_v1",
    },
  })!;

  return {
    id: scenarioId,
    title,
    trigger: params.action,
    propagationConfig: {
      depth: outputMode === "decision_path" ? 1 : intensity >= 0.75 ? 3 : 2,
      decay: spreadModel === "exponential" ? 0.68 : 0.76,
      spreadModel,
    },
    decisionConfig: {
      objective: defaultObjective(params.action.type, params.action.targetId),
      constraints: description ? [description] : [],
      horizon: outputMode === "decision_path" ? 3 : outputMode === "mixed" ? 4 : 2,
    },
    origin: params.origin ?? "composer",
    outputMode,
    contract,
    createdAt,
  };
}

export function buildScenarioFromDraft(draft: WarRoomDraftState): Scenario | null {
  const targetId = normalizeId(draft.selectedObjectId);
  if (!targetId || !draft.actionKind) return null;
  return buildScenarioFromAction({
    action: {
      type: draft.actionKind,
      targetId,
      intensity: clamp01(Number(draft.parameters?.intensity ?? 0.6), 0.6),
      context: draft.parameters,
    },
    outputMode: draft.outputMode,
    label: draft.label,
    description: draft.description,
    targetObjectIds: draft.targetObjectIds,
    parameters: draft.parameters,
    origin: "composer",
  });
}

export function buildScenarioFromChatPayload(params: {
  payload: unknown;
  selectedObjectId?: string | null;
}): Scenario | null {
  const action = resolveUnifiedTrigger({
    kind: "chat",
    payload: params.payload,
    selectedObjectId: params.selectedObjectId ?? null,
  });
  if (!action) return null;
  const payload = normalizeScenarioActionResponsePayload(params.payload);
  const contract = normalizeScenarioActionContract(payload?.scenario_action ?? null);
  return buildScenarioFromAction({
    action,
    outputMode:
      payload?.propagation?.active && payload?.decisionPath?.active
        ? "mixed"
        : payload?.decisionPath?.active
        ? "decision_path"
        : "propagation",
    label: contract?.intent.label,
    description: contract?.intent.description,
    parameters: contract?.intent.parameters,
    origin: "chat",
    actionId: contract?.intent.action_id ?? null,
    createdAt: contract?.intent.created_at ?? Date.now(),
  });
}

export function buildScenarioFromScanner(params: {
  sceneJson: SceneJson | null;
  payload?: unknown;
}): Scenario | null {
  const targetId = resolveScannerPrimarySource(params.sceneJson) ?? null;
  const action = resolveUnifiedTrigger({
    kind: "scanner",
    targetId,
    payload: params.payload,
  });
  if (!action) return null;
  return buildScenarioFromAction({
    action,
    outputMode: "propagation",
    label: `Stabilize ${action.targetId}`,
    description: "Scanner-derived scenario from the current decision center.",
    origin: "scanner",
  });
}
