/**
 * APP-4:6 — Executive Scenario Memory Engine.
 */

import { EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION } from "./executiveScenarioMemoryConstants.ts";
import { inspectExecutiveScenarioMemoryGraph } from "./executiveScenarioMemoryGraph.ts";
import {
  registerExecutiveScenarioTarget,
  resetExecutiveScenarioTargetRegistryForTests,
  listRegisteredExecutiveScenarioTargets,
} from "./executiveScenarioMemoryScenarioRegistry.ts";
import { resetExecutiveScenarioMemoryRegistryForTests } from "./executiveScenarioMemoryRegistry.ts";
import {
  archiveScenarioMemory,
  createScenarioMemory,
  getScenarioMemories,
  getScenarioMemoryByDecision,
  getScenarioMemoryByGoal,
  getScenarioMemoryById,
  getScenarioMemoryByIntent,
  getScenarioMemoryByKPI,
  getScenarioMemoryByRisk,
  getScenarioMemoryByScenario,
  getScenarioMemoryByWorkspace,
  hasScenarioMemory,
  restoreScenarioMemory,
  updateScenarioMemory,
  validateScenarioMemory,
} from "./executiveScenarioMemoryRepository.ts";
import { computeExecutiveScenarioMemoryStatistics } from "./executiveScenarioMemoryStatistics.ts";
import type { ExecutiveScenarioMemoryEngineState } from "./executiveScenarioMemoryTypes.ts";

let initialized = false;

export function initializeExecutiveScenarioMemoryEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveScenarioMemoryEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Scenario Memory engine initialized.",
    state: getExecutiveScenarioMemoryEngineState(timestamp),
  });
}

export function isExecutiveScenarioMemoryEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveScenarioMemoryEngineState(
  timestamp: string
): ExecutiveScenarioMemoryEngineState {
  const stats = computeExecutiveScenarioMemoryStatistics();
  return Object.freeze({
    engineId: "executive-scenario-memory-engine",
    contractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
    initialized,
    memoryCount: stats.totalMemories,
    registeredScenarioCount: listRegisteredExecutiveScenarioTargets().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveScenarioMemoryEngineForTests(): void {
  initialized = false;
  resetExecutiveScenarioMemoryRegistryForTests();
  resetExecutiveScenarioTargetRegistryForTests();
}

export {
  registerExecutiveScenarioTarget,
  createScenarioMemory,
  updateScenarioMemory,
  archiveScenarioMemory,
  restoreScenarioMemory,
  getScenarioMemoryById,
  getScenarioMemories,
  getScenarioMemoryByScenario,
  getScenarioMemoryByGoal,
  getScenarioMemoryByIntent,
  getScenarioMemoryByDecision,
  getScenarioMemoryByWorkspace,
  getScenarioMemoryByRisk,
  getScenarioMemoryByKPI,
  hasScenarioMemory,
  validateScenarioMemory,
};

export function getExecutiveScenarioMemoryStatistics() {
  return computeExecutiveScenarioMemoryStatistics();
}

export function inspectScenarioMemoryGraph(input: Parameters<typeof inspectExecutiveScenarioMemoryGraph>[0]) {
  return inspectExecutiveScenarioMemoryGraph(input);
}

export const ExecutiveScenarioMemoryEngine = Object.freeze({
  initializeExecutiveScenarioMemoryEngine,
  isExecutiveScenarioMemoryEngineInitialized,
  getExecutiveScenarioMemoryEngineState,
  resetExecutiveScenarioMemoryEngineForTests,
  registerExecutiveScenarioTarget,
  createScenarioMemory,
  updateScenarioMemory,
  archiveScenarioMemory,
  restoreScenarioMemory,
  getScenarioMemoryById,
  getScenarioMemories,
  getScenarioMemoryByScenario,
  getScenarioMemoryByGoal,
  getScenarioMemoryByIntent,
  getScenarioMemoryByDecision,
  getScenarioMemoryByWorkspace,
  getScenarioMemoryByRisk,
  getScenarioMemoryByKPI,
  hasScenarioMemory,
  validateScenarioMemory,
  getExecutiveScenarioMemoryStatistics,
  inspectScenarioMemoryGraph,
  version: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
});
