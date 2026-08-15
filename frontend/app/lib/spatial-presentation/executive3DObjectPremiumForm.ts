/**
 * STAGE-3DOBJ:3 — Premium Executive Object Form Language.
 *
 * Hierarchy: FORM > SURFACE > EDGE/MATERIAL > SYMBOL > STATE
 *
 * Form first, symbol second. Presentation only — local +Z.
 * Topology / camera / labels / relationships unchanged.
 */

import {
  resolveExecutiveObjectSemanticShapeFamily,
  type ExecutiveObjectSemanticShapeFamily,
} from "./executiveObjectPresenceIdentity.ts";
import type {
  Executive3DObjectInteractionState,
  Executive3DObjectPresentationLevel,
  Executive3DObjectShapeFamily,
} from "./executive3DObjectVisualProfile.ts";
import {
  EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL,
  MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH,
} from "./executive3DObjectVisualProfile.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executive3DObjectPremiumFormIdentity =
  "STAGE-3DOBJ:3/PremiumExecutiveObjectFormLanguage" as const;

export const executive3DObjectPremiumFormVersion = "1.0.0" as const;

export const executive3DObjectPremiumFormNamespace =
  "nexora.spatial-presentation.executive-3d-object-premium-form" as const;

export const executive3DObjectPremiumFormPhase =
  "PremiumExecutiveObjectFormLanguage" as const;

export const executive3DObjectPremiumFormArchitecturalRole =
  "PresentationOnlyPremiumObjectForm" as const;

export type Executive3DObjectPremiumFormIdentity = {
  readonly id: typeof executive3DObjectPremiumFormIdentity;
  readonly version: typeof executive3DObjectPremiumFormVersion;
  readonly namespace: typeof executive3DObjectPremiumFormNamespace;
  readonly phase: typeof executive3DObjectPremiumFormPhase;
  readonly architecturalRole: typeof executive3DObjectPremiumFormArchitecturalRole;
};

const IDENTITY: Executive3DObjectPremiumFormIdentity = Object.freeze({
  id: executive3DObjectPremiumFormIdentity,
  version: executive3DObjectPremiumFormVersion,
  namespace: executive3DObjectPremiumFormNamespace,
  phase: executive3DObjectPremiumFormPhase,
  architecturalRole: executive3DObjectPremiumFormArchitecturalRole,
});

export function getExecutive3DObjectPremiumFormIdentity(): Executive3DObjectPremiumFormIdentity {
  return IDENTITY;
}

export const EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY = Object.freeze({
  architecturalRole: executive3DObjectPremiumFormArchitecturalRole,
  changesSemanticZ: false as const,
  usesZForTopology: false as const,
  stateModifiesForm: false as const,
  createsFocusShell: false as const,
  createsSelectionShell: false as const,
  ownsLabels: false as const,
  appliesToThreadGateway: false as const,
  movesCamera: false as const,
  inventsRelationships: false as const,
  usesImportedAssets: false as const,
  geometryOrigin: "back-on-plane-front-toward-camera" as const,
  visualHierarchy: "form>surface>edge>symbol>state" as const,
});

export type ExecutivePremiumBodyProfile =
  | "precision-executive-plate"
  | "target-puck"
  | "constrained-angular-plate"
  | "faceted-diamond"
  | "layered-soft-hex"
  | "decisive-hex-plate"
  | "operational-plate"
  | "subordinate-plate"
  | "legacy-slab";

export type ExecutivePremiumBevelProfile =
  | "soft-precision-chamfer"
  | "sharp-constrained"
  | "faceted"
  | "soft-layered"
  | "crisp-structural"
  | "longitudinal"
  | "minimal";

export type ExecutivePremiumRecessProfile =
  | "machined-rounded-inset"
  | "shape-matched-inset"
  | "stepped-nested"
  | "center-focus"
  | "none";

export type ExecutivePremiumEdgeProfile =
  | "narrow-highlight"
  | "sharp-line"
  | "faceted-rim"
  | "soft-rim"
  | "structural-rim"
  | "directional-seam"
  | "quiet";

export type ExecutivePremiumSurfaceProfile =
  | "anodized-executive"
  | "satin-instrument"
  | "matte-constrained"
  | "faceted-instrument"
  | "soft-exploratory"
  | "crisp-decision"
  | "operational-composite"
  | "subordinate-matte";

export type ExecutivePremiumSignatureDetail =
  | "none"
  | "side-seam"
  | "edge-notch"
  | "longitudinal-slot";

export type ExecutivePremiumObjectForm = {
  readonly enabled: boolean;
  readonly contract: "stage-3dobj-3";
  readonly shapeFamily: Executive3DObjectShapeFamily;
  readonly bodyProfile: ExecutivePremiumBodyProfile;
  readonly aspectRatio: number;
  readonly depth: number;
  readonly frontScale: number;
  readonly rearScale: 1;
  readonly taper: number;
  readonly cornerRadius: number;
  readonly bevelProfile: ExecutivePremiumBevelProfile;
  readonly bevelSize: number;
  readonly recessProfile: ExecutivePremiumRecessProfile;
  readonly recessInset: number;
  readonly recessDepth: number;
  readonly edgeProfile: ExecutivePremiumEdgeProfile;
  readonly surfaceProfile: ExecutivePremiumSurfaceProfile;
  readonly signatureDetail: ExecutivePremiumSignatureDetail;
  readonly symbolScaleFactor: number;
  readonly symbolContrastFactor: number;
  readonly isGenericCube: false;
  readonly silhouettePadBoost: number;
  readonly backZ: 0;
  readonly frontZ: number;
  readonly centerZ: number;
};

export const EXECUTIVE_3D_OBJECT_PREMIUM_FORM_OBSERVABILITY = Object.freeze({
  contract: "stage-3dobj-3" as const,
});

/** Symbol footprint guideline under premium form (~8–18% usable face). */
export const PREMIUM_FORM_SYMBOL_BODY_RATIO = Object.freeze({
  min: 0.08,
  target: 0.13,
  max: 0.18,
} as const);

/** Dev toggle — ?obj3dForm=0|1 */
let premiumFormEnabled = true;
let formRuntimeEpoch = 0;
const formRuntimeListeners = new Set<() => void>();

export function setExecutive3DObjectPremiumFormEnabled(enabled: boolean): void {
  premiumFormEnabled = enabled === true;
  bumpExecutive3DObjectFormRuntime();
}

export function bumpExecutive3DObjectFormRuntime(): void {
  formRuntimeEpoch += 1;
  formRuntimeListeners.forEach((listener) => listener());
}

export function subscribeExecutive3DObjectFormRuntime(
  listener: () => void,
): () => void {
  formRuntimeListeners.add(listener);
  return () => {
    formRuntimeListeners.delete(listener);
  };
}

export function getExecutive3DObjectFormRuntimeEpoch(): number {
  return formRuntimeEpoch;
}

function readQueryFlag(
  keys: readonly string[],
): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of keys) {
      const flag = params.get(key);
      if (flag === "0" || flag === "off" || flag === "false") return false;
      if (flag === "1" || flag === "on" || flag === "true") return true;
    }
  } catch {
    return null;
  }
  return null;
}

export function isExecutive3DObjectPremiumFormEnabled(): boolean {
  const query = readQueryFlag(["obj3dForm", "object3dForm", "stage3dobjForm"]);
  if (query != null) return query;
  if (typeof process !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_NEXORA_STAGE_3DOBJ_FORM;
    if (fromEnv === "0" || fromEnv === "false" || fromEnv === "off") {
      return false;
    }
    if (fromEnv === "1" || fromEnv === "true" || fromEnv === "on") {
      return true;
    }
  }
  return premiumFormEnabled;
}

/** Form-only certification: body+material+edge; symbols/territory suppressed. */
export function isExecutive3DObjectFormOnlyMode(): boolean {
  const query = readQueryFlag(["obj3dFormOnly", "formOnly"]);
  return query === true;
}

export function isExecutive3DObjectSymbolVisible(): boolean {
  if (isExecutive3DObjectFormOnlyMode()) return false;
  const query = readQueryFlag(["obj3dSymbol", "object3dSymbol"]);
  if (query != null) return query;
  return true;
}

export function isExecutive3DObjectTerritoryVisible(): boolean {
  if (isExecutive3DObjectFormOnlyMode()) return false;
  const query = readQueryFlag(["obj3dTerritory", "object3dTerritory"]);
  if (query != null) return query;
  return true;
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

function bodyProfileFor(
  family: Executive3DObjectShapeFamily,
): ExecutivePremiumBodyProfile {
  switch (family) {
    case "goal":
      return "target-puck";
    case "problem":
      return "constrained-angular-plate";
    case "risk":
      return "faceted-diamond";
    case "scenario":
      return "layered-soft-hex";
    case "decision":
      return "decisive-hex-plate";
    case "execution":
      return "operational-plate";
    case "context":
      return "subordinate-plate";
    case "business-object":
    default:
      return "precision-executive-plate";
  }
}

function aspectFor(family: Executive3DObjectShapeFamily): number {
  switch (family) {
    case "business-object":
      return 1.28;
    case "problem":
      return 1.32;
    case "execution":
      return 1.48;
    case "scenario":
      return 1.14;
    case "decision":
      return 1.06;
    case "risk":
      return 1;
    case "goal":
      return 1;
    case "context":
      return 1.18;
    default:
      return 1.24;
  }
}

function frontScaleFor(family: Executive3DObjectShapeFamily): number {
  switch (family) {
    case "business-object":
      return 0.95;
    case "problem":
      return 0.94;
    case "execution":
      return 0.96;
    case "scenario":
      return 0.95;
    case "decision":
      return 0.94;
    case "risk":
      return 0.93;
    case "goal":
      return 0.95;
    case "context":
      return 0.98;
    default:
      return 0.95;
  }
}

function bevelProfileFor(
  family: Executive3DObjectShapeFamily,
): ExecutivePremiumBevelProfile {
  switch (family) {
    case "problem":
      return "sharp-constrained";
    case "risk":
      return "faceted";
    case "scenario":
      return "soft-layered";
    case "decision":
      return "crisp-structural";
    case "execution":
      return "longitudinal";
    case "context":
      return "minimal";
    case "goal":
      return "soft-precision-chamfer";
    case "business-object":
    default:
      return "soft-precision-chamfer";
  }
}

function recessProfileFor(
  family: Executive3DObjectShapeFamily,
): ExecutivePremiumRecessProfile {
  switch (family) {
    case "goal":
      return "center-focus";
    case "scenario":
      return "stepped-nested";
    case "context":
      return "none";
    case "risk":
      return "shape-matched-inset";
    case "decision":
      return "shape-matched-inset";
    case "business-object":
    case "problem":
    case "execution":
    default:
      return "machined-rounded-inset";
  }
}

function edgeProfileFor(
  family: Executive3DObjectShapeFamily,
): ExecutivePremiumEdgeProfile {
  switch (family) {
    case "problem":
      return "sharp-line";
    case "risk":
      return "faceted-rim";
    case "scenario":
      return "soft-rim";
    case "decision":
      return "structural-rim";
    case "execution":
      return "directional-seam";
    case "context":
      return "quiet";
    case "goal":
      return "narrow-highlight";
    case "business-object":
    default:
      return "narrow-highlight";
  }
}

function surfaceProfileFor(
  family: Executive3DObjectShapeFamily,
): ExecutivePremiumSurfaceProfile {
  switch (family) {
    case "problem":
      return "matte-constrained";
    case "risk":
      return "faceted-instrument";
    case "scenario":
      return "soft-exploratory";
    case "decision":
      return "crisp-decision";
    case "execution":
      return "operational-composite";
    case "context":
      return "subordinate-matte";
    case "goal":
      return "satin-instrument";
    case "business-object":
    default:
      return "anodized-executive";
  }
}

function signatureFor(
  family: Executive3DObjectShapeFamily,
): ExecutivePremiumSignatureDetail {
  switch (family) {
    case "business-object":
      return "side-seam";
    case "execution":
      return "longitudinal-slot";
    case "problem":
      return "edge-notch";
    default:
      return "none";
  }
}

function cornerRadiusFor(
  family: Executive3DObjectShapeFamily,
  minDim: number,
): number {
  switch (family) {
    case "problem":
      return stabilize(Math.min(0.028, minDim * 0.04));
    case "decision":
      return stabilize(Math.min(0.036, minDim * 0.055));
    case "business-object":
      return stabilize(Math.min(0.042, minDim * 0.065));
    case "execution":
      return stabilize(Math.min(0.038, minDim * 0.055));
    case "scenario":
      return stabilize(Math.min(0.048, minDim * 0.07));
    case "context":
      return stabilize(Math.min(0.02, minDim * 0.05));
    default:
      return stabilize(Math.min(0.04, minDim * 0.06));
  }
}

/**
 * Canonical STAGE-3DOBJ:3 premium form resolver.
 * Appearance only — never topology / relationships / semantic Z / labels.
 */
export function resolveExecutivePremiumObjectForm(input: {
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
  readonly interactionState?: Executive3DObjectInteractionState;
  readonly width?: number;
  readonly height?: number;
  readonly enabled?: boolean;
}): ExecutivePremiumObjectForm {
  const enabled = input.enabled ?? isExecutive3DObjectPremiumFormEnabled();
  const level = input.presentationLevel ?? "minimum";
  const shapeFamily = mapFamily(
    resolveExecutiveObjectSemanticShapeFamily(input.objectKind),
  );

  if (!enabled) {
    const depth = EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL[level];
    return Object.freeze({
      enabled: false,
      contract: "stage-3dobj-3",
      shapeFamily,
      bodyProfile: "legacy-slab",
      aspectRatio: 1,
      depth,
      frontScale: 1,
      rearScale: 1 as const,
      taper: 0,
      cornerRadius: 0.04,
      bevelProfile: "soft-precision-chamfer",
      bevelSize: 0.04,
      recessProfile: "none",
      recessInset: 0,
      recessDepth: 0,
      edgeProfile: "quiet",
      surfaceProfile: "anodized-executive",
      signatureDetail: "none",
      symbolScaleFactor: 1,
      symbolContrastFactor: 1,
      isGenericCube: false,
      silhouettePadBoost: 0,
      backZ: 0 as const,
      frontZ: depth,
      centerZ: depth * 0.5,
    });
  }

  const aspectRatio = aspectFor(shapeFamily);
  const frontScale = frontScaleFor(shapeFamily);
  const taper = stabilize(1 - frontScale);
  const depthFactor =
    shapeFamily === "context"
      ? 0.48
      : shapeFamily === "scenario"
        ? 0.78
        : shapeFamily === "goal"
          ? 0.88
          : 0.92;
  const depth = stabilize(
    Math.min(
      EXECUTIVE_3D_OBJECT_VISUAL_DEPTH_BY_LEVEL[level] * depthFactor,
      MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH,
    ),
  );

  const baseW = input.width ?? 1.05;
  const baseH = input.height ?? 1.05;
  const minDim = Math.min(baseW * Math.sqrt(aspectRatio), baseH / Math.sqrt(aspectRatio));
  const bevelProfile = bevelProfileFor(shapeFamily);
  const bevelSize =
    bevelProfile === "sharp-constrained"
      ? 0.014
      : bevelProfile === "minimal"
        ? 0.01
        : bevelProfile === "faceted"
          ? 0.02
          : 0.028;

  const recessProfile = recessProfileFor(shapeFamily);
  const recessInset =
    recessProfile === "none"
      ? 0
      : level === "operation"
        ? 0.16
        : level === "report"
          ? 0.14
          : 0.13;
  const recessDepth =
    recessProfile === "none"
      ? 0
      : Math.min(0.018, depth * 0.1);

  // Form-first: symbols subordinate (~8–18% face).
  const symbolScaleFactor =
    shapeFamily === "context" ? 0.42 : level === "minimum" ? 0.38 : 0.42;
  const symbolContrastFactor = 0.42;

  return Object.freeze({
    enabled: true,
    contract: "stage-3dobj-3",
    shapeFamily,
    bodyProfile: bodyProfileFor(shapeFamily),
    aspectRatio: stabilize(aspectRatio),
    depth,
    frontScale: stabilize(frontScale),
    rearScale: 1 as const,
    taper,
    cornerRadius: cornerRadiusFor(shapeFamily, minDim),
    bevelProfile,
    bevelSize: stabilize(bevelSize),
    recessProfile,
    recessInset: stabilize(recessInset),
    recessDepth: stabilize(recessDepth),
    edgeProfile: edgeProfileFor(shapeFamily),
    surfaceProfile: surfaceProfileFor(shapeFamily),
    signatureDetail: signatureFor(shapeFamily),
    symbolScaleFactor: stabilize(symbolScaleFactor),
    symbolContrastFactor: stabilize(symbolContrastFactor),
    isGenericCube: false,
    silhouettePadBoost: stabilize(taper * 0.02 + bevelSize * 0.25),
    backZ: 0 as const,
    frontZ: depth,
    centerZ: stabilize(depth * 0.5),
  });
}

/**
 * Apply premium plate aspect to presence XY without changing semantic position.
 */
export function applyExecutivePremiumFormAspect(input: {
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly enabled: boolean;
}): Readonly<{ width: number; height: number }> {
  if (!input.enabled || input.aspectRatio <= 0) {
    return Object.freeze({ width: input.width, height: input.height });
  }
  const area = Math.max(0.01, input.width * input.height);
  const height = stabilize(Math.sqrt(area / input.aspectRatio));
  const width = stabilize(height * input.aspectRatio);
  return Object.freeze({ width, height });
}

export function getExecutive3DObjectPremiumFormObservability(input?: {
  readonly enabled?: boolean;
  readonly objectKind?: string | null;
  readonly presentationLevel?: Executive3DObjectPresentationLevel;
}): Readonly<{
  readonly contract: string;
  readonly enabled: string;
  readonly formProfile: string;
  readonly aspectRatio: string;
  readonly frontScale: string;
  readonly taper: string;
  readonly recessProfile: string;
  readonly edgeProfile: string;
}> {
  const enabled = input?.enabled ?? isExecutive3DObjectPremiumFormEnabled();
  const form = resolveExecutivePremiumObjectForm({
    objectKind: input?.objectKind ?? "object",
    presentationLevel: input?.presentationLevel ?? "minimum",
    enabled,
  });
  return Object.freeze({
    contract: EXECUTIVE_3D_OBJECT_PREMIUM_FORM_OBSERVABILITY.contract,
    enabled: enabled ? "true" : "false",
    formProfile: form.bodyProfile,
    aspectRatio: String(form.aspectRatio),
    frontScale: String(form.frontScale),
    taper: String(form.taper),
    recessProfile: form.recessProfile,
    edgeProfile: form.edgeProfile,
  });
}

export function verifyExecutive3DObjectPremiumForm(): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly businessNotCube: boolean;
  readonly familiesDistinct: boolean;
  readonly depthCapped: boolean;
  readonly formFirst: boolean;
}> {
  const identity = getExecutive3DObjectPremiumFormIdentity();
  const identityValid =
    identity.id === "STAGE-3DOBJ:3/PremiumExecutiveObjectFormLanguage" &&
    identity.version === "1.0.0";

  const business = resolveExecutivePremiumObjectForm({
    objectKind: "object",
    enabled: true,
  });
  const businessNotCube =
    business.bodyProfile === "precision-executive-plate" &&
    business.isGenericCube === false &&
    business.aspectRatio >= 1.15 &&
    business.aspectRatio <= 1.35 &&
    business.frontScale < 1;

  const profiles = [
    "object",
    "goal",
    "problem",
    "risk",
    "scenario",
    "decision",
    "execution",
  ].map(
    (k) =>
      resolveExecutivePremiumObjectForm({ objectKind: k, enabled: true })
        .bodyProfile,
  );
  const familiesDistinct = new Set(profiles).size === profiles.length;

  const depthCapped = ["minimum", "report", "operation"].every((level) => {
    const form = resolveExecutivePremiumObjectForm({
      objectKind: "object",
      presentationLevel: level as Executive3DObjectPresentationLevel,
      enabled: true,
    });
    return form.depth > 0 && form.depth <= MAX_EXECUTIVE_3D_OBJECT_VISUAL_DEPTH;
  });

  const formFirst =
    business.symbolScaleFactor < 0.5 &&
    EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.visualHierarchy ===
      "form>surface>edge>symbol>state";

  return Object.freeze({
    ok:
      identityValid &&
      businessNotCube &&
      familiesDistinct &&
      depthCapped &&
      formFirst &&
      EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.changesSemanticZ === false &&
      EXECUTIVE_3D_OBJECT_PREMIUM_FORM_BOUNDARY.stateModifiesForm === false,
    identityValid,
    businessNotCube,
    familiesDistinct,
    depthCapped,
    formFirst,
  });
}
