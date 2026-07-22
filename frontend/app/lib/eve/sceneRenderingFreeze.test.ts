import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFreeze from "./sceneRenderingFreeze.ts";
import {
  getSceneRenderingFreezeCount, getSceneRenderingFreezeReleaseMetadata,
  getSceneRenderingFreezeSummary, SceneRenderingFreeze, SceneRenderingFreezeIdentity,
  SceneRenderingFreezeInventory, SceneRenderingFreezeMetadata,
  SceneRenderingFreezeReadiness,
} from "./sceneRenderingFreeze.ts";

const FILES = Object.freeze([
  "sceneRenderingFreezeTypes.ts", "sceneRenderingFreezeRegistry.ts",
  "sceneRenderingFreezeBaselines.ts", "sceneRenderingFreezeCompatibility.ts",
  "sceneRenderingFreezeLocks.ts", "sceneRenderingFreezeExtensions.ts",
  "sceneRenderingFreeze.ts", "sceneRenderingFreeze.test.ts",
]);

describe("EVE-2:8 Scene Rendering Freeze", () => {
  it("adds exactly eight Freeze files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicFreeze).length, 8);
  });

  it("has canonical frozen identity, lock, and readiness", () => {
    assert.equal(SceneRenderingFreezeIdentity.id, "EVE-2:8/SceneRenderingFreeze");
    assert.equal(SceneRenderingFreezeIdentity.version, "1.0.0");
    assert.equal(SceneRenderingFreezeIdentity.namespace, "nexora.eve.scene-rendering.freeze");
    assert.equal(SceneRenderingFreezeIdentity.status, "Frozen");
    assert.equal(SceneRenderingFreezeIdentity.lockId, "EVE-2-SCENE-RENDERING-LOCKED");
    assert.equal(SceneRenderingFreezeIdentity.readiness, "ReadyForPublicIndex");
    assert.equal(SceneRenderingFreezeMetadata.certificationReference,
      "EVE-2:7/SceneRenderingCertification");
  });

  it("publishes exactly twelve immutable architectural locks", () => {
    assert.equal(SceneRenderingFreeze.locks.length, 12);
    assert.ok(SceneRenderingFreeze.locks.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1
      && entry.lockIdentifier === SceneRenderingFreezeIdentity.lockId
      && entry.status === "Locked" && !entry.runtimeLocking));
  });

  it("publishes exactly eight reference-preserving baselines", () => {
    assert.equal(SceneRenderingFreeze.baselines.length, 8);
    assert.ok(SceneRenderingFreeze.baselines.every((entry, index) =>
      Object.isFrozen(entry) && entry.preservedByReference
      && entry.deterministicOrder === index + 1));
    assert.equal(SceneRenderingFreeze.baselines[0]!.canonicalReference,
      SceneRenderingFreeze.certification.platform);
  });

  it("publishes the canonical seven-phase frozen registry", () => {
    assert.deepEqual(SceneRenderingFreeze.registry.entries.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform", "Certification",
    ]);
    assert.ok(SceneRenderingFreeze.registry.entries.every((entry, index) =>
      Object.isFrozen(entry) && entry.deterministicOrder === index + 1 && !entry.copiesMetadata));
  });

  it("preserves Certification inventories and dynamically derives Freeze counts", () => {
    assert.equal(SceneRenderingFreezeInventory.certificationInventory,
      SceneRenderingFreeze.certification.inventory);
    assert.equal(SceneRenderingFreezeInventory.certificationCriteria,
      SceneRenderingFreeze.certification.criteria);
    assert.equal(SceneRenderingFreezeInventory.certificationGates,
      SceneRenderingFreeze.certification.gates);
    assert.equal(SceneRenderingFreezeInventory.counts.lockCount, SceneRenderingFreeze.locks.length);
    assert.equal(SceneRenderingFreezeInventory.hardcodesInventoryTotals, false);
    assert.equal(SceneRenderingFreezeInventory.recalculatesCertificationInventory, false);
  });

  it("preserves compatibility and declares non-runtime extensions", () => {
    assert.equal(SceneRenderingFreeze.compatibility.length, 8);
    assert.ok(SceneRenderingFreeze.compatibility.every((entry, index) =>
      Object.isFrozen(entry) && entry.preservedByReference
      && entry.deterministicOrder === index + 1 && !entry.runtimeCheck));
    assert.equal(SceneRenderingFreeze.extensions.extensionLoading, false);
    assert.equal(SceneRenderingFreeze.extensions.runtimeRegistration, false);
    assert.equal(SceneRenderingFreeze.extensions.execution, false);
  });

  it("provides stable metadata-only public accessors", () => {
    assert.equal(getSceneRenderingFreezeSummary(), SceneRenderingFreezeMetadata);
    assert.equal(getSceneRenderingFreezeCount(), SceneRenderingFreeze.locks.length);
    assert.equal(getSceneRenderingFreezeReleaseMetadata(), SceneRenderingFreeze.releaseMetadata);
    assert.equal(SceneRenderingFreezeReadiness.status, "ReadyForPublicIndex");
  });

  it("consumes only Scene Rendering Certification", () => {
    assert.equal(SceneRenderingFreezeMetadata.dependency.sceneRenderingCertificationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/sceneRendering(?:Foundation|Registry|Model|Validation|Manifest|Platform)/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no freeze or rendering runtime", () => {
    assert.ok(Object.isFrozen(SceneRenderingFreeze));
    assert.ok(Object.isFrozen(SceneRenderingFreezeMetadata));
    assert.ok(Object.isFrozen(SceneRenderingFreezeInventory));
    assert.equal(SceneRenderingFreeze.freezeEngine, false);
    assert.equal(SceneRenderingFreeze.runtimeLocking, false);
    assert.equal(SceneRenderingFreeze.freezeManagement, false);
    assert.equal(SceneRenderingFreeze.execution, false);
    assert.equal(SceneRenderingFreeze.rendering, false);
    assert.equal(SceneRenderingFreeze.sceneExecution, false);
    assert.equal(SceneRenderingFreeze.services, false);
    assert.equal(SceneRenderingFreeze.factories, false);
  });
});
