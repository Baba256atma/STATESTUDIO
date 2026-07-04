import { getExecutiveConnectionCompatibilityMatrix } from "./executiveLayerConnectionCompatibility.ts";
import { getExecutiveConnectionRegistry } from "./executiveLayerConnectionRegistry.ts";
import type {
  ExecutiveConnectionManifest,
  ExecutiveConnectionRegistry,
  ExecutiveConnectionValidation,
  ExecutiveLayerConnectionContract,
} from "./executiveLayerConnectionTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveConnectionValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function duplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicateValues = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      duplicateValues.add(value);
    }
    seen.add(value);
  }
  return Object.freeze([...duplicateValues].sort());
}

export function validateExecutiveLayerConnection(
  contract: ExecutiveLayerConnectionContract,
  registry: ExecutiveConnectionRegistry = getExecutiveConnectionRegistry()
): ExecutiveConnectionValidation {
  const errors: string[] = [];
  const providerIds = new Set(registry.providers.map((provider) => provider.providerId));
  const consumerIds = new Set(registry.consumers.map((consumer) => consumer.consumerId));
  const directionSet = new Set(registry.directions);
  const categorySet = new Set(registry.categories);
  const capabilityIds = new Set(registry.capabilities.map((capability) => capability.capabilityId));
  const dependencyIds = new Set(registry.dependencies.map((dependency) => dependency.dependencyId));

  if (!contract.identity.connectionId) errors.push("missing-connection-id");
  if (!providerIds.has(contract.providerId)) errors.push(`invalid-provider:${contract.providerId}`);
  if (!consumerIds.has(contract.consumerId)) errors.push(`invalid-consumer:${contract.consumerId}`);
  if (!directionSet.has(contract.direction)) errors.push(`invalid-direction:${contract.direction}`);
  if (!categorySet.has(contract.identity.category)) errors.push(`invalid-category:${contract.identity.category}`);
  for (const capability of contract.capabilities) {
    if (!capabilityIds.has(capability)) errors.push(`unsupported-capability:${capability}`);
  }
  for (const dependency of contract.dependencies) {
    if (!dependencyIds.has(dependency)) errors.push(`missing-dependency:${dependency}`);
  }
  if (!contract.boundary.metadataOnly || contract.boundary.allowsRuntime || contract.boundary.allowsNetwork || contract.boundary.allowsUi) {
    errors.push("boundary-violation");
  }
  if (!contract.payload.metadataOnly) errors.push("payload-boundary-violation");
  if (contract.permissions.some((permission) => permission.grantsRuntimeAccess || permission.grantsMutationAccess)) {
    errors.push("permission-boundary-violation");
  }

  return validation(errors);
}

export function validateExecutiveConnectionRegistry(
  registry: ExecutiveConnectionRegistry = getExecutiveConnectionRegistry()
): ExecutiveConnectionValidation {
  const errors: string[] = [];
  const duplicateConnectionIds = duplicates(registry.contracts.map((contract) => contract.identity.connectionId));
  const duplicateProviderIds = duplicates(registry.providers.map((provider) => provider.providerId));
  const duplicateConsumerIds = duplicates(registry.consumers.map((consumer) => consumer.consumerId));
  const duplicateCapabilityIds = duplicates(registry.capabilities.map((capability) => capability.capabilityId));

  errors.push(...duplicateConnectionIds.map((id) => `duplicate-connection-id:${id}`));
  errors.push(...duplicateProviderIds.map((id) => `duplicate-provider-id:${id}`));
  errors.push(...duplicateConsumerIds.map((id) => `duplicate-consumer-id:${id}`));
  errors.push(...duplicateCapabilityIds.map((id) => `duplicate-capability-id:${id}`));

  for (const contract of registry.contracts) {
    errors.push(...validateExecutiveLayerConnection(contract, registry).errors);
  }

  if (registry.version.contractVersion !== "LAY-CONN-1") errors.push("invalid-version-metadata");
  if (registry.extensionPolicy.runtimeBehaviorAllowed) errors.push("runtime-policy-violation");

  return validation(errors);
}

export function validateExecutiveConnectionManifest(manifest: ExecutiveConnectionManifest): ExecutiveConnectionValidation {
  const errors: string[] = [];
  const compatibility = getExecutiveConnectionCompatibilityMatrix();

  if (manifest.platformId !== "nexora-executive-layer-connection-contracts") errors.push("invalid-manifest-platform");
  if (manifest.platformVersion !== "LAY-CONN-1") errors.push("invalid-manifest-version");
  if (manifest.supportedCategories.length === 0) errors.push("missing-manifest-categories");
  if (manifest.supportedDirections.length === 0) errors.push("missing-manifest-directions");
  if (manifest.registeredProviders.length === 0) errors.push("missing-manifest-providers");
  if (manifest.registeredConsumers.length === 0) errors.push("missing-manifest-consumers");
  if (manifest.registryFingerprint.length === 0) errors.push("missing-manifest-fingerprint");
  if (manifest.extensionPolicy.runtimeBehaviorAllowed) errors.push("manifest-policy-violation");
  if (manifest.compatibility.length !== compatibility.length) errors.push("compatibility-violation");
  if (manifest.compatibility.some((entry) => !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}
