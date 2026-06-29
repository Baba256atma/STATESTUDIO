/**
 * APP-4:7 — Executive Decision Memory Engine.
 */

import { EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION } from "./executiveDecisionMemoryConstants.ts";
import { inspectExecutiveDecisionMemoryGraph } from "./executiveDecisionMemoryGraph.ts";
import {
  registerExecutiveDecisionTarget,
  resetExecutiveDecisionTargetRegistryForTests,
  listRegisteredExecutiveDecisionTargets,
} from "./executiveDecisionMemoryDecisionRegistry.ts";
import { resetExecutiveDecisionMemoryRegistryForTests } from "./executiveDecisionMemoryRegistry.ts";
import {
  archiveDecisionMemory,
  createDecisionMemory,
  getDecisionMemories,
  getDecisionMemoryByDecision,
  getDecisionMemoryByGoal,
  getDecisionMemoryById,
  getDecisionMemoryByIntent,
  getDecisionMemoryByKPI,
  getDecisionMemoryByRisk,
  getDecisionMemoryByScenario,
  getDecisionMemoryByWorkspace,
  hasDecisionMemory,
  restoreDecisionMemory,
  updateDecisionMemory,
  validateDecisionMemory,
} from "./executiveDecisionMemoryRepository.ts";
import { computeExecutiveDecisionMemoryStatistics } from "./executiveDecisionMemoryStatistics.ts";
import type { ExecutiveDecisionMemoryEngineState } from "./executiveDecisionMemoryTypes.ts";

let initialized = false;

export function initializeExecutiveDecisionMemoryEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveDecisionMemoryEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Decision Memory engine initialized.",
    state: getExecutiveDecisionMemoryEngineState(timestamp),
  });
}

export function isExecutiveDecisionMemoryEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveDecisionMemoryEngineState(
  timestamp: string
): ExecutiveDecisionMemoryEngineState {
  const stats = computeExecutiveDecisionMemoryStatistics();
  return Object.freeze({
    engineId: "executive-decision-memory-engine",
    contractVersion: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
    initialized,
    memoryCount: stats.totalMemories,
    registeredDecisionCount: listRegisteredExecutiveDecisionTargets().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveDecisionMemoryEngineForTests(): void {
  initialized = false;
  resetExecutiveDecisionMemoryRegistryForTests();
  resetExecutiveDecisionTargetRegistryForTests();
}

export {
  registerExecutiveDecisionTarget,
  createDecisionMemory,
  updateDecisionMemory,
  archiveDecisionMemory,
  restoreDecisionMemory,
  getDecisionMemoryById,
  getDecisionMemories,
  getDecisionMemoryByDecision,
  getDecisionMemoryByGoal,
  getDecisionMemoryByIntent,
  getDecisionMemoryByScenario,
  getDecisionMemoryByWorkspace,
  getDecisionMemoryByRisk,
  getDecisionMemoryByKPI,
  hasDecisionMemory,
  validateDecisionMemory,
};

export function getExecutiveDecisionMemoryStatistics() {
  return computeExecutiveDecisionMemoryStatistics();
}

export function inspectDecisionMemoryGraph(input: Parameters<typeof inspectExecutiveDecisionMemoryGraph>[0]) {
  return inspectExecutiveDecisionMemoryGraph(input);
}

export const ExecutiveDecisionMemoryEngine = Object.freeze({
  initializeExecutiveDecisionMemoryEngine,
  isExecutiveDecisionMemoryEngineInitialized,
  getExecutiveDecisionMemoryEngineState,
  resetExecutiveDecisionMemoryEngineForTests,
  registerExecutiveDecisionTarget,
  createDecisionMemory,
  updateDecisionMemory,
  archiveDecisionMemory,
  restoreDecisionMemory,
  getDecisionMemoryById,
  getDecisionMemories,
  getDecisionMemoryByDecision,
  getDecisionMemoryByGoal,
  getDecisionMemoryByIntent,
  getDecisionMemoryByScenario,
  getDecisionMemoryByWorkspace,
  getDecisionMemoryByRisk,
  getDecisionMemoryByKPI,
  hasDecisionMemory,
  validateDecisionMemory,
  getExecutiveDecisionMemoryStatistics,
  inspectDecisionMemoryGraph,
  version: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
});
