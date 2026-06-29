/**
 * APP-4:9 — Executive Memory Search query validator.
 */

import {
  EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS,
  EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS,
} from "./executiveMemorySearchRankingConstants.ts";
import { getRankingProfile } from "./executiveMemorySearchRankingProfileRegistry.ts";
import type {
  CreateExecutiveMemoryRankingProfileInput,
  ExecutiveMemorySearchQuery,
  ExecutiveMemorySearchValidationIssue,
  ExecutiveMemorySearchValidationResult,
} from "./executiveMemorySearchRankingTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveMemorySearchValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveMemorySearchValidationIssue[]): ExecutiveMemorySearchValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function isIsoTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function isExecutiveMemoryRankingRuleType(value: string): boolean {
  return (EXECUTIVE_MEMORY_RANKING_RULE_TYPE_KEYS as readonly string[]).includes(value);
}

export function validateExecutiveMemorySearchQuery(
  query: ExecutiveMemorySearchQuery
): ExecutiveMemorySearchValidationResult {
  const issues: ExecutiveMemorySearchValidationIssue[] = [];

  if (query.confidenceMin !== undefined) {
    if (
      query.confidenceMin < EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.minConfidenceScore ||
      query.confidenceMin > EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.maxConfidenceScore
    ) {
      issues.push(issue("malformed_filter", "confidenceMin must be between 0 and 1.", "confidenceMin"));
    }
  }
  if (query.confidenceMax !== undefined) {
    if (
      query.confidenceMax < EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.minConfidenceScore ||
      query.confidenceMax > EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.maxConfidenceScore
    ) {
      issues.push(issue("malformed_filter", "confidenceMax must be between 0 and 1.", "confidenceMax"));
    }
  }
  if (query.confidenceMin !== undefined && query.confidenceMax !== undefined && query.confidenceMin > query.confidenceMax) {
    issues.push(issue("malformed_filter", "confidenceMin must not exceed confidenceMax.", "confidenceMin"));
  }

  for (const field of ["createdAfter", "createdBefore", "updatedAfter", "updatedBefore"] as const) {
    const value = query[field];
    if (value !== undefined && !isIsoTimestamp(value)) {
      issues.push(issue("malformed_filter", `${field} must be a valid ISO timestamp.`, field));
    }
  }
  if (
    query.createdAfter &&
    query.createdBefore &&
    Date.parse(query.createdAfter) > Date.parse(query.createdBefore)
  ) {
    issues.push(issue("malformed_filter", "createdAfter must not be after createdBefore.", "createdAfter"));
  }
  if (
    query.updatedAfter &&
    query.updatedBefore &&
    Date.parse(query.updatedAfter) > Date.parse(query.updatedBefore)
  ) {
    issues.push(issue("malformed_filter", "updatedAfter must not be after updatedBefore.", "updatedAfter"));
  }

  if (query.limit !== undefined && (query.limit < 1 || query.limit > EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.maxLimit)) {
    issues.push(issue("malformed_filter", "limit is out of supported range.", "limit"));
  }
  if (query.offset !== undefined && query.offset < 0) {
    issues.push(issue("malformed_filter", "offset must not be negative.", "offset"));
  }

  if (query.rankingProfileId && !getRankingProfile(query.rankingProfileId)) {
    issues.push(
      issue("unsupported_ranking_profile", `Ranking profile not found: ${query.rankingProfileId}.`, "rankingProfileId")
    );
  }

  return result(issues);
}

export function validateExecutiveMemoryRankingProfileInput(
  input: CreateExecutiveMemoryRankingProfileInput
): ExecutiveMemorySearchValidationResult {
  const issues: ExecutiveMemorySearchValidationIssue[] = [];

  if (input.profileId.trim().length === 0) {
    issues.push(issue("validation_failure", "Profile id must not be empty.", "profileId"));
  }
  if (input.label.length > EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_metadata", "Profile label exceeds maximum length.", "label"));
  }
  if (input.rules.length === 0) {
    issues.push(issue("invalid_ranking_rule", "Profile must include at least one rule.", "rules"));
  }
  if (input.rules.length > EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.maxProfileRules) {
    issues.push(issue("invalid_ranking_rule", "Profile rule count exceeds maximum.", "rules"));
  }

  const ruleIds = new Set<string>();
  for (const rankingRule of input.rules) {
    if (ruleIds.has(rankingRule.ruleId)) {
      issues.push(issue("invalid_ranking_rule", `Duplicate rule id: ${rankingRule.ruleId}.`, "rules"));
    }
    ruleIds.add(rankingRule.ruleId);
    if (!isExecutiveMemoryRankingRuleType(rankingRule.ruleType)) {
      issues.push(issue("invalid_ranking_rule", `Unsupported rule type: ${rankingRule.ruleType}.`, "rules"));
    }
    if (
      rankingRule.weight < EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.minRuleWeight ||
      rankingRule.weight > EXECUTIVE_MEMORY_SEARCH_RANKING_LIMITS.maxRuleWeight
    ) {
      issues.push(issue("invalid_ranking_rule", `Rule weight out of range: ${rankingRule.ruleId}.`, "rules"));
    }
  }

  return result(issues);
}

export const ExecutiveMemorySearchValidator = Object.freeze({
  validateExecutiveMemorySearchQuery,
  validateExecutiveMemoryRankingProfileInput,
  isExecutiveMemoryRankingRuleType,
});
