/**
 * KNL-6 — Framework Library validation.
 */

import {
  FRAMEWORK_CANONICAL_NAME_PATTERN,
  FRAMEWORK_CATEGORY_KEYS,
  FRAMEWORK_KEYS,
  FRAMEWORK_LIBRARY_CONTRACT_VERSION,
  FRAMEWORK_LIBRARY_FOUNDATION_DEPENDENCY,
  FRAMEWORK_LIBRARY_GRAPH_DEPENDENCY,
  FRAMEWORK_LIBRARY_INDUSTRY_DEPENDENCY,
  FRAMEWORK_LIBRARY_MANDATORY_METADATA_FIELDS,
  FRAMEWORK_LIBRARY_NAMESPACE,
  FRAMEWORK_LIBRARY_NAMESPACE_PATTERN,
  FRAMEWORK_LIBRARY_ONTOLOGY_DEPENDENCY,
  FRAMEWORK_LIBRARY_VERSION_PATTERN,
  FRAMEWORK_LIBRARY_VOCABULARY_DEPENDENCY,
} from "./frameworkLibraryCatalog.ts";
import type {
  FrameworkCategoryRegistrationInput,
  FrameworkMetadata,
  FrameworkRegistrationInput,
  FrameworkTemplateRegistrationInput,
  FrameworkValidationIssue,
  FrameworkValidationResult,
} from "./frameworkLibraryTypes.ts";
import { validateBusinessOntology } from "./businessOntologyContracts.ts";
import { getBusinessOntologyRegistry, isBusinessOntologyInitialized } from "./businessOntologyRegistry.ts";
import { validateBusinessVocabulary } from "./businessVocabularyContracts.ts";
import { getBusinessVocabularyRegistry, isBusinessVocabularyInitialized } from "./businessVocabularyRegistry.ts";
import { validateIndustryModels } from "./industryModelContracts.ts";
import { getIndustryModelsRegistry, isIndustryModelsInitialized } from "./industryModelRegistry.ts";
import { validateKnowledgeGraph } from "./knowledgeGraphContracts.ts";
import { isKnowledgeGraphInitialized } from "./knowledgeGraphRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";

function issue(code: string, message: string, field?: string): FrameworkValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: FrameworkValidationIssue[]): FrameworkValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isFrameworkKey(value: string): value is (typeof FRAMEWORK_KEYS)[number] {
  return (FRAMEWORK_KEYS as readonly string[]).includes(value);
}

export function isFrameworkCategoryKey(value: string): value is (typeof FRAMEWORK_CATEGORY_KEYS)[number] {
  return (FRAMEWORK_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateFrameworkIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateFrameworkNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validateFrameworkVersionFormat(version: string): FrameworkValidationResult {
  if (!FRAMEWORK_LIBRARY_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateFrameworkNamespaceFormat(namespace: string): FrameworkValidationResult {
  if (!FRAMEWORK_LIBRARY_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Framework namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateCanonicalNameFormat(canonicalName: string): FrameworkValidationResult {
  if (!FRAMEWORK_CANONICAL_NAME_PATTERN.test(canonicalName)) {
    return result([issue("invalid_canonical_name", "Canonical name must be lowercase snake_case.", "canonicalName")]);
  }
  return result([]);
}

export function validateFrameworkMetadataRecord(metadata: FrameworkMetadata): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  for (const field of FRAMEWORK_LIBRARY_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof FrameworkMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateFrameworkNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateFrameworkVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validateOntologyReference(entityId: string): FrameworkValidationResult {
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

export function validateVocabularyReference(termId: string): FrameworkValidationResult {
  if (!termId.trim()) {
    return result([issue("missing_field", "vocabularyTermId is required.", "vocabularyTermId")]);
  }
  if (!isBusinessVocabularyInitialized()) {
    return result([issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized.")]);
  }
  const exists = getBusinessVocabularyRegistry().terms.some((entry) => entry.termId === termId);
  if (!exists) {
    return result([issue("invalid_vocabulary_reference", `Vocabulary term not found: ${termId}.`, "vocabularyTermId")]);
  }
  return result([]);
}

export function validateIndustryModelReference(modelId: string): FrameworkValidationResult {
  if (!modelId.trim()) {
    return result([issue("missing_field", "industryModelId is required.", "industryModelId")]);
  }
  if (!isIndustryModelsInitialized()) {
    return result([issue("industry_not_initialized", "KNL/5 Industry Models is not initialized.")]);
  }
  const exists = getIndustryModelsRegistry().models.some((entry) => entry.modelId === modelId);
  if (!exists) {
    return result([issue("invalid_industry_reference", `Industry model not found: ${modelId}.`, "industryModelId")]);
  }
  return result([]);
}

function validateOptionalReferences(input: {
  ontologyEntityId?: string;
  vocabularyTermId?: string;
  industryModelId?: string;
}): FrameworkValidationIssue[] {
  const issues: FrameworkValidationIssue[] = [];
  if (input.ontologyEntityId) {
    const validation = validateOntologyReference(input.ontologyEntityId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.vocabularyTermId) {
    const validation = validateVocabularyReference(input.vocabularyTermId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.industryModelId) {
    const validation = validateIndustryModelReference(input.industryModelId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  return issues;
}

export function validateFrameworkRegistration(input: FrameworkRegistrationInput): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!input.frameworkId.trim()) {
    issues.push(issue("missing_field", "frameworkId is required.", "frameworkId"));
  }
  if (!isFrameworkKey(input.frameworkKey)) {
    issues.push(issue("invalid_framework", "Invalid framework key.", "frameworkKey"));
  }
  const canonicalValidation = validateCanonicalNameFormat(input.canonicalName);
  if (!canonicalValidation.valid) issues.push(...canonicalValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isFrameworkCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid framework category key.", "categoryKey"));
  }
  issues.push(...validateOptionalReferences(input));
  return result(issues);
}

export function validateFrameworkTemplateRegistration(
  input: FrameworkTemplateRegistrationInput,
  registeredFrameworkIds: readonly string[]
): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!input.templateId.trim()) {
    issues.push(issue("missing_field", "templateId is required.", "templateId"));
  }
  if (!registeredFrameworkIds.includes(input.frameworkId)) {
    issues.push(issue("invalid_framework_reference", `Framework not found: ${input.frameworkId}.`, "frameworkId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isFrameworkCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid framework category key.", "categoryKey"));
  }
  return result(issues);
}

export function validateFrameworkCategoryRegistration(
  input: FrameworkCategoryRegistrationInput
): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isFrameworkCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid framework category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateFrameworkDependencyDeclarations(): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (FRAMEWORK_LIBRARY_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Framework library must depend on KNL/1."));
  }
  if (FRAMEWORK_LIBRARY_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Framework library must depend on KNL/2."));
  }
  if (FRAMEWORK_LIBRARY_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Framework library must depend on KNL/3."));
  }
  if (FRAMEWORK_LIBRARY_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Framework library must depend on KNL/4."));
  }
  if (FRAMEWORK_LIBRARY_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Framework library must depend on KNL/5."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): FrameworkValidationResult {
  const issues: FrameworkValidationIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkContractVersion(): FrameworkValidationResult {
  return validateFrameworkVersionFormat(FRAMEWORK_LIBRARY_CONTRACT_VERSION);
}

export function validateFrameworkCoreNamespace(): FrameworkValidationResult {
  return validateFrameworkNamespaceFormat(FRAMEWORK_LIBRARY_NAMESPACE);
}
