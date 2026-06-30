/**
 * KNL-5 — Industry Models facade.
 */

import { getIndustryModelsManifest, validateIndustryModels } from "./industryModelContracts.ts";
import {
  getIndustryModelsRegistry,
  getIndustryModelsState,
  initializeIndustryModels,
  isIndustryModelsInitialized,
  registerIndustryCategory,
  registerIndustryModel,
  registerIndustryTemplate,
  resetIndustryModelsRegistryForTests,
} from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const INDUSTRY_MODELS_VERSION = "KNL/5" as const;

export function resetIndustryModelsForTests(): void {
  resetIndustryModelsRegistryForTests();
  resetKnowledgeGraphRegistryForTests();
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildIndustryModels(timestamp: string = new Date(0).toISOString()) {
  return initializeIndustryModels(timestamp);
}

export function getIndustryModels(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getIndustryModelsState>;
  registry: ReturnType<typeof getIndustryModelsRegistry>;
  readOnly: true;
}> {
  if (!isIndustryModelsInitialized()) {
    initializeIndustryModels(timestamp);
  }
  return Object.freeze({
    state: getIndustryModelsState(timestamp),
    registry: getIndustryModelsRegistry(),
    readOnly: true as const,
  });
}

export {
  registerIndustryModel,
  registerIndustryTemplate,
  registerIndustryCategory,
  getIndustryModelsManifest,
  validateIndustryModels,
  isIndustryModelsInitialized,
};

export const IndustryModels = Object.freeze({
  registerIndustryModel,
  registerIndustryTemplate,
  registerIndustryCategory,
  getIndustryModels,
  validateIndustryModels,
  getIndustryModelsManifest,
  resetIndustryModelsForTests,
  version: INDUSTRY_MODELS_VERSION,
});
