import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import {
  EXECUTIVE_KPI_TARGET_REGISTRY,
  ExecutiveKpiTargetPlatform,
  getExecutiveKpiTargetManifest,
  getExecutiveKpiTargetPlatform,
  listExecutiveKpiTargetLifecycleStates,
  listExecutiveKpiTargets,
  listExecutiveMeasurementPeriods,
  listExecutiveReviewCadences,
  listExecutiveTargetTypes,
  listExecutiveThresholdPolicies,
  listExecutiveTolerancePolicies,
  validateExecutiveKpiTargets,
} from "./executiveKpiTargetPlatform.ts";
import type { ExecutiveKpiTargetRegistry, ExecutiveKpiTargetType, ExecutiveKpiThresholdPolicy } from "./executiveKpiTargetTypes.ts";

test("consumes prior BUS public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const manifest = getExecutiveKpiTargetManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(manifest.foundationAvailable, true);
  assert.equal(manifest.definitionsAvailable, true);
  assert.equal(manifest.sourceMappingsAvailable, true);
});

test("publishes target registry integrity", () => {
  const registry = EXECUTIVE_KPI_TARGET_REGISTRY;

  assert.equal(registry.platformId, "BUS-4");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targets.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes measurement registry", () => {
  assert.deepEqual(listExecutiveMeasurementPeriods(), ["Daily", "Weekly", "Monthly", "Quarterly", "Semiannual", "Annual", "Rolling", "Custom"]);
});

test("publishes cadence registry", () => {
  assert.deepEqual(listExecutiveReviewCadences(), ["Continuous", "Daily", "Weekly", "Monthly", "Quarterly", "On Demand"]);
});

test("publishes threshold registry", () => {
  assert.deepEqual(listExecutiveThresholdPolicies(), ["Minimum", "Maximum", "Target Range", "Exact Target", "Observation Only"]);
});

test("publishes tolerance registry", () => {
  assert.deepEqual(listExecutiveTolerancePolicies(), ["None", "Low", "Medium", "High", "Custom"]);
});

test("publishes target type and lifecycle registries", () => {
  assert.equal(listExecutiveTargetTypes().length, 9);
  assert.deepEqual(listExecutiveKpiTargetLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiTargetManifest();
  const second = getExecutiveKpiTargetManifest();

  assert.equal(first.platformId, "BUS-4");
  assert.equal(first.targetCount, 2);
  assert.equal(first.certificationStatus, "Target Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiTargets();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate target ids", () => {
  const duplicateRegistry: ExecutiveKpiTargetRegistry = Object.freeze({
    ...EXECUTIVE_KPI_TARGET_REGISTRY,
    targets: Object.freeze([
      EXECUTIVE_KPI_TARGET_REGISTRY.targets[0],
      EXECUTIVE_KPI_TARGET_REGISTRY.targets[0],
    ]),
  });
  const validation = validateExecutiveKpiTargets(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-target-id:financial-health-strategic-target"), true);
});

test("detects invalid KPI reference", () => {
  const invalidRegistry: ExecutiveKpiTargetRegistry = Object.freeze({
    ...EXECUTIVE_KPI_TARGET_REGISTRY,
    targets: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_TARGET_REGISTRY.targets[0],
        kpiId: "missing-kpi",
      }),
    ]),
  });
  const validation = validateExecutiveKpiTargets(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:financial-health-strategic-target"), true);
});

test("detects invalid target and threshold metadata", () => {
  const invalidRegistry: ExecutiveKpiTargetRegistry = Object.freeze({
    ...EXECUTIVE_KPI_TARGET_REGISTRY,
    targets: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_TARGET_REGISTRY.targets[0],
        targetType: "Invalid" as ExecutiveKpiTargetType,
        thresholdPolicy: "Invalid" as ExecutiveKpiThresholdPolicy,
      }),
    ]),
  });
  const validation = validateExecutiveKpiTargets(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-target-type:financial-health-strategic-target"), true);
  assert.equal(validation.errors.includes("invalid-threshold-policy:financial-health-strategic-target"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiTargetPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiTargetPlatform.getExecutiveKpiTargetPlatform, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.getExecutiveKpiTargetManifest, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.validateExecutiveKpiTargets, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveKpiTargets, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveTargetTypes, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveThresholdPolicies, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveTolerancePolicies, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveMeasurementPeriods, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveReviewCadences, "function");
  assert.equal(typeof ExecutiveKpiTargetPlatform.listExecutiveKpiTargetLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiTargetPlatform), true);
});

test("publishes immutable target contracts", () => {
  const targets = listExecutiveKpiTargets();

  assert.equal(targets.every((target) => target.metadataOnly && target.immutable), true);
  assert.equal(Object.isFrozen(targets), true);
});
