import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY } from "./executiveKpiBusinessImpactRegistry.ts";
import type { ExecutiveKpiBusinessImpactManifest } from "./executiveKpiBusinessImpactTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-9-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiBusinessImpactManifest(): ExecutiveKpiBusinessImpactManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const registry = EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY;
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
    strategicAlignments.manifest.platformId,
    ...registry.impacts
      .map((impact) => `${impact.impactId}:${impact.kpiId}:${impact.impactCategory}:${impact.impactDimension}:${impact.impactHorizon}:${impact.confidenceLevel}:${impact.lifecycleState}`)
      .sort(),
    ...registry.categories,
    ...registry.dimensions,
    ...registry.horizons,
    ...registry.confidenceLevels,
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
    strategicAlignmentPlatformId: strategicAlignments.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetsAvailable: targets.validation.valid,
    governanceAvailable: governance.validation.valid,
    scorecardsAvailable: scorecards.validation.valid,
    insightsAvailable: insights.validation.valid,
    strategicAlignmentsAvailable: strategicAlignments.validation.valid,
    impactCount: registry.impacts.length,
    categoryCount: registry.categories.length,
    dimensionCount: registry.dimensions.length,
    horizonCount: registry.horizons.length,
    confidenceLevelCount: registry.confidenceLevels.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Business Impact Metadata Platform Certified",
    deterministicFingerprint,
  });
}
