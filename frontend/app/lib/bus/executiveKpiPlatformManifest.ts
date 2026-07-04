import { EXECUTIVE_KPI_PLATFORM_REGISTRY } from "./executiveKpiPlatformRegistry.ts";
import type { ExecutiveKpiPlatformManifest } from "./executiveKpiPlatformTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-1-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveKpiPlatformManifest(): ExecutiveKpiPlatformManifest {
  const registry = EXECUTIVE_KPI_PLATFORM_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    ...registry.capabilities.map((capability) => `${capability.capabilityId}:${capability.declarationOnly}`).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.compatible}`).sort(),
    ...registry.publicApis.map((api) => `${api.apiName}:${api.stable}:${api.runtime}`).sort(),
  ]);

  return Object.freeze({
    platform: registry.platformName,
    platformId: registry.platformId,
    version: registry.version,
    phase: "BUS-1",
    capabilities: registry.capabilities,
    dependencies: registry.dependencies,
    consumers: registry.consumers,
    publicApis: registry.publicApis,
    certificationStatus: "Foundation Certified",
    releaseMetadata: registry.releaseMetadata,
    deterministicFingerprint,
  });
}
