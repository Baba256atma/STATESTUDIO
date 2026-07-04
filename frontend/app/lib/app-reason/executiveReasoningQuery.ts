import { ExecutiveReasoningFoundation, type ExecutiveReasoningRegistry, type RegisteredExecutiveReasoningPackage } from "./executiveReasoningIndex.ts";
import type {
  ExecutiveReasoningFilter,
  ExecutiveReasoningQuery,
  ExecutiveReasoningRegistryQueryInput,
  ExecutiveReasoningSortDirection,
  ExecutiveReasoningSortKey,
} from "./executiveReasoningQueryTypes.ts";

function packagesFrom(input: ExecutiveReasoningRegistryQueryInput): readonly RegisteredExecutiveReasoningPackage[] {
  return "registryId" in input ? ExecutiveReasoningFoundation.listExecutiveReasoningPackages(input) : input;
}

function hasTag(registered: RegisteredExecutiveReasoningPackage, key: string, value: string): boolean {
  return registered.package.metadata.tags.includes(`${key}:${value}`);
}

export function queryExecutiveReasoningPackages(
  registry: ExecutiveReasoningRegistry,
  query: ExecutiveReasoningQuery = Object.freeze({})
): readonly RegisteredExecutiveReasoningPackage[] {
  const packages = ExecutiveReasoningFoundation.listExecutiveReasoningPackages(registry);
  return Object.freeze(
    packages.filter((registered) => {
      const packageMatches = query.packageIds ? query.packageIds.includes(registered.package.packageId) : true;
      const contractMatches = query.contractIds
        ? registered.package.contracts.some((contract) => query.contractIds?.includes(contract.contractId))
        : true;
      const frozenMatches = query.includeFrozen === false ? !registry.frozen : true;
      return packageMatches && contractMatches && frozenMatches;
    })
  );
}

export function filterExecutiveReasoningPackages(
  packagesOrRegistry: ExecutiveReasoningRegistryQueryInput,
  filter: ExecutiveReasoningFilter
): readonly RegisteredExecutiveReasoningPackage[] {
  return Object.freeze(
    packagesFrom(packagesOrRegistry).filter((registered) => {
      const domainMatches = filter.domain ? hasTag(registered, "domain", filter.domain) : true;
      const scopeMatches = filter.scope ? hasTag(registered, "scope", filter.scope) : true;
      const statusMatches = filter.status ? hasTag(registered, "status", filter.status) : true;
      const tagMatches = filter.tag ? registered.package.metadata.tags.includes(filter.tag) : true;
      const sourceMatches = filter.source ? registered.package.metadata.source === filter.source : true;
      return domainMatches && scopeMatches && statusMatches && tagMatches && sourceMatches;
    })
  );
}

export function sortExecutiveReasoningPackages(
  packages: readonly RegisteredExecutiveReasoningPackage[],
  sortKey: ExecutiveReasoningSortKey = "packageId",
  direction: ExecutiveReasoningSortDirection = "asc"
): readonly RegisteredExecutiveReasoningPackage[] {
  const sorted = [...packages].sort((left, right) => {
    const leftValue =
      sortKey === "registrationOrder"
        ? left.registrationOrder
        : sortKey === "contractCount"
          ? left.package.contracts.length
          : left.package[sortKey];
    const rightValue =
      sortKey === "registrationOrder"
        ? right.registrationOrder
        : sortKey === "contractCount"
          ? right.package.contracts.length
          : right.package[sortKey];
    return typeof leftValue === "number" && typeof rightValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue));
  });
  return Object.freeze(direction === "desc" ? sorted.reverse() : sorted);
}

export function findReasoningPackagesByDomain(registry: ExecutiveReasoningRegistry, domain: string) {
  return filterExecutiveReasoningPackages(registry, { domain });
}

export function findReasoningPackagesByScope(registry: ExecutiveReasoningRegistry, scope: string) {
  return filterExecutiveReasoningPackages(registry, { scope });
}

export function findReasoningPackagesByStatus(registry: ExecutiveReasoningRegistry, status: string) {
  return filterExecutiveReasoningPackages(registry, { status });
}

export function findReasoningPackageContainingContract(registry: ExecutiveReasoningRegistry, contractId: string) {
  return ExecutiveReasoningFoundation.listExecutiveReasoningPackages(registry).find((registered) =>
    registered.package.contracts.some((contract) => contract.contractId === contractId)
  ) ?? null;
}
