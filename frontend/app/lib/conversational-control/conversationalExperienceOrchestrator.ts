/**
 * CC:5 — Thin conversational experience orchestrator.
 *
 * Certified order:
 *   CC:1 Intent → CC:2 Subject (← CC:7 projection) → CC:6 Experience →
 *   CC:3 Command → CC:4 Runtime → CC:7 Context Update → CC:5 feedback
 *
 * Not a new Runtime authority. Production Runtime entry: applyNexoraMVPConversationalCommand.
 */

import {
  executiveAdvisoryPurposeOf,
  isNexoraCanonicalDefinitionInquiry,
  resolveNexoraConversationalIntent,
} from "./conversationalIntentResolver.ts";
import {
  CONVERSATIONAL_INTENT_REASON,
  EXECUTION_CLASS_BY_INTENT_KIND,
} from "./conversationalIntent.ts";
import { resolveNexoraExecutiveConversationalContext } from "./conversationalContextResolver.ts";
import {
  isInvestigateNowUtterance,
  isInvestigationOptionsUtterance,
  isTargetedDeicticInvestigationUtterance,
  classifyExecutiveInvestigationAsk,
  normalizeNexoraConversationalUtterance,
} from "./conversationalIntentNormalization.ts";
import { mapNexoraConversationalCommand } from "./conversationalCommandMapper.ts";
import { resolveNexoraConversationalExperienceContext } from "./conversationalExperienceContextResolver.ts";
import { applyVaiAdvisorToPresentedResponse } from "@/app/lib/vai/vaiAdvisorComposer.ts";
import { applyNmiAdvisorToPresentedResponse } from "@/app/lib/nmi/nmiAdvisorCompose.ts";
import { projectVaiTheatreSymbols } from "@/app/lib/vai/vaiTheatreProjector.ts";
import { composeVaiImpactScene } from "@/app/lib/vai/vaiImpactComposer.ts";
import { applyVaiWhatIfToPresentedResponse } from "@/app/lib/vai/vaiWhatIfAdvisor.ts";
import { projectVaiWhatIfTheatre } from "@/app/lib/vai/vaiWhatIfTheatre.ts";
import { applyVai8ToPresentedResponse, vai8UncertaintyNotes } from "@/app/lib/vai/vaiExperimentDecisionResolver.ts";
import { answerNexoraExiUtterance } from "@/app/lib/nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  type NexoraConversationalExperienceResult,
  type NexoraConversationalExperienceStatus,
  type NexoraConversationalAdvisorGrounding,
  type NexoraConversationalMessage,
  type NexoraConversationalExperienceTrace,
} from "./conversationalExperience.ts";
import { buildNexoraConversationalExperienceResponse } from "./conversationalExperienceResponse.ts";
import type {
  NexoraActiveStageContextSnapshot,
  NexoraConversationContextSnapshot,
  NexoraConversationalSubjectKind,
  NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";
import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { isNexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { applyNexoraMVPConversationalCommand } from "@/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts";
import {
  createEmptyManagerObjectSession,
  freezeManagerObjectSession,
} from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  resolveManagerObjectTurn,
} from "@/app/lib/manager-object/managerObjectInteraction.ts";
import { isExecutiveAttentionUtterance } from "@/app/lib/manager-object/managerObjectAttentionEngine.ts";
import {
  decideSubjectCompositionFidelity,
  isDeicticSubjectExplain,
  isDeicticSubjectFollowUpUtterance,
  isScenarioAssessmentFollowUpOperation,
  isSubjectPreservingAnalyticalFollowUpOperation,
  resolveConversationalCompositionSubject,
  staleScenarioAssessmentWouldCaptureComposition,
} from "./subjectCompositionFidelity.ts";
import { composeExecutiveManagerExperience } from "@/app/lib/manager-object/managerObjectExperienceComposer.ts";
import {
  composeExecutiveInvestigationAnswer,
  threadFromSession,
  withInvestigationThread,
} from "@/app/lib/manager-object/executiveInvestigationComposer.ts";
import { toMoGoalContext } from "@/app/lib/nexora-entrance/nexoraGoalDiscoveryExperience.ts";
import { realityGapForMo } from "@/app/lib/nexora-entrance/nexoraRealityDiscoveryExperience.ts";
import {
  resolveNexoraEntranceTurn,
  shouldNexoraEntranceOwnUtterance,
} from "@/app/lib/nexora-entrance/nexoraEntranceExperience.ts";
import type { NexoraEntranceSession } from "@/app/lib/nexora-entrance/nexoraEntranceTypes.ts";
import { conversationMoveDiagnosticsOf } from "@/app/lib/nexora-conversation/nexoraConversationDiagnostics.ts";
import { conversationThreadDiagnosticsOf } from "@/app/lib/nexora-conversation/nexoraConversationThreadDiagnostics.ts";
import {
  resolveNexoraGuidedEntranceTurn,
  shouldNexoraGuidedEntranceOwnUtterance,
} from "@/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts";
import { shouldNexoraExecutionPlanningOwnUtterance } from "@/app/lib/nexora-entrance/nexoraExecutionPlanning.ts";
import { shouldNexoraOutcomeMonitoringOwnUtterance } from "@/app/lib/nexora-entrance/nexoraOutcomeMonitoring.ts";
import { shouldNexoraLearningReassessmentOwnUtterance } from "@/app/lib/nexora-entrance/nexoraLearningReassessment.ts";
import { shouldNexoraObjectEducationOwnUtterance } from "@/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts";
import { shouldNexoraTrustReviewOwnUtterance } from "@/app/lib/nexora-entrance/nexoraTrustReviewExperience.ts";
import { resolveExecutiveExperienceContext } from "@/app/lib/nexora-entrance/nexoraExecutiveExperienceContext.ts";
import type { NexoraConversationalExperienceContextResolution } from "./conversationalExperienceContext.ts";
import type { NexoraRegisteredExecutiveExperience } from "./conversationalExperienceRegistry.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
  freezeExecutiveContextSnapshot,
  type NexoraExecutiveContextSnapshot,
  type NexoraExecutiveContextUpdateResult,
} from "./executiveContextSnapshot.ts";
import { updateNexoraExecutiveContext } from "./executiveContextUpdater.ts";
import { toNexoraConversationContextSnapshot } from "./executiveContextProjection.ts";
import {
  buildPresentedSetFromCatalogLinks,
  buildPresentedSetFromCollectionState,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveContextAwareness.ts";
import { projectNexoraMVPExecutiveRecommendationEvidence } from "@/app/lib/nex-mvp/nexoraMVPExecutiveRecommendation.ts";
import { resolveNexoraExecutiveRecommendation } from "./executiveRecommendationResolver.ts";
import type { NexoraExecutiveRecommendationResult } from "./executiveRecommendation.ts";
import type { NexoraExecutiveEvidenceFact } from "./executiveRecommendation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  createEmptyNexoraExecutiveScenarioSession,
  resolveNexoraExecutiveScenarioConversation,
  type NexoraExecutiveScenarioConversationResult,
  type NexoraExecutiveScenarioSession,
} from "./executiveScenarioResolver.ts";
import {
  projectNexoraMVPExecutiveScenarioBaseline,
  relatedSubjectIdsForPrimary,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveScenarioConversation.ts";
import type { NexoraScenarioIntervention } from "./executiveScenarioDefinition.ts";
import type { NexoraScenarioAssumption } from "./executiveScenarioDefinition.ts";
import {
  resolveNexoraExecutiveDecisionCommitment,
  type NexoraDecisionCommitmentResult,
} from "./executiveDecisionCommitmentResolver.ts";
import {
  createEmptyNexoraExecutiveDecisionSession,
  setPendingDecisionConfirmation,
  type NexoraExecutiveDecisionSession,
} from "./executiveDecisionAuthority.ts";
import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import type { NexoraExecutionRuntimeAdapter } from "./executiveExecutionRuntimeAdapter.ts";
import {
  resolveNexoraExecutionFollowUpRequest,
  resolveNexoraExecutiveExecutionFollowUp,
} from "./executiveExecutionFollowUp.ts";
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "./executiveExecutionRuntimeAdapter.ts";
import {
  createNexoraPendingTurnExpectation,
  resolveBareNexoraSubjectReference,
  resolveNexoraPendingTurnAnswer,
  type NexoraPendingTurnExpectation,
  type NexoraPendingTurnResolution,
} from "./conversationalTurnExpectation.ts";
import {
  resolveNexoraConversationalActionInvocation,
} from "./conversationalActionDescriptor.ts";
import {
  interpretManagerTurnMeaning,
} from "@/app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import {
  applyContextualMeaningToIntent,
  applyAssistantIntroducedReferent,
  interpretContextualManagerTurn,
  updateConversationContinuity,
} from "@/app/lib/manager-object/nexoraMvpFinal62ConversationContinuity.ts";
import {
  applyClarificationRepair,
  applyResumedMeaningToIntent,
  interpretClarificationTurn,
} from "@/app/lib/manager-object/nexoraMvpFinal63SmartClarification.ts";
import { composeTrustedExecutiveCommunication } from "@/app/lib/manager-object/nexoraMvpFinal64TrustedCommunication.ts";
import { resolveGuidanceTurn } from "@/app/lib/manager-object/nexoraMvpFinal65Guidance.ts";
import {
  applyNcaStrategyToResponse,
  interpretNcaTurn,
  isSocialAckUtterance,
} from "@/app/lib/manager-object/nexoraNca1ConversationArchitecture.ts";
import {
  classifyNexoraSemanticScope,
  composeNexoraSemanticTurn,
  composeProductKnowledgeReply,
  composeWorkspaceReply,
  hydrateCanonicalCollectionMembers,
} from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  answerAdvisorDataInquiry,
  assistantIntroducedDataSourceIds,
  emptyAdvisorDataDialogue,
} from "../manager-object/nexoraAdvisorDataInquiry.ts";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import {
  emitNexoraDecisionTheatreDiagnostics,
  emptyNexoraDecisionTheatreSceneSemanticInput,
  mapCapturedObservationsForTheatre,
  parseDeliveryOutcomeUtterance,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  captureOutcomeObservation,
  listCapturedObservations,
} from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  applyNexoraDialogueEffects,
  composeNca2ContinuityResponse,
  freezeNcaConversationState,
  interpretNcaDialogueTurn,
  investigationSeedQuestion,
  isContextualShortAnswer,
  overlayNcaTurnWithDialogue,
} from "@/app/lib/manager-object/nexoraNca2ConversationState.ts";
import {
  interpretExecutiveComparisonMeaning,
  isExecutiveComparisonCriterionAnswer,
  resolveCollectionComparison,
  resolveExecutiveComparisonCandidateSet,
} from "@/app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts";
import {
  classifyManagerSpeechAct,
  composeManagerObservationReply,
  conversationalIntentKindForCollection,
  interpretExecutiveCollectionQuery,
  interpretManagerProvidedObservation,
  isCompleteManagerBusinessObservation,
  isConsequenceIntentUtterance,
  isManagerCausalAssertion,
  collectionOrdinalIndex,
} from "@/app/lib/manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  composeCausalAssertionReply,
  composeObservationRecallReply,
  composeStaleContextIsolatedObservationReply,
  isObservationRecallUtterance,
  shouldSkipScenarioForManagerObservation,
} from "@/app/lib/manager-object/nexoraNxa5Fix5ObservationPrecedence.ts";
import {
  classifyRequestStageRelationship,
  composeCollectionConfirmationReply,
  composeKnowledgeConsentOffer,
  composePresentationReasonReply,
  composeStageSceneExplanation,
  composeStageVisibilityCorrectionReply,
  isCollectionConfirmation,
  isExplicitPresentationRequest,
  isLayoutProximityRelationshipQuestion,
  isPresentationConsentReply,
  isStageFocusQuestion,
  isStageMembershipQuestion,
  isStageMetaUtterance,
  isStageVisibilityCorrection,
  isVisibilityCausalityQuestion,
  isVisibilityImportanceQuestion,
  projectAuthoritativeStageContext,
  resolveStageOrdinalActor,
  shouldSkipScenarioEngineForStageGroundedComparison,
  type PendingPresentationConsent,
} from "@/app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import {
  composeEcaWorkingConversationContext,
  isEcaMutationCancellation,
  isEcaMutationConfirmation,
  type EcaStageContext,
} from "@/app/lib/nexora-conversation/ecaWorkingConversationContext.ts";
import { handoffEcaRiskMutation } from "@/app/lib/nexora-conversation/ecaRiskMutationHandoff.ts";
import { planEcaExecutiveConversationAction } from "@/app/lib/nexora-conversation/ecaExecutiveIntentActionPlan.ts";
import {
  judgeEcaExecutiveInitiative,
  nextEcaInitiativeSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveInitiativeJudgment.ts";
import {
  applyEcaInformationNeedToPresentedResponse,
  composeEcaRuntimeKnownInformation,
  isEcaInformationRequirementRequest,
  judgeEcaExecutiveInformationNeed,
  nextEcaInformationNeedSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveInformationNeed.ts";
import {
  applyEcaAnswerIntakeToPresentedResponse,
  judgeEcaExecutiveAnswerIntake,
  nextEcaAnswerIntakeSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveAnswerIntake.ts";
import {
  applyEcaDialogueStrategyToPresentedResponse,
  judgeEcaExecutiveDialogueStrategy,
  nextEcaDialogueStrategySession,
} from "@/app/lib/nexora-conversation/ecaExecutiveDialogueStrategy.ts";
import {
  applyEcaRecommendationToPresentedResponse,
  judgeEcaExecutiveRecommendation,
  nextEcaRecommendationSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveRecommendation.ts";
import {
  applyEcaCommitmentToPresentedResponse,
  judgeEcaExecutiveCommitment,
  nextEcaCommitmentSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import {
  applyEcaExecutionReadinessToPresentedResponse,
  judgeEcaExecutiveExecutionReadiness,
  nextEcaExecutionReadinessSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveExecutionReadiness.ts";
import {
  applyEcaLiveExecutionToPresentedResponse,
  judgeEcaLiveExecution,
  nextEcaLiveExecutionSession,
} from "@/app/lib/nexora-conversation/ecaLiveExecution.ts";
import {
  applyEcaOutcomeToPresentedResponse,
  judgeEcaExecutiveOutcome,
  nextEcaOutcomeSession,
  projectEcaOutcomeEvidence,
} from "@/app/lib/nexora-conversation/ecaExecutiveOutcome.ts";
import {
  applyEcaLearningClosureToPresentedResponse,
  judgeEcaExecutiveLearningClosure,
  nextEcaLearningClosureSession,
} from "@/app/lib/nexora-conversation/ecaExecutiveLearningClosure.ts";
import {
  applyNpsUnderstandingToPresentedResponse,
  composeNpsRuntimeProblemUnderstanding,
} from "@/app/lib/nexora-problem-solving/npsProblemUnderstandingRuntime.ts";
import {
  applyNpsEvidenceCauseToPresentedResponse,
  composeNpsRuntimeEvidenceCauseAnalysis,
} from "@/app/lib/nexora-problem-solving/npsEvidenceCauseAnalysisRuntime.ts";
import {
  applyNpsOptionGenerationToPresentedResponse,
  composeNpsRuntimeOptionGeneration,
  resolveNpsRuntimeFocusedOptionId,
} from "@/app/lib/nexora-problem-solving/npsOptionGenerationRuntime.ts";
import {
  applyNpsComparisonRecommendationToPresentedResponse,
  composeNpsRuntimeComparisonRecommendation,
} from "@/app/lib/nexora-problem-solving/npsComparisonRecommendationRuntime.ts";
import {
  applyNpsDecisionCommitmentToPresentedResponse,
  composeNpsRuntimeDecisionCommitment,
  npsComparedOptionRefs,
} from "@/app/lib/nexora-problem-solving/npsDecisionCommitmentRuntime.ts";
import {
  applyNpsExecutionMonitoringToPresentedResponse,
  composeNpsRuntimeExecutionMonitoring,
} from "@/app/lib/nexora-problem-solving/npsExecutionMonitoringRuntime.ts";
import {
  applyNpsOutcomeLearningToPresentedResponse,
  composeNpsRuntimeOutcomeLearning,
} from "@/app/lib/nexora-problem-solving/npsOutcomeLearningRuntime.ts";
import {
  applyNca3StrategyToResponse,
  buildNca3ComparisonCriterionClarification,
  buildNca3ComparisonSubjectClarification,
  evaluateNca3QuestionStrategy,
  overlayNcaTurnWithQuestionStrategy,
} from "@/app/lib/manager-object/nexoraNca3QuestionIntelligence.ts";
import {
  applyNca4StrategyToResponse,
  attachAdvisorySnapshot,
  classifyAdvisoryDialogueMove,
  evaluateNca4AdvisoryStrategy,
} from "@/app/lib/manager-object/nexoraNca4AdvisoryIntelligence.ts";
import {
  applyNca5StrategyToResponse,
  attachInitiativeSnapshot,
  evaluateNca5InitiativeStrategy,
} from "@/app/lib/manager-object/nexoraNca5InitiativeIntelligence.ts";
import {
  applyNca6StrategyToResponse,
  attachCommunicationSnapshot,
  evaluateNca6CommunicationStrategy,
} from "@/app/lib/manager-object/nexoraNca6CommunicationIntelligence.ts";
import { composeNca7TurnResult } from "@/app/lib/manager-object/nexoraNca7EndToEndOrchestration.ts";
import type { ProactiveExecutiveSignal } from "@/app/lib/manager-object/nexoraNca5InitiativeIntelligenceTypes.ts";
import type { ClarificationTurnResult } from "@/app/lib/manager-object/nexoraMvpFinal63ClarificationTypes.ts";
import type { PendingClarification } from "@/app/lib/manager-object/nexoraMvpFinal63ClarificationTypes.ts";
import { resolveNxaAdvisorTurnContract } from "@/app/lib/manager-object/nexoraNxa1ExecutiveAdvisorContract.ts";
import {
  composeNxaContextualEducation,
  composeNxaContextualGuide,
  composeNxaEvidenceChallenge,
  resolveNxaConversationGuidance,
} from "@/app/lib/manager-object/nexoraNxa2ConversationGuidanceContract.ts";
import {
  composeExecutiveSituation,
  composeSituationConflict,
  composeSituationRecovery,
} from "@/app/lib/manager-object/nexoraNxa3ExecutiveSituation.ts";
import {
  composeNxa4MonitoringBoundaryResponse,
  evaluateNxa4ProactiveAdvisory,
} from "@/app/lib/manager-object/nexoraNxa4ProactiveAdvisory.ts";
import {
  evaluateNxa5ExecutiveJudgment,
  type Nxa5JudgmentCandidate,
  type Nxa5JudgmentType,
} from "@/app/lib/manager-object/nexoraNxa5ExecutiveJudgment.ts";
import { collectManagerObjectContext } from "@/app/lib/manager-object/managerObjectContext.ts";
import { EXECUTIVE_QUEUE_CATEGORY_LABELS } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { resolveNexoraUiGuidanceIntent } from "@/app/lib/manager-object/nexoraUiGuidanceIntent.ts";
import { resolveNexoraVisualGuidanceIntent } from "@/app/lib/manager-object/nexoraVisualGuidanceIntent.ts";
import {
  applyNexoraGuidedAttentionRuntime,
  composeNexoraGuidedAttentionCopy,
  emptyNexoraGuidedAttentionRuntime,
  requestNexoraGuidedAttention,
  type NexoraGuidedAttentionPresentation,
  type NexoraGuidedAttentionRuntime,
  type NexoraGuidedAttentionTarget,
} from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import {
  applyNexoraVisualViewRuntime,
  composeNexoraVisualAdvisorCopy,
  emptyNexoraVisualViewRuntime,
  resolveNexoraVisualView,
  type NexoraVisualView,
  type NexoraVisualViewRuntime,
} from "@/app/lib/director/nexoraVisualIntelligence.ts";


export type NexoraConversationalExperienceInput = {
  readonly utterance: string;
  /** Legacy/compat projection. Prefer executiveContext (CC:7). */
  readonly conversationContext?: NexoraConversationContextSnapshot;
  /** CC:7 structured executive context. */
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly activeStageContext?: NexoraActiveStageContextSnapshot | null;
  readonly allowActiveStageContext?: boolean;
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly lastAppliedCommandId?: string | null;
  readonly availableExperiences?: readonly NexoraRegisteredExecutiveExperience[];
  /** Deterministic message id seed (tests). */
  readonly messageIdSeed?: string;
  /** CC:9 session-only scenario drafts. */
  readonly scenarioSession?: import("./executiveScenarioResolver.ts").NexoraExecutiveScenarioSession | null;
  /** CC:10 session metadata (pending confirmation + provenance). */
  readonly decisionSession?: NexoraExecutiveDecisionSession | null;
  /** CC:10R canonical Decision Runtime adapter (product truth). */
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  /** CC:11 canonical Execution Runtime adapter (product truth). */
  readonly executionRuntime?: NexoraExecutionRuntimeAdapter | null;
  /** Deterministic clock for Decision committedAt (tests/Runtime). */
  readonly decisionCommittedAt?: string;
  /** Read-only projection of the existing UX:3 Advisor narrative. */
  readonly advisorGrounding?: NexoraConversationalAdvisorGrounding | null;
  /** UX:4-FIX2 short-lived dialogue expectation. */
  readonly pendingTurnExpectation?: NexoraPendingTurnExpectation | null;
  /** Session-only previous manager utterance for epistemic follow-up continuity. */
  readonly previousUtterance?: string | null;
  /** MO:1 session. Optional; reconstructed from CC:7 when omitted. */
  readonly previousManagerObjectSession?: import("@/app/lib/manager-object/managerObjectActive.ts").ManagerObjectSession | null;
  /** NEX-EXP:1 session. Existing workspace tests omit this. */
  readonly previousEntranceSession?: NexoraEntranceSession | null;
  readonly previousGuidedAttention?: NexoraGuidedAttentionRuntime | null;
  readonly previousVisualView?: NexoraVisualViewRuntime | null;
  readonly visualEvidence?: import("@/app/lib/director/nexoraVisualIntelligence.ts").NexoraVisualEvidenceBundle | null;
  readonly mountedGuidedAttentionTargets?: readonly NexoraGuidedAttentionTarget[];
  readonly attentionNowMs?: number;
  readonly reducedMotion?: boolean;
  /** NCA:5 caller-provided observations. Optional; evaluation remains deterministic without monitoring. */
  readonly initiativeSignals?: readonly ProactiveExecutiveSignal[];
  readonly conversationImportance?: import("@/app/lib/manager-object/nexoraNca5InitiativeIntelligenceTypes.ts").ConversationImportance;
  readonly managerCommunicationContext?: import("@/app/lib/manager-object/nexoraNca6CommunicationIntelligenceTypes.ts").Nca6ManagerContextInput | null;
  /** DTH:8 UI review — Advisor consumes Theatre review without owning Decision truth. */
  readonly theatreDecisionReviewOpen?: boolean | null;
  readonly theatreProposedCandidateId?: string | null;
  /** NPA-T VAI:4 read-only Advisor Variable analysis bundle. Optional. */
  readonly vaiAdvisorBundle?: import("@/app/lib/vai/vaiAdvisorContract.ts").VaiAdvisorBundle | null;
  readonly previousVaiAdvisorSession?: import("@/app/lib/vai/vaiAdvisorContract.ts").VaiAdvisorSession | null;
  /** NPA-A VAI:7 session-scoped what-if overlay. Optional. */
  readonly previousVaiWhatIfSession?: import("@/app/lib/vai/vaiWhatIfContract.ts").VaiWhatIfSession | null;
  readonly vaiTrustedModels?: readonly import("@/app/lib/vai/vaiWhatIfContract.ts").VaiTrustedQuantitativeModel[];
  readonly vaiWhatIfRequestedScope?: { readonly businessContext?: string | null };
  readonly previousVai8PromotionSession?: import("@/app/lib/vai/vaiExperimentDecisionContract.ts").Vai8PromotionSession | null;
  /** NPA-T NMI:7 read-only management intelligence for existing Advisor composition. Optional. */
  readonly nmiAdvisorBundle?: import("@/app/lib/nmi/nmiAdvisorContract.ts").NmiAdvisorBundle | null;
};

function freezeMessage(
  message: NexoraConversationalMessage,
): NexoraConversationalMessage {
  return Object.freeze({ ...message });
}

function deriveMessageIds(seed: string | undefined): {
  readonly managerId: string;
  readonly nexoraId: string;
} {
  const base = seed ?? `cc5-${Date.now()}`;
  return Object.freeze({
    managerId: `${base}-manager`,
    nexoraId: `${base}-nexora`,
  });
}

function asWorkspaceKind(
  value: string | null | undefined,
): NexoraMVPWorkspaceKind | null {
  if (value && isNexoraMVPWorkspaceKind(value)) return value;
  return null;
}

function isRecommendationCommandKind(kind: string | null | undefined): boolean {
  return (
    kind === "request-recommendation" ||
    kind === "request-explanation" ||
    kind === "request-prioritization"
  );
}

function applyScenarioExplanationFidelity(input: {
  readonly intent: import("./conversationalIntent.ts").NexoraConversationalIntent;
  readonly primarySubjectKind: NexoraConversationalSubjectKind | null | undefined;
}): import("./conversationalIntent.ts").NexoraConversationalIntent {
  const { intent, primarySubjectKind } = input;
  if (
    intent.kind === "explain-scenario" &&
    intent.scenarioPayload?.operation === "describe"
  ) {
    return intent;
  }
  if (intent.kind !== "explain") return intent;
  if (primarySubjectKind !== "scenario") return intent;
  if (!isNexoraCanonicalDefinitionInquiry(intent.normalizedUtterance)) {
    return intent;
  }
  return Object.freeze({
    ...intent,
    kind: "explain-scenario" as const,
    executionClass: EXECUTION_CLASS_BY_INTENT_KIND["explain-scenario"],
    requiresTarget: true,
    requiresContext: false,
    reasons: Object.freeze([
      ...intent.reasons,
      CONVERSATIONAL_INTENT_REASON.MATCHED_EXPLAIN_SCENARIO,
    ]),
    scenarioPayload: Object.freeze({ operation: "describe" as const }),
  });
}

function isScenarioCommandKind(kind: string | null | undefined): boolean {
  return (
    kind === "define-scenario" ||
    kind === "modify-scenario" ||
    kind === "evaluate-scenario" ||
    kind === "compare-scenarios" ||
    kind === "explain-scenario" ||
    kind === "open-scenario" ||
    kind === "defer-decision-commitment"
  );
}

function isDecisionCommitmentCommandKind(
  kind: string | null | undefined,
): boolean {
  return (
    kind === "commit-decision" ||
    kind === "approve-decision" ||
    kind === "reject-decision" ||
    kind === "defer-decision" ||
    kind === "reconsider-decision" ||
    kind === "confirm-decision-commitment" ||
    kind === "cancel-decision-commitment" ||
    kind === "prefer-option"
  );
}

function unmodeledSubjectId(raw: string | null | undefined): string {
  const slug = (raw ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `unmodeled:${slug || "unknown"}`;
}

function withUnknownImpactIfNeeded(
  facts: readonly NexoraExecutiveEvidenceFact[],
  utterance: string,
  primarySubjectId: string | null,
): readonly NexoraExecutiveEvidenceFact[] {
  if (!primarySubjectId) return facts;
  if (!/^should\s+we\s+(?:increase|expand|change|address)\b/i.test(utterance.trim())) {
    return facts;
  }
  const existing = facts.find((f) => f.subjectId === primarySubjectId);
  const injected: NexoraExecutiveEvidenceFact = Object.freeze({
    evidenceId: `fact:${primarySubjectId}:unknown-impact`,
    subjectId: primarySubjectId,
    subjectLabel: existing?.subjectLabel,
    attention: existing?.attention,
    status: existing?.status ?? "unresolved",
    factKey: "unknown-impact",
    factValue: true,
    freshness: existing?.freshness ?? "unknown",
    source: Object.freeze({
      sourceKind: "runtime" as const,
      sourceId: primarySubjectId,
      subjectId: primarySubjectId,
      factKey: "unknown-impact",
    }),
  });
  return Object.freeze([...facts, injected]);
}

function resolveRecommendationForTurn(input: {
  readonly utterance: string;
  readonly intentKind: string;
  readonly primarySubjectId: string | null;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): NexoraExecutiveRecommendationResult {
  const catalog =
    input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const primarySubjectId =
    input.primarySubjectId ??
    input.executiveContext.currentSubject?.subjectId ??
    input.executiveContext.currentDecision?.subjectId ??
    input.executiveContext.currentProblem?.subjectId ??
    input.executiveContext.currentGoal?.subjectId ??
    input.executiveContext.currentScenario?.subjectId ??
    input.executiveContext.currentExecution?.subjectId ??
    null;
  const projected = projectNexoraMVPExecutiveRecommendationEvidence({
    catalog,
    executiveContext: input.executiveContext,
    primarySubjectId,
  });
  const facts = withUnknownImpactIfNeeded(
    projected.facts,
    input.utterance,
    primarySubjectId,
  );
  const requestKind =
    input.intentKind === "explain" ||
    input.intentKind === "situation" ||
    input.intentKind === "evidence" ||
    input.intentKind === "change" ||
    input.intentKind === "risk" ||
    input.intentKind === "decision-status" ||
    input.intentKind === "execution-status"
      ? ("explain" as const)
      : input.intentKind === "prioritize"
        ? ("prioritize" as const)
        : ("recommend" as const);
  return resolveNexoraExecutiveRecommendation({
    executiveContext: input.executiveContext,
    primarySubjectId,
    evidence: Object.freeze({
      ...projected,
      facts,
    }),
    requestKind,
  });
}

function hasActiveScenarioAssessment(
  executiveContext: NexoraExecutiveContextSnapshot,
  scenarioSession?: NexoraExecutiveScenarioSession | null,
): boolean {
  if (parentScenarioRef(executiveContext)) return true;
  const activeId = scenarioSession?.activeScenarioId;
  if (!activeId) return false;
  return Boolean(scenarioSession?.evaluationsById[activeId]);
}

function parentScenarioRef(
  executiveContext: NexoraExecutiveContextSnapshot,
): {
  readonly subjectId: string;
  readonly canonicalName: string | null;
} | null {
  const scenario = executiveContext.currentScenario;
  if (scenario?.subjectId) {
    return {
      subjectId: scenario.subjectId,
      canonicalName: scenario.canonicalName ?? null,
    };
  }
  const current = executiveContext.currentSubject;
  if (current?.subjectKind === "scenario" && current.subjectId) {
    return {
      subjectId: current.subjectId,
      canonicalName: current.canonicalName ?? null,
    };
  }
  return null;
}

function subjectLabelFromCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string | null,
): string {
  if (!subjectId) return "this subject";
  return (
    catalog.objects.find((item) => item.id === subjectId)?.label ??
    catalog.contextSubjects.find((item) => item.id === subjectId)?.label ??
    subjectId.replace(/^obj-/, "").replace(/-/g, " ")
  );
}

function seedInvestigationScenarioPair(input: {
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly primarySubjectId: string | null;
  readonly session: NexoraExecutiveScenarioSession;
  readonly baselineAttentionBySubject: Readonly<
    Record<string, "normal" | "elevated" | "important" | "critical" | undefined>
  >;
  readonly relatedSubjectIds: readonly string[];
  readonly catalog: NexoraMVPObjectInteractionCatalog;
}): NexoraExecutiveScenarioSession {
  let session = input.session;
  const label = subjectLabelFromCatalog(input.catalog, input.primarySubjectId);
  const kinds = Object.values(session.scenariosById).map((item) => item.kind);
  if (!kinds.includes("do-nothing")) {
    const defined = resolveNexoraExecutiveScenarioConversation({
      executiveContext: input.executiveContext,
      operation: "define-do-nothing",
      primarySubjectId: input.primarySubjectId,
      requireHorizon: false,
      nameHint: `No Action on ${label}`,
      session,
      baselineAttentionBySubject: input.baselineAttentionBySubject,
      relatedSubjectIds: input.relatedSubjectIds,
      recommendationId: input.executiveContext.lastRecommendationId,
    });
    session = defined.nextSession;
  }
  if (!kinds.includes("intervention") && !Object.values(session.scenariosById).some((item) => item.kind === "intervention")) {
    const defined = resolveNexoraExecutiveScenarioConversation({
      executiveContext: input.executiveContext,
      operation: "define-intervention",
      primarySubjectId: input.primarySubjectId,
      requireHorizon: false,
      nameHint: `Investigate ${label}`,
      interventions: input.primarySubjectId
        ? Object.freeze([
            Object.freeze({
              subjectId: input.primarySubjectId,
              actionKind: "investigate",
            }),
          ])
        : undefined,
      session,
      baselineAttentionBySubject: input.baselineAttentionBySubject,
      relatedSubjectIds: input.relatedSubjectIds,
      recommendationId: input.executiveContext.lastRecommendationId,
    });
    session = defined.nextSession;
  }
  return session;
}

function resolveScenarioForTurn(input: {
  readonly intent: import("./conversationalIntent.ts").NexoraConversationalIntent;
  readonly primarySubjectId: string | null;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
  readonly utterance?: string;
  readonly presentedScenarioIds?: readonly string[];
}): NexoraExecutiveScenarioConversationResult {
  const catalog =
    input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const baseline = projectNexoraMVPExecutiveScenarioBaseline({
    catalog,
    executiveContext: input.executiveContext,
  });
  const payload = input.intent.scenarioPayload ?? null;
  const hintRaw =
    input.intent.targetHints.find((h) => h.role === "primary")?.raw ?? null;
  let session =
    input.scenarioSession ??
    createEmptyNexoraExecutiveScenarioSession({
      baselineAttentionBySubject: baseline.attentionBySubject,
    });
  const active = session.activeScenarioId
    ? session.scenariosById[session.activeScenarioId] ?? null
    : null;
  const parent = parentScenarioRef(input.executiveContext);
  const activeInterventionSubject =
    active?.interventions[0]?.subjectId ??
    active?.subjectIds.find((id) => !id.startsWith("cc9:")) ??
    null;

  const primarySubjectId =
    input.primarySubjectId ??
    (input.executiveContext.currentSubject?.subjectId?.startsWith("cc9:")
      ? null
      : input.executiveContext.currentSubject?.subjectId) ??
    activeInterventionSubject ??
    (hintRaw ? unmodeledSubjectId(hintRaw) : null);

  const conditionSubjectId = primarySubjectId;
  const namedParent =
    parent != null && parent.subjectId.startsWith("ctx-scenario-");
  const modifiesParent =
    namedParent &&
    conditionSubjectId != null &&
    conditionSubjectId !== parent.subjectId &&
    payload?.operation !== "modify" &&
    payload?.operation !== "do-nothing" &&
    (payload?.operation === "intervention" ||
      payload?.operation === "add-assumption" ||
      payload?.actionKind === "delay");

  if (
    parent &&
    !session.scenariosById[parent.subjectId] &&
    (payload?.operation === "describe" || modifiesParent)
  ) {
    const opened = resolveNexoraExecutiveScenarioConversation({
      executiveContext: input.executiveContext,
      operation: "describe",
      primarySubjectId: parent.subjectId,
      session,
      baselineAttentionBySubject: baseline.attentionBySubject,
      recommendationId: input.executiveContext.lastRecommendationId,
    });
    session = opened.nextSession;
  }

  let interventions: readonly NexoraScenarioIntervention[] | undefined;
  let assumptions: readonly NexoraScenarioAssumption[] | undefined;
  const assumptionOperator =
    payload?.actionKind === "delay"
      ? ("delay" as const)
      : payload?.actionKind === "increase-by" ||
          payload?.actionKind === "decrease-by" ||
          payload?.actionKind === "hold"
        ? payload.actionKind
        : null;

  if (modifiesParent && conditionSubjectId && assumptionOperator) {
    assumptions = Object.freeze([
      Object.freeze({
        key: `assume:${conditionSubjectId}:${assumptionOperator}:${payload?.value ?? ""}`,
        subjectId: conditionSubjectId,
        operator: assumptionOperator,
        value: payload?.value,
        unit: payload?.unit,
        state: payload?.state,
        intensity: payload?.intensity,
      }),
    ]);
  } else if (
    payload?.operation === "intervention" ||
    payload?.operation === "modify"
  ) {
    if (conditionSubjectId && payload.actionKind) {
      const investigate =
        isInvestigateNowUtterance(
          normalizeNexoraConversationalUtterance(input.utterance ?? ""),
        ) ||
        classifyExecutiveInvestigationAsk(
          normalizeNexoraConversationalUtterance(input.utterance ?? ""),
        ) === "address-other";
      interventions = Object.freeze([
        Object.freeze({
          subjectId: conditionSubjectId,
          actionKind: investigate ? "investigate" : payload.actionKind,
          value: payload.value,
          unit: payload.unit,
          state: payload.state,
          intensity: payload.intensity,
        }),
      ]);
    } else if (conditionSubjectId) {
      interventions = Object.freeze([
        Object.freeze({
          subjectId: conditionSubjectId,
          actionKind: "unsupported",
        }),
      ]);
    }
  }

  if (!modifiesParent && payload?.operation === "add-assumption") {
    const assumptionSubject =
      input.primarySubjectId ??
      (payload.assumptionSubjectRaw
        ? unmodeledSubjectId(payload.assumptionSubjectRaw)
        : null);
    if (assumptionSubject && assumptionOperator) {
      assumptions = Object.freeze([
        Object.freeze({
          key: `assume:${assumptionSubject}:${assumptionOperator}:${payload.value ?? ""}`,
          subjectId: assumptionSubject,
          operator: assumptionOperator,
          value: payload.value,
          unit: payload.unit,
          state: payload.state,
          intensity: payload.intensity,
        }),
      ]);
    }
  }

  const operation =
    payload?.operation === "commitment-attempt"
      ? ("commitment-attempt" as const)
      : payload?.operation === "compare"
        ? ("compare" as const)
        : payload?.operation === "downside"
          ? ("downside" as const)
          : payload?.operation === "confidence"
            ? ("confidence" as const)
            : payload?.operation === "affected"
              ? ("affected" as const)
              : payload?.operation === "kpi-impact"
                ? ("kpi-impact" as const)
                : payload?.operation === "impact-why"
                  ? ("impact-why" as const)
                  : payload?.operation === "describe"
              ? ("describe" as const)
              : payload?.operation === "explain-preference"
                ? ("explain" as const)
                : payload?.operation === "open-ordinal"
                  ? ("open-candidate" as const)
                  : payload?.operation === "modify"
                    ? ("modify" as const)
                    : modifiesParent || payload?.operation === "add-assumption"
                      ? ("add-assumption" as const)
                      : payload?.operation === "do-nothing"
                        ? ("define-do-nothing" as const)
                        : ("define-intervention" as const);

  const horizon =
    payload?.horizonAmount != null && payload.horizonUnit
      ? Object.freeze({
          amount: payload.horizonAmount,
          unit: payload.horizonUnit,
        })
      : null;

  const relatedIds = relatedSubjectIdsForPrimary({
    catalog,
    primarySubjectId:
      payload?.operation === "describe"
        ? (input.primarySubjectId ?? parent?.subjectId ?? null)
        : conditionSubjectId,
  });

  if (
    operation === "compare" &&
    isInvestigationOptionsUtterance(
      normalizeNexoraConversationalUtterance(input.utterance ?? ""),
    )
  ) {
    session = seedInvestigationScenarioPair({
      executiveContext: input.executiveContext,
      primarySubjectId,
      session,
      baselineAttentionBySubject: baseline.attentionBySubject,
      relatedSubjectIds: relatedIds,
      catalog,
    });
  }

  const presentedScenarioIds = input.presentedScenarioIds ?? [];
  const deicticPluralCompare =
    operation === "compare" &&
    /(?:^|\s)(?:them|those|these)(?:\s|$)/i.test(input.utterance ?? "");

  return resolveNexoraExecutiveScenarioConversation({
    executiveContext: input.executiveContext,
    operation,
    primarySubjectId:
      payload?.operation === "describe"
        ? (input.primarySubjectId ?? parent?.subjectId ?? null)
        : modifiesParent
          ? parent?.subjectId ?? primarySubjectId
          : primarySubjectId,
    interventions,
    assumptions,
    horizon,
  requireHorizon: operation === "define-do-nothing" && Boolean(horizon),
    nameHint:
      operation === "define-do-nothing" && primarySubjectId
        ? `No Action on ${subjectLabelFromCatalog(catalog, primarySubjectId)}`
        : operation === "define-intervention" &&
            interventions?.[0]?.actionKind === "investigate" &&
            primarySubjectId
          ? `Investigate ${subjectLabelFromCatalog(catalog, primarySubjectId)}`
          : null,
    candidateOrdinal: payload?.ordinal ?? null,
    session,
    baselineAttentionBySubject: baseline.attentionBySubject,
    relatedSubjectIds: relatedIds,
    subjectIds: primarySubjectId
      ? Object.freeze([
          primarySubjectId,
          ...relatedIds.filter((id) => id !== primarySubjectId),
        ])
      : relatedIds,
    recommendationId: input.executiveContext.lastRecommendationId,
    compareScenarioIds:
      deicticPluralCompare && presentedScenarioIds.length >= 2
        ? presentedScenarioIds
        : undefined,
  });
}

function resolveDecisionCommitmentForTurn(input: {
  readonly intent: import("./conversationalIntent.ts").NexoraConversationalIntent;
  readonly primarySubjectId: string | null;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly scenarioSession?: NexoraExecutiveScenarioSession | null;
  readonly decisionSession?: NexoraExecutiveDecisionSession | null;
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  readonly commandId?: string;
  readonly utterance: string;
  readonly committedAt?: string;
  readonly catalogScenarioSubjects?: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
  }[] | null;
}): NexoraDecisionCommitmentResult {
  const payload = input.intent.decisionCommitmentPayload;
  const action =
    payload?.action ??
    (input.intent.kind === "prefer-option"
      ? ("preference" as const)
      : input.intent.kind === "reject-decision"
        ? ("reject" as const)
        : input.intent.kind === "defer-decision"
          ? ("defer" as const)
          : input.intent.kind === "reconsider-decision"
            ? ("reconsider" as const)
            : input.intent.kind === "confirm-decision-commitment"
              ? ("confirm" as const)
              : input.intent.kind === "cancel-decision-commitment"
                ? ("cancel" as const)
                : ("approve" as const));
  const strength =
    payload?.strength ??
    (action === "preference" ? ("preference" as const) : ("explicit" as const));
  const hintRaw =
    input.intent.targetHints.find((h) => h.role === "primary")?.raw ?? null;

  return resolveNexoraExecutiveDecisionCommitment({
    action,
    strength,
    executiveContext: input.executiveContext,
    decisionSession:
      input.decisionSession ?? createEmptyNexoraExecutiveDecisionSession(),
    decisionRuntime:
      input.decisionRuntime ??
      createNexoraCanonicalDecisionRuntime().adapter,
    scenarioSession: input.scenarioSession ?? null,
    targetHintRaw: hintRaw,
    primarySubjectId: input.primarySubjectId,
    commandId: input.commandId,
    utterance: input.utterance,
    hasCompoundExecutionRequest: payload?.hasCompoundExecutionRequest === true,
    committedAt: input.committedAt,
    catalogScenarioSubjects: input.catalogScenarioSubjects ?? null,
  });
}

function bootstrapExecutiveContext(input: {
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly conversationContext?: NexoraConversationContextSnapshot | null;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
}): NexoraExecutiveContextSnapshot {
  if (input.executiveContext) return input.executiveContext;

  const legacy: NexoraConversationContextSnapshot =
    input.conversationContext ?? Object.freeze({});
  const currentId = legacy.currentSubjectId ?? null;
  const record = currentId
    ? input.executiveSubjects.find((s) => s.subjectId === currentId) ?? null
    : null;

  const previousSubjects = Object.freeze(
    (legacy.previousSubjectIds ?? [])
      .map((id) => {
        const r = input.executiveSubjects.find((s) => s.subjectId === id);
        if (!r) return null;
        return freezeExecutiveContextReference({
          subjectId: r.subjectId,
          subjectKind: r.subjectKind,
          canonicalName: r.canonicalName,
          source: "conversation",
          turnIndex: 0,
        });
      })
      .filter((x): x is NonNullable<typeof x> => x != null),
  );

  const presentedIds = legacy.presentedSubjectIds ?? [];
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: record
      ? freezeExecutiveContextReference({
          subjectId: record.subjectId,
          subjectKind: record.subjectKind,
          canonicalName: record.canonicalName,
          source: "conversation",
          turnIndex: 0,
        })
      : null,
    previousSubjects,
    currentWorkspaceId:
      legacy.currentWorkspaceId ?? input.runtimeState.workspace ?? null,
    currentModelId: legacy.currentModelId ?? null,
    presentedSet:
      presentedIds.length > 0
        ? Object.freeze({
            kind: (legacy.presentedSetKind as "problems") ?? "subjects",
            subjectIds: Object.freeze([...presentedIds]),
            anchorSubjectId: legacy.presentedAnchorSubjectId ?? null,
            turnIndex: 0,
          })
        : null,
    turnIndex: 0,
  });
}

function focusedKind(
  state: NexoraMVPObjectInteractionState,
): NexoraConversationalSubjectKind | null {
  const kind = state.focusedSubject?.kind;
  if (
    kind === "object" ||
    kind === "problem" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution" ||
    kind === "outcome" ||
    kind === "goal"
  ) {
    return kind;
  }
  return kind ? "unknown" : null;
}

function mapExperienceStatus(input: {
  readonly contextStatus: string;
  readonly experienceDecision?: string | null;
  readonly experienceStatus?: string | null;
  readonly commandStatus: string | null;
  readonly runtimeStatus: string | null;
  readonly intentKind: string;
}): NexoraConversationalExperienceStatus {
  if (input.intentKind === "unknown") return "unsupported";

  if (input.experienceDecision === "clarification-required") {
    return "clarification-required";
  }
  if (
    input.experienceDecision === "unsupported" ||
    input.experienceStatus === "not-found" ||
    input.experienceStatus === "unsupported"
  ) {
    return "not-found";
  }
  if (
    input.experienceStatus === "keep-current" &&
    input.runtimeStatus == null &&
    input.commandStatus == null
  ) {
    return "no-op";
  }

  if (input.contextStatus === "missing-context") return "clarification-required";
  if (input.contextStatus === "ambiguous") return "clarification-required";
  if (input.contextStatus === "not-found") return "not-found";

  if (input.commandStatus === "unsupported-intent") return "unsupported";
  if (input.commandStatus === "missing-target") return "clarification-required";
  if (input.commandStatus === "ambiguous-context") return "clarification-required";
  if (input.commandStatus === "invalid-context") return "not-found";
  if (input.commandStatus === "confirmation-required") {
    return "confirmation-required";
  }

  if (input.runtimeStatus === "unsupported") return "unsupported";
  if (input.runtimeStatus === "confirmation-required") {
    return "confirmation-required";
  }
  if (input.runtimeStatus === "no-op") return "no-op";
  if (input.runtimeStatus === "rejected") return "failed";
  if (input.runtimeStatus === "applied") return "applied";

  if (input.commandStatus === "mapped" && input.runtimeStatus == null) {
    return "failed";
  }

  return "failed";
}

function resolveIntentForTurn(
  managerUtterance: string,
  semanticUtterance: string,
): NexoraConversationalExperienceResult["intentResult"] {
  const resolved = resolveNexoraConversationalIntent({
    utterance: semanticUtterance,
  });
  if (managerUtterance === semanticUtterance) return resolved;
  return Object.freeze({
    intent: Object.freeze({
      ...resolved.intent,
      utterance: managerUtterance,
    }),
    trace: Object.freeze({
      ...resolved.trace,
      utterance: managerUtterance,
    }),
  });
}

function collectionKindToShowIntent(
  kind: string | null | undefined,
): NexoraConversationalExperienceResult["intentResult"]["intent"]["kind"] | null {
  const token = (kind ?? "").toLowerCase();
  if (token.includes("problem") || token === "risk" || token === "opportunity") {
    return "show-problems";
  }
  if (token.includes("scenario")) return "show-scenarios";
  if (token.includes("decision")) return "show-decisions";
  if (token.includes("execution")) return "show-execution";
  if (token.includes("goal")) return "show-goals";
  return null;
}

function overlayCollectionOrDeicticIntent(
  intentResult: NexoraConversationalExperienceResult["intentResult"],
  utterance: string,
  lastCollectionKind: string | null,
): NexoraConversationalExperienceResult["intentResult"] {
  const query = interpretExecutiveCollectionQuery(utterance);
  const mapped =
    query && !query.ambiguousIssueNoun
      ? conversationalIntentKindForCollection(query)
      : null;
  const prepared = utterance.trim().toLowerCase().replace(/[?.!]+$/g, "");
  const deicticPlural =
    /^(?:show|open|list|see|explain)(?:\s+me)?\s+(?:them|those|these)$/.test(prepared) ||
    /^(?:the|these|those)\s+(?:problems|scenarios|decisions|executions|goals)$/.test(prepared) ||
    /^how many(?:\s+are there)?$/.test(prepared);
  const kind =
    mapped ??
    (deicticPlural ? collectionKindToShowIntent(lastCollectionKind) : null);
  if (!kind || intentResult.intent.kind === kind) return intentResult;
  const overlayable =
    intentResult.intent.kind === "unknown" ||
    intentResult.intent.kind === "focus" ||
    intentResult.intent.kind === "explain" ||
    classifyManagerSpeechAct(utterance) === "CORRECTION";
  if (!overlayable) return intentResult;
  if (intentResult.intent.kind === "focus" && intentResult.intent.targetHints.length > 0 && !mapped) {
    return intentResult;
  }
  return Object.freeze({
    intent: Object.freeze({
      ...intentResult.intent,
      kind,
      requiresTarget: false,
      requiresContext: false,
      targetHints: Object.freeze([]),
      executionClass: EXECUTION_CLASS_BY_INTENT_KIND[kind] ?? intentResult.intent.executionClass,
    }),
    trace: intentResult.trace,
  });
}

function withoutInterruptionSuffix(utterance: string): string {
  return utterance.replace(/\s+instead[.!?]*\s*$/i, "").trim();
}

function managerOverrideSemanticUtterance(utterance: string): string {
  const match = utterance.match(/(?:^|[.!?]\s*)(show|focus(?: on)?|open|go to)\s+(.+)$/i);
  if (!match || !/^(?:no\b|forget\b)/i.test(utterance.trim())) return utterance;
  return `${match[1]} ${match[2]}`.trim();
}

function pendingClarification(
  expectation: NexoraPendingTurnExpectation,
): string {
  if (expectation.expectedAnswerKind === "scenario-selection") {
    return "Which scenario do you mean?";
  }
  if (expectation.expectedAnswerKind === "subject-selection") {
    return "Which subject do you mean?";
  }
  if (expectation.questionKind === "decision-commitment") {
    return "Which option do you want to commit to?";
  }
  return "Could you clarify what you want to review?";
}

function declinedPendingResponse(
  expectation: NexoraPendingTurnExpectation,
): string {
  if (expectation.questionKind === "review-subject") {
    return "Understood. We can stay with the current executive context.";
  }
  if (expectation.questionKind === "show-evidence") {
    return "Understood. I’ll keep the current evidence details closed.";
  }
  if (expectation.questionKind === "compare-scenarios") {
    return "Understood. I won’t open the scenario comparison.";
  }
  return "Understood.";
}

/**
 * Primary CC:5 API — execute one executive utterance through CC:1–7–4.
 */
export function executeNexoraConversationalExperience(
  input: NexoraConversationalExperienceInput,
): NexoraConversationalExperienceResult & {
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
} {
  const utterance = typeof input.utterance === "string" ? input.utterance : "";
  const boundDecisionRuntime =
    input.decisionRuntime !== undefined
      ? input.decisionRuntime
      : createNexoraCanonicalDecisionRuntime().adapter;
  const boundExecutionRuntime =
    input.executionRuntime !== undefined
      ? input.executionRuntime
      : boundDecisionRuntime
        ? createNexoraCanonicalExecutionRuntime({ decisionRuntime: boundDecisionRuntime })
        : null;
  const dataLibraryAnswer = answerAdvisorDataInquiry({
    workspaceId: input.runtimeState.workspace,
    utterance,
    dialogue: input.previousManagerObjectSession?.advisorDataDialogue ?? emptyAdvisorDataDialogue,
    focusedObjectLabel: input.runtimeState.focusedSubject?.label ?? null,
    conversationContinuity: input.previousManagerObjectSession?.conversationContinuity ?? null,
  });
  const ids = deriveMessageIds(input.messageIdSeed);
  const persistEntranceSession = input.previousEntranceSession ?? null;
  const previousGuidedAttention =
    input.previousGuidedAttention ?? emptyNexoraGuidedAttentionRuntime();
  const previousVisualView =
    input.previousVisualView ?? emptyNexoraVisualViewRuntime();
  const mountedGuidedAttentionTargets = input.mountedGuidedAttentionTargets ??
    Object.freeze(["DATA_ENTRY", "STAGE"] as const);
  const attentionNowMs = input.attentionNowMs ?? 0;
  const finish = (
    args: Parameters<typeof finalize>[0],
  ): ReturnType<typeof finalize> => {
    const guidedAttention = applyNexoraGuidedAttentionRuntime({
      previous: previousGuidedAttention,
      request: args.guidedAttentionRequest,
      pendingOfferTarget: args.pendingOfferTarget,
      clear: args.clearGuidedAttention === true,
      nowMs: attentionNowMs,
    });
    const visualView = applyNexoraVisualViewRuntime({
      previous: previousVisualView,
      request: args.visualViewRequest,
      dismiss: args.dismissVisualView === true,
    });
    return finalize({
      ...args,
      previousUtterance: input.previousUtterance ?? args.previousUtterance ?? null,
      runtimeStateBeforeTurn: input.runtimeState,
      nextEntranceSession:
        args.nextEntranceSession !== undefined
          ? args.nextEntranceSession
          : persistEntranceSession,
      initiativeSignals: input.initiativeSignals,
      conversationImportance: input.conversationImportance,
      managerCommunicationContext: input.managerCommunicationContext,
      theatreDecisionReviewOpen: input.theatreDecisionReviewOpen,
      theatreProposedCandidateId: input.theatreProposedCandidateId,
      vaiAdvisorBundle: input.vaiAdvisorBundle ?? null,
      previousVaiAdvisorSession: input.previousVaiAdvisorSession ?? null,
      previousVaiWhatIfSession: input.previousVaiWhatIfSession ?? null,
      vaiTrustedModels: input.vaiTrustedModels,
      vaiWhatIfRequestedScope: input.vaiWhatIfRequestedScope,
      previousVai8PromotionSession: input.previousVai8PromotionSession ?? null,
      nmiAdvisorBundle: input.nmiAdvisorBundle ?? null,
      decisionRuntime: args.decisionRuntime ?? boundDecisionRuntime,
      executionRuntime: args.executionRuntime ?? boundExecutionRuntime,
      canonicalExecutionRuntimeProvided: input.executionRuntime != null,
      guidedAttention,
      visualView,
    });
  };
  const bootstrappedExecutiveContext = bootstrapExecutiveContext({
    executiveContext: input.executiveContext,
    conversationContext: input.conversationContext,
    runtimeState: input.runtimeState,
    executiveSubjects: input.executiveSubjects,
  });
  const previousExecutiveContext = freezeExecutiveContextSnapshot({
    ...bootstrappedExecutiveContext,
    currentRecommendedAction:
      input.advisorGrounding?.primaryAction ??
      bootstrappedExecutiveContext.currentRecommendedAction,
  });
  const previousContextRaw = toNexoraConversationContextSnapshot(
    previousExecutiveContext,
  );
  const collectionMembers =
    input.previousManagerObjectSession?.ncaConversationState?.lastCollection;
  const previousContext =
    (previousContextRaw.presentedSubjectIds?.length ?? 0) > 0 ||
    !collectionMembers?.memberIds?.length
      ? previousContextRaw
      : Object.freeze({
          ...previousContextRaw,
          presentedSubjectIds: Object.freeze([...collectionMembers.memberIds]),
          presentedSetKind:
            previousContextRaw.presentedSetKind ??
            collectionMembers.kind.toLowerCase(),
        });

  try {
    const guidanceIntent = resolveNexoraUiGuidanceIntent({
      utterance,
      pendingOfferTarget: previousGuidedAttention.pendingOfferTarget,
    });
    if (guidanceIntent.kind === "LOCATE_UI" && guidanceIntent.target) {
      const presentation = requestNexoraGuidedAttention({
        target: guidanceIntent.target,
        mountedTargets: mountedGuidedAttentionTargets,
        nowMs: attentionNowMs,
        reducedMotion: input.reducedMotion === true,
        previous: previousGuidedAttention.presentation,
        requestId: `ga-${attentionNowMs}-${guidanceIntent.target}`,
      });
      const intentResult = resolveNexoraConversationalIntent({ utterance });
      const contextResult = resolveNexoraExecutiveConversationalContext({
        intent: intentResult.intent,
        executiveSubjects: input.executiveSubjects,
        conversationContext: previousContext,
      });
      return finish({
        status: "applied",
        response: composeNexoraGuidedAttentionCopy(presentation),
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
        preservePresentedResponse: true,
        lockPresentedResponse: true,
          nextEntranceSession: persistEntranceSession,
          guidedAttentionRequest: presentation,
          pendingOfferTarget: guidanceIntent.usesPendingOffer
            ? null
            : previousGuidedAttention.pendingOfferTarget,
        });
    }

    const visualIntent = resolveNexoraVisualGuidanceIntent({ utterance });
    const visualInspectHasView =
      visualIntent.kind === "INSPECT" && previousVisualView.view != null;
    if (
      visualIntent.kind !== "NONE" &&
      (visualIntent.kind === "RESOLVE" ||
        visualIntent.kind === "DISMISS" ||
        visualInspectHasView) &&
      !shouldNexoraGuidedEntranceOwnUtterance(
        input.previousEntranceSession,
        utterance,
        input.executiveSubjects,
      )
    ) {
      const intentResult = resolveNexoraConversationalIntent({ utterance });
      const contextResult = resolveNexoraExecutiveConversationalContext({
        intent: intentResult.intent,
        executiveSubjects: input.executiveSubjects,
        conversationContext: previousContext,
      });
      if (visualIntent.kind === "DISMISS") {
        return finish({
          status: "applied",
          response: composeNexoraVisualAdvisorCopy(
            { status: "NONE", view: null, reason: "" },
            "DISMISS",
          ),
          intentResult,
          contextResult,
          experienceResult: null,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          trustedAdvisorySuccess: true,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
          preservePresentedResponse: true,
          lockPresentedResponse: true,
          nextEntranceSession: persistEntranceSession,
          dismissVisualView: true,
        });
      }
      if (visualIntent.kind === "INSPECT") {
        const inspectKind =
          visualIntent.inspect === "WHY"
            ? "WHY"
            : visualIntent.inspect === "PROVENANCE"
              ? "PROVENANCE"
              : visualIntent.inspect === "CAUSE"
                ? "CAUSE"
                : visualIntent.inspect === "DECISION"
                  ? "DECISION"
                  : visualIntent.inspect === "CHANGE"
                    ? "PRESENT"
                    : "EXPLAIN";
        const inspectResponse =
          visualIntent.inspect === "CHANGE"
            ? "You can ask me to show the same evidence another way when that representation is meaningful."
            : previousVisualView.view
              ? composeNexoraVisualAdvisorCopy(
                  { status: "SUPPORTED", view: previousVisualView.view, reason: "active-view" },
                  inspectKind,
                )
              : "There isn’t a view on the Stage to talk about yet.";
        return finish({
          status: "applied",
          response: inspectResponse,
          intentResult,
          contextResult,
          experienceResult: null,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          trustedAdvisorySuccess: true,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
          preservePresentedResponse: true,
          lockPresentedResponse: true,
          nextEntranceSession: persistEntranceSession,
        });
      }
      const resolution = resolveNexoraVisualView({
        purpose: visualIntent.purpose,
        evidence: input.visualEvidence ?? null,
        subjectId: visualIntent.subjectId,
        requestedMonths: visualIntent.requestedMonths,
        requestedRepresentation: visualIntent.requestedRepresentation,
        comparableIds: visualIntent.comparableIds,
      });
      return finish({
        status: "applied",
        response: composeNexoraVisualAdvisorCopy(
          resolution,
          resolution.status === "SUPPORTED" ? "PRESENT" : "PRESENT",
        ),
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
        preservePresentedResponse: true,
        lockPresentedResponse: true,
        nextEntranceSession: persistEntranceSession,
        visualViewRequest:
          resolution.status === "SUPPORTED" ? resolution.view : previousVisualView.view,
        dismissVisualView: false,
      });
    }

    if (
      shouldNexoraGuidedEntranceOwnUtterance(
        input.previousEntranceSession,
        utterance,
        input.executiveSubjects,
      ) &&
      input.previousEntranceSession
    ) {
      const guidedTurn = resolveNexoraGuidedEntranceTurn({
        utterance,
        session: input.previousEntranceSession,
        runtimeState: input.runtimeState,
        catalog: input.catalog,
      });
      if (guidedTurn.ownsResponse) {
        const intentResult = resolveNexoraConversationalIntent({ utterance });
        const contextResult = resolveNexoraExecutiveConversationalContext({
          intent: intentResult.intent,
          executiveSubjects: input.executiveSubjects,
          conversationContext: previousContext,
        });
        return finish({
          status: "applied",
          response: guidedTurn.response,
          intentResult,
          contextResult,
          experienceResult: null,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: guidedTurn.nextRuntimeState,
          shouldCommitRuntime: guidedTurn.shouldCommitRuntime,
          trustedAdvisorySuccess: true,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
          preservePresentedResponse: true,
          lockPresentedResponse: true,
          nextEntranceSession: guidedTurn.session,
          suggestedActions: guidedTurn.suggestedActions,
          pendingOfferTarget: guidedTurn.pendingOfferTarget,
          clearGuidedAttention: guidedTurn.clearGuidedAttention,
          visualViewRequest: guidedTurn.visualViewRequest,
          dismissVisualView: guidedTurn.dismissVisualView,
        });
      }
    }

    if (
      shouldNexoraEntranceOwnUtterance(
        input.previousEntranceSession,
        utterance,
        input.executiveSubjects,
      ) &&
      input.previousEntranceSession
    ) {
      const entranceTurn = resolveNexoraEntranceTurn({
        utterance,
        session: input.previousEntranceSession,
        runtimeState: input.runtimeState,
        decisionRuntime: boundDecisionRuntime,
        executionRuntime: boundExecutionRuntime,
      });
      if (entranceTurn.ownsResponse) {
        const intentResult = resolveNexoraConversationalIntent({ utterance });
        const contextResult = resolveNexoraExecutiveConversationalContext({
          intent: intentResult.intent,
          executiveSubjects: input.executiveSubjects,
          conversationContext: previousContext,
        });
        return finish({
          status: "applied",
          response: entranceTurn.response,
          intentResult,
          contextResult,
          experienceResult: null,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: entranceTurn.nextRuntimeState,
          shouldCommitRuntime: entranceTurn.shouldCommitRuntime,
          trustedAdvisorySuccess: true,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
          preservePresentedResponse: true,
          lockPresentedResponse: true,
          nextEntranceSession: entranceTurn.session,
        });
      }
    }

    const exiAnswer = answerNexoraExiUtterance(
      input.advisorGrounding?.experienceAnswers,
      utterance,
      input.previousUtterance,
    );
    // Named/current Scenario follow-up stays on CC:9. EXI may present
    // Scenario intelligence later, but must not intercept How-sure / risk
    // while conversational Scenario identity is active.
    if (
      exiAnswer &&
      !hasActiveScenarioAssessment(
        previousExecutiveContext,
        input.scenarioSession ?? null,
      )
    ) {
      const intentResult = resolveNexoraConversationalIntent({ utterance });
      const contextResult = resolveNexoraExecutiveConversationalContext({
        intent: intentResult.intent,
        executiveSubjects: input.executiveSubjects,
        conversationContext: previousContext,
      });
      const response = /[.!?]$/.test(exiAnswer.trim())
        ? exiAnswer.trim()
        : `${exiAnswer.trim()}.`;
      return finish({
        status: "applied",
        response,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
        preservePresentedResponse: true,
      });
    }

    // UX:4-FIX2 — explicit intent first, then a structured pending-turn answer,
    // then a unique registered entity reference. Rendered Nexora copy is never parsed.
    const subjectNameById = Object.freeze(
      Object.fromEntries(
        input.executiveSubjects.map((subject) => [
          subject.subjectId,
          subject.canonicalName,
        ]),
      ),
    );
    const subjectKindById = Object.freeze(
      Object.fromEntries(
        input.executiveSubjects.map((subject) => [
          subject.subjectId,
          subject.subjectKind,
        ]),
      ),
    );
    const actionInvocation = resolveNexoraConversationalActionInvocation({
      utterance,
      primaryAction:
        input.advisorGrounding?.primaryAction ??
        previousExecutiveContext.currentRecommendedAction,
      availableActions:
        input.advisorGrounding?.availableActions ??
        (previousExecutiveContext.currentRecommendedAction
          ? [previousExecutiveContext.currentRecommendedAction]
          : []),
      subjectNameById,
      subjectKindById,
    });
    const explicitUtterance =
      actionInvocation.semanticUtterance ??
      managerOverrideSemanticUtterance(withoutInterruptionSuffix(utterance));
    const initialIntentResult = resolveNexoraConversationalIntent({
      utterance: explicitUtterance,
    });
    const decisionExpectation =
      input.decisionSession?.pendingConfirmation &&
      input.decisionSession.pendingConfirmation.status === "pending"
        ? createNexoraPendingTurnExpectation({
            expectationId:
              input.decisionSession.pendingConfirmation.confirmationId,
            questionKind: "decision-commitment",
            expectedAnswerKind: "decision-option",
            subjectId: previousContext.currentSubjectId ?? null,
            optionIds: [
              input.decisionSession.pendingConfirmation.candidateId,
            ],
            sourceCapability: "CC:10",
            consequential: true,
            confirmationLevel: "consequential",
          })
        : null;
    const incomingStage = projectAuthoritativeStageContext({
      runtimeState: input.runtimeState,
      catalog: input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog(),
      lastAuthorizedPresentation:
        input.previousManagerObjectSession?.ncaConversationState?.lastAuthorizedPresentation ?? null,
      goalLabel: previousExecutiveContext.currentGoal?.canonicalName ?? null,
      presentationOptions:
        resolveExecutiveExperienceContext(input.previousEntranceSession) === "GUIDED_ENTRANCE"
          ? { overviewOccupancy: "current-catalog" }
          : undefined,
    });
    const pendingCriterion =
      input.previousManagerObjectSession?.ncaConversationState?.pendingQuestion?.expectedInformation ===
      "PRIORITY";
    const pendingConsent =
      input.previousManagerObjectSession?.ncaConversationState?.pendingPresentationConsent ?? null;
    const activeExpectation =
      input.pendingTurnExpectation ??
      previousExecutiveContext.pendingTurnExpectation ??
      decisionExpectation;
    const pendingTurnResolution = resolveNexoraPendingTurnAnswer({
      utterance,
      initialIntentKind: initialIntentResult.intent.kind,
      expectation: activeExpectation,
      subjects: input.executiveSubjects,
    });
    const consentReply = pendingConsent ? isPresentationConsentReply(utterance) : null;
    const bareSubject =
      pendingTurnResolution?.semanticUtterance == null &&
      initialIntentResult.intent.kind === "unknown" &&
      !pendingCriterion &&
      consentReply == null &&
      !isCompleteManagerBusinessObservation(utterance) &&
      !isManagerCausalAssertion(utterance)
        ? resolveBareNexoraSubjectReference({
            utterance,
            subjects: input.executiveSubjects,
          })
        : null;
    const bareOnStage = Boolean(
      bareSubject?.subject &&
        incomingStage.visibleMembers.some((member) => member.id === bareSubject.subject?.subjectId),
    );
    const semanticUtterance =
      pendingTurnResolution?.semanticUtterance ??
      (bareSubject?.status === "resolved" && bareSubject.subject && (bareOnStage || incomingStage.presentationType === "OVERVIEW")
        ? `Focus on ${bareSubject.subject.canonicalName}`
        : explicitUtterance);
    // CC:1, then FINAL:6.1 overlay, then FINAL:6.2 contextual overlay.
    let intentResult = overlayCollectionOrDeicticIntent(
      resolveIntentForTurn(utterance, semanticUtterance),
      utterance,
      input.previousManagerObjectSession?.ncaConversationState?.lastCollection?.kind ??
        input.runtimeState.collectionContext?.category ??
        null,
    );
    if (pendingCriterion && isExecutiveComparisonCriterionAnswer(utterance)) {
      intentResult = resolveIntentForTurn(utterance, utterance);
    }
    const naturalLanguageUnderstanding = interpretManagerTurnMeaning({
      utterance: managerOverrideSemanticUtterance(utterance),
      subjects: input.executiveSubjects,
    });
    if (
      !pendingCriterion &&
      intentResult.intent.kind === "unknown" &&
      naturalLanguageUnderstanding.requestedOperation === "FOCUS" &&
      naturalLanguageUnderstanding.objectReference?.canonicalName &&
      !/\b(?:problems|risks|opportunities|scenarios|decisions|executions|goals)\b/i.test(
        utterance,
      ) &&
      isExplicitPresentationRequest(utterance, "focus")
    ) {
      intentResult = resolveIntentForTurn(
        utterance,
        `Focus on ${naturalLanguageUnderstanding.objectReference.canonicalName}`,
      );
    }
    const contextualManagerMeaning = interpretContextualManagerTurn({
      turnMeaning: naturalLanguageUnderstanding,
      subjects: input.executiveSubjects,
      previousContinuity:
        input.previousManagerObjectSession?.conversationContinuity ?? null,
      executiveContext: previousExecutiveContext,
      managerSession: input.previousManagerObjectSession ?? null,
      stageFocusedId: input.runtimeState.focusedSubject?.id ?? null,
    });
    const clarificationRaw = interpretClarificationTurn({
      turnMeaning: naturalLanguageUnderstanding,
      contextual: contextualManagerMeaning,
      pending: input.previousManagerObjectSession?.pendingClarification ?? null,
      continuity:
        input.previousManagerObjectSession?.conversationContinuity ?? null,
      subjects: input.executiveSubjects,
      intentKind: intentResult.intent.kind,
    });
    const situationResolvesClarification =
      clarificationRaw.action === "clarify" &&
      /^(?:what should i check|what should i investigate|where should i look)(?: first)?[?.!]*$/i.test(utterance.trim()) &&
      Boolean(
        input.previousManagerObjectSession?.investigationSubjectId ??
        input.previousManagerObjectSession?.ncaConversationState?.activeSubject?.id ??
        input.previousManagerObjectSession?.activeObjectId,
      );
    const clarificationOwnedByCanonicalIntent = new Set([
      "prepare-context", "switch-workspace",
      "explore-scenario", "define-scenario", "compare-scenarios", "explain-scenario", "modify-scenario", "select-scenario-reference",
      "commit-decision", "prefer-option", "reject-decision", "defer-decision", "reconsider-decision", "confirm-decision-commitment", "cancel-decision-commitment",
      "show-problems", "show-goals", "show-scenarios", "show-decisions", "show-execution", "show-related",
    ]).has(intentResult.intent.kind);
    const clarificationOwnedByMultiEntitySemantics =
      clarificationRaw.action === "clarify" &&
      naturalLanguageUnderstanding.ambiguity.reason === "multiple-objects" &&
      /\b(?:relationship|related|connected|between|affect|depends?|constrains?|and|both)\b/i.test(utterance);
    const clarificationOwnedByResolvedAction = actionInvocation.status === "resolved";
    const clarificationOwnedByAdvisoryDialogue =
      clarificationRaw.action === "clarify" &&
      classifyAdvisoryDialogueMove(utterance) === "CHALLENGE" &&
      Boolean(input.previousManagerObjectSession?.ncaConversationState?.lastAdvisoryPosition);
    const clarificationOwnedByStageMeta =
      classifyNexoraSemanticScope(utterance) === "CURRENT_WORKSPACE";
    const clarificationOwnedByCurrentSubject =
      !pendingCriterion &&
      Boolean(
        input.previousManagerObjectSession?.conversationContinuity
          ?.activeSubjectId ?? previousContext.currentSubjectId,
      ) &&
      isSubjectPreservingAnalyticalFollowUpOperation(
        intentResult.intent.kind,
        normalizeNexoraConversationalUtterance(utterance),
      ) &&
      !isDeicticSubjectFollowUpUtterance(
        normalizeNexoraConversationalUtterance(utterance),
      );
    const clarification: ClarificationTurnResult = situationResolvesClarification ||
      (clarificationRaw.action === "clarify" && clarificationOwnedByCanonicalIntent) ||
      clarificationOwnedByResolvedAction ||
      clarificationOwnedByMultiEntitySemantics ||
      clarificationOwnedByAdvisoryDialogue ||
      clarificationOwnedByStageMeta ||
      clarificationOwnedByCurrentSubject ||
      Boolean(dataLibraryAnswer)
      ? Object.freeze({
          ...clarificationRaw,
          action: "proceed" as const,
          question: null,
          pending: null,
        })
      : clarificationRaw;
    if (
      clarification.action === "clarify" ||
      clarification.action === "fail" ||
      clarification.action === "unpark"
    ) {
      return finish({
        status: "clarification-required",
        response: clarification.question ?? "Which one do you mean?",
        intentResult,
        contextResult: resolveNexoraExecutiveConversationalContext({
          intent: intentResult.intent,
          targetHints: intentResult.intent.targetHints,
          conversationContext: previousContext,
          executiveSubjects: input.executiveSubjects,
        }),
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        preservePresentedResponse: true,
        lockPresentedResponse: true,
        preserveConversationContinuity: true,
        pendingClarification: clarification.pending,
        clarificationTurn: clarification,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }
    if (clarification.action === "cancel") {
      return finish({
        status: "applied",
        response: "Okay.",
        intentResult,
        contextResult: resolveNexoraExecutiveConversationalContext({
          intent: intentResult.intent,
          conversationContext: previousContext,
          executiveSubjects: input.executiveSubjects,
        }),
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        preservePresentedResponse: true,
        preserveConversationContinuity: true,
        pendingClarification: null,
        clarificationTurn: clarification,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }
    if (
      clarification.action === "resume" &&
      managerOverrideSemanticUtterance(utterance) === utterance &&
      !/^show-/.test(intentResult.intent.kind)
    ) {
      intentResult = applyResumedMeaningToIntent(
        intentResult,
        contextualManagerMeaning,
        clarification,
      );
    } else if (
      clarification.action !== "park" &&
      !/^show-/.test(intentResult.intent.kind)
    ) {
      intentResult = applyContextualMeaningToIntent(
        intentResult,
        contextualManagerMeaning,
      );
    }
    if (
      isSocialAckUtterance(utterance) &&
      !isContextualShortAnswer(
        utterance,
        input.previousManagerObjectSession?.ncaConversationState?.pendingQuestion ??
          null,
        input.previousManagerObjectSession?.ncaConversationState
          ?.lastOfferedOptions ?? [],
      )
    ) {
      return finish({
        status: "applied",
        response: /thanks|thank you/i.test(utterance)
          ? "You're welcome."
          : "Understood.",
        intentResult,
        contextResult: resolveNexoraExecutiveConversationalContext({
          intent: intentResult.intent,
          conversationContext: previousContext,
          executiveSubjects: input.executiveSubjects,
        }),
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        preservePresentedResponse: true,
        preserveConversationContinuity: true,
        clarificationTurn: clarification,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }
    let intent = intentResult.intent;
    if (
      isExecutiveAttentionUtterance(utterance) &&
      (intent.kind === "explain-scenario" || intent.kind === "explore-scenario")
    ) {
      intent = Object.freeze({
        ...intent,
        kind: "prioritize" as const,
        executionClass: EXECUTION_CLASS_BY_INTENT_KIND.prioritize,
        scenarioPayload: null,
      });
      intentResult = Object.freeze({
        ...intentResult,
        intent,
      });
    }
    const normalizedManagerUtterance =
      normalizeNexoraConversationalUtterance(utterance);
    const hasEstablishedConversationSubject = Boolean(
      input.previousManagerObjectSession?.conversationContinuity
        ?.activeSubjectId,
    );
    const activeScenarioOwnsFollowUp =
      !hasEstablishedConversationSubject &&
      hasActiveScenarioAssessment(
        previousExecutiveContext,
        input.scenarioSession ?? null,
      ) &&
      isScenarioAssessmentFollowUpOperation(
        intent.kind,
        normalizedManagerUtterance,
      );
    const resolvedCompositionSubject = resolveConversationalCompositionSubject({
      continuityId:
        input.previousManagerObjectSession?.conversationContinuity
          ?.activeSubjectId ?? null,
      continuityKind:
        input.previousManagerObjectSession?.conversationContinuity
          ?.activeSubjectKind ?? null,
      currentSubjectId: activeScenarioOwnsFollowUp
        ? previousExecutiveContext.currentScenario?.subjectId ?? null
        : previousExecutiveContext.currentSubject?.subjectId ?? null,
      currentSubjectKind: activeScenarioOwnsFollowUp
        ? previousExecutiveContext.currentScenario?.subjectKind ?? "scenario"
        : previousExecutiveContext.currentSubject?.subjectKind ?? null,
    });
    const hasPrimaryTargetHint = intent.targetHints.some(
      (hint) => hint.role === "primary",
    );
    const blockStaleScenarioAssessment =
      staleScenarioAssessmentWouldCaptureComposition({
        hasActiveScenarioAssessment: hasActiveScenarioAssessment(
          previousExecutiveContext,
          input.scenarioSession ?? null,
        ),
        hasEstablishedConversationSubject,
        hasPrimaryTargetHint,
        resolvedSubjectKind: resolvedCompositionSubject.kind,
        intentKind: intent.kind,
        normalizedUtterance: normalizedManagerUtterance,
      });
    if (
      hasActiveScenarioAssessment(
        previousExecutiveContext,
        input.scenarioSession ?? null,
      ) &&
      intent.kind === "explain" &&
      !hasPrimaryTargetHint &&
      input.previousManagerObjectSession?.attentionPrompted !== true &&
      !isExecutiveAttentionUtterance(utterance) &&
      !blockStaleScenarioAssessment
    ) {
      const describeResolvedScenario =
        resolvedCompositionSubject.kind === "scenario" &&
        (isDeicticSubjectExplain(intent.kind, intent.normalizedUtterance) ||
          isDeicticSubjectFollowUpUtterance(intent.normalizedUtterance));
      intent = Object.freeze({
        ...intent,
        kind: "explain-scenario" as const,
        requiresTarget: false,
        requiresContext: true,
        scenarioPayload: Object.freeze({
          operation: describeResolvedScenario
            ? ("describe" as const)
            : ("impact-why" as const),
        }),
      });
      intentResult = Object.freeze({
        ...intentResult,
        intent,
      });
    }

    // CC:2 — subject context from CC:7 projection
    const contextResult = resolveNexoraExecutiveConversationalContext({
      intent,
      targetHints: intent.targetHints,
      conversationContext: previousContext,
      activeStageContext: input.activeStageContext ?? null,
      allowActiveStageContext: input.allowActiveStageContext === true,
      executiveSubjects: input.executiveSubjects,
    });
    const context = contextResult.context;
    const fidelityIntent = applyScenarioExplanationFidelity({
      intent,
      primarySubjectKind: context.primarySubject?.subjectKind,
    });
    if (fidelityIntent !== intent) {
      intent = fidelityIntent;
      intentResult = Object.freeze({
        ...intentResult,
        intent,
        trace: Object.freeze({
          ...intentResult.trace,
          finalKind: intent.kind,
          candidateKinds: Object.freeze([
            ...intentResult.trace.candidateKinds,
            "explain-scenario" as const,
          ]),
          reasons: intent.reasons,
        }),
      });
    }

    if (
      actionInvocation.matchedUtterance &&
      actionInvocation.status !== "resolved" &&
      !isDeicticSubjectFollowUpUtterance(intent.normalizedUtterance) &&
      !contextualManagerMeaning.objectReference?.subjectId &&
      !input.previousManagerObjectSession?.ncaConversationState?.activeSubject?.id &&
      !input.previousManagerObjectSession?.conversationContinuity?.activeSubjectId
    ) {
      const status = "clarification-required" as const;
      return finish({
        status,
        response:
          actionInvocation.status === "ambiguous"
            ? "Which recommended action do you want to review?"
            : "Which item do you mean?",
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (
      pendingTurnResolution?.status === "declined" &&
      pendingTurnResolution.expectation.questionKind !== "decision-commitment"
    ) {
      const status = "applied" as const;
      return finish({
        status,
        response: declinedPendingResponse(pendingTurnResolution.expectation),
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        nextDecisionSession: input.decisionSession?.pendingConfirmation
          ? setPendingDecisionConfirmation(input.decisionSession, null)
          : null,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (pendingTurnResolution?.status === "clarification-required") {
      const status = "clarification-required" as const;
      return finish({
        status,
        response: pendingClarification(pendingTurnResolution.expectation),
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        nextPendingTurnExpectation: pendingTurnResolution.expectation,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (
      pendingTurnResolution?.status === "answered" &&
      pendingTurnResolution.expectation.questionKind === "review-subject" &&
      pendingTurnResolution.subjectId != null &&
      !isTargetedDeicticInvestigationUtterance(intent.normalizedUtterance) &&
      input.runtimeState.focusedSubject?.id === pendingTurnResolution.subjectId
    ) {
      const recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind: "explain",
        primarySubjectId: pendingTurnResolution.subjectId,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
      const status = "applied" as const;
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: null,
        runtime: null,
        utterance,
        experienceResolution: null,
        recommendationResult,
        advisorGrounding: input.advisorGrounding ?? null,
        pendingTurnResolution,
      });
      return finish({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        recommendationResult,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    if (
      bareSubject?.status === "resolved" &&
      bareSubject.subject &&
      input.runtimeState.focusedSubject?.id === bareSubject.subject.subjectId
    ) {
      const status = "no-op" as const;
      return finish({
        status,
        response: `${bareSubject.subject.canonicalName} is already the current subject. You can ask me to explain the situation, show the evidence, or review the recommendation.`,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        trustedAdvisorySuccess: true,
        pendingTurnResolution,
        nextPendingTurnExpectation: null,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    // Early exit when subject context blocks (including compound prepare+focus)
    if (
      context.resolutionStatus === "missing-context" ||
      context.resolutionStatus === "ambiguous" ||
      context.resolutionStatus === "not-found"
    ) {
      const status = mapExperienceStatus({
        contextStatus: context.resolutionStatus,
        commandStatus: null,
        runtimeStatus: null,
        intentKind: intent.kind,
      });
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: null,
        runtime: null,
        utterance,
        experienceResolution: null,
      });
      return finish({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult: null,
        commandResult: null,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        ...(pendingTurnResolution?.status === "interrupted" &&
        input.decisionSession?.pendingConfirmation
          ? {
              nextDecisionSession: setPendingDecisionConfirmation(
                input.decisionSession,
                null,
              ),
            }
          : {}),
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    // CC:6 — executive experience / workspace resolution (read-only)
    const currentWorkspaceId =
      asWorkspaceKind(input.runtimeState.workspace) ??
      asWorkspaceKind(previousContext.currentWorkspaceId);

    const experienceResult = resolveNexoraConversationalExperienceContext({
      intent,
      currentWorkspaceId,
      currentPresentationState: input.runtimeState.presentationState ?? null,
      currentModelId: previousContext.currentModelId ?? null,
      entrySubjectId: context.primarySubject?.subjectId ?? null,
      availableExperiences: input.availableExperiences,
    });

    // UX:4 — ordinary conversational entry stays inside CC:1/CC:5.
    // It reads CC:8 assessment truth but never maps to or mutates Runtime.
    if (intent.kind === "greet" || intent.kind === "help") {
      const recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind: "prioritize",
        primarySubjectId: null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
      const status = "applied" as const;
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: null,
        runtime: null,
        utterance,
        experienceResolution: experienceResult,
        recommendationResult,
      });
      return finish({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult,
        commandResult: null,
        runtimeResult: null,
        recommendationResult,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        pendingTurnResolution,
        ...(pendingTurnResolution?.status === "interrupted" &&
        input.decisionSession?.pendingConfirmation
          ? {
              nextDecisionSession: setPendingDecisionConfirmation(
                input.decisionSession,
                null,
              ),
            }
          : {}),
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    const experienceIntent =
      intent.kind === "prepare-context" || intent.kind === "switch-workspace";

    if (experienceIntent) {
      if (
        experienceResult.decision === "clarification-required" ||
        experienceResult.decision === "unsupported"
      ) {
        const status = mapExperienceStatus({
          contextStatus: context.resolutionStatus,
          experienceDecision: experienceResult.decision,
          experienceStatus: experienceResult.resolutionStatus,
          commandStatus: null,
          runtimeStatus: null,
          intentKind: intent.kind,
        });
        const response = buildNexoraConversationalExperienceResponse({
          status,
          intent,
          context,
          command: null,
          runtime: null,
          utterance,
          experienceResolution: experienceResult,
        });
        return finish({
          status,
          response,
          intentResult,
          contextResult,
          experienceResult,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
        });
      }

      // Already in target experience — focus subject if requested, else no-op.
      if (experienceResult.decision === "keep-current") {
        if (
          context.primarySubject?.subjectId &&
          !(pendingCriterion && isExecutiveComparisonCriterionAnswer(utterance)) &&
          !isCompleteManagerBusinessObservation(utterance) &&
          !isManagerCausalAssertion(utterance)
        ) {
          const focusIntent = Object.freeze({
            ...intent,
            kind: "focus" as const,
            requiresTarget: true,
            requiresContext: false,
            executionClass: "navigation" as const,
          });
          const commandResult = mapNexoraConversationalCommand({
            intent: focusIntent,
            context,
          });
          if (commandResult.status !== "mapped" || commandResult.command == null) {
            const status = mapExperienceStatus({
              contextStatus: context.resolutionStatus,
              experienceDecision: experienceResult.decision,
              commandStatus: commandResult.status,
              runtimeStatus: null,
              intentKind: intent.kind,
            });
            const response = buildNexoraConversationalExperienceResponse({
              status,
              intent,
              context,
              command: commandResult.command,
              runtime: null,
              utterance,
              experienceResolution: experienceResult,
            });
            return finish({
              status,
              response,
              intentResult,
              contextResult,
              experienceResult,
              commandResult,
              runtimeResult: null,
              previousExecutiveContext,
              nextRuntimeState: input.runtimeState,
              shouldCommitRuntime: false,
              ids,
              utterance,
              catalog: input.catalog,
              previousManagerObjectSession: input.previousManagerObjectSession ?? null,
              executiveSubjects: input.executiveSubjects,
            });
          }

          const applied = applyNexoraMVPConversationalCommand({
            command: commandResult.command,
            state: input.runtimeState,
            catalog: input.catalog,
            lastAppliedCommandId: input.lastAppliedCommandId,
          });
          const status = mapExperienceStatus({
            contextStatus: context.resolutionStatus,
            experienceDecision: experienceResult.decision,
            commandStatus: commandResult.status,
            runtimeStatus: applied.result.status,
            intentKind: intent.kind,
          });
          const response = buildNexoraConversationalExperienceResponse({
            status,
            intent,
            context,
            command: commandResult.command,
            runtime: applied.result,
            utterance,
            experienceResolution: experienceResult,
          });
          const shouldCommitRuntime = applied.result.status === "applied";
          return finish({
            status,
            response,
            intentResult,
            contextResult,
            experienceResult,
            commandResult,
            runtimeResult: applied.result,
            previousExecutiveContext,
            nextRuntimeState: shouldCommitRuntime
              ? applied.nextState
              : input.runtimeState,
            shouldCommitRuntime,
            ids,
            utterance,
            catalog: input.catalog,
            executiveSubjects: input.executiveSubjects,
          });
        }

        const status = "no-op" as const;
        const response = buildNexoraConversationalExperienceResponse({
          status,
          intent,
          context,
          command: null,
          runtime: null,
          utterance,
          experienceResolution: experienceResult,
        });
        return finish({
          status,
          response,
          intentResult,
          contextResult,
          experienceResult,
          commandResult: null,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
        });
      }

      // transition
      const commandResult = mapNexoraConversationalCommand({
        intent,
        context,
        experienceResolution: {
          decision: experienceResult.decision,
          workspaceId: experienceResult.targetExperienceContext.workspaceId,
          experienceId: experienceResult.targetExperienceContext.experienceId,
          entrySubjectId:
            experienceResult.targetExperienceContext.entrySubjectId,
        },
      });

      if (commandResult.status !== "mapped" || commandResult.command == null) {
        const status = mapExperienceStatus({
          contextStatus: context.resolutionStatus,
          experienceDecision: experienceResult.decision,
          commandStatus: commandResult.status,
          runtimeStatus: null,
          intentKind: intent.kind,
        });
        const response = buildNexoraConversationalExperienceResponse({
          status,
          intent,
          context,
          command: commandResult.command,
          runtime: null,
          utterance,
          experienceResolution: experienceResult,
        });
        return finish({
          status,
          response,
          intentResult,
          contextResult,
          experienceResult,
          commandResult,
          runtimeResult: null,
          previousExecutiveContext,
          nextRuntimeState: input.runtimeState,
          shouldCommitRuntime: false,
          ids,
          utterance,
          catalog: input.catalog,
          previousManagerObjectSession: input.previousManagerObjectSession ?? null,
          executiveSubjects: input.executiveSubjects,
        });
      }

      const applied = applyNexoraMVPConversationalCommand({
        command: commandResult.command,
        state: input.runtimeState,
        catalog: input.catalog,
        lastAppliedCommandId: input.lastAppliedCommandId,
      });

      const status = mapExperienceStatus({
        contextStatus: context.resolutionStatus,
        experienceDecision: experienceResult.decision,
        commandStatus: commandResult.status,
        runtimeStatus: applied.result.status,
        intentKind: intent.kind,
      });

      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: commandResult.command,
        runtime: applied.result,
        utterance,
        experienceResolution: experienceResult,
      });

      const shouldCommitRuntime = applied.result.status === "applied";
      return finish({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult,
        commandResult,
        runtimeResult: applied.result,
        previousExecutiveContext,
        nextRuntimeState: shouldCommitRuntime
          ? applied.nextState
          : input.runtimeState,
      shouldCommitRuntime,
      ids,
      utterance,
      catalog: input.catalog,
      previousManagerObjectSession: input.previousManagerObjectSession ?? null,
      decisionRuntime: boundDecisionRuntime,
      executiveSubjects: input.executiveSubjects,
      });
    }

    // Ordinary intents — CC:6 not-required; existing CC:3 → CC:4 path
    const commandResult = mapNexoraConversationalCommand({
      intent,
      context,
    });

    if (commandResult.status !== "mapped" || commandResult.command == null) {
      const status = mapExperienceStatus({
        contextStatus: context.resolutionStatus,
        experienceDecision: experienceResult.decision,
        commandStatus: commandResult.status,
        runtimeStatus: null,
        intentKind: intent.kind,
      });
      const response = buildNexoraConversationalExperienceResponse({
        status,
        intent,
        context,
        command: commandResult.command,
        runtime: null,
        utterance,
        experienceResolution: experienceResult,
      });
      return finish({
        status,
        response,
        intentResult,
        contextResult,
        experienceResult,
        commandResult,
        runtimeResult: null,
        previousExecutiveContext,
        nextRuntimeState: input.runtimeState,
        shouldCommitRuntime: false,
        ids,
        utterance,
        catalog: input.catalog,
        previousManagerObjectSession: input.previousManagerObjectSession ?? null,
        executiveSubjects: input.executiveSubjects,
      });
    }

    const applied = applyNexoraMVPConversationalCommand({
      command: commandResult.command,
      state: input.runtimeState,
      catalog: input.catalog,
      lastAppliedCommandId: input.lastAppliedCommandId,
    });
    const informationalCollectionReveal =
      /^(?:what|which)\b/i.test(utterance.trim()) &&
      commandResult.command.kind.startsWith("reveal-");
    const runtimeApplied = informationalCollectionReveal
      ? Object.freeze({
          ...applied,
          nextState: input.runtimeState,
        })
      : applied;

    const isRecommendation =
      isRecommendationCommandKind(commandResult.command.kind) ||
      applied.result.runtimeActionKind === "resolve-executive-recommendation";
    const presentedCollectionKind =
      input.runtimeState.collectionContext?.category?.toLowerCase() ??
      input.previousManagerObjectSession?.ncaConversationState?.lastCollection?.kind?.toLowerCase() ??
      null;
    const activeNonScenarioCollectionOwnsFollowUp = Boolean(
      presentedCollectionKind &&
      presentedCollectionKind !== "scenario" &&
      !hasActiveScenarioAssessment(previousExecutiveContext, input.scenarioSession ?? null) &&
      !/\bscenarios?\b/i.test(utterance) &&
      /\b(?:which|compare|rank|important|matters?|urgent|riskier|safer|investigat\w*|attention|bigger)\b/i.test(utterance),
    );
    const isScenario =
      !activeNonScenarioCollectionOwnsFollowUp &&
      !shouldSkipScenarioForManagerObservation(utterance) &&
      !shouldSkipScenarioEngineForStageGroundedComparison({
        relationship: incomingStage.collection ? "STAGE_GROUNDED" : "STAGE_INDEPENDENT",
        stage: incomingStage,
        utterance,
      }) && (
        isScenarioCommandKind(commandResult.command.kind) ||
        applied.result.runtimeActionKind === "resolve-executive-scenario" ||
        intent.kind === "explore-scenario" ||
        intent.kind === "compare-scenarios" ||
        intent.kind === "explain-scenario" ||
        intent.kind === "define-scenario"
      );
    const isDecisionCommitment =
      isDecisionCommitmentCommandKind(commandResult.command.kind) ||
      applied.result.runtimeActionKind ===
        "resolve-executive-decision-commitment";
    const isReviewConfirmation =
      pendingTurnResolution?.status === "answered" &&
      pendingTurnResolution.expectation.questionKind === "review-subject";
    const targetedDeicticInvestigation =
      isTargetedDeicticInvestigationUtterance(intent.normalizedUtterance);
    const isSafeActionNavigation =
      intent.kind === "focus" &&
      !targetedDeicticInvestigation &&
      (actionInvocation.status === "resolved" ||
        /^(?:review|investigate)\b/i.test(utterance.trim()));

    let recommendationResult: NexoraExecutiveRecommendationResult | null = null;
    let scenarioResult: NexoraExecutiveScenarioConversationResult | null = null;
    let decisionCommitmentResult: NexoraDecisionCommitmentResult | null = null;

    if (
      !targetedDeicticInvestigation &&
      (isRecommendation || isReviewConfirmation || isSafeActionNavigation) &&
      (applied.result.status === "applied" ||
        applied.result.status === "no-op")
    ) {
      recommendationResult = resolveRecommendationForTurn({
        utterance,
        intentKind:
          isReviewConfirmation || isSafeActionNavigation
            ? "explain"
            : intent.kind,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
      });
    }

    if (isScenario && applied.result.status === "applied") {
      scenarioResult = resolveScenarioForTurn({
        intent,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
        scenarioSession: input.scenarioSession ?? null,
        utterance,
        presentedScenarioIds:
          input.runtimeState.collectionContext?.category === "scenario"
            ? input.runtimeState.collectionContext.objectIds
            : undefined,
      });
    } else if (
      applied.result.status === "applied" &&
      hasActiveScenarioAssessment(
        previousExecutiveContext,
        input.scenarioSession ?? null,
      ) &&
      (intent.kind === "evidence" ||
        intent.kind === "risk" ||
        (intent.kind === "explain" &&
          !hasPrimaryTargetHint &&
          !blockStaleScenarioAssessment &&
          !isDeicticSubjectExplain(
            intent.kind,
            intent.normalizedUtterance,
          ) &&
          !isDeicticSubjectFollowUpUtterance(intent.normalizedUtterance)))
    ) {
      scenarioResult = resolveScenarioForTurn({
        intent: Object.freeze({
          ...intent,
          scenarioPayload: Object.freeze({
            operation:
              intent.kind === "risk"
                ? ("downside" as const)
                : intent.kind === "explain"
                  ? ("impact-why" as const)
                  : ("confidence" as const),
          }),
        }),
        primarySubjectId:
          previousExecutiveContext.currentScenario?.subjectId ??
          context.primarySubject?.subjectId ??
          null,
        executiveContext: previousExecutiveContext,
        catalog: input.catalog,
        scenarioSession: input.scenarioSession ?? null,
        utterance,
      });
    }
    const scenarioCandidateSubject = Object.freeze({
      id: scenarioResult?.scenario?.scenarioId ??
        previousExecutiveContext.currentScenario?.subjectId ??
        null,
      kind: scenarioResult || previousExecutiveContext.currentScenario
        ? ("scenario" as const)
        : null,
    });
    const subjectCompositionFidelity = decideSubjectCompositionFidelity({
      resolvedSubject: resolvedCompositionSubject,
      candidateSubject: scenarioCandidateSubject,
      candidateSource: scenarioResult
        ? (intent.kind === "explain-scenario" || isScenario
            ? "scenario-assessment"
            : "scenario-follow-up")
        : null,
      intentKind: intent.kind,
      normalizedUtterance: normalizedManagerUtterance,
      blockedStaleScenarioAssessment: blockStaleScenarioAssessment,
    });
    if (blockStaleScenarioAssessment || !subjectCompositionFidelity.compatible) {
      scenarioResult = null;
    }

    if (isDecisionCommitment && applied.result.status === "applied") {
      decisionCommitmentResult = resolveDecisionCommitmentForTurn({
        intent,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        scenarioSession: input.scenarioSession ?? null,
        decisionSession: input.decisionSession ?? null,
        decisionRuntime: boundDecisionRuntime,
        commandId: commandResult.command.commandId,
        utterance,
        committedAt: input.decisionCommittedAt,
        catalogScenarioSubjects: (input.catalog?.contextSubjects ?? []).map((subject) =>
          Object.freeze({
            id: subject.id,
            label: subject.label,
            kind: subject.kind,
          }),
        ),
      });
    }

    const status =
      decisionCommitmentResult?.status === "clarification-required"
        ? ("clarification-required" as const)
        : decisionCommitmentResult?.status === "confirmation-required"
          ? ("confirmation-required" as const)
          : decisionCommitmentResult?.status === "unsupported" ||
              decisionCommitmentResult?.status === "invalid-candidate" ||
              decisionCommitmentResult?.status === "transition-not-allowed"
            ? ("unsupported" as const)
            : decisionCommitmentResult?.status === "failed"
              ? ("failed" as const)
              : scenarioResult?.status === "clarification-required"
                ? ("clarification-required" as const)
                : mapExperienceStatus({
                    contextStatus: context.resolutionStatus,
                    experienceDecision: experienceResult.decision,
                    commandStatus: commandResult.status,
                    runtimeStatus: applied.result.status,
                    intentKind: intent.kind,
                  });

    const response = buildNexoraConversationalExperienceResponse({
      status,
      intent,
      context,
      command: commandResult.command,
      runtime: applied.result,
      utterance,
      experienceResolution: experienceResult,
      recommendationResult,
      scenarioResult,
      decisionCommitmentResult,
      advisorGrounding: input.advisorGrounding ?? null,
      pendingTurnResolution,
      bareSubjectReference:
        bareSubject?.status === "resolved" && bareSubject.subject != null,
      safeActionNavigation: isSafeActionNavigation,
    });

    const focusMutationMatchesManagerNeed =
      commandResult.command.kind !== "focus-subject" ||
      (naturalLanguageUnderstanding.requestedOperation === "FOCUS" &&
        !(pendingCriterion &&
          isExecutiveComparisonCriterionAnswer(utterance)));
    const shouldCommitRuntime =
      applied.result.status === "applied" &&
      !isRecommendation &&
      !isScenario &&
      !isDecisionCommitment &&
      focusMutationMatchesManagerNeed;
    const trustedDecisionSuccess =
      isDecisionCommitment &&
      applied.result.status === "applied" &&
      (decisionCommitmentResult?.status === "applied" ||
        decisionCommitmentResult?.status === "already-committed" ||
        decisionCommitmentResult?.status === "confirmation-required" ||
        decisionCommitmentResult?.status === "preference-only");

    return finish({
      status,
      response,
      intentResult,
      contextResult,
      experienceResult,
      commandResult,
      runtimeResult: applied.result,
      recommendationResult,
      scenarioResult,
      decisionCommitmentResult,
      previousExecutiveContext,
      nextRuntimeState: shouldCommitRuntime
        ? runtimeApplied.nextState
        : input.runtimeState,
      shouldCommitRuntime,
      trustedAdvisorySuccess:
        ((isRecommendation ||
          isScenario ||
          isReviewConfirmation ||
          isSafeActionNavigation) &&
          applied.result.status === "applied" &&
          status !== "clarification-required") ||
        trustedDecisionSuccess,
      pendingTurnResolution,
      preservePresentedResponse: Boolean(scenarioResult) || Boolean(dataLibraryAnswer),
      subjectCompositionFidelity,
      // The resolved conversational subject owns a targeted deictic
      // investigation through final presentation; advisory layers may add
      // context on selection turns but must not replace this answer's subject.
      lockPresentedResponse:
        Boolean(dataLibraryAnswer) || targetedDeicticInvestigation,
      dataLibraryResponse: dataLibraryAnswer?.text ?? null,
      dataLibraryDialogue: dataLibraryAnswer?.dialogue ?? null,
      clarificationTurn: clarification,
      ...(pendingTurnResolution?.status === "interrupted" &&
      input.decisionSession?.pendingConfirmation
        ? {
            nextDecisionSession: setPendingDecisionConfirmation(
              input.decisionSession,
              null,
            ),
          }
        : {}),
      ids,
      utterance,
      catalog: input.catalog,
      previousManagerObjectSession: input.previousManagerObjectSession ?? null,
      decisionRuntime: boundDecisionRuntime,
      executiveSubjects: input.executiveSubjects,
    });
  } catch {
    const intentResult = resolveNexoraConversationalIntent({ utterance });
    const emptyContext = resolveNexoraExecutiveConversationalContext({
      intent: intentResult.intent,
      executiveSubjects: input.executiveSubjects,
      conversationContext: previousContext,
    });
    const response = "Nexora couldn't complete that command.";
    return finish({
      status: "failed",
      response,
      intentResult,
      contextResult: emptyContext,
      experienceResult: null,
      commandResult: null,
      runtimeResult: null,
      previousExecutiveContext,
      nextRuntimeState: input.runtimeState,
      shouldCommitRuntime: false,
      ids,
      utterance,
      catalog: input.catalog,
      previousManagerObjectSession: input.previousManagerObjectSession ?? null,
      decisionRuntime: boundDecisionRuntime,
      executiveSubjects: input.executiveSubjects,
    });
  }
}

function finalize(args: {
  readonly status: NexoraConversationalExperienceStatus;
  readonly response: string;
  readonly intentResult: NexoraConversationalExperienceResult["intentResult"];
  readonly contextResult: NexoraConversationalExperienceResult["contextResult"];
  readonly experienceResult: NexoraConversationalExperienceContextResolution | null;
  readonly commandResult: NexoraConversationalExperienceResult["commandResult"];
  readonly runtimeResult: NexoraConversationalExperienceResult["runtimeResult"];
  readonly recommendationResult?: NexoraExecutiveRecommendationResult | null;
  readonly scenarioResult?: NexoraExecutiveScenarioConversationResult | null;
  readonly decisionCommitmentResult?: NexoraDecisionCommitmentResult | null;
  readonly pendingTurnResolution?: NexoraPendingTurnResolution | null;
  readonly nextPendingTurnExpectation?: NexoraPendingTurnExpectation | null;
  readonly nextDecisionSession?: NexoraExecutiveDecisionSession | null;
  readonly previousExecutiveContext: NexoraExecutiveContextSnapshot;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly runtimeStateBeforeTurn?: NexoraMVPObjectInteractionState;
  readonly shouldCommitRuntime: boolean;
  /** Advisory CC:8/CC:9/CC:10 success without Stage Runtime mutation. */
  readonly trustedAdvisorySuccess?: boolean;
  readonly ids: { readonly managerId: string; readonly nexoraId: string };
  readonly utterance: string;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
  readonly previousManagerObjectSession?: import("@/app/lib/manager-object/managerObjectActive.ts").ManagerObjectSession | null;
  readonly previousUtterance?: string | null;
  readonly decisionRuntime?: import("./executiveDecisionRuntimeAdapter.ts").NexoraDecisionRuntimeAdapter | null;
  readonly executionRuntime?: NexoraExecutionRuntimeAdapter | null;
  /** True only when the host supplied the canonical CC:11 Runtime. */
  readonly canonicalExecutionRuntimeProvided?: boolean;
  readonly preservePresentedResponse?: boolean;
  readonly lockPresentedResponse?: boolean;
  readonly dataLibraryResponse?: string | null;
  readonly dataLibraryDialogue?: import("@/app/lib/manager-object/nexoraAdvisorDataInquiry.ts").AdvisorDataDialogue | null;
  readonly preserveConversationContinuity?: boolean;
  readonly pendingClarification?: PendingClarification | null;
  readonly clarificationTurn?: ClarificationTurnResult | null;
  readonly nextEntranceSession?: NexoraEntranceSession | null;
  readonly initiativeSignals?: readonly ProactiveExecutiveSignal[];
  readonly conversationImportance?: import("@/app/lib/manager-object/nexoraNca5InitiativeIntelligenceTypes.ts").ConversationImportance;
  readonly managerCommunicationContext?: import("@/app/lib/manager-object/nexoraNca6CommunicationIntelligenceTypes.ts").Nca6ManagerContextInput | null;
  readonly theatreDecisionReviewOpen?: boolean | null;
  readonly theatreProposedCandidateId?: string | null;
  readonly vaiAdvisorBundle?: import("@/app/lib/vai/vaiAdvisorContract.ts").VaiAdvisorBundle | null;
  readonly previousVaiAdvisorSession?: import("@/app/lib/vai/vaiAdvisorContract.ts").VaiAdvisorSession | null;
  readonly previousVaiWhatIfSession?: import("@/app/lib/vai/vaiWhatIfContract.ts").VaiWhatIfSession | null;
  readonly vaiTrustedModels?: readonly import("@/app/lib/vai/vaiWhatIfContract.ts").VaiTrustedQuantitativeModel[];
  readonly vaiWhatIfRequestedScope?: { readonly businessContext?: string | null };
  readonly previousVai8PromotionSession?: import("@/app/lib/vai/vaiExperimentDecisionContract.ts").Vai8PromotionSession | null;
  readonly nmiAdvisorBundle?: import("@/app/lib/nmi/nmiAdvisorContract.ts").NmiAdvisorBundle | null;
  readonly suggestedActions?: readonly {
    readonly id: string;
    readonly label: string;
    readonly utterance: string;
    readonly kind?: "answer" | "question";
  }[];
  readonly guidedAttentionRequest?: NexoraGuidedAttentionPresentation | null;
  readonly pendingOfferTarget?: NexoraGuidedAttentionTarget | null;
  readonly clearGuidedAttention?: boolean;
  readonly guidedAttention?: NexoraGuidedAttentionRuntime | null;
  readonly visualViewRequest?: NexoraVisualView | null;
  readonly dismissVisualView?: boolean;
  readonly visualView?: NexoraVisualViewRuntime | null;
  readonly subjectCompositionFidelity?: import("./subjectCompositionFidelity.ts").SubjectCompositionFidelityDecision | null;
}): NexoraConversationalExperienceResult & {
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
} {
  let executiveContextUpdate: NexoraExecutiveContextUpdateResult | null = null;
  let nextExecutiveContext = args.previousExecutiveContext;
  const recommendationResult = args.recommendationResult ?? null;
  const scenarioResult = args.scenarioResult ?? null;
  const decisionCommitmentResult = args.decisionCommitmentResult ?? null;
  const lastRecommendationId =
    recommendationResult?.primaryRecommendation?.recommendationId ?? null;

  if (args.shouldCommitRuntime && args.runtimeResult?.status === "applied") {
    const commandKind = args.commandResult?.command?.kind ?? null;
    const focusedId = args.nextRuntimeState.focusedSubject?.id ?? null;
    const presentedFromLinks =
      args.catalog && focusedId
        ? buildPresentedSetFromCatalogLinks({
            catalog: args.catalog,
            anchorSubjectId: focusedId,
            commandKind,
            turnIndex: args.previousExecutiveContext.turnIndex + 1,
          })
        : null;
    const presentedFromCollection = buildPresentedSetFromCollectionState(
      args.nextRuntimeState,
      args.previousExecutiveContext.turnIndex + 1,
    );
    const workspaceChanged =
      args.previousExecutiveContext.currentWorkspaceId != null &&
      args.previousExecutiveContext.currentWorkspaceId !==
        args.nextRuntimeState.workspace;

    executiveContextUpdate = updateNexoraExecutiveContext({
      previousContext: args.previousExecutiveContext,
      intentResult: args.intentResult,
      resolvedContext: args.contextResult,
      experienceResult: args.experienceResult,
      commandResult: args.commandResult,
      runtimeResult: args.runtimeResult,
      runtimeFocusedSubjectId: focusedId,
      runtimeFocusedSubjectKind: focusedKind(args.nextRuntimeState),
      runtimeFocusedCanonicalName:
        args.nextRuntimeState.focusedSubject?.label ?? null,
      runtimeWorkspaceId: args.nextRuntimeState.workspace,
      presentedSet: presentedFromCollection ?? presentedFromLinks,
      executiveSubjects: args.executiveSubjects,
      trustedSuccess: true,
      syncSource: workspaceChanged ? "workspace-transition" : null,
      lastRecommendationId,
    });
    nextExecutiveContext = executiveContextUpdate.nextContext;
  } else if (args.trustedAdvisorySuccess === true) {
    // CC:8/CC:9/CC:10 advisory/commitment turn: record command + refs.
    const generatedScenarioRef = scenarioResult?.scenario
      ? freezeExecutiveContextReference({
          subjectId: scenarioResult.scenario.scenarioId,
          subjectKind: "scenario",
          canonicalName: scenarioResult.scenario.name,
          source: "conversation",
          turnIndex: args.previousExecutiveContext.turnIndex + 1,
        })
      : null;
    const previousNamedScenario =
      args.previousExecutiveContext.currentScenario?.subjectId.startsWith(
        "ctx-scenario-",
      )
        ? args.previousExecutiveContext.currentScenario
        : null;
    const scenarioRef =
      previousNamedScenario &&
      scenarioResult?.scenario?.parentScenarioId ===
        previousNamedScenario.subjectId
        ? previousNamedScenario
        : generatedScenarioRef;
    const decisionRef =
      decisionCommitmentResult?.decision &&
      (decisionCommitmentResult.status === "applied" ||
        decisionCommitmentResult.status === "already-committed")
        ? freezeExecutiveContextReference({
            subjectId: decisionCommitmentResult.decision.decisionId,
            subjectKind: "decision",
            canonicalName: decisionCommitmentResult.decision.title,
            source: "conversation",
            turnIndex: args.previousExecutiveContext.turnIndex + 1,
          })
        : null;
    const presentedSet =
      scenarioResult?.nextSession.candidateScenarioIds.length
        ? Object.freeze({
            kind: "scenarios" as const,
            subjectIds: scenarioResult.nextSession.candidateScenarioIds,
            anchorSubjectId: scenarioResult.scenario?.scenarioId ?? null,
            turnIndex: args.previousExecutiveContext.turnIndex + 1,
          })
        : null;

    executiveContextUpdate = updateNexoraExecutiveContext({
      previousContext: args.previousExecutiveContext,
      intentResult: args.intentResult,
      resolvedContext: args.contextResult,
      experienceResult: args.experienceResult,
      commandResult: args.commandResult,
      runtimeResult: args.runtimeResult,
      executiveSubjects: args.executiveSubjects,
      trustedSuccess: true,
      lastRecommendationId,
      presentedSet,
      ...(decisionRef
        ? {
            runtimeFocusedSubjectId: decisionRef.subjectId,
            runtimeFocusedSubjectKind: "decision" as const,
            runtimeFocusedCanonicalName: decisionRef.canonicalName ?? null,
          }
        : scenarioRef &&
            args.contextResult.context.primarySubject?.subjectKind !== "object" &&
            args.previousExecutiveContext.currentSubject?.subjectKind !== "object" &&
            args.contextResult.context.primarySubject?.subjectKind !== "problem" &&
            args.previousExecutiveContext.currentSubject?.subjectKind !== "problem"
          ? {
              runtimeFocusedSubjectId: scenarioRef.subjectId,
              runtimeFocusedSubjectKind: "scenario" as const,
              runtimeFocusedCanonicalName: scenarioRef.canonicalName ?? null,
            }
          : {}),
    });
    nextExecutiveContext = executiveContextUpdate.nextContext;
  } else {
    executiveContextUpdate = updateNexoraExecutiveContext({
      previousContext: args.previousExecutiveContext,
      intentResult: args.intentResult,
      resolvedContext: args.contextResult,
      experienceResult: args.experienceResult,
      commandResult: args.commandResult,
      runtimeResult: args.runtimeResult,
      trustedSuccess: false,
      executiveSubjects: args.executiveSubjects,
    });
    nextExecutiveContext = executiveContextUpdate.nextContext;
  }

  const derivedPendingTurnExpectation =
    args.nextPendingTurnExpectation !== undefined
      ? args.nextPendingTurnExpectation
      : args.intentResult.intent.kind === "greet"
        ? (() => {
            const attention =
              recommendationResult?.assessment.issues[0] ??
              recommendationResult?.assessment.constraints[0] ??
              null;
            const critical =
              attention &&
              ((attention as { severity?: string }).severity === "critical" ||
                (attention as { attention?: string }).attention === "critical");
            return critical && attention
              ? createNexoraPendingTurnExpectation({
                  expectationId: `${args.ids.nexoraId}-review`,
                  questionKind: "review-subject",
                  expectedAnswerKind: "confirmation",
                  subjectId: attention.subjectId,
                  sourceCapability: "CC:5",
                  confirmationLevel: "review",
                })
              : null;
          })()
        : decisionCommitmentResult?.status === "confirmation-required" &&
            decisionCommitmentResult.nextSession.pendingConfirmation
          ? createNexoraPendingTurnExpectation({
              expectationId:
                decisionCommitmentResult.nextSession.pendingConfirmation
                  .confirmationId,
              questionKind: "decision-commitment",
              expectedAnswerKind: "decision-option",
              subjectId:
                args.contextResult.context.primarySubject?.subjectId ?? null,
              optionIds: [
                decisionCommitmentResult.nextSession.pendingConfirmation
                  .candidateId,
              ],
              sourceCapability: "CC:10",
              consequential: true,
              confirmationLevel: "consequential",
            })
          : args.status === "clarification-required" &&
              scenarioResult?.nextSession.candidateScenarioIds.length
            ? createNexoraPendingTurnExpectation({
                expectationId: `${args.ids.nexoraId}-scenario`,
                questionKind: "select-scenario",
                expectedAnswerKind: "scenario-selection",
                subjectId:
                  args.contextResult.context.primarySubject?.subjectId ?? null,
                optionIds: scenarioResult.nextSession.candidateScenarioIds,
                sourceCapability: "CC:9",
              })
            : args.status === "clarification-required"
              ? createNexoraPendingTurnExpectation({
                  expectationId: `${args.ids.nexoraId}-clarification`,
                  questionKind: "select-subject",
                  expectedAnswerKind: "subject-selection",
                  optionIds:
                    args.contextResult.trace.canonicalCandidates.length > 0
                      ? args.contextResult.trace.canonicalCandidates
                      : args.executiveSubjects.map(
                          (subject) => subject.subjectId,
                        ),
                  sourceCapability: "CC:2",
                })
          : null;
  nextExecutiveContext = freezeExecutiveContextSnapshot({
    ...nextExecutiveContext,
    pendingTurnExpectation: derivedPendingTurnExpectation,
  });
  const nextConversationContext =
    toNexoraConversationContextSnapshot(nextExecutiveContext);

  const managerMessage = freezeMessage({
    id: args.ids.managerId,
    role: "manager",
    text: args.utterance.trim(),
    createdAt: undefined,
  });

  const normalizedUtterance = normalizeNexoraConversationalUtterance(
    args.utterance,
  );
  const targetedDeicticInvestigation =
    isTargetedDeicticInvestigationUtterance(normalizedUtterance);
  const deicticUtterance =
    (isDeicticSubjectFollowUpUtterance(normalizedUtterance) ||
      /^(?:why|what about|open|review)?\s*(?:it|this|that)(?:\s+(?:problem|scenario|one))?[.!?]?$/i.test(
        args.utterance.trim(),
      )) &&
    !/\bits\b/i.test(args.utterance);
  const focusedBeforeTurnId =
    (args.runtimeStateBeforeTurn ?? args.nextRuntimeState).focusedSubject?.id ??
    null;
  const priorSession = args.previousManagerObjectSession;
  const failedUnresolvedReference =
    priorSession?.ncaConversationState?.lastFailedTurn?.failureKind ===
    "UNRESOLVED_REFERENCE";
  const namedOwnsSingularDeictic =
    deicticUtterance &&
    priorSession?.activationSource === "conversation-named" &&
    priorSession.activeObjectId != null;
  const stageClickOwnsSingularDeictic =
    deicticUtterance &&
    isDeicticSubjectFollowUpUtterance(normalizedUtterance) &&
    priorSession?.activationSource !== "conversation-named" &&
    priorSession?.activeObjectId != null &&
    focusedBeforeTurnId != null &&
    priorSession.activeObjectId === focusedBeforeTurnId;
  const hasNamedHint =
    !deicticUtterance &&
    !/\bits\b/i.test(args.utterance) &&
    args.intentResult.intent.targetHints.some(
    (hint) =>
      (hint.role === "primary" || hint.role === "ordinal") &&
      !/^(?:it|this|that|them|this one|that one|that problem|this problem|the problem|that scenario|this scenario)$/i.test(
        hint.raw.trim(),
      ),
  );
  const comparativeFollowUp = /^\s*what about\b/i.test(args.utterance);
  const preProjectionExecutionRequest = resolveNexoraExecutionFollowUpRequest(
    args.utterance,
  );
  const preProjectionApprovedDecision =
    (args.decisionRuntime?.listDecisions() ?? []).find(
      (decision) => decision.status === "Approved",
    ) ?? null;
  if (
    preProjectionExecutionRequest?.action === "start" &&
    preProjectionApprovedDecision &&
    args.executionRuntime &&
    args.decisionRuntime &&
    args.canonicalExecutionRuntimeProvided === true &&
    !shouldNexoraExecutionPlanningOwnUtterance(
      args.nextEntranceSession,
      args.utterance,
    )
  ) {
    resolveNexoraExecutiveExecutionFollowUp({
      action: "start",
      decisionId: preProjectionApprovedDecision.decisionId,
      executionRuntime: args.executionRuntime,
      decisionRuntime: args.decisionRuntime,
    });
  }
  const canonicalExecutionStates = Object.freeze(
    Object.fromEntries(
      (args.executionRuntime?.listExecutions() ?? []).map((execution) => [
        execution.executionId,
        mapCanonicalExecutionJourneyState(execution.status),
      ]),
    ),
  );
  const entranceExecution = args.nextEntranceSession?.executionPlanning ?? null;
  const managerObjectTurnRaw = resolveManagerObjectTurn({
    utterance: args.utterance,
    conversationalKind: args.intentResult.intent.kind,
    hasNamedTargetHint: hasNamedHint && !comparativeFollowUp,
    namedSubjectId: hasNamedHint && !comparativeFollowUp
      ? (args.contextResult.context.primarySubject?.subjectId ?? null)
      : null,
    previousSession:
      args.previousManagerObjectSession ??
      Object.freeze({
        ...createEmptyManagerObjectSession(),
        activeObjectId:
          args.previousExecutiveContext.currentSubject?.subjectId ??
          args.nextRuntimeState.focusedSubject?.id ??
          null,
        activationSource:
          args.previousExecutiveContext.currentSubject ||
          args.nextRuntimeState.focusedSubject
            ? "preserved"
            : "none",
      }),
    stageFocusedId: (args.runtimeStateBeforeTurn ?? args.nextRuntimeState).focusedSubject?.id ?? null,
    conversationSubjectId:
      failedUnresolvedReference && deicticUtterance && !namedOwnsSingularDeictic
        ? null
        : (comparativeFollowUp
          ? args.previousManagerObjectSession?.activeObjectId ?? null
          : stageClickOwnsSingularDeictic
            ? focusedBeforeTurnId ??
              args.previousManagerObjectSession?.activeObjectId ??
              nextExecutiveContext.currentSubject?.subjectId
            : deicticUtterance
              ? args.previousManagerObjectSession?.activationSource === "conversation-named" &&
                args.previousManagerObjectSession.activeObjectId
                ? args.previousManagerObjectSession.activeObjectId
                : targetedDeicticInvestigation
                ? args.previousManagerObjectSession?.conversationContinuity
                    ?.activeSubjectId ??
                  nextExecutiveContext.currentSubject?.subjectId ??
                  args.previousManagerObjectSession?.ncaConversationState
                    ?.activeSubject?.id
                : args.previousManagerObjectSession?.ncaConversationState
                    ?.activeSubject?.id ??
                  nextExecutiveContext.currentSubject?.subjectId
              : hasNamedHint
                ? args.contextResult.context.primarySubject?.subjectId ??
                  nextExecutiveContext.currentSubject?.subjectId
                : nextExecutiveContext.currentSubject?.subjectId) ??
          args.previousExecutiveContext.currentSubject?.subjectId ??
          args.previousManagerObjectSession?.ncaConversationState?.activeSubject
            ?.id ??
          null,
    catalog: args.catalog,
    subjects: args.executiveSubjects,
    managerGoal:
      args.previousManagerObjectSession?.goalContext?.title ??
      nextExecutiveContext.currentGoal?.canonicalName ??
      args.previousExecutiveContext.currentGoal?.canonicalName ??
      null,
    committedDecisionIds: Object.freeze(
      (args.decisionRuntime?.listDecisions() ?? [])
        .filter((decision) => decision.status === "Approved")
        .map((decision) => decision.decisionId),
    ),
    journeyFacts:
      Object.keys(canonicalExecutionStates).length > 0 ||
      entranceExecution?.canonicalExecutionId
      ? {
          executionStates: Object.freeze({
            ...(entranceExecution?.canonicalExecutionId
              ? {
                  [entranceExecution.canonicalExecutionId]:
                    mapCanonicalExecutionJourneyState(
                      entranceExecution.canonicalStatus,
                    ),
                }
              : {}),
            ...canonicalExecutionStates,
          }),
          outcomeStates: entranceExecution?.canonicalExecutionId
            ? Object.freeze({
                [entranceExecution.canonicalExecutionId]:
                  mapOutcomeJourneyState(
                    args.nextEntranceSession?.outcomeMonitoring,
                  ),
              })
            : undefined,
          learningState:
            args.nextEntranceSession?.learningReassessment?.context
              ?.supportedLearnings.length
              ? args.nextEntranceSession.learningReassessment.context
                  .memoryStatus === "WRITTEN" ||
                args.nextEntranceSession.learningReassessment.context
                  .memoryStatus === "SUPERSEDED"
                ? ("CAPTURED" as const)
                : ("AVAILABLE" as const)
              : ("NOT_AVAILABLE" as const),
        }
      : undefined,
    executiveCurrentGoal: nextExecutiveContext.currentGoal
      ? {
          subjectId: nextExecutiveContext.currentGoal.subjectId,
          canonicalName: nextExecutiveContext.currentGoal.canonicalName ?? null,
        }
      : args.previousExecutiveContext.currentGoal
        ? {
            subjectId: args.previousExecutiveContext.currentGoal.subjectId,
            canonicalName:
              args.previousExecutiveContext.currentGoal.canonicalName ?? null,
          }
        : null,
  });

  const discoveredGoal = args.nextEntranceSession?.goalDiscovery;
  const realityGap = realityGapForMo(
    args.nextEntranceSession?.realityDiscovery ?? null,
  );
  let managerObjectTurn =
    discoveredGoal?.object && discoveredGoal.context.managerConfirmed
      ? Object.freeze({
          ...managerObjectTurnRaw,
          session: freezeManagerObjectSession({
            ...managerObjectTurnRaw.session,
            goalContext: {
              ...toMoGoalContext(
                discoveredGoal.context,
                discoveredGoal.object,
              ),
              ...(realityGap ? { currentGap: realityGap } : {}),
            },
            activeObjectId:
              managerObjectTurnRaw.session.activeObjectId ??
              discoveredGoal.object.id,
          }),
        })
      : managerObjectTurnRaw;

  const investigationAsk =
    classifyExecutiveInvestigationAsk(
      normalizeNexoraConversationalUtterance(args.utterance),
    ) ??
    (threadFromSession(
      args.previousManagerObjectSession ?? managerObjectTurn.session,
    ) &&
    /^(?:what do you recommend|what should i do)$/.test(
      normalizeNexoraConversationalUtterance(args.utterance),
    )
      ? ("recommend-under-uncertainty" as const)
      : null);
  const investigation = investigationAsk
    ? composeExecutiveInvestigationAnswer({
        utterance: args.utterance,
        ask: investigationAsk,
        focusId:
          managerObjectTurn.activeObjectId ??
          args.contextResult.context.primarySubject?.subjectId ??
          null,
        thread: threadFromSession(
          args.previousManagerObjectSession ?? managerObjectTurn.session,
        ),
        catalog: args.catalog,
        scenarioResult: args.scenarioResult,
        decisionResult: args.decisionCommitmentResult,
      })
    : null;
  if (investigation?.thread) {
    managerObjectTurn = Object.freeze({
      ...managerObjectTurn,
      session: freezeManagerObjectSession(
        withInvestigationThread(managerObjectTurn.session, investigation.thread),
      ),
    });
  }

  const managerExperience = composeExecutiveManagerExperience({
    utterance: args.utterance,
    originalResponse: args.response,
    conversationalKind: args.intentResult.intent.kind,
    turn: managerObjectTurn,
    previousSession: args.previousManagerObjectSession,
    recommendationPresent: Boolean(args.recommendationResult),
    scenarioPresent: Boolean(args.scenarioResult),
    decisionCommitmentPresent: Boolean(args.decisionCommitmentResult),
  });
  const authorityResponse = args.preservePresentedResponse
    ? args.response
    : investigation?.answer
      ? investigation.answer
      : managerExperience.answer.length > 0
        ? managerExperience.answer
        : args.response;

  const naturalLanguageUnderstanding = interpretManagerTurnMeaning({
    utterance: managerOverrideSemanticUtterance(args.utterance),
    subjects: args.executiveSubjects,
  });
  const contextualManagerMeaning = interpretContextualManagerTurn({
    turnMeaning: naturalLanguageUnderstanding,
    subjects: args.executiveSubjects,
    previousContinuity:
      args.previousManagerObjectSession?.conversationContinuity ??
      managerObjectTurn.session.conversationContinuity ??
      null,
    executiveContext: args.previousExecutiveContext,
    managerSession: args.previousManagerObjectSession ?? managerObjectTurn.session,
    stageFocusedId: (args.runtimeStateBeforeTurn ?? args.nextRuntimeState).focusedSubject?.id ?? null,
  });
  const conversationContinuity = args.preserveConversationContinuity
    ? (args.previousManagerObjectSession?.conversationContinuity ??
      managerObjectTurn.session.conversationContinuity ??
      updateConversationContinuity({
        previous: null,
        contextual: contextualManagerMeaning,
        resolvedSubjectId: null,
        resolvedSubjectKind: null,
        investigationSubjectId: null,
      }))
    : updateConversationContinuity({
    previous: applyClarificationRepair(
      args.previousManagerObjectSession?.conversationContinuity ??
        managerObjectTurn.session.conversationContinuity,
      args.clarificationTurn ??
        interpretClarificationTurn({
          turnMeaning: naturalLanguageUnderstanding,
          contextual: contextualManagerMeaning,
          pending: args.previousManagerObjectSession?.pendingClarification ?? null,
          continuity:
            args.previousManagerObjectSession?.conversationContinuity ?? null,
          subjects: args.executiveSubjects,
          intentKind: args.intentResult.intent.kind,
        }),
    ) ??
      args.previousManagerObjectSession?.conversationContinuity ??
      managerObjectTurn.session.conversationContinuity,
    contextual: contextualManagerMeaning,
    resolvedSubjectId:
      args.clarificationTurn?.resumeReference?.subjectId ??
      (contextualManagerMeaning.continuityMove === "backtrack" ||
      contextualManagerMeaning.continuityMove === "resume-parked" ||
      contextualManagerMeaning.continuityMove === "other-referent"
        ? contextualManagerMeaning.objectReference?.subjectId ??
          managerObjectTurn.activeObjectId ??
          args.contextResult.context.primarySubject?.subjectId ??
          null
        : contextualManagerMeaning.provenance === "EXPLICIT_CURRENT_TURN"
          ? contextualManagerMeaning.objectReference?.subjectId ??
            managerObjectTurn.activeObjectId ??
            args.contextResult.context.primarySubject?.subjectId ??
            null
          : managerObjectTurn.activeObjectId ??
            args.contextResult.context.primarySubject?.subjectId ??
            contextualManagerMeaning.objectReference?.subjectId ??
            null),
    resolvedSubjectKind:
      args.clarificationTurn?.resumeReference?.subjectKind ??
      args.contextResult.context.primarySubject?.subjectKind ??
      managerObjectTurn.context.objectKind.value ??
      null,
    investigationSubjectId:
      isTargetedDeicticInvestigationUtterance(
        normalizeNexoraConversationalUtterance(args.utterance),
      )
        ? managerObjectTurn.activeObjectId ??
          args.contextResult.context.primarySubject?.subjectId ??
          contextualManagerMeaning.objectReference?.subjectId ??
          null
        : managerObjectTurn.session.investigationSubjectId ??
          managerObjectTurn.exploration.recommendedPaths[0]?.targetObjectId ??
          null,
    presentedIds:
      nextExecutiveContext.presentedSet?.subjectIds ??
      managerObjectTurn.session.investigationCandidateIds,
    recommendedTargetId:
      managerObjectTurn.exploration.recommendedPaths[0]?.targetObjectId ?? null,
    recommendationId:
      lastRecommendationId,
  });
  const clarificationTurn =
    args.clarificationTurn ??
    interpretClarificationTurn({
      turnMeaning: naturalLanguageUnderstanding,
      contextual: contextualManagerMeaning,
      pending: args.previousManagerObjectSession?.pendingClarification ?? null,
      continuity:
        args.previousManagerObjectSession?.conversationContinuity ?? null,
      subjects: args.executiveSubjects,
      intentKind: args.intentResult.intent.kind,
    });
  managerObjectTurn = Object.freeze({
    ...managerObjectTurn,
    session: freezeManagerObjectSession({
      ...managerObjectTurn.session,
      conversationContinuity,
      pendingClarification:
        args.pendingClarification !== undefined
          ? args.pendingClarification
          : clarificationTurn.action === "park"
            ? clarificationTurn.pending
            : null,
    }),
  });
  const isManagerSituationAssertion =
    !args.utterance.includes("?") &&
    /\b(?:is|are|was|were|now|latest|currently|normal|constrained|cause)\b/i.test(args.utterance);
  const collectionQuery = interpretExecutiveCollectionQuery(args.utterance);
  const speechAct = classifyManagerSpeechAct(args.utterance);
  if (
    (naturalLanguageUnderstanding.communicativeIntent === "OBSERVE" ||
      naturalLanguageUnderstanding.communicativeIntent === "SUPPLY_INFORMATION" ||
      isManagerSituationAssertion) &&
    naturalLanguageUnderstanding.communicativeIntent !== "CORRECT" &&
    speechAct !== "CORRECTION" &&
    speechAct !== "QUESTION" &&
    speechAct !== "COMMAND" &&
    !collectionQuery &&
    !isStageMetaUtterance(args.utterance) &&
    !/^(?:show-problems|show-goals|show-scenarios|show-decisions|show-execution|show-related)$/.test(
      args.intentResult.intent.kind,
    ) &&
    args.utterance.trim()
  ) {
    const observations = managerObjectTurn.session.managerObservations ?? [];
    if (!observations.some((item) => item.text === args.utterance.trim())) {
      managerObjectTurn = Object.freeze({
        ...managerObjectTurn,
        session: freezeManagerObjectSession({
          ...managerObjectTurn.session,
          managerObservations: Object.freeze([
            ...observations,
            Object.freeze({
              text: args.utterance.trim(),
              provenance: "manager-reported" as const,
              matchedLabel:
                naturalLanguageUnderstanding.objectReference?.canonicalName ??
                contextualManagerMeaning.objectReference?.canonicalName ??
                null,
            }),
          ].slice(-12)),
        }),
      });
    }
  }

  const guidanceTurn = resolveGuidanceTurn({
    utterance: args.utterance,
    meaning: naturalLanguageUnderstanding,
    intentKind: args.intentResult.intent.kind,
    status: args.status,
    turn: managerObjectTurn,
    clarification: clarificationTurn,
    authorityResponse,
    registeredNames: args.executiveSubjects.map((subject) => subject.canonicalName),
    previousGuidance: args.previousManagerObjectSession?.lastGuidanceText ?? null,
  });
  const guidedSource =
    args.lockPresentedResponse
      ? authorityResponse
      : guidanceTurn.action === "replace" && guidanceTurn.answer
        ? guidanceTurn.answer
        : guidanceTurn.action === "append" && guidanceTurn.answer
          ? `${authorityResponse} ${guidanceTurn.answer}`
          : authorityResponse;
  managerObjectTurn = Object.freeze({
    ...managerObjectTurn,
    session: freezeManagerObjectSession({
      ...managerObjectTurn.session,
      lastGuidanceText:
        guidanceTurn.action === "keep" ? managerObjectTurn.session.lastGuidanceText ?? null : guidanceTurn.selectedGuidance,
    }),
  });

  const trustedCommunication = composeTrustedExecutiveCommunication({
    sourceText: guidedSource,
    utterance: args.utterance,
    meaning: naturalLanguageUnderstanding,
    clarification: clarificationTurn,
    status: args.status,
    intentKind: args.intentResult.intent.kind,
    explanation: managerObjectTurn.explanation,
    lockPresentedResponse: Boolean(args.lockPresentedResponse),
  });
  const previousNcaState =
    args.previousManagerObjectSession?.ncaConversationState ?? null;
  const ncaTurnRaw = interpretNcaTurn({
    utterance: args.utterance,
    meaning: naturalLanguageUnderstanding,
    contextual: contextualManagerMeaning,
    clarification: clarificationTurn,
    guidance: guidanceTurn,
    turn: managerObjectTurn,
    role: args.nextEntranceSession?.identity.role ?? null,
    domain: args.nextEntranceSession?.identity.domain ?? null,
    answeredMissing: previousNcaState?.answeredMissing,
    stageHasReferent: Boolean(
      args.runtimeStateBeforeTurn?.collectionContext || args.runtimeStateBeforeTurn?.focusedSubject,
    ),
  });
  const seedQuestion =
    ncaTurnRaw.strategy.question ?? investigationSeedQuestion(ncaTurnRaw);
  const ncaForDialogue =
    seedQuestion && !ncaTurnRaw.strategy.question
      ? Object.freeze({
          ...ncaTurnRaw,
          strategy: Object.freeze({
            ...ncaTurnRaw.strategy,
            question: seedQuestion,
          }),
        })
      : ncaTurnRaw;
  const ncaDialogue = interpretNcaDialogueTurn({
    previous: previousNcaState,
    utterance: args.utterance,
    nca: ncaForDialogue,
    meaning: naturalLanguageUnderstanding,
    contextual: contextualManagerMeaning,
  });
  const ncaAfterDialogue = overlayNcaTurnWithDialogue(ncaForDialogue, ncaDialogue);
  const nca3Strategy = evaluateNca3QuestionStrategy({
    utterance: args.utterance,
    nca: ncaAfterDialogue,
    conversation: ncaDialogue.state,
    dialogueMove: ncaDialogue.move,
    explanationText: managerObjectTurn.explanation.managerFacingText,
    goalTitle: managerObjectTurn.navigation.goal?.title ?? null,
    lastAnswer: ncaDialogue.state.lastAnswer,
  });
  const ncaTurn =
    ncaDialogue.move === "ANSWER_NEXORA"
      ? ncaAfterDialogue
      : overlayNcaTurnWithQuestionStrategy(ncaAfterDialogue, nca3Strategy);
  const nxaResponseContract = resolveNxaAdvisorTurnContract({
    meaning: naturalLanguageUnderstanding,
    nca: ncaTurn,
    dialogue: ncaDialogue.state,
  });
  const strategySource = applyNcaStrategyToResponse({
    source: trustedCommunication.answer,
    nca: ncaTurn,
    locked: Boolean(args.lockPresentedResponse),
  });
  const seededSource =
    !args.lockPresentedResponse &&
    seedQuestion &&
    !strategySource.includes("?") &&
    !(nca3Strategy.shouldAsk && nca3Strategy.question) &&
    ncaDialogue.move !== "ANSWER_NEXORA" &&
    ncaDialogue.move !== "ACKNOWLEDGE" &&
    ncaDialogue.move !== "ACCEPT" &&
    ncaDialogue.move !== "FOLLOW_UP" &&
    ncaDialogue.move !== "REJECT" &&
    ncaDialogue.move !== "CORRECT" &&
    ncaDialogue.move !== "CLOSE_TOPIC" &&
    ncaDialogue.move !== "RETURN_TO_TOPIC" &&
    !/\bwhy that one\b/i.test(args.utterance)
      ? `${strategySource} ${seedQuestion}`
      : strategySource;
  const continuity = composeNca2ContinuityResponse({
    source: seededSource,
    interpretation: ncaDialogue,
    nca: ncaTurn,
    locked: Boolean(args.lockPresentedResponse),
  });
  const nca3Presented = applyNca3StrategyToResponse({
    source: continuity.text,
    strategy: nca3Strategy,
    utterance: args.utterance,
    locked: Boolean(args.lockPresentedResponse),
    dialogueMove: ncaDialogue.move,
  });
  const nca4Strategy = evaluateNca4AdvisoryStrategy({
    utterance: args.utterance,
    nca: ncaTurn,
    conversation: ncaDialogue.state,
    nca3: nca3Strategy,
  });
  const nxaGuidanceForResponse = resolveNxaConversationGuidance({
    utterance: args.utterance,
    status: args.status,
    nxa1: nxaResponseContract,
    nca3ShouldAsk: nca3Strategy.shouldAsk,
    nca3GapId: nca3Strategy.gap?.id ?? null,
    nca4ShouldAdvise: nca4Strategy.shouldAdvise,
    nca4Move: nca4Strategy.move,
    previousRecommendation: previousNcaState?.lastRecommendation ?? null,
    currentRecommendation: ncaDialogue.state.lastRecommendation ?? null,
    explicitManagerOverride: /^(?:no[,.]?\s+)?(?:show|open|focus|go to)\b/i.test(args.utterance.trim()),
  });
  const nca4Presented = applyNca4StrategyToResponse({
    source: nca3Presented,
    strategy: nca4Strategy,
    locked:
      Boolean(args.lockPresentedResponse) ||
      (clarificationTurn.action === "clarify" && !nca4Strategy.shouldAdvise),
  });
  const nca5Strategy = evaluateNca5InitiativeStrategy({
    utterance: args.utterance,
    nca: ncaTurn,
    conversation: ncaDialogue.state,
    nca3: nca3Strategy,
    nca4: nca4Strategy,
    attention: managerObjectTurn.attention,
    signals: args.initiativeSignals,
    conversationImportance: args.conversationImportance,
    managerTurnPresent: Boolean(args.utterance.trim()),
  });
  const nca5Presented = applyNca5StrategyToResponse({
    source: nca4Presented,
    strategy: nca5Strategy,
    locked:
      Boolean(args.lockPresentedResponse) || clarificationTurn.action === "clarify",
    managerTurnPresent: Boolean(args.utterance.trim()),
  });
  const nca6Strategy = evaluateNca6CommunicationStrategy({
    utterance: args.utterance,
    source: nca5Presented,
    nca: ncaTurn,
    conversation: ncaDialogue.state,
    nca3: nca3Strategy,
    nca4: nca4Strategy,
    nca5: nca5Strategy,
    managerContext: args.managerCommunicationContext,
  });
  const presentedResponseRaw = applyNca6StrategyToResponse({
    source: nca5Presented,
    strategy: nca6Strategy,
    locked:
      Boolean(args.lockPresentedResponse) || clarificationTurn.action === "clarify",
  });
  const catalog = args.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const incomingStage = projectAuthoritativeStageContext({
    runtimeState: args.nextRuntimeState,
    catalog,
    lastAuthorizedPresentation:
      args.previousManagerObjectSession?.ncaConversationState?.lastAuthorizedPresentation ?? null,
    goalLabel: args.previousExecutiveContext.currentGoal?.canonicalName ?? null,
    presentationOptions:
      resolveExecutiveExperienceContext(args.nextEntranceSession) === "GUIDED_ENTRANCE"
        ? { overviewOccupancy: "current-catalog" }
        : undefined,
  });
  const stageRelationship = classifyRequestStageRelationship({
    utterance: args.utterance,
    intentKind: args.intentResult.intent.kind,
    stage: incomingStage,
    pendingCriterion:
      args.previousManagerObjectSession?.ncaConversationState?.pendingQuestion?.expectedInformation ===
      "PRIORITY",
    pendingConsent:
      args.previousManagerObjectSession?.ncaConversationState?.pendingPresentationConsent ?? null,
  });
  const stageObject = (id: string) => {
    const item = catalog.objects.find((entry) => entry.id === id) ?? catalog.contextSubjects.find((entry) => entry.id === id);
    return Object.freeze({ id, label: item?.label ?? id, kind: item?.kind ?? "object" });
  };
  const stageCollection = args.nextRuntimeState.collectionContext;
  const stageMembers = Object.freeze((stageCollection?.objectIds ?? []).map(stageObject));
  const stageFocused = args.nextRuntimeState.focusedSubject
    ? stageObject(args.nextRuntimeState.focusedSubject.id)
    : null;
  const stageVisible = Object.freeze([
    ...(stageFocused ? [stageFocused] : []),
    ...stageMembers.filter((member) => member.id !== stageFocused?.id),
  ]);
  const stageSnapshot = Object.freeze({
    workspace: args.nextRuntimeState.workspace,
    mode: args.nextRuntimeState.mode,
    focused: stageFocused,
    collection: stageCollection
      ? Object.freeze({
          kind: stageCollection.category,
          label: EXECUTIVE_QUEUE_CATEGORY_LABELS[stageCollection.category],
          members: stageMembers,
        })
      : null,
    visibleObjects: stageVisible,
  });
  const trailLabels = Object.freeze(
    incomingStage.visibleMembers.map((item) => item.label),
  );
  const semanticTurn = composeNexoraSemanticTurn({
    utterance: args.utterance,
    catalog: args.catalog,
    previousCollection: hydrateCanonicalCollectionMembers(
      previousNcaState?.lastCollection?.items ?? [],
      args.catalog,
    ),
    stageLabels: trailLabels,
    focusedLabel: incomingStage.focus?.label ?? args.nextRuntimeState.focusedSubject?.label ?? null,
    stageSnapshot: incomingStage.snapshot ?? stageSnapshot,
    presentationOnlyChange: /\b(?:shown|view|filter|focus)\b/i.test(args.utterance),
  });
  const canonicalFocusName =
    naturalLanguageUnderstanding.objectReference?.canonicalName
      ?.toLowerCase()
      .trim() ?? null;
  const canonicalFocusIsExplicit = Boolean(
    naturalLanguageUnderstanding.requestedOperation === "FOCUS" &&
      naturalLanguageUnderstanding.objectReference?.subjectId &&
      stageRelationship !== "STAGE_GROUNDED" &&
      (isExplicitPresentationRequest(args.utterance, "focus") ||
        (canonicalFocusName != null &&
          normalizeNexoraConversationalUtterance(args.utterance) ===
            canonicalFocusName)),
  );
  const canonicalSingleSubjectHandoff = Boolean(
    canonicalFocusIsExplicit ||
      (clarificationTurn.correctionDetected &&
        clarificationTurn.correctionAfterId),
  );
  const explicitSingularFocus =
    (canonicalSingleSubjectHandoff ||
      (args.intentResult.intent.kind === "focus" &&
        nxaResponseContract.navigationAllowed &&
        semanticTurn.owner === "BUSINESS")) &&
    !/\b(?:problems|risks|opportunities|scenarios|decisions|executions|goals)\b/i.test(args.utterance) &&
    (canonicalSingleSubjectHandoff ||
      isExplicitPresentationRequest(args.utterance, args.intentResult.intent.kind) ||
      incomingStage.visibleMembers.some(
        (member) => member.id === args.contextResult.context.primarySubject?.subjectId,
      ));
  const singleSubjectInvestigationTurn =
    explicitSingularFocus ||
    isTargetedDeicticInvestigationUtterance(
      normalizeNexoraConversationalUtterance(args.utterance),
    );
  const collectionAlreadyPresented =
    (Boolean(collectionQuery?.countRequested) || isCollectionConfirmation(args.utterance)) &&
    Boolean(args.runtimeStateBeforeTurn?.collectionContext?.category) &&
    collectionKindToShowIntent(String(collectionQuery?.collectionKind ?? "")) ===
      collectionKindToShowIntent(args.runtimeStateBeforeTurn?.collectionContext?.category ?? null);
  const collectionPresentationRequested =
    semanticTurn.owner === "COLLECTION_QUERY" &&
    !collectionAlreadyPresented &&
    (/^(?:show-problems|show-goals|show-scenarios|show-decisions|show-execution|show-related)$/.test(
      args.intentResult.intent.kind,
    ) ||
      /^(?:show|open|list|see|what|how many)\b/i.test(args.utterance.trim()));
  const earlierCapabilityOwnsResponse = Boolean(
    args.preservePresentedResponse || args.lockPresentedResponse ||
    ((args.intentResult.intent.kind === "prepare-context" || args.intentResult.intent.kind === "switch-workspace") && args.experienceResult) ||
    args.scenarioResult || args.decisionCommitmentResult ||
    args.nextEntranceSession?.workspaceResolution === "first-time" ||
    explicitSingularFocus,
  );
  const suppressCanonicalCollectionReply = Boolean(
    args.nextEntranceSession?.workspaceResolution === "first-time" ||
    args.nextEntranceSession?.issueDiscovery,
  );
  const dataLibraryTurn = answerAdvisorDataInquiry({
    workspaceId: args.nextRuntimeState.workspace,
    utterance: args.utterance,
    dialogue: args.previousManagerObjectSession?.advisorDataDialogue ?? args.dataLibraryDialogue ?? emptyAdvisorDataDialogue,
    focusedObjectLabel: (args.runtimeStateBeforeTurn ?? args.nextRuntimeState).focusedSubject?.label ?? null,
    conversationContinuity:
      args.previousManagerObjectSession?.conversationContinuity ?? null,
  });
  const dataLibraryOwnsResponse = Boolean(dataLibraryTurn?.text);
  const informationRequirementRequest = isEcaInformationRequirementRequest(args.utterance);
  let presentedResponse =
    semanticTurn.reply && semanticTurn.owner !== "BUSINESS" &&
    !informationRequirementRequest &&
    (!earlierCapabilityOwnsResponse ||
      ((semanticTurn.owner === "COLLECTION_QUERY" || semanticTurn.owner === "WORKSPACE_STATE") &&
        !suppressCanonicalCollectionReply &&
        !args.scenarioResult &&
        !args.preservePresentedResponse &&
        !args.decisionCommitmentResult))
      ? semanticTurn.reply
      : presentedResponseRaw;
  if (
    nxaResponseContract.need === "KNOW" &&
    args.intentResult.intent.kind !== "explain-scenario" &&
    semanticTurn.owner === "BUSINESS" &&
    !args.nextEntranceSession &&
    // Goal/next-action lanes answer from manager goal context; do not replace
    // them with catalog Goal-object explanation when the word "goal" resolves.
    managerExperience.lane !== "goal" &&
    managerExperience.lane !== "next-action" &&
    (args.contextResult.context.resolutionStatus === "resolved" ||
      args.contextResult.context.resolutionStatus === "not-required")
  ) {
    presentedResponse = [
      managerObjectTurn.explanation.summary,
      managerObjectTurn.explanation.relationships[0]?.text ?? null,
    ]
      .filter((part): part is string => Boolean(part))
      .join(" ");
  }
  if (semanticTurn.owner === "BUSINESS" && nxaGuidanceForResponse.behavior === "WAIT" && !args.lockPresentedResponse) {
    presentedResponse = /thank/i.test(args.utterance) ? "You're welcome." : "Understood.";
  }
  if (semanticTurn.owner === "BUSINESS" && nxaGuidanceForResponse.behavior === "ASK" && nxaGuidanceForResponse.question && !args.lockPresentedResponse) {
    presentedResponse = nxaGuidanceForResponse.question;
  }
  if (semanticTurn.owner === "BUSINESS" && nxaGuidanceForResponse.behavior === "CHALLENGE" && !args.lockPresentedResponse) {
    presentedResponse = composeNxaEvidenceChallenge({
      references: semanticTurn.references.references.map((item) => item.name),
      activeSubject: nxaResponseContract.referentName,
    });
  }
  if (nxaGuidanceForResponse.behavior === "GUIDE" && semanticTurn.owner === "BUSINESS" && !args.lockPresentedResponse) {
    presentedResponse = composeNxaContextualGuide({
      subject: nxaResponseContract.referentName,
      nextTarget: managerObjectTurn.exploration.recommendedPaths[0]?.label ?? null,
      goal: managerObjectTurn.navigation.goal?.title ?? null,
    });
  }
  if (
    args.intentResult.intent.kind === "explain-scenario" &&
    !/not an observed outcome/i.test(presentedResponse)
  ) {
    presentedResponse = `${presentedResponse} This is a scenario projection, not an observed outcome; its causal interpretation remains uncertain.`;
  }
  if (
    !args.lockPresentedResponse &&
    nxaResponseContract.need === "LEARN_NEXORA" &&
    nxaResponseContract.referentName &&
    /\b(?:how (?:do|can|should) i use|what can i do with|how can you help)\b/i.test(args.utterance)
  ) {
    presentedResponse = composeNxaContextualEducation(nxaResponseContract.referentName);
  }
  const catalogReferences = Object.freeze([
    ...catalog.objects.map((item) => Object.freeze({ id: item.id, name: item.label, kind: item.kind })),
    ...catalog.contextSubjects.map((item) => Object.freeze({ id: item.id, name: item.label, kind: item.kind })),
  ]);
  const previousCollectionMembers = (
    incomingStage.collection
      ? incomingStage.collection.members.map((item) =>
          Object.freeze({ id: item.id, name: item.label, kind: incomingStage.collection?.kind ?? null }),
        )
      : hydrateCanonicalCollectionMembers(
          previousNcaState?.lastCollection?.items ?? [],
          catalog,
        ).map((item) => Object.freeze({ id: item.id, name: item.label, kind: previousNcaState?.lastCollection?.kind ?? null }))
  );
  const comparisonMeaning = interpretExecutiveComparisonMeaning({
    utterance: args.utterance,
    intentKind: args.intentResult.intent.kind,
    activeComparison: previousNcaState?.activeComparison ?? null,
    activeCollectionPresent: Boolean(incomingStage.collection || previousNcaState?.lastCollection),
    singleSubjectFocus: explicitSingularFocus,
  });
  if (comparisonMeaning.active) {
    // Comparison/judgment is knowledge work, not navigation. Preserve the
    // authoritative executive referent even when an upstream lexical intent
    // happened to resemble singular focus.
    nextExecutiveContext = args.previousExecutiveContext;
    executiveContextUpdate = null;
  }
  const previousOptionMembers = Object.freeze(
    (args.previousManagerObjectSession?.npsComparedOptions ?? [])
      .filter((item) => item.id && item.label)
      .map((item) => Object.freeze({ id: item.id, name: item.label, kind: "OPTION" })),
  );
  const offeredOptionMembers = Object.freeze(
    (previousNcaState?.lastOfferedOptions ?? [])
      .filter((label) => label.trim().length > 0 && !/capacity gap|margin pressure/i.test(label))
      .map((label) => Object.freeze({ id: label, name: label, kind: "OPTION" })),
  );
  const optionComparisonMembers =
    previousOptionMembers.length >= 2
      ? previousOptionMembers
      : offeredOptionMembers.length >= 2
        ? offeredOptionMembers
        : Object.freeze([]);
  const comparisonCandidateSet = resolveExecutiveComparisonCandidateSet({
    meaning: comparisonMeaning,
    explicitReferences: semanticTurn.references.references,
    activeCollection: previousNcaState?.lastCollection
      ? Object.freeze({
          kind: previousNcaState.lastCollection.kind,
          members: Object.freeze(previousCollectionMembers),
          establishedAtTurn: previousNcaState.lastCollection.establishedAtTurn ?? Math.max(0, previousNcaState.turnIndex - 1),
        })
      : null,
    activeComparison: previousNcaState?.activeComparison ?? null,
    catalogReferences,
    turn: (previousNcaState?.turnIndex ?? 0) + 1,
    utterance: args.utterance,
    optionCollection:
      optionComparisonMembers.length >= 2
        ? Object.freeze({
            kind: "OPTION",
            members: optionComparisonMembers,
            establishedAtTurn: previousNcaState?.turnIndex ?? 0,
          })
        : null,
    optionSetActive:
      (previousNcaState?.lastOfferedOptions.length ?? 0) >= 2 ||
      /option|scenario/i.test(previousNcaState?.activeComparison?.candidateKind ?? "") ||
      /\boptions?\b/i.test(args.previousUtterance ?? ""),
  });
  const comparisonCriterionClarification =
    comparisonMeaning.active &&
    comparisonMeaning.criterionAmbiguous &&
    comparisonCandidateSet.candidateIds.length >= 2
      ? buildNca3ComparisonCriterionClarification({
          hasActiveGoal: Boolean(args.previousExecutiveContext.currentGoal),
        })
      : null;
  const comparisonSubjectClarification =
    comparisonMeaning.active &&
    comparisonMeaning.criterionAmbiguous &&
    comparisonCandidateSet.source === "UNRESOLVED"
      ? buildNca3ComparisonSubjectClarification()
      : null;
  const comparisonClarification =
    comparisonCriterionClarification ?? comparisonSubjectClarification;
  const ncaPost4Comparison =
    comparisonMeaning.active &&
    !scenarioResult &&
    comparisonCandidateSet.source !== "UNRESOLVED"
    ? resolveCollectionComparison({
        candidateSet: comparisonCandidateSet,
        historicalAdvisorySubject: previousNcaState?.lastAdvisoryPosition?.optionId ?? null,
      })
    : null;
  const focusedIdForComparison =
    args.nextRuntimeState.focusedSubject?.id ?? managerObjectTurn.activeObjectId ?? null;
  const deicticCandidateInvestigation = Boolean(
    focusedIdForComparison &&
      previousNcaState?.activeComparison?.candidateIds.includes(focusedIdForComparison) &&
      /^(?:why this(?: one)?|explain this)\??$/i.test(
        normalizeNexoraConversationalUtterance(args.utterance),
      ),
  );
  if (ncaPost4Comparison?.response && !comparisonClarification && !deicticCandidateInvestigation) {
    const deicticOptionCompare =
      /^compare them\b/i.test(args.utterance.trim()) &&
      ncaPost4Comparison.candidateSet.candidateIds.length < 2;
    if (deicticOptionCompare) {
      const options = previousNcaState?.lastOfferedOptions ?? [];
      presentedResponse =
        options.length >= 2
          ? `Comparison of the offered options (${options.join(", ")}) is a trade-off against available evidence; it does not rank them without comparable proof and does not approve a Decision.`
          : "I can compare those options once two comparable scenarios exist. That comparison would be a trade-off against evidence, not a Decision.";
    } else {
      presentedResponse = ncaPost4Comparison.response;
    }
  }
  const rawCollectionKind = semanticTurn.diagnostics.collectionKind?.toLowerCase() ?? null;
  const collectionKind =
    rawCollectionKind === "problem" || rawCollectionKind === "risk" ||
    rawCollectionKind === "opportunity" || rawCollectionKind === "scenario" ||
    rawCollectionKind === "decision" || rawCollectionKind === "execution" ||
    rawCollectionKind === "goal" ? rawCollectionKind : null;
  const presentationStage =
    collectionPresentationRequested
      ? (args.runtimeStateBeforeTurn ?? args.nextRuntimeState)
      : args.nextRuntimeState;
  const directorPlan = directNexoraPresentation({
    owner: semanticTurn.owner,
    presentationRequest:
      explicitSingularFocus
        ? "FOCUS"
        : collectionPresentationRequested
          ? "COLLECTION"
          : "NONE",
    primaryReference: semanticTurn.references.primary,
    references: semanticTurn.references.references,
    collectionKind,
    collectionScope: semanticTurn.diagnostics.collectionScope,
    collectionMembers: semanticTurn.canonicalCollectionMembers,
    currentStage: presentationStage,
  });
  let directorRuntimeState = args.lockPresentedResponse
    ? args.nextRuntimeState
    : (
    comparisonMeaning.active ||
    stageRelationship === "STAGE_META" ||
    stageRelationship === "STAGE_COMPATIBLE" ||
    isCollectionConfirmation(args.utterance)
  )
    ? (args.runtimeStateBeforeTurn ?? args.nextRuntimeState)
    : applyDirectorPlanToStage({
    plan: directorPlan,
    state: presentationStage,
    catalog: args.catalog,
  });
  const executiveSituation = composeExecutiveSituation({
    utterance: args.utterance,
    executiveContext: nextExecutiveContext,
    contextUpdate: executiveContextUpdate,
    turn: managerObjectTurn,
    conversation: ncaDialogue.state,
    nxa1: nxaResponseContract,
    managerAssertion:
      naturalLanguageUnderstanding.communicativeIntent === "OBSERVE" ||
      naturalLanguageUnderstanding.communicativeIntent === "SUPPLY_INFORMATION" ||
      isManagerSituationAssertion
        ? args.utterance
        : null,
    entranceSession: args.nextEntranceSession,
    collection:
      semanticTurn.owner === "COLLECTION_QUERY"
        ? {
            kind: semanticTurn.diagnostics.collectionKind ?? "subjects",
            memberIds: semanticTurn.canonicalCollectionMembers.map((item) => item.id),
          }
        : null,
  });
  const proactiveAdvisoryEvaluation = evaluateNxa4ProactiveAdvisory({
    situation: executiveSituation,
    attention: managerObjectTurn.attention,
    initiative: nca5Strategy,
    conversation: ncaDialogue.state,
    managerFocusImportance: args.conversationImportance,
    managerOverride: /^(?:no[,.]?\s+)?(?:not now|forget|show|open|focus|go to)\b/i.test(args.utterance.trim()),
  });
  const nxa5JudgmentType: Nxa5JudgmentType =
    ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().includes("risk") ? "RISK_PRIORITY" :
    ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().includes("opportun") ? "OPPORTUNITY_PRIORITY" :
    ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().includes("scenario") ||
    ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().includes("option") ? "SCENARIO" :
    ncaPost4Comparison?.criterion === "INVESTIGATION_PRIORITY" ? "INVESTIGATION_PRIORITY" : "ATTENTION";
  const nxa5Candidates: readonly Nxa5JudgmentCandidate[] = Object.freeze(
    (ncaPost4Comparison?.candidateSet.candidates ?? []).map((candidate) => {
      const context = collectManagerObjectContext(candidate.id, catalog);
      const state = `${context.currentState.value ?? ""} ${context.kpi.value?.status ?? ""}`.toLowerCase();
      const contextAnchorIds = new Set([
        args.previousExecutiveContext.currentSubject?.subjectId,
        ...args.previousExecutiveContext.previousSubjects.map((subject) => subject.subjectId),
        ...args.previousExecutiveContext.recentReferences.map((subject) => subject.subjectId),
      ].filter((id): id is string => Boolean(id) && !ncaPost4Comparison!.candidateSet.candidateIds.includes(id!)));
      const relatedToCurrentContext = Boolean(
        context.associatedGoal.value ||
        context.relationships.some((relationship) => relationship.otherId != null && contextAnchorIds.has(relationship.otherId)) ||
        executiveSituation.focus.relatedSubjects.some((label) => label.toLowerCase() === candidate.label.toLowerCase()),
      );
      const evidenceKnown = context.provenance.support === "KNOWN" || context.confidence.support === "KNOWN";
      const decisionRelevantRelationships = context.relationships.filter((relationship) =>
        /constraint|affect|block|depend/i.test(relationship.relationKind) && relationship.support === "KNOWN",
      ).length;
      return Object.freeze({
        id: candidate.id, label: candidate.label, kind: candidate.kind ?? "unknown",
        goalAlignment: executiveSituation.goal ? (relatedToCurrentContext ? "DIRECT" as const : "RELATED" as const) : "UNKNOWN" as const,
        materiality: /critical|blocked|off.track/.test(state) ? "CRITICAL" as const : /risk|attention|at.risk/.test(state) ? "HIGH" as const : "MODERATE" as const,
        urgency: /critical|blocked/.test(state) ? "HIGH" as const : "UNKNOWN" as const,
        riskExposure: candidate.kind?.toLowerCase().includes("risk") ? (/critical/.test(state) ? "CRITICAL" as const : "MODERATE" as const) : "UNKNOWN" as const,
        evidenceStrength: evidenceKnown ? "MODERATE" as const : "WEAK" as const,
        consequence: context.executiveMeaning.value,
        uncertainties: Object.freeze(context.confidence.value ? [] : [`Comparable impact evidence for ${candidate.label} remains incomplete.`]),
        constraints: Object.freeze([]), feasible: null,
        reversibility: nxa5JudgmentType === "INVESTIGATION_PRIORITY" ? "REVERSIBLE" as const : "UNKNOWN" as const,
        gains: Object.freeze(context.executiveMeaning.value ? [context.executiveMeaning.value] : []), sacrifices: Object.freeze([]),
        learningValue: nxa5JudgmentType === "INVESTIGATION_PRIORITY" ? (relatedToCurrentContext || decisionRelevantRelationships >= 2 ? "HIGH" as const : "MODERATE" as const) : "UNKNOWN" as const,
        managerPreference: Boolean(executiveSituation.conversation.latestManagerAssertion && executiveSituation.conversation.latestManagerAssertion.toLowerCase().includes(candidate.label.toLowerCase())),
        timeSensitive: /deadline|urgent|expir/.test(state), existingRecommendation: null,
      });
    }),
  );
  const executiveJudgment = ncaPost4Comparison && !comparisonClarification
    ? evaluateNxa5ExecutiveJudgment({ situation: executiveSituation, comparison: ncaPost4Comparison, attention: managerObjectTurn.attention, candidates: nxa5Candidates, judgmentType: nxa5JudgmentType })
    : null;
  const situationRecovery = composeSituationRecovery(executiveSituation, args.utterance);
  if (situationRecovery) presentedResponse = situationRecovery;
  const situationConflict = composeSituationConflict(executiveSituation);
  if (situationConflict) presentedResponse = situationConflict;
  if (
    executiveSituation.advisory.status === "INVALIDATED" &&
    nxaResponseContract.need === "ADVISE"
  ) {
    presentedResponse = "The new observation weakens the previous recommendation, so I would not repeat it. Reassess the remaining contributors and validate the strongest alternative before choosing an intervention.";
  }
  if (
    !args.lockPresentedResponse &&
    !dataLibraryOwnsResponse &&
    args.contextResult.context.resolutionStatus === "not-found" &&
    semanticTurn.owner === "BUSINESS" &&
    (args.intentResult.intent.kind === "explain-scenario" || /^explain\b/i.test(args.utterance))
  ) {
    const missing = args.intentResult.intent.targetHints.find((item) => item.role === "primary")?.raw;
    presentedResponse = missing
      ? `I couldn't find a clear match for “${missing}” in the current executive context.`
      : args.response;
  }
  const proactiveEventTurn =
    proactiveAdvisoryEvaluation.candidate?.source === "conversation-observation" ||
    Boolean(args.initiativeSignals?.some((signal) => signal.id === proactiveAdvisoryEvaluation.candidate?.id));
  if (
    proactiveEventTurn &&
    proactiveAdvisoryEvaluation.managerMessage &&
    !args.lockPresentedResponse &&
    clarificationTurn.action !== "clarify"
  ) {
    presentedResponse = proactiveAdvisoryEvaluation.managerMessage;
  }
  if (/\b(?:will you|can you|could you)\s+(?:keep\s+)?(?:watching|monitor|track)\b/i.test(args.utterance)) {
    presentedResponse = composeNxa4MonitoringBoundaryResponse(false);
  }
  const nxa5ChangeQuestion = /\bwhat would change (?:your|the) recommendation\b/i.test(args.utterance);
  const nxa5WhyQuestion = /^\s*why\??\s*$/i.test(args.utterance);
  const comparisonDomain = ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase() ?? "";
  const collectionJudgmentRequest =
    comparisonMeaning.mode === "PRIORITIZE" ||
    comparisonMeaning.mode === "RANK" ||
    comparisonMeaning.mode === "CHOOSE" ||
    comparisonMeaning.mode === "IMPACT";
  const nxa5JudgmentRequest = nxa5ChangeQuestion || nxa5WhyQuestion || collectionJudgmentRequest;
  if (ncaPost4Comparison && comparisonMeaning.active && (comparisonDomain !== "scenario" || !comparisonMeaning.criterionAmbiguous) && nxa5JudgmentRequest && executiveJudgment && !args.lockPresentedResponse && clarificationTurn.action !== "clarify") {
    presentedResponse = nxa5ChangeQuestion && executiveJudgment.changeConditions.length
      ? `I would change the recommendation if ${executiveJudgment.changeConditions.map((condition) => condition.replace(/[.]$/, "").toLowerCase()).join(" or ")}.`
      : executiveJudgment.managerMessage;
  }
  if (comparisonClarification && nca4Strategy.move !== "CHALLENGE" && !args.lockPresentedResponse) {
    presentedResponse = comparisonClarification.question;
  }
  const priorConsent = args.previousManagerObjectSession?.ncaConversationState?.pendingPresentationConsent ?? null;
  const consentReply = priorConsent ? isPresentationConsentReply(args.utterance) : null;
  let nextPresentationConsent: PendingPresentationConsent | null = priorConsent;
  if (consentReply === "yes" && priorConsent && !args.lockPresentedResponse) {
    const consentPlan = directNexoraPresentation({
      owner: "BUSINESS",
      presentationRequest: "FOCUS",
      primaryReference: Object.freeze({
        id: priorConsent.targetId,
        name: priorConsent.targetLabel,
        kind: priorConsent.targetKind,
      }),
      references: Object.freeze([
        Object.freeze({
          id: priorConsent.targetId,
          name: priorConsent.targetLabel,
          kind: priorConsent.targetKind,
        }),
      ]),
      collectionKind: null,
      collectionScope: null,
      collectionMembers: Object.freeze([]),
      currentStage: args.runtimeStateBeforeTurn ?? args.nextRuntimeState,
    });
    directorRuntimeState = applyDirectorPlanToStage({
      plan: consentPlan,
      state: args.runtimeStateBeforeTurn ?? args.nextRuntimeState,
      catalog: args.catalog,
    });
    presentedResponse = `Focused on ${priorConsent.targetLabel}.`;
    nextPresentationConsent = null;
  } else if (consentReply === "no" && priorConsent) {
    presentedResponse = "I'll keep the current Stage.";
    nextPresentationConsent = null;
  } else if (
    isStageVisibilityCorrection(args.utterance, incomingStage.visibleMembers) &&
    !args.lockPresentedResponse
  ) {
    presentedResponse = composeStageVisibilityCorrectionReply({
      utterance: args.utterance,
      stage: incomingStage,
      previousResponse: presentedResponse,
    });
    nextPresentationConsent = null;
  } else if (
    (stageRelationship === "STAGE_META" ||
      isStageFocusQuestion(args.utterance) ||
      isStageMembershipQuestion(args.utterance) ||
      isVisibilityImportanceQuestion(args.utterance) ||
      isVisibilityCausalityQuestion(args.utterance) ||
      isLayoutProximityRelationshipQuestion(args.utterance)) &&
    !args.lockPresentedResponse &&
    incomingStage.available
  ) {
    if (isVisibilityImportanceQuestion(args.utterance)) {
      presentedResponse =
        "Not by itself. Being visible tells us it is part of the current Stage presentation; importance depends on the underlying evidence and executive context.";
    } else if (isVisibilityCausalityQuestion(args.utterance)) {
      presentedResponse =
        "Visibility on Stage does not by itself establish causality. That requires evidence from the existing business authorities.";
    } else if (isLayoutProximityRelationshipQuestion(args.utterance)) {
      presentedResponse =
        "No. Appearing next to each other on Stage does not by itself mean they are related.";
    } else {
      const membership = /\bwhy\b/.test(args.utterance.toLowerCase())
        ? composePresentationReasonReply(incomingStage)
        : incomingStage.collection && !isStageMembershipQuestion(args.utterance) && !isStageFocusQuestion(args.utterance)
          ? composeStageSceneExplanation(incomingStage)
          : composeWorkspaceReply({
              labels: incomingStage.visibleMembers.map((item) => item.label),
              focused: incomingStage.focus?.label ?? null,
              snapshot: incomingStage.snapshot,
              utterance: args.utterance,
            });
      presentedResponse =
        /\bexplain the (?:stage|scene)\b/i.test(args.utterance)
          ? `${composeProductKnowledgeReply(args.utterance)} ${membership}`.trim()
          : membership;
    }
    nextPresentationConsent = null;
  } else if (
    resolveStageOrdinalActor(args.utterance, incomingStage.visibleMembers) &&
    /\bexplain\b/i.test(args.utterance) &&
    !args.lockPresentedResponse
  ) {
    const actor = resolveStageOrdinalActor(args.utterance, incomingStage.visibleMembers);
    presentedResponse = actor
      ? `${actor.label} is currently visible on Stage.`
      : presentedResponse;
    nextPresentationConsent = null;
  } else if (isCollectionConfirmation(args.utterance) && incomingStage.collection) {
    presentedResponse = composeCollectionConfirmationReply(incomingStage) ?? presentedResponse;
  } else if (isObservationRecallUtterance(args.utterance) && !args.lockPresentedResponse) {
    presentedResponse = composeObservationRecallReply({
      observations: managerObjectTurn.session.managerObservations ?? [],
    });
    nextPresentationConsent = null;
  } else if (
    isManagerCausalAssertion(args.utterance) &&
    !isConsequenceIntentUtterance(args.utterance) &&
    !args.lockPresentedResponse &&
    !trustedCommunication.challengePresent
  ) {
    presentedResponse = composeCausalAssertionReply({
      cause: contextualManagerMeaning.objectReference?.canonicalName ??
        naturalLanguageUnderstanding.objectReference?.canonicalName ??
        null,
      effect: naturalLanguageUnderstanding.ambiguity.candidates[1]?.canonicalName ?? null,
    });
    nextPresentationConsent = null;
  } else if (
    isCompleteManagerBusinessObservation(args.utterance) &&
    !args.lockPresentedResponse &&
    (!nca4Strategy.shouldAdvise ||
      Boolean(args.scenarioResult) ||
      /\bwithout intervention\b/i.test(presentedResponse))
  ) {
    const observation = interpretManagerProvidedObservation({
      utterance: args.utterance,
      subjectName:
        naturalLanguageUnderstanding.objectReference?.canonicalName ??
        contextualManagerMeaning.objectReference?.canonicalName ??
        null,
    });
    const baseReply = observation
      ? composeManagerObservationReply(observation)
      : presentedResponse;
    presentedResponse = composeStaleContextIsolatedObservationReply({
      baseReply,
      explicitSubject:
        observation?.subject ??
        naturalLanguageUnderstanding.objectReference?.canonicalName ??
        null,
      stageFocus: incomingStage.focus?.label ?? null,
    });
    nextPresentationConsent = null;
  } else if (
    stageRelationship === "STAGE_COMPATIBLE" &&
    incomingStage.presentationType === "COLLECTION" &&
    args.contextResult.context.primarySubject &&
    !incomingStage.visibleMembers.some((member) => member.id === args.contextResult.context.primarySubject?.subjectId) &&
    /^(?:what|why|explain)\b/i.test(args.utterance.trim())
  ) {
    const label = args.contextResult.context.primarySubject.canonicalName;
    if (!/bring .+ onto the Stage/i.test(presentedResponse)) {
      presentedResponse = `${presentedResponse} ${composeKnowledgeConsentOffer(label)}`.trim();
    }
    nextPresentationConsent = Object.freeze({
      targetId: args.contextResult.context.primarySubject.subjectId,
      targetLabel: label,
      targetKind: args.contextResult.context.primarySubject.subjectKind,
      question: composeKnowledgeConsentOffer(label),
    });
  }
  const nca7Turn = composeNca7TurnResult({
    utterance: args.utterance,
    response: presentedResponse,
    nca: ncaTurn,
    conversation: ncaDialogue.state,
    nca3: nca3Strategy,
    nca4: nca4Strategy,
    nca5: nca5Strategy,
    nca6: nca6Strategy,
    locked: Boolean(args.lockPresentedResponse),
    entranceOwned: Boolean(args.nextEntranceSession),
    clarificationOwns: clarificationTurn.action === "clarify",
    decisionConfirmation: decisionCommitmentResult?.status === "confirmation-required",
    executionConfirmation: args.status === "confirmation-required",
    commitsDecision:
      decisionCommitmentResult?.status === "applied" ||
      decisionCommitmentResult?.status === "already-committed",
    startsExecution: false,
    writesBusinessTruth: Boolean(managerObjectTurn.navigation.goal.persisted),
  });
  const baseNextNcaState = attachCommunicationSnapshot(
    attachInitiativeSnapshot(
      attachAdvisorySnapshot(
        applyNexoraDialogueEffects({
          state: ncaDialogue.state,
          nca: ncaTurn,
          response: presentedResponse,
          locked: Boolean(args.lockPresentedResponse),
          followUpQuestion:
            comparisonClarification ??
            (/\?/.test(presentedResponse) ? continuity.followUp : null),
        }),
        nca4Strategy,
      ),
      nca5Strategy,
      args.utterance,
    ),
    nca6Strategy,
  );
  const collectionMembers = semanticTurn.canonicalCollectionMembers;
  const collectionOrdinal = collectionOrdinalIndex(args.utterance);
  const ordinalCollectionMember =
    semanticTurn.owner === "COLLECTION_QUERY" &&
    collectionOrdinal != null &&
    collectionMembers.length > 0
      ? collectionMembers[
          collectionOrdinal < 0 ? collectionMembers.length - 1 : collectionOrdinal
        ] ?? null
      : null;
  const handedOffSubject = explicitSingularFocus
    ? args.contextResult.context.primarySubject ??
      contextualManagerMeaning.objectReference ??
      null
    : null;
  const nextNcaState = freezeNcaConversationState({
    ...baseNextNcaState,
    lastCollection:
      semanticTurn.owner === "COLLECTION_QUERY"
        ? Object.freeze({
            kind: semanticTurn.diagnostics.collectionKind ?? "UNKNOWN",
            items: Object.freeze(collectionMembers.map((item) => item.label)),
            memberIds: Object.freeze(collectionMembers.map((item) => item.id)),
            establishedAtTurn: baseNextNcaState.turnIndex,
            scope: semanticTurn.diagnostics.collectionScope,
            source: "NCA-POST:3_CANONICAL_COLLECTION",
          })
        : baseNextNcaState.lastCollection,
    activeSubject: ordinalCollectionMember
      ? Object.freeze({
          id: ordinalCollectionMember.id,
          name: ordinalCollectionMember.label,
          kind: (semanticTurn.diagnostics.collectionKind ?? "PROBLEM")
            .toLowerCase()
            .replace(/s$/, ""),
        })
      : handedOffSubject
        ? Object.freeze({
            id: handedOffSubject.subjectId,
            name: handedOffSubject.canonicalName,
            kind: handedOffSubject.subjectKind,
          })
      : baseNextNcaState.activeSubject,
    activeComparison: singleSubjectInvestigationTurn
      ? null
      : ncaPost4Comparison && ncaPost4Comparison.candidateSet.candidateIds.length >= 2
      ? Object.freeze({
          candidateIds: ncaPost4Comparison.candidateSet.candidateIds,
          candidateKind: ncaPost4Comparison.candidateSet.collectionKind,
          mode: ncaPost4Comparison.mode,
          criterion: ncaPost4Comparison.criterion,
          establishedAtTurn: baseNextNcaState.turnIndex,
          sourceCollectionTurn: ncaPost4Comparison.candidateSet.resolvedFromTurn,
        })
      : isCollectionConfirmation(args.utterance)
        ? previousNcaState?.activeComparison ?? null
        : baseNextNcaState.activeComparison ?? null,
    lastAuthorizedPresentation:
      directorRuntimeState !== (args.runtimeStateBeforeTurn ?? args.nextRuntimeState)
        ? Object.freeze({
            intent: directorPlan.intent,
            reason: directorPlan.reason,
            collectionKind: directorRuntimeState.collectionContext?.category ?? null,
            focusId: directorRuntimeState.focusedSubject?.id ?? null,
            memberIds: Object.freeze([...(directorRuntimeState.collectionContext?.objectIds ?? [])]),
          })
        : previousNcaState?.lastAuthorizedPresentation ?? null,
    pendingPresentationConsent: nextPresentationConsent,
    pendingQuestion:
      isCollectionConfirmation(args.utterance) &&
      previousNcaState?.pendingQuestion?.expectedInformation === "PRIORITY"
        ? previousNcaState.pendingQuestion
        : baseNextNcaState.pendingQuestion,
  });
  const nxaAdvisorContract = resolveNxaAdvisorTurnContract({
    meaning: naturalLanguageUnderstanding,
    nca: ncaTurn,
    dialogue: nextNcaState,
  });
  const nxaGuidanceContract = resolveNxaConversationGuidance({
    utterance: args.utterance,
    status: args.status,
    nxa1: nxaAdvisorContract,
    nca3ShouldAsk: nca3Strategy.shouldAsk,
    nca3GapId: nca3Strategy.gap?.id ?? null,
    nca4ShouldAdvise: nca4Strategy.shouldAdvise,
    nca4Move: nca4Strategy.move,
    previousRecommendation: previousNcaState?.lastRecommendation ?? null,
    currentRecommendation: ncaDialogue.state.lastRecommendation ?? null,
    explicitManagerOverride: /^(?:no[,.]?\s+)?(?:show|open|focus|go to)\b/i.test(args.utterance.trim()),
  });
  managerObjectTurn = Object.freeze({
    ...managerObjectTurn,
    session: freezeManagerObjectSession({
      ...managerObjectTurn.session,
      ncaConversationState: nextNcaState,
    }),
  });
  const nexoraMessage = freezeMessage({
    id: args.ids.nexoraId,
    role: "nexora",
    text: presentedResponse,
    status: args.status,
    commandId: args.commandResult?.command?.commandId,
    ...(args.suggestedActions && args.suggestedActions.length > 0
      ? { suggestedActions: args.suggestedActions }
      : {}),
  });

  const trace: NexoraConversationalExperienceTrace = Object.freeze({
    utterance: args.utterance,
    intentKind: args.intentResult.intent.kind,
    contextStatus: args.contextResult.context.resolutionStatus,
    primarySubjectId:
      args.contextResult.context.primarySubject?.subjectId ?? null,
    experienceDecision: args.experienceResult?.decision ?? null,
    experienceId:
      args.experienceResult?.targetExperienceContext.experienceId ?? null,
    commandKind: args.commandResult?.command?.kind ?? null,
    runtimeStatus: args.runtimeResult?.status ?? null,
    experienceStatus: args.status,
    responseText: presentedResponse,
    executiveContextTurnIndex: nextExecutiveContext.turnIndex,
    executiveCurrentSubjectId:
      nextExecutiveContext.currentSubject?.subjectId ?? null,
    pendingTurnExpectationKind:
      derivedPendingTurnExpectation?.questionKind ?? null,
    pendingTurnResolutionStatus: args.pendingTurnResolution?.status ?? null,
    managerObjectId: managerObjectTurn.activeObjectId,
    managerObjectIntent: managerObjectTurn.intent,
    explainEngineId: managerObjectTurn.explanation.engineId,
    explanationSummary: managerObjectTurn.explanation.summary,
    explanationEpistemic: managerObjectTurn.explanation.epistemicStatus,
    explanationDepth: managerObjectTurn.explanation.depth,
    explanationFocus: managerObjectTurn.explanation.focus,
    explanationHandoffRecommendation:
      managerObjectTurn.explanation.handoffRecommendation,
    explorationEngineId: managerObjectTurn.exploration.engineId,
    explorationState: managerObjectTurn.exploration.explorationState,
    recommendedPathId:
      managerObjectTurn.exploration.recommendedPaths[0]?.pathId ?? null,
    recommendedPathLabel:
      managerObjectTurn.exploration.recommendedPaths[0]?.label ?? null,
    recommendedPathKind:
      managerObjectTurn.exploration.recommendedPaths[0]?.kind ?? null,
    recommendedPathTarget:
      managerObjectTurn.exploration.recommendedPaths[0]?.targetObjectId ?? null,
    navigationEngineId: managerObjectTurn.navigation.engineId,
    goalSource: managerObjectTurn.navigation.goal.source,
    goalTitle: managerObjectTurn.navigation.goal.title,
    goalEpistemic: managerObjectTurn.navigation.goal.epistemicStatus,
    goalConfirmed: managerObjectTurn.navigation.goal.managerConfirmed,
    goalPersisted: managerObjectTurn.navigation.goal.persisted,
    goalProgress: managerObjectTurn.navigation.progressState,
    navigationDirection: managerObjectTurn.navigation.recommendedDirection,
    navigationPathId:
      managerObjectTurn.navigation.recommendedPath?.path.pathId ?? null,
    navigationPathTarget:
      managerObjectTurn.navigation.recommendedPath?.path.targetObjectId ?? null,
    journeyEngineId: managerObjectTurn.journey.engineId,
    journeyPhase: managerObjectTurn.journey.currentPhase,
    journeyState: managerObjectTurn.journey.journeyState,
    journeyHealth: managerObjectTurn.journey.health,
    journeyBlocker: managerObjectTurn.journey.blocker?.kind ?? null,
    journeyMilestone: managerObjectTurn.journey.nextMilestone,
    attentionEngineId: managerObjectTurn.attention.engineId,
    attentionState: managerObjectTurn.attention.attentionState,
    attentionPrimary: managerObjectTurn.attention.primaryAttention?.label ?? null,
    attentionIntervention: managerObjectTurn.attention.interventionAssessment.need,
    attentionDoNotDisturb: managerObjectTurn.attention.doNotDisturb,
    attentionStealsFocus: false,
    experienceIntegrationId: managerExperience.integrationId,
    experienceLane: managerExperience.lane,
    experienceCompactContext: managerExperience.compactContext,
    experienceNextStep: managerExperience.recommendedNextStep,
    nluCommunicativeIntent: naturalLanguageUnderstanding.communicativeIntent,
    nluRequestedOperation: naturalLanguageUnderstanding.requestedOperation,
    nluSubject:
      naturalLanguageUnderstanding.objectReference?.canonicalName ?? null,
    nluQuestionType: naturalLanguageUnderstanding.questionType,
    nluConfidence: naturalLanguageUnderstanding.confidence,
    nluAmbiguity: naturalLanguageUnderstanding.ambiguity.unresolved,
    nluAuthority: naturalLanguageUnderstanding.selectedAuthority,
    continuityProvenance: contextualManagerMeaning.provenance,
    continuityMove: contextualManagerMeaning.continuityMove,
    continuitySubject:
      contextualManagerMeaning.objectReference?.canonicalName ?? null,
    continuityConfidence: contextualManagerMeaning.confidence,
    continuityAmbiguity: contextualManagerMeaning.ambiguity.unresolved,
    continuityActiveSubject: conversationContinuity.activeSubjectId,
    continuityInvestigation: conversationContinuity.activeInvestigationId,
    continuityPreviousSubject: conversationContinuity.activeSubjectId
      ? conversationContinuity.previousSubjectId
      : conversationContinuity.previousSubjectId,
    clarificationRequired:
      clarificationTurn.action === "clarify" ||
      clarificationTurn.action === "unpark" ||
      clarificationTurn.action === "fail",
    clarificationAction: clarificationTurn.action,
    clarificationReason: clarificationTurn.reason,
    clarificationQuestion: clarificationTurn.question,
    clarificationCandidates: clarificationTurn.pending?.candidates.length ?? 0,
    clarificationConsequence: clarificationTurn.consequence,
    correctionDetected: clarificationTurn.correctionDetected,
    correctionScope: clarificationTurn.correctionScope,
    correctionBefore: clarificationTurn.correctionBeforeId,
    correctionAfter: clarificationTurn.correctionAfterId,
    resumedOperation: clarificationTurn.resumeOperation,
    communicationDepth: trustedCommunication.depth,
    communicationClaimCount: trustedCommunication.claims.length,
    communicationFactCount: trustedCommunication.claims.filter((item) => item.kind === "FACT").length,
    communicationHypothesisCount: trustedCommunication.claims.filter((item) => item.kind === "HYPOTHESIS").length,
    communicationUnknownCount: trustedCommunication.claims.filter((item) => item.kind === "UNKNOWN").length,
    communicationRecommendation: trustedCommunication.recommendationPresent,
    communicationChallenge: trustedCommunication.challengePresent,
    communicationUncertaintyPreserved: trustedCommunication.uncertaintyPreserved,
    communicationCausalValidated: trustedCommunication.causalClaimValidated,
    communicationDecisionWording: trustedCommunication.decisionStateWording,
    communicationExecutionWording: trustedCommunication.executionStateWording,
    guidanceIntent: guidanceTurn.intent,
    guidanceAction: guidanceTurn.action,
    guidanceCapability: guidanceTurn.capabilityId,
    guidanceAvailability: guidanceTurn.availability,
    guidancePrerequisite: guidanceTurn.prerequisite,
    guidanceSelected: guidanceTurn.selectedGuidance,
    guidanceReason: guidanceTurn.guidanceReason,
    guidanceProactiveEligible: guidanceTurn.proactiveEligible,
    guidanceProactiveSuppressed: guidanceTurn.proactiveSuppressed,
    guidanceAuthority: guidanceTurn.authoritySource,
    ncaNeed: ncaTurn.need.family,
    ncaBehavior: ncaTurn.advisorBehavior,
    ncaSufficient: ncaTurn.knowledgeState.sufficient,
    ncaCapability: ncaTurn.strategy.capability,
    ncaQuestion: ncaTurn.strategy.question ?? nextNcaState.pendingQuestion?.question ?? null,
    nca2Move: nextNcaState.dialogueMove,
    nca2Topic: nextNcaState.activeTopic?.label ?? null,
    nca2Subject: nextNcaState.activeSubject?.name ?? null,
    nca2Pending: nextNcaState.pendingQuestion?.question ?? null,
    nca2ThreadState:
      nextNcaState.threads.find((thread) => thread.id === nextNcaState.currentThreadId)
        ?.state ?? null,
    nca3Mode: nca3Strategy.mode,
    nca3ShouldAsk: nca3Strategy.shouldAsk,
    nca3Sufficiency: nca3Strategy.sufficiency,
    nca3Gap: nca3Strategy.gap?.id ?? null,
    nca4Move: nca4Strategy.move,
    nca4Status: nca4Strategy.position.status,
    nca4Option: nca4Strategy.position.recommendation.optionLabel,
    nca4Strength: nca4Strategy.position.recommendation.strength,
    nca4Confidence: nca4Strategy.position.confidence.level,
    nca4Advise: nca4Strategy.shouldAdvise,
    nca5Initiate: nca5Strategy.shouldInitiate,
    nca5Behavior: nca5Strategy.decision.behavior,
    nca5Priority: nca5Strategy.decision.priority,
    nca5Interrupt: nca5Strategy.decision.interruption.justified,
    nca5Subject: nca5Strategy.decision.signal?.subjectLabel ?? null,
    nca6Depth: nca6Strategy.strategy.depth,
    nca6Framing: nca6Strategy.strategy.framing,
    nca6Structure: nca6Strategy.strategy.structure,
    nca6Familiarity: nca6Strategy.snapshot.familiarity,
    nca6Role: nca6Strategy.snapshot.role,
    nca7Owner: nca7Turn.authority.owner,
    nca7Rank: nca7Turn.authority.rank,
    nca7Ask: nca7Turn.sufficiency.shouldAsk,
    nca7Advise: nca7Turn.advisory.shouldAdvise,
    nca7Initiate: nca7Turn.initiative.shouldInitiate,
    nxaIdentity: nxaAdvisorContract.identity,
    nxaRole: nxaAdvisorContract.role,
    nxaNeed: nxaAdvisorContract.need,
    nxaReferent: nxaAdvisorContract.referentName,
    compositionResolvedSubjectId:
      args.subjectCompositionFidelity?.resolvedSubject.id ?? null,
    compositionResolvedSubjectKind:
      args.subjectCompositionFidelity?.resolvedSubject.kind ?? null,
    compositionCandidateSubjectId:
      args.subjectCompositionFidelity?.candidateSubject.id ?? null,
    compositionCandidateSubjectKind:
      args.subjectCompositionFidelity?.candidateSubject.kind ?? null,
    compositionSelectedSubjectId:
      args.subjectCompositionFidelity?.selectedSubject.id ?? null,
    compositionSelectedSubjectKind:
      args.subjectCompositionFidelity?.selectedSubject.kind ?? null,
    compositionFidelityCompatible:
      args.subjectCompositionFidelity?.compatible ?? null,
    compositionStaleScenarioBlocked:
      args.subjectCompositionFidelity?.blockedStaleScenarioAssessment ?? null,
    nxaReferentSource: nxaAdvisorContract.referentSource,
    nxaNavigationAllowed: nxaAdvisorContract.navigationAllowed,
    nxaEvidenceRequired: nxaAdvisorContract.evidenceRequired,
    nxa2Identity: nxaGuidanceContract.identity,
    nxa2Behavior: nxaGuidanceContract.behavior,
    nxa2Valuable: nxaGuidanceContract.interventionValuable,
    nxa2QuestionGap: nxaGuidanceContract.questionGap,
    nxa2RepetitionBlocked: nxaGuidanceContract.repeatsPriorRecommendation,
    nxa3Identity: executiveSituation.identity,
    nxa3Goal: executiveSituation.goal?.title ?? null,
    nxa3Focus: executiveSituation.focus.label,
    nxa3CausalStatus: executiveSituation.investigation.causalStatus,
    nxa3RecommendationStatus: executiveSituation.advisory.status,
    nxa3DecisionState: executiveSituation.decision.state,
    nxa3ExecutionState: executiveSituation.execution.state,
    nxa3OutcomeState: executiveSituation.outcome.state,
    nxa3ChangeKind: executiveSituation.change.kind,
    nxa3ConflictCount: executiveSituation.conflicts.length,
    nxa4Identity: proactiveAdvisoryEvaluation.identity,
    nxa4Disposition: proactiveAdvisoryEvaluation.disposition,
    nxa4Intensity: proactiveAdvisoryEvaluation.intensity,
    nxa4Materiality: proactiveAdvisoryEvaluation.materiality,
    nxa4Evidence: proactiveAdvisoryEvaluation.evidenceStrength,
    nxa4Novelty: proactiveAdvisoryEvaluation.novelty,
    nxa5Identity: executiveJudgment?.identity ?? null,
    nxa5JudgmentType: executiveJudgment?.judgmentType ?? null,
    nxa5Preferred: executiveJudgment?.preferredCandidateId ?? null,
    nxa5RecommendationType: executiveJudgment?.recommendationType ?? null,
    nxa5Strength: executiveJudgment?.recommendationStrength ?? null,
    nxa5Readiness: executiveJudgment?.decisionReadiness ?? null,
  });

  if (
    /^compare them\b/i.test(args.utterance.trim()) &&
    /^Done(?: —.*)?\.?$/i.test(presentedResponse.trim())
  ) {
    const options = previousNcaState?.lastOfferedOptions ?? [];
    presentedResponse =
      options.length >= 2
        ? `Comparison of the offered options (${options.join(", ")}) is a trade-off against available evidence; it does not rank them without comparable proof and does not approve a Decision.`
        : "I can compare those options once two comparable scenarios exist. That comparison would be a trade-off against evidence, not a Decision.";
  }

  const entranceOwnsCurrentUtterance =
    shouldNexoraExecutionPlanningOwnUtterance(args.nextEntranceSession, args.utterance) ||
    shouldNexoraOutcomeMonitoringOwnUtterance(args.nextEntranceSession, args.utterance) ||
    shouldNexoraLearningReassessmentOwnUtterance(args.nextEntranceSession, args.utterance) ||
    shouldNexoraObjectEducationOwnUtterance(args.nextEntranceSession, args.utterance) ||
    shouldNexoraTrustReviewOwnUtterance(args.nextEntranceSession, args.utterance);
  const skipTheatreCopy = entranceOwnsCurrentUtterance;
  const outcomeCollectionQuery =
    /^(?:show(?: me)?(?: all)? outcomes|how many outcomes(?: do we have)?)\??$/i.test(
      args.utterance.trim(),
    );
  const learningCollectionQuery =
    /^(?:show(?: me)?(?: all)? learnings|what have we learned\??|show previous learnings)\??$/i.test(
      args.utterance.trim(),
    );
  const liveExecutions = args.executionRuntime?.listExecutions() ?? [];
  const relatedLiveExecution =
    liveExecutions.find(
      (item) =>
        item.status === "in-progress" ||
        item.status === "blocked" ||
        item.status === "at-risk" ||
        item.status === "completed",
    ) ?? null;
  const parsedOutcomeUtterance = parseDeliveryOutcomeUtterance(args.utterance);
  if (
    !skipTheatreCopy &&
    !outcomeCollectionQuery &&
    !learningCollectionQuery &&
    relatedLiveExecution &&
    parsedOutcomeUtterance
  ) {
    const provenance = [
      "manager-reported-observation",
      parsedOutcomeUtterance.baseline != null ? `baseline:${parsedOutcomeUtterance.baseline}` : null,
      "target:96",
    ].filter((item): item is string => item != null);
    captureOutcomeObservation({
      observation: {
        subjectId: relatedLiveExecution.decisionId,
        metricId: `delivery-pct:${parsedOutcomeUtterance.observed}:${parsedOutcomeUtterance.baseline ?? "none"}`,
        dimension: "Delivery",
        unit: "%",
        value: parsedOutcomeUtterance.observed,
        qualitativeState: `${parsedOutcomeUtterance.observed}%`,
        observedAt: null,
        capturedAt: null,
        sourceId: "manager-reported",
        datasetId: "conversation",
        evidenceRefs: Object.freeze([]),
        provenanceRefs: Object.freeze(provenance),
        validationState: "partial",
        freshnessState: "unknown",
        decisionId: relatedLiveExecution.decisionId,
        executionId: relatedLiveExecution.executionId,
      },
    });
  }

  const decisionTheatreProjectionInput = Object.freeze({
    stageState: directorRuntimeState,
    catalog: args.catalog,
    directorPlan,
    investigationLevel: investigationAsk ? ("understand" as const) : ("glance" as const),
    comparisonLevel: comparisonMeaning.active ? ("compare" as const) : ("choice" as const),
    ncaActiveComparison: nextNcaState.activeComparison
      ? Object.freeze({
          candidateIds: nextNcaState.activeComparison.candidateIds,
          candidateKind: nextNcaState.activeComparison.candidateKind,
          criterion: nextNcaState.activeComparison.criterion,
        })
      : null,
    comparisonAuthority: ncaPost4Comparison
      ? Object.freeze({
          preferredCandidateId: ncaPost4Comparison.preferredCandidateId,
          statement: ncaPost4Comparison.response,
          source: "NCA-POST:4",
          evidenceState: ncaPost4Comparison.evidenceState,
        })
      : null,
    decisionReviewOpen:
      args.theatreDecisionReviewOpen === true ||
      Boolean(args.nextDecisionSession?.pendingConfirmation) ||
      decisionCommitmentResult?.status === "confirmation-required",
    proposedCandidateId:
      args.theatreProposedCandidateId ??
      args.nextRuntimeState.focusedSubject?.id ??
      managerObjectTurn.activeObjectId ??
      null,
    authoritativeDecisions: Object.freeze(
      (args.decisionRuntime?.listDecisions() ?? [])
        .filter((item) => item.status === "Approved")
        .map((item) =>
          Object.freeze({
            decisionId: item.decisionId,
            title: item.title,
            status: item.status,
            scenarioId: item.scenarioId ?? null,
            committedBy: item.committedBy ?? null,
          }),
        ),
    ),
    executionStarted: (args.executionRuntime?.listExecutions() ?? []).some(
      (item) =>
        item.status === "in-progress" ||
        item.status === "blocked" ||
        item.status === "at-risk" ||
        item.status === "completed",
    ),
    authoritativeExecutions: Object.freeze(
      (args.executionRuntime?.listExecutions() ?? []).map((item) =>
        Object.freeze({
          executionId: item.executionId,
          decisionId: item.decisionId,
          title: item.title,
          status: item.status,
          ownerIds: item.ownerIds,
          blockers: item.blockers,
          risks: item.risks,
          milestones: item.milestones,
          progress: item.progress,
        }),
      ),
    ),
    executionRuntimeAvailable: Boolean(args.executionRuntime),
    authoritativeOutcomeObservations: mapCapturedObservationsForTheatre({
      captured: listCapturedObservations(),
      executions: liveExecutions,
    }),
    pendingDecisionConfirmation: Boolean(args.nextDecisionSession?.pendingConfirmation) || decisionCommitmentResult?.status === "confirmation-required",
    executiveContext: nextExecutiveContext,
    managerQuestion: args.utterance,
    managerInteractionRef: args.ids.managerId,
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      managerQuestionRef: args.ids.managerId,
      canonicalSemanticResultRef: [
        naturalLanguageUnderstanding.identity,
        naturalLanguageUnderstanding.requestedOperation,
        naturalLanguageUnderstanding.communicativeIntent,
        semanticTurn.owner,
        semanticTurn.scope,
      ].join(":"),
      activeExecutiveContextRef: nextExecutiveContext.currentSubject?.subjectId ?? directorRuntimeState.focusedSubject?.id ?? null,
      conversationIntentKind: args.intentResult.intent.kind,
      canonicalOperation: naturalLanguageUnderstanding.requestedOperation,
      communicativeIntent: naturalLanguageUnderstanding.communicativeIntent,
      questionType: naturalLanguageUnderstanding.questionType,
      semanticScope: semanticTurn.scope,
      primaryResponseOwner: semanticTurn.owner,
      journeyState: managerObjectTurn.journey.journeyState,
      journeyPhase: managerObjectTurn.journey.currentPhase,
      namedSubject: semanticTurn.references.primary
        ? Object.freeze({
            id: semanticTurn.references.primary.id,
            kind: semanticTurn.references.primary.kind,
            label: semanticTurn.references.primary.name,
            authority: "catalog" as const,
          })
        : naturalLanguageUnderstanding.objectReference?.subjectId
          ? Object.freeze({
              id: naturalLanguageUnderstanding.objectReference.subjectId,
              kind: naturalLanguageUnderstanding.objectReference.subjectKind,
              label: naturalLanguageUnderstanding.objectReference.canonicalName,
              authority: "catalog" as const,
            })
          : null,
      focalExecutiveObject: directorRuntimeState.focusedSubject
        ? Object.freeze({
            id: directorRuntimeState.focusedSubject.id,
            kind: directorRuntimeState.focusedSubject.kind,
            label: directorRuntimeState.focusedSubject.label,
            authority: "catalog" as const,
          })
        : null,
      activeCollection: directorRuntimeState.collectionContext
        ? Object.freeze({
            kind: String(directorRuntimeState.collectionContext.category),
            memberIds: Object.freeze(directorRuntimeState.collectionContext.objectIds.slice()),
          })
        : semanticTurn.canonicalCollectionMembers.length > 0
          ? Object.freeze({
              kind: String(semanticTurn.diagnostics.collectionKind ?? "collection").toLowerCase(),
              memberIds: Object.freeze(semanticTurn.canonicalCollectionMembers.map((item) => item.id)),
            })
          : null,
      requestedCollection:
        semanticTurn.owner === "COLLECTION_QUERY" && semanticTurn.canonicalCollectionMembers.length > 0
          ? Object.freeze({
              kind: String(semanticTurn.diagnostics.collectionKind ?? "collection").toLowerCase(),
              memberIds: Object.freeze(semanticTurn.canonicalCollectionMembers.map((item) => item.id)),
            })
          : null,
      comparison: Object.freeze({
        active: comparisonMeaning.active,
        memberIds: Object.freeze(comparisonCandidateSet.candidateIds.slice()),
        criterion: comparisonMeaning.criterion,
        criterionAmbiguous: comparisonMeaning.criterionAmbiguous,
        criterionResolution: isExecutiveComparisonCriterionAnswer(args.utterance)
          ? comparisonMeaning.criterion
          : null,
      }),
      deixis: Object.freeze({
        pronoun: comparisonMeaning.active && comparisonCandidateSet.candidateIds.length >= 2
          ? ("them" as const)
          : naturalLanguageUnderstanding.objectReference?.subjectId && semanticTurn.references.primary == null
            ? ("it" as const)
            : ("none" as const),
        resolvedIds: Object.freeze(
          comparisonMeaning.active && comparisonCandidateSet.candidateIds.length >= 2
            ? comparisonCandidateSet.candidateIds.slice()
            : naturalLanguageUnderstanding.objectReference?.subjectId
              ? [naturalLanguageUnderstanding.objectReference.subjectId]
              : directorRuntimeState.focusedSubject
                ? [directorRuntimeState.focusedSubject.id]
                : [],
        ),
      }),
      pendingClarification: Object.freeze({
        present: clarificationTurn.action === "clarify" || Boolean(clarificationTurn.pending),
        reason: clarificationTurn.reason,
        awaiting: clarificationTurn.question,
      }),
      explicitCorrection: naturalLanguageUnderstanding.communicativeIntent === "CORRECT",
      explicitNamedEntityAndAction: Boolean(
        semanticTurn.references.primary?.id &&
          naturalLanguageUnderstanding.requestedOperation !== "NONE" &&
          naturalLanguageUnderstanding.requestedOperation !== "OBSERVE",
      ),
      explicitCollectionRequest: semanticTurn.owner === "COLLECTION_QUERY",
      stageOrientationRequest: stageRelationship === "STAGE_META" || isStageMetaUtterance(args.utterance),
      knowledgeDefinitionRequest:
        semanticTurn.owner === "PRODUCT_KNOWLEDGE" ||
        semanticTurn.owner === "HELP_TEACH",
      observationNotScenario:
        shouldSkipScenarioForManagerObservation(args.utterance) ||
        naturalLanguageUnderstanding.communicativeIntent === "OBSERVE",
      unknownEntityNamed:
        Boolean(naturalLanguageUnderstanding.objectReference?.lexicalHint) &&
        naturalLanguageUnderstanding.objectReference?.subjectId == null &&
        naturalLanguageUnderstanding.ambiguity.unresolved,
      contextSufficient: clarificationTurn.action !== "clarify",
      unsupportedRequest: false,
    }),
  });
  const decisionTheatre = projectNexoraDecisionTheatreFoundation(
    decisionTheatreProjectionInput,
  );
  emitNexoraDecisionTheatreDiagnostics(
    decisionTheatre,
    decisionTheatreProjectionInput,
  );
  const theatreInvestigation = decisionTheatre.objectInvestigation;
  if (
    theatreInvestigation?.advisorReadable.comparison &&
    /compare (?:it|this) with the other/i.test(args.utterance) &&
    !presentedResponse.includes(theatreInvestigation.advisorReadable.comparison)
  ) {
    presentedResponse = `${theatreInvestigation.advisorReadable.comparison} ${presentedResponse}`.trim();
  }
  if (deicticCandidateInvestigation && theatreInvestigation) {
    presentedResponse = [
      `${theatreInvestigation.managerReadableName}: ${theatreInvestigation.advisorReadable.whyInvestigating}`,
      theatreInvestigation.advisorReadable.evidence,
      theatreInvestigation.advisorReadable.comparison,
    ]
      .filter((part): part is string => Boolean(part))
      .join(" ");
  }
  const theatreComparison = decisionTheatre.decisionComparison;
  if (
    theatreComparison &&
    /biggest trade-?off/i.test(args.utterance) &&
    theatreComparison.advisorReadable.tradeOffs
  ) {
    presentedResponse = theatreComparison.advisorReadable.tradeOffs;
  }
  if (
    theatreComparison &&
    /what do we still not know/i.test(args.utterance) &&
    theatreComparison.advisorReadable.uncertainty
  ) {
    presentedResponse = theatreComparison.advisorReadable.uncertainty;
  }
  const theatreCommitment = decisionTheatre.decisionCommitment;
  if (
    args.intentResult.intent.kind === "decision-status" ||
    /have i already made the decision/i.test(args.utterance)
  ) {
    presentedResponse = theatreCommitment?.advisorReadable.haveIDecided
      ?? "No. You have not made a Decision yet.";
  }
  if (theatreCommitment && /what happens (?:next|after i approve)/i.test(args.utterance)) {
    presentedResponse = theatreCommitment.advisorReadable.next;
  }
  if (theatreCommitment && /why this one|why (?:are we|are you) choosing this/i.test(args.utterance)) {
    presentedResponse = theatreCommitment.advisorReadable.why;
  }
  if (theatreCommitment && /what evidence supports/i.test(args.utterance)) {
    presentedResponse = theatreCommitment.advisorReadable.evidence;
  }
  if (theatreCommitment && /what remains uncertain|what do we still not know/i.test(args.utterance)) {
    presentedResponse = theatreCommitment.advisorReadable.uncertainty;
  }
  const theatreReadiness = decisionTheatre.executionReadiness;
  const executionCollectionQuery =
    /^(?:show(?: me)?(?: all)? executions|how many executions(?: do we have)?)\??$/i.test(
      args.utterance.trim(),
    );
  const executionRequest = resolveNexoraExecutionFollowUpRequest(args.utterance);
  const approvedDecision =
    (args.decisionRuntime?.listDecisions() ?? []).find((item) => item.status === "Approved") ?? null;
  if (
    !skipTheatreCopy &&
    !executionCollectionQuery &&
    executionRequest?.action === "start" &&
    approvedDecision
  ) {
    if (
      args.canonicalExecutionRuntimeProvided === true &&
      args.executionRuntime &&
      args.decisionRuntime
    ) {
      const followUp = resolveNexoraExecutiveExecutionFollowUp({
        action: "start",
        decisionId: approvedDecision.decisionId,
        executionRuntime: args.executionRuntime,
        decisionRuntime: args.decisionRuntime,
      });
      presentedResponse =
        followUp.assessment?.status === "in-progress"
          ? "Execution has started."
          : "The decision is approved, but execution has not been started yet.";
    } else {
      presentedResponse =
        "The decision is approved, but execution has not been started yet.";
    }
  }
  if (!skipTheatreCopy && theatreReadiness && /has execution started|did we start it|have we started/i.test(args.utterance)) {
    presentedResponse = theatreReadiness.advisorReadable.hasStarted;
  }
  if (!skipTheatreCopy && theatreReadiness && /what happens next|is (?:this decision |it )?ready to execute|what do we need before we start|why hasn'?t execution started|can we start now|who is responsible|when should this start/i.test(args.utterance)) {
    if (/who is responsible/i.test(args.utterance)) presentedResponse = theatreReadiness.supportedDimensions.owner.summary;
    else if (/when should this start/i.test(args.utterance)) presentedResponse = theatreReadiness.supportedDimensions.timing.summary;
    else if (/what do we need before we start|why hasn'?t execution started/i.test(args.utterance)) {
      presentedResponse = `${theatreReadiness.advisorReadable.readiness} ${theatreReadiness.advisorReadable.missing}`.trim();
    } else if (/what happens next/i.test(args.utterance)) {
      presentedResponse = theatreReadiness.advisorReadable.whatHappensNext;
    } else {
      presentedResponse = theatreReadiness.advisorReadable.readiness;
    }
  }
  if (!skipTheatreCopy && theatreReadiness && /what is on stage now/i.test(args.utterance)) {
    presentedResponse = theatreReadiness.advisorReadable.scene;
  }
  const theatreLive = skipTheatreCopy ? null : decisionTheatre.liveExecution;
  if (!skipTheatreCopy && args.intentResult.intent.kind === "execution-status") {
    const executionProgressQuestion =
      /(?:going\s+according\s+to\s+plan|on\s+track|how\s+far\s+along|what(?:'s|\s+is)\s+the\s+progress|show\s+progress)/i.test(
        args.utterance,
      );
    const executionExistenceQuestion =
      /(?:has|did|have)\s+(?:the\s+)?execution\s+started|did\s+(?:it|this|that)\s+start/i.test(
        args.utterance,
      );
    presentedResponse = theatreLive
      ? executionProgressQuestion
        ? theatreLive.advisorReadable.progress
        : theatreLive.advisorReadable.happeningNow
      : executionProgressQuestion
        ? "Execution has not started, so progress against plan cannot be evaluated."
        : theatreReadiness?.advisorReadable.hasStarted ??
          (executionExistenceQuestion
            ? "No. Execution has not started."
            : "No Execution is currently active.");
  }
  if (theatreLive && /what is happening now|what is on stage now/i.test(args.utterance)) {
    presentedResponse = theatreLive.advisorReadable.happeningNow;
  }
  if (
    theatreLive &&
    /^(?:how is (?:it|this) going|are we on track|how far along are we|what(?:'s| is) the progress|show progress)\??$/i.test(
      args.utterance.trim(),
    )
  ) {
    presentedResponse = theatreLive.advisorReadable.progress;
  }
  if (
    theatreLive &&
    /why are we doing (?:this|it)|why did we choose this|what was the original problem|what alternatives did we consider|show the original comparison/i.test(
      args.utterance,
    )
  ) {
    if (/why did we choose this|what alternatives|original comparison/i.test(args.utterance) && theatreCommitment) {
      presentedResponse = theatreCommitment.advisorReadable.why;
    } else if (/original problem/i.test(args.utterance)) {
      presentedResponse = `${theatreLive.advisorReadable.why} The originating Problem is not established on the Execution record.`;
    } else {
      presentedResponse = theatreLive.advisorReadable.why;
    }
  }
  if (
    theatreLive &&
    /does anything need my attention|what needs my attention|what should i watch|any risk/i.test(args.utterance)
  ) {
    presentedResponse =
      /any risk/i.test(args.utterance) && theatreLive.risks.length === 0
        ? "No related Risk is established on this Execution."
        : theatreLive.advisorReadable.attention;
  }
  if (theatreLive && /is anything stopping this|what(?:'s| is) blocking/i.test(args.utterance)) {
    presentedResponse = theatreLive.advisorReadable.association;
  }
  if (theatreLive && /what was the result\??$/i.test(args.utterance.trim())) {
    presentedResponse = theatreLive.advisorReadable.outcome;
  }
  const theatreOutcome = skipTheatreCopy ? null : decisionTheatre.outcomeObservation;
  if (theatreOutcome && /what is on stage now/i.test(args.utterance)) {
    presentedResponse = theatreOutcome.advisorReadable.scene;
  }
  if (theatreOutcome && /what was the result\??$/i.test(args.utterance.trim())) {
    presentedResponse = theatreOutcome.advisorReadable.result;
  }
  if (theatreOutcome && /did (?:we|it|this) reach the goal|did we reach the goal/i.test(args.utterance)) {
    presentedResponse = theatreOutcome.advisorReadable.goal;
  }
  if (theatreOutcome && /how much did it improve|how much (?:did|has) (?:it|delivery) improve/i.test(args.utterance)) {
    presentedResponse = theatreOutcome.advisorReadable.delta;
  }
  if (theatreOutcome && /was it successful|was (?:the decision|this) successful/i.test(args.utterance)) {
    presentedResponse = theatreOutcome.advisorReadable.success;
  }
  if (
    theatreOutcome &&
    /did this execution cause|did (?:the )?execution cause|caused the improvement/i.test(args.utterance)
  ) {
    presentedResponse = theatreOutcome.advisorReadable.causality;
  }
  if (theatreOutcome && /what evidence supports/i.test(args.utterance)) {
    presentedResponse = theatreOutcome.advisorReadable.evidence;
  }
  if (theatreOutcome && /what was the original decision|why did we choose this/i.test(args.utterance)) {
    presentedResponse = `The authorizing Decision is ${theatreOutcome.decisionTitle}.`;
  }
  if (theatreOutcome && /show the execution/i.test(args.utterance)) {
    presentedResponse = `The related Execution is ${theatreOutcome.decisionTitle}. ${theatreOutcome.advisorReadable.result}`;
  }
  const theatreLearning = skipTheatreCopy ? null : decisionTheatre.learningReassessment;
  if (
    !skipTheatreCopy &&
    theatreLearning == null &&
    /what did we learn|what have we learned/i.test(args.utterance)
  ) {
    presentedResponse =
      "There isn't enough evidence yet to establish a reliable learning.";
  }
  if (theatreLearning && /what is on stage now/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.scene;
  }
  if (theatreLearning && /what did we learn|what have we learned/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.learned;
  }
  if (theatreLearning && /what changed in our understanding|what changed\??$/i.test(args.utterance.trim())) {
    presentedResponse = theatreLearning.advisorReadable.changed;
  }
  if (theatreLearning && /what should we reconsider/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.reconsider;
  }
  if (theatreLearning && /was our decision wrong|was the decision wrong/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.decisionJudgment;
  }
  if (theatreLearning && /did the decision work/i.test(args.utterance)) {
    presentedResponse = `${theatreOutcome?.advisorReadable.success ?? theatreLearning.advisorReadable.learned} ${theatreLearning.advisorReadable.hindsight}`.trim();
  }
  if (theatreLearning && /which assumption (?:weakened|changed|strengthened)/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.assumption;
  }
  if (theatreLearning && /what remains uncertain/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.uncertain;
  }
  if (theatreLearning && /(?:^why\??$|why do you think that)/i.test(args.utterance.trim())) {
    presentedResponse = `${theatreLearning.advisorReadable.hindsight} ${theatreLearning.advisorReadable.evidence}`.trim();
  }
  if (theatreLearning && /what evidence supports/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.evidence;
  }
  if (theatreLearning && /should we change the goal/i.test(args.utterance)) {
    presentedResponse = theatreLearning.targetLabel
      ? `The stated goal remains ${theatreLearning.targetLabel}. Changing it would require the existing Goal authority, not Learning.`
      : "No Goal change is established from Learning.";
  }
  if (theatreLearning && /should we try another (?:option|scenario)/i.test(args.utterance)) {
    presentedResponse = "It may be useful to explore alternatives through the existing comparison. That is not a new Scenario or Decision.";
  }
  if (theatreLearning && /what would you recommend now/i.test(args.utterance)) {
    presentedResponse = theatreLearning.advisorReadable.recommend;
  }
  if (theatreLearning && /show the original decision/i.test(args.utterance)) {
    presentedResponse = `The authorizing Decision is ${theatreLearning.decisionTitle}. ${theatreLearning.advisorReadable.hindsight}`;
  }
  if (theatreLearning && /show the outcome/i.test(args.utterance)) {
    presentedResponse = theatreOutcome?.advisorReadable.result ?? theatreLearning.advisorReadable.learned;
  }
  if (theatreLearning && /show the original scenarios/i.test(args.utterance)) {
    presentedResponse =
      theatreLearning.comparisonMemberIds.length >= 2
        ? "The original compared options remain available as history. Reviewing them is not a new Decision."
        : "Original compared options are not established on this Learning record.";
  }
  if (
    theatreLearning &&
    /let'?s reconsider(?: the alternatives)?/i.test(args.utterance)
  ) {
    presentedResponse =
      "The original alternatives remain available for review through the existing comparison. That is not a new Decision.";
  }
  if (learningCollectionQuery && !skipTheatreCopy) {
    presentedResponse = theatreLearning
      ? theatreLearning.advisorReadable.learned
      : "No canonical Learning collection is established.";
  }
  if (theatreLive && /is (?:it|this|execution) complete\??$/i.test(args.utterance.trim())) {
    presentedResponse = theatreLive.advisorReadable.completeQuestion;
  }
  if (theatreLive && /is execution active\??$/i.test(args.utterance.trim())) {
    presentedResponse = theatreLive.advisorReadable.happeningNow;
  }
  if (
    !skipTheatreCopy &&
    !executionCollectionQuery &&
    executionRequest?.action === "transition" &&
    executionRequest.transitionAction === "complete" &&
    approvedDecision &&
    args.executionRuntime &&
    args.decisionRuntime
  ) {
    const followUp = resolveNexoraExecutiveExecutionFollowUp({
      action: "transition",
      transitionAction: "complete",
      decisionId: approvedDecision.decisionId,
      executionRuntime: args.executionRuntime,
      decisionRuntime: args.decisionRuntime,
    });
    presentedResponse =
      followUp.status === "confirmation-required"
        ? theatreLive?.advisorReadable.completeCommand ??
          "Completing Execution uses the existing Execution authority and requires an explicit confirmation."
        : followUp.assessment?.status === "completed"
          ? "Existing Execution authority records this Execution as complete."
          : theatreLive?.advisorReadable.completeCommand ?? "Execution was not marked complete.";
  }
  const ecaStage: EcaStageContext = Object.freeze({
    available: incomingStage.available,
    workspace: incomingStage.workspace,
    focus: incomingStage.focus
      ? Object.freeze({
          id: incomingStage.focus.id,
          label: incomingStage.focus.label,
          kind: incomingStage.focus.kind,
        })
      : null,
    selected: incomingStage.selected
      ? Object.freeze({
          id: incomingStage.selected.id,
          label: incomingStage.selected.label,
          kind: incomingStage.selected.kind,
        })
      : null,
    visible: Object.freeze(
      incomingStage.visibleMembers.map((member) =>
        Object.freeze({ id: member.id, label: member.label, kind: member.kind }),
      ),
    ),
    collection: incomingStage.collection
      ? Object.freeze({
          kind: incomingStage.collection.kind,
          label: incomingStage.collection.label,
          members: Object.freeze(
            incomingStage.collection.members.map((member) =>
              Object.freeze({ id: member.id, label: member.label, kind: member.kind }),
            ),
          ),
        })
      : null,
    theatreSceneId: null,
  });
  const ecaWorkingContext = composeEcaWorkingConversationContext({
    utterance: args.utterance,
    meaning: naturalLanguageUnderstanding,
    conversationState:
      failedUnresolvedReference && deicticUtterance && !namedOwnsSingularDeictic
        ? Object.freeze({
            ...nextNcaState,
            lastFailedTurn:
              nextNcaState.lastFailedTurn ??
              args.previousManagerObjectSession?.ncaConversationState?.lastFailedTurn ??
              null,
          })
        : nextNcaState,
    working:
      args.nextEntranceSession?.guidedIntroduction?.conversationContinuity?.working ??
      null,
    stage: ecaStage,
    subjects: Object.freeze(
      [
        ...args.executiveSubjects.map((subject) =>
          Object.freeze({
            id: subject.subjectId,
            label: subject.canonicalName,
            kind: subject.subjectKind,
          }),
        ),
        ...(ncaPost4Comparison?.candidateSet.candidates ?? []).map((candidate) =>
          Object.freeze({
            id: candidate.id,
            label: candidate.label,
            kind: candidate.kind ?? "option",
          }),
        ),
        ...(args.previousManagerObjectSession?.npsComparedOptions ?? []).map((option) =>
          Object.freeze({
            id: option.id,
            label: option.label,
            kind: "option",
          }),
        ),
      ].filter((subject, index, all) => all.findIndex((item) => item.id === subject.id) === index),
    ),
    recentSubjects: Object.freeze(
      nextNcaState.recentSubjects
        .filter(
          (subject): subject is typeof subject & { id: string; name: string } =>
            subject.id != null && subject.name != null,
        )
        .map((subject) =>
          Object.freeze({ id: subject.id, label: subject.name, kind: subject.kind }),
        ),
    ),
    priorActivationSource:
      args.previousManagerObjectSession?.activationSource === "conversation-named"
        ? "conversation-named"
        : stageClickOwnsSingularDeictic ||
            args.previousManagerObjectSession?.activationSource === "click"
          ? "click"
          : args.previousManagerObjectSession?.activationSource ?? null,
  });
  const pendingEcaProposal =
    args.previousManagerObjectSession?.ecaMutationProposal ?? null;
  const ecaActionPlan = planEcaExecutiveConversationAction({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    activeProposal: ecaWorkingContext.mutationProposal ?? pendingEcaProposal,
    lifecycle: {
      committedDecisionId: approvedDecision?.decisionId ?? null,
      executionId: liveExecutions[0]?.executionId ?? null,
    },
  });
  const ecaInitiativeJudgment = judgeEcaExecutiveInitiative({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    session: args.previousManagerObjectSession?.ecaInitiativeSession ?? null,
    nca5: nca5Strategy,
    nxa4: proactiveAdvisoryEvaluation,
    situation: executiveSituation,
  });
  const nextEcaInitiative = nextEcaInitiativeSession(
    args.previousManagerObjectSession?.ecaInitiativeSession ?? null,
    args.utterance,
    ecaInitiativeJudgment,
  );
  const associatedOthers = /^(?:explain|why)\b/i.test(args.utterance.trim())
    ? freezeAssociatedOthers(managerObjectTurn.explanation.relationships)
    : Object.freeze([]);
  const focalSubject = freezeFocalSubject(managerObjectTurn.explanation.subject, managerObjectTurn.activeObjectId);
  const ecaInformationNeedJudgment = judgeEcaExecutiveInformationNeed({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    initiative: ecaInitiativeJudgment,
    session: args.previousManagerObjectSession?.ecaInformationNeedSession ?? null,
    known: composeEcaRuntimeKnownInformation({
      utterance: args.utterance,
      goalTarget:
        args.previousManagerObjectSession?.goalContext?.successSignals.find((item) => item.target)?.target ??
        null,
      nca3ShouldAsk: nca3Strategy.shouldAsk,
      nca3Question: nca3Strategy.question,
      associatedOthers,
      focalSubject,
    }),
  });
  const nextEcaInformationNeed = nextEcaInformationNeedSession(
    args.previousManagerObjectSession?.ecaInformationNeedSession ?? null,
    args.utterance,
    ecaInformationNeedJudgment,
    associatedOthers,
    focalSubject,
  );
  const ecaAnswerIntakeJudgment = judgeEcaExecutiveAnswerIntake({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    informationNeed: ecaInformationNeedJudgment,
    informationNeedSession: args.previousManagerObjectSession?.ecaInformationNeedSession ?? null,
    intakeSession: args.previousManagerObjectSession?.ecaAnswerIntakeSession ?? null,
    meaning: naturalLanguageUnderstanding,
    activeProposal: Boolean(pendingEcaProposal),
    semanticConfirmationPending:
      nextNcaState.pendingQuestion?.purpose === "csv-semantic-clarification" ||
      args.previousManagerObjectSession?.ecaInformationNeedSession?.lastFingerprint === "semantic:CAP_AV",
  });
  const nextEcaAnswerIntake = nextEcaAnswerIntakeSession(
    args.previousManagerObjectSession?.ecaAnswerIntakeSession ?? null,
    args.utterance,
    ecaAnswerIntakeJudgment,
  );
  const convWorking =
    args.nextEntranceSession?.guidedIntroduction?.conversationContinuity?.working ?? null;
  const ecaDialogueStrategy = judgeEcaExecutiveDialogueStrategy({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    initiative: ecaInitiativeJudgment,
    informationNeed: ecaInformationNeedJudgment,
    answerIntake: ecaAnswerIntakeJudgment,
    session: args.previousManagerObjectSession?.ecaDialogueStrategySession ?? null,
    conversationThread: convWorking?.conversationThread
      ? {
          threadId: convWorking.conversationThread.threadId,
          objective: convWorking.conversationThread.objective,
          status: convWorking.conversationThread.status,
        }
      : null,
    committedDecisionId: approvedDecision?.decisionId ?? null,
  });
  const nextEcaDialogueStrategy = nextEcaDialogueStrategySession(
    args.previousManagerObjectSession?.ecaDialogueStrategySession ?? null,
    args.utterance,
    ecaDialogueStrategy,
  );
  const ecaRecommendationJudgment = judgeEcaExecutiveRecommendation({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    initiative: ecaInitiativeJudgment,
    informationNeed: ecaInformationNeedJudgment,
    answerIntake: ecaAnswerIntakeJudgment,
    dialogueStrategy: ecaDialogueStrategy,
    session: args.previousManagerObjectSession?.ecaRecommendationSession ?? null,
    nca4: nca4Strategy,
    nxa5: executiveJudgment,
    committedDecisionId: approvedDecision?.decisionId ?? null,
    capAvUnconfirmed:
      nextNcaState.pendingQuestion?.purpose === "csv-semantic-clarification" ||
      args.previousManagerObjectSession?.ecaInformationNeedSession?.lastFingerprint === "semantic:CAP_AV",
  });
  const nextEcaRecommendation = nextEcaRecommendationSession(
    args.previousManagerObjectSession?.ecaRecommendationSession ?? null,
    args.utterance,
    ecaRecommendationJudgment,
  );
  const ecaCommitmentJudgment = judgeEcaExecutiveCommitment({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    informationNeed: ecaInformationNeedJudgment,
    answerIntake: ecaAnswerIntakeJudgment,
    dialogueStrategy: ecaDialogueStrategy,
    recommendation: ecaRecommendationJudgment,
    session: args.previousManagerObjectSession?.ecaCommitmentSession ?? null,
    committedDecisionId: approvedDecision?.decisionId ?? null,
    decisionCommitmentStatus: decisionCommitmentResult?.status ?? null,
    decisionCandidate:
      decisionTheatre.decisionCommitment?.candidateId &&
      decisionTheatre.decisionCommitment.candidateLabel
        ? {
            id: decisionTheatre.decisionCommitment.candidateId,
            label: decisionTheatre.decisionCommitment.candidateLabel,
          }
        : null,
    candidateChoices: Object.freeze([
      ...(decisionTheatre.decisionCommitment?.candidateChoices ?? []),
      ...(args.previousManagerObjectSession?.npsComparedOptions ?? []),
    ]),
    decisionNeeded: managerObjectTurn.journey.journeyState === "AWAITING_DECISION",
    decisionNeededSubjectLabel:
      ecaWorkingContext.activeSubject?.label ??
      managerObjectTurn.context.identity.value ??
      null,
    analyticalUncertainty: vai8UncertaintyNotes(
      args.previousVaiWhatIfSession?.activeExperimentId
        ? args.previousVaiWhatIfSession.experimentsById[args.previousVaiWhatIfSession.activeExperimentId] ?? null
        : null,
    ),
  });
  const nextEcaCommitment = nextEcaCommitmentSession(
    args.previousManagerObjectSession?.ecaCommitmentSession ?? null,
    args.utterance,
    ecaCommitmentJudgment,
    ecaRecommendationJudgment.criterion,
  );
  const relatedExecution = approvedDecision
    ? args.executionRuntime?.findExecutionByDecisionId(approvedDecision.decisionId) ?? null
    : null;
  const ecaExecutionReadinessJudgment = judgeEcaExecutiveExecutionReadiness({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    informationNeed: ecaInformationNeedJudgment,
    answerIntake: ecaAnswerIntakeJudgment,
    dialogueStrategy: ecaDialogueStrategy,
    recommendation: ecaRecommendationJudgment,
    commitment: ecaCommitmentJudgment,
    session: args.previousManagerObjectSession?.ecaExecutionReadinessSession ?? null,
    committedDecisionId: approvedDecision?.decisionId ?? null,
    committedDecisionTitle: approvedDecision?.title ?? null,
    execution: relatedExecution
      ? {
          executionId: relatedExecution.executionId,
          decisionId: relatedExecution.decisionId,
          title: relatedExecution.title,
          status: relatedExecution.status,
          ownerIds: relatedExecution.ownerIds,
          blockers: relatedExecution.blockers,
          risks: relatedExecution.risks,
        }
      : null,
    capAvUnconfirmed:
      nextNcaState.pendingQuestion?.purpose === "csv-semantic-clarification" ||
      args.previousManagerObjectSession?.ecaInformationNeedSession?.lastFingerprint === "semantic:CAP_AV",
  });
  const nextEcaExecutionReadiness = nextEcaExecutionReadinessSession(
    args.previousManagerObjectSession?.ecaExecutionReadinessSession ?? null,
    args.utterance,
    ecaExecutionReadinessJudgment,
  );
  const liveExecutionSnapshot = relatedExecution
    ? {
        executionId: relatedExecution.executionId,
        decisionId: relatedExecution.decisionId,
        title: relatedExecution.title,
        status: relatedExecution.status,
        progress: relatedExecution.progress ?? null,
        ownerIds: relatedExecution.ownerIds,
        blockers: relatedExecution.blockers,
        risks: relatedExecution.risks,
      }
    : null;
  const ecaLiveExecutionJudgment = judgeEcaLiveExecution({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    answerIntake: ecaAnswerIntakeJudgment,
    readiness: ecaExecutionReadinessJudgment,
    session: args.previousManagerObjectSession?.ecaLiveExecutionSession ?? null,
    execution: liveExecutionSnapshot,
    capAvUnconfirmed:
      nextNcaState.pendingQuestion?.purpose === "csv-semantic-clarification" ||
      args.previousManagerObjectSession?.ecaInformationNeedSession?.lastFingerprint === "semantic:CAP_AV",
  });
  const nextEcaLiveExecution = nextEcaLiveExecutionSession(
    args.previousManagerObjectSession?.ecaLiveExecutionSession ?? null,
    args.utterance,
    ecaLiveExecutionJudgment,
    liveExecutionSnapshot,
  );
  const ecaOutcomeEvidence = projectEcaOutcomeEvidence({
    execution: relatedExecution,
    observations: mapCapturedObservationsForTheatre({
      captured: listCapturedObservations(),
      executions: args.executionRuntime?.listExecutions() ?? [],
    }),
  });
  const ecaOutcomeJudgment = judgeEcaExecutiveOutcome({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    answerIntake: ecaAnswerIntakeJudgment,
    liveExecution: ecaLiveExecutionJudgment,
    session: args.previousManagerObjectSession?.ecaOutcomeSession ?? null,
    evidence: ecaOutcomeEvidence,
    capAvUnconfirmed:
      nextNcaState.pendingQuestion?.purpose === "csv-semantic-clarification" ||
      args.previousManagerObjectSession?.ecaInformationNeedSession?.lastFingerprint === "semantic:CAP_AV",
  });
  const nextEcaOutcome = nextEcaOutcomeSession(
    args.previousManagerObjectSession?.ecaOutcomeSession ?? null,
    args.utterance,
    ecaOutcomeJudgment,
    ecaOutcomeEvidence,
  );
  const ecaLearningClosureJudgment = judgeEcaExecutiveLearningClosure({
    utterance: args.utterance,
    workingContext: ecaWorkingContext,
    actionPlan: ecaActionPlan,
    outcome: ecaOutcomeJudgment,
    dialogue: ecaDialogueStrategy,
    answerIntake: ecaAnswerIntakeJudgment,
    session: args.previousManagerObjectSession?.ecaLearningClosureSession ?? null,
    capAvUnconfirmed:
      nextNcaState.pendingQuestion?.purpose === "csv-semantic-clarification" ||
      args.previousManagerObjectSession?.ecaInformationNeedSession?.lastFingerprint === "semantic:CAP_AV",
    pendingConfirmation: Boolean(pendingEcaProposal) || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const nextEcaLearningClosure = nextEcaLearningClosureSession(
    args.previousManagerObjectSession?.ecaLearningClosureSession ?? null,
    args.utterance,
    ecaLearningClosureJudgment,
  );
  let nextEcaProposal = ecaWorkingContext.mutationProposal ?? pendingEcaProposal;
  const mutationTopicShift =
    !isEcaMutationConfirmation(args.utterance) &&
    !isEcaMutationCancellation(args.utterance) &&
    (semanticTurn.owner === "COLLECTION_QUERY" ||
      semanticTurn.owner === "WORKSPACE_STATE" ||
      Boolean(interpretExecutiveCollectionQuery(args.utterance)));
  if (mutationTopicShift && !ecaWorkingContext.mutationProposal) {
    nextEcaProposal = null;
  }
  if (dataLibraryTurn?.text && (!args.lockPresentedResponse || Boolean(args.dataLibraryResponse))) {
    presentedResponse = dataLibraryTurn.text;
  }
  if (pendingEcaProposal && isEcaMutationCancellation(args.utterance)) {
    presentedResponse =
      pendingEcaProposal.operation === "REMOVE"
        ? "Okay — I won’t remove it."
        : "Okay — I won’t add it.";
    nextEcaProposal = null;
  } else if (pendingEcaProposal && isEcaMutationConfirmation(args.utterance)) {
    const label =
      pendingEcaProposal.proposedName ?? pendingEcaProposal.subject?.label ?? "this item";
    if (pendingEcaProposal.operation !== "ADD" || pendingEcaProposal.targetType !== "RISK") {
      presentedResponse =
        pendingEcaProposal.operation === "REMOVE"
          ? `I won’t delete “${label}” because Nexora has no certified delete writer for that object. I will not turn this into an add.`
          : `I can describe that change, but Nexora has no certified conversational writer for ${pendingEcaProposal.targetType ?? "that object"}. I will not approximate it as a Risk add.`;
      nextEcaProposal = null;
    } else {
    const handoff = handoffEcaRiskMutation({
      workspaceId: args.previousExecutiveContext.currentWorkspaceId ?? "",
      proposal: pendingEcaProposal,
      confirmation: {
        confirmed: true,
        source: "MANAGER_CONVERSATION",
        proposalId: pendingEcaProposal.proposalId,
        turnId: naturalLanguageUnderstanding.rawUtterance,
      },
    });
    if (handoff.status === "CREATED") {
      presentedResponse = `${label} has been added as a Risk.`;
      nextEcaProposal = null;
    } else if (handoff.status === "ALREADY_EXISTS") {
      presentedResponse = `${label} already exists as a Risk.`;
      nextEcaProposal = null;
    } else {
      presentedResponse = `I couldn’t add ${label} as a Risk because ${handoff.reason}.`;
      nextEcaProposal = pendingEcaProposal;
    }
    }
  }
  const learningOwnsGoalQuestion = Boolean(
    theatreLearning && /should we change the goal/i.test(args.utterance),
  );
  if (
    !learningOwnsGoalQuestion &&
    ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" &&
    ecaWorkingContext.mutationProposal?.status === "PROPOSED"
  ) {
    const proposal = ecaWorkingContext.mutationProposal;
    const label = proposal.proposedName ?? proposal.subject?.label ?? "this item";
    const type = proposal.targetType ? ` as a ${proposal.targetType}` : "";
    if (proposal.operation === "REMOVE") {
      presentedResponse = proposal.canonicalWriter
        ? `I can remove “${label}”. Remove it?`
        : `I won’t delete “${label}” because Nexora has no certified delete writer for that object. I will not turn this into an add.`;
      nextEcaProposal = proposal.canonicalWriter ? proposal : null;
    } else if (proposal.operation === "ADD" && proposal.targetType !== "RISK") {
      presentedResponse = `I can describe adding “${label}”${type}, but Nexora has no certified conversational writer for ${proposal.targetType ?? "that object"}. I will not approximate that as a Risk add.`;
      nextEcaProposal = null;
    } else {
      presentedResponse = `I can add “${label}”${type}. Add it?`;
      nextEcaProposal = proposal;
    }
  } else if (
    !learningOwnsGoalQuestion &&
    ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" &&
    ecaWorkingContext.mutationProposal?.status === "NEEDS_CLARIFICATION"
  ) {
    const proposal = ecaWorkingContext.mutationProposal;
    presentedResponse =
      proposal.operation === "ADD"
        ? `Which item should I add as a ${proposal.targetType ?? "Risk"}?`
        : `Which item should I ${proposal.operation.toLowerCase()}?`;
    nextEcaProposal = null;
  }
  const normalizedFinalUtterance =
    normalizeNexoraConversationalUtterance(args.utterance);
  const explicitAdvisoryPurpose = executiveAdvisoryPurposeOf(
    normalizedFinalUtterance,
  );
  const decisionRelativeChangeRequest =
    args.intentResult.intent.kind === "change" &&
    /^what\s+changed\s+(?:since|after)\s+we\s+(?:made|approved|committed)\s+(?:a|the)\s+decision$/.test(
      normalizedFinalUtterance,
    );
  const relevantDecisions = args.decisionRuntime?.listDecisions() ?? [];
  if (decisionRelativeChangeRequest) {
    presentedResponse =
      relevantDecisions.length > 1
        ? `I have ${relevantDecisions.length} relevant Decisions. Which one do you mean?`
        : relevantDecisions.length === 1
          ? `The current evidence does not establish a validated change since ${relevantDecisions[0]?.title ?? "that Decision"} was decided.`
          : "There is no recorded Decision to compare against yet.";
  }
  // Certified Entrance modules already own these turns. Do not overwrite their
  // manager-facing copy with generic executive-advisory purpose responses.
  if (entranceOwnsCurrentUtterance || args.lockPresentedResponse) {
    // keep presentedResponse from Entrance / locked authority
  } else if (explicitAdvisoryPurpose === "execution-readiness") {
    presentedResponse =
      ecaExecutionReadinessJudgment.managerFacingNote ??
      "Execution readiness cannot be established until an approved Decision and its known blockers, ownership, and evidence are available. Nothing has been started.";
  } else if (explicitAdvisoryPurpose === "execution-monitoring") {
    const available: string[] = [];
    if (relatedExecution) {
      available.push(`the canonical Execution status (${relatedExecution.status})`);
      if (relatedExecution.blockers.length > 0) available.push("recorded blockers");
      if (relatedExecution.risks.length > 0) available.push("recorded risks");
      if (relatedExecution.progress != null) available.push("recorded progress");
    }
    if (ecaOutcomeEvidence?.primary?.observed != null) {
      available.push(`the recorded ${ecaOutcomeEvidence.primary.measure} observation`);
    }
    const availableText = available.length > 0
      ? `Available now: ${available.join(", ")}.`
      : "Available now: no active Execution telemetry or validated Outcome observation is recorded.";
    presentedResponse = `${availableText} Useful to collect while execution is running: progress against the approved plan, blockers and risks, and Outcome observations against a confirmed baseline and target. Unknown or unconfirmed data meanings must stay unresolved rather than being treated as KPIs.`;
  } else if (explicitAdvisoryPurpose === "outcome-assessment") {
    presentedResponse =
      ecaOutcomeJudgment.managerFacingNote ??
      "To know whether the Decision is working, compare validated post-start observations with the confirmed baseline and intended target, while checking material trade-offs. Improvement can support an Outcome assessment but does not by itself prove causality.";
  } else if (explicitAdvisoryPurpose === "causal-assessment") {
    presentedResponse =
      ecaOutcomeJudgment.managerFacingNote ??
      "No. An observed KPI improvement is an observation and may show association or plausible contribution, but it does not by itself prove the Decision caused it. Confirmed causality requires the existing evidence standard to rule out credible alternative explanations.";
  } else if (explicitAdvisoryPurpose === "historical-review") {
    const priorContinuity = args.previousManagerObjectSession?.conversationContinuity;
    const issueIds = [...new Set(
      (priorContinuity?.thread ?? [])
        .filter((frame) => args.executiveSubjects.find((subject) => subject.subjectId === frame.subjectId)?.subjectKind === "problem")
        .map((frame) => frame.subjectId),
    )];
    const asksForBeginning = /\b(?:beginning|start)\b/.test(normalizedFinalUtterance);
    if (!asksForBeginning && issueIds.length > 1) {
      const labels = issueIds
        .map((id) => args.executiveSubjects.find((subject) => subject.subjectId === id)?.canonicalName)
        .filter((label): label is string => Boolean(label));
      presentedResponse = `Which earlier issue do you mean: ${labels.join(" or ")}?`;
    } else {
      const historicalSubject =
        contextualManagerMeaning.objectReference?.canonicalName ??
        args.executiveSubjects.find((subject) => subject.subjectId === issueIds[0])?.canonicalName ??
        null;
      presentedResponse = historicalSubject
        ? `Returning to ${historicalSubject}. I do not have new validated evidence in this conversation that establishes a changed view.`
        : "Which earlier issue do you mean?";
    }
  } else if (explicitAdvisoryPurpose === "executive-summary") {
    const points: string[] = [];
    const focus = executiveSituation.focus.label;
    const unresolved = executiveSituation.strongestUnresolvedIssue;
    if (focus || unresolved) {
      points.push(
        unresolved
          ? `Current condition: ${focus ?? "the current issue"}. ${unresolved}`
          : `Current condition: ${focus}.`,
      );
    }
    if (approvedDecision || relatedExecution) {
      points.push(
        `Lifecycle: ${approvedDecision ? `${approvedDecision.title} is approved` : "no Decision is approved"}; ${relatedExecution ? `its Execution is ${relatedExecution.status}` : "Execution has not started"}.`,
      );
    } else {
      points.push("Lifecycle: no approved Decision or active canonical Execution is recorded.");
    }
    const evidencePoint = ecaOutcomeEvidence?.primary?.observed != null
      ? `Evidence: ${ecaOutcomeEvidence.primary.measure} has a recorded observation, but causality remains unconfirmed.`
      : "Evidence: no validated Outcome observation is available yet, so uncertainty remains the next management attention.";
    points.push(evidencePoint);
    presentedResponse = points.slice(0, 3).map((point, index) => `${index + 1}. ${point}`).join(" ");
  }
  const explicitManagerIntentOwnsFinalAnswer =
    args.intentResult.intent.kind === "execution-status" ||
    managerExperience.lane === "goal" ||
    managerExperience.lane === "next-action" ||
    decisionRelativeChangeRequest ||
    explicitAdvisoryPurpose != null;
  presentedResponse = applyEcaInformationNeedToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaInformationNeedJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" || Boolean(dataLibraryTurn?.text && (!args.lockPresentedResponse || Boolean(args.dataLibraryResponse))),
    nca3ShouldAsk: nca3Strategy.shouldAsk,
  });
  presentedResponse = applyEcaAnswerIntakeToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaAnswerIntakeJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" || Boolean(dataLibraryTurn?.text && (!args.lockPresentedResponse || Boolean(args.dataLibraryResponse))),
  });
  presentedResponse = applyEcaDialogueStrategyToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaDialogueStrategy,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" || Boolean(dataLibraryTurn?.text && (!args.lockPresentedResponse || Boolean(args.dataLibraryResponse))),
  });
  presentedResponse = applyEcaRecommendationToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaRecommendationJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = applyEcaCommitmentToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaCommitmentJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = applyEcaExecutionReadinessToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaExecutionReadinessJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = applyEcaLiveExecutionToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaLiveExecutionJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" || ecaOutcomeJudgment.speak,
  });
  presentedResponse = applyEcaOutcomeToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaOutcomeJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" || ecaLearningClosureJudgment.speak,
  });
  presentedResponse = applyEcaLearningClosureToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaLearningClosureJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = applyEcaInformationNeedToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    judgment: ecaInformationNeedJudgment,
    locked: explicitManagerIntentOwnsFinalAnswer || ecaWorkingContext.interactionMode === "PROPOSE_MUTATION" || Boolean(dataLibraryTurn?.text && (!args.lockPresentedResponse || Boolean(args.dataLibraryResponse))),
    nca3ShouldAsk: nca3Strategy.shouldAsk,
  });
  const npsRuntime = composeNpsRuntimeProblemUnderstanding({
    utterance: args.utterance,
    previousProblemId:
      failedUnresolvedReference && deicticUtterance && !namedOwnsSingularDeictic
        ? null
        : args.previousManagerObjectSession?.npsProblemId ?? null,
    turn: managerObjectTurn,
    investigationThread: threadFromSession(managerObjectTurn.session),
    nluProblemId:
      failedUnresolvedReference && deicticUtterance && !namedOwnsSingularDeictic
        ? null
        : naturalLanguageUnderstanding.subject?.subjectKind === "problem"
          ? naturalLanguageUnderstanding.subject.subjectId
          : null,
    stageFocus: ecaWorkingContext.stageContext.focus,
    conversationSubject: ecaWorkingContext.activeSubject,
  });
  presentedResponse = applyNpsUnderstandingToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    understanding: npsRuntime.understanding,
    ecaAlreadyAsking: ecaInformationNeedJudgment.shouldAsk === true,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const npsEvidenceCause = composeNpsRuntimeEvidenceCauseAnalysis({
    path: npsRuntime.path,
    pathFacts: npsRuntime.pathFacts,
    understanding: npsRuntime.understanding,
  });
  presentedResponse = applyNpsEvidenceCauseToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    analysis: npsEvidenceCause,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const npsOptionGeneration = composeNpsRuntimeOptionGeneration({
    path: npsEvidenceCause.path,
    pathFacts: npsRuntime.pathFacts,
    analysis: npsEvidenceCause,
  });
  presentedResponse = applyNpsOptionGenerationToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    generation: npsOptionGeneration,
    previousOptionCandidateId: args.previousManagerObjectSession?.npsOptionCandidateId ?? null,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const npsComparisonRecommendation = composeNpsRuntimeComparisonRecommendation({
    pathFacts: npsRuntime.pathFacts,
    options: npsOptionGeneration,
    utterance: args.utterance,
    previousFacts: Object.freeze({
      managerPreferenceOptionId:
        args.previousManagerObjectSession?.ecaCommitmentSession?.pendingTargetId ?? null,
    }),
  });
  presentedResponse = applyNpsComparisonRecommendationToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    comparison: npsComparisonRecommendation,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const previousPending = args.previousManagerObjectSession?.ecaCommitmentSession?.pendingTargetId ?? null;
  const npsDecisionCommitment = composeNpsRuntimeDecisionCommitment({
    pathFacts: npsRuntime.pathFacts,
    comparison: npsComparisonRecommendation,
    eca: ecaCommitmentJudgment,
    cc10: {
      approvedDecisionId:
        decisionCommitmentResult?.status === "applied" || decisionCommitmentResult?.status === "already-committed"
          ? decisionCommitmentResult.decision?.decisionId ?? approvedDecision?.decisionId ?? null
          : approvedDecision?.decisionId ?? null,
      status:
        decisionCommitmentResult?.status === "applied" ||
        decisionCommitmentResult?.status === "already-committed" ||
        decisionCommitmentResult?.status === "failed" ||
        decisionCommitmentResult?.status === "confirmation-required" ||
        decisionCommitmentResult?.status === "preference-only"
          ? decisionCommitmentResult.status
          : "none",
      pendingConfirmation: decisionCommitmentResult?.status === "confirmation-required" || ecaCommitmentJudgment.confirmationRequired,
      pendingTargetId: ecaCommitmentJudgment.target?.id ?? previousPending,
      pendingTargetLabel: ecaCommitmentJudgment.target?.label ?? null,
      topicChanged:
        npsRuntime.understanding.problemId != null &&
        args.previousManagerObjectSession?.npsProblemId != null &&
        npsRuntime.understanding.problemId !== args.previousManagerObjectSession.npsProblemId,
      recommendationInvalidated: false,
    },
  });
  presentedResponse = applyNpsDecisionCommitmentToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    commitment: npsDecisionCommitment,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const npsExecutionFacts = Object.freeze({
    ...npsRuntime.pathFacts,
    problem: npsDecisionCommitment.problemId
      ? Object.freeze({
          problemId: npsDecisionCommitment.problemId,
          problemLabel: npsDecisionCommitment.problemTitle,
          confidence: "HIGH" as const,
          observedFrom: npsRuntime.pathFacts.problem.observedFrom,
        })
      : npsRuntime.pathFacts.problem,
    approvedDecisionId: npsDecisionCommitment.approvedDecisionId ?? npsRuntime.pathFacts.approvedDecisionId,
    awaitingCommitment: npsDecisionCommitment.path.currentState === "AWAITING_COMMITMENT",
    comparisonAvailable:
      npsRuntime.pathFacts.comparisonAvailable || Boolean(npsComparisonRecommendation.comparedOptions.length),
    recommendationReady:
      npsRuntime.pathFacts.recommendationReady || Boolean(npsComparisonRecommendation.nexoraRecommendation),
    scenarioIds:
      npsRuntime.pathFacts.scenarioIds.length > 0
        ? npsRuntime.pathFacts.scenarioIds
        : Object.freeze(
            npsComparisonRecommendation.comparedOptions.map((item) => item.canonicalScenarioId ?? item.optionId),
          ),
  });
  const startUtterance = args.utterance.trim();
  const npsExecutionMonitoring = composeNpsRuntimeExecutionMonitoring({
    pathFacts: npsExecutionFacts,
    commitment: npsDecisionCommitment,
    ecaReadiness: ecaExecutionReadinessJudgment,
    ecaLive: ecaLiveExecutionJudgment,
    cc11: {
      executionId: relatedExecution?.executionId ?? null,
      decisionId: relatedExecution?.decisionId ?? npsDecisionCommitment.approvedDecisionId ?? null,
      title: relatedExecution?.title ?? npsDecisionCommitment.committedOption ?? null,
      status: relatedExecution?.status ?? null,
      progress: relatedExecution?.progress ?? null,
      ownerIds: relatedExecution?.ownerIds ?? [],
      blockers: relatedExecution?.blockers ?? [],
      risks: relatedExecution?.risks ?? [],
      milestones: relatedExecution?.milestones ?? [],
      resultStatus: relatedExecution ? "reused" : "none",
      managerStartIntent:
        ecaExecutionReadinessJudgment.managerIntent === "START" ||
        /^(?:start it|start execution|execute it)\.?$/i.test(startUtterance),
      ambiguousStartLanguage: /^(?:okay|sounds good|let'?s see|fine|continue)\.?$/i.test(startUtterance),
      doItLanguage: /^(?:do it)\.?$/i.test(startUtterance),
    },
  });
  presentedResponse = applyNpsExecutionMonitoringToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    execution: npsExecutionMonitoring,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  const npsOutcomeLearning = composeNpsRuntimeOutcomeLearning({
    pathFacts: npsExecutionFacts,
    commitment: npsDecisionCommitment,
    execution: npsExecutionMonitoring,
    ecaOutcome: ecaOutcomeJudgment,
    ecaLearning: ecaLearningClosureJudgment,
    evidence: ecaOutcomeEvidence,
    observation: {
      decisionId:
        npsExecutionMonitoring.outcomeHandoff.decisionId ??
        npsDecisionCommitment.approvedDecisionId ??
        relatedExecution?.decisionId ??
        ecaOutcomeEvidence?.decisionId ??
        null,
      decisionTitle: npsDecisionCommitment.committedOption ?? relatedExecution?.title ?? null,
      executionId: npsExecutionMonitoring.outcomeHandoff.executionId ?? relatedExecution?.executionId ?? ecaOutcomeEvidence?.executionId ?? null,
      executionStatus:
        npsExecutionMonitoring.outcomeHandoff.executionStatus ??
        relatedExecution?.status ??
        ecaOutcomeEvidence?.executionStatus ??
        null,
      executionTitle: relatedExecution?.title ?? null,
    },
  });
  presentedResponse = applyNpsOutcomeLearningToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    outcome: npsOutcomeLearning,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = applyNca6StrategyToResponse({
    source: presentedResponse,
    strategy: nca6Strategy,
    locked: true,
  });
  const focusedSubject = args.nextRuntimeState.focusedSubject ?? args.runtimeStateBeforeTurn?.focusedSubject ?? null;
  const vaiAdvisorOverlay = applyVaiAdvisorToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    bundle: args.vaiAdvisorBundle ?? null,
    previousSession: args.previousVaiAdvisorSession ?? null,
    focalOverride: focusedSubject
      ? { id: focusedSubject.id, label: focusedSubject.label }
      : null,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = vaiAdvisorOverlay.source;
  const vaiAdvisorAnalysis = vaiAdvisorOverlay.composition.apply ? vaiAdvisorOverlay.composition : null;
  const nmiAdvisorOverlay = applyNmiAdvisorToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    resolvedCanonicalId:
      ncaTurn.reference.resolvedId ??
      nextNcaState.activeSubject?.id ??
      ncaDialogue.state.activeSubject?.id ??
      ncaTurn.reference.resolvedName ??
      focusedSubject?.id ??
      null,
    bundle: args.nmiAdvisorBundle ?? null,
    vaiCausalOwnsResponse:
      vaiAdvisorOverlay.composition.apply === true &&
      (vaiAdvisorOverlay.composition.intent === "CAUSAL" ||
        vaiAdvisorOverlay.composition.intent === "FOLLOWUP_CAUSE"),
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = nmiAdvisorOverlay.source;
  const nmiAdvisorComposition = nmiAdvisorOverlay.composition.apply ? nmiAdvisorOverlay.composition : null;
  const vaiWhatIfOverlay = applyVaiWhatIfToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    bundle: args.vaiAdvisorBundle ?? null,
    session: args.previousVaiWhatIfSession ?? null,
    models: args.vaiTrustedModels,
    requestedScope: args.vaiWhatIfRequestedScope,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = vaiWhatIfOverlay.source;
  const vaiTheatreProjection = projectVaiTheatreSymbols({
    bundle: args.vaiAdvisorBundle ?? null,
    inspectedSymbolId: null,
  });
  const vaiImpactScene = composeVaiImpactScene({
    bundle: args.vaiAdvisorBundle ?? null,
  });
  const vaiWhatIfTheatre = projectVaiWhatIfTheatre({
    experiment: vaiWhatIfOverlay.result.experiment,
    scene: vaiImpactScene,
  });
  const whatIfSession = vaiWhatIfOverlay.result.apply
    ? vaiWhatIfOverlay.result.session
    : args.previousVaiWhatIfSession ?? null;
  const vai8Experiment =
    vaiWhatIfOverlay.result.experiment
    ?? (whatIfSession?.activeExperimentId ? whatIfSession.experimentsById[whatIfSession.activeExperimentId] ?? null : null);
  const vai8Overlay = applyVai8ToPresentedResponse({
    source: presentedResponse,
    utterance: args.utterance,
    experiment: vai8Experiment,
    session: args.previousVai8PromotionSession ?? null,
    scenarioSession: scenarioResult?.nextSession ?? null,
    currentReferentId: focusedSubject?.id ?? args.vaiAdvisorBundle?.focalObject.id ?? null,
    locked:
      explicitManagerIntentOwnsFinalAnswer ||
      ecaWorkingContext.interactionMode === "PROPOSE_MUTATION",
  });
  presentedResponse = vai8Overlay.source;
  const explicitBusinessReferent =
    contextualManagerMeaning.provenance === "EXPLICIT_CURRENT_TURN" &&
    Boolean(contextualManagerMeaning.objectReference?.subjectId) &&
    contextualManagerMeaning.objectReference?.subjectKind !== "data";
  const introducedDataIds = assistantIntroducedDataSourceIds(dataLibraryTurn);
  const persistedDataDialogue = explicitBusinessReferent
    ? Object.freeze({
        sourceContextId: null,
        fieldColumn: null,
        listedSourceContextIds: Object.freeze([] as string[]),
      })
    : (dataLibraryTurn?.dialogue ??
      args.dataLibraryDialogue ??
      args.previousManagerObjectSession?.advisorDataDialogue ??
      emptyAdvisorDataDialogue);
  const nextConversationContinuity =
    !explicitBusinessReferent && introducedDataIds.length > 0
      ? applyAssistantIntroducedReferent({
          previous: conversationContinuity,
          subjectId: introducedDataIds.length === 1 ? introducedDataIds[0] ?? null : null,
          subjectKind: "data",
          presentedIds: introducedDataIds,
        })
      : conversationContinuity;
  managerObjectTurn = Object.freeze({
    ...managerObjectTurn,
    session: freezeManagerObjectSession({
      ...managerObjectTurn.session,
      conversationContinuity: nextConversationContinuity,
      ecaMutationProposal: nextEcaProposal,
      ecaInitiativeSession: nextEcaInitiative,
      ecaInformationNeedSession: nextEcaInformationNeed,
      ecaAnswerIntakeSession: nextEcaAnswerIntake,
      ecaDialogueStrategySession: nextEcaDialogueStrategy,
      ecaRecommendationSession: nextEcaRecommendation,
      ecaCommitmentSession: nextEcaCommitment,
      ecaExecutionReadinessSession: nextEcaExecutionReadiness,
      ecaLiveExecutionSession: nextEcaLiveExecution,
      ecaOutcomeSession: nextEcaOutcome,
      ecaLearningClosureSession: nextEcaLearningClosure,
      advisorDataDialogue: persistedDataDialogue,
      npsProblemId: npsRuntime.understanding.problemId,
      npsOptionCandidateId: resolveNpsRuntimeFocusedOptionId({
        utterance: args.utterance,
        generation: npsOptionGeneration,
        previousOptionCandidateId: args.previousManagerObjectSession?.npsOptionCandidateId ?? null,
      }),
      npsComparedOptions: npsComparedOptionRefs(npsComparisonRecommendation),
    }),
  });
  const nexoraAdvisorMessage =
    presentedResponse === nexoraMessage.text
      ? nexoraMessage
      : freezeMessage({ ...nexoraMessage, text: presentedResponse });

  return Object.freeze({
    status: args.status,
    response: presentedResponse,
    intentResult: args.intentResult,
    contextResult: args.contextResult,
    experienceResult: args.experienceResult,
    commandResult: args.commandResult,
    runtimeResult: args.runtimeResult,
    recommendationResult,
    scenarioResult,
    decisionCommitmentResult,
    nextScenarioSession: vai8Overlay.result.scenarioSession ?? scenarioResult?.nextSession ?? null,
    nextDecisionSession:
      args.nextDecisionSession !== undefined
        ? args.nextDecisionSession
        : (decisionCommitmentResult?.nextSession ?? null),
    nextPendingTurnExpectation: derivedPendingTurnExpectation,
    pendingTurnResolution: args.pendingTurnResolution ?? null,
    nextConversationContext,
    nextExecutiveContext,
    executiveContextUpdate,
    managerMessage,
    nexoraMessage: nexoraAdvisorMessage,
    trace,
    shouldCommitRuntime: args.lockPresentedResponse
      ? args.shouldCommitRuntime
      : comparisonMeaning.active
      ? false
      : clarificationTurn.action === "clarify" || clarificationTurn.action === "fail"
        ? false
        : consentReply === "yes"
          ? true
          : stageRelationship === "STAGE_META" || stageRelationship === "STAGE_COMPATIBLE" || isCollectionConfirmation(args.utterance)
            ? false
            : args.shouldCommitRuntime || directorPlan.mutationRequired,
    nextRuntimeState: directorRuntimeState,
    decisionTheatre,
    managerObjectTurn,
    nextEntranceSession: args.nextEntranceSession ?? null,
    guidedAttention: args.guidedAttention ?? emptyNexoraGuidedAttentionRuntime(),
    visualView: args.visualView ?? emptyNexoraVisualViewRuntime(),
    naturalLanguageUnderstanding,
    contextualManagerMeaning,
    clarificationTurn,
    trustedCommunication,
    guidanceTurn,
    ncaTurn,
    ncaDialogueMove: nextNcaState.dialogueMove,
    ncaConversationState: nextNcaState,
    nca3Strategy,
    nca4Strategy,
    nca5Strategy,
    nca6Strategy,
    nca7Turn,
    nxaAdvisorContract,
    nxaGuidanceContract,
    executiveSituation,
    proactiveAdvisoryEvaluation,
    executiveJudgment,
    directorPlan,
    ncaPost3Diagnostics: semanticTurn.diagnostics,
    ncaPost4Comparison,
    conversationKernel: conversationKernelDiagnosticsOf(
      args.nextEntranceSession ?? null,
    ),
    conversationThread: conversationThreadResultDiagnosticsOf(
      args.nextEntranceSession ?? null,
    ),
    ecaWorkingContext,
    ecaActionPlan,
    ecaInitiativeJudgment,
    ecaInformationNeedJudgment,
    ecaAnswerIntakeJudgment,
    ecaDialogueStrategy,
    ecaRecommendationJudgment,
    ecaCommitmentJudgment,
    ecaExecutionReadinessJudgment,
    ecaLiveExecutionJudgment,
    ecaOutcomeJudgment,
    ecaLearningClosureJudgment,
    npsPath:
      npsOutcomeLearning.path.currentState === "OUTCOME_REVIEW" ||
      npsOutcomeLearning.path.currentState === "REASSESSMENT" ||
      npsOutcomeLearning.path.currentState === "RESOLVED"
        ? npsOutcomeLearning.path
        : npsExecutionMonitoring.path.currentState
          ? npsExecutionMonitoring.path
          : npsDecisionCommitment.path,
    npsUnderstanding: npsRuntime.understanding,
    npsEvidenceCause,
    npsOptionGeneration,
    npsComparisonRecommendation,
    npsDecisionCommitment,
    npsExecutionMonitoring,
    npsOutcomeLearning,
    vaiAdvisorAnalysis,
    nmiAdvisorComposition,
    vaiTheatreProjection: vaiTheatreProjection.apply ? vaiTheatreProjection : null,
    vaiImpactScene: vaiImpactScene.apply ? vaiImpactScene : null,
    vaiWhatIfExperiment: vaiWhatIfOverlay.result.experiment,
    vaiWhatIfSession: vaiWhatIfOverlay.result.apply ? vaiWhatIfOverlay.result.session : args.previousVaiWhatIfSession ?? null,
    vaiWhatIfTheatre: vaiWhatIfTheatre.apply ? vaiWhatIfTheatre : null,
    vaiWhatIfScenarioProposal: vaiWhatIfOverlay.result.proposal,
    vai8Handoff: vai8Overlay.result.apply ? vai8Overlay.result : null,
    vai8PromotionSession: vai8Overlay.result.apply ? vai8Overlay.result.session : args.previousVai8PromotionSession ?? null,
    decisionRuntime: args.decisionRuntime ?? null,
    executionRuntime: args.executionRuntime ?? null,
  });
}

function conversationKernelDiagnosticsOf(
  entranceSession: NexoraEntranceSession | null,
): import("@/app/lib/nexora-conversation/nexoraConversationDiagnostics.ts").NexoraConversationMoveDiagnostics | null {
  const decision =
    entranceSession?.guidedIntroduction?.conversationContinuity?.working?.lastDecision ?? null;
  if (!decision) return null;
  return conversationMoveDiagnosticsOf(decision, decision.progression);
}

function conversationThreadResultDiagnosticsOf(
  entranceSession: NexoraEntranceSession | null,
): import("@/app/lib/nexora-conversation/nexoraConversationThreadDiagnostics.ts").NexoraConversationThreadDiagnostics | null {
  const working =
    entranceSession?.guidedIntroduction?.conversationContinuity?.working ?? null;
  if (!working?.lastDecision || !working.lastThreadDecision) return null;
  return conversationThreadDiagnosticsOf(working.lastDecision, working.lastThreadDecision);
}

function freezeFocalSubject(
  subject: { readonly id: string | null; readonly label: string | null; readonly kind?: string | null } | null | undefined,
  activeObjectId: string | null | undefined,
) {
  if (subject?.label) {
    return Object.freeze({
      id: subject.id ?? activeObjectId ?? subject.label,
      label: subject.label,
      kind: subject.kind ?? "object",
    });
  }
  return null;
}

function freezeAssociatedOthers(
  relationships: readonly {
    readonly otherId: string | null;
    readonly otherLabel: string;
    readonly relationKind?: string;
  }[] | null | undefined,
) {
  const primary = (relationships ?? []).find(
    (item) =>
      Boolean(item.otherLabel) &&
      /associat|related|affected|constrained/i.test(item.relationKind ?? "associated"),
  );
  if (!primary) return Object.freeze([]);
  return Object.freeze([
    Object.freeze({
      id: primary.otherId ?? primary.otherLabel,
      label: primary.otherLabel,
      kind: "problem",
    }),
  ]);
}

function mapOutcomeJourneyState(
  session:
    | {
        readonly observations: readonly unknown[];
        readonly context: {
          readonly goalImpact: { readonly state: string };
        } | null;
      }
    | null
    | undefined,
): "NOT_OBSERVED" | "OBSERVED" | "IMPROVED" | "UNCHANGED" | "DEGRADED" | "UNKNOWN" {
  if (!session || session.observations.length === 0) return "NOT_OBSERVED";
  const impact = session.context?.goalImpact.state;
  if (impact === "IMPROVING" || impact === "ACHIEVED") return "IMPROVED";
  if (impact === "UNCHANGED") return "UNCHANGED";
  if (impact === "WORSENING") return "DEGRADED";
  if (impact === "UNKNOWN" || impact === "MIXED") return "UNKNOWN";
  return "OBSERVED";
}

function mapCanonicalExecutionJourneyState(
  status: string | null | undefined,
): "NOT_STARTED" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "UNKNOWN" {
  if (status === "in-progress" || status === "at-risk") return "ACTIVE";
  if (status === "blocked") return "BLOCKED";
  if (status === "completed") return "COMPLETED";
  if (status === "planned" || status === "ready" || status === "cancelled") {
    return "NOT_STARTED";
  }
  return "UNKNOWN";
}

export const submitExecutiveUtterance = executeNexoraConversationalExperience;
