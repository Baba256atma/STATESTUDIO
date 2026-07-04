import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainRecommendationContractId,
  DomainRecommendationRegistry,
  DomainRecommendationScope,
  DomainRecommendationStatus,
  RegisteredDomainRecommendationPackage,
} from "./domainRecommendationIndex.ts";
import type {
  DomainRecommendationFilter,
  DomainRecommendationQuery,
  DomainRecommendationSortDirection,
  DomainRecommendationSortKey,
} from "./domainRecommendationQueryTypes.ts";

function directionMultiplier(direction: DomainRecommendationSortDirection): number {
  return direction === "desc" ? -1 : 1;
}

function comparePackages(
  left: RegisteredDomainRecommendationPackage,
  right: RegisteredDomainRecommendationPackage,
  sortKey: DomainRecommendationSortKey
): number {
  if (sortKey === "domainId") {
    const byDomain = left.package.domainId.localeCompare(right.package.domainId);
    if (byDomain !== 0) return byDomain;
    return left.package.recommendationPackageId.localeCompare(right.package.recommendationPackageId);
  }
  if (sortKey === "registrationOrder") {
    const byOrder = left.registrationOrder - right.registrationOrder;
    if (byOrder !== 0) return byOrder;
    return left.package.recommendationPackageId.localeCompare(right.package.recommendationPackageId);
  }
  return left.package.recommendationPackageId.localeCompare(right.package.recommendationPackageId);
}

function packageMatchesFilter(
  recommendationPackage: RegisteredDomainRecommendationPackage,
  filter: DomainRecommendationFilter
): boolean {
  if (filter.domainId !== undefined && recommendationPackage.package.domainId !== filter.domainId) return false;
  if (filter.scope !== undefined && recommendationPackage.package.scope !== filter.scope) return false;
  if (filter.status !== undefined && recommendationPackage.package.status !== filter.status) return false;
  if (
    filter.contractId !== undefined &&
    !recommendationPackage.package.contracts.some((contract) => contract.contractId === filter.contractId)
  ) {
    return false;
  }
  return true;
}

export function sortDomainRecommendationPackages(
  recommendationPackages: readonly RegisteredDomainRecommendationPackage[],
  sortKey: DomainRecommendationSortKey = "registrationOrder",
  direction: DomainRecommendationSortDirection = "asc"
): readonly RegisteredDomainRecommendationPackage[] {
  const multiplier = directionMultiplier(direction);
  return Object.freeze(
    [...recommendationPackages].sort((left, right) => comparePackages(left, right, sortKey) * multiplier)
  );
}

export function filterDomainRecommendationPackages(
  registry: DomainRecommendationRegistry,
  filter: DomainRecommendationFilter
): readonly RegisteredDomainRecommendationPackage[] {
  return Object.freeze(
    registry.packages.filter((recommendationPackage) => packageMatchesFilter(recommendationPackage, filter))
  );
}

export function queryDomainRecommendationPackages(
  registry: DomainRecommendationRegistry,
  query: DomainRecommendationQuery = Object.freeze({})
): readonly RegisteredDomainRecommendationPackage[] {
  const filtered = query.filter ? filterDomainRecommendationPackages(registry, query.filter) : registry.packages;
  return sortDomainRecommendationPackages(filtered, query.sortKey, query.direction);
}

export function findRecommendationPackagesByDomain(
  registry: DomainRecommendationRegistry,
  domainId: DomainId
): readonly RegisteredDomainRecommendationPackage[] {
  return queryDomainRecommendationPackages(registry, {
    filter: Object.freeze({ domainId }),
    sortKey: "registrationOrder",
  });
}

export function findRecommendationPackagesByScope(
  registry: DomainRecommendationRegistry,
  scope: DomainRecommendationScope
): readonly RegisteredDomainRecommendationPackage[] {
  return queryDomainRecommendationPackages(registry, {
    filter: Object.freeze({ scope }),
    sortKey: "registrationOrder",
  });
}

export function findRecommendationPackagesByStatus(
  registry: DomainRecommendationRegistry,
  status: DomainRecommendationStatus
): readonly RegisteredDomainRecommendationPackage[] {
  return queryDomainRecommendationPackages(registry, {
    filter: Object.freeze({ status }),
    sortKey: "registrationOrder",
  });
}

export function findRecommendationPackageContainingContract(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): RegisteredDomainRecommendationPackage | null {
  return registry.packages.find((entry) => entry.package.contracts.some((contract) => contract.contractId === contractId)) ?? null;
}
