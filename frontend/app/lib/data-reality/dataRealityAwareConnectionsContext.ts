/**
 * P2:7 — Data-Reality-Aware Connections & Context Reveal Integration.
 *
 * Reveals a restrained, executive-readable set of CANONICAL relationships and
 * contextual entities around the current P2:6 choreography anchor.
 *
 * Does NOT:
 *   - invent relationships or infer causality
 *   - recompute KPI / executive state / focus / attention
 *   - own camera movement or object repositioning
 *   - expand beyond 1-hop by default
 *   - convert attention retention into fake edges
 *
 * Chain:
 *   P2:6 Scene Choreography
 *   → P2:7 Connections & Context Reveal (this module)
 *   → Existing NEX-MVP Stage connection / context consumers
 */

import {
  dataRealityAwareSceneChoreographyIdentity,
  dataRealityAwareSceneChoreographyNamespace,
  dataRealityAwareSceneChoreographyVersion,
  type DataRealityAwareSceneChoreographyResult,
  type DataRealityAwareSceneRelationshipEdge,
  type ResolveDataRealityAwareSceneChoreographyInput,
  resolveDataRealityAwareSceneChoreography,
} from "./dataRealityAwareSceneChoreography.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareConnectionsContextIdentity =
  "P2:7/DataRealityAwareConnectionsContextRevealIntegration" as const;

export const dataRealityAwareConnectionsContextVersion = "2.7.0" as const;

export const dataRealityAwareConnectionsContextNamespace =
  "nexora.data-reality.connections-context-reveal" as const;

export const dataRealityAwareConnectionsContextPhase =
  "ConnectionsContextRevealIntegration" as const;

export const dataRealityAwareConnectionsContextArchitecturalRole =
  "DataRealityAwareExecutiveContextBoundary" as const;

export interface DataRealityAwareConnectionsContextIdentity {
  readonly identity: "P2:7/DataRealityAwareConnectionsContextRevealIntegration";
  readonly version: "2.7.0";
  readonly namespace: "nexora.data-reality.connections-context-reveal";
  readonly phase: "ConnectionsContextRevealIntegration";
  readonly architecturalRole: "DataRealityAwareExecutiveContextBoundary";
}

const IDENTITY: DataRealityAwareConnectionsContextIdentity = Object.freeze({
  identity: dataRealityAwareConnectionsContextIdentity,
  version: dataRealityAwareConnectionsContextVersion,
  namespace: dataRealityAwareConnectionsContextNamespace,
  phase: dataRealityAwareConnectionsContextPhase,
  architecturalRole: dataRealityAwareConnectionsContextArchitecturalRole,
});

export function getDataRealityAwareConnectionsContextIdentity(): DataRealityAwareConnectionsContextIdentity {
  return IDENTITY;
}

export const DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityAwareConnectionsContextArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsAdvisorReasoning: false as const,
  recomputesFocusAttention: false as const,
  inventsRelationships: false as const,
  infersCausality: false as const,
  ownsCameraChoreography: false as const,
  repositionsGeometry: false as const,
  recursiveGraphExpansion: false as const,
  revealDepthHops: 1 as const,
  maxDirectContextItems: 8 as const,
  consumesP26Choreography: true as const,
  exposesThreeJsObjects: false as const,
  introducesGlobalStore: false as const,
  immediateChoreographySource: dataRealityAwareSceneChoreographyIdentity,
  experienceCertified: false as const,
});

export const DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:1 MVP Bridge",
    "P2:2 MVP Runtime Reality State",
    "P2:5 Focus & Attention Experience",
    "P2:6 Interaction & Scene Choreography",
    "P2:7 Connections & Context Reveal",
  ] as const);

// ─── Semantic vocabularies ──────────────────────────────────────────────────

/** Stage object–object edges have no canonical kind; preserve generic "related". */
export const DATA_REALITY_AWARE_DEFAULT_RELATIONSHIP_KIND = "related" as const;

export const DATA_REALITY_AWARE_CONNECTION_DIRECTIONS = Object.freeze([
  "directed",
  "undirected",
] as const);

export type DataRealityAwareConnectionDirection =
  (typeof DATA_REALITY_AWARE_CONNECTION_DIRECTIONS)[number];

export const DATA_REALITY_AWARE_CONNECTION_EMPHASIS = Object.freeze([
  "foreground",
  "standard",
  "background",
  "retained-attention",
] as const);

export type DataRealityAwareConnectionEmphasis =
  (typeof DATA_REALITY_AWARE_CONNECTION_EMPHASIS)[number];

export const DATA_REALITY_AWARE_CONTEXT_REVEAL_ROLES = Object.freeze([
  "anchor",
  "direct-context",
  "attention-context",
  "supporting-context",
  "background",
  "hidden",
] as const);

export type DataRealityAwareContextRevealRole =
  (typeof DATA_REALITY_AWARE_CONTEXT_REVEAL_ROLES)[number];

export const DATA_REALITY_AWARE_CONTEXT_SUBJECT_KINDS = Object.freeze([
  "object",
  "problem",
  "scenario",
  "decision",
  "execution",
  "goal",
  "pack",
  "task",
] as const);

export type DataRealityAwareContextSubjectKind =
  (typeof DATA_REALITY_AWARE_CONTEXT_SUBJECT_KINDS)[number];

// ─── Input graph descriptors (canonical only) ───────────────────────────────

export type DataRealityAwareContextLinkDescriptor = {
  readonly id: string;
  readonly objectId: string;
  readonly contextId: string;
  readonly relation: string;
};

export type DataRealityAwareContextSubjectDescriptor = {
  readonly id: string;
  readonly kind: DataRealityAwareContextSubjectKind | string;
  readonly label?: string;
};

export type DataRealityAwareRelationshipDescriptor =
  DataRealityAwareSceneRelationshipEdge & {
    /** Only when canonically present; otherwise defaults to "related". */
    readonly relationshipKind?: string;
    readonly direction?: DataRealityAwareConnectionDirection;
  };

export type ResolveDataRealityAwareConnectionsContextInput = {
  readonly choreography?: DataRealityAwareSceneChoreographyResult;
  readonly choreographyInput?: ResolveDataRealityAwareSceneChoreographyInput;
  readonly relationships: readonly DataRealityAwareRelationshipDescriptor[];
  readonly contextLinks?: readonly DataRealityAwareContextLinkDescriptor[];
  readonly contextSubjects?: readonly DataRealityAwareContextSubjectDescriptor[];
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

// ─── Output contracts ───────────────────────────────────────────────────────

export type DataRealityAwareConnectionBinding = {
  readonly connectionId: string;
  readonly sourceObjectId: string;
  readonly targetObjectId: string;
  readonly relationshipKind: string;
  readonly direction: DataRealityAwareConnectionDirection;
  readonly isAnchorIncident: boolean;
  readonly isRevealed: boolean;
  readonly isForeground: boolean;
  readonly isBackground: boolean;
  readonly relevanceRole: DataRealityAwareContextRevealRole;
  readonly emphasis: DataRealityAwareConnectionEmphasis;
  readonly retainAttention: boolean;
  /** Explicitly false: adjacency is not causality. */
  readonly impliesCausality: false;
};

export type DataRealityAwareRelatedObjectBinding = {
  readonly objectId: string;
  readonly isDirect: boolean;
  readonly relationshipIds: readonly string[];
  readonly revealRole: DataRealityAwareContextRevealRole;
  readonly retainAttention: boolean;
};

export type DataRealityAwareContextRevealItem = {
  readonly contextId: string;
  readonly subjectId: string;
  readonly subjectKind: string;
  readonly relationshipId?: string;
  readonly relationshipKind?: string;
  readonly revealRole: DataRealityAwareContextRevealRole;
  readonly isDirect: boolean;
  readonly isAttentionRelevant: boolean;
  readonly isRecommended: boolean;
  readonly isUnresolved: boolean;
  readonly presentationState?: string;
};

export type DataRealityAwareRelationshipSummary = {
  readonly revealDepthHops: 1;
  readonly maxDirectContextItems: number;
  readonly incidentConnectionCount: number;
  readonly revealedConnectionCount: number;
  readonly backgroundConnectionCount: number;
  readonly revealedContextCount: number;
  readonly retainedAttentionObjectCount: number;
  readonly fabricatedEdgeCount: 0;
};

export type DataRealityAwareConnectionsResetState = {
  readonly restoreOverviewConnections: boolean;
  readonly clearFocusSpecificReveal: boolean;
  readonly preserveAttentionSignals: boolean;
  readonly clearBusinessTruth: false;
  readonly inventRelationships: false;
};

export type DataRealityAwareConnectionsContextProvenance = {
  readonly experienceIdentity: "P2:7/DataRealityAwareConnectionsContextRevealIntegration";
  readonly experienceVersion: "2.7.0";
  readonly experienceNamespace: "nexora.data-reality.connections-context-reveal";
  readonly experiencePhase: "ConnectionsContextRevealIntegration";
  readonly experienceCertified: false;
  readonly chain: typeof DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_PROVENANCE_CHAIN;
  readonly immediateChoreographySource: typeof dataRealityAwareSceneChoreographyIdentity;
  readonly immediateChoreographyVersion: typeof dataRealityAwareSceneChoreographyVersion;
  readonly immediateChoreographyNamespace: typeof dataRealityAwareSceneChoreographyNamespace;
  readonly choreographyId: string;
  readonly datasetId: string;
};

export type DataRealityAwareConnectionsContextResult = {
  readonly experienceId: string;
  readonly identity: DataRealityAwareConnectionsContextIdentity;
  readonly anchorObjectId?: string;
  readonly connections: readonly DataRealityAwareConnectionBinding[];
  readonly relatedObjects: readonly DataRealityAwareRelatedObjectBinding[];
  readonly contextItems: readonly DataRealityAwareContextRevealItem[];
  readonly revealedConnectionIds: readonly string[];
  readonly backgroundConnectionIds: readonly string[];
  readonly revealedContextIds: readonly string[];
  readonly retainedAttentionContextIds: readonly string[];
  readonly relationshipSummary: DataRealityAwareRelationshipSummary;
  readonly resetState: DataRealityAwareConnectionsResetState;
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
  readonly provenance: DataRealityAwareConnectionsContextProvenance;
  readonly sourceChoreography: DataRealityAwareSceneChoreographyResult;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getDataRealityAwareRevealedConnections(
  result: DataRealityAwareConnectionsContextResult,
): readonly DataRealityAwareConnectionBinding[] {
  return Object.freeze(result.connections.filter((entry) => entry.isRevealed));
}

export function getDataRealityAwareDirectContext(
  result: DataRealityAwareConnectionsContextResult,
): readonly DataRealityAwareRelatedObjectBinding[] {
  return Object.freeze(result.relatedObjects.filter((entry) => entry.isDirect));
}

export function getDataRealityAwareContextForObject(
  result: DataRealityAwareConnectionsContextResult,
  objectId: string,
): DataRealityAwareRelatedObjectBinding | undefined {
  return result.relatedObjects.find((entry) => entry.objectId === objectId);
}

export function getDataRealityAwareRetainedAttentionContext(
  result: DataRealityAwareConnectionsContextResult,
): readonly string[] {
  return result.retainedAttentionContextIds;
}

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function resolveChoreography(
  input: ResolveDataRealityAwareConnectionsContextInput,
): DataRealityAwareSceneChoreographyResult {
  if (input.choreography) return input.choreography;
  if (input.choreographyInput) {
    return resolveDataRealityAwareSceneChoreography(input.choreographyInput);
  }
  throw new Error(
    "resolveDataRealityAwareConnectionsContext requires choreography or choreographyInput",
  );
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function isAnchorIncident(
  edge: DataRealityAwareRelationshipDescriptor,
  anchorObjectId: string,
): boolean {
  return (
    edge.sourceId === anchorObjectId || edge.targetId === anchorObjectId
  );
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:7 Connections & Context Reveal API.
 */
export function resolveDataRealityAwareConnectionsContext(
  input: ResolveDataRealityAwareConnectionsContextInput,
): DataRealityAwareConnectionsContextResult {
  const choreography = resolveChoreography(input);
  // Anchor MUST agree with P2:6 — never independently resolved.
  const anchorObjectId = choreography.anchorObjectId;
  const retainAttentionIds = new Set(
    choreography.attentionRetention.objectIds,
  );
  const maxDirectContextItems =
    DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY.maxDirectContextItems;

  const relationships = [...input.relationships].sort((a, b) =>
    compareIds(a.id, b.id),
  );

  const connections = Object.freeze(
    relationships.map((edge) => {
      const incident =
        anchorObjectId !== undefined &&
        isAnchorIncident(edge, anchorObjectId);
      const isRevealed = incident;
      const isForeground = incident;
      const isBackground =
        anchorObjectId !== undefined ? !incident : false;
      // Attention retention is object-level only. Unrelated edges stay
      // background — never promoted by endpoint criticality/recommendation.

      let relevanceRole: DataRealityAwareContextRevealRole;
      let emphasis: DataRealityAwareConnectionEmphasis;
      if (anchorObjectId === undefined) {
        relevanceRole = "background";
        emphasis = "standard";
      } else if (isForeground) {
        relevanceRole = "direct-context";
        emphasis = "foreground";
      } else {
        relevanceRole = "background";
        emphasis = "background";
      }

      return Object.freeze({
        connectionId: edge.id,
        sourceObjectId: edge.sourceId,
        targetObjectId: edge.targetId,
        relationshipKind:
          edge.relationshipKind ?? DATA_REALITY_AWARE_DEFAULT_RELATIONSHIP_KIND,
        direction: edge.direction ?? ("directed" as const),
        isAnchorIncident: incident,
        isRevealed,
        isForeground,
        isBackground,
        relevanceRole,
        emphasis,
        // Retention is object-level; never invents an edge.
        retainAttention: false,
        impliesCausality: false as const,
      });
    }),
  );

  const relatedByObject = new Map<string, string[]>();
  if (anchorObjectId !== undefined) {
    for (const connection of connections) {
      if (!connection.isAnchorIncident) continue;
      const neighbor =
        connection.sourceObjectId === anchorObjectId
          ? connection.targetObjectId
          : connection.sourceObjectId;
      const list = relatedByObject.get(neighbor) ?? [];
      list.push(connection.connectionId);
      relatedByObject.set(neighbor, list);
    }
  }

  const relatedObjects = Object.freeze(
    Array.from(relatedByObject.entries())
      .sort((a, b) => compareIds(a[0], b[0]))
      .map(([objectId, relationshipIds]) =>
        Object.freeze({
          objectId,
          isDirect: true,
          relationshipIds: Object.freeze(
            [...relationshipIds].sort(compareIds),
          ),
          revealRole: "direct-context" as const,
          retainAttention: retainAttentionIds.has(objectId),
        }),
      ),
  );

  const relatedIdSet = new Set(relatedObjects.map((entry) => entry.objectId));

  // Attention-retained unrelated objects: discoverable WITHOUT fake edges.
  const retainedAttentionContextIds = Object.freeze(
    Array.from(retainAttentionIds)
      .filter(
        (objectId) =>
          objectId !== anchorObjectId && !relatedIdSet.has(objectId),
      )
      .sort(compareIds),
  );

  const contextSubjectsById = new Map(
    (input.contextSubjects ?? []).map((entry) => [entry.id, entry]),
  );
  const contextLinks = [...(input.contextLinks ?? [])].sort((a, b) =>
    compareIds(a.id, b.id),
  );

  const directContextLinks =
    anchorObjectId === undefined
      ? []
      : contextLinks.filter((link) => link.objectId === anchorObjectId);

  const boundedContextLinks = directContextLinks.slice(
    0,
    maxDirectContextItems,
  );
  const hiddenContextLinks = directContextLinks.slice(maxDirectContextItems);

  const contextItems = Object.freeze([
    ...boundedContextLinks.map((link) => {
      const subject = contextSubjectsById.get(link.contextId);
      return Object.freeze({
        contextId: link.contextId,
        subjectId: link.contextId,
        subjectKind: subject?.kind ?? "pack",
        relationshipId: link.id,
        relationshipKind: link.relation,
        revealRole: "direct-context" as const,
        isDirect: true,
        isAttentionRelevant: false,
        isRecommended: false,
        isUnresolved: false,
        ...(input.presentationState !== undefined
          ? { presentationState: input.presentationState }
          : {}),
      });
    }),
    ...hiddenContextLinks.map((link) => {
      const subject = contextSubjectsById.get(link.contextId);
      return Object.freeze({
        contextId: link.contextId,
        subjectId: link.contextId,
        subjectKind: subject?.kind ?? "pack",
        relationshipId: link.id,
        relationshipKind: link.relation,
        revealRole: "hidden" as const,
        isDirect: true,
        isAttentionRelevant: false,
        isRecommended: false,
        isUnresolved: false,
        ...(input.presentationState !== undefined
          ? { presentationState: input.presentationState }
          : {}),
      });
    }),
    ...retainedAttentionContextIds.map((objectId) =>
      Object.freeze({
        contextId: `attention:${objectId}`,
        subjectId: objectId,
        subjectKind: "object",
        revealRole: "attention-context" as const,
        isDirect: false,
        isAttentionRelevant: true,
        isRecommended:
          choreography.sourceFocusAttention.recommendedFocus === objectId,
        isUnresolved:
          choreography.sourceFocusAttention.unresolvedObjects.includes(
            objectId,
          ),
        ...(input.presentationState !== undefined
          ? { presentationState: input.presentationState }
          : {}),
      }),
    ),
  ]);

  const revealedConnectionIds = Object.freeze(
    connections
      .filter((entry) => entry.isRevealed)
      .map((entry) => entry.connectionId),
  );
  const backgroundConnectionIds = Object.freeze(
    connections
      .filter((entry) => entry.isBackground)
      .map((entry) => entry.connectionId),
  );
  const revealedContextIds = Object.freeze(
    contextItems
      .filter(
        (entry) =>
          entry.revealRole === "direct-context" ||
          entry.revealRole === "attention-context",
      )
      .map((entry) => entry.contextId),
  );

  const presentationState =
    input.presentationState ?? choreography.presentationState;
  const workspace = input.workspace ?? choreography.workspace;
  const mode = input.mode ?? choreography.mode;

  const experienceId = [
    "connections-context",
    normalizeToken(
      choreography.sourceFocusAttention.datasetIdentity.datasetId,
    ),
    normalizeToken(choreography.choreographyId),
    normalizeToken(anchorObjectId),
    normalizeToken(presentationState),
  ].join(":");

  return Object.freeze({
    experienceId,
    identity: IDENTITY,
    ...(anchorObjectId !== undefined ? { anchorObjectId } : {}),
    connections,
    relatedObjects,
    contextItems,
    revealedConnectionIds,
    backgroundConnectionIds,
    revealedContextIds,
    retainedAttentionContextIds,
    relationshipSummary: Object.freeze({
      revealDepthHops: 1 as const,
      maxDirectContextItems,
      incidentConnectionCount: revealedConnectionIds.length,
      revealedConnectionCount: revealedConnectionIds.length,
      backgroundConnectionCount: backgroundConnectionIds.length,
      revealedContextCount: revealedContextIds.length,
      retainedAttentionObjectCount: retainedAttentionContextIds.length,
      fabricatedEdgeCount: 0 as const,
    }),
    resetState: Object.freeze({
      restoreOverviewConnections: anchorObjectId === undefined,
      clearFocusSpecificReveal: anchorObjectId === undefined,
      preserveAttentionSignals: true,
      clearBusinessTruth: false as const,
      inventRelationships: false as const,
    }),
    ...(presentationState !== undefined ? { presentationState } : {}),
    ...(workspace !== undefined ? { workspace } : {}),
    ...(mode !== undefined ? { mode } : {}),
    provenance: Object.freeze({
      experienceIdentity: dataRealityAwareConnectionsContextIdentity,
      experienceVersion: dataRealityAwareConnectionsContextVersion,
      experienceNamespace: dataRealityAwareConnectionsContextNamespace,
      experiencePhase: dataRealityAwareConnectionsContextPhase,
      experienceCertified: false,
      chain: DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_PROVENANCE_CHAIN,
      immediateChoreographySource: dataRealityAwareSceneChoreographyIdentity,
      immediateChoreographyVersion: dataRealityAwareSceneChoreographyVersion,
      immediateChoreographyNamespace:
        dataRealityAwareSceneChoreographyNamespace,
      choreographyId: choreography.choreographyId,
      datasetId: choreography.sourceFocusAttention.datasetIdentity.datasetId,
    }),
    sourceChoreography: choreography,
  });
}
