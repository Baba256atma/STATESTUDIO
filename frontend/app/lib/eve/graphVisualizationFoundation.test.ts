import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFoundation from "./graphVisualizationFoundation.ts";
import {
  getGraphVisualizationFoundationContractCount,
  getGraphVisualizationFoundationReadiness,
  getGraphVisualizationFoundationSummary,
  getGraphVisualizationFoundationUpstreamMetadata,
  GraphVisualizationFoundation,
  GraphVisualizationFoundationId,
  GraphVisualizationFoundationInventory,
  GraphVisualizationFoundationMetadata,
} from "./graphVisualizationFoundation.ts";

const FILES = Object.freeze([
  "graphVisualizationFoundationTypes.ts", "graphVisualizationContracts.ts",
  "graphVisualizationOwnership.ts", "graphVisualizationBoundaries.ts",
  "graphVisualizationLifecycle.ts", "graphVisualizationCapabilities.ts",
  "graphVisualizationFoundation.ts", "graphVisualizationFoundation.test.ts",
]);

describe("EVE-3:1 Graph Visualization Foundation", () => {
  it("adds exactly eight Foundation files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicFoundation).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(GraphVisualizationFoundationId, "EVE-3:1/GraphVisualizationFoundation");
    assert.equal(GraphVisualizationFoundationMetadata.version, "1.0.0");
    assert.equal(GraphVisualizationFoundationMetadata.namespace,
      "nexora.eve.graph-visualization.foundation");
    assert.equal(GraphVisualizationFoundationMetadata.status, "ReadyForRegistry");
    assert.equal(getGraphVisualizationFoundationReadiness(), "ReadyForRegistry");
  });

  it("publishes all unique immutable graph contracts", () => {
    assert.equal(GraphVisualizationFoundation.contracts.length, 18);
    assert.equal(new Set(GraphVisualizationFoundation.contracts.map(({ id }) => id)).size, 18);
    assert.ok(GraphVisualizationFoundation.contracts.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1
      && entry.runtimeBehavior === "None"));
  });

  it("publishes exactly five lifecycle states and eighteen capabilities", () => {
    assert.deepEqual(GraphVisualizationFoundation.lifecycle.states,
      ["Declared", "Structured", "Prepared", "Published", "Retired"]);
    assert.equal(GraphVisualizationFoundation.capabilities.length, 18);
    assert.ok(GraphVisualizationFoundation.capabilities.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1
      && !entry.implementationProvided && !entry.executes));
  });

  it("publishes immutable ownership, boundaries, and policies", () => {
    assert.ok(Object.isFrozen(GraphVisualizationFoundation.ownership));
    assert.ok(Object.isFrozen(GraphVisualizationFoundation.boundaries));
    assert.equal(GraphVisualizationFoundation.boundaries.declarations.length, 10);
    assert.equal(GraphVisualizationFoundation.boundaries.policies.length, 12);
    assert.ok(GraphVisualizationFoundation.boundaries.declarations.every(Object.isFrozen));
    assert.ok(GraphVisualizationFoundation.boundaries.policies.every(Object.isFrozen));
  });

  it("preserves the upstream Public Index and lock references", () => {
    assert.equal(GraphVisualizationFoundationMetadata.upstreamPublicIndexReference,
      "EVE-2:9/SceneRenderingPublicIndex");
    assert.equal(GraphVisualizationFoundationMetadata.upstreamLockReference,
      "EVE-2-SCENE-RENDERING-LOCKED");
    assert.equal(GraphVisualizationFoundationMetadata.dependency.upstreamPublicPlatform,
      GraphVisualizationFoundation.upstreamPublicPlatform);
    assert.equal(getGraphVisualizationFoundationUpstreamMetadata().lockId,
      GraphVisualizationFoundationMetadata.upstreamLockReference);
  });

  it("derives inventory counts from canonical local collections", () => {
    assert.equal(GraphVisualizationFoundationInventory.contractCount,
      GraphVisualizationFoundation.contracts.length);
    assert.equal(GraphVisualizationFoundationInventory.lifecycleStateCount,
      GraphVisualizationFoundation.lifecycle.states.length);
    assert.equal(GraphVisualizationFoundationInventory.capabilityCount,
      GraphVisualizationFoundation.capabilities.length);
    assert.equal(getGraphVisualizationFoundationContractCount(),
      GraphVisualizationFoundation.contracts.length);
    assert.equal(GraphVisualizationFoundationInventory.hardcodesAggregateTotals, false);
    assert.equal(GraphVisualizationFoundationInventory.reconstructsUpstreamInventory, false);
  });

  it("consumes only Scene Rendering Public Index", () => {
    assert.equal(GraphVisualizationFoundationMetadata.dependency.sceneRenderingPublicIndexOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/sceneRendering(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no analytics, layout, or rendering runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationFoundation));
    assert.ok(Object.isFrozen(GraphVisualizationFoundationMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationFoundationInventory));
    assert.equal(GraphVisualizationFoundation.analyticsExecution, false);
    assert.equal(GraphVisualizationFoundation.layoutExecution, false);
    assert.equal(GraphVisualizationFoundation.pathCalculation, false);
    assert.equal(GraphVisualizationFoundation.relationshipInference, false);
    assert.equal(GraphVisualizationFoundation.rendering, false);
    assert.equal(GraphVisualizationFoundation.sceneRenderingExecution, false);
    assert.equal(GraphVisualizationFoundation.services, false);
    assert.equal(GraphVisualizationFoundation.factories, false);
  });

  it("provides a stable Foundation summary", () => {
    assert.equal(getGraphVisualizationFoundationSummary(), GraphVisualizationFoundationMetadata);
  });
});
