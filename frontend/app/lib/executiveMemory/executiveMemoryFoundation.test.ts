import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_MEMORY_CATEGORY_KEYS,
  EXECUTIVE_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_FUTURE_COMPATIBILITY,
  EXECUTIVE_MEMORY_FUTURE_PHASE_KEYS,
  EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS,
  EXECUTIVE_MEMORY_MUST_NOT_OWN,
  EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS,
  EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS,
  EXECUTIVE_MEMORY_TAGS,
} from "./executiveMemoryConstants.ts";
import {
  EXECUTIVE_MEMORY_FREEZE_RULES,
  EXECUTIVE_MEMORY_IDENTITY,
  EXECUTIVE_MEMORY_PUBLIC_API_RULES,
  EXECUTIVE_MEMORY_SELF_MANIFEST,
  ExecutiveMemoryContract,
  getExecutiveMemoryContractVersionMetadata,
  getExecutiveMemoryFutureCompatibility,
  isExecutiveMemoryCategory,
  resolveExecutiveMemoryExample,
  resolveExecutiveMemoryMetadataExample,
  resolveExecutiveMemoryProviderExample,
  validateExecutiveMemoryMetadataShape,
  validateExecutiveMemoryShape,
} from "./executiveMemoryContracts.ts";
import {
  getExecutiveMemoryPlatformState,
  initializeExecutiveMemoryPlatform,
  isExecutiveMemoryPlatformInitialized,
  resetExecutiveMemoryFoundationForTests,
} from "./executiveMemoryFoundation.ts";
import {
  ExecutiveMemoryPlatform,
  getExecutiveMemoryProvider,
  getExecutiveMemoryProviders,
  isExecutiveMemoryRegistered,
  registerExecutiveMemoryProvider,
  resetExecutiveMemoryPlatformForTests,
} from "./executiveMemoryPlatform.ts";
import {
  getExecutiveMemoryRegistryMetadata,
  listExecutiveMemoryProviderIds,
} from "./executiveMemoryRegistry.ts";
import {
  hasDuplicateProviderIds,
  isReservedExecutiveMemoryId,
  isReservedExecutiveMemoryProviderId,
  validateExecutiveMemoryProviderRegistration,
} from "./executiveMemoryValidation.ts";
import { runExecutiveIntentPlatformRefresh } from "../executiveIntent/executiveIntentPlatformRefresh.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
});

test("exports APP-4 identity and contract vocabulary", () => {
  assert.equal(EXECUTIVE_MEMORY_IDENTITY.appId, "APP-4");
  assert.equal(EXECUTIVE_MEMORY_IDENTITY.title, "Executive Memory");
  assert.equal(EXECUTIVE_MEMORY_IDENTITY.version, EXECUTIVE_MEMORY_CONTRACT_VERSION);
  assert.equal(EXECUTIVE_MEMORY_CATEGORY_KEYS.length, 15);
  for (const tag of [
    "[APP4_1]",
    "[EXECUTIVE_MEMORY_FOUNDATION]",
    "[EXECUTIVE_MEMORY_CONTRACT]",
    "[METADATA_ONLY]",
    "[NOT_CHAT_MEMORY]",
  ]) {
    assert.ok(EXECUTIVE_MEMORY_TAGS.includes(tag as (typeof EXECUTIVE_MEMORY_TAGS)[number]), tag);
  }
});

test("validates memory category enum guards", () => {
  assert.equal(isExecutiveMemoryCategory("goal"), true);
  assert.equal(isExecutiveMemoryCategory("intent"), true);
  assert.equal(isExecutiveMemoryCategory("timeline_reference"), true);
  assert.equal(isExecutiveMemoryCategory("chat_memory"), false);
});

test("validates executive memory example shape and metadata integrity", () => {
  const memory = resolveExecutiveMemoryExample(FIXED_TIME);
  const metadata = resolveExecutiveMemoryMetadataExample(FIXED_TIME);

  assert.equal(validateExecutiveMemoryShape(memory).valid, true);
  assert.equal(validateExecutiveMemoryMetadataShape(metadata).valid, true);
  assert.equal(memory.readOnly, true);
  assert.equal(metadata.readOnly, true);
  assert.equal(memory.contractVersion, "APP-4/1");
});

test("initializes executive memory platform correctly", () => {
  assert.equal(isExecutiveMemoryPlatformInitialized(), false);
  const init = initializeExecutiveMemoryPlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(init.data?.initialized, true);
  assert.equal(isExecutiveMemoryPlatformInitialized(), true);
  const state = getExecutiveMemoryPlatformState(FIXED_TIME);
  assert.equal(state.platformId, "executive-memory-platform");
  assert.equal(state.foundationVersion, "APP-4/1");
  assert.equal(state.readOnly, true);
});

test("registers and retrieves executive memory providers", () => {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  const registration = registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "provider-decision-archive",
      label: "Decision Archive Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["decision", "evidence"] as const),
      metadata: Object.freeze({ module: "executive-memory-foundation" }),
    }),
    FIXED_TIME
  );
  assert.equal(registration.success, true);
  assert.equal(isExecutiveMemoryRegistered("provider-decision-archive"), true);
  const provider = getExecutiveMemoryProvider("provider-decision-archive");
  assert.ok(provider);
  assert.equal(provider?.supportedCategories.length, 2);
  assert.equal(getExecutiveMemoryProviders().length, 1);
});

test("blocks duplicate provider registration", () => {
  const input = Object.freeze({
    providerId: "provider-duplicate-test",
    label: "Duplicate Provider",
    version: "1.0.0",
    supportedCategories: Object.freeze(["goal"] as const),
  });
  assert.equal(registerExecutiveMemoryProvider(input, FIXED_TIME).success, true);
  const duplicate = registerExecutiveMemoryProvider(input, FIXED_TIME);
  assert.equal(duplicate.success, false);
  assert.match(duplicate.reason, /already registered/i);
});

test("rejects reserved provider IDs", () => {
  for (const providerId of EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS) {
    assert.equal(isReservedExecutiveMemoryProviderId(providerId), true);
    const result = registerExecutiveMemoryProvider(
      Object.freeze({
        providerId,
        label: "Reserved Provider",
        version: "1.0.0",
        supportedCategories: Object.freeze(["metadata"] as const),
      }),
      FIXED_TIME
    );
    assert.equal(result.success, false);
  }
});

test("rejects invalid provider categories", () => {
  const result = registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "provider-invalid-category",
      label: "Invalid Category Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["chat_memory"] as const),
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Invalid memory category/i);
});

test("rejects empty provider category list", () => {
  const validation = validateExecutiveMemoryProviderRegistration(
    Object.freeze({
      providerId: "provider-no-categories",
      label: "No Categories",
      version: "1.0.0",
      supportedCategories: Object.freeze([]),
    })
  );
  assert.equal(validation.valid, false);
});

test("rejects reserved memory IDs in metadata validation", () => {
  for (const memoryId of EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS) {
    assert.equal(isReservedExecutiveMemoryId(memoryId), true);
  }
  const metadata = resolveExecutiveMemoryMetadataExample(FIXED_TIME);
  const invalid = Object.freeze({
    ...metadata,
    memoryId: "chat-memory",
    readOnly: true as const,
  });
  const validation = validateExecutiveMemoryMetadataShape(invalid);
  assert.equal(validation.valid, false);
});

test("provider lookup works and registry remains stable", () => {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "provider-alpha",
      label: "Alpha Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["scenario"] as const),
    }),
    FIXED_TIME
  );
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "provider-beta",
      label: "Beta Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["intent"] as const),
    }),
    FIXED_TIME
  );
  assert.deepEqual(listExecutiveMemoryProviderIds(), ["provider-alpha", "provider-beta"]);
  assert.equal(getExecutiveMemoryRegistryMetadata().providerCount, 2);
  assert.equal(hasDuplicateProviderIds(listExecutiveMemoryProviderIds()), false);
});

test("contracts and provider examples remain immutable", () => {
  const provider = resolveExecutiveMemoryProviderExample(FIXED_TIME);
  assert.equal(Object.isFrozen(provider), true);
  assert.equal(Object.isFrozen(provider.supportedCategories), true);
  assert.equal(Object.isFrozen(provider.metadata), true);
  assert.equal(ExecutiveMemoryContract.version, "APP-4/1");
});

test("declares future compatibility and must-not-own boundaries", () => {
  assert.equal(getExecutiveMemoryFutureCompatibility().metadataOnly, true);
  assert.equal(EXECUTIVE_MEMORY_FUTURE_COMPATIBILITY.retrievalReady, true);
  assert.ok(EXECUTIVE_MEMORY_MUST_NOT_OWN.includes("chat_memory"));
  assert.ok(EXECUTIVE_MEMORY_MUST_NOT_OWN.includes("memory_persistence"));
  assert.equal(EXECUTIVE_MEMORY_FUTURE_PHASE_KEYS.length, 8);
});

test("declares foundation public API rules without persistence", () => {
  assert.equal(EXECUTIVE_MEMORY_PUBLIC_API_RULES.noPersistence, true);
  assert.equal(EXECUTIVE_MEMORY_PUBLIC_API_RULES.noRetrieval, true);
  assert.equal(EXECUTIVE_MEMORY_PUBLIC_API_RULES.noStorage, true);
  assert.equal(EXECUTIVE_MEMORY_FREEZE_RULES.notChatMemory, true);
});

test("ExecutiveMemoryPlatform exposes foundation APIs", () => {
  assert.equal(typeof ExecutiveMemoryPlatform.initializeExecutiveMemoryPlatform, "function");
  assert.equal(typeof ExecutiveMemoryPlatform.registerExecutiveMemoryProvider, "function");
  assert.equal(typeof ExecutiveMemoryPlatform.getExecutiveMemoryProvider, "function");
  assert.equal(typeof ExecutiveMemoryPlatform.getExecutiveMemoryProviders, "function");
  assert.equal(typeof ExecutiveMemoryPlatform.isExecutiveMemoryRegistered, "function");
  assert.equal(typeof ExecutiveMemoryPlatform.getExecutiveMemoryPlatformState, "function");
  assert.equal(ExecutiveMemoryPlatform.version, "APP-4/1");
});

test("validates stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemoryPlatform.ts",
      allowedFiles: EXECUTIVE_MEMORY_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: EXECUTIVE_MEMORY_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    false
  );
});

test("getExecutiveMemoryContractVersionMetadata exposes version metadata", () => {
  const metadata = getExecutiveMemoryContractVersionMetadata();
  assert.equal(metadata.contractVersion, "APP-4/1");
  assert.equal(metadata.architectureVersion, "APP-4/1-arch");
});

test("platform state remains stable across repeated reads", () => {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  const first = getExecutiveMemoryPlatformState(FIXED_TIME);
  const second = getExecutiveMemoryPlatformState(FIXED_TIME);
  assert.equal(first.initialized, second.initialized);
  assert.equal(first.providerCount, second.providerCount);
  assert.deepEqual(first.supportedCategories, second.supportedCategories);
});

test("regression: existing APP-3 platform refresh remains certified", () => {
  const refresh = runExecutiveIntentPlatformRefresh(FIXED_TIME);
  assert.equal(refresh.certified, true);
  assert.equal(refresh.summary.platformFreezePreserved, true);
});

test("reset helpers restore foundation and registry state", () => {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "provider-reset-test",
      label: "Reset Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["goal"] as const),
    }),
    FIXED_TIME
  );
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryFoundationForTests();
  assert.equal(isExecutiveMemoryPlatformInitialized(), false);
  assert.equal(getExecutiveMemoryProviders().length, 0);
});

test("mandatory metadata fields cover future executive knowledge model", () => {
  assert.ok(EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS.includes("memoryId"));
  assert.ok(EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS.includes("references"));
  assert.ok(EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS.includes("tags"));
  assert.equal(EXECUTIVE_MEMORY_CATEGORY_KEYS.includes("kpi_reference"), true);
  assert.equal(EXECUTIVE_MEMORY_CATEGORY_KEYS.includes("risk_reference"), true);
  assert.equal(EXECUTIVE_MEMORY_CATEGORY_KEYS.includes("timeline_reference"), true);
});
