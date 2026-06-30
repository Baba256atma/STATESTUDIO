/**
 * LLM-13 — Cache expiration logic.
 */

import { LLM_CACHE_EXPIRATION_MS } from "./llmCacheContracts.ts";
import type { LlmCacheEntry, LlmCacheExpirationKey } from "./llmCacheTypes.ts";

export function resolveExpirationTimestamp(
  expiration: LlmCacheExpirationKey,
  storedAt: number
): number | null {
  const ttl = LLM_CACHE_EXPIRATION_MS[expiration];
  if (ttl === null) return null;
  if (ttl === 0) return storedAt;
  return storedAt + ttl;
}

export function isCacheEntryExpired(entry: LlmCacheEntry, now: number = Date.now()): boolean {
  if (entry.expiresAt === null) return false;
  if (entry.expiresAt <= entry.storedAt) return true;
  return now >= entry.expiresAt;
}

export function isExpirationKey(value: string): value is LlmCacheExpirationKey {
  return value in LLM_CACHE_EXPIRATION_MS;
}
