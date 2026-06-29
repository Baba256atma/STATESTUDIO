/**
 * APP-4:6 — Executive Scenario Memory registry.
 */

import type {
  ExecutiveScenarioId,
  ExecutiveScenarioMemory,
  ExecutiveScenarioMemoryId,
  ExecutiveScenarioMemoryQuery,
} from "./executiveScenarioMemoryTypes.ts";

const memories = new Map<ExecutiveScenarioMemoryId, ExecutiveScenarioMemory>();

function freezeMemory(memory: ExecutiveScenarioMemory): ExecutiveScenarioMemory {
  return Object.freeze({
    ...memory,
    metadata: Object.freeze({ ...memory.metadata, customMetadata: Object.freeze({ ...memory.metadata.customMetadata }) }),
    version: Object.freeze({ ...memory.version }),
    readOnly: true as const,
  });
}

function matchesQuery(memory: ExecutiveScenarioMemory, query: ExecutiveScenarioMemoryQuery): boolean {
  if (query.memoryId && memory.memoryId !== query.memoryId) return false;
  if (query.scenarioId && memory.scenarioId !== query.scenarioId) return false;
  if (query.workspaceId && memory.workspaceId !== query.workspaceId) return false;
  if (query.goalId && memory.goalId !== query.goalId) return false;
  if (query.intentId && memory.intentId !== query.intentId) return false;
  if (query.decisionId && memory.decisionId !== query.decisionId) return false;
  if (query.riskId && !memory.riskIds.includes(query.riskId)) return false;
  if (query.kpiId && !memory.kpiIds.includes(query.kpiId)) return false;
  if (query.lifecycle && memory.lifecycle !== query.lifecycle) return false;
  return true;
}

export function resetExecutiveScenarioMemoryRegistryForTests(): void {
  memories.clear();
}

export function snapshotExecutiveScenarioMemories(): ReadonlyMap<ExecutiveScenarioMemoryId, ExecutiveScenarioMemory> {
  return new Map(memories);
}

export function restoreExecutiveScenarioMemorySnapshot(
  snapshot: ReadonlyMap<ExecutiveScenarioMemoryId, ExecutiveScenarioMemory>
): void {
  memories.clear();
  for (const [key, value] of snapshot.entries()) {
    memories.set(key, freezeMemory(value));
  }
}

export function commitExecutiveScenarioMemory(memory: ExecutiveScenarioMemory): void {
  memories.set(memory.memoryId, freezeMemory(memory));
}

export function getExecutiveScenarioMemoryFromRegistry(
  memoryId: ExecutiveScenarioMemoryId
): ExecutiveScenarioMemory | null {
  return memories.get(memoryId) ?? null;
}

export function hasExecutiveScenarioMemoryInRegistry(memoryId: ExecutiveScenarioMemoryId): boolean {
  return memories.has(memoryId);
}

export function listExecutiveScenarioMemoriesFromRegistry(
  query: ExecutiveScenarioMemoryQuery = {}
): readonly ExecutiveScenarioMemory[] {
  return Object.freeze(
    [...memories.values()]
      .filter((memory) => matchesQuery(memory, query))
      .sort((left, right) => left.memoryId.localeCompare(right.memoryId))
  );
}

export function listAllExecutiveScenarioMemoriesFromRegistry(): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({});
}

export function getExecutiveScenarioMemoryByScenarioFromRegistry(
  scenarioId: ExecutiveScenarioId
): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ scenarioId });
}

export const ExecutiveScenarioMemoryRegistry = Object.freeze({
  resetExecutiveScenarioMemoryRegistryForTests,
  snapshotExecutiveScenarioMemories,
  restoreExecutiveScenarioMemorySnapshot,
  commitExecutiveScenarioMemory,
  getExecutiveScenarioMemoryFromRegistry,
  hasExecutiveScenarioMemoryInRegistry,
  listExecutiveScenarioMemoriesFromRegistry,
  listAllExecutiveScenarioMemoriesFromRegistry,
  getExecutiveScenarioMemoryByScenarioFromRegistry,
});
