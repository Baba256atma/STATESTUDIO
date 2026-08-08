import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS,
  DIRECTOR_RUNTIME_INTEGRATION_STATES,
  DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS,
  createDirectorRuntimeIntegrationBindingDescriptor,
  createDirectorRuntimeIntegrationSourceReference,
  createDirectorRuntimeIntegrationTargetReference,
  directorRuntimeIntegrationAuthority,
  directorRuntimeIntegrationDirection,
  directorRuntimeIntegrationFoundationIdentity,
  directorRuntimeIntegrationFoundationMetadata,
  directorRuntimeIntegrationFoundationNamespace,
  directorRuntimeIntegrationFoundationRegistry,
  directorRuntimeIntegrationFoundationRegistryCount,
  directorRuntimeIntegrationFoundationVersion,
  getDirectorRuntimeIntegrationFoundationRegistry,
  isDirectorRuntimeIntegrationSourceKind,
  isDirectorRuntimeIntegrationState,
  isDirectorRuntimeIntegrationTargetKind,
  verifyDirectorRuntimeIntegrationFoundation,
} from "./directorRuntimeIntegrationFoundation.ts";

const source = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "directorRuntimeIntegrationFoundation.ts",
  ),
  "utf8",
);

describe("DRI-1:1 Director Runtime Integration Foundation", () => {
  it("publishes the exact canonical identity", () => {
    assert.equal(
      directorRuntimeIntegrationFoundationIdentity,
      "DRI-1:1/DirectorRuntimeIntegrationFoundation",
    );
    assert.equal(directorRuntimeIntegrationFoundationVersion, "1.1.0");
    assert.equal(
      directorRuntimeIntegrationFoundationNamespace,
      "nexora.dri.runtime.integration.foundation",
    );
    assert.deepEqual(directorRuntimeIntegrationFoundationMetadata, {
      identity: "DRI-1:1/DirectorRuntimeIntegrationFoundation",
      version: "1.1.0",
      namespace: "nexora.dri.runtime.integration.foundation",
      layer: "DRI",
      phase: "DRI-1",
      stage: "Foundation",
      status: "FoundationReady",
    });
    assert.equal(verifyDirectorRuntimeIntegrationFoundation(), true);
  });

  it("exposes the required source kinds in deterministic order", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS, [
      "runtime-context", "runtime-object", "runtime-goal", "runtime-pack",
      "runtime-kpi", "runtime-decision", "runtime-execution",
      "runtime-monitoring", "runtime-timeline",
    ]);
    for (const kind of DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS) {
      assert.equal(isDirectorRuntimeIntegrationSourceKind(kind), true);
    }
    assert.equal(isDirectorRuntimeIntegrationSourceKind("unknown"), false);
    assert.equal(Object.isFrozen(DIRECTOR_RUNTIME_INTEGRATION_SOURCE_KINDS), true);
  });

  it("exposes the required target kinds and rejects unknown kinds", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS, [
      "scene", "node", "relationship", "composition", "focus",
      "visibility", "interaction", "presentation", "status",
    ]);
    for (const kind of DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS) {
      assert.equal(isDirectorRuntimeIntegrationTargetKind(kind), true);
    }
    assert.equal(isDirectorRuntimeIntegrationTargetKind("mesh"), false);
    assert.equal(Object.isFrozen(DIRECTOR_RUNTIME_INTEGRATION_TARGET_KINDS), true);
  });

  it("exposes exactly seven immutable lifecycle states", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_STATES, [
      "idle", "ready", "binding", "synchronized", "stale", "blocked", "error",
    ]);
    assert.equal(DIRECTOR_RUNTIME_INTEGRATION_STATES.length, 7);
    for (const state of DIRECTOR_RUNTIME_INTEGRATION_STATES) {
      assert.equal(isDirectorRuntimeIntegrationState(state), true);
    }
    assert.equal(isDirectorRuntimeIntegrationState("syncing"), false);
    assert.equal(Object.isFrozen(DIRECTOR_RUNTIME_INTEGRATION_STATES), true);
  });

  it("declares the one-way direction and Runtime authority", () => {
    assert.equal(directorRuntimeIntegrationDirection, "runtime-to-director");
    assert.deepEqual(directorRuntimeIntegrationAuthority, {
      runtime: "authoritative-operational-state",
      dri: "integration-interpreting-boundary",
      nolDirector: "presentation-representation",
      directorPresentationIsAuthoritative: false,
    });
    assert.equal(Object.isFrozen(directorRuntimeIntegrationAuthority), true);
  });

  it("creates source and target references without mutating inputs", () => {
    const sourceInput = {
      sourceKind: "runtime-goal" as const,
      sourceId: "opaque/runtime/goal:7",
      runtimeRevision: 12,
    };
    const targetInput = {
      targetKind: "focus" as const,
      targetId: "opaque/director/target:3",
    };
    const sourceSnapshot = structuredClone(sourceInput);
    const targetSnapshot = structuredClone(targetInput);
    const runtimeReference =
      createDirectorRuntimeIntegrationSourceReference(sourceInput);
    const directorReference =
      createDirectorRuntimeIntegrationTargetReference(targetInput);

    assert.deepEqual(sourceInput, sourceSnapshot);
    assert.deepEqual(targetInput, targetSnapshot);
    assert.deepEqual(runtimeReference, sourceInput);
    assert.deepEqual(directorReference, targetInput);
    assert.notEqual(runtimeReference, sourceInput);
    assert.notEqual(directorReference, targetInput);
    assert.equal(Object.isFrozen(runtimeReference), true);
    assert.equal(Object.isFrozen(directorReference), true);
  });

  it("enforces structural reference validation only", () => {
    assert.throws(
      () => createDirectorRuntimeIntegrationSourceReference({
        sourceKind: "unknown" as "runtime-goal",
        sourceId: "goal-1",
        runtimeRevision: 1,
      }),
      TypeError,
    );
    assert.throws(
      () => createDirectorRuntimeIntegrationSourceReference({
        sourceKind: "runtime-goal", sourceId: "", runtimeRevision: 1,
      }),
      TypeError,
    );
    assert.throws(
      () => createDirectorRuntimeIntegrationSourceReference({
        sourceKind: "runtime-goal", sourceId: "goal-1", runtimeRevision: Number.NaN,
      }),
      TypeError,
    );
    assert.throws(
      () => createDirectorRuntimeIntegrationTargetReference({
        targetKind: "mesh" as "scene", targetId: "target-1",
      }),
      TypeError,
    );
  });

  it("creates a deeply immutable deterministic binding", () => {
    const sourceInput = {
      sourceKind: "runtime-object" as const,
      sourceId: "object-1",
      runtimeRevision: 4,
    };
    const targetInput = {
      targetKind: "node" as const,
      targetId: "node-1",
    };
    const input = {
      bindingId: "binding-1",
      source: sourceInput,
      target: targetInput,
      state: "ready" as const,
    };
    const left = createDirectorRuntimeIntegrationBindingDescriptor(input);
    const right = createDirectorRuntimeIntegrationBindingDescriptor(input);

    assert.deepEqual(left, input);
    assert.deepEqual(right, left);
    assert.equal(left.state, "ready");
    assert.equal(left.source.sourceId, "object-1");
    assert.equal(left.target.targetId, "node-1");
    assert.equal(Object.isFrozen(left), true);
    assert.equal(Object.isFrozen(left.source), true);
    assert.equal(Object.isFrozen(left.target), true);
    assert.equal(Object.isFrozen(sourceInput), false);
    assert.equal(Object.isFrozen(targetInput), false);
  });

  it("publishes an ordered, immutable registry with a dynamic count", () => {
    assert.deepEqual(
      directorRuntimeIntegrationFoundationRegistry.map(({ concept }) => concept),
      [
        "identity", "integration-direction", "source-kinds", "target-kinds",
        "integration-states", "runtime-source-reference",
        "director-target-reference", "binding-descriptor", "runtime-authority",
        "determinism", "immutability",
      ],
    );
    assert.deepEqual(
      directorRuntimeIntegrationFoundationRegistry.map(({ order }) => order),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    );
    assert.equal(
      directorRuntimeIntegrationFoundationRegistryCount,
      directorRuntimeIntegrationFoundationRegistry.length,
    );
    assert.equal(
      getDirectorRuntimeIntegrationFoundationRegistry(),
      directorRuntimeIntegrationFoundationRegistry,
    );
    assert.equal(Object.isFrozen(directorRuntimeIntegrationFoundationRegistry), true);
    for (const entry of directorRuntimeIntegrationFoundationRegistry) {
      assert.equal(Object.isFrozen(entry), true);
    }
  });

  it("has no runtime, NOL internals, UI, renderer, browser, or I/O dependency", () => {
    assert.doesNotMatch(source, /^import\s/m);
    assert.doesNotMatch(
      source,
      /\b(?:React|ReactDOM|THREE|window|document|fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\b/,
    );
  });
});
