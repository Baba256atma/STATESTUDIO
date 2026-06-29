/**
 * APP-4:8 — Executive Context Memory Engine.
 */

import { EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION } from "./executiveContextMemoryConstants.ts";
import { inspectExecutiveContextMemoryGraph } from "./executiveContextMemoryGraph.ts";
import {
  registerExecutiveContextWorkspace,
  resetExecutiveContextWorkspaceRegistryForTests,
  listRegisteredExecutiveContextWorkspaces,
} from "./executiveContextMemoryWorkspaceRegistry.ts";
import { resetExecutiveContextMemoryRegistryForTests } from "./executiveContextMemoryRegistry.ts";
import {
  archiveContextMemory,
  createContextMemory,
  getContextMemories,
  getContextMemoryByBusinessContext,
  getContextMemoryByDecision,
  getContextMemoryByExternalEvent,
  getContextMemoryByGoal,
  getContextMemoryById,
  getContextMemoryByIntent,
  getContextMemoryByScenario,
  getContextMemoryByStakeholder,
  getContextMemoryByWorkspace,
  hasContextMemory,
  restoreContextMemory,
  updateContextMemory,
  validateContextMemory,
} from "./executiveContextMemoryRepository.ts";
import { computeExecutiveContextMemoryStatistics } from "./executiveContextMemoryStatistics.ts";
import type { ExecutiveContextMemoryEngineState } from "./executiveContextMemoryTypes.ts";

let initialized = false;

export function initializeExecutiveContextMemoryEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveContextMemoryEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Context Memory engine initialized.",
    state: getExecutiveContextMemoryEngineState(timestamp),
  });
}

export function isExecutiveContextMemoryEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveContextMemoryEngineState(
  timestamp: string
): ExecutiveContextMemoryEngineState {
  const stats = computeExecutiveContextMemoryStatistics();
  return Object.freeze({
    engineId: "executive-context-memory-engine",
    contractVersion: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
    initialized,
    memoryCount: stats.totalMemories,
    registeredWorkspaceCount: listRegisteredExecutiveContextWorkspaces().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveContextMemoryEngineForTests(): void {
  initialized = false;
  resetExecutiveContextMemoryRegistryForTests();
  resetExecutiveContextWorkspaceRegistryForTests();
}

export {
  registerExecutiveContextWorkspace,
  createContextMemory,
  updateContextMemory,
  archiveContextMemory,
  restoreContextMemory,
  getContextMemoryById,
  getContextMemories,
  getContextMemoryByWorkspace,
  getContextMemoryByGoal,
  getContextMemoryByIntent,
  getContextMemoryByScenario,
  getContextMemoryByDecision,
  getContextMemoryByBusinessContext,
  getContextMemoryByStakeholder,
  getContextMemoryByExternalEvent,
  hasContextMemory,
  validateContextMemory,
};

export function getExecutiveContextMemoryStatistics() {
  return computeExecutiveContextMemoryStatistics();
}

export function inspectContextMemoryGraph(input: Parameters<typeof inspectExecutiveContextMemoryGraph>[0]) {
  return inspectExecutiveContextMemoryGraph(input);
}

export const ExecutiveContextMemoryEngine = Object.freeze({
  initializeExecutiveContextMemoryEngine,
  isExecutiveContextMemoryEngineInitialized,
  getExecutiveContextMemoryEngineState,
  resetExecutiveContextMemoryEngineForTests,
  registerExecutiveContextWorkspace,
  createContextMemory,
  updateContextMemory,
  archiveContextMemory,
  restoreContextMemory,
  getContextMemoryById,
  getContextMemories,
  getContextMemoryByWorkspace,
  getContextMemoryByGoal,
  getContextMemoryByIntent,
  getContextMemoryByScenario,
  getContextMemoryByDecision,
  getContextMemoryByBusinessContext,
  getContextMemoryByStakeholder,
  getContextMemoryByExternalEvent,
  hasContextMemory,
  validateContextMemory,
  getExecutiveContextMemoryStatistics,
  inspectContextMemoryGraph,
  version: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
});
