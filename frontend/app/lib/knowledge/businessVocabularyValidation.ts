/**
 * KNL-3 — Business Vocabulary validation.
 */

import {
  BUSINESS_VOCABULARY_CANONICAL_NAME_PATTERN,
  BUSINESS_VOCABULARY_CATEGORY_KEYS,
  BUSINESS_VOCABULARY_CONTRACT_VERSION,
  BUSINESS_VOCABULARY_DOMAIN_KEYS,
  BUSINESS_VOCABULARY_FOUNDATION_DEPENDENCY,
  BUSINESS_VOCABULARY_LANGUAGE_CODE_PATTERN,
  BUSINESS_VOCABULARY_MANDATORY_METADATA_FIELDS,
  BUSINESS_VOCABULARY_NAMESPACE,
  BUSINESS_VOCABULARY_ONTOLOGY_DEPENDENCY,
  BUSINESS_VOCABULARY_SOURCE_KEYS,
  BUSINESS_VOCABULARY_STATUS_KEYS,
  BUSINESS_VOCABULARY_VERSION_PATTERN,
} from "./businessVocabularyCatalog.ts";
import type {
  VocabularyAcronymRegistrationInput,
  VocabularyAliasRegistrationInput,
  VocabularyMetadata,
  VocabularyTermRegistrationInput,
  VocabularyValidationIssue,
  VocabularyValidationResult,
} from "./businessVocabularyTypes.ts";
import { validateBusinessOntology } from "./businessOntologyContracts.ts";
import { getBusinessOntologyRegistry, isBusinessOntologyInitialized } from "./businessOntologyRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";

function issue(code: string, message: string, field?: string): VocabularyValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: VocabularyValidationIssue[]): VocabularyValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isVocabularyCategoryKey(value: string): value is (typeof BUSINESS_VOCABULARY_CATEGORY_KEYS)[number] {
  return (BUSINESS_VOCABULARY_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isVocabularyDomainKey(value: string): value is (typeof BUSINESS_VOCABULARY_DOMAIN_KEYS)[number] {
  return (BUSINESS_VOCABULARY_DOMAIN_KEYS as readonly string[]).includes(value);
}

export function isVocabularyStatusKey(value: string): value is (typeof BUSINESS_VOCABULARY_STATUS_KEYS)[number] {
  return (BUSINESS_VOCABULARY_STATUS_KEYS as readonly string[]).includes(value);
}

export function isVocabularySourceKey(value: string): value is (typeof BUSINESS_VOCABULARY_SOURCE_KEYS)[number] {
  return (BUSINESS_VOCABULARY_SOURCE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateVocabularyIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateCanonicalNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function hasDuplicateAliases(aliases: readonly string[]): boolean {
  const normalized = aliases.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validateVocabularyVersionFormat(version: string): VocabularyValidationResult {
  if (!BUSINESS_VOCABULARY_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateVocabularyNamespace(namespace: string): VocabularyValidationResult {
  if (namespace !== BUSINESS_VOCABULARY_NAMESPACE) {
    return result([issue("invalid_namespace", "Vocabulary namespace mismatch.", "namespace")]);
  }
  return result([]);
}

export function validateLanguageCodeFormat(languageCode: string): VocabularyValidationResult {
  if (!BUSINESS_VOCABULARY_LANGUAGE_CODE_PATTERN.test(languageCode)) {
    return result([issue("invalid_language_code", "Language code must match ISO-style format (e.g. en, en-US).", "languageCode")]);
  }
  return result([]);
}

export function validateCanonicalNameFormat(canonicalName: string): VocabularyValidationResult {
  if (!BUSINESS_VOCABULARY_CANONICAL_NAME_PATTERN.test(canonicalName)) {
    return result([
      issue("invalid_canonical_name", "Canonical name must be lowercase snake_case.", "canonicalName"),
    ]);
  }
  return result([]);
}

export function validateVocabularyMetadataRecord(metadata: VocabularyMetadata): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  for (const field of BUSINESS_VOCABULARY_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof VocabularyMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateVocabularyNamespace(metadata.namespace);
  if (!namespaceValidation.valid) {
    issues.push(...namespaceValidation.issues);
  }
  const versionValidation = validateVocabularyVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }
  return result(issues);
}

export function validateOntologyEntityReference(entityId: string): VocabularyValidationResult {
  if (!entityId.trim()) {
    return result([issue("missing_field", "ontologyEntityId is required.", "ontologyEntityId")]);
  }
  if (!isBusinessOntologyInitialized()) {
    return result([issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized.")]);
  }
  const registry = getBusinessOntologyRegistry();
  const exists = registry.entities.some((entry) => entry.entityId === entityId);
  if (!exists) {
    return result([issue("invalid_ontology_reference", `Ontology entity not found: ${entityId}.`, "ontologyEntityId")]);
  }
  return result([]);
}

export function validateOntologyRelationshipReference(relationshipId: string): VocabularyValidationResult {
  if (!relationshipId.trim()) {
    return result([issue("missing_field", "relationshipId is required.", "relationshipId")]);
  }
  if (!isBusinessOntologyInitialized()) {
    return result([issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized.")]);
  }
  const registry = getBusinessOntologyRegistry();
  const exists = registry.relationships.some((entry) => entry.relationshipId === relationshipId);
  if (!exists) {
    return result([
      issue("invalid_relationship_reference", `Ontology relationship not found: ${relationshipId}.`, "relationshipId"),
    ]);
  }
  return result([]);
}

export function validateVocabularyTermRegistration(input: VocabularyTermRegistrationInput): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  if (!input.termId.trim()) {
    issues.push(issue("missing_field", "termId is required.", "termId"));
  }
  const canonicalValidation = validateCanonicalNameFormat(input.canonicalName);
  if (!canonicalValidation.valid) {
    issues.push(...canonicalValidation.issues);
  }
  if (!input.displayName.trim()) {
    issues.push(issue("missing_field", "displayName is required.", "displayName"));
  }
  if (!input.preferredLabel.trim()) {
    issues.push(issue("missing_field", "preferredLabel is required.", "preferredLabel"));
  }
  if (!input.businessDefinition.trim()) {
    issues.push(issue("missing_field", "businessDefinition is required.", "businessDefinition"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isVocabularyCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid vocabulary category key.", "categoryKey"));
  }
  if (!isVocabularyDomainKey(input.domainKey)) {
    issues.push(issue("invalid_domain", "Invalid vocabulary domain key.", "domainKey"));
  }
  const languageValidation = validateLanguageCodeFormat(input.languageCode);
  if (!languageValidation.valid) {
    issues.push(...languageValidation.issues);
  }
  if (!isVocabularyStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid vocabulary status.", "status"));
  }
  if (!isVocabularySourceKey(input.sourceKey)) {
    issues.push(issue("invalid_source", "Invalid vocabulary source.", "sourceKey"));
  }
  if (input.ontologyEntityId) {
    const ontologyValidation = validateOntologyEntityReference(input.ontologyEntityId);
    if (!ontologyValidation.valid) {
      issues.push(...ontologyValidation.issues);
    }
  }
  if (input.relationshipId) {
    const relationshipValidation = validateOntologyRelationshipReference(input.relationshipId);
    if (!relationshipValidation.valid) {
      issues.push(...relationshipValidation.issues);
    }
  }
  return result(issues);
}

export function validateVocabularyAliasRegistration(input: VocabularyAliasRegistrationInput): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  if (!input.aliasId.trim()) {
    issues.push(issue("missing_field", "aliasId is required.", "aliasId"));
  }
  if (!input.termId.trim()) {
    issues.push(issue("missing_field", "termId is required.", "termId"));
  }
  if (!input.alias.trim()) {
    issues.push(issue("missing_field", "alias is required.", "alias"));
  }
  const languageValidation = validateLanguageCodeFormat(input.languageCode);
  if (!languageValidation.valid) {
    issues.push(...languageValidation.issues);
  }
  return result(issues);
}

export function validateVocabularyAcronymRegistration(
  input: VocabularyAcronymRegistrationInput
): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  if (!input.acronymId.trim()) {
    issues.push(issue("missing_field", "acronymId is required.", "acronymId"));
  }
  if (!input.termId.trim()) {
    issues.push(issue("missing_field", "termId is required.", "termId"));
  }
  if (!input.acronym.trim()) {
    issues.push(issue("missing_field", "acronym is required.", "acronym"));
  }
  if (!input.expandedForm.trim()) {
    issues.push(issue("missing_field", "expandedForm is required.", "expandedForm"));
  }
  return result(issues);
}

export function validateVocabularyDependencyDeclarations(): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  if (BUSINESS_VOCABULARY_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Vocabulary must depend on KNL/1."));
  }
  if (BUSINESS_VOCABULARY_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Vocabulary must depend on KNL/2."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const foundationReport = validateKnowledgeFoundation(timestamp);
  if (!foundationReport.valid) {
    for (const entry of foundationReport.issues) {
      issues.push(issue("foundation_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): VocabularyValidationResult {
  const issues: VocabularyValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const ontologyReport = validateBusinessOntology(timestamp);
  if (!ontologyReport.valid) {
    for (const entry of ontologyReport.issues) {
      issues.push(issue("ontology_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateVocabularyContractVersion(): VocabularyValidationResult {
  return validateVocabularyVersionFormat(BUSINESS_VOCABULARY_CONTRACT_VERSION);
}
