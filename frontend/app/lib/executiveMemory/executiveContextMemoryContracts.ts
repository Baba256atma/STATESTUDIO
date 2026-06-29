/**
 * APP-4:8 — Executive Context Memory contracts.
 * Canonical APP-4:8 contract surface — extends APP-4:1 through APP-4:7 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION } from "./executiveDecisionMemoryConstants.ts";
import { EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION } from "./executiveScenarioMemoryConstants.ts";
import { EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION } from "./executiveIntentMemoryLinkConstants.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import {
  EXECUTIVE_CONTEXT_MEMORY_ARCHITECTURE_VERSION,
  EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_CONTEXT_MEMORY_TAGS,
} from "./executiveContextMemoryConstants.ts";

export {
  ExecutiveContextMemoryBuilder,
  createExecutiveContextMemory,
  createExecutiveContextMetadata,
  createExecutiveContextMemoryVersion,
  createExecutiveContextReference,
  createExecutiveBusinessContext,
  createExecutiveMarketContext,
  createExecutiveOrganizationContext,
  createExecutiveResourceContext,
  createExecutiveResourceEntry,
  createExecutiveStakeholderContext,
  createExecutivePolicyContext,
  createExecutivePolicyEntry,
  createExecutiveExternalContext,
  createExecutiveExternalEvent,
  createExecutiveContextSnapshot,
  applyExecutiveContextMemoryUpdate,
} from "./executiveContextMemoryModel.ts";

export {
  registerExecutiveContextWorkspace,
  isExecutiveContextWorkspaceRegistered,
  getExecutiveContextWorkspace,
  ExecutiveContextWorkspaceRegistry,
} from "./executiveContextMemoryWorkspaceRegistry.ts";

export {
  validateExecutiveContextMemory,
  ExecutiveContextMemoryValidator,
} from "./executiveContextMemoryValidator.ts";

export {
  inspectExecutiveContextMemoryGraph,
  ExecutiveContextMemoryGraphInspector,
} from "./executiveContextMemoryGraph.ts";

export {
  computeExecutiveContextMemoryStatistics,
  ExecutiveContextMemoryStatisticsService,
} from "./executiveContextMemoryStatistics.ts";

export {
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
  ExecutiveContextMemoryRepository,
} from "./executiveContextMemoryRepository.ts";

export {
  initializeExecutiveContextMemoryEngine,
  isExecutiveContextMemoryEngineInitialized,
  getExecutiveContextMemoryEngineState,
  resetExecutiveContextMemoryEngineForTests,
  getExecutiveContextMemoryStatistics,
  inspectContextMemoryGraph,
  ExecutiveContextMemoryEngine,
} from "./executiveContextMemoryEngine.ts";

export {
  createExecutiveContextMemoryError,
  executiveContextMemoryErrorFromCode,
  EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES,
} from "./executiveContextMemoryErrors.ts";

export type {
  CreateExecutiveContextMemoryInput,
  ExecutiveBusinessContext,
  ExecutiveContextMemory,
  ExecutiveContextMemoryEngineState,
  ExecutiveContextMemoryError,
  ExecutiveContextMemoryGraph,
  ExecutiveContextMemoryId,
  ExecutiveContextMemoryQuery,
  ExecutiveContextMemoryResult,
  ExecutiveContextMemoryVersion,
  ExecutiveContextMetadata,
  ExecutiveContextReference,
  ExecutiveContextSnapshot,
  ExecutiveContextState,
  ExecutiveContextStatistics,
  ExecutiveContextWorkspaceRegistration,
  ExecutiveExternalContext,
  ExecutiveExternalEvent,
  ExecutiveMarketContext,
  ExecutiveOrganizationContext,
  ExecutivePolicyContext,
  ExecutivePolicyEntry,
  ExecutiveResourceContext,
  ExecutiveResourceEntry,
  ExecutiveStakeholderContext,
  UpdateExecutiveContextMemoryInput,
} from "./executiveContextMemoryTypes.ts";

export const EXECUTIVE_CONTEXT_MEMORY_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/8" as const,
  title: "Executive Context Memory",
  contextMemoryContractVersion: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  decisionMemoryContractVersion: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  scenarioMemoryContractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  intentMemoryLinkContractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_CONTEXT_MEMORY_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_CONTEXT_MEMORY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/8",
  title: "Executive Context Memory",
  goal: "Deterministic context memory records preserving business circumstances surrounding executive activities.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveContextMemoryConstants.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryTypes.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryErrors.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryModel.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryWorkspaceRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryValidator.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryGraph.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryRepository.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryEngine.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryContracts.ts",
    "frontend/app/lib/executiveMemory/executiveContextMemoryContracts.test.ts",
    "docs/app-4-8-executive-context-memory-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "semanticSearch",
    "vectorSearch",
    "recommendation",
    "learning",
    "contextGeneration",
    "contextInference",
  ]),
  prerequisites: Object.freeze([
    "APP-4/1",
    "APP-4/2",
    "APP-4/3",
    "APP-4/4",
    "APP-4/5",
    "APP-4/6",
    "APP-4/7",
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_CONTEXT_MEMORY_TAGS,
} satisfies StageManifest);

export const ExecutiveContextMemoryContracts = Object.freeze({
  identity: EXECUTIVE_CONTEXT_MEMORY_IDENTITY,
  manifest: EXECUTIVE_CONTEXT_MEMORY_SELF_MANIFEST,
  version: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  tags: EXECUTIVE_CONTEXT_MEMORY_TAGS,
});
