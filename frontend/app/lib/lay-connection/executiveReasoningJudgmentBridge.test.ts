import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReasoningJudgmentBridge,
  ExecutiveReasoningJudgmentBridgePlatform,
  buildExecutiveReasoningJudgmentBridgeManifest,
  getExecutiveReasoningJudgmentBridgeCompatibilityMatrix,
  getExecutiveReasoningJudgmentBridgeRegistry,
  validateExecutiveReasoningJudgmentBridge,
  validateExecutiveReasoningJudgmentBridgeManifest,
  validateExecutiveReasoningJudgmentBridgeRegistry,
} from "./executiveReasoningJudgmentBridgeIndex.ts";
import type { ExecutiveBridgeRegistry } from "./executiveReasoningJudgmentBridgeTypes.ts";

test("publishes immutable bridge contracts", () => {
  assert.equal(ExecutiveReasoningJudgmentBridge.bridgeId, "executive-reasoning-judgment-bridge");
  assert.equal(ExecutiveReasoningJudgmentBridge.reasoningInput.producerId, "APP-REASON");
  assert.equal(ExecutiveReasoningJudgmentBridge.judgmentRequest.consumerId, "APP-JUDGE");
  assert.equal(ExecutiveReasoningJudgmentBridge.metadata.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveReasoningJudgmentBridge), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveReasoningJudgmentBridgeRegistry();

  assert.deepEqual(registry.supportedProducers, ["APP-REASON"]);
  assert.deepEqual(registry.supportedConsumers, ["APP-JUDGE"]);
  assert.equal(registry.supportedPayloadTypes.length, 10);
  assert.equal(registry.publicApis.length, 6);
  assert.equal(validateExecutiveReasoningJudgmentBridgeRegistry(registry).valid, true);
});

test("generates bridge manifest", () => {
  const manifest = buildExecutiveReasoningJudgmentBridgeManifest();

  assert.equal(manifest.platformId, "nexora-executive-reasoning-judgment-bridge");
  assert.equal(manifest.bridgeId, "executive-reasoning-judgment-bridge");
  assert.equal(manifest.dependencies.includes("LAY-CONN-1"), true);
  assert.equal(manifest.dependencies.includes("APP-REASON"), true);
  assert.equal(manifest.dependencies.includes("APP-JUDGE"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const manifest = buildExecutiveReasoningJudgmentBridgeManifest();
  const validation = validateExecutiveReasoningJudgmentBridgeManifest(manifest);

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility", () => {
  const compatibility = getExecutiveReasoningJudgmentBridgeCompatibilityMatrix();

  assert.equal(compatibility.length, 3);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-1"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-REASON"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE"), true);
});

test("validates dependency and boundary rules", () => {
  const valid = validateExecutiveReasoningJudgmentBridge();

  assert.equal(valid.valid, true);

  const invalid = validateExecutiveReasoningJudgmentBridge(Object.freeze({
    ...ExecutiveReasoningJudgmentBridge,
    metadata: Object.freeze({ ...ExecutiveReasoningJudgmentBridge.metadata, metadataOnly: false }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid reasoning input", () => {
  const invalid = validateExecutiveReasoningJudgmentBridge(Object.freeze({
    ...ExecutiveReasoningJudgmentBridge,
    reasoningInput: Object.freeze({ ...ExecutiveReasoningJudgmentBridge.reasoningInput, producerId: "UNKNOWN" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-reasoning-input:UNKNOWN"), true);
});

test("detects invalid judgment consumer", () => {
  const invalid = validateExecutiveReasoningJudgmentBridge(Object.freeze({
    ...ExecutiveReasoningJudgmentBridge,
    judgmentRequest: Object.freeze({ ...ExecutiveReasoningJudgmentBridge.judgmentRequest, consumerId: "UNKNOWN" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-judgment-consumer:UNKNOWN"), true);
});

test("detects missing evidence and constraints", () => {
  const invalid = validateExecutiveReasoningJudgmentBridge(Object.freeze({
    ...ExecutiveReasoningJudgmentBridge,
    evidence: Object.freeze([]),
    constraints: Object.freeze([]),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-evidence"), true);
  assert.equal(invalid.errors.includes("missing-constraints"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveReasoningJudgmentBridgeRegistry();
  const duplicateRegistry: ExecutiveBridgeRegistry = Object.freeze({
    ...registry,
    supportedProducers: Object.freeze(["APP-REASON", "APP-REASON"] as const),
  });

  const validation = validateExecutiveReasoningJudgmentBridgeRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-producer:APP-REASON"), true);
});

test("exports public bridge APIs", () => {
  assert.equal(typeof ExecutiveReasoningJudgmentBridgePlatform.buildExecutiveReasoningJudgmentBridgeManifest, "function");
  assert.equal(typeof ExecutiveReasoningJudgmentBridgePlatform.validateExecutiveReasoningJudgmentBridge, "function");
  assert.equal(typeof ExecutiveReasoningJudgmentBridgePlatform.validateExecutiveReasoningJudgmentBridgeManifest, "function");
  assert.equal(typeof ExecutiveReasoningJudgmentBridgePlatform.getExecutiveReasoningJudgmentBridgeRegistry, "function");
  assert.equal(typeof ExecutiveReasoningJudgmentBridgePlatform.getExecutiveReasoningJudgmentBridgeCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveReasoningJudgmentBridgeManifest();
  const second = buildExecutiveReasoningJudgmentBridgeManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.dependencies, second.dependencies);
});
