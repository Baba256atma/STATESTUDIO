/**
 * KNL-9 — Knowledge Retrieval Engine facade.
 */

import { getKnowledgeRetrievalManifest, validateKnowledgeRetrievalEngine } from "./knowledgeRetrievalContracts.ts";
import {
  getKnowledgeRetrievalEngineRegistry,
  getKnowledgeRetrievalEngineState,
  initializeKnowledgeRetrievalEngine,
  isKnowledgeRetrievalEngineInitialized,
  registerKnowledgeCategory,
  registerKnowledgeIndex,
  registerKnowledgeRetrievalSource,
  resetKnowledgeRetrievalRegistryForTests,
} from "./knowledgeRetrievalRegistry.ts";
import { resetBestPracticeRegistryForTests } from "./bestPracticeRegistry.ts";
import { resetPolicyRuleBaseRegistryForTests } from "./policyRuleRegistry.ts";
import { resetFrameworkLibraryRegistryForTests } from "./frameworkLibraryRegistry.ts";
import { resetIndustryModelsRegistryForTests } from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const KNOWLEDGE_RETRIEVAL_ENGINE_VERSION = "KNL/9" as const;

export function resetKnowledgeRetrievalEngineForTests(): void {
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

export function buildKnowledgeRetrievalEngine(timestamp: string = new Date(0).toISOString()) {
  return initializeKnowledgeRetrievalEngine(timestamp);
}

export function getKnowledgeRetrievalEngine(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getKnowledgeRetrievalEngineState>;
  registry: ReturnType<typeof getKnowledgeRetrievalEngineRegistry>;
  readOnly: true;
}> {
  if (!isKnowledgeRetrievalEngineInitialized()) {
    initializeKnowledgeRetrievalEngine(timestamp);
  }
  return Object.freeze({
    state: getKnowledgeRetrievalEngineState(timestamp),
    registry: getKnowledgeRetrievalEngineRegistry(),
    readOnly: true as const,
  });
}

export {
  registerKnowledgeRetrievalSource,
  registerKnowledgeIndex,
  registerKnowledgeCategory,
  getKnowledgeRetrievalManifest,
  validateKnowledgeRetrievalEngine,
  isKnowledgeRetrievalEngineInitialized,
};

export const KnowledgeRetrievalEnginePlatform = Object.freeze({
  registerKnowledgeRetrievalSource,
  registerKnowledgeIndex,
  registerKnowledgeCategory,
  getKnowledgeRetrievalEngine,
  validateKnowledgeRetrievalEngine,
  getKnowledgeRetrievalManifest,
  resetKnowledgeRetrievalEngineForTests,
  version: KNOWLEDGE_RETRIEVAL_ENGINE_VERSION,
});
