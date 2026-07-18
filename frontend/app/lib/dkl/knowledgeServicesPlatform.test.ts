/**
 * DKL-7:6 — Knowledge Services Platform Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Platform.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  getKnowledgeServicesManifestInventoryCount,
  KnowledgeServicesManifest,
  KnowledgeServicesManifestId,
  KnowledgeServicesManifestStatus,
} from "./knowledgeServicesManifest.ts";
import * as PlatformModule from "./knowledgeServicesPlatform.ts";
import {
  getKnowledgeServicesPlatformInventoryCount,
  getKnowledgeServicesPlatformSummary,
  KnowledgeServicesPlatform,
  KnowledgeServicesPlatformCompatibility,
  KnowledgeServicesPlatformGuarantees,
  KnowledgeServicesPlatformId,
  KnowledgeServicesPlatformInventory,
  KnowledgeServicesPlatformName,
  KnowledgeServicesPlatformNamespace,
  KnowledgeServicesPlatformReadiness,
  KnowledgeServicesPlatformStatus,
  KnowledgeServicesPlatformVersion,
} from "./knowledgeServicesPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL76_FILES = Object.freeze([
  "knowledgeServicesPlatformTypes.ts",
  "knowledgeServicesPlatformArchitecture.ts",
  "knowledgeServicesPlatformDependencies.ts",
  "knowledgeServicesPlatformCompatibility.ts",
  "knowledgeServicesPlatformGuarantees.ts",
  "knowledgeServicesPlatformReadiness.ts",
  "knowledgeServicesPlatform.ts",
  "knowledgeServicesPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesPlatform",
  "KnowledgeServicesPlatformId",
  "KnowledgeServicesPlatformName",
  "KnowledgeServicesPlatformVersion",
  "KnowledgeServicesPlatformNamespace",
  "KnowledgeServicesPlatformStatus",
  "KnowledgeServicesPlatformReadiness",
  "KnowledgeServicesPlatformInventory",
  "KnowledgeServicesPlatformCompatibility",
  "KnowledgeServicesPlatformGuarantees",
  "getKnowledgeServicesPlatformSummary",
  "getKnowledgeServicesPlatformInventoryCount",
] as const);

const CANONICAL_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "manifest",
  "architecture",
  "foundation",
  "registry",
  "model",
  "validation",
  "services",
  "capabilities",
  "contracts",
  "dependencies",
  "ownership",
  "boundaries",
  "compatibility",
  "consumers",
  "inventory",
  "guarantees",
  "status",
  "readiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:6 Knowledge Services Platform", () => {
  it("creates exactly eight Platform files and twelve public exports", () => {
    assert.equal(DKL76_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL76_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 12);
  });

  it("has exact identity, status, architecture status, and ReadyForCertification", () => {
    assert.equal(
      KnowledgeServicesPlatformId,
      "DKL-7:6/KnowledgeServicesPlatform",
    );
    assert.equal(KnowledgeServicesPlatformName, "Knowledge Services Platform");
    assert.equal(KnowledgeServicesPlatformVersion, "1.0.0");
    assert.equal(KnowledgeServicesPlatformStatus, "PlatformComplete");
    assert.equal(KnowledgeServicesPlatformReadiness, "ReadyForCertification");
    assert.equal(
      KnowledgeServicesPlatformNamespace,
      "nexora.dkl.knowledge-services.platform",
    );
    assert.equal(KnowledgeServicesPlatform.status, "PlatformComplete");
    assert.equal(KnowledgeServicesPlatform.readiness, "ReadyForCertification");
    assert.equal(
      KnowledgeServicesPlatform.architectureStatus,
      "CompleteThroughPlatform",
    );
    assert.equal(KnowledgeServicesPlatform.validationResult, "Pass");
    assert.equal(
      KnowledgeServicesPlatform.manifestStatus,
      KnowledgeServicesManifestStatus,
    );
  });

  it("consumes Manifest only and preserves the canonical chain by reference", () => {
    assert.equal(KnowledgeServicesPlatform.manifest, KnowledgeServicesManifest);
    assert.equal(
      KnowledgeServicesPlatform.identity.manifestId,
      KnowledgeServicesManifestId,
    );
    assert.equal(
      KnowledgeServicesPlatform.manifest.validation,
      KnowledgeServicesManifest.validation,
    );
    assert.equal(
      KnowledgeServicesPlatform.model.model,
      KnowledgeServicesManifest.validation.model,
    );
    assert.equal(
      KnowledgeServicesPlatform.registry.services,
      KnowledgeServicesManifest.validation.model.registry.services,
    );
    assert.equal(
      KnowledgeServicesPlatform.foundation.identity,
      KnowledgeServicesManifest.validation.model.registry.foundation.identity,
    );
    assert.equal(
      KnowledgeServicesPlatform.dependencyDeclarations.directPreviousPhaseModule,
      "knowledgeServicesManifest.ts",
    );
    assert.equal(
      KnowledgeServicesPlatform.dependencyDeclarations.validationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesPlatform.dependencyDeclarations.modelDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesPlatform.dependencyDeclarations.registryDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesPlatform.dependencyDeclarations.foundationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesPlatform.dependencyDeclarations.dkl6DirectImport,
      false,
    );
  });

  it("preserves exact canonical section order with 20 sections", () => {
    const keys = Object.keys(KnowledgeServicesPlatform);
    const indexes = CANONICAL_SECTIONS.map((section) => keys.indexOf(section));
    assert.equal(CANONICAL_SECTIONS.length, 20);
    for (let i = 0; i < indexes.length; i += 1) {
      assert.ok(indexes[i]! >= 0, `missing section ${CANONICAL_SECTIONS[i]}`);
      if (i > 0) {
        assert.ok(
          indexes[i]! > indexes[i - 1]!,
          `${CANONICAL_SECTIONS[i]} must follow ${CANONICAL_SECTIONS[i - 1]}`,
        );
      }
    }
    assert.equal(KnowledgeServicesPlatformInventory.sectionCount, 20);
  });

  it("declares phase, dependency, and consumer inventories", () => {
    assert.equal(KnowledgeServicesPlatform.architecture.completedPhaseCount, 6);
    assert.equal(KnowledgeServicesPlatform.architecture.futurePhaseCount, 3);
    assert.equal(KnowledgeServicesPlatform.architecture.totalPhaseCount, 9);
    assertUnique(
      KnowledgeServicesPlatform.architecture.phases.map((p) => p.phaseId),
      "phase IDs",
    );
    assert.deepEqual(
      KnowledgeServicesPlatform.architecture.phases.map((p) => p.stage),
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
    assert.equal(KnowledgeServicesPlatform.dependencies.length, 12);
    assertUnique(
      KnowledgeServicesPlatform.dependencies.map((d) => d.dependencyId),
      "dependency IDs",
    );
    assert.equal(KnowledgeServicesPlatform.consumers.length, 4);
    assertUnique(
      KnowledgeServicesPlatform.consumers.map((c) => c.consumerId),
      "consumer IDs",
    );
    const certification = KnowledgeServicesPlatform.consumers.find(
      (c) => c.consumerId.endsWith("/Certification"),
    );
    const freeze = KnowledgeServicesPlatform.consumers.find((c) =>
      c.consumerId.endsWith("/Freeze"),
    );
    const publicIndex = KnowledgeServicesPlatform.consumers.find((c) =>
      c.consumerId.endsWith("/PublicIndex"),
    );
    const internal = KnowledgeServicesPlatform.consumers.find((c) =>
      c.consumerId.endsWith("/ApprovedInternalConsumer"),
    );
    assert.equal(certification?.directImportAuthorization, true);
    assert.equal(freeze?.directImportAuthorization, false);
    assert.equal(publicIndex?.directImportAuthorization, false);
    assert.equal(internal?.directImportAuthorization, false);
    assert.equal(
      KnowledgeServicesPlatform.consumers.every(
        (c) => c.runtimeAuthorization === "None",
      ),
      true,
    );
  });

  it("preserves Foundation, Registry, Model, Validation, and Manifest inventories", () => {
    assert.equal(KnowledgeServicesPlatform.ownership.ownedCount, 6);
    assert.equal(KnowledgeServicesPlatform.ownership.nonOwnedCount, 24);
    assert.equal(KnowledgeServicesPlatform.boundaries.prohibitedSurfaceCount, 29);
    assert.equal(KnowledgeServicesPlatform.registry.services.length, 12);
    assert.equal(KnowledgeServicesPlatform.registry.capabilities.length, 12);
    assert.equal(KnowledgeServicesPlatform.registry.contracts.length, 11);
    assert.equal(KnowledgeServicesPlatform.registry.requestCategories.length, 12);
    assert.equal(
      KnowledgeServicesPlatform.registry.responseCategories.length,
      12,
    );
    assert.equal(KnowledgeServicesPlatform.registry.accessModes.length, 10);
    assert.equal(KnowledgeServicesPlatform.registry.mutationModeCount, 0);
    assert.equal(
      KnowledgeServicesPlatform.registry.serviceCapabilityRelationships.length,
      12,
    );
    assert.equal(KnowledgeServicesPlatform.services.length, 12);
    assert.equal(
      KnowledgeServicesPlatform.services.every(
        (s) =>
          s.platformAvailability === "PlatformAvailable" &&
          s.runtimeImplementationStatus === "NotProvidedByPlatform",
      ),
      true,
    );
    assert.equal(KnowledgeServicesPlatform.capabilities.length, 12);
    assert.equal(KnowledgeServicesPlatform.contracts.length, 11);
    assert.equal(KnowledgeServicesPlatform.model.requestModelCount, 12);
    assert.equal(KnowledgeServicesPlatform.model.responseModelCount, 12);
    assert.equal(KnowledgeServicesPlatform.model.resultModelCount, 12);
    assert.equal(KnowledgeServicesPlatform.model.contextModelCount, 4);
    assert.equal(KnowledgeServicesPlatform.model.referenceModelCount, 8);
    assert.equal(KnowledgeServicesPlatform.model.graphModelCount, 3);
    assert.equal(KnowledgeServicesPlatform.model.relationshipCount, 28);
    assert.equal(KnowledgeServicesPlatform.model.modelGuaranteeCount, 20);
    assert.equal(KnowledgeServicesPlatform.model.totalInventoryCount, 79);
    assert.equal(KnowledgeServicesPlatform.validation.groupCount, 15);
    assert.equal(KnowledgeServicesPlatform.validation.ruleCount, 48);
    assert.equal(KnowledgeServicesPlatform.validation.evidenceCount, 48);
    assert.equal(KnowledgeServicesPlatform.validation.resultCount, 48);
    assert.equal(KnowledgeServicesPlatform.validation.passCount, 48);
    assert.equal(KnowledgeServicesPlatform.validation.failCount, 0);
    assert.equal(KnowledgeServicesPlatform.validation.findingCount, 0);
    assert.equal(KnowledgeServicesPlatform.validation.guaranteeCount, 16);
    assert.equal(KnowledgeServicesPlatform.manifest.inventory.sectionCount, 18);
    assert.equal(KnowledgeServicesPlatform.manifest.dependencies.length, 10);
    assert.equal(KnowledgeServicesPlatform.manifest.compatibility.length, 12);
    assert.equal(KnowledgeServicesPlatform.manifest.guarantees.length, 18);
    assert.equal(KnowledgeServicesPlatform.manifest.publicApi.length, 12);
    assert.equal(
      KnowledgeServicesPlatform.manifest.inventory.totalEntryCount,
      getKnowledgeServicesManifestInventoryCount(),
    );
    assert.equal(
      KnowledgeServicesPlatform.manifest.inventory.totalEntryCount,
      447,
    );
  });

  it("declares fourteen Compatible declarations and twenty guarantees", () => {
    assert.equal(KnowledgeServicesPlatformCompatibility.length, 14);
    assertUnique(
      KnowledgeServicesPlatformCompatibility.map((c) => c.compatibilityId),
      "compatibility IDs",
    );
    assert.equal(
      KnowledgeServicesPlatformCompatibility.every(
        (c) =>
          c.status === "Compatible" && c.runtimeAuthorization === "None",
      ),
      true,
    );
    assert.equal(KnowledgeServicesPlatformGuarantees.length, 20);
    assertUnique(
      KnowledgeServicesPlatformGuarantees.map((g) => g.guaranteeId),
      "guarantee IDs",
    );
    assert.equal(
      KnowledgeServicesPlatformGuarantees.every((g) => g.status === true),
      true,
    );
  });

  it("is immutable and free of prohibited runtime behavior", () => {
    assert.equal(KnowledgeServicesPlatform.metadataOnly, true);
    assert.equal(KnowledgeServicesPlatform.runtimeBehavior, false);
    assert.equal(KnowledgeServicesPlatform.serviceExecution, false);
    assert.equal(KnowledgeServicesPlatform.repositoryAccess, false);
    assert.equal(KnowledgeServicesPlatform.searchExecution, false);
    assert.equal(KnowledgeServicesPlatform.graphTraversal, false);
    assert.equal(KnowledgeServicesPlatform.aiBehavior, false);
    assert.equal(KnowledgeServicesPlatform.transportBehavior, false);
    assert.equal(KnowledgeServicesPlatform.authenticationBehavior, false);
    assert.equal(KnowledgeServicesPlatform.authorizationBehavior, false);
    assert.equal(KnowledgeServicesPlatform.mutationBehavior, false);
    assert.equal(Object.isFrozen(KnowledgeServicesPlatform), true);
    assert.equal(Object.isFrozen(KnowledgeServicesPlatform.dependencies), true);
    assert.equal(Object.isFrozen(KnowledgeServicesPlatform.compatibility), true);
    assert.equal(Object.isFrozen(KnowledgeServicesPlatform.guarantees), true);
    assert.equal(Object.isFrozen(KnowledgeServicesPlatform.consumers), true);
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeServicesPlatform.status = "Mutated";
    });
    assert.equal("execute" in KnowledgeServicesPlatform, false);
    assert.equal("dispatch" in KnowledgeServicesPlatform, false);
    assert.equal("handler" in KnowledgeServicesPlatform, false);
  });

  it("returns deterministic summary and inventory count from canonical fields", () => {
    const summary = getKnowledgeServicesPlatformSummary();
    const again = getKnowledgeServicesPlatformSummary();
    assert.deepEqual(summary, again);
    assert.equal(summary.platformId, KnowledgeServicesPlatformId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "PlatformComplete");
    assert.equal(summary.readiness, "ReadyForCertification");
    assert.equal(summary.architectureStatus, "CompleteThroughPlatform");
    assert.equal(summary.validationResult, "Pass");
    assert.equal(summary.manifestStatus, "ManifestComplete");
    assert.equal(summary.manifestId, KnowledgeServicesManifestId);
    assert.equal(summary.completedPhaseCount, 6);
    assert.equal(summary.futurePhaseCount, 3);
    assert.equal(summary.sectionCount, 20);
    assert.equal(summary.serviceCount, 12);
    assert.equal(summary.capabilityCount, 12);
    assert.equal(summary.contractCount, 11);
    assert.equal(summary.mutationModeCount, 0);
    assert.equal(summary.modelInventoryCount, 79);
    assert.equal(summary.validationRuleCount, 48);
    assert.equal(summary.validationPassCount, 48);
    assert.equal(summary.validationFailCount, 0);
    assert.equal(summary.manifestInventoryCount, 447);
    assert.equal(summary.platformDependencyCount, 12);
    assert.equal(summary.compatibilityCount, 14);
    assert.equal(summary.consumerCount, 4);
    assert.equal(summary.guaranteeCount, 20);
    assert.equal(summary.publicApiCount, 12);
    const expected =
      6 +
      3 +
      12 +
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
      18 +
      10 +
      12 +
      18 +
      12 +
      14 +
      4 +
      20 +
      12;
    assert.equal(expected, 527);
    assert.equal(KnowledgeServicesPlatformInventory.totalEntryCount, expected);
    assert.equal(getKnowledgeServicesPlatformInventoryCount(), expected);
    assert.equal(summary.platformInventoryCount, expected);
    assert.equal(Object.isFrozen(summary), true);
  });
});
