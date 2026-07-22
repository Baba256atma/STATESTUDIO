import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicRegistry from "./visualizationRegistry.ts";
import {
  VisualizationRegistry, VisualizationRegistryId,
  VisualizationRegistryMetadata, VisualizationRegistryNamespace,
  VisualizationRegistryReadiness, VisualizationRegistryStatus,
  VisualizationRegistryVersion,
} from "./visualizationRegistry.ts";

const FILES = Object.freeze([
  "visualizationRegistryTypes.ts", "visualizationRegistryCatalog.ts",
  "visualizationRegistryInventory.ts", "visualizationRegistryPolicies.ts",
  "visualizationRegistryExtensions.ts", "visualizationRegistryMetadata.ts",
  "visualizationRegistry.ts", "visualizationRegistry.test.ts",
]);

const collections = Object.freeze([
  ...Object.values(VisualizationRegistry.catalog).filter(
    (value): value is Extract<typeof value, readonly unknown[]> => Array.isArray(value),
  ),
  VisualizationRegistry.extensions.extensionPointTypes,
]);

describe("EVE-1:2 Visualization Registry", () => {
  it("adds exactly eight Registry files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicRegistry).length, 8);
  });

  it("has canonical Registry identity and readiness", () => {
    assert.equal(VisualizationRegistryId, "EVE-1:2/VisualizationRegistry");
    assert.equal(VisualizationRegistryVersion, "1.0.0");
    assert.equal(VisualizationRegistryNamespace, "nexora.eve.visualization.registry");
    assert.equal(VisualizationRegistryStatus, "Registry");
    assert.equal(VisualizationRegistryReadiness, "ReadyForModel");
  });

  it("publishes all required canonical registries", () => {
    assert.equal(collections.length, 13);
    assert.ok(collections.every((collection) => collection.length > 0));
    assert.ok(collections.every(Object.isFrozen));
    assert.ok(collections.flat().every(Object.isFrozen));
  });

  it("uses stable unique identities and deterministic ordering", () => {
    const entries = collections.flat() as readonly { id: string; deterministicOrder: number }[];
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.ok(collections.every((collection) => collection.every(
      (entry, index) => (entry as { deterministicOrder: number }).deterministicOrder === index + 1,
    )));
  });

  it("derives inventory canonically from Foundation collections", () => {
    const inventory = VisualizationRegistry.inventory;
    assert.equal(inventory.foundationContractCount, VisualizationRegistry.foundation.contracts.length);
    assert.equal(inventory.categoryCount, VisualizationRegistry.catalog.categories.length);
    assert.equal(inventory.policyCount, VisualizationRegistry.policies.length);
    assert.equal(inventory.countsDerivedFromCanonicalCollections, true);
    assert.equal(inventory.reconstructsFoundationInventory, false);
    assert.equal(inventory.duplicatesFoundationMetadata, false);
  });

  it("consumes only Visualization Foundation", () => {
    assert.equal(VisualizationRegistryMetadata.dependency.visualizationFoundationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable, metadata-only, and runtime-free", () => {
    assert.ok(Object.isFrozen(VisualizationRegistry));
    assert.ok(Object.isFrozen(VisualizationRegistryMetadata));
    assert.ok(Object.isFrozen(VisualizationRegistry.inventory));
    assert.equal(VisualizationRegistry.services, false);
    assert.equal(VisualizationRegistry.factories, false);
    assert.equal(VisualizationRegistry.execution, false);
    assert.equal(VisualizationRegistry.rendering, false);
  });
});
