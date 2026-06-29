/**
 * APP-4:7 — Executive Decision Memory registry.
 */

import type {
  ExecutiveDecisionId,
  ExecutiveDecisionMemory,
  ExecutiveDecisionMemoryId,
  ExecutiveDecisionMemoryQuery,
} from "./executiveDecisionMemoryTypes.ts";

const memories = new Map<ExecutiveDecisionMemoryId, ExecutiveDecisionMemory>();

function freezeMemory(memory: ExecutiveDecisionMemory): ExecutiveDecisionMemory {
  return Object.freeze({
    ...memory,
    metadata: Object.freeze({ ...memory.metadata, customMetadata: Object.freeze({ ...memory.metadata.customMetadata }) }),
    version: Object.freeze({ ...memory.version }),
    rationale: Object.freeze({ ...memory.rationale }),
    confidence: Object.freeze({ ...memory.confidence }),
    readOnly: true as const,
  });
}

function matchesQuery(memory: ExecutiveDecisionMemory, query: ExecutiveDecisionMemoryQuery): boolean {
  if (query.memoryId && memory.memoryId !== query.memoryId) return false;
  if (query.decisionId && memory.decisionId !== query.decisionId) return false;
  if (query.workspaceId && memory.workspaceId !== query.workspaceId) return false;
  if (query.goalId && memory.goalId !== query.goalId) return false;
  if (query.intentId && memory.intentId !== query.intentId) return false;
  if (query.scenarioId && memory.scenarioId !== query.scenarioId) return false;
  if (query.riskId && !memory.riskIds.includes(query.riskId)) return false;
  if (query.kpiId && !memory.kpiIds.includes(query.kpiId)) return false;
  if (query.lifecycle && memory.lifecycle !== query.lifecycle) return false;
  return true;
}

export function resetExecutiveDecisionMemoryRegistryForTests(): void {
  memories.clear();
}

export function snapshotExecutiveDecisionMemories(): ReadonlyMap<ExecutiveDecisionMemoryId, ExecutiveDecisionMemory> {
  return new Map(memories);
}

export function restoreExecutiveDecisionMemorySnapshot(
  snapshot: ReadonlyMap<ExecutiveDecisionMemoryId, ExecutiveDecisionMemory>
): void {
  memories.clear();
  for (const [key, value] of snapshot.entries()) {
    memories.set(key, freezeMemory(value));
  }
}

export function commitExecutiveDecisionMemory(memory: ExecutiveDecisionMemory): void {
  memories.set(memory.memoryId, freezeMemory(memory));
}

export function getExecutiveDecisionMemoryFromRegistry(
  memoryId: ExecutiveDecisionMemoryId
): ExecutiveDecisionMemory | null {
  return memories.get(memoryId) ?? null;
}

export function hasExecutiveDecisionMemoryInRegistry(memoryId: ExecutiveDecisionMemoryId): boolean {
  return memories.has(memoryId);
}

export function listExecutiveDecisionMemoriesFromRegistry(
  query: ExecutiveDecisionMemoryQuery = {}
): readonly ExecutiveDecisionMemory[] {
  return Object.freeze(
    [...memories.values()]
      .filter((memory) => matchesQuery(memory, query))
      .sort((left, right) => left.memoryId.localeCompare(right.memoryId))
  );
}

export function listAllExecutiveDecisionMemoriesFromRegistry(): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({});
}

export const ExecutiveDecisionMemoryRegistry = Object.freeze({
  resetExecutiveDecisionMemoryRegistryForTests,
  snapshotExecutiveDecisionMemories,
  restoreExecutiveDecisionMemorySnapshot,
  commitExecutiveDecisionMemory,
  getExecutiveDecisionMemoryFromRegistry,
  hasExecutiveDecisionMemoryInRegistry,
  listExecutiveDecisionMemoriesFromRegistry,
  listAllExecutiveDecisionMemoriesFromRegistry,
});
