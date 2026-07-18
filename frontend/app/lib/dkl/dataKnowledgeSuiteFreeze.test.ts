/**
 * DKL-9:8 — Data Knowledge Suite Freeze Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Freeze.
 * Inventory assertions compare against Certification-derived references.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DataKnowledgeSuiteCertificationPlatform } from "./dataKnowledgeSuiteCertification.ts";
import * as FreezeModule from "./dataKnowledgeSuiteFreeze.ts";
import {
  getDataKnowledgeSuiteFreezeSummary,
  DataKnowledgeSuiteFreezeId,
  DataKnowledgeSuiteFreezeName,
  DataKnowledgeSuiteFreezeNamespace,
  DataKnowledgeSuiteFreezePlatform,
  DataKnowledgeSuiteFreezeReadiness,
  DataKnowledgeSuiteFreezeStatus,
  DataKnowledgeSuiteFreezeVersion,
} from "./dataKnowledgeSuiteFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL98_FILES = Object.freeze([
  "dataKnowledgeSuiteFreezeTypes.ts",
  "dataKnowledgeSuiteFreezeRegistry.ts",
  "dataKnowledgeSuiteFreezeBaselines.ts",
  "dataKnowledgeSuiteFreezeCompatibility.ts",
  "dataKnowledgeSuiteFreezeLocks.ts",
  "dataKnowledgeSuiteFreezeExtensions.ts",
  "dataKnowledgeSuiteFreeze.ts",
  "dataKnowledgeSuiteFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteFreezeId",
  "DataKnowledgeSuiteFreezeVersion",
  "DataKnowledgeSuiteFreezeName",
  "DataKnowledgeSuiteFreezeNamespace",
  "DataKnowledgeSuiteFreezeStatus",
  "DataKnowledgeSuiteFreezeReadiness",
  "DataKnowledgeSuiteFreezePlatform",
  "getDataKnowledgeSuiteFreezeSummary",
] as const);

const EXPECTED_CERTIFICATION_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteCertificationId",
  "DataKnowledgeSuiteCertificationVersion",
  "DataKnowledgeSuiteCertificationName",
  "DataKnowledgeSuiteCertificationNamespace",
  "DataKnowledgeSuiteCertificationStatus",
  "DataKnowledgeSuiteCertificationReadiness",
  "DataKnowledgeSuiteCertificationPlatform",
  "getDataKnowledgeSuiteCertificationSummary",
] as const);

const EXPECTED_EXTENSION_LOCKS = Object.freeze([
  "AdditiveExtensionsOnly",
  "MajorVersionForBreakingChanges",
  "NoPublicSurfaceMutation",
  "NoInventoryReconstruction",
  "NoBackwardDependencies",
  "NoDuplicateMetadata",
  "NoReferenceReplacement",
  "CanonicalReferencePreservation",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "IdentityBaseline",
  "DependencyBaseline",
  "PlatformBaseline",
  "ManifestBaseline",
  "ValidationBaseline",
  "ModelBaseline",
  "RegistryBaseline",
  "FoundationBaseline",
  "OwnershipBaseline",
  "BoundariesBaseline",
  "InventoryBaseline",
  "CompatibilityBaseline",
  "PublicSurfaceBaseline",
  "RuntimeProhibitionsBaseline",
  "ReleaseReadinessBaseline",
] as const);

const certification = DataKnowledgeSuiteCertificationPlatform;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:8 Data Knowledge Suite Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(DKL98_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL98_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical identity, Frozen status, lock, and ReadyForPublicIndex", () => {
    assert.equal(
      DataKnowledgeSuiteFreezeId,
      "DKL-9:8/DataKnowledgeSuiteFreeze",
    );
    assert.equal(DataKnowledgeSuiteFreezeVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuiteFreezeName,
      "Data Knowledge Suite Freeze",
    );
    assert.equal(
      DataKnowledgeSuiteFreezeNamespace,
      "nexora.dkl.data-knowledge-suite.freeze",
    );
    assert.equal(DataKnowledgeSuiteFreezeStatus, "Frozen");
    assert.equal(
      DataKnowledgeSuiteFreezeReadiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      DataKnowledgeSuiteFreezePlatform.lock.id,
      "DKL-9-DATA-KNOWLEDGE-SUITE-LOCKED",
    );
    assert.equal(DataKnowledgeSuiteFreezePlatform.lock.locked, true);
    assert.equal(
      DataKnowledgeSuiteFreezePlatform.lock.certificationResult,
      "Pass",
    );
    assert.equal(
      DataKnowledgeSuiteFreezePlatform.lock.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      DataKnowledgeSuiteFreezePlatform.nextPhase,
      "DKL-9:9 — Data Knowledge Suite Public Index",
    );
    assert.equal(
      DataKnowledgeSuiteFreezePlatform.freezeResult.readyForPublicIndex,
      true,
    );
  });

  it("consumes only Certification and preserves the full upstream chain by reference", () => {
    const freeze = DataKnowledgeSuiteFreezePlatform;
    assert.equal(
      freeze.dependency.directPreviousPhaseModule,
      "dataKnowledgeSuiteCertification.ts",
    );
    assert.equal(freeze.dependency.certificationOnly, true);
    assert.equal(freeze.dependency.platformDirectImport, false);
    assert.equal(freeze.dependency.manifestDirectImport, false);
    assert.equal(freeze.dependency.validationDirectImport, false);
    assert.equal(freeze.dependency.modelDirectImport, false);
    assert.equal(freeze.dependency.registryDirectImport, false);
    assert.equal(freeze.dependency.foundationDirectImport, false);
    assert.equal(freeze.dependency.publicIndexDirectImport, false);
    assert.equal(freeze.dependency.dkl1DirectImport, false);
    assert.equal(freeze.dependency.dkl8DirectImport, false);
    assert.equal(freeze.dependency.modifiesCertification, false);
    assert.equal(freeze.dependency.modifiesPlatform, false);
    assert.equal(freeze.dependency.recertifies, false);
    assert.equal(certification.certificationOutcome, "Pass");
    assert.equal(freeze.certification, certification);
    assert.equal(freeze.platform, certification.platform);
    assert.equal(freeze.manifest, certification.manifest);
    assert.equal(freeze.validation, certification.validation);
    assert.equal(freeze.model, certification.model);
    assert.equal(freeze.registry, certification.registry);
    assert.equal(freeze.foundation, certification.foundation);
    assert.equal(freeze.ownership, certification.ownership);
    assert.equal(freeze.boundaries, certification.boundaries);
    assert.equal(freeze.capabilityCatalog, certification.capabilityCatalog);
    assert.equal(freeze.platformGuarantees, certification.platformGuarantees);
    assert.equal(
      freeze.platformCompatibility,
      certification.platformCompatibility,
    );
    assert.equal(freeze.certificationCriteria, certification.criteria);
    assert.equal(freeze.certificationGates, certification.gates);
  });

  it("freezes seven components, fifteen baselines, twelve compatibility, eight extension locks, fifteen guarantees", () => {
    const freeze = DataKnowledgeSuiteFreezePlatform;
    assert.equal(freeze.components.length, 7);
    assert.equal(freeze.baselines.length, 15);
    assert.equal(freeze.compatibility.length, 12);
    assert.equal(freeze.extensionLocks.length, 8);
    assert.equal(freeze.guarantees.length, 15);
    assertUnique(
      freeze.components.map((item) => item.id),
      "componentId",
    );
    assertUnique(
      freeze.baselines.map((item) => item.id),
      "baselineId",
    );
    assertUnique(
      freeze.compatibility.map((item) => item.id),
      "compatibilityId",
    );
    assertUnique(
      freeze.extensionLocks.map((item) => item.id),
      "extensionLockId",
    );
    assert.ok(freeze.components.every((item) => item.frozen === true));
    assert.ok(freeze.components.every((item) => item.certified === true));
    assert.deepEqual(
      freeze.baselines.map((item) => item.name),
      [...EXPECTED_BASELINES],
    );
    assert.ok(freeze.baselines.every((item) => item.frozen && item.satisfied));
    assert.ok(
      freeze.compatibility.every(
        (item) => item.compatible && item.frozen && item.protected,
      ),
    );
    assert.deepEqual(
      freeze.extensionLocks.map((item) => item.name),
      [...EXPECTED_EXTENSION_LOCKS],
    );
    assert.ok(
      freeze.guarantees.every((item) => item.status === "Satisfied"),
    );
    assert.ok(
      freeze.guarantees.some(
        (item) => item.name === "CertifiedArchitecturePreserved",
      ),
    );
    assert.ok(
      freeze.guarantees.some((item) => item.name === "ReadyForPublicIndex"),
    );
  });

  it("protects public surfaces and satisfies Canonical Inventory Rule", () => {
    const freeze = DataKnowledgeSuiteFreezePlatform;
    assert.deepEqual(
      [...freeze.protectedCertificationExports],
      [...EXPECTED_CERTIFICATION_EXPORTS],
    );
    assert.deepEqual(
      [...freeze.protectedFreezeExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(freeze.apiRegistry.length, 8);
    assert.equal(freeze.inventory.sourcedThroughCertification, true);
    assert.equal(freeze.inventory.reconstructed, false);
    assert.equal(freeze.inventory.hardcoded, false);
    assert.equal(freeze.inventory.duplicated, false);
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.capabilityCount,
      certification.inventory.capabilityCount,
    );
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.publicApiInventoryTotal,
      certification.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.validationRuleCount,
      certification.inventory.validationRuleCount,
    );
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.manifestTotalEntryCount,
      certification.inventory.manifestTotalEntryCount,
    );
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.platformTotalEntryCount,
      certification.inventory.platformTotalEntryCount,
    );
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.sourcedThroughPlatform,
      true,
    );
    assert.equal(
      freeze.inventory.frozenComponentCount,
      freeze.components.length,
    );
    assert.equal(freeze.inventory.baselineCount, freeze.baselines.length);
    assert.equal(
      freeze.inventory.compatibilityCount,
      freeze.compatibility.length,
    );
    assert.equal(
      freeze.inventory.extensionLockCount,
      freeze.extensionLocks.length,
    );
    assert.equal(freeze.inventory.guaranteeCount, freeze.guarantees.length);
    assert.equal(freeze.inventory.publicApiCount, freeze.apiRegistry.length);
    assert.equal(
      freeze.inventory.totalEntryCount,
      freeze.components.length +
        freeze.baselines.length +
        freeze.compatibility.length +
        freeze.extensionLocks.length +
        freeze.guarantees.length +
        freeze.apiRegistry.length +
        certification.inventory.platformTotalEntryCount,
    );
  });

  it("exposes immutable helpers and deterministic summary", () => {
    const helpers = DataKnowledgeSuiteFreezePlatform.helpers;
    assert.equal(
      helpers.getFrozenComponentById("DataKnowledgeSuitePlatform")?.name,
      "Data Knowledge Suite Platform",
    );
    assert.equal(helpers.getFrozenComponentById("unknown"), undefined);
    assert.equal(
      helpers.getFreezeBaselineById("IdentityBaseline")?.name,
      "IdentityBaseline",
    );
    assert.equal(helpers.getFreezeBaselineById("unknown"), undefined);
    assert.equal(
      helpers.getFreezeCompatibilityById("RegistryCompatibility")?.name,
      "RegistryCompatibility",
    );
    assert.equal(helpers.getFreezeCompatibilityById("unknown"), undefined);
    assert.equal(
      helpers.getExtensionLockById("AdditiveExtensionsOnly")?.name,
      "AdditiveExtensionsOnly",
    );
    assert.equal(helpers.getExtensionLockById("unknown"), undefined);
    assert.equal(
      helpers.getDataKnowledgeSuiteFreezeEntryCount(),
      DataKnowledgeSuiteFreezePlatform.inventory.totalEntryCount,
    );

    assert.equal(Object.isFrozen(DataKnowledgeSuiteFreezePlatform), true);
    assert.equal(
      Object.isFrozen(DataKnowledgeSuiteFreezePlatform.components),
      true,
    );
    assert.equal(
      Object.isFrozen(DataKnowledgeSuiteFreezePlatform.baselines),
      true,
    );
    assert.equal(Object.isFrozen(DataKnowledgeSuiteFreezePlatform.lock), true);
    assert.equal(
      Object.isFrozen(DataKnowledgeSuiteFreezePlatform.compatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(DataKnowledgeSuiteFreezePlatform.extensionLocks),
      true,
    );
    assert.equal(
      Object.isFrozen(DataKnowledgeSuiteFreezePlatform.guarantees),
      true,
    );

    const summary = getDataKnowledgeSuiteFreezeSummary();
    const summaryAgain = getDataKnowledgeSuiteFreezeSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, DataKnowledgeSuiteFreezeId);
    assert.equal(summary.status, "Frozen");
    assert.equal(summary.freezeLock, "DKL-9-DATA-KNOWLEDGE-SUITE-LOCKED");
    assert.equal(summary.readiness, "ReadyForPublicIndex");
    assert.equal(
      summary.upstreamDependency,
      certification.identity.certificationId,
    );
    assert.equal(summary.certificationOutcome, "Pass");
    assert.equal(summary.frozenComponentCount, 7);
    assert.equal(summary.baselineCount, 15);
    assert.equal(summary.compatibilityCount, 12);
    assert.equal(summary.extensionLockCount, 8);
    assert.equal(
      summary.capabilityCount,
      certification.inventory.capabilityCount,
    );
    assert.equal(
      summary.publicApiInventoryTotal,
      certification.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      summary.validationRuleCount,
      certification.inventory.validationRuleCount,
    );
    assert.equal(
      summary.platformTotalEntryCount,
      certification.inventory.platformTotalEntryCount,
    );
    assert.equal(
      summary.totalEntryCount,
      DataKnowledgeSuiteFreezePlatform.inventory.totalEntryCount,
    );
    assert.equal(summary.runtimeBehavior, "None");
    assert.equal(
      summary.nextPhase,
      "DKL-9:9 — Data Knowledge Suite Public Index",
    );
    assert.equal(Object.isFrozen(summary), true);
  });

  it("locks runtime prohibitions and has no suite execution behaviour", () => {
    const freeze = DataKnowledgeSuiteFreezePlatform;
    const prohibitions = freeze.runtimeProhibitions;
    assert.equal(prohibitions.locked, true);
    assert.equal(prohibitions.authentication, false);
    assert.equal(prohibitions.authorization, false);
    assert.equal(prohibitions.policyEnforcement, false);
    assert.equal(prohibitions.suiteExecution, false);
    assert.equal(prohibitions.recertification, false);
    assert.equal(prohibitions.inventoryReconstruction, false);
    assert.equal(prohibitions.knowledgeRetrieval, false);
    assert.equal(prohibitions.engineReasoning, false);
    assert.equal(prohibitions.advisorResponses, false);
    assert.equal(prohibitions.sceneRendering, false);
    assert.equal(prohibitions.uiBehaviour, false);
    assert.equal(freeze.runtimeBehavior, false);
    assert.equal(freeze.runtimeEnforcement, false);
    assert.equal(freeze.persists, false);
    assert.equal(freeze.retrieves, false);
    assert.equal(freeze.reconstructs, false);
    assert.equal(freeze.recertifies, false);
    assert.equal(freeze.modifiesPlatform, false);
    assert.equal(freeze.modifiesCertification, false);
    assert.equal(freeze.executesSuiteLogic, false);
    assert.equal(freeze.sectionCount, 19);
  });
});
