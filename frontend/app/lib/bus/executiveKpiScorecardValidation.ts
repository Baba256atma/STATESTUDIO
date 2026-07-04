import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { getExecutiveKpiScorecardManifest } from "./executiveKpiScorecardManifest.ts";
import { EXECUTIVE_KPI_SCORECARD_REGISTRY } from "./executiveKpiScorecardRegistry.ts";
import type {
  ExecutiveKpiScorecard,
  ExecutiveKpiScorecardManifest,
  ExecutiveKpiScorecardRegistry,
  ExecutiveKpiScorecardValidation,
} from "./executiveKpiScorecardTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiScorecardValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateScorecard(
  scorecard: ExecutiveKpiScorecard,
  registry: ExecutiveKpiScorecardRegistry,
  validKpiIds: ReadonlySet<string>,
  validGovernanceIds: ReadonlySet<string>
): readonly string[] {
  const errors: string[] = [];
  const categories = new Set(registry.categories);
  const hierarchyLevels = new Set(registry.hierarchyLevels);
  const visibilityLevels = new Set(registry.visibilityLevels);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!scorecard.scorecardId) errors.push("missing-scorecard-id");
  if (!scorecard.scorecardName) errors.push(`missing-scorecard-name:${scorecard.scorecardId}`);
  if (!scorecard.scorecardDescription) errors.push(`missing-scorecard-description:${scorecard.scorecardId}`);
  if (!categories.has(scorecard.scorecardCategory)) errors.push(`invalid-category:${scorecard.scorecardId}`);
  if (!scorecard.businessDomain) errors.push(`missing-business-domain:${scorecard.scorecardId}`);
  if (!scorecard.executiveOwner.ownerId || !scorecard.executiveOwner.ownerName || !scorecard.executiveOwner.metadataOnly) errors.push(`invalid-owner:${scorecard.scorecardId}`);
  if (scorecard.supportedKpiIds.length === 0) errors.push(`missing-kpi-membership:${scorecard.scorecardId}`);
  for (const kpiId of scorecard.supportedKpiIds) {
    if (!validKpiIds.has(kpiId)) errors.push(`invalid-kpi-reference:${scorecard.scorecardId}:${kpiId}`);
  }
  if (!hierarchyLevels.has(scorecard.hierarchyLevel)) errors.push(`invalid-hierarchy:${scorecard.scorecardId}`);
  if (!visibilityLevels.has(scorecard.visibilityMetadata.visibilityLevel) || !scorecard.visibilityMetadata.metadataOnly) errors.push(`invalid-visibility:${scorecard.scorecardId}`);
  if (!scorecard.reviewCadence) errors.push(`missing-review-cadence:${scorecard.scorecardId}`);
  if (!validGovernanceIds.has(scorecard.governanceReferenceId)) errors.push(`invalid-governance-reference:${scorecard.scorecardId}`);
  if (!lifecycleStates.has(scorecard.lifecycleState)) errors.push(`invalid-lifecycle:${scorecard.scorecardId}`);
  if (!scorecard.metadata.metadataOnly || !scorecard.metadata.immutable) errors.push(`invalid-scorecard-metadata:${scorecard.scorecardId}`);
  if (!scorecard.metadataOnly || !scorecard.immutable) errors.push(`invalid-entry-metadata:${scorecard.scorecardId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiScorecardRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));
  const validGovernanceIds = new Set(governance.registry.governance.map((entry) => entry.governanceId));

  if (registry.platformId !== "BUS-6") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Scorecard Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targetPlatformId !== "BUS-4") errors.push("invalid-target-platform");
  if (registry.governancePlatformId !== "BUS-5") errors.push("invalid-governance-platform");
  if (registry.scorecards.length === 0) errors.push("missing-scorecards");
  if (registry.categories.length === 0) errors.push("missing-categories");
  if (registry.hierarchyLevels.length === 0) errors.push("missing-hierarchy-levels");
  if (registry.visibilityLevels.length === 0) errors.push("missing-visibility-levels");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.scorecards.map((scorecard) => scorecard.scorecardId)).map((id) => `duplicate-scorecard-id:${id}`));
  errors.push(...duplicateValues(registry.categories).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const scorecard of registry.scorecards) {
    errors.push(...validateScorecard(scorecard, registry, validKpiIds, validGovernanceIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiScorecardManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-6") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (manifest.targetPlatformId !== "BUS-4") errors.push("invalid-manifest-target-platform");
  if (manifest.governancePlatformId !== "BUS-5") errors.push("invalid-manifest-governance-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (!manifest.targetsAvailable) errors.push("targets-unavailable");
  if (!manifest.governanceAvailable) errors.push("governance-unavailable");
  if (manifest.scorecardCount === 0) errors.push("missing-manifest-scorecards");
  if (manifest.categoryCount === 0) errors.push("missing-manifest-categories");
  if (manifest.hierarchyLevelCount === 0) errors.push("missing-manifest-hierarchy-levels");
  if (manifest.visibilityLevelCount === 0) errors.push("missing-manifest-visibility-levels");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Scorecard Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiScorecards(
  registry: ExecutiveKpiScorecardRegistry = EXECUTIVE_KPI_SCORECARD_REGISTRY,
  manifest: ExecutiveKpiScorecardManifest = getExecutiveKpiScorecardManifest()
): ExecutiveKpiScorecardValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const governance = getExecutiveKpiGovernancePlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...(targets.validation.valid ? [] : ["target-validation-failed"]),
    ...(governance.validation.valid ? [] : ["governance-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
