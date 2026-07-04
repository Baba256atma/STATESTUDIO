import { ExecutivePrioritySignalPlatform } from "./executivePrioritySignalContracts.ts";
import { getExecutivePrioritySignalRegistry } from "./executivePrioritySignalRegistry.ts";
import type {
  ExecutivePrioritySignalManifest,
  ExecutivePrioritySignalPlatform as ExecutivePrioritySignalPlatformContract,
  ExecutivePrioritySignalRegistry,
  ExecutivePrioritySignalValidation,
} from "./executivePrioritySignalTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutivePrioritySignalValidation {
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

function policyViolatesBoundary(policy: ExecutivePrioritySignalRegistry["extensionPolicy"]): boolean {
  return (
    policy.derivationAllowed ||
    policy.confidenceAssignmentAllowed ||
    policy.orderingAllowed ||
    policy.timeAssignmentAllowed ||
    policy.adjustmentAllowed ||
    policy.finalizationAllowed ||
    policy.distributionAllowed ||
    policy.pathSelectionAllowed ||
    policy.selectionAllowed ||
    policy.stateMutationAllowed
  );
}

export function validateExecutivePrioritySignalPlatform(
  platform: ExecutivePrioritySignalPlatformContract = ExecutivePrioritySignalPlatform,
  registry: ExecutivePrioritySignalRegistry = getExecutivePrioritySignalRegistry()
): ExecutivePrioritySignalValidation {
  const errors: string[] = [];
  const providerIds = new Set(registry.providers.map((provider) => provider.providerId));
  const consumerIds = new Set(registry.consumers.map((consumer) => consumer.consumerId));
  const categories = new Set(registry.categories);
  const priorityTypes = new Set(registry.priorityTypes);

  if (!platform.platformId) errors.push("missing-platform-id");
  if (!platform.metadata.metadataOnly || !platform.metadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(platform.policy)) errors.push("boundary-violation");

  for (const signal of platform.signals) {
    if (!providerIds.has(signal.sourceId)) errors.push(`invalid-provider:${signal.sourceId}`);
    if (!consumerIds.has(signal.targetId)) errors.push(`invalid-consumer:${signal.targetId}`);
    if (!categories.has(signal.identity.category)) errors.push(`invalid-category:${signal.identity.category}`);
    if (!priorityTypes.has(signal.identity.priorityType)) errors.push(`invalid-priority-type:${signal.identity.priorityType}`);
    if (!signal.metadata.metadataOnly || !signal.metadata.immutable) errors.push(`invalid-metadata:${signal.identity.signalId}`);
  }

  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutivePrioritySignalRegistry(
  registry: ExecutivePrioritySignalRegistry = getExecutivePrioritySignalRegistry()
): ExecutivePrioritySignalValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.providers.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));
  errors.push(...duplicateValues(registry.consumers.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.priorityTypes).map((id) => `duplicate-priority-type:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.providers.length === 0) errors.push("missing-providers");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.priorityTypes.length === 0) errors.push("missing-priority-types");
  if (registry.consumers.some((consumer) => !consumer.metadataOnly)) errors.push("invalid-consumer");
  if (registry.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.versionMetadata.metadataOnly || !registry.versionMetadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(registry.extensionPolicy)) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutivePrioritySignalManifest(manifest: ExecutivePrioritySignalManifest): ExecutivePrioritySignalValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "executive-priority-signal-platform") errors.push("invalid-manifest-platform");
  if (manifest.platformVersion !== "LAY-CONN-7") errors.push("invalid-manifest-version");
  if (manifest.supportedPriorityCategories.length === 0) errors.push("missing-categories");
  if (manifest.supportedPriorityTypes.length === 0) errors.push("missing-priority-types");
  if (manifest.registeredProviders.length === 0) errors.push("missing-providers");
  if (manifest.registeredConsumers.length === 0) errors.push("missing-consumers");
  if (manifest.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (policyViolatesBoundary(manifest.extensionPolicy)) errors.push("boundary-violation");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
