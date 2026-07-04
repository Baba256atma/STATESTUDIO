import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainKpiId,
  DomainKpiRegistry,
  DomainKpiScope,
  DomainKpiStatus,
  RegisteredDomainKpiPackage,
} from "./domainKpiIndex.ts";
import type {
  DomainKpiFilter,
  DomainKpiQuery,
  DomainKpiSortDirection,
  DomainKpiSortKey,
} from "./domainKpiQueryTypes.ts";

function directionMultiplier(direction: DomainKpiSortDirection): number {
  return direction === "desc" ? -1 : 1;
}

function comparePackages(
  left: RegisteredDomainKpiPackage,
  right: RegisteredDomainKpiPackage,
  sortKey: DomainKpiSortKey
): number {
  if (sortKey === "domainId") {
    const byDomain = left.package.domainId.localeCompare(right.package.domainId);
    if (byDomain !== 0) return byDomain;
    return left.package.kpiPackageId.localeCompare(right.package.kpiPackageId);
  }
  if (sortKey === "registrationOrder") {
    const byOrder = left.registrationOrder - right.registrationOrder;
    if (byOrder !== 0) return byOrder;
    return left.package.kpiPackageId.localeCompare(right.package.kpiPackageId);
  }
  return left.package.kpiPackageId.localeCompare(right.package.kpiPackageId);
}

function packageMatchesFilter(kpiPackage: RegisteredDomainKpiPackage, filter: DomainKpiFilter): boolean {
  if (filter.domainId !== undefined && kpiPackage.package.domainId !== filter.domainId) return false;
  if (filter.scope !== undefined && kpiPackage.package.scope !== filter.scope) return false;
  if (filter.status !== undefined && kpiPackage.package.status !== filter.status) return false;
  if (filter.kpiId !== undefined && !kpiPackage.package.kpis.some((kpi) => kpi.kpiId === filter.kpiId)) {
    return false;
  }
  return true;
}

export function sortDomainKpiPackages(
  kpiPackages: readonly RegisteredDomainKpiPackage[],
  sortKey: DomainKpiSortKey = "registrationOrder",
  direction: DomainKpiSortDirection = "asc"
): readonly RegisteredDomainKpiPackage[] {
  const multiplier = directionMultiplier(direction);
  return Object.freeze(
    [...kpiPackages].sort((left, right) => comparePackages(left, right, sortKey) * multiplier)
  );
}

export function filterDomainKpiPackages(
  registry: DomainKpiRegistry,
  filter: DomainKpiFilter
): readonly RegisteredDomainKpiPackage[] {
  return Object.freeze(registry.packages.filter((kpiPackage) => packageMatchesFilter(kpiPackage, filter)));
}

export function queryDomainKpiPackages(
  registry: DomainKpiRegistry,
  query: DomainKpiQuery = Object.freeze({})
): readonly RegisteredDomainKpiPackage[] {
  const filtered = query.filter ? filterDomainKpiPackages(registry, query.filter) : registry.packages;
  return sortDomainKpiPackages(filtered, query.sortKey, query.direction);
}

export function findKpiPackagesByDomain(
  registry: DomainKpiRegistry,
  domainId: DomainId
): readonly RegisteredDomainKpiPackage[] {
  return queryDomainKpiPackages(registry, {
    filter: Object.freeze({ domainId }),
    sortKey: "registrationOrder",
  });
}

export function findKpiPackagesByScope(
  registry: DomainKpiRegistry,
  scope: DomainKpiScope
): readonly RegisteredDomainKpiPackage[] {
  return queryDomainKpiPackages(registry, {
    filter: Object.freeze({ scope }),
    sortKey: "registrationOrder",
  });
}

export function findKpiPackagesByStatus(
  registry: DomainKpiRegistry,
  status: DomainKpiStatus
): readonly RegisteredDomainKpiPackage[] {
  return queryDomainKpiPackages(registry, {
    filter: Object.freeze({ status }),
    sortKey: "registrationOrder",
  });
}

export function findKpiPackageContainingKpi(
  registry: DomainKpiRegistry,
  kpiId: DomainKpiId
): RegisteredDomainKpiPackage | null {
  return registry.packages.find((entry) => entry.package.kpis.some((kpi) => kpi.kpiId === kpiId)) ?? null;
}
