/**
 * APP-1:7.5 — Executive Prediction Authority Contract.
 * Request validation and result contracts only — no prediction execution.
 */

import type {
  ExecutivePredictionFutureIntegrations,
  ExecutivePredictionOwnershipRules,
  ExecutivePredictionReadOnlyDependencies,
  ExecutivePredictionRequest,
  ExecutivePredictionRequestResult,
  ExecutivePredictionResult,
  ExecutivePredictionValidationResult,
} from "./executivePredictionAuthorityTypes.ts";
import {
  EXECUTIVE_PREDICTION_AUTHORITY_OWNER,
  EXECUTIVE_PREDICTION_AUTHORITY_VERSION,
  EXECUTIVE_PREDICTION_ENGINE_OWNER,
  ExecutivePredictionExecutionDeferredError,
} from "./executivePredictionAuthorityTypes.ts";
import { validateExecutivePredictionConsumerInput } from "./executivePredictionConsumerContract.ts";
import {
  EXECUTIVE_PREDICTION_PUBLISHER_RULES,
  validateExecutivePredictionPublisherRequest,
} from "./executivePredictionRequestContract.ts";

export const EXECUTIVE_PREDICTION_TYPES = Object.freeze([
  "temporal_state",
  "transition_outcome",
  "priority_shift",
  "conflict_detection",
  "dependency_forecast",
  "future_state",
  "scenario_projection",
  "manual",
] as const);

export const EXECUTIVE_PREDICTION_CATEGORIES = Object.freeze([
  "temporal",
  "conflict",
  "dependency",
  "future_state",
  "scenario",
  "platform",
] as const);

export const EXECUTIVE_PREDICTION_HORIZONS = Object.freeze([
  "immediate",
  "short_term",
  "medium_term",
  "long_term",
  "unspecified",
] as const);

export const EXECUTIVE_PREDICTION_OWNERSHIP_RULES: ExecutivePredictionOwnershipRules = Object.freeze({
  authorityOwns: Object.freeze(["request_validation", "request_normalization", "prediction_identity", "prediction_contracts"]),
  engineOwns: Object.freeze(["prediction_generation", "conflict_analysis", "future_state_evaluation"]),
  publisherOwns: Object.freeze(["request_generation"]),
  consumerOwns: Object.freeze(["read_only_consumption"]),
});

export const EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES: ExecutivePredictionReadOnlyDependencies = Object.freeze({
  context: Object.freeze({
    moduleId: "executive-time-context-engine",
    operations: Object.freeze(["resolveCurrentContext"]),
    mutationPermitted: false,
  }),
  camera: Object.freeze({
    moduleId: "executive-time-camera-engine",
    operations: Object.freeze(["getExecutiveTimeCameraPosition"]),
    mutationPermitted: false,
  }),
  state: Object.freeze({
    moduleId: "executive-time-state-engine",
    operations: Object.freeze(["resolveExecutiveTimeStateTemporalSnapshot", "getExecutiveTimeEntityCurrentState"]),
    mutationPermitted: false,
  }),
  transition: Object.freeze({
    moduleId: "executive-time-transition-engine",
    operations: Object.freeze(["evaluateTransition", "resolveTransition"]),
    mutationPermitted: false,
  }),
  priority: Object.freeze({
    moduleId: "executive-time-priority-engine",
    operations: Object.freeze(["evaluatePriority"]),
    mutationPermitted: false,
  }),
  eventEngine: Object.freeze({
    moduleId: "executive-event-engine",
    operations: Object.freeze(["resolveLatestEvent", "resolveEntityHistory"]),
    mutationPermitted: false,
  }),
});

export const EXECUTIVE_PREDICTION_FUTURE_INTEGRATIONS: ExecutivePredictionFutureIntegrations = Object.freeze({
  dashboard: Object.freeze({ moduleId: "dashboard", consumerOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ moduleId: "assistant", consumerOnly: true, integrationImplemented: false }),
  recommendation: Object.freeze({ moduleId: "recommendation", consumerOnly: true, integrationImplemented: false }),
  scenario: Object.freeze({ moduleId: "scenario", publisherCapable: true, integrationImplemented: false }),
  executiveMemory: Object.freeze({ moduleId: "executive_memory", consumerOnly: true, integrationImplemented: false }),
  timeline: Object.freeze({ moduleId: "timeline", consumerOnly: true, integrationImplemented: false }),
  lay: Object.freeze({ moduleId: "lay", publisherCapable: true, integrationImplemented: false }),
  ds: Object.freeze({ moduleId: "ds", publisherCapable: true, integrationImplemented: false }),
  int: Object.freeze({ moduleId: "int", publisherCapable: true, integrationImplemented: false }),
});

function normalizeRequest(request: ExecutivePredictionRequest): ExecutivePredictionRequest {
  return Object.freeze({
    id: request.id.trim(),
    predictionType: request.predictionType,
    entityType: request.entityType,
    entityId: request.entityId.trim(),
    workspaceId: request.workspaceId.trim(),
    requestedBy: request.requestedBy.trim(),
    predictionContext: request.predictionContext.trim(),
    predictionScope: request.predictionScope,
    currentTimeContext: typeof request.currentTimeContext === "string" ? request.currentTimeContext.trim() : request.currentTimeContext,
    currentCameraContext: typeof request.currentCameraContext === "string" ? request.currentCameraContext.trim() : request.currentCameraContext,
    metadata: Object.freeze(request.metadata ?? {}),
  });
}

export function validateExecutivePredictionRequest(
  request: ExecutivePredictionRequest
): ExecutivePredictionValidationResult {
  const publisherValidation = validateExecutivePredictionPublisherRequest(request);
  const messages = [...publisherValidation.messages];
  if (!EXECUTIVE_PREDICTION_TYPES.includes(request.predictionType)) {
    messages.push(`Unknown predictionType "${request.predictionType}".`);
  }
  const valid = messages.length === 0;
  return Object.freeze({
    valid,
    messages: Object.freeze(messages),
    normalizedRequest: valid ? normalizeRequest(request) : null,
  });
}

/** Builds immutable result template for contract verification — not a prediction. */
export function buildExecutivePredictionResultContract(input: {
  predictionId: string;
  confidence?: number;
  predictionCategory?: ExecutivePredictionResult["predictionCategory"];
  predictionHorizon?: ExecutivePredictionResult["predictionHorizon"];
  explanation?: string;
  assumptions?: readonly string[];
  dependencies?: readonly string[];
  warnings?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}): ExecutivePredictionResult {
  const result = Object.freeze({
    predictionId: input.predictionId.trim(),
    confidence: input.confidence ?? 0,
    predictionCategory: input.predictionCategory ?? "platform",
    predictionHorizon: input.predictionHorizon ?? "unspecified",
    explanation: input.explanation ?? "Contract-only prediction result template.",
    assumptions: Object.freeze(input.assumptions ?? []),
    dependencies: Object.freeze(input.dependencies ?? []),
    warnings: Object.freeze(input.warnings ?? []),
    metadata: Object.freeze({
      contractOnly: true,
      authorityOwner: EXECUTIVE_PREDICTION_AUTHORITY_OWNER,
      engineOwner: EXECUTIVE_PREDICTION_ENGINE_OWNER,
      authorityVersion: EXECUTIVE_PREDICTION_AUTHORITY_VERSION,
      ...(input.metadata ?? {}),
    }),
  });
  const consumerValidation = validateExecutivePredictionConsumerInput(result);
  if (!consumerValidation.valid) {
    throw new Error(consumerValidation.messages[0] ?? "Invalid prediction result contract.");
  }
  return result;
}

export function requestPrediction(request: ExecutivePredictionRequest): ExecutivePredictionRequestResult {
  const validation = validateExecutivePredictionRequest(request);
  const normalized = validation.normalizedRequest ?? request;
  if (!validation.valid) {
    return Object.freeze({
      accepted: false,
      rejected: true,
      reason: validation.messages[0] ?? "Prediction request rejected.",
      request: normalized,
      result: null,
      publisherMayStore: false,
      publisherMayReplay: false,
    });
  }
  throw new ExecutivePredictionExecutionDeferredError();
}

export const ExecutivePredictionAuthority = Object.freeze({
  validateExecutivePredictionRequest,
  buildExecutivePredictionResultContract,
  requestPrediction,
});

export { EXECUTIVE_PREDICTION_PUBLISHER_RULES };
