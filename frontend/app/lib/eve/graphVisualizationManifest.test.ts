import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicManifest from "./graphVisualizationManifest.ts";
import {
  getGraphVisualizationManifestCount, getGraphVisualizationManifestReleaseMetadata,
  getGraphVisualizationManifestSummary, GraphVisualizationManifest,
  GraphVisualizationManifestIdentity, GraphVisualizationManifestInventory,
  GraphVisualizationManifestMetadata, GraphVisualizationManifestReadinessMetadata,
} from "./graphVisualizationManifest.ts";

const FILES = Object.freeze([
  "graphVisualizationManifestTypes.ts", "graphVisualizationManifestComposition.ts",
  "graphVisualizationManifestGuarantees.ts", "graphVisualizationManifestCompatibility.ts",
  "graphVisualizationManifestInventory.ts", "graphVisualizationManifestMetadata.ts",
  "graphVisualizationManifest.ts", "graphVisualizationManifest.test.ts",
]);

describe("EVE-3:5 Graph Visualization Manifest", () => {
  it("adds exactly eight Manifest files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicManifest).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(GraphVisualizationManifestIdentity.id,
      "EVE-3:5/GraphVisualizationManifest");
    assert.equal(GraphVisualizationManifestIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationManifestIdentity.namespace,
      "nexora.eve.graph-visualization.manifest");
    assert.equal(GraphVisualizationManifestMetadata.status, "ReadyForPlatform");
    assert.equal(GraphVisualizationManifestReadinessMetadata.status, "ReadyForPlatform");
    assert.equal(GraphVisualizationManifestMetadata.validationReference,
      "EVE-3:4/GraphVisualizationValidation");
  });

  it("publishes canonical five-phase composition preserving upstream objects", () => {
    assert.deepEqual(GraphVisualizationManifest.composition.map(({ phase }) => phase),
      ["Foundation", "Registry", "Model", "Validation", "Manifest"]);
    const validation = GraphVisualizationManifest.validation;
    assert.equal(GraphVisualizationManifest.composition[0]!.canonicalPhase,
      validation.model.registry.foundation);
    assert.equal(GraphVisualizationManifest.composition[1]!.canonicalPhase,
      validation.model.registry);
    assert.equal(GraphVisualizationManifest.composition[2]!.canonicalPhase, validation.model);
    assert.equal(GraphVisualizationManifest.composition[3]!.canonicalPhase, validation);
    assert.ok(GraphVisualizationManifest.composition.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable guarantees, compatibility, and readiness", () => {
    assert.equal(GraphVisualizationManifest.guarantees.length, 12);
    assert.equal(GraphVisualizationManifest.compatibility.length, 8);
    assert.equal(GraphVisualizationManifest.readiness.declarations.length, 7);
    assert.ok(GraphVisualizationManifest.guarantees.every((entry) =>
      Object.isFrozen(entry) && entry.guaranteed));
    assert.ok(GraphVisualizationManifest.compatibility.every((entry) =>
      Object.isFrozen(entry) && entry.compatible && !entry.runtimeVerification));
    assert.ok(GraphVisualizationManifest.readiness.declarations.every((entry) =>
      Object.isFrozen(entry) && entry.ready && !entry.executes));
  });

  it("preserves Validation collections by reference", () => {
    const inventory = GraphVisualizationManifestInventory;
    const validation = GraphVisualizationManifest.validation;
    assert.equal(inventory.validationInventory, validation.inventory);
    assert.equal(inventory.validationRules, validation.rules);
    assert.equal(inventory.validationGates, validation.gates);
    assert.equal(inventory.validationOutcomes, validation.outcomes);
    assert.equal(inventory.validationDiagnostics, validation.diagnostics);
    assert.equal(inventory.validationCollectionsPreservedByReference, true);
  });

  it("derives all Manifest inventory counts dynamically", () => {
    const inventory = GraphVisualizationManifestInventory;
    assert.equal(inventory.counts.phaseCount, GraphVisualizationManifest.composition.length);
    assert.equal(inventory.counts.guaranteeCount, GraphVisualizationManifest.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount, GraphVisualizationManifest.compatibility.length);
    assert.equal(inventory.counts.readinessCount,
      GraphVisualizationManifest.readiness.declarations.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
    assert.equal(getGraphVisualizationManifestCount(), GraphVisualizationManifest.composition.length);
  });

  it("consumes only Graph Visualization Validation", () => {
    assert.equal(GraphVisualizationManifestMetadata.dependency.graphVisualizationValidationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/graphVisualization(?:Model|Registry|Foundation)/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no graph, validation, or rendering runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationManifest));
    assert.ok(Object.isFrozen(GraphVisualizationManifestMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationManifestInventory));
    assert.equal(GraphVisualizationManifest.validationExecution, false);
    assert.equal(GraphVisualizationManifest.analyticsExecution, false);
    assert.equal(GraphVisualizationManifest.traversal, false);
    assert.equal(GraphVisualizationManifest.pathfinding, false);
    assert.equal(GraphVisualizationManifest.layoutExecution, false);
    assert.equal(GraphVisualizationManifest.rendering, false);
    assert.equal(GraphVisualizationManifest.services, false);
    assert.equal(GraphVisualizationManifest.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getGraphVisualizationManifestSummary(), GraphVisualizationManifestMetadata);
    assert.equal(getGraphVisualizationManifestReleaseMetadata().validationReference,
      GraphVisualizationManifestMetadata.validationReference);
  });
});
