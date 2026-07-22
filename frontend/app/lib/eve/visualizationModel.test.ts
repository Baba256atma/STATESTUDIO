import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicModel from "./visualizationModel.ts";
import {
  VisualizationModel, VisualizationModelId, VisualizationModelMetadata,
  VisualizationModelNamespace, VisualizationModelReadiness,
  VisualizationModelStatus, VisualizationModelVersion,
} from "./visualizationModel.ts";

const FILES = Object.freeze([
  "visualizationModelTypes.ts", "visualizationModelRelationships.ts",
  "visualizationModelDescriptors.ts", "visualizationModelPolicies.ts",
  "visualizationModelMetadata.ts", "visualizationModelInventory.ts",
  "visualizationModel.ts", "visualizationModel.test.ts",
]);

describe("EVE-1:3 Visualization Model", () => {
  it("adds exactly eight Model files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicModel).length, 8);
  });

  it("has canonical Model identity and readiness", () => {
    assert.equal(VisualizationModelId, "EVE-1:3/VisualizationModel");
    assert.equal(VisualizationModelVersion, "1.0.0");
    assert.equal(VisualizationModelNamespace, "nexora.eve.visualization.model");
    assert.equal(VisualizationModelStatus, "Model");
    assert.equal(VisualizationModelReadiness, "ReadyForValidation");
  });

  it("publishes eighteen immutable model descriptors", () => {
    assert.equal(VisualizationModel.descriptors.length, 18);
    assert.equal(new Set(VisualizationModel.descriptors.map(({ id }) => id)).size, 18);
    assert.ok(VisualizationModel.descriptors.every(Object.isFrozen));
    assert.ok(VisualizationModel.descriptors.every(
      (descriptor, index) => descriptor.deterministicOrder === index + 1,
    ));
  });

  it("defines all required canonical relationships", () => {
    assert.equal(VisualizationModel.relationships.length, 11);
    assert.equal(new Set(VisualizationModel.relationships.map(({ id }) => id)).size, 11);
    assert.ok(VisualizationModel.relationships.every(
      (relationship, index) => relationship.deterministicOrder === index + 1,
    ));
    assert.ok(VisualizationModel.relationships.every(({ runtimeReference }) => !runtimeReference));
  });

  it("derives inventories only through Registry", () => {
    assert.equal(VisualizationModel.inventory.modelCount, VisualizationModel.descriptors.length);
    assert.equal(VisualizationModel.inventory.relationshipCount, VisualizationModel.relationships.length);
    assert.equal(VisualizationModel.inventory.policyCount, VisualizationModel.policies.length);
    assert.equal(VisualizationModel.inventory.registryEntryCount, VisualizationModel.registry.inventory.registryEntryCount);
    assert.equal(VisualizationModel.inventory.reconstructsRegistryInventory, false);
    assert.equal(VisualizationModel.inventory.duplicatesRegistryMetadata, false);
  });

  it("consumes only Visualization Registry", () => {
    assert.equal(VisualizationModelMetadata.dependency.visualizationRegistryOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualizationFoundation/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable, strongly typed, and runtime-free", () => {
    assert.ok(Object.isFrozen(VisualizationModel));
    assert.ok(Object.isFrozen(VisualizationModelMetadata));
    assert.ok(Object.isFrozen(VisualizationModel.descriptors));
    assert.ok(Object.isFrozen(VisualizationModel.relationships));
    assert.equal(VisualizationModel.services, false);
    assert.equal(VisualizationModel.factories, false);
    assert.equal(VisualizationModel.execution, false);
    assert.equal(VisualizationModel.rendering, false);
  });
});
