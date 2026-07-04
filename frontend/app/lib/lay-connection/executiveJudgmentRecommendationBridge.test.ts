import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveJudgmentRecommendationBridge,
  ExecutiveJudgmentRecommendationBridgePlatform,
  buildExecutiveJudgmentRecommendationBridgeManifest,
  getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix,
  getExecutiveJudgmentRecommendationBridgeRegistry,
  validateExecutiveJudgmentRecommendationBridge,
  validateExecutiveJudgmentRecommendationBridgeManifest,
  validateExecutiveJudgmentRecommendationBridgeRegistry,
} from "./executiveJudgmentRecommendationBridgeIndex.ts";
import type { ExecutiveRecommendationRegistry } from "./executiveJudgmentRecommendationBridgeTypes.ts";

test("publishes immutable bridge contracts", () => {
  assert.equal(ExecutiveJudgmentRecommendationBridge.bridgeId, "executive-judgment-recommendation-bridge");
  assert.equal(ExecutiveJudgmentRecommendationBridge.judgmentInput.producerId, "APP-JUDGE");
  assert.equal(ExecutiveJudgmentRecommendationBridge.recommendationRequest.consumerId, "APP-RECOMMENDATION");
  assert.equal(ExecutiveJudgmentRecommendationBridge.metadata.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveJudgmentRecommendationBridge), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveJudgmentRecommendationBridgeRegistry();

  assert.deepEqual(registry.supportedProducers, ["APP-JUDGE"]);
  assert.deepEqual(registry.supportedConsumers, ["APP-RECOMMENDATION"]);
  assert.equal(registry.supportedPayloadTypes.length, 10);
  assert.equal(registry.publicApis.length, 6);
  assert.equal(validateExecutiveJudgmentRecommendationBridgeRegistry(registry).valid, true);
});

test("generates bridge manifest", () => {
  const manifest = buildExecutiveJudgmentRecommendationBridgeManifest();

  assert.equal(manifest.platformId, "nexora-executive-judgment-recommendation-bridge");
  assert.equal(manifest.bridgeId, "executive-judgment-recommendation-bridge");
  assert.equal(manifest.dependencies.includes("LAY-CONN-1"), true);
  assert.equal(manifest.dependencies.includes("LAY-CONN-2"), true);
  assert.equal(manifest.dependencies.includes("APP-JUDGE"), true);
  assert.equal(manifest.dependencies.includes("APP-RECOMMENDATION"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const manifest = buildExecutiveJudgmentRecommendationBridgeManifest();
  const validation = validateExecutiveJudgmentRecommendationBridgeManifest(manifest);

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility", () => {
  const compatibility = getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix();

  assert.equal(compatibility.length, 4);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-1"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-2"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-RECOMMENDATION"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveJudgmentRecommendationBridge().valid, true);

  const invalid = validateExecutiveJudgmentRecommendationBridge(Object.freeze({
    ...ExecutiveJudgmentRecommendationBridge,
    metadata: Object.freeze({ ...ExecutiveJudgmentRecommendationBridge.metadata, immutable: false }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid judgment result", () => {
  const invalid = validateExecutiveJudgmentRecommendationBridge(Object.freeze({
    ...ExecutiveJudgmentRecommendationBridge,
    judgmentInput: Object.freeze({ ...ExecutiveJudgmentRecommendationBridge.judgmentInput, producerId: "UNKNOWN" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-judgment-result:UNKNOWN"), true);
});

test("detects invalid recommendation consumer", () => {
  const invalid = validateExecutiveJudgmentRecommendationBridge(Object.freeze({
    ...ExecutiveJudgmentRecommendationBridge,
    recommendationRequest: Object.freeze({ ...ExecutiveJudgmentRecommendationBridge.recommendationRequest, consumerId: "UNKNOWN" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-recommendation-consumer:UNKNOWN"), true);
});

test("detects missing evidence constraints and tradeoffs", () => {
  const invalid = validateExecutiveJudgmentRecommendationBridge(Object.freeze({
    ...ExecutiveJudgmentRecommendationBridge,
    evidence: Object.freeze([]),
    constraints: Object.freeze([]),
    tradeoffs: Object.freeze([]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-decision-evidence"), true);
  assert.equal(invalid.errors.includes("missing-constraints"), true);
  assert.equal(invalid.errors.includes("missing-tradeoffs"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveJudgmentRecommendationBridgeRegistry();
  const duplicateRegistry: ExecutiveRecommendationRegistry = Object.freeze({
    ...registry,
    supportedConsumers: Object.freeze(["APP-RECOMMENDATION", "APP-RECOMMENDATION"] as const),
  });
  const validation = validateExecutiveJudgmentRecommendationBridgeRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-consumer:APP-RECOMMENDATION"), true);
});

test("exports public bridge APIs", () => {
  assert.equal(typeof ExecutiveJudgmentRecommendationBridgePlatform.buildExecutiveJudgmentRecommendationBridgeManifest, "function");
  assert.equal(typeof ExecutiveJudgmentRecommendationBridgePlatform.validateExecutiveJudgmentRecommendationBridge, "function");
  assert.equal(typeof ExecutiveJudgmentRecommendationBridgePlatform.validateExecutiveJudgmentRecommendationBridgeManifest, "function");
  assert.equal(typeof ExecutiveJudgmentRecommendationBridgePlatform.getExecutiveJudgmentRecommendationBridgeRegistry, "function");
  assert.equal(typeof ExecutiveJudgmentRecommendationBridgePlatform.getExecutiveJudgmentRecommendationBridgeCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveJudgmentRecommendationBridgeManifest();
  const second = buildExecutiveJudgmentRecommendationBridgeManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.dependencies, second.dependencies);
});
