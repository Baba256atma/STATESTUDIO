/**
 * APP-11:4 — Executive Inbox Notification Engine.
 * Deterministic executive notification record generation from prioritized inbox items.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_INBOX_MUST_NOT_OWN, EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxPrioritizationEngineConstants.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST } from "./executiveInboxPrioritizationEngine.ts";
import {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_TAGS,
  EXECUTIVE_INBOX_NOTIFICATION_MANDATORY_NOTIFICATION_FIELDS,
} from "./executiveInboxNotificationEngineConstants.ts";
import {
  buildExecutiveNotifications,
  generateExecutiveNotifications as generateExecutiveNotificationsFromPipeline,
} from "./executiveInboxNotificationPipeline.ts";
import {
  getNotification,
  getNotifications,
  getNotificationRegistrySnapshot,
  notificationExists,
  registerNotification,
  resetExecutiveInboxNotificationEngineRegistryForTests,
  unregisterNotification,
} from "./executiveInboxNotificationEngineRegistry.ts";
import type {
  ExecutiveInboxNotificationEngineState,
  ExecutiveInboxNotificationRequest,
  NotificationEngineResult,
  NotificationGenerationResult,
} from "./executiveInboxNotificationEngineTypes.ts";
import {
  validateExecutiveNotification,
  validateExecutiveNotifications,
  validateNotificationDependencies,
} from "./executiveInboxNotificationEngineValidation.ts";

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_INBOX_NOTIFICATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/4",
  title: "Executive Inbox Notification Engine",
  goal: "Deterministic executive notification eligibility, record generation, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngineConstants.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngineTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngineValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEligibilityEvaluator.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationTriggerResolver.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationRecordBuilder.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngineRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationPipeline.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngine.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngineRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxNotificationEngine.test.ts",
    "docs/app-11-4-executive-inbox-notification-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-11/1", "APP-11/2", "APP-11/3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeExecutiveInboxNotificationEngine(
  timestamp: string = engineTimestamp
): ExecutiveInboxNotificationEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getExecutiveInboxNotificationEngineState(timestamp);
}

export function isExecutiveInboxNotificationEngineInitialized(): boolean {
  return engineInitialized;
}

export function getExecutiveInboxNotificationEngineState(
  timestamp: string = engineTimestamp
): ExecutiveInboxNotificationEngineState {
  const registry = getNotificationRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-inbox-notification-engine",
    contractVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredNotificationCount: registry.notificationCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveInboxNotificationEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveInboxNotificationEngineRegistryForTests();
}

function assertEngineReady<T>(): NotificationEngineResult<T> | null {
  const dependencyValidation = validateNotificationDependencies();
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
  if (!isExecutiveInboxNotificationEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Inbox Notification Engine is not initialized.",
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

export function generateExecutiveNotificationsWithEngine(
  request: ExecutiveInboxNotificationRequest
): NotificationGenerationResult {
  const blocked = assertEngineReady<NotificationGenerationResult>();
  if (blocked) {
    const generationTimestamp = request.generationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      notifications: Object.freeze([]),
      registeredNotificationIds: Object.freeze([]),
      skippedEntries: 0,
      ineligibleEntries: 0,
      pipelineStages: Object.freeze([]),
      generationTimestamp,
      readOnly: true as const,
    });
  }
  return generateExecutiveNotificationsFromPipeline(request);
}

export {
  generateExecutiveNotificationsWithEngine as generateExecutiveNotifications,
  buildExecutiveNotifications,
  validateExecutiveNotifications,
};
export {
  registerNotification,
  unregisterNotification,
  getNotification,
  getNotifications,
  notificationExists,
  getNotificationRegistrySnapshot,
};
export { validateExecutiveNotification };
export { runExecutiveInboxNotificationCertification } from "./executiveInboxNotificationEngineRunner.ts";

export const EXECUTIVE_INBOX_NOTIFICATION_ENGINE_VERSION = EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;

export const ExecutiveInboxNotificationEngine = Object.freeze({
  initializeExecutiveInboxNotificationEngine,
  isExecutiveInboxNotificationEngineInitialized,
  getExecutiveInboxNotificationEngineState,
  generateExecutiveNotifications: generateExecutiveNotificationsWithEngine,
  buildExecutiveNotifications,
  validateExecutiveNotifications,
  registerNotification,
  getNotifications,
  getNotification,
  notificationExists,
  resetExecutiveInboxNotificationEngineForTests,
  version: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  aggregationVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  prioritizationVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_INBOX_NOTIFICATION_MANDATORY_NOTIFICATION_FIELDS,
  tags: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_INBOX_MUST_NOT_OWN,
});
