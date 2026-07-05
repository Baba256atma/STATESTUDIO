import { getExecutiveStrategyPlatformCompatibilityMatrix } from "./executiveStrategyPlatformCompatibility.ts";
import {
  EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA,
  getExecutiveStrategyPlatformExtensionPolicy,
  listExecutiveStrategyPlatformDependencies,
  listExecutiveStrategyPlatformPhases,
  listExecutiveStrategyPlatformPublicApis,
  EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS,
} from "./executiveStrategyPlatformFreezeRegistry.ts";
import type { ExecutiveStrategyPlatformFreezeManifest } from "./executiveStrategyPlatformFreezeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-26-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveStrategyPlatformFreezeManifest(): ExecutiveStrategyPlatformFreezeManifest {
  const phaseRegistry = listExecutiveStrategyPlatformPhases();
  const publicApiRegistry = listExecutiveStrategyPlatformPublicApis();
  const dependencyRegistry = listExecutiveStrategyPlatformDependencies();
  const compatibilityMatrix = getExecutiveStrategyPlatformCompatibilityMatrix();
  const extensionPolicy = getExecutiveStrategyPlatformExtensionPolicy();
  const deterministicFingerprint = fingerprint([
    EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.platformId,
    EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.version,
    ...phaseRegistry.map((phase) => `${phase.phaseId}:${phase.status}:${phase.order}`),
    ...publicApiRegistry.map((api) => `${api.phaseId}:${api.apiName}`).sort(),
    ...dependencyRegistry.map((entry) => `${entry.sourcePhaseId}:${entry.targetPlatform}:${entry.dependencyStatus}`).sort(),
    ...EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS.map((entry) => `${entry.consumerId}:${entry.consumerType}`).sort(),
    ...compatibilityMatrix.map((entry) => `${entry.compatibilityId}:${entry.targetPlatform}:${entry.compatibilityStatus}`).sort(),
    extensionPolicy.policyId,
    EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA.releaseVersion,
  ]);

  return Object.freeze({
    platformIdentity: EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
    phaseRegistry,
    publicApiRegistry,
    dependencyRegistry,
    consumerRegistry: EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS,
    compatibilityMatrix,
    extensionPolicy,
    releaseMetadata: EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA,
    certificationGateCount: 18,
    regressionEntryCount: 9,
    deterministicFingerprint,
    metadataOnly: true,
    immutable: true,
  });
}
