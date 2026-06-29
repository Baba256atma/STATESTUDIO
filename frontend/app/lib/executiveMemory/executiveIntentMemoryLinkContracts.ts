/**
 * APP-4:5 — Executive Intent ↔ Memory linking contracts.
 * Canonical APP-4:5 contract surface — extends APP-3 and APP-4:1 through APP-4:4 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_INTENT_CONTRACT_VERSION } from "../executiveIntent/executiveIntentConstants.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import {
  EXECUTIVE_INTENT_MEMORY_LINK_ARCHITECTURE_VERSION,
  EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  EXECUTIVE_INTENT_MEMORY_LINK_TAGS,
} from "./executiveIntentMemoryLinkConstants.ts";

export {
  createExecutiveIntentMemoryLink,
  createExecutiveIntentMemoryLinkMetadata,
  createExecutiveIntentMemoryLinkVersion,
  applyExecutiveIntentMemoryLinkUpdate,
  ExecutiveIntentMemoryLinkBuilder,
} from "./executiveIntentMemoryLinkModel.ts";

export {
  registerExecutiveIntentLinkTarget,
  isExecutiveIntentLinkTargetRegistered,
  getExecutiveIntentLinkTarget,
  listRegisteredExecutiveIntentLinkTargets,
  ExecutiveIntentLinkTargetRegistry,
} from "./executiveIntentMemoryLinkIntentRegistry.ts";

export {
  validateExecutiveIntentMemoryLink,
  validateExecutiveIntentMemoryLinkQuery,
  ExecutiveIntentMemoryLinkValidator,
} from "./executiveIntentMemoryLinkValidator.ts";

export {
  inspectExecutiveIntentMemoryLinkGraph,
  ExecutiveIntentMemoryLinkGraphInspector,
} from "./executiveIntentMemoryLinkGraph.ts";

export {
  computeExecutiveIntentMemoryLinkStatistics,
  ExecutiveIntentMemoryLinkStatisticsService,
} from "./executiveIntentMemoryLinkStatistics.ts";

export {
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
  ExecutiveIntentMemoryLinkRepository,
} from "./executiveIntentMemoryLinkRepository.ts";

export {
  initializeExecutiveIntentMemoryLinkEngine,
  isExecutiveIntentMemoryLinkEngineInitialized,
  getExecutiveIntentMemoryLinkEngineState,
  resetExecutiveIntentMemoryLinkEngineForTests,
  getExecutiveIntentMemoryLinkStatistics,
  inspectIntentMemoryLinkGraph,
  ExecutiveIntentMemoryLinkEngine,
} from "./executiveIntentMemoryLinkEngine.ts";

export {
  createExecutiveIntentMemoryLinkError,
  executiveIntentMemoryLinkErrorFromCode,
  EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES,
} from "./executiveIntentMemoryLinkErrors.ts";

export type {
  CreateExecutiveIntentMemoryLinkInput,
  ExecutiveIntentLinkTargetRegistration,
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkEngineState,
  ExecutiveIntentMemoryLinkError,
  ExecutiveIntentMemoryLinkGraph,
  ExecutiveIntentMemoryLinkGraphEdge,
  ExecutiveIntentMemoryLinkId,
  ExecutiveIntentMemoryLinkMetadata,
  ExecutiveIntentMemoryLinkQuery,
  ExecutiveIntentMemoryLinkRelationship,
  ExecutiveIntentMemoryLinkResult,
  ExecutiveIntentMemoryLinkState,
  ExecutiveIntentMemoryLinkStatistics,
  ExecutiveIntentMemoryLinkType,
  ExecutiveIntentMemoryLinkVersion,
  UpdateExecutiveIntentMemoryLinkInput,
} from "./executiveIntentMemoryLinkTypes.ts";

export const EXECUTIVE_INTENT_MEMORY_LINK_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/5" as const,
  title: "Executive Intent ↔ Memory Linking",
  linkContractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  intentContractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_INTENT_MEMORY_LINK_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_INTENT_MEMORY_LINK_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/5",
  title: "Executive Intent ↔ Memory Linking",
  goal: "Deterministic structured links between Executive Intent and Executive Memory — relationship management only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkConstants.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkTypes.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkErrors.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkModel.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkIntentRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkValidator.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkGraph.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkRepository.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkEngine.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkContracts.ts",
    "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkContracts.test.ts",
    "docs/app-4-5-executive-intent-memory-linking-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "semanticSearch",
    "vectorSearch",
    "embedding",
    "MemoryRanking",
    "recommendation",
    "naturalLanguage",
  ]),
  prerequisites: Object.freeze(["APP-3", "APP-4/1", "APP-4/2", "APP-4/3", "APP-4/4", "APP-1", "APP-2"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INTENT_MEMORY_LINK_TAGS,
} satisfies StageManifest);

export const ExecutiveIntentMemoryLinkContracts = Object.freeze({
  identity: EXECUTIVE_INTENT_MEMORY_LINK_IDENTITY,
  manifest: EXECUTIVE_INTENT_MEMORY_LINK_SELF_MANIFEST,
  version: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  tags: EXECUTIVE_INTENT_MEMORY_LINK_TAGS,
});
