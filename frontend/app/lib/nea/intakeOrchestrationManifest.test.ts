/**
 * NEA-7:5 — Intake Orchestration Manifest Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./intakeOrchestrationManifest.ts";
import {
  IntakeOrchestrationManifestId,
  IntakeOrchestrationManifestName,
  IntakeOrchestrationManifestNamespace,
  IntakeOrchestrationManifestPlatform,
  IntakeOrchestrationManifestReadiness,
  IntakeOrchestrationManifestStatus,
  IntakeOrchestrationManifestVersion,
  getIntakeOrchestrationManifestSummary,
} from "./intakeOrchestrationManifest.ts";
import {
  IntakeOrchestrationValidationId,
  IntakeOrchestrationValidationPlatform,
} from "./intakeOrchestrationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA75_FILES = Object.freeze([
  "intakeOrchestrationManifestTypes.ts",
  "intakeOrchestrationManifestInventory.ts",
  "intakeOrchestrationManifestMetadata.ts",
  "intakeOrchestrationManifestOwnership.ts",
  "intakeOrchestrationManifestReadiness.ts",
  "intakeOrchestrationManifestSummary.ts",
  "intakeOrchestrationManifest.ts",
  "intakeOrchestrationManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationManifestId",
  "IntakeOrchestrationManifestVersion",
  "IntakeOrchestrationManifestName",
  "IntakeOrchestrationManifestNamespace",
  "IntakeOrchestrationManifestStatus",
  "IntakeOrchestrationManifestReadiness",
  "IntakeOrchestrationManifestPlatform",
  "getIntakeOrchestrationManifestSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const EXPECTED_INVENTORY_KEYS = Object.freeze([
  "foundationContracts",
  "foundationCapabilities",
  "foundationLifecycle",
  "intakeIdentities",
  "registryCategories",
  "registryPriorities",
  "registryStatuses",
  "registryReferenceTypes",
  "registryMetadataFields",
  "registryPolicies",
  "domainModels",
  "modelRelationships",
  "modelLifecycle",
  "validationCategories",
  "validationRules",
  "validationPolicies",
  "validationRelationships",
  "ownership",
  "publicExports",
  "architectureTotals",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-7:5 Intake Orchestration Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA75_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA75_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical manifest identity, status Manifest, and ReadyForPlatform", () => {
    assert.equal(
      IntakeOrchestrationManifestId,
      "NEA-7:5/IntakeOrchestrationManifest",
    );
    assert.equal(IntakeOrchestrationManifestVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationManifestName,
      "Intake Orchestration Manifest",
    );
    assert.equal(
      IntakeOrchestrationManifestNamespace,
      "nexora.nea.intake-orchestration.manifest",
    );
    assert.equal(IntakeOrchestrationManifestStatus, "Manifest");
    assert.equal(IntakeOrchestrationManifestReadiness, "ReadyForPlatform");
    assert.equal(IntakeOrchestrationManifestPlatform.identity.phase, "NEA-7:5");
    assert.equal(
      IntakeOrchestrationManifestPlatform.identity.validationId,
      IntakeOrchestrationValidationId,
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.nextPhase,
      "NEA-7:6 — Intake Orchestration Platform",
    );
  });

  it("consumes only NEA-7:4 Validation and preserves the canonical phase chain", () => {
    const dependency = IntakeOrchestrationManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationValidation.ts",
    );
    assert.equal(dependency.validationId, IntakeOrchestrationValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      IntakeOrchestrationManifestPlatform.validationPlatform,
      IntakeOrchestrationValidationPlatform,
    );

    const phases = IntakeOrchestrationManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.deepEqual(
      phases.map((item) => item.module),
      [
        "intakeOrchestrationFoundation.ts",
        "intakeOrchestrationRegistry.ts",
        "intakeOrchestrationModel.ts",
        "intakeOrchestrationValidation.ts",
      ],
    );
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));
  });

  it("publishes exactly twenty derived inventory entries totaling 323", () => {
    const validation = IntakeOrchestrationValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;
    const { inventory } = IntakeOrchestrationManifestPlatform;
    const entries = inventory.inventory;

    assert.equal(inventory.inventoryEntryCount, 20);
    assert.deepEqual(
      entries.map((item) => item.inventoryKey),
      [...EXPECTED_INVENTORY_KEYS],
    );
    assertUnique(
      entries.map((item) => item.inventoryKey),
      "inventory keys",
    );

    const expectedCounts = Object.freeze({
      foundationContracts: foundation.contracts.contractCount,
      foundationCapabilities: foundation.capabilities.capabilityCount,
      foundationLifecycle: foundation.lifecycle.stateCount,
      intakeIdentities: registry.collections.intakeIdentityCount,
      registryCategories: registry.collections.categoryCount,
      registryPriorities: registry.collections.priorityCount,
      registryStatuses: registry.collections.statusCount,
      registryReferenceTypes: registry.collections.referenceTypeCount,
      registryMetadataFields: registry.collections.metadataFieldCount,
      registryPolicies: registry.policies.policyCount,
      domainModels: model.domainModels.modelCount,
      modelRelationships: model.relationships.relationshipCount,
      modelLifecycle: model.lifecycle.stateCount,
      validationCategories: validation.rules.domainCategoryCount,
      validationRules: validation.rules.ruleCount,
      validationPolicies: validation.policies.policyCount,
      validationRelationships: validation.relationships.relationshipCount,
      ownership:
        foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      publicExports:
        foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      architectureTotals:
        foundation.references.referenceGroupCount +
        foundation.attachments.attachmentKindCount,
    });

    for (const entry of entries) {
      assert.equal(
        entry.count,
        expectedCounts[entry.inventoryKey as keyof typeof expectedCounts],
        entry.inventoryKey,
      );
      assert.equal(entry.hardcoded, false);
      assert.equal(entry.reconstructed, false);
      assert.equal(entry.ownership, "Referenced");
    }

    const derivedTotal = entries.reduce((total, entry) => total + entry.count, 0);
    assert.equal(inventory.totalArchitectureCount, derivedTotal);
    assert.equal(inventory.totalArchitectureCount, 323);
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);
  });

  it("declares ownership counts and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = IntakeOrchestrationManifestPlatform;
    assert.equal(ownership.ownsCount, 6);
    assert.equal(ownership.doesNotOwnCount, 15);
    assert.equal(boundaries.prohibitedSurfaceCount, 24);
    assert.ok(ownership.owns.includes("Architectural Inventory"));
    assert.ok(ownership.owns.includes("Manifest Platform"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Orchestration"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeOrchestration, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = IntakeOrchestrationManifestPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.inventory.inventory), true);
    assert.equal(Object.isFrozen(platform.phaseReferences), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
    assert.equal(Object.isFrozen(platform.summary), true);
  });

  it("derives deterministic summary from canonical inventory collections", () => {
    const summaryA = getIntakeOrchestrationManifestSummary();
    const summaryB = getIntakeOrchestrationManifestSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, IntakeOrchestrationManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, IntakeOrchestrationValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.totalArchitectureCount, 323);
    assert.equal(summaryA.ownershipCount, 6);
    assert.equal(summaryA.nonOwnershipCount, 15);
    assert.equal(summaryA.prohibitedSurfaceCount, 24);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:6 — Intake Orchestration Platform",
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.metadata.architectureVersion,
      "NEA-7.0.0",
    );
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.readiness
        .architectureCompleteThroughValidation,
      true,
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(IntakeOrchestrationManifestPlatform.runtimeBehavior, false);
    assert.equal(IntakeOrchestrationManifestPlatform.validationExecution, false);
    assert.equal(
      IntakeOrchestrationManifestPlatform.implementsRuntimeOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationManifestPlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationManifestPlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationManifestPlatform.implementsRouting, false);
  });
});
