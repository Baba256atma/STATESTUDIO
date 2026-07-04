import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { getExecutiveKpiInsightManifest } from "./executiveKpiInsightManifest.ts";
import { EXECUTIVE_KPI_INSIGHT_REGISTRY } from "./executiveKpiInsightRegistry.ts";
import type {
  ExecutiveKpiInsight,
  ExecutiveKpiInsightManifest,
  ExecutiveKpiInsightRegistry,
  ExecutiveKpiInsightValidation,
} from "./executiveKpiInsightTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiInsightValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateInsight(
  insight: ExecutiveKpiInsight,
  registry: ExecutiveKpiInsightRegistry,
  validKpiIds: ReadonlySet<string>,
  validScorecardIds: ReadonlySet<string>,
  validGovernanceIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const categories = new Set(registry.categories);
  const severityLevels = new Set(registry.severityLevels);
  const confidenceLevels = new Set(registry.confidenceLevels);
  const audienceLevels = new Set(registry.audienceLevels);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!insight.insightId) errors.push("missing-insight-id");
  if (!insight.insightName) errors.push(`missing-insight-name:${insight.insightId}`);
  if (!insight.insightDescription) errors.push(`missing-insight-description:${insight.insightId}`);
  if (!categories.has(insight.insightCategory)) errors.push(`invalid-category:${insight.insightId}`);
  if (insight.relatedKpiIds.length === 0) errors.push(`missing-kpi-references:${insight.insightId}`);
  for (const kpiId of insight.relatedKpiIds) {
    if (!validKpiIds.has(kpiId)) errors.push(`invalid-kpi-reference:${insight.insightId}:${kpiId}`);
  }
  if (insight.relatedScorecardIds.length === 0) errors.push(`missing-scorecard-references:${insight.insightId}`);
  for (const scorecardId of insight.relatedScorecardIds) {
    if (!validScorecardIds.has(scorecardId)) errors.push(`invalid-scorecard-reference:${insight.insightId}:${scorecardId}`);
  }
  if (!audienceLevels.has(insight.intendedAudience)) errors.push(`invalid-audience:${insight.insightId}`);
  if (!severityLevels.has(insight.severityLevel)) errors.push(`invalid-severity:${insight.insightId}`);
  if (!confidenceLevels.has(insight.confidenceLevel)) errors.push(`invalid-confidence:${insight.insightId}`);
  if (!insight.businessDomain) errors.push(`missing-business-domain:${insight.insightId}`);
  if (!insight.executiveRelevance) errors.push(`missing-executive-relevance:${insight.insightId}`);
  if (!validGovernanceIds.has(insight.governanceReferenceId)) errors.push(`invalid-governance-reference:${insight.insightId}`);
  if (!lifecycleStates.has(insight.lifecycleState)) errors.push(`invalid-lifecycle:${insight.insightId}`);
  if (!insight.metadata.metadataOnly || !insight.metadata.immutable) errors.push(`invalid-insight-metadata:${insight.insightId}`);
  if (!insight.metadataOnly || !insight.immutable) errors.push(`invalid-entry-metadata:${insight.insightId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiInsightRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));
  const validScorecardIds = new Set(scorecards.registry.scorecards.map((scorecard) => scorecard.scorecardId));
  const validGovernanceIds = new Set(governance.registry.governance.map((entry) => entry.governanceId));

  if (registry.platformId !== "BUS-7") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Insight Metadata Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targetPlatformId !== "BUS-4") errors.push("invalid-target-platform");
  if (registry.governancePlatformId !== "BUS-5") errors.push("invalid-governance-platform");
  if (registry.scorecardPlatformId !== "BUS-6") errors.push("invalid-scorecard-platform");
  if (registry.insights.length === 0) errors.push("missing-insights");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.severityLevels.length === 0) errors.push("missing-severity-levels");
  if (registry.confidenceLevels.length === 0) errors.push("missing-confidence-levels");
  if (registry.audienceLevels.length === 0) errors.push("missing-audience-levels");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.insights.map((insight) => insight.insightId)).map((id) => `duplicate-insight-id:${id}`));
  errors.push(...duplicateValues(registry.categories).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const insight of registry.insights) {
    errors.push(...validateInsight(insight, registry, validKpiIds, validScorecardIds, validGovernanceIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiInsightManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-7") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (manifest.targetPlatformId !== "BUS-4") errors.push("invalid-manifest-target-platform");
  if (manifest.governancePlatformId !== "BUS-5") errors.push("invalid-manifest-governance-platform");
  if (manifest.scorecardPlatformId !== "BUS-6") errors.push("invalid-manifest-scorecard-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (!manifest.targetsAvailable) errors.push("targets-unavailable");
  if (!manifest.governanceAvailable) errors.push("governance-unavailable");
  if (!manifest.scorecardsAvailable) errors.push("scorecards-unavailable");
  if (manifest.insightCount === 0) errors.push("missing-manifest-insights");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.severityLevelCount === 0) errors.push("missing-manifest-severity-levels");
  if (manifest.confidenceLevelCount === 0) errors.push("missing-manifest-confidence-levels");
  if (manifest.audienceLevelCount === 0) errors.push("missing-manifest-audience-levels");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Insight Metadata Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiInsights(
  registry: ExecutiveKpiInsightRegistry = EXECUTIVE_KPI_INSIGHT_REGISTRY,
  manifest: ExecutiveKpiInsightManifest = getExecutiveKpiInsightManifest()
): ExecutiveKpiInsightValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...(targets.validation.valid ? [] : ["target-validation-failed"]),
    ...(governance.validation.valid ? [] : ["governance-validation-failed"]),
    ...(scorecards.validation.valid ? [] : ["scorecard-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
