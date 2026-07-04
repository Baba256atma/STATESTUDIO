import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { getExecutiveKpiGovernanceManifest } from "./executiveKpiGovernanceManifest.ts";
import { EXECUTIVE_KPI_GOVERNANCE_REGISTRY } from "./executiveKpiGovernanceRegistry.ts";
import type {
  ExecutiveKpiGovernance,
  ExecutiveKpiGovernanceManifest,
  ExecutiveKpiGovernanceRegistry,
  ExecutiveKpiGovernanceValidation,
} from "./executiveKpiGovernanceTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiGovernanceValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validRole(entry: ExecutiveKpiGovernance["businessOwner"]): boolean {
  return Boolean(entry.roleId && entry.displayName && entry.responsibility && entry.metadataOnly);
}

function validateGovernance(entry: ExecutiveKpiGovernance, registry: ExecutiveKpiGovernanceRegistry, validKpiIds: ReadonlySet<string>): readonly string[] {
  const errors: string[] = [];
  const categories = new Set(registry.governanceCategories);
  const complianceLevels = new Set(registry.complianceLevels);
  const criticalityLevels = new Set(registry.criticalityLevels);
  const reviewPolicies = new Set(registry.reviewPolicies);
  const changeControlPolicies = new Set(registry.changeControlPolicies);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!entry.governanceId) errors.push("missing-governance-id");
  if (!validKpiIds.has(entry.kpiId)) errors.push(`invalid-kpi-reference:${entry.governanceId}`);
  if (!validRole(entry.businessOwner)) errors.push(`invalid-business-owner:${entry.governanceId}`);
  if (!validRole(entry.executiveOwner)) errors.push(`invalid-executive-owner:${entry.governanceId}`);
  if (!validRole(entry.technicalSteward)) errors.push(`invalid-technical-steward:${entry.governanceId}`);
  if (!validRole(entry.dataSteward)) errors.push(`invalid-data-steward:${entry.governanceId}`);
  if (!validRole(entry.approvalAuthority)) errors.push(`invalid-approval-authority:${entry.governanceId}`);
  if (!validRole(entry.reviewAuthority)) errors.push(`invalid-review-authority:${entry.governanceId}`);
  if (!categories.has(entry.governanceCategory)) errors.push(`invalid-governance-category:${entry.governanceId}`);
  if (!complianceLevels.has(entry.complianceLevel)) errors.push(`invalid-compliance-level:${entry.governanceId}`);
  if (!criticalityLevels.has(entry.criticalityLevel)) errors.push(`invalid-criticality-level:${entry.governanceId}`);
  if (!changeControlPolicies.has(entry.changeControlPolicy)) errors.push(`invalid-change-control-policy:${entry.governanceId}`);
  if (!reviewPolicies.has(entry.reviewPolicy)) errors.push(`invalid-review-policy:${entry.governanceId}`);
  if (!entry.retentionPolicy.metadataOnly) errors.push(`invalid-retention-policy:${entry.governanceId}`);
  if (!entry.documentationRequirement.metadataOnly) errors.push(`invalid-documentation-requirement:${entry.governanceId}`);
  if (!lifecycleStates.has(entry.lifecycleState)) errors.push(`invalid-lifecycle:${entry.governanceId}`);
  if (!entry.governanceMetadata.metadataOnly || !entry.governanceMetadata.immutable) errors.push(`invalid-governance-metadata:${entry.governanceId}`);
  if (!entry.metadataOnly || !entry.immutable) errors.push(`invalid-entry-metadata:${entry.governanceId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiGovernanceRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));

  if (registry.platformId !== "BUS-5") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Governance Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targetPlatformId !== "BUS-4") errors.push("invalid-target-platform");
  if (registry.governance.length === 0) errors.push("missing-governance");
  if (registry.governanceCategories.length === 0) errors.push("missing-governance-categories");
  if (registry.complianceLevels.length === 0) errors.push("missing-compliance-levels");
  if (registry.criticalityLevels.length === 0) errors.push("missing-criticality-levels");
  if (registry.reviewPolicies.length === 0) errors.push("missing-review-policies");
  if (registry.changeControlPolicies.length === 0) errors.push("missing-change-control-policies");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.governance.map((entry) => entry.governanceId)).map((id) => `duplicate-governance-id:${id}`));
  errors.push(...duplicateValues(registry.governanceCategories).map((id) => `duplicate-governance-category:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const entry of registry.governance) {
    errors.push(...validateGovernance(entry, registry, validKpiIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiGovernanceManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-5") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (manifest.targetPlatformId !== "BUS-4") errors.push("invalid-manifest-target-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (!manifest.targetsAvailable) errors.push("targets-unavailable");
  if (manifest.governanceCount === 0) errors.push("missing-manifest-governance");
  if (manifest.governanceCategoryCount === 0) errors.push("missing-manifest-governance-categories");
  if (manifest.complianceLevelCount === 0) errors.push("missing-manifest-compliance-levels");
  if (manifest.criticalityLevelCount === 0) errors.push("missing-manifest-criticality-levels");
  if (manifest.reviewPolicyCount === 0) errors.push("missing-manifest-review-policies");
  if (manifest.changeControlPolicyCount === 0) errors.push("missing-manifest-change-control-policies");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Governance Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiGovernance(
  registry: ExecutiveKpiGovernanceRegistry = EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
  manifest: ExecutiveKpiGovernanceManifest = getExecutiveKpiGovernanceManifest()
): ExecutiveKpiGovernanceValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...(targets.validation.valid ? [] : ["target-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
