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
import {
  EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
  listExecutiveStrategyAlignments,
} from "./executiveStrategyAlignmentIndex.ts";
import {
  buildExecutiveStrategyMonitoring,
  EXECUTIVE_STRATEGY_MONITORING_CADENCE_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_EVENT_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_EVIDENCE_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_RELATIONSHIPS,
  EXECUTIVE_STRATEGY_MONITORING_THRESHOLD_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORINGS,
  ExecutiveStrategyMonitoringPlatform,
  getExecutiveStrategyMonitoringManifest,
  listExecutiveStrategyMonitoringProfiles,
  listExecutiveStrategyMonitoringPublicApis,
  validateExecutiveStrategyMonitoring,
} from "./executiveStrategyMonitoringIndex.ts";
import type { ExecutiveStrategyMonitoringRegistry } from "./executiveStrategyMonitoringTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGY_MONITORING_REGISTRY;

  assert.equal(registry.platformId, "BUS-24");
  assert.equal(registry.platformName, "Executive Strategy Monitoring Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
  assert.equal(registry.themePlatformId, "BUS-19");
  assert.equal(registry.objectivePlatformId, "BUS-20");
  assert.equal(registry.initiativePlatformId, "BUS-21");
  assert.equal(registry.roadmapPlatformId, "BUS-22");
  assert.equal(registry.alignmentPlatformId, "BUS-23");
});

test("monitoring contracts", () => {
  assert.equal(EXECUTIVE_STRATEGY_MONITORINGS.length, 3);
  assert.equal(EXECUTIVE_STRATEGY_MONITORINGS.every((entry) => entry.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGY_MONITORINGS.every((entry) => entry.eventTypes.length > 0), true);
});

test("registry integrity", () => {
  const registry = EXECUTIVE_STRATEGY_MONITORING_REGISTRY;

  assert.equal(registry.monitorings.length, 3);
  assert.equal(registry.profiles.length, 3);
  assert.equal(registry.dimensions.length, 4);
  assert.equal(registry.categories.length, 3);
  assert.equal(registry.statuses.length, 4);
  assert.equal(registry.cadences.length, 3);
  assert.equal(registry.events.length, 6);
  assert.equal(registry.thresholds.length, 6);
  assert.equal(Object.isFrozen(registry), true);
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_RELATIONSHIPS.length, 76);
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "MonitoringToThresholdDefinition"), true);
});

test("cadence event threshold registries", () => {
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_CADENCE_REGISTRY.length, 3);
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_EVENT_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_THRESHOLD_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_EVIDENCE_REGISTRY.length, 6);
});

test("dependency boundaries", () => {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const strategicRoadmaps = listExecutiveStrategicRoadmaps();
  const strategyAlignments = listExecutiveStrategyAlignments();
  const manifest = getExecutiveStrategyMonitoringManifest();

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
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId, "BUS-23");
  assert.equal(strategyAlignments.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategyAlignmentAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategyMonitoring();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategyMonitoringManifest();
  const second = getExecutiveStrategyMonitoringManifest();

  assert.equal(first.platformId, "BUS-24");
  assert.equal(first.monitoringCount, 3);
  assert.equal(first.cadenceCount, 3);
  assert.equal(first.eventCount, 6);
  assert.equal(first.thresholdCount, 6);
  assert.equal(first.relationshipCount, 76);
  assert.equal(first.certificationStatus, "Strategy Monitoring Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategyMonitoringPlatform.buildExecutiveStrategyMonitoring, "function");
  assert.equal(typeof ExecutiveStrategyMonitoringPlatform.validateExecutiveStrategyMonitoring, "function");
  assert.equal(typeof ExecutiveStrategyMonitoringPlatform.getExecutiveStrategyMonitoringManifest, "function");
  assert.equal(typeof ExecutiveStrategyMonitoringPlatform.listExecutiveStrategyMonitoringProfiles, "function");
  assert.equal(typeof ExecutiveStrategyMonitoringPlatform.listExecutiveStrategyMonitoringPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategyMonitoring();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategyMonitoringPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategyMonitoring();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.monitorings.every((entry) => entry.version.semanticVersion === "1.0.0"), true);
});

test("duplicate detection", () => {
  const duplicateMonitorings: ExecutiveStrategyMonitoringRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
    monitorings: Object.freeze([
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.monitorings[0],
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.monitorings[0],
    ]),
  });
  const duplicateRelationships: ExecutiveStrategyMonitoringRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
    relationships: Object.freeze([
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.relationships[0],
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.relationships[0],
    ]),
  });
  const duplicateApis: ExecutiveStrategyMonitoringRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.publicApis[0],
    ]),
  });

  assert.equal(validateExecutiveStrategyMonitoring(duplicateMonitorings).errors.includes("duplicate-monitoring-id:monitoring-profitable-growth-health"), true);
  assert.equal(validateExecutiveStrategyMonitoring(duplicateRelationships).errors.includes("duplicate-relationship-id:monitoring-growth-strategy"), true);
  assert.equal(validateExecutiveStrategyMonitoring(duplicateApis).errors.includes("duplicate-public-api:ExecutiveStrategyMonitoringPlatform"), true);
});
