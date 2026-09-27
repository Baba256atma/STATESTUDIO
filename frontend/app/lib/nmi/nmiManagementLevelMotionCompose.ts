/**
 * NPA-T MLEVEL:4 — plan and sample MLEVEL:2 spatial transitions.
 * Uses STAGE-MOTION:1 easing/duration. Does not walk hierarchy or own selection.
 */

import { EXECUTIVE_STAGE_2D_DEPTH } from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera.ts";
import { easeOutCubic } from "@/app/lib/spatial-presentation/executiveStageMotion.ts";
import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import type { ManagementLevelRole } from "./nmiManagementLevelPathContract.ts";
import type {
  ManagementLevelSpatialComposition,
  ManagementLevelSpatialPlacement,
  ManagementLevelSpatialSlot,
} from "./nmiManagementLevelSpatialContract.ts";
import {
  MANAGEMENT_LEVEL_MOTION_TOKENS,
  NMI_MANAGEMENT_LEVEL_MOTION_CONTRACT,
  type ManagementLevelMotionKind,
  type ManagementLevelMotionLiveSample,
  type ManagementLevelMotionParticipant,
  type ManagementLevelMotionPlan,
  type ManagementLevelMotionSample,
  type ManagementLevelMotionTransform,
} from "./nmiManagementLevelMotionContract.ts";
import { nmiManagementLevelMotionIdentity } from "./nmiManagementLevelMotionIdentity.ts";

export type PlanManagementLevelMotionInput = {
  readonly previous: ManagementLevelSpatialComposition | null;
  readonly next: ManagementLevelSpatialComposition;
  readonly selectedCanonicalId: string | null;
  readonly reducedMotion?: boolean;
  readonly liveSamples?: readonly ManagementLevelMotionLiveSample[];
};

function prominenceFor(role: ManagementLevelRole | null): number {
  if (role === "ACTIVE") return 1;
  if (role === "PARENT") return 0.72;
  if (role === "GRANDPARENT") return 0.52;
  return 0;
}

function fromPlacement(
  placement: ManagementLevelSpatialPlacement,
  scale: number,
  role: ManagementLevelRole | null,
): ManagementLevelMotionTransform {
  return Object.freeze({
    plane: "xy",
    normalized: Object.freeze({ ...placement.normalized }),
    world: Object.freeze({ x: placement.world.x, y: placement.world.y, z: 0 as const }),
    scale,
    prominence: prominenceFor(role),
    worldZ: 0 as const,
  });
}

function fromLiveOr(
  live: ManagementLevelMotionLiveSample | undefined,
  fallback: ManagementLevelMotionTransform,
): ManagementLevelMotionTransform {
  if (!live) return fallback;
  return Object.freeze({
    plane: "xy",
    normalized: Object.freeze({ ...live.normalized }),
    world: Object.freeze({ ...live.world, z: 0 as const }),
    scale: live.scale,
    prominence: live.prominence,
    worldZ: 0 as const,
  });
}

function slotById(
  composition: ManagementLevelSpatialComposition | null,
  id: string,
): ManagementLevelSpatialSlot | undefined {
  return composition?.slots.find((slot) => slot.canonicalId === id);
}

function classify(
  previous: ManagementLevelSpatialSlot | undefined,
  next: ManagementLevelSpatialSlot | undefined,
): ManagementLevelMotionKind {
  if (previous && next) {
    if (previous.role === next.role) return "PERSISTING_SAME";
    return "PERSISTING_SHIFT";
  }
  if (!previous && next) {
    return next.role === "ACTIVE" ? "ENTERING_ACTIVE" : "ENTERING_CONTEXT";
  }
  return "EXITING_CONTEXT";
}

function enterSource(target: ManagementLevelMotionTransform): ManagementLevelMotionTransform {
  return Object.freeze({
    ...target,
    scale: target.scale * MANAGEMENT_LEVEL_MOTION_TOKENS.enterScaleFrom,
    prominence: target.prominence * MANAGEMENT_LEVEL_MOTION_TOKENS.enterOpacityFrom,
  });
}

function exitTarget(source: ManagementLevelMotionTransform): ManagementLevelMotionTransform {
  return Object.freeze({
    ...source,
    scale: source.scale * MANAGEMENT_LEVEL_MOTION_TOKENS.enterScaleFrom,
    prominence: MANAGEMENT_LEVEL_MOTION_TOKENS.enterOpacityFrom,
  });
}

function participantOf(
  canonicalId: string,
  previousSlot: ManagementLevelSpatialSlot | undefined,
  nextSlot: ManagementLevelSpatialSlot | undefined,
  selectedCanonicalId: string | null,
  live: ManagementLevelMotionLiveSample | undefined,
): ManagementLevelMotionParticipant {
  const kind = classify(previousSlot, nextSlot);
  const targetRole = nextSlot?.role ?? null;
  const sourceRole = previousSlot?.role ?? null;
  const targetTransform = nextSlot
    ? fromPlacement(nextSlot.placement, nextSlot.scale, nextSlot.role)
    : exitTarget(fromPlacement(previousSlot!.placement, previousSlot!.scale, previousSlot!.role));
  const defaultSource = previousSlot
    ? fromPlacement(previousSlot.placement, previousSlot.scale, previousSlot.role)
    : enterSource(targetTransform);
  const source = fromLiveOr(live, kind.startsWith("ENTERING") && !live ? enterSource(targetTransform) : defaultSource);

  return Object.freeze({
    canonicalId,
    kind,
    sourceRole,
    targetRole,
    source,
    target: targetTransform,
    targetPlacement: nextSlot?.placement ?? null,
    semanticSelected: selectedCanonicalId === canonicalId,
    stageCardEligible: nextSlot?.stageCardEligible === true,
    clickable: nextSlot != null ? nextSlot.clickable : false,
    displayIdentity: nextSlot?.displayIdentity ?? previousSlot?.displayIdentity ?? canonicalId,
    copiesCanonicalObject: false,
    mutatesOvsManagementState: false,
    mutatesSelectionFocusWatchCritical: false,
  });
}

export function planManagementLevelMotion(
  input: PlanManagementLevelMotionInput,
): ManagementLevelMotionPlan {
  const previous = input.previous;
  const next = input.next;
  const selectedCanonicalId = input.selectedCanonicalId;
  const liveById = new Map((input.liveSamples ?? []).map((sample) => [sample.canonicalId, sample]));
  const ids = new Set<string>();
  for (const slot of previous?.slots ?? []) ids.add(slot.canonicalId);
  for (const slot of next.slots) ids.add(slot.canonicalId);

  const participants = Object.freeze(
    [...ids]
      .sort((a, b) => a.localeCompare(b))
      .map((id) =>
        participantOf(id, slotById(previous, id), slotById(next, id), selectedCanonicalId, liveById.get(id)),
      ),
  );

  const reducedMotion = input.reducedMotion === true;
  const needsMotion =
    previous != null &&
    participants.some(
      (item) =>
        item.kind !== "PERSISTING_SAME" ||
        item.source.normalized.x !== item.target.normalized.x ||
        item.source.scale !== item.target.scale,
    );

  return Object.freeze({
    identity: nmiManagementLevelMotionIdentity,
    phase: !needsMotion || reducedMotion ? "complete" : "transitioning",
    durationMs: reducedMotion
      ? MANAGEMENT_LEVEL_MOTION_TOKENS.reducedMotionDurationMs
      : MANAGEMENT_LEVEL_MOTION_TOKENS.durationMs,
    reducedMotion,
    easing: MANAGEMENT_LEVEL_MOTION_TOKENS.easing,
    selectedCanonicalId,
    sourceComposition: previous ?? next,
    targetComposition: next,
    participants,
    interruptionPolicy: MANAGEMENT_LEVEL_MOTION_TOKENS.interruptionPolicy,
    canonicalNavigationPreceded: true,
    computesIndependentHierarchy: false,
    computesIndependentTargetLayout: false,
    ownsSelectedCanonicalId: false,
    ownsHierarchy: false,
    ownsReferent: false,
    secondAnimationEngine: false,
    cameraChoreography: false,
    usesZForHierarchy: false,
    mutatesLocalLevelStack: false,
    interpolationImplemented: true,
  });
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function lerpTransform(
  from: ManagementLevelMotionTransform,
  to: ManagementLevelMotionTransform,
  t: number,
): ManagementLevelMotionTransform {
  return Object.freeze({
    plane: "xy",
    normalized: Object.freeze({
      x: lerp(from.normalized.x, to.normalized.x, t),
      y: lerp(from.normalized.y, to.normalized.y, t),
    }),
    world: Object.freeze({
      x: lerp(from.world.x, to.world.x, t),
      y: lerp(from.world.y, to.world.y, t),
      z: 0 as const,
    }),
    scale: lerp(from.scale, to.scale, t),
    prominence: lerp(from.prominence, to.prominence, t),
    worldZ: 0 as const,
  });
}

export function sampleManagementLevelMotion(
  plan: ManagementLevelMotionPlan,
  progress: number,
): ManagementLevelMotionSample {
  const clamped = Math.min(1, Math.max(0, progress));
  const eased =
    plan.phase === "complete" || plan.reducedMotion || clamped >= 1 ? 1 : easeOutCubic(clamped);
  const settled = eased >= 1 - 1e-9;
  const participants = Object.freeze(
    (settled
      ? plan.participants.filter((item) => item.targetRole != null)
      : plan.participants
    ).map((item) =>
      Object.freeze({
        ...item,
        current: lerpTransform(item.source, item.target, eased),
      }),
    ),
  );

  const byId = new Map(participants.map((item) => [item.canonicalId, item]));
  const connectors = Object.freeze(
    plan.targetComposition.connectors.flatMap((connector) => {
      const from = byId.get(connector.fromCanonicalId);
      const to = byId.get(connector.toCanonicalId);
      if (!from || !to) return [];
      return [
        Object.freeze({
          fromCanonicalId: connector.fromCanonicalId,
          toCanonicalId: connector.toCanonicalId,
          from: from.current.normalized,
          to: to.current.normalized,
          meaning: "hierarchical-containment" as const,
          impliesCausality: false as const,
        }),
      ];
    }),
  );

  return Object.freeze({
    identity: nmiManagementLevelMotionIdentity,
    progress: clamped,
    eased,
    settled,
    phase: settled ? "complete" : "transitioning",
    selectedCanonicalId: plan.selectedCanonicalId,
    participants,
    connectors,
    cardAuthorityMaximum: SCENE_ORG_NORMAL_STAGE_CARD_RULE.maximum,
    multipliesStageCardLimit: false,
  });
}

export function settleManagementLevelMotion(plan: ManagementLevelMotionPlan): ManagementLevelMotionSample {
  return sampleManagementLevelMotion(plan, 1);
}

export function liveSamplesFromMotionSample(
  sample: ManagementLevelMotionSample,
): readonly ManagementLevelMotionLiveSample[] {
  return Object.freeze(
    sample.participants.map((item) =>
      Object.freeze({
        canonicalId: item.canonicalId,
        normalized: item.current.normalized,
        world: item.current.world,
        scale: item.current.scale,
        prominence: item.current.prominence,
      }),
    ),
  );
}

export function motionCssTransition(reducedMotion: boolean): string {
  if (reducedMotion) return "none";
  return `transform ${MANAGEMENT_LEVEL_MOTION_TOKENS.durationMs}ms ${MANAGEMENT_LEVEL_MOTION_TOKENS.easingCss}, opacity ${MANAGEMENT_LEVEL_MOTION_TOKENS.enterDurationMs}ms ${MANAGEMENT_LEVEL_MOTION_TOKENS.easingCss}`;
}

void EXECUTIVE_STAGE_2D_DEPTH;

export { NMI_MANAGEMENT_LEVEL_MOTION_CONTRACT, MANAGEMENT_LEVEL_MOTION_TOKENS };
