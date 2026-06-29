/**
 * APP-11:4 — Executive Inbox Notification Engine deterministic pipeline.
 */

import { EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES } from "./executiveInboxNotificationEngineConstants.ts";
import { registerNotification } from "./executiveInboxNotificationEngineRegistry.ts";
import { buildExecutiveNotification } from "./executiveInboxNotificationRecordBuilder.ts";
import type {
  ExecutiveInboxNotificationRequest,
  ExecutiveNotification,
  NotificationGenerationResult,
  PrioritizedInboxNotificationInput,
} from "./executiveInboxNotificationEngineTypes.ts";
import {
  validateExecutiveInboxNotificationRequest,
  validateExecutiveNotification,
  validateNotificationDependencies,
} from "./executiveInboxNotificationEngineValidation.ts";

function emptyResult(
  request: ExecutiveInboxNotificationRequest,
  reason: string,
  generationTimestamp: string
): NotificationGenerationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    notifications: Object.freeze([]),
    registeredNotificationIds: Object.freeze([]),
    skippedEntries: 0,
    ineligibleEntries: 0,
    pipelineStages: EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

function sortEntriesDeterministically(
  entries: readonly PrioritizedInboxNotificationInput[]
): readonly PrioritizedInboxNotificationInput[] {
  return Object.freeze(
    [...entries].sort((left, right) => left.priority.priorityId.localeCompare(right.priority.priorityId))
  );
}

export function buildExecutiveNotifications(
  request: ExecutiveInboxNotificationRequest
): readonly ExecutiveNotification[] {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();
  const sortedEntries = sortEntriesDeterministically(request.entries);

  return Object.freeze(
    sortedEntries
      .map((entry) => buildExecutiveNotification(entry, generationTimestamp))
      .filter((notification) => notification.eligibility.eligible)
  );
}

export function generateExecutiveNotifications(
  request: ExecutiveInboxNotificationRequest
): NotificationGenerationResult {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();

  const dependencyValidation = validateNotificationDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const requestValidation = validateExecutiveInboxNotificationRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const sortedEntries = sortEntriesDeterministically(request.entries);
  const builtNotifications: ExecutiveNotification[] = [];
  let ineligibleEntries = 0;

  for (const entry of sortedEntries) {
    const notification = buildExecutiveNotification(entry, generationTimestamp);
    if (!notification.eligibility.eligible) {
      ineligibleEntries += 1;
      continue;
    }
    builtNotifications.push(notification);
  }

  const registeredNotificationIds: string[] = [];
  let skippedEntries = 0;

  for (const notification of builtNotifications) {
    const notificationValidation = validateExecutiveNotification(notification);
    if (!notificationValidation.valid) {
      return emptyResult(
        request,
        `Notification validation failed: ${notificationValidation.issues.map((issue) => issue.message).join("; ")}`,
        generationTimestamp
      );
    }
    const registration = registerNotification(notification);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_notification") {
        skippedEntries += 1;
        continue;
      }
      return emptyResult(request, registration.reason, generationTimestamp);
    }
    registeredNotificationIds.push(notification.notificationId);
  }

  const notifications = Object.freeze(
    registeredNotificationIds
      .map((notificationId) => builtNotifications.find((entry) => entry.notificationId === notificationId))
      .filter((entry): entry is ExecutiveNotification => entry !== undefined)
      .sort((left, right) => left.notificationId.localeCompare(right.notificationId))
  );

  return Object.freeze({
    success: notifications.length > 0 || ineligibleEntries > 0,
    reason:
      notifications.length > 0
        ? `Generated ${notifications.length} executive notification record(s) deterministically.`
        : ineligibleEntries > 0
          ? "No inbox items met notification eligibility rules."
          : "No executive notifications were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    notifications,
    registeredNotificationIds: Object.freeze(registeredNotificationIds),
    skippedEntries,
    ineligibleEntries,
    pipelineStages: EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxNotificationPipeline = Object.freeze({
  generateExecutiveNotifications,
  buildExecutiveNotifications,
  stages: EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES,
});
