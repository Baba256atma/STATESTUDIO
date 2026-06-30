/**
 * KNL-3 — Business Vocabulary facade.
 */

import { getBusinessVocabularyManifest, validateBusinessVocabulary } from "./businessVocabularyContracts.ts";
import {
  getBusinessVocabularyRegistry,
  getBusinessVocabularyState,
  initializeBusinessVocabulary,
  isBusinessVocabularyInitialized,
  registerBusinessAcronym,
  registerBusinessAlias,
  registerBusinessTerm,
  resetBusinessVocabularyRegistryForTests,
} from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const BUSINESS_VOCABULARY_VERSION = "KNL/3" as const;

export function resetBusinessVocabularyForTests(): void {
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildBusinessVocabulary(timestamp: string = new Date(0).toISOString()) {
  return initializeBusinessVocabulary(timestamp);
}

export function getBusinessVocabulary(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getBusinessVocabularyState>;
  registry: ReturnType<typeof getBusinessVocabularyRegistry>;
  readOnly: true;
}> {
  if (!isBusinessVocabularyInitialized()) {
    initializeBusinessVocabulary(timestamp);
  }
  return Object.freeze({
    state: getBusinessVocabularyState(timestamp),
    registry: getBusinessVocabularyRegistry(),
    readOnly: true as const,
  });
}

export {
  registerBusinessTerm,
  registerBusinessAlias,
  registerBusinessAcronym,
  getBusinessVocabularyManifest,
  validateBusinessVocabulary,
  isBusinessVocabularyInitialized,
};

export const BusinessVocabulary = Object.freeze({
  registerBusinessTerm,
  registerBusinessAlias,
  registerBusinessAcronym,
  getBusinessVocabulary,
  validateBusinessVocabulary,
  getBusinessVocabularyManifest,
  resetBusinessVocabularyForTests,
  version: BUSINESS_VOCABULARY_VERSION,
});
