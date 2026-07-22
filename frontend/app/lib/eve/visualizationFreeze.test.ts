import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFreeze from "./visualizationFreeze.ts";
import {
  VisualizationFreeze, VisualizationFreezeId, VisualizationFreezeLockId,
  VisualizationFreezeNamespace, VisualizationFreezeReadiness,
  VisualizationFreezeStatus, VisualizationFreezeVersion,
} from "./visualizationFreeze.ts";

const FILES = Object.freeze([
  "visualizationFreezeTypes.ts", "visualizationFreezeRegistry.ts",
  "visualizationFreezeBaselines.ts", "visualizationFreezeCompatibility.ts",
  "visualizationFreezeLocks.ts", "visualizationFreezeExtensions.ts",
  "visualizationFreeze.ts", "visualizationFreeze.test.ts",
]);

describe("EVE-1:8 Visualization Freeze", () => {
  it("adds exactly eight Freeze files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicFreeze).length, 8);
  });

  it("has canonical Frozen identity, lock, and readiness", () => {
    assert.equal(VisualizationFreezeId, "EVE-1:8/VisualizationFreeze");
    assert.equal(VisualizationFreezeVersion, "1.0.0");
    assert.equal(VisualizationFreezeNamespace, "nexora.eve.visualization.freeze");
    assert.equal(VisualizationFreezeStatus, "Frozen");
    assert.equal(VisualizationFreezeLockId, "EVE-1-VISUALIZATION-LOCKED");
    assert.equal(VisualizationFreezeReadiness, "ReadyForPublicIndex");
  });

  it("publishes all deterministic architectural locks", () => {
    assert.equal(VisualizationFreeze.locks.length, 12);
    assert.ok(VisualizationFreeze.locks.every((entry, index) =>
      entry.deterministicOrder === index + 1
      && entry.lockIdentifier === VisualizationFreezeLockId
      && entry.status === "Locked" && !entry.runtimeLocking));
  });

  it("preserves all certified baselines by canonical reference", () => {
    assert.equal(VisualizationFreeze.baselines.length, 8);
    assert.ok(VisualizationFreeze.baselines.every((entry, index) =>
      entry.preservedByReference && entry.deterministicOrder === index + 1));
    assert.equal(VisualizationFreeze.baselines[0]!.canonicalReference, VisualizationFreeze.certification.platform);
  });

  it("preserves canonical registry, inventory, and compatibility", () => {
    assert.deepEqual(VisualizationFreeze.registry.entries.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification",
    ]);
    assert.equal(VisualizationFreeze.inventory, VisualizationFreeze.certification.inventory);
    assert.equal(VisualizationFreeze.registry.inventoryPreservedByReference, true);
    assert.equal(VisualizationFreeze.registry.recalculatesInventory, false);
    assert.ok(VisualizationFreeze.compatibility.every(({ preservedByReference }) => preservedByReference));
  });

  it("consumes only Visualization Certification", () => {
    assert.equal(VisualizationFreeze.dependency.visualizationCertificationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry|Model|Validation|Manifest|Platform)/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and has no runtime freeze behavior", () => {
    assert.ok(Object.isFrozen(VisualizationFreeze));
    assert.ok(Object.isFrozen(VisualizationFreeze.registry));
    assert.ok(Object.isFrozen(VisualizationFreeze.locks));
    assert.equal(VisualizationFreeze.runtimeLocking, false);
    assert.equal(VisualizationFreeze.freezeManagement, false);
    assert.equal(VisualizationFreeze.execution, false);
    assert.equal(VisualizationFreeze.rendering, false);
    assert.equal(VisualizationFreeze.services, false);
    assert.equal(VisualizationFreeze.factories, false);
  });
});
