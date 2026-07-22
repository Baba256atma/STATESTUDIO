import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ModelExports from "./visualizationSuiteModel.ts";
import {
  VisualizationSuiteModelIdentityMetadata,
  VisualizationSuiteModelInventoryMetadata,
  VisualizationSuiteModelMetadata,
  VisualizationSuiteModelPlatform,
  VisualizationSuiteModelReadinessMetadata,
  getVisualizationSuiteModelCount,
  getVisualizationSuiteModelReleaseMetadata,
  getVisualizationSuiteModelSummary,
} from "./visualizationSuiteModel.ts";

const files = Object.freeze([
  "visualizationSuiteModel.test.ts", "visualizationSuiteModel.ts",
  "visualizationSuiteModelDescriptors.ts",
  "visualizationSuiteModelInventory.ts",
  "visualizationSuiteModelMetadata.ts", "visualizationSuiteModelPolicies.ts",
  "visualizationSuiteModelRelationships.ts", "visualizationSuiteModelTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:3 Visualization Suite Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ModelExports).sort(), [
      "VisualizationSuiteModelIdentityMetadata",
      "VisualizationSuiteModelInventoryMetadata",
      "VisualizationSuiteModelMetadata", "VisualizationSuiteModelPlatform",
      "VisualizationSuiteModelReadinessMetadata",
      "getVisualizationSuiteModelCount",
      "getVisualizationSuiteModelReleaseMetadata",
      "getVisualizationSuiteModelSummary",
    ].sort());
  });

  it("publishes canonical identity and Validation readiness", () => {
    assert.equal(VisualizationSuiteModelIdentityMetadata.id,
      "EVE-9:3/VisualizationSuiteModel");
    assert.equal(VisualizationSuiteModelIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.model");
    assert.equal(VisualizationSuiteModelReadinessMetadata.status,
      "ReadyForValidation");
  });

  it("publishes exactly eighteen immutable typed descriptors", () => {
    const { descriptors, registry } = VisualizationSuiteModelPlatform;
    assert.equal(descriptors.length, 18);
    assert.equal(new Set(descriptors.map(({ id }) => id)).size,
      descriptors.length);
    assert.ok(descriptors.every((descriptor, index) => Object.isFrozen(descriptor)
      && Object.isFrozen(descriptor.structuralMetadata)
      && descriptor.registryReference
        === registry.catalog[index % registry.catalog.length]
      && descriptor.categoryReference
        === registry.categories[index % registry.categories.length]
      && descriptor.platformReference
        === registry.platforms[index % registry.platforms.length]
      && descriptor.publicIndexReference
        === registry.platforms[index % registry.platforms.length]!
          .publicIndexReference
      && descriptor.deterministicOrder === index + 1
      && !descriptor.executableBehavior));
  });

  it("publishes exactly thirteen immutable relationships", () => {
    const relationships = VisualizationSuiteModelPlatform.relationships;
    assert.equal(relationships.length, 13);
    assert.equal(new Set(relationships.map(({ id }) => id)).size,
      relationships.length);
    assert.ok(relationships.every((relationship, index) =>
      Object.isFrozen(relationship)
      && relationship.deterministicOrder === index + 1
      && !relationship.orchestrationProvided
      && !relationship.traversalProvided && !relationship.resolutionProvided));
  });

  it("models exactly eight released Public Indexes by Registry reference", () => {
    const { composition, registry } = VisualizationSuiteModelPlatform;
    assert.equal(composition, registry.platforms);
    assert.equal(composition.length, 8);
    assert.ok(composition.every((platform) => platform.release === "Released"));
  });

  it("preserves all Registry collections by canonical reference", () => {
    const { registry, inventory } = VisualizationSuiteModelPlatform;
    assert.equal(inventory.registryCatalog, registry.catalog);
    assert.equal(inventory.registryCollections, registry.collections);
    assert.equal(inventory.registryPlatforms, registry.platforms);
    assert.equal(inventory.registryPublicIndexes, registry.publicIndexes);
    assert.equal(inventory.registryCategories, registry.categories);
    assert.equal(inventory.registryPolicies, registry.policies);
    assert.equal(inventory.registryExtensions, registry.extensions);
    assert.equal(inventory.registryInventory, registry.inventory);
    assert.equal(inventory.registryFoundationReference, registry.foundation);
  });

  it("derives all Model inventory counts dynamically", () => {
    const inventory = VisualizationSuiteModelInventoryMetadata;
    assert.equal(inventory.counts.modelCount, inventory.models.length);
    assert.equal(inventory.counts.relationshipCount,
      inventory.relationships.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.compositionPlatformCount,
      inventory.composition.length);
    assert.equal(getVisualizationSuiteModelCount(), inventory.models.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsRegistryCollections, false);
  });

  it("uses Registry as its only phase dependency", () => {
    assert.equal(VisualizationSuiteModelMetadata.dependency
      .visualizationSuiteRegistryOnly, true);
    const combined = sources.join("\n");
    const imports = [...combined.matchAll(/from ["']\.\/(.+?)["']/g)]
      .map((match) => match[1]!);
    assert.ok(imports.every((name) => name.startsWith("visualizationSuite")));
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationSuiteModelMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteModelPlatform));
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.renderPipeline, false);
    assert.equal(metadata.visualizationOrchestration, false);
    assert.equal(metadata.runtimeComposition, false);
    assert.equal(metadata.graphExecution, false);
    assert.equal(metadata.timelineExecution, false);
    assert.equal(metadata.dashboardExecution, false);
    assert.equal(metadata.animationExecution, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuiteModelSummary().status,
      "ReadyForValidation");
    const release = getVisualizationSuiteModelReleaseMetadata();
    assert.equal(release.status, "ReadyForValidation");
    assert.equal(release.registryReference,
      "EVE-9:2/VisualizationSuiteRegistry");
  });
});
