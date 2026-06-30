/**
 * KNL-4 — Knowledge Graph domain types.
 */

import type {
  KNOWLEDGE_GRAPH_CONTRACT_VERSION,
  KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_EXTENSION_POINT_KEYS,
  KNOWLEDGE_GRAPH_NAMESPACE,
  KNOWLEDGE_GRAPH_NAMESPACE_KEYS,
  KNOWLEDGE_GRAPH_NODE_TYPE_KEYS,
} from "./knowledgeGraphCatalog.ts";

export type GraphIdentifier = string;
export type GraphNodeTypeKey = (typeof KNOWLEDGE_GRAPH_NODE_TYPE_KEYS)[number];
export type GraphEdgeTypeKey = (typeof KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS)[number];
export type GraphNamespaceKey = (typeof KNOWLEDGE_GRAPH_NAMESPACE_KEYS)[number];
export type GraphExtensionPointKey = (typeof KNOWLEDGE_GRAPH_EXTENSION_POINT_KEYS)[number];
export type GraphVersion = typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION | string;

export type NodeIdentifier = GraphIdentifier;
export type EdgeIdentifier = GraphIdentifier;

export type GraphMetadata = Readonly<{
  metadataId: GraphIdentifier;
  metadataVersion: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_GRAPH_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type GraphNamespace = Readonly<{
  namespaceId: GraphIdentifier;
  namespaceKey: GraphNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  metadata: GraphMetadata;
  readOnly: true;
}>;

export type GraphNodeType = Readonly<{
  nodeTypeId: GraphIdentifier;
  nodeTypeKey: GraphNodeTypeKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  metadata: GraphMetadata;
  readOnly: true;
}>;

export type GraphEdgeType = Readonly<{
  edgeTypeId: GraphIdentifier;
  edgeTypeKey: GraphEdgeTypeKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  metadata: GraphMetadata;
  readOnly: true;
}>;

export type SourceNode = Readonly<{
  nodeId: NodeIdentifier;
  readOnly: true;
}>;

export type TargetNode = Readonly<{
  nodeId: NodeIdentifier;
  readOnly: true;
}>;

export type RelationshipMetadata = Readonly<{
  relationshipType: GraphEdgeTypeKey;
  label: string;
  description: string;
  ontologyRelationshipType: string | null;
  vocabularyTermId: string | null;
  readOnly: true;
}>;

export type KnowledgeGraphNode = Readonly<{
  nodeId: NodeIdentifier;
  nodeTypeKey: GraphNodeTypeKey;
  label: string;
  description: string;
  namespaceKey: GraphNamespaceKey;
  ontologyEntityId: string | null;
  vocabularyTermId: string | null;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  metadata: GraphMetadata;
  readOnly: true;
}>;

export type KnowledgeGraphEdge = Readonly<{
  edgeId: EdgeIdentifier;
  edgeTypeKey: GraphEdgeTypeKey;
  sourceNode: SourceNode;
  targetNode: TargetNode;
  relationshipMetadata: RelationshipMetadata;
  namespaceKey: GraphNamespaceKey;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  metadata: GraphMetadata;
  readOnly: true;
}>;

export type KnowledgeGraphDefinition = Readonly<{
  graphId: typeof import("./knowledgeGraphCatalog.ts").KNOWLEDGE_GRAPH_ID;
  graphName: typeof import("./knowledgeGraphCatalog.ts").KNOWLEDGE_GRAPH_NAME;
  namespace: typeof KNOWLEDGE_GRAPH_NAMESPACE;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  nodeCount: number;
  edgeCount: number;
  readOnly: true;
}>;

export type GraphExtensionPoint = Readonly<{
  extensionPointId: GraphIdentifier;
  extensionPointKey: GraphExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  metadata: GraphMetadata;
  readOnly: true;
}>;

export type GraphManifest = Readonly<{
  graphId: typeof import("./knowledgeGraphCatalog.ts").KNOWLEDGE_GRAPH_ID;
  graphName: typeof import("./knowledgeGraphCatalog.ts").KNOWLEDGE_GRAPH_NAME;
  namespace: typeof KNOWLEDGE_GRAPH_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeGraphCatalog.ts").KNOWLEDGE_GRAPH_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  supportedNodeTypes: readonly GraphNodeTypeKey[];
  supportedEdgeTypes: readonly GraphEdgeTypeKey[];
  supportedNamespaces: readonly GraphNamespaceKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type GraphValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type GraphValidationResult = Readonly<{
  valid: boolean;
  issues: readonly GraphValidationIssue[];
  readOnly: true;
}>;

export type GraphResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgeNodeRegistrationInput = Readonly<{
  nodeId: NodeIdentifier;
  nodeTypeKey: GraphNodeTypeKey;
  label: string;
  description: string;
  namespaceKey: GraphNamespaceKey;
  ontologyEntityId?: string;
  vocabularyTermId?: string;
}>;

export type KnowledgeEdgeRegistrationInput = Readonly<{
  edgeId: EdgeIdentifier;
  edgeTypeKey: GraphEdgeTypeKey;
  sourceNodeId: NodeIdentifier;
  targetNodeId: NodeIdentifier;
  label: string;
  description: string;
  namespaceKey: GraphNamespaceKey;
  ontologyRelationshipType?: string;
  vocabularyTermId?: string;
}>;

export type KnowledgeNodeTypeRegistrationInput = Readonly<{
  nodeTypeId: GraphIdentifier;
  nodeTypeKey: GraphNodeTypeKey;
  label: string;
  description: string;
}>;

export type KnowledgeEdgeTypeRegistrationInput = Readonly<{
  edgeTypeId: GraphIdentifier;
  edgeTypeKey: GraphEdgeTypeKey;
  label: string;
  description: string;
}>;

export type GraphNamespaceRegistrationInput = Readonly<{
  namespaceId: GraphIdentifier;
  namespaceKey: GraphNamespaceKey;
  label: string;
  description: string;
}>;

export type GraphMetadataRegistrationInput = Readonly<{
  metadataId: GraphIdentifier;
  owner: string;
  extensions?: Readonly<Record<string, string>>;
}>;

export type GraphSnapshot = Readonly<{
  graphVersion: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  nodeCount: number;
  edgeCount: number;
  nodeTypeCount: number;
  edgeTypeCount: number;
  namespaceCount: number;
  metadataCount: number;
  readOnly: true;
}>;

export type GraphState = Readonly<{
  graphId: typeof import("./knowledgeGraphCatalog.ts").KNOWLEDGE_GRAPH_ID;
  contractVersion: typeof KNOWLEDGE_GRAPH_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  initialized: boolean;
  nodeCount: number;
  edgeCount: number;
  nodeTypeCount: number;
  edgeTypeCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type GraphValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly GraphValidationIssue[];
  readOnly: true;
}>;
