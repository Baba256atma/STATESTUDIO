/**
 * APP-11:3 — Executive Inbox Prioritization Engine.
 * Deterministic executive attention priority for aggregated inbox items.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_INBOX_MUST_NOT_OWN, EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST } from "./executiveInboxAggregationEngine.ts";
import {
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_TAGS,
  EXECUTIVE_INBOX_PRIORITIZATION_MANDATORY_PRIORITY_FIELDS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import {
  calculateExecutivePriorities,
  prioritizeExecutiveInbox as prioritizeExecutiveInboxFromPipeline,
} from "./executiveInboxPrioritizationPipeline.ts";
import {
  getPriorities,
  getPriority,
  getPriorityRegistrySnapshot,
  priorityExists,
  registerPriority,
  resetExecutiveInboxPrioritizationEngineRegistryForTests,
  unregisterPriority,
} from "./executiveInboxPrioritizationEngineRegistry.ts";
import type {
  ExecutiveInboxPrioritizationEngineState,
  ExecutiveInboxPrioritizationRequest,
  ExecutiveInboxPrioritizationResult,
  ExecutiveInboxPriority,
  PrioritizationEngineResult,
} from "./executiveInboxPrioritizationEngineTypes.ts";
import {
  validateExecutivePriorities,
  validateExecutivePriority,
  validatePrioritizationDependencies,
} from "./executiveInboxPrioritizationEngineValidation.ts";

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/3",
  title: "Executive Inbox Prioritization Engine",
  goal: "Deterministic executive attention priority, dimension evaluation, explanation, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngineConstants.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngineTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngineValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationDimensionEvaluator.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationCalculator.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationProfileBuilder.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngineRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationPipeline.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngine.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngineRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngine.test.ts",
    "docs/app-11-3-executive-inbox-prioritization-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-11/1", "APP-11/2"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeExecutiveInboxPrioritization(
  timestamp: string = engineTimestamp
): ExecutiveInboxPrioritizationEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getExecutiveInboxPrioritizationEngineState(timestamp);
}

export function isExecutiveInboxPrioritizationInitialized(): boolean {
  return engineInitialized;
}

export function getExecutiveInboxPrioritizationEngineState(
  timestamp: string = engineTimestamp
): ExecutiveInboxPrioritizationEngineState {
  const registry = getPriorityRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-inbox-prioritization-engine",
    contractVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredPriorityCount: registry.priorityCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveInboxPrioritizationEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveInboxPrioritizationEngineRegistryForTests();
}

function assertEngineReady<T>(): PrioritizationEngineResult<T> | null {
  const dependencyValidation = validatePrioritizationDependencies();
  if (!dependencyValidation.valid) {
    const firstIssue = dependencyValidation.issues[0];
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: firstIssue?.code ?? "dependency_incompatible",
        message: firstIssue?.message ?? "Dependencies not satisfied.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isExecutiveInboxPrioritizationInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Inbox Prioritization Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "engine_not_initialized",
        message: "Engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  return null;
}

export function prioritizeExecutiveInboxWithEngine(
  request: ExecutiveInboxPrioritizationRequest
): ExecutiveInboxPrioritizationResult {
  const blocked = assertEngineReady<ExecutiveInboxPrioritizationResult>();
  if (blocked) {
    const prioritizationTimestamp = request.prioritizationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      prioritizedItems: Object.freeze([]),
      registeredPriorityIds: Object.freeze([]),
      learningResults: Object.freeze([]),
      skippedItems: 0,
      pipelineStages: Object.freeze([]),
      prioritizationTimestamp,
      readOnly: true as const,
    });
  }
  return prioritizeExecutiveInboxFromPipeline(request);
}

export { prioritizeExecutiveInboxWithEngine as prioritizeExecutiveInbox, calculateExecutivePriorities };
export {
  registerPriority,
  unregisterPriority,
  getPriority,
  getPriorities,
  priorityExists,
  getPriorityRegistrySnapshot,
};
export { validateExecutivePriority, validateExecutivePriorities as validateExecutivePriorityBatch };
export { runExecutiveInboxPrioritizationCertification } from "./executiveInboxPrioritizationEngineRunner.ts";

export const EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_VERSION = EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;

export const ExecutiveInboxPrioritizationEngine = Object.freeze({
  initializeExecutiveInboxPrioritization,
  isExecutiveInboxPrioritizationInitialized,
  getExecutiveInboxPrioritizationEngineState,
  prioritizeExecutiveInbox: prioritizeExecutiveInboxWithEngine,
  calculateExecutivePriorities,
  validateExecutivePriority,
  registerPriority,
  getPriorities,
  getPriority,
  priorityExists,
  resetExecutiveInboxPrioritizationEngineForTests,
  version: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  aggregationVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_INBOX_PRIORITIZATION_MANDATORY_PRIORITY_FIELDS,
  tags: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_INBOX_MUST_NOT_OWN,
});
