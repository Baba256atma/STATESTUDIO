import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveJudgmentExplanationBridge,
  ExecutiveJudgmentExplanationBridgePlatform,
  buildExecutiveJudgmentExplanationBridgeManifest,
  getExecutiveJudgmentExplanationBridgeCompatibilityMatrix,
  getExecutiveJudgmentExplanationBridgeRegistry,
  validateExecutiveJudgmentExplanationBridge,
  validateExecutiveJudgmentExplanationBridgeManifest,
  validateExecutiveJudgmentExplanationBridgeRegistry,
} from "./executiveJudgmentExplanationBridgeIndex.ts";
import type { ExecutiveExplanationRegistry } from "./executiveJudgmentExplanationBridgeTypes.ts";

test("publishes immutable bridge contracts", () => {
  assert.equal(ExecutiveJudgmentExplanationBridge.bridgeId, "executive-judgment-explanation-bridge");
  assert.equal(ExecutiveJudgmentExplanationBridge.judgmentInput.producerId, "APP-JUDGE");
  assert.equal(ExecutiveJudgmentExplanationBridge.explanationRequest.consumerId, "EXECUTIVE-EXPLANATION");
  assert.equal(ExecutiveJudgmentExplanationBridge.metadata.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveJudgmentExplanationBridge), true);
});

test("publishes registry integrity", () => {
  const registry = getExecutiveJudgmentExplanationBridgeRegistry();

  assert.deepEqual(registry.supportedProducers, ["APP-JUDGE"]);
  assert.deepEqual(registry.supportedConsumers, ["EXECUTIVE-EXPLANATION"]);
  assert.equal(registry.supportedPayloadTypes.length, 11);
  assert.equal(registry.supportedExplanationTargets.length, 6);
  assert.equal(registry.publicApis.length, 8);
  assert.equal(validateExecutiveJudgmentExplanationBridgeRegistry(registry).valid, true);
});

test("generates bridge manifest", () => {
  const manifest = buildExecutiveJudgmentExplanationBridgeManifest();

  assert.equal(manifest.platformId, "nexora-executive-judgment-explanation-bridge");
  assert.equal(manifest.bridgeId, "executive-judgment-explanation-bridge");
  assert.equal(manifest.dependencies.includes("LAY-CONN-1"), true);
  assert.equal(manifest.dependencies.includes("LAY-CONN-2"), true);
  assert.equal(manifest.dependencies.includes("LAY-CONN-3"), true);
  assert.equal(manifest.dependencies.includes("APP-JUDGE"), true);
  assert.equal(manifest.dependencies.includes("EXECUTIVE-EXPLANATION"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates manifest", () => {
  const manifest = buildExecutiveJudgmentExplanationBridgeManifest();
  const validation = validateExecutiveJudgmentExplanationBridgeManifest(manifest);

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("validates compatibility with future explanation consumer", () => {
  const compatibility = getExecutiveJudgmentExplanationBridgeCompatibilityMatrix();

  assert.equal(compatibility.length, 5);
  assert.equal(compatibility.every((entry) => entry.compatible), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-1"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-2"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-3"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "APP-JUDGE"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "EXECUTIVE-EXPLANATION" && !entry.required && entry.mode === "future-compatible"), true);
});

test("validates dependency and boundary rules", () => {
  assert.equal(validateExecutiveJudgmentExplanationBridge().valid, true);

  const invalid = validateExecutiveJudgmentExplanationBridge(Object.freeze({
    ...ExecutiveJudgmentExplanationBridge,
    metadata: Object.freeze({ ...ExecutiveJudgmentExplanationBridge.metadata, metadataOnly: false }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("boundary-violation"), true);
});

test("detects invalid judgment result", () => {
  const invalid = validateExecutiveJudgmentExplanationBridge(Object.freeze({
    ...ExecutiveJudgmentExplanationBridge,
    judgmentInput: Object.freeze({ ...ExecutiveJudgmentExplanationBridge.judgmentInput, producerId: "UNKNOWN" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-judgment-result:UNKNOWN"), true);
});

test("detects invalid explanation consumer", () => {
  const invalid = validateExecutiveJudgmentExplanationBridge(Object.freeze({
    ...ExecutiveJudgmentExplanationBridge,
    explanationRequest: Object.freeze({ ...ExecutiveJudgmentExplanationBridge.explanationRequest, consumerId: "UNKNOWN" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("invalid-explanation-consumer:UNKNOWN"), true);
});

test("detects missing summary contracts", () => {
  const invalid = validateExecutiveJudgmentExplanationBridge(Object.freeze({
    ...ExecutiveJudgmentExplanationBridge,
    rationale: Object.freeze({ ...ExecutiveJudgmentExplanationBridge.rationale, rationaleId: "" }),
    evidence: Object.freeze([]),
    constraints: Object.freeze([]),
    tradeoffs: Object.freeze([]),
    confidence: Object.freeze({ ...ExecutiveJudgmentExplanationBridge.confidence, confidenceSummaryId: "" }),
  }));

  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.includes("missing-rationale"), true);
  assert.equal(invalid.errors.includes("missing-evidence-summary"), true);
  assert.equal(invalid.errors.includes("missing-constraint-summary"), true);
  assert.equal(invalid.errors.includes("missing-tradeoff-summary"), true);
  assert.equal(invalid.errors.includes("missing-confidence-summary"), true);
});

test("detects duplicate registrations", () => {
  const registry = getExecutiveJudgmentExplanationBridgeRegistry();
  const duplicateRegistry: ExecutiveExplanationRegistry = Object.freeze({
    ...registry,
    supportedExplanationTargets: Object.freeze(["Executive", "Executive"] as const),
  });
  const validation = validateExecutiveJudgmentExplanationBridgeRegistry(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-explanation-target:Executive"), true);
});

test("exports public bridge APIs", () => {
  assert.equal(typeof ExecutiveJudgmentExplanationBridgePlatform.buildExecutiveJudgmentExplanationBridgeManifest, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationBridgePlatform.validateExecutiveJudgmentExplanationBridge, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationBridgePlatform.validateExecutiveJudgmentExplanationBridgeManifest, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationBridgePlatform.validateExecutiveJudgmentExplanationBridgeRegistry, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationBridgePlatform.getExecutiveJudgmentExplanationBridgeRegistry, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationBridgePlatform.getExecutiveJudgmentExplanationBridgeCompatibilityMatrix, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveJudgmentExplanationBridgeManifest();
  const second = buildExecutiveJudgmentExplanationBridgeManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.dependencies, second.dependencies);
});
