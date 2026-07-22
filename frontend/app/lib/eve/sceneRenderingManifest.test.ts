import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicManifest from "./sceneRenderingManifest.ts";
import {
  getSceneRenderingManifestInventoryCount, getSceneRenderingManifestReleaseMetadata,
  getSceneRenderingManifestSummary, SceneRenderingManifest, SceneRenderingManifestId,
  SceneRenderingManifestInventory, SceneRenderingManifestMetadata,
  SceneRenderingManifestReadiness,
} from "./sceneRenderingManifest.ts";

const FILES = Object.freeze([
  "sceneRenderingManifestTypes.ts", "sceneRenderingManifestInventory.ts",
  "sceneRenderingManifestGuarantees.ts", "sceneRenderingManifestReadiness.ts",
  "sceneRenderingManifestMetadata.ts", "sceneRenderingManifestCompatibility.ts",
  "sceneRenderingManifest.ts", "sceneRenderingManifest.test.ts",
]);

describe("EVE-2:5 Scene Rendering Manifest", () => {
  it("adds exactly eight Manifest files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicManifest).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(SceneRenderingManifestId, "EVE-2:5/SceneRenderingManifest");
    assert.equal(SceneRenderingManifestMetadata.name, "Scene Rendering Manifest");
    assert.equal(SceneRenderingManifestMetadata.version, "1.0.0");
    assert.equal(SceneRenderingManifestMetadata.namespace, "nexora.eve.scene-rendering.manifest");
    assert.equal(SceneRenderingManifestMetadata.status, "ReadyForPlatform");
    assert.equal(SceneRenderingManifestMetadata.validationReference, "EVE-2:4/SceneRenderingValidation");
  });

  it("publishes the canonical five-phase composition", () => {
    assert.deepEqual(SceneRenderingManifestMetadata.phaseComposition.map(({ phase }) => phase),
      ["Foundation", "Registry", "Model", "Validation", "Manifest"]);
    assert.ok(SceneRenderingManifestMetadata.phaseComposition.every(
      (entry, index) => Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
  });

  it("publishes twelve guarantees and seven readiness declarations", () => {
    assert.equal(SceneRenderingManifest.guarantees.length, 12);
    assert.equal(SceneRenderingManifestReadiness.length, 7);
    assert.ok(SceneRenderingManifest.guarantees.every((entry) => Object.isFrozen(entry) && entry.guaranteed));
    assert.ok(SceneRenderingManifestReadiness.every((entry) => Object.isFrozen(entry) && entry.ready && !entry.executes));
  });

  it("publishes eight immutable compatibility declarations", () => {
    assert.equal(SceneRenderingManifest.compatibility.length, 8);
    assert.ok(SceneRenderingManifest.compatibility.every(
      (entry, index) => Object.isFrozen(entry) && entry.compatible
        && !entry.runtimeCheck && entry.deterministicOrder === index + 1));
  });

  it("preserves Validation-derived inventories and canonical references", () => {
    assert.equal(SceneRenderingManifestInventory.validationInventory, SceneRenderingManifest.validation.inventory);
    assert.equal(SceneRenderingManifestInventory.validationRules, SceneRenderingManifest.validation.rules);
    assert.equal(SceneRenderingManifestInventory.validationGates, SceneRenderingManifest.validation.gates);
    assert.equal(SceneRenderingManifestInventory.valuesForwardedFromValidationChain, true);
    assert.equal(SceneRenderingManifestInventory.hardcodesInventoryTotals, false);
    assert.equal(SceneRenderingManifestInventory.recalculatesInventories, false);
    assert.equal(SceneRenderingManifestInventory.reconstructsCollections, false);
  });

  it("provides stable metadata-only accessors", () => {
    assert.equal(getSceneRenderingManifestSummary(), SceneRenderingManifestMetadata);
    assert.equal(getSceneRenderingManifestInventoryCount(), SceneRenderingManifest.validation.inventory.ruleCount);
    assert.equal(getSceneRenderingManifestReleaseMetadata(), SceneRenderingManifestMetadata.release);
  });

  it("consumes only Scene Rendering Validation", () => {
    assert.equal(SceneRenderingManifestMetadata.dependency.sceneRenderingValidationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering(?:Foundation|Registry|Model)/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no executable behavior", () => {
    assert.ok(Object.isFrozen(SceneRenderingManifest));
    assert.ok(Object.isFrozen(SceneRenderingManifestMetadata));
    assert.ok(Object.isFrozen(SceneRenderingManifestInventory));
    assert.equal(SceneRenderingManifest.execution, false);
    assert.equal(SceneRenderingManifest.validationEngine, false);
    assert.equal(SceneRenderingManifest.rendering, false);
    assert.equal(SceneRenderingManifest.sceneExecution, false);
    assert.equal(SceneRenderingManifest.services, false);
    assert.equal(SceneRenderingManifest.factories, false);
  });
});
