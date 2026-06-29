/**
 * APP-1:8 — Executive Prediction Engine.
 * Sole authority for canonical Executive Predictions — deterministic, read-only.
 */

import { getExecutiveTimeCameraPosition } from "./executiveTimeCameraEngine.ts";
import { resolveCurrentContext } from "./executiveTimeContextEngine.ts";
import { resolveEntityHistory } from "./executiveEventResolver.ts";
import { detectConflicts } from "./executiveConflictEngine.ts";
import { validateExecutivePredictionRequest } from "./executivePredictionAuthority.ts";
import type { ExecutivePredictionRequest } from "./executivePredictionAuthorityTypes.ts";
import { EXECUTIVE_PREDICTION_ENGINE_OWNER } from "./executivePredictionAuthorityTypes.ts";
import {
  buildExecutivePredictionExplanation,
  formatExecutivePredictionExplanation,
} from "./executivePredictionExplanation.ts";
import type {
  ExecutivePredictionContributingFactor,
  ExecutivePredictionEngineFutureIntegrations,
  ExecutivePredictionEvaluatedResult,
  ExecutivePredictionGenerationResult,
  ExecutivePredictionHorizonKey,
  ExecutivePredictionTemporalSignals,
} from "./executivePredictionEngineTypes.ts";
import { EXECUTIVE_PREDICTION_ENGINE_VERSION } from "./executivePredictionEngineTypes.ts";
import { evaluatePriority } from "./executiveTimePriorityEngine.ts";
import { resolveExecutiveTimeStateTemporalSnapshot } from "./executiveTimeStateEngine.ts";
import { getExecutiveTimeEntityCurrentState } from "./executiveTimeStateMutation.ts";
import { listPolicyNextStates } from "./executiveTimeTransitionPolicy.ts";
import { evaluateTransition } from "./executiveTimeTransitionEngine.ts";

export const EXECUTIVE_PREDICTION_ENGINE_FUTURE_INTEGRATIONS: ExecutivePredictionEngineFutureIntegrations = Object.freeze({
  dashboard: Object.freeze({ moduleId: "dashboard", consumerOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ moduleId: "assistant", consumerOnly: true, integrationImplemented: false }),
  recommendation: Object.freeze({ moduleId: "recommendation", consumerOnly: true, integrationImplemented: false }),
  scenario: Object.freeze({ moduleId: "scenario", publisherCapable: true, integrationImplemented: false }),
  executiveMemory: Object.freeze({ moduleId: "executive_memory", consumerOnly: true, integrationImplemented: false }),
  timeline: Object.freeze({ moduleId: "timeline", consumerOnly: true, integrationImplemented: false }),
  audit: Object.freeze({ moduleId: "audit", consumerOnly: true, integrationImplemented: false }),
  ds: Object.freeze({ moduleId: "ds", publisherCapable: true, integrationImplemented: false }),
  int: Object.freeze({ moduleId: "int", publisherCapable: true, integrationImplemented: false }),
  app: Object.freeze({ moduleId: "app", publisherCapable: true, integrationImplemented: false }),
  lay: Object.freeze({ moduleId: "lay", publisherCapable: true, integrationImplemented: false }),
});

const HORIZON_BY_TYPE: Readonly<Partial<Record<ExecutivePredictionRequest["predictionType"], ExecutivePredictionHorizonKey>>> =
  Object.freeze({
    temporal_state: "immediate",
    transition_outcome: "today",
    priority_shift: "short_term",
    conflict_detection: "immediate",
    dependency_forecast: "medium_term",
    future_state: "long_term",
    scenario_projection: "long_term",
    manual: "custom",
  });

const CATEGORY_BY_TYPE: Readonly<Partial<Record<ExecutivePredictionRequest["predictionType"], ExecutivePredictionEvaluatedResult["predictionCategory"]>>> =
  Object.freeze({
    temporal_state: "temporal",
    transition_outcome: "temporal",
    priority_shift: "temporal",
    conflict_detection: "conflict",
    dependency_forecast: "dependency",
    future_state: "future_state",
    scenario_projection: "scenario",
    manual: "platform",
  });

function resolveHorizon(request: ExecutivePredictionRequest): ExecutivePredictionHorizonKey {
  const override = request.metadata?.predictionHorizon;
  if (
    override === "immediate" ||
    override === "today" ||
    override === "short_term" ||
    override === "medium_term" ||
    override === "long_term" ||
    override === "custom"
  ) {
    return override;
  }
  return HORIZON_BY_TYPE[request.predictionType] ?? "short_term";
}

function gatherSignals(request: ExecutivePredictionRequest): ExecutivePredictionTemporalSignals {
  const workspaceId = request.workspaceId;
  const context = resolveCurrentContext({ workspaceId });
  const camera = getExecutiveTimeCameraPosition(workspaceId);
  const cameraContext = camera?.currentContext ?? String(request.currentCameraContext);
  const currentState =
    getExecutiveTimeEntityCurrentState({
      workspaceId,
      entityType: request.entityType,
      entityId: request.entityId,
      fallbackState: "draft",
    }) ?? "draft";

  const nextStates = listPolicyNextStates(request.entityType, currentState);
  const targetState = typeof request.metadata?.targetState === "string" ? request.metadata.targetState : nextStates[0];
  let transitionBlocked = false;
  let approvalRequired = false;
  if (targetState) {
    const transition = evaluateTransition({
      workspaceId,
      entityId: request.entityId,
      entityType: request.entityType,
      currentState,
      targetState,
      actor: request.requestedBy,
      transitionReason: request.predictionContext,
    });
    transitionBlocked = !transition.valid;
    approvalRequired = transition.approvalRequired;
  }

  const priority = evaluatePriority({
    workspaceId,
    entityId: request.entityId,
    entityType: request.entityType,
    currentState,
    actor: request.requestedBy,
    reason: request.predictionContext,
    targetState,
  });

  const events = resolveEntityHistory({
    workspaceId,
    entityType: request.entityType,
    entityId: request.entityId,
  });

  resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });

  return Object.freeze({
    workspaceId,
    entityType: request.entityType,
    entityId: request.entityId,
    currentState,
    contextId: context.id,
    cameraContext,
    contextDrift: cameraContext !== String(request.currentTimeContext),
    priorityLevel: priority.priority,
    priorityConfidence: priority.confidence,
    eventCount: events.length,
    targetState,
    transitionBlocked,
    approvalRequired,
  });
}

function buildFactors(signals: ExecutivePredictionTemporalSignals): readonly ExecutivePredictionContributingFactor[] {
  const factors: ExecutivePredictionContributingFactor[] = [
    Object.freeze({ factorId: "context", label: `Active context ${signals.contextId}.`, weight: 10 }),
    Object.freeze({ factorId: "state", label: `Current state ${signals.currentState}.`, weight: 15 }),
    Object.freeze({ factorId: "priority", label: `Priority ${signals.priorityLevel}.`, weight: 20 }),
  ];
  if (signals.contextDrift) {
    factors.push(Object.freeze({ factorId: "context_drift", label: "Context and camera differ.", weight: 25 }));
  }
  if (signals.transitionBlocked) {
    factors.push(Object.freeze({ factorId: "transition_blocked", label: "Transition path blocked.", weight: 30 }));
  }
  if (signals.eventCount > 0) {
    factors.push(Object.freeze({ factorId: "event_history", label: `${signals.eventCount} prior events.`, weight: 5 }));
  }
  return Object.freeze(factors);
}

function computeConfidence(factors: readonly ExecutivePredictionContributingFactor[], conflictCount: number): number {
  const weighted = factors.reduce((sum, factor) => sum + Math.abs(factor.weight), 0);
  const penalty = conflictCount * 0.08;
  return Math.round(Math.min(1, Math.max(0.35, 0.45 + weighted / 200 - penalty)) * 100) / 100;
}

export function generatePrediction(
  request: ExecutivePredictionRequest,
  options?: { priorRequestIds?: readonly string[] }
): ExecutivePredictionGenerationResult {
  const validation = validateExecutivePredictionRequest(request);
  if (!validation.valid || !validation.normalizedRequest) {
    return Object.freeze({
      success: false,
      reason: validation.messages[0] ?? "Prediction request rejected.",
      request: validation.normalizedRequest,
      prediction: null,
    });
  }

  const normalized = validation.normalizedRequest;
  const signals = gatherSignals(normalized);
  const conflicts = detectConflicts({
    request: normalized,
    signals,
    priorRequestIds: options?.priorRequestIds,
  });
  const factors = buildFactors(signals);
  const assumptions = Object.freeze([
    "Temporal signals are read-only snapshots.",
    "No ML or statistical forecasting applied.",
    `Evaluated under context ${signals.contextId}.`,
  ]);
  const warnings: string[] = [];
  if (conflicts.length > 0) warnings.push(`${conflicts.length} conflict(s) detected.`);
  if (signals.transitionBlocked) warnings.push("Transition path is blocked.");

  const explanationPayload = buildExecutivePredictionExplanation({
    predictionType: normalized.predictionType,
    entityType: normalized.entityType,
    entityId: normalized.entityId,
    horizon: resolveHorizon(normalized),
    signals,
    factors,
    assumptions,
    warnings,
    conflicts,
  });

  const prediction = Object.freeze({
    predictionId: `pred-${normalized.id}`,
    predictionCategory: CATEGORY_BY_TYPE[normalized.predictionType] ?? "platform",
    predictionHorizon: resolveHorizon(normalized),
    confidence: computeConfidence(factors, conflicts.length),
    assumptions,
    contributingFactors: factors,
    explanation: formatExecutivePredictionExplanation(explanationPayload),
    warnings: Object.freeze(warnings),
    conflicts,
    recommendationHints: Object.freeze(
      conflicts.length > 0
        ? conflicts.map((conflict) => conflict.suggestedResolution)
        : ["No immediate action required based on current temporal metadata."]
    ),
    dependencies: Object.freeze([
      "executive-time-context-engine",
      "executive-time-camera-engine",
      "executive-time-state-engine",
      "executive-time-transition-engine",
      "executive-time-priority-engine",
      "executive-event-engine",
    ]),
    metadata: Object.freeze({
      engineVersion: EXECUTIVE_PREDICTION_ENGINE_VERSION,
      engineOwner: EXECUTIVE_PREDICTION_ENGINE_OWNER,
      requestId: normalized.id,
      deterministic: true,
      signals,
    }),
  });

  return Object.freeze({
    success: true,
    reason: "Prediction generated deterministically.",
    request: normalized,
    prediction,
  });
}

export function generatePredictions(
  requests: readonly ExecutivePredictionRequest[]
): readonly ExecutivePredictionGenerationResult[] {
  const seenIds: string[] = [];
  return Object.freeze(
    requests.map((request) => {
      const result = generatePrediction(request, { priorRequestIds: Object.freeze([...seenIds]) });
      if (result.success) seenIds.push(request.id);
      return result;
    })
  );
}

export const ExecutivePredictionEngine = Object.freeze({
  generatePrediction,
  generatePredictions,
});
