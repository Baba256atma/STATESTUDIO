import assert from "node:assert/strict";
import test from "node:test";

import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import { resetSharedMentalModelDomainLayerForTests } from "./sharedMentalModelExports.ts";
import {
  createStableReferenceId,
  createStableSnapshotId,
  createStableVersionId,
} from "./sharedMentalModelIdentity.ts";
import { resetSharedMentalModelIdentityLayerForTests } from "./sharedMentalModelIdentityExports.ts";
import { SMM_DOMAIN_CONTRACT_VERSION } from "./sharedMentalModelContracts.ts";
import { SMM_IDENTITY_CONTRACT_VERSION } from "./sharedMentalModelIdentityContracts.ts";
import {
  SMM_SNAPSHOT_CONTRACT_VERSION,
  SMM_SNAPSHOT_IDENTITY_DEPENDENCY,
  SMM_SNAPSHOT_PRINCIPLES,
  SMM_SNAPSHOT_PUBLIC_API_REGISTRY,
  SMM_SNAPSHOT_REGISTRY_KEYS,
} from "./sharedMentalModelSnapshotContracts.ts";
import {
  SharedMentalModelSnapshotPlatform,
  buildSharedMentalModelSnapshotPlatform,
  getSharedMentalModelSnapshotManifest,
  getSharedMentalModelSnapshotRegistry,
  getSharedMentalModelVersionRegistry,
  registerSharedMentalModelBranch,
  registerSharedMentalModelLineage,
  registerSharedMentalModelSnapshot,
  registerSharedMentalModelSnapshotLifecycle,
  registerSharedMentalModelSnapshotManifest,
  registerSharedMentalModelVersionPlatform,
  resetSharedMentalModelSnapshotLayerForTests,
  validateSharedMentalModelSnapshots,
} from "./sharedMentalModelSnapshotExports.ts";
import {
  createStableBranchId,
  createStableLifecycleId,
  createStableLineageId,
  createStableSnapshotManifestId,
  isSharedMentalModelSnapshotImmutable,
} from "./sharedMentalModelSnapshotRegistry.ts";
import {
  validateBrokenLineage,
  validateDuplicateSnapshots,
  validateInvalidBranchReferences,
  validateInvalidParentReferences,
  validateManifestConsistency,
  validateVersionContinuity,
} from "./sharedMentalModelSnapshotValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const MODEL_ID = "smm-model-ws-001";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelSnapshotLayerForTests();
  resetSharedMentalModelIdentityLayerForTests();
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

function seedSnapshotPlatform(timestamp: string = FIXED_TIME): {
  snapshotId: string;
  versionId: string;
  branchId: string;
} {
  const branchId = createStableBranchId(MODEL_ID, "main");
  registerSharedMentalModelBranch(branchId, MODEL_ID, "main", null, null, timestamp);

  const snapshotV1Id = createStableSnapshotId(MODEL_ID, "v1");
  const versionV1Id = createStableVersionId(MODEL_ID, "v1");
  const workspaceRef = createStableReferenceId("workspace", "ws-1");
  const orgRef = createStableReferenceId("organization", "org-1");

  registerSharedMentalModelSnapshot(
    Object.freeze({
      snapshotId: snapshotV1Id,
      modelId: MODEL_ID,
      versionId: versionV1Id,
      parentSnapshotId: null,
      createdByMetadata: Object.freeze({ actor: "test" }),
      workspaceReferenceId: workspaceRef,
      organizationReferenceId: orgRef,
      branchReferenceId: branchId,
      lifecycleStatus: "created",
      immutableMetadata: Object.freeze({ label: "initial" }),
    }),
    timestamp
  );

  const snapshotV2Id = createStableSnapshotId(MODEL_ID, "v2");
  const versionV2Id = createStableVersionId(MODEL_ID, "v2");

  registerSharedMentalModelVersionPlatform(
    Object.freeze({
      versionId: versionV1Id,
      modelId: MODEL_ID,
      previousVersionId: null,
      nextVersionId: versionV2Id,
      branchMetadata: Object.freeze({ branch: branchId }),
      compatibilityMetadata: Object.freeze({ smm: "SMM/4" }),
      snapshotReferenceId: snapshotV1Id,
    }),
    timestamp
  );

  registerSharedMentalModelVersionPlatform(
    Object.freeze({
      versionId: versionV2Id,
      modelId: MODEL_ID,
      previousVersionId: versionV1Id,
      nextVersionId: null,
      branchMetadata: Object.freeze({ branch: branchId }),
      compatibilityMetadata: Object.freeze({ smm: "SMM/4" }),
      snapshotReferenceId: snapshotV2Id,
    }),
    timestamp
  );

  registerSharedMentalModelSnapshot(
    Object.freeze({
      snapshotId: snapshotV2Id,
      modelId: MODEL_ID,
      versionId: versionV2Id,
      parentSnapshotId: snapshotV1Id,
      createdByMetadata: Object.freeze({ actor: "test" }),
      workspaceReferenceId: workspaceRef,
      organizationReferenceId: orgRef,
      branchReferenceId: branchId,
      lifecycleStatus: "sealed",
    }),
    timestamp
  );

  registerSharedMentalModelLineage(
    createStableLineageId(snapshotV1Id, versionV1Id),
    MODEL_ID,
    snapshotV1Id,
    versionV1Id,
    null,
    null,
    branchId,
    timestamp
  );

  registerSharedMentalModelLineage(
    createStableLineageId(snapshotV2Id, versionV2Id),
    MODEL_ID,
    snapshotV2Id,
    versionV2Id,
    snapshotV1Id,
    versionV1Id,
    branchId,
    timestamp
  );

  registerSharedMentalModelSnapshotManifest(
    createStableSnapshotManifestId(snapshotV1Id),
    snapshotV1Id,
    MODEL_ID,
    versionV1Id,
    "payload-ref-v1",
    timestamp
  );

  registerSharedMentalModelSnapshotManifest(
    createStableSnapshotManifestId(snapshotV2Id),
    snapshotV2Id,
    MODEL_ID,
    versionV2Id,
    "payload-ref-v2",
    timestamp
  );

  registerSharedMentalModelSnapshotLifecycle(
    createStableLifecycleId(snapshotV1Id, "created"),
    snapshotV1Id,
    "created",
    Object.freeze({ event: "initial_capture" }),
    timestamp
  );

  registerSharedMentalModelSnapshotLifecycle(
    createStableLifecycleId(snapshotV2Id, "sealed"),
    snapshotV2Id,
    "sealed",
    Object.freeze({ event: "version_bump" }),
    timestamp
  );

  return { snapshotId: snapshotV2Id, versionId: versionV2Id, branchId };
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/4 snapshot platform vocabulary", () => {
  assert.equal(SMM_SNAPSHOT_CONTRACT_VERSION, "SMM/4");
  assert.equal(SMM_SNAPSHOT_IDENTITY_DEPENDENCY, "SMM/3");
  assert.equal(SMM_SNAPSHOT_REGISTRY_KEYS.length, 6);
  assert.equal(SMM_SNAPSHOT_PUBLIC_API_REGISTRY.length, 5);
});

test("builds snapshot platform through SMM-3 dependency chain", () => {
  const result = buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.contractVersion, "SMM/4");
  assert.equal(result.data?.identityDependency, "SMM/3");
});

test("registers immutable snapshots with full metadata", () => {
  buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  const { snapshotId } = seedSnapshotPlatform();
  const snapshots = getSharedMentalModelSnapshotRegistry();
  const snapshot = snapshots.find((entry) => entry.snapshotId === snapshotId)!;
  assert.ok(snapshot);
  assert.equal(isSharedMentalModelSnapshotImmutable(snapshot), true);
  assert.equal(snapshot.lifecycleStatus, "sealed");
  assert.equal(snapshot.parentSnapshotId?.includes("v1"), true);
});

test("registers version lineage with continuity metadata", () => {
  buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  seedSnapshotPlatform();
  const versions = getSharedMentalModelVersionRegistry();
  assert.equal(versions.length, 2);
  const v1 = versions.find((entry) => entry.versionId.includes("v1"))!;
  const v2 = versions.find((entry) => entry.versionId.includes("v2"))!;
  assert.equal(v1.nextVersionId, v2.versionId);
  assert.equal(v2.previousVersionId, v1.versionId);
});

test("validates lineage branch and manifest metadata", () => {
  buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  seedSnapshotPlatform();
  const registry = SharedMentalModelSnapshotPlatform.getSharedMentalModelSnapshotLayerState(FIXED_TIME).registry;
  assert.equal(validateDuplicateSnapshots(registry).valid, true);
  assert.equal(validateBrokenLineage(registry).valid, true);
  assert.equal(validateInvalidParentReferences(registry).valid, true);
  assert.equal(validateInvalidBranchReferences(registry).valid, true);
  assert.equal(validateVersionContinuity(registry).valid, true);
  assert.equal(validateManifestConsistency(registry).valid, true);
});

test("rejects duplicate snapshot registration", () => {
  buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  const branchId = createStableBranchId(MODEL_ID, "main");
  registerSharedMentalModelBranch(branchId, MODEL_ID, "main", null, null, FIXED_TIME);
  const snapshotId = createStableSnapshotId(MODEL_ID, "dup");
  const versionId = createStableVersionId(MODEL_ID, "dup");
  const input = Object.freeze({
    snapshotId,
    modelId: MODEL_ID,
    versionId,
    workspaceReferenceId: createStableReferenceId("workspace", "ws-dup"),
    organizationReferenceId: createStableReferenceId("organization", "org-dup"),
    branchReferenceId: branchId,
  });
  registerSharedMentalModelSnapshot(input, FIXED_TIME);
  const duplicate = registerSharedMentalModelSnapshot(input, FIXED_TIME);
  assert.equal(duplicate.success, false);
});

test("validates platform and generates manifest", () => {
  buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  seedSnapshotPlatform();
  const validation = validateSharedMentalModelSnapshots();
  assert.equal(validation.valid, true);
  const manifest = getSharedMentalModelSnapshotManifest();
  assert.equal(manifest.version, "SMM/4");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes(SMM_IDENTITY_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_DOMAIN_CONTRACT_VERSION));
});

test("exposes stable public exports", () => {
  buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
  assert.equal(typeof SharedMentalModelSnapshotPlatform.buildSharedMentalModelSnapshotPlatform, "function");
  assert.equal(SharedMentalModelSnapshotPlatform.version, "SMM/4");
  assert.ok(SMM_SNAPSHOT_PRINCIPLES.includes("snapshots_are_permanently_immutable"));
});

test("preserves SMM-1 SMM-2 and SMM-3 unchanged", async () => {
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
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildSharedMentalModelSnapshotPlatform(FIXED_TIME);
    seedSnapshotPlatform();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement inference runtime or merge algorithms", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelSnapshotContracts.ts",
    "sharedMentalModelSnapshotRegistry.ts",
    "sharedMentalModelSnapshotValidation.ts",
    "sharedMentalModelSnapshotExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
    assert.equal(source.includes("merge("), false, `${file} must not implement merge algorithms`);
    assert.equal(source.includes("align("), false, `${file} must not implement alignment`);
  }
});
