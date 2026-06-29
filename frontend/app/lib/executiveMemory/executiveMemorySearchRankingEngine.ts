/**
 * APP-4:9 — Executive Memory Ranking Engine.
 */

import { EXECUTIVE_MEMORY_RANKING_PROFILE_IDS } from "./executiveMemorySearchRankingConstants.ts";
import { explainExecutiveMemoryRanking } from "./executiveMemorySearchRankingExplainer.ts";
import { getRankingProfile } from "./executiveMemorySearchRankingProfileRegistry.ts";
import { computeExecutiveMemoryRankingScore } from "./executiveMemorySearchRankingRules.ts";
import { recordExecutiveMemoryRankingExecution } from "./executiveMemorySearchRankingStatistics.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type {
  ExecutiveMemoryRankingExplanation,
  ExecutiveMemoryRankingProfile,
  ExecutiveMemoryRankingResult,
  ExecutiveMemorySearchQuery,
} from "./executiveMemorySearchRankingTypes.ts";

function resolveProfile(profileId?: string): ExecutiveMemoryRankingProfile {
  const resolved = getRankingProfile(profileId ?? EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.default);
  if (!resolved) {
    throw new Error(`Ranking profile not found: ${profileId ?? EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.default}`);
  }
  return resolved;
}

export function rankExecutiveMemories(input: {
  records: readonly ExecutiveMemoryStoredRecord[];
  query: ExecutiveMemorySearchQuery;
  profileId?: string;
}): readonly ExecutiveMemoryRankingResult[] {
  const profile = resolveProfile(input.profileId ?? input.query.rankingProfileId);
  recordExecutiveMemoryRankingExecution();

  const scored = input.records.map((record) => {
    const { score } = computeExecutiveMemoryRankingScore(record, input.query, profile, input.records);
    const explanation = explainExecutiveMemoryRanking({
      record,
      query: input.query,
      profile,
      candidates: input.records,
    });
    return Object.freeze({ record, score, explanation });
  });

  scored.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.record.record.id.localeCompare(right.record.record.id);
  });

  return Object.freeze(
    scored.map((entry, index) =>
      Object.freeze({
        record: entry.record,
        score: entry.score,
        rank: index + 1,
        explanation: entry.explanation,
        readOnly: true as const,
      })
    )
  );
}

export function explainExecutiveMemoryRankingForRecord(input: {
  record: ExecutiveMemoryStoredRecord;
  query: ExecutiveMemorySearchQuery;
  profileId?: string;
  candidates?: readonly ExecutiveMemoryStoredRecord[];
}): ExecutiveMemoryRankingExplanation {
  const profile = resolveProfile(input.profileId ?? input.query.rankingProfileId);
  return explainExecutiveMemoryRanking({
    record: input.record,
    query: input.query,
    profile,
    candidates: input.candidates,
  });
}

export const ExecutiveMemoryRankingEngine = Object.freeze({
  rankExecutiveMemories,
  explainExecutiveMemoryRankingForRecord,
});
