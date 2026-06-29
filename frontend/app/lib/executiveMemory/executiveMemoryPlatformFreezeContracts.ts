/**
 * APP-4:14 — Executive Memory Platform Freeze contracts.
 * Canonical APP-4:14 contract surface — extends APP-4:1 through APP-4:13 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./executiveMemoryPlatformCertificationConstants.ts";
import { EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION } from "./executiveMemoryDashboardConstants.ts";
import { EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION } from "./executiveAssistantMemoryIntegrationConstants.ts";
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
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_TEST_FILES,
  EXECUTIVE_MEMORY_PLATFORM_FUTURE_EXTENSION_POLICY,
  EXECUTIVE_MEMORY_PLATFORM_NAME,
  EXECUTIVE_MEMORY_PLATFORM_RELEASE_TAG,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED,
  EXECUTIVE_MEMORY_PLATFORM_VERSION,
} from "./executiveMemoryPlatformFreezeConstants.ts";

export {
  ExecutiveMemoryPlatformFreezeRegistry,
  buildExecutiveMemoryPlatformRegistry,
  buildExecutiveMemoryPlatformPublicApiRegistry,
  buildExecutiveMemoryPlatformContractRegistry,
  buildExecutiveMemoryPlatformCompatibilityRegistry,
  buildExecutiveMemoryPlatformExtensionRegistry,
  buildExecutiveMemoryPlatformCertificationRegistry,
} from "./executiveMemoryPlatformFreezeRegistry.ts";

export {
  ExecutiveMemoryPlatformFreezeManifestBuilder,
  buildExecutiveMemoryPlatformFreezeManifest,
} from "./executiveMemoryPlatformFreezeManifest.ts";

export {
  ExecutiveMemoryPlatformFreezeCertification,
  runExecutiveMemoryPlatformFreezeCertification,
} from "./executiveMemoryPlatformFreezeCertification.ts";

export {
  ExecutiveMemoryPlatformFreezeRunner,
  initializeExecutiveMemoryPlatformFreezeEngine,
  isExecutiveMemoryPlatformFreezeEngineInitialized,
  resetExecutiveMemoryPlatformFreezeEngineForTests,
  runExecutiveMemoryPlatformFreezeSuite,
  getExecutiveMemoryPlatformFreezeManifest,
} from "./executiveMemoryPlatformFreezeRunner.ts";

export type {
  ExecutiveMemoryPlatformCompatibilityGuarantee,
  ExecutiveMemoryPlatformContractRegistryEntry,
  ExecutiveMemoryPlatformExtensionPoint,
  ExecutiveMemoryPlatformFreezeCertificationResult,
  ExecutiveMemoryPlatformFreezeCheck,
  ExecutiveMemoryPlatformFreezeManifest,
  ExecutiveMemoryPlatformFreezeRunResult,
  ExecutiveMemoryPlatformFreezeStatus,
  ExecutiveMemoryPlatformPublicApiEntry,
  ExecutiveMemoryPlatformRegistryEntry,
} from "./executiveMemoryPlatformFreezeTypes.ts";

export const EXECUTIVE_MEMORY_PLATFORM_FREEZE_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/14" as const,
  title: "Executive Memory Platform Freeze",
  freezeContractVersion: EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
  certificationContractVersion: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  dashboardContractVersion: EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION,
  assistantIntegrationContractVersion: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
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
  architectureVersion: EXECUTIVE_MEMORY_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/14",
  title: "Executive Memory Platform Freeze",
  goal: "Official immutable release freeze of the certified Executive Memory Platform.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeManifest.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeCertification.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeRunner.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeContracts.test.ts",
    "docs/app-4-14-executive-memory-platform-freeze-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "components/",
    ".tsx",
    "semanticSearch",
    "vectorSearch",
    "embedding",
    "recommendation",
    "learning",
    "llm",
    "createExecutiveMemory",
    "deleteExecutiveMemory",
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
    "APP-4/11",
    "APP-4/12",
    "APP-4/13",
    "APP-2",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
} satisfies StageManifest);

export const ExecutiveMemoryPlatformFreezeContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_PLATFORM_FREEZE_IDENTITY,
  manifest: EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
  platformName: EXECUTIVE_MEMORY_PLATFORM_NAME,
  platformVersion: EXECUTIVE_MEMORY_PLATFORM_VERSION,
  releaseTag: EXECUTIVE_MEMORY_PLATFORM_RELEASE_TAG,
  platformStatus: Object.freeze({
    certified: EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED,
    frozen: EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN,
    released: EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED,
  }),
  futureExtensionPolicy: EXECUTIVE_MEMORY_PLATFORM_FUTURE_EXTENSION_POLICY,
  freezeTestFiles: EXECUTIVE_MEMORY_PLATFORM_FREEZE_TEST_FILES,
  documentationFiles: EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES,
});
