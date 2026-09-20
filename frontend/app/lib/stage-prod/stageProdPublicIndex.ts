/**
 * NPA-T STAGE-PROD:1 — Public Index.
 * Live Stage foundation over existing NEX-MVP host. Does not replace Stage indexes.
 */

export const stageProdPublicIndexIdentity =
  "NPA-T STAGE-PROD:1/LiveStageFoundationPublicIndex" as const;

export {
  getStageProdLiveFoundationIdentity,
  stageProdLiveFoundationArchitecturalRole,
  stageProdLiveFoundationHostIdentity,
  stageProdLiveFoundationIdentity,
  stageProdLiveFoundationMountName,
  stageProdLiveFoundationNamespace,
  stageProdLiveFoundationPhase,
  stageProdLiveFoundationRoute,
  stageProdLiveFoundationVersion,
} from "./stageProdLiveFoundationIdentity.ts";
export {
  STAGE_PROD_LIVE_FOUNDATION_BOUNDARY,
  verifyStageProdLiveFoundationBoundary,
} from "./stageProdLiveFoundationBoundary.ts";
export { STAGE_PROD_LIVE_FOUNDATION_STATUSES } from "./stageProdLiveFoundationContract.ts";
export type {
  StageProdLiveFoundationIdentities,
  StageProdLiveFoundationProjection,
  StageProdLiveFoundationStatus,
} from "./stageProdLiveFoundationContract.ts";
export { projectStageProdLiveFoundation } from "./stageProdProjectLiveFoundation.ts";
export type { StageProdLiveFoundationInput } from "./stageProdProjectLiveFoundation.ts";
export {
  projectStageProdDirectorComposition,
  stageProdDirectorCompositionIdentity,
} from "./stageProdDirectorComposition.ts";
export type {
  StageProdDirectorComposition,
  StageProdSceneFamily,
} from "./stageProdDirectorComposition.ts";
export {
  projectStageProdContextualVisuals,
  stageProdVisualSpecificationIdentity,
} from "./stageProdVisualSpecification.ts";
export type {
  StageProdChartVisualSpec,
  StageProdStatusCardVisualSpec,
  StageProdVisualProjection,
  StageProdVisualSpec,
} from "./stageProdVisualSpecification.ts";
export {
  projectStageProdInteractiveDisclosure,
  stageProdInteractiveDisclosureIdentity,
} from "./stageProdInteractiveDisclosure.ts";
export type { StageProdInteractiveDisclosure } from "./stageProdInteractiveDisclosure.ts";
export {
  projectStageProdObjectMotion,
  stageProdObjectMotionIdentity,
  STAGE_PROD_OBJECT_MOTION_STATES,
} from "./stageProdObjectMotion.ts";
export type {
  StageProdObjectMotionPresentation,
  StageProdObjectMotionState,
} from "./stageProdObjectMotion.ts";
export {
  projectStageProdSceneMotion,
  stageProdRelationshipAnimationStatus,
  stageProdSceneMotionIdentity,
} from "./stageProdSceneMotion.ts";
export type { StageProdSceneMotionProjection } from "./stageProdSceneMotion.ts";
