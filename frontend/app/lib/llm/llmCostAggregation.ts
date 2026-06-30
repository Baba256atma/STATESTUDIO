/**
 * LLM-7 — Cost aggregation by scope.
 */

import { LLM_COST_AGGREGATION_SCOPE_KEYS } from "./llmCostContracts.ts";
import type {
  LlmCostAggregationQuery,
  LlmCostAggregationScopeKey,
  LlmCostAggregationSummary,
  LlmCostRecord,
} from "./llmCostTypes.ts";
import { roundLlmCost } from "./llmCostEstimator.ts";

export function isLlmCostAggregationScope(value: string): value is LlmCostAggregationScopeKey {
  return (LLM_COST_AGGREGATION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function resolveCostAggregationScopeKey(
  record: LlmCostRecord,
  scope: LlmCostAggregationScopeKey
): string {
  switch (scope) {
    case "user":
      return record.userId;
    case "workspace":
      return record.workspaceId;
    case "organization":
      return record.organizationId;
    case "provider":
      return record.providerKey;
    case "model":
      return record.modelKey;
    case "currency":
      return record.currency;
    default:
      return "";
  }
}

export function aggregateLlmCostByScope(
  records: readonly LlmCostRecord[],
  scope: LlmCostAggregationScopeKey,
  scopeKey: string,
  currency?: string
): LlmCostAggregationSummary {
  const matching = records.filter((record) => {
    const scopeMatch = resolveCostAggregationScopeKey(record, scope) === scopeKey;
    const currencyMatch = currency ? record.currency === currency : true;
    return scopeMatch && currencyMatch;
  });
  const inputCost = roundLlmCost(matching.reduce((sum, record) => sum + record.inputCost, 0));
  const outputCost = roundLlmCost(matching.reduce((sum, record) => sum + record.outputCost, 0));
  return Object.freeze({
    scope,
    scopeKey,
    currency: currency ?? (matching[0]?.currency ?? "USD"),
    recordCount: matching.length,
    inputTokens: matching.reduce((sum, record) => sum + record.inputTokens, 0),
    outputTokens: matching.reduce((sum, record) => sum + record.outputTokens, 0),
    inputCost,
    outputCost,
    totalEstimatedCost: roundLlmCost(inputCost + outputCost),
    readOnly: true as const,
  });
}

export function aggregateLlmCost(records: readonly LlmCostRecord[]): readonly LlmCostAggregationSummary[] {
  const summaries = new Map<string, LlmCostAggregationSummary>();
  for (const scope of LLM_COST_AGGREGATION_SCOPE_KEYS) {
    const keys = new Set(records.map((record) => resolveCostAggregationScopeKey(record, scope)));
    for (const scopeKey of keys) {
      if (!scopeKey) {
        continue;
      }
      const currencies = scope === "currency" ? [scopeKey] : [...new Set(records.map((record) => record.currency))];
      for (const currency of currencies) {
        const summary = aggregateLlmCostByScope(records, scope, scopeKey, currency);
        if (summary.recordCount > 0) {
          summaries.set(`${scope}:${scopeKey}:${currency}`, summary);
        }
      }
    }
  }
  return Object.freeze([...summaries.values()].sort((left, right) =>
    `${left.scope}:${left.scopeKey}:${left.currency}`.localeCompare(`${right.scope}:${right.scopeKey}:${right.currency}`)
  ));
}

export function lookupLlmCostAggregation(
  records: readonly LlmCostRecord[],
  query: LlmCostAggregationQuery
): LlmCostAggregationSummary | null {
  if (!isLlmCostAggregationScope(query.scope)) {
    return null;
  }
  const summary = aggregateLlmCostByScope(records, query.scope, query.scopeKey, query.currency);
  return summary.recordCount > 0 ? summary : null;
}

export function getAllCostAggregationScopeKeys(): readonly LlmCostAggregationScopeKey[] {
  return LLM_COST_AGGREGATION_SCOPE_KEYS;
}
