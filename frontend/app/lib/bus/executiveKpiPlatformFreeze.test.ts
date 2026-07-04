import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiIntegrationPlatform } from "./executiveKpiIntegrationPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import {
  ExecutiveKpiPlatformFreeze,
  buildExecutiveKpiPlatformFreezeManifest,
  getExecutiveKpiPlatformCompatibilityMatrix,
  getExecutiveKpiPlatformExtensionPolicy,
  getExecutiveKpiPlatformFreezeState,
  listExecutiveKpiPlatformPhases,
  listExecutiveKpiPlatformPublicApis,
  runExecutiveKpiPlatformCertification,
  runExecutiveKpiPlatformFreeze,
  runExecutiveKpiPlatformRegression,
} from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveKpiReportingPlatform } from "./executiveKpiReportingPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

test("consumes BUS-1 through BUS-11 public APIs", () => {
  const platforms = [
    getExecutiveKpiPlatform(),
    getExecutiveKpiDefinitionPlatform(),
    getExecutiveKpiSourceMappingPlatform(),
    getExecutiveKpiTargetPlatform(),
    getExecutiveKpiGovernancePlatform(),
    getExecutiveKpiScorecardPlatform(),
    getExecutiveKpiInsightPlatform(),
    getExecutiveKpiStrategicAlignmentPlatform(),
    getExecutiveKpiBusinessImpactPlatform(),
    getExecutiveKpiReportingPlatform(),
    getExecutiveKpiIntegrationPlatform(),
  ];

  assert.equal(platforms.every((platform) => platform.validation.valid), true);
});

test("publishes phase registry", () => {
  const phases = listExecutiveKpiPlatformPhases();

  assert.equal(phases.length, 12);
  assert.equal(phases[0].phaseId, "BUS-1");
  assert.equal(phases[11].phaseId, "BUS-12");
  assert.equal(phases.every((phase) => phase.metadataOnly && phase.immutable), true);
});

test("publishes public API registry", () => {
  const apis = listExecutiveKpiPlatformPublicApis();
  const keys = apis.map((api) => `${api.phaseId}:${api.apiName}`);

  assert.equal(apis.some((api) => api.apiName === "getExecutiveKpiPlatform"), true);
  assert.equal(apis.some((api) => api.apiName === "runExecutiveKpiPlatformFreeze"), true);
  assert.equal(new Set(keys).size, keys.length);
});

test("publishes compatibility matrix", () => {
  const matrix = getExecutiveKpiPlatformCompatibilityMatrix();

  assert.equal(matrix.some((entry) => entry.targetLayer === "CORE"), true);
  assert.equal(matrix.some((entry) => entry.targetLayer === "Advisor"), true);
  assert.equal(matrix.every((entry) => entry.metadataOnly && entry.immutable), true);
});

test("publishes extension policy", () => {
  const policy = getExecutiveKpiPlatformExtensionPolicy();

  assert.equal(policy.allowsFutureBusPhases, true);
  assert.equal(policy.requiresPublicApiConsumption, true);
  assert.equal(policy.allowsKpiComputation, false);
  assert.equal(policy.allowsRuntimeExecution, false);
});

test("builds deterministic freeze manifest", () => {
  const first = buildExecutiveKpiPlatformFreezeManifest();
  const second = buildExecutiveKpiPlatformFreezeManifest();

  assert.equal(first.platformIdentity.platformId, "BUS");
  assert.equal(first.phaseRegistry.length, 12);
  assert.equal(first.releaseMetadata.releaseStatus, "Released");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("passes certification gates", () => {
  const certification = runExecutiveKpiPlatformCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.length, 11);
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("passes regression metadata", () => {
  const regression = runExecutiveKpiPlatformRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.totalEntries, 11);
  assert.equal(regression.failedEntries, 0);
});

test("runs platform freeze", () => {
  const freeze = runExecutiveKpiPlatformFreeze();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.finalState, "Certified Frozen Released");
  assert.equal(freeze.frozenPhaseIds.length, 11);
});

test("gets deterministic freeze state", () => {
  const first = getExecutiveKpiPlatformFreezeState();
  const second = getExecutiveKpiPlatformFreezeState();

  assert.equal(first.status, "PASS");
  assert.equal(first.manifest.deterministicFingerprint, second.manifest.deterministicFingerprint);
});

test("exports public freeze APIs and immutable facade", () => {
  assert.equal(typeof ExecutiveKpiPlatformFreeze.buildExecutiveKpiPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.runExecutiveKpiPlatformCertification, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.runExecutiveKpiPlatformRegression, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.runExecutiveKpiPlatformFreeze, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.getExecutiveKpiPlatformFreezeState, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.listExecutiveKpiPlatformPhases, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.listExecutiveKpiPlatformPublicApis, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.getExecutiveKpiPlatformCompatibilityMatrix, "function");
  assert.equal(typeof ExecutiveKpiPlatformFreeze.getExecutiveKpiPlatformExtensionPolicy, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiPlatformFreeze), true);
});

test("contains no runtime behavior metadata", () => {
  const apis = listExecutiveKpiPlatformPublicApis();

  assert.equal(apis.some((api) => api.apiName.toLowerCase().includes("execute")), false);
  assert.equal(apis.some((api) => api.apiName.toLowerCase().includes("render")), false);
});
