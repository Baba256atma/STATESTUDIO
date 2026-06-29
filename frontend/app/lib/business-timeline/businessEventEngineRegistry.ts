/**
 * APP-7:2 — Business Event append-only registry.
 */

import type { BusinessEventId, BusinessWorkspaceId } from "./businessTimelineTypes.ts";
import {
  BUSINESS_EVENT_ENGINE_CONTRACT_VERSION,
  BUSINESS_EVENT_ENGINE_LIMITS,
  type BusinessEngineEvent,
  type BusinessEventRegistrySnapshot,
  type BusinessEventResult,
  businessEventEngineErrorFromCode,
} from "./businessEventEngineTypes.ts";

const publishedEvents = new Map<BusinessEventId, BusinessEngineEvent>();
const revisionHistory = new Map<BusinessEventId, BusinessEngineEvent[]>();
const workspaceIndex = new Map<BusinessWorkspaceId, Set<BusinessEventId>>();
const workspaceSequenceCounters = new Map<BusinessWorkspaceId, number>();

export function resetBusinessEventRegistryForTests(): void {
  publishedEvents.clear();
  revisionHistory.clear();
  workspaceIndex.clear();
  workspaceSequenceCounters.clear();
}

export function isDuplicateBusinessEventId(eventId: BusinessEventId): boolean {
  return publishedEvents.has(eventId);
}

export function allocateBusinessEventSequenceNumber(workspaceId: BusinessWorkspaceId): number {
  const current = workspaceSequenceCounters.get(workspaceId) ?? 0;
  const next = current + 1;
  workspaceSequenceCounters.set(workspaceId, next);
  return next;
}

export function generateBusinessEventId(workspaceId: BusinessWorkspaceId, sequence: number): BusinessEventId {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return `business-event-${safeWorkspace}-${String(sequence).padStart(6, "0")}`;
}

function indexEvent(event: BusinessEngineEvent): void {
  const ids = workspaceIndex.get(event.workspaceId) ?? new Set<BusinessEventId>();
  ids.add(event.id);
  workspaceIndex.set(event.workspaceId, ids);
}

export function registerBusinessEvent(event: BusinessEngineEvent): BusinessEventResult<BusinessEngineEvent> {
  if (publishedEvents.has(event.id)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate event id: ${event.id}.`,
      data: null,
      error: businessEventEngineErrorFromCode("duplicateEvent", "Duplicate event id.", "id"),
      readOnly: true as const,
    });
  }
  if (publishedEvents.size >= BUSINESS_EVENT_ENGINE_LIMITS.maxPublishedEvents) {
    return Object.freeze({
      success: false,
      reason: "Business event registry is full.",
      data: null,
      error: businessEventEngineErrorFromCode("registryFull", "Registry full."),
      readOnly: true as const,
    });
  }

  publishedEvents.set(event.id, event);
  revisionHistory.set(event.id, Object.freeze([event]));
  indexEvent(event);

  return Object.freeze({
    success: true,
    reason: "Business event registered.",
    data: event,
    error: null,
    readOnly: true as const,
  });
}

export function replaceBusinessEventRevision(
  previous: BusinessEngineEvent,
  next: BusinessEngineEvent
): BusinessEventResult<BusinessEngineEvent> {
  if (previous.id !== next.id) {
    return Object.freeze({
      success: false,
      reason: "Event identity must remain stable across revisions.",
      data: null,
      error: businessEventEngineErrorFromCode("forbiddenMutation", "Event id cannot change.", "id"),
      readOnly: true as const,
    });
  }
  if (next.revisionVersion !== previous.revisionVersion + 1) {
    return Object.freeze({
      success: false,
      reason: "Revision version must increment by exactly one.",
      data: null,
      error: businessEventEngineErrorFromCode("validationFailure", "Invalid revision increment.", "revisionVersion"),
      readOnly: true as const,
    });
  }

  const history = revisionHistory.get(previous.id) ?? Object.freeze([previous]);
  revisionHistory.set(previous.id, Object.freeze([...history, next]));
  publishedEvents.set(next.id, next);

  return Object.freeze({
    success: true,
    reason: "Business event revision registered.",
    data: next,
    error: null,
    readOnly: true as const,
  });
}

export function getBusinessEventById(eventId: BusinessEventId): BusinessEngineEvent | null {
  return publishedEvents.get(eventId) ?? null;
}

export function getBusinessEventsByWorkspace(workspaceId: BusinessWorkspaceId): readonly BusinessEngineEvent[] {
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => publishedEvents.get(id))
      .filter((event): event is BusinessEngineEvent => event !== undefined)
      .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))
  );
}

export function getBusinessEventRevisionHistory(eventId: BusinessEventId): readonly BusinessEngineEvent[] {
  return Object.freeze(revisionHistory.get(eventId) ?? []);
}

export function getBusinessEventRegistrySnapshot(): BusinessEventRegistrySnapshot {
  return Object.freeze({
    registryVersion: BUSINESS_EVENT_ENGINE_CONTRACT_VERSION,
    publishedEventCount: publishedEvents.size,
    eventIds: Object.freeze([...publishedEvents.keys()]),
    readOnly: true as const,
  });
}

export const BusinessEventEngineRegistry = Object.freeze({
  resetBusinessEventRegistryForTests,
  isDuplicateBusinessEventId,
  allocateBusinessEventSequenceNumber,
  generateBusinessEventId,
  registerBusinessEvent,
  replaceBusinessEventRevision,
  getBusinessEventById,
  getBusinessEventsByWorkspace,
  getBusinessEventRevisionHistory,
  getBusinessEventRegistrySnapshot,
});
