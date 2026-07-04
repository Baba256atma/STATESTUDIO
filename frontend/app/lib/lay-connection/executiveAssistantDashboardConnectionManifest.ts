import { EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_VERSION } from "./executiveAssistantDashboardConnectionContracts.ts";
import { getExecutiveAssistantDashboardRegistry } from "./executiveAssistantDashboardConnectionRegistry.ts";
import type { ExecutiveAssistantDashboardManifest } from "./executiveAssistantDashboardConnectionTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-9-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveAssistantDashboardManifest(): ExecutiveAssistantDashboardManifest {
  const registry = getExecutiveAssistantDashboardRegistry();
  const deterministicFingerprint = fingerprint([
    registry.apiId,
    ...registry.categories,
    ...registry.apiTypes,
    ...registry.providers.map((provider) => `${provider.providerId}:${provider.certified}:${provider.futureCompatible}`).sort(),
    ...registry.consumers.map((consumer) => consumer.consumerId).sort(),
    ...registry.dependencies.map((dependency) => `${dependency.dependencyId}:${dependency.required}:${dependency.mode}`).sort(),
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.apiId,
    platformVersion: EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_VERSION,
    supportedCategories: registry.categories,
    supportedApiTypes: registry.apiTypes,
    registeredProviders: registry.providers,
    registeredConsumers: registry.consumers,
    dependencies: registry.dependencies,
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: registry.versionMetadata,
    deterministicFingerprint,
  });
}
