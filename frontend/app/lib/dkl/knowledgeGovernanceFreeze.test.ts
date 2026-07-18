/**
 * DKL-8:8 — Knowledge Governance Freeze Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Freeze.
 * Inventory assertions compare against Certification-derived references.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernanceCertificationPlatform } from "./knowledgeGovernanceCertification.ts";
import * as FreezeModule from "./knowledgeGovernanceFreeze.ts";
import {
  getKnowledgeGovernanceFreezeSummary,
  KnowledgeGovernanceFreezeId,
  KnowledgeGovernanceFreezeName,
  KnowledgeGovernanceFreezeNamespace,
  KnowledgeGovernanceFreezePlatform,
  KnowledgeGovernanceFreezeReadiness,
  KnowledgeGovernanceFreezeStatus,
  KnowledgeGovernanceFreezeVersion,
} from "./knowledgeGovernanceFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL88_FILES = Object.freeze([
  "knowledgeGovernanceFreezeTypes.ts",
  "knowledgeGovernanceFreezeRegistry.ts",
  "knowledgeGovernanceFreezeBaselines.ts",
  "knowledgeGovernanceFreezeCompatibility.ts",
  "knowledgeGovernanceFreezeLocks.ts",
  "knowledgeGovernanceFreezeExtensions.ts",
  "knowledgeGovernanceFreeze.ts",
  "knowledgeGovernanceFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceFreezeId",
  "KnowledgeGovernanceFreezeVersion",
  "KnowledgeGovernanceFreezeName",
  "KnowledgeGovernanceFreezeNamespace",
  "KnowledgeGovernanceFreezeStatus",
  "KnowledgeGovernanceFreezeReadiness",
  "KnowledgeGovernanceFreezePlatform",
  "getKnowledgeGovernanceFreezeSummary",
] as const);

const EXPECTED_CERTIFICATION_EXPORTS = Object.freeze([
  "KnowledgeGovernanceCertificationId",
  "KnowledgeGovernanceCertificationVersion",
  "KnowledgeGovernanceCertificationName",
  "KnowledgeGovernanceCertificationNamespace",
  "KnowledgeGovernanceCertificationStatus",
  "KnowledgeGovernanceCertificationReadiness",
  "KnowledgeGovernanceCertificationPlatform",
  "getKnowledgeGovernanceCertificationSummary",
] as const);

const certification = KnowledgeGovernanceCertificationPlatform;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:8 Knowledge Governance Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(DKL88_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL88_FILES) {
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
      KnowledgeGovernanceFreezeId,
      "DKL-8:8/KnowledgeGovernanceFreeze",
    );
    assert.equal(KnowledgeGovernanceFreezeVersion, "1.0.0");
    assert.equal(KnowledgeGovernanceFreezeName, "Knowledge Governance Freeze");
    assert.equal(
      KnowledgeGovernanceFreezeNamespace,
      "nexora.dkl.knowledge-governance.freeze",
    );
    assert.equal(KnowledgeGovernanceFreezeStatus, "Frozen");
    assert.equal(
      KnowledgeGovernanceFreezeReadiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      KnowledgeGovernanceFreezePlatform.lock.id,
      "DKL-8-KNOWLEDGE-GOVERNANCE-LOCKED",
    );
    assert.equal(KnowledgeGovernanceFreezePlatform.lock.locked, true);
    assert.equal(
      KnowledgeGovernanceFreezePlatform.lock.certificationResult,
      "Pass",
    );
    assert.equal(
      KnowledgeGovernanceFreezePlatform.nextPhase,
      "DKL-8:9 — Knowledge Governance Public Index",
    );
    assert.equal(
      KnowledgeGovernanceFreezePlatform.freezeResult.readyForPublicIndex,
      true,
    );
  });

  it("consumes only Certification and preserves the full upstream chain by reference", () => {
    const freeze = KnowledgeGovernanceFreezePlatform;
    assert.equal(
      freeze.dependency.directPreviousPhaseModule,
      "knowledgeGovernanceCertification.ts",
    );
    assert.equal(freeze.dependency.certificationOnly, true);
    assert.equal(freeze.dependency.platformDirectImport, false);
    assert.equal(freeze.dependency.manifestDirectImport, false);
    assert.equal(freeze.dependency.validationDirectImport, false);
    assert.equal(freeze.dependency.modelDirectImport, false);
    assert.equal(freeze.dependency.registryDirectImport, false);
    assert.equal(freeze.dependency.foundationDirectImport, false);
    assert.equal(freeze.dependency.dkl7DirectImport, false);
    assert.equal(freeze.dependency.modifiesCertification, false);
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
    assert.equal(freeze.platformGuarantees, certification.platformGuarantees);
    assert.equal(
      freeze.platformCompatibility,
      certification.platformCompatibility,
    );
    assert.equal(freeze.certificationCriteria, certification.criteria);
    assert.equal(freeze.certificationGates, certification.gates);
  });

  it("freezes seven components, fifteen baselines, twelve compatibility, eight extension locks", () => {
    const freeze = KnowledgeGovernanceFreezePlatform;
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
    assert.ok(freeze.baselines.every((item) => item.frozen && item.satisfied));
    assert.ok(
      freeze.compatibility.every(
        (item) => item.compatible && item.frozen && item.protected,
      ),
    );
    assert.ok(
      freeze.extensionLocks.some((item) => item.name === "AdditiveExtensionsOnly"),
    );
    assert.ok(
      freeze.extensionLocks.some(
        (item) => item.name === "MajorVersionForBreakingChange",
      ),
    );
    assert.ok(freeze.guarantees.every((item) => item.status === true));
  });

  it("protects Certification and Freeze eight-export surfaces and Canonical Inventory Rule", () => {
    const freeze = KnowledgeGovernanceFreezePlatform;
    assert.deepEqual(
      [...freeze.protectedCertificationExports],
      [...EXPECTED_CERTIFICATION_EXPORTS],
    );
    assert.deepEqual(
      [...freeze.protectedFreezeExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(freeze.apiRegistry.length, 8);
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.registryEntryCount,
      certification.inventory.registryEntryCount,
    );
    assert.equal(
      freeze.inventory.upstreamCertificationInventory.modelKindCount,
      certification.inventory.modelKindCount,
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
    assert.equal(freeze.inventory.sourcedThroughCertification, true);
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
    const helpers = KnowledgeGovernanceFreezePlatform.helpers;
    assert.equal(
      helpers.getFrozenComponentById("KnowledgeGovernancePlatform")?.name,
      "Knowledge Governance Platform",
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
      helpers.getKnowledgeGovernanceFreezeEntryCount(),
      KnowledgeGovernanceFreezePlatform.inventory.totalEntryCount,
    );

    assert.equal(Object.isFrozen(KnowledgeGovernanceFreezePlatform), true);
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFreezePlatform.components),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFreezePlatform.baselines),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFreezePlatform.lock),
      true,
    );

    const summary = getKnowledgeGovernanceFreezeSummary();
    const summaryAgain = getKnowledgeGovernanceFreezeSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, KnowledgeGovernanceFreezeId);
    assert.equal(summary.status, "Frozen");
    assert.equal(summary.freezeLock, "DKL-8-KNOWLEDGE-GOVERNANCE-LOCKED");
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
      summary.registryEntryCount,
      certification.inventory.registryEntryCount,
    );
    assert.equal(
      summary.modelKindCount,
      certification.inventory.modelKindCount,
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
      KnowledgeGovernanceFreezePlatform.inventory.totalEntryCount,
    );
    assert.equal(Object.isFrozen(summary), true);
  });

  it("locks runtime prohibitions and has no enforcement or cross-layer behaviour", () => {
    const freeze = KnowledgeGovernanceFreezePlatform;
    const prohibitions = freeze.runtimeProhibitions;
    assert.equal(prohibitions.locked, true);
    assert.equal(prohibitions.authentication, false);
    assert.equal(prohibitions.authorization, false);
    assert.equal(prohibitions.policyEnforcement, false);
    assert.equal(prohibitions.policyExecution, false);
    assert.equal(prohibitions.repositoryReads, false);
    assert.equal(prohibitions.repositoryWrites, false);
    assert.equal(prohibitions.knowledgeRetrieval, false);
    assert.equal(prohibitions.lifecycleExecution, false);
    assert.equal(prohibitions.engineReasoning, false);
    assert.equal(prohibitions.advisorResponses, false);
    assert.equal(prohibitions.directorComposition, false);
    assert.equal(prohibitions.sceneRendering, false);
    assert.equal(prohibitions.uiBehaviour, false);
    assert.equal(prohibitions.aiInference, false);
    assert.equal(freeze.runtimeBehavior, false);
    assert.equal(freeze.runtimeEnforcement, false);
    assert.equal(freeze.persists, false);
    assert.equal(freeze.retrieves, false);
    assert.equal(freeze.reconstructs, false);
    assert.equal(freeze.enforcesGovernance, false);
    assert.equal(freeze.uiBehavior, false);
    assert.equal(freeze.engineReasoning, false);
    assert.equal(freeze.advisorBehavior, false);
    assert.equal(freeze.directorBehavior, false);
    assert.equal(freeze.sceneBehavior, false);
    assert.equal(freeze.transportBehavior, false);
  });
});
