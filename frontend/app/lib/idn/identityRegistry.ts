import type { IdentityId, NexoraIdentity } from "./identityIndex.ts";
import { validateIdentity } from "./identityIndex.ts";
import type {
  IdentityRegistryLookupResult,
  IdentityRegistryMutationResult,
} from "./identityRegistryContracts.ts";
import {
  cloneIdentityForRegistry,
  buildIdentityRegistryIndexes,
  sortIdentitiesForRegistry,
} from "./identityRegistryIndexes.ts";
import { registryIssue, registryValidationResult, validateMetadataUpdate } from "./identityRegistryValidation.ts";
import {
  IDENTITY_REGISTRY_CONTRACT_VERSION,
  type IdentityRegistry,
  type IdentityRegistryMetadataUpdate,
} from "./identityRegistryTypes.ts";

function createRegistryFromIdentities(
  registryId: string,
  identities: readonly NexoraIdentity[]
): IdentityRegistry {
  const sortedIdentities = sortIdentitiesForRegistry(identities);
  return Object.freeze({
    contractVersion: IDENTITY_REGISTRY_CONTRACT_VERSION,
    registryId,
    identities: sortedIdentities,
    indexes: buildIdentityRegistryIndexes(sortedIdentities),
  });
}

function mutationResult(
  success: boolean,
  registry: IdentityRegistry,
  identity: NexoraIdentity | null,
  issues: Parameters<typeof registryValidationResult>[0]
): IdentityRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    identity,
    validation: registryValidationResult(issues),
  });
}

export function createIdentityRegistry(registryId = "nexora.identity.registry"): IdentityRegistry {
  return createRegistryFromIdentities(registryId, []);
}

export function registerIdentity(
  registry: IdentityRegistry,
  identity: NexoraIdentity
): IdentityRegistryMutationResult {
  const identityValidation = validateIdentity(identity);
  if (!identityValidation.valid) {
    return mutationResult(
      false,
      registry,
      null,
      [registryIssue("invalid_identity", "identity", "Identity contract is invalid.")]
    );
  }

  if (registry.indexes.byId[identity.id]) {
    return mutationResult(
      false,
      registry,
      null,
      [registryIssue("duplicate_id", "id", `Identity id already registered: ${identity.id}.`)]
    );
  }

  const clonedIdentity = cloneIdentityForRegistry(identity);
  return mutationResult(
    true,
    createRegistryFromIdentities(registry.registryId, [...registry.identities, clonedIdentity]),
    clonedIdentity,
    []
  );
}

export function unregisterIdentity(
  registry: IdentityRegistry,
  identityId: IdentityId
): IdentityRegistryMutationResult {
  const identity = registry.indexes.byId[identityId] ?? null;
  if (!identity) {
    return mutationResult(
      false,
      registry,
      null,
      [registryIssue("missing_identity", "identityId", `Identity not found: ${identityId}.`)]
    );
  }

  const nextIdentities = registry.identities.filter((entry) => entry.id !== identityId);
  return mutationResult(true, createRegistryFromIdentities(registry.registryId, nextIdentities), identity, []);
}

export function updateIdentityMetadata(
  registry: IdentityRegistry,
  identityId: IdentityId,
  update: IdentityRegistryMetadataUpdate
): IdentityRegistryMutationResult {
  const existing = registry.indexes.byId[identityId] ?? null;
  if (!existing) {
    return mutationResult(
      false,
      registry,
      null,
      [registryIssue("missing_identity", "identityId", `Identity not found: ${identityId}.`)]
    );
  }

  const updateValidation = validateMetadataUpdate(update);
  if (!updateValidation.valid) {
    return mutationResult(false, registry, null, updateValidation.issues);
  }

  const nextVersion = update.version ?? existing.version + 1;
  const updatedIdentity = cloneIdentityForRegistry({
    ...existing,
    created: Object.freeze({
      ...existing.created,
      updatedAt: update.updatedAt,
      version: nextVersion,
      metadata: Object.freeze({ ...existing.created.metadata }),
      tags: Object.freeze([...existing.created.tags]),
    }),
    version: nextVersion,
    tags: Object.freeze([...(update.tags ?? existing.tags)]),
    metadata: Object.freeze({ ...(update.metadata ?? existing.metadata) }),
  } as NexoraIdentity);

  const nextIdentities = registry.identities.map((identity) =>
    identity.id === identityId ? updatedIdentity : identity
  );

  return mutationResult(
    true,
    createRegistryFromIdentities(registry.registryId, nextIdentities),
    updatedIdentity,
    []
  );
}

export function getIdentity(registry: IdentityRegistry, identityId: IdentityId): NexoraIdentity | null {
  return registry.indexes.byId[identityId] ?? null;
}

export function hasIdentity(registry: IdentityRegistry, identityId: IdentityId): boolean {
  return Boolean(getIdentity(registry, identityId));
}

export function lookupIdentity(registry: IdentityRegistry, identityId: IdentityId): IdentityRegistryLookupResult {
  const identity = getIdentity(registry, identityId);
  return Object.freeze({ found: Boolean(identity), identity });
}

export function listIdentities(registry: IdentityRegistry): readonly NexoraIdentity[] {
  return sortIdentitiesForRegistry(registry.identities);
}

export function clearRegistry(registry: IdentityRegistry): IdentityRegistry {
  return createIdentityRegistry(registry.registryId);
}
