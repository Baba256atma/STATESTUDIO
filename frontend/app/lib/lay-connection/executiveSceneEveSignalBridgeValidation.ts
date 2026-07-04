import { ExecutiveSceneEveSignalBridge } from "./executiveSceneEveSignalBridgeContracts.ts";
import { getExecutiveSceneEveRegistry } from "./executiveSceneEveSignalBridgeRegistry.ts";
import type {
  ExecutiveSceneEveManifest,
  ExecutiveSceneEveRegistry,
  ExecutiveSceneEveSignalBridge as ExecutiveSceneEveSignalBridgeContract,
  ExecutiveSceneEveValidation,
} from "./executiveSceneEveSignalBridgeTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveSceneEveValidation {
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

function policyViolatesBoundary(policy: ExecutiveSceneEveRegistry["extensionPolicy"]): boolean {
  return (
    policy.sceneRuntimeAllowed ||
    policy.visualRuntimeAllowed ||
    policy.signalDispatchAllowed ||
    policy.cameraControlAllowed ||
    policy.objectChangeAllowed ||
    policy.timelinePlaybackAllowed ||
    policy.stateChangeAllowed
  );
}

export function validateExecutiveSceneEveSignalBridge(
  bridge: ExecutiveSceneEveSignalBridgeContract = ExecutiveSceneEveSignalBridge,
  registry: ExecutiveSceneEveRegistry = getExecutiveSceneEveRegistry()
): ExecutiveSceneEveValidation {
  const errors: string[] = [];
  const providerIds = new Set(registry.providers.map((provider) => provider.providerId));
  const categories = new Set(registry.signalCategories);
  const signalTypes = new Set(registry.signalTypes);

  if (!bridge.bridgeId) errors.push("missing-bridge-id");
  if (!bridge.metadata.metadataOnly || !bridge.metadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(bridge.policy)) errors.push("boundary-violation");
  if (bridge.sceneSignals.length === 0) errors.push("missing-scene-signals");
  if (bridge.eveSignals.length === 0) errors.push("missing-eve-signals");
  if (bridge.references.length === 0) errors.push("missing-references");

  for (const signal of [...bridge.sceneSignals, ...bridge.eveSignals]) {
    if (!categories.has(signal.category)) errors.push(`invalid-signal-category:${signal.category}`);
    if (!signalTypes.has(signal.signalType)) errors.push(`invalid-signal-type:${signal.signalType}`);
    if (signal.references.length === 0) errors.push(`missing-signal-references:${signal.signalId}`);
    if (!signal.metadata.metadataOnly || !signal.metadata.immutable) errors.push(`invalid-metadata:${signal.signalId}`);
  }

  for (const reference of bridge.references) {
    if (!reference.referenceId || !reference.sourceId) errors.push("invalid-reference");
    if (!reference.metadata.metadataOnly || !reference.metadata.immutable) errors.push(`invalid-metadata:${reference.referenceId}`);
  }

  if (!providerIds.has("scene-provider")) errors.push("invalid-provider:scene-provider");
  if (!providerIds.has("eve-provider")) errors.push("invalid-provider:eve-provider");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveSceneEveRegistry(registry: ExecutiveSceneEveRegistry = getExecutiveSceneEveRegistry()): ExecutiveSceneEveValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.providers.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));
  errors.push(...duplicateValues(registry.consumers.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.signalTypes).map((id) => `duplicate-signal-type:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.providers.length === 0) errors.push("missing-providers");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.signalTypes.length === 0) errors.push("missing-signal-types");
  if (registry.consumers.some((consumer) => !consumer.metadataOnly)) errors.push("invalid-consumer");
  if (registry.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.versionMetadata.metadataOnly || !registry.versionMetadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(registry.extensionPolicy)) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveSceneEveManifest(manifest: ExecutiveSceneEveManifest): ExecutiveSceneEveValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "executive-scene-eve-signal-bridge") errors.push("invalid-manifest-platform");
  if (manifest.platformVersion !== "LAY-CONN-10") errors.push("invalid-manifest-version");
  if (manifest.supportedSignalCategories.length === 0) errors.push("missing-categories");
  if (manifest.supportedSignalTypes.length === 0) errors.push("missing-signal-types");
  if (manifest.registeredProviders.length === 0) errors.push("missing-providers");
  if (manifest.registeredConsumers.length === 0) errors.push("missing-consumers");
  if (manifest.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (policyViolatesBoundary(manifest.extensionPolicy)) errors.push("boundary-violation");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
