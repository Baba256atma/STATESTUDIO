import assert from "node:assert/strict";
import test from "node:test";

import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import { resetSharedMentalModelDomainLayerForTests } from "./sharedMentalModelExports.ts";
import { resetSharedMentalModelIdentityLayerForTests } from "./sharedMentalModelIdentityExports.ts";
import { resetSharedMentalModelSnapshotLayerForTests } from "./sharedMentalModelSnapshotExports.ts";
import { SMM_DOMAIN_CONTRACT_VERSION } from "./sharedMentalModelContracts.ts";
import { SMM_IDENTITY_CONTRACT_VERSION } from "./sharedMentalModelIdentityContracts.ts";
import { SMM_SNAPSHOT_CONTRACT_VERSION } from "./sharedMentalModelSnapshotContracts.ts";
import {
  SMM_SYNC_CONTRACT_VERSION,
  SMM_SYNC_POLICY_KEYS,
  SMM_SYNC_PRINCIPLES,
  SMM_SYNC_PUBLIC_API_REGISTRY,
  SMM_SYNC_REGISTRY_KEYS,
  SMM_SYNC_SCOPE_KEYS,
  SMM_SYNC_SNAPSHOT_DEPENDENCY,
} from "./sharedMentalModelSynchronizationContracts.ts";
import {
  SharedMentalModelSynchronizationPlatform,
  buildSharedMentalModelSynchronizationPlatform,
  getSharedMentalModelSynchronizationManifest,
  getSharedMentalModelSynchronizationPolicies,
  getSharedMentalModelSynchronizationRegistry,
  registerSharedMentalModelSynchronization,
  registerSharedMentalModelSynchronizationManifest,
  registerSharedMentalModelSynchronizationReference,
  registerSharedMentalModelSynchronizationScope,
  resetSharedMentalModelSynchronizationLayerForTests,
  validateSharedMentalModelSynchronization,
} from "./sharedMentalModelSynchronizationExports.ts";
import {
  createStableScopeMappingId,
  createStableSyncManifestId,
  createStableSyncReferenceId,
  createStableSynchronizationId,
  isSharedMentalModelSynchronizationImmutable,
} from "./sharedMentalModelSynchronizationRegistry.ts";
import {
  validateDuplicateSynchronizations,
  validateInvalidPolicies,
  validateInvalidReferences,
  validateInvalidScopes,
  validateSynchronizationManifestConsistency,
  validateVersionCompatibility,
} from "./sharedMentalModelSynchronizationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const MODEL_ID = "smm-model-ws-001";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelSynchronizationLayerForTests();
  resetSharedMentalModelSnapshotLayerForTests();
  resetSharedMentalModelIdentityLayerForTests();
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

function seedSynchronizationPlatform(timestamp: string = FIXED_TIME): string {
  const syncId = createStableSynchronizationId("workspace_workspace", "001");
  const sourceRef = createStableSyncReferenceId("source", "ws-a");
  const targetRef = createStableSyncReferenceId("target", "ws-b");

  registerSharedMentalModelSynchronizationReference(sourceRef, syncId, "source", "ws-ref-a", timestamp);
  registerSharedMentalModelSynchronizationReference(targetRef, syncId, "target", "ws-ref-b", timestamp);

  registerSharedMentalModelSynchronizationScope(
    createStableScopeMappingId("workspace_workspace", "001"),
    "workspace_workspace",
    "ws-ref-a",
    "ws-ref-b",
    MODEL_ID,
    timestamp
  );

  registerSharedMentalModelSynchronization(
    Object.freeze({
      synchronizationId: syncId,
      sourceReferenceId: sourceRef,
      targetReferenceId: targetRef,
      synchronizationScope: "workspace_workspace",
      synchronizationPolicy: "two_way",
      synchronizationStatusMetadata: Object.freeze({ status: "registered" }),
      versionCompatibilityMetadata: Object.freeze({
        contractVersion: "SMM/5",
        compatible_SMM_4: "true",
      }),
      snapshotReferenceIds: Object.freeze(["smm-snapshot-ref-v1", "smm-snapshot-ref-v2"]),
      createdMetadata: Object.freeze({ actor: "test" }),
      extensionMetadata: Object.freeze({ label: "workspace sync" }),
    }),
    timestamp
  );

  registerSharedMentalModelSynchronizationManifest(
    createStableSyncManifestId(syncId),
    syncId,
    "workspace_workspace",
    "two_way",
    "sync-payload-ref-001",
    timestamp
  );

  return syncId;
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/5 synchronization platform vocabulary", () => {
  assert.equal(SMM_SYNC_CONTRACT_VERSION, "SMM/5");
  assert.equal(SMM_SYNC_SNAPSHOT_DEPENDENCY, "SMM/4");
  assert.equal(SMM_SYNC_REGISTRY_KEYS.length, 6);
  assert.equal(SMM_SYNC_PUBLIC_API_REGISTRY.length, 5);
  assert.equal(SMM_SYNC_SCOPE_KEYS.length, 6);
  assert.equal(SMM_SYNC_POLICY_KEYS.length, 6);
});

test("builds synchronization platform through SMM-4 dependency chain", () => {
  const result = buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.contractVersion, "SMM/5");
  assert.equal(result.data?.snapshotDependency, "SMM/4");
});

test("seeds policy and validation registries on build", () => {
  buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  const policies = getSharedMentalModelSynchronizationPolicies();
  assert.equal(policies.length, 6);
  assert.ok(policies.some((entry) => entry.policyKey === "manual"));
  assert.ok(policies.some((entry) => entry.policyKey === "two_way"));
});

test("registers immutable synchronization records with full metadata", () => {
  buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  const syncId = seedSynchronizationPlatform();
  const registry = getSharedMentalModelSynchronizationRegistry();
  const sync = registry.find((entry) => entry.synchronizationId === syncId)!;
  assert.ok(sync);
  assert.equal(isSharedMentalModelSynchronizationImmutable(sync), true);
  assert.equal(sync.synchronizationScope, "workspace_workspace");
  assert.equal(sync.synchronizationPolicy, "two_way");
  assert.equal(sync.snapshotReferenceIds.length, 2);
});

test("validates references scopes policies and manifests", () => {
  buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  seedSynchronizationPlatform();
  const registry = SharedMentalModelSynchronizationPlatform.getSharedMentalModelSynchronizationLayerState(FIXED_TIME).registry;
  assert.equal(validateDuplicateSynchronizations(registry).valid, true);
  assert.equal(validateInvalidReferences(registry).valid, true);
  assert.equal(validateInvalidScopes(registry).valid, true);
  assert.equal(validateInvalidPolicies(registry).valid, true);
  assert.equal(validateVersionCompatibility(registry).valid, true);
  assert.equal(validateSynchronizationManifestConsistency(registry).valid, true);
});

test("rejects duplicate synchronization registration", () => {
  buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  const syncId = createStableSynchronizationId("model_model", "dup");
  const sourceRef = createStableSyncReferenceId("source", "dup-a");
  const targetRef = createStableSyncReferenceId("target", "dup-b");
  registerSharedMentalModelSynchronizationReference(sourceRef, syncId, "source", "ref-a", FIXED_TIME);
  registerSharedMentalModelSynchronizationReference(targetRef, syncId, "target", "ref-b", FIXED_TIME);
  const input = Object.freeze({
    synchronizationId: syncId,
    sourceReferenceId: sourceRef,
    targetReferenceId: targetRef,
    synchronizationScope: "model_model" as const,
    synchronizationPolicy: "manual" as const,
  });
  registerSharedMentalModelSynchronization(input, FIXED_TIME);
  const duplicate = registerSharedMentalModelSynchronization(input, FIXED_TIME);
  assert.equal(duplicate.success, false);
});

test("validates platform and generates manifest", () => {
  buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  seedSynchronizationPlatform();
  const validation = validateSharedMentalModelSynchronization();
  assert.equal(validation.valid, true);
  const manifest = getSharedMentalModelSynchronizationManifest();
  assert.equal(manifest.version, "SMM/5");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes(SMM_SNAPSHOT_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_IDENTITY_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_DOMAIN_CONTRACT_VERSION));
});

test("exposes stable public exports", () => {
  buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
  assert.equal(typeof SharedMentalModelSynchronizationPlatform.buildSharedMentalModelSynchronizationPlatform, "function");
  assert.equal(SharedMentalModelSynchronizationPlatform.version, "SMM/5");
  assert.ok(SMM_SYNC_PRINCIPLES.includes("no_runtime_synchronization_no_message_passing"));
});

test("preserves SMM-1 through SMM-4 unchanged", async () => {
  const { readFile } = await import("node:fs/promises");
  const certifiedFiles = [
    "smmPlatformContracts.ts",
    "smmPlatformExports.ts",
    "sharedMentalModelContracts.ts",
    "sharedMentalModelExports.ts",
    "sharedMentalModelRegistry.ts",
    "sharedMentalModelIdentityContracts.ts",
    "sharedMentalModelIdentityExports.ts",
    "sharedMentalModelIdentityStore.ts",
    "sharedMentalModelSnapshotContracts.ts",
    "sharedMentalModelSnapshotExports.ts",
    "sharedMentalModelSnapshotRegistry.ts",
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildSharedMentalModelSynchronizationPlatform(FIXED_TIME);
    seedSynchronizationPlatform();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement runtime sync event processing or alignment", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelSynchronizationContracts.ts",
    "sharedMentalModelSynchronizationRegistry.ts",
    "sharedMentalModelSynchronizationValidation.ts",
    "sharedMentalModelSynchronizationExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
    assert.equal(source.includes("align("), false, `${file} must not implement alignment`);
    assert.equal(source.includes("EventQueue"), false, `${file} must not implement event queues`);
    assert.equal(source.includes("consensus("), false, `${file} must not implement consensus`);
  }
});
