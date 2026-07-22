import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicRegistry from "./sceneRenderingRegistry.ts";
import {
  SceneRenderingRegistry, SceneRenderingRegistryId,
  SceneRenderingRegistryInventory, SceneRenderingRegistryMetadata,
  SceneRenderingRegistryNamespace, SceneRenderingRegistryReadiness,
  SceneRenderingRegistryVersion,
} from "./sceneRenderingRegistry.ts";

const FILES = Object.freeze([
  "sceneRenderingRegistryTypes.ts", "sceneRenderingRegistryCatalog.ts",
  "sceneRenderingRegistryInventory.ts", "sceneRenderingRegistryPolicies.ts",
  "sceneRenderingRegistryExtensions.ts", "sceneRenderingRegistryMetadata.ts",
  "sceneRenderingRegistry.ts", "sceneRenderingRegistry.test.ts",
]);

const collections = Object.freeze(
  Object.values(SceneRenderingRegistry.catalog).filter(
    (value): value is Extract<typeof value, readonly unknown[]> => Array.isArray(value),
  ),
);

describe("EVE-2:2 Scene Rendering Registry", () => {
  it("adds exactly eight Registry files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicRegistry).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(SceneRenderingRegistryId, "EVE-2:2/SceneRenderingRegistry");
    assert.equal(SceneRenderingRegistryVersion, "1.0.0");
    assert.equal(SceneRenderingRegistryNamespace, "nexora.eve.scene-rendering.registry");
    assert.equal(SceneRenderingRegistryReadiness, "ReadyForModel");
    assert.equal(SceneRenderingRegistryMetadata.foundationReference, "EVE-2:1/SceneRenderingFoundation");
  });

  it("publishes sixteen immutable vocabulary collections", () => {
    assert.equal(collections.length, 16);
    assert.ok(collections.every(Object.isFrozen));
    assert.ok(collections.every((collection) => collection.length > 0));
    assert.ok(collections.flat().every(Object.isFrozen));
  });

  it("uses unique identities, category keys, and deterministic ordering", () => {
    const vocabularyEntries = collections.slice(0, -1).flat() as readonly { id: string; key: string; category: string; deterministicOrder: number }[];
    assert.equal(new Set(vocabularyEntries.map(({ id }) => id)).size, vocabularyEntries.length);
    for (const collection of collections.slice(0, -1)) {
      const entries = collection as readonly { key: string; deterministicOrder: number }[];
      assert.equal(new Set(entries.map(({ key }) => key)).size, entries.length);
      assert.ok(entries.every((entry, index) => entry.deterministicOrder === index + 1));
    }
  });

  it("derives categories and entry references from Foundation", () => {
    const contractIds = new Set<string>(
      SceneRenderingRegistry.foundation.contracts.map(({ id }) => id),
    );
    assert.equal(SceneRenderingRegistry.catalog.registryCategoryTypes.length, SceneRenderingRegistry.foundation.contracts.length);
    assert.ok(SceneRenderingRegistry.catalog.registryCategoryTypes.every(
      (category, index) => contractIds.has(category.foundationReference)
      && category.deterministicOrder === index + 1 && Object.isFrozen(category.entryCollection),
    ));
    const vocabularyEntries = collections.slice(0, -1).flat() as readonly { foundationContractReference: string }[];
    assert.ok(vocabularyEntries.every(({ foundationContractReference }) => contractIds.has(foundationContractReference)));
  });

  it("derives inventory counts from immutable collections", () => {
    assert.equal(SceneRenderingRegistryInventory.registryCollectionCount, collections.length);
    assert.equal(SceneRenderingRegistryInventory.registryEntryCount, collections.reduce((sum, collection) => sum + collection.length, 0));
    assert.equal(SceneRenderingRegistryInventory.categoryCount, SceneRenderingRegistry.catalog.registryCategoryTypes.length);
    assert.equal(SceneRenderingRegistryInventory.preservesFoundationByReference, true);
    assert.equal(SceneRenderingRegistryInventory.hardcodesAggregateCounts, false);
    assert.equal(SceneRenderingRegistryInventory.duplicatesFoundationMetadata, false);
  });

  it("keeps extensions declarative and execution-free", () => {
    assert.equal(SceneRenderingRegistry.extensions.classifications.length, 12);
    assert.equal(SceneRenderingRegistry.extensions.loadsPlugins, false);
    assert.equal(SceneRenderingRegistry.extensions.executesExtensions, false);
    assert.ok(SceneRenderingRegistry.extensions.classifications.every(({ extensionClassification }) => extensionClassification));
  });

  it("consumes only Scene Rendering Foundation", () => {
    assert.equal(SceneRenderingRegistryMetadata.dependency.sceneRenderingFoundationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and has no runtime or rendering behavior", () => {
    assert.ok(Object.isFrozen(SceneRenderingRegistry));
    assert.ok(Object.isFrozen(SceneRenderingRegistryMetadata));
    assert.ok(Object.isFrozen(SceneRenderingRegistryInventory));
    assert.equal(SceneRenderingRegistry.rendering, false);
    assert.equal(SceneRenderingRegistry.frameGeneration, false);
    assert.equal(SceneRenderingRegistry.pipelineExecution, false);
    assert.equal(SceneRenderingRegistry.runtimeExecution, false);
    assert.equal(SceneRenderingRegistry.services, false);
    assert.equal(SceneRenderingRegistry.factories, false);
  });
});
