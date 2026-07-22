import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicPlatform from "./graphVisualizationPlatform.ts";
import {
  getGraphVisualizationPlatformCount, getGraphVisualizationPlatformReleaseMetadata,
  getGraphVisualizationPlatformSummary, GraphVisualizationPlatform,
  GraphVisualizationPlatformIdentity, GraphVisualizationPlatformInventory,
  GraphVisualizationPlatformMetadata, GraphVisualizationPlatformReadiness,
} from "./graphVisualizationPlatform.ts";

const FILES = Object.freeze([
  "graphVisualizationPlatformTypes.ts", "graphVisualizationPlatformCapabilities.ts",
  "graphVisualizationPlatformGuarantees.ts", "graphVisualizationPlatformCompatibility.ts",
  "graphVisualizationPlatformInventory.ts", "graphVisualizationPlatformMetadata.ts",
  "graphVisualizationPlatform.ts", "graphVisualizationPlatform.test.ts",
]);

describe("EVE-3:6 Graph Visualization Platform", () => {
  it("adds exactly eight Platform files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicPlatform).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(GraphVisualizationPlatformIdentity.id,
      "EVE-3:6/GraphVisualizationPlatform");
    assert.equal(GraphVisualizationPlatformIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationPlatformIdentity.namespace,
      "nexora.eve.graph-visualization.platform");
    assert.equal(GraphVisualizationPlatformMetadata.status, "ReadyForCertification");
    assert.equal(GraphVisualizationPlatformReadiness.status, "ReadyForCertification");
    assert.equal(GraphVisualizationPlatformMetadata.manifestReference,
      "EVE-3:5/GraphVisualizationManifest");
  });

  it("publishes canonical six-phase composition preserving Manifest entries", () => {
    assert.deepEqual(GraphVisualizationPlatform.metadata.composition.map(({ phase }) => phase),
      ["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform"]);
    GraphVisualizationPlatform.manifest.composition.forEach((entry, index) => {
      assert.equal(GraphVisualizationPlatform.metadata.composition[index], entry);
    });
    assert.ok(GraphVisualizationPlatform.metadata.composition.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    assert.equal(GraphVisualizationPlatform.capabilities.length, 10);
    assert.equal(GraphVisualizationPlatform.guarantees.length, 12);
    assert.equal(GraphVisualizationPlatform.compatibility.length, 8);
    for (const collection of [GraphVisualizationPlatform.capabilities,
      GraphVisualizationPlatform.guarantees, GraphVisualizationPlatform.compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) =>
        Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Manifest collections by reference", () => {
    const inventory = GraphVisualizationPlatformInventory;
    const manifest = GraphVisualizationPlatform.manifest;
    assert.equal(inventory.manifestInventory, manifest.inventory);
    assert.equal(inventory.manifestComposition, manifest.composition);
    assert.equal(inventory.manifestGuarantees, manifest.guarantees);
    assert.equal(inventory.manifestCompatibility, manifest.compatibility);
    assert.equal(inventory.manifestReadiness, manifest.readiness);
    assert.equal(inventory.manifestCollectionsPreservedByReference, true);
  });

  it("derives all Platform inventory counts dynamically", () => {
    const counts = GraphVisualizationPlatformInventory.counts;
    assert.equal(counts.manifestPhaseCount, GraphVisualizationPlatform.manifest.composition.length);
    assert.equal(counts.capabilityCount, GraphVisualizationPlatform.capabilities.length);
    assert.equal(counts.guaranteeCount, GraphVisualizationPlatform.guarantees.length);
    assert.equal(counts.compatibilityCount, GraphVisualizationPlatform.compatibility.length);
    assert.equal(GraphVisualizationPlatformInventory.hardcodesAggregateTotals, false);
    assert.equal(GraphVisualizationPlatformInventory.reconstructsUpstreamCollections, false);
    assert.equal(getGraphVisualizationPlatformCount(),
      GraphVisualizationPlatform.metadata.composition.length);
  });

  it("consumes only Graph Visualization Manifest", () => {
    assert.equal(GraphVisualizationPlatformMetadata.dependency.graphVisualizationManifestOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/graphVisualization(?:Validation|Model|Registry|Foundation)/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no graph, validation, or rendering runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationPlatform));
    assert.ok(Object.isFrozen(GraphVisualizationPlatformMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationPlatformInventory));
    assert.equal(GraphVisualizationPlatform.validationExecution, false);
    assert.equal(GraphVisualizationPlatform.analyticsExecution, false);
    assert.equal(GraphVisualizationPlatform.traversal, false);
    assert.equal(GraphVisualizationPlatform.pathfinding, false);
    assert.equal(GraphVisualizationPlatform.layoutExecution, false);
    assert.equal(GraphVisualizationPlatform.rendering, false);
    assert.equal(GraphVisualizationPlatform.services, false);
    assert.equal(GraphVisualizationPlatform.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getGraphVisualizationPlatformSummary(), GraphVisualizationPlatformMetadata);
    assert.equal(getGraphVisualizationPlatformReleaseMetadata().manifestReference,
      GraphVisualizationPlatformMetadata.manifestReference);
  });
});
