/**
 * APP-4:8 — Executive Context Memory statistics.
 */

import { listAllExecutiveContextMemoriesFromRegistry } from "./executiveContextMemoryRegistry.ts";
import type { ExecutiveContextStatistics } from "./executiveContextMemoryTypes.ts";

export function computeExecutiveContextMemoryStatistics(): ExecutiveContextStatistics {
  const memories = listAllExecutiveContextMemoriesFromRegistry();
  const byWorkspace: Record<string, number> = {};
  const byGoal: Record<string, number> = {};
  const byScenario: Record<string, number> = {};
  const byDecision: Record<string, number> = {};
  const byBusinessContext: Record<string, number> = {};

  let activeMemories = 0;
  let archivedMemories = 0;

  for (const memory of memories) {
    if (memory.lifecycle === "active") activeMemories += 1;
    else archivedMemories += 1;

    byWorkspace[memory.workspaceId] = (byWorkspace[memory.workspaceId] ?? 0) + 1;
    if (memory.goalId) byGoal[memory.goalId] = (byGoal[memory.goalId] ?? 0) + 1;
    if (memory.scenarioId) byScenario[memory.scenarioId] = (byScenario[memory.scenarioId] ?? 0) + 1;
    if (memory.decisionId) byDecision[memory.decisionId] = (byDecision[memory.decisionId] ?? 0) + 1;
    byBusinessContext[memory.businessContext.contextId] =
      (byBusinessContext[memory.businessContext.contextId] ?? 0) + 1;
  }

  return Object.freeze({
    totalMemories: memories.length,
    activeMemories,
    archivedMemories,
    memoriesByWorkspace: Object.freeze({ ...byWorkspace }),
    memoriesByGoal: Object.freeze({ ...byGoal }),
    memoriesByScenario: Object.freeze({ ...byScenario }),
    memoriesByDecision: Object.freeze({ ...byDecision }),
    memoriesByBusinessContext: Object.freeze({ ...byBusinessContext }),
    readOnly: true as const,
  });
}

export const ExecutiveContextMemoryStatisticsService = Object.freeze({
  computeExecutiveContextMemoryStatistics,
});
