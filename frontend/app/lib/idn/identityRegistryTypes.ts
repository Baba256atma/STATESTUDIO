import type {
  IdentityId,
  IdentityLifecycleState,
  IdentitySource,
  IdentityType,
  NexoraIdentity,
} from "./identityIndex.ts";

export const IDENTITY_REGISTRY_CONTRACT_VERSION = "IDN-2" as const;

export type IdentityRegistryIndexBucket = Readonly<Record<string, readonly IdentityId[]>>;

export type IdentityRegistryIndexes = Readonly<{
  byId: Readonly<Record<IdentityId, NexoraIdentity>>;
  byType: IdentityRegistryIndexBucket;
  byLifecycle: IdentityRegistryIndexBucket;
  bySource: IdentityRegistryIndexBucket;
  byTag: IdentityRegistryIndexBucket;
}>;

export type IdentityRegistry = Readonly<{
  contractVersion: typeof IDENTITY_REGISTRY_CONTRACT_VERSION;
  registryId: string;
  identities: readonly NexoraIdentity[];
  indexes: IdentityRegistryIndexes;
}>;

export type IdentityRegistryQuery = Readonly<{
  type?: IdentityType;
  lifecycle?: IdentityLifecycleState;
  source?: IdentitySource;
  tag?: string;
  predicate?: (identity: NexoraIdentity) => boolean;
}>;

export type IdentityRegistryMetadataUpdate = Readonly<{
  metadata?: NexoraIdentity["metadata"];
  tags?: readonly string[];
  updatedAt: string;
  version?: number;
}>;
