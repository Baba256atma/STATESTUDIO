/**
 * APP-1:8 — Executive Prediction & Conflict Engine types.
 */

import type {
  ExecutivePredictionCategory,
  ExecutivePredictionRequest,
} from "./executivePredictionAuthorityTypes.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_PREDICTION_ENGINE_VERSION = "APP-1/8" as const;

export const EXECUTIVE_CONFLICT_ENGINE_OWNER = "executive-conflict-engine" as const;

export type ExecutivePredictionHorizonKey =
  | "immediate"
  | "today"
  | "short_term"
  | "medium_term"
  | "long_term"
  | "custom";

export type ExecutiveConflictType =
  | "temporal_overlap"
  | "dependency_conflict"
  | "approval_conflict"
  | "transition_conflict"
  | "state_conflict"
  | "priority_conflict"
  | "resource_reservation_metadata"
  | "duplicate_prediction_request"
  | "custom";

export type ExecutiveConflictSeverity = "low" | "medium" | "high" | "critical";

export type ExecutivePredictionContributingFactor = Readonly<{
  factorId: string;
  label: string;
  weight: number;
}>;

export type ExecutiveConflictResult = Readonly<{
  conflictId: string;
  conflictType: ExecutiveConflictType;
  severity: ExecutiveConflictSeverity;
  affectedEntities: readonly Readonly<{ entityType: ExecutiveTimeEntityType; entityId: string }>[];
  explanation: string;
  suggestedResolution: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutivePredictionEvaluatedResult = Readonly<{
  predictionId: string;
  predictionCategory: ExecutivePredictionCategory;
  predictionHorizon: ExecutivePredictionHorizonKey;
  confidence: number;
  assumptions: readonly string[];
  contributingFactors: readonly ExecutivePredictionContributingFactor[];
  explanation: string;
  warnings: readonly string[];
  conflicts: readonly ExecutiveConflictResult[];
  recommendationHints: readonly string[];
  dependencies: readonly string[];
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutivePredictionGenerationResult = Readonly<{
  success: boolean;
  reason: string;
  request: ExecutivePredictionRequest | null;
  prediction: ExecutivePredictionEvaluatedResult | null;
}>;

export type ExecutivePredictionEngineFutureIntegrations = Readonly<{
  dashboard: Readonly<{ moduleId: "dashboard"; consumerOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ moduleId: "assistant"; consumerOnly: true; integrationImplemented: false }>;
  recommendation: Readonly<{ moduleId: "recommendation"; consumerOnly: true; integrationImplemented: false }>;
  scenario: Readonly<{ moduleId: "scenario"; publisherCapable: true; integrationImplemented: false }>;
  executiveMemory: Readonly<{ moduleId: "executive_memory"; consumerOnly: true; integrationImplemented: false }>;
  timeline: Readonly<{ moduleId: "timeline"; consumerOnly: true; integrationImplemented: false }>;
  audit: Readonly<{ moduleId: "audit"; consumerOnly: true; integrationImplemented: false }>;
  ds: Readonly<{ moduleId: "ds"; publisherCapable: true; integrationImplemented: false }>;
  int: Readonly<{ moduleId: "int"; publisherCapable: true; integrationImplemented: false }>;
  app: Readonly<{ moduleId: "app"; publisherCapable: true; integrationImplemented: false }>;
  lay: Readonly<{ moduleId: "lay"; publisherCapable: true; integrationImplemented: false }>;
}>;

export type ExecutivePredictionEngineCertificationResult = Readonly<{
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

export type ExecutivePredictionTemporalSignals = Readonly<{
  workspaceId: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  currentState: string;
  contextId: string;
  cameraContext: string;
  contextDrift: boolean;
  priorityLevel: string;
  priorityConfidence: number;
  eventCount: number;
  targetState?: string;
  transitionBlocked: boolean;
  approvalRequired: boolean;
}>;
