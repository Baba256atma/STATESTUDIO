/**
 * KNL-12 — Knowledge Learning Bridge facade.
 */

import {
  getKnowledgeLearningBridgeManifest,
  validateKnowledgeLearningBridgePlatform,
} from "./knowledgeLearningBridgeContracts.ts";
import {
  getKnowledgeLearningBridgePlatformRegistry,
  getKnowledgeLearningBridgePlatformState,
  initializeKnowledgeLearningBridgePlatform,
  isKnowledgeLearningBridgePlatformInitialized,
  registerKnowledgeLearningBridge,
  registerKnowledgeLearningSource,
  registerKnowledgeLearningTarget,
  resetKnowledgeLearningBridgeRegistryForTests,
} from "./knowledgeLearningBridgeRegistry.ts";
import { resetKnowledgeVersioningRegistryForTests } from "./knowledgeVersioningRegistry.ts";
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

export const KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_VERSION = "KNL/12" as const;

export function resetKnowledgeLearningBridgePlatformForTests(): void {
  resetKnowledgeLearningBridgeRegistryForTests();
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

export function buildKnowledgeLearningBridgePlatform(timestamp: string = new Date(0).toISOString()) {
  return initializeKnowledgeLearningBridgePlatform(timestamp);
}

export function getKnowledgeLearningBridgePlatform(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getKnowledgeLearningBridgePlatformState>;
  registry: ReturnType<typeof getKnowledgeLearningBridgePlatformRegistry>;
  readOnly: true;
}> {
  if (!isKnowledgeLearningBridgePlatformInitialized()) {
    initializeKnowledgeLearningBridgePlatform(timestamp);
  }
  return Object.freeze({
    state: getKnowledgeLearningBridgePlatformState(timestamp),
    registry: getKnowledgeLearningBridgePlatformRegistry(),
    readOnly: true as const,
  });
}

export {
  registerKnowledgeLearningSource,
  registerKnowledgeLearningTarget,
  registerKnowledgeLearningBridge,
  getKnowledgeLearningBridgeManifest,
  validateKnowledgeLearningBridgePlatform,
  isKnowledgeLearningBridgePlatformInitialized,
};

export const KnowledgeLearningBridgePlatformFacade = Object.freeze({
  registerKnowledgeLearningSource,
  registerKnowledgeLearningTarget,
  registerKnowledgeLearningBridge,
  getKnowledgeLearningBridgePlatform,
  validateKnowledgeLearningBridgePlatform,
  getKnowledgeLearningBridgeManifest,
  resetKnowledgeLearningBridgePlatformForTests,
  version: KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_VERSION,
});
