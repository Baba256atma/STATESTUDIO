import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetManifest } from "./executiveKpiTargetManifest.ts";
import { EXECUTIVE_KPI_TARGET_REGISTRY } from "./executiveKpiTargetRegistry.ts";
import type {
  ExecutiveKpiTarget,
  ExecutiveKpiTargetManifest,
  ExecutiveKpiTargetRegistry,
  ExecutiveKpiTargetValidation,
} from "./executiveKpiTargetTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveKpiTargetValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function validateTarget(target: ExecutiveKpiTarget, registry: ExecutiveKpiTargetRegistry, validKpiIds: ReadonlySet<string>): readonly string[] {
  const errors: string[] = [];
  const targetTypes = new Set(registry.targetTypes);
  const thresholdPolicies = new Set(registry.thresholdPolicies);
  const tolerancePolicies = new Set(registry.tolerancePolicies);
  const measurementPeriods = new Set(registry.measurementPeriods);
  const reviewCadences = new Set(registry.reviewCadences);
  const lifecycleStates = new Set(registry.lifecycleStates);

  if (!target.targetId) errors.push("missing-target-id");
  if (!validKpiIds.has(target.kpiId)) errors.push(`invalid-kpi-reference:${target.targetId}`);
  if (!target.targetName) errors.push(`missing-target-name:${target.targetId}`);
  if (!target.targetDescription) errors.push(`missing-target-description:${target.targetId}`);
  if (!target.targetOwner.ownerId || !target.targetOwner.ownerName || !target.targetOwner.ownerRole) errors.push(`invalid-owner:${target.targetId}`);
  if (!target.targetCategory) errors.push(`missing-target-category:${target.targetId}`);
  if (!measurementPeriods.has(target.measurementPeriod)) errors.push(`invalid-measurement-period:${target.targetId}`);
  if (!reviewCadences.has(target.reviewCadence)) errors.push(`invalid-review-cadence:${target.targetId}`);
  if (!target.targetDirection) errors.push(`missing-target-direction:${target.targetId}`);
  if (!targetTypes.has(target.targetType)) errors.push(`invalid-target-type:${target.targetId}`);
  if (!thresholdPolicies.has(target.thresholdPolicy)) errors.push(`invalid-threshold-policy:${target.targetId}`);
  if (!tolerancePolicies.has(target.tolerancePolicy)) errors.push(`invalid-tolerance-policy:${target.targetId}`);
  if (!target.effectiveDateMetadata.metadataOnly) errors.push(`invalid-effective-date:${target.targetId}`);
  if (!target.expirationMetadata.metadataOnly) errors.push(`invalid-expiration:${target.targetId}`);
  if (!lifecycleStates.has(target.lifecycleState)) errors.push(`invalid-lifecycle:${target.targetId}`);
  if (!target.governanceMetadata.metadataOnly) errors.push(`invalid-governance:${target.targetId}`);
  if (!target.metadataOnly || !target.immutable) errors.push(`invalid-target-metadata:${target.targetId}`);

  return Object.freeze(errors);
}

function validateRegistry(registry: ExecutiveKpiTargetRegistry): readonly string[] {
  const errors: string[] = [];
  const definitions = getExecutiveKpiDefinitionPlatform();
  const validKpiIds = new Set(definitions.registry.definitions.map((definition) => definition.kpiId));

  if (registry.platformId !== "BUS-4") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive KPI Target & Threshold Platform") errors.push("invalid-platform-name");
  if (registry.version !== "1.0.0") errors.push("invalid-version");
  if (registry.foundationPlatformId !== "BUS-1") errors.push("invalid-foundation-platform");
  if (registry.definitionPlatformId !== "BUS-2") errors.push("invalid-definition-platform");
  if (registry.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-source-mapping-platform");
  if (registry.targets.length === 0) errors.push("missing-targets");
  if (registry.targetTypes.length === 0) errors.push("missing-target-types");
  if (registry.thresholdPolicies.length === 0) errors.push("missing-threshold-policies");
  if (registry.tolerancePolicies.length === 0) errors.push("missing-tolerance-policies");
  if (registry.measurementPeriods.length === 0) errors.push("missing-measurement-periods");
  if (registry.reviewCadences.length === 0) errors.push("missing-review-cadences");
  if (registry.lifecycleStates.length === 0) errors.push("missing-lifecycle-states");
  if (registry.publicApis.length === 0) errors.push("missing-public-apis");
  if (!registry.metadataOnly || !registry.immutable) errors.push("invalid-registry-metadata");

  errors.push(...duplicateValues(registry.targets.map((target) => target.targetId)).map((id) => `duplicate-target-id:${id}`));
  errors.push(...duplicateValues(registry.targetTypes).map((id) => `duplicate-target-type:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  for (const target of registry.targets) {
    errors.push(...validateTarget(target, registry, validKpiIds));
  }

  return Object.freeze(errors);
}

function validateManifest(manifest: ExecutiveKpiTargetManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "BUS-4") errors.push("invalid-manifest-platform");
  if (manifest.foundationPlatformId !== "BUS-1") errors.push("invalid-manifest-foundation");
  if (manifest.definitionPlatformId !== "BUS-2") errors.push("invalid-manifest-definition-platform");
  if (manifest.sourceMappingPlatformId !== "BUS-3") errors.push("invalid-manifest-source-mapping-platform");
  if (!manifest.foundationAvailable) errors.push("foundation-unavailable");
  if (!manifest.definitionsAvailable) errors.push("definitions-unavailable");
  if (!manifest.sourceMappingsAvailable) errors.push("source-mappings-unavailable");
  if (manifest.targetCount === 0) errors.push("missing-manifest-targets");
  if (manifest.targetTypeCount === 0) errors.push("missing-manifest-target-types");
  if (manifest.thresholdPolicyCount === 0) errors.push("missing-manifest-threshold-policies");
  if (manifest.tolerancePolicyCount === 0) errors.push("missing-manifest-tolerance-policies");
  if (manifest.measurementPeriodCount === 0) errors.push("missing-manifest-measurement-periods");
  if (manifest.reviewCadenceCount === 0) errors.push("missing-manifest-review-cadences");
  if (manifest.lifecycleStateCount === 0) errors.push("missing-manifest-lifecycle-states");
  if (manifest.publicApis.length === 0) errors.push("missing-manifest-public-apis");
  if (manifest.certificationStatus !== "Target Foundation Certified") errors.push("invalid-certification-status");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return Object.freeze(errors);
}

export function validateExecutiveKpiTargets(
  registry: ExecutiveKpiTargetRegistry = EXECUTIVE_KPI_TARGET_REGISTRY,
  manifest: ExecutiveKpiTargetManifest = getExecutiveKpiTargetManifest()
): ExecutiveKpiTargetValidation {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const errors = Object.freeze([
    ...(foundation.validation.valid ? [] : ["foundation-validation-failed"]),
    ...(definitions.validation.valid ? [] : ["definition-validation-failed"]),
    ...(sourceMappings.validation.valid ? [] : ["source-mapping-validation-failed"]),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}
