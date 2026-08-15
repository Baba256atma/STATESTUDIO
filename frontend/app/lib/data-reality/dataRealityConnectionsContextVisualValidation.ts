/**
 * P2:8.4 — Connections & Context Visual Validation.
 *
 * Translates canonical P2:7 connection/context reveal into restrained Stage
 * presentation instructions, and validates that severity/proximity/attention
 * never create false relationship appearance.
 *
 * Does NOT:
 *   - invent relationships or infer causality
 *   - expand reveal depth beyond 1 hop
 *   - recompute choreography / severity / attention
 *   - redesign Stage aesthetics
 */

import type { DataRealityAwareConnectionsContextResult } from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityAwareConnectionsContextIdentity,
  dataRealityAwareConnectionsContextNamespace,
  dataRealityAwareConnectionsContextVersion,
} from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityFocusSceneChoreographyValidationIdentity,
  dataRealityFocusSceneChoreographyValidationNamespace,
  dataRealityFocusSceneChoreographyValidationVersion,
} from "./dataRealityFocusSceneChoreographyValidation.ts";
import {
  dataRealityObjectStateVisualValidationIdentity,
  dataRealityObjectStateVisualValidationNamespace,
  dataRealityObjectStateVisualValidationVersion,
} from "./dataRealityObjectStateVisualValidation.ts";
import {
  dataRealityVisualStageAuditIdentity,
  dataRealityVisualStageAuditNamespace,
  dataRealityVisualStageAuditVersion,
} from "./dataRealityVisualStageAudit.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityConnectionsContextVisualValidationIdentity =
  "P2:8.4/DataRealityConnectionsContextVisualValidation" as const;

export const dataRealityConnectionsContextVisualValidationVersion =
  "2.8.4" as const;

export const dataRealityConnectionsContextVisualValidationNamespace =
  "nexora.data-reality.connections-context-visual-validation" as const;

export const dataRealityConnectionsContextVisualValidationPhase =
  "ConnectionsContextVisualValidation" as const;

export const dataRealityConnectionsContextVisualValidationArchitecturalRole =
  "DataRealityConnectionsContextVisualValidationBoundary" as const;

export const dataRealityConnectionsContextVisualValidationReadiness =
  "ReadyForDensityCameraExecutiveReadabilityValidation" as const;

export interface DataRealityConnectionsContextVisualValidationIdentity {
  readonly identity: "P2:8.4/DataRealityConnectionsContextVisualValidation";
  readonly version: "2.8.4";
  readonly namespace: "nexora.data-reality.connections-context-visual-validation";
  readonly phase: "ConnectionsContextVisualValidation";
  readonly architecturalRole: "DataRealityConnectionsContextVisualValidationBoundary";
  readonly readiness: "ReadyForDensityCameraExecutiveReadabilityValidation";
}

const IDENTITY: DataRealityConnectionsContextVisualValidationIdentity =
  Object.freeze({
    identity: dataRealityConnectionsContextVisualValidationIdentity,
    version: dataRealityConnectionsContextVisualValidationVersion,
    namespace: dataRealityConnectionsContextVisualValidationNamespace,
    phase: dataRealityConnectionsContextVisualValidationPhase,
    architecturalRole:
      dataRealityConnectionsContextVisualValidationArchitecturalRole,
    readiness: dataRealityConnectionsContextVisualValidationReadiness,
  });

export function getDataRealityConnectionsContextVisualValidationIdentity(): DataRealityConnectionsContextVisualValidationIdentity {
  return IDENTITY;
}

export const DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      dataRealityConnectionsContextVisualValidationArchitecturalRole,
    ownsKpiComputation: false as const,
    inventsRelationships: false as const,
    infersCausality: false as const,
    expandsRevealDepth: false as const,
    revealDepthHops: 1 as const,
    recomputesChoreography: false as const,
    recomputesSeverity: false as const,
    redesignsStageAesthetics: false as const,
    consumesP27ConnectionsContext: true as const,
    consumesP281Audit: true as const,
    consumesP282ObjectVisualState: true as const,
    consumesP283FocusChoreography: true as const,
    validationCertified: false as const,
  });

export const DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P2:6 Interaction & Scene Choreography",
    "P2:7 Connections & Context Reveal",
    "P2:8.1 Visual Stage Audit",
    "P2:8.2 Object State Visual Validation",
    "P2:8.3 Focus & Scene Choreography Validation",
    "P2:8.4 Connections & Context Visual Validation",
  ] as const);

// ─── Visual contracts ───────────────────────────────────────────────────────

export const DATA_REALITY_CONNECTION_VISUAL_ROLES = Object.freeze([
  "anchor-incident",
  "context",
  "background",
  "hidden",
] as const);

export type DataRealityConnectionVisualRole =
  (typeof DATA_REALITY_CONNECTION_VISUAL_ROLES)[number];

export const DATA_REALITY_CONNECTION_VISUAL_VISIBILITY = Object.freeze([
  "visible",
  "subdued",
  "hidden",
] as const);

export type DataRealityConnectionVisualVisibility =
  (typeof DATA_REALITY_CONNECTION_VISUAL_VISIBILITY)[number];

export const DATA_REALITY_CONNECTION_VISUAL_EMPHASIS = Object.freeze([
  "foreground",
  "secondary",
  "background",
] as const);

export type DataRealityConnectionVisualEmphasis =
  (typeof DATA_REALITY_CONNECTION_VISUAL_EMPHASIS)[number];

export type DataRealityConnectionVisualState = {
  readonly connectionId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly relation: string;
  readonly role: DataRealityConnectionVisualRole;
  readonly visibility: DataRealityConnectionVisualVisibility;
  readonly emphasis: DataRealityConnectionVisualEmphasis;
  readonly opacity: number;
  readonly width: number;
  readonly directionCue: "none" | "source-to-target";
  readonly anchorAssociated: boolean;
  /** Explicitly false: adjacency never becomes causality. */
  readonly impliesCausality: false;
  readonly reason: readonly string[];
};

export type DataRealityContextVisualState = {
  readonly contextId: string;
  readonly subjectId: string;
  readonly subjectKind: string;
  readonly relation?: string;
  readonly revealRole: string;
  readonly visibility: DataRealityConnectionVisualVisibility;
  readonly opacity: number;
  readonly scale: number;
  readonly peerConfusionRisk: boolean;
  readonly anchorAssociated: boolean;
  readonly reason: readonly string[];
};

export const CONNECTIONS_CONTEXT_VISUAL_VALIDATION_STATUSES = Object.freeze([
  "valid",
  "weak-foreground-edge",
  "background-too-strong",
  "direction-ambiguous",
  "false-context",
  "false-relationship",
  "context-peer-confusion",
  "stale-relationship-state",
  "density-risk",
] as const);

export type ConnectionsContextVisualValidationStatus =
  (typeof CONNECTIONS_CONTEXT_VISUAL_VALIDATION_STATUSES)[number];

export type ConnectionsContextVisualValidationFinding = {
  readonly findingId: string;
  readonly subjectId: string;
  readonly anchorObjectId?: string;
  readonly canonicalRelation?: string;
  readonly expectedVisualRole: unknown;
  readonly observedVisualRole: unknown;
  readonly status: ConnectionsContextVisualValidationStatus;
  readonly evidence: readonly string[];
  readonly recommendation?: string;
};

export type ObservedConnectionVisualEvidence = {
  readonly connectionId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly present: boolean;
  readonly emphasized: boolean;
  readonly opacity: number;
  readonly visualRole?: string;
  readonly directionCue?: string;
  readonly relation?: string;
  readonly lineWidth?: number;
  readonly impliesCausality?: boolean;
};

export type ObservedContextVisualEvidence = {
  readonly contextId: string;
  readonly subjectId: string;
  readonly kind: string;
  readonly role: string;
  readonly present: boolean;
  readonly opacity: number;
  readonly scale: number;
  readonly relation?: string;
};

export type ObservedConnectionsContextVisualEvidence = {
  readonly mode: string;
  readonly focusedObjectId: string | null;
  readonly connections: readonly ObservedConnectionVisualEvidence[];
  readonly contextConnections: readonly ObservedConnectionVisualEvidence[];
  readonly contextNodes: readonly ObservedContextVisualEvidence[];
  readonly objectRoles: readonly {
    readonly objectId: string;
    readonly role: string;
    readonly executiveVisualState?: string;
  }[];
};

export type ValidateConnectionsContextVisualInput = {
  readonly scenario: string;
  readonly connectionsContext: DataRealityAwareConnectionsContextResult;
  readonly connectionVisualStates: readonly DataRealityConnectionVisualState[];
  readonly contextVisualStates: readonly DataRealityContextVisualState[];
  readonly observed: ObservedConnectionsContextVisualEvidence;
  readonly canonicalNonEdgePairs?: readonly {
    readonly sourceId: string;
    readonly targetId: string;
  }[];
};

export type ConnectionsContextVisualValidationSummary = {
  readonly totalFindings: number;
  readonly validCount: number;
  readonly weakForegroundEdgeCount: number;
  readonly backgroundTooStrongCount: number;
  readonly directionAmbiguousCount: number;
  readonly falseContextCount: number;
  readonly falseRelationshipCount: number;
  readonly contextPeerConfusionCount: number;
  readonly staleRelationshipStateCount: number;
  readonly densityRiskCount: number;
  readonly revealDepthHops: 1;
  readonly nonEdgesPreserved: boolean;
};

export type ConnectionsContextVisualValidationResult = {
  readonly validationId: string;
  readonly identity: DataRealityConnectionsContextVisualValidationIdentity;
  readonly scenario: string;
  readonly anchorObjectId?: string;
  readonly findings: readonly ConnectionsContextVisualValidationFinding[];
  readonly summary: ConnectionsContextVisualValidationSummary;
  readonly provenance: {
    readonly validationIdentity: "P2:8.4/DataRealityConnectionsContextVisualValidation";
    readonly validationVersion: "2.8.4";
    readonly validationNamespace: "nexora.data-reality.connections-context-visual-validation";
    readonly validationPhase: "ConnectionsContextVisualValidation";
    readonly validationCertified: false;
    readonly chain: typeof DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_PROVENANCE_CHAIN;
    readonly connectionsContextSource: typeof dataRealityAwareConnectionsContextIdentity;
    readonly connectionsContextVersion: typeof dataRealityAwareConnectionsContextVersion;
    readonly connectionsContextNamespace: typeof dataRealityAwareConnectionsContextNamespace;
    readonly auditSource: typeof dataRealityVisualStageAuditIdentity;
    readonly auditVersion: typeof dataRealityVisualStageAuditVersion;
    readonly auditNamespace: typeof dataRealityVisualStageAuditNamespace;
    readonly objectVisualSource: typeof dataRealityObjectStateVisualValidationIdentity;
    readonly objectVisualVersion: typeof dataRealityObjectStateVisualValidationVersion;
    readonly objectVisualNamespace: typeof dataRealityObjectStateVisualValidationNamespace;
    readonly focusValidationSource: typeof dataRealityFocusSceneChoreographyValidationIdentity;
    readonly focusValidationVersion: typeof dataRealityFocusSceneChoreographyValidationVersion;
    readonly focusValidationNamespace: typeof dataRealityFocusSceneChoreographyValidationNamespace;
  };
};

export const DATA_REALITY_CONNECTIONS_CONTEXT_CANONICAL_NON_EDGES =
  Object.freeze([
    Object.freeze({
      sourceId: "obj-revenue",
      targetId: "obj-capacity",
    }),
  ]);

// ─── Resolvers (presentation only) ──────────────────────────────────────────

export type ResolveDataRealityConnectionVisualStateInput = {
  readonly connectionId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly relation?: string;
  readonly direction?: "directed" | "undirected" | string;
  readonly isAnchorIncident?: boolean;
  readonly isRevealed?: boolean;
  readonly isForeground?: boolean;
  readonly isBackground?: boolean;
  readonly emphasis?: string;
  readonly isContextConnector?: boolean;
  readonly anchorObjectId?: string;
};

export function resolveDataRealityConnectionVisualState(
  input: ResolveDataRealityConnectionVisualStateInput,
): DataRealityConnectionVisualState {
  const relation = input.relation ?? "related";
  const directed = input.direction === "directed";
  const reasons: string[] = [
    `relation=${relation}`,
    `impliesCausality=false`,
  ];

  if (input.isContextConnector) {
    const visible = input.isRevealed !== false;
    return Object.freeze({
      connectionId: input.connectionId,
      sourceId: input.sourceId,
      targetId: input.targetId,
      relation,
      role: visible ? ("context" as const) : ("hidden" as const),
      visibility: visible ? ("visible" as const) : ("hidden" as const),
      emphasis: visible ? ("secondary" as const) : ("background" as const),
      opacity: visible ? 0.58 : 0.08,
      width: visible ? 1.15 : 0.8,
      directionCue: "none" as const,
      anchorAssociated: visible,
      impliesCausality: false as const,
      reason: Object.freeze([
        ...reasons,
        "context connector — subordinate to Stage object edges",
      ]),
    });
  }

  if (input.anchorObjectId === undefined) {
    return Object.freeze({
      connectionId: input.connectionId,
      sourceId: input.sourceId,
      targetId: input.targetId,
      relation,
      role: "background" as const,
      visibility: "subdued" as const,
      emphasis: "background" as const,
      opacity: 0.14,
      width: 1,
      directionCue: "none" as const,
      anchorAssociated: false,
      impliesCausality: false as const,
      reason: Object.freeze([
        ...reasons,
        "overview — relationships subdued, not graph-complete",
      ]),
    });
  }

  if (input.isForeground || input.isAnchorIncident) {
    return Object.freeze({
      connectionId: input.connectionId,
      sourceId: input.sourceId,
      targetId: input.targetId,
      relation,
      role: "anchor-incident" as const,
      visibility: "visible" as const,
      emphasis: "foreground" as const,
      opacity: 0.74,
      width: 1.55,
      directionCue: directed ? ("source-to-target" as const) : ("none" as const),
      anchorAssociated: true,
      impliesCausality: false as const,
      reason: Object.freeze([
        ...reasons,
        "anchor-incident foreground from canonical P2:7 reveal",
        directed
          ? "directionCue=source-to-target"
          : "directionCue=none (non-directed)",
      ]),
    });
  }

  if (input.isBackground || input.emphasis === "background") {
    return Object.freeze({
      connectionId: input.connectionId,
      sourceId: input.sourceId,
      targetId: input.targetId,
      relation,
      role: "background" as const,
      visibility: "subdued" as const,
      emphasis: "background" as const,
      opacity: 0.045,
      width: 0.85,
      directionCue: "none" as const,
      anchorAssociated: false,
      impliesCausality: false as const,
      reason: Object.freeze([
        ...reasons,
        "non-incident background edge — exists but not central now",
      ]),
    });
  }

  return Object.freeze({
    connectionId: input.connectionId,
    sourceId: input.sourceId,
    targetId: input.targetId,
    relation,
    role: "background" as const,
    visibility: "subdued" as const,
    emphasis: "secondary" as const,
    opacity: 0.1,
    width: 0.95,
    directionCue: "none" as const,
    anchorAssociated: false,
    impliesCausality: false as const,
    reason: Object.freeze([...reasons, "secondary non-foreground edge"]),
  });
}

export function resolveDataRealityConnectionVisualStatesFromContext(
  connectionsContext: DataRealityAwareConnectionsContextResult,
): readonly DataRealityConnectionVisualState[] {
  return Object.freeze(
    connectionsContext.connections.map((entry) =>
      resolveDataRealityConnectionVisualState({
        connectionId: entry.connectionId,
        sourceId: entry.sourceObjectId,
        targetId: entry.targetObjectId,
        relation: entry.relationshipKind,
        direction: entry.direction,
        isAnchorIncident: entry.isAnchorIncident,
        isRevealed: entry.isRevealed,
        isForeground: entry.isForeground,
        isBackground: entry.isBackground,
        emphasis: entry.emphasis,
        anchorObjectId: connectionsContext.anchorObjectId,
      }),
    ),
  );
}

export function resolveDataRealityContextVisualStatesFromContext(
  connectionsContext: DataRealityAwareConnectionsContextResult,
): readonly DataRealityContextVisualState[] {
  return Object.freeze(
    connectionsContext.contextItems.map((entry) => {
      const direct = entry.revealRole === "direct-context" || entry.isDirect;
      const hidden = entry.revealRole === "hidden";
      const attentionOnly = entry.revealRole === "attention-context";
      const peerConfusionRisk =
        entry.subjectKind === "object" && direct === false;
      return Object.freeze({
        contextId: entry.contextId,
        subjectId: entry.subjectId,
        subjectKind: entry.subjectKind,
        ...(entry.relationshipKind !== undefined
          ? { relation: entry.relationshipKind }
          : {}),
        revealRole: entry.revealRole,
        visibility: hidden
          ? ("hidden" as const)
          : attentionOnly
            ? ("subdued" as const)
            : direct
              ? ("visible" as const)
              : ("subdued" as const),
        opacity: hidden ? 0.1 : attentionOnly ? 0.2 : direct ? 0.9 : 0.35,
        scale: hidden ? 0.62 : attentionOnly ? 0.7 : direct ? 0.7 : 0.72,
        peerConfusionRisk,
        anchorAssociated: direct,
        reason: Object.freeze([
          `revealRole=${entry.revealRole}`,
          `revealDepthHops=1`,
          peerConfusionRisk
            ? "attention-context object must not receive relation styling"
            : "context subordinate to peer Stage objects",
        ]),
      });
    }),
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function hasEdge(
  connections: readonly { sourceId: string; targetId: string; present?: boolean }[],
  sourceId: string,
  targetId: string,
): boolean {
  return connections.some(
    (edge) =>
      edge.present !== false &&
      ((edge.sourceId === sourceId && edge.targetId === targetId) ||
        (edge.sourceId === targetId && edge.targetId === sourceId)),
  );
}

function pushFinding(
  findings: ConnectionsContextVisualValidationFinding[],
  finding: Omit<ConnectionsContextVisualValidationFinding, "findingId"> & {
    readonly findingId?: string;
  },
): void {
  findings.push(
    Object.freeze({
      findingId:
        finding.findingId ??
        `${finding.status}:${finding.subjectId}`,
      subjectId: finding.subjectId,
      ...(finding.anchorObjectId !== undefined
        ? { anchorObjectId: finding.anchorObjectId }
        : {}),
      ...(finding.canonicalRelation !== undefined
        ? { canonicalRelation: finding.canonicalRelation }
        : {}),
      expectedVisualRole: finding.expectedVisualRole,
      observedVisualRole: finding.observedVisualRole,
      status: finding.status,
      evidence: Object.freeze([...finding.evidence]),
      ...(finding.recommendation !== undefined
        ? { recommendation: finding.recommendation }
        : {}),
    }),
  );
}

export function validateConnectionsContextVisual(
  input: ValidateConnectionsContextVisualInput,
): ConnectionsContextVisualValidationResult {
  const findings: ConnectionsContextVisualValidationFinding[] = [];
  const anchorId = input.connectionsContext.anchorObjectId;
  const nonEdges =
    input.canonicalNonEdgePairs ??
    DATA_REALITY_CONNECTIONS_CONTEXT_CANONICAL_NON_EDGES;
  const observedById = new Map(
    input.observed.connections.map((entry) => [entry.connectionId, entry]),
  );
  const expectedById = new Map(
    input.connectionVisualStates.map((entry) => [entry.connectionId, entry]),
  );

  // Reveal depth
  const hops =
    input.connectionsContext.relationshipSummary.revealDepthHops;
  pushFinding(findings, {
    subjectId: "reveal-depth",
    anchorObjectId: anchorId,
    expectedVisualRole: { revealDepthHops: 1 },
    observedVisualRole: { revealDepthHops: hops },
    status: hops === 1 ? "valid" : "false-context",
    evidence:
      hops === 1
        ? ["Context reveal remains 1-hop"]
        : [`Reveal depth ${hops} exceeds approved 1-hop`],
  });

  // Connection visual roles
  for (const expected of input.connectionVisualStates) {
    const observed = observedById.get(expected.connectionId);
    if (!observed?.present) {
      if (expected.role === "anchor-incident") {
        pushFinding(findings, {
          subjectId: expected.connectionId,
          anchorObjectId: anchorId,
          canonicalRelation: expected.relation,
          expectedVisualRole: expected,
          observedVisualRole: { present: false },
          status: "weak-foreground-edge",
          evidence: ["Anchor-incident edge missing from Stage presentation"],
        });
      }
      continue;
    }

    if (observed.impliesCausality === true) {
      pushFinding(findings, {
        subjectId: expected.connectionId,
        anchorObjectId: anchorId,
        canonicalRelation: expected.relation,
        expectedVisualRole: { impliesCausality: false },
        observedVisualRole: { impliesCausality: true },
        status: "false-relationship",
        evidence: ["Connection incorrectly implies causality"],
      });
    }

    if (expected.role === "anchor-incident") {
      const strong =
        (observed.emphasized || observed.opacity >= 0.55) &&
        observed.opacity >= 0.55;
      pushFinding(findings, {
        subjectId: expected.connectionId,
        anchorObjectId: anchorId,
        canonicalRelation: expected.relation,
        expectedVisualRole: {
          role: "anchor-incident",
          emphasis: "foreground",
        },
        observedVisualRole: {
          emphasized: observed.emphasized,
          opacity: observed.opacity,
          visualRole: observed.visualRole,
          directionCue: observed.directionCue,
        },
        status: strong ? "valid" : "weak-foreground-edge",
        evidence: strong
          ? [
              "Anchor-incident edge foregrounded from canonical reveal",
              `opacity=${observed.opacity}`,
              `relation=${expected.relation}`,
            ]
          : [
              "Anchor-incident edge present but weakly emphasized",
              `opacity=${observed.opacity}`,
            ],
      });

      if (
        expected.directionCue === "source-to-target" &&
        observed.directionCue !== "source-to-target"
      ) {
        pushFinding(findings, {
          subjectId: expected.connectionId,
          anchorObjectId: anchorId,
          canonicalRelation: expected.relation,
          expectedVisualRole: { directionCue: "source-to-target" },
          observedVisualRole: { directionCue: observed.directionCue },
          status: "direction-ambiguous",
          evidence: ["Directed canonical edge lacks direction cue"],
        });
      }
    } else if (expected.role === "background") {
      const tooStrong = observed.emphasized || observed.opacity > 0.28;
      pushFinding(findings, {
        subjectId: expected.connectionId,
        anchorObjectId: anchorId,
        canonicalRelation: expected.relation,
        expectedVisualRole: { role: "background", subdued: true },
        observedVisualRole: {
          emphasized: observed.emphasized,
          opacity: observed.opacity,
        },
        status: tooStrong ? "background-too-strong" : "valid",
        evidence: tooStrong
          ? ["Background edge competes with anchor-local relationships"]
          : ["Background edge remains subdued"],
      });
    }
  }

  // Non-edges
  for (const pair of nonEdges) {
    const present =
      hasEdge(input.observed.connections, pair.sourceId, pair.targetId) ||
      hasEdge(input.observed.contextConnections, pair.sourceId, pair.targetId);
    pushFinding(findings, {
      subjectId: `${pair.sourceId}<->${pair.targetId}`,
      anchorObjectId: anchorId,
      expectedVisualRole: { present: false },
      observedVisualRole: { present },
      status: present ? "false-relationship" : "valid",
      evidence: present
        ? ["Canonical non-edge appeared visually"]
        : ["Canonical non-edge preserved"],
      recommendation:
        "Never invent Revenue↔Capacity from shared severity/attention",
    });
  }

  // Competing attention must not gain incident styling without canonical edge
  if (anchorId) {
    const competing = input.observed.objectRoles.filter(
      (entry) =>
        entry.role === "unrelated" &&
        (entry.executiveVisualState === "critical" ||
          entry.executiveVisualState === "attention"),
    );
    for (const object of competing) {
      const fakeIncident = input.observed.connections.some(
        (edge) =>
          edge.present !== false &&
          edge.emphasized &&
          ((edge.sourceId === anchorId && edge.targetId === object.objectId) ||
            (edge.targetId === anchorId && edge.sourceId === object.objectId)),
      );
      const expectedEdge = input.connectionsContext.connections.some(
        (entry) =>
          entry.isAnchorIncident &&
          ((entry.sourceObjectId === anchorId &&
            entry.targetObjectId === object.objectId) ||
            (entry.targetObjectId === anchorId &&
              entry.sourceObjectId === object.objectId)),
      );
      if (fakeIncident && !expectedEdge) {
        pushFinding(findings, {
          subjectId: object.objectId,
          anchorObjectId: anchorId,
          expectedVisualRole: { incident: false },
          observedVisualRole: { incidentStyled: true },
          status: "false-relationship",
          evidence: [
            "Competing attention received anchor-incident edge styling without canonical relationship",
          ],
        });
      } else {
        pushFinding(findings, {
          subjectId: object.objectId,
          anchorObjectId: anchorId,
          expectedVisualRole: { competingAttentionUnrelated: true },
          observedVisualRole: {
            role: object.role,
            executiveVisualState: object.executiveVisualState,
          },
          status: "valid",
          evidence: [
            "Competing attention remains unrelated to anchor relationship cluster",
          ],
        });
      }
    }
  }

  // Context association / peer confusion / hidden overflow
  for (const expected of input.contextVisualStates) {
    if (expected.revealRole === "hidden") {
      const observed = input.observed.contextNodes.find(
        (entry) => entry.contextId === expected.contextId,
      );
      if (observed && observed.opacity > 0.2) {
        pushFinding(findings, {
          subjectId: expected.contextId,
          anchorObjectId: anchorId,
          expectedVisualRole: { hidden: true },
          observedVisualRole: { opacity: observed.opacity },
          status: "false-context",
          evidence: ["Hidden overflow context remains visually prominent"],
        });
      } else {
        pushFinding(findings, {
          subjectId: expected.contextId,
          anchorObjectId: anchorId,
          expectedVisualRole: { hidden: true },
          observedVisualRole: {
            present: observed?.present ?? false,
            opacity: observed?.opacity,
          },
          status: "valid",
          evidence: ["Hidden overflow remains hidden/subdued"],
        });
      }
      continue;
    }

    if (expected.revealRole === "attention-context") {
      const styled = input.observed.contextConnections.some(
        (edge) =>
          edge.emphasized &&
          (edge.sourceId === expected.subjectId ||
            edge.targetId === expected.subjectId ||
            edge.sourceId === expected.contextId ||
            edge.targetId === expected.contextId),
      );
      pushFinding(findings, {
        subjectId: expected.contextId,
        anchorObjectId: anchorId,
        expectedVisualRole: { relationStyled: false },
        observedVisualRole: { relationStyled: styled },
        status: styled ? "false-context" : "valid",
        evidence: styled
          ? ["Attention-context incorrectly received relation connector styling"]
          : [
              "Attention-context remains discoverable via severity, not relation styling",
            ],
      });
      continue;
    }

    if (expected.revealRole === "direct-context") {
      const observed = input.observed.contextNodes.find(
        (entry) =>
          entry.contextId === expected.contextId ||
          entry.subjectId === expected.subjectId,
      );
      if (!observed || observed.opacity < 0.45) {
        pushFinding(findings, {
          subjectId: expected.contextId,
          anchorObjectId: anchorId,
          expectedVisualRole: { associated: true },
          observedVisualRole: observed ?? { present: false },
          status: "false-context",
          evidence: ["Direct 1-hop context not visibly associated"],
        });
      } else {
        const peerLike =
          observed.kind === "object" || observed.scale >= 0.95;
        pushFinding(findings, {
          subjectId: expected.contextId,
          anchorObjectId: anchorId,
          expectedVisualRole: {
            associated: true,
            subordinate: true,
          },
          observedVisualRole: {
            opacity: observed.opacity,
            scale: observed.scale,
            kind: observed.kind,
            role: observed.role,
          },
          status: peerLike ? "context-peer-confusion" : "valid",
          evidence: peerLike
            ? ["Context node risks reading as peer Stage object"]
            : [
                "Direct context associated with anchor and remains subordinate",
              ],
        });
      }
    }
  }

  // Density risk: too many foreground edges
  const foregroundCount = input.observed.connections.filter(
    (edge) => edge.emphasized || edge.opacity >= 0.55,
  ).length;
  if (foregroundCount > 5) {
    pushFinding(findings, {
      subjectId: "connection-density",
      anchorObjectId: anchorId,
      expectedVisualRole: { restrainedForeground: true },
      observedVisualRole: { foregroundCount },
      status: "density-risk",
      evidence: [
        `Foreground edge count=${foregroundCount} risks graph-heavy Stage`,
      ],
      recommendation: "Defer broad density work to P2:8.5",
    });
  }

  findings.sort((a, b) => {
    const status =
      CONNECTIONS_CONTEXT_VISUAL_VALIDATION_STATUSES.indexOf(a.status) -
      CONNECTIONS_CONTEXT_VISUAL_VALIDATION_STATUSES.indexOf(b.status);
    if (status !== 0) return status;
    return a.subjectId.localeCompare(b.subjectId);
  });

  const frozen = Object.freeze(findings.map((entry) => entry));
  const count = (status: ConnectionsContextVisualValidationStatus) =>
    frozen.filter((entry) => entry.status === status).length;

  return Object.freeze({
    validationId: [
      "connections-context-visual-validation",
      normalizeToken(input.scenario),
      normalizeToken(anchorId),
    ].join(":"),
    identity: IDENTITY,
    scenario: input.scenario,
    ...(anchorId !== undefined ? { anchorObjectId: anchorId } : {}),
    findings: frozen,
    summary: Object.freeze({
      totalFindings: frozen.length,
      validCount: count("valid"),
      weakForegroundEdgeCount: count("weak-foreground-edge"),
      backgroundTooStrongCount: count("background-too-strong"),
      directionAmbiguousCount: count("direction-ambiguous"),
      falseContextCount: count("false-context"),
      falseRelationshipCount: count("false-relationship"),
      contextPeerConfusionCount: count("context-peer-confusion"),
      staleRelationshipStateCount: count("stale-relationship-state"),
      densityRiskCount: count("density-risk"),
      revealDepthHops: 1 as const,
      nonEdgesPreserved: count("false-relationship") === 0,
    }),
    provenance: Object.freeze({
      validationIdentity:
        dataRealityConnectionsContextVisualValidationIdentity,
      validationVersion: dataRealityConnectionsContextVisualValidationVersion,
      validationNamespace:
        dataRealityConnectionsContextVisualValidationNamespace,
      validationPhase: dataRealityConnectionsContextVisualValidationPhase,
      validationCertified: false as const,
      chain: DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_VALIDATION_PROVENANCE_CHAIN,
      connectionsContextSource: dataRealityAwareConnectionsContextIdentity,
      connectionsContextVersion: dataRealityAwareConnectionsContextVersion,
      connectionsContextNamespace: dataRealityAwareConnectionsContextNamespace,
      auditSource: dataRealityVisualStageAuditIdentity,
      auditVersion: dataRealityVisualStageAuditVersion,
      auditNamespace: dataRealityVisualStageAuditNamespace,
      objectVisualSource: dataRealityObjectStateVisualValidationIdentity,
      objectVisualVersion: dataRealityObjectStateVisualValidationVersion,
      objectVisualNamespace: dataRealityObjectStateVisualValidationNamespace,
      focusValidationSource: dataRealityFocusSceneChoreographyValidationIdentity,
      focusValidationVersion:
        dataRealityFocusSceneChoreographyValidationVersion,
      focusValidationNamespace:
        dataRealityFocusSceneChoreographyValidationNamespace,
    }),
  });
}

export function extractObservedConnectionsContextVisualEvidence(presentation: {
  readonly scene: {
    readonly mode: string;
    readonly focusedObjectId: string | null;
    readonly connections: readonly {
      readonly id: string;
      readonly sourceId: string;
      readonly targetId: string;
      readonly emphasized: boolean;
      readonly opacity: number;
      readonly visualRole?: string;
      readonly directionCue?: string;
      readonly relation?: string;
      readonly lineWidth?: number;
      readonly impliesCausality?: boolean;
    }[];
    readonly objects: readonly {
      readonly id: string;
      readonly role: string;
      readonly executiveVisualState?: string;
    }[];
  };
  readonly contextConnections?: readonly {
    readonly id: string;
    readonly sourceId: string;
    readonly targetId: string;
    readonly emphasized: boolean;
    readonly opacity: number;
    readonly visualRole?: string;
    readonly directionCue?: string;
    readonly relation?: string;
  }[];
  readonly contextNodes?: readonly {
    readonly id: string;
    readonly subjectId: string;
    readonly kind: string;
    readonly role: string;
    readonly opacity: number;
    readonly scale: number;
    readonly relation?: string;
  }[];
}): ObservedConnectionsContextVisualEvidence {
  return Object.freeze({
    mode: presentation.scene.mode,
    focusedObjectId: presentation.scene.focusedObjectId,
    connections: Object.freeze(
      presentation.scene.connections.map((entry) =>
        Object.freeze({
          connectionId: entry.id,
          sourceId: entry.sourceId,
          targetId: entry.targetId,
          present: true,
          emphasized: entry.emphasized,
          opacity: entry.opacity,
          ...(entry.visualRole !== undefined
            ? { visualRole: entry.visualRole }
            : {}),
          ...(entry.directionCue !== undefined
            ? { directionCue: entry.directionCue }
            : {}),
          ...(entry.relation !== undefined ? { relation: entry.relation } : {}),
          ...(entry.lineWidth !== undefined
            ? { lineWidth: entry.lineWidth }
            : {}),
          impliesCausality: entry.impliesCausality === true,
        }),
      ),
    ),
    contextConnections: Object.freeze(
      (presentation.contextConnections ?? []).map((entry) =>
        Object.freeze({
          connectionId: entry.id,
          sourceId: entry.sourceId,
          targetId: entry.targetId,
          present: true,
          emphasized: entry.emphasized,
          opacity: entry.opacity,
          ...(entry.visualRole !== undefined
            ? { visualRole: entry.visualRole }
            : {}),
          ...(entry.directionCue !== undefined
            ? { directionCue: entry.directionCue }
            : {}),
          ...(entry.relation !== undefined ? { relation: entry.relation } : {}),
        }),
      ),
    ),
    contextNodes: Object.freeze(
      (presentation.contextNodes ?? []).map((entry) =>
        Object.freeze({
          contextId: entry.id,
          subjectId: entry.subjectId,
          kind: entry.kind,
          role: entry.role,
          present: true,
          opacity: entry.opacity,
          scale: entry.scale,
          ...(entry.relation !== undefined ? { relation: entry.relation } : {}),
        }),
      ),
    ),
    objectRoles: Object.freeze(
      presentation.scene.objects.map((entry) =>
        Object.freeze({
          objectId: entry.id,
          role: entry.role,
          ...(entry.executiveVisualState !== undefined
            ? { executiveVisualState: entry.executiveVisualState }
            : {}),
        }),
      ),
    ),
  });
}
