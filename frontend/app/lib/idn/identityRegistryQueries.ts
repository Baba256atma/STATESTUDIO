import type { NexoraIdentity } from "./identityIndex.ts";
import { getIndexedIdentities, sortIdentitiesForRegistry } from "./identityRegistryIndexes.ts";
import type { IdentityRegistry, IdentityRegistryQuery } from "./identityRegistryTypes.ts";

function intersectIdentities(
  left: readonly NexoraIdentity[],
  right: readonly NexoraIdentity[]
): readonly NexoraIdentity[] {
  const rightIds = new Set(right.map((identity) => identity.id));
  return Object.freeze(left.filter((identity) => rightIds.has(identity.id)));
}

export function queryIdentities(
  registry: IdentityRegistry,
  query: IdentityRegistryQuery
): readonly NexoraIdentity[] {
  let results = sortIdentitiesForRegistry(registry.identities);

  if (query.type) {
    results = intersectIdentities(results, getIndexedIdentities(registry.indexes, registry.indexes.byType[query.type] ?? []));
  }
  if (query.lifecycle) {
    results = intersectIdentities(
      results,
      getIndexedIdentities(registry.indexes, registry.indexes.byLifecycle[query.lifecycle] ?? [])
    );
  }
  if (query.source) {
    results = intersectIdentities(
      results,
      getIndexedIdentities(registry.indexes, registry.indexes.bySource[query.source] ?? [])
    );
  }
  if (query.tag) {
    results = intersectIdentities(results, getIndexedIdentities(registry.indexes, registry.indexes.byTag[query.tag] ?? []));
  }
  if (query.predicate) {
    results = Object.freeze(results.filter(query.predicate));
  }

  return sortIdentitiesForRegistry(results);
}
