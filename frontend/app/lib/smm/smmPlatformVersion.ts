/**
 * SMM-1 — Platform versioning and compatibility.
 */

import {
  SMM_MIGRATION_STRATEGY,
  SMM_PLATFORM_API_VERSION,
  SMM_PLATFORM_ARCHITECTURE_VERSION,
  SMM_PLATFORM_COMPATIBILITY_VERSION,
  SMM_PLATFORM_CONTRACT_VERSION,
  SMM_VERSION_PATTERN,
} from "./smmPlatformContracts.ts";
import type { SmmPlatformVersionMetadata } from "./smmPlatformTypes.ts";

export function validateSmmVersionFormat(version: string): boolean {
  return SMM_VERSION_PATTERN.test(version);
}

export function getSmmPlatformVersionMetadata(): SmmPlatformVersionMetadata {
  return Object.freeze({
    platformVersion: SMM_PLATFORM_CONTRACT_VERSION,
    contractVersion: SMM_PLATFORM_CONTRACT_VERSION,
    compatibilityVersion: SMM_PLATFORM_COMPATIBILITY_VERSION,
    architectureVersion: SMM_PLATFORM_ARCHITECTURE_VERSION,
    migrationStrategyId: SMM_MIGRATION_STRATEGY.strategyId,
    additiveOnly: true,
    readOnly: true as const,
  });
}

export function isSmmVersionConsistent(): boolean {
  const metadata = getSmmPlatformVersionMetadata();
  return (
    metadata.platformVersion === SMM_PLATFORM_CONTRACT_VERSION &&
    metadata.contractVersion === SMM_PLATFORM_CONTRACT_VERSION &&
    metadata.compatibilityVersion === SMM_PLATFORM_COMPATIBILITY_VERSION &&
    metadata.architectureVersion === SMM_PLATFORM_ARCHITECTURE_VERSION &&
    SMM_PLATFORM_API_VERSION === SMM_PLATFORM_CONTRACT_VERSION &&
    validateSmmVersionFormat(SMM_PLATFORM_CONTRACT_VERSION)
  );
}

export function getSmmMigrationStrategy() {
  return SMM_MIGRATION_STRATEGY;
}
