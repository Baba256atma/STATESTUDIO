/**
 * APP-4:7 — Executive Decision Memory contracts.
 * Canonical APP-4:7 contract surface — extends APP-4:1 through APP-4:6 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION } from "./executiveScenarioMemoryConstants.ts";
import { EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION } from "./executiveIntentMemoryLinkConstants.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import {
  EXECUTIVE_DECISION_MEMORY_ARCHITECTURE_VERSION,
  EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_DECISION_MEMORY_TAGS,
} from "./executiveDecisionMemoryConstants.ts";

export {
  ExecutiveDecisionMemoryBuilder,
  createExecutiveDecisionMemory,
  createExecutiveDecisionMemoryMetadata,
  createExecutiveDecisionMemoryVersion,
  createExecutiveDecisionMemoryReference,
  createExecutiveDecisionEvidence,
  createExecutiveDecisionOutcome,
  createExecutiveDecisionRationale,
  createExecutiveDecisionConstraint,
  createExecutiveDecisionAlternative,
  createExecutiveDecisionConfidence,
  createExecutiveDecisionReview,
  applyExecutiveDecisionMemoryUpdate,
} from "./executiveDecisionMemoryModel.ts";

export {
  registerExecutiveDecisionTarget,
  isExecutiveDecisionTargetRegistered,
  getExecutiveDecisionTarget,
  ExecutiveDecisionTargetRegistry,
} from "./executiveDecisionMemoryDecisionRegistry.ts";

export {
  validateExecutiveDecisionMemory,
  ExecutiveDecisionMemoryValidator,
} from "./executiveDecisionMemoryValidator.ts";

export {
  inspectExecutiveDecisionMemoryGraph,
  ExecutiveDecisionMemoryGraphInspector,
} from "./executiveDecisionMemoryGraph.ts";

export {
  computeExecutiveDecisionMemoryStatistics,
  ExecutiveDecisionMemoryStatisticsService,
} from "./executiveDecisionMemoryStatistics.ts";

export {
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
  ExecutiveDecisionMemoryRepository,
} from "./executiveDecisionMemoryRepository.ts";

export {
  initializeExecutiveDecisionMemoryEngine,
  isExecutiveDecisionMemoryEngineInitialized,
  getExecutiveDecisionMemoryEngineState,
  resetExecutiveDecisionMemoryEngineForTests,
  getExecutiveDecisionMemoryStatistics,
  inspectDecisionMemoryGraph,
  ExecutiveDecisionMemoryEngine,
} from "./executiveDecisionMemoryEngine.ts";

export {
  createExecutiveDecisionMemoryError,
  executiveDecisionMemoryErrorFromCode,
  EXECUTIVE_DECISION_MEMORY_ERROR_CODES,
} from "./executiveDecisionMemoryErrors.ts";

export type {
  CreateExecutiveDecisionMemoryInput,
  ExecutiveDecisionAlternative,
  ExecutiveDecisionConfidence,
  ExecutiveDecisionConstraint,
  ExecutiveDecisionEvidence,
  ExecutiveDecisionMemory,
  ExecutiveDecisionMemoryEngineState,
  ExecutiveDecisionMemoryError,
  ExecutiveDecisionMemoryGraph,
  ExecutiveDecisionMemoryId,
  ExecutiveDecisionMemoryMetadata,
  ExecutiveDecisionMemoryQuery,
  ExecutiveDecisionMemoryReference,
  ExecutiveDecisionMemoryResult,
  ExecutiveDecisionMemoryState,
  ExecutiveDecisionMemoryStatistics,
  ExecutiveDecisionMemoryVersion,
  ExecutiveDecisionOutcome,
  ExecutiveDecisionRationale,
  ExecutiveDecisionReview,
  ExecutiveDecisionTargetRegistration,
  UpdateExecutiveDecisionMemoryInput,
} from "./executiveDecisionMemoryTypes.ts";

export const EXECUTIVE_DECISION_MEMORY_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/7" as const,
  title: "Executive Decision Memory",
  decisionMemoryContractVersion: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  scenarioMemoryContractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  intentMemoryLinkContractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_DECISION_MEMORY_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_DECISION_MEMORY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/7",
  title: "Executive Decision Memory",
  goal: "Deterministic decision memory records bridging executive decisions and APP-4 Executive Memory.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryConstants.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryTypes.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryErrors.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryModel.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryDecisionRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryValidator.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryGraph.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryRepository.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryEngine.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryContracts.ts",
    "frontend/app/lib/executiveMemory/executiveDecisionMemoryContracts.test.ts",
    "docs/app-4-7-decision-memory-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "semanticSearch",
    "recommendation",
    "decisionExecution",
    "decisionGeneration",
    "vectorSearch",
    "learning",
  ]),
  prerequisites: Object.freeze([
    "APP-4/1",
    "APP-4/2",
    "APP-4/3",
    "APP-4/4",
    "APP-4/5",
    "APP-4/6",
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_DECISION_MEMORY_TAGS,
} satisfies StageManifest);

export const ExecutiveDecisionMemoryContracts = Object.freeze({
  identity: EXECUTIVE_DECISION_MEMORY_IDENTITY,
  manifest: EXECUTIVE_DECISION_MEMORY_SELF_MANIFEST,
  version: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  tags: EXECUTIVE_DECISION_MEMORY_TAGS,
});
