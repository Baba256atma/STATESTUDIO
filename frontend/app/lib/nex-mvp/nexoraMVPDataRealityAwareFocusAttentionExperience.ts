/**
 * NEX-MVP consumer of P2:5 Focus & Attention Experience.
 *
 * Applies semantic retain-attention guidance onto existing Stage presentation
 * without moving geometry, changing camera, or rewriting executive truth.
 *
 * Shell may import this module. Low-level Stage meshes must not.
 */

import {
  resolveDataRealityAwareFocusAttentionExperience,
  type DataRealityAwareFocusAttentionExperienceResult,
} from "@/app/lib/data-reality/dataRealityAwareFocusAttentionExperience";
import type { DataRealityAwareMVPRuntimeState } from "@/app/lib/data-reality/dataRealityAwareMVPRuntimeState";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";

export const nexoraMVPDataRealityAwareFocusAttentionExperienceIdentity =
  "NEX-MVP/P2:5/DataRealityAwareFocusAttentionExperienceConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY =
  Object.freeze({
    consumesP22RuntimeState: true as const,
    consumesP25FocusAttention: true as const,
    usesStagePresentationAsTruth: false as const,
    ownsCameraChoreography: false as const,
    repositionsGeometry: false as const,
    inventsSeverityScores: false as const,
  });

export type ResolveNexoraMVPDataRealityAwareFocusAttentionExperienceInput = {
  readonly runtimeState: DataRealityAwareMVPRuntimeState;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

export type NexoraMVPDataRealityAwareFocusAttentionExperienceResult = {
  readonly focusAttention: DataRealityAwareFocusAttentionExperienceResult;
};

/**
 * Resolve P2:5 from a shared P2:2 runtime snapshot.
 */
export function resolveNexoraMVPDataRealityAwareFocusAttentionExperience(
  input: ResolveNexoraMVPDataRealityAwareFocusAttentionExperienceInput,
): NexoraMVPDataRealityAwareFocusAttentionExperienceResult {
  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: input.runtimeState,
    ...(input.selectedObjectId !== undefined
      ? { selectedObjectId: input.selectedObjectId }
      : {}),
    ...(input.focusedObjectId !== undefined
      ? { focusedObjectId: input.focusedObjectId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.workspace !== undefined ? { workspace: input.workspace } : {}),
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
  });

  return Object.freeze({ focusAttention });
}

function retainAttentionVisual(
  object: NexoraMVPStageObjectPresentation,
): NexoraMVPStageObjectPresentation {
  // Keep role + targetPosition unchanged (no geometry choreography).
  // Restore enough visual signal that critical/attention is not muted away.
  return Object.freeze({
    ...object,
    opacity: Math.max(object.opacity, 0.58),
    emissiveIntensity: Math.max(object.emissiveIntensity, 0.18),
    labelProminence:
      object.labelProminence === "minimal" ? "reduced" : object.labelProminence,
  });
}

/**
 * Apply P2:5 retain-attention guidance to Stage presentation.
 * Does not change roles, camera, or object positions.
 */
export function applyDataRealityAwareFocusAttentionToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  focusAttention: DataRealityAwareFocusAttentionExperienceResult,
): NexoraMVPStageInteractionPresentation {
  const retain = new Set(
    focusAttention.presentationGuidance.retainAttentionObjectIds,
  );
  if (retain.size === 0) {
    return presentation;
  }

  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      if (!retain.has(object.id)) return object;
      if (object.role !== "unrelated") return object;
      return retainAttentionVisual(object);
    }),
  );

  const emphasizedObjectIds = Object.freeze(
    Array.from(
      new Set([
        ...presentation.emphasizedObjectIds,
        ...focusAttention.presentationGuidance.retainAttentionObjectIds,
      ]),
    ),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
    }),
    emphasizedObjectIds,
  });
}
