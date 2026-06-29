/**
 * APP-4:11 — Executive Assistant Memory Integration Engine.
 */

import { EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION } from "./executiveAssistantMemoryIntegrationConstants.ts";
import {
  validateAssistantMemoryAccess,
  evaluateExecutiveAssistantMemoryPermission,
} from "./executiveAssistantMemoryIntegrationAccessValidator.ts";
import {
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
} from "./executiveAssistantMemoryIntegrationCitationBuilder.ts";
import {
  retrieveAssistantMemory,
  retrieveAssistantMemoryByIntent,
  retrieveAssistantMemoryByDecision,
  retrieveAssistantMemoryByScenario,
  retrieveAssistantMemoryByContext,
  retrieveAssistantMemoryByWorkspace,
} from "./executiveAssistantMemoryIntegrationGateway.ts";
import {
  listAssistantRetrievalProfiles,
  resetExecutiveAssistantRetrievalProfilesForTests,
} from "./executiveAssistantMemoryIntegrationProfileRegistry.ts";
import {
  getAssistantMemoryIntegrationStatistics,
  resetExecutiveAssistantMemoryIntegrationStatisticsForTests,
} from "./executiveAssistantMemoryIntegrationStatistics.ts";
import type { ExecutiveAssistantMemoryIntegrationEngineState } from "./executiveAssistantMemoryIntegrationTypes.ts";

let initialized = false;

export function initializeExecutiveAssistantMemoryIntegrationEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveAssistantMemoryIntegrationEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Assistant Memory integration engine initialized.",
    state: getExecutiveAssistantMemoryIntegrationEngineState(timestamp),
  });
}

export function isExecutiveAssistantMemoryIntegrationEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveAssistantMemoryIntegrationEngineState(
  timestamp: string
): ExecutiveAssistantMemoryIntegrationEngineState {
  return Object.freeze({
    engineId: "executive-assistant-memory-integration-engine",
    contractVersion: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
    initialized,
    retrievalProfileCount: listAssistantRetrievalProfiles().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveAssistantMemoryIntegrationEngineForTests(): void {
  initialized = false;
  resetExecutiveAssistantRetrievalProfilesForTests();
  resetExecutiveAssistantMemoryIntegrationStatisticsForTests();
}

export {
  retrieveAssistantMemory,
  retrieveAssistantMemoryByIntent,
  retrieveAssistantMemoryByDecision,
  retrieveAssistantMemoryByScenario,
  retrieveAssistantMemoryByContext,
  retrieveAssistantMemoryByWorkspace,
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
  validateAssistantMemoryAccess,
  evaluateExecutiveAssistantMemoryPermission,
  getAssistantMemoryIntegrationStatistics,
  listAssistantRetrievalProfiles,
};

export const ExecutiveAssistantMemoryIntegrationEngine = Object.freeze({
  initializeExecutiveAssistantMemoryIntegrationEngine,
  isExecutiveAssistantMemoryIntegrationEngineInitialized,
  getExecutiveAssistantMemoryIntegrationEngineState,
  resetExecutiveAssistantMemoryIntegrationEngineForTests,
  retrieveAssistantMemory,
  retrieveAssistantMemoryByIntent,
  retrieveAssistantMemoryByDecision,
  retrieveAssistantMemoryByScenario,
  retrieveAssistantMemoryByContext,
  retrieveAssistantMemoryByWorkspace,
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
  validateAssistantMemoryAccess,
  evaluateExecutiveAssistantMemoryPermission,
  getAssistantMemoryIntegrationStatistics,
  listAssistantRetrievalProfiles,
  version: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
});
