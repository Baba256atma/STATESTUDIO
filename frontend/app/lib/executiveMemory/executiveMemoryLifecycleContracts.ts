/**
 * APP-4:10 — Executive Memory Lifecycle contracts.
 * Canonical APP-4:10 contract surface — extends APP-4:1 through APP-4:9 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
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
  EXECUTIVE_MEMORY_LIFECYCLE_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_LIFECYCLE_TAGS,
} from "./executiveMemoryLifecycleConstants.ts";

export {
  ExecutiveMemoryLifecycleBuilder,
  createExecutiveMemoryLifecycle,
  createExecutiveMemoryLifecycleAuditMetadata,
  createExecutiveMemoryVersionRecord,
  createExecutiveMemoryVersionHistory,
  createExecutiveMemoryRetentionPolicy,
  createExecutiveMemoryMergeOperation,
  createExecutiveMemorySplitOperation,
  createExecutiveMemorySupersedeOperation,
  bumpExecutiveMemorySemanticVersion,
} from "./executiveMemoryLifecycleModel.ts";

export {
  ExecutiveMemoryLifecycleTransitions,
  isExecutiveMemoryLifecycleTransitionAllowed,
  listAllowedExecutiveMemoryLifecycleTransitions,
} from "./executiveMemoryLifecycleTransitions.ts";

export {
  ExecutiveMemoryLifecycleValidator,
  validateExecutiveMemoryLifecycleRecord,
  validateExecutiveMemoryLifecycleTransition,
  validateExecutiveMemoryVersionChain,
  validateExecutiveMemoryRetentionPolicy,
  validateMergeExecutiveMemoriesInput,
  validateSplitExecutiveMemoryInput,
  validateSupersedeExecutiveMemoryInput,
} from "./executiveMemoryLifecycleValidator.ts";

export {
  ExecutiveMemoryVersionManager,
  registerGovernedExecutiveMemory,
} from "./executiveMemoryLifecycleVersionManager.ts";

export {
  ExecutiveMemoryRetentionManager,
} from "./executiveMemoryLifecycleRetentionManager.ts";

export {
  ExecutiveMemoryMergeManager,
} from "./executiveMemoryLifecycleMergeManager.ts";

export {
  ExecutiveMemorySplitManager,
} from "./executiveMemoryLifecycleSplitManager.ts";

export {
  ExecutiveMemorySupersedeManager,
} from "./executiveMemoryLifecycleSupersedeManager.ts";

export {
  ExecutiveMemoryIntegrityInspector,
} from "./executiveMemoryLifecycleIntegrityInspector.ts";

export {
  ExecutiveMemoryLifecycleStatisticsService,
} from "./executiveMemoryLifecycleStatistics.ts";

export {
  ExecutiveMemoryLifecycleRepository,
} from "./executiveMemoryLifecycleRepository.ts";

export {
  initializeExecutiveMemoryLifecycleEngine,
  isExecutiveMemoryLifecycleEngineInitialized,
  getExecutiveMemoryLifecycleEngineState,
  resetExecutiveMemoryLifecycleEngineForTests,
  registerGovernedMemory,
  createMemoryVersion,
  getMemoryVersionHistory,
  getLatestVersion,
  compareVersions,
  mergeExecutiveMemories,
  splitExecutiveMemory,
  supersedeExecutiveMemory,
  restoreSupersededMemory,
  archiveMemoryLifecycle,
  restoreExecutiveMemoryVersion,
  applyRetentionPolicy,
  inspectMemoryIntegrity,
  validateMemoryLifecycle,
  validateMerge,
  validateSplit,
  inspectMergeHistory,
  inspectSplitHistory,
  getExecutiveMemoryLifecycleStatistics,
  getRetentionPolicies,
  registerRetentionPolicy,
  ExecutiveMemoryLifecycleEngine,
} from "./executiveMemoryLifecycleEngine.ts";

export {
  createExecutiveMemoryLifecycleError,
  executiveMemoryLifecycleErrorFromCode,
  EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES,
} from "./executiveMemoryLifecycleErrors.ts";

export type {
  CreateMemoryVersionInput,
  ExecutiveMemoryGovernanceState,
  ExecutiveMemoryIntegrityIssue,
  ExecutiveMemoryIntegrityReport,
  ExecutiveMemoryLifecycle,
  ExecutiveMemoryLifecycleAuditMetadata,
  ExecutiveMemoryLifecycleEngineState,
  ExecutiveMemoryLifecycleError,
  ExecutiveMemoryLifecycleResult,
  ExecutiveMemoryLifecycleStatistics,
  ExecutiveMemoryMergeOperation,
  ExecutiveMemoryRetentionPolicy,
  ExecutiveMemoryRetentionPolicyType,
  ExecutiveMemorySplitOperation,
  ExecutiveMemorySupersedeOperation,
  ExecutiveMemoryVersionComparison,
  ExecutiveMemoryVersionHistory,
  ExecutiveMemoryVersionOperation,
  ExecutiveMemoryVersionRecord,
  MergeExecutiveMemoriesInput,
  SplitExecutiveMemoryInput,
  SplitExecutiveMemoryTarget,
  SupersedeExecutiveMemoryInput,
} from "./executiveMemoryLifecycleTypes.ts";

export const EXECUTIVE_MEMORY_LIFECYCLE_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/10" as const,
  title: "Executive Memory Lifecycle Management",
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
  architectureVersion: EXECUTIVE_MEMORY_LIFECYCLE_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_LIFECYCLE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/10",
  title: "Executive Memory Lifecycle Management",
  goal: "Deterministic lifecycle governance for Executive Memory records.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleErrors.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleModel.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleTransitions.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleValidator.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleRetentionManager.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleVersionManager.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleMergeManager.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleSplitManager.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleSupersedeManager.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleIntegrityInspector.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleRepository.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleEngine.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryLifecycleContracts.test.ts",
    "docs/app-4-10-executive-memory-lifecycle-management-report.md",
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
    "recommendation",
    "learning",
    "automaticDeletion",
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
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_LIFECYCLE_TAGS,
} satisfies StageManifest);

export const ExecutiveMemoryLifecycleContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_LIFECYCLE_IDENTITY,
  manifest: EXECUTIVE_MEMORY_LIFECYCLE_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_LIFECYCLE_TAGS,
});
