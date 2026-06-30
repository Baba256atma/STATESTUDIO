/**
 * KNL-13 — Knowledge Governance Platform validation.
 */

import {
  APPROVAL_POLICY_KEYS,
  AUDIT_POLICY_KEYS,
  CERTIFICATION_POLICY_KEYS,
  GOVERNANCE_KNL_VERSION_MAP,
  GOVERNANCE_LIFECYCLE_KEYS,
  GOVERNANCE_PLATFORM_ID_MAP,
  GOVERNANCE_PLATFORM_KEYS,
  GOVERNANCE_POLICY_KEY_PATTERN,
  GOVERNANCE_RULE_KEYS,
  GOVERNANCE_SCOPE_KEYS,
  GOVERNANCE_STATUS_KEYS,
  KNOWLEDGE_GOVERNANCE_BEST_PRACTICE_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
  KNOWLEDGE_GOVERNANCE_FOUNDATION_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_FRAMEWORK_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_GRAPH_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_INDUSTRY_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_LEARNING_BRIDGE_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_GOVERNANCE_NAMESPACE,
  KNOWLEDGE_GOVERNANCE_NAMESPACE_PATTERN,
  KNOWLEDGE_GOVERNANCE_ONTOLOGY_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_POLICY_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_RETRIEVAL_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_VALIDATION_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_VERSIONING_DEPENDENCY,
  KNOWLEDGE_GOVERNANCE_VERSION_PATTERN,
  KNOWLEDGE_GOVERNANCE_VOCABULARY_DEPENDENCY,
} from "./knowledgeGovernanceCatalog.ts";
import type {
  GovernanceMetadata,
  KnowledgeGovernanceIssue,
  KnowledgeGovernancePolicyRegistrationInput,
  KnowledgeGovernanceValidationResult,
  KnowledgeOwnerRegistrationInput,
  KnowledgeStewardRegistrationInput,
} from "./knowledgeGovernanceTypes.ts";
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
import { validateKnowledgeLearningBridgePlatform } from "./knowledgeLearningBridgeContracts.ts";
import { isKnowledgeLearningBridgePlatformInitialized } from "./knowledgeLearningBridgeRegistry.ts";
import { validateKnowledgeRetrievalEngine } from "./knowledgeRetrievalContracts.ts";
import { isKnowledgeRetrievalEngineInitialized } from "./knowledgeRetrievalRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";
import { validateKnowledgeValidationPlatform } from "./knowledgeValidationPlatformContracts.ts";
import { isKnowledgeValidationPlatformInitialized } from "./knowledgeValidationPlatformRegistry.ts";
import { validateKnowledgeVersioningPlatform } from "./knowledgeVersioningContracts.ts";
import { isKnowledgeVersioningPlatformInitialized } from "./knowledgeVersioningRegistry.ts";
import { validatePolicyRuleBase } from "./policyRuleContracts.ts";
import { isPolicyRuleBaseInitialized } from "./policyRuleRegistry.ts";

function issue(code: string, message: string, field?: string): KnowledgeGovernanceIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgeGovernanceIssue[]): KnowledgeGovernanceValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isGovernancePlatformKey(value: string): value is (typeof GOVERNANCE_PLATFORM_KEYS)[number] {
  return (GOVERNANCE_PLATFORM_KEYS as readonly string[]).includes(value);
}

export function isGovernanceScopeKey(value: string): value is (typeof GOVERNANCE_SCOPE_KEYS)[number] {
  return (GOVERNANCE_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isGovernanceLifecycleKey(value: string): value is (typeof GOVERNANCE_LIFECYCLE_KEYS)[number] {
  return (GOVERNANCE_LIFECYCLE_KEYS as readonly string[]).includes(value);
}

export function isGovernanceRuleKey(value: string): value is (typeof GOVERNANCE_RULE_KEYS)[number] {
  return (GOVERNANCE_RULE_KEYS as readonly string[]).includes(value);
}

export function isApprovalPolicyKey(value: string): value is (typeof APPROVAL_POLICY_KEYS)[number] {
  return (APPROVAL_POLICY_KEYS as readonly string[]).includes(value);
}

export function isCertificationPolicyKey(value: string): value is (typeof CERTIFICATION_POLICY_KEYS)[number] {
  return (CERTIFICATION_POLICY_KEYS as readonly string[]).includes(value);
}

export function isAuditPolicyKey(value: string): value is (typeof AUDIT_POLICY_KEYS)[number] {
  return (AUDIT_POLICY_KEYS as readonly string[]).includes(value);
}

export function isGovernanceStatusKey(value: string): value is (typeof GOVERNANCE_STATUS_KEYS)[number] {
  return (GOVERNANCE_STATUS_KEYS as readonly string[]).includes(value);
}

export function hasDuplicatePolicyIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicatePolicyKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function hasDuplicateOwnerIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateOwnerKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function hasDuplicateStewardIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateStewardKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function validateKnowledgeGovernanceVersionFormat(version: string): KnowledgeGovernanceValidationResult {
  if (!KNOWLEDGE_GOVERNANCE_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateKnowledgeGovernanceNamespaceFormat(namespace: string): KnowledgeGovernanceValidationResult {
  if (!KNOWLEDGE_GOVERNANCE_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Governance namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validatePolicyKeyFormat(policyKey: string): KnowledgeGovernanceValidationResult {
  if (!GOVERNANCE_POLICY_KEY_PATTERN.test(policyKey)) {
    return result([issue("invalid_policy_key", "Policy key must be lowercase snake_case.", "policyKey")]);
  }
  return result([]);
}

export function validateGovernanceMetadataRecord(metadata: GovernanceMetadata): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  for (const field of KNOWLEDGE_GOVERNANCE_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof GovernanceMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgeGovernanceNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgeGovernanceVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validateGovernancePlatformReference(
  platformKey: string,
  platformReference: string
): KnowledgeGovernanceValidationResult {
  if (!isGovernancePlatformKey(platformKey)) {
    return result([issue("invalid_platform", "Invalid governance platform key.", "platformKey")]);
  }
  const expected = GOVERNANCE_PLATFORM_ID_MAP[platformKey];
  if (platformReference !== expected) {
    return result([
      issue("invalid_platform_reference", `Platform reference must be ${expected} for ${platformKey}.`, "platformReference"),
    ]);
  }
  return result([]);
}

export function validateOwnerReference(
  ownerId: string,
  registeredOwnerIds: readonly string[]
): KnowledgeGovernanceValidationResult {
  if (!ownerId.trim()) {
    return result([issue("missing_field", "ownerId is required.", "ownerId")]);
  }
  if (!registeredOwnerIds.includes(ownerId)) {
    return result([issue("invalid_owner_reference", `Knowledge owner not registered: ${ownerId}.`, "ownerId")]);
  }
  return result([]);
}

export function validateStewardReference(
  stewardId: string,
  registeredStewardIds: readonly string[]
): KnowledgeGovernanceValidationResult {
  if (!stewardId.trim()) {
    return result([issue("missing_field", "stewardId is required.", "stewardId")]);
  }
  if (!registeredStewardIds.includes(stewardId)) {
    return result([issue("invalid_steward_reference", `Knowledge steward not registered: ${stewardId}.`, "stewardId")]);
  }
  return result([]);
}

export function validateKnowledgeOwnerRegistration(
  input: KnowledgeOwnerRegistrationInput
): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!input.ownerId.trim()) {
    issues.push(issue("missing_field", "ownerId is required.", "ownerId"));
  }
  if (!input.ownerKey.trim()) {
    issues.push(issue("missing_field", "ownerKey is required.", "ownerKey"));
  }
  if (!isGovernancePlatformKey(input.platformKey)) {
    issues.push(issue("invalid_platform", "Invalid governance platform key.", "platformKey"));
  }
  const platformValidation = validateGovernancePlatformReference(input.platformKey, input.platformReference);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!isGovernanceStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid governance status.", "status"));
  }
  return result(issues);
}

export function validateKnowledgeStewardRegistration(
  input: KnowledgeStewardRegistrationInput
): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!input.stewardId.trim()) {
    issues.push(issue("missing_field", "stewardId is required.", "stewardId"));
  }
  if (!input.stewardKey.trim()) {
    issues.push(issue("missing_field", "stewardKey is required.", "stewardKey"));
  }
  if (!isGovernancePlatformKey(input.platformKey)) {
    issues.push(issue("invalid_platform", "Invalid governance platform key.", "platformKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!isGovernanceStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid governance status.", "status"));
  }
  return result(issues);
}

export function validateKnowledgeGovernancePolicyRegistration(
  input: KnowledgeGovernancePolicyRegistrationInput,
  registeredOwnerIds: readonly string[],
  registeredStewardIds: readonly string[]
): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!input.policyId.trim()) {
    issues.push(issue("missing_field", "policyId is required.", "policyId"));
  }
  const policyKeyValidation = validatePolicyKeyFormat(input.policyKey);
  if (!policyKeyValidation.valid) issues.push(...policyKeyValidation.issues);
  if (!isGovernancePlatformKey(input.platformKey)) {
    issues.push(issue("invalid_platform", "Invalid governance platform key.", "platformKey"));
  }
  const platformValidation = validateGovernancePlatformReference(input.platformKey, input.platformReference);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (!isGovernanceScopeKey(input.scopeKey)) {
    issues.push(issue("invalid_scope", "Invalid governance scope key.", "scopeKey"));
  }
  if (!isGovernanceLifecycleKey(input.lifecycleKey)) {
    issues.push(issue("invalid_lifecycle", "Invalid governance lifecycle key.", "lifecycleKey"));
  }
  const ownerValidation = validateOwnerReference(input.ownerId, registeredOwnerIds);
  if (!ownerValidation.valid) issues.push(...ownerValidation.issues);
  const stewardValidation = validateStewardReference(input.stewardId, registeredStewardIds);
  if (!stewardValidation.valid) issues.push(...stewardValidation.issues);
  if (!isGovernanceStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid governance status.", "status"));
  }
  if (!isApprovalPolicyKey(input.approvalPolicyKey)) {
    issues.push(issue("invalid_approval_policy", "Invalid approval policy key.", "approvalPolicyKey"));
  }
  if (!isCertificationPolicyKey(input.certificationPolicyKey)) {
    issues.push(issue("invalid_certification_policy", "Invalid certification policy key.", "certificationPolicyKey"));
  }
  if (!isAuditPolicyKey(input.auditPolicyKey)) {
    issues.push(issue("invalid_audit_policy", "Invalid audit policy key.", "auditPolicyKey"));
  }
  if (!isGovernanceRuleKey(input.governanceRuleKey)) {
    issues.push(issue("invalid_governance_rule", "Invalid governance rule key.", "governanceRuleKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (isGovernancePlatformKey(input.platformKey) && input.policyKey !== `${input.platformKey}_governance`) {
    issues.push(
      issue(
        "invalid_policy_key_reference",
        `Policy key must be ${input.platformKey}_governance for ${input.platformKey}.`,
        "policyKey"
      )
    );
  }
  return result(issues);
}

export function validateKnowledgeGovernanceDependencyDeclarations(): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (KNOWLEDGE_GOVERNANCE_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/1."));
  }
  if (KNOWLEDGE_GOVERNANCE_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/2."));
  }
  if (KNOWLEDGE_GOVERNANCE_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/3."));
  }
  if (KNOWLEDGE_GOVERNANCE_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/4."));
  }
  if (KNOWLEDGE_GOVERNANCE_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/5."));
  }
  if (KNOWLEDGE_GOVERNANCE_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/6."));
  }
  if (KNOWLEDGE_GOVERNANCE_POLICY_DEPENDENCY !== "KNL/7") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/7."));
  }
  if (KNOWLEDGE_GOVERNANCE_BEST_PRACTICE_DEPENDENCY !== "KNL/8") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/8."));
  }
  if (KNOWLEDGE_GOVERNANCE_RETRIEVAL_DEPENDENCY !== "KNL/9") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/9."));
  }
  if (KNOWLEDGE_GOVERNANCE_VALIDATION_DEPENDENCY !== "KNL/10") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/10."));
  }
  if (KNOWLEDGE_GOVERNANCE_VERSIONING_DEPENDENCY !== "KNL/11") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/11."));
  }
  if (KNOWLEDGE_GOVERNANCE_LEARNING_BRIDGE_DEPENDENCY !== "KNL/12") {
    issues.push(issue("invalid_dependency", "Knowledge governance must depend on KNL/12."));
  }
  return result(issues);
}

export function validateGovernanceDependencyReference(
  platformKey: string,
  knlVersion: string
): KnowledgeGovernanceValidationResult {
  if (!isGovernancePlatformKey(platformKey)) {
    return result([issue("invalid_platform", "Invalid governance platform key.", "platformKey")]);
  }
  const expected = GOVERNANCE_KNL_VERSION_MAP[platformKey];
  if (knlVersion !== expected) {
    return result([
      issue("invalid_dependency_reference", `KNL version must be ${expected} for ${platformKey}.`, "knlVersion"),
    ]);
  }
  return result([]);
}

export function validateKnowledgeFoundationDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isPolicyRuleBaseInitialized()) {
    issues.push(issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized."));
  }
  const report = validatePolicyRuleBase(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("policy_invalid", entry.message));
  }
  return result(issues);
}

export function validateBestPracticePlatformDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isBestPracticePlatformInitialized()) {
    issues.push(issue("best_practice_not_initialized", "KNL/8 Best Practices is not initialized."));
  }
  const report = validateBestPracticePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("best_practice_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeRetrievalEngineDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isKnowledgeRetrievalEngineInitialized()) {
    issues.push(issue("retrieval_not_initialized", "KNL/9 Knowledge Retrieval Engine is not initialized."));
  }
  const report = validateKnowledgeRetrievalEngine(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("retrieval_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeValidationPlatformDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isKnowledgeValidationPlatformInitialized()) {
    issues.push(issue("validation_not_initialized", "KNL/10 Knowledge Validation Platform is not initialized."));
  }
  const report = validateKnowledgeValidationPlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("validation_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeVersioningPlatformDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isKnowledgeVersioningPlatformInitialized()) {
    issues.push(issue("versioning_not_initialized", "KNL/11 Knowledge Versioning Platform is not initialized."));
  }
  const report = validateKnowledgeVersioningPlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("versioning_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeLearningBridgePlatformDependency(timestamp: string): KnowledgeGovernanceValidationResult {
  const issues: KnowledgeGovernanceIssue[] = [];
  if (!isKnowledgeLearningBridgePlatformInitialized()) {
    issues.push(issue("learning_bridge_not_initialized", "KNL/12 Knowledge Learning Bridge is not initialized."));
  }
  const report = validateKnowledgeLearningBridgePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("learning_bridge_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGovernanceContractVersion(): KnowledgeGovernanceValidationResult {
  return validateKnowledgeGovernanceVersionFormat(KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION);
}

export function validateKnowledgeGovernanceCoreNamespace(): KnowledgeGovernanceValidationResult {
  return validateKnowledgeGovernanceNamespaceFormat(KNOWLEDGE_GOVERNANCE_NAMESPACE);
}
