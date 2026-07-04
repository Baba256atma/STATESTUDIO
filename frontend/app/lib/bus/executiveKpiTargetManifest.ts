import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { EXECUTIVE_KPI_TARGET_REGISTRY } from "./executiveKpiTargetRegistry.ts";
import type { ExecutiveKpiTargetManifest } from "./executiveKpiTargetTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-4-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiTargetManifest(): ExecutiveKpiTargetManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const registry = EXECUTIVE_KPI_TARGET_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    definitions.manifest.platformId,
    sourceMappings.manifest.platformId,
    ...registry.targets.map((target) => `${target.targetId}:${target.kpiId}:${target.targetType}:${target.thresholdPolicy}:${target.tolerancePolicy}:${target.lifecycleState}`).sort(),
    ...registry.targetTypes,
    ...registry.thresholdPolicies,
    ...registry.tolerancePolicies,
    ...registry.measurementPeriods,
    ...registry.reviewCadences,
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
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetCount: registry.targets.length,
    targetTypeCount: registry.targetTypes.length,
    thresholdPolicyCount: registry.thresholdPolicies.length,
    tolerancePolicyCount: registry.tolerancePolicies.length,
    measurementPeriodCount: registry.measurementPeriods.length,
    reviewCadenceCount: registry.reviewCadences.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Target Foundation Certified",
    deterministicFingerprint,
  });
}
