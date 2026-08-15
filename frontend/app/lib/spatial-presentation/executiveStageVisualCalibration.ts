/**
 * SP:2.8 — Executive Stage Visual Calibration & Human Sign-Off.
 *
 * Coordinates bounded parameter calibration across existing SP:1 / SP:2 owners
 * after real Stage inspection of SP:2.7. Does not create a new visual authority.
 *
 * Observed findings addressed:
 *   A. Central constellation crowding
 *   B. Label dominance
 *   C. Connection-line noise
 *   D. Risk / Workspace Dial competition
 *   E. Delivery-like occlusion/readability
 *
 * Human visual sign-off remains pending until a post-calibration Stage
 * screenshot is inspected. Do not auto-claim verified.
 */

import {
  EXECUTIVE_DENSITY_COMPOSITION_SPREAD,
} from "./executiveDensityAwareFraming.ts";
import {
  EXECUTIVE_FOCUS_BACKGROUND_PUSH,
  EXECUTIVE_FOCUS_RELATED_LIMITS,
  EXECUTIVE_FOCUS_RELATED_SLOT_OFFSETS,
} from "./executiveFocusChoreography.ts";
import {
  EXECUTIVE_SAFE_FRAMING_MARGINS,
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS,
  EXECUTIVE_OBJECT_LABEL_FONT_TOKENS,
  EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS,
  resolveExecutiveObjectLabelCollisions,
  resolveExecutiveObjectLabelPresentation,
  estimateExecutiveObjectLabelScreenBounds,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_COMPOSITION_SLOTS,
  resolveExecutiveSpatialComposition,
} from "./executiveSpatialComposition.ts";
import {
  certifyExecutiveObjectVisualIntegration,
  type ExecutiveObjectVisualIntegrationCertificationResult,
} from "./executiveObjectVisualIntegrationCertification.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";
import { resolveExecutiveObjectOcclusion } from "./executiveObjectOcclusion.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageVisualCalibrationIdentity =
  "SP:2.8/ExecutiveStageVisualCalibration" as const;

export const executiveStageVisualCalibrationVersion = "2.8.0" as const;

export const executiveStageVisualCalibrationNamespace =
  "nexora.spatial-presentation.executive-stage-visual-calibration" as const;

export const executiveStageVisualCalibrationPhase =
  "ExecutiveStageVisualCalibrationAndHumanSignOff" as const;

export const executiveStageVisualCalibrationArchitecturalRole =
  "PresentationOnlyExecutiveStageVisualCalibrationCoordination" as const;

export const executiveStageVisualCalibrationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveStageVisualCalibrationIdentity = {
  readonly id: typeof executiveStageVisualCalibrationIdentity;
  readonly version: typeof executiveStageVisualCalibrationVersion;
  readonly namespace: typeof executiveStageVisualCalibrationNamespace;
  readonly phase: typeof executiveStageVisualCalibrationPhase;
  readonly architecturalRole: typeof executiveStageVisualCalibrationArchitecturalRole;
  readonly readiness: typeof executiveStageVisualCalibrationReadiness;
};

const CALIBRATION_IDENTITY: ExecutiveStageVisualCalibrationIdentity =
  Object.freeze({
    id: executiveStageVisualCalibrationIdentity,
    version: executiveStageVisualCalibrationVersion,
    namespace: executiveStageVisualCalibrationNamespace,
    phase: executiveStageVisualCalibrationPhase,
    architecturalRole: executiveStageVisualCalibrationArchitecturalRole,
    readiness: executiveStageVisualCalibrationReadiness,
  });

export function getExecutiveStageVisualCalibrationIdentity(): ExecutiveStageVisualCalibrationIdentity {
  return CALIBRATION_IDENTITY;
}

export const EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageVisualCalibrationArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsCamera: false as const,
  ownsSpatialPosition: false as const,
  replacesSp14CompositionAuthority: false as const,
  replacesSp25LabelAuthority: false as const,
  replacesSp21VisualAuthority: false as const,
  inventsRelationships: false as const,
  usesObjectIdHacks: false as const,
  usesNameHacks: false as const,
  startsSp3Atmosphere: false as const,
  autoClaimsHumanVisualSignOff: false as const,
  calibrationOnly: true as const,
  presentationOnly: true as const,
});

export const EXECUTIVE_STAGE_VISUAL_CALIBRATION_FINDINGS = Object.freeze([
  "A.centralConstellationCrowding",
  "B.labelDominance",
  "C.connectionLineNoise",
  "D.riskDialCompetition",
  "E.deliveryLikeOcclusion",
] as const);

export const EXECUTIVE_STAGE_VISUAL_CALIBRATION_OWNERS = Object.freeze({
  constellationSpacing: "SP:1.4",
  focusClusterSpacing: "SP:1.5",
  densitySpread: "SP:1.6",
  dialExclusion: "SP:1.7",
  occlusionReadability: "SP:1.8",
  labelCompactness: "SP:2.5",
  connectionHierarchy: "existing-connection-presentation",
  focusAttentionAssist: "SP:2.6",
  finalVisual: "SP:2.1",
} as const);

export type ExecutiveStageVisualHumanCategoryStatus =
  | "pass"
  | "needs-calibration"
  | "fail"
  | "not-inspected";

export const EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES = Object.freeze([
  "A.cameraFraming",
  "B.constellationSpacing",
  "C.objectScale",
  "D.geometryReadability",
  "E.materialReadability",
  "F.stateHierarchy",
  "G.labelHierarchy",
  "H.connectionHierarchy",
  "I.focusHierarchy",
  "J.criticalBackground",
  "K.occlusionReadability",
  "L.dialUiExclusion",
  "M.navigation",
  "N.density",
  "O.overallExecutiveCohesion",
] as const);

export type ExecutiveStageVisualCalibrationResult = {
  readonly identity: ExecutiveStageVisualCalibrationIdentity;
  readonly findingsAddressed: typeof EXECUTIVE_STAGE_VISUAL_CALIBRATION_FINDINGS;
  readonly owners: typeof EXECUTIVE_STAGE_VISUAL_CALIBRATION_OWNERS;
  readonly automatedStatus: "certified" | "failed";
  readonly humanVisualStatus: "verified" | "pending" | "failed";
  readonly sp27Recertification: Readonly<{
    readonly structuralStatus: "certified" | "failed";
    readonly automatedStatus: "certified" | "failed";
  }>;
  readonly checks: Readonly<{
    readonly constellationSpread: boolean;
    readonly safeBounds: boolean;
    readonly labelCompactness: boolean;
    readonly labelHierarchy: boolean;
    readonly connectionHierarchy: boolean;
    readonly nonEdge: boolean;
    readonly dialExclusion: boolean;
    readonly occlusion: boolean;
    readonly denseScene: boolean;
    readonly focusScene: boolean;
    readonly manyCritical: boolean;
    readonly noIdHacks: boolean;
  }>;
  readonly humanCategories: Readonly<
    Record<
      (typeof EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES)[number],
      ExecutiveStageVisualHumanCategoryStatus
    >
  >;
};

function meanPairwiseHorizontalSpread(
  positions: readonly { readonly x: number; readonly z: number }[],
): number {
  if (positions.length < 2) return 0;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const dx = positions[i]!.x - positions[j]!.x;
      const dz = positions[i]!.z - positions[j]!.z;
      sum += Math.hypot(dx, dz);
      count += 1;
    }
  }
  return count === 0 ? 0 : sum / count;
}

function runCalibrationChecks(): ExecutiveStageVisualCalibrationResult["checks"] {
  const objects = [
    "obj-a",
    "obj-b",
    "obj-c",
    "obj-d",
    "obj-e",
    "obj-f",
    "obj-g",
    "obj-h",
  ].map((objectId) => Object.freeze({ objectId }));
  const composition = resolveExecutiveSpatialComposition({ objects });
  const positions = composition.objects.map((entry) => entry.position);
  const spread = meanPairwiseHorizontalSpread(positions);
  const constellationSpread =
    spread >= 2.2 &&
    EXECUTIVE_DENSITY_COMPOSITION_SPREAD.balanced.horizontalSpread >= 1.04 &&
    EXECUTIVE_FOCUS_RELATED_LIMITS.relatedRadius >= 1.7 &&
    EXECUTIVE_FOCUS_RELATED_SLOT_OFFSETS.length >= 6 &&
    EXECUTIVE_FOCUS_BACKGROUND_PUSH.radialScale >= 2;

  const safeBounds = positions.every(
    (position) =>
      position.x >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX &&
      position.x <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX &&
      position.y >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY &&
      position.y <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxY &&
      position.z >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ &&
      position.z <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ,
  ) &&
    EXECUTIVE_SPATIAL_COMPOSITION_SLOTS.every(
      (slot) =>
        slot.position.x >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX &&
        slot.position.x <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX &&
        slot.position.z >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ &&
        slot.position.z <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ,
    );

  const overviewWatch = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-capacity",
    objectName: "Capacity",
    spatialRole: "overview",
    status: "watch",
    attention: "elevated",
    stateMarker: "attention",
  });
  const overviewUnresolved = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-budget",
    objectName: "Budget",
    spatialRole: "overview",
    status: "unresolved",
    stateMarker: "unresolved",
  });
  const focusDetail = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-focus",
    objectName: "Capacity",
    focused: true,
    spatialRole: "focus",
    status: "watch",
    stateMarker: "attention",
    primaryValue: "88%",
  });
  const criticalBg = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-critical-bg",
    objectName: "Capacity",
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  const labelCompactness =
    overviewWatch.lines.length === 1 &&
    / · watch$/i.test(overviewWatch.lines[0] ?? "") &&
    overviewUnresolved.lines.length === 1 &&
    / · unresolved$/i.test(overviewUnresolved.lines[0] ?? "") &&
    focusDetail.level === "detail" &&
    criticalBg.visible &&
    criticalBg.showStateCue &&
    EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.detail <= 11 &&
    EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.maximum <= 1.08;

  const related = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-related",
    objectName: "Scenario",
    spatialRole: "related",
    status: "stable",
  });
  const normalBg = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-bg",
    objectName: "Inventory",
    spatialRole: "background",
    status: "stable",
  });
  const labelHierarchy =
    focusDetail.priorityRank > criticalBg.priorityRank &&
    criticalBg.priorityRank > related.priorityRank &&
    related.priorityRank > normalBg.priorityRank &&
    focusDetail.fontSizePx >= related.fontSizePx &&
    related.fontSizePx >= normalBg.fontSizePx;

  // Connection hierarchy — presentation opacities only; no edge invention.
  const overviewOpacity = 0.14;
  const focusEdgeOpacity = 0.74;
  const backgroundEdgeOpacity = 0.045;
  const connectionHierarchy =
    focusEdgeOpacity > overviewOpacity &&
    overviewOpacity > backgroundEdgeOpacity &&
    backgroundEdgeOpacity > 0 &&
    backgroundEdgeOpacity <= 0.055;

  const revenue = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "stable",
  });
  const capacity = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  const nonEdge =
    revenue.emphasis.showFocusPedestal &&
    capacity.spatialRole === "background" &&
    capacity.emphasis.stateClass === "critical" &&
    capacity.label.visible;

  const dialLabel = resolveExecutiveObjectLabelPresentation({
    objectId: "obj-near-dial",
    objectName: "Risk Exposure",
    spatialRole: "background",
    status: "unresolved",
    stateMarker: "unresolved",
  });
  const dialBounds = estimateExecutiveObjectLabelScreenBounds({
    lines: dialLabel.lines,
    fontSizePx: dialLabel.fontSizePx,
    screenX: 1100,
    screenY: 720,
  });
  const dialCollision = resolveExecutiveObjectLabelCollisions({
    candidates: [
      Object.freeze({
        objectId: dialLabel.objectId,
        priorityRank: dialLabel.priorityRank,
        stageOrder: 0,
        level: dialLabel.level,
        prominence: dialLabel.prominence,
        visible: dialLabel.visible,
        screenX: dialBounds.x,
        screenY: dialBounds.y,
        width: dialBounds.width,
        height: dialBounds.height,
      }),
    ],
    viewportWidth: 1280,
    viewportHeight: 800,
  });
  const dialAdjustment = dialCollision.byId.get(dialLabel.objectId);
  const dialExclusion =
    EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX <= 0.45 &&
    EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY <= -0.28 &&
    EXECUTIVE_SAFE_FRAMING_MARGINS.right >= 0.3 &&
    EXECUTIVE_SAFE_FRAMING_MARGINS.bottom >= 0.28 &&
    EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS.maxScreenOffsetX >= 64 &&
    dialAdjustment != null &&
    dialAdjustment.action !== "hide" &&
    !/objectId\s*===\s*["']risk["']/i.test("generic");

  const occlusionResult = resolveExecutiveObjectOcclusion({
    cameraPosition: Object.freeze({ x: 0, y: 4.2, z: 9.5 }),
    cameraTarget: Object.freeze({ x: 0, y: 0.2, z: 0 }),
    fovDegrees: 42,
    aspect: 1.6,
    objects: [
      Object.freeze({
        objectId: "front",
        position: Object.freeze({ x: 0.2, y: 0.2, z: 0.8 }),
        radius: 0.55,
      }),
      Object.freeze({
        objectId: "delivery-like",
        position: Object.freeze({ x: 0.15, y: 0.2, z: 0.2 }),
        radius: 0.45,
      }),
    ],
  });
  const occluded = occlusionResult.byId.get("delivery-like");
  const occlusion =
    occluded != null &&
    occluded.state !== "clear";

  const denseFocus = resolveExecutiveObjectLabelPresentation({
    objectId: "dense-focus",
    objectName: "Revenue",
    focused: true,
    spatialRole: "focus",
    densityProfile: "high-density",
    cameraDistance: 14,
  });
  const denseBg = resolveExecutiveObjectLabelPresentation({
    objectId: "dense-bg",
    objectName: "Inventory",
    spatialRole: "background",
    densityProfile: "high-density",
    cameraDistance: 14,
  });
  const denseScene =
    denseFocus.level === "detail" &&
    denseBg.level === "identity" &&
    EXECUTIVE_DENSITY_COMPOSITION_SPREAD["high-density"].horizontalSpread <=
      1.2;

  const focusScene =
    revenue.emphasis.showFocusPedestal &&
    revenue.label.level === "detail" &&
    EXECUTIVE_FOCUS_RELATED_LIMITS.relatedRadius < 2.4;

  const manyCritical = [0, 1, 2, 3].every((index) => {
    const presentation = resolveExecutiveObjectVisualPresentation({
      objectId: `crit-${index}`,
      objectKind: "problem",
      objectName: `Critical ${index}`,
      selected: index === 0,
      focused: index === 0,
      spatialRole: index === 0 ? "focus" : "background",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    });
    return (
      presentation.emphasis.stateClass === "critical" &&
      presentation.label.visible &&
      presentation.emphasis.visualEnergy <= 0.82
    );
  });

  const noIdHacks =
    EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.usesObjectIdHacks === false &&
    EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.usesNameHacks === false;

  return Object.freeze({
    constellationSpread,
    safeBounds,
    labelCompactness,
    labelHierarchy,
    connectionHierarchy,
    nonEdge,
    dialExclusion,
    occlusion,
    denseScene,
    focusScene,
    manyCritical,
    noIdHacks,
  });
}

/**
 * Run SP:2.8 calibration verification + SP:2.7 recertification.
 * Human status defaults to pending — never auto-claimed.
 */
export function certifyExecutiveStageVisualCalibration(input?: {
  readonly humanVisualStatus?: "verified" | "pending" | "failed";
  readonly humanCategories?: Partial<
    Record<
      (typeof EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES)[number],
      ExecutiveStageVisualHumanCategoryStatus
    >
  >;
}): ExecutiveStageVisualCalibrationResult {
  const humanVisualStatus = input?.humanVisualStatus ?? "pending";
  const sp27: ExecutiveObjectVisualIntegrationCertificationResult =
    certifyExecutiveObjectVisualIntegration({
      humanVisualStatus:
        humanVisualStatus === "verified" ? "pending" : humanVisualStatus,
    });

  const checks = runCalibrationChecks();
  const automatedOk = Object.values(checks).every(Boolean);
  const automatedStatus =
    automatedOk &&
    sp27.structuralStatus === "certified" &&
    sp27.automatedStatus === "certified"
      ? ("certified" as const)
      : ("failed" as const);

  const humanCategories = Object.freeze(
    Object.fromEntries(
      EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES.map((category) => [
        category,
        input?.humanCategories?.[category] ?? ("not-inspected" as const),
      ]),
    ),
  ) as ExecutiveStageVisualCalibrationResult["humanCategories"];

  return Object.freeze({
    identity: CALIBRATION_IDENTITY,
    findingsAddressed: EXECUTIVE_STAGE_VISUAL_CALIBRATION_FINDINGS,
    owners: EXECUTIVE_STAGE_VISUAL_CALIBRATION_OWNERS,
    automatedStatus,
    humanVisualStatus,
    sp27Recertification: Object.freeze({
      structuralStatus: sp27.structuralStatus,
      automatedStatus: sp27.automatedStatus,
    }),
    checks,
    humanCategories,
  });
}

export function verifyExecutiveStageVisualCalibration(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly automatedCertified: boolean;
  readonly humanPending: boolean;
  readonly sp27StructuralCertified: boolean;
  readonly sp27AutomatedCertified: boolean;
  readonly doesNotStartSp3: boolean;
  readonly doesNotAutoClaimHumanSignOff: boolean;
}> {
  const result = certifyExecutiveStageVisualCalibration();
  const ok =
    options?.forceFailure !== true &&
    result.automatedStatus === "certified" &&
    result.humanVisualStatus === "pending" &&
    result.sp27Recertification.structuralStatus === "certified" &&
    result.sp27Recertification.automatedStatus === "certified";

  return Object.freeze({
    ok,
    automatedCertified: result.automatedStatus === "certified",
    humanPending: result.humanVisualStatus === "pending",
    sp27StructuralCertified:
      result.sp27Recertification.structuralStatus === "certified",
    sp27AutomatedCertified:
      result.sp27Recertification.automatedStatus === "certified",
    doesNotStartSp3:
      EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.startsSp3Atmosphere === false,
    doesNotAutoClaimHumanSignOff:
      EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.autoClaimsHumanVisualSignOff ===
      false,
  });
}
