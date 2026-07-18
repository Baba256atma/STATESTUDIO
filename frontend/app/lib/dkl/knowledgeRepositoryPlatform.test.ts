/**
 * DKL-6:6 — Knowledge Repository Platform Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Platform.
 * No mocks. No randomness. No network. No filesystem IO. No source scanning.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryManifest,
  KnowledgeRepositoryManifestId,
  getKnowledgeRepositoryManifestPublicApiCount,
} from "./knowledgeRepositoryManifest.ts";
import {
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
  getKnowledgeRepositoryModelCount,
} from "./knowledgeRepositoryModel.ts";
import * as PlatformModule from "./knowledgeRepositoryPlatform.ts";
import {
  getKnowledgeRepositoryPlatformPublicApiCount,
  getKnowledgeRepositoryPlatformSummary,
  KnowledgeRepositoryPlatform,
  KnowledgeRepositoryPlatformId,
  KnowledgeRepositoryPlatformName,
  KnowledgeRepositoryPlatformNamespace,
  KnowledgeRepositoryPlatformStatus,
  KnowledgeRepositoryPlatformVersion,
} from "./knowledgeRepositoryPlatform.ts";
import {
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
  getKnowledgeRepositoryRegistryEntryCount,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
} from "./knowledgeRepositoryValidation.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryPlatform",
  "KnowledgeRepositoryPlatformId",
  "KnowledgeRepositoryPlatformVersion",
  "KnowledgeRepositoryPlatformName",
  "KnowledgeRepositoryPlatformNamespace",
  "KnowledgeRepositoryPlatformStatus",
  "getKnowledgeRepositoryPlatformSummary",
  "getKnowledgeRepositoryPlatformPublicApiCount",
] as const);

const SECTION_ORDER = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
] as const);

const COMPONENT_NAMES = Object.freeze([
  "RepositoryFoundationComponent",
  "RepositoryRegistryComponent",
  "RepositoryModelComponent",
  "RepositoryValidationComponent",
  "RepositoryManifestComponent",
  "RepositoryPlatformComponent",
] as const);

const BOUNDARY_NAMES = Object.freeze([
  "NoPersistenceImplementation",
  "NoDatabaseCoupling",
  "NoStorageEngineCoupling",
  "NoQueryExecution",
  "NoRetrievalExecution",
  "NoIndexExecution",
  "NoVersionExecution",
  "NoSnapshotExecution",
  "NoHistoryExecution",
  "NoArchiveExecution",
  "NoRetentionExecution",
  "NoFilesystemAccess",
  "NoNetworkAccess",
  "NoExternalServiceAccess",
  "NoAIBehavior",
  "NoEngineReasoning",
  "NoAdvisorOrSceneBehavior",
  "NoUIBehavior",
] as const);

const PHYSICAL_STORAGE_TOKENS = Object.freeze([
  "elasticsearch",
  "postgresql",
  "neo4j",
  "mongodb",
  "dynamodb",
] as const);

describe("DKL-6:6 Knowledge Repository Platform", () => {
  it("exposes exactly eight public exports", () => {
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical platform identity", () => {
    assert.equal(
      KnowledgeRepositoryPlatformId,
      "DKL-6:6/KnowledgeRepositoryPlatform",
    );
    assert.equal(
      KnowledgeRepositoryPlatform.identity.platformId,
      KnowledgeRepositoryPlatformId,
    );
    assert.equal(KnowledgeRepositoryPlatform.identity.phase, "DKL-6:6");
    assert.equal(KnowledgeRepositoryPlatform.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryPlatformVersion, "1.0.0");
    assert.equal(KnowledgeRepositoryPlatform.identity.platformVersion, "1.0.0");
  });

  it("has correct name", () => {
    assert.equal(
      KnowledgeRepositoryPlatformName,
      "Knowledge Repository Platform",
    );
    assert.equal(
      KnowledgeRepositoryPlatform.identity.platformName,
      KnowledgeRepositoryPlatformName,
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryPlatformNamespace,
      "nexora.dkl.repository.platform",
    );
    assert.equal(
      KnowledgeRepositoryPlatform.identity.platformNamespace,
      KnowledgeRepositoryPlatformNamespace,
    );
  });

  it("has PlatformComplete status", () => {
    assert.equal(KnowledgeRepositoryPlatformStatus, "PlatformComplete");
    assert.equal(KnowledgeRepositoryPlatform.identity.status, "PlatformComplete");
    assert.equal(KnowledgeRepositoryPlatform.result.status, "PlatformComplete");
  });

  it("has readiness ReadyForDKL6Certification", () => {
    assert.equal(
      KnowledgeRepositoryPlatform.readiness,
      "ReadyForDKL6Certification",
    );
    assert.equal(
      KnowledgeRepositoryPlatform.identity.readiness,
      "ReadyForDKL6Certification",
    );
    assert.equal(
      KnowledgeRepositoryPlatform.result.readiness,
      "ReadyForDKL6Certification",
    );
  });

  it("declares exactly six ordered platform sections", () => {
    assert.equal(KnowledgeRepositoryPlatform.sections.length, 6);
    assert.deepEqual(
      KnowledgeRepositoryPlatform.sections.map((section) => section.name),
      [...SECTION_ORDER],
    );
    assert.deepEqual(
      KnowledgeRepositoryPlatform.sections.map((section) => section.order),
      [1, 2, 3, 4, 5, 6],
    );
  });

  it("includes stable DKL-6 sections with runtime None", () => {
    for (const section of KnowledgeRepositoryPlatform.sections) {
      assert.equal(section.included, true);
      assert.equal(section.stable, true);
      assert.equal(section.owner, "DKL-6");
      assert.equal(section.runtimeBehavior, "None");
    }
  });

  it("declares exactly six platform components", () => {
    assert.equal(KnowledgeRepositoryPlatform.components.length, 6);
    assert.deepEqual(
      KnowledgeRepositoryPlatform.components.map((item) => item.name),
      [...COMPONENT_NAMES],
    );
  });

  it("preserves canonical Foundation, Registry, Model, Validation, and Manifest references", () => {
    assert.equal(KnowledgeRepositoryPlatform.foundation, KnowledgeRepositoryFoundation);
    assert.equal(KnowledgeRepositoryPlatform.registry, KnowledgeRepositoryRegistry);
    assert.equal(KnowledgeRepositoryPlatform.model, KnowledgeRepositoryModel);
    assert.equal(
      KnowledgeRepositoryPlatform.validation,
      KnowledgeRepositoryValidation,
    );
    assert.equal(KnowledgeRepositoryPlatform.manifest, KnowledgeRepositoryManifest);
    assert.equal(
      KnowledgeRepositoryPlatform.foundation.foundationId,
      KnowledgeRepositoryFoundationId,
    );
    assert.equal(
      KnowledgeRepositoryPlatform.registry.identity.registryId,
      KnowledgeRepositoryRegistryId,
    );
    assert.equal(
      KnowledgeRepositoryPlatform.model.identity.modelId,
      KnowledgeRepositoryModelId,
    );
    assert.equal(
      KnowledgeRepositoryPlatform.validation.identity.validationId,
      KnowledgeRepositoryValidationId,
    );
    assert.equal(
      KnowledgeRepositoryPlatform.manifest.identity.manifestId,
      KnowledgeRepositoryManifestId,
    );
  });

  it("declares exactly fifteen architectural compatible dependencies", () => {
    assert.equal(KnowledgeRepositoryPlatform.dependencies.length, 15);
    for (const dependency of KnowledgeRepositoryPlatform.dependencies) {
      assert.equal(dependency.dependencyType, "Architectural");
      assert.equal(dependency.compatibilityStatus, "Compatible");
      assert.equal(dependency.owner, "DKL-6");
      assert.equal(dependency.runtimeBehavior, "None");
      assert.ok(dependency.approvedSurface.endsWith(".ts"));
    }
  });

  it("declares exactly fourteen Compatible compatibility entries", () => {
    assert.equal(KnowledgeRepositoryPlatform.compatibility.length, 14);
    for (const entry of KnowledgeRepositoryPlatform.compatibility) {
      assert.equal(entry.status, "Compatible");
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("declares exactly eighteen Preserved boundaries", () => {
    assert.equal(KnowledgeRepositoryPlatform.boundaries.length, 18);
    assert.deepEqual(
      KnowledgeRepositoryPlatform.boundaries.map((item) => item.name),
      [...BOUNDARY_NAMES],
    );
    for (const boundary of KnowledgeRepositoryPlatform.boundaries) {
      assert.equal(boundary.status, "Preserved");
      assert.equal(boundary.owner, "DKL-6");
      assert.equal(boundary.enforcementType, "Architectural");
      assert.equal(boundary.runtimeBehavior, "None");
    }
  });

  it("declares exactly eighteen Guaranteed guarantees", () => {
    assert.equal(KnowledgeRepositoryPlatform.guarantees.length, 18);
    for (const guarantee of KnowledgeRepositoryPlatform.guarantees) {
      assert.equal(guarantee.status, "Guaranteed");
      assert.equal(guarantee.owner, "DKL-6");
      assert.equal(guarantee.runtimeBehavior, "None");
      assert.ok(guarantee.evidenceReferences.length > 0);
    }
  });

  it("accepts Manifested Complete Manifest with zero blocking issues", () => {
    const acceptance = KnowledgeRepositoryPlatform.acceptances.manifest;
    assert.equal(acceptance.manifestStatus, "Manifested");
    assert.equal(acceptance.manifestCompleteness, "Complete");
    assert.equal(acceptance.manifestValidationStatus, "Pass");
    assert.equal(acceptance.manifestBlockingIssueCount, 0);
    assert.equal(acceptance.manifestReadiness, "ReadyForDKL6Platform");
    assert.equal(acceptance.referencedManifest, KnowledgeRepositoryManifest);
  });

  it("accepts Validated validation with 40/40 rules and 10/10 gates", () => {
    const acceptance = KnowledgeRepositoryPlatform.acceptances.validation;
    assert.equal(acceptance.validationStatus, "Validated");
    assert.equal(acceptance.rules, 40);
    assert.equal(acceptance.passedRules, 40);
    assert.equal(acceptance.failedRules, 0);
    assert.equal(acceptance.gates, 10);
    assert.equal(acceptance.passedGates, 10);
    assert.equal(acceptance.failedGates, 0);
    assert.equal(acceptance.overallGateStatus, "Pass");
  });

  it("preserves canonical Registry, Model, and Manifest counts", () => {
    assert.equal(getKnowledgeRepositoryRegistryEntryCount(), 103);
    assert.equal(getKnowledgeRepositoryModelCount(), 52);
    assert.equal(KnowledgeRepositoryModel.relationships.length, 13);
    assert.equal(getKnowledgeRepositoryManifestPublicApiCount(), 38);
    assert.equal(
      KnowledgeRepositoryPlatform.acceptances.inventory.registryEntries,
      103,
    );
    assert.equal(KnowledgeRepositoryPlatform.acceptances.inventory.models, 52);
    assert.equal(
      KnowledgeRepositoryPlatform.acceptances.inventory.relationships,
      13,
    );
    assert.equal(
      KnowledgeRepositoryPlatform.acceptances.inventory.manifestPublicApis,
      38,
    );
  });

  it("declares phase public API counts 6,8,8,8,8,8 totaling 46", () => {
    assert.deepEqual(
      KnowledgeRepositoryPlatform.publicApis.map((item) => item.publicApiCount),
      [6, 8, 8, 8, 8, 8],
    );
    assert.equal(getKnowledgeRepositoryPlatformPublicApiCount(), 46);
  });

  it("declares exactly fourteen passing readiness gates", () => {
    assert.equal(KnowledgeRepositoryPlatform.readinessGates.length, 14);
    for (const gate of KnowledgeRepositoryPlatform.readinessGates) {
      assert.equal(gate.status, "Pass");
      assert.equal(gate.owner, "DKL-6");
      assert.equal(gate.runtimeBehavior, "None");
    }
  });

  it("declares Complete Platform result with zero blocking issues", () => {
    assert.equal(KnowledgeRepositoryPlatform.result.completeness, "Complete");
    assert.equal(KnowledgeRepositoryPlatform.result.validationStatus, "Pass");
    assert.equal(KnowledgeRepositoryPlatform.result.manifestStatus, "Manifested");
    assert.equal(KnowledgeRepositoryPlatform.result.blockingIssueCount, 0);
  });

  it("returns deterministic summary and public API count", () => {
    assert.equal(getKnowledgeRepositoryPlatformPublicApiCount(), 46);
    assert.equal(getKnowledgeRepositoryPlatformPublicApiCount(), 46);
    const summary = getKnowledgeRepositoryPlatformSummary();
    assert.deepEqual(summary, getKnowledgeRepositoryPlatformSummary());
    assert.equal(summary.platformId, KnowledgeRepositoryPlatformId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.name, KnowledgeRepositoryPlatformName);
    assert.equal(summary.namespace, KnowledgeRepositoryPlatformNamespace);
    assert.equal(summary.status, "PlatformComplete");
    assert.equal(summary.foundationIdentity, KnowledgeRepositoryFoundationId);
    assert.equal(summary.registryIdentity, KnowledgeRepositoryRegistryId);
    assert.equal(summary.modelIdentity, KnowledgeRepositoryModelId);
    assert.equal(summary.validationIdentity, KnowledgeRepositoryValidationId);
    assert.equal(summary.manifestIdentity, KnowledgeRepositoryManifestId);
    assert.equal(summary.platformSectionCount, 6);
    assert.equal(summary.platformComponentCount, 6);
    assert.equal(summary.dependencyCount, 15);
    assert.equal(summary.compatibilityCount, 14);
    assert.equal(summary.boundaryCount, 18);
    assert.equal(summary.guaranteeCount, 18);
    assert.equal(summary.publicApiCount, 46);
    assert.equal(summary.readinessGateCount, 14);
    assert.equal(summary.passedReadinessGateCount, 14);
    assert.equal(summary.failedReadinessGateCount, 0);
    assert.equal(summary.validationRuleCount, 40);
    assert.equal(summary.validationPassedRuleCount, 40);
    assert.equal(summary.manifestCompleteness, "Complete");
    assert.equal(summary.blockingIssueCount, 0);
    assert.equal(summary.completeness, "Complete");
    assert.equal(summary.readiness, "ReadyForDKL6Certification");
    assert.equal(Object.isFrozen(summary), true);
  });

  it("freezes Platform and preserves frozen imported aggregates", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.identity), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.sections), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.components), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.dependencies), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.compatibility), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.boundaries), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.guarantees), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.readinessGates), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryPlatform.result), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryFoundation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest), true);
    for (const section of KnowledgeRepositoryPlatform.sections) {
      assert.equal(Object.isFrozen(section), true);
    }
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryPlatform.identity.status = "Mutated";
    });
  });

  it("introduces no physical storage technology", () => {
    const haystack = [
      ...KnowledgeRepositoryPlatform.boundaries.map((item) => item.description),
      ...KnowledgeRepositoryPlatform.compatibility.map((item) => item.description),
      ...KnowledgeRepositoryPlatform.guarantees.map((item) => item.description),
    ]
      .join(" ")
      .toLowerCase();
    for (const token of PHYSICAL_STORAGE_TOKENS) {
      assert.equal(haystack.includes(token), false, token);
    }
    assert.equal(
      KnowledgeRepositoryPlatform.runtimeProhibitions.technologyNeutral,
      true,
    );
  });

  it("declares no persistence, query, retrieval, index, version, snapshot, history, archive, or retention execution", () => {
    const prohibitions = KnowledgeRepositoryPlatform.runtimeProhibitions;
    assert.equal(prohibitions.noPersistence, true);
    assert.equal(prohibitions.noDatabaseCoupling, true);
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
    const prohibitions = KnowledgeRepositoryPlatform.runtimeProhibitions;
    assert.equal(prohibitions.noRuntimeExecutor, true);
    assert.equal(prohibitions.noAiBehavior, true);
    assert.equal(prohibitions.noEngineReasoning, true);
    assert.equal(prohibitions.noAdvisorOrSceneBehavior, true);
    assert.equal(prohibitions.noUiBehavior, true);
  });

  it("declares final readiness ReadyForDKL6Certification", () => {
    assert.equal(
      getKnowledgeRepositoryPlatformSummary().readiness,
      "ReadyForDKL6Certification",
    );
  });

  it("ensures unique IDs across platform inventories", () => {
    const ids = [
      ...KnowledgeRepositoryPlatform.sections.map((item) => item.id),
      ...KnowledgeRepositoryPlatform.components.map((item) => item.id),
      ...KnowledgeRepositoryPlatform.dependencies.map((item) => item.id),
      ...KnowledgeRepositoryPlatform.compatibility.map((item) => item.id),
      ...KnowledgeRepositoryPlatform.boundaries.map((item) => item.id),
      ...KnowledgeRepositoryPlatform.guarantees.map((item) => item.id),
      ...KnowledgeRepositoryPlatform.readinessGates.map((item) => item.id),
    ];
    assert.equal(new Set(ids).size, ids.length);
  });
});
