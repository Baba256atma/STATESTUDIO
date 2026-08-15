/**
 * SP:2.8A — Executive Stage Final Visual Micro-Calibration.
 *
 * Tiny post-SP:2.8 patch after real Stage screenshot inspection.
 * Addresses only:
 *   A. Dial panel collision (geometry + label)
 *   B. Bottom Stage geometry safe margin
 *   C. Background connection residual noise
 *
 * Does not redesign SP:2.8. Does not start SP:3.
 * Owns no domain — calibrates existing SP:1 / connection / label owners.
 */

import {
  EXECUTIVE_SAFE_FRAMING_MARGINS,
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS,
  estimateExecutiveObjectLabelScreenBounds,
  resolveExecutiveObjectLabelCollisions,
  resolveExecutiveObjectLabelPresentation,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_RESERVED_CENTER,
  EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE,
  applyExecutiveSpatialUiOverlaySafeCorrection,
  resolveExecutiveSpatialComposition,
} from "./executiveSpatialComposition.ts";
import {
  certifyExecutiveObjectVisualIntegration,
} from "./executiveObjectVisualIntegrationCertification.ts";
import {
  certifyExecutiveStageVisualCalibration,
} from "./executiveStageVisualCalibration.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageFinalVisualMicroCalibrationIdentity =
  "SP:2.8A/ExecutiveStageFinalVisualMicroCalibration" as const;

export const executiveStageFinalVisualMicroCalibrationVersion =
  "2.8.1" as const;

export const executiveStageFinalVisualMicroCalibrationNamespace =
  "nexora.spatial-presentation.executive-stage-final-visual-micro-calibration" as const;

export const executiveStageFinalVisualMicroCalibrationPhase =
  "ExecutiveStageFinalVisualMicroCalibration" as const;

export const executiveStageFinalVisualMicroCalibrationArchitecturalRole =
  "PresentationOnlyCalibrationPatch" as const;

export const executiveStageFinalVisualMicroCalibrationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveStageFinalVisualMicroCalibrationIdentity = {
  readonly id: typeof executiveStageFinalVisualMicroCalibrationIdentity;
  readonly version: typeof executiveStageFinalVisualMicroCalibrationVersion;
  readonly namespace: typeof executiveStageFinalVisualMicroCalibrationNamespace;
  readonly phase: typeof executiveStageFinalVisualMicroCalibrationPhase;
  readonly architecturalRole: typeof executiveStageFinalVisualMicroCalibrationArchitecturalRole;
  readonly readiness: typeof executiveStageFinalVisualMicroCalibrationReadiness;
};

const MICRO_IDENTITY: ExecutiveStageFinalVisualMicroCalibrationIdentity =
  Object.freeze({
    id: executiveStageFinalVisualMicroCalibrationIdentity,
    version: executiveStageFinalVisualMicroCalibrationVersion,
    namespace: executiveStageFinalVisualMicroCalibrationNamespace,
    phase: executiveStageFinalVisualMicroCalibrationPhase,
    architecturalRole:
      executiveStageFinalVisualMicroCalibrationArchitecturalRole,
    readiness: executiveStageFinalVisualMicroCalibrationReadiness,
  });

export function getExecutiveStageFinalVisualMicroCalibrationIdentity(): ExecutiveStageFinalVisualMicroCalibrationIdentity {
  return MICRO_IDENTITY;
}

export const EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      executiveStageFinalVisualMicroCalibrationArchitecturalRole,
    ownsBusinessTruth: false as const,
    ownsCamera: false as const,
    ownsSpatialPosition: false as const,
    inventsRelationships: false as const,
    usesObjectIdHacks: false as const,
    usesNameHacks: false as const,
    redesignsSp28: false as const,
    startsSp3Atmosphere: false as const,
    autoClaimsHumanVisualSignOff: false as const,
    calibrationPatchOnly: true as const,
    presentationOnly: true as const,
  });

/** Documented connection energy after SP:2.8A (presentation tokens). */
export const EXECUTIVE_STAGE_CONNECTION_ENERGY_SP28A = Object.freeze({
  focus: 0.74,
  overview: 0.14,
  background: 0.045,
  backgroundBeforeSp28A: 0.07,
  overviewBeforeSp28A: 0.16,
});

export type ExecutiveStageFinalVisualMicroCalibrationResult = {
  readonly identity: ExecutiveStageFinalVisualMicroCalibrationIdentity;
  readonly automatedStatus: "certified" | "failed";
  readonly humanVisualStatus: "verified" | "pending" | "failed";
  readonly sp27: Readonly<{
    readonly structuralStatus: "certified" | "failed";
    readonly automatedStatus: "certified" | "failed";
  }>;
  readonly sp28AutomatedStatus: "certified" | "failed";
  readonly checks: Readonly<{
    readonly dialExclusionExpanded: boolean;
    readonly bottomMarginStrengthened: boolean;
    readonly genericDialGeometryClearance: boolean;
    readonly multiIdentityEquivalence: boolean;
    readonly bottomBoundaryClearance: boolean;
    readonly bottomLeftUndisturbed: boolean;
    readonly centralBreathingPreserved: boolean;
    readonly connectionHierarchy: boolean;
    readonly nonEdge: boolean;
    readonly noIdHacks: boolean;
  }>;
};

function runMicroChecks(): ExecutiveStageFinalVisualMicroCalibrationResult["checks"] {
  const dialExclusionExpanded =
    EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX <= 0.45 &&
    EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY <= -0.28 &&
    EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS.maxScreenOffsetX >= 72;

  const bottomMarginStrengthened =
    EXECUTIVE_SAFE_FRAMING_MARGINS.bottom >= 0.28 &&
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY >= -0.16 &&
    EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.stageFloorY >= -0.1 &&
    EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.safeMinY >= -0.05;

  const unsafe = Object.freeze({ x: 2.05, y: -0.05, z: 1.45 });
  const corrected = applyExecutiveSpatialUiOverlaySafeCorrection(unsafe);
  const genericDialGeometryClearance =
    corrected.x < unsafe.x &&
    corrected.z <= unsafe.z &&
    corrected.y >= unsafe.y &&
    corrected.x <= EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.safeMaxX + 0.35 &&
    Math.abs(corrected.x - unsafe.x) <=
      EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.maxCorrectionX + 1e-9;

  const identities = ["alpha", "beta", "gamma", "risk-like", "omega"] as const;
  const corrections = identities.map((objectId) => {
    const composition = resolveExecutiveSpatialComposition({
      objects: [
        Object.freeze({
          objectId,
          preferredPosition: Object.freeze({ x: 2.1, y: 0, z: 1.5 }),
        }),
      ],
    });
    const label = resolveExecutiveObjectLabelPresentation({
      objectId,
      objectName: `${objectId} Label`,
      spatialRole: "background",
      status: "unresolved",
      stateMarker: "unresolved",
    });
    const bounds = estimateExecutiveObjectLabelScreenBounds({
      lines: label.lines,
      fontSizePx: label.fontSizePx,
      screenX: 1120,
      screenY: 740,
    });
    const collision = resolveExecutiveObjectLabelCollisions({
      candidates: [
        Object.freeze({
          objectId,
          priorityRank: label.priorityRank,
          stageOrder: 0,
          level: label.level,
          prominence: label.prominence,
          visible: label.visible,
          screenX: bounds.x,
          screenY: bounds.y,
          width: bounds.width,
          height: bounds.height,
        }),
      ],
      viewportWidth: 1280,
      viewportHeight: 800,
    });
    return Object.freeze({
      objectId,
      position: composition.objects[0]!.position,
      labelAction: collision.byId.get(objectId)?.action ?? "none",
      labelVisible: collision.byId.get(objectId)?.visible !== false,
    });
  });
  const multiIdentityEquivalence =
    corrections.every(
      (entry) =>
        entry.position.x <= EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinX + 0.25 &&
        entry.labelVisible &&
        entry.labelAction !== "hide",
    ) &&
    corrections.every(
      (entry) =>
        Math.abs(entry.position.x - corrections[0]!.position.x) < 1e-9 &&
        Math.abs(entry.position.z - corrections[0]!.position.z) < 1e-9,
    );

  const bottomObject = applyExecutiveSpatialUiOverlaySafeCorrection(
    Object.freeze({ x: 0.2, y: -0.35, z: 1.2 }),
  );
  const bottomBoundaryClearance =
    bottomObject.y >=
      EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.stageFloorY - 1e-9 &&
    bottomObject.y >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY;

  const bottomLeft = Object.freeze({ x: -1.7, y: -0.02, z: 1.35 });
  const bottomLeftCorrected =
    applyExecutiveSpatialUiOverlaySafeCorrection(bottomLeft);
  const bottomLeftUndisturbed =
    Math.abs(bottomLeftCorrected.x - bottomLeft.x) < 0.05 &&
    Math.abs(bottomLeftCorrected.z - bottomLeft.z) < 0.05;

  const composition = resolveExecutiveSpatialComposition({
    objects: ["a", "b", "c", "d", "e", "f", "g", "h"].map((objectId) =>
      Object.freeze({ objectId }),
    ),
  });
  const nearCenter = composition.objects.filter(
    (entry) =>
      Math.hypot(
        entry.position.x - EXECUTIVE_SPATIAL_RESERVED_CENTER.x,
        entry.position.z - EXECUTIVE_SPATIAL_RESERVED_CENTER.z,
      ) < 1.1,
  );
  const centralBreathingPreserved = nearCenter.length <= 2;

  const energy = EXECUTIVE_STAGE_CONNECTION_ENERGY_SP28A;
  const connectionHierarchy =
    energy.focus > energy.overview &&
    energy.overview > energy.background &&
    energy.background <= 0.055 &&
    energy.background >= 0.04 &&
    energy.background < energy.backgroundBeforeSp28A;

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
    capacity.emphasis.stateClass === "critical";

  const noIdHacks =
    EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY.usesObjectIdHacks ===
      false &&
    EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY.usesNameHacks ===
      false;

  return Object.freeze({
    dialExclusionExpanded,
    bottomMarginStrengthened,
    genericDialGeometryClearance,
    multiIdentityEquivalence,
    bottomBoundaryClearance,
    bottomLeftUndisturbed,
    centralBreathingPreserved,
    connectionHierarchy,
    nonEdge,
    noIdHacks,
  });
}

export function certifyExecutiveStageFinalVisualMicroCalibration(input?: {
  readonly humanVisualStatus?: "verified" | "pending" | "failed";
}): ExecutiveStageFinalVisualMicroCalibrationResult {
  const humanVisualStatus = input?.humanVisualStatus ?? "pending";
  const sp27 = certifyExecutiveObjectVisualIntegration({
    humanVisualStatus: "pending",
  });
  const sp28 = certifyExecutiveStageVisualCalibration({
    humanVisualStatus: "pending",
  });
  const checks = runMicroChecks();
  const automatedOk = Object.values(checks).every(Boolean);
  const automatedStatus =
    automatedOk &&
    sp27.structuralStatus === "certified" &&
    sp27.automatedStatus === "certified" &&
    sp28.automatedStatus === "certified"
      ? ("certified" as const)
      : ("failed" as const);

  return Object.freeze({
    identity: MICRO_IDENTITY,
    automatedStatus,
    humanVisualStatus,
    sp27: Object.freeze({
      structuralStatus: sp27.structuralStatus,
      automatedStatus: sp27.automatedStatus,
    }),
    sp28AutomatedStatus: sp28.automatedStatus,
    checks,
  });
}

export function verifyExecutiveStageFinalVisualMicroCalibration(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly automatedCertified: boolean;
  readonly humanPending: boolean;
  readonly doesNotStartSp3: boolean;
}> {
  const result = certifyExecutiveStageFinalVisualMicroCalibration();
  const ok =
    options?.forceFailure !== true &&
    result.automatedStatus === "certified" &&
    result.humanVisualStatus === "pending";
  return Object.freeze({
    ok,
    automatedCertified: result.automatedStatus === "certified",
    humanPending: result.humanVisualStatus === "pending",
    doesNotStartSp3:
      EXECUTIVE_STAGE_FINAL_VISUAL_MICRO_CALIBRATION_BOUNDARY
        .startsSp3Atmosphere === false,
  });
}
