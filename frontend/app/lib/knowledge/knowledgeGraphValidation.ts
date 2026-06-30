/**
 * KNL-4 — Knowledge Graph validation.
 */

import {
  KNOWLEDGE_GRAPH_CONTRACT_VERSION,
  KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_FOUNDATION_DEPENDENCY,
  KNOWLEDGE_GRAPH_MANDATORY_METADATA_FIELDS,
  KNOWLEDGE_GRAPH_NAMESPACE,
  KNOWLEDGE_GRAPH_NAMESPACE_KEYS,
  KNOWLEDGE_GRAPH_NAMESPACE_PATTERN,
  KNOWLEDGE_GRAPH_NODE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_ONTOLOGY_DEPENDENCY,
  KNOWLEDGE_GRAPH_VERSION_PATTERN,
  KNOWLEDGE_GRAPH_VOCABULARY_DEPENDENCY,
} from "./knowledgeGraphCatalog.ts";
import type {
  GraphMetadata,
  GraphValidationIssue,
  GraphValidationResult,
  KnowledgeEdgeRegistrationInput,
  KnowledgeNodeRegistrationInput,
  KnowledgeNodeTypeRegistrationInput,
} from "./knowledgeGraphTypes.ts";
import { validateBusinessOntology } from "./businessOntologyContracts.ts";
import { getBusinessOntologyRegistry, isBusinessOntologyInitialized } from "./businessOntologyRegistry.ts";
import { validateBusinessVocabulary } from "./businessVocabularyContracts.ts";
import { getBusinessVocabularyRegistry, isBusinessVocabularyInitialized } from "./businessVocabularyRegistry.ts";
import { validateKnowledgeFoundation } from "./knowledgeContracts.ts";
import { isKnowledgePlatformInitialized } from "./knowledgeFoundation.ts";

function issue(code: string, message: string, field?: string): GraphValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: GraphValidationIssue[]): GraphValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isGraphNodeTypeKey(value: string): value is (typeof KNOWLEDGE_GRAPH_NODE_TYPE_KEYS)[number] {
  return (KNOWLEDGE_GRAPH_NODE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isGraphEdgeTypeKey(value: string): value is (typeof KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS)[number] {
  return (KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isGraphNamespaceKey(value: string): value is (typeof KNOWLEDGE_GRAPH_NAMESPACE_KEYS)[number] {
  return (KNOWLEDGE_GRAPH_NAMESPACE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateGraphIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateGraphVersionFormat(version: string): GraphValidationResult {
  if (!KNOWLEDGE_GRAPH_VERSION_PATTERN.test(version)) {
    return result([issue("invalid_version", "Version must match KNL/N format.", "version")]);
  }
  return result([]);
}

export function validateGraphNamespaceFormat(namespace: string): GraphValidationResult {
  if (!KNOWLEDGE_GRAPH_NAMESPACE_PATTERN.test(namespace)) {
    return result([issue("invalid_namespace", "Graph namespace format is invalid.", "namespace")]);
  }
  return result([]);
}

export function validateGraphMetadataRecord(metadata: GraphMetadata): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
  for (const field of KNOWLEDGE_GRAPH_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata) || metadata[field as keyof GraphMetadata] === undefined) {
      issues.push(issue("missing_metadata", `metadata.${field} is required.`, field));
    }
  }
  const namespaceValidation = validateGraphNamespaceFormat(metadata.namespace);
  if (!namespaceValidation.valid) {
    issues.push(...namespaceValidation.issues);
  }
  const versionValidation = validateGraphVersionFormat(metadata.metadataVersion);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }
  return result(issues);
}

export function validateOntologyNodeReference(entityId: string): GraphValidationResult {
  if (!entityId.trim()) {
    return result([issue("missing_field", "ontologyEntityId is required.", "ontologyEntityId")]);
  }
  if (!isBusinessOntologyInitialized()) {
    return result([issue("ontology_not_initialized", "KNL/2 Business Ontology is not initialized.")]);
  }
  const registry = getBusinessOntologyRegistry();
  const exists = registry.entities.some((entry) => entry.entityId === entityId);
  if (!exists) {
    return result([issue("invalid_node_reference", `Ontology entity not found: ${entityId}.`, "ontologyEntityId")]);
  }
  return result([]);
}

export function validateVocabularyTermReference(termId: string): GraphValidationResult {
  if (!termId.trim()) {
    return result([issue("missing_field", "vocabularyTermId is required.", "vocabularyTermId")]);
  }
  if (!isBusinessVocabularyInitialized()) {
    return result([issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized.")]);
  }
  const registry = getBusinessVocabularyRegistry();
  const exists = registry.terms.some((entry) => entry.termId === termId);
  if (!exists) {
    return result([issue("invalid_vocabulary_reference", `Vocabulary term not found: ${termId}.`, "vocabularyTermId")]);
  }
  return result([]);
}

export function validateKnowledgeNodeRegistration(input: KnowledgeNodeRegistrationInput): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
  if (!input.nodeId.trim()) {
    issues.push(issue("missing_field", "nodeId is required.", "nodeId"));
  }
  if (!isGraphNodeTypeKey(input.nodeTypeKey)) {
    issues.push(issue("invalid_node_type", "Invalid graph node type.", "nodeTypeKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isGraphNamespaceKey(input.namespaceKey)) {
    issues.push(issue("invalid_namespace", "Invalid graph namespace key.", "namespaceKey"));
  }
  if (input.ontologyEntityId) {
    const ontologyValidation = validateOntologyNodeReference(input.ontologyEntityId);
    if (!ontologyValidation.valid) {
      issues.push(...ontologyValidation.issues);
    }
  }
  if (input.vocabularyTermId) {
    const vocabularyValidation = validateVocabularyTermReference(input.vocabularyTermId);
    if (!vocabularyValidation.valid) {
      issues.push(...vocabularyValidation.issues);
    }
  }
  return result(issues);
}

export function validateKnowledgeEdgeRegistration(
  input: KnowledgeEdgeRegistrationInput,
  registeredNodeIds: readonly string[]
): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
  if (!input.edgeId.trim()) {
    issues.push(issue("missing_field", "edgeId is required.", "edgeId"));
  }
  if (!isGraphEdgeTypeKey(input.edgeTypeKey)) {
    issues.push(issue("invalid_edge_type", "Invalid graph edge type.", "edgeTypeKey"));
  }
  if (!input.sourceNodeId.trim()) {
    issues.push(issue("missing_field", "sourceNodeId is required.", "sourceNodeId"));
  }
  if (!input.targetNodeId.trim()) {
    issues.push(issue("missing_field", "targetNodeId is required.", "targetNodeId"));
  }
  if (input.sourceNodeId.trim() === input.targetNodeId.trim()) {
    issues.push(issue("invalid_edge", "Edge source and target must differ."));
  }
  if (!registeredNodeIds.includes(input.sourceNodeId)) {
    issues.push(issue("invalid_node_reference", `Source node not found: ${input.sourceNodeId}.`, "sourceNodeId"));
  }
  if (!registeredNodeIds.includes(input.targetNodeId)) {
    issues.push(issue("invalid_node_reference", `Target node not found: ${input.targetNodeId}.`, "targetNodeId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!input.description.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!isGraphNamespaceKey(input.namespaceKey)) {
    issues.push(issue("invalid_namespace", "Invalid graph namespace key.", "namespaceKey"));
  }
  if (input.vocabularyTermId) {
    const vocabularyValidation = validateVocabularyTermReference(input.vocabularyTermId);
    if (!vocabularyValidation.valid) {
      issues.push(...vocabularyValidation.issues);
    }
  }
  return result(issues);
}

export function validateKnowledgeNodeTypeRegistration(
  input: KnowledgeNodeTypeRegistrationInput
): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
  if (!input.nodeTypeId.trim()) {
    issues.push(issue("missing_field", "nodeTypeId is required.", "nodeTypeId"));
  }
  if (!isGraphNodeTypeKey(input.nodeTypeKey)) {
    issues.push(issue("invalid_node_type", "Invalid graph node type key.", "nodeTypeKey"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateGraphDependencyDeclarations(): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
  if (KNOWLEDGE_GRAPH_FOUNDATION_DEPENDENCY !== "KNL/1") {
    issues.push(issue("invalid_dependency", "Graph must depend on KNL/1."));
  }
  if (KNOWLEDGE_GRAPH_ONTOLOGY_DEPENDENCY !== "KNL/2") {
    issues.push(issue("invalid_dependency", "Graph must depend on KNL/2."));
  }
  if (KNOWLEDGE_GRAPH_VOCABULARY_DEPENDENCY !== "KNL/3") {
    issues.push(issue("invalid_dependency", "Graph must depend on KNL/3."));
  }
  return result(issues);
}

export function validateKnowledgeFoundationDependency(timestamp: string): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
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

export function validateBusinessOntologyDependency(timestamp: string): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
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

export function validateBusinessVocabularyDependency(timestamp: string): GraphValidationResult {
  const issues: GraphValidationIssue[] = [];
  if (!isBusinessVocabularyInitialized()) {
    issues.push(issue("vocabulary_not_initialized", "KNL/3 Business Vocabulary is not initialized."));
  }
  const vocabularyReport = validateBusinessVocabulary(timestamp);
  if (!vocabularyReport.valid) {
    for (const entry of vocabularyReport.issues) {
      issues.push(issue("vocabulary_invalid", entry.message));
    }
  }
  return result(issues);
}

export function validateGraphContractVersion(): GraphValidationResult {
  return validateGraphVersionFormat(KNOWLEDGE_GRAPH_CONTRACT_VERSION);
}

export function validateGraphCoreNamespace(): GraphValidationResult {
  if (KNOWLEDGE_GRAPH_NAMESPACE !== "knowledge-graph-core") {
    return result([issue("invalid_namespace", "Graph core namespace mismatch.")]);
  }
  return validateGraphNamespaceFormat(KNOWLEDGE_GRAPH_NAMESPACE);
}
