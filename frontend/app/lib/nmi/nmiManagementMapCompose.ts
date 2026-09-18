/**
 * NPA-T NMI:2 — compose a read-only Management Map from NMI:1 UnifiedManagementModel.
 * Does not invent nodes or relationships. Does not guess BUSINESS/PROJECT for UNKNOWN.
 */

import type { NmiCanonicalRef, NmiContextKind, UnifiedManagementModel } from "./nmiContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import {
  NMI_MANAGEMENT_MAP_SECTIONS,
  NMI_NODE_KIND_TO_SECTION,
  type ManagementMap,
  type ManagementMapNode,
  type NmiHybridLanePreservation,
  type NmiManagementMapNodeAnnotation,
  type NmiManagementMapScope,
  type NmiManagementMapSection,
  type NmiManagementMapSectionView,
} from "./nmiManagementMapContract.ts";
import { nmiManagementMapIdentity } from "./nmiManagementMapIdentity.ts";

export type NmiManagementMapComposeInput = {
  readonly mapId: string;
  readonly model: UnifiedManagementModel;
  readonly annotations?: readonly NmiManagementMapNodeAnnotation[];
  readonly scope?: NmiManagementMapScope;
  readonly compositionProvenance?: readonly string[];
};

function annotationById(
  annotations: readonly NmiManagementMapNodeAnnotation[] | undefined,
): ReadonlyMap<string, NmiManagementMapNodeAnnotation> {
  const map = new Map<string, NmiManagementMapNodeAnnotation>();
  for (const item of annotations ?? []) map.set(item.id, item);
  return map;
}

function resolveNodeContext(
  modelKind: NmiContextKind,
  annotation: NmiManagementMapNodeAnnotation | undefined,
): NmiContextKind {
  if (annotation?.contextKind) return annotation.contextKind;
  if (modelKind === "HYBRID" || modelKind === "UNKNOWN") return "UNKNOWN";
  return modelKind;
}

function collectSourceRefs(model: UnifiedManagementModel): readonly NmiCanonicalRef[] {
  const byId = new Map<string, NmiCanonicalRef>();
  if (model.businessProjectRef) byId.set(model.businessProjectRef.id, model.businessProjectRef);
  if (model.managerRoleRef) byId.set(model.managerRoleRef.id, model.managerRoleRef);
  for (const node of model.nodes) {
    if (!byId.has(node.id)) byId.set(node.id, node);
  }
  return Object.freeze([...byId.values()]);
}

function relationshipIdsFor(
  nodeId: string,
  relationships: readonly NmiManagementRelationship[],
): readonly string[] {
  return Object.freeze(
    relationships.filter((item) => item.fromId === nodeId || item.toId === nodeId).map((item) => item.relationshipId),
  );
}

function toMapNode(
  ref: NmiCanonicalRef,
  modelKind: NmiContextKind,
  annotation: NmiManagementMapNodeAnnotation | undefined,
  relationships: readonly NmiManagementRelationship[],
  compositionProvenance: readonly string[],
): ManagementMapNode {
  const contextKind = resolveNodeContext(modelKind, annotation);
  return Object.freeze({
    nodeId: ref.id,
    canonicalRef: ref,
    kind: ref.kind,
    title: annotation?.title ?? null,
    section: NMI_NODE_KIND_TO_SECTION[ref.kind],
    contextKind,
    provenance: Object.freeze([
      ...(annotation?.provenance ?? []),
      ...compositionProvenance,
      `canonical:${ref.authority}:${ref.sourceRef}`,
    ]),
    knownStatus: annotation?.knownStatus ?? null,
    relationshipIds: relationshipIdsFor(ref.id, relationships),
    analyticalRole: ref.kind === "VARIABLE",
    copiesCanonicalEntity: false as const,
  });
}

function nodeMatchesScope(node: ManagementMapNode, scope: NmiManagementMapScope): boolean {
  switch (scope.kind) {
    case "ENTIRE_CONTEXT":
      return true;
    case "ENTIRE_BUSINESS":
      return node.contextKind === "BUSINESS" || node.contextKind === "HYBRID";
    case "ENTIRE_PROJECT":
      return node.contextKind === "PROJECT" || node.contextKind === "HYBRID";
    case "GOAL":
    case "PROCESS":
    case "PROBLEM":
    case "RISK":
    case "SCENARIO":
    case "DECISION":
    case "EXECUTION":
      if (scope.nodeId) return node.nodeId === scope.nodeId;
      return NMI_NODE_KIND_TO_SECTION[node.kind] === NMI_NODE_KIND_TO_SECTION[scope.kind];
    default:
      return false;
  }
}

const SCOPE_SEED_KINDS: ReadonlySet<NmiManagementMapScope["kind"]> = new Set([
  "GOAL",
  "PROCESS",
  "PROBLEM",
  "RISK",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
]);

function applyScope(
  nodes: readonly ManagementMapNode[],
  relationships: readonly NmiManagementRelationship[],
  scope: NmiManagementMapScope,
): {
  readonly nodes: readonly ManagementMapNode[];
  readonly relationships: readonly NmiManagementRelationship[];
  readonly outOfScopeRelationshipIds: readonly string[];
} {
  if (scope.kind === "ENTIRE_CONTEXT") {
    return {
      nodes,
      relationships,
      outOfScopeRelationshipIds: Object.freeze([]),
    };
  }

  const matched = nodes.filter((node) => nodeMatchesScope(node, scope));
  const includeIds = new Set(matched.map((node) => node.nodeId));

  if (SCOPE_SEED_KINDS.has(scope.kind) && scope.nodeId) {
    for (const rel of relationships) {
      if (rel.fromId === scope.nodeId) includeIds.add(rel.toId);
      if (rel.toId === scope.nodeId) includeIds.add(rel.fromId);
    }
  }

  const scopedNodes = Object.freeze(nodes.filter((node) => includeIds.has(node.nodeId)));
  const scopedIds = new Set(scopedNodes.map((node) => node.nodeId));
  const inScope: NmiManagementRelationship[] = [];
  const outOfScope: string[] = [];
  for (const rel of relationships) {
    const both = scopedIds.has(rel.fromId) && scopedIds.has(rel.toId);
    if (both) inScope.push(rel);
    else outOfScope.push(rel.relationshipId);
  }
  return {
    nodes: scopedNodes,
    relationships: Object.freeze(inScope),
    outOfScopeRelationshipIds: Object.freeze(outOfScope),
  };
}

function buildSections(nodes: readonly ManagementMapNode[]): readonly NmiManagementMapSectionView[] {
  return Object.freeze(
    NMI_MANAGEMENT_MAP_SECTIONS.map((section) => {
      const nodeIds = Object.freeze(nodes.filter((node) => node.section === section).map((node) => node.nodeId));
      return Object.freeze({ section, nodeIds, empty: nodeIds.length === 0 });
    }),
  );
}

function disconnectedIds(
  nodes: readonly ManagementMapNode[],
  relationships: readonly NmiManagementRelationship[],
): readonly string[] {
  const connected = new Set<string>();
  for (const rel of relationships) {
    connected.add(rel.fromId);
    connected.add(rel.toId);
  }
  return Object.freeze(nodes.filter((node) => !connected.has(node.nodeId)).map((node) => node.nodeId));
}

function hybridLanes(contextKind: NmiContextKind, nodes: readonly ManagementMapNode[]): NmiHybridLanePreservation | null {
  if (contextKind !== "HYBRID") return null;
  return Object.freeze({
    flattened: false as const,
    businessNodeIds: Object.freeze(nodes.filter((node) => node.contextKind === "BUSINESS").map((node) => node.nodeId)),
    projectNodeIds: Object.freeze(nodes.filter((node) => node.contextKind === "PROJECT").map((node) => node.nodeId)),
    hybridNodeIds: Object.freeze(nodes.filter((node) => node.contextKind === "HYBRID").map((node) => node.nodeId)),
    unknownNodeIds: Object.freeze(nodes.filter((node) => node.contextKind === "UNKNOWN").map((node) => node.nodeId)),
  });
}

export function composeNmiManagementMap(input: NmiManagementMapComposeInput): ManagementMap {
  const scope: NmiManagementMapScope = input.scope ?? Object.freeze({ kind: "ENTIRE_CONTEXT" as const });
  const provenance = Object.freeze([
    ...(input.compositionProvenance ?? [`nmi:map:compose:${input.mapId}`]),
    `nmi:model:${input.model.modelId}`,
  ]);
  const annotations = annotationById(input.annotations);
  const sourceRefs = collectSourceRefs(input.model);
  const allNodes = Object.freeze(
    sourceRefs.map((ref) =>
      toMapNode(ref, input.model.contextKind, annotations.get(ref.id), input.model.relationships, provenance),
    ),
  );
  const scoped = applyScope(allNodes, input.model.relationships, scope);
  const nodes = Object.freeze(
    scoped.nodes.map((node) =>
      Object.freeze({
        ...node,
        relationshipIds: relationshipIdsFor(node.nodeId, scoped.relationships),
      }),
    ),
  );
  const sections = buildSections(nodes);
  const missingSections = Object.freeze(sections.filter((item) => item.empty).map((item) => item.section));
  return Object.freeze({
    identity: nmiManagementMapIdentity,
    mapId: input.mapId,
    sourceModelId: input.model.modelId,
    sourceModel: input.model,
    contextId: input.model.contextId,
    contextKind: input.model.contextKind,
    contextAuthority: "BCA:1/BusinessProjectContextFoundation",
    scope,
    nodes,
    relationships: scoped.relationships,
    unresolvedRelationshipIds: Object.freeze([...(input.model.unresolvedRelationshipIds ?? [])]),
    outOfScopeRelationshipIds: scoped.outOfScopeRelationshipIds,
    missingSections,
    sections,
    disconnectedNodeIds: disconnectedIds(nodes, scoped.relationships),
    hybridLanes: hybridLanes(input.model.contextKind, nodes),
    compositionProvenance: provenance,
    mutatesStage: false,
    mutatesQueue: false,
    mutatesObjects: false,
    writesDataReality: false,
    writesSemantics: false,
    writesEvidence: false,
    bypassesGate: false,
    createsCausalCertainty: false,
    fabricatesMissingNodes: false,
    fabricatesMissingEdges: false,
    decisionRoadmapImplemented: false,
    attentionImplemented: false,
    startsNmi3: false,
    parallelAdvisor: false,
  });
}

export function managementMapSection(section: NmiManagementMapSection, map: ManagementMap): NmiManagementMapSectionView {
  return map.sections.find((item) => item.section === section) ?? Object.freeze({ section, nodeIds: Object.freeze([]), empty: true });
}
