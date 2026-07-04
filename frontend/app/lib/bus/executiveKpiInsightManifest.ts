import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { EXECUTIVE_KPI_INSIGHT_REGISTRY } from "./executiveKpiInsightRegistry.ts";
import type { ExecutiveKpiInsightManifest } from "./executiveKpiInsightTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-7-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiInsightManifest(): ExecutiveKpiInsightManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const registry = EXECUTIVE_KPI_INSIGHT_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    definitions.manifest.platformId,
    sourceMappings.manifest.platformId,
    targets.manifest.platformId,
    governance.manifest.platformId,
    scorecards.manifest.platformId,
    ...registry.insights.map((insight) => `${insight.insightId}:${insight.insightCategory}:${insight.severityLevel}:${insight.confidenceLevel}:${insight.lifecycleState}`).sort(),
    ...registry.categories,
    ...registry.severityLevels,
    ...registry.confidenceLevels,
    ...registry.audienceLevels,
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
    scorecardPlatformId: scorecards.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetsAvailable: targets.validation.valid,
    governanceAvailable: governance.validation.valid,
    scorecardsAvailable: scorecards.validation.valid,
    insightCount: registry.insights.length,
    categoryCount: registry.categories.length,
    severityLevelCount: registry.severityLevels.length,
    confidenceLevelCount: registry.confidenceLevels.length,
    audienceLevelCount: registry.audienceLevels.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Insight Metadata Foundation Certified",
    deterministicFingerprint,
  });
}
