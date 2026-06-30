/**
 * KNL-4 — Knowledge Graph contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_GRAPH_ARCHITECTURE_VERSION,
  KNOWLEDGE_GRAPH_CONTRACT_VERSION,
  KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_FORBIDDEN_PATTERNS,
  KNOWLEDGE_GRAPH_FUTURE_PHASE_KEYS,
  KNOWLEDGE_GRAPH_GOVERNANCE_RULES,
  KNOWLEDGE_GRAPH_ID,
  KNOWLEDGE_GRAPH_MUST_NOT_OWN,
  KNOWLEDGE_GRAPH_NAME,
  KNOWLEDGE_GRAPH_NAMESPACE,
  KNOWLEDGE_GRAPH_NAMESPACE_KEYS,
  KNOWLEDGE_GRAPH_NODE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_PRINCIPLES,
  KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY,
} from "./knowledgeGraphCatalog.ts";
import {
  getKnowledgeGraphSnapshot,
  initializeKnowledgeGraph,
  isKnowledgeGraphInitialized,
} from "./knowledgeGraphRegistry.ts";
import type {
  GraphExtensionPoint,
  GraphManifest,
  GraphMetadata,
  GraphNamespace,
  GraphValidationReport,
  KnowledgeGraphDefinition,
  KnowledgeGraphEdge,
  KnowledgeGraphNode,
  SourceNode,
  TargetNode,
} from "./knowledgeGraphTypes.ts";
import {
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateGraphContractVersion,
  validateGraphCoreNamespace,
  validateGraphDependencyDeclarations,
  validateKnowledgeFoundationDependency,
} from "./knowledgeGraphValidation.ts";

export const KNOWLEDGE_GRAPH_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noGraphTraversal: true,
  noGraphAlgorithms: true,
  noPathFinding: true,
  noSemanticSearch: true,
  noRetrieval: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  structureOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_GRAPH_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_GRAPH_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_GRAPH_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/4",
  title: "Knowledge Graph",
  goal: "Canonical metadata-only knowledge graph nodes, edges, types, and registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeGraphCatalog.ts",
    "frontend/app/lib/knowledge/knowledgeGraphTypes.ts",
    "frontend/app/lib/knowledge/knowledgeGraphContracts.ts",
    "frontend/app/lib/knowledge/knowledgeGraphRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeGraphValidation.ts",
    "frontend/app/lib/knowledge/knowledgeGraph.ts",
    "frontend/app/lib/knowledge/knowledgeGraph.test.ts",
    "docs/knl-4-knowledge-graph-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_GRAPH_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_4]", "[KNOWLEDGE_GRAPH]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): GraphMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    namespace: KNOWLEDGE_GRAPH_NAMESPACE,
    owner: "knowledge-graph-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveGraphMetadataExample(timestamp: string): GraphMetadata {
  return createMetadata("graph-metadata-example-001", timestamp);
}

export function resolveGraphNamespaceExample(timestamp: string): GraphNamespace {
  return Object.freeze({
    namespaceId: "graph-namespace-example-001",
    namespaceKey: "knowledge-graph-core",
    label: "Knowledge Graph Core",
    description: "Example graph namespace contract.",
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: resolveGraphMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveSourceNodeExample(): SourceNode {
  return Object.freeze({ nodeId: "graph-node-example-001", readOnly: true as const });
}

export function resolveTargetNodeExample(): TargetNode {
  return Object.freeze({ nodeId: "graph-node-example-002", readOnly: true as const });
}

export function resolveKnowledgeGraphNodeExample(timestamp: string): KnowledgeGraphNode {
  return Object.freeze({
    nodeId: "graph-node-example-001",
    nodeTypeKey: "entity",
    label: "Graph Node Example",
    description: "Example knowledge graph node contract.",
    namespaceKey: "knowledge-graph-core",
    ontologyEntityId: "business-relationship-type-supports",
    vocabularyTermId: null,
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: resolveGraphMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeGraphEdgeExample(timestamp: string): KnowledgeGraphEdge {
  return Object.freeze({
    edgeId: "graph-edge-example-001",
    edgeTypeKey: "depends_on",
    sourceNode: resolveSourceNodeExample(),
    targetNode: resolveTargetNodeExample(),
    relationshipMetadata: Object.freeze({
      relationshipType: "depends_on",
      label: "Depends On",
      description: "Example relationship metadata.",
      ontologyRelationshipType: "depends_on",
      vocabularyTermId: null,
      readOnly: true as const,
    }),
    namespaceKey: "knowledge-graph-core",
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: resolveGraphMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeGraphDefinitionExample(timestamp: string): KnowledgeGraphDefinition {
  return Object.freeze({
    graphId: KNOWLEDGE_GRAPH_ID,
    graphName: KNOWLEDGE_GRAPH_NAME,
    namespace: KNOWLEDGE_GRAPH_NAMESPACE,
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    nodeCount: 0,
    edgeCount: 0,
    readOnly: true as const,
  });
}

export function resolveGraphExtensionPointExample(timestamp: string): GraphExtensionPoint {
  return Object.freeze({
    extensionPointId: "graph-extension-industry-models",
    extensionPointKey: "industry_models",
    label: "Industry Models",
    description: "Reserved extension point for industry models.",
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: resolveGraphMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgeGraphManifest(timestamp: string = new Date(0).toISOString()): GraphManifest {
  if (!isKnowledgeGraphInitialized()) {
    initializeKnowledgeGraph(timestamp);
  }
  return Object.freeze({
    graphId: KNOWLEDGE_GRAPH_ID,
    graphName: KNOWLEDGE_GRAPH_NAME,
    namespace: KNOWLEDGE_GRAPH_NAMESPACE,
    contractVersion: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_GRAPH_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    supportedNodeTypes: KNOWLEDGE_GRAPH_NODE_TYPE_KEYS,
    supportedEdgeTypes: KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS,
    supportedNamespaces: KNOWLEDGE_GRAPH_NAMESPACE_KEYS,
    publicApis: KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_GRAPH_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_GRAPH_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_GRAPH_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_GRAPH_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeGraph(timestamp: string = new Date(0).toISOString()): GraphValidationReport {
  const issues: GraphValidationReport["issues"][number][] = [];

  const dependencyValidation = validateGraphDependencyDeclarations();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const versionValidation = validateGraphContractVersion();
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  const namespaceValidation = validateGraphCoreNamespace();
  if (!namespaceValidation.valid) {
    issues.push(...namespaceValidation.issues);
  }

  if (!isKnowledgeGraphInitialized()) {
    initializeKnowledgeGraph(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) {
    issues.push(...foundationValidation.issues);
  }

  const ontologyValidation = validateBusinessOntologyDependency(timestamp);
  if (!ontologyValidation.valid) {
    issues.push(...ontologyValidation.issues);
  }

  const vocabularyValidation = validateBusinessVocabularyDependency(timestamp);
  if (!vocabularyValidation.valid) {
    issues.push(...vocabularyValidation.issues);
  }

  const manifestValidation = validateStageManifest(KNOWLEDGE_GRAPH_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getKnowledgeGraphSnapshot();
  if (snapshot.nodeTypeCount < KNOWLEDGE_GRAPH_NODE_TYPE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Graph node type registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.edgeTypeCount < KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Graph edge type registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.namespaceCount < KNOWLEDGE_GRAPH_NAMESPACE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Graph namespace registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationValid: foundationValidation.valid,
    ontologyValid: ontologyValidation.valid,
    vocabularyValid: vocabularyValidation.valid,
    graphInitialized: isKnowledgeGraphInitialized(),
    registryValid:
      snapshot.nodeTypeCount >= KNOWLEDGE_GRAPH_NODE_TYPE_KEYS.length &&
      snapshot.edgeTypeCount >= KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgeGraphContract = Object.freeze({
  KNOWLEDGE_GRAPH_PUBLIC_API_RULES,
  KNOWLEDGE_GRAPH_SELF_MANIFEST,
  getKnowledgeGraphManifest,
  validateKnowledgeGraph,
  resolveKnowledgeGraphNodeExample,
  resolveKnowledgeGraphEdgeExample,
  version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
});
