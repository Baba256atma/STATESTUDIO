import { ExecutiveAwarenessContextAggregator } from "./executiveAwarenessContextAggregatorContracts.ts";
import { getExecutiveAwarenessContextRegistry } from "./executiveAwarenessContextAggregatorRegistry.ts";
import type {
  ExecutiveAwarenessContextAggregator as ExecutiveAwarenessContextAggregatorContract,
  ExecutiveContextManifest,
  ExecutiveContextRegistry,
  ExecutiveContextValidation,
} from "./executiveAwarenessContextAggregatorTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveContextValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

export function validateExecutiveAwarenessContextAggregator(
  aggregator: ExecutiveAwarenessContextAggregatorContract = ExecutiveAwarenessContextAggregator,
  registry: ExecutiveContextRegistry = getExecutiveAwarenessContextRegistry()
): ExecutiveContextValidation {
  const errors: string[] = [];
  const providerSources = new Set(registry.providers.map((provider) => provider.source));
  const categories = new Set(registry.categories);
  const contextTypes = new Set(registry.contextTypes);

  if (!aggregator.aggregatorId) errors.push("missing-aggregator-id");
  if (!aggregator.metadata.metadataOnly || !aggregator.metadata.immutable) errors.push("boundary-violation");
  if (aggregator.policy.executionAllowed || aggregator.policy.stateMutationAllowed || aggregator.policy.derivedContextAllowed) errors.push("policy-boundary-violation");

  for (const entry of aggregator.context.entries) {
    if (!providerSources.has(entry.source)) errors.push(`invalid-context-provider:${entry.source}`);
    if (!categories.has(entry.category)) errors.push(`invalid-context-category:${entry.category}`);
    if (!contextTypes.has(entry.contextType)) errors.push(`invalid-context-type:${entry.contextType}`);
    if (!entry.metadata.metadataOnly || !entry.metadata.immutable) errors.push(`invalid-metadata:${entry.entryId}`);
  }

  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveAwarenessContextRegistry(
  registry: ExecutiveContextRegistry = getExecutiveAwarenessContextRegistry()
): ExecutiveContextValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.providers.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));
  errors.push(...duplicateValues(registry.consumers.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.contextTypes).map((id) => `duplicate-context-type:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.providers.length === 0) errors.push("missing-context-providers");
  if (registry.consumers.length === 0) errors.push("missing-context-consumers");
  if (registry.consumers.some((consumer) => !consumer.metadataOnly)) errors.push("invalid-context-consumer");
  if (registry.contextTypes.length === 0) errors.push("missing-context-types");
  if (registry.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.versionMetadata.metadataOnly || !registry.versionMetadata.immutable) errors.push("invalid-metadata");
  if (registry.extensionPolicy.executionAllowed || registry.extensionPolicy.stateMutationAllowed || registry.extensionPolicy.derivedContextAllowed) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveAwarenessContextManifest(manifest: ExecutiveContextManifest): ExecutiveContextValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "nexora-executive-awareness-context-aggregator") errors.push("invalid-manifest-platform");
  if (manifest.aggregatorId !== "executive-awareness-context-aggregator") errors.push("invalid-manifest-aggregator");
  if (manifest.version !== "LAY-CONN-5") errors.push("invalid-manifest-version");
  if (manifest.supportedContextTypes.length === 0) errors.push("missing-context-types");
  if (manifest.supportedProviders.length === 0) errors.push("missing-context-providers");
  if (manifest.supportedConsumers.length === 0) errors.push("missing-context-consumers");
  if (manifest.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (manifest.extensionPolicy.executionAllowed || manifest.extensionPolicy.stateMutationAllowed || manifest.extensionPolicy.derivedContextAllowed) errors.push("boundary-violation");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
