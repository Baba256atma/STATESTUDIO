import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { EXECUTIVE_KPI_SCORECARD_REGISTRY } from "./executiveKpiScorecardRegistry.ts";
import type { ExecutiveKpiScorecardManifest } from "./executiveKpiScorecardTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-6-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiScorecardManifest(): ExecutiveKpiScorecardManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const registry = EXECUTIVE_KPI_SCORECARD_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    definitions.manifest.platformId,
    sourceMappings.manifest.platformId,
    targets.manifest.platformId,
    governance.manifest.platformId,
    ...registry.scorecards.map((scorecard) => `${scorecard.scorecardId}:${scorecard.scorecardCategory}:${scorecard.hierarchyLevel}:${scorecard.lifecycleState}`).sort(),
    ...registry.categories,
    ...registry.hierarchyLevels,
    ...registry.visibilityLevels,
    ...registry.lifecycleStates,
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: foundation.manifest.platformId,
    definitionPlatformId: definitions.manifest.platformId,
    sourceMappingPlatformId: sourceMappings.manifest.platformId,
    targetPlatformId: targets.manifest.platformId,
    governancePlatformId: governance.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetsAvailable: targets.validation.valid,
    governanceAvailable: governance.validation.valid,
    scorecardCount: registry.scorecards.length,
    categoryCount: registry.categories.length,
    hierarchyLevelCount: registry.hierarchyLevels.length,
    visibilityLevelCount: registry.visibilityLevels.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Scorecard Foundation Certified",
    deterministicFingerprint,
  });
}
