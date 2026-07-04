import { listDomains } from "./domainFoundationIndex.ts";
import { SUPPORTED_DOMAIN_CATEGORIES } from "./domainFoundationConstants.ts";
import type { DomainCategory, DomainId, DomainRegistry, DomainStatus, RegisteredDomain } from "./domainFoundationIndex.ts";
import {
  DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
  type DomainCapabilityStats,
  type DomainCategoryStats,
  type DomainDependencyStats,
  type DomainRegistryStats,
  type DomainStatusStats,
} from "./domainRegistryStatsTypes.ts";

function sortDomainIds(domainIds: readonly DomainId[]): readonly DomainId[] {
  return Object.freeze([...domainIds].sort((left, right) => left.localeCompare(right)));
}

function sortRegisteredDomains(domains: readonly RegisteredDomain[]): readonly RegisteredDomain[] {
  return Object.freeze(
    [...domains].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.manifest.domainId.localeCompare(right.package.manifest.domainId);
    })
  );
}

function buildDependencyMaps(registry: DomainRegistry): {
  dependsOn: Readonly<Record<DomainId, readonly DomainId[]>>;
  dependedOnBy: Readonly<Record<DomainId, readonly DomainId[]>>;
} {
  const dependsOnMap: Record<DomainId, DomainId[]> = {};
  const dependedOnByMap: Record<DomainId, DomainId[]> = {};

  for (const domain of listDomains(registry)) {
    const domainId = domain.package.manifest.domainId;
    dependsOnMap[domainId] = [];
    dependedOnByMap[domainId] = [];
  }

  for (const domain of listDomains(registry)) {
    const domainId = domain.package.manifest.domainId;
    const dependencies = sortDomainIds(domain.package.manifest.dependencies.map((dependency) => dependency.domainId));
    dependsOnMap[domainId] = [...dependencies];
    for (const dependencyId of dependencies) {
      if (!dependedOnByMap[dependencyId]) {
        dependedOnByMap[dependencyId] = [];
      }
      dependedOnByMap[dependencyId].push(domainId);
    }
  }

  const dependsOn = Object.freeze(
    Object.fromEntries(
      Object.entries(dependsOnMap).map(([domainId, dependencies]) => [domainId, sortDomainIds(dependencies)])
    )
  );
  const dependedOnBy = Object.freeze(
    Object.fromEntries(
      Object.entries(dependedOnByMap).map(([domainId, dependents]) => [domainId, sortDomainIds(dependents)])
    )
  );

  return { dependsOn, dependedOnBy };
}

function calculateDepth(
  domainId: DomainId,
  dependsOn: Readonly<Record<DomainId, readonly DomainId[]>>,
  memo: Record<DomainId, number>,
  visiting: Set<DomainId>
): number {
  if (memo[domainId] !== undefined) {
    return memo[domainId];
  }
  if (visiting.has(domainId)) {
    return 0;
  }

  visiting.add(domainId);
  const dependencies = dependsOn[domainId] ?? [];
  if (dependencies.length === 0) {
    memo[domainId] = 0;
    visiting.delete(domainId);
    return 0;
  }

  const depth = 1 + Math.max(...dependencies.map((dependencyId) => calculateDepth(dependencyId, dependsOn, memo, visiting)));
  memo[domainId] = depth;
  visiting.delete(domainId);
  return depth;
}

export function countDomainsByCategory(registry: DomainRegistry): readonly DomainCategoryStats[] {
  const counts = new Map<DomainCategory, DomainId[]>();

  for (const category of SUPPORTED_DOMAIN_CATEGORIES) {
    counts.set(category, []);
  }

  for (const domain of sortRegisteredDomains(listDomains(registry))) {
    const category = domain.package.manifest.metadata.category;
    counts.get(category)?.push(domain.package.manifest.domainId);
  }

  return Object.freeze(
    SUPPORTED_DOMAIN_CATEGORIES.map((category) =>
      Object.freeze({
        category,
        count: counts.get(category)?.length ?? 0,
        domainIds: sortDomainIds(counts.get(category) ?? []),
      })
    )
  );
}

export function countDomainsByStatus(registry: DomainRegistry): readonly DomainStatusStats[] {
  const statuses: DomainStatus[] = ["draft", "registered", "active", "deprecated", "archived"];
  const counts = Object.fromEntries(statuses.map((status) => [status, [] as DomainId[]])) as Record<DomainStatus, DomainId[]>;

  for (const domain of sortRegisteredDomains(listDomains(registry))) {
    counts[domain.package.manifest.status].push(domain.package.manifest.domainId);
  }

  return Object.freeze(
    statuses.map((status) =>
      Object.freeze({
        status,
        count: counts[status].length,
        domainIds: sortDomainIds(counts[status]),
      })
    )
  );
}

export function countDomainsByCapability(registry: DomainRegistry): readonly DomainCapabilityStats[] {
  const counts = new Map<string, DomainId[]>();

  for (const domain of sortRegisteredDomains(listDomains(registry))) {
    for (const capability of domain.package.manifest.capabilities) {
      const existing = counts.get(capability.id) ?? [];
      existing.push(domain.package.manifest.domainId);
      counts.set(capability.id, existing);
    }
  }

  return Object.freeze(
    [...counts.entries()]
      .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
      .map(([capabilityId, domainIds]) =>
        Object.freeze({
          capabilityId,
          count: domainIds.length,
          domainIds: sortDomainIds(domainIds),
        })
      )
  );
}

export function calculateDomainDependencyDepth(registry: DomainRegistry): readonly DomainDependencyStats[] {
  const { dependsOn, dependedOnBy } = buildDependencyMaps(registry);
  const memo: Record<DomainId, number> = {};

  return Object.freeze(
    sortRegisteredDomains(listDomains(registry)).map((domain) => {
      const domainId = domain.package.manifest.domainId;
      const outbound = dependsOn[domainId] ?? [];
      const inbound = dependedOnBy[domainId] ?? [];
      return Object.freeze({
        domainId,
        outboundDependencyCount: outbound.length,
        inboundDependencyCount: inbound.length,
        dependencyDepth: calculateDepth(domainId, dependsOn, memo, new Set()),
        dependsOn: outbound,
        dependedOnBy: inbound,
      });
    })
  );
}

export function findMostConnectedDomains(registry: DomainRegistry): readonly DomainId[] {
  const dependencies = calculateDomainDependencyDepth(registry);
  if (dependencies.length === 0) {
    return Object.freeze([]);
  }

  const maxConnections = Math.max(
    ...dependencies.map((entry) => entry.inboundDependencyCount + entry.outboundDependencyCount)
  );

  return sortDomainIds(
    dependencies
      .filter((entry) => entry.inboundDependencyCount + entry.outboundDependencyCount === maxConnections)
      .map((entry) => entry.domainId)
  );
}

export function buildDomainRegistryStats(registry: DomainRegistry): DomainRegistryStats {
  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
    registryId: registry.registryId,
    totalDomains: listDomains(registry).length,
    frozen: registry.frozen,
    categories: countDomainsByCategory(registry),
    statuses: countDomainsByStatus(registry),
    capabilities: countDomainsByCapability(registry),
    dependencies: calculateDomainDependencyDepth(registry),
    mostConnectedDomains: findMostConnectedDomains(registry),
    deterministic: true,
  });
}
