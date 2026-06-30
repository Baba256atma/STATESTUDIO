/**
 * KNL-1 — Knowledge Platform validation.
 */

import {
  KNOWLEDGE_CAPABILITY_KEYS,
  KNOWLEDGE_CATEGORY_KEYS,
  KNOWLEDGE_DOMAIN_KEYS,
  KNOWLEDGE_EXTENSION_POINT_KEYS,
  KNOWLEDGE_MANDATORY_REGISTRATION_FIELDS,
  KNOWLEDGE_NAMESPACE_KEYS,
  KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_ID,
  KNOWLEDGE_VERSION_PATTERN,
} from "./knowledgeConstants.ts";
import type {
  KnowledgeCapabilityRegistrationInput,
  KnowledgeCategoryRegistrationInput,
  KnowledgeDomainRegistrationInput,
  KnowledgeExtensionPointRegistrationInput,
  KnowledgeNamespaceRegistrationInput,
  KnowledgePlatformIdentity,
  KnowledgeProviderRegistrationInput,
  KnowledgeRegistration,
  KnowledgeValidationIssue,
  KnowledgeValidationResult,
} from "./knowledgeTypes.ts";

function issue(code: string, message: string, field?: string): KnowledgeValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgeValidationIssue[]): KnowledgeValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isKnowledgeDomainKey(value: string): value is (typeof KNOWLEDGE_DOMAIN_KEYS)[number] {
  return (KNOWLEDGE_DOMAIN_KEYS as readonly string[]).includes(value);
}

export function isKnowledgeCategoryKey(value: string): value is (typeof KNOWLEDGE_CATEGORY_KEYS)[number] {
  return (KNOWLEDGE_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isKnowledgeCapabilityKey(value: string): value is (typeof KNOWLEDGE_CAPABILITY_KEYS)[number] {
  return (KNOWLEDGE_CAPABILITY_KEYS as readonly string[]).includes(value);
}

export function isKnowledgeNamespaceKey(value: string): value is (typeof KNOWLEDGE_NAMESPACE_KEYS)[number] {
  return (KNOWLEDGE_NAMESPACE_KEYS as readonly string[]).includes(value);
}

export function isKnowledgeExtensionPointKey(value: string): value is (typeof KNOWLEDGE_EXTENSION_POINT_KEYS)[number] {
  return (KNOWLEDGE_EXTENSION_POINT_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateKnowledgeIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateKnowledgeVersionFormat(version: string): KnowledgeValidationResult {
  if (!KNOWLEDGE_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validatePlatformIdentity(identity: KnowledgePlatformIdentity): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (identity.layerId !== "KNL") {
    issues.push(issue("invalid_identity", "layerId must be KNL.", "layerId"));
  }
  if (identity.appId !== "KNL") {
    issues.push(issue("invalid_identity", "appId must be KNL.", "appId"));
  }
  if (identity.platformId !== KNOWLEDGE_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== KNOWLEDGE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

function validateMandatoryFields(
  record: Record<string, unknown>,
  fields: readonly string[],
  prefix: string
): KnowledgeValidationIssue[] {
  const issues: KnowledgeValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateKnowledgeRegistrationRecord(
  registration: KnowledgeRegistration
): KnowledgeValidationResult {
  const issues = validateMandatoryFields(
    registration as unknown as Record<string, unknown>,
    KNOWLEDGE_MANDATORY_REGISTRATION_FIELDS,
    "registration"
  );
  const versionValidation = validateKnowledgeVersionFormat(registration.version);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }
  if (!isKnowledgeCategoryKey(registration.registryType)) {
    issues.push(issue("invalid_registry_type", "Invalid registry type.", "registryType"));
  }
  return result(issues);
}

export function validateKnowledgeDomainRegistration(
  input: KnowledgeDomainRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.domainId.trim()) {
    issues.push(issue("missing_field", "domainId is required.", "domainId"));
  }
  if (!isKnowledgeDomainKey(input.domainKey)) {
    issues.push(issue("invalid_domain", "Invalid knowledge domain key.", "domainKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateKnowledgeProviderRegistration(
  input: KnowledgeProviderRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.providerId.trim()) {
    issues.push(issue("missing_field", "providerId is required.", "providerId"));
  }
  if (!input.namespaceId.trim()) {
    issues.push(issue("missing_field", "namespaceId is required.", "namespaceId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  return result(issues);
}

export function validateKnowledgeCapabilityRegistration(
  input: KnowledgeCapabilityRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.capabilityId.trim()) {
    issues.push(issue("missing_field", "capabilityId is required.", "capabilityId"));
  }
  if (!isKnowledgeCapabilityKey(input.capabilityKey)) {
    issues.push(issue("invalid_capability", "Invalid knowledge capability key.", "capabilityKey"));
  }
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
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isKnowledgeCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid knowledge category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeNamespaceRegistration(
  input: KnowledgeNamespaceRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.namespaceId.trim()) {
    issues.push(issue("missing_field", "namespaceId is required.", "namespaceId"));
  }
  if (!isKnowledgeNamespaceKey(input.namespaceKey)) {
    issues.push(issue("invalid_namespace", "Invalid knowledge namespace key.", "namespaceKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeExtensionPointRegistration(
  input: KnowledgeExtensionPointRegistrationInput
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!input.extensionPointId.trim()) {
    issues.push(issue("missing_field", "extensionPointId is required.", "extensionPointId"));
  }
  if (!isKnowledgeExtensionPointKey(input.extensionPointKey)) {
    issues.push(issue("invalid_extension_point", "Invalid extension point key.", "extensionPointKey"));
  }
  if (!input.phaseKey.trim()) {
    issues.push(issue("missing_field", "phaseKey is required.", "phaseKey"));
  }
  return result(issues);
}

export function validateDependencyDeclarations(
  dependencyVersions: Readonly<Record<string, string>>
): KnowledgeValidationResult {
  const issues: KnowledgeValidationIssue[] = [];
  if (!dependencyVersions["KNL/1"]) {
    issues.push(issue("missing_dependency", "KNL/1 foundation dependency is required."));
  }
  for (const [key, value] of Object.entries(dependencyVersions)) {
    if (!validateKnowledgeVersionFormat(value).valid && !key.startsWith("reserved-")) {
      issues.push(issue("invalid_dependency_version", `Invalid dependency version for ${key}.`));
    }
  }
  return result(issues);
}
