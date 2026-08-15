/**
 * P2:8.5 — Density, Camera & Executive Readability Validation.
 *
 * Validates and instructs minimal presentation corrections for Stage density,
 * camera framing, label priority, and glanceability — without inventing,
 * hiding, or reinterpreting canonical Data Reality truth.
 *
 * Does NOT:
 *   - create a layout / force-directed engine
 *   - redesign geometry, materials, lighting, or dial
 *   - change KPI / severity / relationship / context-reveal semantics
 *   - claim human perceptual certification
 */

import type { DataRealityAwareConnectionsContextResult } from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityAwareConnectionsContextIdentity,
  dataRealityAwareConnectionsContextNamespace,
  dataRealityAwareConnectionsContextVersion,
} from "./dataRealityAwareConnectionsContext.ts";
import {
  dataRealityConnectionsContextVisualValidationIdentity,
  dataRealityConnectionsContextVisualValidationNamespace,
  dataRealityConnectionsContextVisualValidationVersion,
} from "./dataRealityConnectionsContextVisualValidation.ts";
import {
  dataRealityFocusSceneChoreographyValidationIdentity,
  dataRealityFocusSceneChoreographyValidationNamespace,
  dataRealityFocusSceneChoreographyValidationVersion,
  DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS,
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
import { EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS } from "../spatial-presentation/executiveCameraFoundation.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE,
  EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE,
} from "../spatial-presentation/executiveViewingAngle.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityDensityCameraExecutiveReadabilityValidationIdentity =
  "P2:8.5/DataRealityDensityCameraExecutiveReadabilityValidation" as const;

export const dataRealityDensityCameraExecutiveReadabilityValidationVersion =
  "2.8.5" as const;

export const dataRealityDensityCameraExecutiveReadabilityValidationNamespace =
  "nexora.data-reality.density-camera-executive-readability-validation" as const;

export const dataRealityDensityCameraExecutiveReadabilityValidationPhase =
  "DensityCameraExecutiveReadabilityValidation" as const;

export const dataRealityDensityCameraExecutiveReadabilityValidationArchitecturalRole =
  "DataRealityDensityCameraExecutiveReadabilityValidationBoundary" as const;

export const dataRealityDensityCameraExecutiveReadabilityValidationReadiness =
  "ReadyForEndToEndStageRealityCertification" as const;

export interface DataRealityDensityCameraExecutiveReadabilityValidationIdentity {
  readonly identity: "P2:8.5/DataRealityDensityCameraExecutiveReadabilityValidation";
  readonly version: "2.8.5";
  readonly namespace: "nexora.data-reality.density-camera-executive-readability-validation";
  readonly phase: "DensityCameraExecutiveReadabilityValidation";
  readonly architecturalRole: "DataRealityDensityCameraExecutiveReadabilityValidationBoundary";
  readonly readiness: "ReadyForEndToEndStageRealityCertification";
}

const IDENTITY: DataRealityDensityCameraExecutiveReadabilityValidationIdentity =
  Object.freeze({
    identity:
      dataRealityDensityCameraExecutiveReadabilityValidationIdentity,
    version:
      dataRealityDensityCameraExecutiveReadabilityValidationVersion,
    namespace:
      dataRealityDensityCameraExecutiveReadabilityValidationNamespace,
    phase: dataRealityDensityCameraExecutiveReadabilityValidationPhase,
    architecturalRole:
      dataRealityDensityCameraExecutiveReadabilityValidationArchitecturalRole,
    readiness:
      dataRealityDensityCameraExecutiveReadabilityValidationReadiness,
  });

export function getDataRealityDensityCameraExecutiveReadabilityValidationIdentity(): DataRealityDensityCameraExecutiveReadabilityValidationIdentity {
  return IDENTITY;
}

export const DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_VALIDATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      dataRealityDensityCameraExecutiveReadabilityValidationArchitecturalRole,
    inventsRelationships: false as const,
    expandsRevealDepth: false as const,
    revealDepthHops: 1 as const,
    weakensCriticalDiscoverability: false as const,
    actsAsSemanticFilter: false as const,
    createsLayoutEngine: false as const,
    redesignsStageAesthetics: false as const,
    certifiesHumanPerception: false as const,
    consumesP281Audit: true as const,
    consumesP282ObjectVisualState: true as const,
    consumesP283FocusChoreography: true as const,
    consumesP284ConnectionsContextVisual: true as const,
    validationCertified: false as const,
  });

export const DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P2:8.1 Visual Stage Audit",
    "P2:8.2 Object State Visual Validation",
    "P2:8.3 Focus & Scene Choreography Validation",
    "P2:8.4 Connections & Context Visual Validation",
    "P2:8.5 Density, Camera & Executive Readability Validation",
  ] as const);

// ─── Presentation contracts ─────────────────────────────────────────────────

export const EXECUTIVE_READABILITY_STATUSES = Object.freeze([
  "readable",
  "crowded",
  "label-conflict",
  "camera-too-near",
  "camera-too-far",
  "anchor-clipped",
  "context-crowded",
  "connection-noise",
  "critical-obscured",
] as const);

export type ExecutiveReadabilityStatus =
  (typeof EXECUTIVE_READABILITY_STATUSES)[number];

export type ExecutiveReadabilitySeverity =
  | "blocker"
  | "high"
  | "medium"
  | "low";

export type ExecutiveLabelPresentationPriority =
  | "anchor"
  | "critical-persistent"
  | "related"
  | "attention"
  | "background";

export type DataRealityLabelReadabilityState = {
  readonly objectId: string;
  readonly priority: ExecutiveLabelPresentationPriority;
  readonly prominence: "full" | "reduced" | "minimal";
  readonly persistentViaMarker: boolean;
  readonly reason: readonly string[];
};

export type DataRealityCameraReadabilityState = {
  readonly mode: "overview" | "focus";
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly distance: number;
  readonly reason: readonly string[];
};

export type DataRealityConnectionDensityState = {
  readonly connectionId: string;
  readonly visualRole: string;
  readonly opacity: number;
  readonly width: number;
  readonly emphasized: boolean;
  readonly reason: readonly string[];
};

export type ExecutiveReadabilityFinding = {
  readonly findingId: string;
  readonly subjectId: string;
  readonly scenario: string;
  readonly expectedRole: string;
  readonly observedPresentation: unknown;
  readonly status: ExecutiveReadabilityStatus;
  readonly severity: ExecutiveReadabilitySeverity;
  readonly evidence: readonly string[];
  readonly recommendation?: string;
};

export type ExecutiveReadabilityMetrics = {
  readonly objectCount: number;
  readonly persistentLabelCount: number;
  readonly elevatedLabelCount: number;
  readonly minimalLabelCount: number;
  readonly visibleContextCount: number;
  readonly foregroundEdgeCount: number;
  readonly backgroundEdgeCount: number;
  readonly minObjectSpacing: number | null;
  readonly minAnchorContextSpacing: number | null;
  readonly minContextCompetingSeparation: number | null;
  readonly cameraDistance: number;
  readonly cameraMode: "overview" | "focus";
  readonly revealDepthHops: 1;
};

export type ExecutiveReadabilityValidationSummary = {
  readonly totalFindings: number;
  readonly readableCount: number;
  readonly crowdedCount: number;
  readonly labelConflictCount: number;
  readonly cameraTooNearCount: number;
  readonly cameraTooFarCount: number;
  readonly anchorClippedCount: number;
  readonly contextCrowdedCount: number;
  readonly connectionNoiseCount: number;
  readonly criticalObscuredCount: number;
  readonly nonEdgesPreserved: boolean;
  readonly revealDepthHops: 1;
};

export type ExecutiveReadabilityValidationResult = {
  readonly validationId: string;
  readonly identity: DataRealityDensityCameraExecutiveReadabilityValidationIdentity;
  readonly scenario: string;
  readonly mode: "overview" | "focus";
  readonly anchorObjectId?: string;
  readonly findings: readonly ExecutiveReadabilityFinding[];
  readonly summary: ExecutiveReadabilityValidationSummary;
  readonly metrics: ExecutiveReadabilityMetrics;
  readonly labelStates: readonly DataRealityLabelReadabilityState[];
  readonly cameraState: DataRealityCameraReadabilityState;
  readonly connectionDensityStates: readonly DataRealityConnectionDensityState[];
  readonly provenance: {
    readonly validationIdentity: "P2:8.5/DataRealityDensityCameraExecutiveReadabilityValidation";
    readonly validationVersion: "2.8.5";
    readonly validationNamespace: "nexora.data-reality.density-camera-executive-readability-validation";
    readonly validationPhase: "DensityCameraExecutiveReadabilityValidation";
    readonly validationCertified: false;
    readonly chain: typeof DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_PROVENANCE_CHAIN;
    readonly auditSource: typeof dataRealityVisualStageAuditIdentity;
    readonly auditVersion: typeof dataRealityVisualStageAuditVersion;
    readonly auditNamespace: typeof dataRealityVisualStageAuditNamespace;
    readonly objectVisualSource: typeof dataRealityObjectStateVisualValidationIdentity;
    readonly objectVisualVersion: typeof dataRealityObjectStateVisualValidationVersion;
    readonly objectVisualNamespace: typeof dataRealityObjectStateVisualValidationNamespace;
    readonly focusValidationSource: typeof dataRealityFocusSceneChoreographyValidationIdentity;
    readonly focusValidationVersion: typeof dataRealityFocusSceneChoreographyValidationVersion;
    readonly focusValidationNamespace: typeof dataRealityFocusSceneChoreographyValidationNamespace;
    readonly connectionsVisualSource: typeof dataRealityConnectionsContextVisualValidationIdentity;
    readonly connectionsVisualVersion: typeof dataRealityConnectionsContextVisualValidationVersion;
    readonly connectionsVisualNamespace: typeof dataRealityConnectionsContextVisualValidationNamespace;
    readonly connectionsContextSource: typeof dataRealityAwareConnectionsContextIdentity;
    readonly connectionsContextVersion: typeof dataRealityAwareConnectionsContextVersion;
    readonly connectionsContextNamespace: typeof dataRealityAwareConnectionsContextNamespace;
  };
};

/**
 * Calm overview framing — SP:1.2 Executive Viewing Angle via SP:1.1 resolve.
 * Mid-band distance, readable scale, shell-aware framing padding applied.
 */
export const DATA_REALITY_OVERVIEW_READABILITY_CAMERA = Object.freeze({
  position: EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE.position,
  target: EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE.target,
  fov: EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE.fov,
  near: EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE.near,
  far: EXECUTIVE_OVERVIEW_VIEWING_CAMERA_TUPLE.far,
});

/**
 * Intentional focus framing — SP:1.2 angle family toward elevated focus region.
 * SP:1.5 owns object choreography; SP:1.6 may adjust distance for cluster density.
 * Canonical MVP focus clusters resolve to this companion framing.
 */
export const DATA_REALITY_FOCUS_READABILITY_CAMERA = Object.freeze({
  position: EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE.position,
  target: EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE.target,
  fov: EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE.fov,
  near: EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE.near,
  far: EXECUTIVE_FOCUS_VIEWING_CAMERA_TUPLE.far,
});

export const DATA_REALITY_CAMERA_DISTANCE_BOUNDS = Object.freeze({
  minFocus: EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance,
  maxUseful: EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
});

export const DATA_REALITY_READABILITY_CRITICAL_FLOORS =
  DATA_REALITY_FOCUS_SCENE_CRITICAL_BACKGROUND_FLOORS;

export const DATA_REALITY_READABILITY_CANONICAL_NON_EDGES = Object.freeze([
  Object.freeze({ sourceId: "obj-revenue", targetId: "obj-capacity" }),
] as const);

export const DATA_REALITY_BACKGROUND_EDGE_DENSITY_OPACITY = 0.045;
export const DATA_REALITY_OVERVIEW_EDGE_DENSITY_OPACITY = 0.1;
export const DATA_REALITY_FOREGROUND_EDGE_MIN_OPACITY = 0.55;
export const DATA_REALITY_NORMAL_BACKGROUND_MIN_OPACITY = 0.22;

// ─── Resolvers (presentation only) ──────────────────────────────────────────

export type ResolveLabelReadabilityInput = {
  readonly objectId: string;
  readonly mode: "overview" | "focus";
  readonly role: string;
  readonly focused: boolean;
  readonly executiveVisualState?: string;
  readonly stateMarker?: string;
  readonly attention?: string;
};

export function resolveDataRealityLabelReadabilityState(
  input: ResolveLabelReadabilityInput,
): DataRealityLabelReadabilityState {
  const severity =
    input.executiveVisualState ??
    (input.stateMarker === "critical"
      ? "critical"
      : input.stateMarker === "attention"
        ? "attention"
        : input.stateMarker === "unresolved"
          ? "unresolved"
          : "normal");

  if (input.focused || input.role === "focused") {
    return Object.freeze({
      objectId: input.objectId,
      priority: "anchor" as const,
      prominence: "full" as const,
      persistentViaMarker: severity === "critical" || severity === "unresolved",
      reason: Object.freeze([
        "anchor label priority — first-glance ownership",
      ]),
    });
  }

  if (input.role === "related") {
    return Object.freeze({
      objectId: input.objectId,
      priority: "related" as const,
      prominence: "full" as const,
      persistentViaMarker: severity === "critical",
      reason: Object.freeze([
        "related/supporting label — second-glance context",
      ]),
    });
  }

  if (severity === "critical" || input.stateMarker === "critical") {
    return Object.freeze({
      objectId: input.objectId,
      priority: "critical-persistent" as const,
      // Structural text load not counted as prominent; Html still shown via marker.
      prominence: "minimal" as const,
      persistentViaMarker: true,
      reason: Object.freeze([
        "critical persistent via marker; structural label prominence minimal for density",
      ]),
    });
  }

  if (severity === "attention" || severity === "unresolved") {
    const inFocusBackground =
      input.mode === "focus" && input.role === "unrelated";
    return Object.freeze({
      objectId: input.objectId,
      priority: "attention" as const,
      prominence: inFocusBackground
        ? ("minimal" as const)
        : input.mode === "overview"
          ? ("minimal" as const)
          : ("reduced" as const),
      persistentViaMarker: severity === "unresolved",
      reason: Object.freeze([
        inFocusBackground || input.mode === "overview"
          ? "attention/unresolved label subdued for calm density"
          : "attention/unresolved label reduced for calm density",
      ]),
    });
  }

  return Object.freeze({
    objectId: input.objectId,
    priority: "background" as const,
    prominence: "minimal" as const,
    persistentViaMarker: false,
    reason: Object.freeze([
      "normal/background label subdued — interaction may elevate",
    ]),
  });
}

export function resolveDataRealityCameraReadabilityState(
  mode: "overview" | "focus",
): DataRealityCameraReadabilityState {
  const camera =
    mode === "focus"
      ? DATA_REALITY_FOCUS_READABILITY_CAMERA
      : DATA_REALITY_OVERVIEW_READABILITY_CAMERA;
  const distance = Math.hypot(
    camera.position[0] - camera.target[0],
    camera.position[1] - camera.target[1],
    camera.position[2] - camera.target[2],
  );
  return Object.freeze({
    mode,
    position: camera.position,
    target: camera.target,
    fov: camera.fov,
    near: camera.near,
    far: camera.far,
    distance,
    reason: Object.freeze([
      mode === "focus"
        ? "focus framing toward elevated anchor with breathing room"
        : "overview framing for coherent business situation",
      `distance=${distance.toFixed(2)} within [${DATA_REALITY_CAMERA_DISTANCE_BOUNDS.minFocus}, ${DATA_REALITY_CAMERA_DISTANCE_BOUNDS.maxUseful}]`,
    ]),
  });
}

export function resolveDataRealityConnectionDensityState(input: {
  readonly connectionId: string;
  readonly visualRole?: string;
  readonly emphasized: boolean;
  readonly opacity: number;
  readonly width?: number;
  readonly mode: "overview" | "focus";
}): DataRealityConnectionDensityState {
  const role = input.visualRole ?? (input.emphasized ? "anchor-incident" : "background");
  if (role === "anchor-incident" || input.emphasized) {
    return Object.freeze({
      connectionId: input.connectionId,
      visualRole: "anchor-incident",
      opacity: Math.max(input.opacity, DATA_REALITY_FOREGROUND_EDGE_MIN_OPACITY),
      width: Math.max(input.width ?? 1.65, 1.5),
      emphasized: true,
      reason: Object.freeze([
        "foreground incident edge preserved for readability",
      ]),
    });
  }
  if (role === "context") {
    return Object.freeze({
      connectionId: input.connectionId,
      visualRole: "context",
      opacity: Math.min(Math.max(input.opacity, 0.5), 0.58),
      width: Math.min(input.width ?? 1.15, 1.15),
      emphasized: true,
      reason: Object.freeze(["context connector remains secondary"]),
    });
  }
  const opacity =
    input.mode === "overview"
      ? Math.min(input.opacity, DATA_REALITY_OVERVIEW_EDGE_DENSITY_OPACITY)
      : Math.min(input.opacity, DATA_REALITY_BACKGROUND_EDGE_DENSITY_OPACITY);
  return Object.freeze({
    connectionId: input.connectionId,
    visualRole: role === "hidden" ? "hidden" : "background",
    opacity,
    width: Math.min(input.width ?? 0.9, 0.9),
    emphasized: false,
    reason: Object.freeze([
      "background edge attenuated for aggregate low-noise density",
    ]),
  });
}

// ─── Observed evidence ──────────────────────────────────────────────────────

export type ObservedExecutiveReadabilityObject = {
  readonly objectId: string;
  readonly role: string;
  readonly focused: boolean;
  readonly targetPosition: readonly [number, number, number];
  readonly scale: number;
  readonly opacity: number;
  readonly emissiveIntensity: number;
  readonly labelProminence: string;
  readonly executiveVisualState?: string;
  readonly stateMarker?: string;
  readonly attention?: string;
};

export type ObservedExecutiveReadabilityEvidence = {
  readonly mode: "overview" | "focus";
  readonly focusedObjectId: string | null;
  readonly camera: {
    readonly position: readonly [number, number, number];
    readonly target: readonly [number, number, number];
    readonly fov: number;
  };
  readonly objects: readonly ObservedExecutiveReadabilityObject[];
  readonly connections: readonly {
    readonly connectionId: string;
    readonly sourceId: string;
    readonly targetId: string;
    readonly emphasized: boolean;
    readonly opacity: number;
    readonly visualRole?: string;
    readonly lineWidth?: number;
  }[];
  readonly contextNodes: readonly {
    readonly contextId: string;
    readonly opacity: number;
    readonly scale: number;
    readonly targetPosition: readonly [number, number, number];
  }[];
};

export function extractObservedExecutiveReadabilityEvidence(presentation: {
  readonly scene: {
    readonly mode: "overview" | "focus";
    readonly focusedObjectId: string | null;
    readonly camera: {
      readonly position: readonly [number, number, number];
      readonly target: readonly [number, number, number];
      readonly fov: number;
    };
    readonly objects: readonly {
      readonly id: string;
      readonly role: string;
      readonly focused: boolean;
      readonly targetPosition: readonly [number, number, number];
      readonly scale: number;
      readonly opacity: number;
      readonly emissiveIntensity: number;
      readonly labelProminence: string;
      readonly executiveVisualState?: string;
      readonly stateMarker?: string;
      readonly attention?: string;
    }[];
    readonly connections: readonly {
      readonly id: string;
      readonly sourceId: string;
      readonly targetId: string;
      readonly emphasized: boolean;
      readonly opacity: number;
      readonly visualRole?: string;
      readonly lineWidth?: number;
    }[];
  };
  readonly contextNodes: readonly {
    readonly id: string;
    readonly opacity: number;
    readonly scale: number;
    readonly targetPosition: readonly [number, number, number];
  }[];
}): ObservedExecutiveReadabilityEvidence {
  return Object.freeze({
    mode: presentation.scene.mode,
    focusedObjectId: presentation.scene.focusedObjectId,
    camera: Object.freeze({
      position: presentation.scene.camera.position,
      target: presentation.scene.camera.target,
      fov: presentation.scene.camera.fov,
    }),
    objects: Object.freeze(
      presentation.scene.objects.map((entry) =>
        Object.freeze({
          objectId: entry.id,
          role: entry.role,
          focused: entry.focused,
          targetPosition: entry.targetPosition,
          scale: entry.scale,
          opacity: entry.opacity,
          emissiveIntensity: entry.emissiveIntensity,
          labelProminence: entry.labelProminence,
          ...(entry.executiveVisualState !== undefined
            ? { executiveVisualState: entry.executiveVisualState }
            : {}),
          ...(entry.stateMarker !== undefined
            ? { stateMarker: entry.stateMarker }
            : {}),
          ...(entry.attention !== undefined
            ? { attention: entry.attention }
            : {}),
        }),
      ),
    ),
    connections: Object.freeze(
      presentation.scene.connections.map((entry) =>
        Object.freeze({
          connectionId: entry.id,
          sourceId: entry.sourceId,
          targetId: entry.targetId,
          emphasized: entry.emphasized,
          opacity: entry.opacity,
          ...(entry.visualRole !== undefined
            ? { visualRole: entry.visualRole }
            : {}),
          ...(entry.lineWidth !== undefined
            ? { lineWidth: entry.lineWidth }
            : {}),
        }),
      ),
    ),
    contextNodes: Object.freeze(
      presentation.contextNodes.map((entry) =>
        Object.freeze({
          contextId: entry.id,
          opacity: entry.opacity,
          scale: entry.scale,
          targetPosition: entry.targetPosition,
        }),
      ),
    ),
  });
}

// ─── Metrics helpers ────────────────────────────────────────────────────────

function xzDistance(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): number {
  return Math.hypot(a[0] - b[0], a[2] - b[2]);
}

function minPairwiseSpacing(
  positions: readonly (readonly [number, number, number])[],
): number | null {
  if (positions.length < 2) return null;
  let min = Number.POSITIVE_INFINITY;
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const d = xzDistance(positions[i]!, positions[j]!);
      if (d < min) min = d;
    }
  }
  return Number.isFinite(min) ? min : null;
}

function cameraDistance(camera: {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
}): number {
  return Math.hypot(
    camera.position[0] - camera.target[0],
    camera.position[1] - camera.target[1],
    camera.position[2] - camera.target[2],
  );
}

function pairMatchesNonEdge(
  sourceId: string,
  targetId: string,
  pairs: readonly { readonly sourceId: string; readonly targetId: string }[],
): boolean {
  return pairs.some(
    (pair) =>
      (pair.sourceId === sourceId && pair.targetId === targetId) ||
      (pair.sourceId === targetId && pair.targetId === sourceId),
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

export type ValidateExecutiveReadabilityInput = {
  readonly scenario: string;
  readonly observed: ObservedExecutiveReadabilityEvidence;
  readonly connectionsContext?: DataRealityAwareConnectionsContextResult;
  readonly canonicalNonEdgePairs?: readonly {
    readonly sourceId: string;
    readonly targetId: string;
  }[];
};

export function validateExecutiveReadability(
  input: ValidateExecutiveReadabilityInput,
): ExecutiveReadabilityValidationResult {
  const nonEdges =
    input.canonicalNonEdgePairs ?? DATA_REALITY_READABILITY_CANONICAL_NON_EDGES;
  const mode = input.observed.mode;
  const anchorObjectId =
    input.observed.focusedObjectId ??
    input.connectionsContext?.anchorObjectId;
  const findings: ExecutiveReadabilityFinding[] = [];

  const labelStates = Object.freeze(
    input.observed.objects.map((object) =>
      resolveDataRealityLabelReadabilityState({
        objectId: object.objectId,
        mode,
        role: object.role,
        focused: object.focused,
        executiveVisualState: object.executiveVisualState,
        stateMarker: object.stateMarker,
        attention: object.attention,
      }),
    ),
  );

  const cameraState = resolveDataRealityCameraReadabilityState(mode);
  const distance = cameraDistance(input.observed.camera);

  const connectionDensityStates = Object.freeze(
    input.observed.connections.map((connection) =>
      resolveDataRealityConnectionDensityState({
        connectionId: connection.connectionId,
        visualRole: connection.visualRole,
        emphasized: connection.emphasized,
        opacity: connection.opacity,
        width: connection.lineWidth,
        mode,
      }),
    ),
  );

  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  for (const object of input.observed.objects) {
    const isCritical =
      object.executiveVisualState === "critical" ||
      object.stateMarker === "critical" ||
      object.attention === "critical";
    if (!isCritical) continue;
    if (
      object.opacity < floors.minOpacity ||
      object.scale < floors.minScale ||
      object.emissiveIntensity < floors.minEmissive
    ) {
      findings.push(
        Object.freeze({
          findingId: `critical-obscured:${object.objectId}`,
          subjectId: object.objectId,
          scenario: input.scenario,
          expectedRole: "critical-discoverable",
          observedPresentation: {
            opacity: object.opacity,
            scale: object.scale,
            emissiveIntensity: object.emissiveIntensity,
          },
          status: "critical-obscured" as const,
          severity: "blocker" as const,
          evidence: Object.freeze([
            `opacity=${object.opacity} scale=${object.scale} emissive=${object.emissiveIntensity}`,
            `floors opacity>=${floors.minOpacity} scale>=${floors.minScale} emissive>=${floors.minEmissive}`,
          ]),
          recommendation:
            "Preserve P2:8.2 critical floors — density must not hide severity",
        }),
      );
    }
  }

  const prominentLabels = input.observed.objects.filter(
    (entry) =>
      entry.labelProminence !== "minimal" && entry.opacity >= 0.4,
  ).length;
  if (
    prominentLabels >= input.observed.objects.length &&
    input.observed.objects.length >= 8
  ) {
    findings.push(
      Object.freeze({
        findingId: "label-conflict:stage-labels",
        subjectId: "stage-labels",
        scenario: input.scenario,
        expectedRole: "priority-label-hierarchy",
        observedPresentation: { prominentLabels },
        status: "label-conflict" as const,
        severity: "high" as const,
        evidence: Object.freeze([
          `prominentLabels=${prominentLabels}`,
          `objectCount=${input.observed.objects.length}`,
        ]),
        recommendation:
          "Apply label priority — demote background normal labels to minimal",
      }),
    );
  }

  const foregroundEdges = input.observed.connections.filter(
    (entry) => entry.emphasized || entry.opacity >= 0.5,
  );
  const backgroundEdges = input.observed.connections.filter(
    (entry) =>
      !entry.emphasized &&
      (entry.visualRole === "background" || entry.opacity < 0.5),
  );
  if (foregroundEdges.length > 6) {
    findings.push(
      Object.freeze({
        findingId: "crowded:emphasized-connections",
        subjectId: "stage-connections",
        scenario: input.scenario,
        expectedRole: "restrained-foreground-edges",
        observedPresentation: { foregroundEdgeCount: foregroundEdges.length },
        status: "crowded" as const,
        severity: "medium" as const,
        evidence: Object.freeze([
          `emphasizedConnections=${foregroundEdges.length}`,
        ]),
        recommendation: "Keep few clear foreground relationships",
      }),
    );
  }

  const noisyBackground = backgroundEdges.filter(
    (entry) => entry.opacity > 0.2,
  );
  if (noisyBackground.length >= 4) {
    findings.push(
      Object.freeze({
        findingId: "connection-noise:background",
        subjectId: "background-edges",
        scenario: input.scenario,
        expectedRole: "subdued-background-edges",
        observedPresentation: {
          noisyBackgroundCount: noisyBackground.length,
        },
        status: "connection-noise" as const,
        severity: "medium" as const,
        evidence: Object.freeze([
          `backgroundEdgesAbove0.2=${noisyBackground.length}`,
        ]),
        recommendation: "Attenuate aggregate background edge opacity",
      }),
    );
  }

  if (distance > DATA_REALITY_CAMERA_DISTANCE_BOUNDS.maxUseful) {
    findings.push(
      Object.freeze({
        findingId: "camera-too-far:stage-camera",
        subjectId: "stage-camera",
        scenario: input.scenario,
        expectedRole: "readable-camera-distance",
        observedPresentation: { distance },
        status: "camera-too-far" as const,
        severity: "medium" as const,
        evidence: Object.freeze([`distance=${distance.toFixed(2)}`]),
        recommendation: "Bring overview/focus camera into useful mid-band",
      }),
    );
  } else if (
    mode === "focus" &&
    distance < DATA_REALITY_CAMERA_DISTANCE_BOUNDS.minFocus
  ) {
    findings.push(
      Object.freeze({
        findingId: "camera-too-near:stage-camera",
        subjectId: "stage-camera",
        scenario: input.scenario,
        expectedRole: "readable-camera-distance",
        observedPresentation: { distance },
        status: "camera-too-near" as const,
        severity: "medium" as const,
        evidence: Object.freeze([`distance=${distance.toFixed(2)}`]),
        recommendation: "Pull focus camera back to avoid clipping context",
      }),
    );
  }

  if (mode === "focus" && anchorObjectId) {
    const anchor = input.observed.objects.find(
      (entry) => entry.objectId === anchorObjectId,
    );
    if (anchor) {
      const radial = Math.hypot(
        anchor.targetPosition[0],
        anchor.targetPosition[2],
      );
      if (radial > 0.45 || anchor.targetPosition[1] < 0.25) {
        findings.push(
          Object.freeze({
            findingId: `anchor-clipped:${anchorObjectId}`,
            subjectId: anchorObjectId,
            scenario: input.scenario,
            expectedRole: "anchor-in-frame",
            observedPresentation: {
              targetPosition: anchor.targetPosition,
              radial,
            },
            status: "anchor-clipped" as const,
            severity: "high" as const,
            evidence: Object.freeze([
              `radial=${radial.toFixed(2)}`,
              `y=${anchor.targetPosition[1]}`,
            ]),
            recommendation: "Keep anchor spatially owned near frame center",
          }),
        );
      }
    }
  }

  const visibleContext = input.observed.contextNodes.filter(
    (entry) => entry.opacity >= 0.5,
  );
  if (visibleContext.length > 6) {
    findings.push(
      Object.freeze({
        findingId: "context-crowded:context-nodes",
        subjectId: "context-nodes",
        scenario: input.scenario,
        expectedRole: "1-hop-subordinate-context",
        observedPresentation: { visibleContextCount: visibleContext.length },
        status: "context-crowded" as const,
        severity: "medium" as const,
        evidence: Object.freeze([
          `visibleContext=${visibleContext.length}`,
          `revealDepthHops=1`,
        ]),
        recommendation: "Respect P2:7 density boundary / hidden overflow",
      }),
    );
  }

  let nonEdgesPreserved = true;
  for (const connection of input.observed.connections) {
    if (
      pairMatchesNonEdge(
        connection.sourceId,
        connection.targetId,
        nonEdges,
      )
    ) {
      nonEdgesPreserved = false;
      findings.push(
        Object.freeze({
          findingId: `false-relationship:${connection.connectionId}`,
          subjectId: connection.connectionId,
          scenario: input.scenario,
          expectedRole: "canonical-non-edge",
          observedPresentation: connection,
          status: "crowded" as const,
          severity: "blocker" as const,
          evidence: Object.freeze([
            "Revenue ↔ Capacity must remain a non-edge",
          ]),
          recommendation: "Never invent edges for density or severity",
        }),
      );
    }
  }

  if (findings.length === 0) {
    findings.push(
      Object.freeze({
        findingId: `readable:${mode}`,
        subjectId: "stage-readability",
        scenario: input.scenario,
        expectedRole: "executive-glanceable",
        observedPresentation: {
          mode,
          objectCount: input.observed.objects.length,
          distance,
        },
        status: "readable" as const,
        severity: "low" as const,
        evidence: Object.freeze([
          "Structural density/camera/label proxies within validated bounds",
          "Human glanceability still requires ManualVisualValidationRequired",
        ]),
      }),
    );
  }

  const count = (status: ExecutiveReadabilityStatus) =>
    findings.filter((entry) => entry.status === status).length;

  const positions = input.observed.objects.map(
    (entry) => entry.targetPosition,
  );
  const anchor = anchorObjectId
    ? input.observed.objects.find((entry) => entry.objectId === anchorObjectId)
    : undefined;
  const related = input.observed.objects.filter(
    (entry) => entry.role === "related",
  );
  const competing = input.observed.objects.filter(
    (entry) =>
      entry.role === "unrelated" &&
      (entry.executiveVisualState === "critical" ||
        entry.stateMarker === "critical"),
  );

  let minAnchorContext: number | null = null;
  if (anchor && related.length > 0) {
    minAnchorContext = Math.min(
      ...related.map((entry) =>
        xzDistance(anchor.targetPosition, entry.targetPosition),
      ),
    );
  }

  let minContextCompeting: number | null = null;
  if (related.length > 0 && competing.length > 0) {
    let min = Number.POSITIVE_INFINITY;
    for (const rel of related) {
      for (const comp of competing) {
        const d = xzDistance(rel.targetPosition, comp.targetPosition);
        if (d < min) min = d;
      }
    }
    minContextCompeting = Number.isFinite(min) ? min : null;
  }

  const metrics: ExecutiveReadabilityMetrics = Object.freeze({
    objectCount: input.observed.objects.length,
    persistentLabelCount: labelStates.filter(
      (entry) => entry.priority === "critical-persistent",
    ).length,
    elevatedLabelCount: labelStates.filter(
      (entry) =>
        entry.prominence === "full" || entry.prominence === "reduced",
    ).length,
    minimalLabelCount: labelStates.filter(
      (entry) => entry.prominence === "minimal",
    ).length,
    visibleContextCount: visibleContext.length,
    foregroundEdgeCount: foregroundEdges.length,
    backgroundEdgeCount: backgroundEdges.length,
    minObjectSpacing: minPairwiseSpacing(positions),
    minAnchorContextSpacing: minAnchorContext,
    minContextCompetingSeparation: minContextCompeting,
    cameraDistance: distance,
    cameraMode: mode,
    revealDepthHops: 1 as const,
  });

  const sortedFindings = Object.freeze(
    [...findings].sort((a, b) => a.findingId.localeCompare(b.findingId)),
  );

  return Object.freeze({
    validationId: `p2-8.5:${input.scenario}:${mode}:${anchorObjectId ?? "overview"}`,
    identity: IDENTITY,
    scenario: input.scenario,
    mode,
    ...(anchorObjectId !== undefined && anchorObjectId !== null
      ? { anchorObjectId }
      : {}),
    findings: sortedFindings,
    summary: Object.freeze({
      totalFindings: sortedFindings.length,
      readableCount: count("readable"),
      crowdedCount: count("crowded"),
      labelConflictCount: count("label-conflict"),
      cameraTooNearCount: count("camera-too-near"),
      cameraTooFarCount: count("camera-too-far"),
      anchorClippedCount: count("anchor-clipped"),
      contextCrowdedCount: count("context-crowded"),
      connectionNoiseCount: count("connection-noise"),
      criticalObscuredCount: count("critical-obscured"),
      nonEdgesPreserved,
      revealDepthHops: 1 as const,
    }),
    metrics,
    labelStates,
    cameraState,
    connectionDensityStates,
    provenance: Object.freeze({
      validationIdentity:
        dataRealityDensityCameraExecutiveReadabilityValidationIdentity,
      validationVersion:
        dataRealityDensityCameraExecutiveReadabilityValidationVersion,
      validationNamespace:
        dataRealityDensityCameraExecutiveReadabilityValidationNamespace,
      validationPhase:
        dataRealityDensityCameraExecutiveReadabilityValidationPhase,
      validationCertified: false as const,
      chain: DATA_REALITY_DENSITY_CAMERA_EXECUTIVE_READABILITY_PROVENANCE_CHAIN,
      auditSource: dataRealityVisualStageAuditIdentity,
      auditVersion: dataRealityVisualStageAuditVersion,
      auditNamespace: dataRealityVisualStageAuditNamespace,
      objectVisualSource: dataRealityObjectStateVisualValidationIdentity,
      objectVisualVersion: dataRealityObjectStateVisualValidationVersion,
      objectVisualNamespace: dataRealityObjectStateVisualValidationNamespace,
      focusValidationSource:
        dataRealityFocusSceneChoreographyValidationIdentity,
      focusValidationVersion:
        dataRealityFocusSceneChoreographyValidationVersion,
      focusValidationNamespace:
        dataRealityFocusSceneChoreographyValidationNamespace,
      connectionsVisualSource:
        dataRealityConnectionsContextVisualValidationIdentity,
      connectionsVisualVersion:
        dataRealityConnectionsContextVisualValidationVersion,
      connectionsVisualNamespace:
        dataRealityConnectionsContextVisualValidationNamespace,
      connectionsContextSource: dataRealityAwareConnectionsContextIdentity,
      connectionsContextVersion: dataRealityAwareConnectionsContextVersion,
      connectionsContextNamespace:
        dataRealityAwareConnectionsContextNamespace,
    }),
  });
}
