import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import {
  EXECUTIVE_KPI_INTEGRATION_REGISTRY,
  ExecutiveKpiIntegrationPlatform,
  getExecutiveKpiIntegrationManifest,
  getExecutiveKpiIntegrationPlatform,
  listExecutiveKpiCompatibilityMatrix,
  listExecutiveKpiConsumerRegistry,
  listExecutiveKpiIntegrationDependencies,
  listExecutiveKpiIntegrationLifecycleStates,
  listExecutiveKpiIntegrationPhases,
  validateExecutiveKpiIntegration,
} from "./executiveKpiIntegrationPlatform.ts";
import type { ExecutiveKpiIntegrationLifecycleState, ExecutiveKpiIntegrationRegistry } from "./executiveKpiIntegrationTypes.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiReportingPlatform } from "./executiveKpiReportingPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

test("consumes BUS-1 through BUS-10 public APIs", () => {
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
  ];
  const manifest = getExecutiveKpiIntegrationManifest();

  assert.equal(platforms.every((platform) => platform.validation.valid), true);
  assert.equal(manifest.bus10Available, true);
});

test("publishes integration registry integrity", () => {
  const registry = EXECUTIVE_KPI_INTEGRATION_REGISTRY;

  assert.equal(registry.platformId, "BUS-11");
  assert.equal(registry.integratedPhaseIds.length, 10);
  assert.equal(registry.phases.length, 10);
  assert.equal(registry.dependencies.length, 10);
  assert.equal(registry.consumers.length, 9);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes phase dependency map", () => {
  const dependencies = listExecutiveKpiIntegrationDependencies();
  const bus10 = dependencies.find((entry) => entry.phaseId === "BUS-10");

  assert.equal(dependencies.length, 10);
  assert.deepEqual(bus10?.dependsOnPhaseIds, ["BUS-1", "BUS-2", "BUS-3", "BUS-4", "BUS-5", "BUS-6", "BUS-7", "BUS-8", "BUS-9"]);
});

test("publishes compatibility matrix", () => {
  const matrix = listExecutiveKpiCompatibilityMatrix();

  assert.equal(matrix.some((entry) => entry.targetLayer === "CORE"), true);
  assert.equal(matrix.some((entry) => entry.targetLayer === "Future BUS phases"), true);
  assert.equal(matrix.every((entry) => entry.metadataOnly && entry.immutable), true);
});

test("publishes consumer registry", () => {
  const consumers = listExecutiveKpiConsumerRegistry();

  assert.equal(consumers.some((consumer) => consumer.consumerName === "Executive Dashboard"), true);
  assert.equal(consumers.every((consumer) => consumer.consumptionBoundary === "Public API Only"), true);
});

test("publishes lifecycle registry", () => {
  assert.deepEqual(listExecutiveKpiIntegrationLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived", "Frozen"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiIntegrationManifest();
  const second = getExecutiveKpiIntegrationManifest();

  assert.equal(first.platformId, "BUS-11");
  assert.equal(first.phaseCount, 10);
  assert.equal(first.certificationStatus, "Integration Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiIntegration();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate integration ids", () => {
  const duplicateRegistry: ExecutiveKpiIntegrationRegistry = Object.freeze({
    ...EXECUTIVE_KPI_INTEGRATION_REGISTRY,
    phases: Object.freeze([
      EXECUTIVE_KPI_INTEGRATION_REGISTRY.phases[0],
      EXECUTIVE_KPI_INTEGRATION_REGISTRY.phases[0],
    ]),
  });
  const validation = validateExecutiveKpiIntegration(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-integration-id:bus-1-foundation-integration"), true);
});

test("detects invalid lifecycle state", () => {
  const invalidRegistry: ExecutiveKpiIntegrationRegistry = Object.freeze({
    ...EXECUTIVE_KPI_INTEGRATION_REGISTRY,
    phases: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_INTEGRATION_REGISTRY.phases[0],
        lifecycleState: "Invalid" as ExecutiveKpiIntegrationLifecycleState,
      }),
    ]),
  });
  const validation = validateExecutiveKpiIntegration(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-lifecycle:BUS-1"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiIntegrationPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.getExecutiveKpiIntegrationPlatform, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.getExecutiveKpiIntegrationManifest, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.validateExecutiveKpiIntegration, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.listExecutiveKpiIntegrationPhases, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.listExecutiveKpiIntegrationDependencies, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.listExecutiveKpiCompatibilityMatrix, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.listExecutiveKpiConsumerRegistry, "function");
  assert.equal(typeof ExecutiveKpiIntegrationPlatform.listExecutiveKpiIntegrationLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiIntegrationPlatform), true);
});

test("publishes immutable integration contracts", () => {
  const phases = listExecutiveKpiIntegrationPhases();

  assert.equal(phases.every((phase) => phase.metadataOnly && phase.immutable), true);
  assert.equal(Object.isFrozen(phases), true);
});

test("contains no runtime behavior metadata", () => {
  const registry = EXECUTIVE_KPI_INTEGRATION_REGISTRY;

  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("execute")), false);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("orchestrate")), false);
});
