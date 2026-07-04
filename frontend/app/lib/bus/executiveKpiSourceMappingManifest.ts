import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY } from "./executiveKpiSourceMappingRegistry.ts";
import type { ExecutiveKpiSourceMappingManifest } from "./executiveKpiSourceMappingTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-3-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiSourceMappingManifest(): ExecutiveKpiSourceMappingManifest {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const registry = EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    definitions.manifest.platformId,
    ...registry.mappings.map((mapping) => `${mapping.mappingId}:${mapping.kpiId}:${mapping.sourceType}:${mapping.coverageLevel}:${mapping.freshnessExpectation}:${mapping.lifecycleState}`).sort(),
    ...registry.sourceTypes,
    ...registry.coverageLevels,
    ...registry.freshnessExpectations,
    ...registry.lifecycleStates,
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: foundation.manifest.platformId,
    definitionPlatformId: definitions.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionsAvailable: definitions.validation.valid,
    mappingCount: registry.mappings.length,
    sourceTypeCount: registry.sourceTypes.length,
    coverageLevelCount: registry.coverageLevels.length,
    freshnessExpectationCount: registry.freshnessExpectations.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Source Mapping Foundation Certified",
    deterministicFingerprint,
  });
}
