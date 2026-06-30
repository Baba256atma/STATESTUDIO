/**
 * SMM-8 — Public Platform Certification & Freeze exports and facade.
 */

import { getSharedMentalModelPlatformCompatibilityMatrix } from "./sharedMentalModelPlatformCompatibility.ts";
import { runSharedMentalModelPlatformCertification } from "./sharedMentalModelPlatformCertification.ts";
import { buildSharedMentalModelPlatformManifest } from "./sharedMentalModelPlatformManifest.ts";
import {
  getSharedMentalModelCertifiedPhaseRegistrations,
  getSharedMentalModelPlatformRegistry,
  SMM_CERTIFIED_MVP_PHASE_KEYS,
  SMM_EXTENSION_POLICY,
  SMM_PLATFORM_FREEZE_CONTRACT_VERSION,
  SMM_PLATFORM_FREEZE_PRINCIPLES,
  SMM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  SMM_PLATFORM_FREEZE_VERSION,
  SMM_PLATFORM_RELEASE_STAGE,
  SMM_PLATFORM_RELEASE_VERSION,
} from "./sharedMentalModelPlatformFreezeRegistry.ts";
import {
  getLastSharedMentalModelPlatformCertificationResult,
  getSharedMentalModelPlatformFreezeState,
  isSharedMentalModelPlatformFrozen,
  resetSharedMentalModelPlatformFreezeForTests,
  runSharedMentalModelPlatformFreeze,
} from "./sharedMentalModelPlatformFreezeRunner.ts";
import { runSharedMentalModelPlatformRegression } from "./sharedMentalModelPlatformRegression.ts";

export {
  runSharedMentalModelPlatformCertification,
  runSharedMentalModelPlatformRegression,
  buildSharedMentalModelPlatformManifest,
  getSharedMentalModelPlatformCompatibilityMatrix,
  getSharedMentalModelPlatformRegistry,
  getSharedMentalModelCertifiedPhaseRegistrations,
  runSharedMentalModelPlatformFreeze,
  getSharedMentalModelPlatformFreezeState,
  getLastSharedMentalModelPlatformCertificationResult,
  isSharedMentalModelPlatformFrozen,
  resetSharedMentalModelPlatformFreezeForTests,
  SMM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  SMM_PLATFORM_FREEZE_PRINCIPLES,
  SMM_EXTENSION_POLICY,
  SMM_CERTIFIED_MVP_PHASE_KEYS,
  SMM_PLATFORM_FREEZE_CONTRACT_VERSION,
  SMM_PLATFORM_RELEASE_VERSION,
  SMM_PLATFORM_FREEZE_VERSION,
  SMM_PLATFORM_RELEASE_STAGE,
};

export const SharedMentalModelPlatformRelease = Object.freeze({
  runSharedMentalModelPlatformCertification,
  runSharedMentalModelPlatformRegression,
  buildSharedMentalModelPlatformManifest,
  getSharedMentalModelPlatformCompatibilityMatrix,
  getSharedMentalModelPlatformRegistry,
  getSharedMentalModelCertifiedPhaseRegistrations,
  runSharedMentalModelPlatformFreeze,
  getSharedMentalModelPlatformFreezeState,
  getLastSharedMentalModelPlatformCertificationResult,
  isSharedMentalModelPlatformFrozen,
  resetSharedMentalModelPlatformFreezeForTests,
  version: SMM_PLATFORM_FREEZE_CONTRACT_VERSION,
});

/** SMM-8 certified platform facade (release entry point). */
export const SharedMentalModelPlatform = SharedMentalModelPlatformRelease;
