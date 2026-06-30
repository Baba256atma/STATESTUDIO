/**
 * KNL-9 — Knowledge Retrieval Engine validation.
 */

import {
  KNOWLEDGE_INDEX_NAME_PATTERN,
  KNOWLEDGE_RETRIEVAL_BEST_PRACTICE_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
  KNOWLEDGE_RETRIEVAL_FOUNDATION_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_FRAMEWORK_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_GRAPH_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_INDUSTRY_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_RETRIEVAL_NAMESPACE,
  KNOWLEDGE_RETRIEVAL_NAMESPACE_PATTERN,
  KNOWLEDGE_RETRIEVAL_ONTOLOGY_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_POLICY_DEPENDENCY,
  KNOWLEDGE_RETRIEVAL_VERSION_PATTERN,
  KNOWLEDGE_RETRIEVAL_VOCABULARY_DEPENDENCY,
  RETRIEVAL_CATEGORY_KEYS,
  RETRIEVAL_NAMESPACE_KEYS,
  RETRIEVAL_PLATFORM_ID_MAP,
  RETRIEVAL_SOURCE_KEYS,
} from "./knowledgeRetrievalCatalog.ts";
import type {
  KnowledgeCategoryRegistrationInput,
  KnowledgeIndexRegistrationInput,
  KnowledgeRetrievalMetadata,
  KnowledgeRetrievalSourceRegistrationInput,
  KnowledgeRetrievalValidationIssue,
  KnowledgeRetrievalValidationResult,
} from "./knowledgeRetrievalTypes.ts";
import { validateBestPracticePlatform } from "./bestPracticeContracts.ts";
import { isBestPracticePlatformInitialized } from "./bestPracticeRegistry.ts";
import { validateBusinessOntology } from "./businessOntologyContracts.ts";
import { isBusinessOntologyInitialized } from "./businessOntologyRegistry.ts";
import { validateBusinessVocabulary } from "./businessVocabularyContracts.ts";
import { isBusinessVocabularyInitialized } from "./businessVocabularyRegistry.ts";
import { validateFrameworkLibrary } from "./frameworkLibraryContracts.ts";
import { isFrameworkLibraryInitialized } from "./frameworkLibraryRegistry.ts";
import { validateIndustryModels } from "./industryModelContracts.ts";
import { isIndustryModelsInitialized } from "./industryModelRegistry.ts";
import { validateKnowledgeGraph } from "./knowledgeGraphContracts.ts";
import { isKnowledgeGraphInitialized } from "./knowledgeGraphRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";
import { validatePolicyRuleBase } from "./policyRuleContracts.ts";
import { isPolicyRuleBaseInitialized } from "./policyRuleRegistry.ts";

function issue(code: string, message: string, field?: string): KnowledgeRetrievalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgeRetrievalValidationIssue[]): KnowledgeRetrievalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isRetrievalSourceKey(value: string): value is (typeof RETRIEVAL_SOURCE_KEYS)[number] {
  return (RETRIEVAL_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isRetrievalCategoryKey(value: string): value is (typeof RETRIEVAL_CATEGORY_KEYS)[number] {
  return (RETRIEVAL_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isRetrievalNamespaceKey(value: string): value is (typeof RETRIEVAL_NAMESPACE_KEYS)[number] {
  return (RETRIEVAL_NAMESPACE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateRetrievalIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateIndexNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function hasDuplicateRetrievalSourceKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function validateKnowledgeRetrievalVersionFormat(version: string): KnowledgeRetrievalValidationResult {
  if (!KNOWLEDGE_RETRIEVAL_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateKnowledgeRetrievalNamespaceFormat(namespace: string): KnowledgeRetrievalValidationResult {
  if (!KNOWLEDGE_RETRIEVAL_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Knowledge retrieval namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateKnowledgeIndexNameFormat(indexName: string): KnowledgeRetrievalValidationResult {
  if (!KNOWLEDGE_INDEX_NAME_PATTERN.test(indexName)) {
    return result([issue("invalid_index_name", "Index name must be lowercase snake_case.", "indexName")]);
  }
  return result([]);
}

export function validateKnowledgeRetrievalMetadataRecord(
  metadata: KnowledgeRetrievalMetadata
): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  for (const field of KNOWLEDGE_RETRIEVAL_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof KnowledgeRetrievalMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgeRetrievalNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgeRetrievalVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validateRetrievalSourceReference(
  sourceKey: string,
  registeredSourceKeys: readonly string[]
): KnowledgeRetrievalValidationResult {
  if (!isRetrievalSourceKey(sourceKey)) {
    return result([issue("invalid_source_key", `Invalid retrieval source key: ${sourceKey}.`, "sourceKey")]);
  }
  if (!registeredSourceKeys.includes(sourceKey)) {
    return result([issue("invalid_source_reference", `Retrieval source not registered: ${sourceKey}.`, "sourceKey")]);
  }
  return result([]);
}

export function validateRetrievalCategoryReference(
  categoryKey: string,
  registeredCategoryKeys: readonly string[]
): KnowledgeRetrievalValidationResult {
  if (!isRetrievalCategoryKey(categoryKey)) {
    return result([issue("invalid_category_key", `Invalid retrieval category key: ${categoryKey}.`, "categoryKey")]);
  }
  if (!registeredCategoryKeys.includes(categoryKey)) {
    return result([
      issue("invalid_category_reference", `Retrieval category not registered: ${categoryKey}.`, "categoryKey"),
    ]);
  }
  return result([]);
}

export function validateRetrievalNamespaceReference(namespaceKey: string): KnowledgeRetrievalValidationResult {
  if (!isRetrievalNamespaceKey(namespaceKey)) {
    return result([
      issue("invalid_namespace_reference", `Invalid retrieval namespace key: ${namespaceKey}.`, "namespaceKey"),
    ]);
  }
  return result([]);
}

export function validateKnowledgeRetrievalSourceRegistration(
  input: KnowledgeRetrievalSourceRegistrationInput
): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!input.sourceId.trim()) {
    issues.push(issue("missing_field", "sourceId is required.", "sourceId"));
  }
  if (!isRetrievalSourceKey(input.sourceKey)) {
    issues.push(issue("invalid_source", "Invalid retrieval source key.", "sourceKey"));
  }
  if (!input.platformId.trim()) {
    issues.push(issue("missing_field", "platformId is required.", "platformId"));
  } else if (isRetrievalSourceKey(input.sourceKey)) {
    const expected = RETRIEVAL_PLATFORM_ID_MAP[input.sourceKey];
    if (input.platformId !== expected) {
      issues.push(
        issue("invalid_platform_reference", `Platform id must be ${expected} for ${input.sourceKey}.`, "platformId")
      );
    }
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateKnowledgeIndexRegistration(
  input: KnowledgeIndexRegistrationInput,
  registeredSourceKeys: readonly string[],
  registeredCategoryKeys: readonly string[]
): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!input.indexId.trim()) {
    issues.push(issue("missing_field", "indexId is required.", "indexId"));
  }
  const indexNameValidation = validateKnowledgeIndexNameFormat(input.indexName);
  if (!indexNameValidation.valid) issues.push(...indexNameValidation.issues);
  const sourceValidation = validateRetrievalSourceReference(input.sourceKey, registeredSourceKeys);
  if (!sourceValidation.valid) issues.push(...sourceValidation.issues);
  const categoryValidation = validateRetrievalCategoryReference(input.categoryKey, registeredCategoryKeys);
  if (!categoryValidation.valid) issues.push(...categoryValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateKnowledgeCategoryRegistration(
  input: KnowledgeCategoryRegistrationInput
): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isRetrievalCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid knowledge category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeRetrievalDependencyDeclarations(): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (KNOWLEDGE_RETRIEVAL_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/1."));
  }
  if (KNOWLEDGE_RETRIEVAL_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/2."));
  }
  if (KNOWLEDGE_RETRIEVAL_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/3."));
  }
  if (KNOWLEDGE_RETRIEVAL_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/4."));
  }
  if (KNOWLEDGE_RETRIEVAL_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/5."));
  }
  if (KNOWLEDGE_RETRIEVAL_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/6."));
  }
  if (KNOWLEDGE_RETRIEVAL_POLICY_DEPENDENCY !== "KNL/7") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/7."));
  }
  if (KNOWLEDGE_RETRIEVAL_BEST_PRACTICE_DEPENDENCY !== "KNL/8") {
    issues.push(issue("invalid_dependency", "Knowledge retrieval engine must depend on KNL/8."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isPolicyRuleBaseInitialized()) {
    issues.push(issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized."));
  }
  const report = validatePolicyRuleBase(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("policy_invalid", entry.message));
  }
  return result(issues);
}

export function validateBestPracticePlatformDependency(timestamp: string): KnowledgeRetrievalValidationResult {
  const issues: KnowledgeRetrievalValidationIssue[] = [];
  if (!isBestPracticePlatformInitialized()) {
    issues.push(issue("best_practice_not_initialized", "KNL/8 Best Practices is not initialized."));
  }
  const report = validateBestPracticePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("best_practice_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeRetrievalContractVersion(): KnowledgeRetrievalValidationResult {
  return validateKnowledgeRetrievalVersionFormat(KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION);
}

export function validateKnowledgeRetrievalCoreNamespace(): KnowledgeRetrievalValidationResult {
  return validateKnowledgeRetrievalNamespaceFormat(KNOWLEDGE_RETRIEVAL_NAMESPACE);
}
