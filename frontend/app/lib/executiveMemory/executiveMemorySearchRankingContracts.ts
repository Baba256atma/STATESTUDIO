/**
 * APP-4:9 — Executive Memory Search & Ranking contracts.
 * Canonical APP-4:9 contract surface — extends APP-4:1 through APP-4:8 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION } from "./executiveContextMemoryConstants.ts";
import { EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION } from "./executiveDecisionMemoryConstants.ts";
import { EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION } from "./executiveScenarioMemoryConstants.ts";
import { EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION } from "./executiveIntentMemoryLinkConstants.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import {
  EXECUTIVE_MEMORY_SEARCH_RANKING_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_SEARCH_RANKING_TAGS,
} from "./executiveMemorySearchRankingConstants.ts";

export {
  ExecutiveMemorySearchRankingBuilder,
  createExecutiveMemorySearchQuery,
  createExecutiveMemoryRankingRule,
  createExecutiveMemoryRankingProfile,
} from "./executiveMemorySearchRankingModel.ts";

export {
  ExecutiveMemoryRankingProfileRegistry,
  createRankingProfile,
  registerRankingProfile,
  getRankingProfile,
  getRankingProfiles,
} from "./executiveMemorySearchRankingProfileRegistry.ts";

export {
  ExecutiveMemorySearchValidator,
  validateExecutiveMemorySearchQuery,
  validateExecutiveMemoryRankingProfileInput,
} from "./executiveMemorySearchRankingValidator.ts";

export {
  ExecutiveMemoryRankingRules,
  evaluateExecutiveMemoryRankingRule,
  computeExecutiveMemoryRankingScore,
} from "./executiveMemorySearchRankingRules.ts";

export {
  ExecutiveMemoryRankingExplainer,
  explainExecutiveMemoryRanking as buildExecutiveMemoryRankingExplanation,
} from "./executiveMemorySearchRankingExplainer.ts";

export {
  ExecutiveMemoryRankingEngine,
  rankExecutiveMemories,
  explainExecutiveMemoryRankingForRecord,
} from "./executiveMemorySearchRankingEngine.ts";

export {
  ExecutiveMemorySearchStatisticsService,
  getRankingStatistics,
} from "./executiveMemorySearchRankingStatistics.ts";

export {
  initializeExecutiveMemorySearchEngine,
  isExecutiveMemorySearchEngineInitialized,
  getExecutiveMemorySearchEngineState,
  resetExecutiveMemorySearchEngineForTests,
  searchExecutiveMemories,
  explainExecutiveMemoryRanking,
  registerExecutiveMemoryRankingProfile,
  ExecutiveMemorySearchEngine,
} from "./executiveMemorySearchEngine.ts";

export {
  createExecutiveMemorySearchError,
  executiveMemorySearchErrorFromCode,
  EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES,
} from "./executiveMemorySearchRankingErrors.ts";

export type {
  CreateExecutiveMemoryRankingProfileInput,
  CreateExecutiveMemorySearchQueryInput,
  ExecutiveMemoryRankingExplanation,
  ExecutiveMemoryRankingExplanationEntry,
  ExecutiveMemoryRankingProfile,
  ExecutiveMemoryRankingResult,
  ExecutiveMemoryRankingRule,
  ExecutiveMemoryRankingRuleType,
  ExecutiveMemoryRankingStatistics,
  ExecutiveMemorySearchEngineState,
  ExecutiveMemorySearchError,
  ExecutiveMemorySearchQuery,
  ExecutiveMemorySearchResult,
  ExecutiveMemorySearchValidationIssue,
  ExecutiveMemorySearchValidationResult,
} from "./executiveMemorySearchRankingTypes.ts";

export const EXECUTIVE_MEMORY_SEARCH_RANKING_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/9" as const,
  title: "Executive Memory Search & Ranking",
  searchRankingContractVersion: EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
  contextMemoryContractVersion: EXECUTIVE_CONTEXT_MEMORY_CONTRACT_VERSION,
  decisionMemoryContractVersion: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  scenarioMemoryContractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  intentMemoryLinkContractVersion: EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_MEMORY_SEARCH_RANKING_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_SEARCH_RANKING_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/9",
  title: "Executive Memory Search & Ranking",
  goal: "Deterministic structured search and metadata-driven ranking for Executive Memory records.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingErrors.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingModel.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingProfileRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingValidator.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingFilters.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingRules.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingExplainer.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingEngine.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchEngine.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemorySearchRankingContracts.test.ts",
    "docs/app-4-9-executive-memory-search-ranking-report.md",
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
    "llm",
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
    "APP-1",
    "APP-3",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_SEARCH_RANKING_TAGS,
} satisfies StageManifest);

export const ExecutiveMemorySearchRankingContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_SEARCH_RANKING_IDENTITY,
  manifest: EXECUTIVE_MEMORY_SEARCH_RANKING_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_SEARCH_RANKING_TAGS,
});
