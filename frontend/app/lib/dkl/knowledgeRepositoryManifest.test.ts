/**
 * DKL-6:5 — Knowledge Repository Manifest Tests.
 *
 * Deterministic coverage for the immutable Knowledge Repository Manifest.
 * No mocks. No randomness. No network. No filesystem IO. No source scanning.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
} from "./knowledgeRepositoryFoundation.ts";
import * as ManifestModule from "./knowledgeRepositoryManifest.ts";
import {
  getKnowledgeRepositoryManifestPublicApiCount,
  getKnowledgeRepositoryManifestSummary,
  KnowledgeRepositoryManifest,
  KnowledgeRepositoryManifestId,
  KnowledgeRepositoryManifestName,
  KnowledgeRepositoryManifestNamespace,
  KnowledgeRepositoryManifestStatus,
  KnowledgeRepositoryManifestVersion,
} from "./knowledgeRepositoryManifest.ts";
import {
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
} from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
} from "./knowledgeRepositoryValidation.ts";

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeRepositoryManifest",
  "KnowledgeRepositoryManifestId",
  "KnowledgeRepositoryManifestVersion",
  "KnowledgeRepositoryManifestName",
  "KnowledgeRepositoryManifestNamespace",
  "KnowledgeRepositoryManifestStatus",
  "getKnowledgeRepositoryManifestSummary",
  "getKnowledgeRepositoryManifestPublicApiCount",
] as const);

const SECTION_ORDER = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
] as const);

const COMPONENT_NAMES = Object.freeze([
  "KnowledgeRepositoryFoundation",
  "KnowledgeRepositoryRegistry",
  "KnowledgeRepositoryModel",
  "KnowledgeRepositoryValidation",
  "KnowledgeRepositoryManifest",
] as const);

const BOUNDARY_NAMES = Object.freeze([
  "NoPersistenceImplementation",
  "NoDatabaseCoupling",
  "NoStorageEngineCoupling",
  "NoQueryExecution",
  "NoRetrievalExecution",
  "NoIndexExecution",
  "NoSnapshotExecution",
  "NoVersionExecution",
  "NoArchiveExecution",
  "NoRetentionExecution",
  "NoFilesystemAccess",
  "NoNetworkAccess",
  "NoExternalServiceAccess",
  "NoAIBehavior",
  "NoEngineReasoning",
  "NoAdvisorBehavior",
  "NoSceneBehavior",
  "NoUIBehavior",
] as const);

const PHYSICAL_STORAGE_TOKENS = Object.freeze([
  "elasticsearch",
  "postgresql",
  "neo4j",
  "mongodb",
  "dynamodb",
] as const);

describe("DKL-6:5 Knowledge Repository Manifest", () => {
  it("exposes exactly eight public exports", () => {
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical manifest identity", () => {
    assert.equal(
      KnowledgeRepositoryManifestId,
      "DKL-6:5/KnowledgeRepositoryManifest",
    );
    assert.equal(
      KnowledgeRepositoryManifest.identity.manifestId,
      KnowledgeRepositoryManifestId,
    );
    assert.equal(KnowledgeRepositoryManifest.identity.phase, "DKL-6:5");
    assert.equal(KnowledgeRepositoryManifest.identity.owner, "DKL-6");
  });

  it("has version 1.0.0", () => {
    assert.equal(KnowledgeRepositoryManifestVersion, "1.0.0");
    assert.equal(KnowledgeRepositoryManifest.identity.manifestVersion, "1.0.0");
  });

  it("has correct name", () => {
    assert.equal(
      KnowledgeRepositoryManifestName,
      "Knowledge Repository Manifest",
    );
    assert.equal(
      KnowledgeRepositoryManifest.identity.manifestName,
      KnowledgeRepositoryManifestName,
    );
  });

  it("has correct namespace", () => {
    assert.equal(
      KnowledgeRepositoryManifestNamespace,
      "nexora.dkl.repository.manifest",
    );
    assert.equal(
      KnowledgeRepositoryManifest.identity.manifestNamespace,
      KnowledgeRepositoryManifestNamespace,
    );
  });

  it("has Manifested status", () => {
    assert.equal(KnowledgeRepositoryManifestStatus, "Manifested");
    assert.equal(KnowledgeRepositoryManifest.identity.status, "Manifested");
    assert.equal(KnowledgeRepositoryManifest.result.status, "Manifested");
  });

  it("has readiness ReadyForDKL6Platform", () => {
    assert.equal(KnowledgeRepositoryManifest.readiness, "ReadyForDKL6Platform");
    assert.equal(
      KnowledgeRepositoryManifest.identity.readiness,
      "ReadyForDKL6Platform",
    );
    assert.equal(
      KnowledgeRepositoryManifest.result.readiness,
      "ReadyForDKL6Platform",
    );
  });

  it("declares exactly five ordered architecture sections", () => {
    assert.equal(KnowledgeRepositoryManifest.sections.length, 5);
    assert.deepEqual(
      KnowledgeRepositoryManifest.sections.map((section) => section.name),
      [...SECTION_ORDER],
    );
    assert.deepEqual(
      KnowledgeRepositoryManifest.sections.map((section) => section.order),
      [1, 2, 3, 4, 5],
    );
  });

  it("includes all sections with owner DKL-6 and runtime None", () => {
    for (const section of KnowledgeRepositoryManifest.sections) {
      assert.equal(section.included, true);
      assert.equal(section.owner, "DKL-6");
      assert.equal(section.runtimeBehavior, "None");
    }
  });

  it("declares exactly five component entries", () => {
    assert.equal(KnowledgeRepositoryManifest.components.length, 5);
    assert.deepEqual(
      KnowledgeRepositoryManifest.components.map((item) => item.componentName),
      [...COMPONENT_NAMES],
    );
  });

  it("declares correct Foundation inventory counts", () => {
    const counts = KnowledgeRepositoryManifest.canonicalCounts.foundation;
    assert.equal(counts.capabilities, 9);
    assert.equal(counts.contracts, 8);
    assert.equal(counts.lifecycleStates, 7);
    assert.equal(counts.policies, 6);
    assert.equal(counts.publicExports, 6);
  });

  it("declares correct Registry inventory counts", () => {
    const registry = KnowledgeRepositoryManifest.inventories.registry;
    const byCategory = Object.fromEntries(
      registry.map((entry) => [entry.category, entry.count]),
    );
    assert.equal(byCategory.RegistryRepositoryTypes, 7);
    assert.equal(byCategory.RegistryComponents, 10);
    assert.equal(byCategory.RegistryKnowledgeRecordTypes, 7);
    assert.equal(byCategory.RegistryVersionTypes, 6);
    assert.equal(byCategory.RegistrySnapshotTypes, 6);
    assert.equal(byCategory.RegistryHistoryEventTypes, 8);
    assert.equal(byCategory.RegistryArchiveStates, 7);
    assert.equal(byCategory.RegistryRetentionPolicies, 6);
    assert.equal(byCategory.RegistryIndexDeclarations, 8);
    assert.equal(byCategory.RegistryRetrievalDeclarations, 8);
    assert.equal(byCategory.RegistryFoundationCapabilities, 9);
    assert.equal(byCategory.RegistryFoundationContracts, 8);
    assert.equal(byCategory.RegistryFoundationLifecycleStates, 7);
    assert.equal(byCategory.RegistryFoundationPolicies, 6);
    assert.equal(byCategory.RegistryTotalEntries, 103);
    assert.equal(byCategory.RegistryOrderedContentGroups, 16);
    assert.equal(byCategory.RegistryPublicExports, 8);
  });

  it("declares correct Model inventory counts", () => {
    const model = KnowledgeRepositoryManifest.inventories.model;
    const byCategory = Object.fromEntries(
      model.map((entry) => [entry.category, entry.count]),
    );
    assert.equal(byCategory.ModelIdentityAndAggregate, 2);
    assert.equal(byCategory.ModelRecordModels, 7);
    assert.equal(byCategory.ModelVersionModels, 6);
    assert.equal(byCategory.ModelSnapshotModels, 6);
    assert.equal(byCategory.ModelHistoryModels, 8);
    assert.equal(byCategory.ModelArchiveModels, 1);
    assert.equal(byCategory.ModelRetentionModels, 6);
    assert.equal(byCategory.ModelIndexModels, 8);
    assert.equal(byCategory.ModelRetrievalModels, 8);
    assert.equal(byCategory.ModelTotalModels, 52);
    assert.equal(byCategory.ModelRelationships, 13);
    assert.equal(byCategory.ModelLifecycleStates, 7);
    assert.equal(byCategory.ModelRegistryTraceabilityGroups, 14);
    assert.equal(byCategory.ModelPublicExports, 8);
  });

  it("declares correct Validation inventory counts", () => {
    const validation = KnowledgeRepositoryManifest.inventories.validation;
    const byCategory = Object.fromEntries(
      validation.map((entry) => [entry.category, entry.count]),
    );
    assert.equal(byCategory.ValidationCategories, 10);
    assert.equal(byCategory.ValidationRules, 40);
    assert.equal(byCategory.ValidationPassedRules, 40);
    assert.equal(byCategory.ValidationFailedRules, 0);
    assert.equal(byCategory.ValidationGates, 10);
    assert.equal(byCategory.ValidationPassedGates, 10);
    assert.equal(byCategory.ValidationFailedGates, 0);
    assert.equal(byCategory.ValidationPublicExports, 8);
  });

  it("declares public API phase counts 6, 8, 8, 8, 8 totaling 38", () => {
    assert.deepEqual(
      KnowledgeRepositoryManifest.publicApis.map((item) => item.publicApiCount),
      [6, 8, 8, 8, 8],
    );
    assert.equal(getKnowledgeRepositoryManifestPublicApiCount(), 38);
  });

  it("declares exactly eleven architectural compatible dependencies", () => {
    assert.equal(KnowledgeRepositoryManifest.dependencies.length, 11);
    for (const dependency of KnowledgeRepositoryManifest.dependencies) {
      assert.equal(dependency.dependencyType, "Architectural");
      assert.equal(dependency.status, "Compatible");
      assert.equal(dependency.owner, "DKL-6");
      assert.equal(dependency.runtimeBehavior, "None");
      assert.ok(dependency.approvedSurface.endsWith(".ts"));
    }
  });

  it("declares complete owned and non-owned responsibilities", () => {
    assert.equal(KnowledgeRepositoryManifest.ownership.owned.length, 14);
    assert.equal(KnowledgeRepositoryManifest.ownership.notOwned.length, 18);
    assert.ok(
      KnowledgeRepositoryManifest.ownership.owned.some(
        (entry) => entry.responsibility === "Repository Foundation",
      ),
    );
    assert.ok(
      KnowledgeRepositoryManifest.ownership.notOwned.some(
        (entry) => entry.responsibility === "Physical Storage",
      ),
    );
    assert.ok(
      KnowledgeRepositoryManifest.ownership.notOwned.some(
        (entry) => entry.responsibility === "User Interface",
      ),
    );
  });

  it("declares exactly eighteen preserved boundaries", () => {
    assert.equal(KnowledgeRepositoryManifest.boundaries.length, 18);
    assert.deepEqual(
      KnowledgeRepositoryManifest.boundaries.map((item) => item.name),
      [...BOUNDARY_NAMES],
    );
    for (const boundary of KnowledgeRepositoryManifest.boundaries) {
      assert.equal(boundary.status, "Preserved");
      assert.equal(boundary.owner, "DKL-6");
      assert.equal(boundary.enforcementType, "Architectural");
      assert.equal(boundary.runtimeBehavior, "None");
    }
  });

  it("declares exactly twelve compatible compatibility entries", () => {
    assert.equal(KnowledgeRepositoryManifest.compatibility.length, 12);
    for (const entry of KnowledgeRepositoryManifest.compatibility) {
      assert.equal(entry.status, "Compatible");
      assert.equal(entry.owner, "DKL-6");
      assert.equal(entry.runtimeBehavior, "None");
    }
  });

  it("declares exactly sixteen guaranteed guarantees", () => {
    assert.equal(KnowledgeRepositoryManifest.guarantees.length, 16);
    for (const guarantee of KnowledgeRepositoryManifest.guarantees) {
      assert.equal(guarantee.status, "Guaranteed");
      assert.equal(guarantee.owner, "DKL-6");
      assert.equal(guarantee.runtimeBehavior, "None");
      assert.ok(guarantee.evidenceReferences.length > 0);
    }
  });

  it("preserves validation evidence for 40/40 rules and 10/10 gates", () => {
    const evidence = KnowledgeRepositoryManifest.validationEvidence;
    assert.equal(evidence.validationId, KnowledgeRepositoryValidationId);
    assert.equal(evidence.validationStatus, "Validated");
    assert.equal(evidence.rules, 40);
    assert.equal(evidence.passedRules, 40);
    assert.equal(evidence.failedRules, 0);
    assert.equal(evidence.gates, 10);
    assert.equal(evidence.passedGates, 10);
    assert.equal(evidence.failedGates, 0);
    assert.equal(evidence.overallGateStatus, "Pass");
    assert.equal(evidence.validationReadiness, "ReadyForDKL6Manifest");
    assert.equal(evidence.manifestValidationAcceptance, "Accepted");
    assert.equal(evidence.blockingIssueCount, 0);
  });

  it("declares exactly twelve passing completeness gates", () => {
    assert.equal(KnowledgeRepositoryManifest.completenessGates.length, 12);
    for (const gate of KnowledgeRepositoryManifest.completenessGates) {
      assert.equal(gate.status, "Pass");
      assert.equal(gate.owner, "DKL-6");
      assert.equal(gate.runtimeBehavior, "None");
    }
  });

  it("declares Complete manifested result with zero blocking issues", () => {
    assert.equal(KnowledgeRepositoryManifest.result.completeness, "Complete");
    assert.equal(KnowledgeRepositoryManifest.result.validationStatus, "Pass");
    assert.equal(KnowledgeRepositoryManifest.result.blockingIssueCount, 0);
  });

  it("returns deterministic public API count and summary", () => {
    assert.equal(getKnowledgeRepositoryManifestPublicApiCount(), 38);
    assert.equal(getKnowledgeRepositoryManifestPublicApiCount(), 38);
    const summary = getKnowledgeRepositoryManifestSummary();
    assert.deepEqual(summary, getKnowledgeRepositoryManifestSummary());
    assert.equal(summary.manifestId, KnowledgeRepositoryManifestId);
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.name, KnowledgeRepositoryManifestName);
    assert.equal(summary.namespace, KnowledgeRepositoryManifestNamespace);
    assert.equal(summary.status, "Manifested");
    assert.equal(summary.foundationIdentity, KnowledgeRepositoryFoundationId);
    assert.equal(summary.registryIdentity, KnowledgeRepositoryRegistryId);
    assert.equal(summary.modelIdentity, KnowledgeRepositoryModelId);
    assert.equal(summary.validationIdentity, KnowledgeRepositoryValidationId);
    assert.equal(summary.architectureSectionCount, 5);
    assert.equal(summary.componentCount, 5);
    assert.equal(summary.inventoryGroupCount, 5);
    assert.equal(summary.publicApiCount, 38);
    assert.equal(summary.dependencyCount, 11);
    assert.equal(summary.ownedResponsibilityCount, 14);
    assert.equal(summary.nonOwnedResponsibilityCount, 18);
    assert.equal(summary.boundaryDeclarationCount, 18);
    assert.equal(summary.compatibilityDeclarationCount, 12);
    assert.equal(summary.guaranteeCount, 16);
    assert.equal(summary.completenessGateCount, 12);
    assert.equal(summary.passedCompletenessGateCount, 12);
    assert.equal(summary.failedCompletenessGateCount, 0);
    assert.equal(summary.validationRuleCount, 40);
    assert.equal(summary.validationPassedRuleCount, 40);
    assert.equal(summary.validationFailedRuleCount, 0);
    assert.equal(summary.blockingIssueCount, 0);
    assert.equal(summary.completeness, "Complete");
    assert.equal(summary.readiness, "ReadyForDKL6Platform");
    assert.equal(Object.isFrozen(summary), true);
  });

  it("keeps Foundation, Registry, Model, and Validation aggregates frozen", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryFoundation), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryRegistry), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryModel), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryValidation), true);
  });

  it("freezes the Manifest aggregate and nested sections", () => {
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.identity), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.sections), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.components), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.dependencies), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.boundaries), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.compatibility), true);
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.guarantees), true);
    assert.equal(
      Object.isFrozen(KnowledgeRepositoryManifest.completenessGates),
      true,
    );
    assert.equal(Object.isFrozen(KnowledgeRepositoryManifest.result), true);
    for (const section of KnowledgeRepositoryManifest.sections) {
      assert.equal(Object.isFrozen(section), true);
    }
    for (const dependency of KnowledgeRepositoryManifest.dependencies) {
      assert.equal(Object.isFrozen(dependency), true);
    }
    assert.throws(() => {
      // @ts-expect-error — immutability guard
      KnowledgeRepositoryManifest.identity.status = "Mutated";
    });
  });

  it("introduces no physical storage technology", () => {
    const haystack = [
      ...KnowledgeRepositoryManifest.boundaries.map((item) => item.description),
      ...KnowledgeRepositoryManifest.compatibility.map((item) => item.description),
      ...KnowledgeRepositoryManifest.guarantees.map((item) => item.description),
    ]
      .join(" ")
      .toLowerCase();
    for (const token of PHYSICAL_STORAGE_TOKENS) {
      assert.equal(haystack.includes(token), false, token);
    }
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.technologyNeutral,
      true,
    );
  });

  it("declares no persistence, query, retrieval, or index execution", () => {
    assert.equal(KnowledgeRepositoryManifest.runtimeProhibitions.noPersistence, true);
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noQueryExecution,
      true,
    );
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noRetrievalExecution,
      true,
    );
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noIndexExecution,
      true,
    );
  });

  it("declares no runtime executor, AI, Engine, Advisor, Scene, or UI behavior", () => {
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noRuntimeExecutor,
      true,
    );
    assert.equal(KnowledgeRepositoryManifest.runtimeProhibitions.noAiBehavior, true);
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noEngineReasoning,
      true,
    );
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noAdvisorBehavior,
      true,
    );
    assert.equal(
      KnowledgeRepositoryManifest.runtimeProhibitions.noSceneBehavior,
      true,
    );
    assert.equal(KnowledgeRepositoryManifest.runtimeProhibitions.noUiBehavior, true);
  });

  it("declares final readiness ReadyForDKL6Platform", () => {
    assert.equal(
      getKnowledgeRepositoryManifestSummary().readiness,
      "ReadyForDKL6Platform",
    );
  });

  it("ensures unique IDs across manifest inventories", () => {
    const ids = [
      ...KnowledgeRepositoryManifest.sections.map((item) => item.id),
      ...KnowledgeRepositoryManifest.components.map((item) => item.id),
      ...KnowledgeRepositoryManifest.dependencies.map((item) => item.id),
      ...KnowledgeRepositoryManifest.boundaries.map((item) => item.id),
      ...KnowledgeRepositoryManifest.compatibility.map((item) => item.id),
      ...KnowledgeRepositoryManifest.guarantees.map((item) => item.id),
      ...KnowledgeRepositoryManifest.completenessGates.map((item) => item.id),
    ];
    assert.equal(new Set(ids).size, ids.length);
  });
});
