import { BusinessSuiteArchitectureRegistry } from "./businessSuiteArchitectureRegistry.ts";
import type { BusinessSuiteArchitecture } from "./businessSuiteArchitectureTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-arch-1-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildBusinessSuiteArchitectureManifest(): BusinessSuiteArchitecture {
  const registry = BusinessSuiteArchitectureRegistry;
  const deterministicFingerprint = fingerprint([
    registry.metadata.architectureId,
    registry.version.version,
    ...registry.platforms.map((platform) => `${platform.platformId}:${platform.category}:${platform.architectureLayerId}`).sort(),
    ...registry.layers.map((layer) => `${layer.order}:${layer.layerId}`).sort(),
    ...registry.categories,
    ...registry.principles.map((principle) => principle.principleId).sort(),
    ...registry.rules.map((rule) => `${rule.ruleId}:${rule.ruleType}`).sort(),
  ]);

  return Object.freeze({
    metadata: registry.metadata,
    version: registry.version,
    platforms: registry.platforms,
    layers: registry.layers,
    categories: registry.categories,
    principles: registry.principles,
    rules: registry.rules,
    namingConventions: registry.namingConventions,
    deterministicFingerprint,
  });
}
