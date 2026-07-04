import type { DomainRegistry } from "./domainFoundationIndex.ts";
import {
  countDomainsByCapability,
  countDomainsByCategory,
  countDomainsByStatus,
  calculateDomainDependencyDepth,
} from "./domainRegistryStats.ts";
import {
  DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
  type DomainCapabilityIndex,
  type DomainCategoryIndex,
  type DomainDependencyIndex,
  type DomainDependencyIndexEntry,
  type DomainRegistryIndex,
  type DomainStatusIndex,
} from "./domainRegistryStatsTypes.ts";

function buildCategoryRecord(
  entries: ReturnType<typeof countDomainsByCategory>
): DomainCategoryIndex["byCategory"] {
  return Object.freeze(
    Object.fromEntries(entries.map((entry) => [entry.category, entry.domainIds]))
  ) as DomainCategoryIndex["byCategory"];
}

function buildStatusRecord(entries: ReturnType<typeof countDomainsByStatus>): DomainStatusIndex["byStatus"] {
  return Object.freeze(
    Object.fromEntries(entries.map((entry) => [entry.status, entry.domainIds]))
  ) as DomainStatusIndex["byStatus"];
}

function buildCapabilityRecord(
  entries: ReturnType<typeof countDomainsByCapability>
): DomainCapabilityIndex["byCapabilityId"] {
  return Object.freeze(Object.fromEntries(entries.map((entry) => [entry.capabilityId, entry.domainIds])));
}

export function buildDomainCategoryIndex(registry: DomainRegistry): DomainCategoryIndex {
  const entries = countDomainsByCategory(registry);
  return Object.freeze({
    entries,
    byCategory: buildCategoryRecord(entries),
  });
}

export function buildDomainStatusIndex(registry: DomainRegistry): DomainStatusIndex {
  const entries = countDomainsByStatus(registry);
  return Object.freeze({
    entries,
    byStatus: buildStatusRecord(entries),
  });
}

export function buildDomainCapabilityIndex(registry: DomainRegistry): DomainCapabilityIndex {
  const entries = countDomainsByCapability(registry);
  return Object.freeze({
    entries,
    byCapabilityId: buildCapabilityRecord(entries),
  });
}

export function buildDomainDependencyIndex(registry: DomainRegistry): DomainDependencyIndex {
  const dependencies = calculateDomainDependencyDepth(registry);
  const entries: DomainDependencyIndexEntry[] = dependencies.map((entry) =>
    Object.freeze({
      domainId: entry.domainId,
      dependsOn: entry.dependsOn,
      dependedOnBy: entry.dependedOnBy,
    })
  );

  return Object.freeze({
    entries: Object.freeze(entries),
    byDomainId: Object.freeze(Object.fromEntries(entries.map((entry) => [entry.domainId, entry]))),
  });
}

export function buildCompleteDomainRegistryIndex(registry: DomainRegistry): DomainRegistryIndex {
  return Object.freeze({
    contractVersion: DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
    registryId: registry.registryId,
    frozen: registry.frozen,
    categoryIndex: buildDomainCategoryIndex(registry),
    statusIndex: buildDomainStatusIndex(registry),
    capabilityIndex: buildDomainCapabilityIndex(registry),
    dependencyIndex: buildDomainDependencyIndex(registry),
    deterministic: true,
  });
}
