/**
 * KNL-8 — Best Practices facade.
 */

import { getBestPracticeManifest, validateBestPracticePlatform } from "./bestPracticeContracts.ts";
import {
  getBestPracticePlatformRegistry,
  getBestPracticePlatformState,
  initializeBestPracticePlatform,
  isBestPracticePlatformInitialized,
  registerBestPractice,
  registerBestPracticeCategory,
  registerBestPracticeTemplate,
  resetBestPracticeRegistryForTests,
} from "./bestPracticeRegistry.ts";
import { resetPolicyRuleBaseRegistryForTests } from "./policyRuleRegistry.ts";
import { resetFrameworkLibraryRegistryForTests } from "./frameworkLibraryRegistry.ts";
import { resetIndustryModelsRegistryForTests } from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const BEST_PRACTICE_PLATFORM_VERSION = "KNL/8" as const;

export function resetBestPracticePlatformForTests(): void {
  resetBestPracticeRegistryForTests();
  resetPolicyRuleBaseRegistryForTests();
  resetFrameworkLibraryRegistryForTests();
  resetIndustryModelsRegistryForTests();
  resetKnowledgeGraphRegistryForTests();
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildBestPracticePlatform(timestamp: string = new Date(0).toISOString()) {
  return initializeBestPracticePlatform(timestamp);
}

export function getBestPracticePlatform(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getBestPracticePlatformState>;
  registry: ReturnType<typeof getBestPracticePlatformRegistry>;
  readOnly: true;
}> {
  if (!isBestPracticePlatformInitialized()) {
    initializeBestPracticePlatform(timestamp);
  }
  return Object.freeze({
    state: getBestPracticePlatformState(timestamp),
    registry: getBestPracticePlatformRegistry(),
    readOnly: true as const,
  });
}

export {
  registerBestPractice,
  registerBestPracticeTemplate,
  registerBestPracticeCategory,
  getBestPracticeManifest,
  validateBestPracticePlatform,
  isBestPracticePlatformInitialized,
};

export const BestPracticePlatform = Object.freeze({
  registerBestPractice,
  registerBestPracticeTemplate,
  registerBestPracticeCategory,
  getBestPracticePlatform,
  validateBestPracticePlatform,
  getBestPracticeManifest,
  resetBestPracticePlatformForTests,
  version: BEST_PRACTICE_PLATFORM_VERSION,
});
