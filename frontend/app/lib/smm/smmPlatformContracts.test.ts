import assert from "node:assert/strict";
import test from "node:test";

import {
  SMM_ARCHITECTURE_STACK,
  SMM_EXTENSION_POINT_KEYS,
  SMM_FUTURE_DEPENDENCY_RULES,
  SMM_MODEL_ARTIFACT_TYPE_KEYS,
  SMM_MODEL_CONTRACT_KEYS,
  SMM_MODEL_SCOPE_KEYS,
  SMM_PLATFORM_CONTRACT_VERSION,
  SMM_PLATFORM_MUST_NOT_OWN,
  SMM_PLATFORM_MUST_OWN,
  SMM_PLATFORM_PRINCIPLES,
  SMM_POSITION_STATEMENT,
  SMM_PUBLIC_API_REGISTRY,
  SMM_RELEASE_METADATA,
} from "./smmPlatformContracts.ts";
import { getSmmPlatformBoundaries, getSmmPlatformPositionStatement, validateSmmPlatformBoundaries } from "./smmPlatformBoundaries.ts";
import {
  SharedMentalModelPlatform,
  buildSmmPlatformFoundation,
  createSmmPlatformFoundation,
  getSmmPlatformManifest,
  getSmmPlatformState,
  isSmmPlatformInitialized,
  resetSmmPlatformFoundationForTests,
  validateSmmPlatformContracts,
} from "./smmPlatformExports.ts";
import { getSmmPlatformIdentity, isSmmPlatformIdentityImmutable } from "./smmPlatformIdentity.ts";
import {
  getSmmPlatformRegistry,
  isSmmExtensionPointKey,
  isSmmModelArtifactTypeKey,
  isSmmModelContractKey,
  isSmmModelScopeKey,
  registerSmmExtensionPoint,
  registerSmmModelArtifactType,
  registerSmmModelContract,
  registerSmmModelScope,
} from "./smmPlatformRegistry.ts";
import type {
  SmmModelDefinitionContract,
  SmmModelReferenceContract,
  SmmModelSnapshotContract,
  SmmModelSyncContract,
} from "./smmPlatformTypes.ts";
import {
  getSmmMigrationStrategy,
  getSmmPlatformVersionMetadata,
  isSmmVersionConsistent,
  validateSmmVersionFormat,
} from "./smmPlatformVersion.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetSmmPlatformFoundationForTests();
});

test("exports SMM/1 identity and contract vocabulary", () => {
  const identity = getSmmPlatformIdentity();
  assert.equal(identity.layerId, "SMM");
  assert.equal(identity.appId, "APP");
  assert.equal(identity.platformId, "smm-platform");
  assert.equal(identity.version, "SMM/1");
  assert.equal(identity.mvpStatus, "active");
  assert.equal(identity.releaseStage, "mvp-foundation");
  assert.equal(SMM_MODEL_SCOPE_KEYS.length, 6);
  assert.equal(SMM_MODEL_ARTIFACT_TYPE_KEYS.length, 6);
  assert.equal(SMM_MODEL_CONTRACT_KEYS.length, 6);
  assert.equal(SMM_EXTENSION_POINT_KEYS.length, 8);
});

test("platform identity is immutable", () => {
  assert.equal(isSmmPlatformIdentityImmutable(), true);
  assert.throws(() => {
    (getSmmPlatformIdentity() as { version: string }).version = "SMM/99";
  });
});

test("creates SMM platform foundation correctly", () => {
  assert.equal(isSmmPlatformInitialized(), false);
  const init = createSmmPlatformFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isSmmPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "SMM/1");
  assert.equal(init.data?.supportedScopes.length, 6);
  assert.equal(init.data?.supportedExtensionPoints.length, 8);
});

test("seeds registry with scopes artifact types model contracts and extension points", () => {
  buildSmmPlatformFoundation(FIXED_TIME);
  const registry = getSmmPlatformRegistry();
  assert.equal(registry.scopes.length, SMM_MODEL_SCOPE_KEYS.length);
  assert.equal(registry.artifactTypes.length, SMM_MODEL_ARTIFACT_TYPE_KEYS.length);
  assert.equal(registry.modelContracts.length, SMM_MODEL_CONTRACT_KEYS.length);
  assert.equal(registry.extensionPoints.length, SMM_EXTENSION_POINT_KEYS.length);
  for (const scope of registry.scopes) {
    assert.equal(scope.referenceOnly, true);
    assert.equal(scope.version, SMM_PLATFORM_CONTRACT_VERSION);
  }
  for (const artifactType of registry.artifactTypes) {
    assert.equal(artifactType.declarativeOnly, true);
  }
  for (const contract of registry.modelContracts) {
    assert.equal(contract.interfaceOnly, true);
  }
});

test("defines platform boundaries with no overlap", () => {
  const boundaries = getSmmPlatformBoundaries();
  assert.deepEqual(boundaries.owns, SMM_PLATFORM_MUST_OWN);
  assert.deepEqual(boundaries.doesNotOwn, SMM_PLATFORM_MUST_NOT_OWN);
  assert.equal(validateSmmPlatformBoundaries().length, 0);
  assert.ok(boundaries.owns.includes("shared_mental_model_contracts"));
  assert.ok(boundaries.doesNotOwn.includes("inference_algorithms"));
  assert.ok(boundaries.doesNotOwn.includes("ai_reasoning"));
});

test("declares SMM position inside Nexora architecture", () => {
  const position = getSmmPlatformPositionStatement();
  assert.ok(position.smmIsNot.includes("an_inference_engine"));
  assert.ok(position.smmIsNot.includes("an_ai_reasoning_system"));
  assert.ok(position.smmIs.includes("shared_mental_model_contract_layer"));
  assert.ok(SMM_POSITION_STATEMENT.smmIsNot.includes("an_llm_provider_layer"));
});

test("validates model scope artifact type and contract registration", () => {
  buildSmmPlatformFoundation(FIXED_TIME);
  assert.equal(isSmmModelScopeKey("workspace"), true);
  assert.equal(isSmmModelScopeKey("unknown"), false);
  assert.equal(isSmmModelArtifactTypeKey("belief"), true);
  assert.equal(isSmmModelContractKey("model_snapshot"), true);
  assert.equal(registerSmmModelScope("scenario", FIXED_TIME).success, true);
  assert.equal(registerSmmModelArtifactType("constraint", FIXED_TIME).success, true);
  assert.equal(registerSmmModelContract("model_reference", FIXED_TIME).success, true);
});

test("validates extension point registration", () => {
  buildSmmPlatformFoundation(FIXED_TIME);
  assert.equal(isSmmExtensionPointKey("model_builder"), true);
  assert.equal(isSmmExtensionPointKey("unknown"), false);
  const result = registerSmmExtensionPoint("model_query", FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.extensionPointKey, "model_query");
  assert.equal(result.data?.status, "reserved");
});

test("maintains version consistency and migration strategy", () => {
  assert.equal(validateSmmVersionFormat("SMM/1"), true);
  assert.equal(validateSmmVersionFormat("LLM/1"), false);
  assert.equal(isSmmVersionConsistent(), true);
  const version = getSmmPlatformVersionMetadata();
  assert.equal(version.platformVersion, "SMM/1");
  assert.equal(version.additiveOnly, true);
  assert.equal(getSmmMigrationStrategy().breakingChangesForbidden, true);
});

test("validates platform contracts after foundation initialization", () => {
  const beforeInit = validateSmmPlatformContracts();
  assert.equal(beforeInit.valid, false);
  assert.ok(beforeInit.issues.some((issue) => issue.code === "not_initialized"));
  buildSmmPlatformFoundation(FIXED_TIME);
  const afterInit = validateSmmPlatformContracts();
  assert.equal(afterInit.valid, true);
  assert.equal(afterInit.issues.length, 0);
});

test("exposes stable public exports and manifest", () => {
  buildSmmPlatformFoundation(FIXED_TIME);
  const manifest = getSmmPlatformManifest();
  assert.equal(manifest.version, "SMM/1");
  assert.equal(manifest.lifecycle, "build");
  assert.deepEqual(manifest.publicApis, SMM_PUBLIC_API_REGISTRY);
  assert.equal(typeof SharedMentalModelPlatform.buildSmmPlatformFoundation, "function");
  assert.equal(getSmmPlatformState(FIXED_TIME).initialized, true);
  assert.equal(SMM_RELEASE_METADATA.mvpStatus, "active");
  assert.equal(SMM_FUTURE_DEPENDENCY_RULES.length >= 5, true);
});

test("defines model contract types as interface-only shapes", () => {
  const definitionContract: SmmModelDefinitionContract = Object.freeze({
    contractKey: "model_definition",
    define: undefined as never,
    readOnly: true as const,
  });
  const referenceContract: SmmModelReferenceContract = Object.freeze({
    referenceId: "ref-1",
    scopeKey: "workspace",
    artifactTypeKey: "belief",
    contentRef: "content-ref-1",
    readOnly: true as const,
  });
  const snapshotContract: SmmModelSnapshotContract = Object.freeze({
    snapshotId: "snap-1",
    modelVersion: "SMM/1",
    scopeKey: "scenario",
    payloadRef: "payload-ref-1",
    readOnly: true as const,
  });
  const syncContract: SmmModelSyncContract = Object.freeze({
    contractKey: "model_sync",
    synchronize: undefined as never,
    readOnly: true as const,
  });
  assert.equal(definitionContract.contractKey, "model_definition");
  assert.equal(referenceContract.scopeKey, "workspace");
  assert.equal(snapshotContract.modelVersion, "SMM/1");
  assert.equal(syncContract.contractKey, "model_sync");
});

test("declares architecture stack with SMM after LLM", () => {
  const smmIndex = SMM_ARCHITECTURE_STACK.indexOf("SMM");
  const llmIndex = SMM_ARCHITECTURE_STACK.indexOf("LLM");
  const appIndex = SMM_ARCHITECTURE_STACK.indexOf("APP");
  assert.ok(smmIndex > llmIndex);
  assert.ok(smmIndex > appIndex);
  assert.ok(SMM_PLATFORM_PRINCIPLES.includes("no_hidden_state"));
  assert.ok(SMM_PLATFORM_PRINCIPLES.includes("no_circular_dependencies"));
});

test("does not import certified Nexora modules", async () => {
  const { readFile } = await import("node:fs/promises");
  const smmDirFiles = [
    "smmPlatformContracts.ts",
    "smmPlatformTypes.ts",
    "smmPlatformIdentity.ts",
    "smmPlatformVersion.ts",
    "smmPlatformRegistry.ts",
    "smmPlatformBoundaries.ts",
    "smmPlatformExports.ts",
  ];
  for (const file of smmDirFiles) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmPlatform"), false, `${file} must not import LLM platform`);
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("inference("), false, `${file} must not implement inference`);
  }
  const registrySource = await readFile(new URL("./smmPlatformRegistry.ts", import.meta.url), "utf8");
  assert.equal(registrySource.includes("inference("), false, "registry must not implement inference");
});
