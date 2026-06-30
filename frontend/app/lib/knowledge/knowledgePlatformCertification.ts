/**
 * KNL-14 — Knowledge Platform Certification facade.
 */

import {
  getKnowledgePlatformCertificationManifest,
  validateKnowledgePlatformCertification,
} from "./knowledgePlatformCertificationContracts.ts";
import {
  getKnowledgePlatformCertificationReport,
  resetKnowledgePlatformCertificationForTests,
  runKnowledgePlatformCertification,
} from "./knowledgePlatformCertificationRunner.ts";
import { resetKnowledgeGovernancePlatformForTests } from "./knowledgeGovernancePlatform.ts";

export const KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION = "KNL/14" as const;

export function resetKnowledgePlatformCertificationPlatformForTests(): void {
  resetKnowledgePlatformCertificationForTests();
  resetKnowledgeGovernancePlatformForTests();
}

export {
  runKnowledgePlatformCertification,
  getKnowledgePlatformCertificationManifest,
  validateKnowledgePlatformCertification,
  getKnowledgePlatformCertificationReport,
};

export const KnowledgePlatformCertificationFacade = Object.freeze({
  runKnowledgePlatformCertification,
  getKnowledgePlatformCertificationManifest,
  validateKnowledgePlatformCertification,
  getKnowledgePlatformCertificationReport,
  resetKnowledgePlatformCertificationPlatformForTests,
  version: KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION,
});
