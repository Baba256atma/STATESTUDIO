import {
  IDENTITY_LIFECYCLE_STATES,
  IDENTITY_SOURCES,
  IDENTITY_TYPES,
  type IdentityLifecycleState,
  type IdentitySource,
  type IdentityType,
} from "./identityIndex.ts";
import type { IdentityRegistryStatistics } from "./identityRegistryContracts.ts";
import type { IdentityRegistry } from "./identityRegistryTypes.ts";

function zeroTypeCounts(): Record<IdentityType, number> {
  return Object.fromEntries(IDENTITY_TYPES.map((type) => [type, 0])) as Record<IdentityType, number>;
}

function zeroLifecycleCounts(): Record<IdentityLifecycleState, number> {
  return Object.fromEntries(IDENTITY_LIFECYCLE_STATES.map((state) => [state, 0])) as Record<
    IdentityLifecycleState,
    number
  >;
}

function zeroSourceCounts(): Record<IdentitySource, number> {
  return Object.fromEntries(IDENTITY_SOURCES.map((source) => [source, 0])) as Record<IdentitySource, number>;
}

export function getRegistryStatistics(registry: IdentityRegistry): IdentityRegistryStatistics {
  const identitiesByType = zeroTypeCounts();
  const identitiesByLifecycle = zeroLifecycleCounts();
  const identitiesBySource = zeroSourceCounts();

  registry.identities.forEach((identity) => {
    identitiesByType[identity.type] += 1;
    identitiesByLifecycle[identity.lifecycle] += 1;
    identitiesBySource[identity.created.source] += 1;
  });

  return Object.freeze({
    totalIdentities: registry.identities.length,
    identitiesByType: Object.freeze(identitiesByType),
    identitiesByLifecycle: Object.freeze(identitiesByLifecycle),
    activeIdentities: identitiesByLifecycle.Active,
    archivedIdentities: identitiesByLifecycle.Archived,
    deletedIdentities: identitiesByLifecycle.Deleted,
    identitiesBySource: Object.freeze(identitiesBySource),
    tagCount: Object.keys(registry.indexes.byTag).length,
  });
}
