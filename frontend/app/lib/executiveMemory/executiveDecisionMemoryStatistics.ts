/**
 * APP-4:7 — Executive Decision Memory statistics.
 */

import { listAllExecutiveDecisionMemoriesFromRegistry } from "./executiveDecisionMemoryRegistry.ts";
import type { ExecutiveDecisionMemoryStatistics } from "./executiveDecisionMemoryTypes.ts";

export function computeExecutiveDecisionMemoryStatistics(): ExecutiveDecisionMemoryStatistics {
  const memories = listAllExecutiveDecisionMemoriesFromRegistry();
  const byWorkspace: Record<string, number> = {};
  const byDecision: Record<string, number> = {};
  const byGoal: Record<string, number> = {};
  const byIntent: Record<string, number> = {};
  const byScenario: Record<string, number> = {};

  let activeMemories = 0;
  let archivedMemories = 0;

  for (const memory of memories) {
    if (memory.lifecycle === "active") activeMemories += 1;
    else archivedMemories += 1;

    byWorkspace[memory.workspaceId] = (byWorkspace[memory.workspaceId] ?? 0) + 1;
    byDecision[memory.decisionId] = (byDecision[memory.decisionId] ?? 0) + 1;
    if (memory.goalId) byGoal[memory.goalId] = (byGoal[memory.goalId] ?? 0) + 1;
    if (memory.intentId) byIntent[memory.intentId] = (byIntent[memory.intentId] ?? 0) + 1;
    if (memory.scenarioId) byScenario[memory.scenarioId] = (byScenario[memory.scenarioId] ?? 0) + 1;
  }

  return Object.freeze({
    totalMemories: memories.length,
    activeMemories,
    archivedMemories,
    memoriesByWorkspace: Object.freeze({ ...byWorkspace }),
    memoriesByDecision: Object.freeze({ ...byDecision }),
    memoriesByGoal: Object.freeze({ ...byGoal }),
    memoriesByIntent: Object.freeze({ ...byIntent }),
    memoriesByScenario: Object.freeze({ ...byScenario }),
    readOnly: true as const,
  });
}

export const ExecutiveDecisionMemoryStatisticsService = Object.freeze({
  computeExecutiveDecisionMemoryStatistics,
});
