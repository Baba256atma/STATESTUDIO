/**
 * LLM-13 — Enterprise Cache Platform types.
 */

import type {
  LLM_CACHE_CONTRACT_VERSION,
  LLM_CACHE_EXPIRATION_KEYS,
  LLM_CACHE_POLICY_KEYS,
} from "./llmCacheContracts.ts";

export type LlmCacheIdentifier = string;
export type LlmCachePolicyKey = (typeof LLM_CACHE_POLICY_KEYS)[number];
export type LlmCacheExpirationKey = (typeof LLM_CACHE_EXPIRATION_KEYS)[number];

export type LlmCacheKeyInput = Readonly<{
  provider: string;
  model: string;
  promptHash: string;
  contextHash: string;
  temperature: number;
  toolConfigurationHash: string;
  version: string;
}>;

export type LlmCacheScope = Readonly<{
  policy: LlmCachePolicyKey;
  sessionId?: string;
  workspaceId?: string;
  organizationId?: string;
}>;

export type LlmCacheLookupRequest = Readonly<{
  keyInput: LlmCacheKeyInput;
  scope: LlmCacheScope;
  bypass?: boolean;
  bypassReason?: string;
}>;

export type LlmCacheStoreRequest = Readonly<{
  keyInput: LlmCacheKeyInput;
  scope: LlmCacheScope;
  expiration: LlmCacheExpirationKey;
  responsePayload: string;
  tokenCount: number;
  estimatedCost: number;
  cacheable: boolean;
  nonCacheableReason?: string;
}>;

export type LlmCacheEntry = Readonly<{
  entryId: LlmCacheIdentifier;
  storageKey: string;
  cacheKey: string;
  provider: string;
  model: string;
  version: string;
  policy: LlmCachePolicyKey;
  responsePayload: string;
  tokenCount: number;
  estimatedCost: number;
  storedAt: number;
  expiresAt: number | null;
  readOnly: true;
}>;

export type LlmCacheLookupResult = Readonly<{
  hit: boolean;
  entry: LlmCacheEntry | null;
  lookupTimeMs: number;
  reason: string;
  readOnly: true;
}>;

export type LlmCacheStoreResult = Readonly<{
  stored: boolean;
  entry: LlmCacheEntry | null;
  reason: string;
  readOnly: true;
}>;

export type LlmCacheInvalidationScope = Readonly<
  | { type: "manual"; storageKey: string }
  | { type: "workspace"; workspaceId: string }
  | { type: "provider"; provider: string }
  | { type: "version"; version: string }
  | { type: "model"; model: string }
  | { type: "all" }
>;

export type LlmCacheInvalidationResult = Readonly<{
  invalidatedCount: number;
  reason: string;
  readOnly: true;
}>;

export type LlmCacheStatistics = Readonly<{
  hits: number;
  misses: number;
  hitRatio: number;
  savedTokens: number;
  estimatedCostSaved: number;
  averageLookupTimeMs: number;
  totalLookups: number;
  readOnly: true;
}>;

export type LlmCacheBypassRecord = Readonly<{
  bypassId: LlmCacheIdentifier;
  reason: string;
  recordedAt: number;
  readOnly: true;
}>;

export type LlmCachePlatformSnapshot = Readonly<{
  platformVersion: typeof LLM_CACHE_CONTRACT_VERSION;
  runtimeDependency: typeof import("./llmCacheContracts.ts").LLM_CACHE_RUNTIME_DEPENDENCY;
  entryCount: number;
  bypassCount: number;
  statistics: LlmCacheStatistics;
  readOnly: true;
}>;
