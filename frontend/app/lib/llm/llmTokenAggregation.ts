/**
 * LLM-6 — Token usage aggregation by scope.
 */

import { LLM_TOKEN_AGGREGATION_SCOPE_KEYS } from "./llmTokenContracts.ts";
import type {
  LlmTokenAggregationQuery,
  LlmTokenAggregationScopeKey,
  LlmTokenAggregationSummary,
  LlmTokenUsageRecord,
} from "./llmTokenTypes.ts";

export function isLlmTokenAggregationScope(value: string): value is LlmTokenAggregationScopeKey {
  return (LLM_TOKEN_AGGREGATION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function resolveAggregationScopeKey(
  record: LlmTokenUsageRecord,
  scope: LlmTokenAggregationScopeKey
): string {
  switch (scope) {
    case "user":
      return record.userId;
    case "session":
      return record.sessionId;
    case "workspace":
      return record.workspaceId;
    case "organization":
      return record.organizationId;
    case "provider":
      return record.providerKey;
    case "model":
      return record.modelKey;
    default:
      return "";
  }
}

export function aggregateTokenUsageByScope(
  records: readonly LlmTokenUsageRecord[],
  scope: LlmTokenAggregationScopeKey,
  scopeKey: string
): LlmTokenAggregationSummary {
  const matching = records.filter((record) => resolveAggregationScopeKey(record, scope) === scopeKey);
  return Object.freeze({
    scope,
    scopeKey,
    requestCount: matching.length,
    responseCount: matching.length,
    estimatedInputTokens: matching.reduce((sum, record) => sum + record.estimatedInputTokens, 0),
    estimatedOutputTokens: matching.reduce((sum, record) => sum + record.estimatedOutputTokens, 0),
    totalTokens: matching.reduce((sum, record) => sum + record.totalTokens, 0),
    readOnly: true as const,
  });
}

export function aggregateTokenUsage(records: readonly LlmTokenUsageRecord[]): readonly LlmTokenAggregationSummary[] {
  const summaries = new Map<string, LlmTokenAggregationSummary>();
  for (const scope of LLM_TOKEN_AGGREGATION_SCOPE_KEYS) {
    const keys = new Set(records.map((record) => resolveAggregationScopeKey(record, scope)));
    for (const scopeKey of keys) {
      if (!scopeKey) {
        continue;
      }
      const summary = aggregateTokenUsageByScope(records, scope, scopeKey);
      summaries.set(`${scope}:${scopeKey}`, summary);
    }
  }
  return Object.freeze([...summaries.values()].sort((left, right) =>
    `${left.scope}:${left.scopeKey}`.localeCompare(`${right.scope}:${right.scopeKey}`)
  ));
}

export function lookupTokenAggregation(
  records: readonly LlmTokenUsageRecord[],
  query: LlmTokenAggregationQuery
): LlmTokenAggregationSummary | null {
  if (!isLlmTokenAggregationScope(query.scope)) {
    return null;
  }
  return aggregateTokenUsageByScope(records, query.scope, query.scopeKey);
}

export function getAllAggregationScopeKeys(): readonly LlmTokenAggregationScopeKey[] {
  return LLM_TOKEN_AGGREGATION_SCOPE_KEYS;
}
