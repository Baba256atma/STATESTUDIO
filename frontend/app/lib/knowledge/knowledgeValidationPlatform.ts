/**
 * KNL-10 — Knowledge Validation Platform facade.
 */

import {
  getKnowledgeValidationManifest,
  validateKnowledgeValidationPlatform,
} from "./knowledgeValidationPlatformContracts.ts";
import {
  getKnowledgeValidationPlatformRegistry,
  getKnowledgeValidationPlatformState,
  initializeKnowledgeValidationPlatform,
  isKnowledgeValidationPlatformInitialized,
  registerKnowledgeValidationCategory,
  registerKnowledgeValidationProfile,
  registerKnowledgeValidationRule,
  resetKnowledgeValidationPlatformRegistryForTests,
} from "./knowledgeValidationPlatformRegistry.ts";
import { resetKnowledgeRetrievalRegistryForTests } from "./knowledgeRetrievalRegistry.ts";
import { resetBestPracticeRegistryForTests } from "./bestPracticeRegistry.ts";
import { resetPolicyRuleBaseRegistryForTests } from "./policyRuleRegistry.ts";
import { resetFrameworkLibraryRegistryForTests } from "./frameworkLibraryRegistry.ts";
import { resetIndustryModelsRegistryForTests } from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const KNOWLEDGE_VALIDATION_PLATFORM_VERSION = "KNL/10" as const;

export function resetKnowledgeValidationPlatformForTests(): void {
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

export function buildKnowledgeValidationPlatform(timestamp: string = new Date(0).toISOString()) {
  return initializeKnowledgeValidationPlatform(timestamp);
}

export function getKnowledgeValidationPlatform(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getKnowledgeValidationPlatformState>;
  registry: ReturnType<typeof getKnowledgeValidationPlatformRegistry>;
  readOnly: true;
}> {
  if (!isKnowledgeValidationPlatformInitialized()) {
    initializeKnowledgeValidationPlatform(timestamp);
  }
  return Object.freeze({
    state: getKnowledgeValidationPlatformState(timestamp),
    registry: getKnowledgeValidationPlatformRegistry(),
    readOnly: true as const,
  });
}

export {
  registerKnowledgeValidationProfile,
  registerKnowledgeValidationRule,
  registerKnowledgeValidationCategory,
  getKnowledgeValidationManifest,
  validateKnowledgeValidationPlatform,
  isKnowledgeValidationPlatformInitialized,
};

export const KnowledgeValidationPlatformFacade = Object.freeze({
  registerKnowledgeValidationProfile,
  registerKnowledgeValidationRule,
  registerKnowledgeValidationCategory,
  getKnowledgeValidationPlatform,
  validateKnowledgeValidationPlatform,
  getKnowledgeValidationManifest,
  resetKnowledgeValidationPlatformForTests,
  version: KNOWLEDGE_VALIDATION_PLATFORM_VERSION,
});
