import { BusinessSuiteDependencyRegistry } from "./businessSuiteDependencyRegistry.ts";
import type { BusinessSuiteDependencyMap } from "./businessSuiteDependencyTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-arch-3-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildBusinessSuiteDependencyManifest(): BusinessSuiteDependencyMap {
  const registry = BusinessSuiteDependencyRegistry;
  const deterministicFingerprint = fingerprint([
    registry.metadata.dependencyMapId,
    registry.metadata.version,
    ...registry.dependencyMap.map((dependency) => `${dependency.sourcePlatformId}->${dependency.targetPlatformId}:${dependency.allowedPublicApiSurface.join(",")}`).sort(),
    ...registry.consumerMap.map((consumer) => `${consumer.platformId}->${consumer.consumesPlatformId}`).sort(),
    ...registry.providerMap.map((provider) => `${provider.platformId}->${provider.providesToPlatformId}`).sort(),
    ...registry.forbiddenDependencyRegistry.map((dependency) => `${dependency.sourcePlatformId}!>${dependency.targetPlatformId}`).sort(),
  ]);

  return Object.freeze({
    architectureId: registry.metadata.architectureId,
    version: registry.metadata.version,
    dependencyCatalog: registry.dependencyMap,
    consumerCatalog: registry.consumerMap,
    providerCatalog: registry.providerMap,
    allowedDependencies: registry.allowedDependencyRegistry,
    forbiddenDependencies: registry.forbiddenDependencyRegistry,
    knownPlatformIds: registry.knownPlatformIds,
    dependencyCategories: registry.dependencyCategories,
    metadata: registry.metadata,
    deterministicFingerprint,
  });
}
