import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_MEMORY_PLATFORM_NAME,
  EXECUTIVE_MEMORY_PLATFORM_RELEASE_TAG,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED,
} from "./executiveMemoryPlatformFreezeConstants.ts";
import {
  buildExecutiveMemoryPlatformCompatibilityRegistry,
  buildExecutiveMemoryPlatformContractRegistry,
  buildExecutiveMemoryPlatformExtensionRegistry,
  buildExecutiveMemoryPlatformPublicApiRegistry,
  buildExecutiveMemoryPlatformRegistry,
  buildExecutiveMemoryPlatformFreezeManifest,
  getExecutiveMemoryPlatformFreezeManifest,
  initializeExecutiveMemoryPlatformFreezeEngine,
  resetExecutiveMemoryPlatformFreezeEngineForTests,
  runExecutiveMemoryPlatformFreezeCertification,
  runExecutiveMemoryPlatformFreezeSuite,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_IDENTITY,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST,
  ExecutiveMemoryPlatformFreezeContracts,
} from "./executiveMemoryPlatformFreezeContracts.ts";
import { runExecutiveMemoryPlatformRegression } from "./executiveMemoryPlatformCertificationContracts.ts";

const REPO_ROOT = join(process.cwd(), "..");

test.beforeEach(() => {
  resetExecutiveMemoryPlatformFreezeEngineForTests();
});

test("exports APP-4:14 freeze identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_MEMORY_PLATFORM_FREEZE_IDENTITY.phaseId, "APP-4/14");
  assert.equal(EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-4/14");
  assert.equal(ExecutiveMemoryPlatformFreezeContracts.version, "APP-4/14");
  assert.equal(ExecutiveMemoryPlatformFreezeContracts.platformName, EXECUTIVE_MEMORY_PLATFORM_NAME);
});

test("builds immutable freeze manifest", () => {
  const manifest = buildExecutiveMemoryPlatformFreezeManifest("2026-06-28T00:00:00.000Z");
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformName, EXECUTIVE_MEMORY_PLATFORM_NAME);
  assert.equal(manifest.releaseTag, EXECUTIVE_MEMORY_PLATFORM_RELEASE_TAG);
  assert.equal(manifest.platformStatus.certified, EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED);
  assert.equal(manifest.platformStatus.frozen, EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN);
  assert.equal(manifest.platformStatus.released, EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED);
  assert.ok(manifest.platformMetadata.architectureHash.startsWith("arch-"));
  assert.equal(manifest.certifiedModules.length, 13);
});

test("freezes platform registry with all certified phases", () => {
  const registry = buildExecutiveMemoryPlatformRegistry();
  assert.equal(registry.length, 13);
  assert.ok(registry.every((entry) => entry.immutable === true));
  assert.ok(registry.some((entry) => entry.phaseId === "APP-4/1"));
  assert.ok(registry.some((entry) => entry.phaseId === "APP-4/13"));
});

test("freezes public API registry", () => {
  const apis = buildExecutiveMemoryPlatformPublicApiRegistry();
  assert.ok(apis.length >= 20);
  assert.ok(apis.some((entry) => entry.apiId === "ExecutiveMemoryStorageEngine"));
  assert.ok(apis.some((entry) => entry.apiId === "getExecutiveMemoryDashboard"));
  assert.ok(apis.some((entry) => entry.apiId === "retrieveAssistantMemory"));
});

test("freezes contract registry", () => {
  const contracts = buildExecutiveMemoryPlatformContractRegistry();
  assert.equal(contracts.length, 13);
  assert.ok(contracts.every((entry) => entry.contractVersion.startsWith("APP-4/")));
});

test("registers compatibility guarantees", () => {
  const guarantees = buildExecutiveMemoryPlatformCompatibilityRegistry();
  assert.ok(guarantees.length >= 5);
  assert.ok(guarantees.every((entry) => entry.enforced === true));
  assert.ok(guarantees.some((entry) => entry.guaranteeId === "backward-compatibility"));
  assert.ok(guarantees.some((entry) => entry.guaranteeId === "deterministic-behavior"));
});

test("registers future extension points without implementation", () => {
  const extensions = buildExecutiveMemoryPlatformExtensionRegistry();
  assert.equal(extensions.length, 6);
  assert.ok(extensions.every((entry) => entry.status === "registered"));
  assert.ok(extensions.some((entry) => entry.extensionId === "executive-learning"));
  assert.ok(extensions.some((entry) => entry.extensionId === "vector-memory"));
});

test("verifies final regression APP-4:1 through APP-4:12", () => {
  const regression = runExecutiveMemoryPlatformRegression();
  assert.equal(regression.certified, true);
  assert.equal(regression.phases.length, 12);
  assert.equal(regression.failedPhases.length, 0);
});

test("APP-4:14 platform freeze certification passes all gates", () => {
  const result = runExecutiveMemoryPlatformFreezeCertification();
  assert.equal(result.certified, true);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.regressionStatus, "PASS");
  assert.equal(result.priorCertificationStatus, "PASS");
  assert.deepEqual([...result.tags], [...EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS]);
});

test("freeze suite returns official release manifest", () => {
  initializeExecutiveMemoryPlatformFreezeEngine("2026-06-28T00:00:00.000Z");
  const suite = runExecutiveMemoryPlatformFreezeSuite();
  assert.equal(suite.freezeVersion, "APP-4/14");
  assert.equal(suite.certified, true);
  assert.equal(suite.frozen, true);
  assert.equal(suite.released, true);
  assert.equal(suite.manifest.platformStatus.released, "RELEASED");
});

test("getExecutiveMemoryPlatformFreezeManifest helper returns frozen manifest", () => {
  const manifest = getExecutiveMemoryPlatformFreezeManifest("2026-06-28T00:00:00.000Z");
  assert.equal(manifest.freezeVersion, "APP-4/14");
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates APP-4:14 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemoryPlatformFreezeManifest.ts",
      allowedFiles: EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    false
  );
});

test("validates freeze documentation completeness", () => {
  for (const filePath of EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES) {
    assert.equal(existsSync(join(REPO_ROOT, filePath)), true, filePath);
  }
});

test("manifest registries are internally consistent", () => {
  const manifest = buildExecutiveMemoryPlatformFreezeManifest("2026-06-28T00:00:00.000Z");
  assert.equal(manifest.platformMetadata.totalPhases, manifest.certifiedModules.length);
  assert.equal(manifest.platformMetadata.totalPublicApis, manifest.publicApis.length);
  assert.equal(manifest.platformMetadata.totalContracts, manifest.contractRegistry.length);
});

test("future extension policy forbids breaking changes", () => {
  const policy = ExecutiveMemoryPlatformFreezeContracts.futureExtensionPolicy;
  assert.ok(policy.forbidden.includes("breaking_public_api_changes"));
  assert.ok(policy.permitted.includes("future_learning_layers"));
});
