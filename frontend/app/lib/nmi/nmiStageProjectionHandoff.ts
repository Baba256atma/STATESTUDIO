/**
 * NPA-T NMI:6 — hand NMI context to the existing Stage/Director writer.
 * NMI does not write coordinates, layout, or a second Stage store.
 */

import { DirectorFoundationId } from "@/app/lib/director/directorFoundation.ts";
import {
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NmiStageProjection } from "./nmiStageProjectionContract.ts";
import { nmiStageProjectionIdentity } from "./nmiStageProjectionIdentity.ts";

export type NmiStageProjectionHandoffResult = {
  readonly identity: typeof nmiStageProjectionIdentity;
  readonly nextState: NexoraMVPObjectInteractionState;
  readonly selectedCanonicalId: string;
  readonly focusedSubjectId: string | null;
  readonly presentationAuthority: typeof DirectorFoundationId;
  readonly stageWriter: "selectNexoraMVPInteractionSubject";
  readonly nmiWroteStage: false;
  readonly secondStageStore: false;
  readonly secondFocusRegistry: false;
  readonly secondDirector: false;
};

export function handoffNmiStageProjectionToExistingStage(input: {
  readonly projection: NmiStageProjection;
  readonly interactionState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): NmiStageProjectionHandoffResult {
  const nextState = selectNexoraMVPInteractionSubject(
    input.interactionState,
    input.projection.selectedCanonicalId,
    input.catalog,
  );
  return Object.freeze({
    identity: nmiStageProjectionIdentity,
    nextState,
    selectedCanonicalId: input.projection.selectedCanonicalId,
    focusedSubjectId: nextState.focusedSubject?.id ?? null,
    presentationAuthority: DirectorFoundationId,
    stageWriter: "selectNexoraMVPInteractionSubject",
    nmiWroteStage: false,
    secondStageStore: false,
    secondFocusRegistry: false,
    secondDirector: false,
  });
}
