/**
 * APP-4:12 — Executive Memory Dashboard contracts.
 * Canonical APP-4:12 contract surface — extends APP-4:1 through APP-4:11 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
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
  EXECUTIVE_MEMORY_DASHBOARD_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS,
  EXECUTIVE_MEMORY_DASHBOARD_TAGS,
} from "./executiveMemoryDashboardConstants.ts";

export {
  ExecutiveMemoryDashboardProvider,
  loadExecutiveMemoryDashboardSources,
} from "./executiveMemoryDashboardProvider.ts";

export {
  ExecutiveMemoryDashboardAggregator,
  aggregateExecutiveMemoryDashboardSummary,
  aggregateExecutiveMemoryDashboardIntegrity,
  aggregateExecutiveMemoryDashboardWorkspaceSummary,
  aggregateExecutiveMemoryDashboardCategorySummary,
  aggregateExecutiveMemoryDashboardLifecycleSummary,
  aggregateExecutiveMemoryDashboardSearchSummary,
  aggregateExecutiveMemoryDashboardAssistantSummary,
  aggregateExecutiveMemoryDashboardUsage,
} from "./executiveMemoryDashboardAggregator.ts";

export {
  ExecutiveMemoryDashboardHealthAnalyzer,
  analyzeExecutiveMemoryDashboardHealth,
} from "./executiveMemoryDashboardHealthAnalyzer.ts";

export {
  ExecutiveMemoryDashboardValidator,
  validateExecutiveMemoryDashboard,
} from "./executiveMemoryDashboardValidator.ts";

export {
  ExecutiveMemoryDashboardStatisticsService,
  getExecutiveMemoryDashboardStatistics,
  resetExecutiveMemoryDashboardStatisticsForTests,
} from "./executiveMemoryDashboardStatistics.ts";

export {
  initializeExecutiveMemoryDashboardEngine,
  isExecutiveMemoryDashboardEngineInitialized,
  getExecutiveMemoryDashboardEngineState,
  resetExecutiveMemoryDashboardEngineForTests,
  getExecutiveMemoryDashboard,
  getExecutiveMemorySummary,
  getExecutiveMemoryHealth,
  getExecutiveMemoryIntegritySummary,
  getExecutiveMemoryLifecycleSummary,
  getExecutiveMemoryWorkspaceSummary,
  getExecutiveMemoryCategorySummary,
  getExecutiveMemorySearchSummary,
  getExecutiveMemoryAssistantSummary,
  getExecutiveMemoryUsageSummary,
  ExecutiveMemoryDashboardEngine,
} from "./executiveMemoryDashboardEngine.ts";

export {
  createExecutiveMemoryDashboardError,
  executiveMemoryDashboardErrorFromCode,
  EXECUTIVE_MEMORY_DASHBOARD_ERROR_CODES,
} from "./executiveMemoryDashboardErrors.ts";

export type {
  ExecutiveMemoryDashboard,
  ExecutiveMemoryDashboardAssistantSummary,
  ExecutiveMemoryDashboardCategorySummary,
  ExecutiveMemoryDashboardEngineState,
  ExecutiveMemoryDashboardError,
  ExecutiveMemoryDashboardHealth,
  ExecutiveMemoryDashboardHealthLevel,
  ExecutiveMemoryDashboardHealthThresholds,
  ExecutiveMemoryDashboardIntegrity,
  ExecutiveMemoryDashboardLifecycleSummary,
  ExecutiveMemoryDashboardSearchSummary,
  ExecutiveMemoryDashboardStatistics,
  ExecutiveMemoryDashboardSummary,
  ExecutiveMemoryDashboardUsage,
  ExecutiveMemoryDashboardValidationIssue,
  ExecutiveMemoryDashboardValidationResult,
  ExecutiveMemoryDashboardWorkspaceEntry,
  ExecutiveMemoryDashboardWorkspaceSummary,
} from "./executiveMemoryDashboardTypes.ts";

export const EXECUTIVE_MEMORY_DASHBOARD_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/12" as const,
  title: "Executive Memory Dashboard",
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
  architectureVersion: EXECUTIVE_MEMORY_DASHBOARD_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_DASHBOARD_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/12",
  title: "Executive Memory Dashboard",
  goal: "Read-only administrative visibility into Executive Memory Platform health, governance, and usage.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardErrors.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardProvider.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardAggregator.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardHealthAnalyzer.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardValidator.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardEngine.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryDashboardContracts.test.ts",
    "docs/app-4-12-executive-memory-dashboard-report.md",
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
    "writeMemory",
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
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_DASHBOARD_TAGS,
} satisfies StageManifest);

export const ExecutiveMemoryDashboardContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_DASHBOARD_IDENTITY,
  manifest: EXECUTIVE_MEMORY_DASHBOARD_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_DASHBOARD_TAGS,
  defaultHealthThresholds: EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS,
});
