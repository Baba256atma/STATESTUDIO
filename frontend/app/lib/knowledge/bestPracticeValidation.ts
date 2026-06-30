/**
 * KNL-8 — Best Practices validation.
 */

import {
  BEST_PRACTICE_CANONICAL_NAME_PATTERN,
  BEST_PRACTICE_CATEGORY_KEYS,
  BEST_PRACTICE_CONTEXT_KEYS,
  BEST_PRACTICE_CONTRACT_VERSION,
  BEST_PRACTICE_FOUNDATION_DEPENDENCY,
  BEST_PRACTICE_FRAMEWORK_DEPENDENCY,
  BEST_PRACTICE_GRAPH_DEPENDENCY,
  BEST_PRACTICE_INDUSTRY_DEPENDENCY,
  BEST_PRACTICE_MANDATORY_METADATA_FIELDS,
  BEST_PRACTICE_NAMESPACE,
  BEST_PRACTICE_NAMESPACE_PATTERN,
  BEST_PRACTICE_ONTOLOGY_DEPENDENCY,
  BEST_PRACTICE_POLICY_DEPENDENCY,
  BEST_PRACTICE_VERSION_PATTERN,
  BEST_PRACTICE_VOCABULARY_DEPENDENCY,
} from "./bestPracticeCatalog.ts";
import type {
  BestPracticeCategoryRegistrationInput,
  BestPracticeMetadata,
  BestPracticeRegistrationInput,
  BestPracticeTemplateRegistrationInput,
  BestPracticeValidationIssue,
  BestPracticeValidationResult,
} from "./bestPracticeTypes.ts";
import { validateBusinessOntology } from "./businessOntologyContracts.ts";
import { getBusinessOntologyRegistry, isBusinessOntologyInitialized } from "./businessOntologyRegistry.ts";
import { validateBusinessVocabulary } from "./businessVocabularyContracts.ts";
import { isBusinessVocabularyInitialized } from "./businessVocabularyRegistry.ts";
import { validateFrameworkLibrary } from "./frameworkLibraryContracts.ts";
import { getFrameworkLibraryRegistry, isFrameworkLibraryInitialized } from "./frameworkLibraryRegistry.ts";
import { validateIndustryModels } from "./industryModelContracts.ts";
import { getIndustryModelsRegistry, isIndustryModelsInitialized } from "./industryModelRegistry.ts";
import { validateKnowledgeGraph } from "./knowledgeGraphContracts.ts";
import { isKnowledgeGraphInitialized } from "./knowledgeGraphRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";
import { validatePolicyRuleBase } from "./policyRuleContracts.ts";
import { getPolicyRuleBaseRegistry, isPolicyRuleBaseInitialized } from "./policyRuleRegistry.ts";

function issue(code: string, message: string, field?: string): BestPracticeValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BestPracticeValidationIssue[]): BestPracticeValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isBestPracticeCategoryKey(value: string): value is (typeof BEST_PRACTICE_CATEGORY_KEYS)[number] {
  return (BEST_PRACTICE_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isBestPracticeContextKey(value: string): value is (typeof BEST_PRACTICE_CONTEXT_KEYS)[number] {
  return (BEST_PRACTICE_CONTEXT_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateBestPracticeIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateTemplateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateBestPracticeNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validateBestPracticeVersionFormat(version: string): BestPracticeValidationResult {
  if (!BEST_PRACTICE_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateBestPracticeNamespaceFormat(namespace: string): BestPracticeValidationResult {
  if (!BEST_PRACTICE_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Best practice namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateBestPracticeCanonicalNameFormat(canonicalName: string): BestPracticeValidationResult {
  if (!BEST_PRACTICE_CANONICAL_NAME_PATTERN.test(canonicalName)) {
    return result([issue("invalid_canonical_name", "Canonical name must be lowercase snake_case.", "canonicalName")]);
  }
  return result([]);
}

export function validateBestPracticeMetadataRecord(metadata: BestPracticeMetadata): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  for (const field of BEST_PRACTICE_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof BestPracticeMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateBestPracticeNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateBestPracticeVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validateOntologyReference(entityId: string): BestPracticeValidationResult {
  if (!entityId.trim()) {
    return result([issue("missing_field", "ontologyEntityId is required.", "ontologyEntityId")]);
  }
  if (!isBusinessOntologyInitialized()) {
    return result([issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized.")]);
  }
  const exists = getBusinessOntologyRegistry().entities.some((entry) => entry.entityId === entityId);
  if (!exists) {
    return result([issue("invalid_ontology_reference", `Ontology entity not found: ${entityId}.`, "ontologyEntityId")]);
  }
  return result([]);
}

export function validateFrameworkReference(frameworkId: string): BestPracticeValidationResult {
  if (!frameworkId.trim()) {
    return result([issue("missing_field", "frameworkId is required.", "frameworkId")]);
  }
  if (!isFrameworkLibraryInitialized()) {
    return result([issue("framework_not_initialized", "KNL/6 Framework Library is not initialized.")]);
  }
  const exists = getFrameworkLibraryRegistry().frameworks.some((entry) => entry.frameworkId === frameworkId);
  if (!exists) {
    return result([issue("invalid_framework_reference", `Framework not found: ${frameworkId}.`, "frameworkId")]);
  }
  return result([]);
}

export function validatePolicyReference(policyId: string): BestPracticeValidationResult {
  if (!policyId.trim()) {
    return result([issue("missing_field", "policyId is required.", "policyId")]);
  }
  if (!isPolicyRuleBaseInitialized()) {
    return result([issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized.")]);
  }
  const exists = getPolicyRuleBaseRegistry().policies.some((entry) => entry.policyId === policyId);
  if (!exists) {
    return result([issue("invalid_policy_reference", `Policy not found: ${policyId}.`, "policyId")]);
  }
  return result([]);
}

export function validateIndustryModelReference(industryModelId: string): BestPracticeValidationResult {
  if (!industryModelId.trim()) {
    return result([issue("missing_field", "industryModelId is required.", "industryModelId")]);
  }
  if (!isIndustryModelsInitialized()) {
    return result([issue("industry_not_initialized", "KNL/5 Industry Models is not initialized.")]);
  }
  const exists = getIndustryModelsRegistry().models.some((entry) => entry.modelId === industryModelId);
  if (!exists) {
    return result([
      issue("invalid_industry_reference", `Industry model not found: ${industryModelId}.`, "industryModelId"),
    ]);
  }
  return result([]);
}

function validateOptionalReferences(input: BestPracticeRegistrationInput): BestPracticeValidationIssue[] {
  const issues: BestPracticeValidationIssue[] = [];
  if (input.ontologyEntityId) {
    const validation = validateOntologyReference(input.ontologyEntityId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.frameworkId) {
    const validation = validateFrameworkReference(input.frameworkId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.policyId) {
    const validation = validatePolicyReference(input.policyId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.industryModelId) {
    const validation = validateIndustryModelReference(input.industryModelId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  return issues;
}

export function validateBestPracticeRegistration(input: BestPracticeRegistrationInput): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!input.practiceId.trim()) {
    issues.push(issue("missing_field", "practiceId is required.", "practiceId"));
  }
  if (!isBestPracticeCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid best practice category key.", "categoryKey"));
  }
  const canonicalValidation = validateBestPracticeCanonicalNameFormat(input.canonicalName);
  if (!canonicalValidation.valid) issues.push(...canonicalValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isBestPracticeContextKey(input.contextKey)) {
    issues.push(issue("invalid_context", "Invalid best practice context key.", "contextKey"));
  }
  if (!input.principleLabel.trim()) {
    issues.push(issue("missing_field", "principleLabel is required.", "principleLabel"));
  }
  if (!input.guidelineLabel.trim()) {
    issues.push(issue("missing_field", "guidelineLabel is required.", "guidelineLabel"));
  }
  if (!input.recommendationDescription.trim()) {
    issues.push(issue("missing_field", "recommendationDescription is required.", "recommendationDescription"));
  }
  issues.push(...validateOptionalReferences(input));
  return result(issues);
}

export function validateBestPracticeTemplateRegistration(
  input: BestPracticeTemplateRegistrationInput,
  registeredPracticeIds: readonly string[]
): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!input.templateId.trim()) {
    issues.push(issue("missing_field", "templateId is required.", "templateId"));
  }
  if (!registeredPracticeIds.includes(input.practiceId)) {
    issues.push(issue("invalid_practice_reference", `Best practice not found: ${input.practiceId}.`, "practiceId"));
  }
  if (!isBestPracticeCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid best practice category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateBestPracticeCategoryRegistration(
  input: BestPracticeCategoryRegistrationInput
): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isBestPracticeCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid best practice category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateBestPracticeDependencyDeclarations(): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (BEST_PRACTICE_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/1."));
  }
  if (BEST_PRACTICE_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/2."));
  }
  if (BEST_PRACTICE_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/3."));
  }
  if (BEST_PRACTICE_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/4."));
  }
  if (BEST_PRACTICE_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/5."));
  }
  if (BEST_PRACTICE_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/6."));
  }
  if (BEST_PRACTICE_POLICY_DEPENDENCY !== "KNL/7") {
    issues.push(issue("invalid_dependency", "Best practice platform must depend on KNL/7."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependency(timestamp: string): BestPracticeValidationResult {
  const issues: BestPracticeValidationIssue[] = [];
  if (!isPolicyRuleBaseInitialized()) {
    issues.push(issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized."));
  }
  const report = validatePolicyRuleBase(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("policy_invalid", entry.message));
  }
  return result(issues);
}

export function validateBestPracticeContractVersion(): BestPracticeValidationResult {
  return validateBestPracticeVersionFormat(BEST_PRACTICE_CONTRACT_VERSION);
}

export function validateBestPracticeCoreNamespace(): BestPracticeValidationResult {
  return validateBestPracticeNamespaceFormat(BEST_PRACTICE_NAMESPACE);
}
