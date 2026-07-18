/**
 * DKL-4:5 — Knowledge Modeling Manifest Tests.
 *
 * Deterministic coverage for the immutable Knowledge Modeling Manifest.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as manifestApi from "./knowledgeModelingManifest.ts";
import {
  KnowledgeModelingManifest,
  KnowledgeModelingManifestIdentity,
  KnowledgeModelingManifestVersion,
  KnowledgeModelingManifestNamespace,
  KnowledgeModelingManifestInventory,
  KnowledgeModelingManifestDependencies,
  getKnowledgeModelingManifestSummary,
  getKnowledgeModelingManifestStatistics,
} from "./knowledgeModelingManifest.ts";
import {
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistrySummary,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModelCatalog,
  KnowledgeModelingModelIdentity,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationReport,
  KnowledgeModelingValidationRules,
} from "./knowledgeModelingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL45_FILES = [
  "knowledgeModelingManifestTypes.ts",
  "knowledgeModelingManifestInventory.ts",
  "knowledgeModelingManifestDependencies.ts",
  "knowledgeModelingManifest.ts",
  "knowledgeModelingManifest.test.ts",
];

test("1. manifest files exist", () => {
  assert.equal(DKL45_FILES.length, 5);
  for (const file of DKL45_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight intentional public exports", () => {
  assert.deepEqual(Object.keys(manifestApi).sort(), [
    "KnowledgeModelingManifest",
    "KnowledgeModelingManifestDependencies",
    "KnowledgeModelingManifestIdentity",
    "KnowledgeModelingManifestInventory",
    "KnowledgeModelingManifestNamespace",
    "KnowledgeModelingManifestVersion",
    "getKnowledgeModelingManifestStatistics",
    "getKnowledgeModelingManifestSummary",
  ]);
});

test("3. manifest identity, version, and namespace", () => {
  assert.equal(
    KnowledgeModelingManifestIdentity.manifestId,
    "DKL-4:5/KnowledgeModelingManifest",
  );
  assert.equal(KnowledgeModelingManifestIdentity.sourcePhase, "DKL-4:5");
  assert.equal(KnowledgeModelingManifestIdentity.status, "ManifestComplete");
  assert.equal(KnowledgeModelingManifestIdentity.readiness, "ReadyForPlatform");
  assert.equal(KnowledgeModelingManifestVersion, "1.0.0");
  assert.equal(KnowledgeModelingManifest.version, "1.0.0");
  assert.equal(
    KnowledgeModelingManifestNamespace,
    "nexora.dkl.knowledge-modeling.manifest",
  );
  assert.equal(
    KnowledgeModelingManifestIdentity.manifestNamespace,
    KnowledgeModelingManifestNamespace,
  );
});

test("4. public-entry-point-only dependencies", () => {
  assert.equal(KnowledgeModelingManifestDependencies.entryCount, 4);
  assert.equal(KnowledgeModelingManifestDependencies.publicEntryPointOnly, true);
  assert.equal(KnowledgeModelingManifestDependencies.noInternalPriorPhaseImports, true);
  assert.equal(KnowledgeModelingManifestDependencies.noDirectDkl3Dependency, true);
  assert.equal(KnowledgeModelingManifestDependencies.noFuturePhases, true);
  assert.deepEqual([...KnowledgeModelingManifestDependencies.modules], [
    "knowledgeModelingFoundation.ts",
    "knowledgeModelingRegistry.ts",
    "knowledgeModelingModel.ts",
    "knowledgeModelingValidation.ts",
  ]);
  for (const entry of KnowledgeModelingManifestDependencies.entries) {
    assert.equal(entry.publicEntryPointOnly, true);
    assert.equal(entry.futurePhase, false);
    assert.equal(entry.required, true);
  }
  assert.ok(
    KnowledgeModelingManifestDependencies.forbidden.includes("DKL-3 direct imports"),
  );
  assert.ok(KnowledgeModelingManifestDependencies.forbidden.includes("DKL-4:6+"));
  assert.equal(
    KnowledgeModelingManifestDependencies.phases.includes("DKL-4:6"),
    false,
  );
});

test("5. foundation inventory", () => {
  const f = KnowledgeModelingManifestInventory.foundation;
  assert.equal(f.sourcePhase, "DKL-4:1");
  assert.equal(f.status, "FoundationComplete");
  assert.equal(f.readiness, "ReadyForRegistry");
  assert.equal(f.identity.foundationId, KnowledgeModelingFoundationIdentity.foundationId);
  assert.equal(f.version, KnowledgeModelingFoundationVersion);
  assert.equal(f.lifecycleStateCount, 11);
  assert.ok(f.ownershipOwns.length >= 1);
  assert.ok(f.ownershipDoesNotOwn.length >= 1);
  assert.ok(f.extensionPolicies.length >= 1);
  assert.ok(f.compatibilityPolicies.length >= 1);
  assert.equal(f.publicApiCount, 8);
});

test("6. registry inventory", () => {
  const r = KnowledgeModelingManifestInventory.registry;
  assert.equal(r.sourcePhase, "DKL-4:2");
  assert.equal(r.status, "RegistryComplete");
  assert.equal(r.readiness, "ReadyForModel");
  assert.equal(r.identity.registryId, KnowledgeModelingRegistryIdentity.registryId);
  assert.equal(r.categoryCount, 18);
  assert.equal(r.categories.length, 18);
  assert.equal(r.entryCount, KnowledgeModelingRegistrySummary.totalEntryCount);
  assert.equal(r.businessObjectCategoryCount, 26);
  assert.equal(r.relationshipCategoryCount, 20);
  assert.equal(r.publicFoundationApiCount, 8);
  assert.equal(r.publicApiCount, 8);
});

test("7. model inventory", () => {
  const m = KnowledgeModelingManifestInventory.model;
  assert.equal(m.sourcePhase, "DKL-4:3");
  assert.equal(m.status, "ModelComplete");
  assert.equal(m.readiness, "ReadyForValidation");
  assert.equal(m.identity.modelPhaseId, KnowledgeModelingModelIdentity.modelPhaseId);
  assert.equal(m.canonicalModelCount, 20);
  assert.equal(m.canonicalModels.length, 20);
  assert.deepEqual([...m.canonicalModels], [...KnowledgeModelingModelCatalog.modelKinds]);
  assert.equal(m.modelRelationshipDeclarationCount, 10);
  assert.equal(m.publicApiCount, 8);
});

test("8. validation inventory", () => {
  const v = KnowledgeModelingManifestInventory.validation;
  assert.equal(v.sourcePhase, "DKL-4:4");
  assert.equal(v.status, "ValidationComplete");
  assert.equal(v.readiness, "ReadyForManifest");
  assert.equal(
    v.identity.validationId,
    KnowledgeModelingValidationIdentity.validationId,
  );
  assert.equal(v.ruleCount, KnowledgeModelingValidationRules.length);
  assert.equal(v.ruleCount, 24);
  assert.equal(v.categoryCount, 8);
  assert.equal(v.passCount, KnowledgeModelingValidationReport.passCount);
  assert.equal(v.failCount, 0);
  assert.equal(v.validationStatus, "Validated");
  assert.equal(v.publicApiCount, 8);
});

test("9. business object and relationship inventories", () => {
  const r = KnowledgeModelingManifestInventory.registry;
  assert.equal(r.businessObjectCategories.length, 26);
  assert.equal(r.relationshipCategories.length, 20);
  assert.ok(r.businessObjectCategories.includes("Customer"));
  assert.ok(r.relationshipCategories.length > 0);
  assert.equal(
    [...r.businessObjectCategories].join("|"),
    [...r.businessObjectCategories].join("|"),
  );
});

test("10. canonical model inventory", () => {
  const kinds = KnowledgeModelingManifestInventory.model.canonicalModels;
  assert.ok(kinds.includes("KnowledgeModel"));
  assert.ok(kinds.includes("KnowledgeObject"));
  assert.ok(kinds.includes("BusinessObject"));
  assert.ok(kinds.includes("Entity"));
  assert.ok(kinds.includes("Relationship"));
  assert.equal(kinds.length, KnowledgeModelingModelCatalog.modelCount);
});

test("11. validation statistics via helpers", () => {
  const summary = getKnowledgeModelingManifestSummary();
  const stats = getKnowledgeModelingManifestStatistics();
  assert.equal(summary.validationStatus, "Validated");
  assert.equal(summary.validationPassCount, 24);
  assert.equal(summary.validationFailCount, 0);
  assert.equal(stats.validationRuleCount, 24);
  assert.equal(stats.validationCategoryCount, 8);
  assert.equal(stats.validationPassCount, 24);
  assert.equal(stats.validationFailCount, 0);
});

test("12. ownership, dependency, compatibility, and extension summaries", () => {
  const ownership = KnowledgeModelingManifestInventory.ownershipSummary;
  assert.ok(ownership.foundationOwnsCount >= 1);
  assert.ok(ownership.foundationDoesNotOwnCount >= 1);
  assert.equal(ownership.noDuplicateArchitecturalOwnership, true);

  assert.equal(KnowledgeModelingManifestDependencies.entryCount, 4);
  assert.deepEqual([...KnowledgeModelingManifestDependencies.phases], [
    "DKL-4:1",
    "DKL-4:2",
    "DKL-4:3",
    "DKL-4:4",
  ]);

  const compatibility = KnowledgeModelingManifestInventory.compatibilitySummary;
  assert.ok(compatibility.policyCount >= 1);
  assert.equal(compatibility.policies.length, compatibility.policyCount);

  const extension = KnowledgeModelingManifestInventory.extensionSummary;
  assert.ok(extension.policyCount >= 1);
  assert.equal(extension.policies.length, extension.policyCount);

  assert.ok(KnowledgeModelingManifest.ownership.owns.includes("Manifest metadata"));
  assert.ok(KnowledgeModelingManifest.ownership.doesNotOwn.includes("Foundation"));
});

test("13. frozen metadata and deterministic ordering", () => {
  assert.equal(Object.isFrozen(KnowledgeModelingManifest), true);
  assert.equal(Object.isFrozen(KnowledgeModelingManifestIdentity), true);
  assert.equal(Object.isFrozen(KnowledgeModelingManifestInventory), true);
  assert.equal(Object.isFrozen(KnowledgeModelingManifestDependencies), true);
  assert.equal(Object.isFrozen(KnowledgeModelingManifestInventory.components), true);
  assert.equal(Object.isFrozen(KnowledgeModelingManifestDependencies.entries), true);

  assert.deepEqual(
    KnowledgeModelingManifestInventory.components.map((c) => c.sourcePhase),
    ["DKL-4:1", "DKL-4:2", "DKL-4:3", "DKL-4:4", "DKL-4:5"],
  );
  assert.deepEqual([...KnowledgeModelingManifestDependencies.phases], [
    "DKL-4:1",
    "DKL-4:2",
    "DKL-4:3",
    "DKL-4:4",
  ]);
  assert.deepEqual(
    [...KnowledgeModelingManifestInventory.model.canonicalModels],
    [...KnowledgeModelingModelCatalog.modelKinds],
  );
});

test("14. helper functions are deterministic", () => {
  const s1 = getKnowledgeModelingManifestSummary();
  const s2 = getKnowledgeModelingManifestSummary();
  const t1 = getKnowledgeModelingManifestStatistics();
  const t2 = getKnowledgeModelingManifestStatistics();
  assert.deepEqual(s1, s2);
  assert.deepEqual(t1, t2);
  assert.equal(Object.isFrozen(s1), true);
  assert.equal(Object.isFrozen(t1), true);
  assert.equal(s1.status, "ManifestComplete");
  assert.equal(s1.readiness, "ReadyForPlatform");
  assert.equal(t1.phasesCompleted, 5);
  assert.equal(t1.totalPublicApiCount, 40);
  assert.equal(t1.canonicalModelCount, 20);
  assert.equal(t1.businessObjectCategoryCount, 26);
  assert.equal(t1.relationshipCategoryCount, 20);
  assert.equal(t1.registryCategoryCount, 18);
});

test("15. readiness and completion status", () => {
  assert.equal(KnowledgeModelingManifest.readiness.ManifestComplete, true);
  assert.equal(KnowledgeModelingManifest.readiness.ReadyForPlatform, true);
  assert.equal(KnowledgeModelingManifest.readiness.MetadataOnly, true);
  assert.equal(KnowledgeModelingManifest.readiness.AiForbidden, true);
  assert.equal(KnowledgeModelingManifest.readiness.EngineFree, true);
  assert.ok(KnowledgeModelingManifest.completionStatus.includes("ManifestComplete"));
  assert.ok(KnowledgeModelingManifest.completionStatus.includes("ReadyForPlatform"));
  assert.equal(
    KnowledgeModelingManifest.nextPhase,
    "DKL-4:6 — Knowledge Modeling Platform",
  );
  assert.equal(KnowledgeModelingManifest.metadata.validationExecuted, false);
  assert.equal(KnowledgeModelingManifest.metadata.persistencePerformed, false);
});

test("16. source imports only approved public entry points", () => {
  const sources = [
    "knowledgeModelingManifest.ts",
    "knowledgeModelingManifestInventory.ts",
    "knowledgeModelingManifestDependencies.ts",
  ];
  const allowed = [
    "./knowledgeModelingFoundation.ts",
    "./knowledgeModelingRegistry.ts",
    "./knowledgeModelingModel.ts",
    "./knowledgeModelingValidation.ts",
    "./knowledgeModelingManifestInventory.ts",
    "./knowledgeModelingManifestDependencies.ts",
    "./knowledgeModelingManifestTypes.ts",
  ];
  for (const file of sources) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map((m) => m[1]);
    for (const imp of imports) {
      assert.ok(
        allowed.includes(imp),
        `${file} imports disallowed module ${imp}`,
      );
    }
    assert.equal(
      /from\s+"\.\/dataUnderstanding/.test(text),
      false,
      `${file} must not import DKL-3`,
    );
  }
});
