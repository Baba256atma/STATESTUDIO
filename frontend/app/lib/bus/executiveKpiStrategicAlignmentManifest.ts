import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY } from "./executiveKpiStrategicAlignmentRegistry.ts";
import type { ExecutiveKpiStrategicAlignmentManifest } from "./executiveKpiStrategicAlignmentTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-8-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiStrategicAlignmentManifest(): ExecutiveKpiStrategicAlignmentManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const registry = EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    definitions.manifest.platformId,
    sourceMappings.manifest.platformId,
    targets.manifest.platformId,
    governance.manifest.platformId,
    scorecards.manifest.platformId,
    insights.manifest.platformId,
    ...registry.alignments
      .map((alignment) => `${alignment.alignmentId}:${alignment.kpiId}:${alignment.alignmentCategory}:${alignment.alignmentStrength}:${alignment.strategicHorizon}:${alignment.lifecycleState}`)
      .sort(),
    ...registry.categories,
    ...registry.strengthLevels,
    ...registry.strategicHorizons,
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
    insightPlatformId: insights.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetsAvailable: targets.validation.valid,
    governanceAvailable: governance.validation.valid,
    scorecardsAvailable: scorecards.validation.valid,
    insightsAvailable: insights.validation.valid,
    alignmentCount: registry.alignments.length,
    categoryCount: registry.categories.length,
    strengthLevelCount: registry.strengthLevels.length,
    strategicHorizonCount: registry.strategicHorizons.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Strategic Alignment Platform Certified",
    deterministicFingerprint,
  });
}
