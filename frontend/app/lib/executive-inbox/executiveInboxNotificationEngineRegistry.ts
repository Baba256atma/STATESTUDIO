/**
 * APP-11:4 — Executive Inbox Notification Engine immutable registry.
 */

import {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS,
} from "./executiveInboxNotificationEngineConstants.ts";
import type { InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type {
  ExecutiveNotification,
  NotificationEngineResult,
  NotificationId,
  NotificationRegistrySnapshot,
} from "./executiveInboxNotificationEngineTypes.ts";
import { validateExecutiveNotification } from "./executiveInboxNotificationEngineValidation.ts";

const notificationRegistry = new Map<NotificationId, ExecutiveNotification>();
const workspaceIndex = new Map<InboxWorkspaceId, Set<NotificationId>>();

function indexNotification(notification: ExecutiveNotification): void {
  const ids = workspaceIndex.get(notification.workspaceId) ?? new Set<NotificationId>();
  ids.add(notification.notificationId);
  workspaceIndex.set(notification.workspaceId, ids);
}

function unindexNotification(notification: ExecutiveNotification): void {
  const ids = workspaceIndex.get(notification.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(notification.notificationId);
  if (ids.size === 0) {
    workspaceIndex.delete(notification.workspaceId);
  }
}

export function resetExecutiveInboxNotificationEngineRegistryForTests(): void {
  notificationRegistry.clear();
  workspaceIndex.clear();
}

export function notificationExists(notificationId: NotificationId): boolean {
  return notificationRegistry.has(notificationId);
}

export function registerNotification(
  notification: ExecutiveNotification
): NotificationEngineResult<ExecutiveNotification> {
  const validation = validateExecutiveNotification(notification);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (notificationRegistry.has(notification.notificationId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate notification id: ${notification.notificationId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_notification",
        message: "Duplicate notification id.",
        field: "notificationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (notificationRegistry.size >= EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS.maxRegisteredNotifications) {
    return Object.freeze({
      success: false,
      reason: "Notification registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Notification registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  notificationRegistry.set(notification.notificationId, notification);
  indexNotification(notification);
  return Object.freeze({
    success: true,
    reason: "Executive notification registered.",
    data: notification,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterNotification(notificationId: NotificationId): NotificationEngineResult<NotificationId> {
  const existing = notificationRegistry.get(notificationId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Notification not found: ${notificationId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Notification not found.",
        field: "notificationId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  notificationRegistry.delete(notificationId);
  unindexNotification(existing);
  return Object.freeze({
    success: true,
    reason: "Executive notification unregistered.",
    data: notificationId,
    error: null,
    readOnly: true as const,
  });
}

export function getNotification(notificationId: NotificationId): ExecutiveNotification | null {
  return notificationRegistry.get(notificationId) ?? null;
}

export function getNotifications(workspaceId?: InboxWorkspaceId): readonly ExecutiveNotification[] {
  const sortByTrigger = (left: ExecutiveNotification, right: ExecutiveNotification): number => {
    const triggerDelta = left.triggerType.localeCompare(right.triggerType);
    if (triggerDelta !== 0) {
      return triggerDelta;
    }
    return left.notificationId.localeCompare(right.notificationId);
  };

  if (!workspaceId) {
    return Object.freeze([...notificationRegistry.values()].sort(sortByTrigger));
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((notificationId) => notificationRegistry.get(notificationId))
      .filter((entry): entry is ExecutiveNotification => entry !== undefined)
      .sort(sortByTrigger)
  );
}

export function getNotificationRegistrySnapshot(): NotificationRegistrySnapshot {
  const notificationIds = Object.freeze([...notificationRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    notificationCount: notificationRegistry.size,
    notificationIds,
    readOnly: true as const,
  });
}

export const ExecutiveInboxNotificationEngineRegistry = Object.freeze({
  resetExecutiveInboxNotificationEngineRegistryForTests,
  notificationExists,
  registerNotification,
  unregisterNotification,
  getNotification,
  getNotifications,
  getNotificationRegistrySnapshot,
});
