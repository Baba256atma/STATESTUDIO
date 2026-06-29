/**
 * APP-4:9 — Executive Memory Search & Ranking builders.
 */

import type {
  CreateExecutiveMemoryRankingProfileInput,
  CreateExecutiveMemorySearchQueryInput,
  ExecutiveMemoryRankingProfile,
  ExecutiveMemoryRankingRule,
  ExecutiveMemorySearchQuery,
} from "./executiveMemorySearchRankingTypes.ts";

export function createExecutiveMemorySearchQuery(
  input: CreateExecutiveMemorySearchQueryInput = {}
): ExecutiveMemorySearchQuery {
  return Object.freeze({
    ...input,
    tags: input.tags ? Object.freeze([...input.tags]) : undefined,
    referenceIds: input.referenceIds ? Object.freeze([...input.referenceIds]) : undefined,
    readOnly: true as const,
  });
}

export function createExecutiveMemoryRankingRule(
  input: Omit<ExecutiveMemoryRankingRule, "readOnly">
): ExecutiveMemoryRankingRule {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryRankingProfile(
  input: CreateExecutiveMemoryRankingProfileInput & { builtIn?: boolean }
): ExecutiveMemoryRankingProfile {
  return Object.freeze({
    profileId: input.profileId,
    label: input.label,
    description: input.description,
    rules: Object.freeze(input.rules.map((rule) => createExecutiveMemoryRankingRule(rule))),
    builtIn: input.builtIn ?? false,
    readOnly: true as const,
  });
}

export const ExecutiveMemorySearchRankingBuilder = Object.freeze({
  createExecutiveMemorySearchQuery,
  createExecutiveMemoryRankingRule,
  createExecutiveMemoryRankingProfile,
});
