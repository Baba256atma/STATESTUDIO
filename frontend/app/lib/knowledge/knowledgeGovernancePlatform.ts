/**
 * KNL-13 — Knowledge Governance Platform facade.
 */

import {
  getKnowledgeGovernanceManifest,
  validateKnowledgeGovernancePlatform,
} from "./knowledgeGovernanceContracts.ts";
import {
  getKnowledgeGovernancePlatformRegistry,
  getKnowledgeGovernancePlatformState,
  initializeKnowledgeGovernancePlatform,
  isKnowledgeGovernancePlatformInitialized,
  registerKnowledgeGovernancePolicy,
  registerKnowledgeOwner,
  registerKnowledgeSteward,
  resetKnowledgeGovernanceRegistryForTests,
} from "./knowledgeGovernanceRegistry.ts";
import { resetKnowledgeLearningBridgeRegistryForTests } from "./knowledgeLearningBridgeRegistry.ts";
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

export const KNOWLEDGE_GOVERNANCE_PLATFORM_VERSION = "KNL/13" as const;

export function resetKnowledgeGovernancePlatformForTests(): void {
  resetKnowledgeGovernanceRegistryForTests();
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

export function buildKnowledgeGovernancePlatform(timestamp: string = new Date(0).toISOString()) {
  return initializeKnowledgeGovernancePlatform(timestamp);
}

export function getKnowledgeGovernancePlatform(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getKnowledgeGovernancePlatformState>;
  registry: ReturnType<typeof getKnowledgeGovernancePlatformRegistry>;
  readOnly: true;
}> {
  if (!isKnowledgeGovernancePlatformInitialized()) {
    initializeKnowledgeGovernancePlatform(timestamp);
  }
  return Object.freeze({
    state: getKnowledgeGovernancePlatformState(timestamp),
    registry: getKnowledgeGovernancePlatformRegistry(),
    readOnly: true as const,
  });
}

export {
  registerKnowledgeGovernancePolicy,
  registerKnowledgeOwner,
  registerKnowledgeSteward,
  getKnowledgeGovernanceManifest,
  validateKnowledgeGovernancePlatform,
  isKnowledgeGovernancePlatformInitialized,
};

export const KnowledgeGovernancePlatformFacade = Object.freeze({
  registerKnowledgeGovernancePolicy,
  registerKnowledgeOwner,
  registerKnowledgeSteward,
  getKnowledgeGovernancePlatform,
  validateKnowledgeGovernancePlatform,
  getKnowledgeGovernanceManifest,
  resetKnowledgeGovernancePlatformForTests,
  version: KNOWLEDGE_GOVERNANCE_PLATFORM_VERSION,
});
