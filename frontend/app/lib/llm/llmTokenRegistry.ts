/**
 * LLM-6 — Token usage registry (in-memory, no persistence).
 */

import { buildLlmContextBuilderLayer } from "./llmContextExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION, LLM_TOKEN_DEFAULT_LIMITS } from "./llmTokenContracts.ts";
import { aggregateTokenUsage, lookupTokenAggregation } from "./llmTokenAggregation.ts";
import { buildTokenUsageRecord, createTokenRecordResult } from "./llmTokenUsage.ts";
import type {
  LlmTokenAggregationQuery,
  LlmTokenEstimateInput,
  LlmTokenRecordResult,
  LlmTokenRegistry,
  LlmTokenUsageRecord,
} from "./llmTokenTypes.ts";
import {
  validateDuplicateTokenRecord,
  validateTokenRecord,
} from "./llmTokenValidation.ts";

const recordRegistry = new Map<string, LlmTokenUsageRecord>();
const requestResponsePairs = new Set<string>();

export function resetLlmTokenRegistryForTests(): void {
  recordRegistry.clear();
  requestResponsePairs.clear();
}

export function getTokenRegistry(): LlmTokenRegistry {
  const records = Object.freeze([...recordRegistry.values()].sort((left, right) =>
    left.timestamp.localeCompare(right.timestamp)
  ));
  return Object.freeze({
    records,
    recordCount: records.length,
    aggregations: aggregateTokenUsage(records),
    readOnly: true as const,
  });
}

export function recordTokenUsage(
  input: LlmTokenEstimateInput,
  recordId: string,
  responseId: string,
  timestamp: string = new Date(0).toISOString()
): LlmTokenRecordResult {
  const duplicateValidation = validateDuplicateTokenRecord(
    [...recordRegistry.keys()],
    recordId,
    input.runtimeRequest.requestId,
    responseId,
    [...requestResponsePairs]
  );
  if (!duplicateValidation.valid) {
    return createTokenRecordResult(false, duplicateValidation.issues[0]?.message ?? "Duplicate record.", null);
  }
  if (recordRegistry.size >= LLM_TOKEN_DEFAULT_LIMITS.maxRecords && !recordRegistry.has(recordId)) {
    return createTokenRecordResult(false, "Token usage registry limit reached.", null);
  }

  const record = buildTokenUsageRecord(input, recordId, responseId, timestamp);
  const validation = validateTokenRecord(record);
  if (!validation.valid) {
    return createTokenRecordResult(false, validation.issues[0]?.message ?? "Token record validation failed.", null);
  }

  recordRegistry.set(recordId, record);
  requestResponsePairs.add(`${record.requestId}:${record.responseId}`);
  return createTokenRecordResult(true, "Token usage recorded.", record);
}

export function lookupTokenUsage(recordId: string): LlmTokenUsageRecord | null {
  return recordRegistry.get(recordId) ?? null;
}

export function lookupTokenAggregationFromRegistry(query: LlmTokenAggregationQuery) {
  return lookupTokenAggregation(getTokenRegistry().records, query);
}

export function ensureLlmTokenDependenciesReady(timestamp: string): boolean {
  const contextLayer = buildLlmContextBuilderLayer(timestamp);
  return contextLayer.success;
}

export function getTokenRegistryVersion(): typeof LLM_TOKEN_CONTRACT_VERSION {
  return LLM_TOKEN_CONTRACT_VERSION;
}
