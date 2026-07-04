import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveSceneEveSignalBridge,
  ExecutiveSceneEveSignalBridgePlatform,
  buildExecutiveSceneEveManifest,
  getExecutiveSceneEveCompatibilityMatrix,
  getExecutiveSceneEveRegistry,
  validateExecutiveSceneEveManifest,
  validateExecutiveSceneEveRegistry,
  validateExecutiveSceneEveSignalBridge,
} from "./executiveSceneEveSignalBridgeIndex.ts";
import type { ExecutiveSceneEveRegistry, ExecutiveSceneEveSignalCategory } from "./executiveSceneEveSignalBridgeTypes.ts";

test("publishes immutable scene eve bridge contracts", () => {
  assert.equal(ExecutiveSceneEveSignalBridge.bridgeId, "executive-scene-eve-signal-bridge");
  assert.equal(ExecutiveSceneEveSignalBridge.sceneSignals.length, 2);
  assert.equal(ExecutiveSceneEveSignalBridge.eveSignals.length, 2);
  assert.equal(ExecutiveSceneEveSignalBridge.references.length, 10);
  assert.equal(ExecutiveSceneEveSignalBridge.metadata.metadataOnly, true);
  assert.equal(ExecutiveSceneEveSignalBridge.policy.visualRuntimeAllowed, false);
  assert.equal(Object.isFrozen(ExecutiveSceneEveSignalBridge), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveSceneEveRegistry();

  assert.equal(registry.providers.length, 13);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.signalCategories.length, 12);
  assert.equal(registry.signalTypes.length, 12);
  assert.equal(registry.publicApis.length, 8);
  assert.equal(validateExecutiveSceneEveRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveSceneEveManifest();

  assert.equal(manifest.platformId, "executive-scene-eve-signal-bridge");
  assert.equal(manifest.platformVersion, "LAY-CONN-10");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-9"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutiveSceneEveManifest(buildExecutiveSceneEveManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including future providers", () => {
  const compatibility = getExecutiveSceneEveCompatibilityMatrix();

  assert.equal(compatibility.length, 13);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-9" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "SCENE" && entry.mode === "future-compatible"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "EVE" && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveSceneEveSignalBridge().valid, true);

  const invalid = validateExecutiveSceneEveSignalBridge(Object.freeze({
    ...ExecutiveSceneEveSignalBridge,
    policy: Object.freeze({ ...ExecutiveSceneEveSignalBridge.policy, signalDispatchAllowed: true }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid category and type", () => {
  const invalid = validateExecutiveSceneEveSignalBridge(Object.freeze({
    ...ExecutiveSceneEveSignalBridge,
    sceneSignals: Object.freeze([
      Object.freeze({
        ...ExecutiveSceneEveSignalBridge.sceneSignals[0],
        category: "Invalid" as ExecutiveSceneEveSignalCategory,
        signalType: "invalid-signal-type",
      }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-signal-category:Invalid"), true);
  assert.equal(invalid.errors.includes("invalid-signal-type:invalid-signal-type"), true);
});

test("detects missing signal metadata", () => {
  const invalid = validateExecutiveSceneEveSignalBridge(Object.freeze({
    ...ExecutiveSceneEveSignalBridge,
    sceneSignals: Object.freeze([]),
    eveSignals: Object.freeze([]),
    references: Object.freeze([]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-scene-signals"), true);
  assert.equal(invalid.errors.includes("missing-eve-signals"), true);
  assert.equal(invalid.errors.includes("missing-references"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveSceneEveRegistry();
  const firstProvider = registry.providers[0];

  assert.ok(firstProvider);

  const duplicateRegistry: ExecutiveSceneEveRegistry = Object.freeze({
    ...registry,
    signalTypes: Object.freeze(["camera-reference-signal", "camera-reference-signal"] as const),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutiveSceneEveRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-signal-type:camera-reference-signal"), true);
  assert.equal(validation.errors.includes("duplicate-provider:lay-connection-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutiveSceneEveRegistry();
  const invalidRegistry: ExecutiveSceneEveRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-future", required: true, mode: "future-compatible" }),
    ]),
  });
  const validation = validateExecutiveSceneEveRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public scene eve APIs", () => {
  assert.equal(typeof ExecutiveSceneEveSignalBridgePlatform.buildExecutiveSceneEveManifest, "function");
  assert.equal(typeof ExecutiveSceneEveSignalBridgePlatform.validateExecutiveSceneEveSignalBridge, "function");
  assert.equal(typeof ExecutiveSceneEveSignalBridgePlatform.validateExecutiveSceneEveManifest, "function");
  assert.equal(typeof ExecutiveSceneEveSignalBridgePlatform.validateExecutiveSceneEveRegistry, "function");
  assert.equal(typeof ExecutiveSceneEveSignalBridgePlatform.getExecutiveSceneEveRegistry, "function");
  assert.equal(typeof ExecutiveSceneEveSignalBridgePlatform.getExecutiveSceneEveCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveSceneEveManifest();
  const second = buildExecutiveSceneEveManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedSignalTypes, second.supportedSignalTypes);
});
