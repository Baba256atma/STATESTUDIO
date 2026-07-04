import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import {
  EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
  ExecutiveKpiSourceMappingPlatform,
  getExecutiveKpiSourceMappingManifest,
  getExecutiveKpiSourceMappingPlatform,
  listExecutiveKpiCoverageLevels,
  listExecutiveKpiFreshnessExpectations,
  listExecutiveKpiSourceMappingLifecycleStates,
  listExecutiveKpiSourceMappings,
  listExecutiveKpiSourceTypes,
  validateExecutiveKpiSourceMappings,
} from "./executiveKpiSourceMappingPlatform.ts";
import type { ExecutiveKpiSourceMappingRegistry, ExecutiveKpiSourceType } from "./executiveKpiSourceMappingTypes.ts";

test("consumes BUS-1 public API", () => {
  const foundation = getExecutiveKpiPlatform();
  const manifest = getExecutiveKpiSourceMappingManifest();

  assert.equal(foundation.manifest.platformId, "BUS-1");
  assert.equal(foundation.validation.valid, true);
  assert.equal(manifest.foundationAvailable, true);
});

test("consumes BUS-2 public API", () => {
  const definitions = getExecutiveKpiDefinitionPlatform();
  const manifest = getExecutiveKpiSourceMappingManifest();

  assert.equal(definitions.manifest.platformId, "BUS-2");
  assert.equal(definitions.validation.valid, true);
  assert.equal(manifest.definitionsAvailable, true);
});

test("publishes source mapping registry integrity", () => {
  const registry = EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY;

  assert.equal(registry.platformId, "BUS-3");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.mappings.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes source type registry integrity", () => {
  const sourceTypes = listExecutiveKpiSourceTypes();

  assert.equal(sourceTypes.length, 11);
  assert.equal(sourceTypes.includes("Finance System"), true);
  assert.equal(sourceTypes.includes("API"), true);
});

test("publishes coverage registry integrity", () => {
  assert.deepEqual(listExecutiveKpiCoverageLevels(), ["Complete", "Partial", "Missing", "Unknown"]);
});

test("publishes freshness registry integrity", () => {
  assert.deepEqual(listExecutiveKpiFreshnessExpectations(), ["Real Time", "Hourly", "Daily", "Weekly", "Monthly", "Quarterly", "Manual", "Unknown"]);
});

test("publishes lifecycle registry integrity", () => {
  assert.deepEqual(listExecutiveKpiSourceMappingLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiSourceMappingManifest();
  const second = getExecutiveKpiSourceMappingManifest();

  assert.equal(first.platformId, "BUS-3");
  assert.equal(first.mappingCount, 2);
  assert.equal(first.certificationStatus, "Source Mapping Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiSourceMappings();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate mapping ids", () => {
  const duplicateRegistry: ExecutiveKpiSourceMappingRegistry = Object.freeze({
    ...EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
    mappings: Object.freeze([
      EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY.mappings[0],
      EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY.mappings[0],
    ]),
  });
  const validation = validateExecutiveKpiSourceMappings(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-mapping-id:financial-health-finance-system-source"), true);
});

test("detects invalid KPI reference", () => {
  const invalidRegistry: ExecutiveKpiSourceMappingRegistry = Object.freeze({
    ...EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
    mappings: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY.mappings[0],
        kpiId: "missing-kpi",
      }),
    ]),
  });
  const validation = validateExecutiveKpiSourceMappings(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:financial-health-finance-system-source"), true);
});

test("detects invalid source type", () => {
  const invalidRegistry: ExecutiveKpiSourceMappingRegistry = Object.freeze({
    ...EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY,
    mappings: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY.mappings[0],
        sourceType: "Invalid" as ExecutiveKpiSourceType,
      }),
    ]),
  });
  const validation = validateExecutiveKpiSourceMappings(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-source-type:financial-health-finance-system-source"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiSourceMappingPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.getExecutiveKpiSourceMappingPlatform, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.getExecutiveKpiSourceMappingManifest, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.validateExecutiveKpiSourceMappings, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.listExecutiveKpiSourceMappings, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.listExecutiveKpiSourceTypes, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.listExecutiveKpiCoverageLevels, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.listExecutiveKpiFreshnessExpectations, "function");
  assert.equal(typeof ExecutiveKpiSourceMappingPlatform.listExecutiveKpiSourceMappingLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiSourceMappingPlatform), true);
});

test("publishes immutable source mapping contracts", () => {
  const mappings = listExecutiveKpiSourceMappings();

  assert.equal(mappings.every((mapping) => mapping.metadataOnly && mapping.immutable), true);
  assert.equal(Object.isFrozen(mappings), true);
});
