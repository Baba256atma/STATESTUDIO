import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiReportingManifest } from "./executiveKpiReportingManifest.ts";
import { EXECUTIVE_KPI_REPORTING_REGISTRY } from "./executiveKpiReportingRegistry.ts";
import type {
  ExecutiveKpiReport,
  ExecutiveKpiReportingManifest,
  ExecutiveKpiReportingRegistry,
  ExecutiveKpiReportingValidation,
} from "./executiveKpiReportingTypes.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiReportingValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateReport(
  report: ExecutiveKpiReport,
  registry: ExecutiveKpiReportingRegistry,
  validKpiIds: ReadonlySet<string>,
  validScorecardIds: ReadonlySet<string>,
  validGovernanceIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const reportTypes = new Set(registry.reportTypes);
  const reportSections = new Set(registry.reportSections);
  const audiences = new Set(registry.audiences);
  const cadences = new Set(registry.cadences);
  const formats = new Set(registry.formats);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!report.reportId) errors.push("missing-report-id");
  if (!report.reportName) errors.push(`missing-report-name:${report.reportId}`);
  if (!report.reportDescription) errors.push(`missing-report-description:${report.reportId}`);
  if (!reportTypes.has(report.reportType)) errors.push(`invalid-report-type:${report.reportId}`);
  if (!reportSections.has(report.reportSection)) errors.push(`invalid-report-section:${report.reportId}`);
  if (report.relatedKpiIds.length === 0) errors.push(`missing-kpi-references:${report.reportId}`);
  for (const kpiId of report.relatedKpiIds) {
    if (!validKpiIds.has(kpiId)) errors.push(`invalid-kpi-reference:${report.reportId}:${kpiId}`);
  }
  if (report.relatedScorecardIds.length === 0) errors.push(`missing-scorecard-references:${report.reportId}`);
  for (const scorecardId of report.relatedScorecardIds) {
    if (!validScorecardIds.has(scorecardId)) errors.push(`invalid-scorecard-reference:${report.reportId}:${scorecardId}`);
  }
  if (!audiences.has(report.intendedAudience)) errors.push(`invalid-audience:${report.reportId}`);
  if (!cadences.has(report.reportingCadence)) errors.push(`invalid-cadence:${report.reportId}`);
  if (!formats.has(report.reportingFormat)) errors.push(`invalid-format:${report.reportId}`);
  if (!report.businessDomain) errors.push(`missing-business-domain:${report.reportId}`);
  if (!validGovernanceIds.has(report.governanceReferenceId)) errors.push(`invalid-governance-reference:${report.reportId}`);
  if (!lifecycleStates.has(report.lifecycleState)) errors.push(`invalid-lifecycle:${report.reportId}`);
  if (!report.metadata.metadataOnly || !report.metadata.immutable) errors.push(`invalid-report-metadata:${report.reportId}`);
  if (!report.metadataOnly || !report.immutable) errors.push(`invalid-entry-metadata:${report.reportId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiReportingRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));
  const validGovernanceIds = new Set(governance.registry.governance.map((entry) => entry.governanceId));
  const validScorecardIds = new Set(scorecards.registry.scorecards.map((scorecard) => scorecard.scorecardId));

  if (registry.platformId !== "BUS-10") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Reporting Metadata Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targetPlatformId !== "BUS-4") errors.push("invalid-target-platform");
  if (registry.governancePlatformId !== "BUS-5") errors.push("invalid-governance-platform");
  if (registry.scorecardPlatformId !== "BUS-6") errors.push("invalid-scorecard-platform");
  if (registry.insightPlatformId !== "BUS-7") errors.push("invalid-insight-platform");
  if (registry.strategicAlignmentPlatformId !== "BUS-8") errors.push("invalid-strategic-alignment-platform");
  if (registry.businessImpactPlatformId !== "BUS-9") errors.push("invalid-business-impact-platform");
  if (registry.reports.length === 0) errors.push("missing-reports");
  if (registry.reportTypes.length === 0) errors.push("missing-report-types");
  if (registry.reportSections.length === 0) errors.push("missing-report-sections");
  if (registry.audiences.length === 0) errors.push("missing-audiences");
  if (registry.cadences.length === 0) errors.push("missing-cadences");
  if (registry.formats.length === 0) errors.push("missing-formats");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.reports.map((report) => report.reportId)).map((id) => `duplicate-report-id:${id}`));
  errors.push(...duplicateValues(registry.reportTypes).map((id) => `duplicate-report-type:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const report of registry.reports) {
    errors.push(...validateReport(report, registry, validKpiIds, validScorecardIds, validGovernanceIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiReportingManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-10") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (manifest.targetPlatformId !== "BUS-4") errors.push("invalid-manifest-target-platform");
  if (manifest.governancePlatformId !== "BUS-5") errors.push("invalid-manifest-governance-platform");
  if (manifest.scorecardPlatformId !== "BUS-6") errors.push("invalid-manifest-scorecard-platform");
  if (manifest.insightPlatformId !== "BUS-7") errors.push("invalid-manifest-insight-platform");
  if (manifest.strategicAlignmentPlatformId !== "BUS-8") errors.push("invalid-manifest-strategic-alignment-platform");
  if (manifest.businessImpactPlatformId !== "BUS-9") errors.push("invalid-manifest-business-impact-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (!manifest.targetsAvailable) errors.push("targets-unavailable");
  if (!manifest.governanceAvailable) errors.push("governance-unavailable");
  if (!manifest.scorecardsAvailable) errors.push("scorecards-unavailable");
  if (!manifest.insightsAvailable) errors.push("insights-unavailable");
  if (!manifest.strategicAlignmentsAvailable) errors.push("strategic-alignments-unavailable");
  if (!manifest.businessImpactsAvailable) errors.push("business-impacts-unavailable");
  if (manifest.reportCount === 0) errors.push("missing-manifest-reports");
  if (manifest.reportTypeCount === 0) errors.push("missing-manifest-report-types");
  if (manifest.reportSectionCount === 0) errors.push("missing-manifest-report-sections");
  if (manifest.audienceCount === 0) errors.push("missing-manifest-audiences");
  if (manifest.cadenceCount === 0) errors.push("missing-manifest-cadences");
  if (manifest.formatCount === 0) errors.push("missing-manifest-formats");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Reporting Metadata Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiReporting(
  registry: ExecutiveKpiReportingRegistry = EXECUTIVE_KPI_REPORTING_REGISTRY,
  manifest: ExecutiveKpiReportingManifest = getExecutiveKpiReportingManifest()
): ExecutiveKpiReportingValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const businessImpacts = getExecutiveKpiBusinessImpactPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...(targets.validation.valid ? [] : ["target-validation-failed"]),
    ...(governance.validation.valid ? [] : ["governance-validation-failed"]),
    ...(scorecards.validation.valid ? [] : ["scorecard-validation-failed"]),
    ...(insights.validation.valid ? [] : ["insight-validation-failed"]),
    ...(strategicAlignments.validation.valid ? [] : ["strategic-alignment-validation-failed"]),
    ...(businessImpacts.validation.valid ? [] : ["business-impact-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
