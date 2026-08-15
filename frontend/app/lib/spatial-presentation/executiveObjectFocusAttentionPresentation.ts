/**
 * SP:2.6 — Focus & Attention Object Presentation.
 *
 * Presentation-composition layer that integrates spatial role, severity,
 * recommendation, interaction, and occlusion into one bounded emphasis
 * hierarchy. Answers: “What am I looking at, what is related, what else
 * needs attention?”
 *
 * Does NOT own focus truth, severity truth, relationships, camera, or
 * geometry. SP:2.1 remains final visual authority.
 *
 * Pipeline:
 *   Canonical Focus / Attention / State
 *     → SP:1 Spatial Role + SP:2 Visual Channels
 *       → Focus & Attention Presentation Resolver (this module)
 *         → SP:2.1 Canonical Visual Presentation
 *           → Stage Renderer
 */

import type { ExecutiveInformationDensityLevel } from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY,
  EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS,
  composeExecutiveObjectStateVisualClass,
  type ExecutiveObjectStateMarker,
  type ExecutiveObjectStateVisualClass,
} from "./executiveObjectStateVisualHierarchy.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectFocusAttentionPresentationIdentity =
  "SP:2.6/ExecutiveObjectFocusAttentionPresentation" as const;

export const executiveObjectFocusAttentionPresentationVersion =
  "2.6.0" as const;

export const executiveObjectFocusAttentionPresentationNamespace =
  "nexora.spatial-presentation.executive-object-focus-attention-presentation" as const;

export const executiveObjectFocusAttentionPresentationPhase =
  "FocusAndAttentionObjectPresentation" as const;

export const executiveObjectFocusAttentionPresentationArchitecturalRole =
  "PresentationOnlyExecutiveFocusAttentionComposition" as const;

export const executiveObjectFocusAttentionPresentationReadiness =
  "AwaitingHumanVisualSignOff" as const;

const UPSTREAM_VISUAL_FOUNDATION_IDENTITY =
  "SP:2.1/ExecutiveObjectVisualFoundation" as const;
const UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY =
  "SP:2.2/ExecutiveObjectGeometryLanguage" as const;
const UPSTREAM_MATERIAL_SURFACE_IDENTITY =
  "SP:2.3/ExecutiveObjectMaterialSurface" as const;
const UPSTREAM_STATE_VISUAL_IDENTITY =
  "SP:2.4/ExecutiveObjectStateVisualHierarchy" as const;
const UPSTREAM_LABEL_DENSITY_IDENTITY =
  "SP:2.5/ExecutiveObjectLabelInformationDensity" as const;

export type ExecutiveObjectFocusAttentionPresentationIdentity = {
  readonly id: typeof executiveObjectFocusAttentionPresentationIdentity;
  readonly version: typeof executiveObjectFocusAttentionPresentationVersion;
  readonly namespace: typeof executiveObjectFocusAttentionPresentationNamespace;
  readonly phase: typeof executiveObjectFocusAttentionPresentationPhase;
  readonly architecturalRole: typeof executiveObjectFocusAttentionPresentationArchitecturalRole;
  readonly upstreamVisualFoundation: typeof UPSTREAM_VISUAL_FOUNDATION_IDENTITY;
  readonly upstreamGeometryLanguage: typeof UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY;
  readonly upstreamMaterialSurface: typeof UPSTREAM_MATERIAL_SURFACE_IDENTITY;
  readonly upstreamStateVisualHierarchy: typeof UPSTREAM_STATE_VISUAL_IDENTITY;
  readonly upstreamLabelInformationDensity: typeof UPSTREAM_LABEL_DENSITY_IDENTITY;
};

const FOCUS_ATTENTION_IDENTITY: ExecutiveObjectFocusAttentionPresentationIdentity =
  Object.freeze({
    id: executiveObjectFocusAttentionPresentationIdentity,
    version: executiveObjectFocusAttentionPresentationVersion,
    namespace: executiveObjectFocusAttentionPresentationNamespace,
    phase: executiveObjectFocusAttentionPresentationPhase,
    architecturalRole:
      executiveObjectFocusAttentionPresentationArchitecturalRole,
    upstreamVisualFoundation: UPSTREAM_VISUAL_FOUNDATION_IDENTITY,
    upstreamGeometryLanguage: UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY,
    upstreamMaterialSurface: UPSTREAM_MATERIAL_SURFACE_IDENTITY,
    upstreamStateVisualHierarchy: UPSTREAM_STATE_VISUAL_IDENTITY,
    upstreamLabelInformationDensity: UPSTREAM_LABEL_DENSITY_IDENTITY,
  });

export function getExecutiveObjectFocusAttentionPresentationIdentity(): ExecutiveObjectFocusAttentionPresentationIdentity {
  return FOCUS_ATTENTION_IDENTITY;
}

export const EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      executiveObjectFocusAttentionPresentationArchitecturalRole,
    ownsBusinessTruth: false as const,
    ownsKpiComputation: false as const,
    ownsSeverityTruth: false as const,
    ownsAttentionTruth: false as const,
    ownsRecommendationTruth: false as const,
    ownsFocusTruth: false as const,
    ownsRelationships: false as const,
    inventsRelationships: false as const,
    ownsSpatialPosition: false as const,
    ownsCamera: false as const,
    autoFocusesCritical: false as const,
    movesAttentionObjects: false as const,
    createsLocalFocusState: false as const,
    reinterpretsBusinessRanking: false as const,
    replacesVisualFoundationAuthority: false as const,
    replacesStateVisualAuthority: false as const,
    replacesLabelDensityAuthority: false as const,
    replacesMaterialSurfaceAuthority: false as const,
    introducesPulsing: false as const,
    introducesBlinking: false as const,
    startsCertificationFreeze: false as const,
    frameworkIndependentResolver: true as const,
    presentationOnly: true as const,
  });

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveObjectFocusAttentionSpatialRole =
  | "focus"
  | "related"
  | "background"
  | "overview";

export type ExecutiveObjectFocusAttentionOcclusion =
  | "clear"
  | "partial"
  | "substantial";

export type ExecutiveObjectFocusAttentionEdgeMode =
  | "none"
  | "state"
  | "interaction"
  | "composed";

export type ExecutiveObjectFocusAttentionInput = {
  readonly objectId: string;
  readonly spatialRole: ExecutiveObjectFocusAttentionSpatialRole;
  readonly status?: string;
  readonly attention?: string;
  readonly recommended?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
  readonly focused?: boolean;
  readonly occlusionState?: ExecutiveObjectFocusAttentionOcclusion;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  readonly rimIntensity?: number;
  /** SP:2.4 outputs — consumed, not redefined. */
  readonly statusClass?: ExecutiveObjectStateVisualClass;
  readonly stateVisualEnergy?: number;
  readonly stateProminenceRank?: number;
  readonly marker?: ExecutiveObjectStateMarker;
  readonly markerIntensity?: number;
  readonly recommendationCue?: boolean;
  readonly stateEdgeOpacity?: number;
  /** SP:2.5 outputs — consumed, not redefined. */
  readonly labelLevel?: ExecutiveInformationDensityLevel;
  readonly labelPriorityRank?: number;
  /** Optional material presence hints from SP:2.3 (opacity/emissive already resolved). */
  readonly materialOpacity?: number;
  readonly materialEmissiveIntensity?: number;
  readonly stageOrder?: number;
};

export type ExecutiveObjectFocusAttentionPresentation = {
  readonly objectId: string;
  readonly role: ExecutiveObjectFocusAttentionSpatialRole;
  readonly statusClass: ExecutiveObjectStateVisualClass;
  readonly emphasisRank: number;
  readonly surfaceEmphasis: number;
  readonly edgeEmphasis: number;
  readonly labelEmphasis: number;
  readonly markerEmphasis: number;
  readonly opacityFloor: number;
  readonly emissiveLift: number;
  readonly visualEnergy: number;
  readonly attentionRimIntensity: number;
  readonly showFocusPedestal: boolean;
  readonly suppressInteractionNoise: boolean;
  readonly primaryMarker: ExecutiveObjectStateMarker;
  readonly recommendationCue: boolean;
  readonly edgeMode: ExecutiveObjectFocusAttentionEdgeMode;
  readonly edgeOpacity: number;
  readonly preferStateEdge: boolean;
  readonly channelAllocation: Readonly<{
    readonly focus: "spatialOwnershipAndLabel";
    readonly critical: "edgeStateTintMarker";
    readonly recommendation: "smallCue";
    readonly hover: "temporaryEdgeLift";
    readonly selection: "interactionRim";
    readonly occlusion: "readabilityFloor";
  }>;
};

// ─── Bounds / channel policy ────────────────────────────────────────────────

export const EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS = Object.freeze({
  maximumVisualEnergy: EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumVisualEnergy,
  maximumEmissiveLift: 0.18,
  maximumEdgeOpacity: EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumEdgeOpacity,
  maximumSurfaceEmphasis: 1,
  maximumEdgeEmphasis: 1,
  maximumLabelEmphasis: 1,
  maximumMarkerEmphasis: 1,
  maximumEmphasisRank: 200,
});

export const EXECUTIVE_OBJECT_FOCUS_ATTENTION_VISUAL_PRIORITY = Object.freeze([
  "focusedObject",
  "relatedHighAttention",
  "criticalCompetingBackground",
  "otherRelatedContext",
  "watchOrRecommendedBackground",
  "normalBackground",
] as const);

export const EXECUTIVE_OBJECT_FOCUS_ATTENTION_CHANNEL_ALLOCATION =
  Object.freeze({
    focus: "spatialOwnershipAndLabel" as const,
    critical: "edgeStateTintMarker" as const,
    recommendation: "smallCue" as const,
    hover: "temporaryEdgeLift" as const,
    selection: "interactionRim" as const,
    occlusion: "readabilityFloor" as const,
  });

export const EXECUTIVE_OBJECT_FOCUS_ATTENTION_COMPOSITION_ORDER = Object.freeze([
  "spatialRole",
  "canonicalState",
  "recommendation",
  "interaction",
  "occlusion",
  "energyClamp",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

function labelLevelRank(level: ExecutiveInformationDensityLevel | undefined): number {
  switch (level) {
    case "detail":
      return 1;
    case "summary":
      return 0.66;
    case "identity":
      return 0.33;
    default:
      return 0.4;
  }
}

/**
 * Deterministic presentation emphasis rank — presentation conflict resolution only.
 * Does not rewrite business priority.
 */
export function resolveExecutiveObjectFocusAttentionEmphasisRank(input: {
  readonly spatialRole: ExecutiveObjectFocusAttentionSpatialRole;
  readonly focused?: boolean;
  readonly statusClass: ExecutiveObjectStateVisualClass;
  readonly recommended?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
  readonly occlusionState?: ExecutiveObjectFocusAttentionOcclusion;
}): number {
  const focused = input.focused === true || input.spatialRole === "focus";
  let rank = 20;
  if (focused) rank += 100;
  if (input.spatialRole === "related") rank += 24;
  if (input.statusClass === "critical") {
    rank += input.spatialRole === "related" ? 36 : 42;
  } else if (input.statusClass === "watch") {
    rank += input.spatialRole === "related" ? 18 : 22;
  } else if (input.statusClass === "unresolved") {
    rank += 14;
  }
  if (input.recommended === true) rank += 12;
  if (input.selected === true && !focused) rank += 8;
  if (input.hovered === true && !focused) rank += 6;
  if (input.spatialRole === "background") rank -= 6;
  if (input.occlusionState === "substantial") rank += 4;
  else if (input.occlusionState === "partial") rank += 2;
  return clamp(
    rank,
    0,
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumEmphasisRank,
  );
}

/**
 * Pure focus/attention presentation composer.
 * Consumes SP:2.4 / SP:2.5 outputs; does not mutate input or invent focus/edges.
 */
export function resolveExecutiveObjectFocusAttentionPresentation(
  input: ExecutiveObjectFocusAttentionInput,
): ExecutiveObjectFocusAttentionPresentation {
  const objectId =
    typeof input.objectId === "string" && input.objectId.length > 0
      ? input.objectId
      : "unknown";
  const spatialRole = input.spatialRole ?? "overview";
  const focused = input.focused === true || spatialRole === "focus";
  const hovered = input.hovered === true;
  const selected = input.selected === true;
  const recommended =
    input.recommended === true || input.recommendationCue === true;
  const occlusion = input.occlusionState ?? "clear";
  const statusClass =
    input.statusClass ??
    composeExecutiveObjectStateVisualClass({
      status: input.status,
      attention: input.attention,
      stateMarker: input.stateMarker,
    });
  const marker: ExecutiveObjectStateMarker =
    input.marker ??
    (statusClass === "critical"
      ? "critical"
      : statusClass === "watch"
        ? "attention"
        : statusClass === "unresolved"
          ? "unresolved"
          : recommended
            ? "recommended"
            : "none");
  const markerIntensity =
    typeof input.markerIntensity === "number" &&
    Number.isFinite(input.markerIntensity)
      ? clamp(input.markerIntensity, 0, 1)
      : marker === "none"
        ? 0
        : 0.32;
  const stateEdgeOpacity =
    typeof input.stateEdgeOpacity === "number" &&
    Number.isFinite(input.stateEdgeOpacity)
      ? clamp(input.stateEdgeOpacity, 0, 1)
      : 0;
  const stateEnergy =
    typeof input.stateVisualEnergy === "number" &&
    Number.isFinite(input.stateVisualEnergy)
      ? input.stateVisualEnergy
      : 0.08;
  const bounds = EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS;
  const opacityPolicy = EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY;

  const emphasisRank = resolveExecutiveObjectFocusAttentionEmphasisRank({
    spatialRole,
    focused,
    statusClass,
    recommended,
    selected,
    hovered,
    occlusionState: occlusion,
  });

  // Channel allocation — prevent every channel from maxing simultaneously.
  let surfaceEmphasis = 0.28;
  let edgeEmphasis = 0.12;
  let labelEmphasis = labelLevelRank(input.labelLevel);
  let markerEmphasis = marker === "none" ? 0 : markerIntensity * 0.55;
  let emissiveLift = 0;
  let edgeOpacity = stateEdgeOpacity;
  let preferStateEdge = stateEdgeOpacity > 0.01;
  let edgeMode: ExecutiveObjectFocusAttentionEdgeMode =
    preferStateEdge ? "state" : "none";

  if (focused) {
    // Focus owns spatial ownership + label; not automatic severity color.
    surfaceEmphasis = statusClass === "critical" ? 0.72 : 0.78;
    labelEmphasis = Math.max(labelEmphasis, 1);
    emissiveLift += statusClass === "critical" ? 0.06 : 0.08;
    if (statusClass === "critical" || statusClass === "watch") {
      edgeEmphasis = Math.max(edgeEmphasis, 0.7);
      preferStateEdge = true;
      edgeMode = "composed";
      edgeOpacity = Math.max(edgeOpacity, statusClass === "critical" ? 0.48 : 0.32);
    } else if (statusClass === "unresolved") {
      edgeEmphasis = Math.max(edgeEmphasis, 0.42);
      preferStateEdge = true;
      edgeMode = "composed";
      edgeOpacity = Math.max(edgeOpacity, 0.28);
    } else {
      // Focused normal — pedestal owns focus; no risk-looking edge.
      edgeEmphasis = Math.max(edgeEmphasis, 0.2);
      preferStateEdge = false;
      edgeMode = "none";
      edgeOpacity = 0;
    }
  } else if (spatialRole === "related") {
    surfaceEmphasis = 0.52;
    labelEmphasis = Math.max(labelEmphasis, 0.55);
    if (statusClass === "critical") {
      surfaceEmphasis = 0.64;
      edgeEmphasis = 0.72;
      markerEmphasis = Math.max(markerEmphasis, 0.55);
      emissiveLift += 0.08;
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.46);
    } else if (statusClass === "watch") {
      surfaceEmphasis = 0.58;
      edgeEmphasis = 0.48;
      markerEmphasis = Math.max(markerEmphasis, 0.36);
      emissiveLift += 0.04;
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.3);
    } else if (recommended) {
      edgeEmphasis = Math.max(edgeEmphasis, 0.34);
      markerEmphasis = Math.max(markerEmphasis, 0.28);
    }
  } else if (spatialRole === "background") {
    surfaceEmphasis = 0.22;
    labelEmphasis = Math.min(labelEmphasis, 0.4);
    if (statusClass === "critical") {
      // Critical background hard floor — discoverable, not focus.
      surfaceEmphasis = 0.48;
      edgeEmphasis = 0.78;
      labelEmphasis = Math.max(labelEmphasis, 0.55);
      markerEmphasis = Math.max(markerEmphasis, 0.55);
      emissiveLift += 0.08;
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.48);
    } else if (statusClass === "watch") {
      surfaceEmphasis = 0.34;
      edgeEmphasis = 0.46;
      labelEmphasis = Math.max(labelEmphasis, 0.42);
      markerEmphasis = Math.max(markerEmphasis, 0.32);
      emissiveLift += 0.03;
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.3);
    } else if (statusClass === "unresolved") {
      surfaceEmphasis = 0.3;
      edgeEmphasis = 0.36;
      labelEmphasis = Math.max(labelEmphasis, 0.4);
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.26);
    } else if (recommended) {
      surfaceEmphasis = 0.28;
      edgeEmphasis = 0.3;
      labelEmphasis = Math.max(labelEmphasis, 0.36);
      markerEmphasis = Math.max(markerEmphasis, 0.26);
    }
  } else {
    // overview
    surfaceEmphasis = 0.4;
    if (statusClass === "critical") {
      edgeEmphasis = 0.7;
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.46);
      emissiveLift += 0.07;
    } else if (statusClass === "watch") {
      edgeEmphasis = 0.42;
      preferStateEdge = true;
      edgeMode = "state";
      edgeOpacity = Math.max(edgeOpacity, 0.3);
    }
  }

  // Interaction — temporary clarity without role promotion.
  // Compose into one rim when state edge already owns the channel.
  let suppressInteractionNoise = false;
  if (hovered && !focused) {
    if (preferStateEdge || edgeMode === "state" || edgeMode === "composed") {
      edgeOpacity = Math.min(bounds.maximumEdgeOpacity, edgeOpacity + 0.06);
      edgeEmphasis = Math.min(1, edgeEmphasis + 0.08);
      edgeMode = preferStateEdge ? "composed" : "interaction";
      suppressInteractionNoise = true;
    } else {
      edgeMode = "interaction";
      edgeEmphasis = Math.max(edgeEmphasis, 0.4);
      edgeOpacity = Math.max(edgeOpacity, 0.34);
    }
    emissiveLift += 0.03;
    labelEmphasis = Math.min(1, labelEmphasis + 0.12);
  } else if (hovered && focused && preferStateEdge) {
    // Focused + hovered + state: one composed rim, no stacked interaction edge.
    edgeOpacity = Math.min(bounds.maximumEdgeOpacity, edgeOpacity + 0.04);
    edgeMode = "composed";
    suppressInteractionNoise = true;
    emissiveLift += 0.02;
  }

  if (selected && !focused) {
    if (preferStateEdge || edgeMode === "state" || edgeMode === "composed") {
      edgeOpacity = Math.min(bounds.maximumEdgeOpacity, edgeOpacity + 0.04);
      edgeMode = "composed";
      suppressInteractionNoise = true;
    } else if (edgeMode === "none") {
      edgeMode = "interaction";
      edgeOpacity = Math.max(edgeOpacity, 0.32);
      edgeEmphasis = Math.max(edgeEmphasis, 0.36);
    }
  } else if (selected && focused && preferStateEdge) {
    edgeMode = "composed";
    suppressInteractionNoise = true;
  }

  // Focused critical/watch already allocates state edge — suppress dual rims.
  if (focused && preferStateEdge && (hovered || selected || recommended)) {
    suppressInteractionNoise = true;
    edgeMode = "composed";
  }

  // Occlusion readability floors — not X-ray.
  if (occlusion !== "clear") {
    if (
      statusClass === "critical" ||
      statusClass === "watch" ||
      statusClass === "unresolved" ||
      focused ||
      spatialRole === "related"
    ) {
      labelEmphasis = Math.max(labelEmphasis, spatialRole === "related" ? 0.55 : 0.45);
      edgeEmphasis = Math.max(edgeEmphasis, 0.36);
      if (preferStateEdge) {
        edgeOpacity = Math.max(
          edgeOpacity,
          occlusion === "substantial" ? 0.3 : 0.24,
        );
      }
    }
  }

  // Opacity floors by role + state (reuse SP:2.4 background floors).
  let opacityFloor = 0.28;
  if (focused) {
    opacityFloor = 0.96;
  } else if (spatialRole === "related") {
    opacityFloor =
      statusClass === "critical"
        ? 0.72
        : statusClass === "watch"
          ? 0.62
          : 0.55;
  } else if (spatialRole === "background") {
    opacityFloor =
      statusClass === "critical"
        ? opacityPolicy.criticalFloor
        : statusClass === "watch"
          ? opacityPolicy.watchFloor
          : statusClass === "unresolved"
            ? opacityPolicy.unresolvedFloor
            : opacityPolicy.normalFloor;
  } else {
    opacityFloor =
      statusClass === "critical"
        ? 0.62
        : statusClass === "watch"
          ? 0.5
          : 0.34;
  }

  // Visual energy — state energy + role/interaction, then clamp.
  let visualEnergy = stateEnergy;
  if (focused) visualEnergy += 0.16;
  else if (spatialRole === "related") visualEnergy += 0.08;
  if (statusClass === "critical" && spatialRole === "background") {
    visualEnergy += 0.1;
  }
  if (recommended) visualEnergy += 0.05;
  if (hovered && !focused) visualEnergy += 0.04;
  if (selected && !focused) visualEnergy += 0.03;
  if (occlusion !== "clear") visualEnergy += 0.02;

  // Priority-based channel allocation clamp — no simultaneous max.
  if (focused && statusClass === "critical") {
    // Split channels: focus → label/surface; critical → edge/marker.
    surfaceEmphasis = Math.min(surfaceEmphasis, 0.82);
    edgeEmphasis = Math.min(edgeEmphasis, 0.88);
    emissiveLift = Math.min(emissiveLift, 0.14);
  } else if (focused && statusClass === "normal") {
    // Focused normal must not look critical.
    edgeEmphasis = Math.min(edgeEmphasis, 0.28);
    markerEmphasis = 0;
    emissiveLift = Math.min(emissiveLift, 0.1);
  }

  visualEnergy = stabilize(clamp(visualEnergy, 0, bounds.maximumVisualEnergy));
  surfaceEmphasis = stabilize(clamp(surfaceEmphasis, 0, bounds.maximumSurfaceEmphasis));
  edgeEmphasis = stabilize(clamp(edgeEmphasis, 0, bounds.maximumEdgeEmphasis));
  labelEmphasis = stabilize(clamp(labelEmphasis, 0, bounds.maximumLabelEmphasis));
  markerEmphasis = stabilize(clamp(markerEmphasis, 0, bounds.maximumMarkerEmphasis));
  emissiveLift = stabilize(clamp(emissiveLift, 0, bounds.maximumEmissiveLift));
  edgeOpacity = stabilize(clamp(edgeOpacity, 0, bounds.maximumEdgeOpacity));

  const rim =
    typeof input.rimIntensity === "number" && Number.isFinite(input.rimIntensity)
      ? clamp(input.rimIntensity, 0, 1)
      : markerEmphasis;
  const attentionRimIntensity = stabilize(
    marker === "none" && !preferStateEdge
      ? 0
      : Math.max(markerEmphasis, rim * 0.85, edgeOpacity > 0 ? edgeOpacity * 0.7 : 0),
  );

  // One primary marker — recommendation stays cue when severity owns marker.
  const primaryMarker: ExecutiveObjectStateMarker =
    statusClass === "critical"
      ? "critical"
      : statusClass === "watch"
        ? "attention"
        : statusClass === "unresolved"
          ? "unresolved"
          : recommended
            ? "recommended"
            : "none";

  return Object.freeze({
    objectId,
    role: spatialRole,
    statusClass,
    emphasisRank: stabilize(emphasisRank),
    surfaceEmphasis,
    edgeEmphasis,
    labelEmphasis,
    markerEmphasis,
    opacityFloor: stabilize(opacityFloor),
    emissiveLift,
    visualEnergy,
    attentionRimIntensity,
    showFocusPedestal: focused,
    suppressInteractionNoise,
    primaryMarker,
    recommendationCue: recommended,
    edgeMode,
    edgeOpacity,
    preferStateEdge,
    channelAllocation: EXECUTIVE_OBJECT_FOCUS_ATTENTION_CHANNEL_ALLOCATION,
  });
}

export function verifyExecutiveObjectFocusAttentionPresentation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly focusedNormalDistinct: boolean;
  readonly criticalBackgroundDiscoverable: boolean;
  readonly signalStackingBounded: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveObjectFocusAttentionPresentationIdentity();
  const identityValid =
    identity.id === "SP:2.6/ExecutiveObjectFocusAttentionPresentation" &&
    identity.version === "2.6.0" &&
    identity.upstreamVisualFoundation ===
      "SP:2.1/ExecutiveObjectVisualFoundation" &&
    identity.upstreamStateVisualHierarchy ===
      "SP:2.4/ExecutiveObjectStateVisualHierarchy" &&
    identity.upstreamLabelInformationDensity ===
      "SP:2.5/ExecutiveObjectLabelInformationDensity";

  const boundaryValid =
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.ownsFocusTruth ===
      false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY
      .inventsRelationships === false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.ownsCamera ===
      false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY
      .autoFocusesCritical === false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY
      .replacesVisualFoundationAuthority === false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY
      .startsCertificationFreeze === false;

  const sample = Object.freeze({
    objectId: "obj-a",
    spatialRole: "background" as const,
    status: "risk",
    attention: "critical",
    statusClass: "critical" as const,
    stateVisualEnergy: 0.55,
    stateEdgeOpacity: 0.48,
    marker: "critical" as const,
    labelLevel: "identity" as const,
  });
  const a = resolveExecutiveObjectFocusAttentionPresentation(sample);
  const b = resolveExecutiveObjectFocusAttentionPresentation(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const focusedNormal = resolveExecutiveObjectFocusAttentionPresentation({
    objectId: "focus-normal",
    spatialRole: "focus",
    focused: true,
    status: "stable",
    statusClass: "normal",
    labelLevel: "detail",
  });
  const focusedNormalDistinct =
    focusedNormal.showFocusPedestal === true &&
    focusedNormal.statusClass === "normal" &&
    focusedNormal.preferStateEdge === false &&
    focusedNormal.primaryMarker === "none";

  const criticalBackground =
    resolveExecutiveObjectFocusAttentionPresentation({
      objectId: "capacity",
      spatialRole: "background",
      status: "risk",
      attention: "critical",
      statusClass: "critical",
      stateEdgeOpacity: 0.48,
      marker: "critical",
      labelLevel: "identity",
    });
  const criticalBackgroundDiscoverable =
    criticalBackground.role === "background" &&
    criticalBackground.showFocusPedestal === false &&
    criticalBackground.primaryMarker === "critical" &&
    criticalBackground.opacityFloor >=
      EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY.criticalFloor &&
    criticalBackground.edgeOpacity > 0;

  const stacked = resolveExecutiveObjectFocusAttentionPresentation({
    objectId: "stacked",
    spatialRole: "focus",
    focused: true,
    selected: true,
    hovered: true,
    recommended: true,
    status: "risk",
    attention: "critical",
    statusClass: "critical",
    stateVisualEnergy: 0.7,
    stateEdgeOpacity: 0.5,
    marker: "critical",
    markerIntensity: 0.8,
    labelLevel: "detail",
    occlusionState: "partial",
  });
  const signalStackingBounded =
    stacked.visualEnergy <=
      EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumVisualEnergy &&
    stacked.emissiveLift <=
      EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumEmissiveLift &&
    stacked.edgeOpacity <=
      EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumEdgeOpacity &&
    stacked.primaryMarker === "critical" &&
    stacked.recommendationCue === true &&
    stacked.suppressInteractionNoise === true;

  const presentationOnly =
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.presentationOnly ===
    true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    focusedNormalDistinct &&
    criticalBackgroundDiscoverable &&
    signalStackingBounded &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    focusedNormalDistinct,
    criticalBackgroundDiscoverable,
    signalStackingBounded,
    presentationOnly,
  });
}
