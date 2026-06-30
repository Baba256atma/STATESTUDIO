/**
 * LLM-13 — Cache invalidation.
 */

import {
  deleteLlmCacheEntriesMatching,
  deleteLlmCacheEntry,
  getLlmCacheEntry,
} from "./llmCacheStore.ts";
import type { LlmCacheInvalidationResult, LlmCacheInvalidationScope } from "./llmCacheTypes.ts";

export function invalidateLlmCache(scope: LlmCacheInvalidationScope): LlmCacheInvalidationResult {
  switch (scope.type) {
    case "manual": {
      const existed = getLlmCacheEntry(scope.storageKey);
      if (existed) deleteLlmCacheEntry(scope.storageKey);
      return Object.freeze({
        invalidatedCount: existed ? 1 : 0,
        reason: existed ? "Manual invalidation completed." : "Entry not found.",
        readOnly: true as const,
      });
    }
    case "workspace": {
      const prefix = `workspace_cache:${scope.workspaceId}:`;
      const count = deleteLlmCacheEntriesMatching((entry, storageKey) => storageKey.startsWith(prefix));
      return Object.freeze({
        invalidatedCount: count,
        reason: `Workspace invalidation for ${scope.workspaceId}.`,
        readOnly: true as const,
      });
    }
    case "provider": {
      const count = deleteLlmCacheEntriesMatching((entry) => entry.provider === scope.provider);
      return Object.freeze({
        invalidatedCount: count,
        reason: `Provider invalidation for ${scope.provider}.`,
        readOnly: true as const,
      });
    }
    case "version": {
      const count = deleteLlmCacheEntriesMatching((entry) => entry.version === scope.version);
      return Object.freeze({
        invalidatedCount: count,
        reason: `Version invalidation for ${scope.version}.`,
        readOnly: true as const,
      });
    }
    case "model": {
      const count = deleteLlmCacheEntriesMatching((entry) => entry.model === scope.model);
      return Object.freeze({
        invalidatedCount: count,
        reason: `Model invalidation for ${scope.model}.`,
        readOnly: true as const,
      });
    }
    case "all": {
      const count = deleteLlmCacheEntriesMatching(() => true);
      return Object.freeze({
        invalidatedCount: count,
        reason: "Full cache invalidation completed.",
        readOnly: true as const,
      });
    }
    default:
      return Object.freeze({
        invalidatedCount: 0,
        reason: "Unknown invalidation scope.",
        readOnly: true as const,
      });
  }
}
