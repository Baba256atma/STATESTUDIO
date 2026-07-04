import { EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_VERSION } from "./executiveAwarenessContextAggregatorContracts.ts";
import { getExecutiveAwarenessContextRegistry } from "./executiveAwarenessContextAggregatorRegistry.ts";
import type { ExecutiveContextManifest } from "./executiveAwarenessContextAggregatorTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-5-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveAwarenessContextManifest(): ExecutiveContextManifest {
  const registry = getExecutiveAwarenessContextRegistry();
  const deterministicFingerprint = fingerprint([
    registry.aggregatorId,
    ...registry.contextTypes,
    ...registry.providers.map((provider) => `${provider.providerId}:${provider.certified}:${provider.futureCompatible}`).sort(),
    ...registry.consumers.map((consumer) => consumer.consumerId).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.required}:${dependency.mode}`).sort(),
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: "nexora-executive-awareness-context-aggregator",
    aggregatorId: registry.aggregatorId,
    version: EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_VERSION,
    supportedContextTypes: registry.contextTypes,
    supportedProviders: registry.providers,
    supportedConsumers: registry.consumers,
    compatibility: registry.compatibilityMatrix,
    dependencies: registry.dependencies,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: registry.versionMetadata,
    deterministicFingerprint,
  });
}
