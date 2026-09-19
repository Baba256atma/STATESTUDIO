/**
 * NPA-T DTH-EXP:1 — Public Index. Theatre Foundation projection only.
 * Does not replace DTH:1, DIR:1, or Stage public indexes.
 */

export {
  dthExpFoundationIdentity,
  dthExpFoundationNamespace,
  dthExpFoundationPhase,
  dthExpFoundationVersion,
  getDthExpFoundationIdentity,
} from "./dthExpIdentity.ts";
export {
  DTH_EXP_AUTHORITY_BOUNDARY,
  verifyDthExpAuthorityBoundary,
} from "./dthExpAuthorityBoundary.ts";
export {
  DTH_EXP_NEXO_FAMILY_IMPLEMENTATION,
  DTH_EXP_NEXO_SCENE_FAMILIES,
  DTH_EXP_NEXO_TIME_BOUNDARY,
  DTH_EXP_VISUAL_ROLE_FAMILY,
  DTH_EXP_VISUAL_ROLES,
  isDthExpVisualRole,
} from "./dthExpVisualRole.ts";
export {
  DTH_EXP_DEFAULT_ACTOR_PRESENTATION,
  DTH_EXP_VAI_ROLE_AUTHORITY,
} from "./dthExpTheatreContract.ts";
export type {
  DthExpActorPresentation,
  DthExpEvidenceAttachment,
  DthExpSceneRelationship,
  DthExpTheatreActor,
  DthExpTheatreScene,
} from "./dthExpTheatreContract.ts";
export { projectDthExpTheatreScene } from "./dthExpProjectTheatreScene.ts";
export type { DthExpTheatreProjectionInput } from "./dthExpProjectTheatreScene.ts";
export {
  dthExpObjectStageRoleArchitecturalRole,
  dthExpObjectStageRoleIdentity,
  dthExpObjectStageRoleNamespace,
  dthExpObjectStageRolePhase,
  dthExpObjectStageRoleVersion,
} from "./dthExpObjectStageRoleIdentity.ts";
export {
  DTH_EXP_OBJECT_STAGE_ROLE_BOUNDARY,
  verifyDthExpObjectStageRoleBoundary,
} from "./dthExpObjectStageRoleBoundary.ts";
export {
  DTH_EXP_SCENE_ATTENTIONS,
  isDthExpSceneAttention,
} from "./dthExpObjectStageRoleContract.ts";
export type {
  DthExpCanonicalObjectRef,
  DthExpSceneAttention,
  DthExpTheatreActorReferent,
  DthExpTheatreActorResolution,
  DthExpVisualRoleTransition,
} from "./dthExpObjectStageRoleContract.ts";
export {
  canonicalRefFromTheatreObject,
  resolveDthExpTheatreActor,
} from "./dthExpResolveTheatreActor.ts";
export { describeDthExpVisualRoleTransition } from "./dthExpVisualRoleTransition.ts";
export {
  dthExpSceneRecipeArchitecturalRole,
  dthExpSceneRecipeIdentity,
  dthExpSceneRecipeNamespace,
  dthExpSceneRecipePhase,
  dthExpSceneRecipeVersion,
} from "./dthExpSceneRecipeIdentity.ts";
export {
  DTH_EXP_SCENE_RECIPE_BOUNDARY,
  verifyDthExpSceneRecipeBoundary,
} from "./dthExpSceneRecipeBoundary.ts";
export {
  DTH_EXP_DEFAULT_RECIPE_FALLBACK,
  DTH_EXP_NEXO_RECIPE_FAMILIES,
  DTH_EXP_NEXO_RECIPE_IMPLEMENTATION,
  DTH_EXP_RECIPE_ANALYTICAL_DIMENSIONS,
  DTH_EXP_RECIPE_FAMILIES,
  DTH_EXP_RECIPE_GROUPINGS,
  DTH_EXP_RECIPE_PARTICIPATIONS,
} from "./dthExpSceneRecipeContract.ts";
export type {
  DthExpSceneRecipe,
  DthExpSceneRecipeContext,
  DthExpSceneRecipeResolution,
} from "./dthExpSceneRecipeContract.ts";
export { resolveDthExpSceneRecipe } from "./dthExpResolveSceneRecipe.ts";
export {
  dthExpNexoFamilyArchitecturalRole,
  dthExpNexoFamilyIdentity,
  dthExpNexoFamilyNamespace,
  dthExpNexoFamilyPhase,
  dthExpNexoFamilyVersion,
} from "./dthExpNexoFamilyIdentity.ts";
export {
  DTH_EXP_NEXO_FAMILY_BOUNDARY,
  verifyDthExpNexoFamilyBoundary,
} from "./dthExpNexoFamilyBoundary.ts";
export {
  DTH_EXP_NEXO_COMPOSITION_PREPARATION,
  DTH_EXP_NEXO_FAMILY_DISPLAY_NAMES,
  DTH_EXP_NEXO_FAMILY_RESOLVER,
  DTH_EXP_NEXO_SHARED_CONTEXT_JOURNEY,
} from "./dthExpNexoFamilyContract.ts";
export type { DthExpNexoFamilyDefinition } from "./dthExpNexoFamilyContract.ts";
export {
  defineNexoBarsRecipe,
  defineNexoBubbleRecipe,
  defineNexoCauseRecipe,
  defineNexoExecutionRecipe,
  defineNexoFlowRecipe,
  defineNexoImpactRecipe,
  defineNexoOutcomeRecipe,
  defineNexoRiskRecipe,
  defineNexoTimeRecipe,
  resolveNexoFamilyRecipe,
} from "./dthExpNexoFamilyRecipes.ts";
export {
  dthExpDirectorNexoSelectionArchitecturalRole,
  dthExpDirectorNexoSelectionIdentity,
  dthExpDirectorNexoSelectionNamespace,
  dthExpDirectorNexoSelectionPhase,
  dthExpDirectorNexoSelectionVersion,
} from "./dthExpDirectorNexoSelectionIdentity.ts";
export {
  DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY,
  verifyDthExpDirectorNexoSelectionBoundary,
} from "./dthExpDirectorNexoSelectionBoundary.ts";
export {
  DTH_EXP_DIRECTOR_MANAGEMENT_NEEDS,
  DTH_EXP_DIRECTOR_NEXO_FAMILIES,
  DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY,
  DTH_EXP_DIRECTOR_NEXO_SELECTION_STATES,
} from "./dthExpDirectorNexoSelectionContract.ts";
export type {
  DthExpDirectorManagementNeed,
  DthExpDirectorNexoSelection,
  DthExpDirectorNexoSelectionInput,
} from "./dthExpDirectorNexoSelectionContract.ts";
export { selectNexoraDirectorNexoFamily } from "./dthExpSelectDirectorNexoFamily.ts";
export {
  dthExpDirectorSceneCompositionArchitecturalRole,
  dthExpDirectorSceneCompositionIdentity,
  dthExpDirectorSceneCompositionNamespace,
  dthExpDirectorSceneCompositionPhase,
  dthExpDirectorSceneCompositionVersion,
} from "./dthExpDirectorSceneCompositionIdentity.ts";
export {
  DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY,
  verifyDthExpDirectorSceneCompositionBoundary,
} from "./dthExpDirectorSceneCompositionBoundary.ts";
export { DTH_EXP_DIRECTOR_SCENE_COMPOSITION_STATES } from "./dthExpDirectorSceneCompositionContract.ts";
export type {
  DthExpDirectorSceneComposition,
  DthExpDirectorSceneCompositionInput,
  DthExpDirectorSceneGraph,
} from "./dthExpDirectorSceneCompositionContract.ts";
export { composeNexoraDirectorSceneContext } from "./dthExpDirectorSceneComposition.ts";
export {
  dthExpSpatialLayoutArchitecturalRole,
  dthExpSpatialLayoutIdentity,
  dthExpSpatialLayoutNamespace,
  dthExpSpatialLayoutPhase,
  dthExpSpatialLayoutVersion,
  DTH_EXP_SPATIAL_LAYOUT_ENGINE,
} from "./dthExpSpatialLayoutIdentity.ts";
export {
  DTH_EXP_SPATIAL_LAYOUT_BOUNDARY,
  verifyDthExpSpatialLayoutBoundary,
} from "./dthExpSpatialLayoutBoundary.ts";
export {
  DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
  DTH_EXP_NORMALIZED_STAGE_SPACE,
  DTH_EXP_SPATIAL_DENSITIES,
  DTH_EXP_SPATIAL_DISCLOSURE_STATES,
} from "./dthExpSpatialLayoutContract.ts";
export type { DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
export { projectDthExpSpatialLayout } from "./dthExpProjectSpatialLayout.ts";
export {
  dthExpSceneTransitionArchitecturalRole,
  dthExpSceneTransitionIdentity,
  dthExpSceneTransitionNamespace,
  dthExpSceneTransitionPhase,
  dthExpSceneTransitionVersion,
  DTH_EXP_SCENE_TRANSITION_ENGINE,
} from "./dthExpSceneTransitionIdentity.ts";
export {
  DTH_EXP_SCENE_TRANSITION_BOUNDARY,
  verifyDthExpSceneTransitionBoundary,
} from "./dthExpSceneTransitionBoundary.ts";
export {
  DTH_EXP_ACTOR_TRANSITION_CLASSES,
  DTH_EXP_MOTION_OPERATIONS,
  DTH_EXP_TIMING_CATEGORIES,
  DTH_EXP_TRANSITION_SEQUENCE,
} from "./dthExpSceneTransitionContract.ts";
export type { DthExpSceneTransitionPlan } from "./dthExpSceneTransitionContract.ts";
export { planDthExpSceneTransition } from "./dthExpPlanSceneTransition.ts";
export {
  dthExpEvidenceSceneArchitecturalRole,
  dthExpEvidenceSceneIdentity,
  dthExpEvidenceSceneNamespace,
  dthExpEvidenceScenePhase,
  dthExpEvidenceSceneVersion,
  DTH_EXP_EVIDENCE_SCENE_ENGINE,
} from "./dthExpEvidenceSceneIdentity.ts";
export {
  DTH_EXP_EVIDENCE_SCENE_BOUNDARY,
  verifyDthExpEvidenceSceneBoundary,
} from "./dthExpEvidenceSceneBoundary.ts";
export {
  DTH_EXP_EVIDENCE_ATTACHMENT_TARGETS,
  DTH_EXP_EVIDENCE_DATA_REALITY_STATES,
  DTH_EXP_EVIDENCE_DISCLOSURE_STATES,
  DTH_EXP_EVIDENCE_MISSING_STATES,
  DTH_EXP_EVIDENCE_SUPPORT_STATES,
} from "./dthExpEvidenceSceneContract.ts";
export type {
  DthExpCanonicalEvidenceRecord,
  DthExpEvidenceSceneProjection,
} from "./dthExpEvidenceSceneContract.ts";
export { projectDthExpEvidenceScene } from "./dthExpProjectEvidenceScene.ts";
export {
  dthExpAdvisorSceneAwarenessArchitecturalRole,
  dthExpAdvisorSceneAwarenessIdentity,
  dthExpAdvisorSceneAwarenessNamespace,
  dthExpAdvisorSceneAwarenessPhase,
  dthExpAdvisorSceneAwarenessVersion,
  DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE,
} from "./dthExpAdvisorSceneAwarenessIdentity.ts";
export {
  DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY,
  verifyDthExpAdvisorSceneAwarenessBoundary,
} from "./dthExpAdvisorSceneAwarenessBoundary.ts";
export {
  DTH_EXP_ADVISOR_AMBIGUITY_STATES,
  DTH_EXP_ADVISOR_UTTERANCE_KINDS,
} from "./dthExpAdvisorSceneAwarenessContract.ts";
export type {
  DthExpAdvisorSceneAwareness,
  DthExpConversationReferentState,
} from "./dthExpAdvisorSceneAwarenessContract.ts";
export { projectDthExpAdvisorSceneAwareness } from "./dthExpProjectAdvisorSceneAwareness.ts";
export {
  dthExpTheatreSceneResponseArchitecturalRole,
  dthExpTheatreSceneResponseIdentity,
  dthExpTheatreSceneResponseNamespace,
  dthExpTheatreSceneResponsePhase,
  dthExpTheatreSceneResponseVersion,
  DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE,
} from "./dthExpTheatreSceneResponseIdentity.ts";
export {
  DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY,
  verifyDthExpTheatreSceneResponseBoundary,
} from "./dthExpTheatreSceneResponseBoundary.ts";
export {
  DTH_EXP_THEATRE_SCENE_RESPONSE_KINDS,
  DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE,
  DTH_EXP_THEATRE_SCENE_RESPONSE_STATES,
} from "./dthExpTheatreSceneResponseContract.ts";
export type { DthExpTheatreSceneResponse } from "./dthExpTheatreSceneResponseContract.ts";
export { orchestrateDthExpTheatreSceneResponse } from "./dthExpOrchestrateTheatreSceneResponse.ts";
export {
  dthExpMultiNexoCompositionArchitecturalRole,
  dthExpMultiNexoCompositionIdentity,
  dthExpMultiNexoCompositionNamespace,
  dthExpMultiNexoCompositionPhase,
  dthExpMultiNexoCompositionVersion,
  DTH_EXP_MULTI_NEXO_COMPOSITION_ENGINE,
} from "./dthExpMultiNexoCompositionIdentity.ts";
export {
  DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY,
  verifyDthExpMultiNexoCompositionBoundary,
} from "./dthExpMultiNexoCompositionBoundary.ts";
export {
  DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
  DTH_EXP_MULTI_NEXO_COMPATIBILITY_STATES,
  DTH_EXP_MULTI_NEXO_CONFLICT_CATEGORIES,
  DTH_EXP_MULTI_NEXO_DISCLOSURE_STATES,
  DTH_EXP_PRIMARY_VISUAL_ROLE,
} from "./dthExpMultiNexoCompositionContract.ts";
export type { DthExpMultiNexoCompositionPlan } from "./dthExpMultiNexoCompositionContract.ts";
export { planDthExpMultiNexoComposition } from "./dthExpPlanMultiNexoComposition.ts";
export {
  dthExpMultiNexoSceneArchitecturalRole,
  dthExpMultiNexoSceneIdentity,
  dthExpMultiNexoSceneNamespace,
  dthExpMultiNexoScenePhase,
  dthExpMultiNexoSceneVersion,
  DTH_EXP_MULTI_NEXO_SCENE_ENGINE,
} from "./dthExpMultiNexoSceneIdentity.ts";
export {
  DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY,
  verifyDthExpMultiNexoSceneBoundary,
} from "./dthExpMultiNexoSceneBoundary.ts";
export {
  DTH_EXP_MULTI_NEXO_COMPOSITION_LAYERS,
  DTH_EXP_MULTI_NEXO_CONFLICT_PRIORITY,
} from "./dthExpMultiNexoSceneContract.ts";
export type { DthExpMultiNexoComposedScene } from "./dthExpMultiNexoSceneContract.ts";
export { composeDthExpMultiNexoScene } from "./dthExpComposeMultiNexoScene.ts";

export const dthExpPublicIndexIdentity = "NPA-T DTH-EXP:1/TheatreFoundationPublicIndex" as const;
export const dthExpPublicIndexVersion = "1.0.0" as const;
export const dthExpObjectStageRolePublicIndexIdentity = "NPA-T DTH-EXP:2/ObjectStageRolesPublicIndex" as const;
export const dthExpSceneRecipePublicIndexIdentity = "NPA-T DTH-EXP:3A/SceneRecipePublicIndex" as const;
export const dthExpNexoFamilyPublicIndexIdentity = "NPA-T DTH-EXP:3B/NexoFamilyPublicIndex" as const;
export const dthExpDirectorNexoSelectionPublicIndexIdentity =
  "NPA-T DTH-EXP:4A/DirectorNexoSelectionPublicIndex" as const;
export const dthExpDirectorSceneCompositionPublicIndexIdentity =
  "NPA-T DTH-EXP:4B/DirectorSceneCompositionPublicIndex" as const;
export const dthExpSpatialLayoutPublicIndexIdentity = "NPA-T DTH-EXP:5A/SpatialLayoutPublicIndex" as const;
export const dthExpSceneTransitionPublicIndexIdentity = "NPA-T DTH-EXP:5B/SceneTransitionPublicIndex" as const;
export const dthExpEvidenceScenePublicIndexIdentity = "NPA-T DTH-EXP:6/EvidenceScenePublicIndex" as const;
export const dthExpAdvisorSceneAwarenessPublicIndexIdentity =
  "NPA-T DTH-EXP:7A/AdvisorSceneAwarenessPublicIndex" as const;
export const dthExpTheatreSceneResponsePublicIndexIdentity =
  "NPA-T DTH-EXP:7B/TheatreSceneResponsePublicIndex" as const;
export const dthExpMultiNexoCompositionPublicIndexIdentity =
  "NPA-T DTH-EXP:8A/MultiNexoCompositionPublicIndex" as const;
export const dthExpMultiNexoScenePublicIndexIdentity = "NPA-T DTH-EXP:8B/MultiNexoScenePublicIndex" as const;
export {
  dthExpTheatreScaleArchitecturalRole,
  dthExpTheatreScaleIdentity,
  dthExpTheatreScaleNamespace,
  dthExpTheatreScalePhase,
  dthExpTheatreScaleVersion,
  DTH_EXP_THEATRE_SCALE_ENGINE,
} from "./dthExpTheatreScaleIdentity.ts";
export {
  DTH_EXP_THEATRE_SCALE_BOUNDARY,
  verifyDthExpTheatreScaleBoundary,
} from "./dthExpTheatreScaleBoundary.ts";
export {
  DTH_EXP_THEATRE_SCALE_ADMISSION_CLASSES,
  DTH_EXP_THEATRE_SCALE_COMPLEXITY,
  DTH_EXP_THEATRE_SCALE_DEFAULT_BUDGET,
  DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER,
  DTH_EXP_THEATRE_SCALE_DENSITIES,
  DTH_EXP_THEATRE_SCALE_LODS,
} from "./dthExpTheatreScaleContract.ts";
export type { DthExpTheatreScaleWorkingSet } from "./dthExpTheatreScaleContract.ts";
export { applyDthExpTheatreScale } from "./dthExpApplyTheatreScale.ts";
export const dthExpTheatreScalePublicIndexIdentity = "NPA-T DTH-EXP:9/TheatreScalePublicIndex" as const;
export {
  dthExpExecutiveJourneyArchitecturalRole,
  dthExpExecutiveJourneyIdentity,
  dthExpExecutiveJourneyNamespace,
  dthExpExecutiveJourneyPhase,
  dthExpExecutiveJourneyVersion,
  DTH_EXP_EXECUTIVE_JOURNEY_ENGINE,
} from "./dthExpExecutiveJourneyIdentity.ts";
export {
  DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY,
  verifyDthExpExecutiveJourneyBoundary,
} from "./dthExpExecutiveJourneyBoundary.ts";
export { DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE } from "./dthExpExecutiveJourneyContract.ts";
export type { DthExpExecutiveJourneySnapshot } from "./dthExpExecutiveJourneyContract.ts";
export { composeDthExpExecutiveJourney } from "./dthExpComposeExecutiveJourney.ts";
export const dthExpExecutiveJourneyPublicIndexIdentity = "NPA-T DTH-EXP:10/ExecutiveJourneyPublicIndex" as const;
export {
  dthExpFinalArchitecturalRole,
  dthExpFinalIdentity,
  dthExpFinalNamespace,
  dthExpFinalPhase,
  dthExpFinalVersion,
  DTH_EXP_FINAL_ENGINE,
} from "./dthExpFinalIdentity.ts";
export {
  DTH_EXP_FINAL_BOUNDARY,
  verifyDthExpFinalBoundary,
} from "./dthExpFinalBoundary.ts";
export const dthExpFinalPublicIndexIdentity = "NPA-T DTH-EXP:FINAL/ProgramPublicIndex" as const;
