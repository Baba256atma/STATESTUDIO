/**
 * DTH:1 — Public Index. Consumer entry for the Decision Theatre foundation.
 * Does not replace Stage, Director, or Runtime public indexes.
 */

export {
  NEXORA_DECISION_THEATRE_AUTHORITY_LAYERS,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_ROLES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreCompatibilityAdapterIdentity,
  nexoraDecisionTheatreFoundationIdentity,
  nexoraDecisionTheatreFoundationNamespace,
  nexoraDecisionTheatreFoundationVersion,
} from "./nexoraDecisionTheatreContract.ts";
export type {
  NexoraDecisionTheatreAdvisorReadableContext,
  NexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatreContract.ts";
export {
  classifyNexoraDecisionTheatreVisualFamily,
  deriveNexoraDecisionTheatreIconicPresentationId,
  isNexoraDecisionTheatreIconicPresentationId,
  NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX,
  NEXORA_DECISION_THEATRE_DATA_ID_PREFIX,
  NEXORA_DECISION_THEATRE_VISUAL_FAMILIES,
  nexoraDecisionTheatreVisualLanguageIdentity,
  nexoraDecisionTheatreVisualLanguageVersion,
  resolveCanonicalExecutiveObjectType,
} from "./nexoraDecisionTheatreVisualFamily.ts";
export {
  deriveNexoraDecisionTheatreDataObjectId,
  nexoraDecisionTheatreDataObjectProjectionIdentity,
  projectCsvImportAsDecisionTheatreDataObject,
} from "./nexoraDecisionTheatreDataObjectProjection.ts";
export type { NexoraDecisionTheatreDataObject } from "./nexoraDecisionTheatreDataObjectProjection.ts";
export {
  nexoraDecisionTheatreDataObjectStageProjectionIdentity,
  projectNexoraDecisionTheatreDataObjectsToStage,
} from "./nexoraDecisionTheatreDataObjectStageProjection.ts";
export type {
  NexoraDecisionTheatreDataObjectStageParticipant,
  NexoraDecisionTheatreDataObjectStageProjection,
} from "./nexoraDecisionTheatreDataObjectStageProjection.ts";
export {
  answerNexoraDecisionTheatreDataObjectInquiry,
  nexoraDecisionTheatreDataObjectAdvisorIdentity,
} from "./nexoraDecisionTheatreDataObjectAdvisor.ts";
export {
  formatNexoraDecisionTheatreIconicAccessibilityLabel,
  getNexoraDecisionTheatreIconicRoleDefinition,
  NEXORA_DECISION_THEATRE_ICONIC_REGISTRY,
  NEXORA_DECISION_THEATRE_ICONIC_ROLES,
  nexoraDecisionTheatreIconicRegistryIdentity,
} from "./nexoraDecisionTheatreIconicRegistry.ts";
export {
  iconicIdsPolluteExecutiveSurface,
  iconicValueHonestlyRepresentable,
  NEXORA_DECISION_THEATRE_ICONIC_SELECTION_LIMIT,
  projectNexoraDecisionTheatreIconicObjects,
} from "./nexoraDecisionTheatreIconicProjection.ts";
export type {
  NexoraDecisionTheatreIconicAuthoritativeSource,
  NexoraDecisionTheatreIconicObject,
} from "./nexoraDecisionTheatreIconicProjection.ts";
export { NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY } from "./nexoraDecisionTheatreDirectorBoundary.ts";
export {
  evaluateNexoraDecisionTheatreInvariants,
  NEXORA_DECISION_THEATRE_INVARIANTS,
} from "./nexoraDecisionTheatreInvariants.ts";
export {
  projectNexoraDecisionTheatreFoundation,
  resolveReservedTheatreRequest,
} from "./nexoraDecisionTheatreStageCompatibility.ts";
export type { NexoraDecisionTheatreProjectionInput } from "./nexoraDecisionTheatreStageCompatibility.ts";
export {
  emitNexoraDecisionTheatreDiagnostics,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIAGNOSTIC_SCOPE,
} from "./nexoraDecisionTheatreDiagnostics.ts";
export { buildNexoraDecisionTheatreAdvisorReadableContext } from "./nexoraDecisionTheatreAdvisorContext.ts";
export {
  NEXORA_DECISION_THEATRE_CHANNEL_MEANING,
  NEXORA_DECISION_THEATRE_VISUAL_CHANNELS,
  nexoraDecisionTheatreVisualGrammarIdentity,
  nexoraDecisionTheatreVisualGrammarVersion,
} from "./nexoraDecisionTheatreVisualGrammar.ts";
export {
  NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE,
  resolveSemanticStateToken,
} from "./nexoraDecisionTheatreSemanticPalette.ts";
export { NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP } from "./nexoraDecisionTheatreChannelOwnership.ts";
export {
  presentationByParticipantId,
  projectNexoraDecisionTheatreVisualGrammar,
  resolveImpactScaleTokens,
} from "./nexoraDecisionTheatreVisualProjection.ts";
export type {
  NexoraDecisionTheatreParticipantVisualPresentation,
  NexoraDecisionTheatreVisualGrammarProjection,
} from "./nexoraDecisionTheatreVisualProjection.ts";
export { resolveNexoraDecisionTheatreRelationshipVisual } from "./nexoraDecisionTheatreRelationshipGrammar.ts";
export { resolveNexoraDecisionTheatreStateSwatch } from "./nexoraDecisionTheatreRendererTokens.ts";
export {
  NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES,
  nexoraDecisionTheatreAtmosphereIdentity,
  nexoraDecisionTheatreAtmosphereVersion,
} from "./nexoraDecisionTheatreAtmosphere.ts";
export { NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY } from "./nexoraDecisionTheatreAtmosphereRegistry.ts";
export { projectNexoraDecisionTheatreAtmosphere } from "./nexoraDecisionTheatreAtmosphereResolver.ts";
export type { NexoraDecisionTheatreAtmosphereAuthority } from "./nexoraDecisionTheatreAtmosphereResolver.ts";
export { resolveNexoraDecisionTheatreAtmosphereSwatch } from "./nexoraDecisionTheatreAtmosphereRendererTokens.ts";
export {
  NEXORA_DECISION_THEATRE_SCENE_INTENT_KINDS,
  NEXORA_DECISION_THEATRE_STAGE_MUTATION_PERMISSIONS,
  nexoraDecisionTheatreSceneIntentIdentity,
  nexoraDecisionTheatreSceneIntentVersion,
} from "./nexoraDecisionTheatreSceneIntent.ts";
export { NEXORA_DECISION_THEATRE_SCENE_INTENT_REGISTRY } from "./nexoraDecisionTheatreSceneIntentRegistry.ts";
export { resolveNexoraDecisionTheatreSceneIntent } from "./nexoraDecisionTheatreSceneIntentResolver.ts";
export {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  nexoraDecisionTheatreSceneSemanticInputIdentity,
} from "./nexoraDecisionTheatreSceneSemanticInput.ts";
export type { NexoraDecisionTheatreSceneSemanticInput } from "./nexoraDecisionTheatreSceneSemanticInput.ts";
export {
  NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLES,
  NEXORA_DECISION_THEATRE_SCENE_ACTOR_ROLE_REGISTRY,
} from "./nexoraDecisionTheatreSceneActorRoles.ts";
export {
  NEXORA_DECISION_THEATRE_SCENE_TRANSITION_POLICIES,
  nexoraDecisionTheatreSceneScriptIdentity,
  nexoraDecisionTheatreSceneScriptVersion,
} from "./nexoraDecisionTheatreSceneScript.ts";
export { composeNexoraDecisionTheatreSceneScript } from "./nexoraDecisionTheatreSceneScriptComposer.ts";
export {
  NEXORA_DECISION_THEATRE_INVESTIGATION_ACTIONS,
  NEXORA_DECISION_THEATRE_INVESTIGATION_LEVELS,
  nexoraDecisionTheatreObjectInvestigationIdentity,
  nexoraDecisionTheatreObjectInvestigationVersion,
} from "./nexoraDecisionTheatreObjectInvestigation.ts";
export {
  investigationTypePriority,
  NEXORA_DECISION_THEATRE_INVESTIGATION_ACTION_ROUTES,
  NEXORA_DECISION_THEATRE_INVESTIGATION_TYPE_PRIORITY,
} from "./nexoraDecisionTheatreObjectInvestigationRegistry.ts";
export { projectNexoraDecisionTheatreObjectInvestigation } from "./nexoraDecisionTheatreObjectInvestigationComposer.ts";
export {
  NEXORA_DECISION_THEATRE_COMPARISON_ACTIONS,
  NEXORA_DECISION_THEATRE_COMPARISON_LEVELS,
  nexoraDecisionTheatreDecisionComparisonIdentity,
  nexoraDecisionTheatreDecisionComparisonVersion,
} from "./nexoraDecisionTheatreDecisionComparison.ts";
export { NEXORA_DECISION_THEATRE_COMPARISON_ACTION_ROUTES } from "./nexoraDecisionTheatreDecisionComparisonRegistry.ts";
export { projectNexoraDecisionTheatreDecisionComparison } from "./nexoraDecisionTheatreDecisionComparisonComposer.ts";
export type {
  NexoraDecisionTheatreActiveComparisonMembership,
  NexoraDecisionTheatreCatalogMember,
  NexoraDecisionTheatreComparisonAuthority,
} from "./nexoraDecisionTheatreDecisionComparisonComposer.ts";
export {
  NEXORA_DECISION_THEATRE_COMMITMENT_ACTIONS,
  NEXORA_DECISION_THEATRE_COMMITMENT_STATES,
  nexoraDecisionTheatreDecisionCommitmentIdentity,
  nexoraDecisionTheatreDecisionCommitmentVersion,
} from "./nexoraDecisionTheatreDecisionCommitment.ts";
export { NEXORA_DECISION_THEATRE_COMMITMENT_ACTION_ROUTES } from "./nexoraDecisionTheatreDecisionCommitmentRegistry.ts";
export { projectNexoraDecisionTheatreDecisionCommitment } from "./nexoraDecisionTheatreDecisionCommitmentComposer.ts";
export type { NexoraDecisionTheatreAuthoritativeDecision } from "./nexoraDecisionTheatreDecisionCommitmentComposer.ts";
export {
  NEXORA_DECISION_THEATRE_EXECUTION_READINESS_ACTIONS,
  NEXORA_DECISION_THEATRE_EXECUTION_READINESS_STATES,
  nexoraDecisionTheatreExecutionReadinessIdentity,
  nexoraDecisionTheatreExecutionReadinessVersion,
} from "./nexoraDecisionTheatreExecutionReadiness.ts";
export { NEXORA_DECISION_THEATRE_EXECUTION_READINESS_ACTION_ROUTES } from "./nexoraDecisionTheatreExecutionReadinessRegistry.ts";
export { projectNexoraDecisionTheatreExecutionReadiness } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
export type { NexoraDecisionTheatreAuthoritativeExecution } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
export {
  NEXORA_DECISION_THEATRE_LIVE_EXECUTION_ACTIONS,
  NEXORA_DECISION_THEATRE_LIVE_EXECUTION_STATES,
  nexoraDecisionTheatreLiveExecutionIdentity,
  nexoraDecisionTheatreLiveExecutionVersion,
} from "./nexoraDecisionTheatreLiveExecution.ts";
export { NEXORA_DECISION_THEATRE_LIVE_EXECUTION_ACTION_ROUTES } from "./nexoraDecisionTheatreLiveExecutionRegistry.ts";
export { projectNexoraDecisionTheatreLiveExecution } from "./nexoraDecisionTheatreLiveExecutionComposer.ts";
export {
  NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_ACTIONS,
  NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_STATES,
  nexoraDecisionTheatreOutcomeObservationIdentity,
  nexoraDecisionTheatreOutcomeObservationVersion,
} from "./nexoraDecisionTheatreOutcomeObservation.ts";
export { NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_ACTION_ROUTES } from "./nexoraDecisionTheatreOutcomeObservationRegistry.ts";
export {
  formatOutcomePercentagePointDelta,
  mapCapturedObservationsForTheatre,
  parseDeliveryOutcomeUtterance,
  projectNexoraDecisionTheatreOutcomeObservation,
} from "./nexoraDecisionTheatreOutcomeObservationComposer.ts";
export type { NexoraDecisionTheatreAuthoritativeOutcomeObservation } from "./nexoraDecisionTheatreOutcomeObservationComposer.ts";
export {
  NEXORA_DECISION_THEATRE_LEARNING_ACTIONS,
  NEXORA_DECISION_THEATRE_LEARNING_EFFECTS,
  NEXORA_DECISION_THEATRE_LEARNING_STATES,
  NEXORA_DECISION_THEATRE_REASSESSMENT_STATES,
  nexoraDecisionTheatreLearningReassessmentIdentity,
  nexoraDecisionTheatreLearningReassessmentVersion,
} from "./nexoraDecisionTheatreLearningReassessment.ts";
export { NEXORA_DECISION_THEATRE_LEARNING_REASSESSMENT_ACTION_ROUTES } from "./nexoraDecisionTheatreLearningReassessmentRegistry.ts";
export { projectNexoraDecisionTheatreLearningReassessment } from "./nexoraDecisionTheatreLearningReassessmentComposer.ts";
export type { NexoraDecisionTheatreAuthoritativeAssumption } from "./nexoraDecisionTheatreLearningReassessmentComposer.ts";

export const nexoraDecisionTheatrePublicIndexIdentity =
  "DTH:1/DecisionTheatrePublicIndex" as const;
export const nexoraDecisionTheatrePublicIndexVersion = "1.0.0" as const;
