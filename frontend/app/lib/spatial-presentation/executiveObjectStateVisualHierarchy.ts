/**
 * SP:2.4 — State & Severity Visual Hierarchy.
 *
 * Subordinate presentation resolver for executive condition and attention.
 * Answers: “What needs my attention, and how urgently?”
 * Does NOT own geometry (SP:2.2), base material DNA (SP:2.3), camera (SP:1),
 * or final visual authority (SP:2.1). Does not redefine business truth.
 *
 * Composition order:
 *   Base Nexora Material
 *     → Canonical State Modifier
 *       → Attention / Recommendation Modifier
 *         → Spatial Role Modifier
 *           → Interaction Modifier
 *             → Occlusion Readability Modifier
 *
 * Status and attention remain orthogonal. Recommendation is independent of severity.
 * Unresolved is a separate class — not critical, not disabled.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectStateVisualHierarchyIdentity =
  "SP:2.4/ExecutiveObjectStateVisualHierarchy" as const;

export const executiveObjectStateVisualHierarchyVersion = "2.4.0" as const;

export const executiveObjectStateVisualHierarchyNamespace =
  "nexora.spatial-presentation.executive-object-state-visual-hierarchy" as const;

export const executiveObjectStateVisualHierarchyPhase =
  "StateAndSeverityVisualHierarchy" as const;

export const executiveObjectStateVisualHierarchyArchitecturalRole =
  "PresentationOnlyExecutiveStateSeverityVisualResolution" as const;

export const executiveObjectStateVisualHierarchyReadiness =
  "AwaitingHumanVisualSignOff" as const;

const UPSTREAM_VISUAL_FOUNDATION_IDENTITY =
  "SP:2.1/ExecutiveObjectVisualFoundation" as const;
const UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY =
  "SP:2.2/ExecutiveObjectGeometryLanguage" as const;
const UPSTREAM_MATERIAL_SURFACE_IDENTITY =
  "SP:2.3/ExecutiveObjectMaterialSurface" as const;

export type ExecutiveObjectStateVisualHierarchyIdentity = {
  readonly id: typeof executiveObjectStateVisualHierarchyIdentity;
  readonly version: typeof executiveObjectStateVisualHierarchyVersion;
  readonly namespace: typeof executiveObjectStateVisualHierarchyNamespace;
  readonly phase: typeof executiveObjectStateVisualHierarchyPhase;
  readonly architecturalRole: typeof executiveObjectStateVisualHierarchyArchitecturalRole;
  readonly upstreamVisualFoundation: typeof UPSTREAM_VISUAL_FOUNDATION_IDENTITY;
  readonly upstreamGeometryLanguage: typeof UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY;
  readonly upstreamMaterialSurface: typeof UPSTREAM_MATERIAL_SURFACE_IDENTITY;
};

const STATE_IDENTITY: ExecutiveObjectStateVisualHierarchyIdentity =
  Object.freeze({
    id: executiveObjectStateVisualHierarchyIdentity,
    version: executiveObjectStateVisualHierarchyVersion,
    namespace: executiveObjectStateVisualHierarchyNamespace,
    phase: executiveObjectStateVisualHierarchyPhase,
    architecturalRole: executiveObjectStateVisualHierarchyArchitecturalRole,
    upstreamVisualFoundation: UPSTREAM_VISUAL_FOUNDATION_IDENTITY,
    upstreamGeometryLanguage: UPSTREAM_GEOMETRY_LANGUAGE_IDENTITY,
    upstreamMaterialSurface: UPSTREAM_MATERIAL_SURFACE_IDENTITY,
  });

export function getExecutiveObjectStateVisualHierarchyIdentity(): ExecutiveObjectStateVisualHierarchyIdentity {
  return STATE_IDENTITY;
}

export const EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY = Object.freeze({
  architecturalRole: executiveObjectStateVisualHierarchyArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsKpiComputation: false as const,
  ownsSeverityTruth: false as const,
  ownsAttentionTruth: false as const,
  ownsRecommendationTruth: false as const,
  ownsUnresolvedLogic: false as const,
  ownsFocusTruth: false as const,
  ownsRelationships: false as const,
  ownsSpatialPosition: false as const,
  ownsCamera: false as const,
  changesGeometry: false as const,
  changesScaleAggressively: false as const,
  introducesTrafficLightBodies: false as const,
  introducesPulsing: false as const,
  introducesBlinking: false as const,
  autoFocusesCritical: false as const,
  replacesVisualFoundationAuthority: false as const,
  replacesMaterialSurfaceAuthority: false as const,
  frameworkIndependentResolver: true as const,
  presentationOnly: true as const,
});

export const EXECUTIVE_OBJECT_STATE_VISUAL_COMPOSITION_ORDER = Object.freeze([
  "baseMaterial",
  "canonicalState",
  "attentionRecommendation",
  "spatialRole",
  "interaction",
  "occlusionReadability",
] as const);

// ─── Canonical vocabularies (consume existing MVP / P2:8.2 — no parallel taxonomy)

/** Stage MVP status: stable | watch | risk | unresolved */
export type ExecutiveObjectCanonicalStatus =
  | "stable"
  | "watch"
  | "risk"
  | "unresolved"
  | string;

/** Stage MVP attention: normal | elevated | important | critical */
export type ExecutiveObjectCanonicalAttention =
  | "normal"
  | "elevated"
  | "important"
  | "critical"
  | string;

export type ExecutiveObjectStateVisualClass =
  | "normal"
  | "watch"
  | "critical"
  | "unresolved";

export type ExecutiveObjectStateSpatialRole =
  | "focus"
  | "related"
  | "background"
  | "overview";

export type ExecutiveObjectStateOcclusion =
  | "clear"
  | "partial"
  | "substantial";

export type ExecutiveObjectStateLabelProminence = "full" | "reduced" | "minimal";

export type ExecutiveObjectStateMarker =
  | "none"
  | "attention"
  | "critical"
  | "unresolved"
  | "recommended";

export type ExecutiveObjectStateEdgeToneToken =
  | "object.state.normal.edge"
  | "object.state.watch.edge"
  | "object.state.critical.edge"
  | "object.state.unresolved.edge"
  | "object.attention.recommended.edge";

export type ExecutiveObjectStateSurfaceToneToken =
  | "object.surface.base"
  | "object.surface.watch"
  | "object.surface.risk"
  | "object.surface.unresolved";

export type ExecutiveObjectStateVisualInput = {
  readonly status?: ExecutiveObjectCanonicalStatus;
  readonly attention?: ExecutiveObjectCanonicalAttention;
  readonly recommended?: boolean;
  readonly spatialRole?: ExecutiveObjectStateSpatialRole;
  readonly selected?: boolean;
  readonly focused?: boolean;
  readonly hovered?: boolean;
  readonly occlusionState?: ExecutiveObjectStateOcclusion;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
  readonly rimIntensity?: number;
  readonly labelProminence?: ExecutiveObjectStateLabelProminence;
};

export type ExecutiveObjectStateEdgeModifier = {
  readonly mode: "none" | "watch" | "critical" | "unresolved" | "recommended";
  readonly tone: ExecutiveObjectStateEdgeToneToken;
  readonly color: string;
  readonly opacity: number;
  readonly wireframe: boolean;
  readonly extentScale: number;
  readonly style: "solid" | "uncertainty";
};

export type ExecutiveObjectStateVisualPresentation = {
  readonly statusClass: ExecutiveObjectStateVisualClass;
  readonly attentionLevel: "normal" | "elevated" | "important" | "critical";
  readonly recommended: boolean;
  readonly prominenceRank: number;
  readonly visualEnergy: number;
  readonly surfaceTone: ExecutiveObjectStateSurfaceToneToken;
  readonly surfaceAccent: string;
  readonly surfaceTint: number;
  readonly emissiveLift: number;
  readonly opacityFloor: number;
  readonly backgroundOpacityFloor: number;
  readonly backgroundOpacityCeiling: number;
  readonly roughnessBias: number;
  readonly metalnessBias: number;
  readonly edge: ExecutiveObjectStateEdgeModifier;
  readonly labelProminence: ExecutiveObjectStateLabelProminence;
  readonly labelTone: "object.label.primary" | "object.label.secondary" | "object.label.assist";
  readonly marker: ExecutiveObjectStateMarker;
  readonly markerIntensity: number;
  readonly recommendationCue: boolean;
};

// ─── Profiles / tokens / energy ─────────────────────────────────────────────

export const EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS = Object.freeze({
  maximumVisualEnergy: 0.82,
  maximumEmissiveLift: 0.22,
  maximumEdgeOpacity: 0.58,
  minimumProminenceRank: 0,
  maximumProminenceRank: 100,
});

export const EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY = Object.freeze({
  normalFloor: 0.34,
  watchFloor: 0.4,
  unresolvedFloor: 0.38,
  criticalFloor: 0.5,
  ceiling: 0.56,
});

/**
 * Central state visual profiles — not traffic-light body colors.
 * Surface is a bounded tint over SP:2.3 Nexora base.
 */
export const EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES = Object.freeze({
  normal: Object.freeze({
    surfaceTone: "object.surface.base" as const,
    surfaceAccent: "#8aa4b8",
    surfaceTint: 0.14,
    emissiveLift: 0.0,
    edgeColor: "#64748b",
    edgeOpacity: 0,
    edgeTone: "object.state.normal.edge" as const,
    prominenceRank: 20,
    energy: 0.08,
    roughnessBias: 0,
    metalnessBias: 0,
    labelProminence: "full" as const,
    marker: "none" as const,
    markerIntensity: 0,
  }),
  watch: Object.freeze({
    surfaceTone: "object.surface.watch" as const,
    surfaceAccent: "#c4a035",
    surfaceTint: 0.26,
    emissiveLift: 0.06,
    edgeColor: "#d4b45a",
    edgeOpacity: 0.32,
    edgeTone: "object.state.watch.edge" as const,
    prominenceRank: 55,
    energy: 0.32,
    roughnessBias: 0.01,
    metalnessBias: -0.02,
    labelProminence: "full" as const,
    marker: "attention" as const,
    markerIntensity: 0.32,
  }),
  critical: Object.freeze({
    surfaceTone: "object.surface.risk" as const,
    surfaceAccent: "#c07070",
    surfaceTint: 0.34,
    emissiveLift: 0.12,
    edgeColor: "#d08080",
    edgeOpacity: 0.48,
    edgeTone: "object.state.critical.edge" as const,
    prominenceRank: 85,
    energy: 0.55,
    roughnessBias: 0.02,
    metalnessBias: -0.04,
    labelProminence: "full" as const,
    marker: "critical" as const,
    markerIntensity: 0.55,
  }),
  unresolved: Object.freeze({
    surfaceTone: "object.surface.unresolved" as const,
    surfaceAccent: "#94a3b8",
    surfaceTint: 0.18,
    emissiveLift: 0.02,
    edgeColor: "#a8b4c4",
    edgeOpacity: 0.28,
    edgeTone: "object.state.unresolved.edge" as const,
    prominenceRank: 40,
    energy: 0.22,
    roughnessBias: 0.08,
    metalnessBias: -0.08,
    labelProminence: "full" as const,
    marker: "unresolved" as const,
    markerIntensity: 0.24,
  }),
});

export const EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL = Object.freeze({
  edgeColor: "#7eb8d4",
  edgeOpacity: 0.34,
  edgeTone: "object.attention.recommended.edge" as const,
  energy: 0.08,
  prominenceBoost: 6,
  markerIntensity: 0.28,
});

export const EXECUTIVE_OBJECT_STATE_SURFACE_TOKENS = Object.freeze({
  "object.state.normal.surface": "#8aa4b8",
  "object.state.watch.surface": "#c4a035",
  "object.state.critical.surface": "#c07070",
  "object.state.unresolved.surface": "#94a3b8",
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

export function resolveExecutiveObjectStatusClass(
  status: string | undefined,
): ExecutiveObjectStateVisualClass {
  switch (status) {
    case "watch":
      return "watch";
    case "risk":
      return "critical";
    case "unresolved":
      return "unresolved";
    case "stable":
    case undefined:
    case "":
      return "normal";
    default:
      // Unknown status degrades safely to normal — never guess from labels.
      return "normal";
  }
}

export function resolveExecutiveObjectAttentionLevel(
  attention: string | undefined,
): "normal" | "elevated" | "important" | "critical" {
  switch (attention) {
    case "elevated":
    case "important":
    case "critical":
      return attention;
    default:
      return "normal";
  }
}

/**
 * Compose status + attention into a visual class without merging the enums.
 * Unresolved status stays unresolved even if attention is elevated.
 * Attention critical can raise a non-unresolved status to critical.
 * Attention elevated/important can raise normal → watch.
 */
export function composeExecutiveObjectStateVisualClass(input: {
  readonly status?: string;
  readonly attention?: string;
  readonly stateMarker?: "none" | "attention" | "critical" | "unresolved";
}): ExecutiveObjectStateVisualClass {
  const statusClass = resolveExecutiveObjectStatusClass(input.status);
  if (statusClass === "unresolved" || input.stateMarker === "unresolved") {
    return "unresolved";
  }
  const attention = resolveExecutiveObjectAttentionLevel(input.attention);
  if (
    statusClass === "critical" ||
    attention === "critical" ||
    input.stateMarker === "critical"
  ) {
    return "critical";
  }
  if (
    statusClass === "watch" ||
    attention === "elevated" ||
    attention === "important" ||
    input.stateMarker === "attention"
  ) {
    return "watch";
  }
  return "normal";
}

function labelRank(value: ExecutiveObjectStateLabelProminence): number {
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
  a: ExecutiveObjectStateLabelProminence,
  b: ExecutiveObjectStateLabelProminence,
): ExecutiveObjectStateLabelProminence {
  return labelRank(a) >= labelRank(b) ? a : b;
}

function mixHex(a: string, b: string, t: number): string {
  const parse = (hex: string): readonly [number, number, number] => {
    const raw = hex.trim().replace("#", "");
    const full =
      raw.length === 3
        ? `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
        : raw.padEnd(6, "0").slice(0, 6);
    return [
      Number.parseInt(full.slice(0, 2), 16) || 0,
      Number.parseInt(full.slice(2, 4), 16) || 0,
      Number.parseInt(full.slice(4, 6), 16) || 0,
    ] as const;
  };
  const amount = clamp(t, 0, 1);
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const channel = (v: number): string =>
    Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${channel(ar + (br - ar) * amount)}${channel(ag + (bg - ag) * amount)}${channel(ab + (bb - ab) * amount)}`;
}

/**
 * Pure state/severity visual resolver. Framework-independent.
 * Does not mutate input. Does not change geometry, position, or business truth.
 */
export function resolveExecutiveObjectStateVisualPresentation(
  input: ExecutiveObjectStateVisualInput,
): ExecutiveObjectStateVisualPresentation {
  const statusClass = composeExecutiveObjectStateVisualClass({
    status: input.status,
    attention: input.attention,
    stateMarker: input.stateMarker,
  });
  const attentionLevel = resolveExecutiveObjectAttentionLevel(input.attention);
  const recommended = input.recommended === true;
  const spatialRole =
    input.spatialRole ?? (input.focused ? "focus" : "overview");
  const focused = input.focused === true;
  const hovered = input.hovered === true;
  const selected = input.selected === true;
  const occlusion = input.occlusionState ?? "clear";
  const profile = EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES[statusClass];
  const energyBounds = EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS;
  const opacityPolicy = EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY;

  let energy: number = profile.energy;
  if (attentionLevel === "elevated" && statusClass === "normal") energy += 0.08;
  if (attentionLevel === "important" && statusClass !== "critical") energy += 0.1;
  if (attentionLevel === "critical" && statusClass !== "critical") energy += 0.18;
  if (recommended) energy += EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.energy;
  if (focused || spatialRole === "focus") energy += 0.18;
  if (hovered && !focused) energy += 0.08;
  if (selected && !focused) energy += 0.06;
  if (occlusion !== "clear") energy += 0.04;
  const visualEnergy = stabilize(
    clamp(energy, 0, energyBounds.maximumVisualEnergy),
  );

  let prominenceRank: number = profile.prominenceRank;
  if (attentionLevel === "important") prominenceRank += 8;
  if (attentionLevel === "critical" && statusClass !== "critical") {
    prominenceRank += 10;
  }
  if (recommended) prominenceRank += EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.prominenceBoost;
  if (focused) prominenceRank += 5;
  prominenceRank = clamp(
    prominenceRank,
    energyBounds.minimumProminenceRank,
    energyBounds.maximumProminenceRank,
  );

  // Emissive lift is state/attention/recommendation only.
  // Spatial role + interaction remain SP:2.3 material DNA adjustments.
  let stateEmissive: number = profile.emissiveLift;
  if (attentionLevel === "elevated" && statusClass === "normal") {
    stateEmissive += 0.02;
  }
  if (attentionLevel === "important" && statusClass !== "critical") {
    stateEmissive += 0.03;
  }
  if (recommended) stateEmissive += 0.02;
  const emissiveLift = stabilize(
    clamp(stateEmissive, 0, energyBounds.maximumEmissiveLift),
  );

  const backgroundOpacityFloor =
    statusClass === "critical"
      ? opacityPolicy.criticalFloor
      : statusClass === "watch"
        ? opacityPolicy.watchFloor
        : statusClass === "unresolved"
          ? opacityPolicy.unresolvedFloor
          : opacityPolicy.normalFloor;

  const opacityFloor =
    spatialRole === "background" ? backgroundOpacityFloor : 0.28;

  let edgeMode: ExecutiveObjectStateEdgeModifier["mode"] = "none";
  let edgeTone: ExecutiveObjectStateEdgeToneToken = "object.state.normal.edge";
  let edgeColor: string = profile.edgeColor;
  let edgeOpacity: number = profile.edgeOpacity;
  let edgeStyle: "solid" | "uncertainty" = "solid";
  let extentScale = 1;

  if (statusClass === "critical") {
    edgeMode = "critical";
    edgeTone = "object.state.critical.edge";
    edgeOpacity = profile.edgeOpacity;
    extentScale = 1.2;
  } else if (statusClass === "watch") {
    edgeMode = "watch";
    edgeTone = "object.state.watch.edge";
    edgeOpacity = profile.edgeOpacity;
    extentScale = 1.16;
  } else if (statusClass === "unresolved") {
    edgeMode = "unresolved";
    edgeTone = "object.state.unresolved.edge";
    edgeOpacity = profile.edgeOpacity;
    edgeStyle = "uncertainty";
    extentScale = 1.14;
  } else if (recommended) {
    edgeMode = "recommended";
    edgeTone = "object.attention.recommended.edge";
    edgeColor = EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.edgeColor;
    edgeOpacity = EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.edgeOpacity;
    extentScale = 1.12;
  }

  if (recommended && statusClass === "critical") {
    edgeColor = mixHex(
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.critical.edgeColor,
      EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.edgeColor,
      0.18,
    );
  }

  if (hovered && !focused && edgeMode !== "none") {
    edgeOpacity = Math.min(energyBounds.maximumEdgeOpacity, edgeOpacity + 0.08);
    extentScale += 0.02;
  } else if (hovered && !focused && edgeMode === "none") {
    // Interaction-only hover is resolved in SP:2.1; no state edge invented.
  }
  if (selected && !focused && edgeMode !== "none") {
    edgeOpacity = Math.min(energyBounds.maximumEdgeOpacity, edgeOpacity + 0.04);
  }
  if (occlusion !== "clear" && edgeMode !== "none") {
    edgeOpacity = Math.max(edgeOpacity, occlusion === "substantial" ? 0.3 : 0.24);
  }

  const rim =
    typeof input.rimIntensity === "number" && Number.isFinite(input.rimIntensity)
      ? clamp(input.rimIntensity, 0, 1)
      : profile.markerIntensity;
  if (edgeMode !== "none" && rim > 0) {
    edgeOpacity = Math.max(
      edgeOpacity,
      clamp(0.18 + rim * 0.45, 0.12, energyBounds.maximumEdgeOpacity),
    );
  }

  edgeOpacity = stabilize(
    clamp(edgeOpacity, 0, energyBounds.maximumEdgeOpacity),
  );

  let marker: ExecutiveObjectStateMarker = profile.marker;
  if (recommended && marker === "none") marker = "recommended";
  const markerIntensity = stabilize(
    marker === "none" ? 0 : Math.max(profile.markerIntensity, recommended ? 0.28 : 0),
  );

  let labelProminence: ExecutiveObjectStateLabelProminence =
    profile.labelProminence;
  if (input.labelProminence) {
    labelProminence = maxLabelProminence(labelProminence, input.labelProminence);
  }
  if (
    statusClass === "critical" ||
    statusClass === "watch" ||
    statusClass === "unresolved" ||
    recommended ||
    focused
  ) {
    labelProminence = maxLabelProminence(labelProminence, "full");
  }
  if (spatialRole === "background" && statusClass === "normal" && !recommended) {
    labelProminence = input.labelProminence ?? "minimal";
  }

  const labelTone =
    focused ||
    hovered ||
    statusClass === "critical" ||
    recommended
      ? "object.label.primary"
      : spatialRole === "background"
        ? "object.label.secondary"
        : statusClass === "unresolved"
          ? "object.label.assist"
          : "object.label.primary";

  const edge: ExecutiveObjectStateEdgeModifier = Object.freeze({
    mode: edgeMode,
    tone: edgeTone,
    color: edgeColor,
    opacity: edgeOpacity,
    wireframe: edgeMode !== "none",
    extentScale: stabilize(extentScale),
    style: edgeStyle,
  });

  return Object.freeze({
    statusClass,
    attentionLevel,
    recommended,
    prominenceRank: stabilize(prominenceRank),
    visualEnergy,
    surfaceTone: profile.surfaceTone,
    surfaceAccent: profile.surfaceAccent,
    surfaceTint: profile.surfaceTint,
    emissiveLift,
    opacityFloor: stabilize(opacityFloor),
    backgroundOpacityFloor: stabilize(backgroundOpacityFloor),
    backgroundOpacityCeiling: opacityPolicy.ceiling,
    roughnessBias: profile.roughnessBias,
    metalnessBias: profile.metalnessBias,
    edge,
    labelProminence,
    labelTone,
    marker,
    markerIntensity,
    recommendationCue: recommended,
  });
}

export function verifyExecutiveObjectStateVisualHierarchy(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly severityOrdered: boolean;
  readonly unresolvedDistinct: boolean;
  readonly recommendationIndependent: boolean;
  readonly presentationOnly: boolean;
}> {
  const identity = getExecutiveObjectStateVisualHierarchyIdentity();
  const identityValid =
    identity.id === "SP:2.4/ExecutiveObjectStateVisualHierarchy" &&
    identity.version === "2.4.0" &&
    identity.upstreamVisualFoundation ===
      "SP:2.1/ExecutiveObjectVisualFoundation" &&
    identity.upstreamMaterialSurface ===
      "SP:2.3/ExecutiveObjectMaterialSurface";

  const boundaryValid =
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.ownsBusinessTruth ===
      false &&
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.introducesTrafficLightBodies ===
      false &&
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.changesGeometry === false &&
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.autoFocusesCritical ===
      false &&
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY
      .replacesVisualFoundationAuthority === false;

  const sample = Object.freeze({
    status: "risk",
    attention: "critical",
    spatialRole: "background" as const,
  });
  const a = resolveExecutiveObjectStateVisualPresentation(sample);
  const b = resolveExecutiveObjectStateVisualPresentation(sample);
  const deterministic = JSON.stringify(a) === JSON.stringify(b);

  const normal = resolveExecutiveObjectStateVisualPresentation({
    status: "stable",
  });
  const watch = resolveExecutiveObjectStateVisualPresentation({
    status: "watch",
  });
  const critical = resolveExecutiveObjectStateVisualPresentation({
    status: "risk",
    attention: "critical",
  });
  const severityOrdered =
    critical.prominenceRank > watch.prominenceRank &&
    watch.prominenceRank > normal.prominenceRank &&
    critical.visualEnergy > watch.visualEnergy;

  const unresolved = resolveExecutiveObjectStateVisualPresentation({
    status: "unresolved",
  });
  const unresolvedDistinct =
    unresolved.statusClass === "unresolved" &&
    unresolved.marker === "unresolved" &&
    unresolved.surfaceTone !== "object.surface.risk";

  const recommendedNormal = resolveExecutiveObjectStateVisualPresentation({
    status: "stable",
    recommended: true,
  });
  const recommendedCritical = resolveExecutiveObjectStateVisualPresentation({
    status: "risk",
    attention: "critical",
    recommended: true,
  });
  const recommendationIndependent =
    recommendedNormal.statusClass === "normal" &&
    recommendedNormal.recommendationCue === true &&
    recommendedCritical.statusClass === "critical" &&
    recommendedCritical.recommendationCue === true &&
    recommendedCritical.marker === "critical";

  const presentationOnly =
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.presentationOnly === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    severityOrdered &&
    unresolvedDistinct &&
    recommendationIndependent &&
    presentationOnly;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    severityOrdered,
    unresolvedDistinct,
    recommendationIndependent,
    presentationOnly,
  });
}
