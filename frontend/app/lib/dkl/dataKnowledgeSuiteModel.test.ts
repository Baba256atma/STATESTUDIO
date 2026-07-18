/**
 * DKL-9:3 — Data Knowledge Suite Model Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Model.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./dataKnowledgeSuiteModel.ts";
import {
  DataKnowledgeSuiteModelId,
  DataKnowledgeSuiteModelName,
  DataKnowledgeSuiteModelNamespace,
  DataKnowledgeSuiteModelPlatform,
  DataKnowledgeSuiteModelReadiness,
  DataKnowledgeSuiteModelStatus,
  DataKnowledgeSuiteModelVersion,
  getDataKnowledgeSuiteModelSummary,
} from "./dataKnowledgeSuiteModel.ts";
import {
  DataKnowledgeSuiteRegistryId,
  DataKnowledgeSuiteRegistryPlatform,
} from "./dataKnowledgeSuiteRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL93_FILES = Object.freeze([
  "dataKnowledgeSuiteModelTypes.ts",
  "dataKnowledgeSuiteCompositionModels.ts",
  "dataKnowledgeSuiteReferenceModels.ts",
  "dataKnowledgeSuiteDependencyModels.ts",
  "dataKnowledgeSuiteReleaseModels.ts",
  "dataKnowledgeSuiteRelationshipModels.ts",
  "dataKnowledgeSuiteModel.ts",
  "dataKnowledgeSuiteModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteModelId",
  "DataKnowledgeSuiteModelVersion",
  "DataKnowledgeSuiteModelName",
  "DataKnowledgeSuiteModelNamespace",
  "DataKnowledgeSuiteModelStatus",
  "DataKnowledgeSuiteModelReadiness",
  "DataKnowledgeSuiteModelPlatform",
  "getDataKnowledgeSuiteModelSummary",
] as const);

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "ContainsCapability",
  "DependsOnCapability",
  "ReferencesPlatform",
  "ReferencesApiRegistry",
  "UsesContract",
  "UsesIntegrationContract",
  "UsesBoundary",
  "UsesOwnership",
  "SupersedesRelease",
  "ProducesSnapshot",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:3 Data Knowledge Suite Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(DKL93_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL93_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, ModelDefined status, and ReadyForValidation", () => {
    assert.equal(DataKnowledgeSuiteModelId, "DKL-9:3/DataKnowledgeSuiteModel");
    assert.equal(DataKnowledgeSuiteModelVersion, "1.0.0");
    assert.equal(DataKnowledgeSuiteModelName, "Data Knowledge Suite Model");
    assert.equal(
      DataKnowledgeSuiteModelNamespace,
      "nexora.dkl.data-knowledge-suite.model",
    );
    assert.equal(DataKnowledgeSuiteModelStatus, "ModelDefined");
    assert.equal(DataKnowledgeSuiteModelReadiness, "ReadyForValidation");
    assert.equal(
      DataKnowledgeSuiteModelPlatform.nextPhase,
      "DKL-9:4 — Data Knowledge Suite Validation",
    );
  });

  it("consumes only Registry with no Foundation, Public Index, or DKL-1…DKL-8 imports", () => {
    const dependency = DataKnowledgeSuiteModelPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "dataKnowledgeSuiteRegistry.ts",
    );
    assert.equal(dependency.registryOnly, true);
    assert.equal(dependency.registryId, DataKnowledgeSuiteRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.dkl1DirectImport, false);
    assert.equal(dependency.dkl8DirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.reconstructsUpstreamModels, false);
    assert.equal(dependency.duplicatesUpstreamModels, false);
    assert.equal(
      DataKnowledgeSuiteModelPlatform.registry,
      DataKnowledgeSuiteRegistryPlatform,
    );
  });

  it("models suite composition with expected model and relationship counts", () => {
    const platform = DataKnowledgeSuiteModelPlatform;
    assert.equal(platform.modelKinds.length, 16);
    assertUnique(
      platform.modelKinds.map((item) => item.modelKind),
      "model kinds",
    );
    assert.equal(platform.suite.length, 1);
    assert.equal(platform.capabilities.length, 8);
    assert.equal(platform.capabilityReferences.length, 8);
    assert.equal(platform.capabilityDependencies.length, 8);
    assert.equal(platform.capabilityOrdering.length, 8);
    assert.equal(platform.relationships.length, 10);
    assert.deepEqual(
      platform.relationships.map((item) => item.relationshipKind),
      [...EXPECTED_RELATIONSHIPS],
    );
    assert.ok(
      platform.relationships.every(
        (item) =>
          item.runtimeBehavior === "None" &&
          item.traversableAtRuntime === false,
      ),
    );
    assert.equal(platform.guarantees.length, 6);
  });

  it("preserves canonical Registry references without reconstruction", () => {
    const platform = DataKnowledgeSuiteModelPlatform;
    const registry = DataKnowledgeSuiteRegistryPlatform;

    assert.equal(platform.suite[0]!.capabilityOrder, registry.capabilityOrder);
    assert.equal(
      platform.capabilities[0]!.capabilityRegistration,
      registry.capabilities[0],
    );
    assert.equal(
      platform.capabilityReferences[0]!.capabilityReferenceRegistration,
      registry.capabilityReferences[0],
    );
    assert.equal(
      platform.capabilityDependencies[0]!.dependencyRegistration,
      registry.dependencies[0],
    );
    assert.equal(
      platform.publicPlatformReferences[0]!.publicPlatformRegistration,
      registry.publicPlatforms[0],
    );
    assert.equal(
      platform.publicApiRegistryReferences[0]!.publicApiRegistryRef,
      registry.publicApiRegistryRefs[0],
    );
    assert.equal(
      platform.integrationContractReferences[0]!
        .integrationContractRegistration,
      registry.integrationContracts[0],
    );
    assert.equal(platform.ownershipReferences[0]!.ownership, registry.ownership);
    assert.equal(
      platform.boundaryReferences[0]!.boundaries,
      registry.boundaries,
    );
    assert.equal(
      platform.releases[0]!.registryInventory,
      registry.inventory,
    );
    assert.equal(platform.snapshots[0]!.inventory, registry.inventory);
    assert.equal(platform.reconstructsUpstream, false);
    assert.equal(platform.duplicatesUpstreamModels, false);
  });

  it("satisfies Canonical Inventory Rule through Registry-derived counts", () => {
    const platform = DataKnowledgeSuiteModelPlatform;
    const registryInventory = DataKnowledgeSuiteRegistryPlatform.inventory;

    assert.equal(platform.inventory.sourcedThroughRegistry, true);
    assert.equal(platform.inventory.reconstructed, false);
    assert.equal(platform.inventory.hardcoded, false);
    assert.equal(platform.inventory.registryInventory, registryInventory);
    assert.equal(
      platform.inventory.publicApiInventoryTotal,
      registryInventory.publicApiInventoryTotal,
    );
    assert.equal(
      platform.inventory.registryTotalEntryCount,
      registryInventory.totalEntryCount,
    );
    assert.equal(platform.inventory.capabilityModelCount, 8);
    assert.equal(platform.inventory.modelKindCount, 16);
    assert.equal(platform.inventory.relationshipKindCount, 10);
  });

  it("exposes an immutable platform with ordered sections", () => {
    const platform = DataKnowledgeSuiteModelPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.modelKinds), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.deepEqual(
      [...platform.sectionOrder],
      Object.keys(platform).slice(0, platform.sectionCount),
    );
    assert.equal(platform.sectionCount, 23);
    assert.equal(platform.runtimeBehavior, false);
  });

  it("returns a deterministic summary and is ready for DKL-9:4", () => {
    const summaryA = getDataKnowledgeSuiteModelSummary();
    const summaryB = getDataKnowledgeSuiteModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, DataKnowledgeSuiteModelId);
    assert.equal(summaryA.status, "ModelDefined");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, DataKnowledgeSuiteRegistryId);
    assert.equal(summaryA.modelKindCount, 16);
    assert.equal(summaryA.relationshipKindCount, 10);
    assert.equal(summaryA.capabilityModelCount, 8);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      DataKnowledgeSuiteRegistryPlatform.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:4 — Data Knowledge Suite Validation",
    );
  });
});
