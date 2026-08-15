/**
 * STAGE-PROD:6V — Human Visual Certification & Executive Composition Calibration.
 *
 * Presentation-only visual discipline across PROD:0–6. No new product capability.
 * Real runtime/WebGL captures are required for HVC; schematics are diagnostics only.
 */

import {
  EXECUTIVE_STAGE_WATCH_BUDGET,
} from "./executiveStageProductivityContract.ts";
import { EXECUTIVE_STAGE_COLLECTION_BUDGET } from "./executiveStageQueueFoundation.ts";
import { EXECUTIVE_STAGE_PREPARATION_BUDGET } from "./executiveStagePreparation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageHumanVisualCertificationIdentity =
  "STAGE-PROD:6V/ExecutiveStageHumanVisualCertification" as const;

export const executiveStageHumanVisualCertificationVersion = "1.0.0" as const;

export const executiveStageHumanVisualCertificationNamespace =
  "nexora.spatial-presentation.executive-stage-human-visual-certification" as const;

export const executiveStageHumanVisualCertificationPhase =
  "HumanVisualCertificationAndCompositionCalibration" as const;

export const executiveStageHumanVisualCertificationArchitecturalRole =
  "PresentationOnlyHumanVisualCertificationAuthority" as const;

export type ExecutiveStageHumanVisualCertificationIdentity = {
  readonly id: typeof executiveStageHumanVisualCertificationIdentity;
  readonly version: typeof executiveStageHumanVisualCertificationVersion;
  readonly namespace: typeof executiveStageHumanVisualCertificationNamespace;
  readonly phase: typeof executiveStageHumanVisualCertificationPhase;
  readonly architecturalRole: typeof executiveStageHumanVisualCertificationArchitecturalRole;
};

const IDENTITY: ExecutiveStageHumanVisualCertificationIdentity = Object.freeze({
  id: executiveStageHumanVisualCertificationIdentity,
  version: executiveStageHumanVisualCertificationVersion,
  namespace: executiveStageHumanVisualCertificationNamespace,
  phase: executiveStageHumanVisualCertificationPhase,
  architecturalRole: executiveStageHumanVisualCertificationArchitecturalRole,
});

export function getExecutiveStageHumanVisualCertificationIdentity(): ExecutiveStageHumanVisualCertificationIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_HVC_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageHumanVisualCertificationArchitecturalRole,
  implementsNewProductCapability: false as const,
  changesSemanticTruth: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  presentationCalibrationOnly: true as const,
  requiresRealWebGlCaptures: true as const,
  schematicCapturesQualifyForHvc: false as const,
});

/** Certified desktop viewports for HVC. */
export const EXECUTIVE_STAGE_HVC_VIEWPORTS = Object.freeze({
  primary: Object.freeze({ width: 1502, height: 942, label: "primary-desktop" }),
  narrow: Object.freeze({ width: 1280, height: 800, label: "narrow-desktop" }),
});

/**
 * HVC-calibrated visible budgets (presentation-only).
 * Readability takes precedence over original PROD defaults.
 */
export const EXECUTIVE_STAGE_HVC_BUDGETS = Object.freeze({
  collectionMaxVisible: 6,
  dailyPreparationMaxVisible: 6,
  meetingPreparationMaxVisible: 6,
  watchMaxVisible: 3,
  relatedMaxVisible: 6,
  previous: Object.freeze({
    collectionMaxVisible: 8,
    dailyPreparationMaxVisible: 8,
    meetingPreparationMaxVisible: 8,
    watchMaxVisible: 4,
    relatedMaxVisible: 8,
  }),
  reason:
    "Runtime density calibration: 8 preparation/collection members and 4 Watch items compete with Queue/Advisor; certified budgets prioritize 3-second executive clarity.",
});

export type ExecutiveHvcAdvisorPanel =
  | "preparation"
  | "nba"
  | "brief"
  | "memory";

export type ExecutiveHvcPresentationMode =
  | "overview"
  | "object-focus"
  | "collection"
  | "preparation";

/**
 * Focus-aware Advisor panel visibility — visual restraint matrix.
 * Data may exist; UI must not scream every section at once.
 */
export function resolveExecutiveHvcAdvisorPanelVisibility(input: {
  readonly presentationMode: ExecutiveHvcPresentationMode;
  readonly subjectKind?: string | null;
  readonly preparationActive?: boolean;
  readonly nbaAvailable?: boolean;
  readonly briefEligible?: boolean;
  readonly memoryAvailable?: boolean;
}): Readonly<Record<ExecutiveHvcAdvisorPanel, boolean>> {
  const mode = input.presentationMode;
  const kind = (input.subjectKind ?? "").toLowerCase();

  if (mode === "overview" || mode === "collection") {
    return Object.freeze({
      preparation: false,
      nba: false,
      brief: false,
      memory: false,
    });
  }

  if (mode === "preparation" || input.preparationActive === true) {
    return Object.freeze({
      preparation: true,
      nba: false,
      brief: false,
      memory: false,
    });
  }

  // object-focus
  const isDecision = kind === "decision";
  const isExecutiveWork =
    kind === "problem" ||
    kind === "risk" ||
    kind === "scenario" ||
    kind === "execution" ||
    isDecision;
  const isBusinessObject = kind === "object" || kind === "";

  return Object.freeze({
    preparation: false,
    nba:
      input.nbaAvailable === true &&
      (isExecutiveWork || isBusinessObject),
    brief: input.briefEligible === true && (isExecutiveWork || isBusinessObject),
    memory: input.memoryAvailable === true && isDecision,
  });
}

/** Secondary Stage label line priority by presentation mode. */
export const EXECUTIVE_STAGE_HVC_SECONDARY_LINE_PRIORITY = Object.freeze({
  "object-focus": "state",
  collection: "minimal-state",
  "changes-since-visit": "change-annotation",
  preparation: "preparation-reason",
  overview: "none",
} as const);

export type ExecutiveHvcGrade = "A" | "B" | "C" | "D";

export type ExecutiveHvcStatus =
  | "HVC-PASS"
  | "HVC-PASS-WITH-MINOR-DEBT"
  | "HVC-FAIL"
  | "AwaitingHumanVisualSignOff"
  | "AwaitingRuntimeCaptures";

export function buildExecutiveHvcObservability(input: {
  readonly presentationMode: ExecutiveHvcPresentationMode | string;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly visibleSemanticCount?: number;
  readonly relatedCount?: number;
  readonly watchCount?: number;
  readonly collectionCount?: number;
  readonly preparationCount?: number;
  readonly projectedOverlapCount?: number;
  readonly labelCollisionCount?: number;
  readonly reservedRegionViolationCount?: number;
  readonly viewportClipCount?: number;
  readonly centerQuietZoneViolationCount?: number;
}): Readonly<Record<string, string | number | boolean | null>> {
  return Object.freeze({
    hvcPresentationState: input.presentationMode,
    hvcViewportWidth: input.viewportWidth,
    hvcViewportHeight: input.viewportHeight,
    hvcVisibleSemanticCount: input.visibleSemanticCount ?? 0,
    hvcRelatedCount: input.relatedCount ?? 0,
    hvcWatchCount: input.watchCount ?? 0,
    hvcCollectionCount: input.collectionCount ?? 0,
    hvcPreparationCount: input.preparationCount ?? 0,
    hvcProjectedOverlapCount: input.projectedOverlapCount ?? 0,
    hvcLabelCollisionCount: input.labelCollisionCount ?? 0,
    hvcReservedRegionViolationCount: input.reservedRegionViolationCount ?? 0,
    hvcViewportClipCount: input.viewportClipCount ?? 0,
    hvcCenterQuietZoneViolationCount: input.centerQuietZoneViolationCount ?? 0,
    hvcCameraContract: "fixed",
    hvcTopologyZContract: 0,
    hvcCollectionBudget: EXECUTIVE_STAGE_HVC_BUDGETS.collectionMaxVisible,
    hvcPreparationBudget: EXECUTIVE_STAGE_HVC_BUDGETS.dailyPreparationMaxVisible,
    hvcWatchBudget: EXECUTIVE_STAGE_HVC_BUDGETS.watchMaxVisible,
    hvcSchematicQualifies: false,
  });
}

export function resolveExecutiveHvcEffectiveBudgets(): Readonly<{
  readonly collectionMaxVisible: number;
  readonly preparationMaxVisible: number;
  readonly watchMaxVisible: number;
  readonly relatedMaxVisible: number;
  readonly sourceCollectionDefault: number;
  readonly sourcePreparationDefault: number;
  readonly sourceWatchDefault: number;
}> {
  return Object.freeze({
    collectionMaxVisible: EXECUTIVE_STAGE_HVC_BUDGETS.collectionMaxVisible,
    preparationMaxVisible: EXECUTIVE_STAGE_HVC_BUDGETS.dailyPreparationMaxVisible,
    watchMaxVisible: EXECUTIVE_STAGE_HVC_BUDGETS.watchMaxVisible,
    relatedMaxVisible: EXECUTIVE_STAGE_HVC_BUDGETS.relatedMaxVisible,
    sourceCollectionDefault: EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
    sourcePreparationDefault: EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible,
    sourceWatchDefault: EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible,
  });
}

export function verifyExecutiveStageHumanVisualCertification(options?: {
  readonly forceFailure?: boolean;
  readonly realCaptureCount?: number;
  readonly blockingStatesGradeOk?: boolean;
  readonly machineInvariantsOk?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly status: ExecutiveHvcStatus;
  readonly budgetsCalibrated: boolean;
}> {
  const identity = getExecutiveStageHumanVisualCertificationIdentity();
  const identityValid =
    identity.id === "STAGE-PROD:6V/ExecutiveStageHumanVisualCertification" &&
    identity.version === "1.0.0";
  const boundaryValid =
    EXECUTIVE_STAGE_HVC_BOUNDARY.implementsNewProductCapability === false &&
    EXECUTIVE_STAGE_HVC_BOUNDARY.presentationCalibrationOnly === true &&
    EXECUTIVE_STAGE_HVC_BOUNDARY.schematicCapturesQualifyForHvc === false;

  const budgetsCalibrated =
    EXECUTIVE_STAGE_HVC_BUDGETS.collectionMaxVisible <= 6 &&
    EXECUTIVE_STAGE_HVC_BUDGETS.watchMaxVisible <= 3 &&
    EXECUTIVE_STAGE_HVC_BUDGETS.dailyPreparationMaxVisible <= 6;

  const realCaptures = options?.realCaptureCount ?? 0;
  let status: ExecutiveHvcStatus = "AwaitingRuntimeCaptures";
  if (realCaptures > 0) {
    if (
      options?.blockingStatesGradeOk === true &&
      options?.machineInvariantsOk === true
    ) {
      status = "HVC-PASS-WITH-MINOR-DEBT";
    } else if (options?.machineInvariantsOk === false) {
      status = "HVC-FAIL";
    } else {
      status = "AwaitingHumanVisualSignOff";
    }
  }

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    budgetsCalibrated;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    status,
    budgetsCalibrated,
  });
}
