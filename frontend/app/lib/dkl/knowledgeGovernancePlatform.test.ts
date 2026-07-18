/**
 * DKL-8:6 — Knowledge Governance Platform Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Platform.
 * Inventory assertions compare against Manifest-chain references.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernanceManifestPlatform } from "./knowledgeGovernanceManifest.ts";
import * as PlatformModule from "./knowledgeGovernancePlatform.ts";
import {
  getKnowledgeGovernancePlatformSummary,
  KnowledgeGovernancePlatform,
  KnowledgeGovernancePlatformId,
  KnowledgeGovernancePlatformName,
  KnowledgeGovernancePlatformNamespace,
  KnowledgeGovernancePlatformReadiness,
  KnowledgeGovernancePlatformStatus,
  KnowledgeGovernancePlatformVersion,
} from "./knowledgeGovernancePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL86_FILES = Object.freeze([
  "knowledgeGovernancePlatformTypes.ts",
  "knowledgeGovernancePlatformArchitecture.ts",
  "knowledgeGovernancePlatformDependencies.ts",
  "knowledgeGovernancePlatformCompatibility.ts",
  "knowledgeGovernancePlatformGuarantees.ts",
  "knowledgeGovernancePlatformReadiness.ts",
  "knowledgeGovernancePlatform.ts",
  "knowledgeGovernancePlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernancePlatformId",
  "KnowledgeGovernancePlatformVersion",
  "KnowledgeGovernancePlatformName",
  "KnowledgeGovernancePlatformNamespace",
  "KnowledgeGovernancePlatformStatus",
  "KnowledgeGovernancePlatformReadiness",
  "KnowledgeGovernancePlatform",
  "getKnowledgeGovernancePlatformSummary",
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
  "manifest",
  "ownership",
  "boundaries",
  "dependencies",
  "inventory",
  "counts",
  "apiRegistry",
  "compatibility",
  "guarantees",
  "readiness",
] as const);

const manifest = KnowledgeGovernanceManifestPlatform;
const validation = manifest.upstreamValidation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:6 Knowledge Governance Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(DKL86_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL86_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, PlatformDefined status, and ReadyForCertification", () => {
    assert.equal(
      KnowledgeGovernancePlatformId,
      "DKL-8:6/KnowledgeGovernancePlatform",
    );
    assert.equal(KnowledgeGovernancePlatformVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernancePlatformName,
      "Knowledge Governance Platform",
    );
    assert.equal(
      KnowledgeGovernancePlatformNamespace,
      "nexora.dkl.knowledge-governance.platform",
    );
    assert.equal(KnowledgeGovernancePlatformStatus, "PlatformDefined");
    assert.equal(
      KnowledgeGovernancePlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(
      KnowledgeGovernancePlatform.nextPhase,
      "DKL-8:7 — Knowledge Governance Certification",
    );
    assert.equal(
      KnowledgeGovernancePlatform.identity.architectureStatus,
      "CompleteThroughPlatform",
    );
  });

  it("consumes only Manifest and preserves the upstream chain by reference", () => {
    const dependency = KnowledgeGovernancePlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "knowledgeGovernanceManifest.ts",
    );
    assert.equal(dependency.manifestOnly, true);
    assert.equal(dependency.manifestId, manifest.identity.manifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.dkl7DirectImport, false);
    assert.equal(dependency.reconstructsManifest, false);
    assert.equal(KnowledgeGovernancePlatform.manifest, manifest);
    assert.equal(KnowledgeGovernancePlatform.validation, validation);
    assert.equal(KnowledgeGovernancePlatform.model, model);
    assert.equal(KnowledgeGovernancePlatform.registry, registry);
    assert.equal(KnowledgeGovernancePlatform.foundation, foundation);
    assert.equal(KnowledgeGovernancePlatform.ownership, manifest.ownership);
    assert.equal(KnowledgeGovernancePlatform.boundaries, manifest.boundaries);
  });

  it("derives inventory counts exclusively through Manifest", () => {
    const inventory = KnowledgeGovernancePlatform.inventory;
    assert.equal(
      inventory.manifestTotalEntryCount,
      manifest.inventory.totalEntryCount,
    );
    assert.equal(
      inventory.registryEntryCount,
      manifest.inventory.registryEntryCount,
    );
    assert.equal(inventory.subjectCount, manifest.inventory.subjectCount);
    assert.equal(inventory.contractCount, manifest.inventory.contractCount);
    assert.equal(inventory.roleCount, manifest.inventory.roleCount);
    assert.equal(
      inventory.capabilityCount,
      manifest.inventory.capabilityCount,
    );
    assert.equal(inventory.modelKindCount, manifest.inventory.modelKindCount);
    assert.equal(
      inventory.relationshipKindCount,
      manifest.inventory.relationshipKindCount,
    );
    assert.equal(
      inventory.validationRuleCount,
      manifest.inventory.validationRuleCount,
    );
    assert.equal(
      inventory.validationCategoryCount,
      manifest.inventory.validationCategoryCount,
    );
    assert.equal(
      inventory.validationGateCount,
      manifest.inventory.validationGateCount,
    );
    assert.equal(
      inventory.ownershipDeclarationCount,
      manifest.inventory.ownershipDeclarationCount,
    );
    assert.equal(inventory.boundaryCount, manifest.inventory.boundaryCount);
    assert.equal(inventory.manifestSectionCount, manifest.sectionCount);
    assert.equal(
      inventory.totalEntryCount,
      inventory.completedPhaseCount +
        inventory.futurePhaseCount +
        inventory.dependencyCount +
        inventory.manifestTotalEntryCount +
        inventory.guaranteeCount +
        inventory.compatibilityCount +
        inventory.publicApiCount,
    );
  });

  it("exposes architecture, APIs, guarantees, and immutable sections", () => {
    const platform = KnowledgeGovernancePlatform;
    assert.equal(platform.architecture.phases.length, 9);
    assert.equal(
      platform.architecture.completedPhaseCount,
      platform.architecture.phases.filter((item) => item.completed).length,
    );
    assert.equal(
      platform.architecture.futurePhaseCount,
      platform.architecture.phases.filter((item) => !item.completed).length,
    );
    assert.equal(platform.architecture.completedPhaseCount, 6);
    assert.equal(platform.architecture.futurePhaseCount, 3);
    assertUnique(
      platform.architecture.phases.map((item) => item.phaseId),
      "phaseId",
    );
    assert.equal(platform.dependencies.length, 12);
    assert.equal(platform.guarantees.length, 18);
    assert.equal(platform.compatibility.length, 12);
    assert.equal(platform.apiRegistry.length, 8);
    assert.ok(platform.guarantees.every((item) => item.status === true));
    assert.ok(platform.compatibility.every((item) => item.compatible === true));
    assert.ok(
      platform.guarantees[7]?.statement.includes(
        String(manifest.inventory.totalEntryCount),
      ),
    );
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, PLATFORM_SECTIONS.length);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.guarantees), true);
    assert.equal(Object.isFrozen(platform.apiRegistry), true);
  });

  it("has no runtime, enforcement, persistence, or cross-layer behavior", () => {
    const platform = KnowledgeGovernancePlatform;
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
    assert.equal(platform.reconstructs, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.engineReasoning, false);
    assert.equal(platform.advisorBehavior, false);
    assert.equal(platform.directorBehavior, false);
    assert.equal(platform.sceneBehavior, false);
    assert.equal(platform.repositoryAccess, false);
    assert.equal(platform.aiBehavior, false);
  });

  it("produces a deterministic summary ready for DKL-8:7", () => {
    const summary = getKnowledgeGovernancePlatformSummary();
    const summaryAgain = getKnowledgeGovernancePlatformSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, KnowledgeGovernancePlatformId);
    assert.equal(summary.version, KnowledgeGovernancePlatformVersion);
    assert.equal(summary.namespace, KnowledgeGovernancePlatformNamespace);
    assert.equal(summary.status, "PlatformDefined");
    assert.equal(summary.readiness, "ReadyForCertification");
    assert.equal(summary.upstreamDependency, manifest.identity.manifestId);
    assert.equal(
      summary.validationOutcome,
      manifest.validation.validationOutcome,
    );
    assert.equal(summary.completedPhaseCount, 6);
    assert.equal(summary.futurePhaseCount, 3);
    assert.equal(
      summary.registryEntryCount,
      manifest.inventory.registryEntryCount,
    );
    assert.equal(summary.modelKindCount, manifest.inventory.modelKindCount);
    assert.equal(
      summary.validationRuleCount,
      manifest.inventory.validationRuleCount,
    );
    assert.equal(
      summary.manifestTotalEntryCount,
      manifest.inventory.totalEntryCount,
    );
    assert.equal(
      summary.totalEntryCount,
      KnowledgeGovernancePlatform.inventory.totalEntryCount,
    );
    assert.equal(summary.runtimeBehavior, "None");
    assert.equal(
      summary.nextPhase,
      "DKL-8:7 — Knowledge Governance Certification",
    );
    assert.equal(Object.isFrozen(summary), true);
  });
});
