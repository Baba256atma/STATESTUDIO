import assert from "node:assert/strict";
import test from "node:test";

import {
  LLM_ARCHITECTURE_STACK,
  LLM_EXTENSION_POINT_KEYS,
  LLM_FUTURE_DEPENDENCY_RULES,
  LLM_PLATFORM_CONTRACT_VERSION,
  LLM_PLATFORM_MUST_NOT_OWN,
  LLM_PLATFORM_MUST_OWN,
  LLM_PLATFORM_PRINCIPLES,
  LLM_PROVIDER_KEYS,
  LLM_PUBLIC_API_REGISTRY,
  LLM_RELEASE_METADATA,
  LLM_RUNTIME_CONTRACT_KEYS,
} from "./llmPlatformContracts.ts";
import { getLlmPlatformBoundaries, validateLlmPlatformBoundaries } from "./llmPlatformBoundaries.ts";
import {
  LlmPlatformFoundation,
  buildLlmPlatformFoundation,
  createLlmPlatformFoundation,
  getLlmPlatformManifest,
  getLlmPlatformState,
  isLlmPlatformInitialized,
  resetLlmPlatformFoundationForTests,
  validateLlmPlatformContracts,
} from "./llmPlatformExports.ts";
import { getLlmPlatformIdentity, isLlmPlatformIdentityImmutable } from "./llmPlatformIdentity.ts";
import {
  getLlmPlatformRegistry,
  isLlmExtensionPointKey,
  isLlmProviderKey,
  isLlmRuntimeContractKey,
  registerLlmExtensionPoint,
  registerLlmProvider,
  registerLlmRuntimeContract,
} from "./llmPlatformRegistry.ts";
import type {
  LlmProviderAdapterContract,
  LlmRuntimeExecutionContract,
  LlmRuntimeRequestContract,
  LlmRuntimeResponseContract,
} from "./llmPlatformTypes.ts";
import {
  getLlmMigrationStrategy,
  getLlmPlatformVersionMetadata,
  isLlmVersionConsistent,
  validateLlmVersionFormat,
} from "./llmPlatformVersion.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/1 identity and contract vocabulary", () => {
  const identity = getLlmPlatformIdentity();
  assert.equal(identity.layerId, "LLM");
  assert.equal(identity.appId, "APP");
  assert.equal(identity.platformId, "llm-platform");
  assert.equal(identity.version, "LLM/1");
  assert.equal(identity.mvpStatus, "active");
  assert.equal(identity.releaseStage, "mvp-foundation");
  assert.equal(LLM_PROVIDER_KEYS.length, 6);
  assert.equal(LLM_EXTENSION_POINT_KEYS.length, 10);
  assert.equal(LLM_RUNTIME_CONTRACT_KEYS.length, 4);
});

test("platform identity is immutable", () => {
  assert.equal(isLlmPlatformIdentityImmutable(), true);
  assert.throws(() => {
    (getLlmPlatformIdentity() as { version: string }).version = "LLM/99";
  });
});

test("creates LLM platform foundation correctly", () => {
  assert.equal(isLlmPlatformInitialized(), false);
  const init = createLlmPlatformFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isLlmPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "LLM/1");
  assert.equal(init.data?.supportedProviders.length, 6);
  assert.equal(init.data?.supportedExtensionPoints.length, 10);
});

test("seeds registry with providers runtime contracts and extension points", () => {
  buildLlmPlatformFoundation(FIXED_TIME);
  const registry = getLlmPlatformRegistry();
  assert.equal(registry.providers.length, LLM_PROVIDER_KEYS.length);
  assert.equal(registry.runtimeContracts.length, LLM_RUNTIME_CONTRACT_KEYS.length);
  assert.equal(registry.extensionPoints.length, LLM_EXTENSION_POINT_KEYS.length);
  for (const provider of registry.providers) {
    assert.equal(provider.interchangeable, true);
    assert.equal(provider.version, LLM_PLATFORM_CONTRACT_VERSION);
  }
  for (const contract of registry.runtimeContracts) {
    assert.equal(contract.interfaceOnly, true);
  }
});

test("defines platform boundaries with no overlap", () => {
  const boundaries = getLlmPlatformBoundaries();
  assert.deepEqual(boundaries.owns, LLM_PLATFORM_MUST_OWN);
  assert.deepEqual(boundaries.doesNotOwn, LLM_PLATFORM_MUST_NOT_OWN);
  assert.equal(validateLlmPlatformBoundaries().length, 0);
  assert.ok(boundaries.owns.includes("provider_abstraction"));
  assert.ok(boundaries.doesNotOwn.includes("business_logic"));
  assert.ok(boundaries.doesNotOwn.includes("kpi_calculations"));
});

test("validates provider contract keys and registration", () => {
  buildLlmPlatformFoundation(FIXED_TIME);
  assert.equal(isLlmProviderKey("gpt"), true);
  assert.equal(isLlmProviderKey("unknown"), false);
  const result = registerLlmProvider("gpt", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.providerKey, "gpt");
});

test("validates runtime contract keys and registration", () => {
  buildLlmPlatformFoundation(FIXED_TIME);
  assert.equal(isLlmRuntimeContractKey("runtime_execution"), true);
  assert.equal(isLlmRuntimeContractKey("invalid"), false);
  const result = registerLlmRuntimeContract("runtime_request", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.contractKey, "runtime_request");
});

test("validates extension point registration", () => {
  buildLlmPlatformFoundation(FIXED_TIME);
  assert.equal(isLlmExtensionPointKey("prompt_builder"), true);
  assert.equal(isLlmExtensionPointKey("unknown"), false);
  const result = registerLlmExtensionPoint("cache", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.extensionPointKey, "cache");
  assert.equal(result.data?.status, "reserved");
});

test("maintains version consistency and migration strategy", () => {
  assert.equal(validateLlmVersionFormat("LLM/1"), true);
  assert.equal(validateLlmVersionFormat("KNL/1"), false);
  assert.equal(isLlmVersionConsistent(), true);
  const version = getLlmPlatformVersionMetadata();
  assert.equal(version.platformVersion, "LLM/1");
  assert.equal(version.additiveOnly, true);
  assert.equal(getLlmMigrationStrategy().breakingChangesForbidden, true);
});

test("validates platform contracts after foundation initialization", () => {
  const beforeInit = validateLlmPlatformContracts();
  assert.equal(beforeInit.valid, false);
  assert.ok(beforeInit.issues.some((issue) => issue.code === "not_initialized"));
  buildLlmPlatformFoundation(FIXED_TIME);
  const afterInit = validateLlmPlatformContracts();
  assert.equal(afterInit.valid, true);
  assert.equal(afterInit.issues.length, 0);
});

test("exposes stable public exports and manifest", () => {
  buildLlmPlatformFoundation(FIXED_TIME);
  const manifest = getLlmPlatformManifest();
  assert.equal(manifest.version, "LLM/1");
  assert.equal(manifest.lifecycle, "build");
  assert.deepEqual(manifest.publicApis, LLM_PUBLIC_API_REGISTRY);
  assert.equal(typeof LlmPlatformFoundation.buildLlmPlatformFoundation, "function");
  assert.equal(getLlmPlatformState(FIXED_TIME).initialized, true);
  assert.equal(LLM_RELEASE_METADATA.mvpStatus, "active");
  assert.equal(LLM_FUTURE_DEPENDENCY_RULES.length >= 3, true);
});

test("defines runtime and provider contract types as interface-only shapes", () => {
  const runtimeContract: LlmRuntimeExecutionContract = Object.freeze({
    contractKey: "runtime_execution",
    execute: undefined as never,
    readOnly: true as const,
  });
  const requestContract: LlmRuntimeRequestContract = Object.freeze({
    requestId: "req-1",
    providerKey: "gpt",
    modelId: "gpt-4o-mini",
    promptTransportRef: "transport-ref-1",
    readOnly: true as const,
  });
  const responseContract: LlmRuntimeResponseContract = Object.freeze({
    responseId: "res-1",
    requestId: "req-1",
    providerKey: "gpt",
    payloadRef: "payload-ref-1",
    readOnly: true as const,
  });
  const adapterContract: LlmProviderAdapterContract = Object.freeze({
    adapterId: "adapter-gpt",
    providerKey: "gpt",
    version: LLM_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
  assert.equal(runtimeContract.contractKey, "runtime_execution");
  assert.equal(requestContract.providerKey, "gpt");
  assert.equal(responseContract.requestId, "req-1");
  assert.equal(adapterContract.version, "LLM/1");
});

test("declares architecture stack with LLM as provider gateway layer", () => {
  assert.deepEqual(LLM_ARCHITECTURE_STACK, [
    "CORE",
    "KNL",
    "APP",
    "LLM",
    "SMM",
    "ASS",
    "IDN",
    "LAY",
    "EBUS",
    "INTG",
    "SEC",
    "OPS",
  ]);
  assert.ok(LLM_PLATFORM_PRINCIPLES.includes("llm_platform_is_only_provider_gateway"));
  assert.ok(LLM_PLATFORM_PRINCIPLES.includes("no_other_nexora_layer_calls_providers_directly"));
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const llmDirFiles = [
    "llmPlatformContracts.ts",
    "llmPlatformTypes.ts",
    "llmPlatformIdentity.ts",
    "llmPlatformVersion.ts",
    "llmPlatformRegistry.ts",
    "llmPlatformBoundaries.ts",
    "llmPlatformExports.ts",
  ];
  for (const file of llmDirFiles) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
  }
  assert.equal(LLM_EXTENSION_POINT_KEYS.includes("cache"), true);
  assert.equal(LLM_PLATFORM_MUST_NOT_OWN.includes("cache_execution"), true);
});
