import type { DomainCategory, DomainId, DomainStatus } from "./domainFoundationIndex.ts";
import type { RegisteredDomain } from "./domainFoundationIndex.ts";

export const DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION = "DOM-1:2" as const;

export type DomainSortKey = "domainId" | "name" | "registrationOrder" | "category" | "status";

export type DomainSortDirection = "asc" | "desc";

export type DomainQueryFilter = Readonly<{
  category?: DomainCategory;
  status?: DomainStatus;
  capabilityId?: string;
  dependencyDomainId?: DomainId;
  domainId?: DomainId;
  name?: string;
}>;

export type DomainQuery = Readonly<{
  filter?: DomainQueryFilter;
  sortKey?: DomainSortKey;
  sortDirection?: DomainSortDirection;
}>;

export type DomainQueryResult = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION;
  query: DomainQuery;
  total: number;
  domains: readonly RegisteredDomain[];
  deterministic: true;
}>;

export type DomainSnapshotEntry = Readonly<{
  domainId: DomainId;
  name: string;
  category: DomainCategory;
  status: DomainStatus;
  registrationOrder: number;
  versionMajor: number;
  versionMinor: number;
  versionPatch: number;
  capabilityIds: readonly string[];
  dependencyIds: readonly DomainId[];
}>;

export type DomainRegistrySnapshotMetadata = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  domainCount: number;
  snapshotSequence: 1;
  deterministic: true;
}>;

export type DomainRegistrySnapshot = Readonly<{
  metadata: DomainRegistrySnapshotMetadata;
  entries: readonly DomainSnapshotEntry[];
  fingerprint: string;
}>;

export type DomainRegistrySnapshotValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type DomainRegistrySnapshotComparison = Readonly<{
  equal: boolean;
  metadataEqual: boolean;
  entriesEqual: boolean;
  fingerprintEqual: boolean;
}>;
