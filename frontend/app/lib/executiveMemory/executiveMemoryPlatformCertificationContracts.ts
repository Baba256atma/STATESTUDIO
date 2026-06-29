/**
 * APP-4:13 — Executive Memory Platform Certification contracts.
 * Canonical APP-4:13 contract surface — extends APP-4:1 through APP-4:12 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
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
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES,
  EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY,
} from "./executiveMemoryPlatformCertificationConstants.ts";

export {
  ExecutiveMemoryPlatformCertificationPhaseChecks,
  resetExecutiveMemoryPlatformCertificationEnvironment,
  certifyExecutiveMemoryFoundationPhase,
  certifyExecutiveMemoryRecordPhase,
  certifyExecutiveMemoryStoragePhase,
  certifyExecutiveMemoryRetrievalPhase,
  certifyExecutiveIntentMemoryLinkPhase,
  certifyExecutiveScenarioMemoryPhase,
  certifyExecutiveDecisionMemoryPhase,
  certifyExecutiveContextMemoryPhase,
  certifyExecutiveMemorySearchRankingPhase,
  certifyExecutiveMemoryLifecyclePhase,
  certifyExecutiveAssistantMemoryIntegrationPhase,
  certifyExecutiveMemoryDashboardPhase,
  certifyExecutiveMemoryPlatformEndToEnd,
  validateExecutiveMemoryPlatformArchitectureBoundaries,
} from "./executiveMemoryPlatformCertificationPhaseChecks.ts";

export {
  ExecutiveMemoryPlatformRegression,
  runExecutiveMemoryPlatformRegression,
} from "./executiveMemoryPlatformRegression.ts";

export {
  ExecutiveMemoryPlatformCertification,
  runExecutiveMemoryPlatformCertification,
} from "./executiveMemoryPlatformCertification.ts";

export {
  ExecutiveMemoryPlatformCertificationManifestBuilder,
  buildExecutiveMemoryPlatformCertificationManifest,
} from "./executiveMemoryPlatformCertificationManifest.ts";

export {
  ExecutiveMemoryPlatformCertificationRunner,
  initializeExecutiveMemoryPlatformCertificationEngine,
  isExecutiveMemoryPlatformCertificationEngineInitialized,
  resetExecutiveMemoryPlatformCertificationEngineForTests,
  runExecutiveMemoryPlatformCertificationSuite,
  runExecutiveMemoryPlatformRegressionOnly,
} from "./executiveMemoryPlatformCertificationRunner.ts";

export type {
  ExecutiveMemoryPlatformCertificationCheck,
  ExecutiveMemoryPlatformCertificationGateId,
  ExecutiveMemoryPlatformCertificationManifest,
  ExecutiveMemoryPlatformCertificationPerformance,
  ExecutiveMemoryPlatformCertificationResult,
  ExecutiveMemoryPlatformCertificationRunResult,
  ExecutiveMemoryPlatformCompatibilityValidation,
  ExecutiveMemoryPlatformPhaseCertificationResult,
  ExecutiveMemoryPlatformRegressionPhase,
  ExecutiveMemoryPlatformRegressionResult,
} from "./executiveMemoryPlatformCertificationTypes.ts";

export const EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/13" as const,
  title: "Executive Memory Platform Certification & Regression",
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
  architectureVersion: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/13",
  title: "Executive Memory Platform Certification & Regression",
  goal: "Official platform certification, regression validation, and release readiness for APP-4.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationManifest.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationPhaseChecks.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformRegression.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertification.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationRunner.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertificationContracts.test.ts",
    "docs/app-4-13-executive-memory-platform-certification-report.md",
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
    "APP-2",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export const ExecutiveMemoryPlatformCertificationContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_IDENTITY,
  manifest: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
  phaseRegistry: EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY,
  certificationTestFiles: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES,
  documentationFiles: EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES,
});
