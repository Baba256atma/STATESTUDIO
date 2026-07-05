import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import {
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  EXECUTIVE_STRATEGY_PUBLIC_APIS,
} from "./executiveStrategyIndex.ts";
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
  EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
} from "./executiveStrategyMonitoringIndex.ts";
import { EXECUTIVE_STRATEGY_SIMULATION_REGISTRY, listExecutiveStrategySimulations } from "./executiveStrategySimulationRegistry.ts";
import type { ExecutiveStrategySimulationManifest } from "./executiveStrategySimulationTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-25-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveStrategySimulationManifest(): ExecutiveStrategySimulationManifest {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const registry = EXECUTIVE_STRATEGY_SIMULATION_REGISTRY;
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const strategicRoadmaps = listExecutiveStrategicRoadmaps();
  const strategyAlignments = listExecutiveStrategyAlignments();
  const strategicSimulations = listExecutiveStrategySimulations();
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId,
    EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.version,
    ...EXECUTIVE_STRATEGY_PUBLIC_APIS.map((api) => api.apiName),
    EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId,
    ...strategyDefinitions.map((definition) => definition.identity.strategyId).sort(),
    ...EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
    EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId,
    ...strategicThemes.map((theme) => theme.identity.themeId).sort(),
    ...EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
    EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId,
    ...strategicObjectives.map((objective) => objective.identity.objectiveId).sort(),
    ...EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
    EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId,
    ...strategicInitiatives.map((initiative) => initiative.identity.initiativeId).sort(),
    ...EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
    EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId,
    ...strategicRoadmaps.map((roadmap) => roadmap.identity.roadmapId).sort(),
    ...EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
    EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId,
    ...strategyAlignments.map((alignment) => alignment.identity.alignmentId).sort(),
    ...EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS,
    EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformId,
    ...EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS,
    kpiFreezeManifest.deterministicFingerprint,
    okrFreezeManifest.deterministicFingerprint,
    ...strategicSimulations.map((simulation) => `${simulation.identity.simulationId}:${simulation.profile}:${simulation.category}:${simulation.status}:${simulation.priority}`).sort(),
    ...registry.scenarios.map((entry) => `${entry.scenarioId}:${entry.scenarioType}`).sort(),
    ...registry.outcomes.map((entry) => `${entry.outcomeId}:${entry.outcomeCategory}`).sort(),
    ...registry.assumptions.map((entry) => entry.assumptionId).sort(),
    ...registry.constraints.map((entry) => `${entry.constraintId}:${entry.constraintType}`).sort(),
    ...registry.evidence.map((entry) => `${entry.evidenceId}:${entry.evidenceType}`).sort(),
    ...registry.dependencies.map((entry) => `${entry.dependencyId}:${entry.dependencyType}`).sort(),
    ...registry.relationships.map((relationship) => `${relationship.relationshipType}:${relationship.sourceId}:${relationship.targetId}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: registry.foundationPlatformId,
    definitionPlatformId: registry.definitionPlatformId,
    themePlatformId: registry.themePlatformId,
    objectivePlatformId: registry.objectivePlatformId,
    initiativePlatformId: registry.initiativePlatformId,
    roadmapPlatformId: registry.roadmapPlatformId,
    alignmentPlatformId: registry.alignmentPlatformId,
    monitoringPlatformId: registry.monitoringPlatformId,
    simulationCount: registry.simulations.length,
    profileCount: registry.profiles.length,
    categoryCount: registry.categories.length,
    statusCount: registry.statuses.length,
    priorityCount: registry.priorities.length,
    lifecycleCount: registry.lifecycles.length,
    scenarioCount: registry.scenarios.length,
    outcomeCount: registry.outcomes.length,
    assumptionCount: registry.assumptions.length,
    constraintCount: registry.constraints.length,
    evidenceCount: registry.evidence.length,
    dependencyCount: registry.dependencies.length,
    ownerCount: registry.owners.length,
    versionCount: registry.versions.length,
    relationshipCount: registry.relationships.length,
    publicApis: registry.publicApis,
    strategyFoundationAvailable:
      EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId === "BUS-17" &&
      EXECUTIVE_STRATEGY_PUBLIC_APIS.length > 0,
    strategyDefinitionsAvailable:
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId === "BUS-18" &&
      strategyDefinitions.length > 0 &&
      EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0,
    strategicThemesAvailable:
      EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId === "BUS-19" &&
      strategicThemes.length > 0 &&
      EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS.length > 0,
    strategicObjectivesAvailable:
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId === "BUS-20" &&
      strategicObjectives.length > 0 &&
      EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS.length > 0,
    strategicInitiativesAvailable:
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId === "BUS-21" &&
      strategicInitiatives.length > 0 &&
      EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS.length > 0,
    strategicRoadmapsAvailable:
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId === "BUS-22" &&
      strategicRoadmaps.length > 0 &&
      EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0,
    strategyAlignmentAvailable:
      EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId === "BUS-23" &&
      strategyAlignments.length > 0 &&
      EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS.length > 0,
    strategyMonitoringAvailable:
      EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformId === "BUS-24" &&
      EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS.length > 0,
    kpiFreezeAvailable:
      kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      kpiFreezeManifest.releaseMetadata.releaseStatus === "Released",
    okrFreezeAvailable:
      okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      okrFreezeManifest.releaseMetadata.releaseStatus === "Released",
    certificationStatus: "Strategy Simulation Platform Certified",
    deterministicFingerprint,
  });
}
