/**
 * KNL-6 — Framework Library facade.
 */

import { getFrameworkLibraryManifest, validateFrameworkLibrary } from "./frameworkLibraryContracts.ts";
import {
  getFrameworkLibraryRegistry,
  getFrameworkLibraryState,
  initializeFrameworkLibrary,
  isFrameworkLibraryInitialized,
  registerFramework,
  registerFrameworkCategory,
  registerFrameworkTemplate,
  resetFrameworkLibraryRegistryForTests,
} from "./frameworkLibraryRegistry.ts";
import { resetIndustryModelsRegistryForTests } from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const FRAMEWORK_LIBRARY_VERSION = "KNL/6" as const;

export function resetFrameworkLibraryForTests(): void {
  resetFrameworkLibraryRegistryForTests();
  resetIndustryModelsRegistryForTests();
  resetKnowledgeGraphRegistryForTests();
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildFrameworkLibrary(timestamp: string = new Date(0).toISOString()) {
  return initializeFrameworkLibrary(timestamp);
}

export function getFrameworkLibrary(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getFrameworkLibraryState>;
  registry: ReturnType<typeof getFrameworkLibraryRegistry>;
  readOnly: true;
}> {
  if (!isFrameworkLibraryInitialized()) {
    initializeFrameworkLibrary(timestamp);
  }
  return Object.freeze({
    state: getFrameworkLibraryState(timestamp),
    registry: getFrameworkLibraryRegistry(),
    readOnly: true as const,
  });
}

export {
  registerFramework,
  registerFrameworkTemplate,
  registerFrameworkCategory,
  getFrameworkLibraryManifest,
  validateFrameworkLibrary,
  isFrameworkLibraryInitialized,
};

export const FrameworkLibrary = Object.freeze({
  registerFramework,
  registerFrameworkTemplate,
  registerFrameworkCategory,
  getFrameworkLibrary,
  validateFrameworkLibrary,
  getFrameworkLibraryManifest,
  resetFrameworkLibraryForTests,
  version: FRAMEWORK_LIBRARY_VERSION,
});
