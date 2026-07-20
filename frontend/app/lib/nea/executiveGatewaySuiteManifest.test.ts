/**
 * NEA-8:5 — Executive Gateway Suite Manifest Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./executiveGatewaySuiteManifest.ts";
import {
  ExecutiveGatewaySuiteManifestId,
  ExecutiveGatewaySuiteManifestName,
  ExecutiveGatewaySuiteManifestNamespace,
  ExecutiveGatewaySuiteManifestPlatform,
  ExecutiveGatewaySuiteManifestReadiness,
  ExecutiveGatewaySuiteManifestStatus,
  ExecutiveGatewaySuiteManifestVersion,
  getExecutiveGatewaySuiteManifestSummary,
} from "./executiveGatewaySuiteManifest.ts";
import {
  ExecutiveGatewaySuiteValidationId,
  ExecutiveGatewaySuiteValidationPlatform,
} from "./executiveGatewaySuiteValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA85_FILES = Object.freeze([
  "executiveGatewaySuiteManifestTypes.ts",
  "executiveGatewaySuiteManifestInventory.ts",
  "executiveGatewaySuiteManifestMetadata.ts",
  "executiveGatewaySuiteManifestOwnership.ts",
  "executiveGatewaySuiteManifestReadiness.ts",
  "executiveGatewaySuiteManifestSummary.ts",
  "executiveGatewaySuiteManifest.ts",
  "executiveGatewaySuiteManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteManifestId",
  "ExecutiveGatewaySuiteManifestVersion",
  "ExecutiveGatewaySuiteManifestName",
  "ExecutiveGatewaySuiteManifestNamespace",
  "ExecutiveGatewaySuiteManifestStatus",
  "ExecutiveGatewaySuiteManifestReadiness",
  "ExecutiveGatewaySuiteManifestPlatform",
  "getExecutiveGatewaySuiteManifestSummary",
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
  "suiteComponents",
  "foundationContracts",
  "foundationCapabilities",
  "foundationLifecycle",
  "componentIdentities",
  "registryDependencies",
  "registryStatuses",
  "registryPolicies",
  "domainModels",
  "suiteComponentModels",
  "modelRelationships",
  "modelLifecycle",
  "validationCategories",
  "validationRules",
  "validationPolicies",
  "validationRelationships",
  "ownership",
  "publicExports",
  "phaseReferences",
  "publicApiInventory",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-8:5 Executive Gateway Suite Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA85_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA85_FILES) {
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
      ExecutiveGatewaySuiteManifestId,
      "NEA-8:5/ExecutiveGatewaySuiteManifest",
    );
    assert.equal(ExecutiveGatewaySuiteManifestVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteManifestName,
      "Executive Gateway Suite Manifest",
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestNamespace,
      "nexora.nea.executive-gateway-suite.manifest",
    );
    assert.equal(ExecutiveGatewaySuiteManifestStatus, "Manifest");
    assert.equal(ExecutiveGatewaySuiteManifestReadiness, "ReadyForPlatform");
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.identity.phase,
      "NEA-8:5",
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.identity.validationId,
      ExecutiveGatewaySuiteValidationId,
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.nextPhase,
      "NEA-8:6 — Executive Gateway Suite Platform",
    );
  });

  it("consumes only NEA-8:4 Validation and preserves the canonical phase chain", () => {
    const dependency = ExecutiveGatewaySuiteManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuiteValidation.ts",
    );
    assert.equal(dependency.validationId, ExecutiveGatewaySuiteValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.validationPlatform,
      ExecutiveGatewaySuiteValidationPlatform,
    );

    const phases = ExecutiveGatewaySuiteManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.deepEqual(
      phases.map((item) => item.module),
      [
        "executiveGatewaySuiteFoundation.ts",
        "executiveGatewaySuiteRegistry.ts",
        "executiveGatewaySuiteModel.ts",
        "executiveGatewaySuiteValidation.ts",
      ],
    );
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));

    const validation = ExecutiveGatewaySuiteValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;
    assert.equal(phases[0]!.phaseId, foundation.identity.foundationId);
    assert.equal(phases[1]!.phaseId, registry.identity.registryId);
    assert.equal(phases[2]!.phaseId, model.identity.modelId);
    assert.equal(phases[3]!.phaseId, validation.identity.validationId);
  });

  it("publishes twenty derived inventory entries with canonical public API inventory of 532", () => {
    const validation = ExecutiveGatewaySuiteValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;
    const { inventory } = ExecutiveGatewaySuiteManifestPlatform;
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

    const byKey = Object.fromEntries(
      entries.map((item) => [item.inventoryKey, item.count]),
    );
    assert.equal(byKey.suiteComponents, foundation.composition.componentCount);
    assert.equal(byKey.foundationContracts, foundation.contracts.contractCount);
    assert.equal(
      byKey.foundationCapabilities,
      foundation.capabilities.capabilityCount,
    );
    assert.equal(byKey.foundationLifecycle, foundation.lifecycle.stateCount);
    assert.equal(
      byKey.componentIdentities,
      registry.collections.componentIdentityCount,
    );
    assert.equal(
      byKey.registryDependencies,
      registry.collections.dependencyCount,
    );
    assert.equal(byKey.registryStatuses, registry.collections.statusCount);
    assert.equal(byKey.registryPolicies, registry.policies.policyCount);
    assert.equal(byKey.domainModels, model.domainModels.modelCount);
    assert.equal(
      byKey.suiteComponentModels,
      model.domainModels.suiteComponentModelCount,
    );
    assert.equal(
      byKey.modelRelationships,
      model.relationships.relationshipCount,
    );
    assert.equal(byKey.modelLifecycle, model.lifecycle.stateCount);
    assert.equal(
      byKey.validationCategories,
      validation.rules.domainCategoryCount,
    );
    assert.equal(byKey.validationRules, validation.rules.ruleCount);
    assert.equal(byKey.validationPolicies, validation.policies.policyCount);
    assert.equal(
      byKey.validationRelationships,
      validation.relationships.relationshipCount,
    );
    assert.equal(
      byKey.ownership,
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
    );
    assert.equal(
      byKey.publicExports,
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
    );
    assert.equal(byKey.phaseReferences, 4);
    assert.equal(byKey.publicApiInventory, 532);
    assert.equal(
      byKey.publicApiInventory,
      validation.metadata.publicApiInventoryTotal,
    );
    assert.equal(inventory.publicApiInventoryTotal, 532);

    const expectedTotal = entries.reduce((sum, item) => sum + item.count, 0);
    assert.equal(inventory.totalArchitectureCount, expectedTotal);
    assert.ok(entries.every((item) => item.hardcoded === false));
    assert.ok(entries.every((item) => item.reconstructed === false));
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.metadata.canonicalReferenceMode,
      "ValidationChainOnly",
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewaySuiteManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Identity"));
    assert.ok(ownership.owns.includes("Architecture Inventory"));
    assert.ok(ownership.owns.includes("Manifest Summary"));
    assert.ok(ownership.doesNotOwn.includes("Foundation"));
    assert.ok(ownership.doesNotOwn.includes("Registry"));
    assert.ok(ownership.doesNotOwn.includes("Model"));
    assert.ok(ownership.doesNotOwn.includes("Validation"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsFoundation, false);
    assert.equal(ownership.ownsValidation, false);
    assert.equal(ownership.ownsRuntimeGateway, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeGateway, false);
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.modelDirectImport, false);
    assert.equal(boundaries.registryDirectImport, false);
    assert.equal(boundaries.foundationDirectImport, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteManifestPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.phaseReferences), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
    assert.equal(Object.isFrozen(platform.summary), true);
  });

  it("derives deterministic summary with public API inventory of 532", () => {
    const summaryA = getExecutiveGatewaySuiteManifestSummary();
    const summaryB = getExecutiveGatewaySuiteManifestSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, ExecutiveGatewaySuiteManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, ExecutiveGatewaySuiteValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(
      summaryA.totalArchitectureCount,
      ExecutiveGatewaySuiteManifestPlatform.inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      ExecutiveGatewaySuiteValidationPlatform.metadata.publicApiInventoryTotal,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:6 — Executive Gateway Suite Platform",
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.readiness.evaluatesRuntimeReadiness,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteManifestPlatform.runtimeBehavior, false);
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.validationExecution,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.implementsRuntimeConnectors,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteManifestPlatform.invokesDkl, false);
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.invokesExecutiveEngine,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteManifestPlatform.invokesAssistant,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteManifestPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewaySuiteManifestPlatform.businessLogic, false);
  });
});
