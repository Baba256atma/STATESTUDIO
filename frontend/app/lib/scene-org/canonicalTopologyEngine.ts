/**
 * NPA-T CANONICAL-TOPOLOGY-ENGINE:1
 *
 * Derived structural analysis of an authorized canonical relationship graph.
 * This module does not create, store, or rewrite relationships.
 *
 * Complexity: star, ring, mesh, tree, and hybrid are O(N + E) degree and
 * search passes. Hybrid walks at most one induced cycle and then leaf stars.
 * It does not enumerate subgraphs. Bus is a constant unsupported result.
 * Projection is refused above CANONICAL_TOPOLOGY_RENDER_LIMIT nodes.
 */

import { SCENE_ORG_STAGE_PLANE_LIMIT } from "./sceneOrgSavedSceneSpatialState.ts";

export const canonicalTopologyEngineIdentity =
  "NPA-T CANONICAL-TOPOLOGY-ENGINE:1/WorkspaceCanonicalTopologyEngine" as const;

export const CANONICAL_TOPOLOGY_TYPES = Object.freeze([
  "STAR",
  "RING",
  "MESH",
  "BUS",
  "TREE",
  "HYBRID",
] as const);

export type CanonicalTopologyType = (typeof CANONICAL_TOPOLOGY_TYPES)[number];

export type CanonicalTopologyStructuralStatus =
  | "MATCH"
  | "PARTIAL_MATCH"
  | "NO_MATCH"
  | "INSUFFICIENT_DATA"
  | "UNSUPPORTED_SEMANTICS";

export type CanonicalTopologySemanticScope =
  | "ALL_AUTHORIZED"
  | "SELECTED_TYPE"
  | "COMPATIBLE_SUBSET";

export const CANONICAL_TOPOLOGY_RENDER_LIMIT = 100 as const;

export type CanonicalTopologyEvidence = Readonly<{
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  direction: "DIRECTED" | "UNDIRECTED";
  provenanceOrigin: string | null;
}>;

export type CanonicalTopologyCandidate = Readonly<{
  topologyType: CanonicalTopologyType;
  structuralStatus: CanonicalTopologyStructuralStatus;
  nodeIds: readonly string[];
  relationshipIds: readonly string[];
  relationshipTypesConsidered: readonly string[];
  semanticScope: CanonicalTopologySemanticScope;
  directionHandling: string;
  centerNodeId: string | null;
  centerCandidates: readonly string[];
  rootNodeIds: readonly string[];
  hierarchy: boolean;
  meshKind: "FULL" | "PARTIAL" | null;
  constituentPatterns: readonly string[];
  excludedRelationshipIds: readonly string[];
  diagnostics: readonly string[];
  ambiguities: readonly string[];
  explanation: string;
}>;

export type CanonicalTopologyAnalysis = Readonly<{
  identity: typeof canonicalTopologyEngineIdentity;
  workspaceId: string;
  deckId: string;
  contextKey: string;
  confidenceBasis: "DETERMINISTIC_GRAPH_RULES";
  syntheticCanonicalEdges: false;
  inputNodeIds: readonly string[];
  inputRelationshipIds: readonly string[];
  candidates: readonly CanonicalTopologyCandidate[];
  recommendedPresentation: CanonicalTopologyType | null;
  recommendationRule: "exactly-one-covering-match" | "ambiguous-covering-matches" | "no-covering-match";
  busStatus: "UNSUPPORTED_SEMANTICS";
  diagnostics: readonly string[];
}>;

export type CanonicalTopologyProjection = Readonly<{
  topologyType: CanonicalTopologyType;
  positions: Readonly<Record<string, { readonly x: number; readonly y: number; readonly z: 0 }>>;
  centerNodeId: string | null;
  limitation: string | null;
}>;

type InputRelationship = Readonly<{
  relationshipId: string;
  workspaceId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  direction: "DIRECTED" | "UNDIRECTED";
  status?: "ACTIVE" | "ARCHIVED";
  provenance?: Readonly<{ origin?: string }>;
}>;

type Edge = CanonicalTopologyEvidence & { undirectedKey: string };

const HIERARCHY_TYPES = new Set(["REPORTS_TO", "CONTAINS"]);

export function canonicalTopologySupport(): Readonly<{
  star: "STRUCTURAL";
  ring: "STRUCTURAL";
  mesh: "FULL_AND_PARTIAL";
  bus: "UNSUPPORTED_SEMANTICS";
  tree: "STRUCTURAL_AND_HIERARCHY";
  hybrid: "BOUNDED_DECOMPOSITION";
}> {
  return Object.freeze({
    star: "STRUCTURAL" as const,
    ring: "STRUCTURAL" as const,
    mesh: "FULL_AND_PARTIAL" as const,
    bus: "UNSUPPORTED_SEMANTICS" as const,
    tree: "STRUCTURAL_AND_HIERARCHY" as const,
    hybrid: "BOUNDED_DECOMPOSITION" as const,
  });
}

export function parseCanonicalTopologyPresentation(value: unknown): CanonicalTopologyType | null {
  if (value === "STAR" || value === "RING" || value === "MESH" || value === "TREE" || value === "HYBRID") {
    return value;
  }
  return null;
}

export function analyzeCanonicalTopology(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly contextKey?: string;
  readonly nodeIds: readonly string[];
  readonly relationships: readonly InputRelationship[];
}): CanonicalTopologyAnalysis {
  const nodeIds = Object.freeze([...new Set(input.nodeIds.map((id) => id.trim()).filter((id) => id.length > 0))].sort());
  const present = new Set(nodeIds);
  const excluded: string[] = [];
  const edges: Edge[] = [];
  for (const relationship of input.relationships) {
    const reject =
      relationship.workspaceId !== input.workspaceId ||
      relationship.status === "ARCHIVED" ||
      !present.has(relationship.sourceObjectId) ||
      !present.has(relationship.targetObjectId) ||
      relationship.sourceObjectId === relationship.targetObjectId;
    if (reject) {
      excluded.push(relationship.relationshipId);
      continue;
    }
    const pair = [relationship.sourceObjectId, relationship.targetObjectId].sort();
    edges.push({
      relationshipId: relationship.relationshipId,
      sourceObjectId: relationship.sourceObjectId,
      targetObjectId: relationship.targetObjectId,
      relationshipType: relationship.relationshipType,
      direction: relationship.direction,
      provenanceOrigin: relationship.provenance?.origin ?? null,
      undirectedKey: `${pair[0]}\0${pair[1]}`,
    });
  }
  const adjacency = undirectedAdjacency(nodeIds, edges);
  const components = connectedComponents(nodeIds, adjacency);
  const degrees = degreeMap(nodeIds, adjacency);
  const undirectedEdgeCount = new Set(edges.map((edge) => edge.undirectedKey)).size;
  const directedCycle = hasDirectedCycle(nodeIds, edges);
  const candidates = [
    starCandidate(nodeIds, edges, degrees, undirectedEdgeCount, excluded),
    ringCandidate(nodeIds, edges, degrees, components, undirectedEdgeCount, directedCycle, excluded),
    meshCandidate(nodeIds, edges, degrees, components, undirectedEdgeCount, excluded),
    busCandidate(excluded),
    ...treeCandidates(nodeIds, edges, adjacency, components, undirectedEdgeCount, excluded),
    hybridCandidate(nodeIds, edges, adjacency, components, undirectedEdgeCount, excluded),
  ];
  const covering = candidates.filter((candidate) =>
    candidate.structuralStatus === "MATCH" &&
    sameIds(candidate.nodeIds, nodeIds) &&
    coversRelationships(candidate, edges));
  const recommendedPresentation = covering.length === 1 ? covering[0]!.topologyType : null;
  return Object.freeze({
    identity: canonicalTopologyEngineIdentity,
    workspaceId: input.workspaceId,
    deckId: input.deckId,
    contextKey: input.contextKey ?? `${input.workspaceId}:${input.deckId}`,
    confidenceBasis: "DETERMINISTIC_GRAPH_RULES" as const,
    syntheticCanonicalEdges: false as const,
    inputNodeIds: nodeIds,
    inputRelationshipIds: Object.freeze(edges.map((edge) => edge.relationshipId)),
    candidates: Object.freeze(candidates),
    recommendedPresentation,
    recommendationRule: covering.length === 1
      ? "exactly-one-covering-match" as const
      : covering.length > 1
        ? "ambiguous-covering-matches" as const
        : "no-covering-match" as const,
    busStatus: "UNSUPPORTED_SEMANTICS" as const,
    diagnostics: Object.freeze([
      "Topology is derived from authorized canonical relationships.",
      "A recommended presentation does not invalidate other matching candidates.",
      ...excluded.map((id) => `Excluded relationship ${id}.`),
    ]),
  });
}

export function projectCanonicalTopology(input: {
  readonly analysis: CanonicalTopologyAnalysis;
  readonly topologyType: CanonicalTopologyType;
  readonly hierarchy?: boolean;
}): CanonicalTopologyProjection | null {
  const candidate = input.analysis.candidates.find((entry) =>
    entry.topologyType === input.topologyType &&
    entry.structuralStatus === "MATCH" &&
    (input.hierarchy == null || entry.hierarchy === input.hierarchy));
  if (!candidate || input.topologyType === "BUS") return null;
  if (candidate.nodeIds.length > CANONICAL_TOPOLOGY_RENDER_LIMIT) {
    return Object.freeze({
      topologyType: input.topologyType,
      positions: Object.freeze({}),
      centerNodeId: candidate.centerNodeId,
      limitation: `Projection stops above ${CANONICAL_TOPOLOGY_RENDER_LIMIT} nodes.`,
    });
  }
  const positions: Record<string, { x: number; y: number; z: 0 }> = {};
  if (input.topologyType === "STAR" && candidate.centerNodeId) {
    positions[candidate.centerNodeId] = { x: 0, y: 0, z: 0 };
    placeCircle(candidate.nodeIds.filter((id) => id !== candidate.centerNodeId), 2.2, positions);
  } else if (input.topologyType === "RING" || input.topologyType === "MESH") {
    placeCircle(candidate.nodeIds, 2.4, positions);
  } else if (input.topologyType === "TREE") {
    placeTree(candidate, positions);
  } else if (input.topologyType === "HYBRID") {
    placeCircle(candidate.nodeIds, 2.6, positions);
  }
  return Object.freeze({
    topologyType: input.topologyType,
    positions: Object.freeze(positions),
    centerNodeId: candidate.centerNodeId,
    limitation: null,
  });
}

function candidate(partial: Omit<CanonicalTopologyCandidate, "meshKind" | "constituentPatterns" | "centerNodeId" | "centerCandidates" | "rootNodeIds" | "hierarchy"> & Partial<CanonicalTopologyCandidate>): CanonicalTopologyCandidate {
  return Object.freeze({
    meshKind: null,
    constituentPatterns: Object.freeze([]),
    centerNodeId: null,
    centerCandidates: Object.freeze([]),
    rootNodeIds: Object.freeze([]),
    hierarchy: false,
    ...partial,
    nodeIds: Object.freeze([...partial.nodeIds]),
    relationshipIds: Object.freeze([...partial.relationshipIds]),
    relationshipTypesConsidered: Object.freeze([...new Set(partial.relationshipTypesConsidered)].sort()),
    excludedRelationshipIds: Object.freeze([...partial.excludedRelationshipIds]),
    diagnostics: Object.freeze([...partial.diagnostics]),
    ambiguities: Object.freeze([...partial.ambiguities]),
  });
}

function starCandidate(
  nodeIds: readonly string[],
  edges: readonly Edge[],
  degrees: Map<string, number>,
  undirectedEdgeCount: number,
  excluded: readonly string[],
): CanonicalTopologyCandidate {
  const base = "Undirected structure. Directed types are preserved and do not assign a managerial role.";
  if (nodeIds.length < 2) {
    return candidate({
      topologyType: "STAR",
      structuralStatus: "INSUFFICIENT_DATA",
      nodeIds,
      relationshipIds: [],
      relationshipTypesConsidered: [],
      semanticScope: "ALL_AUTHORIZED",
      directionHandling: base,
      excludedRelationshipIds: excluded,
      diagnostics: ["Fewer than two nodes."],
      ambiguities: [],
      explanation: "A Star center cannot be identified from this graph.",
    });
  }
  if (nodeIds.length === 2) {
    return candidate({
      topologyType: "STAR",
      structuralStatus: undirectedEdgeCount === 1 ? "PARTIAL_MATCH" : "NO_MATCH",
      nodeIds,
      relationshipIds: edges.map((edge) => edge.relationshipId),
      relationshipTypesConsidered: edges.map((edge) => edge.relationshipType),
      semanticScope: "ALL_AUTHORIZED",
      directionHandling: base,
      centerCandidates: undirectedEdgeCount === 1 ? nodeIds : [],
      excludedRelationshipIds: excluded,
      diagnostics: ["A two-node graph has no unique center."],
      ambiguities: undirectedEdgeCount === 1 ? ["Both endpoints are center candidates."] : [],
      explanation: "Two nodes do not establish a unique Star.",
    });
  }
  const centers = nodeIds.filter((id) => (degrees.get(id) ?? 0) === nodeIds.length - 1);
  const leaves = nodeIds.filter((id) => (degrees.get(id) ?? 0) === 1);
  const strict = centers.length === 1 && leaves.length === nodeIds.length - 1 && undirectedEdgeCount === nodeIds.length - 1;
  const peripheralEdge = undirectedEdgeCount > nodeIds.length - 1 && centers.length > 0;
  return candidate({
    topologyType: "STAR",
    structuralStatus: strict ? "MATCH" : "NO_MATCH",
    nodeIds: strict ? nodeIds : [],
    relationshipIds: strict ? edges.map((edge) => edge.relationshipId) : [],
    relationshipTypesConsidered: strict ? edges.map((edge) => edge.relationshipType) : [],
    semanticScope: "ALL_AUTHORIZED",
    directionHandling: base,
    centerNodeId: strict ? centers[0]! : null,
    centerCandidates: centers,
    excludedRelationshipIds: excluded,
    diagnostics: [
      strict ? `Center ${centers[0]}.` : "Strict Star requires one center and no peripheral edges.",
      peripheralEdge ? "An extra peripheral edge rejects strict Star." : "",
    ].filter((entry) => entry.length > 0),
    ambiguities: centers.length > 1 ? ["More than one center candidate."] : [],
      explanation: strict
        ? "One node connects to every other node, and peripheral nodes do not connect to each other."
        : "The authorized graph is not a strict Star.",
    });
}

function ringCandidate(
  nodeIds: readonly string[],
  edges: readonly Edge[],
  degrees: Map<string, number>,
  components: number,
  undirectedEdgeCount: number,
  directedCycle: boolean,
  excluded: readonly string[],
): CanonicalTopologyCandidate {
  if (nodeIds.length < 3 || undirectedEdgeCount === 0) {
    return candidate({
      topologyType: "RING",
      structuralStatus: "INSUFFICIENT_DATA",
      nodeIds: [],
      relationshipIds: [],
      relationshipTypesConsidered: [],
      semanticScope: "ALL_AUTHORIZED",
      directionHandling: "No cycle edges are available. A circular layout is not a Ring.",
      excludedRelationshipIds: excluded,
      diagnostics: ["A presentation circle without canonical cycle edges is not a Ring."],
      ambiguities: [],
      explanation: "Ring recognition needs at least three nodes and a canonical cycle.",
    });
  }
  const allDegreeTwo = nodeIds.every((id) => degrees.get(id) === 2);
  const strict = components === 1 && allDegreeTwo && undirectedEdgeCount === nodeIds.length;
  return candidate({
    topologyType: "RING",
    structuralStatus: strict ? "MATCH" : "NO_MATCH",
    nodeIds: strict ? nodeIds : [],
    relationshipIds: strict ? edges.map((edge) => edge.relationshipId) : [],
    relationshipTypesConsidered: strict ? edges.map((edge) => edge.relationshipType) : [],
    semanticScope: "ALL_AUTHORIZED",
    directionHandling: directedCycle
      ? "The undirected structure is a cycle and a directed cycle is also present."
      : "The structure is evaluated undirected. Direction is preserved on each relationship.",
    excludedRelationshipIds: excluded,
    diagnostics: [
      strict ? "Every node has degree two in one connected cycle." : "A strict Ring is one connected cycle with every degree equal to two.",
      components > 1 ? "Disconnected nodes reject a single Ring." : "",
    ].filter((entry) => entry.length > 0),
    ambiguities: [],
    explanation: strict
      ? "The authorized edges form one cycle."
      : "The authorized graph is not a single Ring.",
  });
}

function meshCandidate(
  nodeIds: readonly string[],
  edges: readonly Edge[],
  degrees: Map<string, number>,
  components: number,
  undirectedEdgeCount: number,
  excluded: readonly string[],
): CanonicalTopologyCandidate {
  const fullCount = nodeIds.length >= 2 ? (nodeIds.length * (nodeIds.length - 1)) / 2 : 0;
  const full = nodeIds.length >= 3 && components === 1 && undirectedEdgeCount === fullCount && nodeIds.every((id) => degrees.get(id) === nodeIds.length - 1);
  const ringShaped = nodeIds.length >= 3 && nodeIds.every((id) => degrees.get(id) === 2) && undirectedEdgeCount === nodeIds.length;
  const starShaped = nodeIds.length >= 3 && undirectedEdgeCount === nodeIds.length - 1 && nodeIds.filter((id) => degrees.get(id) === 1).length === nodeIds.length - 1;
  const partial = !full && nodeIds.length >= 4 && components === 1 && undirectedEdgeCount > nodeIds.length - 1 && undirectedEdgeCount < fullCount && !ringShaped && !starShaped;
  const status = full || partial ? "MATCH" : nodeIds.length < 3 ? "INSUFFICIENT_DATA" : "NO_MATCH";
  return candidate({
    topologyType: "MESH",
    structuralStatus: status,
    nodeIds: full || partial ? nodeIds : [],
    relationshipIds: full || partial ? edges.map((edge) => edge.relationshipId) : [],
    relationshipTypesConsidered: full || partial ? edges.map((edge) => edge.relationshipType) : [],
    semanticScope: "ALL_AUTHORIZED",
    directionHandling: "Pair connectivity is undirected. Direction and type stay on the source relationships.",
    meshKind: full ? "FULL" : partial ? "PARTIAL" : null,
    excludedRelationshipIds: excluded,
    diagnostics: [
      full ? `Full Mesh has ${fullCount} undirected pairs.` : "",
      partial ? "Partial Mesh means a connected redundant graph that is neither a tree, a strict Ring, a strict Star, nor a Full Mesh." : "",
      "Redundant connectivity does not establish operational resilience.",
      components > 1 ? "A disconnected graph is not a Mesh." : "",
    ].filter((entry) => entry.length > 0),
    ambiguities: [],
    explanation: full
      ? "Every distinct pair is connected."
      : partial
        ? "The graph has redundant connections without being fully connected."
        : "The authorized graph does not meet Full or Partial Mesh rules.",
  });
}

function busCandidate(excluded: readonly string[]): CanonicalTopologyCandidate {
  return candidate({
    topologyType: "BUS",
    structuralStatus: "UNSUPPORTED_SEMANTICS",
    nodeIds: [],
    relationshipIds: [],
    relationshipTypesConsidered: [],
    semanticScope: "ALL_AUTHORIZED",
    directionHandling: "No backbone direction exists in the relationship contract.",
    excludedRelationshipIds: excluded,
    diagnostics: [
      "Canonical relationships do not encode backbone identity, backbone membership, or a shared connection medium.",
      "A line of objects is not a Bus.",
    ],
    ambiguities: [],
    explanation: "Bus topology is unsupported until the relationship contract can name a backbone.",
  });
}

function treeCandidates(
  nodeIds: readonly string[],
  edges: readonly Edge[],
  adjacency: Map<string, Set<string>>,
  components: number,
  undirectedEdgeCount: number,
  excluded: readonly string[],
): readonly CanonicalTopologyCandidate[] {
  const acyclic = !hasUndirectedCycle(nodeIds, adjacency);
  const structuralMatch = nodeIds.length >= 1 && components === 1 && acyclic && undirectedEdgeCount === Math.max(0, nodeIds.length - 1);
  const forest = nodeIds.length >= 2 && components > 1 && acyclic && undirectedEdgeCount === nodeIds.length - components;
  const structural = candidate({
    topologyType: "TREE",
    structuralStatus: structuralMatch ? "MATCH" : forest ? "PARTIAL_MATCH" : nodeIds.length === 0 ? "INSUFFICIENT_DATA" : "NO_MATCH",
    nodeIds: structuralMatch || forest ? nodeIds : [],
    relationshipIds: structuralMatch || forest ? edges.map((edge) => edge.relationshipId) : [],
    relationshipTypesConsidered: edges.map((edge) => edge.relationshipType),
    semanticScope: "ALL_AUTHORIZED",
    directionHandling: "Structural Tree is undirected. It is not an organizational hierarchy.",
    hierarchy: false,
    rootNodeIds: structuralMatch ? deterministicRoots(nodeIds, adjacency) : [],
    excludedRelationshipIds: excluded,
    diagnostics: [
      structuralMatch ? "Connected and acyclic." : "",
      forest ? "Multiple components form a forest, not one Tree." : "",
      !acyclic ? "A cycle rejects a structural Tree." : "",
    ].filter((entry) => entry.length > 0),
    ambiguities: forest ? ["More than one root component."] : [],
    explanation: structuralMatch
      ? "The authorized graph is a connected acyclic structure."
      : forest
        ? "The authorized graph is a forest."
        : "The authorized graph is not a structural Tree.",
  });
  const hierarchyEdges = edges.filter((edge) => HIERARCHY_TYPES.has(edge.relationshipType));
  const otherEdges = edges.filter((edge) => !HIERARCHY_TYPES.has(edge.relationshipType));
  const parentCount = new Map<string, number>();
  const children = new Map<string, string[]>();
  const hierarchyNodes = new Set<string>();
  let multiParent = false;
  for (const edge of hierarchyEdges) {
    const child = edge.relationshipType === "REPORTS_TO" ? edge.sourceObjectId : edge.targetObjectId;
    const parent = edge.relationshipType === "REPORTS_TO" ? edge.targetObjectId : edge.sourceObjectId;
    hierarchyNodes.add(child);
    hierarchyNodes.add(parent);
    parentCount.set(child, (parentCount.get(child) ?? 0) + 1);
    if ((parentCount.get(child) ?? 0) > 1) multiParent = true;
    const list = children.get(parent) ?? [];
    list.push(child);
    children.set(parent, list);
  }
  const roots = [...hierarchyNodes].filter((id) => (parentCount.get(id) ?? 0) === 0).sort();
  const hierarchyCycle = hierarchyHasCycle(roots, children);
  const coversAll = nodeIds.every((id) => hierarchyNodes.has(id)) && hierarchyNodes.size === nodeIds.length;
  const validTree = hierarchyEdges.length > 0 && !multiParent && !hierarchyCycle && roots.length === 1 && coversAll;
  const validForest = hierarchyEdges.length > 0 && !multiParent && !hierarchyCycle && roots.length > 1;
  const hierarchy = candidate({
    topologyType: "TREE",
    structuralStatus: hierarchyEdges.length === 0
      ? "NO_MATCH"
      : validTree
        ? "MATCH"
        : validForest
          ? "PARTIAL_MATCH"
          : "NO_MATCH",
    nodeIds: validTree || validForest ? [...hierarchyNodes].sort() : [],
    relationshipIds: validTree || validForest ? hierarchyEdges.map((edge) => edge.relationshipId) : [],
    relationshipTypesConsidered: hierarchyEdges.map((edge) => edge.relationshipType),
    semanticScope: "COMPATIBLE_SUBSET",
    directionHandling: "REPORTS_TO points from the reporting node to its parent. CONTAINS points from the container to the contained node.",
    hierarchy: true,
    rootNodeIds: validTree || validForest ? roots : [],
    excludedRelationshipIds: [...excluded, ...otherEdges.map((edge) => edge.relationshipId)],
    diagnostics: [
      hierarchyEdges.length === 0 ? "No REPORTS_TO or CONTAINS relationships." : "",
      validTree ? `Organizational root ${roots[0]}.` : "",
      validForest ? "Multiple hierarchy roots form a forest." : "",
      multiParent ? "A node has more than one hierarchy parent." : "",
      hierarchyCycle ? "The hierarchy contains a cycle." : "",
      otherEdges.length > 0 ? "Dependency and other relationship types are excluded from the hierarchy reading." : "",
    ].filter((entry) => entry.length > 0),
    ambiguities: [],
    explanation: validTree
      ? "REPORTS_TO or CONTAINS relationships form one organizational hierarchy."
      : "The authorized hierarchy relationships do not form one organizational Tree.",
  });
  return [structural, hierarchy];
}

function hybridCandidate(
  nodeIds: readonly string[],
  edges: readonly Edge[],
  adjacency: Map<string, Set<string>>,
  components: number,
  undirectedEdgeCount: number,
  excluded: readonly string[],
): CanonicalTopologyCandidate {
  const singlePattern =
    (undirectedEdgeCount === Math.max(0, nodeIds.length - 1) && components === 1) ||
    (nodeIds.length >= 3 && undirectedEdgeCount === nodeIds.length && nodeIds.every((id) => adjacency.get(id)?.size === 2)) ||
    (nodeIds.length >= 3 && undirectedEdgeCount === (nodeIds.length * (nodeIds.length - 1)) / 2);
  if (singlePattern || nodeIds.length < 4) {
    return candidate({
      topologyType: "HYBRID",
      structuralStatus: nodeIds.length < 4 ? "INSUFFICIENT_DATA" : "NO_MATCH",
      nodeIds: [],
      relationshipIds: [],
      relationshipTypesConsidered: [],
      semanticScope: "ALL_AUTHORIZED",
      directionHandling: "Hybrid uses the same authorized edges. It does not add edges.",
      excludedRelationshipIds: excluded,
      diagnostics: [singlePattern ? "A single strict pattern is not a Hybrid." : "Hybrid needs at least two positively identified patterns."],
      ambiguities: [],
      explanation: "Hybrid requires positive evidence of more than one structural pattern.",
    });
  }
  const working = copyAdjacency(adjacency);
  const constituents: { pattern: string; nodeIds: string[]; keys: string[] }[] = [];
  const cycle = findUndirectedCycle([...working.keys()].sort(), working);
  if (cycle && inducedCycle(cycle, working)) {
    const keys: string[] = [];
    for (let index = 0; index < cycle.length; index += 1) {
      const left = cycle[index]!;
      const right = cycle[(index + 1) % cycle.length]!;
      keys.push(pairKey(left, right));
      working.get(left)?.delete(right);
      working.get(right)?.delete(left);
    }
    constituents.push({ pattern: "RING", nodeIds: [...cycle].sort(), keys });
  }
  let guard = 0;
  while (guard < nodeIds.length) {
    guard += 1;
    const center = [...working.keys()].sort().find((id) => {
      const leaves = [...(working.get(id) ?? [])].filter((next) => (working.get(next)?.size ?? 0) === 1);
      return leaves.length >= 2;
    });
    if (!center) break;
    const leaves = [...(working.get(center) ?? [])].filter((next) => (working.get(next)?.size ?? 0) === 1).sort();
    const keys = leaves.map((leaf) => pairKey(center, leaf));
    for (const leaf of leaves) {
      working.get(center)?.delete(leaf);
      working.get(leaf)?.delete(center);
    }
    constituents.push({ pattern: "STAR", nodeIds: [center, ...leaves].sort(), keys });
  }
  const used = new Set(constituents.flatMap((entry) => entry.keys));
  const leftover = [...new Set(edges.map((edge) => edge.undirectedKey))].filter((key) => !used.has(key));
  const connectorOnly = leftover.every((key) => {
    const [left, right] = key.split("\0");
    const leftPattern = constituents.find((entry) => entry.nodeIds.includes(left!));
    const rightPattern = constituents.find((entry) => entry.nodeIds.includes(right!));
    return leftPattern && rightPattern && leftPattern !== rightPattern;
  });
  const patterns = [...new Set(constituents.map((entry) => entry.pattern))];
  const positive = constituents.length >= 2 && (patterns.length >= 2 || connectorOnly);
  const status = positive && connectorOnly ? "MATCH" : positive ? "PARTIAL_MATCH" : "NO_MATCH";
  const supportingKeys = new Set([...used, ...(connectorOnly ? leftover : [])]);
  const supporting = edges.filter((edge) => supportingKeys.has(edge.undirectedKey));
  return candidate({
    topologyType: "HYBRID",
    structuralStatus: status,
    nodeIds: positive ? [...new Set(constituents.flatMap((entry) => entry.nodeIds))].sort() : [],
    relationshipIds: positive ? supporting.map((edge) => edge.relationshipId) : [],
    relationshipTypesConsidered: supporting.map((edge) => edge.relationshipType),
    semanticScope: "ALL_AUTHORIZED",
    directionHandling: "Constituent patterns keep the original relationship direction.",
    constituentPatterns: constituents.map((entry) => entry.pattern),
    excludedRelationshipIds: [
      ...excluded,
      ...edges.filter((edge) => !supportingKeys.has(edge.undirectedKey)).map((edge) => edge.relationshipId),
    ],
    diagnostics: constituents.map((entry) => `${entry.pattern} on ${entry.nodeIds.join(", ")}.`),
    ambiguities: connectorOnly ? [] : leftover.length > 0 ? ["The decomposition does not cover every relationship."] : [],
    explanation: positive
      ? "The graph contains more than one identified structural pattern."
      : "No positive multi-pattern decomposition was found.",
  });
}

function undirectedAdjacency(nodeIds: readonly string[], edges: readonly Edge[]): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>(nodeIds.map((id) => [id, new Set()]));
  for (const edge of edges) {
    adjacency.get(edge.sourceObjectId)?.add(edge.targetObjectId);
    adjacency.get(edge.targetObjectId)?.add(edge.sourceObjectId);
  }
  return adjacency;
}

function copyAdjacency(adjacency: Map<string, Set<string>>): Map<string, Set<string>> {
  return new Map([...adjacency.entries()].map(([id, next]) => [id, new Set(next)]));
}

function degreeMap(nodeIds: readonly string[], adjacency: Map<string, Set<string>>): Map<string, number> {
  return new Map(nodeIds.map((id) => [id, adjacency.get(id)?.size ?? 0]));
}

function connectedComponents(nodeIds: readonly string[], adjacency: Map<string, Set<string>>): number {
  const seen = new Set<string>();
  let count = 0;
  for (const start of nodeIds) {
    if (seen.has(start)) continue;
    count += 1;
    const stack = [start];
    seen.add(start);
    while (stack.length > 0) {
      const node = stack.pop()!;
      for (const next of adjacency.get(node) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
  }
  return count;
}

function hasUndirectedCycle(nodeIds: readonly string[], adjacency: Map<string, Set<string>>): boolean {
  return findUndirectedCycle(nodeIds, adjacency) != null;
}

function findUndirectedCycle(nodeIds: readonly string[], adjacency: Map<string, Set<string>>): string[] | null {
  const color = new Map<string, 0 | 1 | 2>();
  const parent = new Map<string, string | null>();
  for (const start of nodeIds) {
    if (color.get(start)) continue;
    const stack = [start];
    parent.set(start, null);
    color.set(start, 1);
    while (stack.length > 0) {
      const node = stack[stack.length - 1]!;
      let advanced = false;
      for (const next of [...(adjacency.get(node) ?? [])].sort()) {
        if (next === parent.get(node)) continue;
        if (color.get(next) === 1) {
          const cycle = [next];
          let cursor: string | null = node;
          const guard = new Set<string>();
          while (cursor && cursor !== next && !guard.has(cursor)) {
            guard.add(cursor);
            cycle.push(cursor);
            cursor = parent.get(cursor) ?? null;
          }
          return cycle;
        }
        if (!color.get(next)) {
          parent.set(next, node);
          color.set(next, 1);
          stack.push(next);
          advanced = true;
          break;
        }
      }
      if (!advanced) {
        color.set(node, 2);
        stack.pop();
      }
    }
  }
  return null;
}

function inducedCycle(cycle: readonly string[], adjacency: Map<string, Set<string>>): boolean {
  if (cycle.length < 3) return false;
  const index = new Map(cycle.map((id, position) => [id, position]));
  for (const id of cycle) {
    for (const next of adjacency.get(id) ?? []) {
      const other = index.get(next);
      if (other == null) continue;
      const delta = Math.abs(other - (index.get(id) ?? 0));
      const distance = Math.min(delta, cycle.length - delta);
      if (distance > 1) return false;
    }
  }
  return true;
}

function hasDirectedCycle(nodeIds: readonly string[], edges: readonly Edge[]): boolean {
  const outgoing = new Map<string, string[]>(nodeIds.map((id) => [id, []]));
  for (const edge of edges) {
    if (edge.direction === "UNDIRECTED") {
      outgoing.get(edge.sourceObjectId)?.push(edge.targetObjectId);
      outgoing.get(edge.targetObjectId)?.push(edge.sourceObjectId);
    } else {
      outgoing.get(edge.sourceObjectId)?.push(edge.targetObjectId);
    }
  }
  const color = new Map<string, 0 | 1 | 2>();
  const visit = (node: string): boolean => {
    color.set(node, 1);
    for (const next of outgoing.get(node) ?? []) {
      const state = color.get(next) ?? 0;
      if (state === 1 || (state === 0 && visit(next))) return true;
    }
    color.set(node, 2);
    return false;
  };
  return nodeIds.some((id) => (color.get(id) ?? 0) === 0 && visit(id));
}

function hierarchyHasCycle(roots: readonly string[], children: Map<string, string[]>): boolean {
  const seen = new Set<string>();
  const visit = (node: string, stack: Set<string>): boolean => {
    if (stack.has(node)) return true;
    if (seen.has(node)) return false;
    seen.add(node);
    stack.add(node);
    for (const child of children.get(node) ?? []) {
      if (visit(child, stack)) return true;
    }
    stack.delete(node);
    return false;
  };
  if (roots.some((root) => visit(root, new Set()))) return true;
  return [...children.keys()].some((id) => !seen.has(id) && visit(id, new Set()));
}

function deterministicRoots(nodeIds: readonly string[], adjacency: Map<string, Set<string>>): readonly string[] {
  const leaves = nodeIds.filter((id) => (adjacency.get(id)?.size ?? 0) <= 1);
  return Object.freeze([...(leaves.length > 0 ? leaves : nodeIds)].sort().slice(0, 1));
}

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("\0");
}

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function coversRelationships(candidateValue: CanonicalTopologyCandidate, edges: readonly Edge[]): boolean {
  const supporting = new Set(candidateValue.relationshipIds);
  return edges.every((edge) => supporting.has(edge.relationshipId));
}

function placeCircle(
  ids: readonly string[],
  radius: number,
  positions: Record<string, { x: number; y: number; z: 0 }>,
): void {
  const bounded = Math.min(SCENE_ORG_STAGE_PLANE_LIMIT - 0.25, radius);
  ids.forEach((id, index) => {
    const angle = ids.length === 1 ? -Math.PI / 2 : -Math.PI / 2 + (index * 2 * Math.PI) / ids.length;
    positions[id] = {
      x: roundPlane(bounded * Math.cos(angle)),
      y: roundPlane(bounded * Math.sin(angle)),
      z: 0,
    };
  });
}

function placeTree(
  candidateValue: CanonicalTopologyCandidate,
  positions: Record<string, { x: number; y: number; z: 0 }>,
): void {
  const roots = candidateValue.rootNodeIds.length > 0
    ? candidateValue.rootNodeIds
    : candidateValue.nodeIds.slice(0, 1);
  const remaining = candidateValue.nodeIds.filter((id) => !roots.includes(id));
  roots.forEach((id, index) => {
    positions[id] = { x: roundPlane((index - (roots.length - 1) / 2) * 1.2), y: 1.6, z: 0 };
  });
  placeCircle(remaining, 2.8, positions);
}

function roundPlane(value: number): number {
  return Math.round(value * 1000) / 1000;
}
