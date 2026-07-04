import { ExecutiveTypeCRuntimeIntegrationPlatform, EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANT_IDS } from "./executiveTypeCRuntimeIntegrationContracts.ts";
import { getExecutiveTypeCRuntimeRegistry } from "./executiveTypeCRuntimeIntegrationRegistry.ts";
import type {
  ExecutiveTypeCRuntimeIntegrationPlatform as ExecutiveTypeCRuntimeIntegrationPlatformContract,
  ExecutiveTypeCRuntimeManifest,
  ExecutiveTypeCRuntimeParticipantId,
  ExecutiveTypeCRuntimeRegistry,
  ExecutiveTypeCRuntimeValidation,
} from "./executiveTypeCRuntimeIntegrationTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveTypeCRuntimeValidation {
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

function policyViolatesBoundary(policy: ExecutiveTypeCRuntimeRegistry["extensionPolicy"]): boolean {
  return (
    policy.runtimeBehaviorAllowed ||
    policy.coordinationAllowed ||
    policy.pipelineAllowed ||
    policy.dispatchAllowed ||
    policy.scheduleAllowed ||
    policy.stateChangeAllowed
  );
}

function participantSet(): ReadonlySet<ExecutiveTypeCRuntimeParticipantId> {
  return new Set(EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANT_IDS);
}

export function validateExecutiveTypeCRuntimeIntegrationPlatform(
  platform: ExecutiveTypeCRuntimeIntegrationPlatformContract = ExecutiveTypeCRuntimeIntegrationPlatform,
  registry: ExecutiveTypeCRuntimeRegistry = getExecutiveTypeCRuntimeRegistry()
): ExecutiveTypeCRuntimeValidation {
  const errors: string[] = [];
  const participants = participantSet();

  if (!platform.platformId) errors.push("missing-platform-id");
  if (!platform.metadata.metadataOnly || !platform.metadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(platform.policy)) errors.push("boundary-violation");
  if (platform.participants.length === 0) errors.push("missing-participants");
  if (platform.capabilities.length === 0) errors.push("missing-capabilities");
  if (platform.boundaries.length === 0) errors.push("missing-boundaries");
  if (platform.boundaries.some((boundary) => !boundary.metadataOnly || boundary.certifiedLayerMutationAllowed || boundary.externalTransportAllowed)) errors.push("invalid-boundary");

  for (const participant of platform.participants) {
    if (!participants.has(participant.participantId)) errors.push(`invalid-participant:${participant.participantId}`);
    if (!participant.metadata.metadataOnly || !participant.metadata.immutable) errors.push(`invalid-metadata:${participant.participantId}`);
  }

  for (const capability of platform.capabilities) {
    if (!participants.has(capability.participantId)) errors.push(`invalid-capability-participant:${capability.capabilityId}`);
    if (!capability.metadataOnly) errors.push(`invalid-capability:${capability.capabilityId}`);
  }

  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveTypeCRuntimeRegistry(registry: ExecutiveTypeCRuntimeRegistry = getExecutiveTypeCRuntimeRegistry()): ExecutiveTypeCRuntimeValidation {
  const errors: string[] = [];
  const participants = participantSet();

  errors.push(...duplicateValues(registry.participants.map((participant) => participant.participantId)).map((id) => `duplicate-participant:${id}`));
  errors.push(...duplicateValues(registry.providers.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));
  errors.push(...duplicateValues(registry.consumers.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.capabilities.map((capability) => capability.capabilityId)).map((id) => `duplicate-capability:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.participants.length === 0) errors.push("missing-participants");
  if (registry.providers.length === 0) errors.push("missing-providers");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.capabilities.length === 0) errors.push("missing-capabilities");
  if (registry.participants.some((participant) => !participants.has(participant.participantId))) errors.push("invalid-participant");
  if (registry.providers.some((provider) => !provider.metadataOnly)) errors.push("invalid-provider");
  if (registry.consumers.some((consumer) => !consumer.metadataOnly)) errors.push("invalid-consumer");
  if (registry.capabilities.some((capability) => !participants.has(capability.participantId) || !capability.metadataOnly)) errors.push("invalid-capability");
  if (registry.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.versionMetadata.metadataOnly || !registry.versionMetadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(registry.extensionPolicy)) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveTypeCRuntimeManifest(manifest: ExecutiveTypeCRuntimeManifest): ExecutiveTypeCRuntimeValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "executive-type-c-runtime-integration-platform") errors.push("invalid-manifest-platform");
  if (manifest.platformVersion !== "LAY-CONN-11") errors.push("invalid-manifest-version");
  if (manifest.supportedParticipants.length === 0) errors.push("missing-participants");
  if (manifest.supportedCapabilities.length === 0) errors.push("missing-capabilities");
  if (manifest.registeredProviders.length === 0) errors.push("missing-providers");
  if (manifest.registeredConsumers.length === 0) errors.push("missing-consumers");
  if (manifest.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (policyViolatesBoundary(manifest.extensionPolicy)) errors.push("boundary-violation");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
