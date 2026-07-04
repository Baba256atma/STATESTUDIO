import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import {
  EXECUTIVE_KPI_SCORECARD_REGISTRY,
  ExecutiveKpiScorecardPlatform,
  getExecutiveKpiScorecardManifest,
  getExecutiveKpiScorecardPlatform,
  listExecutiveKpiScorecards,
  listExecutiveScorecardCategories,
  listExecutiveScorecardHierarchyLevels,
  listExecutiveScorecardLifecycleStates,
  listExecutiveScorecardVisibilityLevels,
  validateExecutiveKpiScorecards,
} from "./executiveKpiScorecardPlatform.ts";
import type { ExecutiveKpiScorecardCategory, ExecutiveKpiScorecardRegistry } from "./executiveKpiScorecardTypes.ts";

test("consumes prior BUS public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const manifest = getExecutiveKpiScorecardManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(targets.validation.valid, true);
  assert.equal(governance.validation.valid, true);
  assert.equal(manifest.foundationAvailable, true);
  assert.equal(manifest.governanceAvailable, true);
});

test("publishes scorecard registry integrity", () => {
  const registry = EXECUTIVE_KPI_SCORECARD_REGISTRY;

  assert.equal(registry.platformId, "BUS-6");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targetPlatformId, "BUS-4");
  assert.equal(registry.governancePlatformId, "BUS-5");
  assert.equal(registry.scorecards.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes category registry", () => {
  assert.deepEqual(listExecutiveScorecardCategories(), ["Executive", "Corporate", "Strategic", "Operational", "Financial", "Risk", "Project", "Department", "Portfolio", "Custom"]);
});

test("publishes hierarchy registry", () => {
  assert.deepEqual(listExecutiveScorecardHierarchyLevels(), ["Root", "Parent", "Child", "Standalone"]);
});

test("publishes visibility registry", () => {
  assert.deepEqual(listExecutiveScorecardVisibilityLevels(), ["Executive Only", "Management", "Department", "Organization", "Public Internal", "Restricted"]);
});

test("publishes lifecycle registry", () => {
  assert.deepEqual(listExecutiveScorecardLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiScorecardManifest();
  const second = getExecutiveKpiScorecardManifest();

  assert.equal(first.platformId, "BUS-6");
  assert.equal(first.scorecardCount, 2);
  assert.equal(first.certificationStatus, "Scorecard Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiScorecards();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate scorecard ids", () => {
  const duplicateRegistry: ExecutiveKpiScorecardRegistry = Object.freeze({
    ...EXECUTIVE_KPI_SCORECARD_REGISTRY,
    scorecards: Object.freeze([
      EXECUTIVE_KPI_SCORECARD_REGISTRY.scorecards[0],
      EXECUTIVE_KPI_SCORECARD_REGISTRY.scorecards[0],
    ]),
  });
  const validation = validateExecutiveKpiScorecards(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-scorecard-id:executive-finance-scorecard"), true);
});

test("detects invalid KPI reference", () => {
  const invalidRegistry: ExecutiveKpiScorecardRegistry = Object.freeze({
    ...EXECUTIVE_KPI_SCORECARD_REGISTRY,
    scorecards: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_SCORECARD_REGISTRY.scorecards[0],
        supportedKpiIds: Object.freeze(["missing-kpi"] as const),
      }),
    ]),
  });
  const validation = validateExecutiveKpiScorecards(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:executive-finance-scorecard:missing-kpi"), true);
});

test("detects invalid category", () => {
  const invalidRegistry: ExecutiveKpiScorecardRegistry = Object.freeze({
    ...EXECUTIVE_KPI_SCORECARD_REGISTRY,
    scorecards: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_SCORECARD_REGISTRY.scorecards[0],
        scorecardCategory: "Invalid" as ExecutiveKpiScorecardCategory,
      }),
    ]),
  });
  const validation = validateExecutiveKpiScorecards(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-category:executive-finance-scorecard"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiScorecardPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiScorecardPlatform.getExecutiveKpiScorecardPlatform, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.getExecutiveKpiScorecardManifest, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.validateExecutiveKpiScorecards, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.listExecutiveKpiScorecards, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.listExecutiveScorecardCategories, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.listExecutiveScorecardHierarchyLevels, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.listExecutiveScorecardVisibilityLevels, "function");
  assert.equal(typeof ExecutiveKpiScorecardPlatform.listExecutiveScorecardLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiScorecardPlatform), true);
});

test("publishes immutable scorecard contracts", () => {
  const scorecards = listExecutiveKpiScorecards();

  assert.equal(scorecards.every((scorecard) => scorecard.metadataOnly && scorecard.immutable), true);
  assert.equal(Object.isFrozen(scorecards), true);
});
