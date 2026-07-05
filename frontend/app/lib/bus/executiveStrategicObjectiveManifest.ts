import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import {
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  EXECUTIVE_STRATEGY_PUBLIC_APIS,
} from "./executiveStrategyRegistry.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionRegistry.ts";
import {
  EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  listExecutiveStrategicThemes,
} from "./executiveStrategicThemeIndex.ts";
import { EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY } from "./executiveStrategicObjectiveRegistry.ts";
import type { ExecutiveStrategicObjectiveManifest } from "./executiveStrategicObjectiveTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-20-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveStrategicObjectivesManifest(): ExecutiveStrategicObjectiveManifest {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const registry = EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY;
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId,
    EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.version,
    ...EXECUTIVE_STRATEGY_PUBLIC_APIS.map((api) => api.apiName),
    EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId,
    EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.version,
    ...strategyDefinitions.map((definition) => definition.identity.strategyId).sort(),
    ...EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
    EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId,
    EXECUTIVE_STRATEGIC_THEME_REGISTRY.version,
    ...strategicThemes.map((theme) => theme.identity.themeId).sort(),
    ...EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
    kpiFreezeManifest.deterministicFingerprint,
    okrFreezeManifest.deterministicFingerprint,
    ...registry.objectives.map((objective) => `${objective.identity.objectiveId}:${objective.category}:${objective.priority}:${objective.status}:${objective.lifecycle}`).sort(),
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
    objectiveCount: registry.objectives.length,
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
    kpiFreezeAvailable:
      kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      kpiFreezeManifest.releaseMetadata.releaseStatus === "Released",
    okrFreezeAvailable:
      okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      okrFreezeManifest.releaseMetadata.releaseStatus === "Released",
    certificationStatus: "Strategic Objectives Platform Certified",
    deterministicFingerprint,
  });
}
