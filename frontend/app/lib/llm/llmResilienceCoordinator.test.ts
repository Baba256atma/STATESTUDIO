import assert from "node:assert/strict";
import test from "node:test";

import { resetLlmAuditObservabilityLayerForTests } from "./llmAuditExports.ts";
import { LLM_AUDIT_CONTRACT_VERSION } from "./llmAuditContracts.ts";
import { resetLlmContextBuilderLayerForTests } from "./llmContextExports.ts";
import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { resetLlmCostEstimatorLayerForTests } from "./llmCostExports.ts";
import { LLM_COST_CONTRACT_VERSION } from "./llmCostContracts.ts";
import { resetLlmModelRouterLayerForTests } from "./llmRouterExports.ts";
import { LLM_ROUTER_CONTRACT_VERSION } from "./llmRouterContracts.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import {
  LLM_RESILIENCE_CONTRACT_VERSION,
  LLM_RESILIENCE_FAILURE_CATEGORY_KEYS,
  LLM_RESILIENCE_PRINCIPLES,
  LLM_RESILIENCE_PUBLIC_API_REGISTRY,
  LLM_RESILIENCE_RETRY_POLICY_KEYS,
  LLM_RESILIENCE_TIMEOUT_POLICY_KEYS,
  LLM_RESILIENCE_FALLBACK_POLICY_KEYS,
} from "./llmResilienceContracts.ts";
import {
  classifyResilienceFailure,
  getAllLlmResilienceFailureCategoryKeys,
  resolveDefaultRetryPolicyForFailure,
  resolveRetryEligibility,
  resolveFallbackEligibility,
} from "./llmFailureClassification.ts";
import {
  ResilienceCoordinatorPlatform,
  buildLlmResilienceCoordinatorLayer,
  buildResilienceDecision,
  discoverResiliencePolicies,
  getLlmResilienceCoordinatorLayerState,
  getLlmResiliencePlatformManifest,
  getResilienceManifest,
  getResilienceRegistry,
  registerFallbackPolicy,
  registerRetryPolicy,
  registerTimeoutPolicy,
  resetLlmResilienceCoordinatorLayerForTests,
  validateResilienceDecision,
} from "./llmResilienceExports.ts";
import { resetLlmSecurityRedactionLayerForTests } from "./llmSecurityExports.ts";
import { LLM_SECURITY_CONTRACT_VERSION } from "./llmSecurityContracts.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import { resetLlmTokenMeterLayerForTests } from "./llmTokenExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION } from "./llmTokenContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllLlmLayersForTests(): void {
  resetLlmResilienceCoordinatorLayerForTests();
  resetLlmSecurityRedactionLayerForTests();
  resetLlmAuditObservabilityLayerForTests();
  resetLlmModelRouterLayerForTests();
  resetLlmCostEstimatorLayerForTests();
  resetLlmTokenMeterLayerForTests();
  resetLlmContextBuilderLayerForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllLlmLayersForTests();
});

test("exports LLM/11 resilience coordinator vocabulary", () => {
  assert.equal(LLM_RESILIENCE_CONTRACT_VERSION, "LLM/11");
  assert.equal(LLM_RESILIENCE_RETRY_POLICY_KEYS.length, 8);
  assert.equal(LLM_RESILIENCE_TIMEOUT_POLICY_KEYS.length, 5);
  assert.equal(LLM_RESILIENCE_FALLBACK_POLICY_KEYS.length, 5);
  assert.equal(LLM_RESILIENCE_FAILURE_CATEGORY_KEYS.length, 6);
  assert.equal(LLM_RESILIENCE_PUBLIC_API_REGISTRY.length, 9);
});

test("registers retry timeout and fallback policies", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const registry = getResilienceRegistry();
  assert.equal(registry.retryPolicyCount, LLM_RESILIENCE_RETRY_POLICY_KEYS.length);
  assert.equal(registry.timeoutPolicyCount, LLM_RESILIENCE_TIMEOUT_POLICY_KEYS.length);
  assert.equal(registry.fallbackPolicyCount, LLM_RESILIENCE_FALLBACK_POLICY_KEYS.length);
  const policies = discoverResiliencePolicies();
  assert.ok(policies.retryPolicies.some((policy) => policy.policyKey === "retry_once"));
  assert.ok(policies.timeoutPolicies.some((policy) => policy.policyKey === "standard"));
  assert.ok(policies.fallbackPolicies.some((policy) => policy.policyKey === "alternate_provider"));
});

test("classifies failures deterministically", () => {
  assert.equal(classifyResilienceFailure("timeout"), "timeout");
  assert.equal(classifyResilienceFailure("security_denial"), "security_denial");
  assert.equal(classifyResilienceFailure("invalid", Object.freeze({ failureHint: "timeout" })), "timeout");
  assert.equal(classifyResilienceFailure("invalid"), "unknown_failure");
  assert.equal(getAllLlmResilienceFailureCategoryKeys().length, 6);
});

test("creates resilience decision for provider unavailable failure", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const result = buildResilienceDecision(
    Object.freeze({
      requestId: "req-resilience-001",
      failureCategory: "provider_unavailable",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.decision?.failureCategory, "provider_unavailable");
  assert.equal(result.decision?.retryPolicyKey, "provider_failure");
  assert.equal(result.decision?.eligibility.retryEligible, true);
  assert.equal(result.decision?.eligibility.fallbackEligible, true);
  assert.equal(validateResilienceDecision(result.decision!).valid, true);
});

test("creates resilience decision with explicit timeout policy", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const result = buildResilienceDecision(
    Object.freeze({
      requestId: "req-resilience-002",
      failureCategory: "timeout",
      timeoutPolicyKey: "long",
    }),
    FIXED_TIME
  );
  assert.equal(result.decision?.timeoutPolicyKey, "long");
  assert.equal(result.decision?.metadata.timeoutMs, "120000");
  assert.equal(result.decision?.eligibility.timeoutEligible, true);
});

test("denies retry and fallback for security denial", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const result = buildResilienceDecision(
    Object.freeze({
      requestId: "req-resilience-003",
      failureCategory: "security_denial",
    }),
    FIXED_TIME
  );
  assert.equal(result.decision?.retryPolicyKey, "never_retry");
  assert.equal(result.decision?.fallbackPolicyKey, "no_fallback");
  assert.equal(result.decision?.eligibility.retryEligible, false);
  assert.equal(result.decision?.eligibility.fallbackEligible, false);
});

test("validates fallback compatibility with LLM-8 route policies", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const localFirst = registerFallbackPolicy(
    Object.freeze({ policyKey: "local_first", routePolicyReference: "local_first" }),
    FIXED_TIME
  );
  assert.equal(localFirst.routePolicyReference, "local_first");
  assert.throws(() =>
    registerFallbackPolicy(
      Object.freeze({ policyKey: "local_first", routePolicyReference: "default_route" }),
      FIXED_TIME
    )
  );
});

test("supports custom retry policy registration", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const custom = registerRetryPolicy(
    Object.freeze({
      policyKey: "configurable_retry",
      maxAttempts: 5,
      description: "Enterprise configurable retry profile.",
    }),
    FIXED_TIME
  );
  assert.equal(custom.maxAttempts, 5);
  const registry = getResilienceRegistry();
  const registered = registry.retryPolicies.find((policy) => policy.policyKey === "configurable_retry")!;
  assert.equal(resolveRetryEligibility(registered, "unknown_failure"), true);
});

test("generates resilience manifest and exposes stable exports", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const manifest = getResilienceManifest(getResilienceRegistry());
  assert.equal(manifest.resilienceVersion, "LLM/11");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("LLM/8"));
  assert.ok(manifest.compatibility.includes("LLM/10"));
  const platformManifest = getLlmResiliencePlatformManifest();
  assert.equal(platformManifest.version, "LLM/11");
  assert.deepEqual(platformManifest.publicApis, LLM_RESILIENCE_PUBLIC_API_REGISTRY);
  assert.equal(typeof ResilienceCoordinatorPlatform.buildResilienceDecision, "function");
  assert.equal(getLlmResilienceCoordinatorLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_RESILIENCE_PRINCIPLES.includes("coordinates_only_never_executes"));
});

test("maintains LLM-1 through LLM-10 compatibility", () => {
  const layer = buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_CONTEXT_CONTRACT_VERSION, "LLM/5");
  assert.equal(LLM_TOKEN_CONTRACT_VERSION, "LLM/6");
  assert.equal(LLM_COST_CONTRACT_VERSION, "LLM/7");
  assert.equal(LLM_ROUTER_CONTRACT_VERSION, "LLM/8");
  assert.equal(LLM_AUDIT_CONTRACT_VERSION, "LLM/9");
  assert.equal(LLM_SECURITY_CONTRACT_VERSION, "LLM/10");
  assert.equal(resolveDefaultRetryPolicyForFailure("validation_failure"), "never_retry");
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmResilienceContracts.ts",
    "llmResilienceTypes.ts",
    "llmRetryPolicies.ts",
    "llmTimeoutPolicies.ts",
    "llmFallbackPolicies.ts",
    "llmFailureClassification.ts",
    "llmResilienceValidation.ts",
    "llmResilienceManifest.ts",
    "llmResilienceRegistry.ts",
    "llmResilienceExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
  }
});

test("resolves fallback eligibility by failure category", () => {
  buildLlmResilienceCoordinatorLayer(FIXED_TIME);
  const registry = getResilienceRegistry();
  const alternate = registry.fallbackPolicies.find((policy) => policy.policyKey === "alternate_provider")!;
  assert.equal(resolveFallbackEligibility(alternate, "provider_unavailable"), true);
  assert.equal(resolveFallbackEligibility(alternate, "security_denial"), false);
});
