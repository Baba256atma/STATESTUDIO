/**
 * APP-6:3 — Decision History Engine domain types and constants.
 * Extends APP-6:2 event types — does not redefine them.
 */

import type { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";
import type {
  DecisionEngineEvent,
  DecisionEngineEventVersion,
  DecisionEngineLifecycle,
} from "./decisionEventTypes.ts";
import type {
  DecisionId,
  DecisionReference,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_HISTORY_ENGINE_CONTRACT_VERSION = "APP-6/3" as const;
export const DECISION_HISTORY_ENGINE_ARCHITECTURE_VERSION = "APP-6/3-history-engine-arch" as const;

export const DECISION_HISTORY_ENGINE_TAGS = Object.freeze([
  "[APP6_3]",
  "[DECISION_HISTORY_ENGINE]",
  "[READ_ONLY_HISTORY]",
  "[DERIVED_VIEW]",
  "[NO_PERSISTENCE]",
  "[NO_REPLAY]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_HISTORY_MANDATORY_FIELDS = Object.freeze([
  "decisionId",
  "workspaceId",
  "historyVersion",
  "eventCount",
  "firstEvent",
  "latestEvent",
  "events",
  "currentLifecycle",
  "currentVersion",
  "createdAt",
  "updatedAt",
  "metadata",
  "references",
] as const);

export const DECISION_HISTORY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredHistories: 1_024,
  maxEventsPerHistory: 10_000,
  maxReferences: 64,
  maxMetadataKeys: 32,
} as const);

export const DECISION_HISTORY_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  engineNotInitialized: "engine_not_initialized",
  historyNotFound: "history_not_found",
  registryFull: "registry_full",
} as const);

export const DECISION_HISTORY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "ReplayEngine",
  "OutcomeTracker",
  "DecisionChart",
  "DecisionViewer",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export type DecisionHistoryMetadata = Readonly<Record<string, string>>;

export type DecisionHistory = Readonly<{
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  historyId: string;
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION;
  eventCount: number;
  firstEvent: DecisionEngineEvent | null;
  latestEvent: DecisionEngineEvent | null;
  events: readonly DecisionEngineEvent[];
  orderedEvents: readonly DecisionEngineEvent[];
  currentLifecycle: DecisionEngineLifecycle | null;
  currentVersion: DecisionEngineEventVersion | null;
  createdAt: string | null;
  updatedAt: string | null;
  metadata: DecisionHistoryMetadata;
  references: readonly DecisionReference[];
  validationResult: DecisionValidationResult;
  readOnly: true;
}>;

export type DecisionHistorySnapshot = Readonly<{
  snapshotId: string;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION;
  eventCount: number;
  currentLifecycle: DecisionEngineLifecycle | null;
  firstEventId: string | null;
  latestEventId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  capturedAt: string;
  readOnly: true;
}>;

export type BuildDecisionHistoryInput = Readonly<{
  events: readonly DecisionEngineEvent[];
  metadata?: DecisionHistoryMetadata;
}>;

export type DecisionHistoryEngineState = Readonly<{
  engineId: "decision-history-engine";
  contractVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredHistoryCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionHistoryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type DecisionHistoryRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredHistoryCount: number;
  historyIds: readonly string[];
  decisionIds: readonly DecisionId[];
  readOnly: true;
}>;

export type DecisionHistoryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionHistoryEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionHistoryCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type DecisionHistoryContractSurface = Readonly<{
  contractVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedLifecycles: readonly DecisionEngineLifecycle[];
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function createDecisionHistoryId(decisionId: DecisionId, workspaceId: DecisionWorkspaceId): string {
  return `decision-history-${workspaceId}-${decisionId}`;
}

export function historySuccess<T>(reason: string, data: T): DecisionHistoryResult<T> {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function historyFailure<T>(reason: string): DecisionHistoryResult<T> {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
