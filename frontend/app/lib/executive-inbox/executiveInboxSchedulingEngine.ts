/**
 * APP-11:6 — Executive Inbox Scheduling Engine.
 * Deterministic executive scheduling intent record generation from reminder records.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_INBOX_MUST_NOT_OWN, EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxNotificationEngineConstants.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxPrioritizationEngineConstants.ts";
import { EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION } from "./executiveInboxReminderEngineConstants.ts";
import { EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST } from "./executiveInboxReminderEngine.ts";
import {
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_TAGS,
  EXECUTIVE_INBOX_SCHEDULING_MANDATORY_SCHEDULE_FIELDS,
} from "./executiveInboxSchedulingEngineConstants.ts";
import {
  buildExecutiveScheduleIntents,
  generateExecutiveScheduleIntents as generateExecutiveScheduleIntentsFromPipeline,
} from "./executiveInboxSchedulingPipeline.ts";
import {
  getScheduleIntent,
  getScheduleIntents,
  getScheduleRegistrySnapshot,
  registerScheduleIntent,
  resetExecutiveInboxSchedulingEngineRegistryForTests,
  scheduleIntentExists,
  unregisterScheduleIntent,
} from "./executiveInboxSchedulingEngineRegistry.ts";
import type {
  ExecutiveInboxSchedulingEngineState,
  ExecutiveInboxSchedulingRequest,
  ScheduleGenerationResult,
  SchedulingEngineResult,
} from "./executiveInboxSchedulingEngineTypes.ts";
import {
  validateExecutiveScheduleIntent,
  validateExecutiveScheduleIntents,
  validateSchedulingDependencies,
} from "./executiveInboxSchedulingEngineValidation.ts";

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_INBOX_SCHEDULING_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/6",
  title: "Executive Inbox Scheduling Engine",
  goal: "Deterministic executive scheduling eligibility, intent records, window metadata, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngineConstants.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngineTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngineValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEligibilityEvaluator.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingTriggerResolver.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingWindowResolver.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingIntentBuilder.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngineRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingPipeline.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngine.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngineRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngine.test.ts",
    "docs/app-11-6-executive-inbox-scheduling-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_SCHEDULING_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-11/1", "APP-11/2", "APP-11/3", "APP-11/4", "APP-11/5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_SCHEDULING_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeExecutiveInboxSchedulingEngine(
  timestamp: string = engineTimestamp
): ExecutiveInboxSchedulingEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getExecutiveInboxSchedulingEngineState(timestamp);
}

export function isExecutiveInboxSchedulingEngineInitialized(): boolean {
  return engineInitialized;
}

export function getExecutiveInboxSchedulingEngineState(
  timestamp: string = engineTimestamp
): ExecutiveInboxSchedulingEngineState {
  const registry = getScheduleRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-inbox-scheduling-engine",
    contractVersion: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredScheduleCount: registry.scheduleCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveInboxSchedulingEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveInboxSchedulingEngineRegistryForTests();
}

function assertEngineReady<T>(): SchedulingEngineResult<T> | null {
  const dependencyValidation = validateSchedulingDependencies();
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
  if (!isExecutiveInboxSchedulingEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Inbox Scheduling Engine is not initialized.",
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

export function generateExecutiveScheduleIntentsWithEngine(
  request: ExecutiveInboxSchedulingRequest
): ScheduleGenerationResult {
  const blocked = assertEngineReady<ScheduleGenerationResult>();
  if (blocked) {
    const generationTimestamp = request.generationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      scheduleIntents: Object.freeze([]),
      registeredScheduleIds: Object.freeze([]),
      skippedEntries: 0,
      ineligibleEntries: 0,
      pipelineStages: Object.freeze([]),
      generationTimestamp,
      readOnly: true as const,
    });
  }
  return generateExecutiveScheduleIntentsFromPipeline(request);
}

export {
  generateExecutiveScheduleIntentsWithEngine as generateExecutiveScheduleIntents,
  buildExecutiveScheduleIntents,
  validateExecutiveScheduleIntents,
};
export {
  registerScheduleIntent,
  unregisterScheduleIntent,
  getScheduleIntent,
  getScheduleIntents,
  scheduleIntentExists,
  getScheduleRegistrySnapshot,
};
export { validateExecutiveScheduleIntent };
export { runExecutiveInboxSchedulingCertification } from "./executiveInboxSchedulingEngineRunner.ts";

export const EXECUTIVE_INBOX_SCHEDULING_ENGINE_VERSION = EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;

export const ExecutiveInboxSchedulingEngine = Object.freeze({
  initializeExecutiveInboxSchedulingEngine,
  isExecutiveInboxSchedulingEngineInitialized,
  getExecutiveInboxSchedulingEngineState,
  generateExecutiveScheduleIntents: generateExecutiveScheduleIntentsWithEngine,
  buildExecutiveScheduleIntents,
  validateExecutiveScheduleIntents,
  registerScheduleIntent,
  getScheduleIntents,
  getScheduleIntent,
  scheduleIntentExists,
  resetExecutiveInboxSchedulingEngineForTests,
  version: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  aggregationVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  prioritizationVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  notificationVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  reminderVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_INBOX_SCHEDULING_MANDATORY_SCHEDULE_FIELDS,
  tags: EXECUTIVE_INBOX_SCHEDULING_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_INBOX_MUST_NOT_OWN,
});
