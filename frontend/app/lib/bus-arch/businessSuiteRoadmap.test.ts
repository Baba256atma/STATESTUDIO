import assert from "node:assert/strict";
import test from "node:test";

import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import { buildBusinessSuiteBoundaryManifest } from "./businessSuiteBoundaryIndex.ts";
import { buildBusinessSuiteDependencyManifest } from "./businessSuiteDependencyIndex.ts";
import { buildBusinessSuiteApiPolicyManifest } from "./businessSuiteApiPolicyIndex.ts";
import {
  BusinessSuiteRoadmapRegistry,
  buildBusinessSuiteRoadmapManifest,
  validateBusinessSuiteRoadmap,
} from "./businessSuiteRoadmapIndex.ts";
import type { BusinessSuiteRoadmapManifest } from "./businessSuiteRoadmapTypes.ts";

test("roadmap registry exists", () => {
  assert.equal(BusinessSuiteRoadmapRegistry.metadata.roadmapId, "BUS-ARCH-5");
  assert.equal(BusinessSuiteRoadmapRegistry.implementationWaveRegistry.length, 7);
  assert.equal(Object.isFrozen(BusinessSuiteRoadmapRegistry), true);
});

test("wave registry valid", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(manifest.implementationWaves.length, 7);
  assert.equal(manifest.implementationWaves[0]?.name, "Foundation");
});

test("milestone registry valid", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(manifest.milestoneCatalog.length, 7);
  assert.equal(manifest.milestoneCatalog.every((milestone) => milestone.expectedOutputs.length > 0), true);
});

test("release registry valid", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(manifest.releaseGroups.length, 4);
  assert.equal(manifest.releaseGroups.every((release) => release.compatibilityRequirements.length > 0), true);
});

test("certification registry valid", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(manifest.certificationStages.length, 7);
  assert.equal(manifest.certificationStages[0]?.stage, "Planned");
});

test("expansion registry valid", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(manifest.futureExpansionCatalog.length, 4);
  assert.equal(manifest.futureExpansionCatalog.every((expansion) => expansion.prerequisites.length > 0), true);
});

test("wave ordering correct", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(manifest.implementationWaves.every((wave, index) => wave.order === index + 1), true);
});

test("milestone uniqueness", () => {
  const milestoneIds = BusinessSuiteRoadmapRegistry.milestoneRegistry.map((milestone) => milestone.milestoneId);

  assert.equal(new Set(milestoneIds).size, milestoneIds.length);
});

test("priority uniqueness", () => {
  const priorityIds = BusinessSuiteRoadmapRegistry.platformPriorityRegistry.map((priority) => priority.platformId);

  assert.equal(new Set(priorityIds).size, priorityIds.length);
});

test("deterministic manifest", () => {
  const first = buildBusinessSuiteRoadmapManifest();
  const second = buildBusinessSuiteRoadmapManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("immutable metadata", () => {
  const manifest = buildBusinessSuiteRoadmapManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.milestoneCatalog.every((milestone) => milestone.metadataOnly && milestone.immutable), true);
});

test("BUS-ARCH-1 compatibility", () => {
  assert.equal(buildBusinessSuiteArchitectureManifest().metadata.architectureId, "BUS-ARCH");
});

test("BUS-ARCH-2 compatibility", () => {
  assert.equal(buildBusinessSuiteBoundaryManifest().platformBoundaryCatalog.length, 14);
});

test("BUS-ARCH-3 compatibility", () => {
  assert.equal(buildBusinessSuiteDependencyManifest().dependencyCatalog.length, 28);
});

test("BUS-ARCH-4 compatibility", () => {
  assert.equal(buildBusinessSuiteApiPolicyManifest().publicApiCatalog.length, 42);
});

test("public API exports valid", () => {
  assert.equal(typeof buildBusinessSuiteRoadmapManifest, "function");
  assert.equal(typeof validateBusinessSuiteRoadmap, "function");
  assert.equal(Boolean(BusinessSuiteRoadmapRegistry), true);
});

test("validation succeeds", () => {
  const validation = validateBusinessSuiteRoadmap();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("duplicate milestones are rejected", () => {
  const base = buildBusinessSuiteRoadmapManifest();
  const manifest: BusinessSuiteRoadmapManifest = Object.freeze({
    ...base,
    milestoneCatalog: Object.freeze([base.milestoneCatalog[0], base.milestoneCatalog[0], ...base.milestoneCatalog.slice(1)]),
  });
  const validation = validateBusinessSuiteRoadmap(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`duplicate-milestone:${base.milestoneCatalog[0]?.milestoneId}`), true);
});

test("invalid wave ordering is rejected", () => {
  const base = buildBusinessSuiteRoadmapManifest();
  const firstWave = base.implementationWaves[0];
  const manifest: BusinessSuiteRoadmapManifest = Object.freeze({
    ...base,
    implementationWaves: Object.freeze([
      Object.freeze({ ...firstWave, order: 2 }),
      ...base.implementationWaves.slice(1),
    ]),
  });
  const validation = validateBusinessSuiteRoadmap(manifest);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes(`invalid-wave-order:${firstWave?.waveId}`), true);
});
