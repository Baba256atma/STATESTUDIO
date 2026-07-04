import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { getExecutiveKpiStrategicAlignmentManifest } from "./executiveKpiStrategicAlignmentManifest.ts";
import { EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY } from "./executiveKpiStrategicAlignmentRegistry.ts";
import type {
  ExecutiveKpiStrategicAlignment,
  ExecutiveKpiStrategicAlignmentManifest,
  ExecutiveKpiStrategicAlignmentRegistry,
  ExecutiveKpiStrategicAlignmentValidation,
} from "./executiveKpiStrategicAlignmentTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiStrategicAlignmentValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateAlignment(
  alignment: ExecutiveKpiStrategicAlignment,
  registry: ExecutiveKpiStrategicAlignmentRegistry,
  validKpiIds: ReadonlySet<string>,
  validGovernanceIds: ReadonlySet<string>,
  validScorecardIds: ReadonlySet<string>,
  validInsightIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const categories = new Set(registry.categories);
  const strengthLevels = new Set(registry.strengthLevels);
  const strategicHorizons = new Set(registry.strategicHorizons);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!alignment.alignmentId) errors.push("missing-alignment-id");
  if (!validKpiIds.has(alignment.kpiId)) errors.push(`invalid-kpi-reference:${alignment.alignmentId}:${alignment.kpiId}`);
  if (!alignment.strategicObjectiveId) errors.push(`missing-strategic-objective:${alignment.alignmentId}`);
  if (!alignment.businessGoalId) errors.push(`missing-business-goal:${alignment.alignmentId}`);
  if (!alignment.initiativeId) errors.push(`missing-initiative:${alignment.alignmentId}`);
  if (!alignment.strategicTheme) errors.push(`missing-strategic-theme:${alignment.alignmentId}`);
  if (!categories.has(alignment.alignmentCategory)) errors.push(`invalid-category:${alignment.alignmentId}`);
  if (!strengthLevels.has(alignment.alignmentStrength)) errors.push(`invalid-strength:${alignment.alignmentId}`);
  if (!strategicHorizons.has(alignment.strategicHorizon)) errors.push(`invalid-horizon:${alignment.alignmentId}`);
  if (!alignment.executiveOwner) errors.push(`missing-executive-owner:${alignment.alignmentId}`);
  if (!alignment.businessDomain) errors.push(`missing-business-domain:${alignment.alignmentId}`);
  if (!alignment.reviewCadence) errors.push(`missing-review-cadence:${alignment.alignmentId}`);
  if (!validGovernanceIds.has(alignment.governanceReferenceId)) errors.push(`invalid-governance-reference:${alignment.alignmentId}`);
  if (!validScorecardIds.has(alignment.scorecardReferenceId)) errors.push(`invalid-scorecard-reference:${alignment.alignmentId}`);
  if (alignment.insightReferenceIds.length === 0) errors.push(`missing-insight-references:${alignment.alignmentId}`);
  for (const insightId of alignment.insightReferenceIds) {
    if (!validInsightIds.has(insightId)) errors.push(`invalid-insight-reference:${alignment.alignmentId}:${insightId}`);
  }
  if (!lifecycleStates.has(alignment.lifecycleState)) errors.push(`invalid-lifecycle:${alignment.alignmentId}`);
  if (!alignment.metadata.metadataOnly || !alignment.metadata.immutable) errors.push(`invalid-alignment-metadata:${alignment.alignmentId}`);
  if (!alignment.metadataOnly || !alignment.immutable) errors.push(`invalid-entry-metadata:${alignment.alignmentId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiStrategicAlignmentRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));
  const validGovernanceIds = new Set(governance.registry.governance.map((entry) => entry.governanceId));
  const validScorecardIds = new Set(scorecards.registry.scorecards.map((scorecard) => scorecard.scorecardId));
  const validInsightIds = new Set(insights.registry.insights.map((insight) => insight.insightId));

  if (registry.platformId !== "BUS-8") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Strategic Alignment Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targetPlatformId !== "BUS-4") errors.push("invalid-target-platform");
  if (registry.governancePlatformId !== "BUS-5") errors.push("invalid-governance-platform");
  if (registry.scorecardPlatformId !== "BUS-6") errors.push("invalid-scorecard-platform");
  if (registry.insightPlatformId !== "BUS-7") errors.push("invalid-insight-platform");
  if (registry.alignments.length === 0) errors.push("missing-alignments");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.strengthLevels.length === 0) errors.push("missing-strength-levels");
  if (registry.strategicHorizons.length === 0) errors.push("missing-strategic-horizons");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.alignments.map((alignment) => alignment.alignmentId)).map((id) => `duplicate-alignment-id:${id}`));
  errors.push(...duplicateValues(registry.categories).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const alignment of registry.alignments) {
    errors.push(...validateAlignment(alignment, registry, validKpiIds, validGovernanceIds, validScorecardIds, validInsightIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiStrategicAlignmentManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-8") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (manifest.targetPlatformId !== "BUS-4") errors.push("invalid-manifest-target-platform");
  if (manifest.governancePlatformId !== "BUS-5") errors.push("invalid-manifest-governance-platform");
  if (manifest.scorecardPlatformId !== "BUS-6") errors.push("invalid-manifest-scorecard-platform");
  if (manifest.insightPlatformId !== "BUS-7") errors.push("invalid-manifest-insight-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (!manifest.targetsAvailable) errors.push("targets-unavailable");
  if (!manifest.governanceAvailable) errors.push("governance-unavailable");
  if (!manifest.scorecardsAvailable) errors.push("scorecards-unavailable");
  if (!manifest.insightsAvailable) errors.push("insights-unavailable");
  if (manifest.alignmentCount === 0) errors.push("missing-manifest-alignments");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.strengthLevelCount === 0) errors.push("missing-manifest-strength-levels");
  if (manifest.strategicHorizonCount === 0) errors.push("missing-manifest-strategic-horizons");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Strategic Alignment Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiStrategicAlignments(
  registry: ExecutiveKpiStrategicAlignmentRegistry = EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY,
  manifest: ExecutiveKpiStrategicAlignmentManifest = getExecutiveKpiStrategicAlignmentManifest()
): ExecutiveKpiStrategicAlignmentValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...(targets.validation.valid ? [] : ["target-validation-failed"]),
    ...(governance.validation.valid ? [] : ["governance-validation-failed"]),
    ...(scorecards.validation.valid ? [] : ["scorecard-validation-failed"]),
    ...(insights.validation.valid ? [] : ["insight-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
