/**
 * LLM-1 — Platform versioning and compatibility.
 */

import {
  LLM_MIGRATION_STRATEGY,
  LLM_PLATFORM_API_VERSION,
  LLM_PLATFORM_ARCHITECTURE_VERSION,
  LLM_PLATFORM_COMPATIBILITY_VERSION,
  LLM_PLATFORM_CONTRACT_VERSION,
  LLM_VERSION_PATTERN,
} from "./llmPlatformContracts.ts";
import type { LlmPlatformVersionMetadata } from "./llmPlatformTypes.ts";

export function validateLlmVersionFormat(version: string): boolean {
  return LLM_VERSION_PATTERN.test(version);
}

export function getLlmPlatformVersionMetadata(): LlmPlatformVersionMetadata {
  return Object.freeze({
    platformVersion: LLM_PLATFORM_CONTRACT_VERSION,
    contractVersion: LLM_PLATFORM_CONTRACT_VERSION,
    compatibilityVersion: LLM_PLATFORM_COMPATIBILITY_VERSION,
    architectureVersion: LLM_PLATFORM_ARCHITECTURE_VERSION,
    migrationStrategyId: LLM_MIGRATION_STRATEGY.strategyId,
    additiveOnly: true,
    readOnly: true as const,
  });
}

export function isLlmVersionConsistent(): boolean {
  const metadata = getLlmPlatformVersionMetadata();
  return (
    metadata.platformVersion === LLM_PLATFORM_CONTRACT_VERSION &&
    metadata.contractVersion === LLM_PLATFORM_CONTRACT_VERSION &&
    metadata.compatibilityVersion === LLM_PLATFORM_COMPATIBILITY_VERSION &&
    metadata.architectureVersion === LLM_PLATFORM_ARCHITECTURE_VERSION &&
    LLM_PLATFORM_API_VERSION === LLM_PLATFORM_CONTRACT_VERSION &&
    validateLlmVersionFormat(LLM_PLATFORM_CONTRACT_VERSION)
  );
}

export function getLlmMigrationStrategy() {
  return LLM_MIGRATION_STRATEGY;
}
