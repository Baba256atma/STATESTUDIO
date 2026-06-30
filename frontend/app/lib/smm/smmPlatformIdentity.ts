/**
 * SMM-1 — Immutable platform identity.
 */

import {
  SMM_PLATFORM_ARCHITECTURE_VERSION,
  SMM_PLATFORM_COMPATIBILITY_VERSION,
  SMM_PLATFORM_CONTRACT_VERSION,
  SMM_PLATFORM_ID,
  SMM_PLATFORM_NAME,
  SMM_RELEASE_METADATA,
} from "./smmPlatformContracts.ts";
import type { SmmPlatformIdentity } from "./smmPlatformTypes.ts";

export const SMM_PLATFORM_IDENTITY: SmmPlatformIdentity = Object.freeze({
  layerId: "SMM",
  appId: "APP",
  title: SMM_PLATFORM_NAME,
  platformId: SMM_PLATFORM_ID,
  version: SMM_PLATFORM_CONTRACT_VERSION,
  architectureVersion: SMM_PLATFORM_ARCHITECTURE_VERSION,
  contractVersion: SMM_PLATFORM_CONTRACT_VERSION,
  compatibilityVersion: SMM_PLATFORM_COMPATIBILITY_VERSION,
  mvpStatus: "active",
  releaseStage: SMM_RELEASE_METADATA.releaseStage,
  compatibilityLevel: SMM_RELEASE_METADATA.compatibilityLevel,
  readOnly: true as const,
});

export function getSmmPlatformIdentity(): SmmPlatformIdentity {
  return SMM_PLATFORM_IDENTITY;
}

export function isSmmPlatformIdentityImmutable(): boolean {
  return Object.isFrozen(SMM_PLATFORM_IDENTITY);
}
