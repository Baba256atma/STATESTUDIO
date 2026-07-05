import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY } from "./executiveStrategyRegistry.ts";
import type { ExecutiveStrategyPlatformManifest } from "./executiveStrategyTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-17-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveStrategyManifest(): ExecutiveStrategyPlatformManifest {
  const registry = EXECUTIVE_STRATEGY_PLATFORM_REGISTRY;
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const kpiFreezeAvailable =
    kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
    kpiFreezeManifest.releaseMetadata.releaseStatus === "Released";
  const okrFreezeAvailable =
    okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
    okrFreezeManifest.releaseMetadata.releaseStatus === "Released";
  const deterministicFingerprint = fingerprint([
    registry.identity.platformId,
    registry.identity.version,
    kpiFreezeManifest.deterministicFingerprint,
    okrFreezeManifest.deterministicFingerprint,
    ...registry.entities.map((entity) => `${entity.entityId}:${entity.contractName}`).sort(),
    ...registry.publicApis.map((api) => api.apiName),
    ...registry.dependencies.map((dependency) => dependency.dependencyId).sort(),
  ]);

  return Object.freeze({
    identity: registry.identity,
    domainDefinition: registry.entities,
    publicApis: registry.publicApis,
    dependencies: registry.dependencies,
    extensionPolicy: registry.extensionPolicy,
    compatibility: registry.compatibility,
    kpiFreezeAvailable,
    okrFreezeAvailable,
    certificationStatus: "Foundation Certified",
    deterministicFingerprint,
  });
}
