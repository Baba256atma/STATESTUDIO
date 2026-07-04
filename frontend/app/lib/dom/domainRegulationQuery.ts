import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainJurisdictionScope,
  DomainRegulationId,
  DomainRegulationRegistry,
  DomainRegulationScope,
  DomainRegulationStatus,
  RegisteredDomainRegulationPackage,
} from "./domainRegulationIndex.ts";
import type {
  DomainRegulationFilter,
  DomainRegulationQuery,
  DomainRegulationSortDirection,
  DomainRegulationSortKey,
} from "./domainRegulationQueryTypes.ts";

function directionMultiplier(direction: DomainRegulationSortDirection): number {
  return direction === "desc" ? -1 : 1;
}

function comparePackages(
  left: RegisteredDomainRegulationPackage,
  right: RegisteredDomainRegulationPackage,
  sortKey: DomainRegulationSortKey
): number {
  if (sortKey === "domainId") {
    const byDomain = left.package.domainId.localeCompare(right.package.domainId);
    if (byDomain !== 0) return byDomain;
    return left.package.regulationPackageId.localeCompare(right.package.regulationPackageId);
  }
  if (sortKey === "registrationOrder") {
    const byOrder = left.registrationOrder - right.registrationOrder;
    if (byOrder !== 0) return byOrder;
    return left.package.regulationPackageId.localeCompare(right.package.regulationPackageId);
  }
  return left.package.regulationPackageId.localeCompare(right.package.regulationPackageId);
}

function packageMatchesFilter(
  regulationPackage: RegisteredDomainRegulationPackage,
  filter: DomainRegulationFilter
): boolean {
  if (filter.domainId !== undefined && regulationPackage.package.domainId !== filter.domainId) return false;
  if (filter.scope !== undefined && regulationPackage.package.scope !== filter.scope) return false;
  if (filter.status !== undefined && regulationPackage.package.status !== filter.status) return false;
  if (
    filter.jurisdictionScope !== undefined &&
    regulationPackage.package.jurisdictionScope !== filter.jurisdictionScope
  ) {
    return false;
  }
  if (
    filter.regulationId !== undefined &&
    !regulationPackage.package.regulations.some((regulation) => regulation.regulationId === filter.regulationId)
  ) {
    return false;
  }
  return true;
}

export function sortDomainRegulationPackages(
  regulationPackages: readonly RegisteredDomainRegulationPackage[],
  sortKey: DomainRegulationSortKey = "registrationOrder",
  direction: DomainRegulationSortDirection = "asc"
): readonly RegisteredDomainRegulationPackage[] {
  const multiplier = directionMultiplier(direction);
  return Object.freeze(
    [...regulationPackages].sort((left, right) => comparePackages(left, right, sortKey) * multiplier)
  );
}

export function filterDomainRegulationPackages(
  registry: DomainRegulationRegistry,
  filter: DomainRegulationFilter
): readonly RegisteredDomainRegulationPackage[] {
  return Object.freeze(registry.packages.filter((regulationPackage) => packageMatchesFilter(regulationPackage, filter)));
}

export function queryDomainRegulationPackages(
  registry: DomainRegulationRegistry,
  query: DomainRegulationQuery = Object.freeze({})
): readonly RegisteredDomainRegulationPackage[] {
  const filtered = query.filter ? filterDomainRegulationPackages(registry, query.filter) : registry.packages;
  return sortDomainRegulationPackages(filtered, query.sortKey, query.direction);
}

export function findRegulationPackagesByDomain(
  registry: DomainRegulationRegistry,
  domainId: DomainId
): readonly RegisteredDomainRegulationPackage[] {
  return queryDomainRegulationPackages(registry, {
    filter: Object.freeze({ domainId }),
    sortKey: "registrationOrder",
  });
}

export function findRegulationPackagesByScope(
  registry: DomainRegulationRegistry,
  scope: DomainRegulationScope
): readonly RegisteredDomainRegulationPackage[] {
  return queryDomainRegulationPackages(registry, {
    filter: Object.freeze({ scope }),
    sortKey: "registrationOrder",
  });
}

export function findRegulationPackagesByStatus(
  registry: DomainRegulationRegistry,
  status: DomainRegulationStatus
): readonly RegisteredDomainRegulationPackage[] {
  return queryDomainRegulationPackages(registry, {
    filter: Object.freeze({ status }),
    sortKey: "registrationOrder",
  });
}

export function findRegulationPackagesByJurisdictionScope(
  registry: DomainRegulationRegistry,
  jurisdictionScope: DomainJurisdictionScope
): readonly RegisteredDomainRegulationPackage[] {
  return queryDomainRegulationPackages(registry, {
    filter: Object.freeze({ jurisdictionScope }),
    sortKey: "registrationOrder",
  });
}

export function findRegulationPackageContainingRegulation(
  registry: DomainRegulationRegistry,
  regulationId: DomainRegulationId
): RegisteredDomainRegulationPackage | null {
  return (
    registry.packages.find((entry) =>
      entry.package.regulations.some((regulation) => regulation.regulationId === regulationId)
    ) ?? null
  );
}
