/**
 * APP-4:6 — Executive Scenario Memory contracts.
 * Canonical APP-4:6 contract surface — extends APP-2 and APP-4:1 through APP-4:5 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION } from "./executiveIntentMemoryLinkConstants.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import {
  EXECUTIVE_SCENARIO_MEMORY_ARCHITECTURE_VERSION,
  EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_SCENARIO_MEMORY_TAGS,
} from "./executiveScenarioMemoryConstants.ts";

export {
  ExecutiveScenarioMemoryBuilder,
  createExecutiveScenarioMemory,
  createExecutiveScenarioMemoryMetadata,
  createExecutiveScenarioMemoryVersion,
  createExecutiveScenarioMemoryReference,
  createExecutiveScenarioMemoryAssumption,
  createExecutiveScenarioMemoryOutcome,
  createExecutiveScenarioMemoryEvidence,
  createExecutiveScenarioDecisionPath,
  createExecutiveScenarioBusinessContext,
  applyExecutiveScenarioMemoryUpdate,
} from "./executiveScenarioMemoryModel.ts";

export {
  registerExecutiveScenarioTarget,
  isExecutiveScenarioTargetRegistered,
  getExecutiveScenarioTarget,
  ExecutiveScenarioTargetRegistry,
} from "./executiveScenarioMemoryScenarioRegistry.ts";

export {
  validateExecutiveScenarioMemory,
  ExecutiveScenarioMemoryValidator,
} from "./executiveScenarioMemoryValidator.ts";

export {
  inspectExecutiveScenarioMemoryGraph,
  ExecutiveScenarioMemoryGraphInspector,
} from "./executiveScenarioMemoryGraph.ts";

export {
  computeExecutiveScenarioMemoryStatistics,
  ExecutiveScenarioMemoryStatisticsService,
} from "./executiveScenarioMemoryStatistics.ts";

export {
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
  ExecutiveScenarioMemoryRepository,
} from "./executiveScenarioMemoryRepository.ts";

export {
  initializeExecutiveScenarioMemoryEngine,
  isExecutiveScenarioMemoryEngineInitialized,
  getExecutiveScenarioMemoryEngineState,
  resetExecutiveScenarioMemoryEngineForTests,
  getExecutiveScenarioMemoryStatistics,
  inspectScenarioMemoryGraph,
  ExecutiveScenarioMemoryEngine,
} from "./executiveScenarioMemoryEngine.ts";

export {
  createExecutiveScenarioMemoryError,
  executiveScenarioMemoryErrorFromCode,
  EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES,
} from "./executiveScenarioMemoryErrors.ts";

export type {
  CreateExecutiveScenarioMemoryInput,
  ExecutiveScenarioBusinessContext,
  ExecutiveScenarioDecisionPath,
  ExecutiveScenarioMemory,
  ExecutiveScenarioMemoryAssumption,
  ExecutiveScenarioMemoryEngineState,
  ExecutiveScenarioMemoryError,
  ExecutiveScenarioMemoryEvidence,
  ExecutiveScenarioMemoryGraph,
  ExecutiveScenarioMemoryId,
  ExecutiveScenarioMemoryMetadata,
  ExecutiveScenarioMemoryOutcome,
  ExecutiveScenarioMemoryQuery,
  ExecutiveScenarioMemoryReference,
  ExecutiveScenarioMemoryResult,
  ExecutiveScenarioMemoryState,
  ExecutiveScenarioMemoryStatistics,
  ExecutiveScenarioMemoryVersion,
  ExecutiveScenarioTargetRegistration,
  UpdateExecutiveScenarioMemoryInput,
} from "./executiveScenarioMemoryTypes.ts";

export const EXECUTIVE_SCENARIO_MEMORY_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/6" as const,
  title: "Executive Scenario Memory",
  scenarioMemoryContractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  scenarioIntelligenceContractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  intentMemoryLinkContractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_SCENARIO_MEMORY_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_SCENARIO_MEMORY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/6",
  title: "Executive Scenario Memory",
  goal: "Deterministic scenario memory records bridging APP-2 Scenario Intelligence and APP-4 Executive Memory.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryConstants.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryTypes.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryErrors.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryModel.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryScenarioRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryValidator.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryGraph.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryRepository.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryEngine.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryContracts.ts",
    "frontend/app/lib/executiveMemory/executiveScenarioMemoryContracts.test.ts",
    "docs/app-4-6-scenario-memory-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "semanticSearch",
    "simulation",
    "scenarioGeneration",
    "vectorSearch",
    "recommendation",
  ]),
  prerequisites: Object.freeze([
    "APP-2",
    "APP-4/1",
    "APP-4/2",
    "APP-4/3",
    "APP-4/4",
    "APP-4/5",
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_SCENARIO_MEMORY_TAGS,
} satisfies StageManifest);

export const ExecutiveScenarioMemoryContracts = Object.freeze({
  identity: EXECUTIVE_SCENARIO_MEMORY_IDENTITY,
  manifest: EXECUTIVE_SCENARIO_MEMORY_SELF_MANIFEST,
  version: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  tags: EXECUTIVE_SCENARIO_MEMORY_TAGS,
});
