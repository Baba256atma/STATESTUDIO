export {
  DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION,
} from "./domainRegistryQueryTypes.ts";
export type {
  DomainQuery,
  DomainQueryFilter,
  DomainQueryResult,
  DomainRegistrySnapshot,
  DomainRegistrySnapshotComparison,
  DomainRegistrySnapshotMetadata,
  DomainRegistrySnapshotValidationResult,
  DomainSnapshotEntry,
  DomainSortDirection,
  DomainSortKey,
} from "./domainRegistryQueryTypes.ts";
export {
  filterDomains,
  findDomainsByCapability,
  findDomainsByCategory,
  findDomainsByStatus,
  findDomainsWithDependency,
  queryDomains,
  sortDomains,
} from "./domainRegistryQuery.ts";
export {
  buildDomainRegistrySnapshot,
  compareDomainRegistrySnapshots,
  validateDomainRegistrySnapshot,
  validateSnapshotAgainstRegistry,
} from "./domainRegistrySnapshot.ts";

import {
  filterDomains,
  findDomainsByCapability,
  findDomainsByCategory,
  findDomainsByStatus,
  findDomainsWithDependency,
  queryDomains,
  sortDomains,
} from "./domainRegistryQuery.ts";
import {
  buildDomainRegistrySnapshot,
  compareDomainRegistrySnapshots,
  validateDomainRegistrySnapshot,
  validateSnapshotAgainstRegistry,
} from "./domainRegistrySnapshot.ts";

export const DomainRegistryQuery = Object.freeze({
  queryDomains,
  filterDomains,
  sortDomains,
  findDomainsByCategory,
  findDomainsByStatus,
  findDomainsByCapability,
  findDomainsWithDependency,
  buildDomainRegistrySnapshot,
  validateDomainRegistrySnapshot,
  compareDomainRegistrySnapshots,
  validateSnapshotAgainstRegistry,
});

export const DOMAIN_REGISTRY_QUERY_PUBLIC_APIS = Object.freeze([
  "DomainRegistryQuery",
  "queryDomains",
  "filterDomains",
  "sortDomains",
  "findDomainsByCategory",
  "findDomainsByStatus",
  "findDomainsByCapability",
  "findDomainsWithDependency",
  "buildDomainRegistrySnapshot",
  "validateDomainRegistrySnapshot",
  "compareDomainRegistrySnapshots",
  "validateSnapshotAgainstRegistry",
] as const);
