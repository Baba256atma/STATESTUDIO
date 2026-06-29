/**
 * APP-6:5 — Decision State Engine domain types and constants.
 * Derived snapshot model — computed only from APP-6:4 lifecycle.
 */

import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import type { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import type {
  DecisionId,
  DecisionStatus,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_STATE_ENGINE_CONTRACT_VERSION = "APP-6/5" as const;
export const DECISION_STATE_ENGINE_ARCHITECTURE_VERSION = "APP-6/5-state-engine-arch" as const;

export const DECISION_STATE_ENGINE_TAGS = Object.freeze([
  "[APP6_5]",
  "[DECISION_STATE_ENGINE]",
  "[LIFECYCLE_DERIVED]",
  "[CONSUMER_SNAPSHOT]",
  "[READ_ONLY]",
  "[NO_PERSISTENCE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_STATE_MANDATORY_FIELDS = Object.freeze([
  "decisionId",
  "workspaceId",
  "currentLifecycle",
  "currentStatus",
  "currentVersion",
  "latestEventId",
  "latestTimestamp",
  "isTerminal",
  "isValid",
  "validationMessages",
  "historyVersion",
  "generatedAt",
  "stateVersion",
  "readOnly",
] as const);

export const DECISION_STATE_ENGINE_LIMITS = Object.freeze({
  maxRegisteredStates: 1_024,
} as const);

export const DECISION_STATE_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "ReplayEngine",
  "OutcomeTracker",
  "DecisionChart",
  "DashboardEngine",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export const DECISION_STATE_FUTURE_CONSUMERS = Object.freeze([
  "decision_query_engine",
  "decision_comparison",
  "decision_replay",
  "decision_dashboard",
  "decision_assistant",
  "decision_api_layer",
  "decision_platform_certification",
] as const);

export type DecisionState = Readonly<{
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  currentLifecycle: DecisionEngineLifecycle | null;
  currentStatus: DecisionStatus;
  currentVersion: string;
  latestEventId: string | null;
  latestTimestamp: string | null;
  isTerminal: boolean;
  isValid: boolean;
  validationMessages: readonly string[];
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  generatedAt: string;
  stateVersion: typeof DECISION_STATE_ENGINE_CONTRACT_VERSION;
  lifecycleVersion: typeof DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION | string;
  readOnly: true;
}>;

export type DecisionStateSnapshot = Readonly<{
  snapshotId: string;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  currentLifecycle: DecisionEngineLifecycle | null;
  currentStatus: DecisionStatus;
  currentVersion: string;
  latestEventId: string | null;
  latestTimestamp: string | null;
  isTerminal: boolean;
  isValid: boolean;
  validationMessages: readonly string[];
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  generatedAt: string;
  readOnly: true;
}>;

export type DecisionStateEngineState = Readonly<{
  engineId: "decision-state-engine";
  contractVersion: typeof DECISION_STATE_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredStateCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionStateResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type DecisionStateRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredStateCount: number;
  decisionIds: readonly DecisionId[];
  readOnly: true;
}>;

export type DecisionStateContractSurface = Readonly<{
  contractVersion: typeof DECISION_STATE_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  futureConsumers: typeof DECISION_STATE_FUTURE_CONSUMERS;
  readOnly: true;
}>;

export type DecisionStateCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionStateEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionStateCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function stateSuccess<T>(reason: string, data: T): DecisionStateResult<T> {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function stateFailure<T>(reason: string): DecisionStateResult<T> {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export function createDecisionStateVersion(
  historyVersion: string,
  lifecycleVersion: string
): string {
  return `${historyVersion}@${lifecycleVersion}`;
}
