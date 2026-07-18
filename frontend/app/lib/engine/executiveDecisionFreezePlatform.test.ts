import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionFreezePlatform.ts";
import {
  ExecutiveDecisionDependencyLocks,
  ExecutiveDecisionExtensionLocks,
  ExecutiveDecisionFreezeCompatibility,
  ExecutiveDecisionFreezeManifest,
  ExecutiveDecisionFreezeMetadata,
  ExecutiveDecisionFreezePlatform,
  ExecutiveDecisionFreezeRegistry,
  ExecutiveDecisionOwnershipLocks,
  getExecutiveDecisionDependencyLocks,
  getExecutiveDecisionExtensionLocks,
  getExecutiveDecisionFreezeBaseline,
  getExecutiveDecisionFreezeCompatibility,
  getExecutiveDecisionFreezeEntryById,
  getExecutiveDecisionFreezeManifest,
  getExecutiveDecisionFreezeMetadata,
  getExecutiveDecisionFreezePlatform,
  getExecutiveDecisionFreezeReadiness,
  getExecutiveDecisionFreezeRegistry,
  getExecutiveDecisionFreezeSummary,
  getExecutiveDecisionOwnershipLocks,
} from "./executiveDecisionFreezePlatform.ts";
import {
  ExecutiveDecisionFreezePermittedChanges,
  ExecutiveDecisionFreezeProhibitedChanges,
} from "./executiveDecisionFreezeManifest.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionFreezeTypes.ts",
  "executiveDecisionFreezeRegistry.ts",
  "executiveDecisionFreezeCompatibility.ts",
  "executiveDecisionFreezeLocks.ts",
  "executiveDecisionFreezeBaseline.ts",
  "executiveDecisionFreezeManifest.ts",
  "executiveDecisionFreezePlatform.ts",
  "executiveDecisionFreezePlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionFreezePlatform",
  "ExecutiveDecisionFreezeMetadata",
  "ExecutiveDecisionFreezeRegistry",
  "ExecutiveDecisionFreezeCompatibility",
  "ExecutiveDecisionOwnershipLocks",
  "ExecutiveDecisionDependencyLocks",
  "ExecutiveDecisionExtensionLocks",
  "ExecutiveDecisionFreezeManifest",
] as const);

test("exactly eight required ENG-7:8 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 8);
});

test("publishes exactly eight approved public exports", () => {
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedExports.length, 8);
});

test("exactly seven unique frozen certified components exist", () => {
  assert.equal(ExecutiveDecisionFreezeRegistry.length, 7);
  assert.deepEqual(
    ExecutiveDecisionFreezeRegistry.map(({ id }) => id),
    [
      "foundation",
      "registry",
      "model",
      "validation",
      "manifest",
      "platform",
      "certification",
    ],
  );
  assert.equal(new Set(ExecutiveDecisionFreezeRegistry.map(({ id }) => id)).size, 7);
  assert.equal(
    ExecutiveDecisionFreezeRegistry.every(({ freezeStatus }) => freezeStatus === "Frozen"),
    true,
  );
  assert.equal(
    ExecutiveDecisionFreezeRegistry.every(
      ({ certificationStatus }) => certificationStatus === "Certified",
    ),
    true,
  );
  assert.deepEqual(
    ExecutiveDecisionFreezeRegistry.map(({ representedFileCount }) => representedFileCount),
    [7, 8, 9, 8, 8, 7, 7],
  );
  assert.deepEqual(
    ExecutiveDecisionFreezeRegistry.map(({ approvedPublicExportCount }) =>
      approvedPublicExportCount
    ),
    [6, 7, 8, 6, 7, 6, 7],
  );
  assert.equal(ExecutiveDecisionFreezeRegistry.every(Object.isFrozen), true);
});

test("compatibility, ownership, dependency, and extension locks are complete", () => {
  assert.equal(ExecutiveDecisionFreezeCompatibility.length, 10);
  assert.equal(
    ExecutiveDecisionFreezeCompatibility.every(({ status }) => status === "Compatible"),
    true,
  );
  assert.equal(
    ExecutiveDecisionFreezeCompatibility.every(
      ({ freezeProtection }) => freezeProtection === "Frozen",
    ),
    true,
  );
  assert.equal(
    ExecutiveDecisionFreezeCompatibility.every(({ protection }) => protection === "Protected"),
    true,
  );
  assert.equal(ExecutiveDecisionOwnershipLocks.owned.length, 11);
  assert.equal(ExecutiveDecisionOwnershipLocks.notOwned.length, 15);
  assert.equal(ExecutiveDecisionOwnershipLocks.lockStatus, "Locked");
  assert.equal(ExecutiveDecisionDependencyLocks.incoming.length, 6);
  assert.equal(ExecutiveDecisionDependencyLocks.outgoing.length, 2);
  assert.equal(ExecutiveDecisionDependencyLocks.prohibited.length, 13);
  assert.equal(ExecutiveDecisionDependencyLocks.lockStatus, "Locked");
  assert.equal(ExecutiveDecisionExtensionLocks.length, 6);
  assert.equal(
    ExecutiveDecisionExtensionLocks.every(({ additiveOnly, lockStatus }) =>
      additiveOnly && lockStatus === "Controlled"
    ),
    true,
  );
});

test("freeze baseline values are exact declared metadata", () => {
  const baseline = getExecutiveDecisionFreezeBaseline();
  assert.equal(baseline.phaseCount, 7);
  assert.equal(baseline.componentCount, 7);
  assert.equal(baseline.representedFileCount, 54);
  assert.equal(baseline.approvedPublicExportCount, 47);
  assert.equal(baseline.canonicalModelCount, 10);
  assert.equal(baseline.validationRuleCount, 32);
  assert.equal(baseline.passingValidationRuleCount, 32);
  assert.equal(baseline.failingValidationRuleCount, 0);
  assert.equal(baseline.compatibilityDeclarationCount, 10);
  assert.equal(baseline.architecturalGuaranteeCount, 12);
  assert.equal(baseline.certificationGateCount, 15);
  assert.equal(baseline.passingCertificationGateCount, 15);
  assert.equal(baseline.regressionDeclarationCount, 10);
  assert.equal(baseline.passingRegressionDeclarationCount, 10);
  assert.equal(baseline.ownershipConflictCount, 0);
  assert.equal(baseline.dependencyViolationCount, 0);
  assert.equal(baseline.publicApiLeakCount, 0);
  assert.equal(baseline.immutabilityViolationCount, 0);
  assert.equal(baseline.runtimeBehaviorViolationCount, 0);
  assert.equal(baseline.antiDuplicationViolationCount, 0);
  assert.equal(baseline.compatibilityFailureCount, 0);
  assert.equal(baseline.regressionFailureCount, 0);
  assert.deepEqual([...baseline.preserved.componentOrder], [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
    "certification",
  ]);
  assert.equal(baseline.preserved.validationState, "32/32 PASS");
  assert.equal(baseline.preserved.certificationState, "15/15 PASS");
});

test("freeze manifest has twelve ordered sections and change policies", () => {
  assert.equal(ExecutiveDecisionFreezeManifest.sections.length, 12);
  assert.deepEqual(
    ExecutiveDecisionFreezeManifest.sections.map(({ id }) => id),
    [
      "foundation",
      "registry",
      "model",
      "validation",
      "manifest",
      "platform",
      "certification",
      "compatibility",
      "ownershipLocks",
      "dependencyLocks",
      "extensionLocks",
      "freeze",
    ],
  );
  assert.equal(ExecutiveDecisionFreezeProhibitedChanges.length, 10);
  assert.equal(ExecutiveDecisionFreezePermittedChanges.length, 6);
  assert.equal(Object.isFrozen(ExecutiveDecisionFreezeManifest), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionFreezePlatform), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionFreezeMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionFreezeCompatibility), true);
  assert.equal(ExecutiveDecisionFreezeManifest.sections.every(Object.isFrozen), true);
  assert.equal(ExecutiveDecisionFreezeManifest.finalFreezeState, "Frozen");
});

test("readiness reports public-index-ready frozen state", () => {
  const readiness = getExecutiveDecisionFreezeReadiness();
  assert.equal(readiness.foundationFrozen, true);
  assert.equal(readiness.registryFrozen, true);
  assert.equal(readiness.modelFrozen, true);
  assert.equal(readiness.validationFrozen, true);
  assert.equal(readiness.manifestFrozen, true);
  assert.equal(readiness.platformFrozen, true);
  assert.equal(readiness.certificationFrozen, true);
  assert.equal(readiness.ownershipLocked, true);
  assert.equal(readiness.dependenciesLocked, true);
  assert.equal(readiness.compatibilityLocked, true);
  assert.equal(readiness.extensionsControlled, true);
  assert.equal(readiness.baselineRecorded, true);
  assert.equal(readiness.validationCertified, true);
  assert.equal(readiness.certificationComplete, true);
  assert.equal(readiness.allCertificationGatesPassing, true);
  assert.equal(readiness.allRegressionDeclarationsPassing, true);
  assert.equal(readiness.publicApiStable, true);
  assert.equal(readiness.publicApiFrozen, true);
  assert.equal(readiness.antiDuplicationProtected, true);
  assert.equal(readiness.runtimeFree, true);
  assert.equal(readiness.metadataOnly, true);
  assert.equal(readiness.deeplyFrozen, true);
  assert.equal(readiness.freezeComplete, true);
  assert.equal(readiness.readyForPublicIndex, true);
  assert.equal(readiness.released, false);
  assert.equal(ExecutiveDecisionFreezeMetadata.status, "Frozen");
  assert.equal(ExecutiveDecisionFreezeMetadata.certificationStatus, "Certified");
  assert.equal(ExecutiveDecisionFreezeMetadata.publicApiStatus, "StableAndFrozen");
  assert.equal(ExecutiveDecisionFreezeMetadata.readiness, "ReadyForDecisionPublicIndex");
  const summary = getExecutiveDecisionFreezeSummary();
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.certification, "Certified");
  assert.equal(summary.validationResult, "32/32 PASS");
  assert.equal(summary.certificationGateResult, "15/15 PASS");
  assert.equal(summary.regressionProtectionResult, "10/10 PASS");
  assert.equal(summary.frozenComponents, "7/7");
  assert.equal(summary.blockingViolations, 0);
  assert.equal(summary.publicApiStatus, "StableAndFrozen");
  assert.equal(summary.readiness, "ReadyForDecisionPublicIndex");
  assert.equal(summary.released, false);
});

test("helpers are deterministic and only approved public dependencies are used", () => {
  assert.equal(getExecutiveDecisionFreezePlatform(), ExecutiveDecisionFreezePlatform);
  assert.equal(getExecutiveDecisionFreezeMetadata(), ExecutiveDecisionFreezeMetadata);
  assert.equal(getExecutiveDecisionFreezeRegistry(), ExecutiveDecisionFreezeRegistry);
  assert.equal(getExecutiveDecisionFreezeCompatibility(), ExecutiveDecisionFreezeCompatibility);
  assert.equal(getExecutiveDecisionOwnershipLocks(), ExecutiveDecisionOwnershipLocks);
  assert.equal(getExecutiveDecisionDependencyLocks(), ExecutiveDecisionDependencyLocks);
  assert.equal(getExecutiveDecisionExtensionLocks(), ExecutiveDecisionExtensionLocks);
  assert.equal(getExecutiveDecisionFreezeManifest(), ExecutiveDecisionFreezeManifest);
  assert.equal(getExecutiveDecisionFreezeEntryById("foundation")?.owningPhase, "ENG-7:1");
  assert.equal(getExecutiveDecisionFreezeEntryById("certification")?.approvedPublicExportCount, 7);
  assert.equal(getExecutiveDecisionFreezeEntryById("missing"), undefined);
  assert.deepEqual(ExecutiveDecisionFreezePlatform.consumedSurfaces, {
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
    validation: "executiveDecisionValidationPlatform.ts",
    manifest: "executiveDecisionManifestPlatform.ts",
    platform: "executiveDecisionPlatform.ts",
    certification: "executiveDecisionCertificationPlatform.ts",
  });
  assert.equal(ExecutiveDecisionFreezePlatform.finalResult.freezeStatus, "Frozen");
  assert.equal(ExecutiveDecisionFreezePlatform.guarantees.readiness, "ReadyForDecisionPublicIndex");

  const dir = dirname(fileURLToPath(import.meta.url));
  for (
    const file of requiredFiles.filter((name) =>
      !name.endsWith(".test.ts") && name !== "executiveDecisionFreezeTypes.ts"
    )
  ) {
    const source = readFileSync(join(dir, file), "utf8");
    assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
    assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
    assert.equal(source.includes("executiveDecisionCoreModel.ts"), false);
    assert.equal(source.includes("executiveDecisionFoundationValidation.ts"), false);
    assert.equal(source.includes("executiveDecisionPhaseManifest.ts"), false);
    assert.equal(source.includes("executiveDecisionPlatformTypes.ts"), false);
    assert.equal(source.includes("executiveDecisionCertificationTypes.ts"), false);
    assert.equal(source.includes("executiveDecisionCertificationGateRegistry.ts"), false);
    assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
    assert.equal(/readFileSync|readdirSync|import\(/i.test(source), false);
  }

  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator|Processor|Orchestrat|Migrat/i
        .test(name)
    )),
    true,
  );
});
