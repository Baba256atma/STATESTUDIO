/**
 * APP-6:8 — Decision Replay Engine domain types.
 * Read-only traversal over APP-6:3 history via APP-6:6 query resolution.
 */

import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import type { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import type {
  DecisionId,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_REPLAY_ENGINE_CONTRACT_VERSION = "APP-6/8" as const;
export const DECISION_REPLAY_ENGINE_ARCHITECTURE_VERSION = "APP-6/8-replay-engine-arch" as const;

export const DECISION_REPLAY_ENGINE_TAGS = Object.freeze([
  "[APP6_8]",
  "[DECISION_REPLAY_ENGINE]",
  "[HISTORY_TRAVERSAL]",
  "[READ_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_ANALYTICS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_REPLAY_MANDATORY_FIELDS = Object.freeze([
  "replayId",
  "decisionId",
  "workspaceId",
  "historyVersion",
  "historySnapshotId",
  "cursorIndex",
  "currentEvent",
  "totalEvents",
  "isFirst",
  "isLast",
  "generatedAt",
  "replayVersion",
  "readOnly",
] as const);

export const DECISION_REPLAY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredReplays: 1_024,
} as const);

export const DECISION_REPLAY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "DashboardEngine",
  "AssistantEngine",
  "OutcomeTracker",
  "DecisionChart",
  "localStorage",
  "indexedDB",
  "axios",
] as const);

export const DECISION_REPLAY_FUTURE_CONSUMERS = Object.freeze([
  "decision_dashboard",
  "decision_assistant",
  "decision_api_layer",
  "decision_platform_certification",
] as const);

export type DecisionReplayCursorAction =
  | "next"
  | "previous"
  | "first"
  | "last"
  | "jumpToIndex"
  | "jumpToEvent"
  | "reset";

export type DecisionReplay = Readonly<{
  replayId: string;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  historySnapshotId: string;
  cursorIndex: number;
  currentEvent: DecisionEngineEvent | null;
  totalEvents: number;
  isFirst: boolean;
  isLast: boolean;
  generatedAt: string;
  replayVersion: typeof DECISION_REPLAY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionReplaySnapshot = Readonly<{
  snapshotId: string;
  replayId: string;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  cursorIndex: number;
  currentEventId: string | null;
  totalEvents: number;
  isFirst: boolean;
  isLast: boolean;
  capturedAt: string;
  readOnly: true;
}>;

export type DecisionReplayCursorMove = Readonly<{
  replayId: string;
  action: DecisionReplayCursorAction;
  index?: number;
  eventId?: string;
}>;

export type DecisionReplayCreateInput = Readonly<{
  decisionId: DecisionId;
  workspaceId?: DecisionWorkspaceId;
  startIndex?: number;
}>;

export type DecisionReplayEngineState = Readonly<{
  engineId: "decision-replay-engine";
  contractVersion: typeof DECISION_REPLAY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredReplayCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionReplayResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionReplay | null;
  readOnly: true;
}>;

export type DecisionReplayRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredReplayCount: number;
  replayIds: readonly string[];
  readOnly: true;
}>;

export type DecisionReplayContractSurface = Readonly<{
  contractVersion: typeof DECISION_REPLAY_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedCursorActions: readonly DecisionReplayCursorAction[];
  futureConsumers: typeof DECISION_REPLAY_FUTURE_CONSUMERS;
  readOnly: true;
}>;

export type DecisionReplayCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionReplayEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionReplayCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type DecisionReplaySession = Readonly<{
  replayId: string;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  historyVersion: typeof DECISION_HISTORY_ENGINE_CONTRACT_VERSION | string;
  historySnapshotId: string;
  events: readonly DecisionEngineEvent[];
  cursorIndex: number;
  generatedAt: string;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function replaySuccess(reason: string, data: DecisionReplay): DecisionReplayResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function replayFailure(reason: string): DecisionReplayResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export const DECISION_REPLAY_CURSOR_ACTIONS = Object.freeze([
  "next",
  "previous",
  "first",
  "last",
  "jumpToIndex",
  "jumpToEvent",
  "reset",
] as const satisfies readonly DecisionReplayCursorAction[]);
