/**
 * KNL-12 — Knowledge Learning Bridge validation.
 */

import {
  FEEDBACK_TYPE_KEYS,
  KNOWLEDGE_LEARNING_BRIDGE_BEST_PRACTICE_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
  KNOWLEDGE_LEARNING_BRIDGE_FOUNDATION_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_FRAMEWORK_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_GRAPH_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_INDUSTRY_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
  KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE_PATTERN,
  KNOWLEDGE_LEARNING_BRIDGE_ONTOLOGY_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_POLICY_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_RETRIEVAL_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_VALIDATION_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_VERSIONING_DEPENDENCY,
  KNOWLEDGE_LEARNING_BRIDGE_VERSION_PATTERN,
  KNOWLEDGE_LEARNING_BRIDGE_VOCABULARY_DEPENDENCY,
  LEARNING_BRIDGE_KEYS,
  LEARNING_BRIDGE_NAME_PATTERN,
  LEARNING_BRIDGE_TARGET_MAP,
  LEARNING_CONTEXT_KEYS,
  LEARNING_PLATFORM_ID_MAP,
  LEARNING_SOURCE_KEYS,
  LEARNING_STATUS_KEYS,
  LEARNING_TARGET_KEYS,
  LEARNING_TARGET_PLATFORM_ID_MAP,
  OBSERVATION_TYPE_KEYS,
} from "./knowledgeLearningBridgeCatalog.ts";
import type {
  KnowledgeLearningBridgeRegistrationInput,
  KnowledgeLearningIssue,
  KnowledgeLearningSourceRegistrationInput,
  KnowledgeLearningTargetRegistrationInput,
  KnowledgeLearningValidationResult,
  LearningMetadata,
} from "./knowledgeLearningBridgeTypes.ts";
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
import { validateKnowledgeVersioningPlatform } from "./knowledgeVersioningContracts.ts";
import { isKnowledgeVersioningPlatformInitialized } from "./knowledgeVersioningRegistry.ts";
import { validatePolicyRuleBase } from "./policyRuleContracts.ts";
import { isPolicyRuleBaseInitialized } from "./policyRuleRegistry.ts";

function issue(code: string, message: string, field?: string): KnowledgeLearningIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: KnowledgeLearningIssue[]): KnowledgeLearningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isLearningBridgeKey(value: string): value is (typeof LEARNING_BRIDGE_KEYS)[number] {
  return (LEARNING_BRIDGE_KEYS as readonly string[]).includes(value);
}

export function isLearningSourceKey(value: string): value is (typeof LEARNING_SOURCE_KEYS)[number] {
  return (LEARNING_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isLearningTargetKey(value: string): value is (typeof LEARNING_TARGET_KEYS)[number] {
  return (LEARNING_TARGET_KEYS as readonly string[]).includes(value);
}

export function isFeedbackTypeKey(value: string): value is (typeof FEEDBACK_TYPE_KEYS)[number] {
  return (FEEDBACK_TYPE_KEYS as readonly string[]).includes(value);
}

export function isObservationTypeKey(value: string): value is (typeof OBSERVATION_TYPE_KEYS)[number] {
  return (OBSERVATION_TYPE_KEYS as readonly string[]).includes(value);
}

export function isLearningContextKey(value: string): value is (typeof LEARNING_CONTEXT_KEYS)[number] {
  return (LEARNING_CONTEXT_KEYS as readonly string[]).includes(value);
}

export function isLearningStatusKey(value: string): value is (typeof LEARNING_STATUS_KEYS)[number] {
  return (LEARNING_STATUS_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateBridgeIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateBridgeKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function hasDuplicateLearningSourceKeys(keys: readonly string[]): boolean {
  return new Set(keys).size !== keys.length;
}

export function hasDuplicateBridgeNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validateKnowledgeLearningBridgeVersionFormat(version: string): KnowledgeLearningValidationResult {
  if (!KNOWLEDGE_LEARNING_BRIDGE_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateKnowledgeLearningBridgeNamespaceFormat(namespace: string): KnowledgeLearningValidationResult {
  if (!KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Learning bridge namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateBridgeNameFormat(bridgeName: string): KnowledgeLearningValidationResult {
  if (!LEARNING_BRIDGE_NAME_PATTERN.test(bridgeName)) {
    return result([issue("invalid_bridge_name", "Bridge name must be lowercase snake_case.", "bridgeName")]);
  }
  return result([]);
}

export function validateLearningMetadataRecord(metadata: LearningMetadata): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  for (const field of KNOWLEDGE_LEARNING_BRIDGE_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof LearningMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateKnowledgeLearningBridgeNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validateKnowledgeLearningBridgeVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validatePlatformReference(
  sourceKey: string,
  platformReference: string
): KnowledgeLearningValidationResult {
  if (!isLearningSourceKey(sourceKey)) {
    return result([issue("invalid_source", "Invalid learning source key.", "sourceKey")]);
  }
  const expected = LEARNING_PLATFORM_ID_MAP[sourceKey];
  if (platformReference !== expected) {
    return result([
      issue("invalid_platform_reference", `Platform reference must be ${expected} for ${sourceKey}.`, "platformReference"),
    ]);
  }
  return result([]);
}

export function validateLearningTargetReference(
  targetKey: string,
  registeredTargetKeys: readonly string[]
): KnowledgeLearningValidationResult {
  if (!isLearningTargetKey(targetKey)) {
    return result([issue("invalid_target", "Invalid learning target key.", "targetKey")]);
  }
  if (!registeredTargetKeys.includes(targetKey)) {
    return result([issue("invalid_target_reference", `Learning target not registered: ${targetKey}.`, "targetKey")]);
  }
  return result([]);
}

export function validateLearningSourceReference(
  sourceKey: string,
  registeredSourceKeys: readonly string[]
): KnowledgeLearningValidationResult {
  if (!isLearningSourceKey(sourceKey)) {
    return result([issue("invalid_source", "Invalid learning source key.", "sourceKey")]);
  }
  if (!registeredSourceKeys.includes(sourceKey)) {
    return result([issue("invalid_source_reference", `Learning source not registered: ${sourceKey}.`, "sourceKey")]);
  }
  return result([]);
}

export function validateKnlPlatformReference(
  targetKey: string,
  knlPlatformId: string
): KnowledgeLearningValidationResult {
  if (!isLearningTargetKey(targetKey)) {
    return result([issue("invalid_target", "Invalid learning target key.", "targetKey")]);
  }
  const expected = LEARNING_TARGET_PLATFORM_ID_MAP[targetKey];
  if (knlPlatformId !== expected) {
    return result([
      issue("invalid_knl_platform_reference", `KNL platform id must be ${expected} for ${targetKey}.`, "knlPlatformId"),
    ]);
  }
  return result([]);
}

export function validateKnowledgeLearningSourceRegistration(
  input: KnowledgeLearningSourceRegistrationInput
): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!input.sourceId.trim()) {
    issues.push(issue("missing_field", "sourceId is required.", "sourceId"));
  }
  if (!isLearningSourceKey(input.sourceKey)) {
    issues.push(issue("invalid_source", "Invalid learning source key.", "sourceKey"));
  }
  const platformValidation = validatePlatformReference(input.sourceKey, input.platformReference);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!isLearningStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid learning status.", "status"));
  }
  return result(issues);
}

export function validateKnowledgeLearningTargetRegistration(
  input: KnowledgeLearningTargetRegistrationInput
): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!input.targetId.trim()) {
    issues.push(issue("missing_field", "targetId is required.", "targetId"));
  }
  if (!isLearningTargetKey(input.targetKey)) {
    issues.push(issue("invalid_target", "Invalid learning target key.", "targetKey"));
  }
  const platformValidation = validateKnlPlatformReference(input.targetKey, input.platformId);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!isLearningStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid learning status.", "status"));
  }
  return result(issues);
}

export function validateKnowledgeLearningBridgeRegistration(
  input: KnowledgeLearningBridgeRegistrationInput,
  registeredSourceKeys: readonly string[],
  registeredTargetKeys: readonly string[]
): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!input.bridgeId.trim()) {
    issues.push(issue("missing_field", "bridgeId is required.", "bridgeId"));
  }
  if (!isLearningBridgeKey(input.bridgeKey)) {
    issues.push(issue("invalid_bridge", "Invalid learning bridge key.", "bridgeKey"));
  }
  const bridgeNameValidation = validateBridgeNameFormat(input.bridgeName);
  if (!bridgeNameValidation.valid) issues.push(...bridgeNameValidation.issues);
  const sourceValidation = validateLearningSourceReference(input.sourceKey, registeredSourceKeys);
  if (!sourceValidation.valid) issues.push(...sourceValidation.issues);
  const targetValidation = validateLearningTargetReference(input.targetKey, registeredTargetKeys);
  if (!targetValidation.valid) issues.push(...targetValidation.issues);
  if (isLearningBridgeKey(input.bridgeKey) && input.targetKey !== LEARNING_BRIDGE_TARGET_MAP[input.bridgeKey]) {
    issues.push(
      issue(
        "invalid_target_reference",
        `Target key must be ${LEARNING_BRIDGE_TARGET_MAP[input.bridgeKey]} for ${input.bridgeKey}.`,
        "targetKey"
      )
    );
  }
  const platformValidation = validatePlatformReference(input.sourceKey, input.platformReference);
  if (!platformValidation.valid) issues.push(...platformValidation.issues);
  const knlPlatformValidation = validateKnlPlatformReference(input.targetKey, input.knlPlatformId);
  if (!knlPlatformValidation.valid) issues.push(...knlPlatformValidation.issues);
  if (!isLearningStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid learning status.", "status"));
  }
  if (!isFeedbackTypeKey(input.feedbackType)) {
    issues.push(issue("invalid_feedback_type", "Invalid feedback type.", "feedbackType"));
  }
  if (!isObservationTypeKey(input.observationType)) {
    issues.push(issue("invalid_observation_type", "Invalid observation type.", "observationType"));
  }
  if (!isLearningContextKey(input.contextKey)) {
    issues.push(issue("invalid_context", "Invalid learning context key.", "contextKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateKnowledgeLearningBridgeDependencyDeclarations(): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (KNOWLEDGE_LEARNING_BRIDGE_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/1."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/2."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/3."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/4."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/5."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/6."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_POLICY_DEPENDENCY !== "KNL/7") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/7."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_BEST_PRACTICE_DEPENDENCY !== "KNL/8") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/8."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_RETRIEVAL_DEPENDENCY !== "KNL/9") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/9."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_VALIDATION_DEPENDENCY !== "KNL/10") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/10."));
  }
  if (KNOWLEDGE_LEARNING_BRIDGE_VERSIONING_DEPENDENCY !== "KNL/11") {
    issues.push(issue("invalid_dependency", "Knowledge learning bridge must depend on KNL/11."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isPolicyRuleBaseInitialized()) {
    issues.push(issue("policy_not_initialized", "KNL/7 Policy & Rule Base is not initialized."));
  }
  const report = validatePolicyRuleBase(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("policy_invalid", entry.message));
  }
  return result(issues);
}

export function validateBestPracticePlatformDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isBestPracticePlatformInitialized()) {
    issues.push(issue("best_practice_not_initialized", "KNL/8 Best Practices is not initialized."));
  }
  const report = validateBestPracticePlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("best_practice_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeRetrievalEngineDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isKnowledgeRetrievalEngineInitialized()) {
    issues.push(issue("retrieval_not_initialized", "KNL/9 Knowledge Retrieval Engine is not initialized."));
  }
  const report = validateKnowledgeRetrievalEngine(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("retrieval_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeValidationPlatformDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isKnowledgeValidationPlatformInitialized()) {
    issues.push(issue("validation_not_initialized", "KNL/10 Knowledge Validation Platform is not initialized."));
  }
  const report = validateKnowledgeValidationPlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("validation_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeVersioningPlatformDependency(timestamp: string): KnowledgeLearningValidationResult {
  const issues: KnowledgeLearningIssue[] = [];
  if (!isKnowledgeVersioningPlatformInitialized()) {
    issues.push(issue("versioning_not_initialized", "KNL/11 Knowledge Versioning Platform is not initialized."));
  }
  const report = validateKnowledgeVersioningPlatform(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("versioning_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeLearningBridgeContractVersion(): KnowledgeLearningValidationResult {
  return validateKnowledgeLearningBridgeVersionFormat(KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION);
}

export function validateKnowledgeLearningBridgeCoreNamespace(): KnowledgeLearningValidationResult {
  return validateKnowledgeLearningBridgeNamespaceFormat(KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE);
}
