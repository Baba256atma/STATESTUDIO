/**
 * DKL-5:5 — Knowledge Validation Manifest Tests.
 *
 * Deterministic coverage for the canonical DKL-5 architectural manifest.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as manifestApi from "./knowledgeValidationManifest.ts";
import {
  KnowledgeValidationManifest,
  KnowledgeValidationManifestIdentity,
  KnowledgeValidationManifestVersion,
  KnowledgeValidationManifestNamespace,
  KnowledgeValidationManifestInventory,
  KnowledgeValidationManifestDependencies,
  getKnowledgeValidationManifestSummary,
  getKnowledgeValidationManifestStatistics,
} from "./knowledgeValidationManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL55_FILES = [
  "knowledgeValidationManifestTypes.ts",
  "knowledgeValidationManifestInventory.ts",
  "knowledgeValidationManifestDependencies.ts",
  "knowledgeValidationManifestCompatibility.ts",
  "knowledgeValidationManifestExtensions.ts",
  "knowledgeValidationManifestReadiness.ts",
  "knowledgeValidationManifest.ts",
  "knowledgeValidationManifest.test.ts",
];

const SECTIONS = [
  "metadata",
  "foundation",
  "registry",
  "model",
  "validation",
  "ownership",
  "boundary",
  "dependency",
  "compatibility",
  "extension",
  "guarantee",
  "readiness",
];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. DKL-5:5 manifest files exist", () => {
  for (const file of DKL55_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight public exports", () => {
  assert.deepEqual(Object.keys(manifestApi).sort(), [
    "KnowledgeValidationManifest",
    "KnowledgeValidationManifestDependencies",
    "KnowledgeValidationManifestIdentity",
    "KnowledgeValidationManifestInventory",
    "KnowledgeValidationManifestNamespace",
    "KnowledgeValidationManifestVersion",
    "getKnowledgeValidationManifestStatistics",
    "getKnowledgeValidationManifestSummary",
  ]);
});

test("3. identity, version, namespace, status, readiness", () => {
  assert.equal(
    KnowledgeValidationManifestIdentity.manifestId,
    "DKL-5:5/KnowledgeValidationManifest",
  );
  assert.equal(KnowledgeValidationManifestIdentity.phase, "DKL-5:5");
  assert.equal(KnowledgeValidationManifestIdentity.status, "ManifestComplete");
  assert.equal(KnowledgeValidationManifestIdentity.readiness, "ReadyForPlatform");
  assert.equal(KnowledgeValidationManifestIdentity.validationStatus, "Pass");
  assert.equal(KnowledgeValidationManifestVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationManifestNamespace,
    "nexora.dkl.knowledge-validation.manifest",
  );
  assert.equal(
    KnowledgeValidationManifestIdentity.nextPhase,
    "DKL-5:6 — Knowledge Validation Platform",
  );
});

test("4. dependencies only on DKL-5:1–5:4 public entry points", () => {
  assert.deepEqual(
    [...KnowledgeValidationManifestDependencies.approvedManifestModules],
    [
      "knowledgeValidationFoundation.ts",
      "knowledgeValidationRegistry.ts",
      "knowledgeValidationModel.ts",
      "knowledgeValidationValidation.ts",
    ],
  );
  assert.equal(KnowledgeValidationManifestDependencies.entryCount, 5);
  assert.equal(KnowledgeValidationManifestDependencies.noCircularDependencies, true);
  assert.equal(KnowledgeValidationManifestDependencies.noFuturePhases, true);
  assert.equal(KnowledgeValidationManifestDependencies.noDirectDkl4Dependency, true);

  for (const file of DKL55_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/knowledgeModeling/i.test(spec), false, `${file}: ${spec}`);
      if (spec.includes("knowledgeValidation") && !spec.includes("Manifest")) {
        assert.ok(
          /knowledgeValidationFoundation\.ts$/.test(spec) ||
            /knowledgeValidationRegistry\.ts$/.test(spec) ||
            /knowledgeValidationModel\.ts$/.test(spec) ||
            /knowledgeValidationValidation\.ts$/.test(spec),
          `${file} forbidden: ${spec}`,
        );
      }
      assert.equal(
        /knowledgeValidationFoundationTypes|knowledgeValidationContracts|knowledgeValidationRegistryTypes|knowledgeValidationRegistryCatalog|knowledgeValidationModelTypes|knowledgeValidationModelHelpers|knowledgeValidationValidationTypes|knowledgeValidationValidationRules|knowledgeValidationFoundationValidation|knowledgeValidationRegistryValidation|knowledgeValidationModelValidation|knowledgeValidationCrossPhaseValidation/.test(
          spec,
        ),
        false,
        `${file}: internal prior-phase import ${spec}`,
      );
    }
  }
});

test("5. manifest sections exist in deterministic order", () => {
  assert.deepEqual([...KnowledgeValidationManifest.sections], SECTIONS);
  assert.deepEqual(
    [...KnowledgeValidationManifestInventory.sectionOrder],
    SECTIONS,
  );
});

test("6. foundation inventory is complete", () => {
  const f = KnowledgeValidationManifestInventory.foundation;
  assert.equal(f.status, "FoundationComplete");
  assert.equal(f.readiness, "ReadyForRegistry");
  assert.equal(f.contractKindCount, 20);
  assert.equal(f.validationTargetCount, 19);
  assert.equal(f.validationDimensionCount, 20);
  assert.equal(f.qualitySignalCount, 20);
  assert.equal(f.outcomeCount, 11);
  assert.equal(f.severityCount, 6);
  assert.equal(f.lifecycleStateCount, 11);
  assert.ok(f.trustDeclaration !== undefined);
  assert.ok(f.evidenceContracts !== undefined);
  assert.ok(f.ambiguityAndConflictContracts !== undefined);
  assert.equal(f.publicApiCount, 8);
});

test("7. registry inventory is complete", () => {
  const r = KnowledgeValidationManifestInventory.registry;
  assert.equal(r.status, "RegistryComplete");
  assert.equal(r.readiness, "ReadyForModel");
  assert.equal(r.collectionCount, 24);
  assert.equal(r.collectionNames.length, 24);
  assert.equal(r.totalEntryCount, 266);
  assert.equal(r.targetEntryCount, 19);
  assert.equal(r.dimensionEntryCount, 20);
  assert.equal(r.qualitySignalEntryCount, 20);
  assert.equal(r.outcomeEntryCount, 11);
  assert.equal(r.severityEntryCount, 6);
  assert.ok(r.evidenceEntryCount >= 1);
  assert.ok(r.findingEntryCount >= 1);
  assert.ok(r.issueEntryCount >= 1);
  assert.ok(r.conflictEntryCount >= 1);
  assert.ok(r.ambiguityEntryCount >= 1);
  assert.ok(r.trustLevelEntryCount >= 1);
  assert.equal(r.publicApiCount, 8);
});

test("8. model inventory is complete", () => {
  const m = KnowledgeValidationManifestInventory.model;
  assert.equal(m.status, "ModelComplete");
  assert.equal(m.readiness, "ReadyForValidation");
  assert.equal(m.canonicalModelCount, 30);
  assert.equal(m.canonicalModelKinds.length, 30);
  assert.equal(m.modelRelationshipCount, 14);
  assert.equal(m.consumerSuitabilityStates.length, 4);
  assert.equal(m.executiveUsabilityCapabilities.length, 8);
  assert.equal(m.publicApiCount, 8);
});

test("9. validation inventory is complete", () => {
  const v = KnowledgeValidationManifestInventory.validation;
  assert.equal(v.status, "ValidationComplete");
  assert.equal(v.readiness, "ReadyForManifest");
  assert.equal(v.categoryCount, 27);
  assert.equal(v.ruleCount, 63);
  assert.equal(v.ruleResultCount, 63);
  assert.equal(v.evidenceCount, 63);
  assert.equal(v.passCount, 63);
  assert.equal(v.failCount, 0);
  assert.equal(v.overallStatus, "Pass");
  assert.equal(v.publicApiCount, 8);
});

test("10. architectural statistics and counts", () => {
  const stats = getKnowledgeValidationManifestStatistics();
  const counts = KnowledgeValidationManifest.counts;
  assert.equal(counts.phaseCount, 5);
  assert.equal(counts.componentCount, 5);
  assert.equal(counts.totalPublicApiCount, 40);
  assert.equal(counts.foundationContractCount, 20);
  assert.equal(counts.validationTargetCount, 19);
  assert.equal(counts.validationDimensionCount, 20);
  assert.equal(counts.qualitySignalCount, 20);
  assert.equal(counts.outcomeCount, 11);
  assert.equal(counts.severityCount, 6);
  assert.equal(counts.registryCollectionCount, 24);
  assert.equal(counts.registryEntryCount, 266);
  assert.equal(counts.canonicalModelCount, 30);
  assert.equal(counts.modelRelationshipCount, 14);
  assert.equal(counts.validationCategoryCount, 27);
  assert.equal(counts.validationRuleCount, 63);
  assert.equal(counts.validationEvidenceCount, 63);
  assert.equal(counts.validationPassCount, 63);
  assert.equal(counts.validationFailCount, 0);
  assert.equal(stats.totalPublicApiCount, 40);
  assert.equal(stats.canonicalModelCount, 30);
  assert.equal(stats.validationRuleCount, 63);
  assert.ok(stats.compatibilityDeclarationCount >= 1);
  assert.ok(stats.extensionDeclarationCount >= 1);
});

test("11. total public API count sums across five components", () => {
  const apis = KnowledgeValidationManifestInventory.publicApis;
  assert.equal(apis.foundation.length, 8);
  assert.equal(apis.registry.length, 8);
  assert.equal(apis.model.length, 8);
  assert.equal(apis.validation.length, 8);
  assert.equal(apis.manifest.length, 8);
  const total =
    apis.foundation.length +
    apis.registry.length +
    apis.model.length +
    apis.validation.length +
    apis.manifest.length;
  assert.equal(total, 40);
});

test("12. ownership manifest is accurate and non-transferable", () => {
  const o = KnowledgeValidationManifestInventory.ownershipSummary;
  assert.ok(o.owns.includes("Knowledge Validation vocabulary"));
  assert.ok(o.owns.includes("Manifest metadata"));
  assert.ok(o.doesNotOwn.includes("Numeric scoring"));
  assert.ok(o.doesNotOwn.includes("Trust calculation"));
  assert.ok(o.doesNotOwn.includes("Knowledge Modeling ownership"));
  assert.equal(o.noDuplicateArchitecturalOwnership, true);
  assert.equal(o.noOwnershipTransfer, true);
  assert.equal(KnowledgeValidationManifest.ownership.earlierPhasesRetainOwnership, true);
});

test("13. dependency manifest is deterministic and acyclic", () => {
  const entries = KnowledgeValidationManifestDependencies.entries;
  assert.equal(entries.length, 5);
  assert.deepEqual(
    [...KnowledgeValidationManifestDependencies.deterministicOrder],
    [1, 2, 3, 4, 5],
  );
  assert.equal(entries[0]!.consumerPhase, "DKL-5:1");
  assert.deepEqual([...entries[0]!.dependsOn], ["knowledgeModelingPublicIndex.ts"]);
  assert.equal(entries[4]!.consumerPhase, "DKL-5:5");
  assert.equal(entries[4]!.dependsOn.length, 4);
  for (const entry of entries) {
    assert.equal(entry.circular, false);
    assert.equal(entry.futurePhase, false);
    assert.equal(entry.publicEntryPointOnly, true);
  }
  assert.equal(
    KnowledgeValidationManifestDependencies.executiveEngineRestrictedDownstreamConsumer,
    true,
  );
});

test("14. compatibility and extension manifests exist", () => {
  assert.ok(KnowledgeValidationManifest.compatibility.entryCount >= 1);
  assert.ok(KnowledgeValidationManifest.extensions.entryCount >= 1);
  assert.equal(
    KnowledgeValidationManifest.compatibility.runtimeNegotiationForbidden,
    true,
  );
  for (const entry of KnowledgeValidationManifest.extensions.entries) {
    assert.equal(entry.additive, true);
    assert.equal(entry.backwardCompatible, true);
    assert.equal(entry.mutableRuntimeRegistrationForbidden, true);
  }
});

test("15. readiness gates all pass", () => {
  const readiness = KnowledgeValidationManifest.manifestReadiness;
  assert.equal(readiness.allGatesPass, true);
  assert.equal(readiness.readiness, "ReadyForPlatform");
  assert.equal(readiness.passedGateCount, readiness.gateCount);
  for (const gate of readiness.gates) {
    assert.equal(gate.passed, true, gate.gateId);
  }
  assert.equal(KnowledgeValidationManifest.readiness.ReadyForPlatform, true);
  assert.equal(KnowledgeValidationManifest.readiness.ValidationOverallPass, true);
});

test("16. manifest and inventories are frozen", () => {
  assert.equal(isDeeplyFrozen(KnowledgeValidationManifest), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationManifestInventory), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationManifestDependencies), true);
  assert.equal(isDeeplyFrozen(getKnowledgeValidationManifestSummary()), true);
  assert.equal(isDeeplyFrozen(getKnowledgeValidationManifestStatistics()), true);
});

test("17. summary and statistics helpers are deterministic", () => {
  assert.deepEqual(
    getKnowledgeValidationManifestSummary(),
    getKnowledgeValidationManifestSummary(),
  );
  assert.deepEqual(
    getKnowledgeValidationManifestStatistics(),
    getKnowledgeValidationManifestStatistics(),
  );
  assert.equal(getKnowledgeValidationManifestSummary.length, 0);
  assert.equal(getKnowledgeValidationManifestStatistics.length, 0);
  const summary = getKnowledgeValidationManifestSummary();
  assert.equal(summary.readyForPlatform, true);
  assert.equal(summary.validationStatus, "Pass");
  assert.equal(summary.totalPublicApiCount, 40);
});

test("18. no runtime, scoring, cleansing, or source scanning in sources", () => {
  for (const file of DKL55_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/Date\.now|new Date\(|Math\.random|process\.env/.test(text), false, file);
    assert.equal(/readFileSync|readdirSync|fetch\(|database/i.test(text), false, file);
    assert.equal(/calculateTrust|calculateScore|cleanse|remediate/i.test(text), false, file);
  }
  assert.equal(KnowledgeValidationManifest.metadata.validationExecuted, false);
  assert.equal(KnowledgeValidationManifest.metadata.scoringPerformed, false);
  assert.equal(KnowledgeValidationManifest.metadata.cleansingPerformed, false);
  assert.equal(KnowledgeValidationManifest.metadata.sourceScanningPerformed, false);
});
