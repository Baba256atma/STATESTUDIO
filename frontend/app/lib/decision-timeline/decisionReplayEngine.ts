/**
 * APP-6:8 — Decision Replay Engine.
 * Canonical read-only traversal over APP-6:3 history via APP-6:6 query resolution.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_COMPARISON_ENGINE_SELF_MANIFEST } from "./decisionComparisonEngine.ts";
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import {
  buildDecisionHistorySnapshot,
  getDecisionHistory,
} from "./decisionHistoryEngine.ts";
import { getDecisionById } from "./decisionQueryEngine.ts";
import {
  isFirstCursor,
  isLastCursor,
  resolveCurrentEvent,
  resolveCursorIndex,
} from "./decisionReplayCursor.ts";
import {
  getDecisionReplayRegistry,
  getDecisionReplaySession,
  getRegisteredDecisionReplay,
  registerDecisionReplaySession,
  resetDecisionReplayRegistryForTests,
  updateDecisionReplaySession,
} from "./decisionReplayRegistry.ts";
import {
  buildDecisionReplaySnapshot,
  freezeDecisionReplaySnapshot,
} from "./decisionReplaySnapshot.ts";
import {
  DECISION_REPLAY_CURSOR_ACTIONS,
  DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
  DECISION_REPLAY_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_REPLAY_ENGINE_TAGS,
  DECISION_REPLAY_FUTURE_CONSUMERS,
  DECISION_REPLAY_MANDATORY_FIELDS,
  replayFailure,
  type DecisionReplay,
  type DecisionReplayContractSurface,
  type DecisionReplayCreateInput,
  type DecisionReplayCursorMove,
  type DecisionReplayEngineState,
  type DecisionReplayResponse,
  type DecisionReplaySession,
  type DecisionReplaySnapshot,
} from "./decisionReplayTypes.ts";
import {
  validateDecisionReplay,
  validateDecisionReplayCreate,
  validateReplayCursorMove,
} from "./decisionReplayValidation.ts";

export const DECISION_REPLAY_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_REPLAY_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_REPLAY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/8",
  title: "Decision Replay Engine",
  goal: "Canonical read-only decision history traversal via APP-6:3 snapshots and APP-6:6 query resolution.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_COMPARISON_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionReplayTypes.ts",
    "frontend/app/lib/decision-timeline/decisionReplayCursor.ts",
    "frontend/app/lib/decision-timeline/decisionReplayValidation.ts",
    "frontend/app/lib/decision-timeline/decisionReplayRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionReplaySnapshot.ts",
    "frontend/app/lib/decision-timeline/decisionReplayEngine.ts",
    "frontend/app/lib/decision-timeline/decisionReplayRunner.ts",
    "frontend/app/lib/decision-timeline/decisionReplayEngine.test.ts",
    "docs/app-6-8-decision-replay-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_REPLAY_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2", "APP-6/3", "APP-6/4", "APP-6/5", "APP-6/6", "APP-6/7"]),
  runtimePath: "library-only" as const,
  tags: DECISION_REPLAY_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_REPLAY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyTraversal: true,
  historySnapshotOnly: true,
  queryResolvedOnly: true,
  noHistoryRebuild: true,
  noLifecycleRecalculation: true,
  noEventMutation: true,
  noPersistence: true,
  noAnalytics: true,
  noReact: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";
let replaySequence = 0;

export function initializeDecisionReplayEngine(
  timestamp: string = engineTimestamp
): DecisionReplayEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionReplayEngineState(timestamp);
}

export function isDecisionReplayEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionReplayEngineState(
  timestamp: string = engineTimestamp
): DecisionReplayEngineState {
  const registry = getDecisionReplayRegistry();
  return Object.freeze({
    engineId: "decision-replay-engine",
    contractVersion: DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredReplayCount: registry.registeredReplayCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionReplayEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  replaySequence = 0;
  resetDecisionReplayRegistryForTests();
}

function createReplayId(decisionId: string): string {
  replaySequence += 1;
  return `decision-replay-${decisionId}-${String(replaySequence).padStart(4, "0")}`;
}

function buildReplayView(session: DecisionReplaySession): DecisionReplay {
  const totalEvents = session.events.length;
  const cursorIndex = session.cursorIndex;
  const currentEvent = resolveCurrentEvent(session.events, cursorIndex);

  return Object.freeze({
    replayId: session.replayId,
    decisionId: session.decisionId,
    workspaceId: session.workspaceId,
    historyVersion: session.historyVersion,
    historySnapshotId: session.historySnapshotId,
    cursorIndex,
    currentEvent,
    totalEvents,
    isFirst: isFirstCursor(cursorIndex),
    isLast: isLastCursor(cursorIndex, totalEvents),
    generatedAt: session.generatedAt,
    replayVersion: DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

function buildReplaySession(
  input: DecisionReplayCreateInput,
  workspaceId: string,
  historyVersion: string,
  historySnapshotId: string,
  events: readonly DecisionEngineEvent[],
  cursorIndex: number,
  generatedAt: string
): DecisionReplaySession {
  return Object.freeze({
    replayId: createReplayId(input.decisionId),
    decisionId: input.decisionId,
    workspaceId,
    historyVersion,
    historySnapshotId,
    events: Object.freeze([...events]),
    cursorIndex,
    generatedAt,
    readOnly: true as const,
  });
}

export function createDecisionReplay(input: DecisionReplayCreateInput): DecisionReplayResponse {
  if (!isDecisionReplayEngineInitialized()) {
    return replayFailure("Decision Replay Engine is not initialized.");
  }

  const state = getDecisionById(input.decisionId);
  const history = getDecisionHistory(input.decisionId);
  const historySnapshot = history ? buildDecisionHistorySnapshot(history, engineTimestamp) : null;

  const validation = validateDecisionReplayCreate(input, state, history, historySnapshot);
  if (!validation.valid) {
    return replayFailure(validation.issues[0]?.message ?? "Decision replay validation failed.");
  }

  const events = history!.orderedEvents;
  const startIndex = input.startIndex ?? 0;
  const session = buildReplaySession(
    input,
    state!.workspaceId,
    history!.historyVersion,
    historySnapshot!.snapshotId,
    events,
    startIndex,
    engineTimestamp
  );

  const replayView = buildReplayView(session);
  const replayValidation = validateDecisionReplay(replayView);
  if (!replayValidation.valid) {
    return replayFailure(replayValidation.issues[0]?.message ?? "Replay view validation failed.");
  }

  return registerDecisionReplaySession(session, replayView);
}

export function createReplay(input: DecisionReplayCreateInput): DecisionReplayResponse {
  return createDecisionReplay(input);
}

export function getReplay(replayId: string): DecisionReplay | null {
  return getRegisteredDecisionReplay(replayId);
}

function moveSessionCursor(session: DecisionReplaySession, move: DecisionReplayCursorMove): DecisionReplaySession | null {
  const nextIndex = resolveCursorIndex(
    move.action,
    session.cursorIndex,
    session.events.length,
    move.index,
    move.eventId,
    session.events
  );
  if (nextIndex === null) {
    return null;
  }
  return Object.freeze({
    ...session,
    cursorIndex: nextIndex,
    readOnly: true as const,
  });
}

export function moveReplayCursor(move: DecisionReplayCursorMove): DecisionReplayResponse {
  if (!isDecisionReplayEngineInitialized()) {
    return replayFailure("Decision Replay Engine is not initialized.");
  }

  const session = getDecisionReplaySession(move.replayId);
  const validation = validateReplayCursorMove(move, session);
  if (!validation.valid) {
    return replayFailure(validation.issues[0]?.message ?? "Replay cursor validation failed.");
  }

  const updatedSession = moveSessionCursor(session!, move);
  if (!updatedSession) {
    return replayFailure("Replay cursor move failed.");
  }

  const replayView = buildReplayView(updatedSession);
  const replayValidation = validateDecisionReplay(replayView);
  if (!replayValidation.valid) {
    return replayFailure(replayValidation.issues[0]?.message ?? "Replay view validation failed.");
  }

  return updateDecisionReplaySession(updatedSession, replayView);
}

export function moveNext(replayId: string): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "next" }));
}

export function movePrevious(replayId: string): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "previous" }));
}

export function moveFirst(replayId: string): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "first" }));
}

export function moveLast(replayId: string): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "last" }));
}

export function jumpToIndex(replayId: string, index: number): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "jumpToIndex", index }));
}

export function jumpToEvent(replayId: string, eventId: string): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "jumpToEvent", eventId }));
}

export function resetReplay(replayId: string): DecisionReplayResponse {
  return moveReplayCursor(Object.freeze({ replayId, action: "reset" }));
}

export function getReplaySnapshot(replayId: string): DecisionReplaySnapshot | null {
  const replay = getRegisteredDecisionReplay(replayId);
  if (!replay) {
    return null;
  }
  return buildDecisionReplaySnapshot(replay);
}

export function getDecisionReplayContract(): DecisionReplayContractSurface {
  return Object.freeze({
    contractVersion: DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
    mandatoryFields: DECISION_REPLAY_MANDATORY_FIELDS,
    supportedCursorActions: DECISION_REPLAY_CURSOR_ACTIONS,
    futureConsumers: DECISION_REPLAY_FUTURE_CONSUMERS,
    readOnly: true as const,
  });
}

export {
  validateDecisionReplay,
  buildDecisionReplaySnapshot,
  freezeDecisionReplaySnapshot,
};
export { runDecisionReplayEngine } from "./decisionReplayRunner.ts";

export const DECISION_REPLAY_ENGINE_VERSION = DECISION_REPLAY_ENGINE_CONTRACT_VERSION;
export const DECISION_REPLAY_ENGINE_OWNER = "decision-replay-engine";

export const DecisionReplayEngine = Object.freeze({
  initializeDecisionReplayEngine,
  isDecisionReplayEngineInitialized,
  getDecisionReplayEngineState,
  createDecisionReplay,
  createReplay,
  getReplay,
  moveReplayCursor,
  moveNext,
  movePrevious,
  moveFirst,
  moveLast,
  jumpToIndex,
  jumpToEvent,
  resetReplay,
  getReplaySnapshot,
  validateDecisionReplay,
  buildDecisionReplaySnapshot,
  freezeDecisionReplaySnapshot,
  getDecisionReplayContract,
  version: DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
  tags: DECISION_REPLAY_ENGINE_TAGS,
});

export { DECISION_REPLAY_ENGINE_TAGS, DECISION_REPLAY_FUTURE_CONSUMERS };
