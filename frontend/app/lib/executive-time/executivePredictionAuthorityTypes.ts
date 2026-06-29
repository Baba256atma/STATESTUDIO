/**
 * APP-1:7.5 — Executive Prediction Authority types.
 * Contract-only separation — no prediction execution, ML, or forecasting.
 */

import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeContextKey } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_PREDICTION_AUTHORITY_VERSION = "APP-1/7.5" as const;

export const EXECUTIVE_PREDICTION_AUTHORITY_OWNER = "executive-prediction-authority" as const;

export const EXECUTIVE_PREDICTION_ENGINE_OWNER = "executive-prediction-engine" as const;

export const EXECUTIVE_PREDICTION_PUBLISHER_OWNER = "executive-prediction-publisher" as const;

export const EXECUTIVE_PREDICTION_CONSUMER_OWNER = "executive-prediction-consumer" as const;

export type ExecutivePredictionType =
  | "temporal_state"
  | "transition_outcome"
  | "priority_shift"
  | "conflict_detection"
  | "dependency_forecast"
  | "future_state"
  | "scenario_projection"
  | "manual";

export type ExecutivePredictionCategory =
  | "temporal"
  | "conflict"
  | "dependency"
  | "future_state"
  | "scenario"
  | "platform";

export type ExecutivePredictionHorizon =
  | "immediate"
  | "short_term"
  | "medium_term"
  | "long_term"
  | "unspecified";

export type ExecutivePredictionScope =
  | "entity"
  | "workspace"
  | "relationship"
  | "platform";

export type ExecutivePredictionRequest = Readonly<{
  id: string;
  predictionType: ExecutivePredictionType;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  workspaceId: string;
  requestedBy: string;
  predictionContext: string;
  predictionScope: ExecutivePredictionScope;
  currentTimeContext: ExecutiveTimeContextKey | string;
  currentCameraContext: ExecutiveTimeContextKey | string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutivePredictionResult = Readonly<{
  predictionId: string;
  confidence: number;
  predictionCategory: ExecutivePredictionCategory;
  predictionHorizon: ExecutivePredictionHorizon;
  explanation: string;
  assumptions: readonly string[];
  dependencies: readonly string[];
  warnings: readonly string[];
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutivePredictionValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
  normalizedRequest: ExecutivePredictionRequest | null;
}>;

export type ExecutivePredictionRequestResult = Readonly<{
  accepted: boolean;
  rejected: boolean;
  reason: string;
  request: ExecutivePredictionRequest;
  result: ExecutivePredictionResult | null;
  publisherMayStore: false;
  publisherMayReplay: false;
}>;

export type ExecutivePredictionOwnershipRules = Readonly<{
  authorityOwns: readonly string[];
  engineOwns: readonly string[];
  publisherOwns: readonly string[];
  consumerOwns: readonly string[];
}>;

export type ExecutivePredictionReadOnlyDependency = Readonly<{
  moduleId: string;
  operations: readonly string[];
  mutationPermitted: false;
}>;

export type ExecutivePredictionReadOnlyDependencies = Readonly<{
  context: ExecutivePredictionReadOnlyDependency;
  camera: ExecutivePredictionReadOnlyDependency;
  state: ExecutivePredictionReadOnlyDependency;
  transition: ExecutivePredictionReadOnlyDependency;
  priority: ExecutivePredictionReadOnlyDependency;
  eventEngine: ExecutivePredictionReadOnlyDependency;
}>;

export type ExecutivePredictionFutureIntegrations = Readonly<{
  dashboard: Readonly<{ moduleId: "dashboard"; consumerOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ moduleId: "assistant"; consumerOnly: true; integrationImplemented: false }>;
  recommendation: Readonly<{ moduleId: "recommendation"; consumerOnly: true; integrationImplemented: false }>;
  scenario: Readonly<{ moduleId: "scenario"; publisherCapable: true; integrationImplemented: false }>;
  executiveMemory: Readonly<{ moduleId: "executive_memory"; consumerOnly: true; integrationImplemented: false }>;
  timeline: Readonly<{ moduleId: "timeline"; consumerOnly: true; integrationImplemented: false }>;
  lay: Readonly<{ moduleId: "lay"; publisherCapable: true; integrationImplemented: false }>;
  ds: Readonly<{ moduleId: "ds"; publisherCapable: true; integrationImplemented: false }>;
  int: Readonly<{ moduleId: "int"; publisherCapable: true; integrationImplemented: false }>;
}>;

export type ExecutivePredictionAuthorityCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ExecutiveTimeCertificationCheck[];
  passedChecks: readonly ExecutiveTimeCertificationCheck[];
  failedChecks: readonly ExecutiveTimeCertificationCheck[];
  warnings: readonly string[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
}>;

export class ExecutivePredictionExecutionDeferredError extends Error {
  readonly code = "PREDICTION_EXECUTION_DEFERRED_TO_APP_1_8" as const;

  constructor() {
    super("Prediction execution is deferred to APP-1:8 Prediction Engine.");
    this.name = "ExecutivePredictionExecutionDeferredError";
  }
}
