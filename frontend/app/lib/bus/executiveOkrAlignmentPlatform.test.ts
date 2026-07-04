import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatform } from "./executiveOkrPlatform.ts";
import { getExecutiveOkrDefinitionPlatform } from "./executiveOkrDefinitionPlatform.ts";
import {
  EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
  ExecutiveOkrAlignmentPlatform,
  getExecutiveOkrAlignmentManifest,
  getExecutiveOkrAlignmentPlatform,
  listExecutiveAlignmentCategories,
  listExecutiveAlignmentStrengthLevels,
  listExecutiveDependencyTypes,
  listExecutiveOkrAlignmentLifecycleStates,
  listExecutiveOkrAlignments,
  listExecutiveStrategicThemes,
  validateExecutiveOkrAlignments,
} from "./executiveOkrAlignmentPlatform.ts";
import type { ExecutiveOkrAlignmentCategory, ExecutiveOkrAlignmentRegistry } from "./executiveOkrAlignmentTypes.ts";

let cachedManifest: ReturnType<typeof getExecutiveOkrAlignmentManifest> | null = null;

function alignmentManifest(): ReturnType<typeof getExecutiveOkrAlignmentManifest> {
  if (!cachedManifest) {
    cachedManifest = getExecutiveOkrAlignmentManifest();
  }
  return cachedManifest;
}

test("consumes BUS-13 public API", () => {
  const foundation = getExecutiveOkrPlatform();
  const manifest = alignmentManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(manifest.foundationAvailable, true);
});

test("consumes BUS-14 public API", () => {
  const definitions = getExecutiveOkrDefinitionPlatform();
  const manifest = alignmentManifest();

  assert.equal(definitions.validation.valid, true);
  assert.equal(manifest.definitionsAvailable, true);
});

test("consumes KPI freeze public API", () => {
  const freeze = getExecutiveKpiPlatformFreezeState();
  const manifest = alignmentManifest();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.finalState, "Certified Frozen Released");
  assert.equal(manifest.kpiFreezeAvailable, true);
});

test("publishes registry integrity", () => {
  const registry = EXECUTIVE_OKR_ALIGNMENT_REGISTRY;

  assert.equal(registry.platformId, "BUS-15");
  assert.equal(registry.foundationPlatformId, "BUS-13");
  assert.equal(registry.definitionPlatformId, "BUS-14");
  assert.equal(registry.kpiFreezeDependency, "BUS-12");
  assert.equal(registry.alignments.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("generates deterministic manifest", () => {
  const first = alignmentManifest();
  const second = getExecutiveOkrAlignmentManifest();

  assert.equal(first.platformId, "BUS-15");
  assert.equal(first.alignmentCount, 2);
  assert.equal(first.certificationStatus, "Alignment Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveOkrAlignments(EXECUTIVE_OKR_ALIGNMENT_REGISTRY, alignmentManifest());

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("publishes alignment registry", () => {
  const alignments = listExecutiveOkrAlignments();

  assert.equal(alignments.length, 2);
  assert.equal(alignments.every((alignment) => alignment.metadataOnly && alignment.immutable), true);
});

test("publishes dependency registry", () => {
  assert.deepEqual(listExecutiveDependencyTypes(), ["Requires", "Supports", "Influences", "References", "Independent"]);
});

test("publishes category, strength, theme, and lifecycle registries", () => {
  assert.equal(listExecutiveAlignmentCategories().includes("Strategic"), true);
  assert.deepEqual(listExecutiveAlignmentStrengthLevels(), ["Primary", "Strong", "Supporting", "Indirect", "Informational"]);
  assert.equal(listExecutiveStrategicThemes().includes("Operational Excellence"), true);
  assert.deepEqual(listExecutiveOkrAlignmentLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("detects duplicate alignment ids", () => {
  const duplicateRegistry: ExecutiveOkrAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      EXECUTIVE_OKR_ALIGNMENT_REGISTRY.alignments[0],
      EXECUTIVE_OKR_ALIGNMENT_REGISTRY.alignments[0],
    ]),
  });
  const validation = validateExecutiveOkrAlignments(duplicateRegistry, alignmentManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-alignment-id:alignment-profitable-growth-to-financial-health"), true);
});

test("detects invalid objective, key result, and KPI references", () => {
  const invalidRegistry: ExecutiveOkrAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_OKR_ALIGNMENT_REGISTRY.alignments[0],
        sourceObjectiveId: "missing-objective",
        targetObjectiveId: "missing-target",
        keyResultId: "missing-key-result",
        linkedKpiIds: Object.freeze(["missing-kpi"] as const),
      }),
    ]),
  });
  const validation = validateExecutiveOkrAlignments(invalidRegistry, alignmentManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-source-objective:alignment-profitable-growth-to-financial-health"), true);
  assert.equal(validation.errors.includes("invalid-target-objective:alignment-profitable-growth-to-financial-health"), true);
  assert.equal(validation.errors.includes("invalid-key-result:alignment-profitable-growth-to-financial-health"), true);
  assert.equal(validation.errors.includes("invalid-kpi-reference:alignment-profitable-growth-to-financial-health:missing-kpi"), true);
});

test("detects invalid category", () => {
  const invalidRegistry: ExecutiveOkrAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_OKR_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_OKR_ALIGNMENT_REGISTRY.alignments[0],
        alignmentCategory: "Invalid" as ExecutiveOkrAlignmentCategory,
      }),
    ]),
  });
  const validation = validateExecutiveOkrAlignments(invalidRegistry, alignmentManifest());

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-category:alignment-profitable-growth-to-financial-health"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveOkrAlignmentPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.getExecutiveOkrAlignmentPlatform, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.getExecutiveOkrAlignmentManifest, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.validateExecutiveOkrAlignments, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.listExecutiveOkrAlignments, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.listExecutiveAlignmentCategories, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.listExecutiveAlignmentStrengthLevels, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.listExecutiveDependencyTypes, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.listExecutiveStrategicThemes, "function");
  assert.equal(typeof ExecutiveOkrAlignmentPlatform.listExecutiveOkrAlignmentLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveOkrAlignmentPlatform), true);
});

test("contains no runtime behavior metadata", () => {
  const registry = EXECUTIVE_OKR_ALIGNMENT_REGISTRY;

  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("execute")), false);
  assert.equal(registry.publicApis.some((api) => api.toLowerCase().includes("resolve")), false);
});
