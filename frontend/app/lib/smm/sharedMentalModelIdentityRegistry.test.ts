import assert from "node:assert/strict";
import test from "node:test";

import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import { resetSharedMentalModelDomainLayerForTests } from "./sharedMentalModelExports.ts";
import { SMM_DOMAIN_CONTRACT_VERSION } from "./sharedMentalModelContracts.ts";
import {
  createStableModelId,
  createStableReferenceId,
  createStableSnapshotId,
  createStableVersionId,
  isSharedMentalModelIdentityImmutable,
} from "./sharedMentalModelIdentity.ts";
import {
  SMM_IDENTITY_CONTRACT_VERSION,
  SMM_IDENTITY_DOMAIN_DEPENDENCY,
  SMM_IDENTITY_PRINCIPLES,
  SMM_IDENTITY_PUBLIC_API_REGISTRY,
  SMM_IDENTITY_REGISTRY_KEYS,
} from "./sharedMentalModelIdentityContracts.ts";
import {
  SharedMentalModelIdentityPlatform,
  buildSharedMentalModelRegistry,
  getSharedMentalModelIdentityRegistry,
  getSharedMentalModelRegistryManifest,
  registerSharedMentalModelArtifact,
  registerSharedMentalModelExecutive,
  registerSharedMentalModelIdentity,
  registerSharedMentalModelOrganization,
  registerSharedMentalModelReference,
  registerSharedMentalModelScenario,
  registerSharedMentalModelSnapshot,
  registerSharedMentalModelVersion,
  registerSharedMentalModelWorkspace,
  resetSharedMentalModelIdentityLayerForTests,
  resolveSharedMentalModelReference,
  validateSharedMentalModelRegistry,
} from "./sharedMentalModelIdentityExports.ts";
import { resolveSharedMentalModelVersion } from "./sharedMentalModelReference.ts";
import {
  validateDuplicateIdentities,
  validateMissingReferences,
  validateParentChains,
  validateVersionReferences,
} from "./sharedMentalModelIdentityValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelIdentityLayerForTests();
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

function seedTestModelRegistry(timestamp: string = FIXED_TIME): string {
  const modelId = createStableModelId("ws", "001");
  const workspaceRef = createStableReferenceId("workspace", "ws-1");
  const orgRef = createStableReferenceId("organization", "org-1");
  const execRef = createStableReferenceId("executive", "exec-1");
  const snapshotRef = createStableReferenceId("snapshot", "snap-1");
  const parentRef = createStableReferenceId("parent", "parent-1");
  const snapshotId = createStableSnapshotId(modelId, "SMM/3");
  const versionId = createStableVersionId(modelId, "SMM/3");
  const versionRef = createStableReferenceId("version", "v1");

  registerSharedMentalModelReference(
    Object.freeze({ referenceId: workspaceRef, referenceType: "workspace", targetId: "ws-1", contentRef: "ws-ref-001", modelId }),
    timestamp
  );
  registerSharedMentalModelReference(
    Object.freeze({ referenceId: orgRef, referenceType: "organization", targetId: "org-1", contentRef: "org-ref-001", modelId }),
    timestamp
  );
  registerSharedMentalModelReference(
    Object.freeze({ referenceId: execRef, referenceType: "executive", targetId: "exec-1", contentRef: "exec-ref-001", modelId }),
    timestamp
  );
  registerSharedMentalModelReference(
    Object.freeze({ referenceId: snapshotRef, referenceType: "snapshot", targetId: snapshotId, contentRef: "snap-ref-001", modelId }),
    timestamp
  );
  registerSharedMentalModelReference(
    Object.freeze({ referenceId: versionRef, referenceType: "version", targetId: versionId, contentRef: "ver-ref-001", modelId }),
    timestamp
  );
  registerSharedMentalModelReference(
    Object.freeze({ referenceId: parentRef, referenceType: "parent", targetId: "parent-model", contentRef: "parent-ref-001", modelId: "parent-model" }),
    timestamp
  );

  registerSharedMentalModelSnapshot(snapshotId, modelId, "SMM/3", "payload-ref-001", timestamp);
  registerSharedMentalModelVersion(versionId, modelId, "SMM/3", null, timestamp);

  registerSharedMentalModelIdentity(
    Object.freeze({
      modelId,
      modelVersion: "SMM/3",
      parentReferenceId: parentRef,
      workspaceReferenceId: workspaceRef,
      organizationReferenceId: orgRef,
      executiveReferenceId: execRef,
      snapshotReferenceId: snapshotRef,
      originMetadata: Object.freeze({ source: "test" }),
    }),
    timestamp
  );

  registerSharedMentalModelWorkspace("reg-ws-001", modelId, "ws-ref-001", timestamp);
  registerSharedMentalModelOrganization("reg-org-001", modelId, "org-ref-001", timestamp);
  registerSharedMentalModelExecutive("reg-exec-001", modelId, "exec-ref-001", timestamp);
  registerSharedMentalModelScenario("reg-scenario-001", modelId, "scenario-ref-001", timestamp);
  registerSharedMentalModelArtifact("artifact-belief-001", modelId, "belief", "belief-ref-001", timestamp);

  return modelId;
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/3 identity registry vocabulary", () => {
  assert.equal(SMM_IDENTITY_CONTRACT_VERSION, "SMM/3");
  assert.equal(SMM_IDENTITY_DOMAIN_DEPENDENCY, "SMM/2");
  assert.equal(SMM_IDENTITY_REGISTRY_KEYS.length, 9);
  assert.equal(SMM_IDENTITY_PUBLIC_API_REGISTRY.length, 5);
});

test("builds identity registry layer through SMM-2 dependency chain", () => {
  const result = buildSharedMentalModelRegistry(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.contractVersion, "SMM/3");
  assert.equal(result.data?.domainDependency, "SMM/2");
});

test("registers model identity with immutable fields", () => {
  buildSharedMentalModelRegistry(FIXED_TIME);
  const modelId = seedTestModelRegistry();
  const registry = getSharedMentalModelIdentityRegistry();
  const identity = registry.identityRegistry.find((entry) => entry.modelId === modelId)!;
  assert.ok(identity);
  assert.equal(isSharedMentalModelIdentityImmutable(identity), true);
  assert.equal(identity.modelVersion, "SMM/3");
  assert.equal(identity.workspaceReferenceId.includes("workspace"), true);
});

test("resolves references and versions deterministically", () => {
  buildSharedMentalModelRegistry(FIXED_TIME);
  const modelId = seedTestModelRegistry();
  const workspaceRef = createStableReferenceId("workspace", "ws-1");
  const resolution = resolveSharedMentalModelReference(workspaceRef);
  assert.equal(resolution.success, true);
  assert.equal(resolution.reference?.modelId, modelId);
  const versionResolution = resolveSharedMentalModelVersion(modelId, "SMM/3", getSharedMentalModelIdentityRegistry());
  assert.equal(versionResolution.success, true);
});

test("detects duplicate identities and validates references", () => {
  buildSharedMentalModelRegistry(FIXED_TIME);
  seedTestModelRegistry();
  const registry = getSharedMentalModelIdentityRegistry();
  assert.equal(validateDuplicateIdentities(registry).valid, true);
  assert.equal(validateMissingReferences(registry).valid, true);
  assert.equal(validateParentChains(registry).valid, true);
  assert.equal(validateVersionReferences(registry).valid, true);
});

test("rejects duplicate model identity registration", () => {
  buildSharedMentalModelRegistry(FIXED_TIME);
  const modelId = seedTestModelRegistry();
  const duplicate = registerSharedMentalModelIdentity(
    Object.freeze({
      modelId,
      modelVersion: "SMM/3",
      workspaceReferenceId: createStableReferenceId("workspace", "ws-dup"),
      organizationReferenceId: createStableReferenceId("organization", "org-dup"),
      snapshotReferenceId: createStableReferenceId("snapshot", "snap-dup"),
    }),
    FIXED_TIME
  );
  assert.equal(duplicate.success, false);
});

test("validates registry and generates manifest", () => {
  buildSharedMentalModelRegistry(FIXED_TIME);
  seedTestModelRegistry();
  const validation = validateSharedMentalModelRegistry();
  assert.equal(validation.valid, true);
  const manifest = getSharedMentalModelRegistryManifest();
  assert.equal(manifest.version, "SMM/3");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("SMM/2"));
  assert.ok(manifest.compatibility.includes(SMM_DOMAIN_CONTRACT_VERSION));
});

test("exposes stable public exports", () => {
  buildSharedMentalModelRegistry(FIXED_TIME);
  assert.equal(typeof SharedMentalModelIdentityPlatform.buildSharedMentalModelRegistry, "function");
  assert.equal(SharedMentalModelIdentityPlatform.version, "SMM/3");
  assert.ok(SMM_IDENTITY_PRINCIPLES.includes("immutable_ids_never_change_after_creation"));
});

test("preserves SMM-1 and SMM-2 unchanged", async () => {
  const { readFile } = await import("node:fs/promises");
  const certifiedFiles = [
    "smmPlatformContracts.ts",
    "smmPlatformExports.ts",
    "sharedMentalModelContracts.ts",
    "sharedMentalModelExports.ts",
    "sharedMentalModelRegistry.ts",
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildSharedMentalModelRegistry(FIXED_TIME);
    seedTestModelRegistry();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement inference or runtime services", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelIdentityContracts.ts",
    "sharedMentalModelIdentity.ts",
    "sharedMentalModelIdentityStore.ts",
    "sharedMentalModelReference.ts",
    "sharedMentalModelIdentityValidation.ts",
    "sharedMentalModelIdentityExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
    assert.equal(source.includes("align("), false, `${file} must not implement alignment`);
  }
});
