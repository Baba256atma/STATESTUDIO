/**
 * APP-4:8 — Executive Context Memory registry.
 */

import type {
  ExecutiveContextMemory,
  ExecutiveContextMemoryId,
  ExecutiveContextMemoryQuery,
} from "./executiveContextMemoryTypes.ts";

const memories = new Map<ExecutiveContextMemoryId, ExecutiveContextMemory>();

function freezeMemory(memory: ExecutiveContextMemory): ExecutiveContextMemory {
  return Object.freeze({
    ...memory,
    metadata: Object.freeze({ ...memory.metadata, customMetadata: Object.freeze({ ...memory.metadata.customMetadata }) }),
    version: Object.freeze({ ...memory.version }),
    businessContext: Object.freeze({ ...memory.businessContext }),
    marketContext: Object.freeze({ ...memory.marketContext }),
    organizationContext: Object.freeze({ ...memory.organizationContext }),
    resourceContext: Object.freeze({
      ...memory.resourceContext,
      resources: Object.freeze([...memory.resourceContext.resources]),
    }),
    policyContext: Object.freeze({
      ...memory.policyContext,
      policies: Object.freeze([...memory.policyContext.policies]),
    }),
    externalContext: Object.freeze({
      ...memory.externalContext,
      events: Object.freeze([...memory.externalContext.events]),
    }),
    contextSnapshot: Object.freeze({ ...memory.contextSnapshot }),
    readOnly: true as const,
  });
}

function matchesQuery(memory: ExecutiveContextMemory, query: ExecutiveContextMemoryQuery): boolean {
  if (query.memoryId && memory.memoryId !== query.memoryId) return false;
  if (query.workspaceId && memory.workspaceId !== query.workspaceId) return false;
  if (query.goalId && memory.goalId !== query.goalId) return false;
  if (query.intentId && memory.intentId !== query.intentId) return false;
  if (query.scenarioId && memory.scenarioId !== query.scenarioId) return false;
  if (query.decisionId && memory.decisionId !== query.decisionId) return false;
  if (query.businessContextId && memory.businessContext.contextId !== query.businessContextId) return false;
  if (query.stakeholderId && !memory.stakeholders.some((entry) => entry.stakeholderId === query.stakeholderId)) {
    return false;
  }
  if (
    query.externalEventId &&
    !memory.externalContext.events.some((entry) => entry.eventId === query.externalEventId)
  ) {
    return false;
  }
  if (query.lifecycle && memory.lifecycle !== query.lifecycle) return false;
  return true;
}

export function resetExecutiveContextMemoryRegistryForTests(): void {
  memories.clear();
}

export function snapshotExecutiveContextMemories(): ReadonlyMap<ExecutiveContextMemoryId, ExecutiveContextMemory> {
  return new Map(memories);
}

export function restoreExecutiveContextMemorySnapshot(
  snapshot: ReadonlyMap<ExecutiveContextMemoryId, ExecutiveContextMemory>
): void {
  memories.clear();
  for (const [key, value] of snapshot.entries()) {
    memories.set(key, freezeMemory(value));
  }
}

export function commitExecutiveContextMemory(memory: ExecutiveContextMemory): void {
  memories.set(memory.memoryId, freezeMemory(memory));
}

export function getExecutiveContextMemoryFromRegistry(
  memoryId: ExecutiveContextMemoryId
): ExecutiveContextMemory | null {
  return memories.get(memoryId) ?? null;
}

export function hasExecutiveContextMemoryInRegistry(memoryId: ExecutiveContextMemoryId): boolean {
  return memories.has(memoryId);
}

export function listExecutiveContextMemoriesFromRegistry(
  query: ExecutiveContextMemoryQuery = {}
): readonly ExecutiveContextMemory[] {
  return Object.freeze(
    [...memories.values()]
      .filter((memory) => matchesQuery(memory, query))
      .sort((left, right) => left.memoryId.localeCompare(right.memoryId))
  );
}

export function listAllExecutiveContextMemoriesFromRegistry(): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({});
}

export const ExecutiveContextMemoryRegistry = Object.freeze({
  resetExecutiveContextMemoryRegistryForTests,
  snapshotExecutiveContextMemories,
  restoreExecutiveContextMemorySnapshot,
  commitExecutiveContextMemory,
  getExecutiveContextMemoryFromRegistry,
  hasExecutiveContextMemoryInRegistry,
  listExecutiveContextMemoriesFromRegistry,
  listAllExecutiveContextMemoriesFromRegistry,
});
