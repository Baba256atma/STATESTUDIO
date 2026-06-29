/**
 * APP-1:7 — Executive Event Resolver.
 * Read-only event resolution — never mutates registry records.
 */

import type { ExecutiveEventRecord } from "./executiveEventEngineTypes.ts";
import {
  getEvent,
  listEvents,
  listEventsByEntity,
  listEventsByWorkspace,
} from "./executiveEventRegistry.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

function sortByTimestampDesc(events: readonly ExecutiveEventRecord[]): readonly ExecutiveEventRecord[] {
  return Object.freeze(
    [...events].sort((left, right) => right.timestamp.localeCompare(left.timestamp))
  );
}

export function resolveEvent(eventId: string): ExecutiveEventRecord | null {
  return getEvent(eventId);
}

export function resolveEvents(eventIds: readonly string[]): readonly ExecutiveEventRecord[] {
  return Object.freeze(
    eventIds
      .map((eventId) => getEvent(eventId))
      .filter((event): event is ExecutiveEventRecord => event !== null)
  );
}

export function resolveLatestEvent(input: {
  workspaceId: string;
  entityType?: ExecutiveTimeEntityType;
  entityId?: string;
}): ExecutiveEventRecord | null {
  const events = input.entityType && input.entityId
    ? listEventsByEntity({
        workspaceId: input.workspaceId,
        entityType: input.entityType,
        entityId: input.entityId,
      })
    : listEventsByWorkspace(input.workspaceId);
  const sorted = sortByTimestampDesc(events);
  return sorted[0] ?? null;
}

export function resolveEventHistory(eventId: string): readonly ExecutiveEventRecord[] {
  const event = getEvent(eventId);
  if (!event) return Object.freeze([]);
  return resolveEntityHistory({
    workspaceId: event.workspaceId,
    entityType: event.entityType,
    entityId: event.entityId,
  });
}

export function resolveEntityHistory(input: {
  workspaceId: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
}): readonly ExecutiveEventRecord[] {
  return sortByTimestampDesc(
    listEventsByEntity({
      workspaceId: input.workspaceId,
      entityType: input.entityType,
      entityId: input.entityId,
    })
  );
}

export function resolveWorkspaceHistory(workspaceId: string): readonly ExecutiveEventRecord[] {
  return sortByTimestampDesc(listEventsByWorkspace(workspaceId));
}

export function resolveAllEvents(): readonly ExecutiveEventRecord[] {
  return sortByTimestampDesc(listEvents());
}
