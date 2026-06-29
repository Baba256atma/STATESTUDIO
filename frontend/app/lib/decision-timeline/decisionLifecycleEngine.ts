/**
 * APP-6:4 — Decision Lifecycle Engine.
 * Canonical authority for history-derived decision lifecycle state.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_ENGINE_LIFECYCLE_KEYS } from "./decisionEventTypes.ts";
import { DECISION_HISTORY_ENGINE_SELF_MANIFEST } from "./decisionHistoryEngine.ts";
import type { DecisionHistory } from "./decisionHistoryTypes.ts";
import {
  isTerminalLifecycleState,
  resolveDecisionStatusFromLifecycle,
} from "./decisionLifecycleRules.ts";
import {
  analyzeDecisionHistoryForLifecycle,
  validateDecisionLifecycle,
} from "./decisionLifecycleValidation.ts";
import {
  getDecisionLifecycleRegistry,
  getRegisteredDecisionLifecycle,
  registerDecisionLifecycle,
  resetDecisionLifecycleRegistryForTests,
} from "./decisionLifecycleRegistry.ts";
import { buildDecisionLifecycleSnapshot } from "./decisionLifecycleSnapshot.ts";
import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  DECISION_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_LIFECYCLE_ENGINE_TAGS,
  DECISION_LIFECYCLE_MANDATORY_FIELDS,
  type DecisionLifecycle,
  type DecisionLifecycleContractSurface,
  type DecisionLifecycleEngineState,
  type DecisionLifecycleResult,
  lifecycleFailure,
  lifecycleSuccess,
} from "./decisionLifecycleTypes.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

export const DECISION_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/4",
  title: "Decision Lifecycle Engine",
  goal: "Canonical read-only lifecycle derivation, transition validation, and snapshot generation from decision history.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionLifecycleTypes.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleRules.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleValidation.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleSnapshot.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleEngine.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleRunner.ts",
    "frontend/app/lib/decision-timeline/decisionLifecycleEngine.test.ts",
    "docs/app-6-4-decision-lifecycle-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2", "APP-6/3"]),
  runtimePath: "library-only" as const,
  tags: DECISION_LIFECYCLE_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_LIFECYCLE_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyLifecycle: true,
  noEventMutation: true,
  noHistoryMutation: true,
  noWorkflowExecution: true,
  noPersistence: true,
  derivedViewOnly: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionLifecycleEngine(
  timestamp: string = engineTimestamp
): DecisionLifecycleEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionLifecycleEngineState(timestamp);
}

export function isDecisionLifecycleEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionLifecycleEngineState(
  timestamp: string = engineTimestamp
): DecisionLifecycleEngineState {
  const registry = getDecisionLifecycleRegistry();
  return Object.freeze({
    engineId: "decision-lifecycle-engine",
    contractVersion: DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredLifecycleCount: registry.registeredLifecycleCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionLifecycleEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionLifecycleRegistryForTests();
}

export function deriveDecisionLifecycle(history: DecisionHistory): DecisionLifecycle {
  const analysis = analyzeDecisionHistoryForLifecycle(history);
  const validationMessages = analysis.validationResult.issues.map((entry) => entry.message);
  const currentLifecycle = analysis.currentLifecycle;
  const isTerminal =
    currentLifecycle !== null &&
    (isTerminalLifecycleState(currentLifecycle) || currentLifecycle === "completed");

  return Object.freeze({
    decisionId: history.decisionId,
    workspaceId: history.workspaceId,
    currentLifecycle,
    currentStatus: resolveDecisionStatusFromLifecycle(currentLifecycle),
    previousLifecycle: analysis.previousLifecycle,
    transitionCount: analysis.transitionHistory.length,
    transitionHistory: analysis.transitionHistory,
    isTerminal,
    isValid: analysis.validationResult.valid,
    validationMessages: Object.freeze(validationMessages),
    historyVersion: history.historyVersion,
    lifecycleVersion: DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    validationResult: analysis.validationResult,
    readOnly: true as const,
  });
}

export function computeDecisionLifecycle(
  history: DecisionHistory
): DecisionLifecycleResult<DecisionLifecycle> {
  if (!isDecisionLifecycleEngineInitialized()) {
    return lifecycleFailure("Decision Lifecycle Engine is not initialized.");
  }

  const lifecycle = deriveDecisionLifecycle(history);
  const validation = validateDecisionLifecycle(lifecycle);
  if (!validation.valid) {
    return lifecycleFailure(validation.issues[0]?.message ?? "Decision lifecycle validation failed.");
  }

  return registerDecisionLifecycle(lifecycle);
}

export function getDecisionLifecycle(decisionId: DecisionId): DecisionLifecycle | null {
  return getRegisteredDecisionLifecycle(decisionId);
}

export function getDecisionLifecycleContract(): DecisionLifecycleContractSurface {
  return Object.freeze({
    contractVersion: DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    mandatoryFields: DECISION_LIFECYCLE_MANDATORY_FIELDS,
    supportedLifecycles: DECISION_ENGINE_LIFECYCLE_KEYS,
    readOnly: true as const,
  });
}

export { validateDecisionLifecycle, buildDecisionLifecycleSnapshot };
export { runDecisionLifecycleEngine } from "./decisionLifecycleRunner.ts";

export const DECISION_LIFECYCLE_ENGINE_VERSION = DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION;
export const DECISION_LIFECYCLE_ENGINE_OWNER = "decision-lifecycle-engine";

export const DecisionLifecycleEngine = Object.freeze({
  initializeDecisionLifecycleEngine,
  isDecisionLifecycleEngineInitialized,
  getDecisionLifecycleEngineState,
  deriveDecisionLifecycle,
  computeDecisionLifecycle,
  validateDecisionLifecycle,
  getDecisionLifecycle,
  buildDecisionLifecycleSnapshot,
  getDecisionLifecycleRegistry,
  getDecisionLifecycleContract,
  version: DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  tags: DECISION_LIFECYCLE_ENGINE_TAGS,
});

export { DECISION_LIFECYCLE_MANDATORY_FIELDS, DECISION_LIFECYCLE_ENGINE_TAGS };
