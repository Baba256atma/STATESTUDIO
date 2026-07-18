/**
 * DKL-7:5 — Knowledge Services Manifest Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Manifest.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeServicesValidation,
  KnowledgeServicesValidationId,
} from "./knowledgeServicesValidation.ts";
import * as ManifestModule from "./knowledgeServicesManifest.ts";
import {
  getKnowledgeServicesManifestInventoryCount,
  getKnowledgeServicesManifestSummary,
  KnowledgeServicesManifest,
  KnowledgeServicesManifestCompatibility,
  KnowledgeServicesManifestGuarantees,
  KnowledgeServicesManifestId,
  KnowledgeServicesManifestInventory,
  KnowledgeServicesManifestName,
  KnowledgeServicesManifestNamespace,
  KnowledgeServicesManifestReadiness,
  KnowledgeServicesManifestStatus,
  KnowledgeServicesManifestVersion,
} from "./knowledgeServicesManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL75_FILES = Object.freeze([
  "knowledgeServicesManifestTypes.ts",
  "knowledgeServicesManifestInventory.ts",
  "knowledgeServicesManifestDependencies.ts",
  "knowledgeServicesManifestCompatibility.ts",
  "knowledgeServicesManifestGuarantees.ts",
  "knowledgeServicesManifestReadiness.ts",
  "knowledgeServicesManifest.ts",
  "knowledgeServicesManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesManifest",
  "KnowledgeServicesManifestId",
  "KnowledgeServicesManifestName",
  "KnowledgeServicesManifestVersion",
  "KnowledgeServicesManifestNamespace",
  "KnowledgeServicesManifestStatus",
  "KnowledgeServicesManifestReadiness",
  "KnowledgeServicesManifestInventory",
  "KnowledgeServicesManifestCompatibility",
  "KnowledgeServicesManifestGuarantees",
  "getKnowledgeServicesManifestSummary",
  "getKnowledgeServicesManifestInventoryCount",
] as const);

const CANONICAL_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "validation",
  "architecture",
  "dependencies",
  "ownership",
  "boundaries",
  "services",
  "capabilities",
  "contracts",
  "models",
  "validationProfile",
  "inventory",
  "compatibility",
  "guarantees",
  "publicApi",
  "status",
  "readiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:5 Knowledge Services Manifest", () => {
  it("creates exactly eight Manifest files and twelve public exports", () => {
    assert.equal(DKL75_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL75_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 12);
  });

  it("has exact identity, status, architecture status, and ReadyForPlatform", () => {
    assert.equal(
      KnowledgeServicesManifestId,
      "DKL-7:5/KnowledgeServicesManifest",
    );
    assert.equal(KnowledgeServicesManifestName, "Knowledge Services Manifest");
    assert.equal(KnowledgeServicesManifestVersion, "1.0.0");
    assert.equal(KnowledgeServicesManifestStatus, "ManifestComplete");
    assert.equal(KnowledgeServicesManifestReadiness, "ReadyForPlatform");
    assert.equal(
      KnowledgeServicesManifestNamespace,
      "nexora.dkl.knowledge-services.manifest",
    );
    assert.equal(KnowledgeServicesManifest.status, "ManifestComplete");
    assert.equal(KnowledgeServicesManifest.readiness, "ReadyForPlatform");
    assert.equal(
      KnowledgeServicesManifest.architectureStatus,
      "CompleteThroughManifest",
    );
    assert.equal(KnowledgeServicesManifest.validationResult, "Pass");
    assert.equal(KnowledgeServicesManifest.identity.validationResult, "Pass");
  });

  it("depends only on Validation and preserves the canonical chain by reference", () => {
    assert.equal(
      KnowledgeServicesManifest.validation,
      KnowledgeServicesValidation,
    );
    assert.equal(
      KnowledgeServicesManifest.identity.validationId,
      KnowledgeServicesValidationId,
    );
    assert.equal(
      KnowledgeServicesManifest.validation.model,
      KnowledgeServicesValidation.model,
    );
    assert.equal(
      KnowledgeServicesManifest.validation.model.registry,
      KnowledgeServicesValidation.model.registry,
    );
    assert.equal(
      KnowledgeServicesManifest.validation.model.registry.foundation,
      KnowledgeServicesValidation.model.registry.foundation,
    );
    assert.equal(
      KnowledgeServicesManifest.identity.modelId,
      KnowledgeServicesValidation.model.identity.modelId,
    );
    assert.equal(
      KnowledgeServicesManifest.identity.registryId,
      KnowledgeServicesValidation.model.registry.identity.registryId,
    );
    assert.equal(
      KnowledgeServicesManifest.identity.foundationId,
      KnowledgeServicesValidation.model.registry.foundation.foundationId,
    );
    assert.equal(
      KnowledgeServicesManifest.identity.dkl6PublicIndexId,
      "DKL-6:9/KnowledgeRepositoryPublicIndex",
    );
    assert.equal(
      KnowledgeServicesManifest.dependencyDeclarations.directPreviousPhaseModule,
      "knowledgeServicesValidation.ts",
    );
    assert.equal(
      KnowledgeServicesManifest.dependencyDeclarations.modelDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesManifest.dependencyDeclarations.registryDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesManifest.dependencyDeclarations.foundationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesManifest.dependencyDeclarations.dkl6DirectImport,
      false,
    );
  });

  it("preserves exact canonical section order with 18 sections", () => {
    const keys = Object.keys(KnowledgeServicesManifest);
    const indexes = CANONICAL_SECTIONS.map((section) => keys.indexOf(section));
    assert.equal(CANONICAL_SECTIONS.length, 18);
    for (let i = 0; i < indexes.length; i += 1) {
      assert.ok(indexes[i]! >= 0, `missing section ${CANONICAL_SECTIONS[i]}`);
      if (i > 0) {
        assert.ok(
          indexes[i]! > indexes[i - 1]!,
          `${CANONICAL_SECTIONS[i]} must follow ${CANONICAL_SECTIONS[i - 1]}`,
        );
      }
    }
    assert.equal(KnowledgeServicesManifestInventory.sectionCount, 18);
  });

  it("declares phase inventory and ten unique dependencies", () => {
    assert.equal(KnowledgeServicesManifest.architecture.completedPhaseCount, 5);
    assert.equal(KnowledgeServicesManifest.architecture.futurePhaseCount, 4);
    assert.equal(KnowledgeServicesManifest.architecture.totalPhaseCount, 9);
    assertUnique(
      KnowledgeServicesManifest.architecture.phases.map((p) => p.phaseId),
      "phase IDs",
    );
    assert.deepEqual(
      KnowledgeServicesManifest.architecture.phases.map((p) => p.stage),
      [
        "Foundation",
        "Registry",
        "Model",
        "Validation",
        "Manifest",
        "Platform",
        "Certification",
        "Freeze",
        "PublicIndex",
      ],
    );
    assert.equal(KnowledgeServicesManifest.dependencies.length, 10);
    assertUnique(
      KnowledgeServicesManifest.dependencies.map((d) => d.dependencyId),
      "dependency IDs",
    );
    assert.equal(
      KnowledgeServicesManifest.dependencies.every(
        (d) => d.introducesFutureImport === false && d.runtimeBehavior === "None",
      ),
      true,
    );
  });

  it("preserves Foundation, Registry, Model, and Validation inventories", () => {
    const model = KnowledgeServicesValidation.model;
    const registry = model.registry;
    assert.equal(KnowledgeServicesManifest.ownership.ownedCount, 6);
    assert.equal(KnowledgeServicesManifest.ownership.nonOwnedCount, 24);
    assert.equal(KnowledgeServicesManifest.boundaries.length, 29);
    assert.equal(registry.lifecycle.length, 8);
    assert.equal(KnowledgeServicesManifest.services.length, 12);
    assert.equal(KnowledgeServicesManifest.capabilities.length, 12);
    assert.equal(KnowledgeServicesManifest.contracts.length, 11);
    assert.equal(registry.requestCategories.length, 12);
    assert.equal(registry.responseCategories.length, 12);
    assert.equal(registry.accessModes.length, 10);
    assert.equal(KnowledgeServicesManifestInventory.mutationModeCount, 0);
    assert.equal(registry.relationships.length, 12);
    assert.equal(KnowledgeServicesManifest.models.requestModelCount, 12);
    assert.equal(KnowledgeServicesManifest.models.responseModelCount, 12);
    assert.equal(KnowledgeServicesManifest.models.resultModelCount, 12);
    assert.equal(KnowledgeServicesManifest.models.contextModelCount, 4);
    assert.equal(KnowledgeServicesManifest.models.referenceModelCount, 8);
    assert.equal(KnowledgeServicesManifest.models.graphModelCount, 3);
    assert.equal(KnowledgeServicesManifest.models.relationshipCount, 28);
    assert.equal(KnowledgeServicesManifest.models.modelGuaranteeCount, 20);
    assert.equal(KnowledgeServicesManifest.models.totalModelInventoryCount, 79);
    assert.equal(KnowledgeServicesManifest.validationProfile.groupCount, 15);
    assert.equal(KnowledgeServicesManifest.validationProfile.ruleCount, 48);
    assert.equal(KnowledgeServicesManifest.validationProfile.evidenceCount, 48);
    assert.equal(KnowledgeServicesManifest.validationProfile.resultCount, 48);
    assert.equal(KnowledgeServicesManifest.validationProfile.passCount, 48);
    assert.equal(KnowledgeServicesManifest.validationProfile.failCount, 0);
    assert.equal(
      KnowledgeServicesManifest.validationProfile.notApplicableCount,
      0,
    );
    assert.equal(KnowledgeServicesManifest.validationProfile.findingCount, 0);
    assert.equal(KnowledgeServicesManifest.validationProfile.guaranteeCount, 16);
    assert.equal(KnowledgeServicesManifest.validationProfile.overallResult, "Pass");
  });

  it("declares twelve Compatible declarations and eighteen guarantees", () => {
    assert.equal(KnowledgeServicesManifestCompatibility.length, 12);
    assertUnique(
      KnowledgeServicesManifestCompatibility.map((c) => c.compatibilityId),
      "compatibility IDs",
    );
    assert.equal(
      KnowledgeServicesManifestCompatibility.every(
        (c) =>
          c.status === "Compatible" && c.runtimeAuthorization === "None",
      ),
      true,
    );
    assert.equal(KnowledgeServicesManifestGuarantees.length, 18);
    assertUnique(
      KnowledgeServicesManifestGuarantees.map((g) => g.guaranteeId),
      "guarantee IDs",
    );
    assert.equal(
      KnowledgeServicesManifestGuarantees.every((g) => g.status === true),
      true,
    );
    assert.equal(KnowledgeServicesManifest.publicApi.length, 12);
    assertUnique(
      KnowledgeServicesManifest.publicApi.map((a) => a.apiId),
      "public API IDs",
    );
    assert.equal(
      KnowledgeServicesManifest.publicApi.every(
        (a) => a.runtimeService === false && a.mutableCollection === false,
      ),
      true,
    );
  });

  it("is immutable and free of prohibited runtime behavior", () => {
    assert.equal(KnowledgeServicesManifest.metadataOnly, true);
    assert.equal(KnowledgeServicesManifest.runtimeBehavior, false);
    assert.equal(KnowledgeServicesManifest.serviceExecution, false);
    assert.equal(KnowledgeServicesManifest.repositoryAccess, false);
    assert.equal(KnowledgeServicesManifest.searchExecution, false);
    assert.equal(KnowledgeServicesManifest.graphTraversal, false);
    assert.equal(KnowledgeServicesManifest.aiBehavior, false);
    assert.equal(KnowledgeServicesManifest.transportBehavior, false);
    assert.equal(KnowledgeServicesManifest.authenticationBehavior, false);
    assert.equal(KnowledgeServicesManifest.authorizationBehavior, false);
    assert.equal(KnowledgeServicesManifest.mutationBehavior, false);
    assert.equal(Object.isFrozen(KnowledgeServicesManifest), true);
    assert.equal(Object.isFrozen(KnowledgeServicesManifest.dependencies), true);
    assert.equal(Object.isFrozen(KnowledgeServicesManifest.compatibility), true);
    assert.equal(Object.isFrozen(KnowledgeServicesManifest.guarantees), true);
    assert.equal(Object.isFrozen(KnowledgeServicesManifest.inventory), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeServicesManifest.status = "Mutated";
    });
    assert.equal("execute" in KnowledgeServicesManifest, false);
    assert.equal("dispatch" in KnowledgeServicesManifest, false);
    assert.equal("validateRequest" in KnowledgeServicesManifest, false);
  });

  it("returns deterministic summary and inventory count from canonical fields", () => {
    const summary = getKnowledgeServicesManifestSummary();
    const again = getKnowledgeServicesManifestSummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.manifestId, KnowledgeServicesManifestId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "ManifestComplete");
    assert.equal(summary.readiness, "ReadyForPlatform");
    assert.equal(summary.architectureStatus, "CompleteThroughManifest");
    assert.equal(summary.validationResult, "Pass");
    assert.equal(summary.validationId, KnowledgeServicesValidationId);
    assert.equal(summary.completedPhaseCount, 5);
    assert.equal(summary.futurePhaseCount, 4);
    assert.equal(summary.serviceCount, 12);
    assert.equal(summary.capabilityCount, 12);
    assert.equal(summary.contractCount, 11);
    assert.equal(summary.lifecycleCount, 8);
    assert.equal(summary.ownedResponsibilityCount, 6);
    assert.equal(summary.nonOwnedResponsibilityCount, 24);
    assert.equal(summary.prohibitedSurfaceCount, 29);
    assert.equal(summary.mutationModeCount, 0);
    assert.equal(summary.totalModelInventoryCount, 79);
    assert.equal(summary.validationRuleCount, 48);
    assert.equal(summary.validationPassCount, 48);
    assert.equal(summary.validationFailCount, 0);
    assert.equal(summary.dependencyDeclarationCount, 10);
    assert.equal(summary.compatibilityDeclarationCount, 12);
    assert.equal(summary.guaranteeCount, 18);
    assert.equal(summary.publicApiCount, 12);
    const expected =
      5 +
      4 +
      10 +
      6 +
      24 +
      29 +
      12 +
      12 +
      11 +
      8 +
      12 +
      12 +
      10 +
      12 +
      79 +
      15 +
      48 +
      48 +
      48 +
      12 +
      18 +
      12;
    assert.equal(expected, 447);
    assert.equal(KnowledgeServicesManifestInventory.totalEntryCount, expected);
    assert.equal(getKnowledgeServicesManifestInventoryCount(), expected);
    assert.equal(summary.totalManifestInventoryCount, expected);
    assert.equal(Object.isFrozen(summary), true);
  });
});
