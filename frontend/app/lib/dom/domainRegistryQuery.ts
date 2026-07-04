import { listDomains } from "./domainFoundationIndex.ts";
import type { DomainCategory, DomainId, DomainRegistry, DomainStatus, RegisteredDomain } from "./domainFoundationIndex.ts";
import {
  DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION,
  type DomainQuery,
  type DomainQueryFilter,
  type DomainQueryResult,
  type DomainSortDirection,
  type DomainSortKey,
} from "./domainRegistryQueryTypes.ts";

function compareStrings(left: string, right: string): number {
  return left.localeCompare(right);
}

function compareNumbers(left: number, right: number): number {
  return left - right;
}

function sortValue(domain: RegisteredDomain, sortKey: DomainSortKey): string | number {
  switch (sortKey) {
    case "domainId":
      return domain.package.manifest.domainId;
    case "name":
      return domain.package.manifest.name;
    case "registrationOrder":
      return domain.registrationOrder;
    case "category":
      return domain.package.manifest.metadata.category;
    case "status":
      return domain.package.manifest.status;
  }
}

export function sortDomains(
  domains: readonly RegisteredDomain[],
  sortKey: DomainSortKey = "registrationOrder",
  direction: DomainSortDirection = "asc"
): readonly RegisteredDomain[] {
  const sorted = [...domains].sort((left, right) => {
    const leftValue = sortValue(left, sortKey);
    const rightValue = sortValue(right, sortKey);
    const comparison =
      typeof leftValue === "number" && typeof rightValue === "number"
        ? compareNumbers(leftValue, rightValue)
        : compareStrings(String(leftValue), String(rightValue));

    if (comparison !== 0) {
      return comparison;
    }

    return compareStrings(left.package.manifest.domainId, right.package.manifest.domainId);
  });

  if (direction === "desc") {
    sorted.reverse();
  }

  return Object.freeze(sorted);
}

function matchesFilter(domain: RegisteredDomain, filter: DomainQueryFilter): boolean {
  const manifest = domain.package.manifest;

  if (filter.domainId !== undefined && manifest.domainId !== filter.domainId) {
    return false;
  }

  if (filter.name !== undefined && manifest.name.trim().toLowerCase() !== filter.name.trim().toLowerCase()) {
    return false;
  }

  if (filter.category !== undefined && manifest.metadata.category !== filter.category) {
    return false;
  }

  if (filter.status !== undefined && manifest.status !== filter.status) {
    return false;
  }

  if (filter.capabilityId !== undefined) {
    const hasCapability = manifest.capabilities.some((capability) => capability.id === filter.capabilityId);
    if (!hasCapability) {
      return false;
    }
  }

  if (filter.dependencyDomainId !== undefined) {
    const hasDependency = manifest.dependencies.some((dependency) => dependency.domainId === filter.dependencyDomainId);
    if (!hasDependency) {
      return false;
    }
  }

  return true;
}

export function filterDomains(registry: DomainRegistry, filter: DomainQueryFilter): readonly RegisteredDomain[] {
  return Object.freeze(listDomains(registry).filter((domain) => matchesFilter(domain, filter)));
}

export function findDomainsByCategory(registry: DomainRegistry, category: DomainCategory): readonly RegisteredDomain[] {
  return filterDomains(registry, Object.freeze({ category }));
}

export function findDomainsByStatus(registry: DomainRegistry, status: DomainStatus): readonly RegisteredDomain[] {
  return filterDomains(registry, Object.freeze({ status }));
}

export function findDomainsByCapability(registry: DomainRegistry, capabilityId: string): readonly RegisteredDomain[] {
  return filterDomains(registry, Object.freeze({ capabilityId }));
}

export function findDomainsWithDependency(registry: DomainRegistry, dependencyDomainId: DomainId): readonly RegisteredDomain[] {
  return filterDomains(registry, Object.freeze({ dependencyDomainId }));
}

export function queryDomains(registry: DomainRegistry, query: DomainQuery = Object.freeze({})): DomainQueryResult {
  const filter = query.filter ?? Object.freeze({});
  const filtered = filterDomains(registry, filter);
  const domains = sortDomains(filtered, query.sortKey ?? "registrationOrder", query.sortDirection ?? "asc");

  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_QUERY_CONTRACT_VERSION,
    query,
    total: domains.length,
    domains,
    deterministic: true,
  });
}
