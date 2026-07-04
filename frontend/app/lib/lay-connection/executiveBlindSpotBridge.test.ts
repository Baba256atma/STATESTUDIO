import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBlindSpotBridge,
  ExecutiveBlindSpotBridgePlatform,
  buildExecutiveBlindSpotManifest,
  getExecutiveBlindSpotCompatibilityMatrix,
  getExecutiveBlindSpotRegistry,
  validateExecutiveBlindSpotBridge,
  validateExecutiveBlindSpotManifest,
  validateExecutiveBlindSpotRegistry,
} from "./executiveBlindSpotBridgeIndex.ts";
import type { ExecutiveBlindSpotCategory, ExecutiveBlindSpotRegistry } from "./executiveBlindSpotBridgeTypes.ts";

test("publishes immutable blind spot bridge contracts", () => {
  assert.equal(ExecutiveBlindSpotBridge.bridgeId, "executive-blind-spot-bridge");
  assert.equal(ExecutiveBlindSpotBridge.candidates.length, 3);
  assert.equal(ExecutiveBlindSpotBridge.metadata.metadataOnly, true);
  assert.equal(ExecutiveBlindSpotBridge.policy.derivationAllowed, false);
  assert.equal(Object.isFrozen(ExecutiveBlindSpotBridge), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveBlindSpotRegistry();

  assert.equal(registry.providers.length, 11);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.categories.length, 12);
  assert.equal(registry.blindSpotTypes.length, 12);
  assert.equal(registry.publicApis.length, 8);
  assert.equal(validateExecutiveBlindSpotRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveBlindSpotManifest();

  assert.equal(manifest.platformId, "executive-blind-spot-bridge");
  assert.equal(manifest.platformVersion, "LAY-CONN-8");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-7"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutiveBlindSpotManifest(buildExecutiveBlindSpotManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including future providers", () => {
  const compatibility = getExecutiveBlindSpotCompatibilityMatrix();

  assert.equal(compatibility.length, 15);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-7" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE" && entry.required), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "KNL" && entry.mode === "future-compatible"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "ASS" && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveBlindSpotBridge().valid, true);

  const invalid = validateExecutiveBlindSpotBridge(Object.freeze({
    ...ExecutiveBlindSpotBridge,
    policy: Object.freeze({ ...ExecutiveBlindSpotBridge.policy, derivationAllowed: true }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid category and type", () => {
  const invalid = validateExecutiveBlindSpotBridge(Object.freeze({
    ...ExecutiveBlindSpotBridge,
    candidates: Object.freeze([
      Object.freeze({
        ...ExecutiveBlindSpotBridge.candidates[0],
        identity: Object.freeze({
          blindSpotId: "bad-blind-spot",
          name: "Bad Blind Spot",
          category: "Invalid" as ExecutiveBlindSpotCategory,
          blindSpotType: "invalid-blind-spot-type",
        }),
      }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-blind-spot-category:Invalid"), true);
  assert.equal(invalid.errors.includes("invalid-blind-spot-type:invalid-blind-spot-type"), true);
});

test("detects missing exchange references", () => {
  const invalid = validateExecutiveBlindSpotBridge(Object.freeze({
    ...ExecutiveBlindSpotBridge,
    candidates: Object.freeze([]),
    evidence: Object.freeze([]),
    assumptions: Object.freeze([]),
    constraints: Object.freeze([]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-candidates"), true);
  assert.equal(invalid.errors.includes("missing-evidence"), true);
  assert.equal(invalid.errors.includes("missing-assumptions"), true);
  assert.equal(invalid.errors.includes("missing-constraints"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveBlindSpotRegistry();
  const firstProvider = registry.providers[0];

  assert.ok(firstProvider);

  const duplicateRegistry: ExecutiveBlindSpotRegistry = Object.freeze({
    ...registry,
    blindSpotTypes: Object.freeze(["risk-blind-spot", "risk-blind-spot"] as const),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutiveBlindSpotRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-blind-spot-type:risk-blind-spot"), true);
  assert.equal(validation.errors.includes("duplicate-provider:app-reason-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutiveBlindSpotRegistry();
  const invalidRegistry: ExecutiveBlindSpotRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-future", required: true, mode: "future-compatible" }),
    ]),
  });
  const validation = validateExecutiveBlindSpotRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public blind spot APIs", () => {
  assert.equal(typeof ExecutiveBlindSpotBridgePlatform.buildExecutiveBlindSpotManifest, "function");
  assert.equal(typeof ExecutiveBlindSpotBridgePlatform.validateExecutiveBlindSpotBridge, "function");
  assert.equal(typeof ExecutiveBlindSpotBridgePlatform.validateExecutiveBlindSpotManifest, "function");
  assert.equal(typeof ExecutiveBlindSpotBridgePlatform.validateExecutiveBlindSpotRegistry, "function");
  assert.equal(typeof ExecutiveBlindSpotBridgePlatform.getExecutiveBlindSpotRegistry, "function");
  assert.equal(typeof ExecutiveBlindSpotBridgePlatform.getExecutiveBlindSpotCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveBlindSpotManifest();
  const second = buildExecutiveBlindSpotManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedBlindSpotTypes, second.supportedBlindSpotTypes);
});
