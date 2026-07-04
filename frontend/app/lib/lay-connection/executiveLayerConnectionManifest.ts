import { getExecutiveConnectionCompatibilityMatrix } from "./executiveLayerConnectionCompatibility.ts";
import { getExecutiveConnectionRegistry } from "./executiveLayerConnectionRegistry.ts";
import type { ExecutiveConnectionManifest } from "./executiveLayerConnectionTypes.ts";

function deterministicFingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveConnectionManifest(): ExecutiveConnectionManifest {
  const registry = getExecutiveConnectionRegistry();
  const compatibility = getExecutiveConnectionCompatibilityMatrix();
  const registryFingerprint = deterministicFingerprint([
    registry.version.contractVersion,
    ...registry.contracts.map((contract) => contract.identity.connectionId).sort(),
    ...registry.categories,
    ...registry.directions,
    ...registry.providers.map((provider) => provider.providerId).sort(),
    ...registry.consumers.map((consumer) => consumer.consumerId).sort(),
    ...compatibility.map((entry) => `${entry.layerId}:${entry.mode}:${entry.compatible}`).sort(),
  ]);

  return Object.freeze({
    platformId: "nexora-executive-layer-connection-contracts",
    platformName: "Executive Layer Connection Contract Platform",
    platformVersion: "LAY-CONN-1",
    supportedCategories: registry.categories,
    supportedDirections: registry.directions,
    registeredProviders: registry.providers,
    registeredConsumers: registry.consumers,
    compatibility,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: registry.releaseMetadata,
    registryFingerprint,
  });
}
