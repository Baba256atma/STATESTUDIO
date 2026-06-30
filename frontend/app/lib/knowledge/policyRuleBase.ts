/**
 * KNL-7 — Policy & Rule Base facade.
 */

import { getPolicyRuleBaseManifest, validatePolicyRuleBase } from "./policyRuleContracts.ts";
import {
  getPolicyRuleBaseRegistry,
  getPolicyRuleBaseState,
  initializePolicyRuleBase,
  isPolicyRuleBaseInitialized,
  registerBusinessRule,
  registerPolicy,
  registerPolicyCategory,
  resetPolicyRuleBaseRegistryForTests,
} from "./policyRuleRegistry.ts";
import { resetFrameworkLibraryRegistryForTests } from "./frameworkLibraryRegistry.ts";
import { resetIndustryModelsRegistryForTests } from "./industryModelRegistry.ts";
import { resetKnowledgeGraphRegistryForTests } from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const POLICY_RULE_BASE_VERSION = "KNL/7" as const;

export function resetPolicyRuleBaseForTests(): void {
  resetPolicyRuleBaseRegistryForTests();
  resetFrameworkLibraryRegistryForTests();
  resetIndustryModelsRegistryForTests();
  resetKnowledgeGraphRegistryForTests();
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildPolicyRuleBase(timestamp: string = new Date(0).toISOString()) {
  return initializePolicyRuleBase(timestamp);
}

export function getPolicyRuleBase(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getPolicyRuleBaseState>;
  registry: ReturnType<typeof getPolicyRuleBaseRegistry>;
  readOnly: true;
}> {
  if (!isPolicyRuleBaseInitialized()) {
    initializePolicyRuleBase(timestamp);
  }
  return Object.freeze({
    state: getPolicyRuleBaseState(timestamp),
    registry: getPolicyRuleBaseRegistry(),
    readOnly: true as const,
  });
}

export {
  registerPolicy,
  registerBusinessRule,
  registerPolicyCategory,
  getPolicyRuleBaseManifest,
  validatePolicyRuleBase,
  isPolicyRuleBaseInitialized,
};

export const PolicyRuleBase = Object.freeze({
  registerPolicy,
  registerBusinessRule,
  registerPolicyCategory,
  getPolicyRuleBase,
  validatePolicyRuleBase,
  getPolicyRuleBaseManifest,
  resetPolicyRuleBaseForTests,
  version: POLICY_RULE_BASE_VERSION,
});
