import * as assert from "node:assert/strict";
import { test } from "node:test";

import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY, EXECUTIVE_STRATEGY_PUBLIC_APIS } from "./executiveStrategyIndex.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionIndex.ts";
import {
  EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  listExecutiveStrategicThemes,
} from "./executiveStrategicThemeIndex.ts";
import {
  EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
  listExecutiveStrategicObjectives,
} from "./executiveStrategicObjectiveIndex.ts";
import {
  EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  listExecutiveStrategicInitiatives,
} from "./executiveStrategicInitiativeIndex.ts";
import {
  EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  listExecutiveStrategicRoadmaps,
} from "./executiveStrategicRoadmapIndex.ts";
import { buildExecutiveStrategyAlignment, EXECUTIVE_STRATEGY_ALIGNMENT_CONSTRAINT_REGISTRY, EXECUTIVE_STRATEGY_ALIGNMENT_DEPENDENCY_REGISTRY, EXECUTIVE_STRATEGY_ALIGNMENT_EVIDENCE_REGISTRY, EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY, EXECUTIVE_STRATEGY_ALIGNMENT_RELATIONSHIPS, EXECUTIVE_STRATEGY_ALIGNMENTS, ExecutiveStrategyAlignmentPlatform, getExecutiveStrategyAlignmentManifest, validateExecutiveStrategyAlignment } from "./executiveStrategyAlignmentIndex.ts";
import type { ExecutiveStrategyAlignmentRegistry } from "./executiveStrategyAlignmentTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY;

  assert.equal(registry.platformId, "BUS-23");
  assert.equal(registry.platformName, "Executive Strategy Alignment Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
  assert.equal(registry.themePlatformId, "BUS-19");
  assert.equal(registry.objectivePlatformId, "BUS-20");
  assert.equal(registry.initiativePlatformId, "BUS-21");
  assert.equal(registry.roadmapPlatformId, "BUS-22");
});

test("alignment contracts", () => {
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENTS.length, 3);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENTS.every((alignment) => alignment.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENTS.every((alignment) => alignment.context.contextStatement.length > 0), true);
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_RELATIONSHIPS.length, 51);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "AlignmentToEvidence"), true);
});

test("registry integrity", () => {
  const registry = EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY;

  assert.equal(registry.alignments.length, 3);
  assert.equal(registry.alignmentTypes.length, 3);
  assert.equal(registry.alignmentStatuses.length, 5);
  assert.equal(registry.evidence.length, 6);
  assert.equal(registry.constraints.length, 6);
  assert.equal(registry.dependencies.length, 4);
  assert.equal(Object.isFrozen(registry), true);
});

test("evidence and constraint registries", () => {
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_EVIDENCE_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_CONSTRAINT_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_DEPENDENCY_REGISTRY.length, 4);
});

test("dependency boundaries", () => {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const strategicRoadmaps = listExecutiveStrategicRoadmaps();
  const manifest = getExecutiveStrategyAlignmentManifest();

  assert.equal(kpiFreezeManifest.platformIdentity.state, "Certified Frozen Released");
  assert.equal(okrFreezeManifest.platformIdentity.state, "Certified Frozen Released");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId, "BUS-17");
  assert.equal(EXECUTIVE_STRATEGY_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId, "BUS-18");
  assert.equal(strategyDefinitions.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId, "BUS-19");
  assert.equal(strategicThemes.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId, "BUS-20");
  assert.equal(strategicObjectives.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId, "BUS-21");
  assert.equal(strategicInitiatives.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId, "BUS-22");
  assert.equal(strategicRoadmaps.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategicRoadmapsAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategyAlignment();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategyAlignmentManifest();
  const second = getExecutiveStrategyAlignmentManifest();

  assert.equal(first.platformId, "BUS-23");
  assert.equal(first.alignmentCount, 3);
  assert.equal(first.evidenceCount, 6);
  assert.equal(first.constraintCount, 6);
  assert.equal(first.dependencyCount, 4);
  assert.equal(first.relationshipCount, 51);
  assert.equal(first.certificationStatus, "Strategy Alignment Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategyAlignmentPlatform.buildExecutiveStrategyAlignment, "function");
  assert.equal(typeof ExecutiveStrategyAlignmentPlatform.validateExecutiveStrategyAlignment, "function");
  assert.equal(typeof ExecutiveStrategyAlignmentPlatform.getExecutiveStrategyAlignmentManifest, "function");
  assert.equal(typeof ExecutiveStrategyAlignmentPlatform.listExecutiveStrategyAlignments, "function");
  assert.equal(typeof ExecutiveStrategyAlignmentPlatform.listExecutiveStrategyAlignmentPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategyAlignment();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategyAlignmentPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategyAlignment();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.alignments.every((alignment) => alignment.version.semanticVersion === "1.0.0"), true);
});

test("duplicate detection", () => {
  const duplicateAlignments: ExecutiveStrategyAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
    alignments: Object.freeze([
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.alignments[0],
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.alignments[0],
    ]),
  });
  const duplicateRelationships: ExecutiveStrategyAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
    relationships: Object.freeze([
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.relationships[0],
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.relationships[0],
    ]),
  });
  const duplicateApis: ExecutiveStrategyAlignmentRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.publicApis[0],
    ]),
  });

  assert.equal(validateExecutiveStrategyAlignment(duplicateAlignments).errors.includes("duplicate-alignment-id:alignment-profitable-growth-chain"), true);
  assert.equal(validateExecutiveStrategyAlignment(duplicateRelationships).errors.includes("duplicate-relationship-id:alignment-growth-strategy-theme"), true);
  assert.equal(validateExecutiveStrategyAlignment(duplicateApis).errors.includes("duplicate-public-api:ExecutiveStrategyAlignmentPlatform"), true);
});
