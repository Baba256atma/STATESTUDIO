/**
 * KNL-7 — Policy & Rule Base validation.
 */

import {
  COMPLIANCE_TAG_KEYS,
  POLICY_CANONICAL_NAME_PATTERN,
  POLICY_CATEGORY_KEYS,
  POLICY_KEYS,
  POLICY_RULE_BASE_CONTRACT_VERSION,
  POLICY_RULE_BASE_FOUNDATION_DEPENDENCY,
  POLICY_RULE_BASE_FRAMEWORK_DEPENDENCY,
  POLICY_RULE_BASE_GRAPH_DEPENDENCY,
  POLICY_RULE_BASE_INDUSTRY_DEPENDENCY,
  POLICY_RULE_BASE_MANDATORY_METADATA_FIELDS,
  POLICY_RULE_BASE_NAMESPACE,
  POLICY_RULE_BASE_NAMESPACE_PATTERN,
  POLICY_RULE_BASE_ONTOLOGY_DEPENDENCY,
  POLICY_RULE_BASE_VERSION_PATTERN,
  POLICY_RULE_BASE_VOCABULARY_DEPENDENCY,
  RULE_PRIORITY_KEYS,
  RULE_SCOPE_KEYS,
  RULE_SEVERITY_KEYS,
  RULE_STATUS_KEYS,
  RULE_TYPE_KEYS,
} from "./policyRuleCatalog.ts";
import type {
  BusinessRuleRegistrationInput,
  PolicyCategoryRegistrationInput,
  PolicyMetadata,
  PolicyRegistrationInput,
  PolicyValidationIssue,
  PolicyValidationResult,
} from "./policyRuleTypes.ts";
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

function issue(code: string, message: string, field?: string): PolicyValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: PolicyValidationIssue[]): PolicyValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isPolicyKey(value: string): value is (typeof POLICY_KEYS)[number] {
  return (POLICY_KEYS as readonly string[]).includes(value);
}

export function isPolicyCategoryKey(value: string): value is (typeof POLICY_CATEGORY_KEYS)[number] {
  return (POLICY_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isRuleTypeKey(value: string): value is (typeof RULE_TYPE_KEYS)[number] {
  return (RULE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isRuleScopeKey(value: string): value is (typeof RULE_SCOPE_KEYS)[number] {
  return (RULE_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isRulePriorityKey(value: string): value is (typeof RULE_PRIORITY_KEYS)[number] {
  return (RULE_PRIORITY_KEYS as readonly string[]).includes(value);
}

export function isRuleSeverityKey(value: string): value is (typeof RULE_SEVERITY_KEYS)[number] {
  return (RULE_SEVERITY_KEYS as readonly string[]).includes(value);
}

export function isRuleStatusKey(value: string): value is (typeof RULE_STATUS_KEYS)[number] {
  return (RULE_STATUS_KEYS as readonly string[]).includes(value);
}

export function isComplianceTagKey(value: string): value is (typeof COMPLIANCE_TAG_KEYS)[number] {
  return (COMPLIANCE_TAG_KEYS as readonly string[]).includes(value);
}

export function hasDuplicatePolicyIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateRuleIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicatePolicyRuleNames(names: readonly string[]): boolean {
  const normalized = names.map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  return new Set(normalized).size !== normalized.length;
}

export function validatePolicyRuleVersionFormat(version: string): PolicyValidationResult {
  if (!POLICY_RULE_BASE_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validatePolicyNamespaceFormat(namespace: string): PolicyValidationResult {
  if (!POLICY_RULE_BASE_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Policy namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validatePolicyCanonicalNameFormat(canonicalName: string): PolicyValidationResult {
  if (!POLICY_CANONICAL_NAME_PATTERN.test(canonicalName)) {
    return result([issue("invalid_canonical_name", "Canonical name must be lowercase snake_case.", "canonicalName")]);
  }
  return result([]);
}

export function validatePolicyMetadataRecord(metadata: PolicyMetadata): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  for (const field of POLICY_RULE_BASE_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof PolicyMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validatePolicyNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);
  const versionValidation = validatePolicyRuleVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) issues.push(...versionValidation.issues);
  return result(issues);
}

export function validateOntologyReference(entityId: string): PolicyValidationResult {
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

export function validateFrameworkReference(frameworkId: string): PolicyValidationResult {
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

export function validateIndustryModelReference(industryModelId: string): PolicyValidationResult {
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

function validateOptionalReferences(input: PolicyRegistrationInput | BusinessRuleRegistrationInput): PolicyValidationIssue[] {
  const issues: PolicyValidationIssue[] = [];
  if ("ontologyEntityId" in input && input.ontologyEntityId) {
    const validation = validateOntologyReference(input.ontologyEntityId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if ("frameworkId" in input && input.frameworkId) {
    const validation = validateFrameworkReference(input.frameworkId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if ("industryModelId" in input && input.industryModelId) {
    const validation = validateIndustryModelReference(input.industryModelId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  return issues;
}

export function validatePolicyRegistration(input: PolicyRegistrationInput): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!input.policyId.trim()) {
    issues.push(issue("missing_field", "policyId is required.", "policyId"));
  }
  if (!isPolicyKey(input.policyKey)) {
    issues.push(issue("invalid_policy", "Invalid policy key.", "policyKey"));
  }
  const canonicalValidation = validatePolicyCanonicalNameFormat(input.canonicalName);
  if (!canonicalValidation.valid) issues.push(...canonicalValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isPolicyCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid policy category key.", "categoryKey"));
  }
  if (!isRuleStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid policy status.", "status"));
  }
  issues.push(...validateOptionalReferences(input));
  return result(issues);
}

export function validateBusinessRuleRegistration(
  input: BusinessRuleRegistrationInput,
  registeredPolicyIds: readonly string[]
): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!input.ruleId.trim()) {
    issues.push(issue("missing_field", "ruleId is required.", "ruleId"));
  }
  if (!registeredPolicyIds.includes(input.policyId)) {
    issues.push(issue("invalid_policy_reference", `Policy not found: ${input.policyId}.`, "policyId"));
  }
  const canonicalValidation = validatePolicyCanonicalNameFormat(input.canonicalName);
  if (!canonicalValidation.valid) issues.push(...canonicalValidation.issues);
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isRuleTypeKey(input.ruleType)) {
    issues.push(issue("invalid_rule_type", "Invalid rule type.", "ruleType"));
  }
  if (!isRuleScopeKey(input.ruleScope)) {
    issues.push(issue("invalid_rule_scope", "Invalid rule scope.", "ruleScope"));
  }
  if (!isRulePriorityKey(input.priority)) {
    issues.push(issue("invalid_priority", "Invalid rule priority.", "priority"));
  }
  if (!isRuleSeverityKey(input.severity)) {
    issues.push(issue("invalid_severity", "Invalid rule severity.", "severity"));
  }
  if (!isRuleStatusKey(input.status)) {
    issues.push(issue("invalid_status", "Invalid rule status.", "status"));
  }
  if (!input.conditionDescription.trim()) {
    issues.push(issue("missing_field", "conditionDescription is required.", "conditionDescription"));
  }
  if (!input.actionDescription.trim()) {
    issues.push(issue("missing_field", "actionDescription is required.", "actionDescription"));
  }
  if (input.complianceTags) {
    for (const tag of input.complianceTags) {
      if (!isComplianceTagKey(tag)) {
        issues.push(issue("invalid_compliance_tag", `Invalid compliance tag: ${tag}.`, "complianceTags"));
      }
    }
  }
  issues.push(...validateOptionalReferences(input));
  return result(issues);
}

export function validatePolicyCategoryRegistration(input: PolicyCategoryRegistrationInput): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isPolicyCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid policy category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validatePolicyRuleBaseDependencyDeclarations(): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (POLICY_RULE_BASE_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Policy rule base must depend on KNL/1."));
  }
  if (POLICY_RULE_BASE_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Policy rule base must depend on KNL/2."));
  }
  if (POLICY_RULE_BASE_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Policy rule base must depend on KNL/3."));
  }
  if (POLICY_RULE_BASE_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Policy rule base must depend on KNL/4."));
  }
  if (POLICY_RULE_BASE_INDUSTRY_DEPENDENCY !== "KNL/5") {
    issues.push(issue("invalid_dependency", "Policy rule base must depend on KNL/5."));
  }
  if (POLICY_RULE_BASE_FRAMEWORK_DEPENDENCY !== "KNL/6") {
    issues.push(issue("invalid_dependency", "Policy rule base must depend on KNL/6."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("foundation_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("ontology_invalid", entry.message));
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("vocabulary_invalid", entry.message));
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("graph_invalid", entry.message));
  }
  return result(issues);
}

export function validateIndustryModelsDependency(timestamp: string): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!isIndustryModelsInitialized()) {
    issues.push(issue("industry_not_initialized", "KNL/5 Industry Models is not initialized."));
  }
  const report = validateIndustryModels(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("industry_invalid", entry.message));
  }
  return result(issues);
}

export function validateFrameworkLibraryDependency(timestamp: string): PolicyValidationResult {
  const issues: PolicyValidationIssue[] = [];
  if (!isFrameworkLibraryInitialized()) {
    issues.push(issue("framework_not_initialized", "KNL/6 Framework Library is not initialized."));
  }
  const report = validateFrameworkLibrary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) issues.push(issue("framework_invalid", entry.message));
  }
  return result(issues);
}

export function validatePolicyRuleBaseContractVersion(): PolicyValidationResult {
  return validatePolicyRuleVersionFormat(POLICY_RULE_BASE_CONTRACT_VERSION);
}

export function validatePolicyRuleBaseCoreNamespace(): PolicyValidationResult {
  return validatePolicyNamespaceFormat(POLICY_RULE_BASE_NAMESPACE);
}
