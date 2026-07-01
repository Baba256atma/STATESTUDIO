import type { IdentityRegistrySnapshot } from "./identityRegistryContracts.ts";
import { buildIdentityRegistryIndexes, sortIdentitiesForRegistry } from "./identityRegistryIndexes.ts";
import { getRegistryStatistics } from "./identityRegistryStatistics.ts";
import type { IdentityRegistry } from "./identityRegistryTypes.ts";

export function createIdentityRegistrySnapshot(registry: IdentityRegistry): IdentityRegistrySnapshot {
  const identities = sortIdentitiesForRegistry(registry.identities);
  const snapshotRegistry: IdentityRegistry = Object.freeze({
    ...registry,
    identities,
    indexes: buildIdentityRegistryIndexes(identities),
  });

  return Object.freeze({
    contractVersion: snapshotRegistry.contractVersion,
    registryId: snapshotRegistry.registryId,
    totalIdentities: identities.length,
    identities,
    indexes: snapshotRegistry.indexes,
    statistics: getRegistryStatistics(snapshotRegistry),
  });
}

export function exportRegistrySnapshot(registry: IdentityRegistry): IdentityRegistrySnapshot {
  return createIdentityRegistrySnapshot(registry);
}
