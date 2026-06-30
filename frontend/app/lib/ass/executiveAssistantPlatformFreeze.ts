/**
 * ASS-9 — Public Platform Certification & Freeze exports and facade.
 */

import { getExecutiveAssistantPlatformCompatibilityMatrix } from "./executiveAssistantPlatformCompatibility.ts";
import { runExecutiveAssistantPlatformCertification } from "./executiveAssistantPlatformCertification.ts";
import {
  buildExecutiveAssistantPlatformManifest,
  validateExecutiveAssistantPlatformManifest,
} from "./executiveAssistantPlatformFreezeManifest.ts";
import {
  ASS_CERTIFIED_MVP_PHASE_KEYS,
  ASS_EXTENSION_POLICY,
  ASS_PLATFORM_FREEZE_CONTRACT_VERSION,
  ASS_PLATFORM_FREEZE_PRINCIPLES,
  ASS_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  ASS_PLATFORM_FREEZE_VERSION,
  ASS_PLATFORM_RELEASE_DECLARATION,
  ASS_PLATFORM_RELEASE_STAGE,
  ASS_PLATFORM_RELEASE_VERSION,
  getExecutiveAssistantCertifiedPhaseRegistrations,
  getExecutiveAssistantPlatformRegistry,
} from "./executiveAssistantPlatformFreezeRegistry.ts";
import {
  getExecutiveAssistantPlatformFreezeState,
  getLastExecutiveAssistantPlatformCertificationResult,
  isExecutiveAssistantPlatformFrozen,
  resetExecutiveAssistantPlatformFreezeForTests,
  runExecutiveAssistantPlatformFreeze,
} from "./executiveAssistantPlatformFreezeRunner.ts";
import { runExecutiveAssistantPlatformRegression } from "./executiveAssistantPlatformRegression.ts";

export {
  runExecutiveAssistantPlatformCertification,
  runExecutiveAssistantPlatformRegression,
  buildExecutiveAssistantPlatformManifest,
  validateExecutiveAssistantPlatformManifest,
  getExecutiveAssistantPlatformCompatibilityMatrix,
  getExecutiveAssistantPlatformRegistry,
  getExecutiveAssistantCertifiedPhaseRegistrations,
  runExecutiveAssistantPlatformFreeze,
  getExecutiveAssistantPlatformFreezeState,
  getLastExecutiveAssistantPlatformCertificationResult,
  isExecutiveAssistantPlatformFrozen,
  resetExecutiveAssistantPlatformFreezeForTests,
  ASS_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  ASS_PLATFORM_FREEZE_PRINCIPLES,
  ASS_EXTENSION_POLICY,
  ASS_CERTIFIED_MVP_PHASE_KEYS,
  ASS_PLATFORM_FREEZE_CONTRACT_VERSION,
  ASS_PLATFORM_RELEASE_VERSION,
  ASS_PLATFORM_FREEZE_VERSION,
  ASS_PLATFORM_RELEASE_STAGE,
  ASS_PLATFORM_RELEASE_DECLARATION,
};

export const ExecutiveAssistantPlatformRelease = Object.freeze({
  runExecutiveAssistantPlatformCertification,
  runExecutiveAssistantPlatformRegression,
  buildExecutiveAssistantPlatformManifest,
  getExecutiveAssistantPlatformCompatibilityMatrix,
  getExecutiveAssistantPlatformRegistry,
  getExecutiveAssistantCertifiedPhaseRegistrations,
  runExecutiveAssistantPlatformFreeze,
  getExecutiveAssistantPlatformFreezeState,
  getLastExecutiveAssistantPlatformCertificationResult,
  isExecutiveAssistantPlatformFrozen,
  resetExecutiveAssistantPlatformFreezeForTests,
  version: ASS_PLATFORM_FREEZE_CONTRACT_VERSION,
});

/** ASS-9 certified platform facade (release entry point). */
export const ExecutiveAssistantPlatform = ExecutiveAssistantPlatformRelease;
