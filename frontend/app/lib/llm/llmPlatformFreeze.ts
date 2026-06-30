/**
 * LLM-12 — Public Platform Certification & Freeze exports and facade.
 */

import { getLlmPlatformCompatibilityMatrix } from "./llmPlatformCompatibility.ts";
import { runLlmPlatformCertification } from "./llmPlatformCertification.ts";
import { buildLlmPlatformFreezeManifest } from "./llmPlatformFreezeManifest.ts";
import {
  getLlmCertifiedPhaseRegistrations,
  getLlmPlatformRegistry,
  LLM_CERTIFIED_MVP_PHASE_KEYS,
  LLM_PLATFORM_FREEZE_CONTRACT_VERSION,
  LLM_PLATFORM_FREEZE_PRINCIPLES,
  LLM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  LLM_PLATFORM_FREEZE_VERSION,
  LLM_PLATFORM_RELEASE_STAGE,
  LLM_PLATFORM_RELEASE_VERSION,
} from "./llmPlatformFreezeRegistry.ts";
import {
  getLastLlmPlatformCertificationResult,
  getLlmPlatformFreezeState,
  isLlmPlatformFrozen,
  resetLlmPlatformFreezeForTests,
  runLlmPlatformFreeze,
} from "./llmPlatformFreezeRunner.ts";
import { runLlmPlatformRegression } from "./llmPlatformRegression.ts";

export {
  runLlmPlatformCertification,
  runLlmPlatformRegression,
  buildLlmPlatformFreezeManifest,
  getLlmPlatformCompatibilityMatrix,
  getLlmPlatformRegistry,
  getLlmCertifiedPhaseRegistrations,
  runLlmPlatformFreeze,
  getLlmPlatformFreezeState,
  getLastLlmPlatformCertificationResult,
  isLlmPlatformFrozen,
  resetLlmPlatformFreezeForTests,
  LLM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  LLM_PLATFORM_FREEZE_PRINCIPLES,
  LLM_CERTIFIED_MVP_PHASE_KEYS,
  LLM_PLATFORM_FREEZE_CONTRACT_VERSION,
  LLM_PLATFORM_RELEASE_VERSION,
  LLM_PLATFORM_FREEZE_VERSION,
  LLM_PLATFORM_RELEASE_STAGE,
};

export const LlmPlatform = Object.freeze({
  runLlmPlatformCertification,
  runLlmPlatformRegression,
  buildLlmPlatformFreezeManifest,
  getLlmPlatformCompatibilityMatrix,
  getLlmPlatformRegistry,
  getLlmCertifiedPhaseRegistrations,
  runLlmPlatformFreeze,
  getLlmPlatformFreezeState,
  getLastLlmPlatformCertificationResult,
  isLlmPlatformFrozen,
  resetLlmPlatformFreezeForTests,
  version: LLM_PLATFORM_FREEZE_CONTRACT_VERSION,
});
