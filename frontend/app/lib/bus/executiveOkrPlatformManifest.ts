import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { EXECUTIVE_OKR_PLATFORM_REGISTRY } from "./executiveOkrPlatformRegistry.ts";
import type { ExecutiveOkrPlatformManifest } from "./executiveOkrPlatformTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-13-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveOkrPlatformManifest(): ExecutiveOkrPlatformManifest {
  const registry = EXECUTIVE_OKR_PLATFORM_REGISTRY;
  const kpiFreezeState = getExecutiveKpiPlatformFreezeState();
  const kpiFreezeAvailable = kpiFreezeState.status === "PASS" && kpiFreezeState.finalState === "Certified Frozen Released";
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    kpiFreezeState.manifest.deterministicFingerprint,
    ...registry.capabilities.map((capability) => capability.capabilityId).sort(),
    ...registry.dependencies.map((dependency) => dependency.dependencyId).sort(),
    ...registry.publicApis.map((api) => api.apiName),
  ]);

  return Object.freeze({
    platform: registry.platformName,
    platformId: registry.platformId,
    version: registry.version,
    phase: registry.platformId,
    capabilities: registry.capabilities,
    dependencies: registry.dependencies,
    consumers: registry.consumers,
    publicApis: registry.publicApis,
    kpiFreezeAvailable,
    kpiFreezeState: kpiFreezeAvailable ? "Certified Frozen Released" : "Unavailable",
    certificationStatus: "Foundation Certified",
    releaseMetadata: registry.releaseMetadata,
    deterministicFingerprint,
  });
}
