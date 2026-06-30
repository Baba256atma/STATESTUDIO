import assert from "node:assert/strict";
import test from "node:test";

import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { resetLlmContextBuilderLayerForTests } from "./llmContextExports.ts";
import { LLM_COST_CONTRACT_VERSION } from "./llmCostContracts.ts";
import { resetLlmCostEstimatorLayerForTests } from "./llmCostExports.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import {
  LLM_ROUTER_CONTRACT_VERSION,
  LLM_ROUTER_DEFAULT_ROUTE,
  LLM_ROUTER_POLICY_KEYS,
  LLM_ROUTER_PRINCIPLES,
  LLM_ROUTER_PUBLIC_API_REGISTRY,
} from "./llmRouterContracts.ts";
import {
  ModelRouterPlatform,
  buildLlmModelRouterLayer,
  discoverLlmRoutePolicies,
  getLlmModelRouterLayerState,
  getLlmRouteManifest,
  getLlmRouterPlatformManifest,
  getLlmRouterRegistry,
  resetLlmModelRouterLayerForTests,
  selectLlmModelRoute,
  validateLlmRouteDecision,
} from "./llmRouterExports.ts";
import { isKnownLlmRoute } from "./llmRouterValidation.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope } from "./llmRuntimeEnvelope.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION } from "./llmTokenContracts.ts";
import { resetLlmTokenMeterLayerForTests } from "./llmTokenExports.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildRuntimeRequest(overrides: {
  requestId?: string;
  providerKey?: "gpt" | "claude" | "gemini" | "ollama" | "local_models";
  modelKey?: string;
} = {}) {
  return buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: overrides.requestId ?? "req-route-001",
      traceId: "trace-route-001",
      correlationId: "corr-route-001",
      userMessage: "Route this request deterministically.",
      systemInstructionRef: "system-ref-route",
      providerKey: overrides.providerKey ?? "gpt",
      modelKey: overrides.modelKey ?? "gpt-4o-mini",
      workspaceId: "ws-1",
      organizationId: "org-1",
      userId: "user-1",
    })
  );
}

test.beforeEach(() => {
  resetLlmModelRouterLayerForTests();
  resetLlmCostEstimatorLayerForTests();
  resetLlmTokenMeterLayerForTests();
  resetLlmContextBuilderLayerForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/8 model router vocabulary", () => {
  assert.equal(LLM_ROUTER_CONTRACT_VERSION, "LLM/8");
  assert.equal(LLM_ROUTER_POLICY_KEYS.length, 8);
  assert.equal(LLM_ROUTER_PUBLIC_API_REGISTRY.length, 7);
});

test("selects default route deterministically", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const result = selectLlmModelRoute(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), policyKey: "default_route" }),
    "route-dec-001",
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.decision?.providerKey, LLM_ROUTER_DEFAULT_ROUTE.providerKey);
  assert.equal(result.decision?.modelKey, LLM_ROUTER_DEFAULT_ROUTE.modelKey);
  assert.equal(validateLlmRouteDecision(result.decision!).valid, true);
});

test("selects provider-preferred and model-preferred routes", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const providerPreferred = selectLlmModelRoute(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest({ providerKey: "claude", modelKey: "unknown-model" }),
      policyKey: "provider_preferred",
    }),
    "route-dec-002",
    FIXED_TIME
  );
  assert.equal(providerPreferred.success, true);
  assert.equal(providerPreferred.decision?.providerKey, "claude");
  const modelPreferred = selectLlmModelRoute(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest({ providerKey: "gpt", modelKey: "gpt-4o" }),
      policyKey: "model_preferred",
    }),
    "route-dec-003",
    FIXED_TIME
  );
  assert.equal(modelPreferred.decision?.modelKey, "gpt-4o");
});

test("selects capability-based route", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const result = selectLlmModelRoute(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest(),
      policyKey: "capability_based",
      requiredCapabilities: Object.freeze(["function_calling", "vision"]),
    }),
    "route-dec-004",
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.decision?.providerKey, "gpt");
});

test("selects enterprise override route", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const result = selectLlmModelRoute(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest(),
      policyKey: "enterprise_override",
      enterpriseOverride: Object.freeze({ providerKey: "gemini", modelKey: "gemini-1.5-pro", readOnly: true as const }),
    }),
    "route-dec-005",
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.decision?.providerKey, "gemini");
});

test("validates fallback route and rejects invalid provider model pairs", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const result = selectLlmModelRoute(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), policyKey: "default_route" }),
    "route-dec-006",
    FIXED_TIME
  );
  assert.ok(isKnownLlmRoute(result.decision!.fallbackProviderKey, result.decision!.fallbackModelKey));
  const invalid = selectLlmModelRoute(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest(),
      policyKey: "model_preferred",
    }),
    "route-dec-invalid",
    FIXED_TIME
  );
  const invalidRequest = selectLlmModelRoute(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest({ providerKey: "gpt", modelKey: "nonexistent-model" }),
      policyKey: "model_preferred",
    }),
    "route-dec-invalid-2",
    FIXED_TIME
  );
  assert.equal(invalidRequest.success, false);
});

test("supports cost-aware placeholder route with pricing profile compatibility", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const result = selectLlmModelRoute(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), policyKey: "cost_aware" }),
    "route-dec-007",
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.ok(result.decision?.compatibility.includes("LLM/7"));
  assert.equal(validateLlmRouteDecision(result.decision!).valid, true);
});

test("generates route manifest and registers policies", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const registry = getLlmRouterRegistry();
  assert.equal(registry.policyCount, LLM_ROUTER_POLICY_KEYS.length);
  assert.ok(discoverLlmRoutePolicies().some((policy) => policy.policyKey === "local_first" && policy.placeholder));
  const manifest = getLlmRouteManifest(registry);
  assert.equal(manifest.routerVersion, "LLM/8");
  assert.equal(manifest.validationResult, "valid");
});

test("exposes stable public exports", () => {
  buildLlmModelRouterLayer(FIXED_TIME);
  const manifest = getLlmRouterPlatformManifest();
  assert.equal(manifest.version, "LLM/8");
  assert.deepEqual(manifest.publicApis, LLM_ROUTER_PUBLIC_API_REGISTRY);
  assert.equal(typeof ModelRouterPlatform.selectLlmModelRoute, "function");
  assert.equal(getLlmModelRouterLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_ROUTER_PRINCIPLES.includes("router_selects_only_never_executes"));
});

test("maintains LLM-1 through LLM-7 compatibility", () => {
  const layer = buildLlmModelRouterLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_CONTEXT_CONTRACT_VERSION, "LLM/5");
  assert.equal(LLM_TOKEN_CONTRACT_VERSION, "LLM/6");
  assert.equal(LLM_COST_CONTRACT_VERSION, "LLM/7");
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmRouterContracts.ts",
    "llmRouterTypes.ts",
    "llmRouterPolicies.ts",
    "llmRouterSelection.ts",
    "llmRouterValidation.ts",
    "llmRouterManifest.ts",
    "llmRouterRegistry.ts",
    "llmRouterExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
  }
});
