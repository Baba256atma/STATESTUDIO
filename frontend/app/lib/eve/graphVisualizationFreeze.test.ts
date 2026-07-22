import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFreeze from "./graphVisualizationFreeze.ts";
import {
  getGraphVisualizationFreezeCount, getGraphVisualizationFreezeReleaseMetadata,
  getGraphVisualizationFreezeSummary, GraphVisualizationFreeze,
  GraphVisualizationFreezeIdentity, GraphVisualizationFreezeInventory,
  GraphVisualizationFreezeMetadata, GraphVisualizationFreezeReadiness,
} from "./graphVisualizationFreeze.ts";

const FILES = Object.freeze([
  "graphVisualizationFreezeTypes.ts", "graphVisualizationFreezeRegistry.ts",
  "graphVisualizationFreezeBaselines.ts", "graphVisualizationFreezeCompatibility.ts",
  "graphVisualizationFreezeLocks.ts", "graphVisualizationFreezeExtensions.ts",
  "graphVisualizationFreeze.ts", "graphVisualizationFreeze.test.ts",
]);

describe("EVE-3:8 Graph Visualization Freeze", () => {
  it("adds exactly eight Freeze files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicFreeze).length, 8);
  });

  it("publishes the canonical frozen identity, lock, and readiness", () => {
    assert.equal(GraphVisualizationFreezeIdentity.id, "EVE-3:8/GraphVisualizationFreeze");
    assert.equal(GraphVisualizationFreezeIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationFreezeIdentity.namespace,
      "nexora.eve.graph-visualization.freeze");
    assert.equal(GraphVisualizationFreezeMetadata.status, "Frozen");
    assert.equal(GraphVisualizationFreezeIdentity.lockId,
      "EVE-3-GRAPH-VISUALIZATION-LOCKED");
    assert.equal(GraphVisualizationFreezeReadiness.readiness, "ReadyForPublicIndex");
    assert.equal(GraphVisualizationFreezeMetadata.certificationReference,
      "EVE-3:7/GraphVisualizationCertification");
  });

  it("publishes exact immutable Freeze collections", () => {
    assert.equal(GraphVisualizationFreeze.locks.length, 12);
    assert.equal(GraphVisualizationFreeze.baselines.length, 8);
    assert.equal(GraphVisualizationFreeze.compatibility.length, 8);
    assert.equal(GraphVisualizationFreeze.extensions.length, 8);
    assert.equal(GraphVisualizationFreeze.registry.length, 7);
    for (const collection of [GraphVisualizationFreeze.locks,
      GraphVisualizationFreeze.baselines, GraphVisualizationFreeze.compatibility,
      GraphVisualizationFreeze.extensions, GraphVisualizationFreeze.registry]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) =>
        Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Certification collections by reference", () => {
    const { certification, inventory } = GraphVisualizationFreeze;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility, certification.compatibility);
    assert.equal(GraphVisualizationFreeze.registry[6]!.canonicalReference, certification);
    assert.equal(GraphVisualizationFreeze.baselines[6]!.canonicalReference, certification);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const { counts } = GraphVisualizationFreezeInventory;
    assert.equal(counts.lockCount, GraphVisualizationFreeze.locks.length);
    assert.equal(counts.baselineCount, GraphVisualizationFreeze.baselines.length);
    assert.equal(counts.compatibilityCount, GraphVisualizationFreeze.compatibility.length);
    assert.equal(counts.extensionCount, GraphVisualizationFreeze.extensions.length);
    assert.equal(counts.registryEntryCount, GraphVisualizationFreeze.registry.length);
    assert.equal(getGraphVisualizationFreezeCount(), GraphVisualizationFreeze.locks.length);
    assert.equal(GraphVisualizationFreezeInventory.hardcodesAggregateTotals, false);
    assert.equal(GraphVisualizationFreezeInventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Graph Visualization Certification", () => {
    assert.equal(GraphVisualizationFreezeMetadata.dependency
      .graphVisualizationCertificationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/graphVisualization(?:Platform|Manifest|Validation|Model|Registry|Foundation)/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable metadata with no lock or graph runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationFreeze));
    assert.ok(Object.isFrozen(GraphVisualizationFreezeMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationFreezeInventory));
    assert.equal(GraphVisualizationFreeze.freezeEngine, false);
    assert.equal(GraphVisualizationFreeze.runtimeLocking, false);
    assert.equal(GraphVisualizationFreeze.lockManagement, false);
    assert.equal(GraphVisualizationFreeze.execution, false);
    assert.equal(GraphVisualizationFreeze.rendering, false);
    assert.equal(GraphVisualizationFreeze.services, false);
    assert.equal(GraphVisualizationFreeze.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getGraphVisualizationFreezeSummary(), GraphVisualizationFreezeMetadata);
    const release = getGraphVisualizationFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.lockId, "EVE-3-GRAPH-VISUALIZATION-LOCKED");
    assert.equal(release.readiness, "ReadyForPublicIndex");
  });
});
