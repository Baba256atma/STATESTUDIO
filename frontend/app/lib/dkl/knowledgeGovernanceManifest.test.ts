/**
 * DKL-8:5 — Knowledge Governance Manifest Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Manifest.
 * Inventory assertions compare against Validation-chain references.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernanceValidationPlatform } from "./knowledgeGovernanceValidation.ts";
import * as ManifestModule from "./knowledgeGovernanceManifest.ts";
import {
  getKnowledgeGovernanceManifestSummary,
  KnowledgeGovernanceManifestId,
  KnowledgeGovernanceManifestName,
  KnowledgeGovernanceManifestNamespace,
  KnowledgeGovernanceManifestPlatform,
  KnowledgeGovernanceManifestReadiness,
  KnowledgeGovernanceManifestStatus,
  KnowledgeGovernanceManifestVersion,
} from "./knowledgeGovernanceManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL85_FILES = Object.freeze([
  "knowledgeGovernanceManifestTypes.ts",
  "knowledgeGovernanceManifestInventory.ts",
  "knowledgeGovernanceManifestDependencies.ts",
  "knowledgeGovernanceManifestCompatibility.ts",
  "knowledgeGovernanceManifestGuarantees.ts",
  "knowledgeGovernanceManifestReadiness.ts",
  "knowledgeGovernanceManifest.ts",
  "knowledgeGovernanceManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceManifestId",
  "KnowledgeGovernanceManifestVersion",
  "KnowledgeGovernanceManifestName",
  "KnowledgeGovernanceManifestNamespace",
  "KnowledgeGovernanceManifestStatus",
  "KnowledgeGovernanceManifestReadiness",
  "KnowledgeGovernanceManifestPlatform",
  "getKnowledgeGovernanceManifestSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "dependency",
  "architecture",
  "foundation",
  "registry",
  "model",
  "validation",
  "ownership",
  "boundaries",
  "dependencies",
  "inventory",
  "compatibility",
  "guarantees",
  "publicApi",
  "readiness",
] as const);

const validation = KnowledgeGovernanceValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:5 Knowledge Governance Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(DKL85_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL85_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, ManifestDefined status, and ReadyForPlatform", () => {
    assert.equal(
      KnowledgeGovernanceManifestId,
      "DKL-8:5/KnowledgeGovernanceManifest",
    );
    assert.equal(KnowledgeGovernanceManifestVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernanceManifestName,
      "Knowledge Governance Manifest",
    );
    assert.equal(
      KnowledgeGovernanceManifestNamespace,
      "nexora.dkl.knowledge-governance.manifest",
    );
    assert.equal(KnowledgeGovernanceManifestStatus, "ManifestDefined");
    assert.equal(KnowledgeGovernanceManifestReadiness, "ReadyForPlatform");
    assert.equal(
      KnowledgeGovernanceManifestPlatform.nextPhase,
      "DKL-8:6 — Knowledge Governance Platform",
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.identity.architectureStatus,
      "CompleteThroughManifest",
    );
  });

  it("consumes only Validation platform and preserves the upstream chain by reference", () => {
    const dependency = KnowledgeGovernanceManifestPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "knowledgeGovernanceValidation.ts",
    );
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.validationId,
      validation.identity.validationId,
    );
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.dkl7DirectImport, false);
    assert.equal(dependency.reconstructsValidation, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(
      KnowledgeGovernanceManifestPlatform.upstreamValidation,
      validation,
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.foundation.subjects,
      foundation.subjects,
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.registry.subjects,
      registry.subjects,
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.model.modelKinds,
      model.modelKinds,
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.validation.rules,
      validation.rules,
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.boundaries,
      registry.boundaries.ownershipBoundaries,
    );
    assert.equal(
      KnowledgeGovernanceManifestPlatform.ownership.owns,
      registry.ownership.owns,
    );
  });

  it("inventories Foundation, Registry, Model, and Validation from Validation-chain collections", () => {
    const platform = KnowledgeGovernanceManifestPlatform;
    assert.equal(
      platform.foundation.foundationId,
      foundation.identity.foundationId,
    );
    assert.equal(platform.foundation.subjectCount, foundation.subjects.length);
    assert.equal(platform.foundation.preservedByReference, true);
    assert.equal(platform.registry.registryId, registry.identity.registryId);
    assert.equal(platform.registry.totalEntryCount, registry.totalEntryCount);
    assert.equal(platform.model.modelId, model.identity.modelId);
    assert.equal(platform.model.modelKindCount, model.modelKinds.length);
    assert.equal(
      platform.model.relationshipKindCount,
      model.relationships.kinds.length,
    );
    assert.equal(
      platform.validation.validationId,
      validation.identity.validationId,
    );
    assert.equal(
      platform.validation.validationOutcome,
      validation.validationOutcome,
    );
    assert.equal(platform.validation.ruleCount, validation.rules.length);
    assert.equal(
      platform.validation.categoryCount,
      validation.categories.length,
    );
    assert.equal(platform.validation.gateCount, validation.gates.length);
    assert.equal(
      platform.validation.failedRuleCount,
      validation.validationResult.failedRuleCount,
    );
  });

  it("exposes architecture phases, ownership, boundaries, and required inventories", () => {
    const platform = KnowledgeGovernanceManifestPlatform;
    assert.equal(platform.architecture.phases.length, 9);
    assert.equal(
      platform.architecture.completedPhaseCount,
      platform.architecture.phases.filter((item) => item.completed).length,
    );
    assert.equal(
      platform.architecture.futurePhaseCount,
      platform.architecture.phases.filter((item) => !item.completed).length,
    );
    assertUnique(
      platform.architecture.phases.map((item) => item.phaseId),
      "phaseId",
    );
    assert.equal(platform.ownership.ownedCount, registry.ownership.owns.length);
    assert.equal(
      platform.ownership.nonOwnedCount,
      registry.ownership.doesNotOwn.length,
    );
    assert.equal(platform.ownership.preservedByReference, true);
    assert.equal(
      platform.boundaries.length,
      registry.boundaries.ownershipBoundaries.length,
    );
    assertUnique(
      platform.boundaries.map((item) => item.id),
      "boundaryId",
    );
    assert.equal(platform.dependencies.length, 10);
    assert.equal(platform.guarantees.length, 18);
    assert.equal(platform.compatibility.length, 12);
    assert.equal(platform.publicApi.length, 8);
    assert.ok(platform.guarantees.every((item) => item.status === true));
    assert.ok(platform.compatibility.every((item) => item.compatible === true));
    assert.ok(
      platform.guarantees[6]?.statement.includes(
        String(registry.totalEntryCount),
      ),
    );
    assert.ok(
      platform.compatibility[1]?.statement.includes(
        String(registry.totalEntryCount),
      ),
    );
  });

  it("provides deterministic inventory counts derived from Validation collections", () => {
    const inventory = KnowledgeGovernanceManifestPlatform.inventory;
    assert.equal(inventory.registryEntryCount, registry.totalEntryCount);
    assert.equal(inventory.subjectCount, registry.subjects.length);
    assert.equal(inventory.contractCount, registry.contracts.length);
    assert.equal(inventory.roleCount, registry.roles.length);
    assert.equal(inventory.capabilityCount, registry.capabilities.length);
    assert.equal(
      inventory.classificationCount,
      registry.classifications.length,
    );
    assert.equal(inventory.sensitivityCount, registry.sensitivities.length);
    assert.equal(
      inventory.lifecycleStateCount,
      registry.lifecycleStates.length,
    );
    assert.equal(
      inventory.lifecycleTransitionCount,
      registry.lifecycleTransitions.length,
    );
    assert.equal(inventory.modelKindCount, model.modelKinds.length);
    assert.equal(
      inventory.relationshipKindCount,
      model.relationships.kinds.length,
    );
    assert.equal(inventory.assignmentModelCount, model.assignmentModelCount);
    assert.equal(inventory.policyModelCount, model.policyModelCount);
    assert.equal(inventory.validationRuleCount, validation.rules.length);
    assert.equal(
      inventory.validationCategoryCount,
      validation.categories.length,
    );
    assert.equal(inventory.validationGateCount, validation.gates.length);
    assert.equal(inventory.guaranteeCount, 18);
    assert.equal(inventory.compatibilityCount, 12);
    assert.equal(inventory.publicApiCount, 8);
    assert.equal(inventory.sectionCount, PLATFORM_SECTIONS.length);
    assert.equal(
      inventory.totalEntryCount,
      inventory.completedPhaseCount +
        inventory.futurePhaseCount +
        inventory.dependencyCount +
        inventory.registryEntryCount +
        inventory.modelKindCount +
        inventory.relationshipKindCount +
        inventory.validationRuleCount +
        inventory.validationCategoryCount +
        inventory.validationGateCount +
        inventory.validationSeverityCount +
        inventory.validationOutcomeCount +
        inventory.guaranteeCount +
        inventory.compatibilityCount +
        inventory.publicApiCount,
    );
    assert.equal(Object.isFrozen(inventory), true);
    assert.equal(Object.isFrozen(KnowledgeGovernanceManifestPlatform), true);
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceManifestPlatform.guarantees),
      true,
    );
    assert.deepEqual(
      [...KnowledgeGovernanceManifestPlatform.sectionOrder],
      [...PLATFORM_SECTIONS],
    );
  });

  it("has no validation, enforcement, persistence, or cross-layer runtime behavior", () => {
    const platform = KnowledgeGovernanceManifestPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.validates, false);
    assert.equal(platform.executes, false);
    assert.equal(platform.enforces, false);
    assert.equal(platform.persists, false);
    assert.equal(platform.retrieves, false);
    assert.equal(platform.reasons, false);
    assert.equal(platform.renders, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.engineReasoning, false);
    assert.equal(platform.advisorBehavior, false);
    assert.equal(platform.directorBehavior, false);
    assert.equal(platform.sceneBehavior, false);
    assert.equal(platform.repositoryAccess, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.metadata.validates, false);
    assert.equal(platform.metadata.enforces, false);
  });

  it("produces a deterministic summary ready for DKL-8:6", () => {
    const summary = getKnowledgeGovernanceManifestSummary();
    const summaryAgain = getKnowledgeGovernanceManifestSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, KnowledgeGovernanceManifestId);
    assert.equal(summary.version, KnowledgeGovernanceManifestVersion);
    assert.equal(summary.namespace, KnowledgeGovernanceManifestNamespace);
    assert.equal(summary.status, "ManifestDefined");
    assert.equal(summary.readiness, "ReadyForPlatform");
    assert.equal(
      summary.upstreamDependency,
      validation.identity.validationId,
    );
    assert.equal(summary.validationOutcome, validation.validationOutcome);
    assert.equal(
      summary.completedPhaseCount,
      KnowledgeGovernanceManifestPlatform.architecture.completedPhaseCount,
    );
    assert.equal(
      summary.futurePhaseCount,
      KnowledgeGovernanceManifestPlatform.architecture.futurePhaseCount,
    );
    assert.equal(summary.registryEntryCount, registry.totalEntryCount);
    assert.equal(summary.modelKindCount, model.modelKinds.length);
    assert.equal(summary.validationRuleCount, validation.rules.length);
    assert.equal(
      summary.totalEntryCount,
      KnowledgeGovernanceManifestPlatform.inventory.totalEntryCount,
    );
    assert.equal(summary.runtimeBehavior, "None");
    assert.equal(
      summary.nextPhase,
      "DKL-8:6 — Knowledge Governance Platform",
    );
    assert.equal(Object.isFrozen(summary), true);
  });
});
