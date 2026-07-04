import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutivePrioritySignalPlatform,
  ExecutivePrioritySignalPlatformFacade,
  buildExecutivePrioritySignalManifest,
  getExecutivePrioritySignalCompatibilityMatrix,
  getExecutivePrioritySignalRegistry,
  validateExecutivePrioritySignalManifest,
  validateExecutivePrioritySignalPlatform,
  validateExecutivePrioritySignalRegistry,
} from "./executivePrioritySignalIndex.ts";
import type { ExecutivePrioritySignalCategory, ExecutivePrioritySignalRegistry } from "./executivePrioritySignalTypes.ts";

test("publishes immutable priority signal contracts", () => {
  assert.equal(ExecutivePrioritySignalPlatform.platformId, "executive-priority-signal-platform");
  assert.equal(ExecutivePrioritySignalPlatform.signals.length, 12);
  assert.equal(ExecutivePrioritySignalPlatform.metadata.metadataOnly, true);
  assert.equal(ExecutivePrioritySignalPlatform.policy.derivationAllowed, false);
  assert.equal(Object.isFrozen(ExecutivePrioritySignalPlatform), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutivePrioritySignalRegistry();

  assert.equal(registry.providers.length, 11);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.categories.length, 12);
  assert.equal(registry.priorityTypes.length, 12);
  assert.equal(registry.publicApis.length, 7);
  assert.equal(validateExecutivePrioritySignalRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutivePrioritySignalManifest();

  assert.equal(manifest.platformId, "executive-priority-signal-platform");
  assert.equal(manifest.platformVersion, "LAY-CONN-7");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-6"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutivePrioritySignalManifest(buildExecutivePrioritySignalManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including future providers", () => {
  const compatibility = getExecutivePrioritySignalCompatibilityMatrix();

  assert.equal(compatibility.length, 14);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-6" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE" && entry.required), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "KNL" && entry.mode === "future-compatible"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "ASS" && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutivePrioritySignalPlatform().valid, true);

  const invalid = validateExecutivePrioritySignalPlatform(Object.freeze({
    ...ExecutivePrioritySignalPlatform,
    policy: Object.freeze({ ...ExecutivePrioritySignalPlatform.policy, derivationAllowed: true }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid provider", () => {
  const invalid = validateExecutivePrioritySignalPlatform(Object.freeze({
    ...ExecutivePrioritySignalPlatform,
    signals: Object.freeze([
      Object.freeze({ ...ExecutivePrioritySignalPlatform.signals[0], sourceId: "unknown-provider" }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-provider:unknown-provider"), true);
});

test("detects invalid category and priority type", () => {
  const invalid = validateExecutivePrioritySignalPlatform(Object.freeze({
    ...ExecutivePrioritySignalPlatform,
    signals: Object.freeze([
      Object.freeze({
        ...ExecutivePrioritySignalPlatform.signals[0],
        identity: Object.freeze({
          signalId: "bad-signal",
          name: "Bad Signal",
          category: "Invalid" as ExecutivePrioritySignalCategory,
          priorityType: "invalid-priority-type",
        }),
      }),
    ]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-category:Invalid"), true);
  assert.equal(invalid.errors.includes("invalid-priority-type:invalid-priority-type"), true);
});

test("detects duplicate priority types and registrations", () => {
  const registry = getExecutivePrioritySignalRegistry();
  const firstProvider = registry.providers[0];

  assert.ok(firstProvider);

  const duplicateRegistry: ExecutivePrioritySignalRegistry = Object.freeze({
    ...registry,
    priorityTypes: Object.freeze(["risk-priority", "risk-priority"] as const),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutivePrioritySignalRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-priority-type:risk-priority"), true);
  assert.equal(validation.errors.includes("duplicate-provider:app-reason-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutivePrioritySignalRegistry();
  const invalidRegistry: ExecutivePrioritySignalRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-future", required: true, mode: "future-compatible" }),
    ]),
  });
  const validation = validateExecutivePrioritySignalRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public priority APIs", () => {
  assert.equal(typeof ExecutivePrioritySignalPlatformFacade.buildExecutivePrioritySignalManifest, "function");
  assert.equal(typeof ExecutivePrioritySignalPlatformFacade.validateExecutivePrioritySignalPlatform, "function");
  assert.equal(typeof ExecutivePrioritySignalPlatformFacade.validateExecutivePrioritySignalManifest, "function");
  assert.equal(typeof ExecutivePrioritySignalPlatformFacade.validateExecutivePrioritySignalRegistry, "function");
  assert.equal(typeof ExecutivePrioritySignalPlatformFacade.getExecutivePrioritySignalRegistry, "function");
  assert.equal(typeof ExecutivePrioritySignalPlatformFacade.getExecutivePrioritySignalCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutivePrioritySignalManifest();
  const second = buildExecutivePrioritySignalManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedPriorityTypes, second.supportedPriorityTypes);
});
