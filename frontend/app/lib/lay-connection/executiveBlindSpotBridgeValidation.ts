import { ExecutiveBlindSpotBridge } from "./executiveBlindSpotBridgeContracts.ts";
import { getExecutiveBlindSpotRegistry } from "./executiveBlindSpotBridgeRegistry.ts";
import type {
  ExecutiveBlindSpotBridge as ExecutiveBlindSpotBridgeContract,
  ExecutiveBlindSpotManifest,
  ExecutiveBlindSpotRegistry,
  ExecutiveBlindSpotValidation,
} from "./executiveBlindSpotBridgeTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveBlindSpotValidation {
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

function policyViolatesBoundary(policy: ExecutiveBlindSpotRegistry["extensionPolicy"]): boolean {
  return (
    policy.derivationAllowed ||
    policy.assessmentAllowed ||
    policy.orderingAllowed ||
    policy.forecastingAllowed ||
    policy.distributionAllowed ||
    policy.pathSelectionAllowed ||
    policy.stateMutationAllowed
  );
}

export function validateExecutiveBlindSpotBridge(
  bridge: ExecutiveBlindSpotBridgeContract = ExecutiveBlindSpotBridge,
  registry: ExecutiveBlindSpotRegistry = getExecutiveBlindSpotRegistry()
): ExecutiveBlindSpotValidation {
  const errors: string[] = [];
  const providerIds = new Set(registry.providers.map((provider) => provider.providerId));
  const categories = new Set(registry.categories);
  const blindSpotTypes = new Set(registry.blindSpotTypes);

  if (!bridge.bridgeId) errors.push("missing-bridge-id");
  if (!bridge.metadata.metadataOnly || !bridge.metadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(bridge.policy)) errors.push("boundary-violation");
  if (bridge.candidates.length === 0) errors.push("missing-candidates");
  if (bridge.evidence.length === 0) errors.push("missing-evidence");
  if (bridge.assumptions.length === 0) errors.push("missing-assumptions");
  if (bridge.constraints.length === 0) errors.push("missing-constraints");

  for (const entry of bridge.candidates) {
    if (!categories.has(entry.identity.category)) errors.push(`invalid-blind-spot-category:${entry.identity.category}`);
    if (!blindSpotTypes.has(entry.identity.blindSpotType)) errors.push(`invalid-blind-spot-type:${entry.identity.blindSpotType}`);
    if (!entry.metadata.metadataOnly || !entry.metadata.immutable) errors.push(`invalid-metadata:${entry.candidateId}`);
  }

  for (const reference of bridge.recommendationReferences) {
    if (!reference) errors.push("invalid-recommendation-reference");
  }
  for (const reference of bridge.explanationReferences) {
    if (!reference) errors.push("invalid-explanation-reference");
  }
  for (const reference of bridge.awarenessReferences) {
    if (!reference) errors.push("invalid-awareness-reference");
  }
  if (!providerIds.has("awareness-context-provider")) errors.push("invalid-provider:awareness-context-provider");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveBlindSpotRegistry(
  registry: ExecutiveBlindSpotRegistry = getExecutiveBlindSpotRegistry()
): ExecutiveBlindSpotValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.providers.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));
  errors.push(...duplicateValues(registry.consumers.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.blindSpotTypes).map((id) => `duplicate-blind-spot-type:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.providers.length === 0) errors.push("missing-providers");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.blindSpotTypes.length === 0) errors.push("missing-blind-spot-types");
  if (registry.consumers.some((consumer) => !consumer.metadataOnly)) errors.push("invalid-consumer");
  if (registry.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.versionMetadata.metadataOnly || !registry.versionMetadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(registry.extensionPolicy)) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveBlindSpotManifest(manifest: ExecutiveBlindSpotManifest): ExecutiveBlindSpotValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "executive-blind-spot-bridge") errors.push("invalid-manifest-platform");
  if (manifest.platformVersion !== "LAY-CONN-8") errors.push("invalid-manifest-version");
  if (manifest.supportedBlindSpotCategories.length === 0) errors.push("missing-categories");
  if (manifest.supportedBlindSpotTypes.length === 0) errors.push("missing-blind-spot-types");
  if (manifest.registeredProviders.length === 0) errors.push("missing-providers");
  if (manifest.registeredConsumers.length === 0) errors.push("missing-consumers");
  if (manifest.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (policyViolatesBoundary(manifest.extensionPolicy)) errors.push("boundary-violation");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
