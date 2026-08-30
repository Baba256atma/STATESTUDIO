/**
 * DTH:1 — Developer diagnostics for the Theatre projection path.
 * Must not appear in manager-facing UI or copy.
 */

import { devDiagnosticLog } from "@/app/lib/runtime/diagnosticSwitch.ts";
import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreProjectionInput } from "./nexoraDecisionTheatreStageCompatibility.ts";

export const NEXORA_DECISION_THEATRE_DIAGNOSTIC_SCOPE = "dthDecisionTheatre" as const;

export type NexoraDecisionTheatreDiagnosticTrace = Readonly<{
  identity: typeof NEXORA_DECISION_THEATRE_DIAGNOSTIC_SCOPE;
  runtimeInput: Readonly<{
    workspace: string;
    mode: string;
    focusedId: string | null;
    selectedId: string | null;
    collectionCategory: string | null;
    presentationLevel: string;
    trailObjectIds: readonly string[];
  }>;
  stageSceneInput: Readonly<{
    visibleObjectIds: readonly string[];
    hiddenObjectIds: readonly string[];
    relationshipIds: readonly string[];
  }>;
  directorProjection: NexoraDecisionTheatreFoundation["directorProjection"];
  theatreOutputIdentity: string;
  preservedObjectIds: readonly string[];
  preservedFocus: string | null;
  preservedSelection: string | null;
  preservedRelationships: readonly string[];
  preservedVisibility: readonly string[];
  preservedPresentationLevel: string;
  preservedAttention: Readonly<Record<string, string>>;
  unsupportedFutureCapabilities: readonly string[];
  unauthorizedMutation: false;
  iconicPresentationIds: readonly string[];
  iconicOwnerIds: readonly string[];
  visualGrammarVersion: string;
  visualDirectiveCount: number;
  visualClaimCount: number;
  visualFallbacks: readonly string[];
  visualConflicts: readonly string[];
  visualAtmosphere: "none";
  warRoomAtmosphereMode: string;
  warRoomAtmosphereIntensity: string;
  warRoomAtmosphereTransition: string;
  warRoomAtmosphereClaim: boolean;
  sceneIntentId: string;
  sceneIntentKind: string;
  sceneMutationPermission: string;
  sceneScriptId: string;
  sceneAnchor: string | null;
  sceneActorRoles: readonly string[];
  sceneIconicIds: readonly string[];
  sceneRelationshipIds: readonly string[];
  sceneAtmosphereRef: string;
  scenePreserved: boolean;
  investigationId: string | null;
  investigationObjectId: string | null;
  investigationObjectType: string | null;
  investigationLevel: string | null;
  investigationOpen: boolean;
  investigationEvidenceCount: number;
  investigationRelationshipCount: number;
  investigationComparisonPreserved: boolean;
  investigationActions: readonly string[];
  investigationUnavailableActions: readonly string[];
  investigationAdvisorAnchor: string | null;
  investigationOpenedReason: string | null;
  comparisonId: string | null;
  comparisonCandidateCount: number;
  comparisonLevel: string | null;
  comparisonActiveCandidate: string | null;
  comparisonMembershipSource: string | null;
  comparisonCriteria: readonly string[];
  comparisonMissingCriteria: readonly string[];
  comparisonRecommendationSource: string | null;
  comparisonReadiness: string | null;
  comparisonActions: readonly string[];
  comparisonUnavailableActions: readonly string[];
  commitmentId: string | null;
  commitmentCandidateId: string | null;
  commitmentState: string | null;
  commitmentAuthoritativeId: string | null;
  commitmentComparisonId: string | null;
  commitmentActions: readonly string[];
  commitmentUnavailableActions: readonly string[];
  executionReadinessId: string | null;
  executionReadinessState: string | null;
  executionReadinessDecisionId: string | null;
  executionId: string | null;
  executionStartAvailable: boolean;
  executionUnknownDimensions: readonly string[];
  executionBlockerCount: number;
  liveExecutionId: string | null;
  liveExecutionState: string | null;
  liveExecutionCanonicalStatus: string | null;
  liveExecutionAttentionCount: number;
  liveExecutionUnknowns: readonly string[];
  liveExecutionOutcomeId: string | null;
  outcomeObservationId: string | null;
  outcomeObservationState: string | null;
  outcomeId: string | null;
  outcomeExecutionId: string | null;
  outcomeDecisionId: string | null;
  outcomeGoalId: string | null;
  outcomeDeltaLabel: string | null;
  outcomeBelowTarget: boolean | null;
  outcomeCausalSupport: boolean;
  outcomeCanonicalAvailable: boolean;
  learningReassessmentId: string | null;
  learningState: string | null;
  learningDurable: boolean;
  learningEvidenceQuality: string | null;
  reassessmentState: string | null;
  learningManagerConsent: boolean;
  learningDecisionJourneyReentered: boolean;
  learningCausalSupport: boolean;
}>;

export function inspectNexoraDecisionTheatreProjection(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly projectionInput: NexoraDecisionTheatreProjectionInput;
}): NexoraDecisionTheatreDiagnosticTrace {
  const { theatre, projectionInput } = input;
  const state = projectionInput.stageState;
  return Object.freeze({
    identity: NEXORA_DECISION_THEATRE_DIAGNOSTIC_SCOPE,
    runtimeInput: Object.freeze({
      workspace: state.workspace,
      mode: state.mode,
      focusedId: state.focusedSubject?.id ?? null,
      selectedId: state.selectedSubject?.id ?? null,
      collectionCategory: state.collectionContext?.category ?? null,
      presentationLevel: state.presentationState,
      trailObjectIds: Object.freeze(state.stage2dNavigationTrail.objectIds.slice()),
    }),
    stageSceneInput: Object.freeze({
      visibleObjectIds: Object.freeze(theatre.visibleExecutiveObjects.map((item) => item.id)),
      hiddenObjectIds: theatre.hiddenExecutiveObjectIds,
      relationshipIds: Object.freeze(theatre.relationships.map((item) => item.id)),
    }),
    directorProjection: theatre.directorProjection,
    theatreOutputIdentity: theatre.theatreSceneIdentity,
    preservedObjectIds: Object.freeze(theatre.visibleExecutiveObjects.map((item) => item.id)),
    preservedFocus: theatre.primaryExecutiveObjectId,
    preservedSelection: theatre.selectedExecutiveObjectId,
    preservedRelationships: Object.freeze(theatre.relationships.map((item) => item.id)),
    preservedVisibility: Object.freeze(
      theatre.visibleExecutiveObjects.map((item) => `${item.id}:${item.visibility}`),
    ),
    preservedPresentationLevel: theatre.presentationLevel,
    preservedAttention: theatre.attentionByObjectId,
    unsupportedFutureCapabilities: theatre.capabilities.unsupported,
    unauthorizedMutation: false as const,
    iconicPresentationIds: Object.freeze(theatre.iconicObjects.map((item) => item.presentationId)),
    iconicOwnerIds: Object.freeze(theatre.iconicObjects.map((item) => item.ownerExecutiveObjectId)),
    visualGrammarVersion: theatre.visualGrammar.grammarVersion,
    visualDirectiveCount: theatre.visualGrammar.directives.length,
    visualClaimCount: theatre.visualGrammar.claims.length,
    visualFallbacks: theatre.visualGrammar.fallbacks,
    visualConflicts: Object.freeze(theatre.visualGrammar.conflicts.map((item) => item.code)),
    visualAtmosphere: theatre.visualGrammar.atmosphere,
    warRoomAtmosphereMode: theatre.warRoomAtmosphere.mode,
    warRoomAtmosphereIntensity: theatre.warRoomAtmosphere.intensity,
    warRoomAtmosphereTransition: theatre.warRoomAtmosphere.transitionToken,
    warRoomAtmosphereClaim: theatre.warRoomAtmosphere.claim != null,
    sceneIntentId: theatre.sceneIntent.sceneIntentId,
    sceneIntentKind: theatre.sceneIntent.intentKind,
    sceneMutationPermission: theatre.sceneIntent.stageMutationPermission,
    sceneScriptId: theatre.sceneScript.scriptId,
    sceneAnchor: theatre.sceneScript.anchorActorId,
    sceneActorRoles: Object.freeze(theatre.sceneScript.actors.map((item) => `${item.canonicalId}:${item.role}`)),
    sceneIconicIds: theatre.sceneScript.iconicParticipantIds,
    sceneRelationshipIds: Object.freeze(theatre.sceneScript.relationships.map((item) => item.relationshipId)),
    sceneAtmosphereRef: theatre.sceneScript.atmosphereRef,
    scenePreserved: theatre.sceneScript.advisorReadable.stagePreserved,
    investigationId: theatre.objectInvestigation?.investigationId ?? null,
    investigationObjectId: theatre.objectInvestigation?.objectId ?? null,
    investigationObjectType: theatre.objectInvestigation?.canonicalObjectType ?? null,
    investigationLevel: theatre.objectInvestigation?.level ?? null,
    investigationOpen: theatre.objectInvestigation?.open === true,
    investigationEvidenceCount: theatre.objectInvestigation?.evidence.length ?? 0,
    investigationRelationshipCount: theatre.objectInvestigation?.relationships.length ?? 0,
    investigationComparisonPreserved: theatre.objectInvestigation?.comparisonPreserved === true,
    investigationActions: Object.freeze(
      (theatre.objectInvestigation?.actions ?? [])
        .filter((item) => item.available)
        .map((item) => item.action),
    ),
    investigationUnavailableActions: Object.freeze(
      (theatre.objectInvestigation?.actions ?? [])
        .filter((item) => !item.available)
        .map((item) => `${item.action}:${item.reason}`),
    ),
    investigationAdvisorAnchor: theatre.objectInvestigation?.objectId ?? null,
    investigationOpenedReason: theatre.objectInvestigation?.presenceReason ?? null,
    comparisonId: theatre.decisionComparison?.comparisonId ?? null,
    comparisonCandidateCount: theatre.decisionComparison?.candidateIds.length ?? 0,
    comparisonLevel: theatre.decisionComparison?.level ?? null,
    comparisonActiveCandidate: theatre.decisionComparison?.activeCandidateId ?? null,
    comparisonMembershipSource: theatre.decisionComparison?.membershipSource ?? null,
    comparisonCriteria: Object.freeze((theatre.decisionComparison?.criteria ?? []).filter((item) => item.available).map((item) => item.key)),
    comparisonMissingCriteria: Object.freeze((theatre.decisionComparison?.criteria ?? []).filter((item) => !item.available).map((item) => item.key)),
    comparisonRecommendationSource: theatre.decisionComparison?.recommendation?.source ?? null,
    comparisonReadiness: theatre.decisionComparison?.readiness ?? null,
    comparisonActions: Object.freeze(
      (theatre.decisionComparison?.actions ?? []).filter((item) => item.available).map((item) => item.action),
    ),
    comparisonUnavailableActions: Object.freeze(
      (theatre.decisionComparison?.actions ?? []).filter((item) => !item.available).map((item) => `${item.action}:${item.reason}`),
    ),
    commitmentId: theatre.decisionCommitment?.commitmentId ?? null,
    commitmentCandidateId: theatre.decisionCommitment?.candidateId ?? null,
    commitmentState: theatre.decisionCommitment?.state ?? null,
    commitmentAuthoritativeId: theatre.decisionCommitment?.authoritativeDecisionId ?? null,
    commitmentComparisonId: theatre.decisionCommitment?.comparisonId ?? null,
    commitmentActions: Object.freeze(
      (theatre.decisionCommitment?.actions ?? []).filter((item) => item.available).map((item) => item.action),
    ),
    commitmentUnavailableActions: Object.freeze(
      (theatre.decisionCommitment?.actions ?? []).filter((item) => !item.available).map((item) => `${item.action}:${item.reason}`),
    ),
    executionReadinessId: theatre.executionReadiness?.readinessId ?? null,
    executionReadinessState: theatre.executionReadiness?.readiness ?? null,
    executionReadinessDecisionId: theatre.executionReadiness?.decisionId ?? null,
    executionId: theatre.executionReadiness?.executionId ?? null,
    executionStartAvailable: theatre.executionReadiness?.canRequestExecutionStart === true,
    executionUnknownDimensions: theatre.executionReadiness?.unknownDimensions ?? Object.freeze([]),
    executionBlockerCount: theatre.executionReadiness?.blockers.length ?? 0,
    liveExecutionId: theatre.liveExecution?.liveExecutionId ?? null,
    liveExecutionState: theatre.liveExecution?.state ?? null,
    liveExecutionCanonicalStatus: theatre.liveExecution?.canonicalStatus ?? null,
    liveExecutionAttentionCount: theatre.liveExecution?.attentionSignals.length ?? 0,
    liveExecutionUnknowns: theatre.liveExecution?.unknowns ?? Object.freeze([]),
    liveExecutionOutcomeId: theatre.liveExecution?.outcomeId ?? null,
    outcomeObservationId: theatre.outcomeObservation?.outcomeObservationId ?? null,
    outcomeObservationState: theatre.outcomeObservation?.state ?? null,
    outcomeId: theatre.outcomeObservation?.outcomeId ?? null,
    outcomeExecutionId: theatre.outcomeObservation?.executionId ?? null,
    outcomeDecisionId: theatre.outcomeObservation?.decisionId ?? null,
    outcomeGoalId: theatre.outcomeObservation?.goalId ?? null,
    outcomeDeltaLabel: theatre.outcomeObservation?.deltaLabel ?? null,
    outcomeBelowTarget: theatre.outcomeObservation?.belowTarget ?? null,
    outcomeCausalSupport: theatre.outcomeObservation?.causalSupport ?? false,
    outcomeCanonicalAvailable: theatre.outcomeObservation?.outcomeId != null,
    learningReassessmentId: theatre.learningReassessment?.learningReassessmentId ?? null,
    learningState: theatre.learningReassessment?.state ?? null,
    learningDurable: false,
    learningEvidenceQuality: theatre.learningReassessment?.evidenceQuality ?? null,
    reassessmentState: theatre.learningReassessment?.reassessmentState ?? null,
    learningManagerConsent: theatre.learningReassessment?.managerConsent === true,
    learningDecisionJourneyReentered: false,
    learningCausalSupport: false,
  });
}

export function emitNexoraDecisionTheatreDiagnostics(
  theatre: NexoraDecisionTheatreFoundation,
  projectionInput: NexoraDecisionTheatreProjectionInput,
): NexoraDecisionTheatreDiagnosticTrace {
  const trace = inspectNexoraDecisionTheatreProjection({ theatre, projectionInput });
  devDiagnosticLog(NEXORA_DECISION_THEATRE_DIAGNOSTIC_SCOPE, "DTH:1 theatre projection", trace);
  return trace;
}
