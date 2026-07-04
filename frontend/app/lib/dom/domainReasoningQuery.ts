import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainReasoningContractId,
  DomainReasoningRegistry,
  DomainReasoningScope,
  DomainReasoningStatus,
  RegisteredDomainReasoningPackage,
} from "./domainReasoningIndex.ts";
import type {
  DomainReasoningFilter,
  DomainReasoningQuery,
  DomainReasoningSortDirection,
  DomainReasoningSortKey,
} from "./domainReasoningQueryTypes.ts";

function directionMultiplier(direction: DomainReasoningSortDirection): number {
  return direction === "desc" ? -1 : 1;
}

function comparePackages(
  left: RegisteredDomainReasoningPackage,
  right: RegisteredDomainReasoningPackage,
  sortKey: DomainReasoningSortKey
): number {
  if (sortKey === "domainId") {
    const byDomain = left.package.domainId.localeCompare(right.package.domainId);
    if (byDomain !== 0) return byDomain;
    return left.package.reasoningPackageId.localeCompare(right.package.reasoningPackageId);
  }
  if (sortKey === "registrationOrder") {
    const byOrder = left.registrationOrder - right.registrationOrder;
    if (byOrder !== 0) return byOrder;
    return left.package.reasoningPackageId.localeCompare(right.package.reasoningPackageId);
  }
  return left.package.reasoningPackageId.localeCompare(right.package.reasoningPackageId);
}

function packageMatchesFilter(
  reasoningPackage: RegisteredDomainReasoningPackage,
  filter: DomainReasoningFilter
): boolean {
  if (filter.domainId !== undefined && reasoningPackage.package.domainId !== filter.domainId) return false;
  if (filter.scope !== undefined && reasoningPackage.package.scope !== filter.scope) return false;
  if (filter.status !== undefined && reasoningPackage.package.status !== filter.status) return false;
  if (
    filter.contractId !== undefined &&
    !reasoningPackage.package.contracts.some((contract) => contract.contractId === filter.contractId)
  ) {
    return false;
  }
  return true;
}

export function sortDomainReasoningPackages(
  reasoningPackages: readonly RegisteredDomainReasoningPackage[],
  sortKey: DomainReasoningSortKey = "registrationOrder",
  direction: DomainReasoningSortDirection = "asc"
): readonly RegisteredDomainReasoningPackage[] {
  const multiplier = directionMultiplier(direction);
  return Object.freeze(
    [...reasoningPackages].sort((left, right) => comparePackages(left, right, sortKey) * multiplier)
  );
}

export function filterDomainReasoningPackages(
  registry: DomainReasoningRegistry,
  filter: DomainReasoningFilter
): readonly RegisteredDomainReasoningPackage[] {
  return Object.freeze(registry.packages.filter((reasoningPackage) => packageMatchesFilter(reasoningPackage, filter)));
}

export function queryDomainReasoningPackages(
  registry: DomainReasoningRegistry,
  query: DomainReasoningQuery = Object.freeze({})
): readonly RegisteredDomainReasoningPackage[] {
  const filtered = query.filter ? filterDomainReasoningPackages(registry, query.filter) : registry.packages;
  return sortDomainReasoningPackages(filtered, query.sortKey, query.direction);
}

export function findReasoningPackagesByDomain(
  registry: DomainReasoningRegistry,
  domainId: DomainId
): readonly RegisteredDomainReasoningPackage[] {
  return queryDomainReasoningPackages(registry, {
    filter: Object.freeze({ domainId }),
    sortKey: "registrationOrder",
  });
}

export function findReasoningPackagesByScope(
  registry: DomainReasoningRegistry,
  scope: DomainReasoningScope
): readonly RegisteredDomainReasoningPackage[] {
  return queryDomainReasoningPackages(registry, {
    filter: Object.freeze({ scope }),
    sortKey: "registrationOrder",
  });
}

export function findReasoningPackagesByStatus(
  registry: DomainReasoningRegistry,
  status: DomainReasoningStatus
): readonly RegisteredDomainReasoningPackage[] {
  return queryDomainReasoningPackages(registry, {
    filter: Object.freeze({ status }),
    sortKey: "registrationOrder",
  });
}

export function findReasoningPackageContainingContract(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): RegisteredDomainReasoningPackage | null {
  return registry.packages.find((entry) => entry.package.contracts.some((contract) => contract.contractId === contractId)) ?? null;
}
