/**
 * KNL-2 — Business Ontology validation.
 */

import {
  BUSINESS_ENTITY_TYPE_KEYS,
  BUSINESS_ONTOLOGY_CATEGORY_KEYS,
  BUSINESS_ONTOLOGY_CAPABILITY_KEYS,
  BUSINESS_ONTOLOGY_CONTRACT_VERSION,
  BUSINESS_ONTOLOGY_FOUNDATION_DEPENDENCY,
  BUSINESS_ONTOLOGY_MANDATORY_METADATA_FIELDS,
  BUSINESS_ONTOLOGY_NAMESPACE,
  BUSINESS_ONTOLOGY_VERSION_PATTERN,
  BUSINESS_RELATIONSHIP_TYPE_KEYS,
} from "./businessOntologyCatalog.ts";
import type {
  BusinessCapabilityRegistrationInput,
  BusinessCategoryRegistrationInput,
  BusinessEntityRegistrationInput,
  BusinessMetadata,
  BusinessMetadataRegistrationInput,
  BusinessOntologyValidationIssue,
  BusinessOntologyValidationResult,
  BusinessRelationshipRegistrationInput,
} from "./businessOntologyTypes.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";

function issue(code: string, message: string, field?: string): BusinessOntologyValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessOntologyValidationIssue[]): BusinessOntologyValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isBusinessEntityTypeKey(value: string): value is (typeof BUSINESS_ENTITY_TYPE_KEYS)[number] {
  return (BUSINESS_ENTITY_TYPE_KEYS as readonly string[]).includes(value);
}

export function isBusinessRelationshipTypeKey(
  value: string
): value is (typeof BUSINESS_RELATIONSHIP_TYPE_KEYS)[number] {
  return (BUSINESS_RELATIONSHIP_TYPE_KEYS as readonly string[]).includes(value);
}

export function isBusinessOntologyCategoryKey(value: string): value is (typeof BUSINESS_ONTOLOGY_CATEGORY_KEYS)[number] {
  return (BUSINESS_ONTOLOGY_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isBusinessOntologyCapabilityKey(
  value: string
): value is (typeof BUSINESS_ONTOLOGY_CAPABILITY_KEYS)[number] {
  return (BUSINESS_ONTOLOGY_CAPABILITY_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateBusinessIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateBusinessNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validateBusinessOntologyVersionFormat(version: string): BusinessOntologyValidationResult {
  if (!BUSINESS_ONTOLOGY_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateBusinessOntologyNamespace(namespace: string): BusinessOntologyValidationResult {
  if (namespace !== BUSINESS_ONTOLOGY_NAMESPACE) {
    return result([issue("invalid_namespace", "Ontology namespace mismatch.", "namespace")]);
  }
  return result([]);
}

export function validateKnowledgeFoundationDependency(timestamp: string): BusinessOntologyValidationResult {
  const issues: BusinessOntologyValidationIssue[] = [];
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

function validateMandatoryMetadataFields(metadata: BusinessMetadata): BusinessOntologyValidationIssue[] {
  const issues: BusinessOntologyValidationIssue[] = [];
  for (const field of BUSINESS_ONTOLOGY_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof BusinessMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateBusinessOntologyNamespace(metadata.namespace);
  if (!namespaceValidation.valid) {
    issues.push(...namespaceValidation.issues);
  }
  const versionValidation = validateBusinessOntologyVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }
  return issues;
}

export function validateBusinessMetadataRecord(metadata: BusinessMetadata): BusinessOntologyValidationResult {
  return result(validateMandatoryMetadataFields(metadata));
}

export function validateBusinessEntityRegistration(
  input: BusinessEntityRegistrationInput
): BusinessOntologyValidationResult {
  const issues: BusinessOntologyValidationIssue[] = [];
  if (!input.entityId.trim()) {
    issues.push(issue("missing_field", "entityId is required.", "entityId"));
  }
  if (!isBusinessEntityTypeKey(input.entityType)) {
    issues.push(issue("invalid_entity_type", "Invalid business entity type.", "entityType"));
  }
  if (!input.name.trim()) {
    issues.push(issue("missing_field", "name is required.", "name"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isBusinessOntologyCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid ontology category key.", "categoryKey"));
  }
  return result(issues);
}

export function validateBusinessRelationshipRegistration(
  input: BusinessRelationshipRegistrationInput
): BusinessOntologyValidationResult {
  const issues: BusinessOntologyValidationIssue[] = [];
  if (!input.relationshipId.trim()) {
    issues.push(issue("missing_field", "relationshipId is required.", "relationshipId"));
  }
  if (!isBusinessRelationshipTypeKey(input.relationshipType)) {
    issues.push(issue("invalid_relationship", "Invalid relationship type.", "relationshipType"));
  }
  if (!input.sourceEntityId.trim()) {
    issues.push(issue("missing_field", "sourceEntityId is required.", "sourceEntityId"));
  }
  if (!input.targetEntityId.trim()) {
    issues.push(issue("missing_field", "targetEntityId is required.", "targetEntityId"));
  }
  if (input.sourceEntityId.trim() === input.targetEntityId.trim()) {
    issues.push(issue("invalid_relationship", "Relationship source and target must differ."));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateBusinessCapabilityRegistration(
  input: BusinessCapabilityRegistrationInput
): BusinessOntologyValidationResult {
  const issues: BusinessOntologyValidationIssue[] = [];
  if (!input.capabilityId.trim()) {
    issues.push(issue("missing_field", "capabilityId is required.", "capabilityId"));
  }
  if (!isBusinessOntologyCapabilityKey(input.capabilityKey)) {
    issues.push(issue("invalid_capability", "Invalid ontology capability key.", "capabilityKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateBusinessCategoryRegistration(
  input: BusinessCategoryRegistrationInput
): BusinessOntologyValidationResult {
  const issues: BusinessOntologyValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isBusinessOntologyCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid ontology category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateBusinessMetadataRegistration(
  input: BusinessMetadataRegistrationInput
): BusinessOntologyValidationResult {
  const issues: BusinessOntologyValidationIssue[] = [];
  if (!input.metadataId.trim()) {
    issues.push(issue("missing_field", "metadataId is required.", "metadataId"));
  }
  if (!input.owner.trim()) {
    issues.push(issue("missing_field", "owner is required.", "owner"));
  }
  return result(issues);
}

export function validateBusinessOntologyDependencyDeclarations(): BusinessOntologyValidationResult {
  if (BUSINESS_ONTOLOGY_FOUNDATION_DEPENDENCY !== "KNL/1") {
    return result([issue("invalid_dependency", "Business Ontology must depend on KNL/1 only.")]);
  }
  return result([]);
}

export function validateBusinessOntologyContractVersion(): BusinessOntologyValidationResult {
  return validateBusinessOntologyVersionFormat(BUSINESS_ONTOLOGY_CONTRACT_VERSION);
}
