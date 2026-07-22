import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { describe, it } from "node:test";

import {
  DirectorFoundation,
  DirectorFoundationId,
  DirectorFoundationLayer,
  DirectorFoundationNamespace,
  DirectorFoundationReadiness,
  DirectorFoundationStatus,
  DirectorFoundationVersion,
} from "./directorFoundation.ts";

const FILES = Object.freeze([
  "directorFoundationTypes.ts",
  "directorContracts.ts",
  "directorOwnership.ts",
  "directorBoundaries.ts",
  "directorLifecycle.ts",
  "directorCapabilities.ts",
  "directorFoundation.ts",
  "directorFoundation.test.ts",
]);

describe("DIRECTOR-1:1 Director Foundation", () => {
  it("has the deterministic foundation identity", () => {
    assert.equal(DirectorFoundationId, "DIRECTOR-1:1/DirectorFoundation");
    assert.equal(DirectorFoundationVersion, "1.0.0");
    assert.equal(DirectorFoundationNamespace, "nexora.director.foundation");
    assert.equal(DirectorFoundationLayer, "Director");
    assert.equal(DirectorFoundationStatus, "Foundation");
    assert.equal(DirectorFoundationReadiness, "ReadyForRegistry");
  });

  it("contains all eight requested Foundation files", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
  });

  it("declares all twelve contracts in stable order", () => {
    assert.deepEqual(DirectorFoundation.contractNames, [
      "ExecutiveScene", "ScenePlan", "SceneObject", "SceneLayer",
      "CameraFocus", "CameraTarget", "VisualizationIntent", "ExecutiveFocus",
      "Timeline", "AnimationInstruction", "SceneTransition", "SceneMarker",
    ]);
    assert.equal(DirectorFoundation.contracts.length, 12);
    assert.ok(DirectorFoundation.contracts.every((item) => item.runtimeBehavior === "None"));
  });

  it("preserves lifecycle, ownership, boundaries, and capabilities", () => {
    assert.deepEqual(DirectorFoundation.lifecycle.states, [
      "Declared", "Validated", "Prepared", "Orchestrated", "Delivered", "Archived",
    ]);
    assert.ok(DirectorFoundation.ownership.owns.includes("Scene orchestration"));
    assert.ok(DirectorFoundation.ownership.doesNotOwn.includes("Rendering"));
    assert.ok(DirectorFoundation.boundaries.mayConsume.includes("Executive Engine Public APIs"));
    assert.ok(DirectorFoundation.boundaries.mustNeverDirectlyConsume.includes("REST"));
    assert.equal(DirectorFoundation.boundaries.rendersGraphics, false);
    assert.equal(DirectorFoundation.capabilities.length, 10);
  });

  it("is immutable, registry-ready, and runtime-free", () => {
    assert.ok(Object.isFrozen(DirectorFoundation));
    assert.ok(Object.isFrozen(DirectorFoundation.identity));
    assert.ok(Object.isFrozen(DirectorFoundation.contracts));
    assert.ok(Object.isFrozen(DirectorFoundation.capabilities));
    assert.equal(DirectorFoundation.identity.readiness, "ReadyForRegistry");
    assert.equal(DirectorFoundation.runtimeServices, false);
    assert.equal(DirectorFoundation.factories, false);
    assert.equal(DirectorFoundation.execution, false);
  });
});
