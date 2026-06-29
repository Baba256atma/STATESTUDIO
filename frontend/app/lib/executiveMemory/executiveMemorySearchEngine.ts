/**
 * APP-4:9 — Executive Memory Search Engine.
 * Reads executive memory records exclusively through APP-4:4 Retrieval Engine.
 */

import { createExecutiveMemoryQuery } from "./executiveMemoryQuery.ts";
import { findExecutiveMemories } from "./executiveMemoryRetrievalEngine.ts";
import { EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION } from "./executiveMemorySearchRankingConstants.ts";
import { executiveMemorySearchErrorFromCode } from "./executiveMemorySearchRankingErrors.ts";
import {
  applyExecutiveMemorySearchPostFilters,
  mapExecutiveMemorySearchQueryToRetrievalInput,
  trackExecutiveMemorySearchFilterUsage,
} from "./executiveMemorySearchRankingFilters.ts";
import {
  explainExecutiveMemoryRankingForRecord,
  rankExecutiveMemories,
} from "./executiveMemorySearchRankingEngine.ts";
import { createExecutiveMemorySearchQuery } from "./executiveMemorySearchRankingModel.ts";
import {
  createRankingProfile,
  getRankingProfile,
  getRankingProfiles,
  registerRankingProfile,
  resetExecutiveMemoryRankingProfileRegistryForTests,
} from "./executiveMemorySearchRankingProfileRegistry.ts";
import {
  getRankingStatistics,
  recordExecutiveMemorySearchExecution,
  resetExecutiveMemorySearchRankingStatisticsForTests,
} from "./executiveMemorySearchRankingStatistics.ts";
import {
  validateExecutiveMemoryRankingProfileInput,
  validateExecutiveMemorySearchQuery,
} from "./executiveMemorySearchRankingValidator.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type {
  CreateExecutiveMemoryRankingProfileInput,
  CreateExecutiveMemorySearchQueryInput,
  ExecutiveMemoryRankingExplanation,
  ExecutiveMemoryRankingResult,
  ExecutiveMemorySearchEngineState,
  ExecutiveMemorySearchQuery,
  ExecutiveMemorySearchResult,
} from "./executiveMemorySearchRankingTypes.ts";

let initialized = false;

export function initializeExecutiveMemorySearchEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveMemorySearchEngineState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Memory Search engine initialized.",
    state: getExecutiveMemorySearchEngineState(timestamp),
  });
}

export function isExecutiveMemorySearchEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveMemorySearchEngineState(timestamp: string): ExecutiveMemorySearchEngineState {
  return Object.freeze({
    engineId: "executive-memory-search-engine",
    contractVersion: EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
    initialized,
    registeredProfileCount: getRankingProfiles().length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveMemorySearchEngineForTests(): void {
  initialized = false;
  resetExecutiveMemoryRankingProfileRegistryForTests();
  resetExecutiveMemorySearchRankingStatisticsForTests();
}

function emptySearchResult(
  reason: string,
  profileId: string,
  executionTimeMs: number,
  error: ExecutiveMemorySearchResult["error"] = null
): ExecutiveMemorySearchResult {
  return Object.freeze({
    success: false,
    reason,
    records: Object.freeze([]),
    rankedResults: Object.freeze([]),
    totalMatched: 0,
    profileId,
    executionTimeMs,
    error,
    readOnly: true as const,
  });
}

export function searchExecutiveMemories(
  input: CreateExecutiveMemorySearchQueryInput | ExecutiveMemorySearchQuery
): ExecutiveMemorySearchResult {
  const started = Date.now();
  const query = "readOnly" in input ? input : createExecutiveMemorySearchQuery(input);
  const profileId = query.rankingProfileId ?? "default";

  const validation = validateExecutiveMemorySearchQuery(query);
  if (!validation.valid) {
    return emptySearchResult(
      validation.issues.map((entry) => entry.message).join("; "),
      profileId,
      Date.now() - started,
      executiveMemorySearchErrorFromCode(
        "validationFailure",
        validation.issues.map((entry) => entry.message).join("; ")
      )
    );
  }

  const retrievalInput = mapExecutiveMemorySearchQueryToRetrievalInput(query);
  const retrieval = findExecutiveMemories(createExecutiveMemoryQuery(retrievalInput));
  if (!retrieval.success) {
    return emptySearchResult(
      retrieval.error?.message ?? "Retrieval failed.",
      profileId,
      Date.now() - started,
      executiveMemorySearchErrorFromCode("retrievalFailure", retrieval.error?.message ?? "Retrieval failed.")
    );
  }

  const filtered = applyExecutiveMemorySearchPostFilters(retrieval.records, query);
  const rankedResults = rankExecutiveMemories({
    records: Object.freeze(filtered),
    query,
    profileId,
  });

  const executionTimeMs = Date.now() - started;
  recordExecutiveMemorySearchExecution({
    executionTimeMs,
    resultCount: filtered.length,
    profileId,
    filtersUsed: trackExecutiveMemorySearchFilterUsage(query),
  });

  return Object.freeze({
    success: true,
    reason: filtered.length === 0 ? "No matching executive memories." : "Executive memory search completed.",
    records: Object.freeze(filtered),
    rankedResults,
    totalMatched: filtered.length,
    profileId,
    executionTimeMs,
    error: null,
    readOnly: true as const,
  });
}

export function explainExecutiveMemoryRanking(input: {
  record: ExecutiveMemoryStoredRecord;
  query: CreateExecutiveMemorySearchQueryInput | ExecutiveMemorySearchQuery;
  profileId?: string;
  candidates?: readonly ExecutiveMemoryStoredRecord[];
}): ExecutiveMemoryRankingExplanation {
  const query = "readOnly" in input.query ? input.query : createExecutiveMemorySearchQuery(input.query);
  return explainExecutiveMemoryRankingForRecord({
    record: input.record,
    query,
    profileId: input.profileId,
    candidates: input.candidates,
  });
}

export function registerExecutiveMemoryRankingProfile(input: CreateExecutiveMemoryRankingProfileInput) {
  const validation = validateExecutiveMemoryRankingProfileInput(input);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      profile: null,
    });
  }
  return registerRankingProfile(input);
}

export {
  createRankingProfile,
  getRankingProfiles,
  getRankingProfile,
  rankExecutiveMemories,
  getRankingStatistics,
  validateExecutiveMemorySearchQuery,
};

export const ExecutiveMemorySearchEngine = Object.freeze({
  initializeExecutiveMemorySearchEngine,
  isExecutiveMemorySearchEngineInitialized,
  getExecutiveMemorySearchEngineState,
  resetExecutiveMemorySearchEngineForTests,
  searchExecutiveMemories,
  rankExecutiveMemories,
  explainExecutiveMemoryRanking,
  createRankingProfile,
  registerExecutiveMemoryRankingProfile,
  getRankingProfiles,
  getRankingProfile,
  getRankingStatistics,
  validateExecutiveMemorySearchQuery,
  version: EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
});
