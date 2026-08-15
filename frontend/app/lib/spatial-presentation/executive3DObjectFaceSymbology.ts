/**
 * STAGE-3DOBJ:2 — Executive Object Face Symbology & Surface Identity.
 *
 * Shape = kind silhouette (STAGE-3DOBJ:1)
 * Face symbol = semantic family mark
 * State = condition accent
 * Label = STAGE-LABEL:1 name
 *
 * Presentation only — local +Z surface language. No topology / camera / labels.
 */

import {
  resolveExecutiveObjectSemanticShapeFamily,
  type ExecutiveObjectSemanticShapeFamily,
} from "./executiveObjectPresenceIdentity.ts";
import type {
  Executive3DObjectExecutiveState,
  Executive3DObjectInteractionState,
  Executive3DObjectPresentationLevel,
  Executive3DObjectShapeFamily,
} from "./executive3DObjectVisualProfile.ts";
import {
  isExecutive3DObjectPremiumFormEnabled,
  isExecutive3DObjectSymbolVisible,
  resolveExecutivePremiumObjectForm,
} from "./executive3DObjectPremiumForm.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executive3DObjectFaceSymbologyIdentity =
  "STAGE-3DOBJ:2/Executive3DObjectFaceSymbologySurfaceIdentity" as const;

/** STAGE-3DOBJ:2-FIX — Face readability & material presence calibration. */
export const executive3DObjectFaceSymbologyFixIdentity =
  "STAGE-3DOBJ:2-FIX/ExecutiveFaceReadabilityMaterialPresence" as const;

export const executive3DObjectFaceSymbologyVersion = "1.1.0" as const;

export const executive3DObjectFaceSymbologyNamespace =
  "nexora.spatial-presentation.executive-3d-object-face-symbology" as const;

export const executive3DObjectFaceSymbologyPhase =
  "ExecutiveFaceReadabilityMaterialPresence" as const;

export const executive3DObjectFaceSymbologyArchitecturalRole =
  "PresentationOnlyExecutiveFaceSurfaceIdentity" as const;

export type Executive3DObjectFaceSymbologyIdentity = {
  readonly id: typeof executive3DObjectFaceSymbologyIdentity;
  readonly fixId: typeof executive3DObjectFaceSymbologyFixIdentity;
  readonly version: typeof executive3DObjectFaceSymbologyVersion;
  readonly namespace: typeof executive3DObjectFaceSymbologyNamespace;
  readonly phase: typeof executive3DObjectFaceSymbologyPhase;
  readonly architecturalRole: typeof executive3DObjectFaceSymbologyArchitecturalRole;
};

const IDENTITY: Executive3DObjectFaceSymbologyIdentity = Object.freeze({
  id: executive3DObjectFaceSymbologyIdentity,
  fixId: executive3DObjectFaceSymbologyFixIdentity,
  version: executive3DObjectFaceSymbologyVersion,
  namespace: executive3DObjectFaceSymbologyNamespace,
  phase: executive3DObjectFaceSymbologyPhase,
  architecturalRole: executive3DObjectFaceSymbologyArchitecturalRole,
});

export function getExecutive3DObjectFaceSymbologyIdentity(): Executive3DObjectFaceSymbologyIdentity {
  return IDENTITY;
}

export const EXECUTIVE_3D_OBJECT_FACE_BOUNDARY = Object.freeze({
  architecturalRole: executive3DObjectFaceSymbologyArchitecturalRole,
  changesSemanticZ: false as const,
  usesZForTopology: false as const,
  expandsHardSilhouette: false as const,
  stateReplacesSymbol: false as const,
  ownsLabels: false as const,
  appliesToThreadGateway: false as const,
  embedsKpiText: false as const,
  usesTextGlyphs: false as const,
  createsFocusShell: false as const,
  createsSelectionShell: false as const,
  movesCamera: false as const,
  inventsRelationships: false as const,
  /** Normalized face grid — symbols authored in [-1,+1]² then scaled. */
  faceCoordinateSystem: "normalized-face-grid-pm1" as const,
  geometryOrigin: "back-on-plane-front-toward-camera" as const,
});

export type Executive3DObjectSymbolKind =
  | "executive-mark"
  | "target-point"
  | "fracture-gap"
  | "facet-notch"
  | "branch-paths"
  | "convergence-choice"
  | "progress-segments"
  | "context-dot"
  | "none";

export type Executive3DObjectSymbolGeometry =
  | "central-mark"
  | "point-ring"
  | "split-segment"
  | "facet-notch"
  | "branch-fork"
  | "converge-select"
  | "triple-bar"
  | "dot"
  | "none";

export type Executive3DObjectSurfaceRole =
  | "body-side"
  | "front-face"
  | "face-symbol"
  | "edge-trim"
  | "state-accent";

export type Executive3DObjectStateMarker =
  | "none"
  | "warm-edge"
  | "critical-edge"
  | "incomplete-segment"
  | "positive-edge"
  | "focus-clarity"
  | "selection-outline";

export type Executive3DObjectSurfacePattern =
  | "plain"
  | "inset-panel"
  | "inset-panel-secondary"
  | "inset-panel-rich";

export type Executive3DObjectBevelLanguage =
  | "soft-precision"
  | "sharp"
  | "faceted"
  | "soft-layered"
  | "crisp-decisive"
  | "longitudinal"
  | "minimal";

/** Primitive drawn in normalized face space [-1,+1]. */
export type Executive3DObjectFacePrimitive =
  | {
      readonly type: "rect";
      readonly x: number;
      readonly y: number;
      readonly w: number;
      readonly h: number;
      readonly rx?: number;
    }
  | {
      readonly type: "circle";
      readonly x: number;
      readonly y: number;
      readonly r: number;
      readonly segments?: number;
    }
  | {
      readonly type: "ring";
      readonly x: number;
      readonly y: number;
      readonly inner: number;
      readonly outer: number;
      readonly segments?: number;
    }
  | {
      readonly type: "line";
      readonly x1: number;
      readonly y1: number;
      readonly x2: number;
      readonly y2: number;
      readonly thickness: number;
    }
  | {
      readonly type: "poly";
      readonly points: readonly (readonly [number, number])[];
    };

export type Executive3DObjectFaceSymbology = {
  readonly enabled: boolean;
  readonly contract: "stage-3dobj-2";
  readonly calibration: "stage-3dobj-2-fix";
  readonly shapeFamily: Executive3DObjectShapeFamily;
  readonly symbolKind: Executive3DObjectSymbolKind;
  readonly symbolGeometry: Executive3DObjectSymbolGeometry;
  readonly symbolScale: number;
  readonly symbolInset: number;
  /** Local relief above front face (toward camera). */
  readonly symbolDepth: number;
  readonly faceInset: number;
  readonly faceBorder: number;
  readonly stateMarker: Executive3DObjectStateMarker;
  readonly surfacePattern: Executive3DObjectSurfacePattern;
  readonly surfaceRole: Executive3DObjectSurfaceRole;
  readonly bevelLanguage: Executive3DObjectBevelLanguage;
  /** Slight bevel multiplier vs STAGE-3DOBJ:1 base (appearance only). */
  readonly bevelFactor: number;
  readonly safeZone: number;
  /** Estimated symbol footprint / usable front-face footprint. */
  readonly symbolBodyRatio: number;
  readonly symbolContrast: number;
  readonly minStroke: number;
  readonly primitives: readonly Executive3DObjectFacePrimitive[];
  readonly secondaryPrimitives: readonly Executive3DObjectFacePrimitive[];
  readonly meshBudget: Readonly<{
    readonly frontPlate: 1;
    readonly symbolParts: number;
    readonly edgeTrim: number;
    readonly maxExtraMeshes: number;
  }>;
  readonly expandsSilhouette: false;
};

export const EXECUTIVE_3D_OBJECT_FACE_OBSERVABILITY = Object.freeze({
  contract: "stage-3dobj-2" as const,
  calibration: "stage-3dobj-2-fix" as const,
});

/** Max symbol relief above front face — Z-fight avoidance only. */
export const MAX_EXECUTIVE_3D_OBJECT_SYMBOL_RELIEF = 0.01;

/**
 * Safe inset from face edge (normalized 0–1 of half-extent).
 * STAGE-3DOBJ:2-FIX: slightly opened for readable symbol area while retaining margin.
 */
export const EXECUTIVE_3D_OBJECT_FACE_SAFE_ZONE = 0.18;

/**
 * Minimum symbol scale floor at Stage camera distance.
 * Minimum presentation uses the strongest/simple mark — not the weakest.
 */
export const MIN_EXECUTIVE_FACE_SYMBOL_SCALE = 1.08;

/** Minimum normalized stroke thickness (lines must survive AA at Stage scale). */
export const MIN_FACE_SYMBOL_STROKE = 0.11;

/** Target symbol footprint vs usable front face (Business band ~18–32%). */
export const EXECUTIVE_FACE_SYMBOL_BODY_RATIO = Object.freeze({
  min: 0.18,
  target: 0.26,
  max: 0.34,
} as const);

/** Territory must support body — not dominate it. */
export const MAX_TERRITORY_DOMINANCE = 0.55;

/** Dev toggle — ?obj3dSurface=0|1 */
let object3DSurfaceEnabled = true;

export function setExecutive3DObjectSurfaceEnabled(enabled: boolean): void {
  object3DSurfaceEnabled = enabled === true;
}

function readObject3DSurfaceQueryOverride(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const flag =
      params.get("obj3dSurface") ??
      params.get("object3dSurface") ??
      params.get("stage3dobjSurface");
    if (flag === "0" || flag === "off" || flag === "false") return false;
    if (flag === "1" || flag === "on" || flag === "true") return true;
  } catch {
    return null;
  }
  return null;
}

export function isExecutive3DObjectSurfaceEnabled(): boolean {
  const query = readObject3DSurfaceQueryOverride();
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_STAGE_3DOBJ_SURFACE;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return object3DSurfaceEnabled;
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function mapFamily(
  family: ExecutiveObjectSemanticShapeFamily,
): Executive3DObjectShapeFamily {
  return family;
}

export function resolveExecutive3DObjectSymbolKind(
  family: Executive3DObjectShapeFamily,
): Executive3DObjectSymbolKind {
  switch (family) {
    case "goal":
      return "target-point";
    case "problem":
      return "fracture-gap";
    case "risk":
      return "facet-notch";
    case "scenario":
      return "branch-paths";
    case "decision":
      return "convergence-choice";
    case "execution":
      return "progress-segments";
    case "context":
      return "context-dot";
    case "business-object":
    default:
      return "executive-mark";
  }
}

export function resolveExecutive3DObjectSymbolGeometry(
  symbolKind: Executive3DObjectSymbolKind,
): Executive3DObjectSymbolGeometry {
  switch (symbolKind) {
    case "target-point":
      return "point-ring";
    case "fracture-gap":
      return "split-segment";
    case "facet-notch":
      return "facet-notch";
    case "branch-paths":
      return "branch-fork";
    case "convergence-choice":
      return "converge-select";
    case "progress-segments":
      return "triple-bar";
    case "context-dot":
      return "dot";
    case "none":
      return "none";
    case "executive-mark":
    default:
      return "central-mark";
  }
}

function bevelLanguageFor(
  family: Executive3DObjectShapeFamily,
): Executive3DObjectBevelLanguage {
  switch (family) {
    case "problem":
      return "sharp";
    case "risk":
      return "faceted";
    case "scenario":
      return "soft-layered";
    case "decision":
      return "crisp-decisive";
    case "execution":
      return "longitudinal";
    case "context":
      return "minimal";
    case "goal":
      return "soft-precision";
    case "business-object":
    default:
      return "soft-precision";
  }
}

function bevelFactorFor(language: Executive3DObjectBevelLanguage): number {
  switch (language) {
    case "sharp":
      return 0.62;
    case "faceted":
      return 0.88;
    case "soft-layered":
      return 1.14;
    case "crisp-decisive":
      return 0.95;
    case "longitudinal":
      return 1.02;
    case "minimal":
      return 0.45;
    case "soft-precision":
    default:
      // STAGE-3DOBJ:2-FIX — more perceptible industrial bevel from front camera.
      return 1.22;
  }
}

function stateMarkerFor(input: {
  readonly interaction: Executive3DObjectInteractionState;
  readonly executiveState: Executive3DObjectExecutiveState;
}): Executive3DObjectStateMarker {
  if (input.interaction === "focused") return "focus-clarity";
  if (input.interaction === "selected") return "selection-outline";
  if (input.executiveState === "critical") return "critical-edge";
  if (input.executiveState === "watch") return "warm-edge";
  if (input.executiveState === "unresolved") return "incomplete-segment";
  if (input.executiveState === "recommended") return "positive-edge";
  return "none";
}

function enforceMinStroke(thickness: number): number {
  return Math.max(thickness, MIN_FACE_SYMBOL_STROKE);
}

/**
 * Normalized-face primitives for each semantic family.
 * STAGE-3DOBJ:2-FIX — fewer, thicker marks for Stage-camera readability.
 * Authored in [-1,+1]²; renderer scales into safe zone.
 */
export function resolveExecutive3DObjectFacePrimitives(
  symbolKind: Executive3DObjectSymbolKind,
  level: Executive3DObjectPresentationLevel,
): {
  readonly primary: readonly Executive3DObjectFacePrimitive[];
  readonly secondary: readonly Executive3DObjectFacePrimitive[];
} {
  const rich = level === "operation";
  const report = level === "report" || rich;
  // Minimum = glance mode: strongest simple primary, no micro-detail.

  switch (symbolKind) {
    case "executive-mark": {
      // Larger central plate + wide structural bar (not a tiny square-on-square).
      const primary: Executive3DObjectFacePrimitive[] = [
        { type: "rect", x: 0, y: 0, w: 0.52, h: 0.52, rx: 0.08 },
        {
          type: "line",
          x1: -0.62,
          y1: 0,
          x2: 0.62,
          y2: 0,
          thickness: enforceMinStroke(0.14),
        },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = report
        ? [
            {
              type: "line",
              x1: 0,
              y1: -0.5,
              x2: 0,
              y2: 0.5,
              thickness: enforceMinStroke(0.09),
            },
          ]
        : [];
      if (rich) {
        secondary.push({
          type: "rect",
          x: 0,
          y: 0,
          w: 0.22,
          h: 0.22,
          rx: 0.04,
        });
      }
      return { primary, secondary };
    }
    case "target-point": {
      const primary: Executive3DObjectFacePrimitive[] = [
        { type: "circle", x: 0, y: 0, r: 0.16, segments: 28 },
        {
          type: "ring",
          x: 0,
          y: 0,
          inner: 0.34,
          outer: 0.48,
          segments: 40,
        },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = report
        ? [
            {
              type: "line",
              x1: 0,
              y1: 0.5,
              x2: 0,
              y2: 0.68,
              thickness: enforceMinStroke(0.1),
            },
          ]
        : [];
      return { primary, secondary };
    }
    case "fracture-gap": {
      // Wider gap, thicker bars — readable interrupted plane.
      const primary: Executive3DObjectFacePrimitive[] = [
        {
          type: "line",
          x1: -0.68,
          y1: 0.12,
          x2: -0.16,
          y2: 0.12,
          thickness: enforceMinStroke(0.16),
        },
        {
          type: "line",
          x1: 0.16,
          y1: -0.12,
          x2: 0.68,
          y2: -0.12,
          thickness: enforceMinStroke(0.16),
        },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = report
        ? [
            {
              type: "line",
              x1: -0.1,
              y1: 0.28,
              x2: 0.1,
              y2: -0.28,
              thickness: enforceMinStroke(0.08),
            },
          ]
        : [];
      return { primary, secondary };
    }
    case "facet-notch": {
      // Keep Risk clarity — slightly larger facet (regression benchmark).
      const primary: Executive3DObjectFacePrimitive[] = [
        {
          type: "poly",
          points: [
            [0, 0.42],
            [0.34, 0],
            [0, -0.42],
            [-0.34, 0],
          ],
        },
        {
          type: "poly",
          points: [
            [0, 0.66],
            [0.16, 0.44],
            [-0.16, 0.44],
          ],
        },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = report
        ? [{ type: "circle", x: 0, y: 0, r: 0.09, segments: 12 }]
        : [];
      return { primary, secondary };
    }
    case "branch-paths": {
      // One origin → two clearly separated paths (fewer thicker strokes).
      const primary: Executive3DObjectFacePrimitive[] = [
        { type: "circle", x: -0.42, y: 0, r: 0.14, segments: 20 },
        {
          type: "line",
          x1: -0.3,
          y1: 0,
          x2: 0.2,
          y2: 0.38,
          thickness: enforceMinStroke(0.13),
        },
        {
          type: "line",
          x1: -0.3,
          y1: 0,
          x2: 0.2,
          y2: -0.38,
          thickness: enforceMinStroke(0.13),
        },
        { type: "circle", x: 0.38, y: 0.38, r: 0.12, segments: 18 },
        { type: "circle", x: 0.38, y: -0.38, r: 0.12, segments: 18 },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = rich
        ? [
            {
              type: "line",
              x1: 0.2,
              y1: 0.38,
              x2: 0.3,
              y2: 0.38,
              thickness: enforceMinStroke(0.09),
            },
            {
              type: "line",
              x1: 0.2,
              y1: -0.38,
              x2: 0.3,
              y2: -0.38,
              thickness: enforceMinStroke(0.09),
            },
          ]
        : [];
      return { primary, secondary };
    }
    case "convergence-choice": {
      const primary: Executive3DObjectFacePrimitive[] = [
        {
          type: "line",
          x1: -0.55,
          y1: 0.42,
          x2: 0.02,
          y2: 0,
          thickness: enforceMinStroke(0.13),
        },
        {
          type: "line",
          x1: -0.55,
          y1: -0.42,
          x2: 0.02,
          y2: 0,
          thickness: enforceMinStroke(0.13),
        },
        {
          type: "line",
          x1: 0.02,
          y1: 0,
          x2: 0.55,
          y2: 0,
          thickness: enforceMinStroke(0.16),
        },
        {
          type: "poly",
          points: [
            [0.68, 0],
            [0.42, 0.16],
            [0.42, -0.16],
          ],
        },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = report
        ? [{ type: "circle", x: 0.02, y: 0, r: 0.1, segments: 14 }]
        : [];
      return { primary, secondary };
    }
    case "progress-segments": {
      const primary: Executive3DObjectFacePrimitive[] = [
        {
          type: "line",
          x1: -0.62,
          y1: 0,
          x2: -0.22,
          y2: 0,
          thickness: enforceMinStroke(0.18),
        },
        {
          type: "line",
          x1: -0.1,
          y1: 0,
          x2: 0.28,
          y2: 0,
          thickness: enforceMinStroke(0.18),
        },
        {
          type: "line",
          x1: 0.4,
          y1: 0,
          x2: 0.68,
          y2: 0,
          thickness: enforceMinStroke(0.18),
        },
      ];
      const secondary: Executive3DObjectFacePrimitive[] = report
        ? [
            {
              type: "poly",
              points: [
                [0.78, 0],
                [0.58, 0.16],
                [0.58, -0.16],
              ],
            },
          ]
        : [];
      return { primary, secondary };
    }
    case "context-dot":
      return {
        primary: [{ type: "circle", x: 0, y: 0, r: 0.16, segments: 16 }],
        secondary: [],
      };
    case "none":
    default:
      return { primary: [], secondary: [] };
  }
}

function estimateSymbolBodyRatio(
  primitives: readonly Executive3DObjectFacePrimitive[],
  symbolScale: number,
  safeZone: number,
): number {
  let span = 0.2;
  for (const p of primitives) {
    if (p.type === "rect") {
      span = Math.max(span, Math.max(p.w, p.h) * 2);
    } else if (p.type === "circle") {
      span = Math.max(span, p.r * 2);
    } else if (p.type === "ring") {
      span = Math.max(span, p.outer * 2);
    } else if (p.type === "line") {
      span = Math.max(
        span,
        Math.hypot(p.x2 - p.x1, p.y2 - p.y1),
        p.thickness * 2,
      );
    } else if (p.type === "poly") {
      const xs = p.points.map((pt) => pt[0]);
      const ys = p.points.map((pt) => pt[1]);
      span = Math.max(
        span,
        Math.max(...xs) - Math.min(...xs),
        Math.max(...ys) - Math.min(...ys),
      );
    }
  }
  const usable = Math.max(0.01, 1 - safeZone);
  const ratio = (span * 0.5 * symbolScale) / usable;
  return stabilize(
    Math.min(
      EXECUTIVE_FACE_SYMBOL_BODY_RATIO.max + 0.04,
      Math.max(EXECUTIVE_FACE_SYMBOL_BODY_RATIO.min * 0.85, ratio * 0.55),
    ),
  );
}

function resolveSymbolScale(input: {
  readonly family: Executive3DObjectShapeFamily;
  readonly level: Executive3DObjectPresentationLevel;
}): number {
  const { family, level } = input;
  if (family === "context") return 0.42;

  // STAGE-3DOBJ:3 — form-first: symbols subordinate when premium form is ON.
  if (isExecutive3DObjectPremiumFormEnabled()) {
    const form = resolveExecutivePremiumObjectForm({
      objectKind: family === "business-object" ? "object" : family,
      presentationLevel: level,
      enabled: true,
    });
    const base =
      family === "execution"
        ? 0.58
        : family === "decision"
          ? 0.56
          : family === "business-object"
            ? 0.54
            : family === "goal"
              ? 0.5
              : 0.55;
    return stabilize(base * form.symbolScaleFactor);
  }

  // STAGE-3DOBJ:2-FIX path (form OFF) — glance-mode readable floors.
  const levelBoost =
    level === "minimum" ? 1.14 : level === "report" ? 1.08 : 1.04;
  const familyBase =
    family === "execution"
      ? 1.12
      : family === "decision"
        ? 1.1
        : family === "business-object"
          ? 1.12
          : family === "problem"
            ? 1.1
            : family === "scenario"
              ? 1.08
              : family === "risk"
                ? 1.06
                : family === "goal"
                  ? 0.95
                  : 1.05;
  return stabilize(
    Math.max(MIN_EXECUTIVE_FACE_SYMBOL_SCALE, familyBase * levelBoost),
  );
}

/**
 * Canonical STAGE-3DOBJ:2 (+2-FIX) face symbology resolver.
 * Appearance only — never position / relationships / semantic Z / labels.
 */
export function resolveExecutive3DObjectFaceSymbology(input: {
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
  readonly executiveState?: Executive3DObjectExecutiveState;
  readonly interactionState?: Executive3DObjectInteractionState;
  readonly enabled?: boolean;
}): Executive3DObjectFaceSymbology {
  const enabled =
    (input.enabled ?? isExecutive3DObjectSurfaceEnabled()) &&
    isExecutive3DObjectSymbolVisible();
  const level = input.presentationLevel ?? "minimum";
  const interaction = input.interactionState ?? "overview";
  const executiveState = input.executiveState ?? "normal";

  const shapeFamily = mapFamily(
    resolveExecutiveObjectSemanticShapeFamily(input.objectKind),
  );
  const symbolKind = resolveExecutive3DObjectSymbolKind(shapeFamily);
  const symbolGeometry = resolveExecutive3DObjectSymbolGeometry(symbolKind);
  const bevelLanguage = bevelLanguageFor(shapeFamily);
  const primitives = resolveExecutive3DObjectFacePrimitives(symbolKind, level);

  const surfacePattern: Executive3DObjectSurfacePattern =
    !enabled || shapeFamily === "context"
      ? "plain"
      : level === "operation"
        ? "inset-panel-rich"
        : level === "report"
          ? "inset-panel-secondary"
          : "inset-panel";

  const symbolScale = enabled
    ? resolveSymbolScale({ family: shapeFamily, level })
    : 0;

  const faceInset =
    !enabled || shapeFamily === "context"
      ? 0
      : level === "operation"
        ? 0.14
        : level === "report"
          ? 0.12
          : 0.11;

  const symbolDepth = enabled
    ? stabilize(
        Math.min(
          level === "operation" ? 0.008 : level === "report" ? 0.0065 : 0.0055,
          MAX_EXECUTIVE_3D_OBJECT_SYMBOL_RELIEF,
        ),
      )
    : 0;

  const symbolParts =
    primitives.primary.length +
    (level === "minimum" ? 0 : primitives.secondary.length);
  const edgeTrim = enabled && shapeFamily !== "context" ? 1 : 0;

  const stateMarker = enabled
    ? stateMarkerFor({ interaction, executiveState })
    : "none";

  const symbolBodyRatio = enabled
    ? estimateSymbolBodyRatio(
        primitives.primary,
        symbolScale,
        EXECUTIVE_3D_OBJECT_FACE_SAFE_ZONE,
      )
    : 0;

  // Restrained symbol-vs-face contrast — further reduced under premium form.
  let symbolContrast = isExecutive3DObjectPremiumFormEnabled() ? 0.28 : 0.42;
  if (stateMarker === "incomplete-segment") symbolContrast *= 0.85;
  if (stateMarker === "critical-edge") symbolContrast = Math.min(0.4, symbolContrast + 0.06);
  if (stateMarker === "focus-clarity") symbolContrast = Math.min(0.42, symbolContrast + 0.08);
  if (isExecutive3DObjectPremiumFormEnabled()) {
    const form = resolveExecutivePremiumObjectForm({
      objectKind: input.objectKind,
      presentationLevel: level,
      enabled: true,
    });
    symbolContrast = stabilize(symbolContrast * form.symbolContrastFactor);
  }

  return Object.freeze({
    enabled,
    contract: "stage-3dobj-2",
    calibration: "stage-3dobj-2-fix",
    shapeFamily,
    symbolKind: enabled ? symbolKind : "none",
    symbolGeometry: enabled ? symbolGeometry : "none",
    symbolScale: stabilize(symbolScale),
    symbolInset: EXECUTIVE_3D_OBJECT_FACE_SAFE_ZONE,
    symbolDepth,
    faceInset: stabilize(faceInset),
    faceBorder: enabled && shapeFamily !== "context" ? 0.048 : 0,
    stateMarker,
    surfacePattern,
    surfaceRole: "face-symbol" as const,
    bevelLanguage,
    bevelFactor: bevelFactorFor(bevelLanguage),
    safeZone: EXECUTIVE_3D_OBJECT_FACE_SAFE_ZONE,
    symbolBodyRatio,
    symbolContrast: stabilize(symbolContrast),
    minStroke: MIN_FACE_SYMBOL_STROKE,
    primitives: enabled ? primitives.primary : Object.freeze([]),
    secondaryPrimitives:
      enabled && level !== "minimum"
        ? primitives.secondary
        : Object.freeze([]),
    meshBudget: Object.freeze({
      frontPlate: 1 as const,
      symbolParts,
      edgeTrim,
      maxExtraMeshes: 1 + symbolParts + edgeTrim,
    }),
    expandsSilhouette: false as const,
  });
}

/**
 * STAGE-3DOBJ:2-FIX — presentation-only surface readability diagnostic.
 */
export function resolveExecutive3DObjectSurfaceReadability(input: {
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
  readonly executiveState?: Executive3DObjectExecutiveState;
  readonly interactionState?: Executive3DObjectInteractionState;
  readonly faceWidth?: number;
  readonly faceHeight?: number;
  readonly territoryOpacity?: number;
  readonly enabled?: boolean;
}): Readonly<{
  readonly projectedBodyArea: number;
  readonly projectedSymbolArea: number;
  readonly symbolToBodyRatio: number;
  readonly territoryToBodyContrast: number;
  readonly surfaceContrastBand: number;
  readonly readabilityStatus: "readable" | "marginal" | "weak" | "off";
  readonly meetsSymbolFloor: boolean;
  readonly meetsStrokeFloor: boolean;
  readonly territoryDominanceOk: boolean;
}> {
  const face = resolveExecutive3DObjectFaceSymbology(input);
  const formOn = isExecutive3DObjectPremiumFormEnabled();
  if (!face.enabled) {
    return Object.freeze({
      projectedBodyArea: 0,
      projectedSymbolArea: 0,
      symbolToBodyRatio: 0,
      territoryToBodyContrast: 0,
      surfaceContrastBand: 0,
      readabilityStatus: "off" as const,
      meetsSymbolFloor: false,
      meetsStrokeFloor: false,
      territoryDominanceOk: true,
    });
  }
  const fw = input.faceWidth ?? 1;
  const fh = input.faceHeight ?? 1;
  const bodyArea = Math.max(0.01, fw * fh);
  const symbolArea = bodyArea * face.symbolBodyRatio;
  const territoryOpacity = input.territoryOpacity ?? 0;
  const territoryDominance = territoryOpacity / Math.max(face.symbolContrast, 0.01);
  const meetsSymbolFloor = formOn
    ? face.symbolScale >= 0.18
    : face.symbolScale >= MIN_EXECUTIVE_FACE_SYMBOL_SCALE - 0.001 ||
      face.shapeFamily === "context" ||
      face.shapeFamily === "goal";
  const businessReadable =
    face.shapeFamily !== "business-object" ||
    (formOn
      ? face.symbolBodyRatio <= 0.22 && face.symbolBodyRatio >= 0.05
      : face.symbolBodyRatio >= EXECUTIVE_FACE_SYMBOL_BODY_RATIO.min);
  const territoryDominanceOk = territoryDominance <= MAX_TERRITORY_DOMINANCE;
  const meetsStrokeFloor = face.minStroke >= MIN_FACE_SYMBOL_STROKE - 0.001;
  let readabilityStatus: "readable" | "marginal" | "weak" | "off" = "readable";
  if (!businessReadable || (!formOn && face.symbolBodyRatio < EXECUTIVE_FACE_SYMBOL_BODY_RATIO.min * 0.9)) {
    readabilityStatus = "weak";
  } else if (!territoryDominanceOk || face.symbolContrast < (formOn ? 0.12 : 0.32)) {
    readabilityStatus = "marginal";
  }
  return Object.freeze({
    projectedBodyArea: stabilize(bodyArea),
    projectedSymbolArea: stabilize(symbolArea),
    symbolToBodyRatio: face.symbolBodyRatio,
    territoryToBodyContrast: stabilize(territoryDominance),
    surfaceContrastBand: face.symbolContrast,
    readabilityStatus,
    meetsSymbolFloor: meetsSymbolFloor && businessReadable,
    meetsStrokeFloor,
    territoryDominanceOk,
  });
}

export function getExecutive3DObjectFaceSymbologyObservability(input?: {
  readonly enabled?: boolean;
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
  readonly territoryOpacity?: number;
}): Readonly<{
  readonly contract: string;
  readonly calibration: string;
  readonly enabled: string;
  readonly symbolKind: string;
  readonly surfaceRole: string;
  readonly symbolDepth: string;
  readonly symbolScale: string;
  readonly faceInset: string;
  readonly faceReadability: string;
  readonly symbolBodyRatio: string;
  readonly symbolContrast: string;
  readonly territoryDominance: string;
}> {
  const enabled = input?.enabled ?? isExecutive3DObjectSurfaceEnabled();
  const face = resolveExecutive3DObjectFaceSymbology({
    objectKind: input?.objectKind ?? "object",
    presentationLevel: input?.presentationLevel ?? "minimum",
    enabled,
  });
  const readability = resolveExecutive3DObjectSurfaceReadability({
    objectKind: input?.objectKind ?? "object",
    presentationLevel: input?.presentationLevel ?? "minimum",
    territoryOpacity: input?.territoryOpacity,
    enabled,
  });
  return Object.freeze({
    contract: EXECUTIVE_3D_OBJECT_FACE_OBSERVABILITY.contract,
    calibration: EXECUTIVE_3D_OBJECT_FACE_OBSERVABILITY.calibration,
    enabled: enabled ? "true" : "false",
    symbolKind: face.symbolKind,
    surfaceRole: face.surfaceRole,
    symbolDepth: String(face.symbolDepth),
    symbolScale: String(face.symbolScale),
    faceInset: String(face.faceInset),
    faceReadability: readability.readabilityStatus,
    symbolBodyRatio: String(readability.symbolToBodyRatio),
    symbolContrast: String(readability.surfaceContrastBand),
    territoryDominance: String(readability.territoryToBodyContrast),
  });
}

export function verifyExecutive3DObjectFaceSymbology(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly symbolsDistinct: boolean;
  readonly statePreservesSymbol: boolean;
  readonly depthSafe: boolean;
  readonly readabilityFloor: boolean;
}> {
  const identity = getExecutive3DObjectFaceSymbologyIdentity();
  const identityValid =
    identity.id ===
      "STAGE-3DOBJ:2/Executive3DObjectFaceSymbologySurfaceIdentity" &&
    identity.fixId ===
      "STAGE-3DOBJ:2-FIX/ExecutiveFaceReadabilityMaterialPresence" &&
    identity.version === "1.1.0";

  const kinds = [
    "object",
    "goal",
    "problem",
    "risk",
    "scenario",
    "decision",
    "execution",
  ].map(
    (k) =>
      resolveExecutive3DObjectFaceSymbology({
        objectKind: k,
        enabled: true,
      }).symbolKind,
  );
  const symbolsDistinct = new Set(kinds).size === kinds.length;

  const normal = resolveExecutive3DObjectFaceSymbology({
    objectKind: "decision",
    executiveState: "normal",
    enabled: true,
  });
  const critical = resolveExecutive3DObjectFaceSymbology({
    objectKind: "decision",
    executiveState: "critical",
    enabled: true,
  });
  const statePreservesSymbol = normal.symbolKind === critical.symbolKind;

  const depthSafe = [
    "object",
    "risk",
    "decision",
    "execution",
  ].every((k) => {
    const face = resolveExecutive3DObjectFaceSymbology({
      objectKind: k,
      presentationLevel: "operation",
      enabled: true,
    });
    return face.symbolDepth <= MAX_EXECUTIVE_3D_OBJECT_SYMBOL_RELIEF;
  });

  const businessMin = resolveExecutive3DObjectFaceSymbology({
    objectKind: "object",
    presentationLevel: "minimum",
    enabled: true,
  });
  // 2-FIX floors apply when premium form is OFF; form-first uses subordinate symbols.
  const formOn = isExecutive3DObjectPremiumFormEnabled();
  const readabilityFloor = formOn
    ? businessMin.symbolScale > 0.18 &&
      businessMin.symbolScale < 0.55 &&
      businessMin.minStroke >= MIN_FACE_SYMBOL_STROKE * 0.55
    : businessMin.symbolScale >= MIN_EXECUTIVE_FACE_SYMBOL_SCALE &&
      businessMin.symbolBodyRatio >= EXECUTIVE_FACE_SYMBOL_BODY_RATIO.min &&
      businessMin.minStroke >= MIN_FACE_SYMBOL_STROKE;

  return Object.freeze({
    ok:
      identityValid &&
      symbolsDistinct &&
      statePreservesSymbol &&
      depthSafe &&
      readabilityFloor &&
      EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.changesSemanticZ === false &&
      EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.ownsLabels === false &&
      EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.embedsKpiText === false &&
      EXECUTIVE_3D_OBJECT_FACE_BOUNDARY.usesTextGlyphs === false,
    identityValid,
    symbolsDistinct,
    statePreservesSymbol,
    depthSafe,
    readabilityFloor,
  });
}
