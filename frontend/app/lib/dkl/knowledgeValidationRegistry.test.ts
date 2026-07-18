/**
 * DKL-5:2 — Knowledge Validation Registry Tests.
 *
 * Deterministic coverage for the immutable Knowledge Validation Registry.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as registryApi from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationRegistry,
  KnowledgeValidationRegistryIdentity,
  KnowledgeValidationRegistryVersion,
  KnowledgeValidationRegistryNamespace,
  KnowledgeValidationRegistryCollections,
  KnowledgeValidationRegistryOwnership,
  KnowledgeValidationRegistryDependencies,
  KnowledgeValidationRegistrySummary,
} from "./knowledgeValidationRegistry.ts";
import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL52_FILES = [
  "knowledgeValidationRegistryTypes.ts",
  "knowledgeValidationRegistryCatalog.ts",
  "knowledgeValidationTargetRegistry.ts",
  "knowledgeValidationDimensionRegistry.ts",
  "knowledgeValidationSignalRegistry.ts",
  "knowledgeValidationFindingRegistry.ts",
  "knowledgeValidationConflictAmbiguityRegistry.ts",
  "knowledgeValidationRegistryOwnership.ts",
  "knowledgeValidationRegistryDependencies.ts",
  "knowledgeValidationRegistry.ts",
  "knowledgeValidationRegistry.test.ts",
];

const REQUIRED_COLLECTIONS = [
  "validationTargetTypes",
  "validationDimensions",
  "validationStatuses",
  "validationOutcomes",
  "validationSeverities",
  "knowledgeQualitySignals",
  "trustLevels",
  "evidenceTypes",
  "findingCategories",
  "issueCategories",
  "conflictTypes",
  "ambiguityTypes",
  "limitationTypes",
  "consumerReadinessStates",
  "validationLifecycleStates",
  "validationScopeTypes",
  "validationCriterionTypes",
  "validationRuleCategories",
  "ownershipDeclarations",
  "boundaryDeclarations",
  "compatibilityPolicies",
  "extensionPolicies",
  "dependencyDeclarations",
  "publicFoundationApis",
] as const;

test("1. registry files exist", () => {
  for (const file of DKL52_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly eight intentional public exports", () => {
  assert.deepEqual(Object.keys(registryApi).sort(), [
    "KnowledgeValidationRegistry",
    "KnowledgeValidationRegistryCollections",
    "KnowledgeValidationRegistryDependencies",
    "KnowledgeValidationRegistryIdentity",
    "KnowledgeValidationRegistryNamespace",
    "KnowledgeValidationRegistryOwnership",
    "KnowledgeValidationRegistrySummary",
    "KnowledgeValidationRegistryVersion",
  ]);
});

test("3. no runtime helpers among public exports", () => {
  for (const [name, value] of Object.entries(registryApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. registry identity, version, namespace, status, readiness", () => {
  assert.equal(
    KnowledgeValidationRegistryIdentity.registryId,
    "DKL-5:2/KnowledgeValidationRegistry",
  );
  assert.equal(KnowledgeValidationRegistryIdentity.sourcePhase, "DKL-5:2");
  assert.equal(KnowledgeValidationRegistryIdentity.status, "RegistryComplete");
  assert.equal(KnowledgeValidationRegistryIdentity.readiness, "ReadyForModel");
  assert.equal(KnowledgeValidationRegistryVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationRegistryNamespace,
    "nexora.dkl.knowledge-validation.registry",
  );
  assert.equal(KnowledgeValidationRegistry.readiness.ReadyForModel, true);
});

test("5. dependency only on knowledgeValidationFoundation.ts", () => {
  for (const file of DKL52_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+"(\.\/[^"]+)"/g)].map((m) => m[1]);
    for (const imp of imports) {
      if (imp.includes("knowledgeValidation") && !imp.includes("Registry") && !imp.includes("registry")) {
        assert.equal(
          imp,
          "./knowledgeValidationFoundation.ts",
          `${file} must use foundation public entry only: ${imp}`,
        );
      }
      assert.equal(
        /knowledgeModeling|dataUnderstanding|dataKnowledge|dataSource/.test(imp),
        false,
        `${file} must not import DKL-4 or earlier directly: ${imp}`,
      );
    }
  }
  assert.equal(
    KnowledgeValidationRegistryDependencies.approvedFoundationDependency.module,
    "knowledgeValidationFoundation.ts",
  );
  assert.equal(KnowledgeValidationRegistryDependencies.noDirectDkl4Dependency, true);
  assert.equal(KnowledgeValidationRegistryDependencies.noFutureDkl5Dependency, true);
});

test("6. all required registries exist", () => {
  assert.equal(Object.keys(KnowledgeValidationRegistryCollections).length, 24);
  for (const key of REQUIRED_COLLECTIONS) {
    assert.ok(
      key in KnowledgeValidationRegistryCollections,
      `missing collection ${key}`,
    );
    assert.ok(
      KnowledgeValidationRegistryCollections[key].length >= 1,
      `empty collection ${key}`,
    );
  }
  assert.equal(KnowledgeValidationRegistrySummary.registryCategoryCount, 24);
});

test("7. targets, dimensions, signals, outcomes, severities registered", () => {
  const c = KnowledgeValidationRegistryCollections;
  assert.equal(c.validationTargetTypes.length, 19);
  assert.deepEqual(
    c.validationTargetTypes.map((e) => e.name),
    [...KnowledgeValidationFoundation.contracts.targetCategories],
  );
  assert.equal(c.validationDimensions.length, 20);
  assert.deepEqual(
    c.validationDimensions.map((e) => e.name),
    [...KnowledgeValidationFoundation.contracts.dimensions],
  );
  assert.equal(c.knowledgeQualitySignals.length, 20);
  assert.deepEqual(
    c.knowledgeQualitySignals.map((e) => e.name),
    KnowledgeValidationFoundation.contracts.qualitySignals.map((s) => s.id),
  );
  assert.equal(c.validationOutcomes.length, 11);
  assert.equal(c.validationSeverities.length, 6);
  assert.equal(c.validationStatuses.length, 11);
  for (const signal of c.knowledgeQualitySignals) {
    assert.equal(signal.numericScoreAssigned, false);
  }
  assert.equal(
    KnowledgeValidationRegistryCollections.validationOutcomes.find(
      (o) => o.name === "ValidWithLimitations",
    )?.consumerUsability,
    true,
  );
});

test("8. evidence, findings, issues, conflicts, ambiguity, trust, lifecycle", () => {
  const c = KnowledgeValidationRegistryCollections;
  assert.ok(c.evidenceTypes.length >= 13);
  assert.ok(c.evidenceTypes.some((e) => e.name === "Supporting"));
  assert.ok(c.evidenceTypes.some((e) => e.name === "IdentityEvidence"));
  assert.equal(c.findingCategories.length, 17);
  assert.equal(c.issueCategories.length, 17);
  assert.ok(c.findingCategories.every((f) => f.runtimeRemediationImplemented === false));
  assert.equal(c.conflictTypes.length, 9);
  assert.equal(c.ambiguityTypes.length, 8);
  assert.equal(c.trustLevels.length, 7);
  assert.ok(c.trustLevels.every((t) => t.trustCalculated === false));
  assert.equal(
    c.validationLifecycleStates.length,
    KnowledgeValidationFoundation.lifecycle.stateCount,
  );
});

test("9. unique IDs across registries; unique names within each registry", () => {
  const allIds: string[] = [];
  for (const entries of Object.values(KnowledgeValidationRegistryCollections)) {
    const names = entries.map((e: { readonly name: string; readonly id: string }) => e.name);
    assert.equal(new Set(names).size, names.length, "duplicate names within registry");
    for (const entry of entries) {
      allIds.push(entry.id);
    }
  }
  assert.equal(new Set(allIds).size, allIds.length, "duplicate IDs across registries");
  assert.equal(
    KnowledgeValidationRegistrySummary.totalEntryCount,
    allIds.length,
  );
});

test("10. deterministic ordering and frozen collections/entries", () => {
  for (const entries of Object.values(KnowledgeValidationRegistryCollections)) {
    assert.equal(Object.isFrozen(entries), true);
    for (let i = 0; i < entries.length; i++) {
      assert.equal(Object.isFrozen(entries[i]), true);
      assert.equal(entries[i]!.deterministicOrder, i + 1);
    }
  }
  assert.equal(Object.isFrozen(KnowledgeValidationRegistry), true);
  assert.equal(Object.isFrozen(KnowledgeValidationRegistryCollections), true);
  assert.equal(Object.isFrozen(KnowledgeValidationRegistryIdentity), true);
});

test("11. ownership, compatibility, extension, and guarantees", () => {
  assert.ok(
    KnowledgeValidationRegistryOwnership.owns.includes(
      "Registration of Knowledge Validation vocabulary",
    ),
  );
  assert.ok(
    KnowledgeValidationRegistryOwnership.doesNotOwn.includes("runtime validation"),
  );
  assert.equal(
    KnowledgeValidationRegistryOwnership.noDuplicateArchitecturalOwnership,
    true,
  );
  assert.ok(
    KnowledgeValidationRegistryCollections.compatibilityPolicies.length >= 1,
  );
  assert.ok(KnowledgeValidationRegistryCollections.extensionPolicies.length >= 1);
  assert.equal(KnowledgeValidationRegistry.guarantees.noRuntimeValidators, true);
  assert.equal(KnowledgeValidationRegistry.guarantees.noScoreCalculators, true);
  assert.equal(KnowledgeValidationRegistry.guarantees.noTrustCalculators, true);
  assert.equal(KnowledgeValidationRegistry.guarantees.noMutableRegistration, true);
  assert.equal(KnowledgeValidationRegistrySummary.scoreCalculationForbidden, true);
  assert.equal(KnowledgeValidationRegistrySummary.trustCalculationForbidden, true);
  assert.equal(KnowledgeValidationRegistrySummary.mutableRegistrationForbidden, true);
});

test("12. no forbidden patterns in registry sources", () => {
  for (const file of DKL52_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/class\s/.test(text), false, file);
    assert.equal(
      /export function (register|validate|calculate|score|trust|remediate)/i.test(text),
      false,
      file,
    );
    assert.equal(/Date\.now|Math\.random|process\.env/.test(text), false, file);
  }
  assert.equal(
    KnowledgeValidationRegistry.nextPhase,
    "DKL-5:3 — Knowledge Validation Model",
  );
  assert.equal(KnowledgeValidationRegistryCollections.publicFoundationApis.length, 8);
});
