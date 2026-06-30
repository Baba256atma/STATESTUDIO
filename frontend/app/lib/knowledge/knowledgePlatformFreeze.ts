/**
 * KNL-15 — Knowledge Platform Freeze facade.
 */

import {
  getKnowledgePlatformCompatibilityMatrix,
  getKnowledgePlatformFreezeManifest,
  validateKnowledgePlatformFreeze,
} from "./knowledgePlatformFreezeContracts.ts";
import {
  resetKnowledgePlatformFreezeForTests,
  runKnowledgePlatformFreeze,
} from "./knowledgePlatformFreezeRunner.ts";
import { resetKnowledgePlatformCertificationPlatformForTests } from "./knowledgePlatformCertification.ts";

export const KNOWLEDGE_PLATFORM_FREEZE_VERSION = "KNL/15" as const;

export function resetKnowledgePlatformFreezePlatformForTests(): void {
  resetKnowledgePlatformFreezeForTests();
  resetKnowledgePlatformCertificationPlatformForTests();
}

export {
  runKnowledgePlatformFreeze,
  getKnowledgePlatformFreezeManifest,
  validateKnowledgePlatformFreeze,
  getKnowledgePlatformCompatibilityMatrix,
};

export const KnowledgePlatformFreezeFacade = Object.freeze({
  runKnowledgePlatformFreeze,
  getKnowledgePlatformFreezeManifest,
  validateKnowledgePlatformFreeze,
  getKnowledgePlatformCompatibilityMatrix,
  resetKnowledgePlatformFreezePlatformForTests,
  version: KNOWLEDGE_PLATFORM_FREEZE_VERSION,
});
