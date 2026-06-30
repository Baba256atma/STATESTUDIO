/**
 * LLM-13 — In-memory cache store (local scope; distributed-ready interface).
 */

import { LLM_CACHE_DEFAULT_LIMITS } from "./llmCacheContracts.ts";
import type { LlmCacheEntry } from "./llmCacheTypes.ts";

const entryStore = new Map<string, LlmCacheEntry>();

export function resetLlmCacheStoreForTests(): void {
  entryStore.clear();
}

export function getLlmCacheEntryCount(): number {
  return entryStore.size;
}

export function getLlmCacheEntry(storageKey: string): LlmCacheEntry | null {
  return entryStore.get(storageKey) ?? null;
}

export function setLlmCacheEntry(entry: LlmCacheEntry): boolean {
  if (entryStore.size >= LLM_CACHE_DEFAULT_LIMITS.maxEntries && !entryStore.has(entry.storageKey)) {
    return false;
  }
  entryStore.set(entry.storageKey, entry);
  return true;
}

export function deleteLlmCacheEntry(storageKey: string): boolean {
  return entryStore.delete(storageKey);
}

export function listLlmCacheEntries(): readonly LlmCacheEntry[] {
  return Object.freeze([...entryStore.values()]);
}

export function deleteLlmCacheEntriesMatching(
  predicate: (entry: LlmCacheEntry, storageKey: string) => boolean
): number {
  let count = 0;
  for (const [storageKey, entry] of entryStore.entries()) {
    if (predicate(entry, storageKey)) {
      entryStore.delete(storageKey);
      count += 1;
    }
  }
  return count;
}

export function buildStorageKey(
  policy: string,
  scopeId: string,
  cacheKey: string
): string {
  return `${policy}:${scopeId}:${cacheKey}`;
}

export function resolveScopeId(scope: {
  policy: string;
  sessionId?: string;
  workspaceId?: string;
  organizationId?: string;
}): string | null {
  switch (scope.policy) {
    case "session_cache":
      return scope.sessionId ?? null;
    case "workspace_cache":
      return scope.workspaceId ?? null;
    case "organization_cache":
      return scope.organizationId ?? null;
    case "no_cache":
      return null;
    default:
      return null;
  }
}
