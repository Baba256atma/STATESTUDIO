import assert from "node:assert/strict";
import test from "node:test";

import {
  LLM_CACHE_CONTRACT_VERSION,
  LLM_CACHE_POLICY_KEYS,
  LLM_CACHE_PUBLIC_API_REGISTRY,
  LLM_CACHE_RUNTIME_DEPENDENCY,
  LLM_CACHE_SAFETY_RULES,
} from "./llmCacheContracts.ts";
import {
  buildCacheKey,
  buildContextHash,
  buildPromptHash,
  buildToolConfigurationHash,
  hashStableValue,
} from "./llmCacheHasher.ts";
import { isCacheEntryExpired, resolveExpirationTimestamp } from "./llmCacheExpiration.ts";
import {
  LlmCachePlatform,
  bypassLlmCache,
  getLlmCachePlatformSnapshot,
  getLlmCacheStatistics,
  invalidateLlmCacheScope,
  lookupLlmCache,
  resetLlmCachePlatformForTests,
  storeLlmCacheResponse,
} from "./llmCachePlatform.ts";
import type { LlmCacheKeyInput, LlmCacheStoreRequest } from "./llmCacheTypes.ts";

const FIXED_TIME = 1_700_000_000_000;

const BASE_KEY_INPUT: LlmCacheKeyInput = Object.freeze({
  provider: "openai",
  model: "gpt-4o-mini",
  promptHash: buildPromptHash("Summarize the quarterly report."),
  contextHash: buildContextHash({ workspace: "ws-1", role: "analyst" }),
  temperature: 0.2,
  toolConfigurationHash: buildToolConfigurationHash(["search"]),
  version: "LLM/12",
});

function buildStoreRequest(overrides: Partial<LlmCacheStoreRequest> = {}): LlmCacheStoreRequest {
  return Object.freeze({
    keyInput: BASE_KEY_INPUT,
    scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    expiration: "one_hour",
    responsePayload: '{"answer":"cached response"}',
    tokenCount: 120,
    estimatedCost: 0.0024,
    cacheable: true,
    ...overrides,
  });
}

test.beforeEach(() => {
  resetLlmCachePlatformForTests();
});

test("exports LLM/13 enterprise cache platform vocabulary", () => {
  assert.equal(LLM_CACHE_CONTRACT_VERSION, "LLM/13");
  assert.equal(LLM_CACHE_RUNTIME_DEPENDENCY, "LLM/12");
  assert.equal(LLM_CACHE_POLICY_KEYS.length, 4);
  assert.equal(LLM_CACHE_PUBLIC_API_REGISTRY.length, 7);
});

test("produces deterministic hashes for prompt context and cache keys", () => {
  const promptA = buildPromptHash("Hello world");
  const promptB = buildPromptHash("Hello world");
  const promptC = buildPromptHash("Hello World");
  assert.equal(promptA, promptB);
  assert.notEqual(promptA, promptC);
  assert.equal(buildContextHash({ b: "2", a: "1" }), buildContextHash({ a: "1", b: "2" }));
  assert.equal(buildCacheKey(BASE_KEY_INPUT), buildCacheKey(BASE_KEY_INPUT));
  assert.notEqual(
    buildCacheKey({ ...BASE_KEY_INPUT, version: "LLM/11" }),
    buildCacheKey(BASE_KEY_INPUT)
  );
  assert.equal(hashStableValue("test").length, 64);
});

test("returns cache miss then cache hit for workspace policy", () => {
  const lookupRequest = Object.freeze({
    keyInput: BASE_KEY_INPUT,
    scope: Object.freeze({ policy: "workspace_cache" as const, workspaceId: "ws-1" }),
  });
  const miss = lookupLlmCache(lookupRequest);
  assert.equal(miss.hit, false);
  const stored = storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  assert.equal(stored.stored, true);
  const hit = lookupLlmCache(lookupRequest, FIXED_TIME);
  assert.equal(hit.hit, true);
  assert.equal(hit.entry?.responsePayload, '{"answer":"cached response"}');
});

test("isolates cache entries by workspace provider and version", () => {
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  const otherWorkspace = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-2" }),
    })
  );
  assert.equal(otherWorkspace.hit, false);
  const otherProvider = lookupLlmCache(
    Object.freeze({
      keyInput: Object.freeze({ ...BASE_KEY_INPUT, provider: "anthropic" }),
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    })
  );
  assert.equal(otherProvider.hit, false);
  const otherVersion = lookupLlmCache(
    Object.freeze({
      keyInput: Object.freeze({ ...BASE_KEY_INPUT, version: "LLM/11" }),
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    })
  );
  assert.equal(otherVersion.hit, false);
});

test("respects no_cache policy and explicit bypass", () => {
  storeLlmCacheResponse(
    buildStoreRequest({ scope: Object.freeze({ policy: "no_cache" }) }),
    FIXED_TIME
  );
  const noCacheLookup = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "no_cache" }),
    })
  );
  assert.equal(noCacheLookup.hit, false);
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  const bypassed = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
      bypass: true,
      bypassReason: "admin override",
    })
  );
  assert.equal(bypassed.hit, false);
  assert.ok(bypassLlmCache("manual bypass", FIXED_TIME).reason);
});

test("expires cache entries based on expiration policy", () => {
  storeLlmCacheResponse(buildStoreRequest({ expiration: "five_minutes" }), FIXED_TIME);
  const fresh = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    }),
    FIXED_TIME + 1_000
  );
  assert.equal(fresh.hit, true);
  const expired = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    }),
    FIXED_TIME + 6 * 60 * 1000
  );
  assert.equal(expired.hit, false);
  assert.equal(
    isCacheEntryExpired(
      Object.freeze({
        entryId: "e1",
        storageKey: "k",
        cacheKey: "k",
        provider: "openai",
        model: "gpt-4o-mini",
        version: "LLM/12",
        policy: "workspace_cache",
        responsePayload: "{}",
        tokenCount: 1,
        estimatedCost: 0,
        storedAt: FIXED_TIME,
        expiresAt: resolveExpirationTimestamp("immediate", FIXED_TIME),
        readOnly: true as const,
      }),
      FIXED_TIME + 1
    ),
    true
  );
});

test("invalidates cache by workspace provider version and model", () => {
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  storeLlmCacheResponse(
    buildStoreRequest({
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-2" }),
    }),
    FIXED_TIME
  );
  assert.equal(invalidateLlmCacheScope({ type: "workspace", workspaceId: "ws-1" }).invalidatedCount, 1);
  const missAfterWorkspace = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    })
  );
  assert.equal(missAfterWorkspace.hit, false);
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  assert.equal(invalidateLlmCacheScope({ type: "provider", provider: "openai" }).invalidatedCount, 2);
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  assert.equal(invalidateLlmCacheScope({ type: "version", version: "LLM/12" }).invalidatedCount, 1);
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  assert.equal(invalidateLlmCacheScope({ type: "model", model: "gpt-4o-mini" }).invalidatedCount, 1);
});

test("never stores non-cacheable error responses", () => {
  const reasons = [
    "authentication_failure",
    "provider_error",
    "timeout",
    "partial_stream",
    "invalid_response",
  ] as const;
  for (const reason of reasons) {
    resetLlmCachePlatformForTests();
    const result = storeLlmCacheResponse(
      buildStoreRequest({ cacheable: false, nonCacheableReason: reason }),
      FIXED_TIME
    );
    assert.equal(result.stored, false, reason);
    const lookup = lookupLlmCache(
      Object.freeze({
        keyInput: BASE_KEY_INPUT,
        scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
      })
    );
    assert.equal(lookup.hit, false, reason);
  }
});

test("tracks cache statistics without influencing lookup decisions", () => {
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    }),
    FIXED_TIME
  );
  lookupLlmCache(
    Object.freeze({
      keyInput: Object.freeze({ ...BASE_KEY_INPUT, model: "gpt-4o" }),
      scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
    }),
    FIXED_TIME
  );
  const stats = getLlmCacheStatistics();
  assert.equal(stats.hits, 1);
  assert.equal(stats.misses, 1);
  assert.equal(stats.hitRatio, 0.5);
  assert.equal(stats.savedTokens, 120);
  assert.equal(stats.estimatedCostSaved, 0.0024);
  assert.ok(stats.averageLookupTimeMs >= 0);
});

test("isolates session and organization cache policies", () => {
  storeLlmCacheResponse(
    buildStoreRequest({
      scope: Object.freeze({ policy: "session_cache", sessionId: "sess-1" }),
    }),
    FIXED_TIME
  );
  const sessionHit = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "session_cache", sessionId: "sess-1" }),
    }),
    FIXED_TIME
  );
  assert.equal(sessionHit.hit, true);
  const sessionMiss = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "session_cache", sessionId: "sess-2" }),
    })
  );
  assert.equal(sessionMiss.hit, false);
  storeLlmCacheResponse(
    buildStoreRequest({
      scope: Object.freeze({ policy: "organization_cache", organizationId: "org-1" }),
    }),
    FIXED_TIME
  );
  const orgHit = lookupLlmCache(
    Object.freeze({
      keyInput: BASE_KEY_INPUT,
      scope: Object.freeze({ policy: "organization_cache", organizationId: "org-1" }),
    }),
    FIXED_TIME
  );
  assert.equal(orgHit.hit, true);
});

test("exposes platform snapshot and public API registry", () => {
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  const snapshot = getLlmCachePlatformSnapshot();
  assert.equal(snapshot.platformVersion, "LLM/13");
  assert.equal(snapshot.runtimeDependency, "LLM/12");
  assert.equal(snapshot.entryCount, 1);
  assert.equal(typeof LlmCachePlatform.lookupLlmCache, "function");
  assert.ok(LLM_CACHE_PUBLIC_API_REGISTRY.includes("lookupLlmCache"));
  assert.ok(LLM_CACHE_SAFETY_RULES.includes("never_cache_provider_errors"));
});

test("lookup remains fast relative to simulated provider latency budget", () => {
  storeLlmCacheResponse(buildStoreRequest(), FIXED_TIME);
  const iterations = 100;
  const start = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    lookupLlmCache(
      Object.freeze({
        keyInput: BASE_KEY_INPUT,
        scope: Object.freeze({ policy: "workspace_cache", workspaceId: "ws-1" }),
      }),
      FIXED_TIME
    );
  }
  const elapsed = performance.now() - start;
  const averageMs = elapsed / iterations;
  assert.ok(averageMs < 5, `Average lookup ${averageMs}ms exceeds fast lookup budget`);
});
