/**
 * APP-6:7 — Decision Comparison Engine.
 * Canonical read-only comparison layer via APP-6:6 Query Engine.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  buildComparisonValidationMessages,
  detectLifecycleDiff,
  detectStatusDiff,
  detectTerminalDiff,
  detectValidationDiff,
  detectVersionDiff,
} from "./decisionComparisonDiff.ts";
import {
  getDecisionComparisonRegistry,
  registerDecisionComparison,
  resetDecisionComparisonRegistryForTests,
} from "./decisionComparisonRegistry.ts";
import { buildDecisionComparisonSnapshot } from "./decisionComparisonSnapshot.ts";
import {
  DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
  DECISION_COMPARISON_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_COMPARISON_ENGINE_TAGS,
  DECISION_COMPARISON_FUTURE_CONSUMERS,
  DECISION_COMPARISON_MANDATORY_FIELDS,
  comparisonFailure,
  multiComparisonFailure,
  multiComparisonSuccess,
  type DecisionComparison,
  type DecisionComparisonContractSurface,
  type DecisionComparisonEngineState,
  type DecisionComparisonInput,
  type DecisionComparisonResponse,
  type DecisionMultiComparisonResponse,
} from "./decisionComparisonTypes.ts";
import {
  validateDecisionComparisonInput,
  validateDecisionComparisonResult,
  validateDecisionStatesForMultiComparison,
  validateQueryCompatibilityForComparison,
} from "./decisionComparisonValidation.ts";
import {
  DECISION_QUERY_ENGINE_SELF_MANIFEST,
  getDecisionById,
  listDecisionStates,
} from "./decisionQueryEngine.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

export const DECISION_COMPARISON_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_COMPARISON_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_COMPARISON_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/7",
  title: "Decision Comparison Engine",
  goal: "Canonical read-only DecisionState comparison via APP-6:6 Query Engine.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionComparisonTypes.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonDiff.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonValidation.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonSnapshot.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonEngine.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonRunner.ts",
    "frontend/app/lib/decision-timeline/decisionComparisonEngine.test.ts",
    "docs/app-6-7-decision-comparison-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_COMPARISON_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2", "APP-6/3", "APP-6/4", "APP-6/5", "APP-6/6"]),
  runtimePath: "library-only" as const,
  tags: DECISION_COMPARISON_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_COMPARISON_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyComparison: true,
  queryDerivedOnly: true,
  noStateMutation: true,
  noLifecycleMutation: true,
  noPersistence: true,
  noAnalytics: true,
  noReplay: true,
  noReact: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";
let comparisonSequence = 0;

export function initializeDecisionComparisonEngine(
  timestamp: string = engineTimestamp
): DecisionComparisonEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionComparisonEngineState(timestamp);
}

export function isDecisionComparisonEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionComparisonEngineState(
  timestamp: string = engineTimestamp
): DecisionComparisonEngineState {
  const registry = getDecisionComparisonRegistry();
  return Object.freeze({
    engineId: "decision-comparison-engine",
    contractVersion: DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredComparisonCount: registry.registeredComparisonCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionComparisonEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  comparisonSequence = 0;
  resetDecisionComparisonRegistryForTests();
}

function createComparisonId(leftDecisionId: DecisionId, rightDecisionId: DecisionId): string {
  comparisonSequence += 1;
  return `decision-comparison-${leftDecisionId}-vs-${rightDecisionId}-${String(comparisonSequence).padStart(4, "0")}`;
}

function buildDecisionComparisonPair(
  left: DecisionState,
  right: DecisionState,
  generatedAt: string
): DecisionComparison {
  return Object.freeze({
    comparisonId: createComparisonId(left.decisionId, right.decisionId),
    leftDecisionId: left.decisionId,
    rightDecisionId: right.decisionId,
    leftState: left,
    rightState: right,
    lifecycleDiff: detectLifecycleDiff(left, right),
    statusDiff: detectStatusDiff(left, right),
    versionDiff: detectVersionDiff(left, right),
    terminalDiff: detectTerminalDiff(left, right),
    validationDiff: detectValidationDiff(left, right),
    validationMessages: buildComparisonValidationMessages(left, right),
    generatedAt,
    comparisonVersion: DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function compareDecisionStates(
  left: DecisionState,
  right: DecisionState,
  generatedAt: string = engineTimestamp
): DecisionComparisonResponse {
  if (!isDecisionComparisonEngineInitialized()) {
    return comparisonFailure("Decision Comparison Engine is not initialized.");
  }

  const validation = validateDecisionComparisonInput(
    Object.freeze({ leftDecisionId: left.decisionId, rightDecisionId: right.decisionId }),
    left,
    right
  );
  if (!validation.valid) {
    return comparisonFailure(validation.issues[0]?.message ?? "Decision comparison validation failed.");
  }

  const comparison = buildDecisionComparisonPair(left, right, generatedAt);
  const resultValidation = validateDecisionComparisonResult(comparison);
  if (!resultValidation.valid) {
    return comparisonFailure(resultValidation.issues[0]?.message ?? "Comparison result validation failed.");
  }

  return registerDecisionComparison(comparison);
}

export function compareDecisions(input: DecisionComparisonInput): DecisionComparisonResponse {
  if (!isDecisionComparisonEngineInitialized()) {
    return comparisonFailure("Decision Comparison Engine is not initialized.");
  }

  const queryValidation = validateQueryCompatibilityForComparison();
  if (!queryValidation.valid) {
    return comparisonFailure(queryValidation.issues[0]?.message ?? "Query compatibility validation failed.");
  }

  const left = getDecisionById(input.leftDecisionId);
  const right = getDecisionById(input.rightDecisionId);

  const validation = validateDecisionComparisonInput(input, left, right);
  if (!validation.valid) {
    return comparisonFailure(validation.issues[0]?.message ?? "Decision comparison validation failed.");
  }

  return compareDecisionStates(left!, right!, engineTimestamp);
}

export function compareMultipleDecisionStates(
  states: readonly DecisionState[],
  generatedAt: string = engineTimestamp
): DecisionMultiComparisonResponse {
  if (!isDecisionComparisonEngineInitialized()) {
    return multiComparisonFailure("Decision Comparison Engine is not initialized.");
  }

  const validation = validateDecisionStatesForMultiComparison(states);
  if (!validation.valid) {
    return multiComparisonFailure(validation.issues[0]?.message ?? "Multi-comparison validation failed.");
  }

  const sortedStates = Object.freeze([...states].sort((left, right) => left.decisionId.localeCompare(right.decisionId)));
  const pairwiseComparisons: DecisionComparison[] = [];

  for (let leftIndex = 0; leftIndex < sortedStates.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < sortedStates.length; rightIndex += 1) {
      const result = compareDecisionStates(sortedStates[leftIndex]!, sortedStates[rightIndex]!, generatedAt);
      if (!result.success || !result.data) {
        return multiComparisonFailure(result.reason);
      }
      pairwiseComparisons.push(result.data);
    }
  }

  return multiComparisonSuccess(
    "Multi-decision comparison completed.",
    Object.freeze({
      comparisonId: `decision-multi-comparison-${String(comparisonSequence).padStart(4, "0")}`,
      decisionIds: Object.freeze(sortedStates.map((state) => state.decisionId)),
      states: sortedStates,
      pairwiseComparisons: Object.freeze(pairwiseComparisons),
      workspaceId: sortedStates[0]!.workspaceId,
      generatedAt,
      comparisonVersion: DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
      readOnly: true as const,
    })
  );
}

export function compareDecisionsFromQuery(
  leftDecisionId: DecisionId,
  rightDecisionId: DecisionId
): DecisionComparisonResponse {
  return compareDecisions(Object.freeze({ leftDecisionId, rightDecisionId }));
}

export function validateDecisionComparison(
  input: DecisionComparisonInput,
  left: DecisionState | null = getDecisionById(input.leftDecisionId),
  right: DecisionState | null = getDecisionById(input.rightDecisionId)
): ReturnType<typeof validateDecisionComparisonInput> {
  return validateDecisionComparisonInput(input, left, right);
}

export function getDecisionComparisonContract(): DecisionComparisonContractSurface {
  return Object.freeze({
    contractVersion: DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
    mandatoryFields: DECISION_COMPARISON_MANDATORY_FIELDS,
    futureConsumers: DECISION_COMPARISON_FUTURE_CONSUMERS,
    readOnly: true as const,
  });
}

export { buildDecisionComparisonSnapshot, listDecisionStates };
export { runDecisionComparisonEngine } from "./decisionComparisonRunner.ts";

export const DECISION_COMPARISON_ENGINE_VERSION = DECISION_COMPARISON_ENGINE_CONTRACT_VERSION;
export const DECISION_COMPARISON_ENGINE_OWNER = "decision-comparison-engine";

export const DecisionComparisonEngine = Object.freeze({
  initializeDecisionComparisonEngine,
  isDecisionComparisonEngineInitialized,
  getDecisionComparisonEngineState,
  compareDecisions,
  compareDecisionStates,
  compareMultipleDecisionStates,
  validateDecisionComparison,
  buildDecisionComparisonSnapshot,
  getDecisionComparisonContract,
  version: DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
  tags: DECISION_COMPARISON_ENGINE_TAGS,
});

export { DECISION_COMPARISON_ENGINE_TAGS, DECISION_COMPARISON_FUTURE_CONSUMERS };
