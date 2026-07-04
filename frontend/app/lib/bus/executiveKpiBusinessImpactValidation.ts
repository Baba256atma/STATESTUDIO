import { getExecutiveKpiBusinessImpactManifest } from "./executiveKpiBusinessImpactManifest.ts";
import { EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY } from "./executiveKpiBusinessImpactRegistry.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import type {
  ExecutiveKpiBusinessImpact,
  ExecutiveKpiBusinessImpactManifest,
  ExecutiveKpiBusinessImpactRegistry,
  ExecutiveKpiBusinessImpactValidation,
} from "./executiveKpiBusinessImpactTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiBusinessImpactValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateImpact(
  impact: ExecutiveKpiBusinessImpact,
  registry: ExecutiveKpiBusinessImpactRegistry,
  validKpiIds: ReadonlySet<string>,
  validGovernanceIds: ReadonlySet<string>,
  validAlignmentIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const categories = new Set(registry.categories);
  const dimensions = new Set(registry.dimensions);
  const horizons = new Set(registry.horizons);
  const confidenceLevels = new Set(registry.confidenceLevels);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!impact.impactId) errors.push("missing-impact-id");
  if (!validKpiIds.has(impact.kpiId)) errors.push(`invalid-kpi-reference:${impact.impactId}:${impact.kpiId}`);
  if (!impact.impactName) errors.push(`missing-impact-name:${impact.impactId}`);
  if (!impact.impactDescription) errors.push(`missing-impact-description:${impact.impactId}`);
  if (!categories.has(impact.impactCategory)) errors.push(`invalid-category:${impact.impactId}`);
  if (!dimensions.has(impact.impactDimension)) errors.push(`invalid-dimension:${impact.impactId}`);
  if (!impact.businessDomain) errors.push(`missing-business-domain:${impact.impactId}`);
  if (!impact.affectedAudience) errors.push(`missing-affected-audience:${impact.impactId}`);
  if (!horizons.has(impact.impactHorizon)) errors.push(`invalid-horizon:${impact.impactId}`);
  if (!confidenceLevels.has(impact.confidenceLevel)) errors.push(`invalid-confidence:${impact.impactId}`);
  if (!validAlignmentIds.has(impact.strategicAlignmentReferenceId)) errors.push(`invalid-alignment-reference:${impact.impactId}`);
  if (!validGovernanceIds.has(impact.governanceReferenceId)) errors.push(`invalid-governance-reference:${impact.impactId}`);
  if (!lifecycleStates.has(impact.lifecycleState)) errors.push(`invalid-lifecycle:${impact.impactId}`);
  if (!impact.metadata.metadataOnly || !impact.metadata.immutable) errors.push(`invalid-impact-metadata:${impact.impactId}`);
  if (!impact.metadataOnly || !impact.immutable) errors.push(`invalid-entry-metadata:${impact.impactId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiBusinessImpactRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));
  const validGovernanceIds = new Set(governance.registry.governance.map((entry) => entry.governanceId));
  const validAlignmentIds = new Set(strategicAlignments.registry.alignments.map((alignment) => alignment.alignmentId));

  if (registry.platformId !== "BUS-9") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Business Impact Metadata Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targetPlatformId !== "BUS-4") errors.push("invalid-target-platform");
  if (registry.governancePlatformId !== "BUS-5") errors.push("invalid-governance-platform");
  if (registry.scorecardPlatformId !== "BUS-6") errors.push("invalid-scorecard-platform");
  if (registry.insightPlatformId !== "BUS-7") errors.push("invalid-insight-platform");
  if (registry.strategicAlignmentPlatformId !== "BUS-8") errors.push("invalid-strategic-alignment-platform");
  if (registry.impacts.length === 0) errors.push("missing-impacts");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.dimensions.length === 0) errors.push("missing-dimensions");
  if (registry.horizons.length === 0) errors.push("missing-horizons");
  if (registry.confidenceLevels.length === 0) errors.push("missing-confidence-levels");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.impacts.map((impact) => impact.impactId)).map((id) => `duplicate-impact-id:${id}`));
  errors.push(...duplicateValues(registry.categories).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const impact of registry.impacts) {
    errors.push(...validateImpact(impact, registry, validKpiIds, validGovernanceIds, validAlignmentIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiBusinessImpactManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-9") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (manifest.targetPlatformId !== "BUS-4") errors.push("invalid-manifest-target-platform");
  if (manifest.governancePlatformId !== "BUS-5") errors.push("invalid-manifest-governance-platform");
  if (manifest.scorecardPlatformId !== "BUS-6") errors.push("invalid-manifest-scorecard-platform");
  if (manifest.insightPlatformId !== "BUS-7") errors.push("invalid-manifest-insight-platform");
  if (manifest.strategicAlignmentPlatformId !== "BUS-8") errors.push("invalid-manifest-strategic-alignment-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (!manifest.targetsAvailable) errors.push("targets-unavailable");
  if (!manifest.governanceAvailable) errors.push("governance-unavailable");
  if (!manifest.scorecardsAvailable) errors.push("scorecards-unavailable");
  if (!manifest.insightsAvailable) errors.push("insights-unavailable");
  if (!manifest.strategicAlignmentsAvailable) errors.push("strategic-alignments-unavailable");
  if (manifest.impactCount === 0) errors.push("missing-manifest-impacts");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.dimensionCount === 0) errors.push("missing-manifest-dimensions");
  if (manifest.horizonCount === 0) errors.push("missing-manifest-horizons");
  if (manifest.confidenceLevelCount === 0) errors.push("missing-manifest-confidence-levels");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Business Impact Metadata Platform Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiBusinessImpacts(
  registry: ExecutiveKpiBusinessImpactRegistry = EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY,
  manifest: ExecutiveKpiBusinessImpactManifest = getExecutiveKpiBusinessImpactManifest()
): ExecutiveKpiBusinessImpactValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const scorecards = getExecutiveKpiScorecardPlatform();
  const insights = getExecutiveKpiInsightPlatform();
  const strategicAlignments = getExecutiveKpiStrategicAlignmentPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...(targets.validation.valid ? [] : ["target-validation-failed"]),
    ...(governance.validation.valid ? [] : ["governance-validation-failed"]),
    ...(scorecards.validation.valid ? [] : ["scorecard-validation-failed"]),
    ...(insights.validation.valid ? [] : ["insight-validation-failed"]),
    ...(strategicAlignments.validation.valid ? [] : ["strategic-alignment-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
