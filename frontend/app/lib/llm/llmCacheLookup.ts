/**
 * LLM-13 — Cache lookup orchestration.
 */

import { buildCacheKey } from "./llmCacheHasher.ts";
import { isCacheEntryExpired } from "./llmCacheExpiration.ts";
import { recordCacheHit, recordCacheMiss } from "./llmCacheStatistics.ts";
import {
  buildStorageKey,
  deleteLlmCacheEntry,
  getLlmCacheEntry,
  resolveScopeId,
} from "./llmCacheStore.ts";
import type { LlmCacheLookupRequest, LlmCacheLookupResult } from "./llmCacheTypes.ts";

export function lookupLlmCacheEntry(
  request: LlmCacheLookupRequest,
  now: number = Date.now()
): LlmCacheLookupResult {
  const start = performance.now();

  if (request.bypass) {
    const lookupTimeMs = performance.now() - start;
    recordCacheMiss(lookupTimeMs);
    return Object.freeze({
      hit: false,
      entry: null,
      lookupTimeMs,
      reason: request.bypassReason ?? "Explicit cache bypass.",
      readOnly: true as const,
    });
  }

  if (request.scope.policy === "no_cache") {
    const lookupTimeMs = performance.now() - start;
    recordCacheMiss(lookupTimeMs);
    return Object.freeze({
      hit: false,
      entry: null,
      lookupTimeMs,
      reason: "Policy is no_cache.",
      readOnly: true as const,
    });
  }

  const scopeId = resolveScopeId(request.scope);
  if (!scopeId) {
    const lookupTimeMs = performance.now() - start;
    recordCacheMiss(lookupTimeMs);
    return Object.freeze({
      hit: false,
      entry: null,
      lookupTimeMs,
      reason: "Missing cache scope identifier.",
      readOnly: true as const,
    });
  }

  const cacheKey = buildCacheKey(request.keyInput);
  const storageKey = buildStorageKey(request.scope.policy, scopeId, cacheKey);
  const entry = getLlmCacheEntry(storageKey);

  if (!entry) {
    const lookupTimeMs = performance.now() - start;
    recordCacheMiss(lookupTimeMs);
    return Object.freeze({
      hit: false,
      entry: null,
      lookupTimeMs,
      reason: "Cache miss.",
      readOnly: true as const,
    });
  }

  if (isCacheEntryExpired(entry, now)) {
    deleteLlmCacheEntry(storageKey);
    const lookupTimeMs = performance.now() - start;
    recordCacheMiss(lookupTimeMs);
    return Object.freeze({
      hit: false,
      entry: null,
      lookupTimeMs,
      reason: "Cache entry expired.",
      readOnly: true as const,
    });
  }

  const lookupTimeMs = performance.now() - start;
  recordCacheHit(entry.tokenCount, entry.estimatedCost, lookupTimeMs);
  return Object.freeze({
    hit: true,
    entry,
    lookupTimeMs,
    reason: "Cache hit.",
    readOnly: true as const,
  });
}
