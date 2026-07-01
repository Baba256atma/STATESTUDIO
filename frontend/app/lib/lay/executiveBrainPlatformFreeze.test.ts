import assert from "node:assert/strict";
import test from "node:test";

import { analyzeExecutiveReasoning } from "./reasoning/executiveReasoningEngine.ts";
import { analyzeExecutiveJudgment } from "./judgment/executiveJudgmentEngine.ts";
import { buildExecutivePlan } from "./planning/executivePlanningEngine.ts";
import { validateExecutiveBrainFoundation } from "./executiveBrainFoundation.ts";
import {
  ExecutiveBrainPlatformFreeze,
  buildExecutiveBrainPlatformFreezeManifest,
  getExecutiveBrainCompatibilityMatrix,
  getExecutiveBrainPlatformState,
  getExecutiveBrainReleaseMetadata,
  listExecutiveBrainCapabilities,
  listExecutiveBrainPhases,
  listExecutiveBrainPlatformPublicApis,
  runExecutiveBrainPlatformCertification,
  runExecutiveBrainPlatformFreeze,
  runExecutiveBrainPlatformRegression,
} from "./executiveBrainPlatformFreeze.ts";
import { getExecutiveBrainPlatformExtensionPolicy } from "./executiveBrainPlatformCompatibility.ts";

test("publishes the platform phase registry", () => {
  const phases = listExecutiveBrainPhases();

  assert.equal(phases.length, 12);
  assert.deepEqual(
    phases.map((phase) => phase.phaseId),
    ["LAY-1", "LAY-2", "LAY-3", "LAY-4", "LAY-5", "LAY-6", "LAY-7", "LAY-8", "LAY-9", "LAY-10", "LAY-11", "LAY-12"]
  );
  assert.equal(phases.every((phase) => phase.certified && phase.frozen), true);
});

test("registers LAY-1 through LAY-11 as certified dependencies", () => {
  const phases = listExecutiveBrainPhases();
  const lay12 = phases.find((phase) => phase.phaseId === "LAY-12");

  assert.ok(lay12);
  assert.equal(lay12.consumes.length, 11);
  assert.equal(lay12.consumes.includes("LAY-1"), true);
  assert.equal(lay12.consumes.includes("LAY-11"), true);
});

test("publishes the public API registry", () => {
  const publicApis = listExecutiveBrainPlatformPublicApis();

  assert.equal(publicApis.length >= 12, true);
  assert.equal(publicApis.every((api) => api.available), true);
  assert.equal(publicApis.some((api) => api.apiName === "buildExecutiveLearning"), true);
  assert.equal(publicApis.some((api) => api.apiName === "ExecutiveBrainFoundation"), true);
});

test("publishes the capability registry", () => {
  const capabilities = listExecutiveBrainCapabilities();

  assert.equal(capabilities.length, 11);
  assert.equal(capabilities.every((capability) => capability.certified), true);
  assert.equal(capabilities.some((capability) => capability.capabilityId === "learning"), true);
  assert.equal(capabilities.some((capability) => capability.capabilityId === "platformCertification"), true);
});

test("publishes the compatibility matrix with verified upstream layers", () => {
  const matrix = getExecutiveBrainCompatibilityMatrix();

  assert.equal(matrix.validationResult, "valid");
  assert.equal(matrix.phaseEntries.every((entry) => entry.compatible), true);
  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "LAY" && entry.targetLayer === "CORE"), true);
  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "LAY" && entry.targetLayer === "IDN"), true);
  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "LAY" && entry.targetLayer === "ASS"), true);
});

test("declares future compatibility with DOM STE BUS OPS", () => {
  const matrix = getExecutiveBrainCompatibilityMatrix();

  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "DOM" && entry.status === "future"), true);
  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "STE" && entry.status === "future"), true);
  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "BUS" && entry.status === "future"), true);
  assert.equal(matrix.layerEntries.some((entry) => entry.sourceLayer === "OPS" && entry.status === "future"), true);
});

test("publishes the extension policy", () => {
  const policy = getExecutiveBrainPlatformExtensionPolicy();

  assert.equal(policy.frozen, true);
  assert.equal(policy.extensionMode, "additive-only");
  assert.equal(policy.breakingChangesAllowed, false);
  assert.equal(policy.runtimeBehaviorAllowed, false);
  assert.equal(policy.requiresNewPhase, true);
});

test("publishes release metadata", () => {
  const metadata = getExecutiveBrainReleaseMetadata();

  assert.equal(metadata.platformId, "nexora-executive-brain-platform");
  assert.equal(metadata.releaseVersion, "LAY-12");
  assert.equal(metadata.releaseStage, "certified");
  assert.equal(metadata.metadataOnly, true);
  assert.equal(metadata.runtimeIntelligence, false);
  assert.equal(metadata.declaration, "The Executive Brain Platform is Certified, Frozen, and Released.");
});

test("builds the freeze manifest", () => {
  const manifest = buildExecutiveBrainPlatformFreezeManifest();

  assert.equal(manifest.contractVersion, "LAY-12");
  assert.equal(manifest.releaseMetadata.platformId, "nexora-executive-brain-platform");
  assert.equal(manifest.certificationState, "certified");
  assert.equal(manifest.frozen, true);
  assert.equal(manifest.consumerSafe, true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("passes platform certification", () => {
  const certification = runExecutiveBrainPlatformCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
  assert.equal(certification.gates.some((gate) => gate.gateId === "lay-1-through-lay-11-certified"), true);
  assert.equal(certification.gates.some((gate) => gate.gateId === "release-readiness"), true);
});

test("passes platform regression metadata", () => {
  const regression = runExecutiveBrainPlatformRegression();

  assert.equal(regression.totalTests, 191);
  assert.equal(regression.passed, 191);
  assert.equal(regression.failed, 0);
  assert.equal(regression.deterministic, true);
});

test("runs the platform freeze", () => {
  const freeze = runExecutiveBrainPlatformFreeze();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.frozen, true);
  assert.equal(freeze.released, true);
  assert.equal(freeze.manifest.releaseMetadata.declaration, "The Executive Brain Platform is Certified, Frozen, and Released.");
});

test("returns an immutable freeze state", () => {
  const freeze = getExecutiveBrainPlatformState();

  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.manifest), true);
  assert.equal(Object.isFrozen(freeze.certification.gates), true);
  assert.equal(Object.isFrozen(freeze.manifest.extensionPolicy.notes), true);
});

test("exposes the public freeze facade", () => {
  assert.equal(typeof ExecutiveBrainPlatformFreeze.runExecutiveBrainPlatformFreeze, "function");
  assert.equal(typeof ExecutiveBrainPlatformFreeze.buildExecutiveBrainPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveBrainPlatformFreeze.listExecutiveBrainCapabilities, "function");
  assert.equal(typeof ExecutiveBrainPlatformFreeze.getExecutiveBrainCompatibilityMatrix, "function");
});

test("produces deterministic manifest output", () => {
  const first = buildExecutiveBrainPlatformFreezeManifest();
  const second = buildExecutiveBrainPlatformFreezeManifest();

  assert.equal(first.contractVersion, second.contractVersion);
  assert.equal(first.phases.length, second.phases.length);
  assert.equal(first.publicApis.length, second.publicApis.length);
  assert.equal(first.compatibility.entryCount, second.compatibility.entryCount);
  assert.equal(first.consumerSafe, second.consumerSafe);
});

test("keeps LAY-1 through LAY-11 public contracts consumer-safe", () => {
  const foundation = validateExecutiveBrainFoundation();
  const reasoning = analyzeExecutiveReasoning(
    Object.freeze({
      sessionId: "session:freeze:reasoning",
      situation: "A neutral operating situation for platform freeze validation.",
      objects: Object.freeze([
        Object.freeze({ id: "capacity", label: "Capacity", description: "Available execution capacity.", attributes: Object.freeze({}) }),
      ]),
      relationships: Object.freeze([]),
      assumptions: Object.freeze([
        Object.freeze({ id: "assumption:capacity", statement: "Capacity remains fixed.", appliesTo: Object.freeze(["capacity"]), impact: "Fixed capacity shapes downstream reasoning." }),
      ]),
      constraints: Object.freeze([
        Object.freeze({ id: "constraint:scope", statement: "Scope cannot expand without capacity.", appliesTo: Object.freeze(["capacity"]), consequence: "Scope reasoning must account for capacity limits." }),
      ]),
    })
  );
  const judgment = analyzeExecutiveJudgment({ sessionId: "session:freeze:judgment", reasoning });
  const plan = buildExecutivePlan({
    sessionId: "session:freeze:plan",
    judgment,
  });

  assert.equal(foundation.valid, true);
  assert.equal(reasoning.session.phase, "LAY-2");
  assert.equal(judgment.session.phase, "LAY-3");
  assert.equal(plan.session.phase, "LAY-4");
});
