/**
 * DKL-9:7 — Data Knowledge Suite Certification Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Certification.
 * Inventory assertions compare against Platform-derived references.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DataKnowledgeSuitePlatform } from "./dataKnowledgeSuitePlatform.ts";
import * as CertificationModule from "./dataKnowledgeSuiteCertification.ts";
import {
  getDataKnowledgeSuiteCertificationSummary,
  DataKnowledgeSuiteCertificationId,
  DataKnowledgeSuiteCertificationName,
  DataKnowledgeSuiteCertificationNamespace,
  DataKnowledgeSuiteCertificationPlatform,
  DataKnowledgeSuiteCertificationReadiness,
  DataKnowledgeSuiteCertificationStatus,
  DataKnowledgeSuiteCertificationVersion,
} from "./dataKnowledgeSuiteCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL97_FILES = Object.freeze([
  "dataKnowledgeSuiteCertificationTypes.ts",
  "dataKnowledgeSuiteCertificationCriteria.ts",
  "dataKnowledgeSuiteCertificationGates.ts",
  "dataKnowledgeSuiteCertificationEvidence.ts",
  "dataKnowledgeSuiteCertificationCompatibility.ts",
  "dataKnowledgeSuiteCertificationReport.ts",
  "dataKnowledgeSuiteCertification.ts",
  "dataKnowledgeSuiteCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteCertificationId",
  "DataKnowledgeSuiteCertificationVersion",
  "DataKnowledgeSuiteCertificationName",
  "DataKnowledgeSuiteCertificationNamespace",
  "DataKnowledgeSuiteCertificationStatus",
  "DataKnowledgeSuiteCertificationReadiness",
  "DataKnowledgeSuiteCertificationPlatform",
  "getDataKnowledgeSuiteCertificationSummary",
] as const);

const EXPECTED_PLATFORM_APIS = Object.freeze([
  "DataKnowledgeSuitePlatformId",
  "DataKnowledgeSuitePlatformVersion",
  "DataKnowledgeSuitePlatformName",
  "DataKnowledgeSuitePlatformNamespace",
  "DataKnowledgeSuitePlatformStatus",
  "DataKnowledgeSuitePlatformReadiness",
  "DataKnowledgeSuitePlatform",
  "getDataKnowledgeSuitePlatformSummary",
] as const);

const platform = DataKnowledgeSuitePlatform;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:7 Data Knowledge Suite Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(DKL97_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL97_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical identity, Certified status, Pass result, and ReadyForFreeze", () => {
    assert.equal(
      DataKnowledgeSuiteCertificationId,
      "DKL-9:7/DataKnowledgeSuiteCertification",
    );
    assert.equal(DataKnowledgeSuiteCertificationVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuiteCertificationName,
      "Data Knowledge Suite Certification",
    );
    assert.equal(
      DataKnowledgeSuiteCertificationNamespace,
      "nexora.dkl.data-knowledge-suite.certification",
    );
    assert.equal(DataKnowledgeSuiteCertificationStatus, "Certified");
    assert.equal(
      DataKnowledgeSuiteCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      DataKnowledgeSuiteCertificationPlatform.certificationOutcome,
      "Pass",
    );
    assert.equal(
      DataKnowledgeSuiteCertificationPlatform.nextPhase,
      "DKL-9:8 — Data Knowledge Suite Freeze",
    );
    assert.equal(
      DataKnowledgeSuiteCertificationPlatform.certificationResult.readyForFreeze,
      true,
    );
    assert.equal(
      DataKnowledgeSuiteCertificationPlatform.certificationResult
        .freezeReadinessGateReadiness,
      "ReadyForFreeze",
    );
  });

  it("consumes only Platform and preserves the full upstream chain by reference", () => {
    const cert = DataKnowledgeSuiteCertificationPlatform;
    assert.equal(
      cert.dependency.directPreviousPhaseModule,
      "dataKnowledgeSuitePlatform.ts",
    );
    assert.equal(cert.dependency.platformOnly, true);
    assert.equal(cert.dependency.manifestDirectImport, false);
    assert.equal(cert.dependency.validationDirectImport, false);
    assert.equal(cert.dependency.modelDirectImport, false);
    assert.equal(cert.dependency.registryDirectImport, false);
    assert.equal(cert.dependency.foundationDirectImport, false);
    assert.equal(cert.dependency.dkl1DirectImport, false);
    assert.equal(cert.dependency.dkl8DirectImport, false);
    assert.equal(cert.dependency.modifiesPlatform, false);
    assert.equal(cert.platform, platform);
    assert.equal(cert.manifest, platform.manifest);
    assert.equal(cert.validation, platform.validation);
    assert.equal(cert.model, platform.model);
    assert.equal(cert.registry, platform.registry);
    assert.equal(cert.foundation, platform.foundation);
    assert.equal(cert.ownership, platform.ownership);
    assert.equal(cert.boundaries, platform.boundaries);
    assert.equal(cert.capabilityCatalog, platform.capabilityCatalog);
    assert.equal(cert.platformGuarantees, platform.guarantees);
    assert.equal(cert.platformCompatibility, platform.compatibility);
    assert.equal(cert.validation, platform.manifest.upstreamValidation);
    assert.equal(cert.model, platform.validation.model);
    assert.equal(cert.registry, platform.model.registry);
    assert.equal(cert.foundation, platform.registry.foundation);
  });

  it("defines exactly 18 passing criteria and 13 passing gates", () => {
    const cert = DataKnowledgeSuiteCertificationPlatform;
    assert.equal(cert.criteria.length, 18);
    assert.equal(cert.gates.length, 13);
    assert.equal(cert.categories.length, 12);
    assert.equal(cert.outcomes.length, 4);
    assertUnique(
      cert.criteria.map((item) => item.id),
      "criterionId",
    );
    assertUnique(
      cert.criteria.map((item) => item.name),
      "criterionName",
    );
    assertUnique(
      cert.gates.map((item) => item.id),
      "gateId",
    );
    assertUnique(
      cert.gates.map((item) => item.name),
      "gateName",
    );
    assert.ok(cert.criteria.every((item) => item.outcome === "Pass"));
    assert.ok(cert.gates.every((item) => item.outcome === "Pass"));
    assert.ok(
      cert.criteria.every((item) =>
        cert.categories.some(
          (category) => category.category === item.category,
        ),
      ),
    );
    const freezeGate = cert.gates.find(
      (item) => item.name === "FreezeReadinessGate",
    );
    assert.equal(freezeGate?.outcome, "Pass");
    assert.equal(freezeGate?.readinessResult, "ReadyForFreeze");
    assert.equal(cert.report.result, "Pass");
    assert.equal(cert.report.status, "Certified");
    assert.equal(cert.report.readiness, "ReadyForFreeze");
    assert.equal(cert.report.passedCriteria, 18);
    assert.equal(cert.report.passedGates, 13);
    assert.equal(cert.report.failedCriteria, 0);
    assert.equal(cert.report.failedGates, 0);
  });

  it("certifies Platform public surface and Canonical Inventory Rule", () => {
    const cert = DataKnowledgeSuiteCertificationPlatform;
    assert.equal(platform.apiRegistry.length, 8);
    assert.deepEqual(
      platform.apiRegistry.map((item) => item.exportName),
      [...EXPECTED_PLATFORM_APIS],
    );
    assert.equal(cert.inventory.sourcedThroughPlatform, true);
    assert.equal(cert.inventory.reconstructed, false);
    assert.equal(cert.inventory.hardcoded, false);
    assert.equal(cert.inventory.duplicated, false);
    assert.equal(
      cert.inventory.capabilityCount,
      platform.inventory.capabilityCount,
    );
    assert.equal(
      cert.inventory.publicApiInventoryTotal,
      platform.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      cert.inventory.manifestTotalEntryCount,
      platform.inventory.manifestTotalEntryCount,
    );
    assert.equal(
      cert.inventory.validationRuleCount,
      platform.inventory.validationRuleCount,
    );
    assert.equal(
      cert.inventory.validationGateCount,
      platform.inventory.validationGateCount,
    );
    assert.equal(
      cert.inventory.platformApiCount,
      platform.counts.publicApiCount,
    );
    assert.equal(
      cert.inventory.platformGuaranteeCount,
      platform.guarantees.length,
    );
    assert.equal(
      cert.inventory.platformCompatibilityCount,
      platform.compatibility.length,
    );
    assert.equal(
      cert.inventory.platformTotalEntryCount,
      platform.inventory.totalEntryCount,
    );
    assert.equal(platform.inventory.sourcedThroughManifest, true);
    assert.equal(platform.inventory.capabilityCount, 8);
    assert.equal(platform.inventory.publicApiInventoryTotal, 568);
    assert.equal(platform.inventory.manifestTotalEntryCount, 134);
    assert.equal(platform.inventory.totalEntryCount, 182);
    assert.equal(platform.guarantees.length, 18);
    assert.equal(platform.compatibility.length, 12);
    assert.ok(platform.guarantees.every((item) => item.status === "Satisfied"));
    assert.ok(
      platform.compatibility.every(
        (item) => item.compatible === true && item.status === "Compatible",
      ),
    );
  });

  it("preserves Platform guarantees and compatibility by reference", () => {
    const cert = DataKnowledgeSuiteCertificationPlatform;
    assert.equal(cert.platformGuarantees, platform.guarantees);
    assert.equal(cert.platformCompatibility, platform.compatibility);
    assert.notEqual(cert.guarantees, platform.guarantees);
    assert.notEqual(cert.compatibility, platform.compatibility);
  });

  it("exposes immutable helpers and deterministic summary", () => {
    const cert = DataKnowledgeSuiteCertificationPlatform;
    assert.equal(Object.isFrozen(cert), true);
    assert.equal(Object.isFrozen(cert.criteria), true);
    assert.equal(Object.isFrozen(cert.gates), true);
    assert.equal(Object.isFrozen(cert.report), true);
    assert.equal(Object.isFrozen(cert.inventory), true);
    assert.equal(Object.isFrozen(cert.evidence), true);
    assert.equal(Object.isFrozen(cert.compatibility), true);
    assert.equal(Object.isFrozen(cert.guarantees), true);

    const byId = cert.helpers.getCertificationCriterionById(
      "DKL-9:7/Criterion/IdentityCertified",
    );
    assert.equal(byId?.name, "IdentityCertified");
    assert.equal(cert.helpers.getCertificationCriterionCount(), 18);
    assert.equal(cert.helpers.getCertificationGateCount(), 13);
    const freezeGate = cert.helpers.getCertificationGateById(
      "FreezeReadinessGate",
    );
    assert.equal(freezeGate?.readinessResult, "ReadyForFreeze");

    const summaryA = getDataKnowledgeSuiteCertificationSummary();
    const summaryB = getDataKnowledgeSuiteCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.id, DataKnowledgeSuiteCertificationId);
    assert.equal(summaryA.status, "Certified");
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.criterionCount, 18);
    assert.equal(summaryA.gateCount, 13);
    assert.equal(summaryA.passedCriterionCount, 18);
    assert.equal(summaryA.failedCriterionCount, 0);
    assert.equal(summaryA.capabilityCount, platform.inventory.capabilityCount);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      platform.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      summaryA.platformTotalEntryCount,
      platform.inventory.totalEntryCount,
    );
    assert.equal(summaryA.runtimeBehavior, "None");
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:8 — Data Knowledge Suite Freeze",
    );
  });

  it("prohibits runtime certification behaviour", () => {
    const cert = DataKnowledgeSuiteCertificationPlatform;
    assert.equal(cert.runtimeBehavior, false);
    assert.equal(cert.runtimeEnforcement, false);
    assert.equal(cert.modifiesPlatform, false);
    assert.equal(cert.rebuildsManifest, false);
    assert.equal(cert.revalidatesModel, false);
    assert.equal(cert.recomposesSuite, false);
    assert.equal(cert.enforcesPolicies, false);
    assert.equal(cert.persists, false);
    assert.equal(cert.retrieves, false);
    assert.equal(cert.metadataOnly, true);
    assert.equal(cert.immutable, true);
    assert.equal(cert.deterministic, true);
  });
});
