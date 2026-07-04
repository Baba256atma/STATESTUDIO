import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import {
  EXECUTIVE_KPI_INSIGHT_REGISTRY,
  ExecutiveKpiInsightPlatform,
  getExecutiveKpiInsightManifest,
  getExecutiveKpiInsightPlatform,
  listExecutiveKpiInsightAudienceLevels,
  listExecutiveKpiInsightCategories,
  listExecutiveKpiInsightConfidenceLevels,
  listExecutiveKpiInsightLifecycleStates,
  listExecutiveKpiInsightSeverityLevels,
  listExecutiveKpiInsights,
  validateExecutiveKpiInsights,
} from "./executiveKpiInsightPlatform.ts";
import type { ExecutiveKpiInsightCategory, ExecutiveKpiInsightRegistry } from "./executiveKpiInsightTypes.ts";

test("consumes prior BUS public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const manifest = getExecutiveKpiInsightManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(targets.validation.valid, true);
  assert.equal(governance.validation.valid, true);
  assert.equal(scorecards.validation.valid, true);
  assert.equal(manifest.scorecardsAvailable, true);
});

test("publishes insight registry integrity", () => {
  const registry = EXECUTIVE_KPI_INSIGHT_REGISTRY;

  assert.equal(registry.platformId, "BUS-7");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targetPlatformId, "BUS-4");
  assert.equal(registry.governancePlatformId, "BUS-5");
  assert.equal(registry.scorecardPlatformId, "BUS-6");
  assert.equal(registry.insights.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes category registry", () => {
  assert.equal(listExecutiveKpiInsightCategories().length, 11);
  assert.equal(listExecutiveKpiInsightCategories().includes("Performance Signal"), true);
});

test("publishes severity registry", () => {
  assert.deepEqual(listExecutiveKpiInsightSeverityLevels(), ["Critical", "High", "Medium", "Low", "Informational"]);
});

test("publishes confidence registry", () => {
  assert.deepEqual(listExecutiveKpiInsightConfidenceLevels(), ["Very High", "High", "Medium", "Low", "Unknown"]);
});

test("publishes audience registry", () => {
  assert.deepEqual(listExecutiveKpiInsightAudienceLevels(), ["CEO", "Executive Team", "Board", "Department Head", "Project Manager", "Analyst", "Advisor", "Custom"]);
});

test("publishes lifecycle registry", () => {
  assert.deepEqual(listExecutiveKpiInsightLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiInsightManifest();
  const second = getExecutiveKpiInsightManifest();

  assert.equal(first.platformId, "BUS-7");
  assert.equal(first.insightCount, 2);
  assert.equal(first.certificationStatus, "Insight Metadata Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiInsights();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate insight ids", () => {
  const duplicateRegistry: ExecutiveKpiInsightRegistry = Object.freeze({
    ...EXECUTIVE_KPI_INSIGHT_REGISTRY,
    insights: Object.freeze([
      EXECUTIVE_KPI_INSIGHT_REGISTRY.insights[0],
      EXECUTIVE_KPI_INSIGHT_REGISTRY.insights[0],
    ]),
  });
  const validation = validateExecutiveKpiInsights(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-insight-id:financial-health-performance-signal"), true);
});

test("detects invalid KPI and scorecard references", () => {
  const invalidRegistry: ExecutiveKpiInsightRegistry = Object.freeze({
    ...EXECUTIVE_KPI_INSIGHT_REGISTRY,
    insights: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_INSIGHT_REGISTRY.insights[0],
        relatedKpiIds: Object.freeze(["missing-kpi"] as const),
        relatedScorecardIds: Object.freeze(["missing-scorecard"] as const),
      }),
    ]),
  });
  const validation = validateExecutiveKpiInsights(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:financial-health-performance-signal:missing-kpi"), true);
  assert.equal(validation.errors.includes("invalid-scorecard-reference:financial-health-performance-signal:missing-scorecard"), true);
});

test("detects invalid category", () => {
  const invalidRegistry: ExecutiveKpiInsightRegistry = Object.freeze({
    ...EXECUTIVE_KPI_INSIGHT_REGISTRY,
    insights: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_INSIGHT_REGISTRY.insights[0],
        insightCategory: "Invalid" as ExecutiveKpiInsightCategory,
      }),
    ]),
  });
  const validation = validateExecutiveKpiInsights(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-category:financial-health-performance-signal"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiInsightPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiInsightPlatform.getExecutiveKpiInsightPlatform, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.getExecutiveKpiInsightManifest, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.validateExecutiveKpiInsights, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.listExecutiveKpiInsights, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.listExecutiveKpiInsightCategories, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.listExecutiveKpiInsightSeverityLevels, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.listExecutiveKpiInsightConfidenceLevels, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.listExecutiveKpiInsightAudienceLevels, "function");
  assert.equal(typeof ExecutiveKpiInsightPlatform.listExecutiveKpiInsightLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiInsightPlatform), true);
});

test("publishes immutable insight contracts", () => {
  const insights = listExecutiveKpiInsights();

  assert.equal(insights.every((insight) => insight.metadataOnly && insight.immutable), true);
  assert.equal(Object.isFrozen(insights), true);
});
