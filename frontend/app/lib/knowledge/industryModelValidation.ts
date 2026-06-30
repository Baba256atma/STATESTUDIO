/**
 * KNL-5 — Industry Models validation.
 */

import {
  INDUSTRY_CATEGORY_KEYS,
  INDUSTRY_MODELS_CONTRACT_VERSION,
  INDUSTRY_MODELS_FOUNDATION_DEPENDENCY,
  INDUSTRY_MODELS_GRAPH_DEPENDENCY,
  INDUSTRY_MODELS_MANDATORY_METADATA_FIELDS,
  INDUSTRY_MODELS_NAMESPACE,
  INDUSTRY_MODELS_NAMESPACE_PATTERN,
  INDUSTRY_MODELS_ONTOLOGY_DEPENDENCY,
  INDUSTRY_MODELS_VERSION_PATTERN,
  INDUSTRY_MODELS_VOCABULARY_DEPENDENCY,
  INDUSTRY_SECTOR_KEYS,
  INDUSTRY_TEMPLATE_TYPE_KEYS,
} from "./industryModelCatalog.ts";
import type {
  IndustryMetadata,
  IndustryModelRegistrationInput,
  IndustryTemplateRegistrationInput,
  IndustryValidationIssue,
  IndustryValidationResult,
} from "./industryModelTypes.ts";
import { validateBusinessOntology } from "./businessOntologyContracts.ts";
import { getBusinessOntologyRegistry, isBusinessOntologyInitialized } from "./businessOntologyRegistry.ts";
import { validateBusinessVocabulary } from "./businessVocabularyContracts.ts";
import { getBusinessVocabularyRegistry, isBusinessVocabularyInitialized } from "./businessVocabularyRegistry.ts";
import { validateKnowledgeGraph } from "./knowledgeGraphContracts.ts";
import { getKnowledgeGraphRegistry, isKnowledgeGraphInitialized } from "./knowledgeGraphRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";

function issue(code: string, message: string, field?: string): IndustryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: IndustryValidationIssue[]): IndustryValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isIndustrySectorKey(value: string): value is (typeof INDUSTRY_SECTOR_KEYS)[number] {
  return (INDUSTRY_SECTOR_KEYS as readonly string[]).includes(value);
}

export function isIndustryCategoryKey(value: string): value is (typeof INDUSTRY_CATEGORY_KEYS)[number] {
  return (INDUSTRY_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isIndustryTemplateTypeKey(value: string): value is (typeof INDUSTRY_TEMPLATE_TYPE_KEYS)[number] {
  return (INDUSTRY_TEMPLATE_TYPE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIndustryIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateIndustryVersionFormat(version: string): IndustryValidationResult {
  if (!INDUSTRY_MODELS_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateIndustryNamespaceFormat(namespace: string): IndustryValidationResult {
  if (!INDUSTRY_MODELS_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Industry namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateIndustryMetadataRecord(metadata: IndustryMetadata): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  for (const field of INDUSTRY_MODELS_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof IndustryMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateIndustryNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) {
    issues.push(...namespaceValidation.issues);
  }
  const versionValidation = validateIndustryVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }
  return result(issues);
}

export function validateOntologyReference(entityId: string): IndustryValidationResult {
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

export function validateVocabularyReference(termId: string): IndustryValidationResult {
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

export function validateGraphReference(nodeId: string): IndustryValidationResult {
  if (!nodeId.trim()) {
    return result([issue("missing_field", "graphNodeId is required.", "graphNodeId")]);
  }
  if (!isKnowledgeGraphInitialized()) {
    return result([issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized.")]);
  }
  const exists = getKnowledgeGraphRegistry().nodes.some((entry) => entry.nodeId === nodeId);
  if (!exists) {
    return result([issue("invalid_graph_reference", `Graph node not found: ${nodeId}.`, "graphNodeId")]);
  }
  return result([]);
}

function validateOptionalReferences(input: {
  ontologyEntityId?: string;
  vocabularyTermId?: string;
  graphNodeId?: string;
}): IndustryValidationIssue[] {
  const issues: IndustryValidationIssue[] = [];
  if (input.ontologyEntityId) {
    const validation = validateOntologyReference(input.ontologyEntityId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.vocabularyTermId) {
    const validation = validateVocabularyReference(input.vocabularyTermId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  if (input.graphNodeId) {
    const validation = validateGraphReference(input.graphNodeId);
    if (!validation.valid) issues.push(...validation.issues);
  }
  return issues;
}

export function validateIndustryModelRegistration(input: IndustryModelRegistrationInput): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!input.modelId.trim()) {
    issues.push(issue("missing_field", "modelId is required.", "modelId"));
  }
  if (!isIndustrySectorKey(input.sectorKey)) {
    issues.push(issue("invalid_sector", "Invalid industry sector key.", "sectorKey"));
  }
  if (!isIndustryCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid industry category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  issues.push(...validateOptionalReferences(input));
  return result(issues);
}

export function validateIndustryTemplateRegistration(
  input: IndustryTemplateRegistrationInput,
  registeredModelIds: readonly string[]
): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!input.templateId.trim()) {
    issues.push(issue("missing_field", "templateId is required.", "templateId"));
  }
  if (!registeredModelIds.includes(input.modelId)) {
    issues.push(issue("invalid_model_reference", `Industry model not found: ${input.modelId}.`, "modelId"));
  }
  if (!isIndustryTemplateTypeKey(input.templateType)) {
    issues.push(issue("invalid_template_type", "Invalid template type.", "templateType"));
  }
  if (!isIndustrySectorKey(input.sectorKey)) {
    issues.push(issue("invalid_sector", "Invalid industry sector key.", "sectorKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  issues.push(...validateOptionalReferences(input));
  return result(issues);
}

export function validateIndustryCategoryRegistration(
  input: { categoryId: string; categoryKey: string; label: string; description: string }
): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!input.categoryId.trim()) {
    issues.push(issue("missing_field", "categoryId is required.", "categoryId"));
  }
  if (!isIndustryCategoryKey(input.categoryKey)) {
    issues.push(issue("invalid_category", "Invalid industry category key.", "categoryKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateIndustryDependencyDeclarations(): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (INDUSTRY_MODELS_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Industry models must depend on KNL/1."));
  }
  if (INDUSTRY_MODELS_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Industry models must depend on KNL/2."));
  }
  if (INDUSTRY_MODELS_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Industry models must depend on KNL/3."));
  }
  if (INDUSTRY_MODELS_GRAPH_DEPENDENCY !== "KNL/4") {
    issues.push(issue("invalid_dependency", "Industry models must depend on KNL/4."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!isKnowledgePlatformInitialized()) {
    issues.push(issue("foundation_not_initialized", "KNL/1 Knowledge Foundation is not initialized."));
  }
  const report = validateKnowledgeFoundation(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) {
      issues.push(issue("foundation_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateBusinessOntologyDependency(timestamp: string): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!isBusinessOntologyInitialized()) {
    issues.push(issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized."));
  }
  const report = validateBusinessOntology(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) {
      issues.push(issue("ontology_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateBusinessVocabularyDependency(timestamp: string): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const report = validateBusinessVocabulary(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) {
      issues.push(issue("vocabulary_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateKnowledgeGraphDependency(timestamp: string): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  if (!isKnowledgeGraphInitialized()) {
    issues.push(issue("graph_not_initialized", "KNL/4 Knowledge Graph is not initialized."));
  }
  const report = validateKnowledgeGraph(timestamp);
  if (!report.valid) {
    for (const entry of report.issues) {
      issues.push(issue("graph_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateIndustryContractVersion(): IndustryValidationResult {
  return validateIndustryVersionFormat(INDUSTRY_MODELS_CONTRACT_VERSION);
}

export function validateIndustryCoreNamespace(): IndustryValidationResult {
  return validateIndustryNamespaceFormat(INDUSTRY_MODELS_NAMESPACE);
}
