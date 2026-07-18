/**
 * DKL-7:7 — Knowledge Services Certification Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Certification.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as CertificationModule from "./knowledgeServicesCertification.ts";
import {
  getKnowledgeServicesCertificationInventoryCount,
  getKnowledgeServicesCertificationSummary,
  KnowledgeServicesCertification,
  KnowledgeServicesCertificationGates,
  KnowledgeServicesCertificationGuarantees,
  KnowledgeServicesCertificationId,
  KnowledgeServicesCertificationName,
  KnowledgeServicesCertificationNamespace,
  KnowledgeServicesCertificationReadiness,
  KnowledgeServicesCertificationResult,
  KnowledgeServicesCertificationStatus,
  KnowledgeServicesCertificationVersion,
} from "./knowledgeServicesCertification.ts";
import {
  getKnowledgeServicesPlatformInventoryCount,
  KnowledgeServicesPlatform,
  KnowledgeServicesPlatformId,
  KnowledgeServicesPlatformReadiness,
  KnowledgeServicesPlatformStatus,
} from "./knowledgeServicesPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL77_FILES = Object.freeze([
  "knowledgeServicesCertificationTypes.ts",
  "knowledgeServicesCertificationGates.ts",
  "knowledgeServicesCertificationEvidence.ts",
  "knowledgeServicesCertificationCompatibility.ts",
  "knowledgeServicesCertificationRegressions.ts",
  "knowledgeServicesCertificationGuarantees.ts",
  "knowledgeServicesCertification.ts",
  "knowledgeServicesCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesCertification",
  "KnowledgeServicesCertificationId",
  "KnowledgeServicesCertificationName",
  "KnowledgeServicesCertificationVersion",
  "KnowledgeServicesCertificationNamespace",
  "KnowledgeServicesCertificationStatus",
  "KnowledgeServicesCertificationResult",
  "KnowledgeServicesCertificationReadiness",
  "KnowledgeServicesCertificationGates",
  "KnowledgeServicesCertificationGuarantees",
  "getKnowledgeServicesCertificationSummary",
  "getKnowledgeServicesCertificationInventoryCount",
] as const);

const CANONICAL_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "platform",
  "architecture",
  "groups",
  "gates",
  "evidence",
  "results",
  "findings",
  "compatibility",
  "regressions",
  "ownership",
  "boundaries",
  "inventory",
  "guarantees",
  "status",
  "result",
  "readiness",
] as const);

const GATE_GROUPS = Object.freeze([
  "Identity",
  "DependencyChain",
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "OwnershipAndBoundaries",
  "CompatibilityAndConsumers",
  "RuntimeProhibitions",
  "FreezeReadiness",
] as const);

const GATE_DISTRIBUTION = Object.freeze({
  Identity: 2,
  DependencyChain: 2,
  FoundationIntegrity: 1,
  RegistryIntegrity: 2,
  ModelIntegrity: 2,
  ValidationIntegrity: 2,
  ManifestIntegrity: 1,
  PlatformIntegrity: 2,
  OwnershipAndBoundaries: 1,
  CompatibilityAndConsumers: 1,
  RuntimeProhibitions: 1,
  FreezeReadiness: 1,
} as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:7 Knowledge Services Certification", () => {
  it("creates exactly eight Certification files and twelve public exports", () => {
    assert.equal(DKL77_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL77_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 12);
    assert.equal(
      KnowledgeServicesCertification.publicApi.length,
      12,
    );
    assert.ok(
      !Object.keys(CertificationModule).some((name) =>
        /handler|executor|client|adapter|resolver|validateRuntime/i.test(name),
      ),
    );
  });

  it("has exact identity, status, result, architecture status, and ReadyForFreeze", () => {
    assert.equal(
      KnowledgeServicesCertificationId,
      "DKL-7:7/KnowledgeServicesCertification",
    );
    assert.equal(KnowledgeServicesCertificationName, "Knowledge Services Certification");
    assert.equal(KnowledgeServicesCertificationVersion, "1.0.0");
    assert.equal(
      KnowledgeServicesCertificationNamespace,
      "nexora.dkl.knowledge-services.certification",
    );
    assert.equal(KnowledgeServicesCertificationStatus, "Certified");
    assert.equal(KnowledgeServicesCertificationResult, "Pass");
    assert.equal(
      KnowledgeServicesCertification.architectureStatus,
      "CertifiedThroughPlatform",
    );
    assert.equal(KnowledgeServicesCertificationReadiness, "ReadyForFreeze");
    assert.equal(KnowledgeServicesCertification.identity.status, "Certified");
    assert.equal(
      KnowledgeServicesCertification.identity.certificationResult,
      "Pass",
    );
    assert.equal(
      KnowledgeServicesCertification.identity.readiness,
      "ReadyForFreeze",
    );
  });

  it("consumes Platform only and preserves the canonical chain by reference", () => {
    assert.equal(
      KnowledgeServicesCertification.platform,
      KnowledgeServicesPlatform,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations
        .directPreviousPhaseModule,
      "knowledgeServicesPlatform.ts",
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations.platformOnly,
      true,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations.manifestDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations
        .validationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations.modelDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations.registryDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations
        .foundationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesCertification.dependencyDeclarations.dkl6DirectImport,
      false,
    );

    const platform = KnowledgeServicesCertification.platform;
    const manifest = platform.manifest;
    const validation = manifest.validation;
    const model = validation.model;
    const registry = model.registry;
    const foundation = registry.foundation;

    assert.equal(platform.identity.platformId, KnowledgeServicesPlatformId);
    assert.equal(manifest, platform.manifest);
    assert.equal(validation, manifest.validation);
    assert.equal(model, validation.model);
    assert.equal(registry, model.registry);
    assert.equal(foundation, registry.foundation);
    assert.ok(platform.identity.dkl6PublicIndexId.length > 0);
    assert.equal(
      KnowledgeServicesCertification.identity.platformId,
      KnowledgeServicesPlatformId,
    );
    assert.equal(
      KnowledgeServicesCertification.identity.manifestId,
      platform.identity.manifestId,
    );
    assert.equal(
      KnowledgeServicesCertification.identity.validationId,
      platform.identity.validationId,
    );
    assert.equal(
      KnowledgeServicesCertification.identity.modelId,
      platform.identity.modelId,
    );
    assert.equal(
      KnowledgeServicesCertification.identity.registryId,
      platform.identity.registryId,
    );
    assert.equal(
      KnowledgeServicesCertification.identity.foundationId,
      platform.identity.foundationId,
    );
    assert.equal(
      KnowledgeServicesCertification.identity.dkl6PublicIndexId,
      platform.identity.dkl6PublicIndexId,
    );
  });

  it("preserves exact canonical section order with 18 sections", () => {
    const keys = Object.keys(KnowledgeServicesCertification);
    assert.deepEqual(keys.slice(0, 18), [...CANONICAL_SECTIONS]);
    assert.equal(CANONICAL_SECTIONS.length, 18);
  });

  it("declares twelve ordered gate groups and eighteen Pass gates", () => {
    assert.equal(KnowledgeServicesCertification.groups.length, 12);
    assert.deepEqual(
      KnowledgeServicesCertification.groups.map((group) => group.groupId),
      [...GATE_GROUPS],
    );
    assert.equal(KnowledgeServicesCertificationGates.length, 18);
    assertUnique(
      KnowledgeServicesCertificationGates.map((gate) => gate.gateId),
      "gate IDs",
    );

    for (const gate of KnowledgeServicesCertificationGates) {
      assert.ok(
        (GATE_GROUPS as readonly string[]).includes(gate.group),
        `invalid group ${gate.group}`,
      );
      assert.ok(
        ["Critical", "High", "Medium", "Low", "Informational"].includes(
          gate.severity,
        ),
      );
      assert.equal(gate.evidenceReferences.length >= 1, true);
      assert.equal(gate.result, "Pass");
      assert.equal(gate.runtimeBehavior, "None");
    }

    for (const [groupId, count] of Object.entries(GATE_DISTRIBUTION)) {
      assert.equal(
        KnowledgeServicesCertificationGates.filter(
          (gate) => gate.group === groupId,
        ).length,
        count,
        `${groupId} distribution`,
      );
    }
  });

  it("binds evidence and results one-to-one with zero findings", () => {
    assert.equal(KnowledgeServicesCertification.evidence.length, 18);
    assertUnique(
      KnowledgeServicesCertification.evidence.map((item) => item.evidenceId),
      "evidence IDs",
    );
    assert.equal(KnowledgeServicesCertification.results.length, 18);

    for (const gate of KnowledgeServicesCertificationGates) {
      const evidence = KnowledgeServicesCertification.evidence.find(
        (item) => item.gateReference === gate.gateId,
      );
      assert.ok(evidence, `missing evidence for ${gate.gateId}`);
      assert.ok(gate.evidenceReferences.includes(evidence.evidenceId));

      const results = KnowledgeServicesCertification.results.filter(
        (item) => item.gateId === gate.gateId,
      );
      assert.equal(results.length, 1, `result cardinality for ${gate.gateId}`);
      assert.equal(results[0]!.outcome, "Pass");
      assert.ok(results[0]!.evidenceReferences.length >= 1);
    }

    assert.equal(KnowledgeServicesCertification.resultInventory.passed, 18);
    assert.equal(KnowledgeServicesCertification.resultInventory.failed, 0);
    assert.equal(
      KnowledgeServicesCertification.resultInventory.notApplicable,
      0,
    );
    assert.equal(
      KnowledgeServicesCertification.resultInventory.overallResult,
      "Pass",
    );
    assert.equal(KnowledgeServicesCertification.findings.length, 0);
  });

  it("preserves Foundation through Platform inventories including 447 and 527", () => {
    const platform = KnowledgeServicesCertification.platform;
    const manifest = platform.manifest;

    assert.equal(platform.ownership.ownedCount, 6);
    assert.equal(platform.ownership.nonOwnedCount, 24);
    assert.equal(platform.boundaries.prohibitedSurfaceCount, 29);
    assert.equal(platform.inventory.lifecycleStageCount, 8);

    assert.equal(platform.services.length, 12);
    assert.equal(platform.capabilities.length, 12);
    assert.equal(platform.contracts.length, 11);
    assert.equal(platform.inventory.requestCategoryCount, 12);
    assert.equal(platform.inventory.responseCategoryCount, 12);
    assert.equal(platform.inventory.accessModeCount, 10);
    assert.equal(platform.inventory.mutationModeCount, 0);
    assert.equal(platform.inventory.serviceCapabilityRelationshipCount, 12);

    assert.equal(platform.model.totalInventoryCount, 79);
    assert.equal(platform.model.modelGuaranteeCount, 20);

    assert.equal(platform.validation.passCount, 48);
    assert.equal(platform.validation.failCount, 0);
    assert.equal(platform.validation.guaranteeCount, 16);
    assert.equal(platform.validation.overallResult, "Pass");

    assert.equal(manifest.inventory.totalEntryCount, 447);
    assert.equal(manifest.status, "ManifestComplete");

    assert.equal(getKnowledgeServicesPlatformInventoryCount(), 527);
    assert.equal(platform.inventory.totalEntryCount, 527);
    assert.equal(platform.status, KnowledgeServicesPlatformStatus);
    assert.equal(platform.readiness, KnowledgeServicesPlatformReadiness);
    assert.equal(platform.status, "PlatformComplete");
    assert.equal(platform.readiness, "ReadyForCertification");
  });

  it("declares sixteen Compatible declarations and twelve Pass regressions", () => {
    assert.equal(KnowledgeServicesCertification.compatibility.length, 16);
    assertUnique(
      KnowledgeServicesCertification.compatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    for (const item of KnowledgeServicesCertification.compatibility) {
      assert.equal(item.status, "Compatible");
      assert.equal(item.certificationResult, "Pass");
      assert.equal(item.runtimeAuthorization, "None");
    }

    assert.equal(KnowledgeServicesCertification.regressions.length, 12);
    assertUnique(
      KnowledgeServicesCertification.regressions.map(
        (item) => item.regressionId,
      ),
      "regression IDs",
    );
    for (const item of KnowledgeServicesCertification.regressions) {
      assert.equal(item.status, "Pass");
    }

    const manifestRegression = KnowledgeServicesCertification.regressions.find(
      (item) => item.subject.includes("Manifest inventory"),
    );
    const platformRegression = KnowledgeServicesCertification.regressions.find(
      (item) => item.subject.includes("Platform inventory"),
    );
    const mutationRegression = KnowledgeServicesCertification.regressions.find(
      (item) => item.subject.includes("Mutation-mode"),
    );
    const runtimeRegression = KnowledgeServicesCertification.regressions.find(
      (item) => item.subject.includes("Runtime-prohibition"),
    );
    assert.ok(manifestRegression?.baseline.includes("447"));
    assert.ok(platformRegression?.baseline.includes("527"));
    assert.ok(mutationRegression?.baseline.includes("0"));
    assert.equal(runtimeRegression?.baseline, "runtimeBehavior=absent");
  });

  it("declares twenty-two guarantees and is immutable without runtime behavior", () => {
    assert.equal(KnowledgeServicesCertificationGuarantees.length, 22);
    assertUnique(
      KnowledgeServicesCertificationGuarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );

    assert.equal(Object.isFrozen(KnowledgeServicesCertification), true);
    assert.equal(Object.isFrozen(KnowledgeServicesCertificationGates), true);
    assert.equal(Object.isFrozen(KnowledgeServicesCertification.evidence), true);
    assert.equal(Object.isFrozen(KnowledgeServicesCertification.results), true);
    assert.equal(
      Object.isFrozen(KnowledgeServicesCertification.compatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeServicesCertification.regressions),
      true,
    );

    assert.equal(KnowledgeServicesCertification.runtimeBehavior, false);
    assert.equal(KnowledgeServicesCertification.serviceExecution, false);
    assert.equal(KnowledgeServicesCertification.repositoryAccess, false);
    assert.equal(KnowledgeServicesCertification.searchExecution, false);
    assert.equal(KnowledgeServicesCertification.graphTraversal, false);
    assert.equal(KnowledgeServicesCertification.aiBehavior, false);
    assert.equal(KnowledgeServicesCertification.transportBehavior, false);
    assert.equal(KnowledgeServicesCertification.authenticationBehavior, false);
    assert.equal(KnowledgeServicesCertification.authorizationBehavior, false);
    assert.equal(KnowledgeServicesCertification.mutationBehavior, false);
    assert.equal(KnowledgeServicesCertification.freezeLocks, false);
    assert.equal(KnowledgeServicesCertification.readiness, "ReadyForFreeze");
  });

  it("returns deterministic summary and inventory count 137 from canonical fields", () => {
    const summaryA = getKnowledgeServicesCertificationSummary();
    const summaryB = getKnowledgeServicesCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);

    assert.equal(summaryA.certificationId, KnowledgeServicesCertificationId);
    assert.equal(summaryA.version, "1.0.0");
    assert.equal(summaryA.status, "Certified");
    assert.equal(summaryA.result, "Pass");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, KnowledgeServicesPlatformId);
    assert.equal(summaryA.platformInventoryCount, 527);
    assert.equal(summaryA.manifestInventoryCount, 447);
    assert.equal(summaryA.modelInventoryCount, 79);
    assert.equal(summaryA.validationPassCount, 48);
    assert.equal(summaryA.gateCount, 18);
    assert.equal(summaryA.passCount, 18);
    assert.equal(summaryA.failCount, 0);
    assert.equal(summaryA.certificationInventoryCount, 137);

    const expected =
      7 +
      2 +
      KnowledgeServicesCertification.groups.length +
      KnowledgeServicesCertification.gates.length +
      KnowledgeServicesCertification.evidence.length +
      KnowledgeServicesCertification.results.length +
      KnowledgeServicesCertification.compatibility.length +
      KnowledgeServicesCertification.regressions.length +
      KnowledgeServicesCertification.guarantees.length +
      KnowledgeServicesCertification.publicApi.length;
    assert.equal(expected, 137);
    assert.equal(getKnowledgeServicesCertificationInventoryCount(), expected);
    assert.equal(
      KnowledgeServicesCertification.inventory.countingRule,
      "7+2+12+18+18+18+16+12+22+12",
    );
  });
});
