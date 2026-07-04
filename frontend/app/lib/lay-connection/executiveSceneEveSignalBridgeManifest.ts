import { EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_VERSION } from "./executiveSceneEveSignalBridgeContracts.ts";
import { getExecutiveSceneEveRegistry } from "./executiveSceneEveSignalBridgeRegistry.ts";
import type { ExecutiveSceneEveManifest } from "./executiveSceneEveSignalBridgeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-10-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveSceneEveManifest(): ExecutiveSceneEveManifest {
  const registry = getExecutiveSceneEveRegistry();
  const deterministicFingerprint = fingerprint([
    registry.bridgeId,
    ...registry.signalCategories,
    ...registry.signalTypes,
    ...registry.providers.map((provider) => `${provider.providerId}:${provider.certified}:${provider.futureCompatible}`).sort(),
    ...registry.consumers.map((consumer) => consumer.consumerId).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.required}:${dependency.mode}`).sort(),
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.bridgeId,
    platformVersion: EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_VERSION,
    supportedSignalCategories: registry.signalCategories,
    supportedSignalTypes: registry.signalTypes,
    registeredProviders: registry.providers,
    registeredConsumers: registry.consumers,
    dependencies: registry.dependencies,
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: registry.versionMetadata,
    deterministicFingerprint,
  });
}
