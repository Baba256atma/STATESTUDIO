/**
 * DKL-8:7 — Knowledge Governance Certification Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Certification.
 * Inventory assertions compare against Platform-derived references.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";
import * as CertificationModule from "./knowledgeGovernanceCertification.ts";
import {
  getKnowledgeGovernanceCertificationSummary,
  KnowledgeGovernanceCertificationId,
  KnowledgeGovernanceCertificationName,
  KnowledgeGovernanceCertificationNamespace,
  KnowledgeGovernanceCertificationPlatform,
  KnowledgeGovernanceCertificationReadiness,
  KnowledgeGovernanceCertificationStatus,
  KnowledgeGovernanceCertificationVersion,
} from "./knowledgeGovernanceCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL87_FILES = Object.freeze([
  "knowledgeGovernanceCertificationTypes.ts",
  "knowledgeGovernanceCertificationCriteria.ts",
  "knowledgeGovernanceCertificationGates.ts",
  "knowledgeGovernanceCertificationEvidence.ts",
  "knowledgeGovernanceCertificationCompatibility.ts",
  "knowledgeGovernanceCertificationReport.ts",
  "knowledgeGovernanceCertification.ts",
  "knowledgeGovernanceCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceCertificationId",
  "KnowledgeGovernanceCertificationVersion",
  "KnowledgeGovernanceCertificationName",
  "KnowledgeGovernanceCertificationNamespace",
  "KnowledgeGovernanceCertificationStatus",
  "KnowledgeGovernanceCertificationReadiness",
  "KnowledgeGovernanceCertificationPlatform",
  "getKnowledgeGovernanceCertificationSummary",
] as const);

const EXPECTED_PLATFORM_APIS = Object.freeze([
  "KnowledgeGovernancePlatformId",
  "KnowledgeGovernancePlatformVersion",
  "KnowledgeGovernancePlatformName",
  "KnowledgeGovernancePlatformNamespace",
  "KnowledgeGovernancePlatformStatus",
  "KnowledgeGovernancePlatformReadiness",
  "KnowledgeGovernancePlatform",
  "getKnowledgeGovernancePlatformSummary",
] as const);

const platform = KnowledgeGovernancePlatform;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:7 Knowledge Governance Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(DKL87_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL87_FILES) {
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
      KnowledgeGovernanceCertificationId,
      "DKL-8:7/KnowledgeGovernanceCertification",
    );
    assert.equal(KnowledgeGovernanceCertificationVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernanceCertificationName,
      "Knowledge Governance Certification",
    );
    assert.equal(
      KnowledgeGovernanceCertificationNamespace,
      "nexora.dkl.knowledge-governance.certification",
    );
    assert.equal(KnowledgeGovernanceCertificationStatus, "Certified");
    assert.equal(
      KnowledgeGovernanceCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      KnowledgeGovernanceCertificationPlatform.certificationOutcome,
      "Pass",
    );
    assert.equal(
      KnowledgeGovernanceCertificationPlatform.nextPhase,
      "DKL-8:8 — Knowledge Governance Freeze",
    );
    assert.equal(
      KnowledgeGovernanceCertificationPlatform.certificationResult.readyForFreeze,
      true,
    );
  });

  it("consumes only Platform and preserves the full upstream chain by reference", () => {
    const cert = KnowledgeGovernanceCertificationPlatform;
    assert.equal(
      cert.dependency.directPreviousPhaseModule,
      "knowledgeGovernancePlatform.ts",
    );
    assert.equal(cert.dependency.platformOnly, true);
    assert.equal(cert.dependency.manifestDirectImport, false);
    assert.equal(cert.dependency.validationDirectImport, false);
    assert.equal(cert.dependency.modelDirectImport, false);
    assert.equal(cert.dependency.registryDirectImport, false);
    assert.equal(cert.dependency.foundationDirectImport, false);
    assert.equal(cert.dependency.dkl7DirectImport, false);
    assert.equal(cert.dependency.modifiesPlatform, false);
    assert.equal(cert.platform, platform);
    assert.equal(cert.manifest, platform.manifest);
    assert.equal(cert.validation, platform.validation);
    assert.equal(cert.model, platform.model);
    assert.equal(cert.registry, platform.registry);
    assert.equal(cert.foundation, platform.foundation);
    assert.equal(cert.ownership, platform.ownership);
    assert.equal(cert.boundaries, platform.boundaries);
    assert.equal(cert.platformGuarantees, platform.guarantees);
    assert.equal(cert.platformCompatibility, platform.compatibility);
  });

  it("defines exactly 18 passing criteria and 13 passing gates", () => {
    const cert = KnowledgeGovernanceCertificationPlatform;
    assert.equal(cert.criteria.length, 18);
    assert.equal(cert.gates.length, 13);
    assert.equal(cert.categories.length, 13);
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
    assert.equal(cert.report.outcome, "Pass");
    assert.equal(cert.report.failedCriterionCount, 0);
    assert.equal(cert.report.failedGateCount, 0);
  });

  it("certifies Platform public surface and Canonical Inventory Rule", () => {
    const cert = KnowledgeGovernanceCertificationPlatform;
    assert.equal(platform.apiRegistry.length, 8);
    assert.deepEqual(
      platform.apiRegistry.map((item) => item.exportName),
      [...EXPECTED_PLATFORM_APIS],
    );
    assert.equal(
      cert.inventory.manifestTotalEntryCount,
      platform.inventory.manifestTotalEntryCount,
    );
    assert.equal(
      cert.inventory.registryEntryCount,
      platform.inventory.registryEntryCount,
    );
    assert.equal(
      cert.inventory.modelKindCount,
      platform.inventory.modelKindCount,
    );
    assert.equal(
      cert.inventory.relationshipKindCount,
      platform.inventory.relationshipKindCount,
    );
    assert.equal(
      cert.inventory.validationRuleCount,
      platform.inventory.validationRuleCount,
    );
    assert.equal(
      cert.inventory.validationCategoryCount,
      platform.inventory.validationCategoryCount,
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
    assert.equal(cert.inventory.sourcedThroughPlatform, true);
    assert.equal(
      platform.inventory.registryEntryCount,
      platform.registry.totalEntryCount,
    );
    assert.equal(
      platform.inventory.modelKindCount,
      platform.model.modelKinds.length,
    );
    assert.equal(
      platform.inventory.validationRuleCount,
      platform.validation.rules.length,
    );
  });

  it("exposes immutable helpers and deterministic summary", () => {
    const helpers = KnowledgeGovernanceCertificationPlatform.helpers;
    assert.equal(helpers.getCertificationCriterionCount(), 18);
    assert.equal(helpers.getCertificationGateCount(), 13);
    assert.equal(
      helpers.getCertificationCriterionById("IdentityCertified")?.name,
      "IdentityCertified",
    );
    assert.equal(
      helpers.getCertificationCriterionById("unknown-criterion"),
      undefined,
    );
    assert.equal(
      helpers.getCertificationGateById("FreezeReadinessGate")?.name,
      "FreezeReadinessGate",
    );
    assert.equal(helpers.getCertificationGateById("unknown-gate"), undefined);
    const identityCriteria =
      helpers.getCertificationCriteriaByCategory("Identity");
    const identityCriteriaAgain =
      helpers.getCertificationCriteriaByCategory("Identity");
    assert.deepEqual(identityCriteria, identityCriteriaAgain);
    assert.equal(Object.isFrozen(identityCriteria), true);
    assert.ok(identityCriteria.length >= 1);

    assert.equal(
      Object.isFrozen(KnowledgeGovernanceCertificationPlatform),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceCertificationPlatform.criteria),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceCertificationPlatform.gates),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceCertificationPlatform.report),
      true,
    );

    const summary = getKnowledgeGovernanceCertificationSummary();
    const summaryAgain = getKnowledgeGovernanceCertificationSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, KnowledgeGovernanceCertificationId);
    assert.equal(summary.status, "Certified");
    assert.equal(summary.certificationOutcome, "Pass");
    assert.equal(summary.readiness, "ReadyForFreeze");
    assert.equal(summary.upstreamDependency, platform.identity.platformId);
    assert.equal(summary.criterionCount, 18);
    assert.equal(summary.gateCount, 13);
    assert.equal(summary.failedCriterionCount, 0);
    assert.equal(
      summary.registryEntryCount,
      platform.inventory.registryEntryCount,
    );
    assert.equal(summary.modelKindCount, platform.inventory.modelKindCount);
    assert.equal(
      summary.validationRuleCount,
      platform.inventory.validationRuleCount,
    );
    assert.equal(
      summary.platformTotalEntryCount,
      platform.inventory.totalEntryCount,
    );
    assert.equal(Object.isFrozen(summary), true);
  });

  it("publishes an additive immutable eight-entry apiRegistry", () => {
    const cert = KnowledgeGovernanceCertificationPlatform;
    assert.equal(cert.apiRegistry.length, 8);
    assert.equal(Object.isFrozen(cert.apiRegistry), true);
    assert.deepEqual(
      cert.apiRegistry.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(new Set(cert.apiRegistry.map((item) => item.id)).size, 8);
    assert.equal(cert.sectionCount, cert.sectionOrder.length);
    assert.equal(
      cert.foundation.apiRegistry,
      platform.foundation.apiRegistry,
    );
    assert.equal(cert.registry.apiRegistry, platform.registry.apiRegistry);
    assert.equal(cert.model.apiRegistry, platform.model.apiRegistry);
    assert.equal(
      cert.validation.apiRegistry,
      platform.validation.apiRegistry,
    );
  });

  it("has no runtime enforcement, persistence, or cross-layer behavior", () => {
    const cert = KnowledgeGovernanceCertificationPlatform;
    assert.equal(cert.runtimeBehavior, false);
    assert.equal(cert.runtimeEnforcement, false);
    assert.equal(cert.policyExecution, false);
    assert.equal(cert.authenticationBehavior, false);
    assert.equal(cert.authorizationBehavior, false);
    assert.equal(cert.repositoryAccess, false);
    assert.equal(cert.persists, false);
    assert.equal(cert.retrieves, false);
    assert.equal(cert.modifiesPlatform, false);
    assert.equal(cert.enforcesGovernance, false);
    assert.equal(cert.legalEvaluation, false);
    assert.equal(cert.auditLogging, false);
    assert.equal(cert.uiBehavior, false);
    assert.equal(cert.engineReasoning, false);
    assert.equal(cert.advisorBehavior, false);
    assert.equal(cert.directorBehavior, false);
    assert.equal(cert.sceneBehavior, false);
    assert.equal(cert.aiBehavior, false);
    assert.equal(cert.transportBehavior, false);
    assert.ok(cert.compatibility.every((item) => item.compatible === true));
    assert.ok(cert.guarantees.every((item) => item.status === true));
    assert.ok(
      cert.platformCompatibility.every((item) => item.compatible === true),
    );
    assert.ok(cert.platformGuarantees.every((item) => item.status === true));
  });
});
