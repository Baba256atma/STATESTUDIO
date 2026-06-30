import assert from "node:assert/strict";
import test from "node:test";

import { LLM_PROVIDER_KEYS } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import {
  buildLlmProviderCapabilityDeclaration,
  buildLlmProviderCapabilitySet,
  getAllLlmProviderCapabilityKeys,
  isLlmProviderCapabilityKey,
  isLlmProviderReservedCapability,
} from "./llmProviderCapabilities.ts";
import {
  LLM_PROVIDER_CAPABILITY_KEYS,
  LLM_PROVIDER_CONTRACT_VERSION,
  LLM_PROVIDER_ERROR_CATEGORY_KEYS,
  LLM_PROVIDER_FOUNDATION_DEPENDENCY,
  LLM_PROVIDER_HEALTH_STATE_KEYS,
  LLM_PROVIDER_PRINCIPLES,
  LLM_PROVIDER_PUBLIC_API_REGISTRY,
} from "./llmProviderContracts.ts";
import {
  buildLlmProviderErrorContract,
  getAllLlmProviderErrorCategories,
  isLlmProviderErrorCategory,
  isLlmProviderErrorRetryable,
  normalizeLlmProviderErrorCategory,
} from "./llmProviderErrors.ts";
import {
  LlmProviderAdapterLayer,
  buildLlmProviderAdapterLayer,
  getLlmProviderAdapterLayerState,
  getLlmProviderAdapterManifest,
  resetLlmProviderAdapterLayerForTests,
  validateLlmProviderAdapterLayer,
  validateLlmProviderRegistry,
} from "./llmProviderExports.ts";
import {
  buildLlmProviderHealthContract,
  getAllLlmProviderHealthStates,
  isLlmProviderHealthState,
  isLlmProviderOperational,
} from "./llmProviderHealth.ts";
import {
  discoverLlmProviderAdapters,
  getLlmProviderAdapterRegistry,
  registerLlmProviderAdapter,
} from "./llmProviderRegistry.ts";
import type {
  LlmProviderRequestContract,
  LlmProviderResponseContract,
} from "./llmProviderTypes.ts";
import {
  validateLlmProviderFoundationCompatibility,
  validateLlmProviderRegistryUniqueness,
  validateLlmProviderRequestContract,
  validateLlmProviderResponseContract,
} from "./llmProviderValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/2 provider adapter contract vocabulary", () => {
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_PROVIDER_FOUNDATION_DEPENDENCY, "LLM/1");
  assert.equal(LLM_PROVIDER_CAPABILITY_KEYS.length, 11);
  assert.equal(LLM_PROVIDER_ERROR_CATEGORY_KEYS.length, 9);
  assert.equal(LLM_PROVIDER_HEALTH_STATE_KEYS.length, 5);
  assert.equal(LLM_PROVIDER_PUBLIC_API_REGISTRY.length, 7);
});

test("declares provider identity with immutable metadata", () => {
  buildLlmProviderAdapterLayer(FIXED_TIME);
  const adapter = discoverLlmProviderAdapters().find((entry) => entry.identity.providerKey === "gpt");
  assert.ok(adapter);
  assert.equal(adapter.identity.displayName, "OpenAI");
  assert.equal(adapter.identity.vendor, "OpenAI");
  assert.equal(adapter.identity.contractVersion, "LLM/2");
  assert.equal(adapter.identity.status, "registered");
  assert.ok(adapter.identity.supportedCapabilities.includes("chat"));
  assert.throws(() => {
    (adapter.identity as { displayName: string }).displayName = "Changed";
  });
});

test("declares capability model with reserved capabilities", () => {
  assert.equal(isLlmProviderCapabilityKey("streaming"), true);
  assert.equal(isLlmProviderCapabilityKey("unknown"), false);
  assert.equal(isLlmProviderReservedCapability("image_generation"), true);
  assert.equal(isLlmProviderReservedCapability("chat"), false);
  const declaration = buildLlmProviderCapabilityDeclaration("vision", true);
  assert.equal(declaration.supported, true);
  assert.equal(declaration.reserved, false);
  const gptCapabilities = buildLlmProviderCapabilitySet("gpt");
  assert.equal(gptCapabilities.length, getAllLlmProviderCapabilityKeys().length);
  assert.ok(gptCapabilities.some((capability) => capability.capabilityKey === "function_calling" && capability.supported));
});

test("defines canonical request and response contracts", () => {
  const request: LlmProviderRequestContract = Object.freeze({
    requestId: "req-1",
    providerKey: "gpt",
    modelId: "gpt-4o-mini",
    requestType: "chat",
    promptRef: "prompt-ref-1",
    contextRef: "context-ref-1",
    temperature: 0.2,
    maxTokens: 1024,
    stream: false,
    readOnly: true as const,
  });
  const response: LlmProviderResponseContract = Object.freeze({
    responseId: "res-1",
    requestId: "req-1",
    providerKey: "gpt",
    modelId: "gpt-4o-mini",
    responseType: "chat",
    payloadRef: "payload-ref-1",
    tokenCount: 120,
    finishReason: "stop",
    readOnly: true as const,
  });
  assert.equal(validateLlmProviderRequestContract(request).valid, true);
  assert.equal(validateLlmProviderResponseContract(response).valid, true);
});

test("defines standardized error categories without provider-specific exposure", () => {
  assert.equal(getAllLlmProviderErrorCategories().length, 9);
  assert.equal(isLlmProviderErrorCategory("rate_limit"), true);
  assert.equal(isLlmProviderErrorRetryable("rate_limit"), true);
  assert.equal(isLlmProviderErrorRetryable("authentication"), false);
  assert.equal(normalizeLlmProviderErrorCategory("openai_quota_exceeded"), "unknown_error");
  const error = buildLlmProviderErrorContract("err-1", "claude", "timeout", "Normalized timeout error.");
  assert.equal(error.category, "timeout");
  assert.equal(error.retryable, true);
  assert.equal(error.message.includes("openai"), false);
});

test("defines provider health states", () => {
  assert.equal(getAllLlmProviderHealthStates().length, 5);
  assert.equal(isLlmProviderHealthState("healthy"), true);
  assert.equal(isLlmProviderOperational("degraded"), true);
  assert.equal(isLlmProviderOperational("offline"), false);
  const health = buildLlmProviderHealthContract("health-1", "ollama", "healthy", "Contract registered.", FIXED_TIME);
  assert.equal(health.state, "healthy");
});

test("registers and discovers provider adapters with uniqueness", () => {
  buildLlmProviderAdapterLayer(FIXED_TIME);
  const registry = getLlmProviderAdapterRegistry();
  assert.equal(registry.adapterCount, LLM_PROVIDER_KEYS.length);
  assert.equal(discoverLlmProviderAdapters().length, LLM_PROVIDER_KEYS.length);
  assert.equal(validateLlmProviderRegistryUniqueness(registry.adapters).valid, true);
  const duplicate = registerLlmProviderAdapter(
    Object.freeze({ providerKey: "gpt", authMethod: "api_key" }),
    FIXED_TIME
  );
  assert.equal(duplicate.success, false);
});

test("validates contract completeness and version compatibility", () => {
  buildLlmProviderAdapterLayer(FIXED_TIME);
  const validation = validateLlmProviderAdapterLayer();
  assert.equal(validation.valid, true);
  assert.equal(validateLlmProviderFoundationCompatibility("LLM/1").valid, true);
  assert.equal(validateLlmProviderFoundationCompatibility("LLM/99").valid, false);
  const registryValidation = validateLlmProviderRegistry(getLlmProviderAdapterRegistry().adapters);
  assert.equal(registryValidation.valid, true);
});

test("exposes stable public exports and manifest", () => {
  buildLlmProviderAdapterLayer(FIXED_TIME);
  const manifest = getLlmProviderAdapterManifest();
  assert.equal(manifest.version, "LLM/2");
  assert.equal(manifest.foundationDependency, "LLM/1");
  assert.deepEqual(manifest.publicApis, LLM_PROVIDER_PUBLIC_API_REGISTRY);
  assert.equal(typeof LlmProviderAdapterLayer.buildLlmProviderAdapterLayer, "function");
  assert.equal(getLlmProviderAdapterLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_PROVIDER_PRINCIPLES.includes("nexora_never_knows_active_provider"));
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmProviderContracts.ts",
    "llmProviderTypes.ts",
    "llmProviderCapabilities.ts",
    "llmProviderErrors.ts",
    "llmProviderHealth.ts",
    "llmProviderRegistry.ts",
    "llmProviderValidation.ts",
    "llmProviderExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
  }
});

test("declares streaming tool-calling vision and embedding capabilities per provider", () => {
  buildLlmProviderAdapterLayer(FIXED_TIME);
  const gpt = discoverLlmProviderAdapters().find((adapter) => adapter.identity.providerKey === "gpt");
  const ollama = discoverLlmProviderAdapters().find((adapter) => adapter.identity.providerKey === "ollama");
  assert.ok(gpt?.identity.supportedCapabilities.includes("streaming"));
  assert.ok(gpt?.identity.supportedCapabilities.includes("function_calling"));
  assert.ok(gpt?.identity.supportedCapabilities.includes("vision"));
  assert.ok(gpt?.identity.supportedCapabilities.includes("embeddings"));
  assert.equal(ollama?.identity.supportedCapabilities.includes("function_calling"), false);
  assert.ok(ollama?.identity.supportedCapabilities.includes("embeddings"));
});

test("supports model discovery abstraction via request contract type", () => {
  const discoveryRequest: LlmProviderRequestContract = Object.freeze({
    requestId: "disc-1",
    providerKey: "gemini",
    modelId: "*",
    requestType: "model_discovery",
    promptRef: "",
    readOnly: true as const,
  });
  assert.equal(validateLlmProviderRequestContract(discoveryRequest).valid, true);
  assert.equal(discoveryRequest.requestType, "model_discovery");
});
