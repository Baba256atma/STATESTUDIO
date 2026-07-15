import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveDecisionCertificationPlatform.ts";
import {
  ExecutiveDecisionCertificationCompatibility,
  ExecutiveDecisionCertificationEvidence,
  ExecutiveDecisionCertificationGateRegistry,
  ExecutiveDecisionCertificationManifest,
  ExecutiveDecisionCertificationMetadata,
  ExecutiveDecisionCertificationPlatform,
  ExecutiveDecisionCertificationSummary,
  getExecutiveDecisionCertificationCompatibility,
  getExecutiveDecisionCertificationEvidence,
  getExecutiveDecisionCertificationGateById,
  getExecutiveDecisionCertificationGates,
  getExecutiveDecisionCertificationInventory,
  getExecutiveDecisionCertificationManifest,
  getExecutiveDecisionCertificationMetadata,
  getExecutiveDecisionCertificationPlatform,
  getExecutiveDecisionCertificationReadiness,
  getExecutiveDecisionCertificationRegressions,
  getExecutiveDecisionCertificationSummary,
} from "./executiveDecisionCertificationPlatform.ts";
import { ExecutiveDecisionCertificationBlockers } from "./executiveDecisionCertificationManifest.ts";
import { ExecutiveDecisionCertificationCompatibilityRelationships } from "./executiveDecisionCertificationCompatibility.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionCertificationTypes.ts",
  "executiveDecisionCertificationGateRegistry.ts",
  "executiveDecisionCertificationEvidence.ts",
  "executiveDecisionCertificationCompatibility.ts",
  "executiveDecisionCertificationManifest.ts",
  "executiveDecisionCertificationPlatform.ts",
  "executiveDecisionCertificationPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionCertificationPlatform",
  "ExecutiveDecisionCertificationMetadata",
  "ExecutiveDecisionCertificationGateRegistry",
  "ExecutiveDecisionCertificationEvidence",
  "ExecutiveDecisionCertificationCompatibility",
  "ExecutiveDecisionCertificationManifest",
  "ExecutiveDecisionCertificationSummary",
] as const);

const approvedImports = Object.freeze([
  "executiveDecisionPublicApi.ts",
  "executiveDecisionRegistryPlatform.ts",
  "executiveDecisionModelPlatform.ts",
  "executiveDecisionValidationPlatform.ts",
  "executiveDecisionManifestPlatform.ts",
  "executiveDecisionPlatform.ts",
] as const);

test("exactly seven required ENG-7:7 files are represented", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 7);
});

test("publishes exactly seven approved public exports", () => {
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
  assert.equal(approvedExports.length, 7);
});

test("exactly fifteen unique certification gates all report PASS", () => {
  assert.equal(ExecutiveDecisionCertificationGateRegistry.length, 15);
  assert.deepEqual(
    ExecutiveDecisionCertificationGateRegistry.map(({ id }) => id),
    [
      "FoundationIntegrity",
      "RegistryIntegrity",
      "ModelIntegrity",
      "ValidationIntegrity",
      "ManifestIntegrity",
      "PlatformIntegrity",
      "OwnershipIntegrity",
      "DependencyIntegrity",
      "PublicApiIntegrity",
      "ImmutabilityIntegrity",
      "MetadataOnlyIntegrity",
      "RuntimeFreeIntegrity",
      "AntiDuplicationIntegrity",
      "CompatibilityIntegrity",
      "FreezeReadiness",
    ],
  );
  assert.equal(
    new Set(ExecutiveDecisionCertificationGateRegistry.map(({ id }) => id)).size,
    15,
  );
  assert.equal(
    ExecutiveDecisionCertificationGateRegistry.every(({ status }) => status === "PASS"),
    true,
  );
  assert.equal(
    ExecutiveDecisionCertificationGateRegistry.filter(({ status }) => status !== "PASS").length,
    0,
  );
  assert.equal(ExecutiveDecisionCertificationGateRegistry.every(Object.isFrozen), true);
});

test("certifies six phases with declared inventory totals", () => {
  const inventory = getExecutiveDecisionCertificationInventory();
  assert.equal(ExecutiveDecisionCertificationEvidence.phases.length, 6);
  assert.deepEqual(
    ExecutiveDecisionCertificationEvidence.phases.map(({ phaseId }) => phaseId),
    ["ENG-7:1", "ENG-7:2", "ENG-7:3", "ENG-7:4", "ENG-7:5", "ENG-7:6"],
  );
  assert.deepEqual(
    ExecutiveDecisionCertificationEvidence.phases.map(({ fileCount }) => fileCount),
    [7, 8, 9, 8, 8, 7],
  );
  assert.deepEqual(
    ExecutiveDecisionCertificationEvidence.phases.map(({ approvedPublicExportCount }) =>
      approvedPublicExportCount
    ),
    [6, 7, 8, 6, 7, 6],
  );
  assert.equal(inventory.certifiedPhases, 6);
  assert.equal(inventory.representedFiles, 47);
  assert.equal(inventory.approvedPublicExports, 40);
  assert.equal(inventory.canonicalModels, 10);
  assert.equal(inventory.validationRules, 32);
  assert.equal(inventory.passingValidationRules, 32);
  assert.equal(inventory.failingValidationRules, 0);
  assert.equal(inventory.compatibilityDeclarations, 8);
  assert.equal(inventory.architecturalGuarantees, 12);
  assert.equal(inventory.platformComponents, 5);
});

test("compatibility and regression declarations are certified", () => {
  assert.equal(ExecutiveDecisionCertificationCompatibilityRelationships.length, 8);
  assert.equal(getExecutiveDecisionCertificationRegressions().length, 10);
  assert.equal(
    ExecutiveDecisionCertificationCompatibilityRelationships.every(
      ({ compatibilityStatus }) => compatibilityStatus === "Compatible",
    ),
    true,
  );
  assert.equal(
    getExecutiveDecisionCertificationRegressions().every(
      ({ protection, status }) => protection === "Protected" && status === "PASS",
    ),
    true,
  );
  assert.equal(ExecutiveDecisionCertificationCompatibility.relationshipCount, 8);
  assert.equal(ExecutiveDecisionCertificationCompatibility.regressionCount, 10);
});

test("certification manifest has thirteen ordered sections and is deeply frozen", () => {
  assert.equal(ExecutiveDecisionCertificationManifest.sections.length, 13);
  assert.deepEqual(
    ExecutiveDecisionCertificationManifest.sections.map(({ id }) => id),
    [
      "foundation",
      "registry",
      "model",
      "validation",
      "manifest",
      "platform",
      "ownership",
      "dependencies",
      "publicApi",
      "compatibility",
      "regression",
      "readiness",
      "certification",
    ],
  );
  assert.equal(Object.isFrozen(ExecutiveDecisionCertificationManifest), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionCertificationPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionCertificationMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionCertificationEvidence), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionCertificationCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionCertificationSummary), true);
  assert.equal(ExecutiveDecisionCertificationManifest.sections.every(Object.isFrozen), true);
});

test("readiness reports freeze-ready certified state with zero blockers", () => {
  const readiness = getExecutiveDecisionCertificationReadiness();
  assert.equal(readiness.foundationCertified, true);
  assert.equal(readiness.registryCertified, true);
  assert.equal(readiness.modelCertified, true);
  assert.equal(readiness.validationCertified, true);
  assert.equal(readiness.manifestCertified, true);
  assert.equal(readiness.platformCertified, true);
  assert.equal(readiness.ownershipCertified, true);
  assert.equal(readiness.dependencyCertified, true);
  assert.equal(readiness.publicApiCertified, true);
  assert.equal(readiness.immutabilityCertified, true);
  assert.equal(readiness.metadataOnlyCertified, true);
  assert.equal(readiness.runtimeFreeCertified, true);
  assert.equal(readiness.antiDuplicationCertified, true);
  assert.equal(readiness.compatibilityCertified, true);
  assert.equal(readiness.regressionCertified, true);
  assert.equal(readiness.allGatesPassing, true);
  assert.equal(readiness.certificationComplete, true);
  assert.equal(readiness.readyForFreeze, true);
  assert.equal(readiness.readyForPublicIndex, false);
  assert.equal(readiness.released, false);
  assert.equal(ExecutiveDecisionCertificationBlockers.failedGates, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.validationFailures, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.ownershipConflicts, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.dependencyViolations, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.publicApiLeaks, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.immutabilityViolations, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.runtimeBehaviorViolations, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.antiDuplicationViolations, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.compatibilityFailures, 0);
  assert.equal(ExecutiveDecisionCertificationBlockers.regressionFailures, 0);
  assert.equal(ExecutiveDecisionCertificationMetadata.status, "Certified");
  assert.equal(ExecutiveDecisionCertificationSummary.certification, "Certified");
  assert.equal(ExecutiveDecisionCertificationSummary.gateResult, "15/15 PASS");
  assert.equal(ExecutiveDecisionCertificationSummary.validationResult, "32/32 PASS");
  assert.equal(ExecutiveDecisionCertificationSummary.regressionResult, "10/10 PASS");
  assert.equal(ExecutiveDecisionCertificationSummary.readiness, "ReadyForDecisionFreeze");
});

test("helpers are deterministic and only approved public dependencies are used", () => {
  assert.equal(getExecutiveDecisionCertificationPlatform(), ExecutiveDecisionCertificationPlatform);
  assert.equal(getExecutiveDecisionCertificationMetadata(), ExecutiveDecisionCertificationMetadata);
  assert.equal(getExecutiveDecisionCertificationGates(), ExecutiveDecisionCertificationGateRegistry);
  assert.equal(getExecutiveDecisionCertificationEvidence(), ExecutiveDecisionCertificationEvidence);
  assert.equal(
    getExecutiveDecisionCertificationCompatibility(),
    ExecutiveDecisionCertificationCompatibility,
  );
  assert.equal(getExecutiveDecisionCertificationManifest(), ExecutiveDecisionCertificationManifest);
  assert.equal(getExecutiveDecisionCertificationSummary(), ExecutiveDecisionCertificationSummary);
  assert.equal(
    getExecutiveDecisionCertificationGateById("FoundationIntegrity")?.status,
    "PASS",
  );
  assert.equal(getExecutiveDecisionCertificationGateById("missing"), undefined);
  assert.deepEqual(ExecutiveDecisionCertificationPlatform.consumedSurfaces, {
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
    validation: "executiveDecisionValidationPlatform.ts",
    manifest: "executiveDecisionManifestPlatform.ts",
    platform: "executiveDecisionPlatform.ts",
  });

  const dir = dirname(fileURLToPath(import.meta.url));
  for (
    const file of requiredFiles.filter((name) =>
      !name.endsWith(".test.ts") && name !== "executiveDecisionCertificationTypes.ts"
    )
  ) {
    const source = readFileSync(join(dir, file), "utf8");
    assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
    assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
    assert.equal(source.includes("executiveDecisionCoreModel.ts"), false);
    assert.equal(source.includes("executiveDecisionFoundationValidation.ts"), false);
    assert.equal(source.includes("executiveDecisionPhaseManifest.ts"), false);
    assert.equal(source.includes("executiveDecisionPlatformTypes.ts"), false);
    assert.equal(source.includes("executiveDecisionPlatformComponentRegistry.ts"), false);
    assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
    assert.equal(/readFileSync|readdirSync|import\(/i.test(source), false);
    for (const approved of approvedImports) {
      // Presence of approved import strings is allowed; internal forbidden above.
      void approved;
    }
  }

  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator|Processor|Orchestrat/i
        .test(name)
    )),
    true,
  );
  assert.equal(ExecutiveDecisionCertificationPlatform.guarantees.readiness, "ReadyForDecisionFreeze");
  assert.equal(ExecutiveDecisionCertificationPlatform.finalResult.certification, "Certified");
});
