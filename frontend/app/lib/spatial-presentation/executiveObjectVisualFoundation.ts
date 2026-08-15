/**
 * SP:2.1 — Executive Object Visual Foundation.
 *
 * Canonical presentation architecture for Nexora Stage objects.
 * Framework-independent: resolves visual presentation contracts that R3F
 * consumes. Never owns position, camera, business truth, or relationships.
 *
 * Dependency direction (required):
 *   Canonical Nexora Object + Executive Presentation State
 *     → Object Visual Resolver
 *       → Executive Object Visual Presentation
 *         → R3F Object Renderer
 *
 * SP:2.1 remains the canonical visual presentation authority.
 * SP:2.2 supplies semantic geometry; SP:2.3 supplies material/surface;
 * SP:2.4 supplies state/severity visual modifiers;
 * SP:2.5 supplies label information density / progressive disclosure;
 * SP:2.6 supplies focus/attention presentation composition.
 */

import {
  executiveObjectOcclusionIdentity,
  type ExecutiveObjectOcclusionState,
} from "./executiveObjectOcclusion.ts";
import { executiveFocusChoreographyIdentity } from "./executiveFocusChoreography.ts";
import { executiveSpatialCompositionIdentity } from "./executiveSpatialComposition.ts";
import {
  resolveExecutiveObjectGeometryConnectionRadius,
  resolveExecutiveObjectGeometryFamily,
  type ExecutiveObjectSemanticVisualFamily,
} from "./executiveObjectGeometryLanguage.ts";
import {
  resolveExecutiveObjectMaterialPresentation,
  resolveExecutiveObjectMaterialSurfaceTone,
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS,
  type ExecutiveObjectMaterialSurfacePresentation,
  type ExecutiveObjectMaterialSurfaceToken,
} from "./executiveObjectMaterialSurface.ts";
import {
  resolveExecutiveObjectStateVisualPresentation,
  type ExecutiveObjectStateMarker,
  type ExecutiveObjectStateVisualClass,
  type ExecutiveObjectStateVisualPresentation,
} from "./executiveObjectStateVisualHierarchy.ts";
import {
  mapExecutiveObjectLabelProminenceToStage,
  resolveExecutiveObjectLabelPresentation,
  type ExecutiveObjectLabelPresentation,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  resolveExecutiveObjectFocusAttentionPresentation,
  type ExecutiveObjectFocusAttentionPresentation,
} from "./executiveObjectFocusAttentionPresentation.ts";
import type { ExecutiveStageDensityProfile } from "./executiveFramingVisualCalibration.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectVisualFoundationIdentity =
  "SP:2.1/ExecutiveObjectVisualFoundation" as const;

export const executiveObjectVisualFoundationVersion = "2.1.0" as const;

export const executiveObjectVisualFoundationNamespace =
  "nexora.spatial-presentation.executive-object-visual-foundation" as const;

export const executiveObjectVisualFoundationPhase =
  "ExecutiveObjectVisualFoundation" as const;

export const executiveObjectVisualFoundationArchitecturalRole =
  "PresentationOnlyCanonicalObjectVisualResolution" as const;

export const executiveObjectVisualFoundationReadiness =
  "ReadyForObjectTypeGeometryLanguage" as const;

export type ExecutiveObjectVisualFoundationIdentity = {
  readonly id: typeof executiveObjectVisualFoundationIdentity;
  readonly version: typeof executiveObjectVisualFoundationVersion;
  readonly namespace: typeof executiveObjectVisualFoundationNamespace;
  readonly phase: typeof executiveObjectVisualFoundationPhase;
  readonly architecturalRole: typeof executiveObjectVisualFoundationArchitecturalRole;
  readonly upstreamSpatialComposition: typeof executiveSpatialCompositionIdentity;
  readonly upstreamFocusChoreography: typeof executiveFocusChoreographyIdentity;
  readonly upstreamObjectOcclusion: typeof executiveObjectOcclusionIdentity;
};

const VISUAL_IDENTITY: ExecutiveObjectVisualFoundationIdentity = Object.freeze({
  id: executiveObjectVisualFoundationIdentity,
  version: executiveObjectVisualFoundationVersion,
  namespace: executiveObjectVisualFoundationNamespace,
  phase: executiveObjectVisualFoundationPhase,
  architecturalRole: executiveObjectVisualFoundationArchitecturalRole,
  upstreamSpatialComposition: executiveSpatialCompositionIdentity,
  upstreamFocusChoreography: executiveFocusChoreographyIdentity,
  upstreamObjectOcclusion: executiveObjectOcclusionIdentity,
});

export function getExecutiveObjectVisualFoundationIdentity(): ExecutiveObjectVisualFoundationIdentity {
  return VISUAL_IDENTITY;
}

export const EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectVisualFoundationArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsObjectIdentity: false as const,
  ownsObjectKindTruth: false as const,
  ownsDataset: false as const,
  ownsKpi: false as const,
  ownsSeverityTruth: false as const,
  ownsAttentionTruth: false as const,
  ownsFocusTruth: false as const,
  ownsRecommendation: false as const,
  ownsRelationships: false as const,
  ownsWorkspaceMeaning: false as const,
  ownsAdvisorReasoning: false as const,
  ownsSpatialPosition: false as const,
  ownsCamera: false as const,
  encodesImportanceByScale: false as const,
  assignsTypeSpecificGeometry: false as const,
  finalizesMaterialLanguage: false as const,
  finalizesSeverityColors: false as const,
  introducesLabelCollisionEngine: false as const,
  redesignsStageLighting: false as const,
  frameworkIndependentResolver: true as const,
  presentationOnly: true as const,
});

// ─── Existing semantic aliases (do not invent parallel enums) ────────────────

/** Aligns with NexoraMVPStageAttention — presentation consumption only. */
export type ExecutiveObjectVisualAttention =
  | "normal"
  | "elevated"
  | "important"
  | "critical";

/**
 * Spatial presentation role — maps Stage role vocabulary:
 * focused → focus, related → related, unrelated → background, normal → overview.
 */
export type ExecutiveObjectSpatialRole =
  | "focus"
  | "related"
  | "background"
  | "overview";

export type ExecutiveObjectVisualOcclusionState = ExecutiveObjectOcclusionState;

// ─── Geometry vocabulary (SP:2.1 — no type→family mapping) ──────────────────

/**
 * Geometry family vocabulary for future SP:2.2 specialization.
 * SP:2.1 always resolves the safe fallback family ("block").
 */
export type ExecutiveObjectGeometryFamily =
  | "block"
  | "rounded"
  | "cylindrical"
  | "orbital"
  | "planar";

export type ExecutiveObjectGeometryPresentation = {
  readonly family: ExecutiveObjectGeometryFamily;
  /** Semantic visual family from SP:2.2 — category, not state. */
  readonly semanticFamily: ExecutiveObjectSemanticVisualFamily;
  /** Stable resource key for geometry reuse (not a mesh instance). */
  readonly resourceKey: string;
  /** Invisible picking volume scale relative to visual dimensions. */
  readonly pickingExtentScale: number;
};

export type ExecutiveObjectDimensions = {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
};

// ─── Material / edge / label / emphasis ─────────────────────────────────────

export type ExecutiveObjectSurfaceToneToken =
  | "object.surface.base"
  | "object.surface.watch"
  | "object.surface.risk"
  | "object.surface.unresolved";

export type ExecutiveObjectEdgeToneToken =
  | "object.edge.normal"
  | "object.edge.hover"
  | "object.edge.selected"
  | "object.edge.focus"
  | "object.edge.attention"
  | "object.edge.watch"
  | "object.edge.critical"
  | "object.edge.unresolved"
  | "object.edge.recommended"
  | "object.edge.occlusion";

export type ExecutiveObjectLabelToneToken =
  | "object.label.primary"
  | "object.label.secondary"
  | "object.label.assist";

export type ExecutiveObjectMaterialPresentation =
  ExecutiveObjectMaterialSurfacePresentation & {
    readonly surfaceTone: ExecutiveObjectSurfaceToneToken;
    readonly surfaceToken: ExecutiveObjectMaterialSurfaceToken;
    /** Final tinted body color for renderer consumption. */
    readonly color: string;
  };

export type ExecutiveObjectEdgeMode =
  | "none"
  | "hover"
  | "selected"
  | "focused"
  | "attention"
  | "occlusion";

export type ExecutiveObjectEdgePresentation = {
  readonly mode: ExecutiveObjectEdgeMode;
  readonly tone: ExecutiveObjectEdgeToneToken;
  readonly color: string;
  readonly opacity: number;
  /** Wireframe rim is an interaction/attention channel — not permanent object DNA. */
  readonly wireframe: boolean;
  readonly extentScale: number;
};

export type ExecutiveObjectLabelAnchorPosition =
  | "above"
  | "below"
  | "center"
  | "adaptive"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

export type ExecutiveObjectLabelAnchor = {
  readonly position: ExecutiveObjectLabelAnchorPosition;
  readonly offset: number;
  readonly faceCamera: boolean;
  readonly tone: ExecutiveObjectLabelToneToken;
  readonly prominence: "full" | "reduced" | "minimal";
  readonly visible: boolean;
  /** SP:2.5 screen-space collision offsets (pixels). */
  readonly screenOffsetX: number;
  readonly screenOffsetY: number;
  readonly upright: boolean;
};

export type ExecutiveObjectEmphasisPresentation = {
  readonly hover: boolean;
  readonly selected: boolean;
  readonly focused: boolean;
  /** Restrained focus pedestal cue (spatial ownership, not severity). */
  readonly showFocusPedestal: boolean;
  /** Attention rim intensity 0..1 — channel separate from surface tone. */
  readonly attentionRimIntensity: number;
  readonly silhouetteAssist: boolean;
  readonly readabilityAssist: boolean;
  /** SP:2.4 composed status class — not a parallel visual authority. */
  readonly stateClass: ExecutiveObjectStateVisualClass;
  readonly recommendationCue: boolean;
  readonly prominenceRank: number;
  readonly visualEnergy: number;
  readonly marker: ExecutiveObjectStateMarker;
  /** SP:2.6 presentation emphasis rank — not business ranking. */
  readonly emphasisRank: number;
  readonly surfaceEmphasis: number;
  readonly edgeEmphasis: number;
  readonly labelEmphasis: number;
  readonly markerEmphasis: number;
  readonly suppressInteractionNoise: boolean;
};

/**
 * Stable connection attachment boundary — geometry-family agnostic.
 * Connections must not assume every object is a cube.
 */
export type ExecutiveObjectConnectionAnchor = {
  readonly objectId: string;
  /** Local-space offset from object origin (center by default). */
  readonly localOffset: Readonly<{
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }>;
  /** Approximate half-extent for endpoint / occlusion radius consumers. */
  readonly radius: number;
};

export type ExecutiveObjectVisualPresentation = {
  readonly objectId: string;
  readonly objectKind: string;
  readonly geometry: ExecutiveObjectGeometryPresentation;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly scale: number;
  readonly material: ExecutiveObjectMaterialPresentation;
  readonly edge: ExecutiveObjectEdgePresentation;
  readonly labelAnchor: ExecutiveObjectLabelAnchor;
  /** SP:2.5 progressive disclosure label content — renderer consumes this. */
  readonly label: ExecutiveObjectLabelPresentation;
  /** SP:2.6 focus/attention composition — subordinate emphasis authority. */
  readonly focusAttention: ExecutiveObjectFocusAttentionPresentation;
  readonly emphasis: ExecutiveObjectEmphasisPresentation;
  readonly connectionAnchor: ExecutiveObjectConnectionAnchor;
  readonly occlusionState: ExecutiveObjectVisualOcclusionState;
  readonly spatialRole: ExecutiveObjectSpatialRole;
};

// ─── Input contract ─────────────────────────────────────────────────────────

export type ExecutiveObjectVisualInput = {
  readonly objectId: string;
  readonly objectKind: string;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly hovered?: boolean;
  readonly attention?: ExecutiveObjectVisualAttention;
  /** Status / severity presentation token (stable | watch | risk | unresolved…). */
  readonly status?: string;
  readonly spatialRole?: ExecutiveObjectSpatialRole;
  readonly occlusionState?: ExecutiveObjectVisualOcclusionState;
  readonly readabilityAssist?: boolean;
  readonly silhouetteAssist?: boolean;
  /**
   * Optional composition-provided scale hint from SP:1 / choreography.
   * Clamped into the canonical envelope — never encodes KPI importance.
   */
  readonly compositionScale?: number;
  readonly compositionOpacity?: number;
  readonly compositionEmissiveIntensity?: number;
  readonly labelProminence?: "full" | "reduced" | "minimal";
  /** P2:8.2 marker intensity when present — presentation channel only. */
  readonly rimIntensity?: number;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  /** Independent of severity — Advisor recommendation cue only. */
  readonly recommended?: boolean;
  /** Display name for SP:2.5 labels — presentation identity, not business truth. */
  readonly objectName?: string;
  /** Preformatted primary value — never invent KPI text. */
  readonly primaryValue?: string;
  readonly primaryMetricLabel?: string;
  readonly cameraDistance?: number;
  readonly densityProfile?: ExecutiveStageDensityProfile;
  readonly stageOrder?: number;
};

// ─── Canonical DNA / envelopes / tokens ─────────────────────────────────────

/**
 * Common Nexora Object DNA — shared visual grammar before type specialization.
 */
export const EXECUTIVE_OBJECT_VISUAL_DNA = Object.freeze({
  controlledPhysicalDepth: true as const,
  restrainedEdgeTreatment: true as const,
  consistentMaterialFamily: true as const,
  consistentScaleEnvelope: true as const,
  predictableLabelRelationship: true as const,
  controlledFocusHoverResponse: true as const,
  readableSilhouette: true as const,
  premiumRestrainedAppearance: true as const,
  defaultGeometryFamily: "block" as const satisfies ExecutiveObjectGeometryFamily,
});

/** Canonical dimension envelope (Stage-safe). */
export const EXECUTIVE_OBJECT_DIMENSION_ENVELOPE = Object.freeze({
  canonicalWidth: 0.72,
  canonicalHeight: 0.72,
  canonicalDepth: 0.64,
  minimumWidth: 0.48,
  minimumHeight: 0.48,
  minimumDepth: 0.4,
  maximumWidth: 0.9,
  maximumHeight: 0.9,
  maximumDepth: 0.82,
});

/**
 * Scale envelope — readability / interaction / composition only.
 * Focus must not become a giant cube; background must remain readable.
 */
export const EXECUTIVE_OBJECT_SCALE_ENVELOPE = Object.freeze({
  minimumReadable: 0.74,
  /**
   * Floor when Stage presentation supplies an explicit compositionScale
   * (SP:4.1C). Must remain below Visual Grammar secondary/collapsed floors.
   */
  minimumCompositionScale: 0.36,
  canonical: 1,
  maximumEmphasis: 1.22,
  hoverBoost: 1.035,
  focusMultiplier: 1.12,
  relatedMultiplier: 1.02,
  backgroundMultiplier: 0.82,
});

export const EXECUTIVE_OBJECT_MATERIAL_BOUNDS = Object.freeze({
  minimumOpacity: 0.22,
  maximumOpacity: 1,
  minimumRoughness: 0.28,
  maximumRoughness: 0.72,
  minimumMetalness: 0.08,
  maximumMetalness: 0.42,
  minimumEmissive: 0.02,
  maximumEmissive: 0.55,
  baseRoughness: 0.44,
  baseMetalness: 0.32,
  unresolvedRoughness: 0.62,
  unresolvedMetalness: 0.12,
});

/**
 * Presentation color tokens — workspace/environment colors stay separate.
 * Final severity redesign is SP:2.4; these centralize current Stage tones.
 */
export const EXECUTIVE_OBJECT_SURFACE_COLORS = Object.freeze({
  "object.surface.base": "#7dd3fc",
  "object.surface.watch": "#fbbf24",
  "object.surface.risk": "#f87171",
  "object.surface.unresolved": "#94a3b8",
} as const satisfies Record<ExecutiveObjectSurfaceToneToken, string>);

export const EXECUTIVE_OBJECT_EDGE_COLORS = Object.freeze({
  "object.edge.normal": "#64748b",
  "object.edge.hover": "#e2e8f0",
  "object.edge.selected": "#94a3b8",
  "object.edge.focus": "#e2e8f0",
  "object.edge.attention": "#d4b45a",
  "object.edge.watch": "#d4b45a",
  "object.edge.critical": "#d08080",
  "object.edge.unresolved": "#a8b4c4",
  "object.edge.recommended": "#7eb8d4",
  "object.edge.occlusion": "#cbd5e1",
} as const satisfies Record<ExecutiveObjectEdgeToneToken, string>);

export const EXECUTIVE_OBJECT_WIREFRAME_POLICY = Object.freeze({
  permanentObjectBoundary: false as const,
  selectionChannel: true as const,
  attentionChannel: true as const,
  occlusionAssistChannel: true as const,
  debugOnly: false as const,
});

/**
 * Visual state composition precedence (presentation modifiers only):
 *   Base → Business surface → Attention edge → Spatial role → Interaction → Occlusion
 */
export const EXECUTIVE_OBJECT_VISUAL_COMPOSITION_ORDER = Object.freeze([
  "base",
  "businessSurface",
  "attentionEdge",
  "spatialRole",
  "interaction",
  "occlusionReadability",
] as const);

export const EXECUTIVE_OBJECT_VISUAL_CHANNELS = Object.freeze({
  surfaceTone: "businessState",
  edge: "interactionAttention",
  spatialOwnership: "focus",
  labelEmphasis: "readability",
  environment: "workspace",
} as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

export function mapStageRoleToSpatialRole(
  role: string | undefined,
): ExecutiveObjectSpatialRole {
  switch (role) {
    case "focused":
    case "focus":
      return "focus";
    case "related":
      return "related";
    case "unrelated":
    case "background":
      return "background";
    default:
      return "overview";
  }
}

export function resolveExecutiveObjectSurfaceTone(
  status: string | undefined,
): ExecutiveObjectSurfaceToneToken {
  return resolveExecutiveObjectMaterialSurfaceTone(status);
}

function clampDimensions(
  dimensions: ExecutiveObjectDimensions,
): ExecutiveObjectDimensions {
  return Object.freeze({
    width: stabilize(
      clamp(
        dimensions.width,
        EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.minimumWidth,
        EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.maximumWidth,
      ),
    ),
    height: stabilize(
      clamp(
        dimensions.height,
        EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.minimumHeight,
        EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.maximumHeight,
      ),
    ),
    depth: stabilize(
      clamp(
        dimensions.depth,
        EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.minimumDepth,
        EXECUTIVE_OBJECT_DIMENSION_ENVELOPE.maximumDepth,
      ),
    ),
  });
}

/**
 * Scale resolution — composition readability only.
 * Severity / attention must not drive object size (hard SP:2.1 rule).
 *
 * SP:4.1C truth rule: when an explicit compositionScale is supplied by the
 * Stage presentation (Visual Grammar), it is the certified render scale.
 * Do not inflate it to the legacy readability floor — that invalidates
 * certified separation / projected envelopes (Rendered-Bounds Truth Audit).
 */
export function resolveExecutiveObjectScale(input: {
  readonly spatialRole: ExecutiveObjectSpatialRole;
  readonly focused: boolean;
  readonly hovered: boolean;
  readonly compositionScale?: number;
}): number {
  const envelope = EXECUTIVE_OBJECT_SCALE_ENVELOPE;
  const hasExplicitCompositionScale =
    typeof input.compositionScale === "number" &&
    Number.isFinite(input.compositionScale);

  let scale = hasExplicitCompositionScale
    ? input.compositionScale!
    : envelope.canonical;

  // If composition scale was not supplied, apply restrained role multipliers.
  if (!hasExplicitCompositionScale) {
    if (input.spatialRole === "focus" || input.focused) {
      scale = envelope.canonical * envelope.focusMultiplier;
    } else if (input.spatialRole === "related") {
      scale = envelope.canonical * envelope.relatedMultiplier;
    } else if (input.spatialRole === "background") {
      scale = envelope.canonical * envelope.backgroundMultiplier;
    }
  }

  if (input.hovered && !input.focused) {
    scale *= envelope.hoverBoost;
  }

  if (hasExplicitCompositionScale) {
    // Absolute safety rails only — honor certified SP:4.1C / presentation scale.
    return stabilize(
      clamp(
        scale,
        EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
        envelope.maximumEmphasis,
      ),
    );
  }

  return stabilize(clamp(scale, envelope.minimumReadable, envelope.maximumEmphasis));
}

function labelProminenceRank(value: "full" | "reduced" | "minimal"): number {
  switch (value) {
    case "full":
      return 3;
    case "reduced":
      return 2;
    default:
      return 1;
  }
}

function maxLabelProminence(
  a: "full" | "reduced" | "minimal",
  b: "full" | "reduced" | "minimal",
): "full" | "reduced" | "minimal" {
  return labelProminenceRank(a) >= labelProminenceRank(b) ? a : b;
}

function resolveLabelAnchor(input: {
  readonly dimensions: ExecutiveObjectDimensions;
  readonly spatialRole: ExecutiveObjectSpatialRole;
  readonly focused: boolean;
  readonly hovered: boolean;
  readonly occlusionState: ExecutiveObjectVisualOcclusionState;
  readonly readabilityAssist: boolean;
  readonly labelProminence: "full" | "reduced" | "minimal";
  readonly labelTone: ExecutiveObjectLabelToneToken;
  readonly stateClass: ExecutiveObjectStateVisualClass;
  readonly recommended: boolean;
  readonly labelClearance?: number;
  readonly labelPresentation?: ExecutiveObjectLabelPresentation;
}): ExecutiveObjectLabelAnchor {
  if (input.labelPresentation) {
    return Object.freeze({
      position: input.labelPresentation.anchor.position,
      offset: input.labelPresentation.anchor.offset,
      faceCamera: input.labelPresentation.anchor.faceCamera,
      tone: input.labelPresentation.tone,
      prominence: mapExecutiveObjectLabelProminenceToStage(
        input.labelPresentation.prominence,
      ),
      visible: input.labelPresentation.visible,
      screenOffsetX: input.labelPresentation.anchor.screenOffsetX,
      screenOffsetY: input.labelPresentation.anchor.screenOffsetY,
      upright: input.labelPresentation.anchor.upright,
    });
  }

  const halfHeight = input.dimensions.height * 0.5;
  const clearance =
    typeof input.labelClearance === "number" &&
    Number.isFinite(input.labelClearance)
      ? input.labelClearance
      : 0.36;
  const occlusionLift =
    input.occlusionState === "substantial"
      ? 0.28
      : input.occlusionState === "partial"
        ? 0.18
        : 0;
  const offset = stabilize(halfHeight + clearance + occlusionLift);

  return Object.freeze({
    position: "above" as const,
    offset,
    faceCamera: true as const,
    tone: input.labelTone,
    prominence: input.labelProminence,
    visible: true,
    screenOffsetX: 0,
    screenOffsetY: 0,
    upright: true as const,
  });
}

function mapStateEdgeTone(
  tone: ExecutiveObjectStateVisualPresentation["edge"]["tone"],
): ExecutiveObjectEdgeToneToken {
  switch (tone) {
    case "object.state.watch.edge":
      return "object.edge.watch";
    case "object.state.critical.edge":
      return "object.edge.critical";
    case "object.state.unresolved.edge":
      return "object.edge.unresolved";
    case "object.attention.recommended.edge":
      return "object.edge.recommended";
    default:
      return "object.edge.normal";
  }
}

function resolveEdge(input: {
  readonly hovered: boolean;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly silhouetteAssist: boolean;
  readonly occlusionState: ExecutiveObjectVisualOcclusionState;
  readonly stateVisual: ExecutiveObjectStateVisualPresentation;
}): ExecutiveObjectEdgePresentation {
  /**
   * Edge channel is interaction/attention — not spatial focus ownership.
   * Focus uses the pedestal (emphasis.showFocusPedestal) so critical+focused
   * remains discoverable via attention edge without collapsing channels.
   *
   * Precedence: state/attention > selected > hover > occlusion > none
   * State + selection compose into one rim — never stacked wireframes.
   * (selected suppressed while focused — selection ≠ focus).
   */
  const stateEdge = input.stateVisual.edge;
  if (stateEdge.mode !== "none" && stateEdge.wireframe) {
    const tone = mapStateEdgeTone(stateEdge.tone);
    return Object.freeze({
      mode: "attention" as const,
      tone,
      color: stateEdge.color,
      opacity: stateEdge.opacity,
      wireframe: EXECUTIVE_OBJECT_WIREFRAME_POLICY.attentionChannel,
      extentScale: stateEdge.extentScale,
    });
  }

  if (input.selected && !input.focused) {
    return Object.freeze({
      mode: "selected" as const,
      tone: "object.edge.selected" as const,
      color: EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.selected"],
      opacity: 0.35,
      wireframe: EXECUTIVE_OBJECT_WIREFRAME_POLICY.selectionChannel,
      extentScale: 1.14,
    });
  }

  if (input.hovered && !input.focused) {
    return Object.freeze({
      mode: "hover" as const,
      tone: "object.edge.hover" as const,
      color: EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.hover"],
      opacity: 0.4,
      wireframe: true,
      extentScale: 1.12,
    });
  }

  if (
    input.silhouetteAssist &&
    EXECUTIVE_OBJECT_WIREFRAME_POLICY.occlusionAssistChannel
  ) {
    const hoverBoost = input.hovered ? 0.42 : 0;
    const baseOpacity =
      input.occlusionState === "substantial"
        ? 0.28
        : input.occlusionState === "partial"
          ? 0.22
          : 0.2;
    return Object.freeze({
      mode: "occlusion" as const,
      tone: "object.edge.occlusion" as const,
      color: EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.occlusion"],
      opacity: hoverBoost > 0 ? hoverBoost : baseOpacity,
      wireframe: true,
      extentScale: 1.25,
    });
  }

  return Object.freeze({
    mode: "none" as const,
    tone: "object.edge.normal" as const,
    color: EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.normal"],
    opacity: 0,
    wireframe: false,
    extentScale: 1,
  });
}

function resolveMaterial(input: {
  readonly geometryFamily: ExecutiveObjectGeometryFamily;
  readonly semanticFamily: ExecutiveObjectSemanticVisualFamily;
  readonly status: string | undefined;
  readonly attention?: ExecutiveObjectVisualAttention;
  readonly spatialRole: ExecutiveObjectSpatialRole;
  readonly focused: boolean;
  readonly hovered: boolean;
  readonly selected: boolean;
  readonly occlusionState: ExecutiveObjectVisualOcclusionState;
  readonly compositionOpacity?: number;
  readonly compositionEmissiveIntensity?: number;
  readonly stateMarker: "none" | "attention" | "critical" | "unresolved";
  readonly recommended?: boolean;
}): ExecutiveObjectMaterialPresentation {
  return resolveExecutiveObjectMaterialPresentation({
    geometryFamily: input.geometryFamily,
    semanticFamily: input.semanticFamily,
    spatialRole: input.spatialRole,
    selected: input.selected,
    focused: input.focused,
    hovered: input.hovered,
    attention: input.attention,
    status: input.status,
    occlusionState: input.occlusionState,
    stateMarker: input.stateMarker,
    recommended: input.recommended,
    compositionOpacity: input.compositionOpacity,
    compositionEmissiveIntensity: input.compositionEmissiveIntensity,
  });
}

export function resolveExecutiveObjectConnectionAnchor(input: {
  readonly objectId: string;
  readonly dimensions: ExecutiveObjectDimensions;
  readonly scale: number;
  readonly geometryFamily?: ExecutiveObjectGeometryFamily;
  readonly connectionRadiusFactor?: number;
}): ExecutiveObjectConnectionAnchor {
  const geometryFamily = input.geometryFamily ?? "block";
  const radius = resolveExecutiveObjectGeometryConnectionRadius({
    geometryFamily,
    dimensions: input.dimensions,
    scale: input.scale,
    connectionRadiusFactor: input.connectionRadiusFactor,
  });
  // Center attachment — family-aware radius for surface proximity / occlusion.
  return Object.freeze({
    objectId: input.objectId,
    localOffset: Object.freeze({ x: 0, y: 0, z: 0 }),
    radius,
  });
}

/**
 * Canonical visual authority for Stage objects.
 * Pure / deterministic — does not mutate input; no React / Three.js imports.
 */
export function resolveExecutiveObjectVisualPresentation(
  input: ExecutiveObjectVisualInput,
): ExecutiveObjectVisualPresentation {
  const objectId = input.objectId;
  const objectKind =
    typeof input.objectKind === "string" && input.objectKind.length > 0
      ? input.objectKind
      : "unknown";
  const spatialRole =
    input.spatialRole ??
    (input.focused ? "focus" : "overview");
  const occlusionState = input.occlusionState ?? "clear";
  const hovered = input.hovered === true;
  const selected = input.selected === true;
  const focused = input.focused === true;
  const stateMarker = input.stateMarker ?? "none";
  const rimIntensity =
    typeof input.rimIntensity === "number" && Number.isFinite(input.rimIntensity)
      ? clamp(input.rimIntensity, 0, 1)
      : 0;
  const readabilityAssist = input.readabilityAssist === true;
  const silhouetteAssist =
    input.silhouetteAssist === true && !focused;
  const recommended = input.recommended === true;
  const stateVisual = resolveExecutiveObjectStateVisualPresentation({
    status: input.status,
    attention: input.attention,
    recommended,
    spatialRole,
    selected,
    focused,
    hovered,
    occlusionState,
    stateMarker,
    rimIntensity,
    labelProminence: input.labelProminence,
  });
  const labelProminence =
    input.labelProminence !== undefined
      ? maxLabelProminence(input.labelProminence, stateVisual.labelProminence)
      : stateVisual.labelProminence;

  /**
   * SP:2.2 — kind → semantic geometry family / dimensions.
   * State (focus/severity/selection) never participates in geometry mapping.
   */
  const geometryResolution = resolveExecutiveObjectGeometryFamily({
    objectKind,
  });
  const geometry = Object.freeze({
    family: geometryResolution.geometryFamily,
    semanticFamily: geometryResolution.semanticFamily,
    resourceKey: geometryResolution.resourceKey,
    pickingExtentScale: geometryResolution.pickingExtentScale,
  });

  const dimensions = clampDimensions(geometryResolution.dimensions);
  const scale = resolveExecutiveObjectScale({
    spatialRole,
    focused,
    hovered,
    compositionScale: input.compositionScale,
  });

  const material = resolveMaterial({
    geometryFamily: geometry.family,
    semanticFamily: geometry.semanticFamily,
    status: input.status,
    attention: input.attention,
    spatialRole,
    focused,
    hovered,
    selected,
    occlusionState,
    compositionOpacity: input.compositionOpacity,
    compositionEmissiveIntensity: input.compositionEmissiveIntensity,
    stateMarker,
    recommended,
  });

  const edge = resolveEdge({
    hovered,
    selected,
    focused,
    silhouetteAssist,
    occlusionState,
    stateVisual,
  });

  /**
   * SP:2.5 — progressive disclosure / label content.
   * Geometry/state already resolved; label policy does not alter them.
   */
  const label = resolveExecutiveObjectLabelPresentation({
    objectId,
    objectName:
      typeof input.objectName === "string" && input.objectName.trim().length > 0
        ? input.objectName
        : objectId,
    objectKind,
    status: input.status,
    attention: input.attention,
    recommended,
    stateMarker,
    primaryValue: input.primaryValue,
    primaryMetricLabel: input.primaryMetricLabel,
    spatialRole,
    focused,
    selected,
    hovered,
    occlusionState,
    readabilityAssist,
    cameraDistance: input.cameraDistance,
    densityProfile: input.densityProfile,
    labelProminence,
    labelClearance: geometryResolution.labelClearance,
    dimensionsHeight: dimensions.height,
    stageOrder: input.stageOrder,
  });

  const labelAnchor = resolveLabelAnchor({
    dimensions,
    spatialRole,
    focused,
    hovered,
    occlusionState,
    readabilityAssist,
    labelProminence: mapExecutiveObjectLabelProminenceToStage(label.prominence),
    labelTone: stateVisual.labelTone,
    stateClass: stateVisual.statusClass,
    recommended,
    labelClearance: geometryResolution.labelClearance,
    labelPresentation: label,
  });

  /**
   * SP:2.6 — focus/attention composition.
   * Integrates role + state + label into one bounded emphasis hierarchy.
   * Does not invent focus, relationships, or camera behavior.
   */
  const focusAttention = resolveExecutiveObjectFocusAttentionPresentation({
    objectId,
    spatialRole,
    status: input.status,
    attention: input.attention,
    recommended,
    selected,
    hovered,
    focused,
    occlusionState,
    stateMarker,
    rimIntensity,
    statusClass: stateVisual.statusClass,
    stateVisualEnergy: stateVisual.visualEnergy,
    stateProminenceRank: stateVisual.prominenceRank,
    marker: stateVisual.marker,
    markerIntensity: stateVisual.markerIntensity,
    recommendationCue: stateVisual.recommendationCue,
    stateEdgeOpacity: stateVisual.edge.opacity,
    labelLevel: label.level,
    labelPriorityRank: label.priorityRank,
    materialOpacity: material.opacity,
    materialEmissiveIntensity: material.emissiveIntensity,
    stageOrder: input.stageOrder,
  });

  // Apply opacity / emissive floors from composition without rebuilding material DNA.
  const nextOpacity = stabilize(
    clamp(
      Math.max(material.opacity, focusAttention.opacityFloor),
      EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumOpacity,
      EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumOpacity,
    ),
  );
  const nextEmissive = stabilize(
    clamp(
      material.emissiveIntensity + focusAttention.emissiveLift,
      EXECUTIVE_OBJECT_MATERIAL_BOUNDS.minimumEmissive,
      Math.min(
        EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumEmissive,
        EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumEmissive,
      ),
    ),
  );
  const composedMaterial =
    nextOpacity === material.opacity &&
    nextEmissive === material.emissiveIntensity
      ? material
      : Object.freeze({
          ...material,
          opacity: nextOpacity,
          transparent: nextOpacity < 0.985,
          emissiveIntensity: nextEmissive,
        });

  // Compose one effective edge — prevent stacked focus/critical/selected/hover rims.
  let composedEdge = edge;
  if (
    focusAttention.preferStateEdge &&
    focusAttention.edgeOpacity > 0 &&
    (edge.mode === "none" ||
      focusAttention.suppressInteractionNoise ||
      focusAttention.edgeMode === "composed" ||
      focusAttention.edgeMode === "state")
  ) {
    composedEdge = Object.freeze({
      mode: "attention" as const,
      tone:
        focusAttention.statusClass === "critical"
          ? ("object.edge.critical" as const)
          : focusAttention.statusClass === "watch"
            ? ("object.edge.watch" as const)
            : focusAttention.statusClass === "unresolved"
              ? ("object.edge.unresolved" as const)
              : focusAttention.recommendationCue
                ? ("object.edge.recommended" as const)
                : edge.tone,
      color:
        focusAttention.statusClass === "critical"
          ? EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.critical"]
          : focusAttention.statusClass === "watch"
            ? EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.watch"]
            : focusAttention.statusClass === "unresolved"
              ? EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.unresolved"]
              : focusAttention.recommendationCue
                ? EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.recommended"]
                : edge.color,
      opacity: stabilize(
        Math.max(edge.opacity, focusAttention.edgeOpacity),
      ),
      wireframe: true,
      extentScale: Math.max(edge.extentScale, stateVisual.edge.extentScale),
    });
  } else if (
    focusAttention.edgeMode === "none" &&
    focused &&
    stateVisual.statusClass === "normal"
  ) {
    // Focused normal: pedestal owns focus; no severity-looking edge.
    if (edge.mode === "attention" && stateVisual.marker === "none") {
      composedEdge = Object.freeze({
        mode: "none" as const,
        tone: "object.edge.normal" as const,
        color: EXECUTIVE_OBJECT_EDGE_COLORS["object.edge.normal"],
        opacity: 0,
        wireframe: false,
        extentScale: 1,
      });
    }
  }

  const emphasis = Object.freeze({
    hover: hovered,
    selected,
    focused,
    showFocusPedestal: focusAttention.showFocusPedestal,
    attentionRimIntensity: stabilize(focusAttention.attentionRimIntensity),
    silhouetteAssist,
    readabilityAssist,
    stateClass: stateVisual.statusClass,
    recommendationCue: focusAttention.recommendationCue,
    prominenceRank: stateVisual.prominenceRank,
    visualEnergy: focusAttention.visualEnergy,
    marker: focusAttention.primaryMarker,
    emphasisRank: focusAttention.emphasisRank,
    surfaceEmphasis: focusAttention.surfaceEmphasis,
    edgeEmphasis: focusAttention.edgeEmphasis,
    labelEmphasis: focusAttention.labelEmphasis,
    markerEmphasis: focusAttention.markerEmphasis,
    suppressInteractionNoise: focusAttention.suppressInteractionNoise,
  });

  const connectionAnchor = resolveExecutiveObjectConnectionAnchor({
    objectId,
    dimensions,
    scale,
    geometryFamily: geometry.family,
    connectionRadiusFactor: geometryResolution.connectionRadiusFactor,
  });

  return Object.freeze({
    objectId,
    objectKind,
    geometry,
    dimensions,
    scale,
    material: composedMaterial,
    edge: composedEdge,
    labelAnchor,
    label,
    focusAttention,
    emphasis,
    connectionAnchor,
    occlusionState,
    spatialRole,
  });
}

/**
 * Bind existing Stage object presentation fields into the visual input contract.
 * Presentation-only — does not alter business/relationship truth.
 */
export function toExecutiveObjectVisualInput(input: {
  readonly objectId: string;
  readonly objectKind: string;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly hovered?: boolean;
  readonly attention?: ExecutiveObjectVisualAttention;
  readonly status?: string;
  readonly role?: string;
  readonly occlusionState?: ExecutiveObjectVisualOcclusionState;
  readonly readabilityAssist?: boolean;
  readonly silhouetteAssist?: boolean;
  readonly scale?: number;
  readonly opacity?: number;
  readonly emissiveIntensity?: number;
  readonly labelProminence?: "full" | "reduced" | "minimal";
  readonly rimIntensity?: number;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  readonly recommended?: boolean;
  readonly objectName?: string;
  readonly primaryValue?: string;
  readonly primaryMetricLabel?: string;
  readonly cameraDistance?: number;
  readonly densityProfile?: ExecutiveStageDensityProfile;
  readonly stageOrder?: number;
}): ExecutiveObjectVisualInput {
  return Object.freeze({
    objectId: input.objectId,
    objectKind: input.objectKind,
    selected: input.selected,
    focused: input.focused,
    hovered: input.hovered === true,
    attention: input.attention,
    status: input.status,
    spatialRole: mapStageRoleToSpatialRole(input.role),
    occlusionState: input.occlusionState,
    readabilityAssist: input.readabilityAssist,
    silhouetteAssist: input.silhouetteAssist,
    compositionScale: input.scale,
    compositionOpacity: input.opacity,
    compositionEmissiveIntensity: input.emissiveIntensity,
    labelProminence: input.labelProminence,
    rimIntensity: input.rimIntensity,
    stateMarker: input.stateMarker,
    recommended: input.recommended === true ? true : undefined,
    objectName: input.objectName,
    primaryValue: input.primaryValue,
    primaryMetricLabel: input.primaryMetricLabel,
    cameraDistance: input.cameraDistance,
    densityProfile: input.densityProfile,
    stageOrder: input.stageOrder,
  });
}

export function verifyExecutiveObjectVisualFoundation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly scaleBounded: boolean;
  readonly fallbackSafe: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveObjectVisualFoundationIdentity();
  const identityValid =
    identity.id === "SP:2.1/ExecutiveObjectVisualFoundation" &&
    identity.version === "2.1.0" &&
    identity.upstreamSpatialComposition ===
      "SP:1.4/ExecutiveSpatialComposition" &&
    identity.upstreamFocusChoreography ===
      "SP:1.5/ExecutiveFocusChoreography" &&
    identity.upstreamObjectOcclusion === "SP:1.8/ExecutiveObjectOcclusion";

  const boundaryValid =
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsSpatialPosition === false &&
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsCamera === false &&
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.assignsTypeSpecificGeometry ===
      false &&
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.encodesImportanceByScale ===
      false;

  const sample = Object.freeze({
    objectId: "obj-sample",
    objectKind: "unknown-kind",
    selected: false,
    focused: true,
    hovered: false,
    attention: "critical" as const,
    status: "risk",
    spatialRole: "focus" as const,
    occlusionState: "partial" as const,
  });
  const a = resolveExecutiveObjectVisualPresentation(sample);
  const b = resolveExecutiveObjectVisualPresentation(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);
  const scaleBounded =
    a.scale >= EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumReadable &&
    a.scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis;
  const fallbackSafe =
    a.geometry.family === "block" &&
    a.objectKind === "unknown-kind" &&
    Number.isFinite(a.dimensions.width);
  const presentationOnly =
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.presentationOnly === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    scaleBounded &&
    fallbackSafe &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    scaleBounded,
    fallbackSafe,
    presentationOnly,
  });
}
