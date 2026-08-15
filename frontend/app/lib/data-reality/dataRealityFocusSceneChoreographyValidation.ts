/**
 * P2:8.3 — Focus & Scene Choreography Validation.
 *
 * Validates the lived Stage interaction path:
 *   selection → focus → anchor → spatial choreography
 *   → background / competing attention
 *
 * Observes P2:6 choreography + P2:8.2 severity presentation.
 * Does NOT resolve choreography, invent relationships, or rewrite severity.
 */

import type { DataRealityAwareSceneChoreographyResult } from "./dataRealityAwareSceneChoreography.ts";
import type { DataRealityAwareConnectionsContextResult } from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityAwareSceneChoreographyIdentity,
  dataRealityAwareSceneChoreographyNamespace,
  dataRealityAwareSceneChoreographyVersion,
} from "./dataRealityAwareSceneChoreography.ts";
import {
  dataRealityAwareConnectionsContextIdentity,
  dataRealityAwareConnectionsContextNamespace,
  dataRealityAwareConnectionsContextVersion,
} from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityObjectStateVisualValidationIdentity,
  dataRealityObjectStateVisualValidationNamespace,
  dataRealityObjectStateVisualValidationVersion,
  mapMvpVocabularyToObjectExecutiveVisualState,
  type DataRealityObjectExecutiveVisualState,
} from "./dataRealityObjectStateVisualValidation.ts";
import {
  dataRealityVisualStageAuditIdentity,
  dataRealityVisualStageAuditNamespace,
  dataRealityVisualStageAuditVersion,
} from "./dataRealityVisualStageAudit.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityFocusSceneChoreographyValidationIdentity =
  "P2:8.3/DataRealityFocusSceneChoreographyValidation" as const;

export const dataRealityFocusSceneChoreographyValidationVersion =
  "2.8.3" as const;

export const dataRealityFocusSceneChoreographyValidationNamespace =
  "nexora.data-reality.focus-scene-choreography-validation" as const;

export const dataRealityFocusSceneChoreographyValidationPhase =
  "FocusSceneChoreographyValidation" as const;

export const dataRealityFocusSceneChoreographyValidationArchitecturalRole =
  "DataRealityFocusSceneChoreographyValidationBoundary" as const;

export const dataRealityFocusSceneChoreographyValidationReadiness =
  "ReadyForConnectionsContextVisualValidation" as const;

export interface DataRealityFocusSceneChoreographyValidationIdentity {
  readonly identity: "P2:8.3/DataRealityFocusSceneChoreographyValidation";
  readonly version: "2.8.3";
  readonly namespace: "nexora.data-reality.focus-scene-choreography-validation";
  readonly phase: "FocusSceneChoreographyValidation";
  readonly architecturalRole: "DataRealityFocusSceneChoreographyValidationBoundary";
  readonly readiness: "ReadyForConnectionsContextVisualValidation";
}

const IDENTITY: DataRealityFocusSceneChoreographyValidationIdentity =
  Object.freeze({
    identity: dataRealityFocusSceneChoreographyValidationIdentity,
    version: dataRealityFocusSceneChoreographyValidationVersion,
    namespace: dataRealityFocusSceneChoreographyValidationNamespace,
    phase: dataRealityFocusSceneChoreographyValidationPhase,
    architecturalRole:
      dataRealityFocusSceneChoreographyValidationArchitecturalRole,
    readiness: dataRealityFocusSceneChoreographyValidationReadiness,
  });

export function getDataRealityFocusSceneChoreographyValidationIdentity(): DataRealityFocusSceneChoreographyValidationIdentity {
  return IDENTITY;
}

export const DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      dataRealityFocusSceneChoreographyValidationArchitecturalRole,
    ownsKpiComputation: false as const,
    ownsExecutiveStateResolution: false as const,
    inventsRelationships: false as const,
    inventsSeverityScores: false as const,
    recomputesChoreography: false as const,
    recomputesConnectionsContext: false as const,
    weakensCriticalDiscoverability: false as const,
    expandsContextBeyondOneHop: false as const,
    redesignsStageAesthetics: false as const,
    consumesP26Choreography: true as const,
    consumesP27ConnectionsContext: true as const,
    consumesP281Audit: true as const,
    consumesP282ObjectVisualState: true as const,
    validationCertified: false as const,
  });

export const DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P2:5 Focus & Attention Experience",
    "P2:6 Interaction & Scene Choreography",
    "P2:7 Connections & Context Reveal",
    "P2:8.1 Visual Stage Audit",
    "P2:8.2 Object State Visual Validation",
    "P2:8.3 Focus & Scene Choreography Validation",
  ] as const);

// ─── Status / finding contracts ─────────────────────────────────────────────

export const FOCUS_CHOREOGRAPHY_VALIDATION_STATUSES = Object.freeze([
  "valid",
  "weak-anchor",
  "severity-suppressed",
  "false-context",
  "false-relationship",
  "stale-focus",
  "spatial-conflict",
] as const);

export type FocusChoreographyValidationStatus =
  (typeof FOCUS_CHOREOGRAPHY_VALIDATION_STATUSES)[number];

export type FocusChoreographyValidationFinding = {
  readonly findingId: string;
  readonly subjectId: string;
  readonly interactionRole: string;
  readonly executiveState: string;
  readonly expectedPresentation: unknown;
  readonly observedPresentation: unknown;
  readonly status: FocusChoreographyValidationStatus;
  readonly evidence: readonly string[];
};

export type ObservedFocusSceneObject = {
  readonly objectId: string;
  readonly role: string;
  readonly focused: boolean;
  readonly selected: boolean;
  readonly status: string;
  readonly attention: string;
  readonly executiveVisualState?: string;
  readonly stateMarker?: string;
  readonly scale: number;
  readonly opacity: number;
  readonly emissiveIntensity: number;
  readonly targetPosition: readonly [number, number, number];
  readonly labelProminence: string;
};

export type ObservedFocusScenePresentation = {
  readonly mode: string;
  readonly focusedObjectId: string | null;
  readonly selectedObjectId: string | null;
  readonly objects: readonly ObservedFocusSceneObject[];
  readonly connectionIds: readonly string[];
  readonly connections: readonly {
    readonly id: string;
    readonly sourceId: string;
    readonly targetId: string;
  }[];
  readonly revealedContextIds?: readonly string[];
};

export type ValidateFocusSceneChoreographyInput = {
  readonly scenario: string;
  readonly choreography: DataRealityAwareSceneChoreographyResult;
  readonly connectionsContext: DataRealityAwareConnectionsContextResult;
  readonly observed: ObservedFocusScenePresentation;
  readonly canonicalNonEdgePairs?: readonly {
    readonly sourceId: string;
    readonly targetId: string;
  }[];
};

export type FocusSceneChoreographyValidationSummary = {
  readonly totalFindings: number;
  readonly validCount: number;
  readonly weakAnchorCount: number;
  readonly severitySuppressedCount: number;
  readonly falseContextCount: number;
  readonly falseRelationshipCount: number;
  readonly staleFocusCount: number;
  readonly spatialConflictCount: number;
  readonly singleAnchor: boolean;
  readonly focusOwnsAnchor: boolean;
  readonly backgroundCriticalDiscoverable: boolean;
  readonly nonEdgesPreserved: boolean;
  readonly contextOneHop: boolean;
};

export type FocusSceneChoreographyValidationResult = {
  readonly validationId: string;
  readonly identity: DataRealityFocusSceneChoreographyValidationIdentity;
  readonly scenario: string;
  readonly anchorObjectId?: string;
  readonly findings: readonly FocusChoreographyValidationFinding[];
  readonly summary: FocusSceneChoreographyValidationSummary;
  readonly provenance: {
    readonly validationIdentity: "P2:8.3/DataRealityFocusSceneChoreographyValidation";
    readonly validationVersion: "2.8.3";
    readonly validationNamespace: "nexora.data-reality.focus-scene-choreography-validation";
    readonly validationPhase: "FocusSceneChoreographyValidation";
    readonly validationCertified: false;
    readonly chain: typeof DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_PROVENANCE_CHAIN;
    readonly choreographySource: typeof dataRealityAwareSceneChoreographyIdentity;
    readonly choreographyVersion: typeof dataRealityAwareSceneChoreographyVersion;
    readonly choreographyNamespace: typeof dataRealityAwareSceneChoreographyNamespace;
    readonly connectionsContextSource: typeof dataRealityAwareConnectionsContextIdentity;
    readonly connectionsContextVersion: typeof dataRealityAwareConnectionsContextVersion;
    readonly connectionsContextNamespace: typeof dataRealityAwareConnectionsContextNamespace;
    readonly auditSource: typeof dataRealityVisualStageAuditIdentity;
    readonly auditVersion: typeof dataRealityVisualStageAuditVersion;
    readonly auditNamespace: typeof dataRealityVisualStageAuditNamespace;
    readonly objectVisualSource: typeof dataRealityObjectStateVisualValidationIdentity;
    readonly objectVisualVersion: typeof dataRealityObjectStateVisualValidationVersion;
    readonly objectVisualNamespace: typeof dataRealityObjectStateVisualValidationNamespace;
  };
};

export const DATA_REALITY_FOCUS_SCENE_CANONICAL_NON_EDGES = Object.freeze([
  Object.freeze({
    sourceId: "obj-revenue",
    targetId: "obj-capacity",
  }),
]);

/** Protected P2:8.2 background-critical floors. */
export const DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS =
  Object.freeze({
    minScale: 1.1,
    minOpacity: 0.74,
    minEmissive: 0.32,
  });

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function executiveStateOf(
  object: ObservedFocusSceneObject,
): DataRealityObjectExecutiveVisualState {
  if (
    object.executiveVisualState === "normal" ||
    object.executiveVisualState === "attention" ||
    object.executiveVisualState === "critical" ||
    object.executiveVisualState === "unresolved"
  ) {
    return object.executiveVisualState;
  }
  return mapMvpVocabularyToObjectExecutiveVisualState(
    object.status,
    object.attention,
  );
}

function pushFinding(
  findings: FocusChoreographyValidationFinding[],
  finding: Omit<FocusChoreographyValidationFinding, "findingId"> & {
    readonly findingId?: string;
  },
): void {
  findings.push(
    Object.freeze({
      findingId:
        finding.findingId ??
        `${finding.status}:${finding.subjectId}:${finding.interactionRole}`,
      subjectId: finding.subjectId,
      interactionRole: finding.interactionRole,
      executiveState: finding.executiveState,
      expectedPresentation: finding.expectedPresentation,
      observedPresentation: finding.observedPresentation,
      status: finding.status,
      evidence: Object.freeze([...finding.evidence]),
    }),
  );
}

function hasEdge(
  connections: readonly { sourceId: string; targetId: string }[],
  sourceId: string,
  targetId: string,
): boolean {
  return connections.some(
    (edge) =>
      (edge.sourceId === sourceId && edge.targetId === targetId) ||
      (edge.sourceId === targetId && edge.targetId === sourceId),
  );
}

/**
 * Validate focus ownership / severity composition / context independence.
 * Observes existing choreography — does not resolve a new plan.
 */
export function validateFocusSceneChoreography(
  input: ValidateFocusSceneChoreographyInput,
): FocusSceneChoreographyValidationResult {
  const findings: FocusChoreographyValidationFinding[] = [];
  const anchorId = input.choreography.anchorObjectId;
  const retained = new Set(input.choreography.attentionRetention.objectIds);
  const relatedIds = new Set(
    input.choreography.objects
      .filter((entry) => entry.isRelated)
      .map((entry) => entry.objectId),
  );
  const observedById = new Map(
    input.observed.objects.map((entry) => [entry.objectId, entry]),
  );
  const nonEdges =
    input.canonicalNonEdgePairs ?? DATA_REALITY_FOCUS_SCENE_CANONICAL_NON_EDGES;

  const focusedObjects = input.observed.objects.filter((entry) => entry.focused);
  if (anchorId) {
    if (focusedObjects.length !== 1 || focusedObjects[0]?.objectId !== anchorId) {
      pushFinding(findings, {
        subjectId: anchorId,
        interactionRole: "anchor",
        executiveState: executiveStateOf(
          observedById.get(anchorId) ?? {
            objectId: anchorId,
            role: "focused",
            focused: false,
            selected: false,
            status: "stable",
            attention: "normal",
            scale: 1,
            opacity: 1,
            emissiveIntensity: 0,
            targetPosition: [0, 0, 0],
            labelProminence: "full",
          },
        ),
        expectedPresentation: { singleAnchor: anchorId },
        observedPresentation: {
          focusedObjectIds: focusedObjects.map((entry) => entry.objectId),
        },
        status:
          focusedObjects.length === 0 ? "weak-anchor" : "stale-focus",
        evidence: [
          `Expected single anchor ${anchorId}`,
          `Observed focused count=${focusedObjects.length}`,
        ],
      });
    } else {
      const anchor = focusedObjects[0]!;
      const exec = executiveStateOf(anchor);
      const radial = Math.hypot(
        anchor.targetPosition[0],
        anchor.targetPosition[2],
      );
      const ownsSpace =
        anchor.role === "focused" &&
        anchor.scale >= 1.28 &&
        radial <= 0.45 &&
        anchor.targetPosition[1] >= 0.25;
      pushFinding(findings, {
        subjectId: anchorId,
        interactionRole: "anchor",
        executiveState: exec,
        expectedPresentation: {
          focused: true,
          role: "focused",
          ownsSpatialCenter: true,
          severityUnchanged: true,
        },
        observedPresentation: {
          focused: anchor.focused,
          role: anchor.role,
          scale: anchor.scale,
          position: anchor.targetPosition,
          executiveVisualState: exec,
          marker: anchor.stateMarker,
        },
        status: ownsSpace ? "valid" : "weak-anchor",
        evidence: ownsSpace
          ? [
              "Single anchor owns interaction focus",
              `scale=${anchor.scale} radial=${radial.toFixed(3)} y=${anchor.targetPosition[1]}`,
              `executiveState=${exec} preserved under focus`,
            ]
          : [
              "Anchor focused but spatial ownership is weak",
              `scale=${anchor.scale} radial=${radial.toFixed(3)}`,
            ],
      });

      // Focus must not rewrite severity toward critical for attention/normal.
      if (exec === "attention" && anchor.stateMarker === "critical") {
        pushFinding(findings, {
          subjectId: anchorId,
          interactionRole: "anchor",
          executiveState: exec,
          expectedPresentation: { marker: "attention" },
          observedPresentation: { marker: anchor.stateMarker },
          status: "spatial-conflict",
          evidence: ["Attention+anchor incorrectly presents critical marker"],
        });
      }
    }
  } else if (focusedObjects.length > 0) {
    pushFinding(findings, {
      subjectId: focusedObjects[0]!.objectId,
      interactionRole: "overview",
      executiveState: executiveStateOf(focusedObjects[0]!),
      expectedPresentation: { focusedObjectId: null },
      observedPresentation: {
        focusedObjectIds: focusedObjects.map((entry) => entry.objectId),
      },
      status: "stale-focus",
      evidence: ["Overview expected but focused objects remain"],
    });
  } else {
    pushFinding(findings, {
      subjectId: "overview",
      interactionRole: "overview",
      executiveState: "n/a",
      expectedPresentation: { mode: "overview" },
      observedPresentation: { mode: input.observed.mode },
      status: "valid",
      evidence: ["Overview has no interaction anchor"],
    });
  }

  // Background competing attention / severity floors
  for (const object of input.observed.objects) {
    const exec = executiveStateOf(object);
    if (object.role !== "unrelated") continue;
    if (object.focused) {
      pushFinding(findings, {
        subjectId: object.objectId,
        interactionRole: "background",
        executiveState: exec,
        expectedPresentation: { focused: false },
        observedPresentation: { focused: true },
        status: "stale-focus",
        evidence: ["Background object incorrectly focused"],
      });
    }
    if (exec === "critical") {
      const floors = DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS;
      const discoverable =
        object.scale >= floors.minScale &&
        object.opacity >= floors.minOpacity &&
        object.emissiveIntensity >= floors.minEmissive &&
        object.stateMarker === "critical";
      pushFinding(findings, {
        subjectId: object.objectId,
        interactionRole: "background",
        executiveState: "critical",
        expectedPresentation: floors,
        observedPresentation: {
          scale: object.scale,
          opacity: object.opacity,
          emissiveIntensity: object.emissiveIntensity,
          marker: object.stateMarker,
          retained: retained.has(object.objectId),
        },
        status: discoverable ? "valid" : "severity-suppressed",
        evidence: discoverable
          ? [
              "Background critical remains discoverable",
              "Not focused; severity floors preserved",
            ]
          : [
              "Background critical severity floors suppressed",
              `scale=${object.scale} opacity=${object.opacity} emissive=${object.emissiveIntensity}`,
            ],
      });

      // Competing critical must not enter related/context without canonical edge.
      if (relatedIds.has(object.objectId)) {
        pushFinding(findings, {
          subjectId: object.objectId,
          interactionRole: "background",
          executiveState: "critical",
          expectedPresentation: { related: false },
          observedPresentation: { related: true },
          status: "false-context",
          evidence: [
            "Background critical incorrectly classified as related context",
          ],
        });
      }
    }
  }

  // Canonical non-edges
  for (const pair of nonEdges) {
    if (hasEdge(input.observed.connections, pair.sourceId, pair.targetId)) {
      pushFinding(findings, {
        subjectId: `${pair.sourceId}<->${pair.targetId}`,
        interactionRole: "relationship",
        executiveState: "n/a",
        expectedPresentation: { present: false },
        observedPresentation: { present: true },
        status: "false-relationship",
        evidence: ["Canonical non-edge present on Stage"],
      });
    } else {
      pushFinding(findings, {
        subjectId: `${pair.sourceId}<->${pair.targetId}`,
        interactionRole: "relationship",
        executiveState: "n/a",
        expectedPresentation: { present: false },
        observedPresentation: { present: false },
        status: "valid",
        evidence: ["Canonical non-edge preserved"],
      });
    }
  }

  // P2:7 1-hop
  const hops = input.connectionsContext.relationshipSummary.revealDepthHops;
  pushFinding(findings, {
    subjectId: "context-depth",
    interactionRole: "context",
    executiveState: "n/a",
    expectedPresentation: { revealDepthHops: 1 },
    observedPresentation: { revealDepthHops: hops },
    status: hops === 1 ? "valid" : "false-context",
    evidence:
      hops === 1
        ? ["Context reveal remains 1-hop"]
        : [`Context depth ${hops} exceeds 1-hop`],
  });

  // Canonical context vs competing attention separation
  if (anchorId) {
    const competingCritical = input.observed.objects.filter(
      (entry) =>
        entry.role === "unrelated" &&
        executiveStateOf(entry) === "critical" &&
        entry.objectId !== anchorId,
    );
    const localRelated = input.observed.objects.filter(
      (entry) => entry.role === "related",
    );
    const overlap = competingCritical.filter((entry) =>
      relatedIds.has(entry.objectId),
    );
    pushFinding(findings, {
      subjectId: anchorId,
      interactionRole: "context-separation",
      executiveState: "n/a",
      expectedPresentation: {
        competingCriticalOutsideRelated: true,
        localRelatedCount: localRelated.length,
      },
      observedPresentation: {
        competingCriticalIds: competingCritical.map((entry) => entry.objectId),
        relatedIds: localRelated.map((entry) => entry.objectId),
        overlapIds: overlap.map((entry) => entry.objectId),
      },
      status: overlap.length === 0 ? "valid" : "false-context",
      evidence:
        overlap.length === 0
          ? [
              "Competing critical subjects remain outside canonical related context",
              `competing=${competingCritical.length} related=${localRelated.length}`,
            ]
          : [
              "Competing critical subjects incorrectly overlap related context",
              ...overlap.map((entry) => `overlap:${entry.objectId}`),
            ],
    });
  }

  findings.sort((a, b) => {
    const status =
      FOCUS_CHOREOGRAPHY_VALIDATION_STATUSES.indexOf(a.status) -
      FOCUS_CHOREOGRAPHY_VALIDATION_STATUSES.indexOf(b.status);
    if (status !== 0) return status;
    return a.subjectId.localeCompare(b.subjectId);
  });

  const frozen = Object.freeze(findings.map((entry) => entry));
  const count = (status: FocusChoreographyValidationStatus) =>
    frozen.filter((entry) => entry.status === status).length;

  const backgroundCriticalDiscoverable =
    frozen.filter(
      (entry) =>
        entry.interactionRole === "background" &&
        entry.executiveState === "critical",
    ).every((entry) => entry.status === "valid") ||
    frozen.every(
      (entry) =>
        !(
          entry.interactionRole === "background" &&
          entry.executiveState === "critical"
        ),
    );

  const summary = Object.freeze({
    totalFindings: frozen.length,
    validCount: count("valid"),
    weakAnchorCount: count("weak-anchor"),
    severitySuppressedCount: count("severity-suppressed"),
    falseContextCount: count("false-context"),
    falseRelationshipCount: count("false-relationship"),
    staleFocusCount: count("stale-focus"),
    spatialConflictCount: count("spatial-conflict"),
    singleAnchor: anchorId
      ? focusedObjects.length === 1 &&
        focusedObjects[0]?.objectId === anchorId
      : focusedObjects.length === 0,
    focusOwnsAnchor: Boolean(
      anchorId &&
        focusedObjects.length === 1 &&
        focusedObjects[0]?.objectId === anchorId &&
        focusedObjects[0]?.role === "focused",
    ),
    backgroundCriticalDiscoverable,
    nonEdgesPreserved: count("false-relationship") === 0,
    contextOneHop: hops === 1,
  });

  return Object.freeze({
    validationId: [
      "focus-scene-choreography-validation",
      normalizeToken(input.scenario),
      normalizeToken(anchorId),
    ].join(":"),
    identity: IDENTITY,
    scenario: input.scenario,
    ...(anchorId !== undefined ? { anchorObjectId: anchorId } : {}),
    findings: frozen,
    summary,
    provenance: Object.freeze({
      validationIdentity: dataRealityFocusSceneChoreographyValidationIdentity,
      validationVersion: dataRealityFocusSceneChoreographyValidationVersion,
      validationNamespace: dataRealityFocusSceneChoreographyValidationNamespace,
      validationPhase: dataRealityFocusSceneChoreographyValidationPhase,
      validationCertified: false as const,
      chain: DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_VALIDATION_PROVENANCE_CHAIN,
      choreographySource: dataRealityAwareSceneChoreographyIdentity,
      choreographyVersion: dataRealityAwareSceneChoreographyVersion,
      choreographyNamespace: dataRealityAwareSceneChoreographyNamespace,
      connectionsContextSource: dataRealityAwareConnectionsContextIdentity,
      connectionsContextVersion: dataRealityAwareConnectionsContextVersion,
      connectionsContextNamespace: dataRealityAwareConnectionsContextNamespace,
      auditSource: dataRealityVisualStageAuditIdentity,
      auditVersion: dataRealityVisualStageAuditVersion,
      auditNamespace: dataRealityVisualStageAuditNamespace,
      objectVisualSource: dataRealityObjectStateVisualValidationIdentity,
      objectVisualVersion: dataRealityObjectStateVisualValidationVersion,
      objectVisualNamespace: dataRealityObjectStateVisualValidationNamespace,
    }),
  });
}

/**
 * Extract observed focus-scene evidence from Stage interaction presentation.
 */
export function extractObservedFocusScenePresentation(presentation: {
  readonly scene: {
    readonly mode: string;
    readonly focusedObjectId: string | null;
    readonly selectedObjectId?: string | null;
    readonly objects: readonly {
      readonly id: string;
      readonly role: string;
      readonly focused: boolean;
      readonly selected: boolean;
      readonly status: string;
      readonly attention: string;
      readonly executiveVisualState?: string;
      readonly stateMarker?: string;
      readonly scale: number;
      readonly opacity: number;
      readonly emissiveIntensity: number;
      readonly targetPosition: readonly [number, number, number];
      readonly labelProminence: string;
    }[];
    readonly connections: readonly {
      readonly id: string;
      readonly sourceId: string;
      readonly targetId: string;
    }[];
  };
  readonly focusedSubjectId?: string | null;
  readonly selectedSubjectId?: string | null;
}): ObservedFocusScenePresentation {
  return Object.freeze({
    mode: presentation.scene.mode,
    focusedObjectId:
      presentation.scene.focusedObjectId ??
      presentation.focusedSubjectId ??
      null,
    selectedObjectId:
      presentation.scene.selectedObjectId ??
      presentation.selectedSubjectId ??
      null,
    objects: Object.freeze(
      presentation.scene.objects.map((object) =>
        Object.freeze({
          objectId: object.id,
          role: object.role,
          focused: object.focused,
          selected: object.selected,
          status: object.status,
          attention: object.attention,
          ...(object.executiveVisualState !== undefined
            ? { executiveVisualState: object.executiveVisualState }
            : {}),
          ...(object.stateMarker !== undefined
            ? { stateMarker: object.stateMarker }
            : {}),
          scale: object.scale,
          opacity: object.opacity,
          emissiveIntensity: object.emissiveIntensity,
          targetPosition: object.targetPosition,
          labelProminence: object.labelProminence,
        }),
      ),
    ),
    connectionIds: Object.freeze(
      presentation.scene.connections.map((entry) => entry.id),
    ),
    connections: Object.freeze(
      presentation.scene.connections.map((entry) =>
        Object.freeze({
          id: entry.id,
          sourceId: entry.sourceId,
          targetId: entry.targetId,
        }),
      ),
    ),
  });
}
