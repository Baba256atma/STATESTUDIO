/**
 * APP-6:3 — Decision History Engine.
 * Canonical authority for event-derived decision histories.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_ENGINE_LIFECYCLE_KEYS } from "./decisionEventTypes.ts";
import { DECISION_EVENT_ENGINE_SELF_MANIFEST } from "./decisionEventEngine.ts";
import {
  buildDecisionHistory,
  freezeDecisionHistory,
  validateDecisionHistory,
} from "./decisionHistoryBuilder.ts";
import {
  DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
  DECISION_HISTORY_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_HISTORY_ENGINE_LIMITS,
  DECISION_HISTORY_ENGINE_TAGS,
  DECISION_HISTORY_MANDATORY_FIELDS,
  type BuildDecisionHistoryInput,
  type DecisionHistory,
  type DecisionHistoryContractSurface,
  type DecisionHistoryEngineState,
  type DecisionHistoryRegistrySnapshot,
  type DecisionHistoryResult,
  historyFailure,
  historySuccess,
} from "./decisionHistoryTypes.ts";
import { buildDecisionHistorySnapshot } from "./decisionHistorySnapshot.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

export const DECISION_HISTORY_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_HISTORY_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_HISTORY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/3",
  title: "Decision History Engine",
  goal: "Canonical read-only decision history construction, ordering, validation, and ephemeral derived views.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionHistoryTypes.ts",
    "frontend/app/lib/decision-timeline/decisionHistoryAggregator.ts",
    "frontend/app/lib/decision-timeline/decisionHistoryValidation.ts",
    "frontend/app/lib/decision-timeline/decisionHistoryBuilder.ts",
    "frontend/app/lib/decision-timeline/decisionHistorySnapshot.ts",
    "frontend/app/lib/decision-timeline/decisionHistoryEngine.ts",
    "frontend/app/lib/decision-timeline/decisionHistoryRunner.ts",
    "frontend/app/lib/decision-timeline/decisionHistoryEngine.test.ts",
    "docs/app-6-3-decision-history-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_HISTORY_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2"]),
  runtimePath: "library-only" as const,
  tags: DECISION_HISTORY_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_HISTORY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyHistory: true,
  noEventMutation: true,
  noPersistence: true,
  noReplay: true,
  noSearch: true,
  noAnalytics: true,
  noReact: true,
  derivedViewOnly: true,
} as const);

const historyRegistry = new Map<string, DecisionHistory>();

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function resetDecisionHistoryRegistryForTests(): void {
  historyRegistry.clear();
}

export function registerDecisionHistory(history: DecisionHistory): DecisionHistoryResult<DecisionHistory> {
  if (historyRegistry.size >= DECISION_HISTORY_ENGINE_LIMITS.maxRegisteredHistories) {
    return historyFailure("Decision history registry is full.");
  }

  const frozen = freezeDecisionHistory(history);
  historyRegistry.set(frozen.decisionId, frozen);
  historyRegistry.set(frozen.historyId, frozen);
  return historySuccess("Decision history registered.", frozen);
}

export function initializeDecisionHistoryEngine(
  timestamp: string = engineTimestamp
): DecisionHistoryEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionHistoryEngineState(timestamp);
}

export function isDecisionHistoryEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionHistoryEngineState(
  timestamp: string = engineTimestamp
): DecisionHistoryEngineState {
  const registry = getDecisionHistoryRegistry();
  return Object.freeze({
    engineId: "decision-history-engine",
    contractVersion: DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredHistoryCount: registry.registeredHistoryCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionHistoryEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionHistoryRegistryForTests();
}

export function computeDecisionHistory(
  input: BuildDecisionHistoryInput
): DecisionHistoryResult<DecisionHistory> {
  if (!isDecisionHistoryEngineInitialized()) {
    return historyFailure("Decision History Engine is not initialized.");
  }

  const history = buildDecisionHistory(input);
  const validation = validateDecisionHistory(history);
  if (!validation.valid) {
    return historyFailure(validation.issues[0]?.message ?? "Decision history validation failed.");
  }

  return registerDecisionHistory(history);
}

export function getDecisionHistory(decisionId: DecisionId): DecisionHistory | null {
  return historyRegistry.get(decisionId) ?? null;
}

export function getDecisionHistoryById(historyId: string): DecisionHistory | null {
  return historyRegistry.get(historyId) ?? null;
}

export function getDecisionHistoryRegistry(): DecisionHistoryRegistrySnapshot {
  const histories = [...new Set(historyRegistry.values())];
  return Object.freeze({
    registryVersion: DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
    registeredHistoryCount: histories.length,
    historyIds: Object.freeze(histories.map((entry) => entry.historyId)),
    decisionIds: Object.freeze(histories.map((entry) => entry.decisionId)),
    readOnly: true as const,
  });
}

export function getDecisionHistoryContract(): DecisionHistoryContractSurface {
  return Object.freeze({
    contractVersion: DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
    mandatoryFields: DECISION_HISTORY_MANDATORY_FIELDS,
    supportedLifecycles: DECISION_ENGINE_LIFECYCLE_KEYS,
    readOnly: true as const,
  });
}

export { buildDecisionHistory, validateDecisionHistory, buildDecisionHistorySnapshot, freezeDecisionHistory };
export { runDecisionHistoryEngine } from "./decisionHistoryRunner.ts";

export const DECISION_HISTORY_ENGINE_VERSION = DECISION_HISTORY_ENGINE_CONTRACT_VERSION;
export const DECISION_HISTORY_ENGINE_OWNER = "decision-history-engine";

export const DecisionHistoryEngine = Object.freeze({
  initializeDecisionHistoryEngine,
  isDecisionHistoryEngineInitialized,
  getDecisionHistoryEngineState,
  buildDecisionHistory,
  computeDecisionHistory,
  validateDecisionHistory,
  getDecisionHistory,
  getDecisionHistoryById,
  buildDecisionHistorySnapshot,
  freezeDecisionHistory,
  getDecisionHistoryRegistry,
  getDecisionHistoryContract,
  version: DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
  tags: DECISION_HISTORY_ENGINE_TAGS,
});

export { DECISION_HISTORY_MANDATORY_FIELDS, DECISION_HISTORY_ENGINE_TAGS };
