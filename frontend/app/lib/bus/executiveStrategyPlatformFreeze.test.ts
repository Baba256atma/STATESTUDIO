import * as assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildExecutiveStrategyPlatformFreezeManifest,
  ExecutiveStrategyPlatformFreeze,
  EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS,
  EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  getExecutiveStrategyPlatformCompatibilityMatrix,
  getExecutiveStrategyPlatformExtensionPolicy,
  getExecutiveStrategyPlatformFreezeState,
  listExecutiveStrategyPlatformDependencies,
  listExecutiveStrategyPlatformPhases,
  listExecutiveStrategyPlatformPublicApis,
  runExecutiveStrategyPlatformCertification,
  runExecutiveStrategyPlatformFreeze,
  runExecutiveStrategyPlatformRegression,
} from "./executiveStrategyPlatformFreezeIndex.ts";

test("platform identity", () => {
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.platformId, "BUS-STRAT");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.platformName, "Executive Strategy Platform");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.certificationPhaseId, "BUS-26");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.state, "Certified Frozen Released");
});

test("certified phases", () => {
  const phases = listExecutiveStrategyPlatformPhases();
  assert.equal(phases.length, 10);
  assert.equal(phases[0]?.phaseId, "BUS-17");
  assert.equal(phases.at(-1)?.phaseId, "BUS-26");
});

test("public apis", () => {
  const apis = listExecutiveStrategyPlatformPublicApis();
  assert.equal(apis.length > 0, true);
  assert.equal(apis.some((api) => api.apiName === "runExecutiveStrategyPlatformFreeze"), true);
});

test("dependency registry", () => {
  const dependencies = listExecutiveStrategyPlatformDependencies();
  assert.equal(dependencies.length, 10);
  assert.equal(dependencies.every((entry) => entry.metadataOnly && entry.immutable), true);
});

test("compatibility matrix", () => {
  const compatibility = getExecutiveStrategyPlatformCompatibilityMatrix();
  assert.equal(compatibility.length, 8);
  assert.equal(compatibility.some((entry) => entry.targetPlatform === "Executive KPI Platform"), true);
});

test("extension policy", () => {
  const policy = getExecutiveStrategyPlatformExtensionPolicy();
  assert.equal(policy.requiresPublicApiConsumption, true);
  assert.equal(policy.allowsStrategyExecution, false);
  assert.equal(policy.allowsRuntimeExecution, false);
  assert.equal(policy.allowsSimulationExecution, false);
});

test("manifest", () => {
  const first = buildExecutiveStrategyPlatformFreezeManifest();
  const second = buildExecutiveStrategyPlatformFreezeManifest();
  assert.equal(first.platformIdentity.platformId, "BUS-STRAT");
  assert.equal(first.phaseRegistry.length, 10);
  assert.equal(first.consumerRegistry.length, EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS.length);
  assert.equal(first.certificationGateCount, 18);
  assert.equal(first.regressionEntryCount, 9);
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("certification", () => {
  const certification = runExecutiveStrategyPlatformCertification();
  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.length, 18);
  assert.equal(certification.diagnostics.length, 0);
});

test("regression", () => {
  const regression = runExecutiveStrategyPlatformRegression();
  assert.equal(regression.status, "PASS");
  assert.equal(regression.totalEntries, 9);
  assert.equal(regression.failedEntries, 0);
});

test("freeze release", () => {
  const freeze = runExecutiveStrategyPlatformFreeze();
  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.finalState, "Certified Frozen Released");
  assert.equal(freeze.frozenPhaseIds.length, 9);
});

test("freeze state and api facade", () => {
  const state = getExecutiveStrategyPlatformFreezeState();
  assert.equal(state.status, "PASS");
  assert.equal(typeof ExecutiveStrategyPlatformFreeze.buildExecutiveStrategyPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveStrategyPlatformFreeze.runExecutiveStrategyPlatformCertification, "function");
  assert.equal(typeof ExecutiveStrategyPlatformFreeze.runExecutiveStrategyPlatformRegression, "function");
  assert.equal(typeof ExecutiveStrategyPlatformFreeze.runExecutiveStrategyPlatformFreeze, "function");
});

test("immutable behavior and no runtime behavior", () => {
  const manifest = buildExecutiveStrategyPlatformFreezeManifest();
  const freeze = runExecutiveStrategyPlatformFreeze();
  assert.equal(Object.isFrozen(ExecutiveStrategyPlatformFreeze), true);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(freeze), true);
});
