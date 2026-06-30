import assert from "node:assert/strict";
import test from "node:test";

import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { resetLlmContextBuilderLayerForTests } from "./llmContextExports.ts";
import {
  LLM_COST_CONTRACT_VERSION,
  LLM_COST_DEFAULT_CURRENCY,
  LLM_COST_PRINCIPLES,
  LLM_COST_PUBLIC_API_REGISTRY,
} from "./llmCostContracts.ts";
import { lookupLlmCostAggregation } from "./llmCostAggregation.ts";
import {
  CostEstimatorPlatform,
  aggregateLlmCost,
  buildLlmCostEstimatorLayer,
  estimateLlmCost,
  getLlmCostEstimatorLayerState,
  getLlmCostManifest,
  getLlmCostPlatformManifest,
  getLlmCostRegistry,
  recordLlmCost,
  registerProviderModelPricingProfile,
  resetLlmCostEstimatorLayerForTests,
  validateLlmCostRecord,
} from "./llmCostExports.ts";
import { calculateInputCost, calculateOutputCost, roundLlmCost } from "./llmCostEstimator.ts";
import { buildLlmCostPricingProfile } from "./llmCostPricing.ts";
import { validateCostAggregationConsistency } from "./llmCostValidation.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope, buildLlmRuntimeResponseEnvelope } from "./llmRuntimeEnvelope.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION } from "./llmTokenContracts.ts";
import { resetLlmTokenMeterLayerForTests } from "./llmTokenExports.ts";
import { buildTokenUsageRecord } from "./llmTokenUsage.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildTokenRecord(overrides: {
  recordId?: string;
  requestId?: string;
  userId?: string;
  workspaceId?: string;
  organizationId?: string;
  providerKey?: "gpt" | "claude";
  modelKey?: string;
  inputTokens?: number;
  outputTokens?: number;
} = {}) {
  const runtimeRequest = buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: overrides.requestId ?? "req-cost-001",
      traceId: "trace-cost-001",
      correlationId: "corr-cost-001",
      userMessage: "Cost estimation test message.",
      systemInstructionRef: "system-ref-cost",
      providerKey: overrides.providerKey ?? "gpt",
      modelKey: overrides.modelKey ?? "gpt-4o-mini",
      workspaceId: overrides.workspaceId ?? "ws-1",
      organizationId: overrides.organizationId ?? "org-1",
      userId: overrides.userId ?? "user-1",
    })
  );
  const runtimeResponse = buildLlmRuntimeResponseEnvelope(runtimeRequest, "completed", "Cost output.", FIXED_TIME);
  const record = buildTokenUsageRecord(
    Object.freeze({ runtimeRequest, runtimeResponse }),
    overrides.recordId ?? "token-rec-001",
    "res-cost-001",
    FIXED_TIME,
    overrides.inputTokens !== undefined || overrides.outputTokens !== undefined
      ? Object.freeze({
          estimatedInputTokens: overrides.inputTokens ?? 100,
          estimatedOutputTokens: overrides.outputTokens ?? 50,
          totalTokens: (overrides.inputTokens ?? 100) + (overrides.outputTokens ?? 50),
        })
      : undefined
  );
  return record;
}

test.beforeEach(() => {
  resetLlmCostEstimatorLayerForTests();
  resetLlmTokenMeterLayerForTests();
  resetLlmContextBuilderLayerForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/7 cost estimator vocabulary", () => {
  assert.equal(LLM_COST_CONTRACT_VERSION, "LLM/7");
  assert.equal(LLM_COST_DEFAULT_CURRENCY, "USD");
  assert.equal(LLM_COST_PUBLIC_API_REGISTRY.length, 7);
});

test("registers pricing profiles and estimates cost from token records", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  const tokenRecord = buildTokenRecord({ inputTokens: 1000, outputTokens: 500 });
  const estimate = estimateLlmCost(Object.freeze({ tokenRecord }));
  assert.ok(estimate);
  assert.equal(estimate?.currency, "USD");
  assert.equal(estimate?.totalEstimatedCost, roundLlmCost(estimate!.inputCost + estimate!.outputCost));
  const profile = buildLlmCostPricingProfile("gpt", "gpt-4o-mini", FIXED_TIME);
  assert.equal(calculateInputCost(1000, profile), roundLlmCost(1000 * profile.inputTokenPrice));
  assert.equal(calculateOutputCost(500, profile), roundLlmCost(500 * profile.outputTokenPrice));
});

test("records cost with input and output cost split", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  const tokenRecord = buildTokenRecord({ inputTokens: 2000, outputTokens: 1000 });
  const result = recordLlmCost(Object.freeze({ tokenRecord }), "cost-rec-001", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.record?.inputTokens, 2000);
  assert.equal(result.record?.outputTokens, 1000);
  assert.equal(result.record?.totalEstimatedCost, roundLlmCost(result.record!.inputCost + result.record!.outputCost));
  assert.equal(validateLlmCostRecord(result.record!).valid, true);
});

test("aggregates cost by all supported scopes with currency consistency", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  recordLlmCost(Object.freeze({ tokenRecord: buildTokenRecord({ recordId: "tok-a", inputTokens: 100, outputTokens: 50 }) }), "cost-a", FIXED_TIME);
  recordLlmCost(
    Object.freeze({
      tokenRecord: buildTokenRecord({
        recordId: "tok-b",
        requestId: "req-b",
        userId: "user-2",
        workspaceId: "ws-2",
        organizationId: "org-2",
        providerKey: "claude",
        modelKey: "claude-3-5-sonnet",
        inputTokens: 200,
        outputTokens: 100,
      }),
    }),
    "cost-b",
    FIXED_TIME
  );
  const registry = getLlmCostRegistry();
  assert.equal(registry.recordCount, 2);
  const userAgg = lookupLlmCostAggregation(registry.records, Object.freeze({ scope: "user", scopeKey: "user-1", currency: "USD" }));
  assert.equal(userAgg?.recordCount, 1);
  const workspaceAgg = lookupLlmCostAggregation(registry.records, Object.freeze({ scope: "workspace", scopeKey: "ws-2", currency: "USD" }));
  assert.equal(workspaceAgg?.currency, "USD");
  const providerAgg = lookupLlmCostAggregation(registry.records, Object.freeze({ scope: "provider", scopeKey: "gpt", currency: "USD" }));
  assert.ok(providerAgg!.totalEstimatedCost >= 0);
  const currencyAgg = lookupLlmCostAggregation(registry.records, Object.freeze({ scope: "currency", scopeKey: "USD" }));
  assert.equal(currencyAgg?.recordCount, 2);
  const allAggregations = aggregateLlmCost(registry.records);
  assert.ok(allAggregations.some((entry) => entry.scope === "model"));
  assert.ok(allAggregations.some((entry) => entry.scope === "organization"));
});

test("detects duplicate cost records", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  const tokenRecord = buildTokenRecord();
  const input = Object.freeze({ tokenRecord });
  assert.equal(recordLlmCost(input, "cost-dup", FIXED_TIME).success, true);
  assert.equal(recordLlmCost(input, "cost-dup", FIXED_TIME).success, false);
  assert.equal(recordLlmCost(input, "cost-dup-2", FIXED_TIME).success, false);
});

test("validates aggregation consistency and pricing profile registration", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  const profile = registerProviderModelPricingProfile("gpt", "gpt-4o", FIXED_TIME);
  assert.equal(profile.modelKey, "gpt-4o");
  recordLlmCost(Object.freeze({ tokenRecord: buildTokenRecord({ modelKey: "gpt-4o", recordId: "tok-gpt4o" }) }), "cost-gpt4o", FIXED_TIME);
  const registry = getLlmCostRegistry();
  const summary = lookupLlmCostAggregation(registry.records, Object.freeze({ scope: "model", scopeKey: "gpt-4o", currency: "USD" }))!;
  assert.equal(validateCostAggregationConsistency(registry.records, summary).valid, true);
});

test("generates cost manifest", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  recordLlmCost(Object.freeze({ tokenRecord: buildTokenRecord() }), "cost-man", FIXED_TIME);
  const manifest = getLlmCostManifest(getLlmCostRegistry().records);
  assert.equal(manifest.estimatorVersion, "LLM/7");
  assert.equal(manifest.totalRecords, 1);
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("LLM/6"));
});

test("exposes stable public exports", () => {
  buildLlmCostEstimatorLayer(FIXED_TIME);
  const manifest = getLlmCostPlatformManifest();
  assert.equal(manifest.version, "LLM/7");
  assert.deepEqual(manifest.publicApis, LLM_COST_PUBLIC_API_REGISTRY);
  assert.equal(typeof CostEstimatorPlatform.recordLlmCost, "function");
  assert.equal(getLlmCostEstimatorLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_COST_PRINCIPLES.includes("no_billing_no_payment_no_invoicing"));
});

test("maintains LLM-1 through LLM-6 compatibility", () => {
  const layer = buildLlmCostEstimatorLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_CONTEXT_CONTRACT_VERSION, "LLM/5");
  assert.equal(LLM_TOKEN_CONTRACT_VERSION, "LLM/6");
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmCostContracts.ts",
    "llmCostTypes.ts",
    "llmCostPricing.ts",
    "llmCostEstimator.ts",
    "llmCostAggregation.ts",
    "llmCostValidation.ts",
    "llmCostManifest.ts",
    "llmCostRegistry.ts",
    "llmCostExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("processPayment"), false, `${file} must not implement payment logic`);
    assert.equal(source.includes("enforceQuota"), false, `${file} must not enforce quotas`);
  }
});
