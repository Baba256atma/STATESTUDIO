/**
 * LLM-1 — Immutable platform identity.
 */

import {
  LLM_PLATFORM_ARCHITECTURE_VERSION,
  LLM_PLATFORM_COMPATIBILITY_VERSION,
  LLM_PLATFORM_CONTRACT_VERSION,
  LLM_PLATFORM_ID,
  LLM_PLATFORM_NAME,
  LLM_RELEASE_METADATA,
} from "./llmPlatformContracts.ts";
import type { LlmPlatformIdentity } from "./llmPlatformTypes.ts";

export const LLM_PLATFORM_IDENTITY: LlmPlatformIdentity = Object.freeze({
  layerId: "LLM",
  appId: "APP",
  title: LLM_PLATFORM_NAME,
  platformId: LLM_PLATFORM_ID,
  version: LLM_PLATFORM_CONTRACT_VERSION,
  architectureVersion: LLM_PLATFORM_ARCHITECTURE_VERSION,
  contractVersion: LLM_PLATFORM_CONTRACT_VERSION,
  compatibilityVersion: LLM_PLATFORM_COMPATIBILITY_VERSION,
  mvpStatus: "active",
  releaseStage: LLM_RELEASE_METADATA.releaseStage,
  compatibilityLevel: LLM_RELEASE_METADATA.compatibilityLevel,
  readOnly: true as const,
});

export function getLlmPlatformIdentity(): LlmPlatformIdentity {
  return LLM_PLATFORM_IDENTITY;
}

export function isLlmPlatformIdentityImmutable(): boolean {
  return Object.isFrozen(LLM_PLATFORM_IDENTITY);
}
