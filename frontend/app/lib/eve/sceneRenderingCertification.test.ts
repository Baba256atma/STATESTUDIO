import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicCertification from "./sceneRenderingCertification.ts";
import {
  getSceneRenderingCertificationCount, getSceneRenderingCertificationReleaseMetadata,
  getSceneRenderingCertificationSummary, SceneRenderingCertification,
  SceneRenderingCertificationId, SceneRenderingCertificationInventory,
  SceneRenderingCertificationMetadata, SceneRenderingCertificationVerification,
} from "./sceneRenderingCertification.ts";

const FILES = Object.freeze([
  "sceneRenderingCertificationTypes.ts", "sceneRenderingCertificationCriteria.ts",
  "sceneRenderingCertificationGates.ts", "sceneRenderingCertificationMetadata.ts",
  "sceneRenderingCertificationInventory.ts", "sceneRenderingCertificationCompatibility.ts",
  "sceneRenderingCertification.ts", "sceneRenderingCertification.test.ts",
]);

describe("EVE-2:7 Scene Rendering Certification", () => {
  it("adds exactly eight Certification files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicCertification).length, 8);
  });

  it("has canonical certified identity and readiness", () => {
    assert.equal(SceneRenderingCertificationId, "EVE-2:7/SceneRenderingCertification");
    assert.equal(SceneRenderingCertificationMetadata.name, "Scene Rendering Certification");
    assert.equal(SceneRenderingCertificationMetadata.version, "1.0.0");
    assert.equal(SceneRenderingCertificationMetadata.namespace, "nexora.eve.scene-rendering.certification");
    assert.equal(SceneRenderingCertificationMetadata.status, "Certified");
    assert.equal(SceneRenderingCertificationMetadata.readiness, "ReadyForFreeze");
    assert.equal(SceneRenderingCertificationMetadata.platformReference, "EVE-2:6/SceneRenderingPlatform");
  });

  it("publishes exactly sixteen immutable criteria", () => {
    assert.equal(SceneRenderingCertification.criteria.length, 16);
    assert.ok(SceneRenderingCertification.criteria.every((entry, index) =>
      Object.isFrozen(entry) && entry.expectedOutcome === "Certified"
      && entry.deterministicOrder === index + 1));
  });

  it("publishes exactly twelve deterministic gates", () => {
    assert.equal(SceneRenderingCertification.gates.length, 12);
    assert.ok(SceneRenderingCertification.gates.every((entry, index) =>
      Object.isFrozen(entry) && entry.status === "Passed" && !entry.executes
      && entry.deterministicOrder === index + 1));
  });

  it("publishes immutable verification and compatibility metadata", () => {
    assert.ok(Object.isFrozen(SceneRenderingCertificationVerification));
    assert.equal(SceneRenderingCertificationVerification.outcome, "Certified");
    assert.equal(SceneRenderingCertificationVerification.verificationComplete, true);
    assert.equal(SceneRenderingCertification.compatibility.length, 8);
    assert.ok(SceneRenderingCertification.compatibility.every(
      (entry) => Object.isFrozen(entry) && entry.certified && !entry.runtimeVerification));
  });

  it("preserves Platform collections and derives certification inventory", () => {
    assert.equal(SceneRenderingCertificationInventory.platformInventory,
      SceneRenderingCertification.platform.inventory);
    assert.equal(SceneRenderingCertificationInventory.platformCapabilities,
      SceneRenderingCertification.platform.capabilities);
    assert.equal(SceneRenderingCertificationInventory.platformGuarantees,
      SceneRenderingCertification.platform.guarantees);
    assert.equal(SceneRenderingCertificationInventory.platformCompatibility,
      SceneRenderingCertification.platform.compatibility);
    assert.equal(SceneRenderingCertificationInventory.criteriaCount,
      SceneRenderingCertification.criteria.length);
    assert.equal(SceneRenderingCertificationInventory.hardcodesInventoryTotals, false);
    assert.equal(SceneRenderingCertificationInventory.recalculatesPlatformInventory, false);
  });

  it("provides stable metadata-only accessors", () => {
    assert.equal(getSceneRenderingCertificationSummary(), SceneRenderingCertificationMetadata);
    assert.equal(getSceneRenderingCertificationCount(), SceneRenderingCertification.criteria.length);
    assert.deepEqual(getSceneRenderingCertificationReleaseMetadata(), {
      id: "EVE-2:7/SceneRenderingCertification", version: "1.0.0",
      status: "Certified", readiness: "ReadyForFreeze",
    });
  });

  it("consumes only Scene Rendering Platform", () => {
    assert.equal(SceneRenderingCertificationMetadata.dependency.sceneRenderingPlatformOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering(?:Foundation|Registry|Model|Validation|Manifest)/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no certification or rendering runtime", () => {
    assert.ok(Object.isFrozen(SceneRenderingCertification));
    assert.ok(Object.isFrozen(SceneRenderingCertificationMetadata));
    assert.ok(Object.isFrozen(SceneRenderingCertificationInventory));
    assert.equal(SceneRenderingCertification.certificationEngine, false);
    assert.equal(SceneRenderingCertification.automaticCertificationExecution, false);
    assert.equal(SceneRenderingCertification.validationEngine, false);
    assert.equal(SceneRenderingCertification.execution, false);
    assert.equal(SceneRenderingCertification.rendering, false);
    assert.equal(SceneRenderingCertification.sceneExecution, false);
    assert.equal(SceneRenderingCertification.services, false);
    assert.equal(SceneRenderingCertification.factories, false);
  });
});
