import assert from "node:assert/strict";
import test from "node:test";

import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import { resetSharedMentalModelDomainLayerForTests } from "./sharedMentalModelExports.ts";
import { resetSharedMentalModelIdentityLayerForTests } from "./sharedMentalModelIdentityExports.ts";
import { resetSharedMentalModelSnapshotLayerForTests } from "./sharedMentalModelSnapshotExports.ts";
import { resetSharedMentalModelSynchronizationLayerForTests } from "./sharedMentalModelSynchronizationExports.ts";
import { resetSharedMentalModelQueryLayerForTests } from "./sharedMentalModelQueryExports.ts";
import { SMM_DOMAIN_CONTRACT_VERSION } from "./sharedMentalModelContracts.ts";
import { SMM_QUERY_CONTRACT_VERSION } from "./sharedMentalModelQueryContracts.ts";
import { SMM_SYNC_CONTRACT_VERSION } from "./sharedMentalModelSynchronizationContracts.ts";
import {
  SMM_GOVERNANCE_CONTRACT_VERSION,
  SMM_GOVERNANCE_POLICY_KEYS,
  SMM_GOVERNANCE_PRINCIPLES,
  SMM_GOVERNANCE_PUBLIC_API_REGISTRY,
  SMM_GOVERNANCE_QUERY_DEPENDENCY,
  SMM_GOVERNANCE_REGISTRY_KEYS,
} from "./sharedMentalModelGovernanceContracts.ts";
import {
  SharedMentalModelGovernancePlatform,
  buildSharedMentalModelGovernancePlatform,
  getSharedMentalModelGovernanceManifest,
  getSharedMentalModelGovernancePolicies,
  getSharedMentalModelGovernanceRegistry,
  registerSharedMentalModelCompliance,
  registerSharedMentalModelGovernance,
  registerSharedMentalModelGovernanceAudit,
  registerSharedMentalModelGovernanceLifecycle,
  registerSharedMentalModelGovernanceManifest,
  registerSharedMentalModelOwnership,
  registerSharedMentalModelStewardship,
  resetSharedMentalModelGovernanceLayerForTests,
  validateSharedMentalModelGovernance,
} from "./sharedMentalModelGovernanceExports.ts";
import {
  createStableComplianceId,
  createStableGovernanceAuditRefId,
  createStableGovernanceId,
  createStableGovernanceLifecycleId,
  createStableGovernanceManifestId,
  createStableOwnershipId,
  createStableStewardshipId,
  isSharedMentalModelGovernanceImmutable,
} from "./sharedMentalModelGovernanceRegistry.ts";
import {
  validateDuplicateGovernanceIds,
  validateGovernanceManifestConsistency,
  validateInvalidAuditReferences,
  validateInvalidOwnerReferences,
  validateInvalidPolicyReferences,
  validateInvalidStewardReferences,
  validateLifecycleConsistency,
} from "./sharedMentalModelGovernanceValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const MODEL_REF = "smm-model-ref-001";
const OWNER_REF = "smm-owner-ref-001";
const STEWARD_REF = "smm-steward-ref-001";
const POLICY_REF = "smm-governance-policy-ownership";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelGovernanceLayerForTests();
  resetSharedMentalModelQueryLayerForTests();
  resetSharedMentalModelSynchronizationLayerForTests();
  resetSharedMentalModelSnapshotLayerForTests();
  resetSharedMentalModelIdentityLayerForTests();
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

function seedGovernancePlatform(timestamp: string = FIXED_TIME): string {
  const governanceId = createStableGovernanceId("001");
  const auditRef = createStableGovernanceAuditRefId(governanceId);

  registerSharedMentalModelOwnership(
    createStableOwnershipId(governanceId),
    governanceId,
    MODEL_REF,
    OWNER_REF,
    "Primary Owner",
    timestamp
  );

  registerSharedMentalModelStewardship(
    createStableStewardshipId(governanceId),
    governanceId,
    MODEL_REF,
    STEWARD_REF,
    "Model Steward",
    timestamp
  );

  registerSharedMentalModelGovernanceAudit(auditRef, governanceId, "audit-trail-ref-001", "Governance Audit Trail", timestamp);

  registerSharedMentalModelGovernance(
    Object.freeze({
      governanceId,
      modelReferenceId: MODEL_REF,
      ownerReferenceId: OWNER_REF,
      stewardReferenceId: STEWARD_REF,
      governancePolicyReferenceId: POLICY_REF,
      complianceMetadata: Object.freeze({ framework: "nexora-smm" }),
      auditReferenceId: auditRef,
      lifecycleMetadata: Object.freeze({ status: "active" }),
      versionCompatibilityMetadata: Object.freeze({ contractVersion: "SMM/7" }),
      createdMetadata: Object.freeze({ actor: "test" }),
      extensionMetadata: Object.freeze({ label: "primary governance" }),
    }),
    timestamp
  );

  registerSharedMentalModelCompliance(
    createStableComplianceId(governanceId, "framework"),
    governanceId,
    "framework",
    "nexora-smm",
    timestamp
  );

  registerSharedMentalModelGovernanceLifecycle(
    createStableGovernanceLifecycleId(governanceId, "active"),
    governanceId,
    "active",
    Object.freeze({ event: "governance_registered" }),
    timestamp
  );

  registerSharedMentalModelGovernanceManifest(
    createStableGovernanceManifestId(governanceId),
    governanceId,
    "ownership",
    "governance-payload-ref-001",
    timestamp
  );

  return governanceId;
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/7 governance platform vocabulary", () => {
  assert.equal(SMM_GOVERNANCE_CONTRACT_VERSION, "SMM/7");
  assert.equal(SMM_GOVERNANCE_QUERY_DEPENDENCY, "SMM/6");
  assert.equal(SMM_GOVERNANCE_REGISTRY_KEYS.length, 8);
  assert.equal(SMM_GOVERNANCE_PUBLIC_API_REGISTRY.length, 5);
  assert.equal(SMM_GOVERNANCE_POLICY_KEYS.length, 8);
});

test("builds governance platform through SMM-6 dependency chain", () => {
  const result = buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.contractVersion, "SMM/7");
  assert.equal(result.data?.queryDependency, "SMM/6");
});

test("seeds governance policy registry on build", () => {
  buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  const policies = getSharedMentalModelGovernancePolicies();
  assert.equal(policies.length, 8);
  assert.ok(policies.some((entry) => entry.policyKey === "ownership"));
  assert.ok(policies.some((entry) => entry.policyKey === "certification"));
});

test("registers immutable governance records with full metadata", () => {
  buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  const governanceId = seedGovernancePlatform();
  const registry = getSharedMentalModelGovernanceRegistry();
  const governance = registry.find((entry) => entry.governanceId === governanceId)!;
  assert.ok(governance);
  assert.equal(isSharedMentalModelGovernanceImmutable(governance), true);
  assert.equal(governance.ownerReferenceId, OWNER_REF);
  assert.equal(governance.governancePolicyReferenceId, POLICY_REF);
});

test("validates owner steward policy audit and lifecycle metadata", () => {
  buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  seedGovernancePlatform();
  const registry = SharedMentalModelGovernancePlatform.getSharedMentalModelGovernanceLayerState(FIXED_TIME).registry;
  assert.equal(validateDuplicateGovernanceIds(registry).valid, true);
  assert.equal(validateInvalidOwnerReferences(registry).valid, true);
  assert.equal(validateInvalidStewardReferences(registry).valid, true);
  assert.equal(validateInvalidPolicyReferences(registry).valid, true);
  assert.equal(validateInvalidAuditReferences(registry).valid, true);
  assert.equal(validateLifecycleConsistency(registry).valid, true);
  assert.equal(validateGovernanceManifestConsistency(registry).valid, true);
});

test("rejects duplicate governance registration", () => {
  buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  const governanceId = createStableGovernanceId("dup");
  const auditRef = createStableGovernanceAuditRefId(governanceId);
  registerSharedMentalModelOwnership(createStableOwnershipId(governanceId), governanceId, MODEL_REF, OWNER_REF, "Owner", FIXED_TIME);
  registerSharedMentalModelGovernanceAudit(auditRef, governanceId, "audit-ref", "Audit", FIXED_TIME);
  const input = Object.freeze({
    governanceId,
    modelReferenceId: MODEL_REF,
    ownerReferenceId: OWNER_REF,
    governancePolicyReferenceId: POLICY_REF,
    auditReferenceId: auditRef,
    lifecycleMetadata: Object.freeze({ status: "draft" }),
  });
  registerSharedMentalModelGovernance(input, FIXED_TIME);
  const duplicate = registerSharedMentalModelGovernance(input, FIXED_TIME);
  assert.equal(duplicate.success, false);
});

test("validates platform and generates manifest", () => {
  buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  seedGovernancePlatform();
  const validation = validateSharedMentalModelGovernance();
  assert.equal(validation.valid, true);
  const manifest = getSharedMentalModelGovernanceManifest();
  assert.equal(manifest.version, "SMM/7");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes(SMM_QUERY_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_SYNC_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_DOMAIN_CONTRACT_VERSION));
});

test("exposes stable public exports", () => {
  buildSharedMentalModelGovernancePlatform(FIXED_TIME);
  assert.equal(typeof SharedMentalModelGovernancePlatform.buildSharedMentalModelGovernancePlatform, "function");
  assert.equal(SharedMentalModelGovernancePlatform.version, "SMM/7");
  assert.ok(SMM_GOVERNANCE_PRINCIPLES.includes("no_policy_execution_no_permission_evaluation"));
});

test("preserves SMM-1 through SMM-6 unchanged", async () => {
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
    "sharedMentalModelSynchronizationContracts.ts",
    "sharedMentalModelSynchronizationExports.ts",
    "sharedMentalModelSynchronizationRegistry.ts",
    "sharedMentalModelQueryContracts.ts",
    "sharedMentalModelQueryExports.ts",
    "sharedMentalModelQueryRegistry.ts",
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildSharedMentalModelGovernancePlatform(FIXED_TIME);
    seedGovernancePlatform();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement authorization workflow or audit execution", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelGovernanceContracts.ts",
    "sharedMentalModelGovernanceRegistry.ts",
    "sharedMentalModelGovernanceValidation.ts",
    "sharedMentalModelGovernanceExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("authorize("), false, `${file} must not implement authorization`);
    assert.equal(source.includes("evaluatePermission("), false, `${file} must not evaluate permissions`);
    assert.equal(source.includes("workflow("), false, `${file} must not implement workflows`);
    assert.equal(source.includes("executeAudit("), false, `${file} must not execute audits`);
  }
});
