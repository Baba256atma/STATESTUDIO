export {
  DOMAIN_REGISTRY_STATS_CONTRACT_VERSION,
} from "./domainRegistryStatsTypes.ts";
export type {
  DomainCapabilityIndex,
  DomainCapabilityStats,
  DomainCategoryIndex,
  DomainCategoryStats,
  DomainDependencyIndex,
  DomainDependencyIndexEntry,
  DomainDependencyStats,
  DomainRegistryDiff,
  DomainRegistryDiffEntry,
  DomainRegistryDiffSummary,
  DomainRegistryDiffType,
  DomainRegistryDiffValidationResult,
  DomainRegistryIndex,
  DomainRegistryStats,
  DomainStatusIndex,
  DomainStatusStats,
} from "./domainRegistryStatsTypes.ts";
export {
  buildDomainRegistryStats,
  calculateDomainDependencyDepth,
  countDomainsByCapability,
  countDomainsByCategory,
  countDomainsByStatus,
  findMostConnectedDomains,
} from "./domainRegistryStats.ts";
export {
  buildCompleteDomainRegistryIndex,
  buildDomainCapabilityIndex,
  buildDomainCategoryIndex,
  buildDomainDependencyIndex,
  buildDomainStatusIndex,
} from "./domainRegistryIndexes.ts";
export {
  diffDomainRegistrySnapshots,
  summarizeDomainRegistryDiff,
  validateDomainRegistryDiff,
} from "./domainRegistryDiff.ts";

import {
  buildDomainRegistryStats,
  calculateDomainDependencyDepth,
  countDomainsByCapability,
  countDomainsByCategory,
  countDomainsByStatus,
  findMostConnectedDomains,
} from "./domainRegistryStats.ts";
import {
  buildCompleteDomainRegistryIndex,
  buildDomainCapabilityIndex,
  buildDomainCategoryIndex,
  buildDomainDependencyIndex,
  buildDomainStatusIndex,
} from "./domainRegistryIndexes.ts";
import {
  diffDomainRegistrySnapshots,
  summarizeDomainRegistryDiff,
  validateDomainRegistryDiff,
} from "./domainRegistryDiff.ts";

export const DomainRegistryStatsLayer = Object.freeze({
  buildDomainRegistryStats,
  countDomainsByCategory,
  countDomainsByStatus,
  countDomainsByCapability,
  calculateDomainDependencyDepth,
  findMostConnectedDomains,
  buildDomainCategoryIndex,
  buildDomainStatusIndex,
  buildDomainCapabilityIndex,
  buildDomainDependencyIndex,
  buildCompleteDomainRegistryIndex,
  diffDomainRegistrySnapshots,
  summarizeDomainRegistryDiff,
  validateDomainRegistryDiff,
});

export const DOMAIN_REGISTRY_STATS_PUBLIC_APIS = Object.freeze([
  "DomainRegistryStatsLayer",
  "buildDomainRegistryStats",
  "countDomainsByCategory",
  "countDomainsByStatus",
  "countDomainsByCapability",
  "calculateDomainDependencyDepth",
  "findMostConnectedDomains",
  "buildDomainCategoryIndex",
  "buildDomainStatusIndex",
  "buildDomainCapabilityIndex",
  "buildDomainDependencyIndex",
  "buildCompleteDomainRegistryIndex",
  "diffDomainRegistrySnapshots",
  "summarizeDomainRegistryDiff",
  "validateDomainRegistryDiff",
] as const);
