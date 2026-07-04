import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import { EXECUTIVE_KPI_GOVERNANCE_REGISTRY } from "./executiveKpiGovernanceRegistry.ts";
import type { ExecutiveKpiGovernanceManifest } from "./executiveKpiGovernanceTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-5-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiGovernanceManifest(): ExecutiveKpiGovernanceManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const registry = EXECUTIVE_KPI_GOVERNANCE_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    definitions.manifest.platformId,
    sourceMappings.manifest.platformId,
    targets.manifest.platformId,
    ...registry.governance.map((entry) => `${entry.governanceId}:${entry.kpiId}:${entry.governanceCategory}:${entry.complianceLevel}:${entry.criticalityLevel}:${entry.lifecycleState}`).sort(),
    ...registry.governanceCategories,
    ...registry.complianceLevels,
    ...registry.criticalityLevels,
    ...registry.reviewPolicies,
    ...registry.changeControlPolicies,
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
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    sourceMappingsAvailable: sourceMappings.validation.valid,
    targetsAvailable: targets.validation.valid,
    governanceCount: registry.governance.length,
    governanceCategoryCount: registry.governanceCategories.length,
    complianceLevelCount: registry.complianceLevels.length,
    criticalityLevelCount: registry.criticalityLevels.length,
    reviewPolicyCount: registry.reviewPolicies.length,
    changeControlPolicyCount: registry.changeControlPolicies.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Governance Foundation Certified",
    deterministicFingerprint,
  });
}
