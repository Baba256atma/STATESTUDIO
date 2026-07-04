import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import {
  EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
  ExecutiveKpiStrategicAlignmentPlatform,
  getExecutiveKpiStrategicAlignmentManifest,
  getExecutiveKpiStrategicAlignmentPlatform,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveKpiStrategicAlignments,
  listExecutiveStrategicAlignmentCategories,
  listExecutiveStrategicAlignmentLifecycleStates,
  listExecutiveStrategicHorizons,
  validateExecutiveKpiStrategicAlignments,
} from "./executiveKpiStrategicAlignmentPlatform.ts";
import type {
  ExecutiveKpiStrategicAlignmentRegistry,
  ExecutiveStrategicAlignmentCategory,
} from "./executiveKpiStrategicAlignmentTypes.ts";

test("consumes BUS-1 through BUS-7 public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const manifest = getExecutiveKpiStrategicAlignmentManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(targets.validation.valid, true);
  assert.equal(governance.validation.valid, true);
  assert.equal(scorecards.validation.valid, true);
  assert.equal(insights.validation.valid, true);
  assert.equal(manifest.insightsAvailable, true);
});

test("publishes strategic alignment registry integrity", () => {
  const registry = EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY;

  assert.equal(registry.platformId, "BUS-8");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targetPlatformId, "BUS-4");
  assert.equal(registry.governancePlatformId, "BUS-5");
  assert.equal(registry.scorecardPlatformId, "BUS-6");
  assert.equal(registry.insightPlatformId, "BUS-7");
  assert.equal(registry.alignments.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes category registry", () => {
  assert.equal(listExecutiveStrategicAlignmentCategories().length, 12);
  assert.equal(listExecutiveStrategicAlignmentCategories().includes("Strategic Objective"), true);
});

test("publishes alignment strength registry", () => {
  assert.deepEqual(listExecutiveAlignmentStrengthLevels(), ["Primary", "Strong", "Supporting", "Indirect", "Informational"]);
});

test("publishes strategic horizon registry", () => {
  assert.deepEqual(listExecutiveStrategicHorizons(), ["Immediate", "Quarterly", "Annual", "Multi-Year", "Long-Term"]);
});

test("publishes lifecycle registry", () => {
  assert.deepEqual(listExecutiveStrategicAlignmentLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiStrategicAlignmentManifest();
  const second = getExecutiveKpiStrategicAlignmentManifest();

  assert.equal(first.platformId, "BUS-8");
  assert.equal(first.alignmentCount, 2);
  assert.equal(first.certificationStatus, "Strategic Alignment Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiStrategicAlignments();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate alignment ids", () => {
  const duplicateRegistry: ExecutiveKpiStrategicAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY.alignments[0],
      EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY.alignments[0],
    ]),
  });
  const validation = validateExecutiveKpiStrategicAlignments(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-alignment-id:financial-health-growth-alignment"), true);
});

test("detects invalid KPI, governance, scorecard, and insight references", () => {
  const invalidRegistry: ExecutiveKpiStrategicAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY.alignments[0],
        kpiId: "missing-kpi",
        governanceReferenceId: "missing-governance",
        scorecardReferenceId: "missing-scorecard",
        insightReferenceIds: Object.freeze(["missing-insight"] as const),
      }),
    ]),
  });
  const validation = validateExecutiveKpiStrategicAlignments(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:financial-health-growth-alignment:missing-kpi"), true);
  assert.equal(validation.errors.includes("invalid-governance-reference:financial-health-growth-alignment"), true);
  assert.equal(validation.errors.includes("invalid-scorecard-reference:financial-health-growth-alignment"), true);
  assert.equal(validation.errors.includes("invalid-insight-reference:financial-health-growth-alignment:missing-insight"), true);
});

test("detects invalid category", () => {
  const invalidRegistry: ExecutiveKpiStrategicAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY.alignments[0],
        alignmentCategory: "Invalid" as ExecutiveStrategicAlignmentCategory,
      }),
    ]),
  });
  const validation = validateExecutiveKpiStrategicAlignments(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-category:financial-health-growth-alignment"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiStrategicAlignmentPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.getExecutiveKpiStrategicAlignmentPlatform, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.getExecutiveKpiStrategicAlignmentManifest, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.validateExecutiveKpiStrategicAlignments, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.listExecutiveKpiStrategicAlignments, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.listExecutiveStrategicAlignmentCategories, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.listExecutiveAlignmentStrengthLevels, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.listExecutiveStrategicHorizons, "function");
  assert.equal(typeof ExecutiveKpiStrategicAlignmentPlatform.listExecutiveStrategicAlignmentLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiStrategicAlignmentPlatform), true);
});

test("publishes immutable strategic alignment contracts", () => {
  const alignments = listExecutiveKpiStrategicAlignments();

  assert.equal(alignments.every((alignment) => alignment.metadataOnly && alignment.immutable), true);
  assert.equal(Object.isFrozen(alignments), true);
});

test("contains no runtime behavior metadata", () => {
  const registry = EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY;

  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("execute")), false);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("score")), false);
});
