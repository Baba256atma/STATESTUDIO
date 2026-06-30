/**
 * LLM-13 — Enterprise Cache Platform facade.
 */

import { LLM_CACHE_CONTRACT_VERSION, LLM_CACHE_DEFAULT_LIMITS, LLM_CACHE_RUNTIME_DEPENDENCY } from "./llmCacheContracts.ts";
import { resolveExpirationTimestamp } from "./llmCacheExpiration.ts";
import { buildCacheKey } from "./llmCacheHasher.ts";
import { invalidateLlmCache } from "./llmCacheInvalidation.ts";
import { lookupLlmCacheEntry } from "./llmCacheLookup.ts";
import { getLlmCacheStatistics, resetLlmCacheStatisticsForTests } from "./llmCacheStatistics.ts";
import {
  buildStorageKey,
  getLlmCacheEntryCount,
  resetLlmCacheStoreForTests,
  resolveScopeId,
  setLlmCacheEntry,
} from "./llmCacheStore.ts";
import type {
  LlmCacheBypassRecord,
  LlmCacheInvalidationScope,
  LlmCacheLookupRequest,
  LlmCacheLookupResult,
  LlmCachePlatformSnapshot,
  LlmCacheStoreRequest,
  LlmCacheStoreResult,
} from "./llmCacheTypes.ts";

const bypassRecords: LlmCacheBypassRecord[] = [];

export function resetLlmCachePlatformForTests(): void {
  resetLlmCacheStoreForTests();
  resetLlmCacheStatisticsForTests();
  bypassRecords.length = 0;
}

export function lookupLlmCache(
  request: LlmCacheLookupRequest,
  now: number = Date.now()
): LlmCacheLookupResult {
  return lookupLlmCacheEntry(request, now);
}

export function storeLlmCacheResponse(
  request: LlmCacheStoreRequest,
  now: number = Date.now()
): LlmCacheStoreResult {
  if (!request.cacheable) {
    return Object.freeze({
      stored: false,
      entry: null,
      reason: request.nonCacheableReason ?? "Response is not cacheable.",
      readOnly: true as const,
    });
  }

  if (request.scope.policy === "no_cache") {
    return Object.freeze({
      stored: false,
      entry: null,
      reason: "Policy is no_cache.",
      readOnly: true as const,
    });
  }

  const scopeId = resolveScopeId(request.scope);
  if (!scopeId) {
    return Object.freeze({
      stored: false,
      entry: null,
      reason: "Missing cache scope identifier.",
      readOnly: true as const,
    });
  }

  const cacheKey = buildCacheKey(request.keyInput);
  const storageKey = buildStorageKey(request.scope.policy, scopeId, cacheKey);
  const expiresAt = resolveExpirationTimestamp(request.expiration, now);

  if (expiresAt !== null && expiresAt <= now) {
    return Object.freeze({
      stored: false,
      entry: null,
      reason: "Immediate expiration policy prevents storage.",
      readOnly: true as const,
    });
  }

  const entry = Object.freeze({
    entryId: `cache-entry-${storageKey}`,
    storageKey,
    cacheKey,
    provider: request.keyInput.provider,
    model: request.keyInput.model,
    version: request.keyInput.version,
    policy: request.scope.policy,
    responsePayload: request.responsePayload,
    tokenCount: request.tokenCount,
    estimatedCost: request.estimatedCost,
    storedAt: now,
    expiresAt,
    readOnly: true as const,
  });

  const stored = setLlmCacheEntry(entry);
  return Object.freeze({
    stored,
    entry: stored ? entry : null,
    reason: stored ? "Cache entry stored." : "Cache storage limit reached.",
    readOnly: true as const,
  });
}

export function bypassLlmCache(reason: string, now: number = Date.now()): LlmCacheBypassRecord {
  const record = Object.freeze({
    bypassId: `cache-bypass-${bypassRecords.length + 1}`,
    reason,
    recordedAt: now,
    readOnly: true as const,
  });
  if (bypassRecords.length < LLM_CACHE_DEFAULT_LIMITS.maxBypassRecords) {
    bypassRecords.push(record);
  }
  return record;
}

export function invalidateLlmCacheScope(scope: LlmCacheInvalidationScope) {
  return invalidateLlmCache(scope);
}

export { getLlmCacheStatistics };

export function getLlmCachePlatformSnapshot(): LlmCachePlatformSnapshot {
  return Object.freeze({
    platformVersion: LLM_CACHE_CONTRACT_VERSION,
    runtimeDependency: LLM_CACHE_RUNTIME_DEPENDENCY,
    entryCount: getLlmCacheEntryCount(),
    bypassCount: bypassRecords.length,
    statistics: getLlmCacheStatistics(),
    readOnly: true as const,
  });
}

export const LlmCachePlatform = Object.freeze({
  lookupLlmCache,
  storeLlmCacheResponse,
  bypassLlmCache,
  invalidateLlmCache: invalidateLlmCacheScope,
  getLlmCacheStatistics,
  getLlmCachePlatformSnapshot,
  resetLlmCachePlatformForTests,
  version: LLM_CACHE_CONTRACT_VERSION,
});
