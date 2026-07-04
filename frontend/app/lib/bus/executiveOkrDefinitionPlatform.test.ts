import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatform } from "./executiveOkrPlatform.ts";
import {
  EXECUTIVE_OKR_DEFINITION_REGISTRY,
  ExecutiveOkrDefinitionPlatform,
  getExecutiveOkrDefinitionManifest,
  getExecutiveOkrDefinitionPlatform,
  listExecutiveKeyResultCategories,
  listExecutiveKeyResults,
  listExecutiveObjectiveCategories,
  listExecutiveObjectives,
  listExecutiveOkrLifecycleStates,
  listExecutiveStrategicHorizons,
  validateExecutiveOkrDefinitions,
} from "./executiveOkrDefinitionPlatform.ts";
import type {
  ExecutiveOkrDefinitionManifest,
  ExecutiveObjectiveCategory,
  ExecutiveOkrDefinitionRegistry,
} from "./executiveOkrDefinitionTypes.ts";

let cachedManifest: ExecutiveOkrDefinitionManifest | null = null;

function definitionManifest(): ExecutiveOkrDefinitionManifest {
  if (!cachedManifest) {
    cachedManifest = getExecutiveOkrDefinitionManifest();
  }
  return cachedManifest;
}

test("consumes BUS-13 public API", () => {
  const foundation = getExecutiveOkrPlatform();
  const manifest = definitionManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(manifest.foundationAvailable, true);
});

test("consumes KPI freeze public API", () => {
  const freeze = getExecutiveKpiPlatformFreezeState();
  const manifest = definitionManifest();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.finalState, "Certified Frozen Released");
  assert.equal(manifest.kpiFreezeAvailable, true);
});

test("publishes registry integrity", () => {
  const registry = EXECUTIVE_OKR_DEFINITION_REGISTRY;

  assert.equal(registry.platformId, "BUS-14");
  assert.equal(registry.foundationPlatformId, "BUS-13");
  assert.equal(registry.kpiFreezeDependency, "BUS-12");
  assert.equal(registry.objectives.length, 2);
  assert.equal(registry.keyResults.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("generates deterministic manifest", () => {
  const first = definitionManifest();
  const second = getExecutiveOkrDefinitionManifest();

  assert.equal(first.platformId, "BUS-14");
  assert.equal(first.objectiveCount, 2);
  assert.equal(first.keyResultCount, 2);
  assert.equal(first.certificationStatus, "Definition Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveOkrDefinitions(EXECUTIVE_OKR_DEFINITION_REGISTRY, definitionManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("publishes objective and key result registries", () => {
  assert.equal(listExecutiveObjectives().length, 2);
  assert.equal(listExecutiveKeyResults().length, 2);
  assert.equal(listExecutiveObjectives().every((objective) => objective.metadataOnly && objective.immutable), true);
  assert.equal(listExecutiveKeyResults().every((keyResult) => keyResult.metadataOnly && keyResult.immutable), true);
});

test("publishes category registries", () => {
  assert.equal(listExecutiveObjectiveCategories().includes("Growth"), true);
  assert.equal(listExecutiveKeyResultCategories().includes("Efficiency"), true);
});

test("publishes strategic horizon and lifecycle registries", () => {
  assert.deepEqual(listExecutiveStrategicHorizons(), ["Quarterly", "Annual", "Multi-Year", "Long-Term"]);
  assert.deepEqual(listExecutiveOkrLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("detects duplicate objective ids", () => {
  const duplicateRegistry: ExecutiveOkrDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_OKR_DEFINITION_REGISTRY,
    objectives: Object.freeze([
      EXECUTIVE_OKR_DEFINITION_REGISTRY.objectives[0],
      EXECUTIVE_OKR_DEFINITION_REGISTRY.objectives[0],
    ]),
  });
  const validation = validateExecutiveOkrDefinitions(duplicateRegistry, definitionManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-objective-id:objective-profitable-growth"), true);
});

test("detects duplicate key result ids", () => {
  const duplicateRegistry: ExecutiveOkrDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_OKR_DEFINITION_REGISTRY,
    keyResults: Object.freeze([
      EXECUTIVE_OKR_DEFINITION_REGISTRY.keyResults[0],
      EXECUTIVE_OKR_DEFINITION_REGISTRY.keyResults[0],
    ]),
  });
  const validation = validateExecutiveOkrDefinitions(duplicateRegistry, definitionManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-key-result-id:kr-financial-health-visibility"), true);
});

test("detects invalid KPI references", () => {
  const invalidRegistry: ExecutiveOkrDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_OKR_DEFINITION_REGISTRY,
    objectives: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_OKR_DEFINITION_REGISTRY.objectives[0],
        linkedKpiIds: Object.freeze(["missing-kpi"] as const),
      }),
    ]),
  });
  const validation = validateExecutiveOkrDefinitions(invalidRegistry, definitionManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-objective-kpi-link:objective-profitable-growth:missing-kpi"), true);
});

test("detects invalid objective category", () => {
  const invalidRegistry: ExecutiveOkrDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_OKR_DEFINITION_REGISTRY,
    objectives: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_OKR_DEFINITION_REGISTRY.objectives[0],
        objectiveCategory: "Invalid" as ExecutiveObjectiveCategory,
      }),
    ]),
  });
  const validation = validateExecutiveOkrDefinitions(invalidRegistry, definitionManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-objective-category:objective-profitable-growth"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveOkrDefinitionPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.getExecutiveOkrDefinitionPlatform, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.getExecutiveOkrDefinitionManifest, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.validateExecutiveOkrDefinitions, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.listExecutiveObjectives, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.listExecutiveKeyResults, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.listExecutiveObjectiveCategories, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.listExecutiveKeyResultCategories, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.listExecutiveStrategicHorizons, "function");
  assert.equal(typeof ExecutiveOkrDefinitionPlatform.listExecutiveOkrLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveOkrDefinitionPlatform), true);
});

test("contains no runtime behavior metadata", () => {
  const registry = EXECUTIVE_OKR_DEFINITION_REGISTRY;

  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("execute")), false);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("score")), false);
});
