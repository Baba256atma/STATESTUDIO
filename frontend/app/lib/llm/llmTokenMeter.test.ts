import assert from "node:assert/strict";
import test from "node:test";

import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { resetLlmContextBuilderLayerForTests } from "./llmContextExports.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope, buildLlmRuntimeResponseEnvelope } from "./llmRuntimeEnvelope.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import {
  LLM_TOKEN_CONTRACT_VERSION,
  LLM_TOKEN_ESTIMATION_RULE,
  LLM_TOKEN_PRINCIPLES,
  LLM_TOKEN_PUBLIC_API_REGISTRY,
} from "./llmTokenContracts.ts";
import { aggregateTokenUsage, lookupTokenAggregation } from "./llmTokenAggregation.ts";
import {
  TokenUsageMeterPlatform,
  buildLlmTokenMeterLayer,
  estimateTokenUsage,
  getLlmTokenMeterLayerState,
  getLlmTokenPlatformManifest,
  getTokenManifest,
  getTokenRegistry,
  recordTokenUsage,
  resetLlmTokenMeterLayerForTests,
  validateTokenRecord,
} from "./llmTokenExports.ts";
import { estimateTokensFromText } from "./llmTokenEstimator.ts";
import { validateAggregationConsistency } from "./llmTokenValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildRuntimePair(userMessage: string, outputText: string) {
  const runtimeRequest = buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: `req-${userMessage.length}`,
      traceId: "trace-token-001",
      correlationId: "session-token-001",
      userMessage,
      systemInstructionRef: "system-ref-token",
      providerKey: "gpt",
      modelKey: "gpt-4o-mini",
      workspaceId: "ws-1",
      organizationId: "org-1",
      userId: "user-1",
    })
  );
  const runtimeResponse = buildLlmRuntimeResponseEnvelope(
    runtimeRequest,
    "completed",
    outputText,
    FIXED_TIME
  );
  return Object.freeze({ runtimeRequest, runtimeResponse });
}

test.beforeEach(() => {
  resetLlmTokenMeterLayerForTests();
  resetLlmContextBuilderLayerForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/6 token meter vocabulary", () => {
  assert.equal(LLM_TOKEN_CONTRACT_VERSION, "LLM/6");
  assert.equal(LLM_TOKEN_ESTIMATION_RULE.charsPerToken, 4);
  assert.equal(LLM_TOKEN_PUBLIC_API_REGISTRY.length, 7);
});

test("estimates tokens deterministically without provider tokenizers", () => {
  assert.equal(estimateTokensFromText(""), 0);
  assert.equal(estimateTokensFromText("abcd"), 1);
  assert.equal(estimateTokensFromText("abcde"), 2);
  const pair = buildRuntimePair("Hello world", "Response text here.");
  const estimate = estimateTokenUsage(Object.freeze({ runtimeRequest: pair.runtimeRequest, runtimeResponse: pair.runtimeResponse }));
  assert.ok(estimate.estimatedInputTokens > 0);
  assert.ok(estimate.estimatedOutputTokens > 0);
  assert.equal(estimate.totalTokens, estimate.estimatedInputTokens + estimate.estimatedOutputTokens);
  assert.equal(estimate.estimationRuleId, LLM_TOKEN_ESTIMATION_RULE.ruleId);
});

test("records token usage with immutable records", () => {
  buildLlmTokenMeterLayer(FIXED_TIME);
  const pair = buildRuntimePair("Analyze KPI trends for Q1.", "Executive summary output.");
  const result = recordTokenUsage(
    Object.freeze({ runtimeRequest: pair.runtimeRequest, runtimeResponse: pair.runtimeResponse, sessionId: "sess-1" }),
    "token-record-001",
    "res-token-001",
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.record?.sessionId, "sess-1");
  assert.equal(validateTokenRecord(result.record!).valid, true);
  assert.throws(() => {
    (result.record as { totalTokens: number }).totalTokens = 999;
  });
});

test("aggregates usage by all supported scopes", () => {
  buildLlmTokenMeterLayer(FIXED_TIME);
  const pairA = buildRuntimePair("Question A", "Answer A");
  const pairB = buildRuntimePair("Question B longer", "Answer B longer text");
  recordTokenUsage(Object.freeze({ runtimeRequest: pairA.runtimeRequest, runtimeResponse: pairA.runtimeResponse }), "rec-a", "res-a", FIXED_TIME);
  recordTokenUsage(
    Object.freeze({
      runtimeRequest: buildLlmRuntimeRequestEnvelope(
        Object.freeze({
          ...pairB.runtimeRequest,
          requestId: "req-b",
          userId: "user-2",
          workspaceId: "ws-2",
          organizationId: "org-2",
          providerKey: "claude",
          modelKey: "claude-3-5-sonnet",
        })
      ),
      runtimeResponse: buildLlmRuntimeResponseEnvelope(
        buildLlmRuntimeRequestEnvelope(
          Object.freeze({
            requestId: "req-b",
            traceId: "trace-b",
            correlationId: "sess-b",
            userMessage: "Question B longer",
            systemInstructionRef: "system-ref-token",
            providerKey: "claude",
            modelKey: "claude-3-5-sonnet",
            workspaceId: "ws-2",
            organizationId: "org-2",
            userId: "user-2",
          })
        ),
        "completed",
        "Answer B longer text",
        FIXED_TIME
      ),
    }),
    "rec-b",
    "res-b",
    FIXED_TIME
  );
  const registry = getTokenRegistry();
  assert.equal(registry.recordCount, 2);
  const userAgg = lookupTokenAggregation(registry.records, Object.freeze({ scope: "user", scopeKey: "user-1" }));
  assert.equal(userAgg?.responseCount, 1);
  const workspaceAgg = lookupTokenAggregation(registry.records, Object.freeze({ scope: "workspace", scopeKey: "ws-2" }));
  assert.equal(workspaceAgg?.responseCount, 1);
  const providerAgg = lookupTokenAggregation(registry.records, Object.freeze({ scope: "provider", scopeKey: "gpt" }));
  assert.equal(providerAgg?.responseCount, 1);
  const modelAgg = lookupTokenAggregation(registry.records, Object.freeze({ scope: "model", scopeKey: "claude-3-5-sonnet" }));
  assert.equal(modelAgg?.totalTokens, modelAgg?.estimatedInputTokens! + modelAgg?.estimatedOutputTokens!);
  const allAggregations = aggregateTokenUsage(registry.records);
  assert.ok(allAggregations.some((entry) => entry.scope === "organization"));
  assert.ok(allAggregations.some((entry) => entry.scope === "session"));
});

test("detects duplicate token records", () => {
  buildLlmTokenMeterLayer(FIXED_TIME);
  const pair = buildRuntimePair("Duplicate test", "Output");
  const input = Object.freeze({ runtimeRequest: pair.runtimeRequest, runtimeResponse: pair.runtimeResponse });
  assert.equal(recordTokenUsage(input, "rec-dup", "res-dup", FIXED_TIME).success, true);
  const duplicateId = recordTokenUsage(input, "rec-dup", "res-dup-2", FIXED_TIME);
  assert.equal(duplicateId.success, false);
  const duplicatePair = recordTokenUsage(input, "rec-dup-2", "res-dup", FIXED_TIME);
  assert.equal(duplicatePair.success, false);
});

test("validates aggregation consistency", () => {
  buildLlmTokenMeterLayer(FIXED_TIME);
  const pair = buildRuntimePair("Validation test", "Validated output");
  recordTokenUsage(Object.freeze({ runtimeRequest: pair.runtimeRequest, runtimeResponse: pair.runtimeResponse }), "rec-val", "res-val", FIXED_TIME);
  const registry = getTokenRegistry();
  const summary = lookupTokenAggregation(registry.records, Object.freeze({ scope: "user", scopeKey: "user-1" }))!;
  assert.equal(validateAggregationConsistency(registry.records, summary).valid, true);
});

test("generates token usage manifest", () => {
  buildLlmTokenMeterLayer(FIXED_TIME);
  const pair = buildRuntimePair("Manifest test", "Manifest output");
  recordTokenUsage(Object.freeze({ runtimeRequest: pair.runtimeRequest, runtimeResponse: pair.runtimeResponse }), "rec-man", "res-man", FIXED_TIME);
  const manifest = getTokenManifest(getTokenRegistry().records);
  assert.equal(manifest.meterVersion, "LLM/6");
  assert.equal(manifest.totalRecords, 1);
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("LLM/5"));
});

test("exposes stable public exports and registry behavior", () => {
  buildLlmTokenMeterLayer(FIXED_TIME);
  const manifest = getLlmTokenPlatformManifest();
  assert.equal(manifest.version, "LLM/6");
  assert.deepEqual(manifest.publicApis, LLM_TOKEN_PUBLIC_API_REGISTRY);
  assert.equal(typeof TokenUsageMeterPlatform.recordTokenUsage, "function");
  assert.equal(getLlmTokenMeterLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_TOKEN_PRINCIPLES.includes("no_billing_no_monetary_cost"));
});

test("maintains LLM-1 through LLM-5 compatibility", () => {
  const layer = buildLlmTokenMeterLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_CONTEXT_CONTRACT_VERSION, "LLM/5");
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmTokenContracts.ts",
    "llmTokenTypes.ts",
    "llmTokenEstimator.ts",
    "llmTokenUsage.ts",
    "llmTokenAggregation.ts",
    "llmTokenValidation.ts",
    "llmTokenManifest.ts",
    "llmTokenRegistry.ts",
    "llmTokenExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("calculateCost"), false, `${file} must not calculate cost`);
    assert.equal(source.includes("estimatedCost"), false, `${file} must not track monetary cost`);
  }
});
