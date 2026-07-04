import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAwarenessContextAggregator,
  ExecutiveAwarenessContextAggregatorPlatform,
  buildExecutiveAwarenessContextManifest,
  getExecutiveAwarenessContextCompatibilityMatrix,
  getExecutiveAwarenessContextRegistry,
  validateExecutiveAwarenessContextAggregator,
  validateExecutiveAwarenessContextManifest,
  validateExecutiveAwarenessContextRegistry,
} from "./executiveAwarenessContextAggregatorIndex.ts";
import type { ExecutiveContextRegistry, ExecutiveContextSource } from "./executiveAwarenessContextAggregatorTypes.ts";

test("publishes immutable aggregator contracts", () => {
  assert.equal(ExecutiveAwarenessContextAggregator.aggregatorId, "executive-awareness-context-aggregator");
  assert.equal(ExecutiveAwarenessContextAggregator.context.entries.length, 11);
  assert.equal(ExecutiveAwarenessContextAggregator.metadata.metadataOnly, true);
  assert.equal(ExecutiveAwarenessContextAggregator.policy.executionAllowed, false);
  assert.equal(Object.isFrozen(ExecutiveAwarenessContextAggregator), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveAwarenessContextRegistry();

  assert.equal(registry.providers.length, 11);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.categories.length, 12);
  assert.equal(registry.contextTypes.length, 11);
  assert.equal(registry.publicApis.length, 8);
  assert.equal(validateExecutiveAwarenessContextRegistry(registry).valid, true);
});

test("generates manifest", () => {
  const manifest = buildExecutiveAwarenessContextManifest();

  assert.equal(manifest.platformId, "nexora-executive-awareness-context-aggregator");
  assert.equal(manifest.aggregatorId, "executive-awareness-context-aggregator");
  assert.equal(manifest.version, "LAY-CONN-5");
  assert.equal(manifest.dependencies.some((entry) => entry.dependencyId === "LAY-CONN-4"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const validation = validateExecutiveAwarenessContextManifest(buildExecutiveAwarenessContextManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility including future providers", () => {
  const compatibility = getExecutiveAwarenessContextCompatibilityMatrix();

  assert.equal(compatibility.length, 12);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-1" && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE" && entry.required), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "KNL" && entry.mode === "future-compatible"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "ASS" && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveAwarenessContextAggregator().valid, true);

  const invalid = validateExecutiveAwarenessContextAggregator(Object.freeze({
    ...ExecutiveAwarenessContextAggregator,
    metadata: Object.freeze({ ...ExecutiveAwarenessContextAggregator.metadata, metadataOnly: false }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid context provider", () => {
  const invalid = validateExecutiveAwarenessContextAggregator(Object.freeze({
    ...ExecutiveAwarenessContextAggregator,
    context: Object.freeze({
      ...ExecutiveAwarenessContextAggregator.context,
      entries: Object.freeze([
        Object.freeze({ ...ExecutiveAwarenessContextAggregator.context.entries[0], source: "Unknown Source" as ExecutiveContextSource }),
      ]),
    }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-context-provider:Unknown Source"), true);
});

test("detects invalid consumer metadata", () => {
  const registry = getExecutiveAwarenessContextRegistry();
  const invalidRegistry: ExecutiveContextRegistry = Object.freeze({
    ...registry,
    consumers: Object.freeze([
      Object.freeze({ consumerId: "bad-consumer", name: "Bad Consumer", metadataOnly: false }),
    ]),
  });

  const validation = validateExecutiveAwarenessContextRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-context-consumer"), true);
});

test("detects duplicate context types and registrations", () => {
  const registry = getExecutiveAwarenessContextRegistry();
  const firstProvider = registry.providers[0];

  assert.ok(firstProvider);

  const duplicateRegistry: ExecutiveContextRegistry = Object.freeze({
    ...registry,
    contextTypes: Object.freeze(["judgment-context", "judgment-context"] as const),
    providers: Object.freeze([firstProvider, firstProvider]),
  });
  const validation = validateExecutiveAwarenessContextRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-context-type:judgment-context"), true);
  assert.equal(validation.errors.includes("duplicate-provider:app-reason-provider"), true);
});

test("detects invalid dependencies", () => {
  const registry = getExecutiveAwarenessContextRegistry();
  const invalidRegistry: ExecutiveContextRegistry = Object.freeze({
    ...registry,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "bad-required-future", required: true, mode: "future-compatible" }),
    ]),
  });

  const validation = validateExecutiveAwarenessContextRegistry(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-dependencies"), true);
});

test("exports public aggregator APIs", () => {
  assert.equal(typeof ExecutiveAwarenessContextAggregatorPlatform.buildExecutiveAwarenessContextManifest, "function");
  assert.equal(typeof ExecutiveAwarenessContextAggregatorPlatform.validateExecutiveAwarenessContextAggregator, "function");
  assert.equal(typeof ExecutiveAwarenessContextAggregatorPlatform.validateExecutiveAwarenessContextManifest, "function");
  assert.equal(typeof ExecutiveAwarenessContextAggregatorPlatform.validateExecutiveAwarenessContextRegistry, "function");
  assert.equal(typeof ExecutiveAwarenessContextAggregatorPlatform.getExecutiveAwarenessContextRegistry, "function");
  assert.equal(typeof ExecutiveAwarenessContextAggregatorPlatform.getExecutiveAwarenessContextCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveAwarenessContextManifest();
  const second = buildExecutiveAwarenessContextManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.supportedContextTypes, second.supportedContextTypes);
});
