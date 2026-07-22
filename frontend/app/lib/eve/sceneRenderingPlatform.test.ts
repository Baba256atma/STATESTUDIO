import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicPlatform from "./sceneRenderingPlatform.ts";
import {
  getSceneRenderingPlatformInventoryCount, getSceneRenderingPlatformReadiness,
  getSceneRenderingPlatformReleaseMetadata, getSceneRenderingPlatformSummary,
  SceneRenderingPlatform, SceneRenderingPlatformId,
  SceneRenderingPlatformInventory, SceneRenderingPlatformMetadata,
} from "./sceneRenderingPlatform.ts";

const FILES = Object.freeze([
  "sceneRenderingPlatformTypes.ts", "sceneRenderingPlatformCapabilities.ts",
  "sceneRenderingPlatformCompatibility.ts", "sceneRenderingPlatformMetadata.ts",
  "sceneRenderingPlatformInventory.ts", "sceneRenderingPlatformGuarantees.ts",
  "sceneRenderingPlatform.ts", "sceneRenderingPlatform.test.ts",
]);

describe("EVE-2:6 Scene Rendering Platform", () => {
  it("adds exactly eight Platform files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicPlatform).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(SceneRenderingPlatformId, "EVE-2:6/SceneRenderingPlatform");
    assert.equal(SceneRenderingPlatformMetadata.name, "Scene Rendering Platform");
    assert.equal(SceneRenderingPlatformMetadata.version, "1.0.0");
    assert.equal(SceneRenderingPlatformMetadata.namespace, "nexora.eve.scene-rendering.platform");
    assert.equal(SceneRenderingPlatformMetadata.status, "ReadyForCertification");
    assert.equal(SceneRenderingPlatformMetadata.manifestReference, "EVE-2:5/SceneRenderingManifest");
  });

  it("publishes canonical six-phase composition preserving Manifest entries", () => {
    assert.equal(SceneRenderingPlatformMetadata.composition.length, 6);
    assert.deepEqual(SceneRenderingPlatformMetadata.composition.map(({ phase }) => phase),
      ["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform"]);
    SceneRenderingPlatform.manifest.metadata.phaseComposition.forEach((entry, index) => {
      assert.equal(SceneRenderingPlatformMetadata.composition[index], entry);
    });
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    assert.equal(SceneRenderingPlatform.capabilities.length, 10);
    assert.equal(SceneRenderingPlatform.guarantees.length, 12);
    assert.equal(SceneRenderingPlatform.compatibility.length, 8);
    for (const collection of [SceneRenderingPlatform.capabilities,
      SceneRenderingPlatform.guarantees, SceneRenderingPlatform.compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) =>
        Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Manifest inventories and derives local counts", () => {
    assert.equal(SceneRenderingPlatformInventory.manifestInventory, SceneRenderingPlatform.manifest.inventory);
    assert.equal(SceneRenderingPlatformInventory.validationInventory,
      SceneRenderingPlatform.manifest.inventory.validationInventory);
    assert.equal(SceneRenderingPlatformInventory.upstreamCanonicalReferences,
      SceneRenderingPlatform.manifest.inventory.canonicalReferences);
    assert.equal(SceneRenderingPlatformInventory.capabilities, SceneRenderingPlatform.capabilities);
    assert.equal(SceneRenderingPlatformInventory.counts.capabilityCount,
      SceneRenderingPlatform.capabilities.length);
    assert.equal(SceneRenderingPlatformInventory.hardcodesInventoryTotals, false);
    assert.equal(SceneRenderingPlatformInventory.recalculatesUpstreamInventories, false);
  });

  it("provides stable metadata-only accessors", () => {
    assert.equal(getSceneRenderingPlatformSummary(), SceneRenderingPlatformMetadata);
    assert.equal(getSceneRenderingPlatformInventoryCount(), SceneRenderingPlatform.capabilities.length);
    assert.equal(getSceneRenderingPlatformReadiness(), SceneRenderingPlatformMetadata.readinessDeclaration);
    assert.deepEqual(getSceneRenderingPlatformReleaseMetadata(), {
      id: "EVE-2:6/SceneRenderingPlatform", version: "1.0.0", status: "ReadyForCertification",
    });
  });

  it("consumes only Scene Rendering Manifest", () => {
    assert.equal(SceneRenderingPlatformMetadata.dependency.sceneRenderingManifestOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering(?:Foundation|Registry|Model|Validation)/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no runtime behavior", () => {
    assert.ok(Object.isFrozen(SceneRenderingPlatform));
    assert.ok(Object.isFrozen(SceneRenderingPlatformMetadata));
    assert.ok(Object.isFrozen(SceneRenderingPlatformInventory));
    assert.equal(SceneRenderingPlatform.execution, false);
    assert.equal(SceneRenderingPlatform.rendering, false);
    assert.equal(SceneRenderingPlatform.sceneExecution, false);
    assert.equal(SceneRenderingPlatform.frameGeneration, false);
    assert.equal(SceneRenderingPlatform.runtimeValidation, false);
    assert.equal(SceneRenderingPlatform.runtimeCertification, false);
    assert.equal(SceneRenderingPlatform.services, false);
    assert.equal(SceneRenderingPlatform.factories, false);
  });
});
