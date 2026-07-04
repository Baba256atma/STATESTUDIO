import type { DomainCategory, DomainId, DomainStatus } from "./domainFoundationIndex.ts";

export const DOMAIN_REGISTRY_STATS_CONTRACT_VERSION = "DOM-1:3" as const;

export type DomainCategoryStats = Readonly<{
  category: DomainCategory;
  count: number;
  domainIds: readonly DomainId[];
}>;

export type DomainStatusStats = Readonly<{
  status: DomainStatus;
  count: number;
  domainIds: readonly DomainId[];
}>;

export type DomainCapabilityStats = Readonly<{
  capabilityId: string;
  count: number;
  domainIds: readonly DomainId[];
}>;

export type DomainDependencyStats = Readonly<{
  domainId: DomainId;
  outboundDependencyCount: number;
  inboundDependencyCount: number;
  dependencyDepth: number;
  dependsOn: readonly DomainId[];
  dependedOnBy: readonly DomainId[];
}>;

export type DomainRegistryStats = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_STATS_CONTRACT_VERSION;
  registryId: string;
  totalDomains: number;
  frozen: boolean;
  categories: readonly DomainCategoryStats[];
  statuses: readonly DomainStatusStats[];
  capabilities: readonly DomainCapabilityStats[];
  dependencies: readonly DomainDependencyStats[];
  mostConnectedDomains: readonly DomainId[];
  deterministic: true;
}>;

export type DomainCategoryIndex = Readonly<{
  entries: readonly DomainCategoryStats[];
  byCategory: Readonly<Partial<Record<DomainCategory, readonly DomainId[]>>>;
}>;

export type DomainStatusIndex = Readonly<{
  entries: readonly DomainStatusStats[];
  byStatus: Readonly<Partial<Record<DomainStatus, readonly DomainId[]>>>;
}>;

export type DomainCapabilityIndex = Readonly<{
  entries: readonly DomainCapabilityStats[];
  byCapabilityId: Readonly<Record<string, readonly DomainId[]>>;
}>;

export type DomainDependencyIndexEntry = Readonly<{
  domainId: DomainId;
  dependsOn: readonly DomainId[];
  dependedOnBy: readonly DomainId[];
}>;

export type DomainDependencyIndex = Readonly<{
  entries: readonly DomainDependencyIndexEntry[];
  byDomainId: Readonly<Record<DomainId, DomainDependencyIndexEntry>>;
}>;

export type DomainRegistryIndex = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_STATS_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  categoryIndex: DomainCategoryIndex;
  statusIndex: DomainStatusIndex;
  capabilityIndex: DomainCapabilityIndex;
  dependencyIndex: DomainDependencyIndex;
  deterministic: true;
}>;

export type DomainRegistryDiffType = "added" | "removed" | "modified" | "unchanged";

export type DomainRegistryDiffEntry = Readonly<{
  diffType: DomainRegistryDiffType;
  domainId: DomainId;
  leftEntry: import("./domainRegistryQueryIndex.ts").DomainSnapshotEntry | null;
  rightEntry: import("./domainRegistryQueryIndex.ts").DomainSnapshotEntry | null;
}>;

export type DomainRegistryDiffSummary = Readonly<{
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
  total: number;
}>;

export type DomainRegistryDiff = Readonly<{
  contractVersion: typeof DOMAIN_REGISTRY_STATS_CONTRACT_VERSION;
  summary: DomainRegistryDiffSummary;
  entries: readonly DomainRegistryDiffEntry[];
  deterministic: true;
}>;

export type DomainRegistryDiffValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;
