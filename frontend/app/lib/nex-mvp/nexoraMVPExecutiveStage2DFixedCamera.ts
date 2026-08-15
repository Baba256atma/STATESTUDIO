/**
 * STAGE-2D:1 Stage bridge — force the Executive Stage presentation camera
 * onto the fixed 2D contract.
 *
 * Focus / selection / attention / Director choreography may still decide
 * what is important. They must not retarget or move the Stage camera.
 */

import {
  EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY,
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY,
  getExecutiveStage2DFixedCameraIdentity,
  normalizeExecutiveStage2DPosition,
  resolveExecutiveStageFixedCameraTuple,
} from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera";
import type { NexoraMVPStageCameraPresentation } from "./nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "./nexoraMVPObjectInteraction";

export const nexoraMVPExecutiveStage2DFixedCameraIdentity =
  "NEX-MVP/STAGE-2D:1/ExecutiveStage2DFixedCameraBridge" as const;

export const NEXORA_MVP_EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY = Object.freeze({
  ...EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY,
  overridesFocusCamera: true as const,
  overridesOverviewCamera: true as const,
  overridesNavigationOffsets: true as const,
  preservesFocusSelectionAttentionIds: true as const,
});

export function resolveExecutiveStage2DFixedCameraPresentation(): NexoraMVPStageCameraPresentation {
  const tuple = resolveExecutiveStageFixedCameraTuple();
  return Object.freeze({
    position: tuple.position,
    target: tuple.target,
    fov: tuple.fov,
    near: tuple.near,
    far: tuple.far,
  });
}

/**
 * Authoritative camera override for the live Stage presentation pipeline.
 * Preserves selection / focus / attention / topology fields.
 */
export function applyExecutiveStageFixedCameraToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPStageInteractionPresentation {
  const camera = resolveExecutiveStage2DFixedCameraPresentation();
  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      camera,
    }),
  });
}

export function getNexoraMVPExecutiveStage2DFixedCameraObservability(): Readonly<{
  readonly identity: string;
  readonly cameraMode: string;
  readonly cameraTarget: string;
  readonly stageDepth: string;
  readonly contract: string;
}> {
  const identity = getExecutiveStage2DFixedCameraIdentity();
  return Object.freeze({
    identity: identity.id,
    cameraMode: EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY.cameraMode,
    cameraTarget: EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY.cameraTarget,
    stageDepth: EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY.stageDepth,
    contract: EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY.contract,
  });
}

export {
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
  resolveExecutiveStageFixedCameraTuple,
};
