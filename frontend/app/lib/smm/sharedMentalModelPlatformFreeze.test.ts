import assert from "node:assert/strict";
import test from "node:test";

import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import { SMM_PLATFORM_CONTRACT_VERSION } from "./smmPlatformContracts.ts";
import { resetSharedMentalModelDomainLayerForTests } from "./sharedMentalModelExports.ts";
import { SMM_DOMAIN_CONTRACT_VERSION } from "./sharedMentalModelContracts.ts";
import { resetSharedMentalModelIdentityLayerForTests } from "./sharedMentalModelIdentityExports.ts";
import { SMM_IDENTITY_CONTRACT_VERSION } from "./sharedMentalModelIdentityContracts.ts";
import { resetSharedMentalModelSnapshotLayerForTests } from "./sharedMentalModelSnapshotExports.ts";
import { SMM_SNAPSHOT_CONTRACT_VERSION } from "./sharedMentalModelSnapshotContracts.ts";
import { resetSharedMentalModelSynchronizationLayerForTests } from "./sharedMentalModelSynchronizationExports.ts";
import { SMM_SYNC_CONTRACT_VERSION } from "./sharedMentalModelSynchronizationContracts.ts";
import { resetSharedMentalModelQueryLayerForTests } from "./sharedMentalModelQueryExports.ts";
import { SMM_QUERY_CONTRACT_VERSION } from "./sharedMentalModelQueryContracts.ts";
import { resetSharedMentalModelGovernanceLayerForTests } from "./sharedMentalModelGovernanceExports.ts";
import { SMM_GOVERNANCE_CONTRACT_VERSION } from "./sharedMentalModelGovernanceContracts.ts";
import { runSharedMentalModelPlatformCertification } from "./sharedMentalModelPlatformCertification.ts";
import { getSharedMentalModelPlatformCompatibilityMatrix } from "./sharedMentalModelPlatformCompatibility.ts";
import {
  SharedMentalModelPlatform,
  buildSharedMentalModelPlatformManifest,
  getSharedMentalModelCertifiedPhaseRegistrations,
  getSharedMentalModelPlatformRegistry,
  isSharedMentalModelPlatformFrozen,
  resetSharedMentalModelPlatformFreezeForTests,
  runSharedMentalModelPlatformFreeze,
  runSharedMentalModelPlatformRegression,
  SMM_CERTIFIED_MVP_PHASE_KEYS,
  SMM_EXTENSION_POLICY,
  SMM_PLATFORM_FREEZE_CONTRACT_VERSION,
  SMM_PLATFORM_FREEZE_PRINCIPLES,
  SMM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  SMM_PLATFORM_FREEZE_VERSION,
  SMM_PLATFORM_RELEASE_VERSION,
} from "./sharedMentalModelPlatformFreeze.ts";
import { validateSharedMentalModelPlatformManifest } from "./sharedMentalModelPlatformManifest.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelPlatformFreezeForTests();
  resetSharedMentalModelGovernanceLayerForTests();
  resetSharedMentalModelQueryLayerForTests();
  resetSharedMentalModelSynchronizationLayerForTests();
  resetSharedMentalModelSnapshotLayerForTests();
  resetSharedMentalModelIdentityLayerForTests();
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/8 platform freeze vocabulary", () => {
  assert.equal(SMM_PLATFORM_FREEZE_CONTRACT_VERSION, "SMM/8");
  assert.equal(SMM_CERTIFIED_MVP_PHASE_KEYS.length, 7);
  assert.equal(SMM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.length, 5);
});

test("publishes immutable platform registry", () => {
  const registry = getSharedMentalModelPlatformRegistry();
  assert.equal(registry.platformName, "Shared Mental Model Platform");
  assert.equal(registry.phaseCount, 7);
  assert.equal(registry.releaseVersion, SMM_PLATFORM_RELEASE_VERSION);
  assert.equal(registry.freezeVersion, SMM_PLATFORM_FREEZE_VERSION);
  assert.ok(registry.publicApis.length > 20);
  assert.ok(registry.extensionPoints.some((entry) => entry.status === "certified"));
});

test("generates compatibility matrix across certified phases and architecture layers", () => {
  const matrix = getSharedMentalModelPlatformCompatibilityMatrix();
  assert.equal(matrix.validationResult, "valid");
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "APP" && entry.targetLayer === "SMM/1"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "LLM" && entry.targetLayer === "SMM"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "SMM" && entry.targetLayer === "ASS"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "SMM/1" && entry.targetLayer === "SMM/2"));
});

test("runs read-only regression over SMM-1 through SMM-7", () => {
  const regression = runSharedMentalModelPlatformRegression(FIXED_TIME);
  assert.equal(regression.success, true);
  assert.equal(regression.checksPassed, regression.checksTotal);
  assert.ok(regression.checks.some((check) => check.id === "phase_files_exist"));
  assert.ok(regression.checks.some((check) => check.id === "layer_SMM/7"));
});

test("certifies the complete SMM platform", () => {
  const certification = runSharedMentalModelPlatformCertification(FIXED_TIME);
  assert.equal(certification.success, true);
  assert.equal(certification.certificationStatus, "certified");
  assert.equal(certification.regression.success, true);
  assert.ok(certification.summary.includes("Certified, Frozen, and Released"));
});

test("generates immutable platform manifest", () => {
  const manifest = buildSharedMentalModelPlatformManifest(FIXED_TIME, "certified");
  assert.equal(manifest.platformName, "Shared Mental Model Platform");
  assert.equal(manifest.certifiedPhases.length, 7);
  assert.equal(manifest.certificationStatus, "certified");
  assert.equal(validateSharedMentalModelPlatformManifest(manifest), true);
  assert.ok(manifest.compatibility.includes("SMM/7"));
  assert.ok(manifest.compatibility.includes("SMM/8"));
  assert.ok(manifest.extensionPolicy.length > 0);
});

test("freezes platform through certification runner", () => {
  assert.equal(isSharedMentalModelPlatformFrozen(), false);
  const freeze = runSharedMentalModelPlatformFreeze(FIXED_TIME);
  assert.equal(freeze.success, true);
  assert.equal(isSharedMentalModelPlatformFrozen(), true);
  assert.ok(freeze.manifest);
  assert.equal(freeze.certification?.certificationStatus, "certified");
  assert.ok(freeze.reason.includes("Certified, Frozen, and Released"));
});

test("exposes stable public exports via SharedMentalModelPlatform facade", () => {
  assert.equal(typeof SharedMentalModelPlatform.runSharedMentalModelPlatformCertification, "function");
  assert.equal(typeof SharedMentalModelPlatform.getSharedMentalModelPlatformCompatibilityMatrix, "function");
  assert.equal(SharedMentalModelPlatform.version, "SMM/8");
  assert.ok(SMM_PLATFORM_FREEZE_PRINCIPLES.includes("metadata_only_no_runtime_behavior"));
  assert.ok(SMM_EXTENSION_POLICY.includes("future_phases_extend_smm_8_additively"));
  assert.deepEqual(getSharedMentalModelCertifiedPhaseRegistrations().map((phase) => phase.phaseId), [...SMM_CERTIFIED_MVP_PHASE_KEYS]);
});

test("maintains SMM-1 through SMM-7 compatibility metadata", () => {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/1")?.contractVersion, SMM_PLATFORM_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/2")?.contractVersion, SMM_DOMAIN_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/3")?.contractVersion, SMM_IDENTITY_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/4")?.contractVersion, SMM_SNAPSHOT_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/5")?.contractVersion, SMM_SYNC_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/6")?.contractVersion, SMM_QUERY_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "SMM/7")?.contractVersion, SMM_GOVERNANCE_CONTRACT_VERSION);
});

test("preserves SMM-1 through SMM-7 unchanged", async () => {
  const { readFile } = await import("node:fs/promises");
  const certifiedFiles = [
    "smmPlatformContracts.ts",
    "smmPlatformExports.ts",
    "sharedMentalModelContracts.ts",
    "sharedMentalModelExports.ts",
    "sharedMentalModelIdentityContracts.ts",
    "sharedMentalModelIdentityExports.ts",
    "sharedMentalModelSnapshotContracts.ts",
    "sharedMentalModelSnapshotExports.ts",
    "sharedMentalModelSynchronizationContracts.ts",
    "sharedMentalModelSynchronizationExports.ts",
    "sharedMentalModelQueryContracts.ts",
    "sharedMentalModelQueryExports.ts",
    "sharedMentalModelGovernanceContracts.ts",
    "sharedMentalModelGovernanceExports.ts",
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    runSharedMentalModelPlatformFreeze(FIXED_TIME);
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement runtime governance query or sync execution", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelPlatformFreeze.ts",
    "sharedMentalModelPlatformFreezeRegistry.ts",
    "sharedMentalModelPlatformRegression.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
    assert.equal(source.includes("authorize("), false, `${file} must not implement authorization`);
    assert.equal(source.includes("executeAudit("), false, `${file} must not execute audits`);
  }
});
