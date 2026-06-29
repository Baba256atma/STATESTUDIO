/**
 * APP-4:5 — Executive Intent ↔ Memory Link Engine.
 * Official linking entry point — extends APP-3 and APP-4:1 through APP-4:4 only.
 */

import { EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION } from "./executiveIntentMemoryLinkConstants.ts";
import { inspectExecutiveIntentMemoryLinkGraph } from "./executiveIntentMemoryLinkGraph.ts";
import {
  listRegisteredExecutiveIntentLinkTargets,
  registerExecutiveIntentLinkTarget,
  resetExecutiveIntentLinkTargetRegistryForTests,
} from "./executiveIntentMemoryLinkIntentRegistry.ts";
import {
  archiveIntentMemoryLink,
  createIntentMemoryLink,
  getIntentMemoryLinkById,
  getIntentMemoryLinks,
  getIntentMemoryLinksByDecision,
  getIntentMemoryLinksByGoal,
  getIntentMemoryLinksByIntent,
  getIntentMemoryLinksByMemory,
  getIntentMemoryLinksByScenario,
  hasIntentMemoryLink,
  removeIntentMemoryLink,
  restoreIntentMemoryLink,
  updateIntentMemoryLink,
  validateIntentMemoryLink,
} from "./executiveIntentMemoryLinkRepository.ts";
import { resetExecutiveIntentMemoryLinkRegistryForTests } from "./executiveIntentMemoryLinkRegistry.ts";
import { computeExecutiveIntentMemoryLinkStatistics } from "./executiveIntentMemoryLinkStatistics.ts";
import type {
  CreateExecutiveIntentMemoryLinkInput,
  ExecutiveIntentLinkTargetRegistration,
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkEngineState,
  ExecutiveIntentMemoryLinkId,
  ExecutiveIntentMemoryLinkQuery,
  ExecutiveIntentMemoryLinkResult,
  UpdateExecutiveIntentMemoryLinkInput,
} from "./executiveIntentMemoryLinkTypes.ts";
import type { IntentIdentifier } from "../executiveIntent/executiveIntentTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

let initialized = false;

export function initializeExecutiveIntentMemoryLinkEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveIntentMemoryLinkEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Intent ↔ Memory link engine initialized.",
    state: getExecutiveIntentMemoryLinkEngineState(timestamp),
  });
}

export function isExecutiveIntentMemoryLinkEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveIntentMemoryLinkEngineState(
  timestamp: string
): ExecutiveIntentMemoryLinkEngineState {
  const stats = computeExecutiveIntentMemoryLinkStatistics();
  return Object.freeze({
    engineId: "executive-intent-memory-link-engine",
    contractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
    initialized,
    linkCount: stats.totalLinks,
    registeredIntentCount: listRegisteredExecutiveIntentLinkTargets().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveIntentMemoryLinkEngineForTests(): void {
  initialized = false;
  resetExecutiveIntentMemoryLinkRegistryForTests();
  resetExecutiveIntentLinkTargetRegistryForTests();
}

export {
  registerExecutiveIntentLinkTarget,
  createIntentMemoryLink,
  updateIntentMemoryLink,
  removeIntentMemoryLink,
  archiveIntentMemoryLink,
  restoreIntentMemoryLink,
  getIntentMemoryLinkById,
  getIntentMemoryLinks,
  getIntentMemoryLinksByIntent,
  getIntentMemoryLinksByMemory,
  getIntentMemoryLinksByGoal,
  getIntentMemoryLinksByScenario,
  getIntentMemoryLinksByDecision,
  hasIntentMemoryLink,
  validateIntentMemoryLink,
};

export function getExecutiveIntentMemoryLinkStatistics() {
  return computeExecutiveIntentMemoryLinkStatistics();
}

export function inspectIntentMemoryLinkGraph(input: {
  intentId?: IntentIdentifier;
  memoryId?: ExecutiveMemoryId;
  lifecycle?: "active" | "archived";
}) {
  return inspectExecutiveIntentMemoryLinkGraph(input);
}

export const ExecutiveIntentMemoryLinkEngine = Object.freeze({
  initializeExecutiveIntentMemoryLinkEngine,
  isExecutiveIntentMemoryLinkEngineInitialized,
  getExecutiveIntentMemoryLinkEngineState,
  resetExecutiveIntentMemoryLinkEngineForTests,
  registerExecutiveIntentLinkTarget,
  createIntentMemoryLink,
  updateIntentMemoryLink,
  removeIntentMemoryLink,
  archiveIntentMemoryLink,
  restoreIntentMemoryLink,
  getIntentMemoryLinkById,
  getIntentMemoryLinks,
  getIntentMemoryLinksByIntent,
  getIntentMemoryLinksByMemory,
  getIntentMemoryLinksByGoal,
  getIntentMemoryLinksByScenario,
  getIntentMemoryLinksByDecision,
  hasIntentMemoryLink,
  validateIntentMemoryLink,
  getExecutiveIntentMemoryLinkStatistics,
  inspectIntentMemoryLinkGraph,
  version: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
});

export type {
  CreateExecutiveIntentMemoryLinkInput,
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkId,
  ExecutiveIntentMemoryLinkQuery,
  ExecutiveIntentMemoryLinkResult,
  UpdateExecutiveIntentMemoryLinkInput,
  ExecutiveIntentLinkTargetRegistration,
};
