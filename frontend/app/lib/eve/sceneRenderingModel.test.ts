import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicModel from "./sceneRenderingModel.ts";
import {
  SceneRenderingModel, SceneRenderingModelId, SceneRenderingModelInventory,
  SceneRenderingModelMetadata, SceneRenderingModelNamespace,
  SceneRenderingModelReadiness, SceneRenderingModelVersion,
} from "./sceneRenderingModel.ts";

const FILES = Object.freeze([
  "sceneRenderingModelTypes.ts", "sceneRenderingModelRelationships.ts",
  "sceneRenderingModelDescriptors.ts", "sceneRenderingModelPolicies.ts",
  "sceneRenderingModelMetadata.ts", "sceneRenderingModelInventory.ts",
  "sceneRenderingModel.ts", "sceneRenderingModel.test.ts",
]);

describe("EVE-2:3 Scene Rendering Model", () => {
  it("adds exactly eight Model files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicModel).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(SceneRenderingModelId, "EVE-2:3/SceneRenderingModel");
    assert.equal(SceneRenderingModelVersion, "1.0.0");
    assert.equal(SceneRenderingModelNamespace, "nexora.eve.scene-rendering.model");
    assert.equal(SceneRenderingModelReadiness, "ReadyForValidation");
    assert.equal(SceneRenderingModelMetadata.registryReference, "EVE-2:2/SceneRenderingRegistry");
  });

  it("publishes eighteen unique immutable model descriptors", () => {
    assert.equal(SceneRenderingModel.descriptors.length, 18);
    assert.equal(new Set(SceneRenderingModel.descriptors.map(({ id }) => id)).size, 18);
    assert.ok(SceneRenderingModel.descriptors.every(Object.isFrozen));
    assert.ok(SceneRenderingModel.descriptors.every(
      (descriptor, index) => descriptor.deterministicOrder === index + 1));
  });

  it("publishes all thirteen immutable relationships", () => {
    assert.equal(SceneRenderingModel.relationships.length, 13);
    assert.equal(new Set(SceneRenderingModel.relationships.map(({ id }) => id)).size, 13);
    assert.ok(SceneRenderingModel.relationships.every(Object.isFrozen));
    assert.ok(SceneRenderingModel.relationships.every(
      (relationship, index) => relationship.deterministicOrder === index + 1
      && !relationship.graphExecution && !relationship.runtimeReference));
  });

  it("uses valid Registry and category references", () => {
    const registryIds = new Set<string>(
      Object.values(SceneRenderingModel.registry.catalog)
        .filter((value): value is Extract<typeof value, readonly unknown[]> => Array.isArray(value))
        .flatMap((collection) => collection.map((entry) => "id" in entry ? String(entry.id) : "")),
    );
    const categoryIds = new Set<string>(
      SceneRenderingModel.registry.catalog.registryCategoryTypes.map(({ id }) => id),
    );
    assert.ok(SceneRenderingModel.descriptors.every(({ registryReference }) => registryIds.has(registryReference)));
    assert.ok(SceneRenderingModel.descriptors.every(({ categoryReference }) => categoryIds.has(categoryReference)));
  });

  it("derives inventories exclusively from Registry", () => {
    assert.equal(SceneRenderingModelInventory.modelCount, SceneRenderingModel.descriptors.length);
    assert.equal(SceneRenderingModelInventory.relationshipCount, SceneRenderingModel.relationships.length);
    assert.equal(SceneRenderingModelInventory.registryCatalog, SceneRenderingModel.registry.catalog);
    assert.equal(SceneRenderingModelInventory.registryInventory, SceneRenderingModel.registry.inventory);
    assert.equal(SceneRenderingModelInventory.registryCollectionsPreservedByReference, true);
    assert.equal(SceneRenderingModelInventory.hardcodesInventoryTotals, false);
    assert.equal(SceneRenderingModelInventory.duplicatesRegistryMetadata, false);
  });

  it("consumes only Scene Rendering Registry", () => {
    assert.equal(SceneRenderingModelMetadata.dependency.sceneRenderingRegistryOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/sceneRenderingFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and has no runtime or rendering behavior", () => {
    assert.ok(Object.isFrozen(SceneRenderingModel));
    assert.ok(Object.isFrozen(SceneRenderingModelMetadata));
    assert.ok(Object.isFrozen(SceneRenderingModelInventory));
    assert.equal(SceneRenderingModel.rendering, false);
    assert.equal(SceneRenderingModel.frameGeneration, false);
    assert.equal(SceneRenderingModel.pipelineExecution, false);
    assert.equal(SceneRenderingModel.graphExecution, false);
    assert.equal(SceneRenderingModel.runtimeExecution, false);
    assert.equal(SceneRenderingModel.services, false);
    assert.equal(SceneRenderingModel.factories, false);
  });
});
