/**
 * APP-4:11 — Executive Assistant Memory Integration contracts.
 * Canonical APP-4:11 contract surface — extends APP-4:1 through APP-4:10 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION } from "./executiveMemoryLifecycleConstants.ts";
import { EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION } from "./executiveMemorySearchRankingConstants.ts";
import { EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION } from "./executiveContextMemoryConstants.ts";
import { EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION } from "./executiveDecisionMemoryConstants.ts";
import { EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION } from "./executiveScenarioMemoryConstants.ts";
import { EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION } from "./executiveIntentMemoryLinkConstants.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import {
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ARCHITECTURE_VERSION,
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_TAGS,
} from "./executiveAssistantMemoryIntegrationConstants.ts";

export {
  ExecutiveAssistantMemoryIntegrationBuilder,
  createExecutiveAssistantMemoryRequest,
  createExecutiveAssistantRetrievalProfile,
} from "./executiveAssistantMemoryIntegrationModel.ts";

export {
  ExecutiveAssistantRetrievalProfileRegistry,
  getAssistantRetrievalProfile,
  listAssistantRetrievalProfiles,
  resetExecutiveAssistantRetrievalProfilesForTests,
} from "./executiveAssistantMemoryIntegrationProfileRegistry.ts";

export {
  ExecutiveAssistantMemoryAccessValidator,
  validateAssistantMemoryAccess,
  evaluateExecutiveAssistantMemoryPermission,
  mapGovernanceStateLabel,
} from "./executiveAssistantMemoryIntegrationAccessValidator.ts";

export {
  ExecutiveAssistantMemoryCitationBuilder,
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
} from "./executiveAssistantMemoryIntegrationCitationBuilder.ts";

export {
  ExecutiveAssistantMemoryResolver,
  resolveAssistantMemorySearchQuery,
} from "./executiveAssistantMemoryIntegrationResolver.ts";

export {
  ExecutiveAssistantMemoryGateway,
  retrieveAssistantMemory,
  retrieveAssistantMemoryByIntent,
  retrieveAssistantMemoryByDecision,
  retrieveAssistantMemoryByScenario,
  retrieveAssistantMemoryByContext,
  retrieveAssistantMemoryByWorkspace,
} from "./executiveAssistantMemoryIntegrationGateway.ts";

export {
  ExecutiveAssistantMemoryStatisticsService,
  getAssistantMemoryIntegrationStatistics,
  resetExecutiveAssistantMemoryIntegrationStatisticsForTests,
  recordExecutiveAssistantMemoryRetrieval,
} from "./executiveAssistantMemoryIntegrationStatistics.ts";

export {
  initializeExecutiveAssistantMemoryIntegrationEngine,
  isExecutiveAssistantMemoryIntegrationEngineInitialized,
  getExecutiveAssistantMemoryIntegrationEngineState,
  resetExecutiveAssistantMemoryIntegrationEngineForTests,
  ExecutiveAssistantMemoryIntegrationEngine,
} from "./executiveAssistantMemoryIntegrationEngine.ts";

export {
  createExecutiveAssistantMemoryIntegrationError,
  executiveAssistantMemoryIntegrationErrorFromCode,
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES,
} from "./executiveAssistantMemoryIntegrationErrors.ts";

export type {
  CreateExecutiveAssistantMemoryRequestInput,
  ExecutiveAssistantMemoryAccessResult,
  ExecutiveAssistantMemoryCitation,
  ExecutiveAssistantMemoryExplanation,
  ExecutiveAssistantMemoryIntegrationEngineState,
  ExecutiveAssistantMemoryIntegrationError,
  ExecutiveAssistantMemoryPermission,
  ExecutiveAssistantMemoryReference,
  ExecutiveAssistantMemoryRequest,
  ExecutiveAssistantMemoryResponse,
  ExecutiveAssistantMemorySelection,
  ExecutiveAssistantMemoryStatistics,
  ExecutiveAssistantRetrievalProfile,
} from "./executiveAssistantMemoryIntegrationTypes.ts";

export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/11" as const,
  title: "Executive Assistant Memory Integration",
  integrationContractVersion: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
  lifecycleContractVersion: EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
  searchRankingContractVersion: EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
  contextMemoryContractVersion: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  decisionMemoryContractVersion: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  scenarioMemoryContractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  intentMemoryLinkContractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/11",
  title: "Executive Assistant Memory Integration",
  goal: "Read-only, deterministic integration between the Executive Assistant and Executive Memory Platform.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationConstants.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationTypes.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationErrors.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationModel.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationProfileRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationAccessValidator.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationCitationBuilder.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationResolver.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationGateway.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationEngine.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationContracts.ts",
    "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationContracts.test.ts",
    "docs/app-4-11-executive-assistant-memory-integration-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "dashboard/",
    "components/",
    ".tsx",
    "semanticSearch",
    "vectorSearch",
    "embedding",
    "recommendation",
    "learning",
    "llm",
    "writeMemory",
    "createExecutiveMemory",
  ]),
  prerequisites: Object.freeze([
    "APP-4/1",
    "APP-4/2",
    "APP-4/3",
    "APP-4/4",
    "APP-4/5",
    "APP-4/6",
    "APP-4/7",
    "APP-4/8",
    "APP-4/9",
    "APP-4/10",
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_TAGS,
} satisfies StageManifest);

export const ExecutiveAssistantMemoryIntegrationContracts = Object.freeze({
  identity: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_IDENTITY,
  manifest: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SELF_MANIFEST,
  version: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
  tags: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_TAGS,
});
