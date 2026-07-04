import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatform } from "./executiveOkrPlatform.ts";
import { EXECUTIVE_OKR_DEFINITION_REGISTRY } from "./executiveOkrDefinitionRegistry.ts";
import type { ExecutiveOkrDefinitionManifest } from "./executiveOkrDefinitionTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-14-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveOkrDefinitionManifest(): ExecutiveOkrDefinitionManifest {
  const foundation = getExecutiveOkrPlatform();
  const kpiFreeze = getExecutiveKpiPlatformFreezeState();
  const registry = EXECUTIVE_OKR_DEFINITION_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.deterministicFingerprint,
    kpiFreeze.manifest.deterministicFingerprint,
    ...registry.objectives.map((objective) => `${objective.objectiveId}:${objective.objectiveCategory}:${objective.strategicHorizon}:${objective.lifecycleState}`).sort(),
    ...registry.keyResults.map((keyResult) => `${keyResult.keyResultId}:${keyResult.parentObjectiveId}:${keyResult.keyResultCategory}:${keyResult.lifecycleState}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: foundation.registry.platformId,
    kpiFreezeDependency: registry.kpiFreezeDependency,
    foundationAvailable: foundation.validation.valid,
    kpiFreezeAvailable: kpiFreeze.status === "PASS" && kpiFreeze.finalState === "Certified Frozen Released",
    objectiveCount: registry.objectives.length,
    keyResultCount: registry.keyResults.length,
    objectiveCategoryCount: registry.objectiveCategories.length,
    keyResultCategoryCount: registry.keyResultCategories.length,
    strategicHorizonCount: registry.strategicHorizons.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    kpiLinkageCount: registry.kpiLinkageIds.length,
    publicApis: registry.publicApis,
    certificationStatus: "Definition Platform Certified",
    deterministicFingerprint,
  });
}
