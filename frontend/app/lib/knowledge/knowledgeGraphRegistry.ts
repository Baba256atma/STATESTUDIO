/**
 * KNL-4 — Knowledge Graph metadata registry.
 */

import {
  KNOWLEDGE_GRAPH_CONTRACT_VERSION,
  KNOWLEDGE_GRAPH_DEFAULT_LIMITS,
  KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_ID,
  KNOWLEDGE_GRAPH_NAMESPACE,
  KNOWLEDGE_GRAPH_NAMESPACE_KEYS,
  KNOWLEDGE_GRAPH_NODE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_OWNER,
} from "./knowledgeGraphCatalog.ts";
import type {
  GraphEdgeType,
  GraphMetadata,
  GraphNamespace,
  GraphNodeType,
  GraphResult,
  GraphSnapshot,
  GraphState,
  KnowledgeEdgeRegistrationInput,
  KnowledgeGraphEdge,
  KnowledgeGraphNode,
  KnowledgeNodeRegistrationInput,
  KnowledgeNodeTypeRegistrationInput,
} from "./knowledgeGraphTypes.ts";
import {
  validateKnowledgeEdgeRegistration,
  validateKnowledgeNodeRegistration,
  validateKnowledgeNodeTypeRegistration,
} from "./knowledgeGraphValidation.ts";
import { initializeBusinessVocabulary } from "./businessVocabularyRegistry.ts";

export const KNOWLEDGE_GRAPH_REGISTRY_VERSION = "KNL/4-REGISTRY-1" as const;

const nodeRegistry = new Map<string, KnowledgeGraphNode>();
const edgeRegistry = new Map<string, KnowledgeGraphEdge>();
const nodeTypeRegistry = new Map<string, GraphNodeType>();
const edgeTypeRegistry = new Map<string, GraphEdgeType>();
const namespaceRegistry = new Map<string, GraphNamespace>();
const metadataRegistry = new Map<string, GraphMetadata>();

let graphInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): GraphResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    namespace: KNOWLEDGE_GRAPH_NAMESPACE,
    owner: KNOWLEDGE_GRAPH_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetKnowledgeGraphRegistryForTests(): void {
  nodeRegistry.clear();
  edgeRegistry.clear();
  nodeTypeRegistry.clear();
  edgeTypeRegistry.clear();
  namespaceRegistry.clear();
  metadataRegistry.clear();
  graphInitialized = false;
  lastInitializedAt = null;
}

export function isKnowledgeGraphInitialized(): boolean {
  return graphInitialized;
}

export function getKnowledgeGraphState(timestamp: string = new Date(0).toISOString()): GraphState {
  const snapshot = getKnowledgeGraphSnapshot();
  return Object.freeze({
    graphId: KNOWLEDGE_GRAPH_ID,
    contractVersion: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    initialized: graphInitialized,
    nodeCount: snapshot.nodeCount,
    edgeCount: snapshot.edgeCount,
    nodeTypeCount: snapshot.nodeTypeCount,
    edgeTypeCount: snapshot.edgeTypeCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeKnowledgeGraph(
  timestamp: string = new Date(0).toISOString()
): GraphResult<GraphState> {
  const vocabulary = initializeBusinessVocabulary(timestamp);
  if (!vocabulary.success) {
    return createResult(false, "KNL/3 Business Vocabulary initialization failed.", null);
  }
  seedDefaultKnowledgeGraphCatalog(timestamp);
  graphInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Knowledge graph initialized.", getKnowledgeGraphState(timestamp));
}

export function registerKnowledgeNode(
  input: KnowledgeNodeRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): GraphResult<KnowledgeGraphNode> {
  const validation = validateKnowledgeNodeRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (nodeRegistry.has(input.nodeId)) {
    return createResult(false, `Knowledge graph node already registered: ${input.nodeId}.`, null);
  }
  if (nodeRegistry.size >= KNOWLEDGE_GRAPH_DEFAULT_LIMITS.maxRegisteredNodes) {
    return createResult(false, "Knowledge graph node registry limit reached.", null);
  }
  const entry = Object.freeze({
    nodeId: input.nodeId,
    nodeTypeKey: input.nodeTypeKey,
    label: input.label.trim(),
    description: input.description.trim(),
    namespaceKey: input.namespaceKey,
    ontologyEntityId: input.ontologyEntityId ?? null,
    vocabularyTermId: input.vocabularyTermId ?? null,
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-node-${input.nodeId}`, timestamp),
    readOnly: true as const,
  });
  nodeRegistry.set(entry.nodeId, entry);
  return createResult(true, "Knowledge graph node registered.", entry);
}

export function registerKnowledgeEdge(
  input: KnowledgeEdgeRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): GraphResult<KnowledgeGraphEdge> {
  const registeredNodeIds = [...nodeRegistry.keys()];
  const validation = validateKnowledgeEdgeRegistration(input, registeredNodeIds);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (edgeRegistry.has(input.edgeId)) {
    return createResult(false, `Knowledge graph edge already registered: ${input.edgeId}.`, null);
  }
  if (edgeRegistry.size >= KNOWLEDGE_GRAPH_DEFAULT_LIMITS.maxRegisteredEdges) {
    return createResult(false, "Knowledge graph edge registry limit reached.", null);
  }
  const entry = Object.freeze({
    edgeId: input.edgeId,
    edgeTypeKey: input.edgeTypeKey,
    sourceNode: Object.freeze({ nodeId: input.sourceNodeId, readOnly: true as const }),
    targetNode: Object.freeze({ nodeId: input.targetNodeId, readOnly: true as const }),
    relationshipMetadata: Object.freeze({
      relationshipType: input.edgeTypeKey,
      label: input.label.trim(),
      description: input.description.trim(),
      ontologyRelationshipType: input.ontologyRelationshipType ?? null,
      vocabularyTermId: input.vocabularyTermId ?? null,
      readOnly: true as const,
    }),
    namespaceKey: input.namespaceKey,
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-edge-${input.edgeId}`, timestamp),
    readOnly: true as const,
  });
  edgeRegistry.set(entry.edgeId, entry);
  return createResult(true, "Knowledge graph edge registered.", entry);
}

export function registerKnowledgeNodeType(
  input: KnowledgeNodeTypeRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): GraphResult<GraphNodeType> {
  const validation = validateKnowledgeNodeTypeRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (nodeTypeRegistry.has(input.nodeTypeId)) {
    return createResult(false, `Knowledge graph node type already registered: ${input.nodeTypeId}.`, null);
  }
  if (nodeTypeRegistry.size >= KNOWLEDGE_GRAPH_DEFAULT_LIMITS.maxRegisteredNodeTypes) {
    return createResult(false, "Knowledge graph node type registry limit reached.", null);
  }
  const entry = Object.freeze({
    nodeTypeId: input.nodeTypeId,
    nodeTypeKey: input.nodeTypeKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-node-type-${input.nodeTypeId}`, timestamp),
    readOnly: true as const,
  });
  nodeTypeRegistry.set(entry.nodeTypeId, entry);
  return createResult(true, "Knowledge graph node type registered.", entry);
}

function registerGraphEdgeType(
  input: { edgeTypeId: string; edgeTypeKey: (typeof KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS)[number]; label: string; description: string },
  timestamp: string
): GraphResult<GraphEdgeType> {
  if (edgeTypeRegistry.has(input.edgeTypeId)) {
    return createResult(false, `Edge type already registered: ${input.edgeTypeId}.`, null);
  }
  const entry = Object.freeze({
    edgeTypeId: input.edgeTypeId,
    edgeTypeKey: input.edgeTypeKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-edge-type-${input.edgeTypeId}`, timestamp),
    readOnly: true as const,
  });
  edgeTypeRegistry.set(entry.edgeTypeId, entry);
  return createResult(true, "Edge type registered.", entry);
}

function registerGraphNamespace(
  input: { namespaceId: string; namespaceKey: (typeof KNOWLEDGE_GRAPH_NAMESPACE_KEYS)[number]; label: string; description: string },
  timestamp: string
): GraphResult<GraphNamespace> {
  if (namespaceRegistry.has(input.namespaceId)) {
    return createResult(false, `Namespace already registered: ${input.namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId: input.namespaceId,
    namespaceKey: input.namespaceKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${input.namespaceId}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Namespace registered.", entry);
}

function registerGraphMetadata(
  metadataId: string,
  timestamp: string,
  extensions: Readonly<Record<string, string>> = {}
): GraphResult<GraphMetadata> {
  if (metadataRegistry.has(metadataId)) {
    return createResult(false, `Metadata already registered: ${metadataId}.`, null);
  }
  const entry = createMetadata(metadataId, timestamp, extensions);
  metadataRegistry.set(entry.metadataId, entry);
  return createResult(true, "Graph metadata registered.", entry);
}

export function getKnowledgeGraphSnapshot(): GraphSnapshot {
  return Object.freeze({
    graphVersion: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
    nodeCount: nodeRegistry.size,
    edgeCount: edgeRegistry.size,
    nodeTypeCount: nodeTypeRegistry.size || KNOWLEDGE_GRAPH_NODE_TYPE_KEYS.length,
    edgeTypeCount: edgeTypeRegistry.size || KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS.length,
    namespaceCount: namespaceRegistry.size || KNOWLEDGE_GRAPH_NAMESPACE_KEYS.length,
    metadataCount: metadataRegistry.size,
    readOnly: true as const,
  });
}

export function getKnowledgeGraphRegistry(): Readonly<{
  nodes: readonly KnowledgeGraphNode[];
  edges: readonly KnowledgeGraphEdge[];
  nodeTypes: readonly GraphNodeType[];
  edgeTypes: readonly GraphEdgeType[];
  namespaces: readonly GraphNamespace[];
  metadataRecords: readonly GraphMetadata[];
  snapshot: GraphSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    nodes: Object.freeze([...nodeRegistry.values()].sort((a, b) => a.nodeId.localeCompare(b.nodeId))),
    edges: Object.freeze([...edgeRegistry.values()].sort((a, b) => a.edgeId.localeCompare(b.edgeId))),
    nodeTypes: Object.freeze([...nodeTypeRegistry.values()].sort((a, b) => a.nodeTypeId.localeCompare(b.nodeTypeId))),
    edgeTypes: Object.freeze([...edgeTypeRegistry.values()].sort((a, b) => a.edgeTypeId.localeCompare(b.edgeTypeId))),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getKnowledgeGraphSnapshot(),
    readOnly: true as const,
  });
}

export function getKnowledgeGraphDefinition(): Readonly<{
  graph: Readonly<{
    graphId: typeof KNOWLEDGE_GRAPH_ID;
    graphName: string;
    namespace: typeof KNOWLEDGE_GRAPH_NAMESPACE;
    version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
    nodeCount: number;
    edgeCount: number;
    readOnly: true;
  }>;
  state: GraphState;
  registry: ReturnType<typeof getKnowledgeGraphRegistry>;
  readOnly: true;
}> {
  const snapshot = getKnowledgeGraphSnapshot();
  const state = getKnowledgeGraphState();
  return Object.freeze({
    graph: Object.freeze({
      graphId: KNOWLEDGE_GRAPH_ID,
      graphName: "Knowledge Graph",
      namespace: KNOWLEDGE_GRAPH_NAMESPACE,
      version: KNOWLEDGE_GRAPH_CONTRACT_VERSION,
      nodeCount: snapshot.nodeCount,
      edgeCount: snapshot.edgeCount,
      readOnly: true as const,
    }),
    state,
    registry: getKnowledgeGraphRegistry(),
    readOnly: true as const,
  });
}

export function seedDefaultKnowledgeGraphCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (nodeTypeRegistry.size > 0) {
    return;
  }
  for (const nodeTypeKey of KNOWLEDGE_GRAPH_NODE_TYPE_KEYS) {
    registerKnowledgeNodeType(
      Object.freeze({
        nodeTypeId: `graph-node-type-${nodeTypeKey}`,
        nodeTypeKey,
        label: nodeTypeKey,
        description: `${nodeTypeKey} graph node type metadata.`,
      }),
      timestamp
    );
  }
  for (const edgeTypeKey of KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS) {
    registerGraphEdgeType(
      Object.freeze({
        edgeTypeId: `graph-edge-type-${edgeTypeKey}`,
        edgeTypeKey,
        label: edgeTypeKey,
        description: `${edgeTypeKey} graph edge type metadata.`,
      }),
      timestamp
    );
  }
  for (const namespaceKey of KNOWLEDGE_GRAPH_NAMESPACE_KEYS) {
    registerGraphNamespace(
      Object.freeze({
        namespaceId: `graph-namespace-${namespaceKey}`,
        namespaceKey,
        label: namespaceKey,
        description: `${namespaceKey} graph namespace metadata.`,
      }),
      timestamp
    );
  }
  registerGraphMetadata("knowledge-graph-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
}

export const KnowledgeGraphRegistry = Object.freeze({
  resetKnowledgeGraphRegistryForTests,
  initializeKnowledgeGraph,
  registerKnowledgeNode,
  registerKnowledgeEdge,
  registerKnowledgeNodeType,
  getKnowledgeGraphRegistry,
  getKnowledgeGraphSnapshot,
  getKnowledgeGraphDefinition,
  seedDefaultKnowledgeGraphCatalog,
});
