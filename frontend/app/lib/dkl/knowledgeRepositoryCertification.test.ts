/**
 * DKL-6:7 — Knowledge Repository Certification Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Certification.
 * No mocks. No randomness. No network. No filesystem IO. No source scanning.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as CertificationModule from "./knowledgeRepositoryCertification.ts";
import {
  getKnowledgeRepositoryCertificationPublicApiCount,
  getKnowledgeRepositoryCertificationSummary,
  KnowledgeRepositoryCertification,
  KnowledgeRepositoryCertificationId,
  KnowledgeRepositoryCertificationName,
  KnowledgeRepositoryCertificationNamespace,
  KnowledgeRepositoryCertificationStatus,
  KnowledgeRepositoryCertificationVersion,
} from "./knowledgeRepositoryCertification.ts";
import {
  getKnowledgeRepositoryPlatformPublicApiCount,
  KnowledgeRepositoryPlatform,
  KnowledgeRepositoryPlatformId,
} from "./knowledgeRepositoryPlatform.ts";
import { getKnowledgeRepositoryModelCount } from "./knowledgeRepositoryModel.ts";
import { getKnowledgeRepositoryRegistryEntryCount } from "./knowledgeRepositoryRegistry.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryCertification",
  "KnowledgeRepositoryCertificationId",
  "KnowledgeRepositoryCertificationVersion",
  "KnowledgeRepositoryCertificationName",
  "KnowledgeRepositoryCertificationNamespace",
  "KnowledgeRepositoryCertificationStatus",
  "getKnowledgeRepositoryCertificationSummary",
  "getKnowledgeRepositoryCertificationPublicApiCount",
] as const);

const SCOPE_ORDER = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
] as const);

const CRITICAL_CRITERIA = Object.freeze([
  "CanonicalPlatformIdentityCriterion",
  "PlatformCompletenessCriterion",
  "BoundaryIntegrityCriterion",
  "DependencyIntegrityCriterion",
  "ImmutabilityCriterion",
  "RuntimeProhibitionCriterion",
  "FreezeReadinessCriterion",
] as const);

const PHYSICAL_STORAGE_TOKENS = Object.freeze([
  "elasticsearch",
  "postgresql",
  "neo4j",
  "mongodb",
  "dynamodb",
] as const);

describe("DKL-6:7 Knowledge Repository Certification", () => {
  it("exposes exactly eight public exports", () => {
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical certification identity", () => {
    assert.equal(
      KnowledgeRepositoryCertificationId,
      "DKL-6:7/KnowledgeRepositoryCertification",
    );
    assert.equal(
      KnowledgeRepositoryCertification.identity.certificationId,
      KnowledgeRepositoryCertificationId,
    );
    assert.equal(KnowledgeRepositoryCertification.identity.phase, "DKL-6:7");
    assert.equal(KnowledgeRepositoryCertification.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryCertificationVersion, "1.0.0");
    assert.equal(
      KnowledgeRepositoryCertification.identity.certificationVersion,
      "1.0.0",
    );
  });

  it("has correct name", () => {
    assert.equal(
      KnowledgeRepositoryCertificationName,
      "Knowledge Repository Certification",
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryCertificationNamespace,
      "nexora.dkl.repository.certification",
    );
  });

  it("has Certified status", () => {
    assert.equal(KnowledgeRepositoryCertificationStatus, "Certified");
    assert.equal(KnowledgeRepositoryCertification.identity.status, "Certified");
    assert.equal(KnowledgeRepositoryCertification.result.status, "Certified");
  });

  it("has readiness ReadyForDKL6Freeze", () => {
    assert.equal(
      KnowledgeRepositoryCertification.readiness,
      "ReadyForDKL6Freeze",
    );
    assert.equal(
      KnowledgeRepositoryCertification.result.readiness,
      "ReadyForDKL6Freeze",
    );
  });

  it("declares exactly seven ordered scope entries", () => {
    assert.equal(KnowledgeRepositoryCertification.scope.length, 7);
    assert.deepEqual(
      KnowledgeRepositoryCertification.scope.map((item) => item.name),
      [...SCOPE_ORDER],
    );
    assert.deepEqual(
      KnowledgeRepositoryCertification.scope.map((item) => item.order),
      [1, 2, 3, 4, 5, 6, 7],
    );
  });

  it("includes stable DKL-6 scope entries with runtime None", () => {
    for (const entry of KnowledgeRepositoryCertification.scope) {
      assert.equal(entry.included, true);
      assert.equal(entry.stable, true);
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("preserves canonical Platform reference and acceptance", () => {
    assert.equal(
      KnowledgeRepositoryCertification.platform,
      KnowledgeRepositoryPlatform,
    );
    assert.equal(
      KnowledgeRepositoryCertification.platform.identity.platformId,
      KnowledgeRepositoryPlatformId,
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.platformStatus,
      "PlatformComplete",
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.platformCompleteness,
      "Complete",
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.platformReadiness,
      "ReadyForDKL6Certification",
    );
  });

  it("declares exactly eighteen unique passing criteria with 7 Critical and 11 Required", () => {
    assert.equal(KnowledgeRepositoryCertification.criteria.length, 18);
    const ids = KnowledgeRepositoryCertification.criteria.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const criterion of KnowledgeRepositoryCertification.criteria) {
      assert.equal(criterion.status, "Pass");
      assert.equal(criterion.owner, "DKL-6");
      assert.equal(criterion.runtimeBehavior, "None");
    }
    const critical = KnowledgeRepositoryCertification.criteria.filter(
      (item) => item.severity === "Critical",
    );
    const required = KnowledgeRepositoryCertification.criteria.filter(
      (item) => item.severity === "Required",
    );
    assert.equal(critical.length, 7);
    assert.equal(required.length, 11);
    assert.deepEqual(
      critical.map((item) => item.name).sort(),
      [...CRITICAL_CRITERIA].sort(),
    );
  });

  it("declares exactly sixteen accepted evidence entries", () => {
    assert.equal(KnowledgeRepositoryCertification.evidence.length, 16);
    for (const entry of KnowledgeRepositoryCertification.evidence) {
      assert.equal(entry.accepted, true);
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("declares exactly fourteen CertifiedCompatible declarations", () => {
    assert.equal(KnowledgeRepositoryCertification.compatibility.length, 14);
    for (const entry of KnowledgeRepositoryCertification.compatibility) {
      assert.equal(entry.status, "CertifiedCompatible");
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("declares exactly twelve Protected regression protections", () => {
    assert.equal(
      KnowledgeRepositoryCertification.regressionProtection.length,
      12,
    );
    for (const entry of KnowledgeRepositoryCertification.regressionProtection) {
      assert.equal(entry.status, "Protected");
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("declares exactly eighteen CertifiedPreserved boundaries", () => {
    assert.equal(KnowledgeRepositoryCertification.boundaries.length, 18);
    for (const boundary of KnowledgeRepositoryCertification.boundaries) {
      assert.equal(boundary.status, "CertifiedPreserved");
      assert.equal(boundary.owner, "DKL-6");
      assert.equal(boundary.enforcementType, "Architectural");
      assert.equal(boundary.runtimeBehavior, "None");
    }
  });

  it("declares exactly twenty Guaranteed guarantees", () => {
    assert.equal(KnowledgeRepositoryCertification.guarantees.length, 20);
    for (const guarantee of KnowledgeRepositoryCertification.guarantees) {
      assert.equal(guarantee.status, "Guaranteed");
      assert.equal(guarantee.owner, "DKL-6");
      assert.equal(guarantee.runtimeBehavior, "None");
    }
  });

  it("declares exactly fifteen unique passing certification gates", () => {
    assert.equal(KnowledgeRepositoryCertification.gates.length, 15);
    const ids = KnowledgeRepositoryCertification.gates.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const gate of KnowledgeRepositoryCertification.gates) {
      assert.equal(gate.status, "Pass");
      assert.equal(gate.owner, "DKL-6");
      assert.equal(gate.runtimeBehavior, "None");
      assert.equal(gate.failedCriterionCount, 0);
    }
    assert.equal(KnowledgeRepositoryCertification.result.failedGates, 0);
  });

  it("preserves canonical Foundation, Registry, Model, Validation, Manifest, and Platform counts", () => {
    const inventory = KnowledgeRepositoryCertification.acceptances.inventory;
    assert.equal(inventory.foundationCapabilities, 9);
    assert.equal(inventory.foundationContracts, 8);
    assert.equal(inventory.foundationLifecycleStates, 7);
    assert.equal(inventory.foundationPolicies, 6);
    assert.equal(getKnowledgeRepositoryRegistryEntryCount(), 103);
    assert.equal(inventory.registryEntries, 103);
    assert.equal(inventory.registryGroups, 16);
    assert.equal(getKnowledgeRepositoryModelCount(), 52);
    assert.equal(inventory.models, 52);
    assert.equal(inventory.relationships, 13);
    assert.equal(inventory.registryTraceabilityGroups, 14);
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.validation.rules,
      40,
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.validation.passedRules,
      40,
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.validation.gates,
      10,
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.validation.passedGates,
      10,
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.manifest.manifestCompleteness,
      "Complete",
    );
    assert.equal(
      KnowledgeRepositoryCertification.acceptances.manifest
        .manifestBlockingIssueCount,
      0,
    );
    assert.equal(KnowledgeRepositoryPlatform.readinessGates.length, 14);
    assert.ok(
      KnowledgeRepositoryPlatform.readinessGates.every(
        (gate) => gate.status === "Pass",
      ),
    );
    assert.equal(getKnowledgeRepositoryPlatformPublicApiCount(), 46);
  });

  it("declares phase public API counts 6,8,8,8,8,8,8 totaling 54", () => {
    assert.deepEqual(
      KnowledgeRepositoryCertification.publicApis.map(
        (item) => item.publicApiCount,
      ),
      [6, 8, 8, 8, 8, 8, 8],
    );
    assert.equal(getKnowledgeRepositoryCertificationPublicApiCount(), 54);
  });

  it("declares Certified result with 18/18 criteria and zero blocking issues", () => {
    assert.equal(KnowledgeRepositoryCertification.result.totalCriteria, 18);
    assert.equal(KnowledgeRepositoryCertification.result.passedCriteria, 18);
    assert.equal(KnowledgeRepositoryCertification.result.failedCriteria, 0);
    assert.equal(KnowledgeRepositoryCertification.result.totalGates, 15);
    assert.equal(KnowledgeRepositoryCertification.result.passedGates, 15);
    assert.equal(KnowledgeRepositoryCertification.result.failedGates, 0);
    assert.equal(KnowledgeRepositoryCertification.result.blockingIssueCount, 0);
  });

  it("returns deterministic summary and public API count", () => {
    assert.equal(getKnowledgeRepositoryCertificationPublicApiCount(), 54);
    assert.equal(getKnowledgeRepositoryCertificationPublicApiCount(), 54);
    const summary = getKnowledgeRepositoryCertificationSummary();
    assert.deepEqual(summary, getKnowledgeRepositoryCertificationSummary());
    assert.equal(summary.certificationId, KnowledgeRepositoryCertificationId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.name, KnowledgeRepositoryCertificationName);
    assert.equal(summary.namespace, KnowledgeRepositoryCertificationNamespace);
    assert.equal(summary.status, "Certified");
    assert.equal(summary.platformIdentity, KnowledgeRepositoryPlatformId);
    assert.equal(summary.platformStatus, "PlatformComplete");
    assert.equal(summary.scopeCount, 7);
    assert.equal(summary.criteriaCount, 18);
    assert.equal(summary.passedCriteriaCount, 18);
    assert.equal(summary.failedCriteriaCount, 0);
    assert.equal(summary.criticalCriteriaCount, 7);
    assert.equal(summary.requiredCriteriaCount, 11);
    assert.equal(summary.evidenceCount, 16);
    assert.equal(summary.compatibilityCertificationCount, 14);
    assert.equal(summary.regressionProtectionCount, 12);
    assert.equal(summary.boundaryCertificationCount, 18);
    assert.equal(summary.guaranteeCount, 20);
    assert.equal(summary.certificationGateCount, 15);
    assert.equal(summary.passedGateCount, 15);
    assert.equal(summary.failedGateCount, 0);
    assert.equal(summary.publicApiCount, 54);
    assert.equal(summary.blockingIssueCount, 0);
    assert.equal(summary.platformCompleteness, "Complete");
    assert.equal(summary.certificationResult, "Certified");
    assert.equal(summary.readiness, "ReadyForDKL6Freeze");
    assert.equal(Object.isFrozen(summary), true);
  });

  it("freezes Certification and preserves frozen Platform", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification.identity), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification.scope), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification.criteria), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification.evidence), true);
    assert.equal(
      Object.isFrozen(KnowledgeRepositoryCertification.compatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeRepositoryCertification.regressionProtection),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeRepositoryCertification.boundaries),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeRepositoryCertification.guarantees),
      true,
    );
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification.gates), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryCertification.result), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform), true);
    for (const criterion of KnowledgeRepositoryCertification.criteria) {
      assert.equal(Object.isFrozen(criterion), true);
    }
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryCertification.identity.status = "Mutated";
    });
  });

  it("introduces no physical storage technology", () => {
    const haystack = [
      ...KnowledgeRepositoryCertification.boundaries.map(
        (item) => item.description,
      ),
      ...KnowledgeRepositoryCertification.guarantees.map(
        (item) => item.description,
      ),
      ...KnowledgeRepositoryCertification.criteria.map(
        (item) => item.description,
      ),
    ]
      .join(" ")
      .toLowerCase();
    for (const token of PHYSICAL_STORAGE_TOKENS) {
      assert.equal(haystack.includes(token), false, token);
    }
    assert.equal(
      KnowledgeRepositoryCertification.runtimeProhibitions.technologyNeutral,
      true,
    );
  });

  it("declares no query, retrieval, indexing, version, snapshot, history, archive, or retention execution", () => {
    const prohibitions = KnowledgeRepositoryCertification.runtimeProhibitions;
    assert.equal(prohibitions.noPersistence, true);
    assert.equal(prohibitions.noQueryExecution, true);
    assert.equal(prohibitions.noRetrievalExecution, true);
    assert.equal(prohibitions.noIndexExecution, true);
    assert.equal(prohibitions.noVersionExecution, true);
    assert.equal(prohibitions.noSnapshotExecution, true);
    assert.equal(prohibitions.noHistoryExecution, true);
    assert.equal(prohibitions.noArchiveExecution, true);
    assert.equal(prohibitions.noRetentionExecution, true);
  });

  it("declares no runtime executor, AI, Engine, Advisor, Scene, or UI behavior", () => {
    const prohibitions = KnowledgeRepositoryCertification.runtimeProhibitions;
    assert.equal(prohibitions.noRuntimeExecutor, true);
    assert.equal(prohibitions.noAiBehavior, true);
    assert.equal(prohibitions.noEngineReasoning, true);
    assert.equal(prohibitions.noAdvisorOrSceneBehavior, true);
    assert.equal(prohibitions.noUiBehavior, true);
  });

  it("declares final readiness ReadyForDKL6Freeze", () => {
    assert.equal(
      getKnowledgeRepositoryCertificationSummary().readiness,
      "ReadyForDKL6Freeze",
    );
  });

  it("ensures unique IDs across certification inventories", () => {
    const ids = [
      ...KnowledgeRepositoryCertification.scope.map((item) => item.id),
      ...KnowledgeRepositoryCertification.criteria.map((item) => item.id),
      ...KnowledgeRepositoryCertification.evidence.map((item) => item.id),
      ...KnowledgeRepositoryCertification.compatibility.map((item) => item.id),
      ...KnowledgeRepositoryCertification.regressionProtection.map(
        (item) => item.id,
      ),
      ...KnowledgeRepositoryCertification.boundaries.map((item) => item.id),
      ...KnowledgeRepositoryCertification.guarantees.map((item) => item.id),
      ...KnowledgeRepositoryCertification.gates.map((item) => item.id),
    ];
    assert.equal(new Set(ids).size, ids.length);
  });
});
