/**
 * APP-6:4 — Decision Lifecycle Engine domain types and constants.
 * Extends APP-6:2 lifecycle vocabulary — does not redefine it.
 */

import type { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type {
  DecisionId,
  DecisionStatus,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION = "APP-6/4" as const;
export const DECISION_LIFECYCLE_ENGINE_ARCHITECTURE_VERSION = "APP-6/4-lifecycle-engine-arch" as const;

export const DECISION_LIFECYCLE_ENGINE_TAGS = Object.freeze([
  "[APP6_4]",
  "[DECISION_LIFECYCLE_ENGINE]",
  "[HISTORY_DERIVED_STATE]",
  "[READ_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_WORKFLOW]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_LIFECYCLE_MANDATORY_FIELDS = Object.freeze([
  "decisionId",
  "workspaceId",
  "currentLifecycle",
  "currentStatus",
  "previousLifecycle",
  "transitionCount",
  "transitionHistory",
  "isTerminal",
  "isValid",
  "validationMessages",
  "historyVersion",
  "lifecycleVersion",
  "validationResult",
] as const);

export const DECISION_LIFECYCLE_ENGINE_LIMITS = Object.freeze({
  maxRegisteredLifecycles: 1_024,
  maxTransitionHistoryEntries: 256,
} as const);

export const DECISION_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "WorkflowEngine",
  "ReplayEngine",
  "OutcomeTracker",
  "DecisionChart",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export type DecisionLifecycleTransitionRecord = Readonly<{
  fromLifecycle: DecisionEngineLifecycle | null;
  toLifecycle: DecisionEngineLifecycle;
  eventId: string;
  timestamp: string;
  sequenceNumber: number;
  valid: boolean;
  readOnly: true;
}>;

export type DecisionLifecycle = Readonly<{
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  currentLifecycle: DecisionEngineLifecycle | null;
  currentStatus: DecisionStatus;
  previousLifecycle: DecisionEngineLifecycle | null;
  transitionCount: number;
  transitionHistory: readonly DecisionLifecycleTransitionRecord[];
  isTerminal: boolean;
  isValid: boolean;
  validationMessages: readonly string[];
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  lifecycleVersion: typeof DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  validationResult: DecisionValidationResult;
  readOnly: true;
}>;

export type DecisionLifecycleSnapshot = Readonly<{
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  currentLifecycle: DecisionEngineLifecycle | null;
  previousLifecycle: DecisionEngineLifecycle | null;
  transitionCount: number;
  isTerminal: boolean;
  isValid: boolean;
  validationMessages: readonly string[];
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  generatedAt: string;
  readOnly: true;
}>;

export type DecisionLifecycleEngineState = Readonly<{
  engineId: "decision-lifecycle-engine";
  contractVersion: typeof DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredLifecycleCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionLifecycleResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type DecisionLifecycleRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredLifecycleCount: number;
  decisionIds: readonly DecisionId[];
  readOnly: true;
}>;

export type DecisionLifecycleTransitionValidation = Readonly<{
  valid: boolean;
  fromLifecycle: DecisionEngineLifecycle | null;
  toLifecycle: DecisionEngineLifecycle;
  reason: string;
  readOnly: true;
}>;

export type DecisionLifecycleContractSurface = Readonly<{
  contractVersion: typeof DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedLifecycles: readonly DecisionEngineLifecycle[];
  readOnly: true;
}>;

export type DecisionLifecycleCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionLifecycleEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionLifecycleCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function lifecycleSuccess<T>(reason: string, data: T): DecisionLifecycleResult<T> {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function lifecycleFailure<T>(reason: string): DecisionLifecycleResult<T> {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
