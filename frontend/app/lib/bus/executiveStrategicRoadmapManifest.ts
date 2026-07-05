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
import { EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY } from "./executiveStrategicRoadmapRegistry.ts";
import type { ExecutiveStrategicRoadmapManifest } from "./executiveStrategicRoadmapTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-22-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveStrategicRoadmapsManifest(): ExecutiveStrategicRoadmapManifest {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const registry = EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY;
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
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
    kpiFreezeManifest.deterministicFingerprint,
    okrFreezeManifest.deterministicFingerprint,
    ...registry.roadmaps.map((roadmap) => `${roadmap.identity.roadmapId}:${roadmap.category}:${roadmap.priority}:${roadmap.status}:${roadmap.lifecycle}`).sort(),
    ...registry.phases.map((phase) => `${phase.phaseId}:${phase.phaseType}:${phase.sequenceOrder}`).sort(),
    ...registry.milestones.map((milestone) => `${milestone.milestoneId}:${milestone.milestoneType}`).sort(),
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
    roadmapCount: registry.roadmaps.length,
    phaseCount: registry.phases.length,
    milestoneCount: registry.milestones.length,
    categoryCount: registry.categories.length,
    statusCount: registry.statuses.length,
    priorityCount: registry.priorities.length,
    lifecycleCount: registry.lifecycles.length,
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
    kpiFreezeAvailable:
      kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      kpiFreezeManifest.releaseMetadata.releaseStatus === "Released",
    okrFreezeAvailable:
      okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      okrFreezeManifest.releaseMetadata.releaseStatus === "Released",
    certificationStatus: "Strategic Roadmaps Platform Certified",
    deterministicFingerprint,
  });
}
