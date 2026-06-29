/**
 * APP-1:7 — Executive Event Registry.
 * Canonical in-memory event storage — publishers never access directly.
 */

import type {
  ExecutiveEventRecord,
  ExecutiveEventRegistryValidationResult,
} from "./executiveEventEngineTypes.ts";
import { EXECUTIVE_EVENT_REGISTRY_OWNER } from "./executiveEventEngineTypes.ts";
import type { ExecutiveEventCategory } from "./executiveEventAuthorityTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

const eventStore = new Map<string, ExecutiveEventRecord>();

let eventCounter = 0;

export function resetExecutiveEventRegistryForTests(): void {
  eventStore.clear();
  eventCounter = 0;
}

export function generateExecutiveEventId(workspaceId: string): string {
  eventCounter += 1;
  return `evt-${workspaceId.trim()}-${String(eventCounter).padStart(6, "0")}`;
}

export function validateEvent(event: ExecutiveEventRecord): ExecutiveEventRegistryValidationResult {
  const messages: string[] = [];
  if (!event.id.trim()) messages.push("Event id is required.");
  if (!event.workspaceId.trim()) messages.push("workspaceId is required.");
  if (!event.timestamp.trim()) messages.push("timestamp is required.");
  if (event.lifecycleState !== "published") messages.push("Only published events may be registered.");
  if (eventStore.has(event.id)) messages.push("Duplicate event id.");
  return Object.freeze({
    valid: messages.length === 0,
    messages: Object.freeze(messages),
  });
}

export function registerEvent(event: ExecutiveEventRecord): ExecutiveEventRecord {
  const validation = validateEvent(event);
  if (!validation.valid) {
    throw new Error(validation.messages[0] ?? "Event registration rejected.");
  }
  eventStore.set(event.id, event);
  return event;
}

export function getEvent(eventId: string): ExecutiveEventRecord | null {
  return eventStore.get(eventId.trim()) ?? null;
}

export function listEvents(): readonly ExecutiveEventRecord[] {
  return Object.freeze([...eventStore.values()]);
}

export function listEventsByWorkspace(workspaceId: string): readonly ExecutiveEventRecord[] {
  const trimmed = workspaceId.trim();
  return Object.freeze([...eventStore.values()].filter((event) => event.workspaceId === trimmed));
}

export function listEventsByEntity(input: {
  workspaceId: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
}): readonly ExecutiveEventRecord[] {
  const workspaceId = input.workspaceId.trim();
  const entityId = input.entityId.trim();
  return Object.freeze(
    [...eventStore.values()].filter(
      (event) =>
        event.workspaceId === workspaceId &&
        event.entityType === input.entityType &&
        event.entityId === entityId
    )
  );
}

export function listEventsByCategory(category: ExecutiveEventCategory): readonly ExecutiveEventRecord[] {
  return Object.freeze([...eventStore.values()].filter((event) => event.category === category));
}

export function listEventsBySource(sourceModule: string): readonly ExecutiveEventRecord[] {
  const trimmed = sourceModule.trim();
  return Object.freeze([...eventStore.values()].filter((event) => event.sourceModule === trimmed));
}

export const ExecutiveEventRegistry = Object.freeze({
  owner: EXECUTIVE_EVENT_REGISTRY_OWNER,
  registerEvent,
  getEvent,
  listEvents,
  listEventsByWorkspace,
  listEventsByEntity,
  listEventsByCategory,
  listEventsBySource,
  validateEvent,
});
