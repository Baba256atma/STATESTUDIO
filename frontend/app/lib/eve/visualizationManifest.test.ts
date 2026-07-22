import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicManifest from "./visualizationManifest.ts";
import {
  VisualizationManifest, VisualizationManifestId,
  VisualizationManifestMetadata, VisualizationManifestNamespace,
  VisualizationManifestReadinessStatus, VisualizationManifestStatus,
  VisualizationManifestVersion,
} from "./visualizationManifest.ts";

const FILES = Object.freeze([
  "visualizationManifestTypes.ts", "visualizationManifestInventory.ts",
  "visualizationManifestGuarantees.ts", "visualizationManifestReadiness.ts",
  "visualizationManifestMetadata.ts", "visualizationManifestCompatibility.ts",
  "visualizationManifest.ts", "visualizationManifest.test.ts",
]);

describe("EVE-1:5 Visualization Manifest", () => {
  it("adds exactly eight Manifest files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicManifest).length, 8);
  });

  it("has canonical Manifest identity and readiness", () => {
    assert.equal(VisualizationManifestId, "EVE-1:5/VisualizationManifest");
    assert.equal(VisualizationManifestVersion, "1.0.0");
    assert.equal(VisualizationManifestNamespace, "nexora.eve.visualization.manifest");
    assert.equal(VisualizationManifestStatus, "Manifest");
    assert.equal(VisualizationManifestReadinessStatus, "ReadyForPlatform");
  });

  it("preserves canonical upstream inventories by reference", () => {
    const inventory = VisualizationManifest.inventory;
    assert.equal(inventory.validationInventory, VisualizationManifest.validation.inventory);
    assert.equal(inventory.modelInventory, VisualizationManifest.validation.model.inventory);
    assert.equal(inventory.registryInventory, VisualizationManifest.validation.model.registry.inventory);
    assert.equal(inventory.foundationInventory, VisualizationManifest.validation.model.registry.foundation.inventory);
    assert.equal(inventory.valuesForwardedFromValidationChain, true);
    assert.equal(inventory.recalculatesInventories, false);
    assert.equal(inventory.hardcodesInventoryCounts, false);
  });

  it("publishes deterministic guarantees and readiness", () => {
    assert.equal(VisualizationManifest.guarantees.length, 12);
    assert.equal(VisualizationManifest.readiness.length, 7);
    assert.ok(VisualizationManifest.guarantees.every((entry, index) => entry.guaranteed && entry.deterministicOrder === index + 1));
    assert.ok(VisualizationManifest.readiness.every((entry, index) => entry.ready && entry.deterministicOrder === index + 1));
  });

  it("publishes canonical phase composition and compatibility", () => {
    assert.deepEqual(VisualizationManifest.metadata.phaseComposition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest",
    ]);
    assert.ok(VisualizationManifest.compatibility.every((entry, index) => entry.compatible && entry.deterministicOrder === index + 1));
  });

  it("consumes only Visualization Validation", () => {
    assert.equal(VisualizationManifestMetadata.dependency.visualizationValidationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry|Model)/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and exposes no executable behavior", () => {
    assert.ok(Object.isFrozen(VisualizationManifest));
    assert.ok(Object.isFrozen(VisualizationManifestMetadata));
    assert.ok(Object.isFrozen(VisualizationManifest.inventory));
    assert.equal(VisualizationManifest.execution, false);
    assert.equal(VisualizationManifest.validationEngine, false);
    assert.equal(VisualizationManifest.orchestration, false);
    assert.equal(VisualizationManifest.rendering, false);
    assert.equal(VisualizationManifest.services, false);
    assert.equal(VisualizationManifest.factories, false);
  });
});
