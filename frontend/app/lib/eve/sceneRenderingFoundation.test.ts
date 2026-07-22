import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFoundation from "./sceneRenderingFoundation.ts";
import {
  SceneRenderingFoundation, SceneRenderingFoundationId,
  SceneRenderingFoundationLayer, SceneRenderingFoundationNamespace,
  SceneRenderingFoundationReadiness, SceneRenderingFoundationStatus,
  SceneRenderingFoundationVersion,
} from "./sceneRenderingFoundation.ts";

const FILES = Object.freeze([
  "sceneRenderingFoundationTypes.ts", "sceneRenderingContracts.ts",
  "sceneRenderingOwnership.ts", "sceneRenderingBoundaries.ts",
  "sceneRenderingLifecycle.ts", "sceneRenderingCapabilities.ts",
  "sceneRenderingFoundation.ts", "sceneRenderingFoundation.test.ts",
]);

describe("EVE-2:1 Scene Rendering Foundation", () => {
  it("adds exactly eight Foundation files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicFoundation).length, 8);
  });

  it("has canonical Foundation identity and readiness", () => {
    assert.equal(SceneRenderingFoundationId, "EVE-2:1/SceneRenderingFoundation");
    assert.equal(SceneRenderingFoundationVersion, "1.0.0");
    assert.equal(SceneRenderingFoundationNamespace, "nexora.eve.scene-rendering.foundation");
    assert.equal(SceneRenderingFoundationLayer, "Visualization Engine (EVE)");
    assert.equal(SceneRenderingFoundationStatus, "Foundation");
    assert.equal(SceneRenderingFoundationReadiness, "ReadyForRegistry");
  });

  it("publishes all sixteen immutable contracts", () => {
    assert.equal(SceneRenderingFoundation.contracts.length, 16);
    assert.equal(new Set(SceneRenderingFoundation.contracts.map(({ id }) => id)).size, 16);
    assert.ok(SceneRenderingFoundation.contracts.every(Object.isFrozen));
    assert.ok(SceneRenderingFoundation.contracts.every(
      (contract, index) => contract.deterministicOrder === index + 1
      && contract.runtimeBehavior === "None"));
  });

  it("derives canonical inventories", () => {
    assert.equal(SceneRenderingFoundation.inventory.contractCount, SceneRenderingFoundation.contracts.length);
    assert.equal(SceneRenderingFoundation.inventory.lifecycleStateCount, SceneRenderingFoundation.lifecycle.states.length);
    assert.equal(SceneRenderingFoundation.inventory.capabilityCount, SceneRenderingFoundation.capabilities.length);
    assert.equal(SceneRenderingFoundation.inventory.countsDerivedFromCanonicalCollections, true);
  });

  it("consumes only Visualization Public Index", () => {
    assert.equal(SceneRenderingFoundation.dependency.visualizationPublicIndexOnly, true);
    assert.equal(SceneRenderingFoundation.dependency.visualizationPublicIndexId, "EVE-1:9/VisualizationPublicIndex");
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("preserves ownership and forbidden boundaries", () => {
    assert.ok(SceneRenderingFoundation.ownership.owns.includes("Rendering contracts"));
    assert.ok(SceneRenderingFoundation.ownership.doesNotOwn.includes("Runtime rendering"));
    assert.ok(SceneRenderingFoundation.boundaries.prohibitedSurfaces.includes("WebGPU"));
    assert.equal(SceneRenderingFoundation.boundaries.renderingImplementation, false);
    assert.equal(SceneRenderingFoundation.boundaries.runtimeExecution, false);
  });

  it("is immutable and exposes no rendering runtime", () => {
    assert.ok(Object.isFrozen(SceneRenderingFoundation));
    assert.ok(Object.isFrozen(SceneRenderingFoundation.contracts));
    assert.ok(Object.isFrozen(SceneRenderingFoundation.capabilities));
    assert.equal(SceneRenderingFoundation.renderingPipeline, false);
    assert.equal(SceneRenderingFoundation.frameGeneration, false);
    assert.equal(SceneRenderingFoundation.gpuExecution, false);
    assert.equal(SceneRenderingFoundation.sceneCompositionExecution, false);
    assert.equal(SceneRenderingFoundation.runtimeExecution, false);
    assert.equal(SceneRenderingFoundation.services, false);
    assert.equal(SceneRenderingFoundation.factories, false);
  });
});
