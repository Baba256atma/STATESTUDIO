import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFoundation from "./visualizationFoundation.ts";
import {
  VisualizationFoundation, VisualizationFoundationId,
  VisualizationFoundationLayer, VisualizationFoundationNamespace,
  VisualizationFoundationReadiness, VisualizationFoundationStatus,
  VisualizationFoundationVersion,
} from "./visualizationFoundation.ts";

const FILES = Object.freeze([
  "visualizationFoundationTypes.ts", "visualizationContracts.ts",
  "visualizationOwnership.ts", "visualizationBoundaries.ts",
  "visualizationLifecycle.ts", "visualizationCapabilities.ts",
  "visualizationFoundation.ts", "visualizationFoundation.test.ts",
]);

describe("EVE-1:1 Visualization Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicFoundation).length, 8);
  });

  it("has canonical deterministic identity and readiness", () => {
    assert.equal(VisualizationFoundationId, "EVE-1:1/VisualizationFoundation");
    assert.equal(VisualizationFoundationVersion, "1.0.0");
    assert.equal(VisualizationFoundationNamespace, "nexora.eve.visualization.foundation");
    assert.equal(VisualizationFoundationLayer, "Visualization Engine (EVE)");
    assert.equal(VisualizationFoundationStatus, "Foundation");
    assert.equal(VisualizationFoundationReadiness, "ReadyForRegistry");
  });

  it("publishes all fourteen immutable contracts in stable order", () => {
    assert.deepEqual(VisualizationFoundation.contractNames, [
      "VisualizationIdentity", "VisualObject", "SceneReference", "Viewport",
      "CameraContract", "LayerContract", "RenderingTarget", "RenderingSurface",
      "RenderingMode", "VisualState", "InteractionState", "RenderingCapability",
      "RenderingPolicy", "ExtensionPoint",
    ]);
    assert.equal(VisualizationFoundation.contracts.length, 14);
    assert.ok(VisualizationFoundation.contracts.every(Object.isFrozen));
    assert.ok(VisualizationFoundation.contracts.every(
      (contract, index) => contract.deterministicOrder === index + 1,
    ));
  });

  it("derives canonical inventories from immutable collections", () => {
    assert.equal(VisualizationFoundation.inventory.contractCount, VisualizationFoundation.contracts.length);
    assert.equal(VisualizationFoundation.inventory.lifecycleStateCount, VisualizationFoundation.lifecycle.states.length);
    assert.equal(VisualizationFoundation.inventory.capabilityCount, VisualizationFoundation.capabilities.length);
    assert.equal(VisualizationFoundation.inventory.countsDerivedFromCanonicalCollections, true);
  });

  it("consumes only the Director Public Index", () => {
    assert.equal(VisualizationFoundation.dependency.directorPublicIndexOnly, true);
    assert.equal(VisualizationFoundation.dependency.directorPublicIndexId, "DIRECTOR-1:9/DirectorPublicIndex");
    assert.equal(VisualizationFoundation.dependency.otherDependencies, false);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      const externalImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].map((match) => match[1]);
      assert.ok(externalImports.every((path) => path === "../director/directorPublicIndex.ts"));
    }
  });

  it("preserves ownership and explicit architectural boundaries", () => {
    assert.ok(VisualizationFoundation.ownership.owns.includes("Visual representation metadata"));
    assert.ok(VisualizationFoundation.ownership.doesNotOwn.includes("Business decisions"));
    assert.ok(VisualizationFoundation.boundaries.prohibitedSurfaces.includes("WebGL"));
    assert.ok(VisualizationFoundation.boundaries.prohibitedSurfaces.includes("Runtime code"));
    assert.equal(VisualizationFoundation.boundaries.renderingImplementation, false);
    assert.equal(VisualizationFoundation.boundaries.reasoning, false);
  });

  it("is immutable and exposes no implementation or runtime", () => {
    assert.ok(Object.isFrozen(VisualizationFoundation));
    assert.ok(Object.isFrozen(VisualizationFoundation.identity));
    assert.ok(Object.isFrozen(VisualizationFoundation.contracts));
    assert.ok(Object.isFrozen(VisualizationFoundation.capabilities));
    assert.equal(VisualizationFoundation.services, false);
    assert.equal(VisualizationFoundation.factories, false);
    assert.equal(VisualizationFoundation.execution, false);
    assert.equal(VisualizationFoundation.rendering, false);
    assert.equal(VisualizationFoundation.orchestration, false);
  });
});
