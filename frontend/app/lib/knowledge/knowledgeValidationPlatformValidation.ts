/**
 * KNL-10 — Knowledge Validation Platform validation.
 */

import {
  KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
  VALIDATION_DEPENDENCY_KEYS,
  KNOWLEDGE_VALIDATION_FOUNDATION_DEPENDENCY,
  KNOWLEDGE_VALIDATION_BEST_PRACTICE_DEPENDENCY,
  KNOWLEDGE_VALIDATION_FRAMEWORK_DEPENDENCY,
  KNOWLEDGE_VALIDATION_GRAPH_DEPENDENCY,
  KNOWLEDGE_VALIDATION_INDUSTRY_DEPENDENCY,
  KNOWLEDGE_VALIDATION_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_VALIDATION_NAMESPACE,
  KNOWLEDGE_VALIDATION_NAMESPACE_PATTERN,
  KNOWLEDGE_VALIDATION_ONTOLOGY_DEPENDENCY,
  KNOWLEDGE_VALIDATION_POLICY_DEPENDENCY,
  KNOWLEDGE_VALIDATION_PROFILE_NAME_PATTERN,
  KNOWLEDGE_VALIDATION_RETRIEVAL_DEPENDENCY,
  KNOWLEDGE_VALIDATION_VERSION_PATTERN,
  KNOWLEDGE_VALIDATION_VOCABULARY_DEPENDENCY,
  VALIDATION_CATEGORY_KEYS,
  VALIDATION_PLATFORM_ID_MAP,
  VALIDATION_PROFILE_KEYS,
  VALIDATION_PROFILE_TARGET_MAP,
  VALIDATION_SCOPE_KEYS,
  VALIDATION_SEVERITY_KEYS,
  VALIDATION_STATUS_KEYS,
  VALIDATION_TARGET_KEYS,
} from "./knowledgeValidationPlatformCatalog.ts";
import type {
  KnowledgeValidationCategoryRegistrationInput,
  KnowledgeValidationPlatformValidationReport,
  KnowledgeValidationProfileRegistrationInput,
  KnowledgeValidationRuleRegistrationInput,
  KnowledgeValidationIssue,
  KnowledgeValidationResult,
  ValidationMetadata,
} from "./knowledgeValidationPlatformTypes.ts";
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
import { validateKnowledgeRetrievalEngine } from "./knowledgeRetrievalContracts.ts";
import { isKnowledgeRetrievalEngineInitialized } from "./knowledgeRetrievalRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";
import { validatePolicyRuleBase } from "./policyRuleContracts.ts";
import { isPolicyRuleBaseInitialized } from "./policyRuleRegistry.ts";

function issue(code: string, message: string, field?: string): KnowledgeValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgeValidationIssue[]): KnowledgeValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isValidationProfileKey(value: string): value is (typeof VALIDATION_PROFILE_KEYS)[number] {
  return (VALIDATION_PROFILE_KEYS as readonly string[]).includes(value);
}

export function isValidationCategoryKey(value: string): value is (typeof VALIDATION_CATEGORY_KEYS)[number] {
  return (VALIDATION_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isValidationScopeKey(value: string): value is (typeof VALIDATION_SCOPE_KEYS)[number] {
  return (VALIDATION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isValidationTargetKey(value: string): value is (typeof VALIDATION_TARGET_KEYS)[number] {
  return (VALIDATION_TARGET_KEYS as readonly string[]).includes(value);
}

export function isValidationSeverityKey(value: string): value is (typeof VALIDATION_SEVERITY_KEYS)[number] {
  return (VALIDATION_SEVERITY_KEYS as readonly string[]).includes(value);
}

export function isValidationStatusKey(value: string): value is (typeof VALIDATION_STATUS_KEYS)[number] {
  return (VALIDATION_STATUS_KEYS as readonly string[]).includes(value);
}

export function isValidationDependencyKey(value: string): value is (typeof VALIDATION_DEPENDENCY_KEYS)[number] {
  return (VALIDATION_DEPENDENCY_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateValidationIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateProfileNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function hasDuplicateRuleIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateNamespaceKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function validateKnowledgeValidationVersionFormat(version: string): KnowledgeValidationResult {
  if (!KNOWLEDGE_VALIDATION_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateKnowledgeValidationNamespaceFormat(namespace: string): KnowledgeValidationResult {
  if (!KNOWLEDGE_VALIDATION_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Validation namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateProfileNameFormat(profileName: string): KnowledgeValidationResult {
  if (!KNOWLEDGE_VALIDATION_PROFILE_NAME_PATTERN.test(profileName)) {
    return result([issue("invalid_profile_name", "Profile name must be lowercase snake_case.", "profileName")]);
  }
  return result([]);
}

export function validateValidationMetadataRecord(metadata: ValidationMetadata): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  for (const field of KNOWLEDGE_VALIDATION_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof ValidationMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgeValidationNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgeValidationVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validatePlatformReference(
  profileKey: string,
  platformId: string
): KnowledgeValidationResult {
  if (!isValidationProfileKey(profileKey)) {
    return result([issue("invalid_profile", "Invalid validation profile key.", "profileKey")]);
  }
  const expected = VALIDATION_PLATFORM_ID_MAP[profileKey];
  if (platformId !== expected) {
    return result([
      issue("invalid_platform_reference", `Platform id must be ${expected} for ${profileKey}.`, "platformId"),
    ]);
  }
  return result([]);
}

export function validateDependencyReference(dependencyKey: string): KnowledgeValidationResult {
  if (!isValidationDependencyKey(dependencyKey)) {
    return result([issue("invalid_dependency_reference", `Invalid dependency key: ${dependencyKey}.`, "dependencyKey")]);
  }
  return result([]);
}

export function validateTargetReference(targetKey: string): KnowledgeValidationResult {
  if (!isValidationTargetKey(targetKey)) {
    return result([issue("invalid_target_reference", `Invalid validation target key: ${targetKey}.`, "targetKey")]);
  }
  return result([]);
}

export function validateKnowledgeValidationProfileRegistration(
  input: KnowledgeValidationProfileRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.profileId.trim()) {
    issues.push(issue("missing_field", "profileId is required.", "profileId"));
  }
  if (!isValidationProfileKey(input.profileKey)) {
    issues.push(issue("invalid_profile", "Invalid validation profile key.", "profileKey"));
  }
  const profileNameValidation = validateProfileNameFormat(input.profileName);
  if (!profileNameValidation.valid) issues.push(...profileNameValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isValidationCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid validation category key.", "categoryKey"));
  }
  if (!isValidationScopeKey(input.scopeKey)) {
    issues.push(issue("invalid_scope", "Invalid validation scope key.", "scopeKey"));
  }
  const targetValidation = validateTargetReference(input.targetKey);
  if (!targetValidation.valid) issues.push(...targetValidation.issues);
  if (isValidationProfileKey(input.profileKey) && input.targetKey !== VALIDATION_PROFILE_TARGET_MAP[input.profileKey]) {
    issues.push(
      issue(
        "invalid_target_reference",
        `Target key must be ${VALIDATION_PROFILE_TARGET_MAP[input.profileKey]} for ${input.profileKey}.`,
        "targetKey"
      )
    );
  }
  const dependencyValidation = validateDependencyReference(input.dependencyKey);
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);
  const platformValidation = validatePlatformReference(input.profileKey, input.platformId);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (!isValidationStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid validation status.", "status"));
  }
  if (!input.resultDescriptorLabel.trim()) {
    issues.push(issue("missing_field", "resultDescriptorLabel is required.", "resultDescriptorLabel"));
  }
  return result(issues);
}

export function validateKnowledgeValidationRuleRegistration(
  input: KnowledgeValidationRuleRegistrationInput,
  registeredProfileIds: readonly string[]
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.ruleId.trim()) {
    issues.push(issue("missing_field", "ruleId is required.", "ruleId"));
  }
  if (!registeredProfileIds.includes(input.profileId)) {
    issues.push(issue("invalid_profile_reference", `Validation profile not found: ${input.profileId}.`, "profileId"));
  }
  if (!isValidationProfileKey(input.profileKey)) {
    issues.push(issue("invalid_profile", "Invalid validation profile key.", "profileKey"));
  }
  const ruleNameValidation = validateProfileNameFormat(input.ruleName);
  if (!ruleNameValidation.valid) issues.push(...ruleNameValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isValidationCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid validation category key.", "categoryKey"));
  }
  if (!isValidationScopeKey(input.scopeKey)) {
    issues.push(issue("invalid_scope", "Invalid validation scope key.", "scopeKey"));
  }
  if (!isValidationSeverityKey(input.severity)) {
    issues.push(issue("invalid_severity", "Invalid validation severity.", "severity"));
  }
  if (!isValidationStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid validation status.", "status"));
  }
  return result(issues);
}

export function validateKnowledgeValidationCategoryRegistration(
  input: KnowledgeValidationCategoryRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isValidationCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid validation category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeValidationDependencyDeclarations(): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (KNOWLEDGE_VALIDATION_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/1."));
  }
  if (KNOWLEDGE_VALIDATION_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/2."));
  }
  if (KNOWLEDGE_VALIDATION_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/3."));
  }
  if (KNOWLEDGE_VALIDATION_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/4."));
  }
  if (KNOWLEDGE_VALIDATION_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/5."));
  }
  if (KNOWLEDGE_VALIDATION_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/6."));
  }
  if (KNOWLEDGE_VALIDATION_POLICY_DEPENDENCY !== "KNL/7") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/7."));
  }
  if (KNOWLEDGE_VALIDATION_BEST_PRACTICE_DEPENDENCY !== "KNL/8") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/8."));
  }
  if (KNOWLEDGE_VALIDATION_RETRIEVAL_DEPENDENCY !== "KNL/9") {
    issues.push(issue("invalid_dependency", "Knowledge validation platform must depend on KNL/9."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isPolicyRuleBaseInitialized()) {
    issues.push(issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized."));
  }
  const report = validatePolicyRuleBase(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("policy_invalid", entry.message));
  }
  return result(issues);
}

export function validateBestPracticePlatformDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isBestPracticePlatformInitialized()) {
    issues.push(issue("best_practice_not_initialized", "KNL/8 Best Practices is not initialized."));
  }
  const report = validateBestPracticePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("best_practice_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeRetrievalEngineDependency(timestamp: string): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!isKnowledgeRetrievalEngineInitialized()) {
    issues.push(issue("retrieval_not_initialized", "KNL/9 Knowledge Retrieval Engine is not initialized."));
  }
  const report = validateKnowledgeRetrievalEngine(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("retrieval_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeValidationContractVersion(): KnowledgeValidationResult {
  return validateKnowledgeValidationVersionFormat(KNOWLEDGE_VALIDATION_CONTRACT_VERSION);
}

export function validateKnowledgeValidationCoreNamespace(): KnowledgeValidationResult {
  return validateKnowledgeValidationNamespaceFormat(KNOWLEDGE_VALIDATION_NAMESPACE);
}

export type { KnowledgeValidationPlatformValidationReport };
