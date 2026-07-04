import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { EXECUTIVE_KPI_DEFINITION_REGISTRY } from "./executiveKpiDefinitionRegistry.ts";
import type { ExecutiveKpiDefinitionManifest } from "./executiveKpiDefinitionTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-2-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiDefinitionManifest(): ExecutiveKpiDefinitionManifest {
  const foundation = getExecutiveKpiPlatform();
  const registry = EXECUTIVE_KPI_DEFINITION_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundation.manifest.platformId,
    ...registry.definitions.map((definition) => `${definition.kpiId}:${definition.category}:${definition.direction}:${definition.lifecycleState}`).sort(),
    ...registry.categories.map((category) => category.category).sort(),
    ...registry.directions,
    ...registry.lifecycleStates,
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: foundation.manifest.platformId,
    foundationAvailable: foundation.validation.valid,
    definitionCount: registry.definitions.length,
    categoryCount: registry.categories.length,
    directionCount: registry.directions.length,
    lifecycleStateCount: registry.lifecycleStates.length,
    publicApis: registry.publicApis,
    certificationStatus: "Definition Foundation Certified",
    deterministicFingerprint,
  });
}
