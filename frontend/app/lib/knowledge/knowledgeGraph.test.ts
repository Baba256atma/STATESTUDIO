import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_GRAPH_CONTRACT_VERSION,
  KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_FUTURE_PHASE_KEYS,
  KNOWLEDGE_GRAPH_MUST_NOT_OWN,
  KNOWLEDGE_GRAPH_NAMESPACE_KEYS,
  KNOWLEDGE_GRAPH_NODE_TYPE_KEYS,
  KNOWLEDGE_GRAPH_PRINCIPLES,
  KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY,
} from "./knowledgeGraphCatalog.ts";
import {
  KNOWLEDGE_GRAPH_PUBLIC_API_RULES,
  KNOWLEDGE_GRAPH_SELF_MANIFEST,
  KnowledgeGraphContract,
  getKnowledgeGraphManifest,
  resolveKnowledgeGraphEdgeExample,
  resolveKnowledgeGraphNodeExample,
  validateKnowledgeGraph,
} from "./knowledgeGraphContracts.ts";
import {
  KnowledgeGraph,
  buildKnowledgeGraph,
  getKnowledgeGraph,
  isKnowledgeGraphInitialized,
  registerKnowledgeEdge,
  registerKnowledgeNode,
  registerKnowledgeNodeType,
  resetKnowledgeGraphForTests,
} from "./knowledgeGraph.ts";
import {
  hasDuplicateGraphIds,
  validateGraphNamespaceFormat,
  validateGraphVersionFormat,
  validateKnowledgeEdgeRegistration,
  validateKnowledgeNodeRegistration,
} from "./knowledgeGraphValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeGraphForTests();
});

test("exports KNL/4 knowledge graph contract vocabulary", () => {
  assert.equal(KNOWLEDGE_GRAPH_CONTRACT_VERSION, "KNL/4");
  assert.equal(KNOWLEDGE_GRAPH_NODE_TYPE_KEYS.length, 12);
  assert.equal(KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS.length, 13);
  assert.equal(KNOWLEDGE_GRAPH_NAMESPACE_KEYS.length, 4);
});

test("initializes knowledge graph with KNL/1 KNL/2 and KNL/3 dependencies", () => {
  assert.equal(isKnowledgeGraphInitialized(), false);
  const init = buildKnowledgeGraph(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgeGraphInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.contractVersion, "KNL/4");
});

test("seeds graph catalog with node types edge types and namespaces", () => {
  buildKnowledgeGraph(FIXED_TIME);
  const graph = getKnowledgeGraph(FIXED_TIME);
  assert.equal(graph.registry.nodeTypes.length, KNOWLEDGE_GRAPH_NODE_TYPE_KEYS.length);
  assert.equal(graph.registry.edgeTypes.length, KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS.length);
  assert.equal(graph.registry.namespaces.length, KNOWLEDGE_GRAPH_NAMESPACE_KEYS.length);
  assert.equal(graph.registry.metadataRecords.length, 1);
});

test("registers knowledge graph node edge and node type", () => {
  buildKnowledgeGraph(FIXED_TIME);
  const nodeA = registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-test-001",
      nodeTypeKey: "goal",
      label: "Strategic Goal Node",
      description: "Test graph node A.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-supports",
    }),
    FIXED_TIME
  );
  assert.equal(nodeA.success, true);
  const nodeB = registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-test-002",
      nodeTypeKey: "kpi",
      label: "Revenue KPI Node",
      description: "Test graph node B.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-measures",
    }),
    FIXED_TIME
  );
  assert.equal(nodeB.success, true);
  const edge = registerKnowledgeEdge(
    Object.freeze({
      edgeId: "graph-edge-test-001",
      edgeTypeKey: "measures",
      sourceNodeId: "graph-node-test-002",
      targetNodeId: "graph-node-test-001",
      label: "Measures",
      description: "KPI measures goal.",
      namespaceKey: "knowledge-graph-core",
      ontologyRelationshipType: "measures",
    }),
    FIXED_TIME
  );
  assert.equal(edge.success, true);
  const nodeType = registerKnowledgeNodeType(
    Object.freeze({
      nodeTypeId: "graph-node-type-test-custom",
      nodeTypeKey: "extension",
      label: "Extension Node",
      description: "Custom node type registration.",
    }),
    FIXED_TIME
  );
  assert.equal(nodeType.success, true);
});

test("prevents duplicate node and edge ids", () => {
  buildKnowledgeGraph(FIXED_TIME);
  registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-dup-001",
      nodeTypeKey: "entity",
      label: "Node A",
      description: "First node.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-owns",
    }),
    FIXED_TIME
  );
  registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-dup-002",
      nodeTypeKey: "entity",
      label: "Node B",
      description: "Second node.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-contains",
    }),
    FIXED_TIME
  );
  const duplicateNode = registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-dup-001",
      nodeTypeKey: "entity",
      label: "Duplicate",
      description: "Duplicate node.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-owns",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateNode.success, false);
  registerKnowledgeEdge(
    Object.freeze({
      edgeId: "graph-edge-dup-001",
      edgeTypeKey: "contains",
      sourceNodeId: "graph-node-dup-001",
      targetNodeId: "graph-node-dup-002",
      label: "Contains",
      description: "First edge.",
      namespaceKey: "knowledge-graph-core",
    }),
    FIXED_TIME
  );
  const duplicateEdge = registerKnowledgeEdge(
    Object.freeze({
      edgeId: "graph-edge-dup-001",
      edgeTypeKey: "contains",
      sourceNodeId: "graph-node-dup-001",
      targetNodeId: "graph-node-dup-002",
      label: "Duplicate",
      description: "Duplicate edge.",
      namespaceKey: "knowledge-graph-core",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateEdge.success, false);
});

test("rejects edge with invalid node references", () => {
  buildKnowledgeGraph(FIXED_TIME);
  assert.equal(
    validateKnowledgeEdgeRegistration(
      Object.freeze({
        edgeId: "graph-edge-invalid",
        edgeTypeKey: "depends_on",
        sourceNodeId: "missing-source",
        targetNodeId: "missing-target",
        label: "Invalid",
        description: "Invalid node references.",
        namespaceKey: "knowledge-graph-core",
      }),
      Object.freeze([])
    ).valid,
    false
  );
  const result = registerKnowledgeEdge(
    Object.freeze({
      edgeId: "graph-edge-missing-nodes",
      edgeTypeKey: "depends_on",
      sourceNodeId: "nonexistent-a",
      targetNodeId: "nonexistent-b",
      label: "Invalid",
      description: "Missing nodes.",
      namespaceKey: "knowledge-graph-core",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});

test("validates graph version namespace format and duplicate ids", () => {
  assert.equal(validateGraphVersionFormat("KNL/4").valid, true);
  assert.equal(validateGraphVersionFormat("KNL/3").valid, true);
  assert.equal(validateGraphVersionFormat("invalid").valid, false);
  assert.equal(validateGraphNamespaceFormat("knowledge-graph-core").valid, true);
  assert.equal(validateGraphNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(hasDuplicateGraphIds(["a", "b", "a"]), true);
  buildKnowledgeGraph(FIXED_TIME);
  assert.equal(
    validateKnowledgeNodeRegistration(
      Object.freeze({
        nodeId: "graph-node-valid",
        nodeTypeKey: "risk",
        label: "Risk Node",
        description: "Valid node.",
        namespaceKey: "knowledge-graph-ontology",
        ontologyEntityId: "business-relationship-type-mitigates",
      })
    ).valid,
    true
  );
});

test("resolves immutable graph contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeGraphNodeExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeGraphEdgeExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeGraphNodeExample(FIXED_TIME).version, "KNL/4");
  assert.equal(resolveKnowledgeGraphEdgeExample(FIXED_TIME).edgeTypeKey, "depends_on");
});

test("builds immutable knowledge graph manifest", () => {
  buildKnowledgeGraph(FIXED_TIME);
  const manifest = getKnowledgeGraphManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/4");
  assert.equal(manifest.foundationDependency, "KNL/1");
  assert.equal(manifest.ontologyDependency, "KNL/2");
  assert.equal(manifest.vocabularyDependency, "KNL/3");
  assert.equal(manifest.publicApis.length, KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge graph certification report", () => {
  const report = validateKnowledgeGraph(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/4 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_GRAPH_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeGraph.ts",
    allowedFiles: KNOWLEDGE_GRAPH_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_GRAPH_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_GRAPH_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_GRAPH_PUBLIC_API_RULES.noGraphTraversal, true);
  assert.equal(KNOWLEDGE_GRAPH_PUBLIC_API_RULES.noGraphAlgorithms, true);
  assert.equal(KNOWLEDGE_GRAPH_MUST_NOT_OWN.includes("graph_traversal"), true);
  assert.equal(KNOWLEDGE_GRAPH_MUST_NOT_OWN.includes("shortest_path"), true);
  assert.equal(KNOWLEDGE_GRAPH_PRINCIPLES.includes("knl_4_consumes_knl_1_2_3_only"), true);
});

test("exports knowledge graph contract bundle", () => {
  assert.equal(KnowledgeGraphContract.version, "KNL/4");
  assert.equal(typeof KnowledgeGraphContract.validateKnowledgeGraph, "function");
  assert.equal(typeof KnowledgeGraphContract.getKnowledgeGraphManifest, "function");
});

test("KnowledgeGraph namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgeGraph.registerKnowledgeNode, "function");
  assert.equal(typeof KnowledgeGraph.registerKnowledgeEdge, "function");
  assert.equal(typeof KnowledgeGraph.registerKnowledgeNodeType, "function");
  assert.equal(typeof KnowledgeGraph.getKnowledgeGraph, "function");
  assert.equal(typeof KnowledgeGraph.validateKnowledgeGraph, "function");
  assert.equal(typeof KnowledgeGraph.getKnowledgeGraphManifest, "function");
  assert.equal(KnowledgeGraph.version, "KNL/4");
});

test("public API registry includes required graph exports", () => {
  assert.ok(KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.includes("registerKnowledgeNode"));
  assert.ok(KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.includes("registerKnowledgeEdge"));
  assert.ok(KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.includes("registerKnowledgeNodeType"));
  assert.ok(KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.includes("getKnowledgeGraph"));
  assert.ok(KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.includes("validateKnowledgeGraph"));
  assert.ok(KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY.includes("getKnowledgeGraphManifest"));
});

test("future phase registry reserves industry models without implementation", () => {
  assert.equal(KNOWLEDGE_GRAPH_FUTURE_PHASE_KEYS.includes("industry_models"), true);
  assert.equal(KNOWLEDGE_GRAPH_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
});

test("getKnowledgeGraph returns graph state and registry", () => {
  buildKnowledgeGraph(FIXED_TIME);
  registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-state-test",
      nodeTypeKey: "decision",
      label: "Decision Node",
      description: "State test node.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-affects",
    }),
    FIXED_TIME
  );
  const graph = getKnowledgeGraph(FIXED_TIME);
  assert.equal(graph.state.initialized, true);
  assert.equal(graph.registry.snapshot.graphVersion, "KNL/4");
  assert.equal(graph.graph.nodeCount, 1);
});

test("rejects self-referencing edge", () => {
  buildKnowledgeGraph(FIXED_TIME);
  registerKnowledgeNode(
    Object.freeze({
      nodeId: "graph-node-self",
      nodeTypeKey: "entity",
      label: "Self Node",
      description: "Self reference test.",
      namespaceKey: "knowledge-graph-core",
      ontologyEntityId: "business-relationship-type-belongs_to",
    }),
    FIXED_TIME
  );
  const result = registerKnowledgeEdge(
    Object.freeze({
      edgeId: "graph-edge-self",
      edgeTypeKey: "belongs_to",
      sourceNodeId: "graph-node-self",
      targetNodeId: "graph-node-self",
      label: "Self",
      description: "Self edge.",
      namespaceKey: "knowledge-graph-core",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
