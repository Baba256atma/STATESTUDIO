/**
 * KNL-11 — Knowledge Versioning Platform validation.
 */

import {
  KNOWLEDGE_VERSIONING_BEST_PRACTICE_DEPENDENCY,
  KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
  KNOWLEDGE_VERSIONING_FOUNDATION_DEPENDENCY,
  KNOWLEDGE_VERSIONING_FRAMEWORK_DEPENDENCY,
  KNOWLEDGE_VERSIONING_GRAPH_DEPENDENCY,
  KNOWLEDGE_VERSIONING_INDUSTRY_DEPENDENCY,
  KNOWLEDGE_VERSIONING_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_VERSIONING_NAMESPACE,
  KNOWLEDGE_VERSIONING_NAMESPACE_PATTERN,
  KNOWLEDGE_VERSIONING_ONTOLOGY_DEPENDENCY,
  KNOWLEDGE_VERSIONING_POLICY_DEPENDENCY,
  KNOWLEDGE_VERSIONING_RETRIEVAL_DEPENDENCY,
  KNOWLEDGE_VERSIONING_VALIDATION_DEPENDENCY,
  KNOWLEDGE_VERSIONING_VERSION_PATTERN,
  KNOWLEDGE_VERSIONING_VOCABULARY_DEPENDENCY,
  VERSION_DEPENDENCY_KEYS,
  VERSIONED_ASSET_KNL_VERSION_MAP,
  VERSIONED_ASSET_KEYS,
  VERSIONED_ASSET_NAME_PATTERN,
  VERSIONED_ASSET_PLATFORM_ID_MAP,
  VERSION_SCOPE_KEYS,
  VERSION_STATUS_KEYS,
} from "./knowledgeVersioningCatalog.ts";
import type {
  KnowledgeVersionCompatibilityRegistrationInput,
  KnowledgeVersionRegistrationInput,
  KnowledgeVersioningIssue,
  KnowledgeVersioningValidationResult,
  VersionMetadata,
  VersionedKnowledgeAssetRegistrationInput,
} from "./knowledgeVersioningTypes.ts";
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
import { validateKnowledgeValidationPlatform } from "./knowledgeValidationPlatformContracts.ts";
import { isKnowledgeValidationPlatformInitialized } from "./knowledgeValidationPlatformRegistry.ts";
import { validatePolicyRuleBase } from "./policyRuleContracts.ts";
import { isPolicyRuleBaseInitialized } from "./policyRuleRegistry.ts";

function issue(code: string, message: string, field?: string): KnowledgeVersioningIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgeVersioningIssue[]): KnowledgeVersioningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isVersionedAssetKey(value: string): value is (typeof VERSIONED_ASSET_KEYS)[number] {
  return (VERSIONED_ASSET_KEYS as readonly string[]).includes(value);
}

export function isVersionScopeKey(value: string): value is (typeof VERSION_SCOPE_KEYS)[number] {
  return (VERSION_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isVersionStatusKey(value: string): value is (typeof VERSION_STATUS_KEYS)[number] {
  return (VERSION_STATUS_KEYS as readonly string[]).includes(value);
}

export function isVersionDependencyKey(value: string): value is (typeof VERSION_DEPENDENCY_KEYS)[number] {
  return (VERSION_DEPENDENCY_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateVersionIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateAssetIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateReleaseIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateAssetNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validateKnowledgeVersioningVersionFormat(version: string): KnowledgeVersioningValidationResult {
  if (!KNOWLEDGE_VERSIONING_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateKnowledgeVersioningNamespaceFormat(namespace: string): KnowledgeVersioningValidationResult {
  if (!KNOWLEDGE_VERSIONING_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Version namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateAssetNameFormat(assetName: string): KnowledgeVersioningValidationResult {
  if (!VERSIONED_ASSET_NAME_PATTERN.test(assetName)) {
    return result([issue("invalid_asset_name", "Asset name must be lowercase snake_case.", "assetName")]);
  }
  return result([]);
}

export function validateVersionMetadataRecord(metadata: VersionMetadata): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  for (const field of KNOWLEDGE_VERSIONING_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof VersionMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgeVersioningNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgeVersioningVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validatePlatformReference(assetKey: string, platformId: string): KnowledgeVersioningValidationResult {
  if (!isVersionedAssetKey(assetKey)) {
    return result([issue("invalid_asset", "Invalid versioned asset key.", "assetKey")]);
  }
  const expected = VERSIONED_ASSET_PLATFORM_ID_MAP[assetKey];
  if (platformId !== expected) {
    return result([
      issue("invalid_platform_reference", `Platform id must be ${expected} for ${assetKey}.`, "platformId"),
    ]);
  }
  return result([]);
}

export function validateDependencyReference(
  assetKey: string,
  versionLabel: string
): KnowledgeVersioningValidationResult {
  if (!isVersionedAssetKey(assetKey)) {
    return result([issue("invalid_asset", "Invalid versioned asset key.", "assetKey")]);
  }
  const versionValidation = validateKnowledgeVersioningVersionFormat(versionLabel);
  if (!versionValidation.valid) return versionValidation;
  const expected = VERSIONED_ASSET_KNL_VERSION_MAP[assetKey];
  if (versionLabel !== expected) {
    return result([
      issue("invalid_dependency_reference", `Version label must be ${expected} for ${assetKey}.`, "versionLabel"),
    ]);
  }
  return result([]);
}

export function validateCompatibilityReference(
  compatibleWithVersion: string,
  registeredVersionLabels: readonly string[]
): KnowledgeVersioningValidationResult {
  const versionValidation = validateKnowledgeVersioningVersionFormat(compatibleWithVersion);
  if (!versionValidation.valid) return versionValidation;
  if (!registeredVersionLabels.includes(compatibleWithVersion)) {
    return result([
      issue(
        "invalid_compatibility_reference",
        `Compatible version not registered: ${compatibleWithVersion}.`,
        "compatibleWithVersion"
      ),
    ]);
  }
  return result([]);
}

export function validateKnowledgeVersionRegistration(
  input: KnowledgeVersionRegistrationInput
): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!input.versionId.trim()) {
    issues.push(issue("missing_field", "versionId is required.", "versionId"));
  }
  if (!isVersionedAssetKey(input.assetKey)) {
    issues.push(issue("invalid_asset", "Invalid versioned asset key.", "assetKey"));
  }
  const versionValidation = validateKnowledgeVersioningVersionFormat(input.versionLabel);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  const platformValidation = validatePlatformReference(input.assetKey, input.platformId);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (isVersionedAssetKey(input.assetKey)) {
    const dependencyValidation = validateDependencyReference(input.assetKey, input.versionLabel);
    if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);
  }
  if (!isVersionScopeKey(input.scopeKey)) {
    issues.push(issue("invalid_scope", "Invalid version scope key.", "scopeKey"));
  }
  if (!isVersionStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid version status.", "status"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateVersionedKnowledgeAssetRegistration(
  input: VersionedKnowledgeAssetRegistrationInput
): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!input.assetId.trim()) {
    issues.push(issue("missing_field", "assetId is required.", "assetId"));
  }
  if (!isVersionedAssetKey(input.assetKey)) {
    issues.push(issue("invalid_asset", "Invalid versioned asset key.", "assetKey"));
  }
  const assetNameValidation = validateAssetNameFormat(input.assetName);
  if (!assetNameValidation.valid) issues.push(...assetNameValidation.issues);
  const platformValidation = validatePlatformReference(input.assetKey, input.platformId);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  const versionValidation = validateKnowledgeVersioningVersionFormat(input.versionLabel);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  if (isVersionedAssetKey(input.assetKey)) {
    const dependencyValidation = validateDependencyReference(input.assetKey, input.versionLabel);
    if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);
  }
  if (!isVersionScopeKey(input.scopeKey)) {
    issues.push(issue("invalid_scope", "Invalid version scope key.", "scopeKey"));
  }
  if (!isVersionStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid version status.", "status"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeVersionCompatibilityRegistration(
  input: KnowledgeVersionCompatibilityRegistrationInput,
  registeredVersionLabels: readonly string[]
): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!input.compatibilityId.trim()) {
    issues.push(issue("missing_field", "compatibilityId is required.", "compatibilityId"));
  }
  if (!isVersionedAssetKey(input.assetKey)) {
    issues.push(issue("invalid_asset", "Invalid versioned asset key.", "assetKey"));
  }
  const versionValidation = validateKnowledgeVersioningVersionFormat(input.versionLabel);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  const compatibleValidation = validateCompatibilityReference(input.compatibleWithVersion, registeredVersionLabels);
  if (!compatibleValidation.valid) issues.push(...compatibleValidation.issues);
  const platformValidation = validatePlatformReference(input.assetKey, input.platformId);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeVersioningDependencyDeclarations(): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (KNOWLEDGE_VERSIONING_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/1."));
  }
  if (KNOWLEDGE_VERSIONING_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/2."));
  }
  if (KNOWLEDGE_VERSIONING_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/3."));
  }
  if (KNOWLEDGE_VERSIONING_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/4."));
  }
  if (KNOWLEDGE_VERSIONING_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/5."));
  }
  if (KNOWLEDGE_VERSIONING_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/6."));
  }
  if (KNOWLEDGE_VERSIONING_POLICY_DEPENDENCY !== "KNL/7") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/7."));
  }
  if (KNOWLEDGE_VERSIONING_BEST_PRACTICE_DEPENDENCY !== "KNL/8") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/8."));
  }
  if (KNOWLEDGE_VERSIONING_RETRIEVAL_DEPENDENCY !== "KNL/9") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/9."));
  }
  if (KNOWLEDGE_VERSIONING_VALIDATION_DEPENDENCY !== "KNL/10") {
    issues.push(issue("invalid_dependency", "Knowledge versioning platform must depend on KNL/10."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isPolicyRuleBaseInitialized()) {
    issues.push(issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized."));
  }
  const report = validatePolicyRuleBase(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("policy_invalid", entry.message));
  }
  return result(issues);
}

export function validateBestPracticePlatformDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isBestPracticePlatformInitialized()) {
    issues.push(issue("best_practice_not_initialized", "KNL/8 Best Practices is not initialized."));
  }
  const report = validateBestPracticePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("best_practice_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeRetrievalEngineDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isKnowledgeRetrievalEngineInitialized()) {
    issues.push(issue("retrieval_not_initialized", "KNL/9 Knowledge Retrieval Engine is not initialized."));
  }
  const report = validateKnowledgeRetrievalEngine(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("retrieval_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeValidationPlatformDependency(timestamp: string): KnowledgeVersioningValidationResult {
  const issues: KnowledgeVersioningIssue[] = [];
  if (!isKnowledgeValidationPlatformInitialized()) {
    issues.push(issue("validation_not_initialized", "KNL/10 Knowledge Validation Platform is not initialized."));
  }
  const report = validateKnowledgeValidationPlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("validation_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeVersioningContractVersion(): KnowledgeVersioningValidationResult {
  return validateKnowledgeVersioningVersionFormat(KNOWLEDGE_VERSIONING_CONTRACT_VERSION);
}

export function validateKnowledgeVersioningCoreNamespace(): KnowledgeVersioningValidationResult {
  return validateKnowledgeVersioningNamespaceFormat(KNOWLEDGE_VERSIONING_NAMESPACE);
}
