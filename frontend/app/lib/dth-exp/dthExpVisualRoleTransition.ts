/**
 * NPA-T DTH-EXP:2 — visual-role transition description.
 * Describes what changes in Theatre projection. Does not animate pixels or write Object truth.
 */

import { dthExpObjectStageRoleIdentity, dthExpObjectStageRoleVersion } from "./dthExpObjectStageRoleIdentity.ts";
import type { DthExpVisualRoleTransition } from "./dthExpObjectStageRoleContract.ts";
import type { DthExpTheatreActor } from "./dthExpTheatreContract.ts";

function changed<T>(left: T, right: T): boolean {
  return JSON.stringify(left) !== JSON.stringify(right);
}

export function describeDthExpVisualRoleTransition(input: {
  readonly from?: DthExpTheatreActor | null;
  readonly to?: DthExpTheatreActor | null;
}): DthExpVisualRoleTransition {
  const from = input.from ?? null;
  const to = input.to ?? null;
  const limitations: string[] = [];
  if (from == null || to == null) {
    limitations.push("missing-actor-for-transition");
  } else if (from.canonicalObjectId !== to.canonicalObjectId) {
    limitations.push("canonical-identity-mismatch");
  }

  const canonicalObjectId = from?.canonicalObjectId ?? to?.canonicalObjectId ?? "";
  const failed = limitations.length > 0;
  return Object.freeze({
    identity: dthExpObjectStageRoleIdentity,
    version: dthExpObjectStageRoleVersion,
    contract: "visual-role-transition",
    canonicalObjectId,
    fromVisualRole: from?.visualRole ?? null,
    toVisualRole: to?.visualRole ?? null,
    fromSceneIdentity: from?.sceneIdentity ?? "",
    toSceneIdentity: to?.sceneIdentity ?? "",
    fromAttention: from?.attention ?? "contextual",
    toAttention: to?.attention ?? "contextual",
    presentationChanged: Object.freeze({
      visualRole: (from?.visualRole ?? null) !== (to?.visualRole ?? null),
      position: changed(from?.presentation.position ?? null, to?.presentation.position ?? null),
      size: changed(from?.presentation.size ?? null, to?.presentation.size ?? null),
      emphasis: (from?.presentation.emphasis ?? "none") !== (to?.presentation.emphasis ?? "none"),
      visibility: (from?.presentation.visibility ?? "visible") !== (to?.presentation.visibility ?? "visible"),
      grouping: (from?.presentation.grouping ?? null) !== (to?.presentation.grouping ?? null),
      attention: (from?.attention ?? "contextual") !== (to?.attention ?? "contextual"),
    }),
    preserved: Object.freeze({
      canonicalObjectId: true as const,
      objectBusinessState: true as const,
      kpiTruth: true as const,
      evidenceTruth: true as const,
      vaiRoleTruth: true as const,
      decisionState: true as const,
      executionState: true as const,
      outcomeState: true as const,
    }),
    animationImplemented: false as const,
    pixelMotionDescribed: false as const,
    projectionStatus: failed ? "failed" : "ok",
    limitations: Object.freeze(limitations),
  });
}
