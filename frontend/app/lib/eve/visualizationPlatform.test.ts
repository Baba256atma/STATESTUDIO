import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicPlatform from "./visualizationPlatform.ts";
import {
  VisualizationPlatform, VisualizationPlatformId,
  VisualizationPlatformMetadata, VisualizationPlatformNamespace,
  VisualizationPlatformReadiness, VisualizationPlatformStatus,
  VisualizationPlatformVersion,
} from "./visualizationPlatform.ts";

const FILES = Object.freeze([
  "visualizationPlatformTypes.ts", "visualizationPlatformCapabilities.ts",
  "visualizationPlatformCompatibility.ts", "visualizationPlatformMetadata.ts",
  "visualizationPlatformInventory.ts", "visualizationPlatformGuarantees.ts",
  "visualizationPlatform.ts", "visualizationPlatform.test.ts",
]);

describe("EVE-1:6 Visualization Platform", () => {
  it("adds exactly eight Platform files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicPlatform).length, 8);
  });

  it("has canonical Platform identity and readiness", () => {
    assert.equal(VisualizationPlatformId, "EVE-1:6/VisualizationPlatform");
    assert.equal(VisualizationPlatformVersion, "1.0.0");
    assert.equal(VisualizationPlatformNamespace, "nexora.eve.visualization.platform");
    assert.equal(VisualizationPlatformStatus, "Platform");
    assert.equal(VisualizationPlatformReadiness, "ReadyForCertification");
  });

  it("composes the canonical EVE architecture through Manifest", () => {
    assert.deepEqual(VisualizationPlatform.metadata.composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
    ]);
    assert.ok(VisualizationPlatform.metadata.composition.every(
      (entry, index) => entry.deterministicOrder === index + 1,
    ));
  });

  it("publishes capabilities, guarantees, and compatibility", () => {
    assert.equal(VisualizationPlatform.capabilities.length, 10);
    assert.equal(VisualizationPlatform.guarantees.length, 12);
    assert.equal(VisualizationPlatform.compatibility.length, 8);
    assert.ok(VisualizationPlatform.capabilities.every((entry, index) => !entry.implementationProvided && entry.deterministicOrder === index + 1));
    assert.ok(VisualizationPlatform.guarantees.every(({ guaranteed }) => guaranteed));
    assert.ok(VisualizationPlatform.compatibility.every(({ compatible, runtimeCheck }) => compatible && !runtimeCheck));
  });

  it("preserves inventories exclusively from Manifest", () => {
    const inventory = VisualizationPlatform.inventory;
    assert.equal(inventory.manifestInventory, VisualizationPlatform.manifest.inventory);
    assert.equal(inventory.foundationInventory, VisualizationPlatform.manifest.inventory.foundationInventory);
    assert.equal(inventory.valuesForwardedFromManifest, true);
    assert.equal(inventory.recalculatesInventories, false);
    assert.equal(inventory.hardcodesInventoryCounts, false);
    assert.equal(inventory.duplicatesMetadata, false);
  });

  it("consumes only Visualization Manifest", () => {
    assert.equal(VisualizationPlatformMetadata.dependency.visualizationManifestOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry|Model|Validation)/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and exposes no executable behavior", () => {
    assert.ok(Object.isFrozen(VisualizationPlatform));
    assert.ok(Object.isFrozen(VisualizationPlatformMetadata));
    assert.ok(Object.isFrozen(VisualizationPlatform.inventory));
    assert.equal(VisualizationPlatform.execution, false);
    assert.equal(VisualizationPlatform.visualizationExecution, false);
    assert.equal(VisualizationPlatform.orchestration, false);
    assert.equal(VisualizationPlatform.rendering, false);
    assert.equal(VisualizationPlatform.services, false);
    assert.equal(VisualizationPlatform.factories, false);
  });
});
