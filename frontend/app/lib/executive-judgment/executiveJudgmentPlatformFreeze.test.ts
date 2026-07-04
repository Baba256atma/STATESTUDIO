import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ExecutiveJudgmentPlatformFreeze,
  buildExecutiveJudgmentPlatformFreezeManifest,
  getExecutiveJudgmentPlatformCompatibilityMatrix,
  getExecutiveJudgmentPlatformExtensionPolicy,
  getExecutiveJudgmentPlatformFreezeState,
  listExecutiveJudgmentPlatformPhases,
  listExecutiveJudgmentPlatformPublicApis,
  runExecutiveJudgmentPlatformCertification,
  runExecutiveJudgmentPlatformFreeze,
  runExecutiveJudgmentPlatformRegression,
} from "./executiveJudgmentPlatformFreezeIndex.ts";

const CERTIFIED_SOURCE_FILES = Object.freeze([
  "app/lib/executive-judgment/executiveJudgmentContracts.ts",
  "app/lib/executive-judgment/executiveJudgmentContextEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentEvidenceEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentConstraintEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentTradeoffEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentRiskOpportunityEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentExplanationEngine.ts",
  "app/lib/executive-judgment/executiveJudgmentPlatformIndex.ts",
] as const);

test("certification passes", () => {
  const certification = runExecutiveJudgmentPlatformCertification();
  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("regression passes", () => {
  const regression = runExecutiveJudgmentPlatformRegression();
  assert.equal(regression.status, "PASS");
  assert.equal(regression.failed, 0);
});

test("generates freeze manifest", () => {
  const manifest = buildExecutiveJudgmentPlatformFreezeManifest();
  assert.equal(manifest.platformIdentity.platformVersion, "APP-JUDGE-10");
  assert.equal(manifest.certifiedComponents.length, 10);
  assert.equal(manifest.releaseMetadata.declaration, "CERTIFIED_FROZEN_RELEASED");
});

test("publishes registry integrity", () => {
  const phases = listExecutiveJudgmentPlatformPhases();
  assert.equal(phases.length, 10);
  assert.equal(phases[0]?.phaseId, "APP-JUDGE-1");
  assert.equal(phases[9]?.phaseId, "APP-JUDGE-10");
});

test("publishes compatibility matrix", () => {
  const matrix = getExecutiveJudgmentPlatformCompatibilityMatrix();
  assert.equal(matrix.length, 9);
  assert.equal(matrix.some((entry) => entry.target === "Future Executive Platforms"), true);
  assert.equal(matrix.every((entry) => entry.runtimeDependency === false), true);
});

test("publishes extension policy", () => {
  const policy = getExecutiveJudgmentPlatformExtensionPolicy();
  assert.equal(policy.allowsNewEngines, false);
  assert.equal(policy.allowsRecommendations, false);
  assert.equal(policy.allowsLlmCalls, false);
  assert.equal(policy.requiresReadOnlyCertification, true);
});

test("publishes public API registry", () => {
  const apis = listExecutiveJudgmentPlatformPublicApis();
  assert.equal(apis.some((api) => api.apiName === "runExecutiveJudgmentPlatformFreeze"), true);
  assert.equal(new Set(apis.map((api) => `${api.phaseId}:${api.apiName}`)).size, apis.length);
});

test("certifies pipeline", () => {
  const manifest = buildExecutiveJudgmentPlatformFreezeManifest();
  assert.deepEqual(manifest.certifiedPipeline, [
    "APP-JUDGE-1",
    "APP-JUDGE-2",
    "APP-JUDGE-3",
    "APP-JUDGE-4",
    "APP-JUDGE-5",
    "APP-JUDGE-6",
    "APP-JUDGE-7",
    "APP-JUDGE-8",
    "APP-JUDGE-9",
  ]);
});

test("publishes immutable freeze output", () => {
  const freeze = runExecutiveJudgmentPlatformFreeze();
  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.declaration, "CERTIFIED_FROZEN_RELEASED");
  assert.equal(Object.isFrozen(freeze), true);
});

test("uses deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentPlatformFreezeManifest();
  const right = buildExecutiveJudgmentPlatformFreezeManifest();
  assert.equal(left.manifestFingerprint, right.manifestFingerprint);
});

test("returns freeze state", () => {
  const state = getExecutiveJudgmentPlatformFreezeState();
  assert.equal(state.status, "PASS");
  assert.equal(state.certification.status, "PASS");
  assert.equal(state.regression.status, "PASS");
});

test("exports freeze public APIs", () => {
  assert.equal(typeof ExecutiveJudgmentPlatformFreeze.buildExecutiveJudgmentPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveJudgmentPlatformFreeze.runExecutiveJudgmentPlatformCertification, "function");
  assert.equal(typeof ExecutiveJudgmentPlatformFreeze.runExecutiveJudgmentPlatformRegression, "function");
  assert.equal(typeof ExecutiveJudgmentPlatformFreeze.runExecutiveJudgmentPlatformFreeze, "function");
  assert.equal(typeof ExecutiveJudgmentPlatformFreeze.getExecutiveJudgmentPlatformFreezeState, "function");
});

test("APP-JUDGE-1 through APP-JUDGE-9 remain unchanged by freeze source", () => {
  const certifiedSources = CERTIFIED_SOURCE_FILES.map((file) => readFileSync(file, "utf8")).join(" ");
  const freezeSources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformFreezeTypes.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformFreezeRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformCompatibility.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformFreezeManifest.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformCertification.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformRegression.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformFreezeRunner.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentPlatformFreezeIndex.ts", "utf8"),
  ].join(" ");
  assert.equal(certifiedSources.includes("APP-JUDGE-10"), false);
  assert.equal(freezeSources.includes("Math.random"), false);
  assert.equal(freezeSources.includes("Date."), false);
  assert.equal(freezeSources.includes("fetch("), false);
  assert.equal(freezeSources.includes("writeFile"), false);
  assert.equal(freezeSources.includes("call LLM"), false);
  assert.equal(freezeSources.includes(" any"), false);
});
