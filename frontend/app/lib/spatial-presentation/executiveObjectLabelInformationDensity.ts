/**
 * SP:2.5 — Executive Label & Information Density System.
 *
 * Presentation-only progressive disclosure for Stage object labels.
 * Answers: “What information should appear here, and how much?”
 *
 * Does NOT own KPI/state/severity/attention/recommendation/focus/relationships.
 * SP:2.4 remains state/severity authority. SP:2.1 remains visual authority.
 * SP:1 remains camera/spatial authority.
 *
 * Pipeline:
 *   Canonical Object Reality + SP:2 Visual State + SP:1 Camera/Density/Focus
 *     → Information Density Resolver
 *       → Label Presentation Contract
 *         → SP:2.1 Object Visual Presentation
 *           → Stage Label Renderer
 */

import {
  EXECUTIVE_SAFE_FRAMING_MARGINS,
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
  type ExecutiveStageDensityProfile,
} from "./executiveFramingVisualCalibration.ts";
import {
  composeExecutiveObjectStateVisualClass,
  type ExecutiveObjectStateVisualClass,
} from "./executiveObjectStateVisualHierarchy.ts";
import { isExecutiveObjectPresenceV2Enabled } from "./executiveObjectPresenceIdentity.ts";
import {
  formatExecutiveObjectStageLabel,
  publishExecutiveStageLabelObservability,
  resolveExecutiveLabelVisibilityClass,
  resolveExecutiveLabelWorldOffset,
  EXECUTIVE_STAGE_LABEL_SIDE_OFFSET_STEPS,
  type ExecutiveLabelPlacementSide,
} from "./executiveObjectLabelRelationshipGrammar.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectLabelInformationDensityIdentity =
  "SP:2.5/ExecutiveObjectLabelInformationDensity" as const;

export const executiveObjectLabelInformationDensityVersion = "2.5.0" as const;

export const executiveObjectLabelInformationDensityNamespace =
  "nexora.spatial-presentation.executive-object-label-information-density" as const;

export const executiveObjectLabelInformationDensityPhase =
  "ExecutiveLabelAndInformationDensitySystem" as const;

export const executiveObjectLabelInformationDensityArchitecturalRole =
  "PresentationOnlyExecutiveLabelInformationDensityResolution" as const;

export const executiveObjectLabelInformationDensityReadiness =
  "AwaitingHumanVisualSignOff" as const;

const UPSTREAM_VISUAL_FOUNDATION_IDENTITY =
  "SP:2.1/ExecutiveObjectVisualFoundation" as const;
const UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY =
  "SP:2.2/ExecutiveObjectGeometryLanguage" as const;
const UPSTREAM_MATERIAL_SURFACE_IDENTITY =
  "SP:2.3/ExecutiveObjectMaterialSurface" as const;
const UPSTREAM_STATE_VISUAL_IDENTITY =
  "SP:2.4/ExecutiveObjectStateVisualHierarchy" as const;

export type ExecutiveObjectLabelInformationDensityIdentity = {
  readonly id: typeof executiveObjectLabelInformationDensityIdentity;
  readonly version: typeof executiveObjectLabelInformationDensityVersion;
  readonly namespace: typeof executiveObjectLabelInformationDensityNamespace;
  readonly phase: typeof executiveObjectLabelInformationDensityPhase;
  readonly architecturalRole: typeof executiveObjectLabelInformationDensityArchitecturalRole;
  readonly upstreamVisualFoundation: typeof UPSTREAM_VISUAL_FOUNDATION_IDENTITY;
  readonly upstreamGeometryLanguage: typeof UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY;
  readonly upstreamMaterialSurface: typeof UPSTREAM_MATERIAL_SURFACE_IDENTITY;
  readonly upstreamStateVisualHierarchy: typeof UPSTREAM_STATE_VISUAL_IDENTITY;
};

const LABEL_IDENTITY: ExecutiveObjectLabelInformationDensityIdentity =
  Object.freeze({
    id: executiveObjectLabelInformationDensityIdentity,
    version: executiveObjectLabelInformationDensityVersion,
    namespace: executiveObjectLabelInformationDensityNamespace,
    phase: executiveObjectLabelInformationDensityPhase,
    architecturalRole: executiveObjectLabelInformationDensityArchitecturalRole,
    upstreamVisualFoundation: UPSTREAM_VISUAL_FOUNDATION_IDENTITY,
    upstreamGeometryLanguage: UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY,
    upstreamMaterialSurface: UPSTREAM_MATERIAL_SURFACE_IDENTITY,
    upstreamStateVisualHierarchy: UPSTREAM_STATE_VISUAL_IDENTITY,
  });

export function getExecutiveObjectLabelInformationDensityIdentity(): ExecutiveObjectLabelInformationDensityIdentity {
  return LABEL_IDENTITY;
}

export const EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY =
  Object.freeze({
    architecturalRole:
      executiveObjectLabelInformationDensityArchitecturalRole,
    ownsBusinessTruth: false as const,
    ownsKpiComputation: false as const,
    ownsSeverityTruth: false as const,
    ownsAttentionTruth: false as const,
    ownsRecommendationTruth: false as const,
    ownsFocusTruth: false as const,
    ownsRelationships: false as const,
    ownsSpatialPosition: false as const,
    ownsCamera: false as const,
    inventsPrimaryValues: false as const,
    inventsAdvisorProse: false as const,
    usesObjectIdLabelHacks: false as const,
    usesLabelNameHacks: false as const,
    introducesLeaderLines: false as const,
    introducesDashboardCards: false as const,
    replacesVisualFoundationAuthority: false as const,
    replacesStateVisualAuthority: false as const,
    startsFocusAttentionPolish: false as const,
    frameworkIndependentResolver: true as const,
    presentationOnly: true as const,
  });

// ─── Density levels / contracts ─────────────────────────────────────────────

export type ExecutiveInformationDensityLevel =
  | "identity"
  | "summary"
  | "detail";

export type ExecutiveObjectLabelProminence = "minimal" | "normal" | "full";

export type ExecutiveObjectLabelSpatialRole =
  | "focus"
  | "related"
  | "background"
  | "overview";

export type ExecutiveObjectLabelOcclusion =
  | "clear"
  | "partial"
  | "substantial";

export type ExecutiveObjectLabelAnchorPosition =
  | "above"
  | "below"
  | "center"
  | "adaptive";

export type ExecutiveObjectLabelToneToken =
  | "object.label.primary"
  | "object.label.secondary"
  | "object.label.assist";

export type ExecutiveObjectLabelInput = {
  readonly objectId: string;
  readonly objectName: string;
  readonly objectKind?: string;
  readonly status?: string;
  readonly attention?: string;
  readonly recommended?: boolean;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  /** Preformatted presentation value — never invent KPI text. */
  readonly primaryValue?: string;
  readonly primaryMetricLabel?: string;
  readonly spatialRole?: ExecutiveObjectLabelSpatialRole;
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
  readonly occlusionState?: ExecutiveObjectLabelOcclusion;
  readonly readabilityAssist?: boolean;
  readonly cameraDistance?: number;
  readonly densityProfile?: ExecutiveStageDensityProfile;
  readonly labelProminence?: "full" | "reduced" | "minimal";
  readonly labelClearance?: number;
  readonly dimensionsHeight?: number;
  readonly stageOrder?: number;
  /** STAGE-OBJ:3 — sector-aware preferred label side. */
  readonly preferredPlacementSide?: ExecutiveLabelPlacementSide;
};

export type ExecutiveObjectLabelAnchorPresentation = {
  readonly position: ExecutiveObjectLabelAnchorPosition | ExecutiveLabelPlacementSide;
  readonly offset: number;
  readonly worldOffsetX: number;
  readonly worldOffsetY: number;
  readonly screenOffsetX: number;
  readonly screenOffsetY: number;
  readonly faceCamera: boolean;
  readonly upright: boolean;
};

export type ExecutiveObjectLabelPresentation = {
  readonly objectId: string;
  readonly level: ExecutiveInformationDensityLevel;
  readonly showName: boolean;
  readonly showStateCue: boolean;
  readonly showPrimaryValue: boolean;
  readonly showMetricLabel: boolean;
  readonly showSecondaryContext: boolean;
  readonly nameText: string;
  readonly stateText: string | null;
  readonly primaryValueText: string | null;
  readonly metricLabelText: string | null;
  readonly secondaryContextText: string | null;
  readonly lines: readonly string[];
  readonly prominence: ExecutiveObjectLabelProminence;
  readonly tone: ExecutiveObjectLabelToneToken;
  readonly opacity: number;
  readonly scale: number;
  readonly fontSizePx: number;
  readonly priorityRank: number;
  readonly visible: boolean;
  readonly pointerEvents: "none";
  readonly maxNameCharacters: number;
  readonly statusClass: ExecutiveObjectStateVisualClass;
  readonly recommendationCue: boolean;
  readonly anchor: ExecutiveObjectLabelAnchorPresentation;
};

export type ExecutiveObjectLabelCollisionCandidate = {
  readonly objectId: string;
  readonly priorityRank: number;
  readonly stageOrder: number;
  readonly level: ExecutiveInformationDensityLevel;
  readonly prominence: ExecutiveObjectLabelProminence;
  readonly visible: boolean;
  /** Projected screen-space center (pixels). */
  readonly screenX: number;
  readonly screenY: number;
  readonly width: number;
  readonly height: number;
  /** STAGE-OBJ:3 — preferred placement side from angular sector. */
  readonly preferredPlacementSide?: ExecutiveLabelPlacementSide;
};

export type ExecutiveObjectLabelCollisionAdjustment = {
  readonly objectId: string;
  readonly visible: boolean;
  readonly level: ExecutiveInformationDensityLevel;
  readonly prominence: ExecutiveObjectLabelProminence;
  readonly screenOffsetX: number;
  readonly screenOffsetY: number;
  readonly action:
    | "none"
    | "offset"
    | "reduce-level"
    | "reduce-prominence"
    | "hide";
};

export type ExecutiveObjectLabelCollisionResult = {
  readonly byId: ReadonlyMap<string, ExecutiveObjectLabelCollisionAdjustment>;
  readonly adjustments: readonly ExecutiveObjectLabelCollisionAdjustment[];
  /** STAGE-OBJ:3 observability. */
  readonly visibleCount: number;
  readonly hiddenCount: number;
  readonly collisionCount: number;
  readonly overflowCount: number;
};

// ─── Tokens / bounds / policies ─────────────────────────────────────────────

export const EXECUTIVE_OBJECT_LABEL_FONT_TOKENS = Object.freeze({
  // SP:2.8 — slightly quieter typography; geometry remains primary.
  identity: 9,
  summary: 10,
  detail: 11,
} as const);

export const EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS = Object.freeze({
  minimum: 0.84,
  identity: 0.88,
  summary: 0.96,
  detail: 1.02,
  maximum: 1.08,
});

export const EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS = Object.freeze({
  minimal: 0.5,
  normal: 0.76,
  full: 0.96,
});

export const EXECUTIVE_OBJECT_LABEL_NAME_BOUNDS = Object.freeze({
  identityMaxCharacters: 18,
  summaryMaxCharacters: 22,
  detailMaxCharacters: 28,
});

export const EXECUTIVE_OBJECT_LABEL_DETAIL_BUDGET = Object.freeze({
  maximumLines: 3,
  maximumSecondaryFields: 2,
});

export const EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS = Object.freeze({
  // SP:2.8A — more Dial-panel escape travel without unbounded displacement.
  maxScreenOffsetX: 72,
  maxScreenOffsetY: 56,
  verticalStep: 16,
  horizontalStep: 24,
  boxPadding: 6,
  hysteresisPixels: 4,
});

export const EXECUTIVE_OBJECT_LABEL_DISTANCE_BANDS = Object.freeze({
  nearMaximum: 8.4,
  normalMaximum: 11.2,
  // beyond normalMaximum → far
});

export const EXECUTIVE_OBJECT_LABEL_INFORMATION_PRIORITY = Object.freeze([
  "identity",
  "stateCue",
  "recommendationCue",
  "primaryValue",
  "metricLabel",
  "secondaryContext",
] as const);

export const EXECUTIVE_OBJECT_LABEL_COMPOSITION_ORDER = Object.freeze([
  "canonicalIdentity",
  "densityDistanceRole",
  "stateSeverityCue",
  "interactionPromotion",
  "occlusionDiscoverability",
  "collisionPlacement",
] as const);

export type ExecutiveObjectLabelDistanceBand = "near" | "normal" | "far";

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

function levelRank(level: ExecutiveInformationDensityLevel): number {
  switch (level) {
    case "detail":
      return 3;
    case "summary":
      return 2;
    default:
      return 1;
  }
}

function minLevel(
  a: ExecutiveInformationDensityLevel,
  b: ExecutiveInformationDensityLevel,
): ExecutiveInformationDensityLevel {
  return levelRank(a) <= levelRank(b) ? a : b;
}

function maxLevel(
  a: ExecutiveInformationDensityLevel,
  b: ExecutiveInformationDensityLevel,
): ExecutiveInformationDensityLevel {
  return levelRank(a) >= levelRank(b) ? a : b;
}

function reduceLevel(
  level: ExecutiveInformationDensityLevel,
): ExecutiveInformationDensityLevel {
  if (level === "detail") return "summary";
  if (level === "summary") return "identity";
  return "identity";
}

function prominenceFromLevel(
  level: ExecutiveInformationDensityLevel,
): ExecutiveObjectLabelProminence {
  switch (level) {
    case "detail":
      return "full";
    case "summary":
      return "normal";
    default:
      return "minimal";
  }
}

function mapStageProminence(
  value: "full" | "reduced" | "minimal" | undefined,
): ExecutiveObjectLabelProminence | undefined {
  if (value === "full") return "full";
  if (value === "reduced") return "normal";
  if (value === "minimal") return "minimal";
  return undefined;
}

export function mapExecutiveObjectLabelProminenceToStage(
  value: ExecutiveObjectLabelProminence,
): "full" | "reduced" | "minimal" {
  switch (value) {
    case "full":
      return "full";
    case "normal":
      return "reduced";
    default:
      return "minimal";
  }
}

export function resolveExecutiveObjectLabelDistanceBand(
  cameraDistance: number | undefined,
): ExecutiveObjectLabelDistanceBand {
  if (typeof cameraDistance !== "number" || !Number.isFinite(cameraDistance)) {
    return "normal";
  }
  if (cameraDistance <= EXECUTIVE_OBJECT_LABEL_DISTANCE_BANDS.nearMaximum) {
    return "near";
  }
  if (cameraDistance <= EXECUTIVE_OBJECT_LABEL_DISTANCE_BANDS.normalMaximum) {
    return "normal";
  }
  return "far";
}

export function resolveExecutiveObjectLabelStateCue(input: {
  readonly status?: string;
  readonly attention?: string;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  readonly recommended?: boolean;
}): {
  readonly statusClass: ExecutiveObjectStateVisualClass;
  readonly stateText: string | null;
  readonly recommendationCue: boolean;
} {
  const statusClass = composeExecutiveObjectStateVisualClass({
    status: input.status,
    attention: input.attention,
    stateMarker: input.stateMarker,
  });
  const recommendationCue = input.recommended === true;
  let stateText: string | null = null;
  if (statusClass === "critical") stateText = "critical";
  else if (statusClass === "watch") stateText = "watch";
  else if (statusClass === "unresolved") stateText = "unresolved";
  else if (recommendationCue) stateText = "recommended";
  return Object.freeze({ statusClass, stateText, recommendationCue });
}

function truncateName(name: string, maxCharacters: number): string {
  const trimmed = name.trim();
  if (trimmed.length <= maxCharacters) return trimmed;
  if (maxCharacters <= 1) return trimmed.slice(0, 1);
  return `${trimmed.slice(0, Math.max(1, maxCharacters - 1)).trimEnd()}…`;
}

function sanitizePresentationText(value: string | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed;
}

function baseLevelFromRoleAndDensity(input: {
  readonly spatialRole: ExecutiveObjectLabelSpatialRole;
  readonly focused: boolean;
  readonly densityProfile: ExecutiveStageDensityProfile;
  readonly distanceBand: ExecutiveObjectLabelDistanceBand;
  readonly statusClass: ExecutiveObjectStateVisualClass;
  readonly recommendationCue: boolean;
}): ExecutiveInformationDensityLevel {
  const {
    spatialRole,
    focused,
    densityProfile,
    distanceBand,
    statusClass,
    recommendationCue,
  } = input;

  if (focused || spatialRole === "focus") {
    return "detail";
  }

  let level: ExecutiveInformationDensityLevel =
    spatialRole === "related"
      ? "summary"
      : spatialRole === "background"
        ? "identity"
        : "summary";

  if (densityProfile === "high-density") {
    level = spatialRole === "related" ? "identity" : minLevel(level, "identity");
  } else if (densityProfile === "dense") {
    if (spatialRole === "background") level = "identity";
    else if (spatialRole === "related") level = minLevel(level, "summary");
  } else if (densityProfile === "sparse" && spatialRole === "overview") {
    level = "summary";
  }

  if (distanceBand === "far") {
    level = minLevel(level, "identity");
  } else if (distanceBand === "normal" && spatialRole === "background") {
    level = minLevel(level, "identity");
  }

  // Competing attention floors — discoverability without detail dump.
  if (statusClass === "critical" || statusClass === "watch") {
    level = maxLevel(level, "identity");
    if (
      spatialRole !== "background" &&
      densityProfile !== "high-density" &&
      distanceBand !== "far"
    ) {
      level = maxLevel(level, "summary");
    }
  }
  if (statusClass === "unresolved") {
    level = maxLevel(level, "identity");
  }
  if (recommendationCue && spatialRole !== "background") {
    level = maxLevel(level, "identity");
  }

  return level;
}

/**
 * Deterministic label priority for collision / failsafe ordering.
 * Higher rank wins. Stable objectId is the final tie-break at collision time.
 */
export function resolveExecutiveObjectLabelPriorityRank(input: {
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
  readonly spatialRole?: ExecutiveObjectLabelSpatialRole;
  readonly status?: string;
  readonly attention?: string;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  readonly recommended?: boolean;
}): number {
  const statusClass = composeExecutiveObjectStateVisualClass({
    status: input.status,
    attention: input.attention,
    stateMarker: input.stateMarker,
  });
  let rank = 20;
  if (input.focused || input.spatialRole === "focus") rank += 100;
  if (statusClass === "critical") rank += 48;
  else if (statusClass === "watch") rank += 28;
  else if (statusClass === "unresolved") rank += 18;
  if (input.recommended === true) rank += 16;
  if (input.spatialRole === "related") rank += 12;
  if (input.selected === true) rank += 10;
  if (input.hovered === true) rank += 8;
  if (input.spatialRole === "background") rank -= 8;
  return clamp(rank, 0, 200);
}

/**
 * Pure information-density + label content resolver.
 * Does not mutate input. Does not invent KPI/value text.
 */
export function resolveExecutiveObjectLabelPresentation(
  input: ExecutiveObjectLabelInput,
): ExecutiveObjectLabelPresentation {
  const objectId =
    typeof input.objectId === "string" && input.objectId.length > 0
      ? input.objectId
      : "unknown";
  const rawName =
    typeof input.objectName === "string" && input.objectName.trim().length > 0
      ? input.objectName.trim()
      : objectId;
  const spatialRole =
    input.spatialRole ?? (input.focused ? "focus" : "overview");
  const focused = input.focused === true;
  const selected = input.selected === true;
  const hovered = input.hovered === true;
  const occlusion = input.occlusionState ?? "clear";
  const readabilityAssist = input.readabilityAssist === true;
  const densityProfile = input.densityProfile ?? "balanced";
  const distanceBand = resolveExecutiveObjectLabelDistanceBand(
    input.cameraDistance,
  );
  const cue = resolveExecutiveObjectLabelStateCue({
    status: input.status,
    attention: input.attention,
    stateMarker: input.stateMarker,
    recommended: input.recommended,
  });

  let level = baseLevelFromRoleAndDensity({
    spatialRole,
    focused,
    densityProfile,
    distanceBand,
    statusClass: cue.statusClass,
    recommendationCue: cue.recommendationCue,
  });

  // Selection promotes toward summary; hover temporarily lifts one level.
  if (selected && !focused) {
    level = maxLevel(level, "summary");
  }
  if (hovered && !focused) {
    if (level === "identity") level = "summary";
  }

  // Occlusion: keep identity for important objects; do not auto-open detail.
  if (occlusion !== "clear") {
    if (
      cue.statusClass === "critical" ||
      cue.statusClass === "watch" ||
      cue.statusClass === "unresolved" ||
      focused ||
      readabilityAssist
    ) {
      level = maxLevel(level, "identity");
    }
  }

  // Critical background hard floor — name + compact critical cue.
  if (
    spatialRole === "background" &&
    (cue.statusClass === "critical" || cue.statusClass === "watch")
  ) {
    level = maxLevel(level, "identity");
  }

  // Focus always owns detail.
  if (focused || spatialRole === "focus") {
    level = "detail";
  }

  const stageProminence = mapStageProminence(input.labelProminence);
  let prominence = prominenceFromLevel(level);
  if (stageProminence === "full") {
    prominence = "full";
  } else if (stageProminence === "minimal" && level === "identity") {
    prominence = "minimal";
  }

  const maxNameCharacters =
    level === "detail"
      ? EXECUTIVE_OBJECT_LABEL_NAME_BOUNDS.detailMaxCharacters
      : level === "summary"
        ? EXECUTIVE_OBJECT_LABEL_NAME_BOUNDS.summaryMaxCharacters
        : EXECUTIVE_OBJECT_LABEL_NAME_BOUNDS.identityMaxCharacters;

  // STAGE-OBJ:3 — presentation-clean redundant kind prefixes (truth unchanged).
  const formattedName = formatExecutiveObjectStageLabel({
    objectName: rawName,
    objectKind: input.objectKind,
  });
  const nameText = truncateName(
    formattedName.primaryLine,
    maxNameCharacters,
  ).toUpperCase();
  const primaryValueText = sanitizePresentationText(input.primaryValue);
  const metricLabelText = sanitizePresentationText(input.primaryMetricLabel);

  // Progressive disclosure — remove from bottom of priority stack upward.
  let showName = true;
  let showStateCue = false;
  let showPrimaryValue = false;
  let showMetricLabel = false;
  let showSecondaryContext = false;
  let stateText: string | null = null;
  let secondaryContextText: string | null = null;

  if (level === "identity") {
    showStateCue =
      cue.statusClass === "critical" ||
      cue.statusClass === "watch" ||
      cue.statusClass === "unresolved" ||
      (cue.recommendationCue && spatialRole !== "background");
    // Background recommended: keep cue without becoming summary dump.
    if (cue.recommendationCue && spatialRole === "background") {
      showStateCue = cue.statusClass === "normal" ? true : showStateCue;
    }
    stateText = showStateCue
      ? cue.statusClass === "normal" && cue.recommendationCue
        ? "recommended"
        : cue.stateText
      : null;
    // Severity wins main cue; recommendation stays boolean channel.
    if (
      showStateCue &&
      cue.recommendationCue &&
      cue.statusClass !== "normal" &&
      level === "identity"
    ) {
      stateText = cue.stateText;
    }
  } else if (level === "summary") {
    showStateCue =
      cue.stateText != null ||
      (cue.recommendationCue && cue.statusClass === "normal");
    stateText = showStateCue
      ? cue.statusClass === "normal" && cue.recommendationCue
        ? "recommended"
        : cue.stateText
      : null;
    // Compact primary metric only when justified (near / focus-adjacent / selected).
    showPrimaryValue =
      primaryValueText != null &&
      (focused ||
        selected ||
        hovered ||
        spatialRole === "related" ||
        distanceBand === "near" ||
        cue.statusClass === "critical");
  } else {
    showStateCue = cue.stateText != null || cue.recommendationCue;
    stateText = showStateCue
      ? cue.statusClass === "normal" && cue.recommendationCue
        ? "recommended"
        : cue.stateText
      : null;
    showPrimaryValue = primaryValueText != null;
    showMetricLabel = false; // keep Stage detail to ≤3 lines; metric label is secondary.
    showSecondaryContext =
      cue.recommendationCue &&
      cue.statusClass !== "normal" &&
      stateText !== "recommended";
    secondaryContextText = showSecondaryContext ? "recommended" : null;
  }

  // Marker already communicates far critical/watch — allow text only when summary+.
  // Identity still keeps short cue for critical-background discoverability.
  if (
    level === "identity" &&
    distanceBand === "far" &&
    cue.statusClass !== "critical" &&
    cue.statusClass !== "unresolved"
  ) {
    if (cue.statusClass === "watch" && spatialRole === "background") {
      showStateCue = true;
      stateText = "watch";
    }
  }

  const lines: string[] = [];
  if (showName) lines.push(nameText);
  if (level === "detail") {
    // Focus detail: name, optional value, compact state cue — keep ≤3 lines.
    if (showPrimaryValue && primaryValueText) {
      const valueCue = [primaryValueText, stateText]
        .filter(
          (part): part is string => typeof part === "string" && part.length > 0,
        )
        .join(" · ");
      lines.push(valueCue);
      if (secondaryContextText) lines.push(secondaryContextText);
    } else {
      const detailCue = [stateText, secondaryContextText]
        .filter(
          (part): part is string => typeof part === "string" && part.length > 0,
        )
        .join(" · ");
      if (detailCue) lines.push(detailCue);
    }
  } else if (level === "summary") {
    // STAGE-OBJ:2 — object identity primary; state secondary line when present.
    if (showPrimaryValue && primaryValueText) {
      const parts: string[] = [primaryValueText];
      if (showStateCue && stateText) parts.push(stateText);
      lines.push(parts.join(" · "));
    } else if (showStateCue && stateText) {
      if (isExecutiveObjectPresenceV2Enabled()) {
        lines.push(stateText);
      } else {
        lines[0] = `${nameText} · ${stateText}`;
      }
    }
  } else if (showStateCue && stateText) {
    if (isExecutiveObjectPresenceV2Enabled()) {
      lines.push(stateText);
    } else {
      lines[0] = `${nameText} · ${stateText}`;
    }
  }

  while (lines.length > EXECUTIVE_OBJECT_LABEL_DETAIL_BUDGET.maximumLines) {
    lines.pop();
  }

  const fontSizePx =
    level === "detail"
      ? EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.detail
      : level === "summary"
        ? EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.summary
        : EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.identity;

  const scale = stabilize(
    clamp(
      level === "detail"
        ? EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.detail
        : level === "summary"
          ? EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.summary
          : EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.identity,
      EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.minimum,
      EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.maximum,
    ),
  );

  const opacity =
    prominence === "full"
      ? EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.full
      : prominence === "normal"
        ? EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal
        : EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.minimal;

  const tone: ExecutiveObjectLabelToneToken =
    focused ||
    hovered ||
    readabilityAssist ||
    cue.statusClass === "critical" ||
    cue.recommendationCue
      ? "object.label.primary"
      : spatialRole === "background"
        ? "object.label.secondary"
        : cue.statusClass === "unresolved"
          ? "object.label.assist"
          : "object.label.primary";

  const halfHeight =
    typeof input.dimensionsHeight === "number" &&
    Number.isFinite(input.dimensionsHeight)
      ? input.dimensionsHeight * 0.5
      : 0.36;
  const clearance =
    typeof input.labelClearance === "number" &&
    Number.isFinite(input.labelClearance)
      ? input.labelClearance
      : 0.36;
  const occlusionLift =
    occlusion === "substantial" ? 0.32 : occlusion === "partial" ? 0.22 : 0;

  const visibilityClass = resolveExecutiveLabelVisibilityClass({
    focused,
    role: spatialRole,
    presentationLevel:
      densityProfile === "sparse"
        ? "minimum"
        : densityProfile === "dense"
          ? "operation"
          : "report",
    overview: spatialRole === "overview",
  });

  // STAGE-OBJ:3 — background/context stay subordinate unless critical discoverability.
  const criticalDiscoverability =
    cue.statusClass === "critical" ||
    cue.statusClass === "unresolved" ||
    (cue.statusClass === "watch" && spatialRole === "background");
  let visible =
    showName &&
    (prominence !== "minimal" ||
      focused ||
      hovered ||
      readabilityAssist ||
      cue.statusClass === "critical" ||
      cue.statusClass === "watch" ||
      cue.statusClass === "unresolved" ||
      cue.recommendationCue);
  if (visibilityClass === "hidden" && !criticalDiscoverability && !focused) {
    visible = false;
  }
  if (visibilityClass === "minimal" && !focused && !criticalDiscoverability) {
    showStateCue = false;
    stateText = null;
    showPrimaryValue = false;
    showMetricLabel = false;
    showSecondaryContext = false;
    while (lines.length > 1) lines.pop();
  }

  const priorityRank = resolveExecutiveObjectLabelPriorityRank({
    focused,
    selected,
    hovered,
    spatialRole,
    status: input.status,
    attention: input.attention,
    stateMarker: input.stateMarker,
    recommended: input.recommended,
  });

  const labelDistance = stabilize(halfHeight + clearance + occlusionLift);
  const placementSide: ExecutiveLabelPlacementSide =
    input.preferredPlacementSide ?? (focused ? "top" : "top");
  const world = resolveExecutiveLabelWorldOffset(placementSide, labelDistance);

  return Object.freeze({
    objectId,
    level,
    showName,
    showStateCue,
    showPrimaryValue: showPrimaryValue && primaryValueText != null,
    showMetricLabel: showMetricLabel && metricLabelText != null,
    showSecondaryContext: showSecondaryContext && secondaryContextText != null,
    nameText,
    stateText: showStateCue ? stateText : null,
    primaryValueText: showPrimaryValue ? primaryValueText : null,
    metricLabelText: showMetricLabel ? metricLabelText : null,
    secondaryContextText: showSecondaryContext ? secondaryContextText : null,
    lines: Object.freeze([...lines]),
    prominence,
    tone,
    opacity: stabilize(opacity),
    scale,
    fontSizePx,
    priorityRank,
    visible,
    pointerEvents: "none" as const,
    maxNameCharacters,
    statusClass: cue.statusClass,
    recommendationCue: cue.recommendationCue,
    anchor: Object.freeze({
      position: placementSide,
      offset: labelDistance,
      worldOffsetX: stabilize(world.x),
      worldOffsetY: stabilize(world.y),
      screenOffsetX: 0,
      screenOffsetY: 0,
      faceCamera: true as const,
      upright: true as const,
    }),
  });
}

/** Alias matching the conceptual information-density resolver name. */
export function resolveExecutiveObjectInformationDensity(
  input: ExecutiveObjectLabelInput,
): ExecutiveObjectLabelPresentation {
  return resolveExecutiveObjectLabelPresentation(input);
}

function boxesOverlap(
  a: {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  },
  b: {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  },
  padding: number,
): boolean {
  return !(
    a.x + a.w / 2 + padding < b.x - b.w / 2 ||
    b.x + b.w / 2 + padding < a.x - a.w / 2 ||
    a.y + a.h / 2 + padding < b.y - b.h / 2 ||
    b.y + b.h / 2 + padding < a.y - a.h / 2
  );
}

function isInDialExclusion(ndcX: number, ndcY: number): boolean {
  return (
    ndcX >= EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX &&
    ndcY <= EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY
  );
}

function isOutsideSafeMargins(ndcX: number, ndcY: number): boolean {
  return (
    ndcX < -1 + EXECUTIVE_SAFE_FRAMING_MARGINS.left ||
    ndcX > 1 - EXECUTIVE_SAFE_FRAMING_MARGINS.right ||
    ndcY > 1 - EXECUTIVE_SAFE_FRAMING_MARGINS.top ||
    ndcY < -1 + EXECUTIVE_SAFE_FRAMING_MARGINS.bottom
  );
}

/**
 * Approximate world→NDC projection for label collision / safe-region tests.
 * Framework-independent — not a second camera authority.
 */
export function projectExecutiveObjectLabelToNdc(input: {
  readonly world: Readonly<{ x: number; y: number; z: number }>;
  readonly cameraPosition: Readonly<{ x: number; y: number; z: number }>;
  readonly cameraTarget: Readonly<{ x: number; y: number; z: number }>;
  readonly fovDegrees: number;
  readonly aspect: number;
}): Readonly<{ x: number; y: number; depth: number }> {
  const forward = {
    x: input.cameraTarget.x - input.cameraPosition.x,
    y: input.cameraTarget.y - input.cameraPosition.y,
    z: input.cameraTarget.z - input.cameraPosition.z,
  };
  const fLen = Math.hypot(forward.x, forward.y, forward.z) || 1;
  const f = {
    x: forward.x / fLen,
    y: forward.y / fLen,
    z: forward.z / fLen,
  };
  const worldUp = { x: 0, y: 1, z: 0 };
  const right = {
    x: f.y * worldUp.z - f.z * worldUp.y,
    y: f.z * worldUp.x - f.x * worldUp.z,
    z: f.x * worldUp.y - f.y * worldUp.x,
  };
  const rLen = Math.hypot(right.x, right.y, right.z) || 1;
  const r = { x: right.x / rLen, y: right.y / rLen, z: right.z / rLen };
  const up = {
    x: r.y * f.z - r.z * f.y,
    y: r.z * f.x - r.x * f.z,
    z: r.x * f.y - r.y * f.x,
  };
  const toPoint = {
    x: input.world.x - input.cameraPosition.x,
    y: input.world.y - input.cameraPosition.y,
    z: input.world.z - input.cameraPosition.z,
  };
  const depth = toPoint.x * f.x + toPoint.y * f.y + toPoint.z * f.z;
  const xCam = toPoint.x * r.x + toPoint.y * r.y + toPoint.z * r.z;
  const yCam = toPoint.x * up.x + toPoint.y * up.y + toPoint.z * up.z;
  const fovRad = (clamp(input.fovDegrees, 20, 75) * Math.PI) / 180;
  const halfH = Math.tan(fovRad * 0.5) * Math.max(depth, 0.001);
  const halfW = halfH * Math.max(input.aspect, 0.2);
  return Object.freeze({
    x: stabilize(clamp(xCam / halfW, -2, 2)),
    y: stabilize(clamp(yCam / halfH, -2, 2)),
    depth: stabilize(depth),
  });
}

export function estimateExecutiveObjectLabelScreenBounds(input: {
  readonly lines: readonly string[];
  readonly fontSizePx: number;
  readonly screenX: number;
  readonly screenY: number;
}): Readonly<{ width: number; height: number; x: number; y: number }> {
  const longest = input.lines.reduce(
    (max, line) => Math.max(max, line.length),
    4,
  );
  const width = clamp(longest * input.fontSizePx * 0.62, 36, 220);
  const height = clamp(
    Math.max(1, input.lines.length) * (input.fontSizePx + 4),
    14,
    64,
  );
  return Object.freeze({
    width: stabilize(width),
    height: stabilize(height),
    x: input.screenX,
    y: input.screenY,
  });
}

/**
 * Deterministic screen-space label collision resolution.
 * Prefer small offsets → reduce level → reduce prominence → hide lowest priority.
 * Labels remain within bounded displacement of their projected anchor.
 */
export function resolveExecutiveObjectLabelCollisions(input: {
  readonly candidates: readonly ExecutiveObjectLabelCollisionCandidate[];
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly previous?: ReadonlyMap<string, ExecutiveObjectLabelCollisionAdjustment>;
}): ExecutiveObjectLabelCollisionResult {
  const bounds = EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS;
  const sorted = [...input.candidates].sort((a, b) => {
    if (b.priorityRank !== a.priorityRank) {
      return b.priorityRank - a.priorityRank;
    }
    if (a.stageOrder !== b.stageOrder) return a.stageOrder - b.stageOrder;
    return a.objectId.localeCompare(b.objectId);
  });

  const placed: Array<{
    readonly objectId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    level: ExecutiveInformationDensityLevel;
    prominence: ExecutiveObjectLabelProminence;
    visible: boolean;
    offsetX: number;
    offsetY: number;
    action: ExecutiveObjectLabelCollisionAdjustment["action"];
  }> = [];

  for (const candidate of sorted) {
    if (!candidate.visible) {
      placed.push({
        objectId: candidate.objectId,
        x: candidate.screenX,
        y: candidate.screenY,
        w: candidate.width,
        h: candidate.height,
        level: candidate.level,
        prominence: candidate.prominence,
        visible: false,
        offsetX: 0,
        offsetY: 0,
        action: "hide",
      });
      continue;
    }

    let level = candidate.level;
    let prominence = candidate.prominence;
    let width = candidate.width;
    let height = candidate.height;
    let offsetX = 0;
    let offsetY = 0;
    let action: ExecutiveObjectLabelCollisionAdjustment["action"] = "none";
    let visible = true;

    const previous = input.previous?.get(candidate.objectId);
    if (previous) {
      // Hysteresis — prefer prior offset when still overlapping within deadband.
      offsetX = previous.screenOffsetX;
      offsetY = previous.screenOffsetY;
    }

    const overlapsAny = (x: number, y: number, w: number, h: number): boolean =>
      placed.some(
        (other) =>
          other.visible &&
          boxesOverlap(
            { x, y, w, h },
            { x: other.x, y: other.y, w: other.w, h: other.h },
            bounds.boxPadding,
          ),
      );

    const toNdc = (screenX: number, screenY: number) => {
      const x = (screenX / Math.max(input.viewportWidth, 1)) * 2 - 1;
      const y = 1 - (screenY / Math.max(input.viewportHeight, 1)) * 2;
      return { x, y };
    };

    // SP:2.8A — Dial panel escape: left → up → left+up (bounded).
    let dialAttempts = 0;
    while (dialAttempts < 8) {
      const ndc = toNdc(
        candidate.screenX + offsetX,
        candidate.screenY + offsetY,
      );
      const inDial = isInDialExclusion(ndc.x, ndc.y);
      const outsideSafe = isOutsideSafeMargins(ndc.x, ndc.y);
      if (!inDial && !outsideSafe) break;
      dialAttempts += 1;
      if (inDial) {
        // Prefer left first, then up, then combined — Dial is bottom-right.
        if (dialAttempts % 3 === 1) {
          offsetX = clamp(
            offsetX - bounds.horizontalStep,
            -bounds.maxScreenOffsetX,
            bounds.maxScreenOffsetX,
          );
        } else if (dialAttempts % 3 === 2) {
          offsetY = clamp(
            offsetY - bounds.verticalStep,
            -bounds.maxScreenOffsetY,
            bounds.maxScreenOffsetY,
          );
        } else {
          offsetX = clamp(
            offsetX - bounds.horizontalStep,
            -bounds.maxScreenOffsetX,
            bounds.maxScreenOffsetX,
          );
          offsetY = clamp(
            offsetY - bounds.verticalStep,
            -bounds.maxScreenOffsetY,
            bounds.maxScreenOffsetY,
          );
        }
      } else {
        offsetY = clamp(
          offsetY - bounds.verticalStep,
          -bounds.maxScreenOffsetY,
          bounds.maxScreenOffsetY,
        );
      }
      action = "offset";
    }

    let attempts = 0;
    const preferredSide = candidate.preferredPlacementSide ?? "top";
    const offsetSteps =
      EXECUTIVE_STAGE_LABEL_SIDE_OFFSET_STEPS[preferredSide] ??
      EXECUTIVE_STAGE_LABEL_SIDE_OFFSET_STEPS.top;
    while (
      overlapsAny(
        candidate.screenX + offsetX,
        candidate.screenY + offsetY,
        width,
        height,
      ) &&
      attempts < 10
    ) {
      attempts += 1;
      const step = offsetSteps[(attempts - 1) % offsetSteps.length]!;
      const nextX = offsetX + step[0]! * bounds.horizontalStep;
      const nextY = offsetY + step[1]! * bounds.verticalStep;
      if (
        Math.abs(nextX) <= bounds.maxScreenOffsetX &&
        Math.abs(nextY) <= bounds.maxScreenOffsetY
      ) {
        offsetX = nextX;
        offsetY = nextY;
        action = "offset";
        continue;
      }
      if (level !== "identity") {
        level = reduceLevel(level);
        prominence = prominenceFromLevel(level);
        width *= 0.9;
        height *= 0.85;
        action = "reduce-level";
        offsetX = clamp(offsetX, -bounds.maxScreenOffsetX, bounds.maxScreenOffsetX);
        offsetY = clamp(offsetY, -bounds.maxScreenOffsetY, bounds.maxScreenOffsetY);
        continue;
      }
      if (prominence !== "minimal") {
        prominence = "minimal";
        action = "reduce-prominence";
        continue;
      }
      visible = false;
      action = "hide";
      break;
    }

    // Never hide critical/focus if still colliding — keep identity with last offset.
    if (
      !visible &&
      (candidate.priorityRank >= 100 ||
        candidate.priorityRank >= 68)
    ) {
      visible = true;
      level = "identity";
      prominence = candidate.priorityRank >= 100 ? "full" : "normal";
      action = "offset";
    }

    if (
      previous &&
      Math.hypot(
        offsetX - previous.screenOffsetX,
        offsetY - previous.screenOffsetY,
      ) < bounds.hysteresisPixels &&
      previous.visible === visible &&
      previous.level === level
    ) {
      offsetX = previous.screenOffsetX;
      offsetY = previous.screenOffsetY;
      action = previous.action;
    }

    placed.push({
      objectId: candidate.objectId,
      x: candidate.screenX + offsetX,
      y: candidate.screenY + offsetY,
      w: width,
      h: height,
      level,
      prominence,
      visible,
      offsetX: stabilize(
        clamp(offsetX, -bounds.maxScreenOffsetX, bounds.maxScreenOffsetX),
      ),
      offsetY: stabilize(
        clamp(offsetY, -bounds.maxScreenOffsetY, bounds.maxScreenOffsetY),
      ),
      action,
    });
  }

  const adjustments = Object.freeze(
    placed.map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        visible: entry.visible,
        level: entry.level,
        prominence: entry.prominence,
        screenOffsetX: entry.offsetX,
        screenOffsetY: entry.offsetY,
        action: entry.action,
      }),
    ),
  );
  const byId = new Map(
    adjustments.map((adjustment) => [adjustment.objectId, adjustment]),
  );
  const visibleCount = adjustments.filter((entry) => entry.visible).length;
  const hiddenCount = adjustments.length - visibleCount;
  const collisionCount = adjustments.filter(
    (entry) => entry.action !== "none",
  ).length;
  const overflowCount = adjustments.filter(
    (entry) =>
      entry.action === "hide" ||
      entry.action === "reduce-level" ||
      entry.action === "reduce-prominence",
  ).length;
  return Object.freeze({
    byId,
    adjustments,
    visibleCount,
    hiddenCount,
    collisionCount,
    overflowCount,
  });
}

export function applyExecutiveObjectLabelCollisionAdjustment(
  presentation: ExecutiveObjectLabelPresentation,
  adjustment: ExecutiveObjectLabelCollisionAdjustment | undefined,
): ExecutiveObjectLabelPresentation {
  if (!adjustment) return presentation;

  const level =
    levelRank(adjustment.level) < levelRank(presentation.level)
      ? adjustment.level
      : presentation.level;

  let showStateCue = presentation.showStateCue;
  let showPrimaryValue = presentation.showPrimaryValue;
  let showMetricLabel = presentation.showMetricLabel;
  let showSecondaryContext = presentation.showSecondaryContext;
  let stateText = presentation.stateText;
  let primaryValueText = presentation.primaryValueText;
  let lines = presentation.lines;

  if (level !== presentation.level) {
    if (level === "identity") {
      showPrimaryValue = false;
      showMetricLabel = false;
      showSecondaryContext = false;
      primaryValueText = null;
      showStateCue =
        presentation.statusClass === "critical" ||
        presentation.statusClass === "watch" ||
        presentation.statusClass === "unresolved" ||
        presentation.recommendationCue;
      stateText = showStateCue
        ? presentation.statusClass === "normal" &&
          presentation.recommendationCue
          ? "recommended"
          : presentation.statusClass === "critical"
            ? "critical"
            : presentation.statusClass === "watch"
              ? "watch"
              : presentation.statusClass === "unresolved"
                ? "unresolved"
                : presentation.recommendationCue
                  ? "recommended"
                  : null
        : null;
      lines = Object.freeze(
        stateText
          ? isExecutiveObjectPresenceV2Enabled()
            ? [presentation.nameText, stateText]
            : [`${presentation.nameText} · ${stateText}`]
          : [presentation.nameText],
      );
    } else if (level === "summary") {
      showMetricLabel = false;
      showSecondaryContext = false;
      showPrimaryValue = presentation.primaryValueText != null;
      primaryValueText = presentation.primaryValueText;
      const parts = [
        showPrimaryValue ? primaryValueText : null,
        presentation.stateText,
      ].filter((part): part is string => typeof part === "string");
      lines = Object.freeze(
        parts.length > 0
          ? [presentation.nameText, parts.join(" · ")]
          : [presentation.nameText],
      );
    }
  }

  return Object.freeze({
    ...presentation,
    level,
    showStateCue,
    showPrimaryValue,
    showMetricLabel,
    showSecondaryContext,
    stateText,
    primaryValueText,
    lines,
    prominence: adjustment.prominence,
    visible: adjustment.visible && presentation.visible,
    fontSizePx:
      level === "detail"
        ? EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.detail
        : level === "summary"
          ? EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.summary
          : EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.identity,
    anchor: Object.freeze({
      ...presentation.anchor,
      worldOffsetX: presentation.anchor.worldOffsetX ?? 0,
      worldOffsetY:
        presentation.anchor.worldOffsetY ?? presentation.anchor.offset,
      screenOffsetX: adjustment.screenOffsetX,
      screenOffsetY: adjustment.screenOffsetY,
    }),
  });
}

export function verifyExecutiveObjectLabelInformationDensity(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly focusDetail: boolean;
  readonly criticalBackgroundDiscoverable: boolean;
  readonly progressiveDisclosure: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveObjectLabelInformationDensityIdentity();
  const identityValid =
    identity.id === "SP:2.5/ExecutiveObjectLabelInformationDensity" &&
    identity.version === "2.5.0" &&
    identity.upstreamVisualFoundation ===
      "SP:2.1/ExecutiveObjectVisualFoundation" &&
    identity.upstreamStateVisualHierarchy ===
      "SP:2.4/ExecutiveObjectStateVisualHierarchy";

  const boundaryValid =
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.ownsBusinessTruth ===
      false &&
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.inventsPrimaryValues ===
      false &&
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY
      .usesObjectIdLabelHacks === false &&
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY
      .replacesVisualFoundationAuthority === false &&
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY
      .startsFocusAttentionPolish === false;

  const sample = Object.freeze({
    objectId: "obj-a",
    objectName: "Revenue",
    status: "stable",
    spatialRole: "overview" as const,
    densityProfile: "balanced" as const,
    cameraDistance: 10.35,
  });
  const a = resolveExecutiveObjectLabelPresentation(sample);
  const b = resolveExecutiveObjectLabelPresentation(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const focus = resolveExecutiveObjectLabelPresentation({
    ...sample,
    focused: true,
    spatialRole: "focus",
    primaryValue: "96%",
  });
  const focusDetail = focus.level === "detail" && focus.showName === true;

  const criticalBackground = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-b",
    objectName: "Capacity",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    spatialRole: "background",
    densityProfile: "high-density",
    cameraDistance: 12.5,
  });
  const criticalBackgroundDiscoverable =
    criticalBackground.visible &&
    criticalBackground.showName &&
    criticalBackground.statusClass === "critical" &&
    criticalBackground.level !== "detail" &&
    (criticalBackground.stateText === "critical" ||
      criticalBackground.showStateCue);

  const near = resolveExecutiveObjectLabelPresentation({
    ...sample,
    cameraDistance: 7,
    densityProfile: "sparse",
  });
  const far = resolveExecutiveObjectLabelPresentation({
    ...sample,
    cameraDistance: 13,
    densityProfile: "high-density",
  });
  const progressiveDisclosure =
    levelRank(near.level) >= levelRank(far.level) &&
    far.level === "identity";

  const presentationOnly =
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.presentationOnly ===
    true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    focusDetail &&
    criticalBackgroundDiscoverable &&
    progressiveDisclosure &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    focusDetail,
    criticalBackgroundDiscoverable,
    progressiveDisclosure,
    presentationOnly,
  });
}
