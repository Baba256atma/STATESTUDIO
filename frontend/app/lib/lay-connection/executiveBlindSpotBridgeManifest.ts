import { EXECUTIVE_BLIND_SPOT_BRIDGE_VERSION } from "./executiveBlindSpotBridgeContracts.ts";
import { getExecutiveBlindSpotRegistry } from "./executiveBlindSpotBridgeRegistry.ts";
import type { ExecutiveBlindSpotManifest } from "./executiveBlindSpotBridgeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-8-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveBlindSpotManifest(): ExecutiveBlindSpotManifest {
  const registry = getExecutiveBlindSpotRegistry();
  const deterministicFingerprint = fingerprint([
    registry.bridgeId,
    ...registry.categories,
    ...registry.blindSpotTypes,
    ...registry.providers.map((provider) => `${provider.providerId}:${provider.certified}:${provider.futureCompatible}`).sort(),
    ...registry.consumers.map((consumer) => consumer.consumerId).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.required}:${dependency.mode}`).sort(),
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.bridgeId,
    platformVersion: EXECUTIVE_BLIND_SPOT_BRIDGE_VERSION,
    supportedBlindSpotCategories: registry.categories,
    supportedBlindSpotTypes: registry.blindSpotTypes,
    registeredProviders: registry.providers,
    registeredConsumers: registry.consumers,
    dependencies: registry.dependencies,
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: registry.versionMetadata,
    deterministicFingerprint,
  });
}
