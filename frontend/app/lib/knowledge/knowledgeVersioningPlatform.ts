/**
 * KNL-11 — Knowledge Versioning Platform facade.
 */

import {
  getKnowledgeVersioningManifest,
  validateKnowledgeVersioningPlatform,
} from "./knowledgeVersioningContracts.ts";
import {
  getKnowledgeVersioningPlatformRegistry,
  getKnowledgeVersioningPlatformState,
  initializeKnowledgeVersioningPlatform,
  isKnowledgeVersioningPlatformInitialized,
  registerKnowledgeVersion,
  registerKnowledgeVersionCompatibility,
  registerVersionedKnowledgeAsset,
  resetKnowledgeVersioningRegistryForTests,
} from "./knowledgeVersioningRegistry.ts";
import { resetKnowledgeValidationPlatformRegistryForTests } from "./knowledgeValidationPlatformRegistry.ts";
import { resetKnowledgeRetrievalRegistryForTests } from "./knowledgeRetrievalRegistry.ts";
import { resetBestPracticeRegistryForTests } from "./bestPracticeRegistry.ts";
import { resetPolicyRuleBaseRegistryForTests } from "./policyRuleRegistry.ts";
import { resetFrameworkLibraryRegistryForTests } from "./frameworkLibraryRegistry.ts";
import { resetIndustryModelsRegistryForTests } from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const KNOWLEDGE_VERSIONING_PLATFORM_VERSION = "KNL/11" as const;

export function resetKnowledgeVersioningPlatformForTests(): void {
  resetKnowledgeVersioningRegistryForTests();
  resetKnowledgeValidationPlatformRegistryForTests();
  resetKnowledgeRetrievalRegistryForTests();
  resetBestPracticeRegistryForTests();
  resetPolicyRuleBaseRegistryForTests();
  resetFrameworkLibraryRegistryForTests();
  resetIndustryModelsRegistryForTests();
  resetKnowledgeGraphRegistryForTests();
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildKnowledgeVersioningPlatform(timestamp: string = new Date(0).toISOString()) {
  return initializeKnowledgeVersioningPlatform(timestamp);
}

export function getKnowledgeVersioningPlatform(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getKnowledgeVersioningPlatformState>;
  registry: ReturnType<typeof getKnowledgeVersioningPlatformRegistry>;
  readOnly: true;
}> {
  if (!isKnowledgeVersioningPlatformInitialized()) {
    initializeKnowledgeVersioningPlatform(timestamp);
  }
  return Object.freeze({
    state: getKnowledgeVersioningPlatformState(timestamp),
    registry: getKnowledgeVersioningPlatformRegistry(),
    readOnly: true as const,
  });
}

export {
  registerKnowledgeVersion,
  registerVersionedKnowledgeAsset,
  registerKnowledgeVersionCompatibility,
  getKnowledgeVersioningManifest,
  validateKnowledgeVersioningPlatform,
  isKnowledgeVersioningPlatformInitialized,
};

export const KnowledgeVersioningPlatformFacade = Object.freeze({
  registerKnowledgeVersion,
  registerVersionedKnowledgeAsset,
  registerKnowledgeVersionCompatibility,
  getKnowledgeVersioningPlatform,
  validateKnowledgeVersioningPlatform,
  getKnowledgeVersioningManifest,
  resetKnowledgeVersioningPlatformForTests,
  version: KNOWLEDGE_VERSIONING_PLATFORM_VERSION,
});
