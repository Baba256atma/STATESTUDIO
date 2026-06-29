/**
 * APP-4:6 — Executive Scenario Memory statistics.
 */

import { listAllExecutiveScenarioMemoriesFromRegistry } from "./executiveScenarioMemoryRegistry.ts";
import type { ExecutiveScenarioMemoryStatistics } from "./executiveScenarioMemoryTypes.ts";

export function computeExecutiveScenarioMemoryStatistics(): ExecutiveScenarioMemoryStatistics {
  const memories = listAllExecutiveScenarioMemoriesFromRegistry();
  const byWorkspace: Record<string, number> = {};
  const byScenario: Record<string, number> = {};
  const byGoal: Record<string, number> = {};
  const byIntent: Record<string, number> = {};
  const byDecision: Record<string, number> = {};

  let activeMemories = 0;
  let archivedMemories = 0;

  for (const memory of memories) {
    if (memory.lifecycle === "active") activeMemories += 1;
    else archivedMemories += 1;

    byWorkspace[memory.workspaceId] = (byWorkspace[memory.workspaceId] ?? 0) + 1;
    byScenario[memory.scenarioId] = (byScenario[memory.scenarioId] ?? 0) + 1;
    if (memory.goalId) byGoal[memory.goalId] = (byGoal[memory.goalId] ?? 0) + 1;
    if (memory.intentId) byIntent[memory.intentId] = (byIntent[memory.intentId] ?? 0) + 1;
    if (memory.decisionId) byDecision[memory.decisionId] = (byDecision[memory.decisionId] ?? 0) + 1;
  }

  return Object.freeze({
    totalMemories: memories.length,
    activeMemories,
    archivedMemories,
    memoriesByWorkspace: Object.freeze({ ...byWorkspace }),
    memoriesByScenario: Object.freeze({ ...byScenario }),
    memoriesByGoal: Object.freeze({ ...byGoal }),
    memoriesByIntent: Object.freeze({ ...byIntent }),
    memoriesByDecision: Object.freeze({ ...byDecision }),
    readOnly: true as const,
  });
}

export const ExecutiveScenarioMemoryStatisticsService = Object.freeze({
  computeExecutiveScenarioMemoryStatistics,
});
