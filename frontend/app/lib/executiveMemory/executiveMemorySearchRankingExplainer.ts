/**
 * APP-4:9 — Executive Memory Ranking explainability.
 */

import { computeExecutiveMemoryRankingScore } from "./executiveMemorySearchRankingRules.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type {
  ExecutiveMemoryRankingExplanation,
  ExecutiveMemoryRankingExplanationEntry,
  ExecutiveMemoryRankingProfile,
  ExecutiveMemorySearchQuery,
} from "./executiveMemorySearchRankingTypes.ts";

export function explainExecutiveMemoryRanking(input: {
  record: ExecutiveMemoryStoredRecord;
  query: ExecutiveMemorySearchQuery;
  profile: ExecutiveMemoryRankingProfile;
  candidates?: readonly ExecutiveMemoryStoredRecord[];
}): ExecutiveMemoryRankingExplanation {
  const candidates = input.candidates ?? Object.freeze([input.record]);
  const { score, evaluations } = computeExecutiveMemoryRankingScore(
    input.record,
    input.query,
    input.profile,
    candidates
  );

  const reasons: ExecutiveMemoryRankingExplanationEntry[] = evaluations
    .filter((evaluation) => evaluation.matched)
    .map((evaluation) =>
      Object.freeze({
        ruleType: evaluation.ruleType,
        contribution: evaluation.value,
        reason: evaluation.reason,
        readOnly: true as const,
      })
    );

  return Object.freeze({
    recordId: input.record.record.id,
    score,
    profileId: input.profile.profileId,
    reasons: Object.freeze(reasons),
    readOnly: true as const,
  });
}

export const ExecutiveMemoryRankingExplainer = Object.freeze({
  explainExecutiveMemoryRanking,
});
