/**
 * APP-6:5 — Decision State Engine.
 * Canonical authority for lifecycle-derived decision state snapshots.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST } from "./decisionLifecycleEngine.ts";
import type { DecisionLifecycle } from "./decisionLifecycleTypes.ts";
import {
  getDecisionStateRegistry,
  getRegisteredDecisionState,
  registerDecisionState,
  resetDecisionStateRegistryForTests,
} from "./decisionStateRegistry.ts";
import { buildDecisionStateSnapshot } from "./decisionStateSnapshot.ts";
import {
  DECISION_STATE_ENGINE_CONTRACT_VERSION,
  DECISION_STATE_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_STATE_ENGINE_TAGS,
  DECISION_STATE_FUTURE_CONSUMERS,
  DECISION_STATE_MANDATORY_FIELDS,
  createDecisionStateVersion,
  type DecisionState,
  type DecisionStateContractSurface,
  type DecisionStateEngineState,
  type DecisionStateResult,
  stateFailure,
  stateSuccess,
} from "./decisionStateTypes.ts";
import { validateDecisionState } from "./decisionStateValidation.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

export const DECISION_STATE_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_STATE_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_STATE_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/5",
  title: "Decision State Engine",
  goal: "Canonical read-only decision state derivation from APP-6:4 lifecycle for downstream APP-6 consumers.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionStateTypes.ts",
    "frontend/app/lib/decision-timeline/decisionStateValidation.ts",
    "frontend/app/lib/decision-timeline/decisionStateSnapshot.ts",
    "frontend/app/lib/decision-timeline/decisionStateRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionStateEngine.ts",
    "frontend/app/lib/decision-timeline/decisionStateRunner.ts",
    "frontend/app/lib/decision-timeline/decisionStateEngine.test.ts",
    "docs/app-6-5-decision-state-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_STATE_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2", "APP-6/3", "APP-6/4"]),
  runtimePath: "library-only" as const,
  tags: DECISION_STATE_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_STATE_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyState: true,
  lifecycleDerivedOnly: true,
  noLifecycleRecalculation: true,
  noEventMutation: true,
  noHistoryMutation: true,
  noPersistence: true,
  consumerSnapshot: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionStateEngine(
  timestamp: string = engineTimestamp
): DecisionStateEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionStateEngineState(timestamp);
}

export function isDecisionStateEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionStateEngineState(
  timestamp: string = engineTimestamp
): DecisionStateEngineState {
  const registry = getDecisionStateRegistry();
  return Object.freeze({
    engineId: "decision-state-engine",
    contractVersion: DECISION_STATE_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredStateCount: registry.registeredStateCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionStateEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionStateRegistryForTests();
}

export function deriveDecisionState(
  lifecycle: DecisionLifecycle,
  generatedAt: string = new Date(0).toISOString()
): DecisionState {
  const lastTransition = lifecycle.transitionHistory.at(-1);

  return Object.freeze({
    decisionId: lifecycle.decisionId,
    workspaceId: lifecycle.workspaceId,
    currentLifecycle: lifecycle.currentLifecycle,
    currentStatus: lifecycle.currentStatus,
    currentVersion: createDecisionStateVersion(lifecycle.historyVersion, lifecycle.lifecycleVersion),
    latestEventId: lastTransition?.eventId ?? null,
    latestTimestamp: lastTransition?.timestamp ?? null,
    isTerminal: lifecycle.isTerminal,
    isValid: lifecycle.isValid,
    validationMessages: Object.freeze([...lifecycle.validationMessages]),
    historyVersion: lifecycle.historyVersion,
    generatedAt,
    stateVersion: DECISION_STATE_ENGINE_CONTRACT_VERSION,
    lifecycleVersion: lifecycle.lifecycleVersion,
    readOnly: true as const,
  });
}

export function computeDecisionState(
  lifecycle: DecisionLifecycle,
  generatedAt: string = new Date(0).toISOString()
): DecisionStateResult<DecisionState> {
  if (!isDecisionStateEngineInitialized()) {
    return stateFailure("Decision State Engine is not initialized.");
  }

  const state = deriveDecisionState(lifecycle, generatedAt);
  const validation = validateDecisionState(state, lifecycle);
  if (!validation.valid) {
    return stateFailure(validation.issues[0]?.message ?? "Decision state validation failed.");
  }

  return registerDecisionState(state);
}

export function getDecisionState(decisionId: DecisionId): DecisionState | null {
  return getRegisteredDecisionState(decisionId);
}

export function getDecisionStateContract(): DecisionStateContractSurface {
  return Object.freeze({
    contractVersion: DECISION_STATE_ENGINE_CONTRACT_VERSION,
    mandatoryFields: DECISION_STATE_MANDATORY_FIELDS,
    futureConsumers: DECISION_STATE_FUTURE_CONSUMERS,
    readOnly: true as const,
  });
}

export { validateDecisionState, buildDecisionStateSnapshot };
export { runDecisionStateEngine } from "./decisionStateRunner.ts";

export const DECISION_STATE_ENGINE_VERSION = DECISION_STATE_ENGINE_CONTRACT_VERSION;
export const DECISION_STATE_ENGINE_OWNER = "decision-state-engine";

export const DecisionStateEngine = Object.freeze({
  initializeDecisionStateEngine,
  isDecisionStateEngineInitialized,
  getDecisionStateEngineState,
  deriveDecisionState,
  computeDecisionState,
  validateDecisionState,
  getDecisionState,
  buildDecisionStateSnapshot,
  getDecisionStateRegistry,
  getDecisionStateContract,
  version: DECISION_STATE_ENGINE_CONTRACT_VERSION,
  tags: DECISION_STATE_ENGINE_TAGS,
});

export { DECISION_STATE_MANDATORY_FIELDS, DECISION_STATE_ENGINE_TAGS, DECISION_STATE_FUTURE_CONSUMERS };
