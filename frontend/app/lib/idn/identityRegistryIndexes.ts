import type { IdentityId, NexoraIdentity } from "./identityIndex.ts";
import type { IdentityRegistryIndexes } from "./identityRegistryTypes.ts";

function sortedIds(ids: Iterable<IdentityId>): readonly IdentityId[] {
  return Object.freeze([...ids].sort((left, right) => left.localeCompare(right)));
}

function freezeBucket(entries: Map<string, Set<IdentityId>>): Readonly<Record<string, readonly IdentityId[]>> {
  const bucket: Record<string, readonly IdentityId[]> = {};
  [...entries.keys()]
    .sort((left, right) => left.localeCompare(right))
    .forEach((key) => {
      bucket[key] = sortedIds(entries.get(key) ?? []);
    });
  return Object.freeze(bucket);
}

function addToBucket(bucket: Map<string, Set<IdentityId>>, key: string, identityId: IdentityId): void {
  const existing = bucket.get(key) ?? new Set<IdentityId>();
  existing.add(identityId);
  bucket.set(key, existing);
}

export function cloneIdentityForRegistry(identity: NexoraIdentity): NexoraIdentity {
  return Object.freeze({
    ...identity,
    created: Object.freeze({
      ...identity.created,
      tags: Object.freeze([...identity.created.tags]),
      metadata: Object.freeze({ ...identity.created.metadata }),
    }),
    tags: Object.freeze([...identity.tags]),
    metadata: Object.freeze({ ...identity.metadata }),
  } as NexoraIdentity);
}

export function sortIdentitiesForRegistry(identities: readonly NexoraIdentity[]): readonly NexoraIdentity[] {
  return Object.freeze(
    [...identities]
      .map(cloneIdentityForRegistry)
      .sort((left, right) => left.id.localeCompare(right.id))
  );
}

export function buildIdentityRegistryIndexes(
  identities: readonly NexoraIdentity[]
): IdentityRegistryIndexes {
  const byId: Record<IdentityId, NexoraIdentity> = {};
  const byType = new Map<string, Set<IdentityId>>();
  const byLifecycle = new Map<string, Set<IdentityId>>();
  const bySource = new Map<string, Set<IdentityId>>();
  const byTag = new Map<string, Set<IdentityId>>();

  sortIdentitiesForRegistry(identities).forEach((identity) => {
    byId[identity.id] = identity;
    addToBucket(byType, identity.type, identity.id);
    addToBucket(byLifecycle, identity.lifecycle, identity.id);
    addToBucket(bySource, identity.created.source, identity.id);
    identity.tags.forEach((tag) => addToBucket(byTag, tag, identity.id));
    identity.created.tags.forEach((tag) => addToBucket(byTag, tag, identity.id));
  });

  return Object.freeze({
    byId: Object.freeze(byId),
    byType: freezeBucket(byType),
    byLifecycle: freezeBucket(byLifecycle),
    bySource: freezeBucket(bySource),
    byTag: freezeBucket(byTag),
  });
}

export function getIndexedIdentities(
  indexes: IdentityRegistryIndexes,
  ids: readonly IdentityId[]
): readonly NexoraIdentity[] {
  return Object.freeze(ids.flatMap((id) => indexes.byId[id] ?? []));
}
