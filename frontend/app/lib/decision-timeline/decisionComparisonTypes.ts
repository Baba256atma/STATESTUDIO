/**
 * APP-6:7 — Decision Comparison Engine domain types.
 * Immutable comparison model over APP-6:5 DecisionState via APP-6:6 queries.
 */

import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type {
  DecisionId,
  DecisionStatus,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_COMPARISON_ENGINE_CONTRACT_VERSION = "APP-6/7" as const;
export const DECISION_COMPARISON_ENGINE_ARCHITECTURE_VERSION = "APP-6/7-comparison-engine-arch" as const;

export const DECISION_COMPARISON_ENGINE_TAGS = Object.freeze([
  "[APP6_7]",
  "[DECISION_COMPARISON_ENGINE]",
  "[QUERY_DERIVED]",
  "[READ_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_ANALYTICS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_COMPARISON_MANDATORY_FIELDS = Object.freeze([
  "comparisonId",
  "leftDecisionId",
  "rightDecisionId",
  "leftState",
  "rightState",
  "lifecycleDiff",
  "statusDiff",
  "versionDiff",
  "terminalDiff",
  "validationDiff",
  "validationMessages",
  "generatedAt",
  "comparisonVersion",
  "readOnly",
] as const);

export const DECISION_COMPARISON_ENGINE_LIMITS = Object.freeze({
  maxRegisteredComparisons: 1_024,
  maxMultiComparisonStates: 32,
} as const);

export const DECISION_COMPARISON_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "ReplayEngine",
  "DashboardEngine",
  "AssistantEngine",
  "OutcomeTracker",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export const DECISION_COMPARISON_FUTURE_CONSUMERS = Object.freeze([
  "decision_dashboard",
  "decision_assistant",
  "decision_replay",
  "decision_api_layer",
  "decision_platform_certification",
] as const);

export type DecisionFieldDiff<T> = Readonly<{
  changed: boolean;
  left: T;
  right: T;
  readOnly: true;
}>;

export type DecisionComparison = Readonly<{
  comparisonId: string;
  leftDecisionId: DecisionId;
  rightDecisionId: DecisionId;
  leftState: DecisionState;
  rightState: DecisionState;
  lifecycleDiff: DecisionFieldDiff<DecisionEngineLifecycle | null>;
  statusDiff: DecisionFieldDiff<DecisionStatus>;
  versionDiff: DecisionFieldDiff<string>;
  terminalDiff: DecisionFieldDiff<boolean>;
  validationDiff: DecisionFieldDiff<boolean>;
  validationMessages: readonly string[];
  generatedAt: string;
  comparisonVersion: typeof DECISION_COMPARISON_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionMultiComparison = Readonly<{
  comparisonId: string;
  decisionIds: readonly DecisionId[];
  states: readonly DecisionState[];
  pairwiseComparisons: readonly DecisionComparison[];
  workspaceId: DecisionWorkspaceId;
  generatedAt: string;
  comparisonVersion: typeof DECISION_COMPARISON_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionComparisonSnapshot = Readonly<{
  snapshotId: string;
  comparisonId: string;
  leftDecisionId: DecisionId;
  rightDecisionId: DecisionId;
  lifecycleDiff: DecisionFieldDiff<DecisionEngineLifecycle | null>;
  statusDiff: DecisionFieldDiff<DecisionStatus>;
  versionDiff: DecisionFieldDiff<string>;
  terminalDiff: DecisionFieldDiff<boolean>;
  validationDiff: DecisionFieldDiff<boolean>;
  validationMessages: readonly string[];
  capturedAt: string;
  readOnly: true;
}>;

export type DecisionComparisonInput = Readonly<{
  leftDecisionId: DecisionId;
  rightDecisionId: DecisionId;
  workspaceId?: DecisionWorkspaceId;
}>;

export type DecisionComparisonEngineState = Readonly<{
  engineId: "decision-comparison-engine";
  contractVersion: typeof DECISION_COMPARISON_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredComparisonCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionComparisonResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionComparison | null;
  readOnly: true;
}>;

export type DecisionMultiComparisonResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionMultiComparison | null;
  readOnly: true;
}>;

export type DecisionComparisonRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredComparisonCount: number;
  comparisonIds: readonly string[];
  readOnly: true;
}>;

export type DecisionComparisonContractSurface = Readonly<{
  contractVersion: typeof DECISION_COMPARISON_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  futureConsumers: typeof DECISION_COMPARISON_FUTURE_CONSUMERS;
  readOnly: true;
}>;

export type DecisionComparisonCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionComparisonEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionComparisonCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function comparisonSuccess(reason: string, data: DecisionComparison): DecisionComparisonResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function comparisonFailure(reason: string): DecisionComparisonResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export function multiComparisonSuccess(
  reason: string,
  data: DecisionMultiComparison
): DecisionMultiComparisonResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function multiComparisonFailure(reason: string): DecisionMultiComparisonResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
