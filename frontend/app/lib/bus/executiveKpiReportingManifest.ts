import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { EXECUTIVE_KPI_REPORTING_REGISTRY } from "./executiveKpiReportingRegistry.ts";
import type { ExecutiveKpiReportingManifest } from "./executiveKpiReportingTypes.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-10-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiReportingManifest(): ExecutiveKpiReportingManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const businessImpacts = getExecutiveKpiBusinessImpactPlatform();
  const registry = EXECUTIVE_KPI_REPORTING_REGISTRY;
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
    businessImpacts.manifest.platformId,
    ...registry.reports
      .map((report) => `${report.reportId}:${report.reportType}:${report.reportSection}:${report.intendedAudience}:${report.reportingCadence}:${report.reportingFormat}:${report.lifecycleState}`)
      .sort(),
    ...registry.reportTypes,
    ...registry.reportSections,
    ...registry.audiences,
    ...registry.cadences,
    ...registry.formats,
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
    businessImpactPlatformId: businessImpacts.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetsAvailable: targets.validation.valid,
    governanceAvailable: governance.validation.valid,
    scorecardsAvailable: scorecards.validation.valid,
    insightsAvailable: insights.validation.valid,
    strategicAlignmentsAvailable: strategicAlignments.validation.valid,
    businessImpactsAvailable: businessImpacts.validation.valid,
    reportCount: registry.reports.length,
    reportTypeCount: registry.reportTypes.length,
    reportSectionCount: registry.reportSections.length,
    audienceCount: registry.audiences.length,
    cadenceCount: registry.cadences.length,
    formatCount: registry.formats.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Reporting Metadata Platform Certified",
    deterministicFingerprint,
  });
}
