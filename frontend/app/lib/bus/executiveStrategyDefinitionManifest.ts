import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { getExecutiveStrategyManifest } from "./executiveStrategyIndex.ts";
import { EXECUTIVE_STRATEGY_DEFINITION_REGISTRY } from "./executiveStrategyDefinitionRegistry.ts";
import type { ExecutiveStrategyDefinitionManifest } from "./executiveStrategyDefinitionTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-18-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function getExecutiveStrategyDefinitionManifest(): ExecutiveStrategyDefinitionManifest {
  const foundationManifest = getExecutiveStrategyManifest();
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const registry = EXECUTIVE_STRATEGY_DEFINITION_REGISTRY;
  const deterministicFingerprint = fingerprint([
    registry.platformId,
    registry.version,
    foundationManifest.deterministicFingerprint,
    kpiFreezeManifest.deterministicFingerprint,
    okrFreezeManifest.deterministicFingerprint,
    ...registry.strategyDefinitions.map((strategy) => `${strategy.identity.strategyId}:${strategy.category}:${strategy.priority}:${strategy.timeHorizon}:${strategy.status}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    version: registry.version,
    foundationPlatformId: registry.foundationPlatformId,
    strategyDefinitionCount: registry.strategyDefinitions.length,
    categoryCount: registry.categories.length,
    statusCount: registry.statuses.length,
    priorityCount: registry.priorities.length,
    lifecycleCount: registry.lifecycles.length,
    versionCount: registry.versions.length,
    ownerCount: registry.owners.length,
    publicApis: registry.publicApis,
    kpiFreezeAvailable:
      kpiFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      kpiFreezeManifest.releaseMetadata.releaseStatus === "Released",
    okrFreezeAvailable:
      okrFreezeManifest.platformIdentity.state === "Certified Frozen Released" &&
      okrFreezeManifest.releaseMetadata.releaseStatus === "Released",
    strategyFoundationAvailable: foundationManifest.certificationStatus === "Foundation Certified",
    certificationStatus: "Definition Platform Certified",
    deterministicFingerprint,
  });
}
