import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import {
  EXECUTIVE_KPI_DEFINITION_REGISTRY,
  ExecutiveKpiDefinitionPlatform,
  getExecutiveKpiDefinitionManifest,
  getExecutiveKpiDefinitionPlatform,
  listExecutiveKpiCategories,
  listExecutiveKpiDefinitions,
  listExecutiveKpiDirections,
  listExecutiveKpiLifecycleStates,
  validateExecutiveKpiDefinitions,
} from "./executiveKpiDefinitionPlatform.ts";
import type { ExecutiveKpiCategory, ExecutiveKpiDefinitionRegistry } from "./executiveKpiDefinitionTypes.ts";

test("consumes BUS-1 public API", () => {
  const foundation = getExecutiveKpiPlatform();
  const manifest = getExecutiveKpiDefinitionManifest();

  assert.equal(foundation.manifest.platformId, "BUS-1");
  assert.equal(foundation.validation.valid, true);
  assert.equal(manifest.foundationPlatformId, "BUS-1");
  assert.equal(manifest.foundationAvailable, true);
});

test("publishes KPI definition registry integrity", () => {
  const registry = EXECUTIVE_KPI_DEFINITION_REGISTRY;

  assert.equal(registry.platformId, "BUS-2");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitions.length, 2);
  assert.equal(registry.metadataOnly, true);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes category registry integrity", () => {
  const categories = listExecutiveKpiCategories();

  assert.equal(categories.length, 12);
  assert.equal(categories.every((category) => category.metadataOnly), true);
  assert.equal(categories.some((category) => category.category === "Financial"), true);
});

test("publishes lifecycle registry integrity", () => {
  const lifecycleStates = listExecutiveKpiLifecycleStates();

  assert.deepEqual(lifecycleStates, ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("publishes direction registry integrity", () => {
  const directions = listExecutiveKpiDirections();

  assert.deepEqual(directions, ["Higher Is Better", "Lower Is Better", "Target Range", "Neutral Observation"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiDefinitionManifest();
  const second = getExecutiveKpiDefinitionManifest();

  assert.equal(first.platformId, "BUS-2");
  assert.equal(first.certificationStatus, "Definition Foundation Certified");
  assert.equal(first.definitionCount, 2);
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiDefinitions();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate KPI ids", () => {
  const duplicateRegistry: ExecutiveKpiDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_KPI_DEFINITION_REGISTRY,
    definitions: Object.freeze([
      EXECUTIVE_KPI_DEFINITION_REGISTRY.definitions[0],
      EXECUTIVE_KPI_DEFINITION_REGISTRY.definitions[0],
    ]),
  });
  const validation = validateExecutiveKpiDefinitions(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-kpi-id:executive-financial-health"), true);
});

test("detects invalid category reference", () => {
  const invalidRegistry: ExecutiveKpiDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_KPI_DEFINITION_REGISTRY,
    definitions: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_DEFINITION_REGISTRY.definitions[0],
        category: "Invalid" as ExecutiveKpiCategory,
      }),
    ]),
  });
  const validation = validateExecutiveKpiDefinitions(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-category:executive-financial-health"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiDefinitionPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.getExecutiveKpiDefinitionPlatform, "function");
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.getExecutiveKpiDefinitionManifest, "function");
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.validateExecutiveKpiDefinitions, "function");
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.listExecutiveKpiDefinitions, "function");
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.listExecutiveKpiCategories, "function");
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.listExecutiveKpiLifecycleStates, "function");
  assert.equal(typeof ExecutiveKpiDefinitionPlatform.listExecutiveKpiDirections, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiDefinitionPlatform), true);
});

test("publishes immutable definition contracts", () => {
  const definitions = listExecutiveKpiDefinitions();

  assert.equal(definitions.every((definition) => definition.metadataOnly && definition.immutable), true);
  assert.equal(Object.isFrozen(definitions), true);
});
