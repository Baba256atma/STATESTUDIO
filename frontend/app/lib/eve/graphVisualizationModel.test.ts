import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicModel from "./graphVisualizationModel.ts";
import {
  getGraphVisualizationModelCount, getGraphVisualizationModelReleaseMetadata,
  getGraphVisualizationModelSummary, GraphVisualizationModel,
  GraphVisualizationModelIdentity, GraphVisualizationModelInventory,
  GraphVisualizationModelMetadata, GraphVisualizationModelReadiness,
} from "./graphVisualizationModel.ts";

const FILES = Object.freeze([
  "graphVisualizationModelTypes.ts", "graphVisualizationModelDescriptors.ts",
  "graphVisualizationModelRelationships.ts", "graphVisualizationModelPolicies.ts",
  "graphVisualizationModelMetadata.ts", "graphVisualizationModelInventory.ts",
  "graphVisualizationModel.ts", "graphVisualizationModel.test.ts",
]);

describe("EVE-3:3 Graph Visualization Model", () => {
  it("adds exactly eight Model files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicModel).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(GraphVisualizationModelIdentity.id, "EVE-3:3/GraphVisualizationModel");
    assert.equal(GraphVisualizationModelIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationModelIdentity.namespace,
      "nexora.eve.graph-visualization.model");
    assert.equal(GraphVisualizationModelMetadata.status, "ReadyForValidation");
    assert.equal(GraphVisualizationModelReadiness, "ReadyForValidation");
    assert.equal(GraphVisualizationModelMetadata.registryReference,
      "EVE-3:2/GraphVisualizationRegistry");
  });

  it("publishes exactly eighteen unique immutable typed model descriptors", () => {
    assert.equal(GraphVisualizationModel.descriptors.length, 18);
    assert.equal(new Set(GraphVisualizationModel.descriptors.map(({ id }) => id)).size, 18);
    assert.ok(GraphVisualizationModel.descriptors.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1
      && !entry.executableBehavior));
  });

  it("publishes exactly sixteen immutable relationship descriptors", () => {
    assert.equal(GraphVisualizationModel.relationships.length, 16);
    assert.ok(GraphVisualizationModel.relationships.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1
      && !entry.traversalProvided && !entry.inferenceProvided));
  });

  it("publishes twelve policies and immutable structural composition", () => {
    assert.equal(GraphVisualizationModel.policies.length, 12);
    assert.equal(GraphVisualizationModel.composition.length, 16);
    assert.ok(GraphVisualizationModel.policies.every((entry) =>
      Object.isFrozen(entry) && !entry.executes));
    assert.ok(GraphVisualizationModel.composition.every(Object.isFrozen));
  });

  it("preserves valid Registry, ownership, boundary, lifecycle, and capability references", () => {
    const registryEntries = GraphVisualizationModel.registry.catalog.registries.flat();
    const registryIds = new Set(registryEntries.map(({ id }) => id));
    assert.ok(GraphVisualizationModel.descriptors.every(({ registryReference }) =>
      registryIds.has(registryReference)));
    assert.ok(GraphVisualizationModel.descriptors.every(({ ownershipReference }) =>
      ownershipReference === GraphVisualizationModel.registry.foundation.ownership.id));
    assert.ok(GraphVisualizationModel.descriptors.every(({ boundaryReferences }) =>
      boundaryReferences.includes(GraphVisualizationModel.registry.foundation.boundaries.id)));
    assert.ok(GraphVisualizationModel.descriptors.every(({ lifecycleReference }) =>
      lifecycleReference === GraphVisualizationModel.registry.foundation.lifecycle.states));
  });

  it("derives inventory from Model collections and preserves Registry collections", () => {
    assert.equal(GraphVisualizationModelInventory.modelCount,
      GraphVisualizationModel.descriptors.length);
    assert.equal(GraphVisualizationModelInventory.relationshipCount,
      GraphVisualizationModel.relationships.length);
    assert.equal(GraphVisualizationModelInventory.policyCount,
      GraphVisualizationModel.policies.length);
    assert.equal(GraphVisualizationModelInventory.registryCatalog,
      GraphVisualizationModel.registry.catalog);
    assert.equal(GraphVisualizationModelInventory.registryCollections,
      GraphVisualizationModel.registry.catalog.registries);
    assert.equal(GraphVisualizationModelInventory.hardcodesAggregateTotals, false);
    assert.equal(GraphVisualizationModelInventory.reconstructsRegistryCollections, false);
    assert.equal(getGraphVisualizationModelCount(), GraphVisualizationModel.descriptors.length);
  });

  it("consumes only Graph Visualization Registry", () => {
    assert.equal(GraphVisualizationModelMetadata.dependency.graphVisualizationRegistryOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/graphVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no graph or rendering runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationModel));
    assert.ok(Object.isFrozen(GraphVisualizationModelMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationModelInventory));
    assert.equal(GraphVisualizationModel.analyticsExecution, false);
    assert.equal(GraphVisualizationModel.traversal, false);
    assert.equal(GraphVisualizationModel.pathfinding, false);
    assert.equal(GraphVisualizationModel.layoutExecution, false);
    assert.equal(GraphVisualizationModel.rendering, false);
    assert.equal(GraphVisualizationModel.runtimeInteraction, false);
    assert.equal(GraphVisualizationModel.services, false);
    assert.equal(GraphVisualizationModel.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getGraphVisualizationModelSummary(), GraphVisualizationModelMetadata);
    assert.equal(getGraphVisualizationModelReleaseMetadata().registryReference,
      GraphVisualizationModelMetadata.registryReference);
  });
});
