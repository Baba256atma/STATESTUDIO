/**
 * DKL-6:8 — Knowledge Repository Freeze Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Freeze.
 * No mocks. No randomness. No network. No filesystem IO. No source scanning.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as FreezeModule from "./knowledgeRepositoryFreeze.ts";
import {
  getKnowledgeRepositoryFreezePublicApiCount,
  getKnowledgeRepositoryFreezeSummary,
  KnowledgeRepositoryFreeze,
  KnowledgeRepositoryFreezeId,
  KnowledgeRepositoryFreezeName,
  KnowledgeRepositoryFreezeNamespace,
  KnowledgeRepositoryFreezeStatus,
  KnowledgeRepositoryFreezeVersion,
} from "./knowledgeRepositoryFreeze.ts";
import {
  KnowledgeRepositoryCertification,
  KnowledgeRepositoryCertificationId,
} from "./knowledgeRepositoryCertification.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryFreeze",
  "KnowledgeRepositoryFreezeId",
  "KnowledgeRepositoryFreezeVersion",
  "KnowledgeRepositoryFreezeName",
  "KnowledgeRepositoryFreezeNamespace",
  "KnowledgeRepositoryFreezeStatus",
  "getKnowledgeRepositoryFreezeSummary",
  "getKnowledgeRepositoryFreezePublicApiCount",
] as const);

const SCOPE_ORDER = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
] as const);

const FROZEN_COMPONENT_NAMES = Object.freeze([
  "KnowledgeRepositoryFoundation",
  "KnowledgeRepositoryRegistry",
  "KnowledgeRepositoryModel",
  "KnowledgeRepositoryValidation",
  "KnowledgeRepositoryManifest",
  "KnowledgeRepositoryPlatform",
  "KnowledgeRepositoryCertification",
  "KnowledgeRepositoryFreeze",
] as const);

const PHYSICAL_STORAGE_TOKENS = Object.freeze([
  "elasticsearch",
  "postgresql",
  "neo4j",
  "mongodb",
  "dynamodb",
  "redis",
  "sqlite",
] as const);

const EXECUTION_TOKENS = Object.freeze([
  "queryExecutor",
  "retrievalExecutor",
  "indexExecutor",
  "versionExecutor",
  "snapshotExecutor",
  "historyExecutor",
  "archiveExecutor",
  "retentionExecutor",
  "runtimeExecutor",
] as const);

const BEHAVIOR_TOKENS = Object.freeze([
  "embedding",
  "openai",
  "advisorBehavior",
  "sceneRender",
  "uiBehavior",
  "executiveEngine",
] as const);

function assertDeepFrozen(value: unknown, path = "root"): void {
  if (value === null || typeof value !== "object") {
    return;
  }
  assert.ok(Object.isFrozen(value), `${path} must be frozen`);
  for (const [key, child] of Object.entries(value)) {
    assertDeepFrozen(child, `${path}.${key}`);
  }
}

describe("DKL-6:8 Knowledge Repository Freeze", () => {
  it("exposes exactly eight public exports", () => {
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical freeze identity", () => {
    assert.equal(
      KnowledgeRepositoryFreezeId,
      "DKL-6:8/KnowledgeRepositoryFreeze",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.identity.freezeId,
      KnowledgeRepositoryFreezeId,
    );
    assert.equal(KnowledgeRepositoryFreeze.identity.phase, "DKL-6:8");
    assert.equal(KnowledgeRepositoryFreeze.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryFreezeVersion, "1.0.0");
    assert.equal(KnowledgeRepositoryFreeze.identity.freezeVersion, "1.0.0");
  });

  it("has correct name", () => {
    assert.equal(KnowledgeRepositoryFreezeName, "Knowledge Repository Freeze");
    assert.equal(
      KnowledgeRepositoryFreeze.identity.freezeName,
      "Knowledge Repository Freeze",
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryFreezeNamespace,
      "nexora.dkl.repository.freeze",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.identity.freezeNamespace,
      "nexora.dkl.repository.freeze",
    );
  });

  it("has Frozen status", () => {
    assert.equal(KnowledgeRepositoryFreezeStatus, "Frozen");
    assert.equal(KnowledgeRepositoryFreeze.identity.status, "Frozen");
    assert.equal(KnowledgeRepositoryFreeze.result.status, "Frozen");
  });

  it("has Certified certification status", () => {
    assert.equal(
      KnowledgeRepositoryFreeze.identity.certificationStatus,
      "Certified",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.result.certificationStatus,
      "Certified",
    );
  });

  it("has DKL-6-LOCKED baseline", () => {
    assert.equal(KnowledgeRepositoryFreeze.identity.baseline, "DKL-6-LOCKED");
    assert.equal(KnowledgeRepositoryFreeze.result.baseline, "DKL-6-LOCKED");
  });

  it("has StableAndFrozen stability", () => {
    assert.equal(
      KnowledgeRepositoryFreeze.identity.stability,
      "StableAndFrozen",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.result.stability,
      "StableAndFrozen",
    );
  });

  it("has ReadyForDKL6PublicIndex readiness", () => {
    assert.equal(
      KnowledgeRepositoryFreeze.identity.readiness,
      "ReadyForDKL6PublicIndex",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.readiness,
      "ReadyForDKL6PublicIndex",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.result.readiness,
      "ReadyForDKL6PublicIndex",
    );
  });

  it("declares exactly eight ordered scope entries", () => {
    assert.equal(KnowledgeRepositoryFreeze.scope.length, 8);
    assert.deepEqual(
      KnowledgeRepositoryFreeze.scope.map((item) => item.name),
      [...SCOPE_ORDER],
    );
    assert.deepEqual(
      KnowledgeRepositoryFreeze.scope.map((item) => item.order),
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
  });

  it("marks every scope entry included, certified, frozen, and stable", () => {
    for (const entry of KnowledgeRepositoryFreeze.scope) {
      assert.equal(entry.included, true);
      assert.equal(entry.certified, true);
      assert.equal(entry.frozen, true);
      assert.equal(entry.stable, true);
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("preserves the canonical Certification reference", () => {
    assert.equal(
      KnowledgeRepositoryFreeze.certification,
      KnowledgeRepositoryCertification,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.certification.identity.certificationId,
      KnowledgeRepositoryCertificationId,
    );
  });

  it("accepts Certification as Certified with 18/18 criteria and 15/15 gates", () => {
    const acceptance = KnowledgeRepositoryFreeze.certificationAcceptance;
    assert.equal(acceptance.certificationStatus, "Certified");
    assert.equal(acceptance.criteria, 18);
    assert.equal(acceptance.passedCriteria, 18);
    assert.equal(acceptance.failedCriteria, 0);
    assert.equal(acceptance.gates, 15);
    assert.equal(acceptance.passedGates, 15);
    assert.equal(acceptance.failedGates, 0);
    assert.equal(acceptance.blockingIssues, 0);
    assert.equal(acceptance.readiness, "ReadyForDKL6Freeze");
    assert.equal(
      KnowledgeRepositoryFreeze.certification.result.status,
      "Certified",
    );
    assert.equal(
      KnowledgeRepositoryFreeze.certification.result.passedCriteria,
      18,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.certification.result.failedCriteria,
      0,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.certification.result.passedGates,
      15,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.certification.result.failedGates,
      0,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.certification.result.blockingIssueCount,
      0,
    );
  });

  it("declares exactly eight frozen components", () => {
    assert.equal(KnowledgeRepositoryFreeze.frozenComponents.length, 8);
    assert.deepEqual(
      KnowledgeRepositoryFreeze.frozenComponents.map((item) => item.name),
      [...FROZEN_COMPONENT_NAMES],
    );
  });

  it("marks every frozen component Certified, Frozen, Stable, DKL-6, None", () => {
    for (const component of KnowledgeRepositoryFreeze.frozenComponents) {
      assert.equal(component.certificationStatus, "Certified");
      assert.equal(component.freezeStatus, "Frozen");
      assert.equal(component.stability, "Stable");
      assert.equal(component.owner, "DKL-6");
      assert.equal(component.runtimeBehavior, "None");
    }
  });

  it("preserves Foundation counts 9/8/7/6", () => {
    const foundation = KnowledgeRepositoryFreeze.canonicalCounts.foundation;
    assert.equal(foundation.capabilities, 9);
    assert.equal(foundation.contracts, 8);
    assert.equal(foundation.lifecycleStates, 7);
    assert.equal(foundation.policies, 6);
  });

  it("preserves Registry counts 103/16", () => {
    const registry = KnowledgeRepositoryFreeze.canonicalCounts.registry;
    assert.equal(registry.entries, 103);
    assert.equal(registry.groups, 16);
  });

  it("preserves Model counts 52/13/14", () => {
    const model = KnowledgeRepositoryFreeze.canonicalCounts.model;
    assert.equal(model.models, 52);
    assert.equal(model.relationships, 13);
    assert.equal(model.registryTraceabilityGroups, 14);
  });

  it("preserves Validation 40/40 and 10/10", () => {
    const validation = KnowledgeRepositoryFreeze.canonicalCounts.validation;
    assert.equal(validation.rules, 40);
    assert.equal(validation.passedRules, 40);
    assert.equal(validation.failedRules, 0);
    assert.equal(validation.gates, 10);
    assert.equal(validation.passedGates, 10);
    assert.equal(validation.failedGates, 0);
  });

  it("preserves Manifest 12/12 gates and Complete", () => {
    const manifest = KnowledgeRepositoryFreeze.canonicalCounts.manifest;
    assert.equal(manifest.completenessGates, 12);
    assert.equal(manifest.passedCompletenessGates, 12);
    assert.equal(manifest.failedCompletenessGates, 0);
    assert.equal(manifest.completeness, "Complete");
  });

  it("preserves Platform 14/14 gates and Complete", () => {
    const platform = KnowledgeRepositoryFreeze.canonicalCounts.platform;
    assert.equal(platform.readinessGates, 14);
    assert.equal(platform.passedReadinessGates, 14);
    assert.equal(platform.failedReadinessGates, 0);
    assert.equal(platform.completeness, "Complete");
  });

  it("preserves Certification 18/18 criteria and 15/15 gates", () => {
    const certification =
      KnowledgeRepositoryFreeze.canonicalCounts.certification;
    assert.equal(certification.criteria, 18);
    assert.equal(certification.passedCriteria, 18);
    assert.equal(certification.failedCriteria, 0);
    assert.equal(certification.certificationGates, 15);
    assert.equal(certification.passedGates, 15);
    assert.equal(certification.failedGates, 0);
  });

  it("declares fourteen Locked compatibility locks", () => {
    assert.equal(KnowledgeRepositoryFreeze.compatibilityLocks.length, 14);
    for (const lock of KnowledgeRepositoryFreeze.compatibilityLocks) {
      assert.equal(lock.status, "Locked");
      assert.equal(lock.owner, "DKL-6");
      assert.equal(lock.runtimeBehavior, "None");
    }
  });

  it("declares twenty-one Locked dependency locks", () => {
    assert.equal(KnowledgeRepositoryFreeze.dependencyLocks.length, 21);
    for (const lock of KnowledgeRepositoryFreeze.dependencyLocks) {
      assert.equal(lock.status, "Locked");
      assert.equal(lock.owner, "DKL-6");
      assert.equal(lock.runtimeBehavior, "None");
    }
  });

  it("declares twelve Locked core locks", () => {
    assert.equal(KnowledgeRepositoryFreeze.coreLocks.length, 12);
    for (const lock of KnowledgeRepositoryFreeze.coreLocks) {
      assert.equal(lock.status, "Locked");
      assert.equal(lock.owner, "DKL-6");
      assert.equal(lock.runtimeBehavior, "None");
    }
  });

  it("declares eight Locked extension locks with additive-only policy", () => {
    assert.equal(KnowledgeRepositoryFreeze.extensionLocks.length, 8);
    for (const lock of KnowledgeRepositoryFreeze.extensionLocks) {
      assert.equal(lock.status, "Locked");
      assert.equal(lock.allowedChangeType, "AdditiveCompatibleExtension");
      assert.equal(lock.prohibitedChangeType, "BreakingChange");
      assert.equal(lock.owner, "DKL-6");
      assert.equal(lock.runtimeBehavior, "None");
    }
  });

  it("declares eighteen Locked CertifiedPreserved boundary locks", () => {
    assert.equal(KnowledgeRepositoryFreeze.boundaryLocks.length, 18);
    for (const lock of KnowledgeRepositoryFreeze.boundaryLocks) {
      assert.equal(lock.status, "Locked");
      assert.equal(lock.preservationStatus, "CertifiedPreserved");
      assert.equal(lock.owner, "DKL-6");
      assert.equal(lock.runtimeBehavior, "None");
    }
  });

  it("declares fourteen Locked regression locks", () => {
    assert.equal(KnowledgeRepositoryFreeze.regressionLocks.length, 14);
    for (const lock of KnowledgeRepositoryFreeze.regressionLocks) {
      assert.equal(lock.status, "Locked");
      assert.equal(lock.owner, "DKL-6");
      assert.equal(lock.runtimeBehavior, "None");
    }
  });

  it("declares twenty-two Guaranteed guarantees", () => {
    assert.equal(KnowledgeRepositoryFreeze.guarantees.length, 22);
    for (const guarantee of KnowledgeRepositoryFreeze.guarantees) {
      assert.equal(guarantee.status, "Guaranteed");
      assert.equal(guarantee.owner, "DKL-6");
      assert.equal(guarantee.runtimeBehavior, "None");
    }
  });

  it("declares sixteen Freeze gates that all Pass", () => {
    assert.equal(KnowledgeRepositoryFreeze.gates.length, 16);
    for (const gate of KnowledgeRepositoryFreeze.gates) {
      assert.equal(gate.status, "Pass");
      assert.equal(gate.owner, "DKL-6");
      assert.equal(gate.runtimeBehavior, "None");
    }
    const summary = getKnowledgeRepositoryFreezeSummary();
    assert.equal(summary.passedGateCount, 16);
    assert.equal(summary.failedGateCount, 0);
  });

  it("locks phase public API counts 6,8,8,8,8,8,8,8 totaling 62", () => {
    assert.deepEqual(
      KnowledgeRepositoryFreeze.publicApis.map((item) => item.publicApiCount),
      [6, 8, 8, 8, 8, 8, 8, 8],
    );
    assert.equal(getKnowledgeRepositoryFreezePublicApiCount(), 62);
    assert.equal(
      KnowledgeRepositoryFreeze.publicApis.reduce(
        (sum, phase) => sum + phase.publicApiCount,
        0,
      ),
      62,
    );
  });

  it("reports all locks Locked with zero unlocked and zero blocking issues", () => {
    assert.equal(KnowledgeRepositoryFreeze.result.unlockedCount, 0);
    assert.equal(KnowledgeRepositoryFreeze.result.blockingIssueCount, 0);
    assert.equal(
      KnowledgeRepositoryFreeze.result.lockedCount,
      KnowledgeRepositoryFreeze.result.totalLocks,
    );
    assert.equal(KnowledgeRepositoryFreeze.result.totalLocks, 87);
    assert.equal(KnowledgeRepositoryFreeze.result.status, "Frozen");
  });

  it("returns deterministic freeze summary and public API count", () => {
    const summaryA = getKnowledgeRepositoryFreezeSummary();
    const summaryB = getKnowledgeRepositoryFreezeSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(
      getKnowledgeRepositoryFreezePublicApiCount(),
      getKnowledgeRepositoryFreezePublicApiCount(),
    );
    assert.equal(summaryA.publicApiCount, 62);
    assert.equal(summaryA.readiness, "ReadyForDKL6PublicIndex");
    assert.equal(
      summaryA.certificationIdentity,
      KnowledgeRepositoryCertificationId,
    );
  });

  it("deeply freezes the Freeze aggregate and nested structures", () => {
    assert.ok(Object.isFrozen(KnowledgeRepositoryFreeze));
    assertDeepFrozen(KnowledgeRepositoryFreeze.identity, "identity");
    assertDeepFrozen(KnowledgeRepositoryFreeze.scope, "scope");
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.frozenComponents,
      "frozenComponents",
    );
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.canonicalCounts,
      "canonicalCounts",
    );
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.compatibilityLocks,
      "compatibilityLocks",
    );
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.dependencyLocks,
      "dependencyLocks",
    );
    assertDeepFrozen(KnowledgeRepositoryFreeze.coreLocks, "coreLocks");
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.extensionLocks,
      "extensionLocks",
    );
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.boundaryLocks,
      "boundaryLocks",
    );
    assertDeepFrozen(KnowledgeRepositoryFreeze.publicApis, "publicApis");
    assertDeepFrozen(
      KnowledgeRepositoryFreeze.regressionLocks,
      "regressionLocks",
    );
    assertDeepFrozen(KnowledgeRepositoryFreeze.guarantees, "guarantees");
    assertDeepFrozen(KnowledgeRepositoryFreeze.gates, "gates");
    assertDeepFrozen(KnowledgeRepositoryFreeze.result, "result");
    assertDeepFrozen(getKnowledgeRepositoryFreezeSummary(), "summary");
  });

  it("keeps the canonical Certification aggregate frozen", () => {
    assert.ok(Object.isFrozen(KnowledgeRepositoryFreeze.certification));
    assert.ok(Object.isFrozen(KnowledgeRepositoryCertification));
    assert.equal(
      KnowledgeRepositoryFreeze.certification,
      KnowledgeRepositoryCertification,
    );
  });

  it("introduces no persistence or physical storage technology", () => {
    const haystack = [
      ...KnowledgeRepositoryFreeze.guarantees.map((item) => item.description),
      ...KnowledgeRepositoryFreeze.compatibilityLocks.map(
        (item) => item.protectedInvariant,
      ),
      ...KnowledgeRepositoryFreeze.boundaryLocks.map((item) => item.name),
    ]
      .join(" ")
      .toLowerCase();
    for (const token of PHYSICAL_STORAGE_TOKENS) {
      assert.equal(haystack.includes(token), false, token);
    }
    assert.equal(
      KnowledgeRepositoryFreeze.runtimeProhibitions.noPersistence,
      true,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.runtimeProhibitions.noDatabaseCoupling,
      true,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.runtimeProhibitions.noStorageEngineCoupling,
      true,
    );
    assert.equal(
      KnowledgeRepositoryFreeze.runtimeProhibitions.technologyNeutral,
      true,
    );
  });

  it("introduces no query, retrieval, indexing, version, snapshot, history, archive, or retention execution", () => {
    const prohibitions = KnowledgeRepositoryFreeze.runtimeProhibitions;
    assert.equal(prohibitions.noQueryExecution, true);
    assert.equal(prohibitions.noRetrievalExecution, true);
    assert.equal(prohibitions.noIndexExecution, true);
    assert.equal(prohibitions.noVersionExecution, true);
    assert.equal(prohibitions.noSnapshotExecution, true);
    assert.equal(prohibitions.noHistoryExecution, true);
    assert.equal(prohibitions.noArchiveExecution, true);
    assert.equal(prohibitions.noRetentionExecution, true);
    for (const token of EXECUTION_TOKENS) {
      assert.equal(
        Object.prototype.hasOwnProperty.call(KnowledgeRepositoryFreeze, token),
        false,
        token,
      );
    }
  });

  it("introduces no runtime executor, AI, Engine, Advisor, Scene, or UI behavior", () => {
    const prohibitions = KnowledgeRepositoryFreeze.runtimeProhibitions;
    assert.equal(prohibitions.noRuntimeExecutor, true);
    assert.equal(prohibitions.noAiBehavior, true);
    assert.equal(prohibitions.noEngineReasoning, true);
    assert.equal(prohibitions.noAdvisorOrSceneBehavior, true);
    assert.equal(prohibitions.noUiBehavior, true);
    for (const token of BEHAVIOR_TOKENS) {
      assert.equal(
        Object.prototype.hasOwnProperty.call(KnowledgeRepositoryFreeze, token),
        false,
        token,
      );
    }
  });

  it("has no duplicate lock, guarantee, gate, scope, or component IDs", () => {
    const collect = (items: readonly { id: string }[]) =>
      items.map((item) => item.id);
    const allIds = [
      ...collect(KnowledgeRepositoryFreeze.scope),
      ...collect(KnowledgeRepositoryFreeze.frozenComponents),
      ...collect(KnowledgeRepositoryFreeze.compatibilityLocks),
      ...collect(KnowledgeRepositoryFreeze.dependencyLocks),
      ...collect(KnowledgeRepositoryFreeze.coreLocks),
      ...collect(KnowledgeRepositoryFreeze.extensionLocks),
      ...collect(KnowledgeRepositoryFreeze.boundaryLocks),
      ...collect(KnowledgeRepositoryFreeze.regressionLocks),
      ...collect(KnowledgeRepositoryFreeze.guarantees),
      ...collect(KnowledgeRepositoryFreeze.gates),
      ...collect(KnowledgeRepositoryFreeze.publicApis),
    ];
    assert.equal(new Set(allIds).size, allIds.length);
  });

  it("final readiness is ReadyForDKL6PublicIndex", () => {
    assert.equal(
      getKnowledgeRepositoryFreezeSummary().readiness,
      "ReadyForDKL6PublicIndex",
    );
  });
});
