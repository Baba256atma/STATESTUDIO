/**
 * APP-11:6 — Executive Inbox Scheduling Engine immutable registry.
 */

import {
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS,
} from "./executiveInboxSchedulingEngineConstants.ts";
import type { InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type {
  ExecutiveScheduleIntent,
  ScheduleId,
  ScheduleRegistrySnapshot,
  SchedulingEngineResult,
} from "./executiveInboxSchedulingEngineTypes.ts";
import { validateExecutiveScheduleIntent } from "./executiveInboxSchedulingEngineValidation.ts";

const scheduleRegistry = new Map<ScheduleId, ExecutiveScheduleIntent>();
const workspaceIndex = new Map<InboxWorkspaceId, Set<ScheduleId>>();

function indexSchedule(intent: ExecutiveScheduleIntent): void {
  const ids = workspaceIndex.get(intent.workspaceId) ?? new Set<ScheduleId>();
  ids.add(intent.scheduleId);
  workspaceIndex.set(intent.workspaceId, ids);
}

function unindexSchedule(intent: ExecutiveScheduleIntent): void {
  const ids = workspaceIndex.get(intent.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(intent.scheduleId);
  if (ids.size === 0) {
    workspaceIndex.delete(intent.workspaceId);
  }
}

export function resetExecutiveInboxSchedulingEngineRegistryForTests(): void {
  scheduleRegistry.clear();
  workspaceIndex.clear();
}

export function scheduleIntentExists(scheduleId: ScheduleId): boolean {
  return scheduleRegistry.has(scheduleId);
}

export function registerScheduleIntent(
  intent: ExecutiveScheduleIntent
): SchedulingEngineResult<ExecutiveScheduleIntent> {
  const validation = validateExecutiveScheduleIntent(intent);
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
  if (scheduleRegistry.has(intent.scheduleId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate schedule id: ${intent.scheduleId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_schedule",
        message: "Duplicate schedule id.",
        field: "scheduleId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (scheduleRegistry.size >= EXECUTIVE_INBOX_SCHEDULING_ENGINE_LIMITS.maxRegisteredSchedules) {
    return Object.freeze({
      success: false,
      reason: "Schedule registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Schedule registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  scheduleRegistry.set(intent.scheduleId, intent);
  indexSchedule(intent);
  return Object.freeze({
    success: true,
    reason: "Executive schedule intent registered.",
    data: intent,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterScheduleIntent(scheduleId: ScheduleId): SchedulingEngineResult<ScheduleId> {
  const existing = scheduleRegistry.get(scheduleId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Schedule intent not found: ${scheduleId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Schedule intent not found.",
        field: "scheduleId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  scheduleRegistry.delete(scheduleId);
  unindexSchedule(existing);
  return Object.freeze({
    success: true,
    reason: "Executive schedule intent unregistered.",
    data: scheduleId,
    error: null,
    readOnly: true as const,
  });
}

export function getScheduleIntent(scheduleId: ScheduleId): ExecutiveScheduleIntent | null {
  return scheduleRegistry.get(scheduleId) ?? null;
}

export function getScheduleIntents(workspaceId?: InboxWorkspaceId): readonly ExecutiveScheduleIntent[] {
  const sortByWindow = (left: ExecutiveScheduleIntent, right: ExecutiveScheduleIntent): number => {
    const windowDelta = left.scheduleWindow.windowKey.localeCompare(right.scheduleWindow.windowKey);
    if (windowDelta !== 0) {
      return windowDelta;
    }
    return left.scheduleId.localeCompare(right.scheduleId);
  };

  if (!workspaceId) {
    return Object.freeze([...scheduleRegistry.values()].sort(sortByWindow));
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((scheduleId) => scheduleRegistry.get(scheduleId))
      .filter((entry): entry is ExecutiveScheduleIntent => entry !== undefined)
      .sort(sortByWindow)
  );
}

export function getScheduleRegistrySnapshot(): ScheduleRegistrySnapshot {
  const scheduleIds = Object.freeze([...scheduleRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    scheduleCount: scheduleRegistry.size,
    scheduleIds,
    readOnly: true as const,
  });
}

export const ExecutiveInboxSchedulingEngineRegistry = Object.freeze({
  resetExecutiveInboxSchedulingEngineRegistryForTests,
  scheduleIntentExists,
  registerScheduleIntent,
  unregisterScheduleIntent,
  getScheduleIntent,
  getScheduleIntents,
  getScheduleRegistrySnapshot,
});
