import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAttentionSignalPlatform,
  ExecutiveAttentionSignalPlatformFacade,
  buildExecutiveAttentionSignalManifest,
  getExecutiveAttentionSignalCompatibilityMatrix,
  getExecutiveAttentionSignalRegistry,
  validateExecutiveAttentionSignalManifest,
  validateExecutiveAttentionSignalPlatform,
  validateExecutiveAttentionSignalRegistry,
} from "./executiveAttentionSignalIndex.ts";
import type { ExecutiveAttentionSignalCategory, ExecutiveAttentionSignalRegistry } from "./executiveAttentionSignalTypes.ts";

test("publishes immutable attention signal contracts", () => {
  assert.equal(ExecutiveAttentionSignalPlatform.platformId, "executive-attention-signal-platform");
  assert.equal(ExecutiveAttentionSignalPlatform.signals.length, 12);
  assert.equal(ExecutiveAttentionSignalPlatform.metadata.metadataOnly, true);
  assert.equal(ExecutiveAttentionSignalPlatform.policy.creationAllowed, false);
  assert.equal(Object.isFrozen(ExecutiveAttentionSignalPlatform), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveAttentionSignalRegistry();

  assert.equal(registry.providers.length, 10);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.categories.length, 12);
  assert.equal(registry.signalTypes.length, 12);
  assert.equal(registry.publicApis.length, 7);
  assert.equal(validateExecutiveAttentionSignalRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveAttentionSignalManifest();

  assert.equal(manifest.platformId, "executive-attention-signal-platform");
  assert.equal(manifest.platformVersion, "LAY-CONN-6");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-5"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutiveAttentionSignalManifest(buildExecutiveAttentionSignalManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including future providers", () => {
  const compatibility = getExecutiveAttentionSignalCompatibilityMatrix();

  assert.equal(compatibility.length, 13);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-5" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE" && entry.required), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "KNL" && entry.mode === "future-compatible"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "ASS" && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveAttentionSignalPlatform().valid, true);

  const invalid = validateExecutiveAttentionSignalPlatform(Object.freeze({
    ...ExecutiveAttentionSignalPlatform,
    policy: Object.freeze({ ...ExecutiveAttentionSignalPlatform.policy, creationAllowed: true }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid provider", () => {
  const invalid = validateExecutiveAttentionSignalPlatform(Object.freeze({
    ...ExecutiveAttentionSignalPlatform,
    signals: Object.freeze([
      Object.freeze({ ...ExecutiveAttentionSignalPlatform.signals[0], sourceId: "unknown-provider" }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-provider:unknown-provider"), true);
});

test("detects invalid category and signal type", () => {
  const invalid = validateExecutiveAttentionSignalPlatform(Object.freeze({
    ...ExecutiveAttentionSignalPlatform,
    signals: Object.freeze([
      Object.freeze({
        ...ExecutiveAttentionSignalPlatform.signals[0],
        identity: Object.freeze({
          signalId: "bad-signal",
          name: "Bad Signal",
          category: "Invalid" as ExecutiveAttentionSignalCategory,
          signalType: "invalid-signal-type",
        }),
      }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-category:Invalid"), true);
  assert.equal(invalid.errors.includes("invalid-signal-type:invalid-signal-type"), true);
});

test("detects duplicate signal types and registrations", () => {
  const registry = getExecutiveAttentionSignalRegistry();
  const firstProvider = registry.providers[0];

  assert.ok(firstProvider);

  const duplicateRegistry: ExecutiveAttentionSignalRegistry = Object.freeze({
    ...registry,
    signalTypes: Object.freeze(["risk-attention", "risk-attention"] as const),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutiveAttentionSignalRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-signal-type:risk-attention"), true);
  assert.equal(validation.errors.includes("duplicate-provider:app-reason-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutiveAttentionSignalRegistry();
  const invalidRegistry: ExecutiveAttentionSignalRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-future", required: true, mode: "future-compatible" }),
    ]),
  });
  const validation = validateExecutiveAttentionSignalRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public signal APIs", () => {
  assert.equal(typeof ExecutiveAttentionSignalPlatformFacade.buildExecutiveAttentionSignalManifest, "function");
  assert.equal(typeof ExecutiveAttentionSignalPlatformFacade.validateExecutiveAttentionSignalPlatform, "function");
  assert.equal(typeof ExecutiveAttentionSignalPlatformFacade.validateExecutiveAttentionSignalManifest, "function");
  assert.equal(typeof ExecutiveAttentionSignalPlatformFacade.validateExecutiveAttentionSignalRegistry, "function");
  assert.equal(typeof ExecutiveAttentionSignalPlatformFacade.getExecutiveAttentionSignalRegistry, "function");
  assert.equal(typeof ExecutiveAttentionSignalPlatformFacade.getExecutiveAttentionSignalCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveAttentionSignalManifest();
  const second = buildExecutiveAttentionSignalManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedSignalTypes, second.supportedSignalTypes);
});
