import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicRegistry from "./graphVisualizationRegistry.ts";
import {
  getGraphVisualizationRegistryCount, getGraphVisualizationRegistryReleaseMetadata,
  getGraphVisualizationRegistrySummary, GraphVisualizationRegistry,
  GraphVisualizationRegistryIdentity, GraphVisualizationRegistryInventory,
  GraphVisualizationRegistryMetadata, GraphVisualizationRegistryReadiness,
} from "./graphVisualizationRegistry.ts";

const FILES = Object.freeze([
  "graphVisualizationRegistryTypes.ts", "graphVisualizationRegistryCatalog.ts",
  "graphVisualizationRegistryInventory.ts", "graphVisualizationRegistryPolicies.ts",
  "graphVisualizationRegistryExtensions.ts", "graphVisualizationRegistryMetadata.ts",
  "graphVisualizationRegistry.ts", "graphVisualizationRegistry.test.ts",
]);

describe("EVE-3:2 Graph Visualization Registry", () => {
  it("adds exactly eight Registry files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicRegistry).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(GraphVisualizationRegistryIdentity.id, "EVE-3:2/GraphVisualizationRegistry");
    assert.equal(GraphVisualizationRegistryIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationRegistryIdentity.namespace,
      "nexora.eve.graph-visualization.registry");
    assert.equal(GraphVisualizationRegistryMetadata.status, "ReadyForModel");
    assert.equal(GraphVisualizationRegistryReadiness, "ReadyForModel");
    assert.equal(GraphVisualizationRegistryMetadata.foundationReference,
      "EVE-3:1/GraphVisualizationFoundation");
  });

  it("publishes exactly eighteen Foundation-aligned vocabulary registries", () => {
    assert.equal(GraphVisualizationRegistry.catalog.registries.length, 18);
    assert.equal(GraphVisualizationRegistry.catalog.categories.length, 18);
    GraphVisualizationRegistry.catalog.categories.forEach((category, index) => {
      assert.equal(category.foundationContract,
        GraphVisualizationRegistry.foundation.contracts[index]);
      assert.equal(category.entryCollection,
        GraphVisualizationRegistry.catalog.registries[index]);
    });
  });

  it("uses unique immutable identities and category-local keys", () => {
    const entries = GraphVisualizationRegistry.catalog.registries.flat();
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.ok(entries.every(Object.isFrozen));
    for (const collection of GraphVisualizationRegistry.catalog.registries) {
      assert.equal(new Set(collection.map(({ key }) => key)).size, collection.length);
      assert.ok(collection.every((entry, index) => entry.deterministicOrder === index + 1));
    }
  });

  it("publishes twelve policies and fourteen extension classifications", () => {
    assert.equal(GraphVisualizationRegistry.policies.length, 12);
    assert.equal(GraphVisualizationRegistry.extensions.classifications.length, 14);
    assert.ok(GraphVisualizationRegistry.policies.every((entry) =>
      Object.isFrozen(entry) && !entry.executes));
    assert.ok(GraphVisualizationRegistry.extensions.classifications.every(Object.isFrozen));
    assert.equal(GraphVisualizationRegistry.extensions.loadsPlugins, false);
    assert.equal(GraphVisualizationRegistry.extensions.executesExtensions, false);
  });

  it("preserves ownership, boundaries, lifecycle, and capabilities", () => {
    const entries = GraphVisualizationRegistry.catalog.registries.flat();
    assert.ok(entries.every(({ ownershipReference }) =>
      ownershipReference === GraphVisualizationRegistry.foundation.ownership.id));
    assert.ok(entries.every(({ boundaryReferences }) =>
      boundaryReferences.includes(GraphVisualizationRegistry.foundation.boundaries.id)));
    assert.ok(entries.every(({ lifecycleApplicability }) =>
      lifecycleApplicability === GraphVisualizationRegistry.foundation.lifecycle.states));
    const capabilityIds = new Set<string>(
      GraphVisualizationRegistry.foundation.capabilities.map(({ id }) => id),
    );
    assert.ok(entries.every(({ capabilityReferences }) =>
      capabilityReferences.every((id) => capabilityIds.has(id))));
  });

  it("derives inventory dynamically and preserves Foundation references", () => {
    const entries = GraphVisualizationRegistry.catalog.registries.flat();
    assert.equal(GraphVisualizationRegistryInventory.registryEntryCount, entries.length);
    assert.equal(GraphVisualizationRegistryInventory.vocabularyRegistryCount,
      GraphVisualizationRegistry.catalog.registries.length);
    assert.equal(GraphVisualizationRegistryInventory.foundationContracts,
      GraphVisualizationRegistry.foundation.contracts);
    assert.equal(GraphVisualizationRegistryInventory.foundationBoundaries,
      GraphVisualizationRegistry.foundation.boundaries);
    assert.equal(GraphVisualizationRegistryInventory.hardcodesAggregateTotals, false);
    assert.equal(getGraphVisualizationRegistryCount(), entries.length);
  });

  it("preserves upstream public-index and lock references", () => {
    assert.equal(GraphVisualizationRegistryMetadata.upstreamPublicIndexReference,
      "EVE-2:9/SceneRenderingPublicIndex");
    assert.equal(GraphVisualizationRegistryMetadata.upstreamLockReference,
      "EVE-2-SCENE-RENDERING-LOCKED");
    assert.equal(getGraphVisualizationRegistrySummary(), GraphVisualizationRegistryMetadata);
    assert.equal(getGraphVisualizationRegistryReleaseMetadata().foundationReference,
      GraphVisualizationRegistryMetadata.foundationReference);
  });

  it("consumes only Graph Visualization Foundation", () => {
    assert.equal(GraphVisualizationRegistryMetadata.dependency.graphVisualizationFoundationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no graph or rendering runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationRegistry));
    assert.ok(Object.isFrozen(GraphVisualizationRegistryMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationRegistryInventory));
    assert.equal(GraphVisualizationRegistry.analyticsExecution, false);
    assert.equal(GraphVisualizationRegistry.traversal, false);
    assert.equal(GraphVisualizationRegistry.pathfinding, false);
    assert.equal(GraphVisualizationRegistry.layoutExecution, false);
    assert.equal(GraphVisualizationRegistry.relationshipInference, false);
    assert.equal(GraphVisualizationRegistry.rendering, false);
    assert.equal(GraphVisualizationRegistry.services, false);
    assert.equal(GraphVisualizationRegistry.factories, false);
  });
});
