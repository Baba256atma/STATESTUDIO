import { normalizePropagationOverlay } from "./propagationOverlay";
import { normalizeScenarioActionContract, normalizeScenarioActionResponsePayload } from "./scenarioActionContract";
import type { PropagationOverlayState } from "./propagationTypes";
import type {
  PropagationTriggerIntent,
  PropagationTriggerKind,
  PropagationTriggerResolution,
  ScenarioActionPropagationIntent,
} from "./propagationTriggerTypes";
import type { ScenarioActionContract } from "./scenarioActionTypes";

type ResolvePropagationTriggerParams = {
  selectedObjectId?: string | null;
  scannerPrimaryObjectId?: string | null;
  manualActionObjectId?: string | null;
  propagationPayload?: unknown;
  scenarioTrigger?: ScenarioActionPropagationIntent | null;
  allowPreviewFallback?: boolean;
  now?: number;
};

let lastPropagationCandidatesSignature: string | null = null;
let lastPropagationResolvedSignature: string | null = null;

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function triggerPriority(kind: PropagationTriggerKind): number {
  switch (kind) {
    case "scenario_action":
      return 600;
    case "chat_payload":
      return 500;
    case "scanner_primary":
      return 400;
    case "manual_action":
      return 300;
    case "selected_object":
      return 200;
    case "fallback_preview":
      return 100;
    default:
      return 0;
  }
}

function makeTrigger(params: {
  kind: PropagationTriggerKind;
  sourceObjectId: string | null;
  confidence: number;
  createdAt: number;
  payload?: PropagationOverlayState | null;
  scenarioAction?: ScenarioActionContract | null;
  routePolicy: "reuse_payload" | "request_backend" | "fallback_preview";
  modeHint?: "backend" | "preview" | "idle";
  reason: string;
}): PropagationTriggerIntent | null {
  if (!params.sourceObjectId && !params.payload?.source_object_id) return null;
  return {
    kind: params.kind,
    source_object_id: params.sourceObjectId ?? params.payload?.source_object_id ?? null,
    priority: triggerPriority(params.kind),
    confidence: params.confidence,
    created_at: params.createdAt,
    payload: params.payload ?? null,
    scenario_action: params.scenarioAction ?? null,
    route_policy: params.routePolicy,
    mode_hint: params.modeHint,
    reason: params.reason,
  };
}

export function resolvePropagationTrigger(
  params: ResolvePropagationTriggerParams
): PropagationTriggerResolution {
  const now = Number.isFinite(params.now) ? Number(params.now) : Date.now();
  const candidateTriggers: PropagationTriggerIntent[] = [];

  const scenarioContract = normalizeScenarioActionContract(params.scenarioTrigger);
  const scenarioPayload = normalizeScenarioActionResponsePayload(scenarioContract?.payload);
  const scenarioOverlay = scenarioPayload?.propagation ?? normalizePropagationOverlay(scenarioContract?.payload);
  const scenarioSourceId =
    normalizeId(scenarioContract?.intent?.source_object_id) ?? scenarioOverlay?.source_object_id ?? null;
  const scenarioRoutePolicy =
    scenarioOverlay
      ? "reuse_payload"
      : scenarioContract?.route_policy.request_backend !== false
      ? "request_backend"
      : scenarioContract?.route_policy.allow_preview_fallback === true
      ? "fallback_preview"
      : null;
  const scenarioTrigger = makeTrigger({
    kind: "scenario_action",
    sourceObjectId: scenarioSourceId,
    confidence: scenarioOverlay ? 1 : 0.96,
    createdAt: now,
    payload: scenarioOverlay,
    scenarioAction: scenarioContract,
    routePolicy: scenarioRoutePolicy ?? "request_backend",
    modeHint: scenarioOverlay ? "backend" : "idle",
    reason: scenarioOverlay
      ? "Scenario action provided propagation payload."
      : "Scenario action provided explicit propagation source.",
  });
  if (scenarioTrigger && scenarioRoutePolicy) candidateTriggers.push(scenarioTrigger);

  const chatScenarioPayload = normalizeScenarioActionResponsePayload(params.propagationPayload);
  const chatOverlay = chatScenarioPayload?.propagation ?? normalizePropagationOverlay(params.propagationPayload);
  const chatTrigger = makeTrigger({
    kind: "chat_payload",
    sourceObjectId: chatOverlay?.source_object_id ?? null,
    confidence: chatOverlay ? 0.94 : 0,
    createdAt: now,
    payload: chatOverlay,
    routePolicy: "reuse_payload",
    modeHint: chatOverlay ? "backend" : "idle",
    reason: "Existing backend response already includes propagation payload.",
  });
  if (chatTrigger) candidateTriggers.push(chatTrigger);

  const scannerPrimaryTrigger = makeTrigger({
    kind: "scanner_primary",
    sourceObjectId: normalizeId(params.scannerPrimaryObjectId),
    confidence: 0.82,
    createdAt: now,
    routePolicy: "request_backend",
    modeHint: "backend",
    reason: "Scanner resolved a stable primary target.",
  });
  if (scannerPrimaryTrigger) candidateTriggers.push(scannerPrimaryTrigger);

  const manualActionTrigger = makeTrigger({
    kind: "manual_action",
    sourceObjectId: normalizeId(params.manualActionObjectId),
    confidence: 0.76,
    createdAt: now,
    routePolicy: "request_backend",
    modeHint: "backend",
    reason: "Manual object action requested propagation.",
  });
  if (manualActionTrigger) candidateTriggers.push(manualActionTrigger);

  const selectedObjectTrigger = makeTrigger({
    kind: "selected_object",
    sourceObjectId: normalizeId(params.selectedObjectId),
    confidence: 0.58,
    createdAt: now,
    routePolicy: "request_backend",
    modeHint: "backend",
    reason: "Selected object can seed exploratory propagation.",
  });
  if (selectedObjectTrigger) candidateTriggers.push(selectedObjectTrigger);

  const sortedTriggers = candidateTriggers.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return b.created_at - a.created_at;
  });

  let activeTrigger: PropagationTriggerIntent | null = sortedTriggers[0] ?? null;
  let resolutionReason: string =
    activeTrigger?.reason ?? "No valid propagation trigger was available.";

  if (!activeTrigger && params.allowPreviewFallback) {
    const fallbackSourceId =
      normalizeId(params.selectedObjectId) ?? normalizeId(params.scannerPrimaryObjectId) ?? null;
    activeTrigger = makeTrigger({
      kind: "fallback_preview",
      sourceObjectId: fallbackSourceId,
      confidence: 0.3,
      createdAt: now,
      routePolicy: "fallback_preview",
      modeHint: "preview",
      reason: "No backend-capable trigger won; shallow preview fallback selected.",
    });
    if (activeTrigger) {
      sortedTriggers.push(activeTrigger);
      resolutionReason = activeTrigger.reason;
    }
  }

  const shouldReusePayload = activeTrigger?.route_policy === "reuse_payload" && !!activeTrigger.payload;
  const shouldRequestBackend = activeTrigger?.route_policy === "request_backend";
  const shouldFallbackPreview =
    activeTrigger?.route_policy === "fallback_preview" ||
    (!!activeTrigger && !shouldReusePayload && !shouldRequestBackend && !!params.allowPreviewFallback);

  if (process.env.NODE_ENV !== "production") {
    const candidatePayload = sortedTriggers.map((trigger) => ({
      kind: trigger.kind,
      sourceId: trigger.source_object_id,
      priority: trigger.priority,
      routePolicy: trigger.route_policy,
    }));
    const candidateSignature = JSON.stringify(candidatePayload);
    if (candidateSignature !== lastPropagationCandidatesSignature) {
      lastPropagationCandidatesSignature = candidateSignature;
      console.debug("[Nexora][PropagationTrigger] candidates", candidatePayload);
    }
    const resolvedPayload = {
      kind: activeTrigger?.kind ?? null,
      sourceId: activeTrigger?.source_object_id ?? null,
      resolutionReason,
      shouldReusePayload,
      shouldRequestBackend,
      shouldFallbackPreview,
    };
    const resolvedSignature = JSON.stringify(resolvedPayload);
    if (resolvedSignature !== lastPropagationResolvedSignature) {
      lastPropagationResolvedSignature = resolvedSignature;
      console.debug("[Nexora][PropagationTrigger] resolved", resolvedPayload);
    }
  }

  return {
    active_trigger: activeTrigger ?? null,
    candidate_triggers: sortedTriggers,
    resolution_reason: resolutionReason,
    should_request_backend: !!shouldRequestBackend,
    should_reuse_payload: !!shouldReusePayload,
    should_fallback_preview: !!shouldFallbackPreview,
  };
}
