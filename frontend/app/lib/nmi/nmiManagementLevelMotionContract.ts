/**
 * NPA-T MLEVEL:4 — spatial transition contract.
 * Interpolates MLEVEL:2 placements using STAGE-MOTION:1 tokens.
 */

import { EXECUTIVE_STAGE_MOTION } from "@/app/lib/spatial-presentation/executiveStageMotion.ts";
import type { ManagementLevelRole } from "./nmiManagementLevelPathContract.ts";
import type {
  ManagementLevelSpatialComposition,
  ManagementLevelSpatialPlacement,
} from "./nmiManagementLevelSpatialContract.ts";
import { nmiManagementLevelMotionIdentity } from "./nmiManagementLevelMotionIdentity.ts";

export const MANAGEMENT_LEVEL_MOTION_KINDS = Object.freeze([
  "PERSISTING_SHIFT",
  "PERSISTING_SAME",
  "ENTERING_ACTIVE",
  "ENTERING_CONTEXT",
  "EXITING_CONTEXT",
] as const);
export type ManagementLevelMotionKind = (typeof MANAGEMENT_LEVEL_MOTION_KINDS)[number];

export const MANAGEMENT_LEVEL_MOTION_PHASES = Object.freeze([
  "idle",
  "transitioning",
  "complete",
] as const);
export type ManagementLevelMotionPhase = (typeof MANAGEMENT_LEVEL_MOTION_PHASES)[number];

export const MANAGEMENT_LEVEL_MOTION_TOKENS = Object.freeze({
  authority: "STAGE-MOTION:1/ExecutiveStageSmoothAnchorRecomposition" as const,
  durationMs: EXECUTIVE_STAGE_MOTION.topologyDurationMs,
  reducedMotionDurationMs: EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs,
  enterDurationMs: EXECUTIVE_STAGE_MOTION.enterDurationMs,
  exitDurationMs: EXECUTIVE_STAGE_MOTION.exitDurationMs,
  enterScaleFrom: EXECUTIVE_STAGE_MOTION.enterScaleFrom,
  enterOpacityFrom: EXECUTIVE_STAGE_MOTION.enterOpacityFrom,
  settleEpsilon: EXECUTIVE_STAGE_MOTION.settleEpsilon,
  easing: "easeOutCubic" as const,
  easingCss: "cubic-bezier(0.215, 0.61, 0.355, 1)" as const,
  interruptionPolicy: "retarget-from-live-sample" as const,
  cameraChoreography: false as const,
  physicalZHierarchy: false as const,
});

export type ManagementLevelMotionTransform = {
  readonly plane: "xy";
  readonly normalized: Readonly<{ x: number; y: number }>;
  readonly world: Readonly<{ x: number; y: number; z: 0 }>;
  readonly scale: number;
  readonly prominence: number;
  readonly worldZ: 0;
};

export type ManagementLevelMotionLiveSample = {
  readonly canonicalId: string;
  readonly normalized: Readonly<{ x: number; y: number }>;
  readonly world: Readonly<{ x: number; y: number; z: 0 }>;
  readonly scale: number;
  readonly prominence: number;
};

export type ManagementLevelMotionParticipant = {
  readonly canonicalId: string;
  readonly kind: ManagementLevelMotionKind;
  readonly sourceRole: ManagementLevelRole | null;
  readonly targetRole: ManagementLevelRole | null;
  readonly source: ManagementLevelMotionTransform;
  readonly target: ManagementLevelMotionTransform;
  readonly targetPlacement: ManagementLevelSpatialPlacement | null;
  readonly semanticSelected: boolean;
  readonly stageCardEligible: boolean;
  readonly clickable: boolean;
  readonly displayIdentity: string | null;
  readonly copiesCanonicalObject: false;
  readonly mutatesOvsManagementState: false;
  readonly mutatesSelectionFocusWatchCritical: false;
};

export type ManagementLevelMotionConnectorSample = {
  readonly fromCanonicalId: string;
  readonly toCanonicalId: string;
  readonly from: Readonly<{ x: number; y: number }>;
  readonly to: Readonly<{ x: number; y: number }>;
  readonly meaning: "hierarchical-containment";
  readonly impliesCausality: false;
};

export type ManagementLevelMotionPlan = {
  readonly identity: typeof nmiManagementLevelMotionIdentity;
  readonly phase: ManagementLevelMotionPhase;
  readonly durationMs: number;
  readonly reducedMotion: boolean;
  readonly easing: typeof MANAGEMENT_LEVEL_MOTION_TOKENS.easing;
  readonly selectedCanonicalId: string | null;
  readonly sourceComposition: ManagementLevelSpatialComposition;
  readonly targetComposition: ManagementLevelSpatialComposition;
  readonly participants: readonly ManagementLevelMotionParticipant[];
  readonly interruptionPolicy: typeof MANAGEMENT_LEVEL_MOTION_TOKENS.interruptionPolicy;
  readonly canonicalNavigationPreceded: true;
  readonly computesIndependentHierarchy: false;
  readonly computesIndependentTargetLayout: false;
  readonly ownsSelectedCanonicalId: false;
  readonly ownsHierarchy: false;
  readonly ownsReferent: false;
  readonly secondAnimationEngine: false;
  readonly cameraChoreography: false;
  readonly usesZForHierarchy: false;
  readonly mutatesLocalLevelStack: false;
  readonly interpolationImplemented: true;
};

export type ManagementLevelMotionSample = {
  readonly identity: typeof nmiManagementLevelMotionIdentity;
  readonly progress: number;
  readonly eased: number;
  readonly settled: boolean;
  readonly phase: ManagementLevelMotionPhase;
  readonly selectedCanonicalId: string | null;
  readonly participants: readonly (ManagementLevelMotionParticipant & {
    readonly current: ManagementLevelMotionTransform;
  })[];
  readonly connectors: readonly ManagementLevelMotionConnectorSample[];
  readonly cardAuthorityMaximum: 3;
  readonly multipliesStageCardLimit: false;
};

export const NMI_MANAGEMENT_LEVEL_MOTION_CONTRACT = Object.freeze({
  identity: nmiManagementLevelMotionIdentity,
  motionAuthority: MANAGEMENT_LEVEL_MOTION_TOKENS.authority,
  pathAuthority: "NPA-T MLEVEL:1/ManagementLevelPath",
  spatialAuthority: "NPA-T MLEVEL:2/ManagementLevelSpatialPlacement",
  interactionAuthority: "NPA-T MLEVEL:3/ManagementLevelInteractionAdapter",
  selectionAuthority: "selectNexoraMVPInteractionSubject",
  tokens: MANAGEMENT_LEVEL_MOTION_TOKENS,
  computesIndependentHierarchy: false as const,
  computesIndependentTargetLayout: false as const,
  secondAnimationEngine: false as const,
  cameraChoreography: false as const,
  usesZForHierarchy: false as const,
  ownsReferent: false as const,
  startsMlevel5: false as const,
});
