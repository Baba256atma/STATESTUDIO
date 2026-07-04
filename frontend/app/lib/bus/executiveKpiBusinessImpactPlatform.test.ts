import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import {
  EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
  ExecutiveKpiBusinessImpactPlatform,
  getExecutiveKpiBusinessImpactManifest,
  getExecutiveKpiBusinessImpactPlatform,
  listExecutiveBusinessImpactCategories,
  listExecutiveBusinessImpactConfidenceLevels,
  listExecutiveBusinessImpactDimensions,
  listExecutiveBusinessImpactHorizons,
  listExecutiveBusinessImpactLifecycleStates,
  listExecutiveKpiBusinessImpacts,
  validateExecutiveKpiBusinessImpacts,
} from "./executiveKpiBusinessImpactPlatform.ts";
import type {
  ExecutiveBusinessImpactCategory,
  ExecutiveKpiBusinessImpactRegistry,
} from "./executiveKpiBusinessImpactTypes.ts";

test("consumes BUS-1 through BUS-8 public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const manifest = getExecutiveKpiBusinessImpactManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(targets.validation.valid, true);
  assert.equal(governance.validation.valid, true);
  assert.equal(scorecards.validation.valid, true);
  assert.equal(insights.validation.valid, true);
  assert.equal(strategicAlignments.validation.valid, true);
  assert.equal(manifest.strategicAlignmentsAvailable, true);
});

test("publishes business impact registry integrity", () => {
  const registry = EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY;

  assert.equal(registry.platformId, "BUS-9");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targetPlatformId, "BUS-4");
  assert.equal(registry.governancePlatformId, "BUS-5");
  assert.equal(registry.scorecardPlatformId, "BUS-6");
  assert.equal(registry.insightPlatformId, "BUS-7");
  assert.equal(registry.strategicAlignmentPlatformId, "BUS-8");
  assert.equal(registry.impacts.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes category registry", () => {
  assert.equal(listExecutiveBusinessImpactCategories().length, 13);
  assert.equal(listExecutiveBusinessImpactCategories().includes("Revenue"), true);
});

test("publishes dimension registry", () => {
  assert.equal(listExecutiveBusinessImpactDimensions().length, 10);
  assert.equal(listExecutiveBusinessImpactDimensions().includes("Strategic Impact"), true);
});

test("publishes horizon registry", () => {
  assert.deepEqual(listExecutiveBusinessImpactHorizons(), ["Immediate", "Short Term", "Quarterly", "Annual", "Multi-Year", "Long Term"]);
});

test("publishes confidence registry", () => {
  assert.deepEqual(listExecutiveBusinessImpactConfidenceLevels(), ["Very High", "High", "Medium", "Low", "Unknown"]);
});

test("publishes lifecycle registry", () => {
  assert.deepEqual(listExecutiveBusinessImpactLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiBusinessImpactManifest();
  const second = getExecutiveKpiBusinessImpactManifest();

  assert.equal(first.platformId, "BUS-9");
  assert.equal(first.impactCount, 2);
  assert.equal(first.certificationStatus, "Business Impact Metadata Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiBusinessImpacts();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate impact ids", () => {
  const duplicateRegistry: ExecutiveKpiBusinessImpactRegistry = Object.freeze({
    ...EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
    impacts: Object.freeze([
      EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY.impacts[0],
      EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY.impacts[0],
    ]),
  });
  const validation = validateExecutiveKpiBusinessImpacts(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-impact-id:financial-health-margin-impact"), true);
});

test("detects invalid KPI, governance, and strategic alignment references", () => {
  const invalidRegistry: ExecutiveKpiBusinessImpactRegistry = Object.freeze({
    ...EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
    impacts: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY.impacts[0],
        kpiId: "missing-kpi",
        governanceReferenceId: "missing-governance",
        strategicAlignmentReferenceId: "missing-alignment",
      }),
    ]),
  });
  const validation = validateExecutiveKpiBusinessImpacts(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:financial-health-margin-impact:missing-kpi"), true);
  assert.equal(validation.errors.includes("invalid-governance-reference:financial-health-margin-impact"), true);
  assert.equal(validation.errors.includes("invalid-alignment-reference:financial-health-margin-impact"), true);
});

test("detects invalid category", () => {
  const invalidRegistry: ExecutiveKpiBusinessImpactRegistry = Object.freeze({
    ...EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
    impacts: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY.impacts[0],
        impactCategory: "Invalid" as ExecutiveBusinessImpactCategory,
      }),
    ]),
  });
  const validation = validateExecutiveKpiBusinessImpacts(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-category:financial-health-margin-impact"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiBusinessImpactPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.getExecutiveKpiBusinessImpactPlatform, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.getExecutiveKpiBusinessImpactManifest, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.validateExecutiveKpiBusinessImpacts, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.listExecutiveKpiBusinessImpacts, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.listExecutiveBusinessImpactCategories, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.listExecutiveBusinessImpactDimensions, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.listExecutiveBusinessImpactHorizons, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.listExecutiveBusinessImpactConfidenceLevels, "function");
  assert.equal(typeof ExecutiveKpiBusinessImpactPlatform.listExecutiveBusinessImpactLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiBusinessImpactPlatform), true);
});

test("publishes immutable business impact contracts", () => {
  const impacts = listExecutiveKpiBusinessImpacts();

  assert.equal(impacts.every((impact) => impact.metadataOnly && impact.immutable), true);
  assert.equal(Object.isFrozen(impacts), true);
});

test("contains no runtime behavior metadata", () => {
  const registry = EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY;

  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("execute")), false);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("score")), false);
});
