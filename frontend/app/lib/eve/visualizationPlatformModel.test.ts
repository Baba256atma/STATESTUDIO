import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ModelExports from "./visualizationPlatformModel.ts";
import {
  VisualizationPlatformModelIdentityMetadata,
  VisualizationPlatformModelInventoryMetadata,
  VisualizationPlatformModelMetadata,
  VisualizationPlatformModelPlatform,
  VisualizationPlatformModelReadinessMetadata,
  getVisualizationPlatformModelCount,
  getVisualizationPlatformModelReleaseMetadata,
  getVisualizationPlatformModelSummary,
} from "./visualizationPlatformModel.ts";

const files = Object.freeze([
  "visualizationPlatformModel.test.ts", "visualizationPlatformModel.ts",
  "visualizationPlatformModelDescriptors.ts",
  "visualizationPlatformModelInventory.ts",
  "visualizationPlatformModelMetadata.ts", "visualizationPlatformModelPolicies.ts",
  "visualizationPlatformModelRelationships.ts",
  "visualizationPlatformModelTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:3 Visualization Platform Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ModelExports).sort(), [
      "VisualizationPlatformModelIdentityMetadata",
      "VisualizationPlatformModelInventoryMetadata",
      "VisualizationPlatformModelMetadata", "VisualizationPlatformModelPlatform",
      "VisualizationPlatformModelReadinessMetadata",
      "getVisualizationPlatformModelCount",
      "getVisualizationPlatformModelReleaseMetadata",
      "getVisualizationPlatformModelSummary",
    ].sort());
  });

  it("publishes canonical identity and Validation readiness", () => {
    assert.equal(VisualizationPlatformModelIdentityMetadata.id,
      "EVE-8:3/VisualizationPlatformModel");
    assert.equal(VisualizationPlatformModelIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.model");
    assert.equal(VisualizationPlatformModelReadinessMetadata.status,
      "ReadyForValidation");
  });

  it("publishes exactly eighteen immutable typed descriptors", () => {
    const { descriptors, registry } = VisualizationPlatformModelPlatform;
    assert.equal(descriptors.length, 18);
    assert.equal(new Set(descriptors.map(({ id }) => id)).size,
      descriptors.length);
    assert.ok(descriptors.every((descriptor, index) => Object.isFrozen(descriptor)
      && Object.isFrozen(descriptor.structuralMetadata)
      && descriptor.registryReference
        === registry.catalog[index % registry.catalog.length]
      && descriptor.categoryReference
        === registry.categories[index % registry.categories.length]
      && descriptor.moduleReference
        === registry.modules[index % registry.modules.length]
      && descriptor.deterministicOrder === index + 1
      && !descriptor.executableBehavior));
  });

  it("publishes exactly thirteen immutable relationships", () => {
    const relationships = VisualizationPlatformModelPlatform.relationships;
    assert.equal(relationships.length, 13);
    assert.equal(new Set(relationships.map(({ id }) => id)).size,
      relationships.length);
    assert.ok(relationships.every((relationship, index) =>
      Object.isFrozen(relationship)
      && relationship.deterministicOrder === index + 1
      && !relationship.orchestrationProvided
      && !relationship.traversalProvided && !relationship.resolutionProvided));
  });

  it("models exactly seven released modules by Registry reference", () => {
    const { composition, registry } = VisualizationPlatformModelPlatform;
    assert.equal(composition, registry.modules);
    assert.equal(composition.length, 7);
    assert.ok(composition.every((module) => module.release === "Released"));
  });

  it("preserves all Registry collections by canonical reference", () => {
    const { registry, inventory } = VisualizationPlatformModelPlatform;
    assert.equal(inventory.registryCatalog, registry.catalog);
    assert.equal(inventory.registryCollections, registry.collections);
    assert.equal(inventory.registryModules, registry.modules);
    assert.equal(inventory.registryCategories, registry.categories);
    assert.equal(inventory.registryPolicies, registry.policies);
    assert.equal(inventory.registryExtensions, registry.extensions);
    assert.equal(inventory.registryInventory, registry.inventory);
    assert.equal(inventory.registryFoundationReference, registry.foundation);
  });

  it("derives all Model inventory counts dynamically", () => {
    const inventory = VisualizationPlatformModelInventoryMetadata;
    assert.equal(inventory.counts.modelCount, inventory.models.length);
    assert.equal(inventory.counts.relationshipCount, inventory.relationships.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.compositionModuleCount,
      inventory.composition.length);
    assert.equal(getVisualizationPlatformModelCount(), inventory.models.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsRegistryCollections, false);
  });

  it("uses Registry as its only phase dependency", () => {
    assert.equal(VisualizationPlatformModelMetadata.dependency
      .visualizationPlatformRegistryOnly, true);
    const combined = sources.join("\n");
    const imports = [...combined.matchAll(/from ["']\.\/(.+?)["']/g)]
      .map((match) => match[1]!);
    assert.ok(imports.every((name) => name.startsWith("visualizationPlatform")));
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformFoundation/);
    assert.doesNotMatch(combined,
      /from ["']\.\/(?:sceneRendering|graphVisualization|timelineVisualization|chartMetricVisualization|dashboardExecutiveWorkspaceVisualization|animationEffects)/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationPlatformModelMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformModelPlatform));
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.renderPipeline, false);
    assert.equal(metadata.visualizationOrchestration, false);
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
    assert.equal(getVisualizationPlatformModelSummary().status,
      "ReadyForValidation");
    const release = getVisualizationPlatformModelReleaseMetadata();
    assert.equal(release.status, "ReadyForValidation");
    assert.equal(release.registryReference,
      "EVE-8:2/VisualizationPlatformRegistry");
  });
});
