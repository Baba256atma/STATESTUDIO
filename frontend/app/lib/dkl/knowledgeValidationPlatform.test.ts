/**
 * DKL-5:6 — Knowledge Validation Platform Tests.
 *
 * Deterministic coverage for the canonical DKL-5 Platform composition.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as platformApi from "./knowledgeValidationPlatform.ts";
import {
  KnowledgeValidationPlatform,
  KnowledgeValidationPlatformIdentity,
  KnowledgeValidationPlatformVersion,
  KnowledgeValidationPlatformNamespace,
  KnowledgeValidationPlatformComponents,
  KnowledgeValidationPlatformReadiness,
  getKnowledgeValidationPlatformSummary,
  getKnowledgeValidationPlatformStatus,
} from "./knowledgeValidationPlatform.ts";
import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { KnowledgeValidationModel } from "./knowledgeValidationModel.ts";
import { KnowledgeValidationValidation } from "./knowledgeValidationValidation.ts";
import {
  KnowledgeValidationManifest,
  getKnowledgeValidationManifestStatistics,
} from "./knowledgeValidationManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL56_FILES = [
  "knowledgeValidationPlatformTypes.ts",
  "knowledgeValidationPlatformComponents.ts",
  "knowledgeValidationPlatformDependencies.ts",
  "knowledgeValidationPlatformCompatibility.ts",
  "knowledgeValidationPlatformReadiness.ts",
  "knowledgeValidationPlatform.ts",
  "knowledgeValidationPlatform.test.ts",
];

const SECTION_ORDER = [
  "metadata",
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
];

const APPROVED_ENTRY_POINTS = [
  "knowledgeValidationFoundation.ts",
  "knowledgeValidationRegistry.ts",
  "knowledgeValidationModel.ts",
  "knowledgeValidationValidation.ts",
  "knowledgeValidationManifest.ts",
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

test("1. DKL-5:6 platform files exist", () => {
  for (const file of DKL56_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight public exports", () => {
  assert.deepEqual(Object.keys(platformApi).sort(), [
    "KnowledgeValidationPlatform",
    "KnowledgeValidationPlatformComponents",
    "KnowledgeValidationPlatformIdentity",
    "KnowledgeValidationPlatformNamespace",
    "KnowledgeValidationPlatformReadiness",
    "KnowledgeValidationPlatformVersion",
    "getKnowledgeValidationPlatformStatus",
    "getKnowledgeValidationPlatformSummary",
  ]);
});

test("3. identity, version, namespace, status, readiness, validation Pass", () => {
  assert.equal(
    KnowledgeValidationPlatformIdentity.platformId,
    "DKL-5:6/KnowledgeValidationPlatform",
  );
  assert.equal(KnowledgeValidationPlatformIdentity.phase, "DKL-5:6");
  assert.equal(KnowledgeValidationPlatformIdentity.status, "PlatformComplete");
  assert.equal(
    KnowledgeValidationPlatformIdentity.readiness,
    "ReadyForCertification",
  );
  assert.equal(KnowledgeValidationPlatformIdentity.validationStatus, "Pass");
  assert.equal(KnowledgeValidationPlatformIdentity.metadataOnly, true);
  assert.equal(KnowledgeValidationPlatformIdentity.runtimeBehavior, false);
  assert.equal(KnowledgeValidationPlatformVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationPlatformNamespace,
    "nexora.dkl.knowledge-validation.platform",
  );
  assert.equal(KnowledgeValidationPlatformIdentity.sectionCount, 6);
  assert.equal(KnowledgeValidationPlatformIdentity.componentCount, 5);
});

test("4. dependencies only on DKL-5:1–5:5 public entry points", () => {
  assert.deepEqual(
    [...KnowledgeValidationPlatform.dependencies.modules],
    APPROVED_ENTRY_POINTS,
  );
  assert.equal(KnowledgeValidationPlatform.dependencies.entryCount, 5);
  assert.equal(KnowledgeValidationPlatform.dependencies.noCircularDependency, true);
  assert.equal(KnowledgeValidationPlatform.dependencies.noFuturePhases, true);
  assert.equal(KnowledgeValidationPlatform.dependencies.noDirectDkl4Dependency, true);
  assert.equal(
    KnowledgeValidationPlatform.dependencies.noInternalPriorPhaseImports,
    true,
  );

  for (const file of DKL56_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      assert.equal(/knowledgeModeling/i.test(spec), false, `${file}: ${spec}`);
      if (spec.includes("knowledgeValidation") && !spec.includes("Platform")) {
        assert.ok(
          APPROVED_ENTRY_POINTS.some((entry) => spec.endsWith(entry)),
          `${file} forbidden: ${spec}`,
        );
      }
      assert.equal(
        /knowledgeValidationFoundationTypes|knowledgeValidationContracts|knowledgeValidationRegistryTypes|knowledgeValidationRegistryCatalog|knowledgeValidationModelTypes|knowledgeValidationModelHelpers|knowledgeValidationValidationTypes|knowledgeValidationValidationRules|knowledgeValidationManifestTypes|knowledgeValidationManifestInventory|knowledgeValidationManifestDependencies|knowledgeValidationManifestCompatibility|knowledgeValidationManifestExtensions|knowledgeValidationManifestReadiness/.test(
          spec,
        ),
        false,
        `${file}: internal prior-phase import ${spec}`,
      );
    }
  }
});

test("5. exactly six ordered Platform sections with canonical references", () => {
  assert.deepEqual([...KnowledgeValidationPlatform.sectionOrder], SECTION_ORDER);
  assert.equal(Object.keys(KnowledgeValidationPlatform.sections).length, 6);
  assert.equal(
    KnowledgeValidationPlatform.foundation,
    KnowledgeValidationFoundation,
  );
  assert.equal(KnowledgeValidationPlatform.registry, KnowledgeValidationRegistry);
  assert.equal(KnowledgeValidationPlatform.model, KnowledgeValidationModel);
  assert.equal(
    KnowledgeValidationPlatform.validation,
    KnowledgeValidationValidation,
  );
  assert.equal(KnowledgeValidationPlatform.manifest, KnowledgeValidationManifest);
  assert.equal(
    KnowledgeValidationPlatform.sections.foundation,
    KnowledgeValidationFoundation,
  );
  assert.equal(
    KnowledgeValidationPlatform.sections.manifest,
    KnowledgeValidationManifest,
  );
});

test("6. exactly five components by reference, not owned by Platform", () => {
  const components = KnowledgeValidationPlatformComponents.components;
  assert.equal(KnowledgeValidationPlatformComponents.componentCount, 5);
  assert.deepEqual(
    [...KnowledgeValidationPlatformComponents.dependencyOrder],
    ["Foundation", "Registry", "Model", "Validation", "Manifest"],
  );
  assert.deepEqual(
    components.map((entry) => entry.dependencyOrder),
    [1, 2, 3, 4, 5],
  );
  for (const entry of components) {
    assert.equal(entry.includedByReference, true);
    assert.equal(entry.ownedByPlatform, false);
    assert.equal(entry.runtimeBehavior, false);
    assert.equal(entry.publicApiCount, 8);
    assert.equal(Object.isFrozen(entry), true);
  }
  assert.equal(KnowledgeValidationPlatformComponents.noComponentReOwned, true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationPlatformComponents), true);
});

test("7. inventory matches Manifest statistics", () => {
  const inventory = KnowledgeValidationPlatform.inventory;
  const stats = getKnowledgeValidationManifestStatistics();
  assert.equal(inventory.upstreamComponentCount, 5);
  assert.equal(inventory.platformSectionCount, 6);
  assert.equal(inventory.upstreamPublicApiCount, 40);
  assert.equal(inventory.platformPublicApiCount, 8);
  assert.equal(inventory.totalPublicApiCount, 48);
  assert.equal(inventory.foundationContractCount, 20);
  assert.equal(inventory.validationTargetCount, 19);
  assert.equal(inventory.validationDimensionCount, 20);
  assert.equal(inventory.qualitySignalCount, 20);
  assert.equal(inventory.outcomeCount, 11);
  assert.equal(inventory.severityCount, 6);
  assert.equal(inventory.registryCollectionCount, 24);
  assert.equal(inventory.registryEntryCount, 266);
  assert.equal(inventory.canonicalModelCount, 30);
  assert.equal(inventory.modelRelationshipCount, 14);
  assert.equal(inventory.validationCategoryCount, 27);
  assert.equal(inventory.validationRuleCount, 63);
  assert.equal(inventory.validationResultCount, 63);
  assert.equal(inventory.validationEvidenceCount, 63);
  assert.equal(inventory.validationPassCount, 63);
  assert.equal(inventory.validationFailCount, 0);
  assert.equal(inventory.manifestReadinessGateCount, 15);
  assert.equal(
    inventory.compatibilityDeclarationCount,
    stats.compatibilityDeclarationCount,
  );
  assert.equal(
    inventory.extensionDeclarationCount,
    stats.extensionDeclarationCount,
  );
  assert.equal(inventory.lifecycleStateCount, stats.lifecycleStateCount);
  assert.equal(
    inventory.ownershipDeclarationCount,
    stats.ownershipDeclarationCount,
  );
  assert.equal(
    inventory.dependencyDeclarationCount,
    stats.dependencyDeclarationCount,
  );
});

test("8. compatibility and additive extension declarations exist", () => {
  assert.ok(KnowledgeValidationPlatform.compatibility.entryCount >= 1);
  assert.ok(KnowledgeValidationPlatform.extensions.entryCount >= 1);
  assert.equal(
    KnowledgeValidationPlatform.compatibility.runtimeNegotiationForbidden,
    true,
  );
  for (const entry of KnowledgeValidationPlatform.extensions.entries) {
    assert.equal(entry.additive, true);
    assert.equal(entry.backwardCompatible, true);
    assert.equal(entry.mutableRuntimeRegistrationForbidden, true);
  }
});

test("9. all readiness gates exist and pass", () => {
  const readiness = KnowledgeValidationPlatformReadiness;
  assert.equal(readiness.gateCount, 27);
  assert.equal(readiness.allGatesPass, true);
  assert.equal(readiness.readiness, "ReadyForCertification");
  assert.equal(readiness.passCount, readiness.gateCount);
  assert.equal(readiness.failCount, 0);
  for (const gate of readiness.gates) {
    assert.equal(gate.status, "Pass", gate.gateId);
  }
  assert.equal(readiness.flags.ReadyForCertification, true);
  assert.equal(readiness.flags.RuntimeValidationForbidden, true);
  assert.equal(readiness.flags.ScoringForbidden, true);
  assert.equal(readiness.flags.TrustCalculationForbidden, true);
  assert.equal(readiness.flags.CleansingForbidden, true);
  assert.equal(readiness.flags.AiForbidden, true);
});

test("10. ownership conflicts absent; prohibitions active", () => {
  const ownership = KnowledgeValidationPlatform.metadata.ownership;
  assert.equal(ownership.noOwnershipTransfer, true);
  assert.equal(ownership.earlierPhasesRetainOwnership, true);
  assert.ok(ownership.owns.includes("Platform identity"));
  assert.ok(ownership.doesNotOwn.includes("Foundation contracts"));
  assert.ok(ownership.doesNotOwn.includes("Numeric scoring"));
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noRuntimeOrganizationalValidation,
    true,
  );
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noNumericScoring,
    true,
  );
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noTrustCalculation,
    true,
  );
  assert.equal(KnowledgeValidationPlatform.metadata.guarantees.noCleansing, true);
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noRemediation,
    true,
  );
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noAiOrSemanticInference,
    true,
  );
});

test("11. platform metadata frozen; helpers deterministic", () => {
  assert.equal(Object.isFrozen(KnowledgeValidationPlatform), true);
  assert.equal(Object.isFrozen(KnowledgeValidationPlatformIdentity), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationPlatformComponents), true);
  assert.equal(isDeeplyFrozen(KnowledgeValidationPlatformReadiness), true);
  assert.equal(isDeeplyFrozen(getKnowledgeValidationPlatformSummary()), true);
  assert.equal(isDeeplyFrozen(getKnowledgeValidationPlatformStatus()), true);
  assert.deepEqual(
    getKnowledgeValidationPlatformSummary(),
    getKnowledgeValidationPlatformSummary(),
  );
  assert.deepEqual(
    getKnowledgeValidationPlatformStatus(),
    getKnowledgeValidationPlatformStatus(),
  );
  assert.equal(getKnowledgeValidationPlatformSummary.length, 0);
  assert.equal(getKnowledgeValidationPlatformStatus.length, 0);
  const summary = getKnowledgeValidationPlatformSummary();
  assert.equal(summary.allReadinessGatesPass, true);
  assert.equal(summary.totalPublicApiCount, 48);
  assert.equal(summary.validationStatus, "Pass");
  const status = getKnowledgeValidationPlatformStatus();
  assert.equal(status.status, "PlatformComplete");
  assert.equal(status.readiness, "ReadyForCertification");
});

test("12. no mutable registration, runtime, scoring, or forbidden patterns", () => {
  for (const file of DKL56_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(
      /Date\.now|new Date\(|Math\.random|process\.env/.test(text),
      false,
      file,
    );
    assert.equal(
      /\breadFileSync\b|\breaddirSync\b|\bfetch\s*\(/.test(text),
      false,
      file,
    );
    assert.equal(
      /\bfunction\s+(calculateTrust|calculateScore|cleanse|remediate)\b/i.test(
        text,
      ),
      false,
      file,
    );
    assert.equal(/mutableRegistration\s*[:=]\s*true/.test(text), false, file);
  }
  assert.equal(
    KnowledgeValidationPlatform.dependencies.noDatabaseDependency,
    true,
  );
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noNumericScoring,
    true,
  );
  assert.equal(
    KnowledgeValidationPlatform.metadata.guarantees.noTrustCalculation,
    true,
  );
});
