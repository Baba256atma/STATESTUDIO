import { EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_VERSION } from "./executivePrioritySignalContracts.ts";
import { getExecutivePrioritySignalRegistry } from "./executivePrioritySignalRegistry.ts";
import type { ExecutivePrioritySignalManifest } from "./executivePrioritySignalTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-7-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutivePrioritySignalManifest(): ExecutivePrioritySignalManifest {
  const registry = getExecutivePrioritySignalRegistry();
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    ...registry.categories,
    ...registry.priorityTypes,
    ...registry.providers.map((provider) => `${provider.providerId}:${provider.certified}:${provider.futureCompatible}`).sort(),
    ...registry.consumers.map((consumer) => consumer.consumerId).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.required}:${dependency.mode}`).sort(),
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformVersion: EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_VERSION,
    supportedPriorityCategories: registry.categories,
    supportedPriorityTypes: registry.priorityTypes,
    registeredProviders: registry.providers,
    registeredConsumers: registry.consumers,
    dependencies: registry.dependencies,
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: registry.versionMetadata,
    deterministicFingerprint,
  });
}
