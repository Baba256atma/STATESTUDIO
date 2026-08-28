/**
 * CC:5 — Conversational Experience Integration contracts.
 *
 * Experience/integration layer around CC:1–4. Owns UX feedback and session
 * continuity — not Runtime semantics, Stage choreography, or focus writers.
 */

import type { NexoraConversationalIntentResolution } from "./conversationalIntent.ts";
import type { NexoraConversationalContextResolution } from "./conversationalContext.ts";
import type { NexoraConversationalCommandMappingResult } from "./conversationalCommand.ts";
import type { NexoraConversationalRuntimeBridgeResult } from "./conversationalRuntimeBridge.ts";
import type { NexoraConversationContextSnapshot } from "./conversationalContext.ts";
import type { NexoraConversationalExperienceContextResolution } from "./conversationalExperienceContext.ts";
import type {
  NexoraExecutiveContextSnapshot,
  NexoraExecutiveContextUpdateResult,
} from "./executiveContextSnapshot.ts";
import type { NexoraExecutiveRecommendationResult } from "./executiveRecommendation.ts";
import type { NexoraExecutiveScenarioConversationResult } from "./executiveScenarioResolver.ts";
import type { NexoraExecutiveScenarioSession } from "./executiveScenarioResolver.ts";
import type { NexoraDecisionCommitmentResult } from "./executiveDecisionCommitmentResolver.ts";
import type { NexoraExecutiveDecisionSession } from "./executiveDecisionAuthority.ts";
import type {
  NexoraPendingTurnExpectation,
  NexoraPendingTurnResolution,
} from "./conversationalTurnExpectation.ts";
import type { NexoraConversationalActionDescriptor } from "./conversationalActionDescriptor.ts";
import type { CanonicalManagerMeaning } from "@/app/lib/manager-object/canonicalManagerMeaning.ts";
import type { ContextualManagerMeaning } from "@/app/lib/manager-object/contextualManagerMeaning.ts";
import type { ClarificationTurnResult } from "@/app/lib/manager-object/nexoraMvpFinal63ClarificationTypes.ts";
import type { TrustedExecutiveCommunication } from "@/app/lib/manager-object/nexoraMvpFinal64CommunicationTypes.ts";
import type { GuidanceTurnResult } from "@/app/lib/manager-object/nexoraMvpFinal65GuidanceTypes.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalExperienceIdentity =
  "CC:5/ConversationalExperienceIntegration" as const;

export const conversationalExperienceVersion = "1.0.0" as const;

export const conversationalExperienceNamespace =
  "nexora.conversational-control.conversational-experience-integration" as const;

export const conversationalExperiencePhase =
  "ConversationalExperienceIntegration" as const;

export const conversationalExperienceArchitecturalRole =
  "ConversationalExperienceIntegrationAuthority" as const;

export type ConversationalExperienceIdentity = {
  readonly id: typeof conversationalExperienceIdentity;
  readonly version: typeof conversationalExperienceVersion;
  readonly namespace: typeof conversationalExperienceNamespace;
  readonly phase: typeof conversationalExperiencePhase;
  readonly architecturalRole: typeof conversationalExperienceArchitecturalRole;
};

const IDENTITY: ConversationalExperienceIdentity = Object.freeze({
  id: conversationalExperienceIdentity,
  version: conversationalExperienceVersion,
  namespace: conversationalExperienceNamespace,
  phase: conversationalExperiencePhase,
  architecturalRole: conversationalExperienceArchitecturalRole,
});

export function getConversationalExperienceIdentity(): ConversationalExperienceIdentity {
  return IDENTITY;
}

export const CONVERSATIONAL_EXPERIENCE_BOUNDARY = Object.freeze({
  architecturalRole: conversationalExperienceArchitecturalRole,
  ownsRuntimeSemantics: false as const,
  writesFocusDirectly: false as const,
  writesSelectionDirectly: false as const,
  writesAnchorDirectly: false as const,
  writesStageCoordinates: false as const,
  createsParallelStageController: false as const,
  usesLlmOrExternalProvider: false as const,
  durableConversationMemory: false as const,
  alwaysUsesCc1ThroughCc4: true as const,
  /** Certified pipeline includes CC:6 experience resolution before CC:3/4; CC:8 advisory on recommend. */
  pipelineOrder:
    "CC:1→CC:2→CC:6→CC:3→CC:4→CC:8?→CC:9?→CC:10?→CC:7→CC:5-feedback" as const,
  /** Production path uses applyNexoraMVPConversationalCommand; event is debug-only. */
  canonicalRuntimeEntry: "applyNexoraMVPConversationalCommand" as const,
  debugRuntimeEntry: "nexora-cc4-dispatch" as const,
});

// ─── Experience statuses ────────────────────────────────────────────────────

export const NEXORA_CONVERSATIONAL_EXPERIENCE_STATUSES = Object.freeze([
  "applied",
  "clarification-required",
  "not-found",
  "unsupported",
  "confirmation-required",
  "no-op",
  "failed",
] as const);

export type NexoraConversationalExperienceStatus =
  (typeof NEXORA_CONVERSATIONAL_EXPERIENCE_STATUSES)[number];

export type NexoraConversationalMessageRole = "manager" | "nexora";

export type NexoraConversationalMessage = {
  readonly id: string;
  readonly role: NexoraConversationalMessageRole;
  readonly text: string;
  readonly createdAt?: string;
  readonly status?: NexoraConversationalExperienceStatus;
  readonly commandId?: string;
};

/**
 * Read-only CC:5 projection of the existing UX:3 Professional Advisor.
 * Conversation may present this truth; it does not own or recompute it.
 */
export type NexoraConversationalAdvisorGrounding = {
  readonly isOverview: boolean;
  readonly currentSubjectId: string | null;
  readonly currentSubjectLabel: string | null;
  readonly attentionSubjectId: string | null;
  readonly attentionSubjectLabel: string | null;
  readonly attentionReason: string | null;
  readonly situation: string | null;
  readonly whyItMatters: string | null;
  readonly recommendation: string | null;
  readonly noRecommendationReason: string | null;
  readonly primaryActionLabel: string | null;
  readonly evidenceState: "strong" | "limited" | "incomplete" | "stale" | "none";
  readonly evidenceSummary: string | null;
  readonly recommendationAuthority: string;
  readonly primaryAction?: NexoraConversationalActionDescriptor | null;
  readonly availableActions?: readonly NexoraConversationalActionDescriptor[];
  /** EXI:1/EXI:2 — same composed intelligence as Advisor. Optional for older callers. */
  readonly experienceAnswers?: Readonly<{
    readonly change: string;
    readonly significance: string;
    readonly causes: string;
    readonly constraints: string;
    readonly options: string;
    readonly tradeoffs: string;
    readonly recommendation: string;
    readonly nextAction: string;
    readonly outcome: string;
    readonly learning: string;
    readonly confidence?: string;
    readonly evidenceFollowup?: string;
    readonly compare?: string;
    readonly downside?: string;
    readonly sacrifice?: string;
    readonly preventing?: string;
    readonly gain?: string;
    readonly safer?: string;
    readonly cheaper?: string;
    readonly faster?: string;
    readonly assumptions?: string;
    readonly missingDimension?: string;
    readonly factOrAssumption?: string;
    readonly whatAssuming?: string;
    readonly whatPredicted?: string;
    readonly whatUnknown?: string;
    readonly proven?: string;
    readonly binding?: string;
    readonly priority?: string;
    readonly whyPriority?: string;
    readonly comparePriority?: string;
    readonly secondPriority?: string;
    readonly attentionVersusPriority?: string;
    readonly insufficientPriority?: string;
    readonly priorityConfidence?: string;
    readonly priorityEvidence?: string;
    readonly constraintComparison?: string;
    readonly tradeoffConfidence?: string;
  }> | null;
};

export type NexoraConversationalExperienceTrace = {
  readonly utterance: string;
  readonly intentKind: string | null;
  readonly contextStatus: string | null;
  readonly primarySubjectId: string | null;
  readonly experienceDecision: string | null;
  readonly experienceId: string | null;
  readonly commandKind: string | null;
  readonly runtimeStatus: string | null;
  readonly experienceStatus: NexoraConversationalExperienceStatus;
  readonly responseText: string;
  readonly executiveContextTurnIndex?: number | null;
  readonly executiveCurrentSubjectId?: string | null;
  readonly pendingTurnExpectationKind?: string | null;
  readonly pendingTurnResolutionStatus?: string | null;
  readonly managerObjectId?: string | null;
  readonly managerObjectIntent?: string | null;
  readonly explainEngineId?: string | null;
  readonly explanationSummary?: string | null;
  readonly explanationEpistemic?: string | null;
  readonly explanationDepth?: string | null;
  readonly explanationFocus?: string | null;
  readonly explanationHandoffRecommendation?: boolean;
  readonly explorationEngineId?: string | null;
  readonly explorationState?: string | null;
  readonly recommendedPathId?: string | null;
  readonly recommendedPathLabel?: string | null;
  readonly recommendedPathKind?: string | null;
  readonly recommendedPathTarget?: string | null;
  readonly navigationEngineId?: string | null;
  readonly goalSource?: string | null;
  readonly goalTitle?: string | null;
  readonly goalEpistemic?: string | null;
  readonly goalConfirmed?: boolean;
  readonly goalPersisted?: boolean;
  readonly goalProgress?: string | null;
  readonly navigationDirection?: string | null;
  readonly navigationPathId?: string | null;
  readonly navigationPathTarget?: string | null;
  readonly journeyEngineId?: string | null;
  readonly journeyPhase?: string | null;
  readonly journeyState?: string | null;
  readonly journeyHealth?: string | null;
  readonly journeyBlocker?: string | null;
  readonly journeyMilestone?: string | null;
  readonly attentionEngineId?: string | null;
  readonly attentionState?: string | null;
  readonly attentionPrimary?: string | null;
  readonly attentionIntervention?: string | null;
  readonly attentionDoNotDisturb?: boolean;
  readonly attentionStealsFocus?: false;
  readonly experienceIntegrationId?: string | null;
  readonly experienceLane?: string | null;
  readonly experienceCompactContext?: string | null;
  readonly experienceNextStep?: string | null;
  readonly nluCommunicativeIntent?: string | null;
  readonly nluRequestedOperation?: string | null;
  readonly nluSubject?: string | null;
  readonly nluQuestionType?: string | null;
  readonly nluConfidence?: string | null;
  readonly nluAmbiguity?: boolean;
  readonly nluAuthority?: string | null;
  readonly continuityProvenance?: string | null;
  readonly continuityMove?: string | null;
  readonly continuitySubject?: string | null;
  readonly continuityConfidence?: string | null;
  readonly continuityAmbiguity?: boolean;
  readonly continuityActiveSubject?: string | null;
  readonly continuityInvestigation?: string | null;
  readonly continuityPreviousSubject?: string | null;
  readonly clarificationRequired?: boolean;
  readonly clarificationAction?: string | null;
  readonly clarificationReason?: string | null;
  readonly clarificationQuestion?: string | null;
  readonly clarificationCandidates?: number;
  readonly clarificationConsequence?: string | null;
  readonly correctionDetected?: boolean;
  readonly correctionScope?: string | null;
  readonly correctionBefore?: string | null;
  readonly correctionAfter?: string | null;
  readonly resumedOperation?: string | null;
  readonly communicationDepth?: string | null;
  readonly communicationClaimCount?: number;
  readonly communicationFactCount?: number;
  readonly communicationHypothesisCount?: number;
  readonly communicationUnknownCount?: number;
  readonly communicationRecommendation?: boolean;
  readonly communicationChallenge?: boolean;
  readonly communicationUncertaintyPreserved?: boolean;
  readonly communicationCausalValidated?: boolean;
  readonly communicationDecisionWording?: string | null;
  readonly communicationExecutionWording?: string | null;
  readonly guidanceIntent?: string | null;
  readonly guidanceAction?: string | null;
  readonly guidanceCapability?: string | null;
  readonly guidanceAvailability?: string | null;
  readonly guidancePrerequisite?: string | null;
  readonly guidanceSelected?: string | null;
  readonly guidanceReason?: string | null;
  readonly guidanceProactiveEligible?: boolean;
  readonly guidanceProactiveSuppressed?: string | null;
  readonly guidanceAuthority?: string | null;
  readonly ncaNeed?: string | null;
  readonly ncaBehavior?: string | null;
  readonly ncaSufficient?: boolean;
  readonly ncaCapability?: string | null;
  readonly ncaQuestion?: string | null;
  readonly nca2Move?: string | null;
  readonly nca2Topic?: string | null;
  readonly nca2Subject?: string | null;
  readonly nca2Pending?: string | null;
  readonly nca2ThreadState?: string | null;
  readonly nca3Mode?: string | null;
  readonly nca3ShouldAsk?: boolean;
  readonly nca3Sufficiency?: string | null;
  readonly nca3Gap?: string | null;
  readonly nca4Move?: string | null;
  readonly nca4Status?: string | null;
  readonly nca4Option?: string | null;
  readonly nca4Strength?: string | null;
  readonly nca4Confidence?: string | null;
  readonly nca4Advise?: boolean;
  readonly nca5Initiate?: boolean;
  readonly nca5Behavior?: string | null;
  readonly nca5Priority?: string | null;
  readonly nca5Interrupt?: boolean;
  readonly nca5Subject?: string | null;
  readonly nca6Depth?: string | null;
  readonly nca6Framing?: string | null;
  readonly nca6Structure?: string | null;
  readonly nca6Familiarity?: string | null;
  readonly nca6Role?: string | null;
  readonly nca7Owner?: string | null;
  readonly nca7Rank?: string | null;
  readonly nca7Ask?: boolean;
  readonly nca7Advise?: boolean;
  readonly nca7Initiate?: boolean;
  readonly nxaIdentity?: string | null;
  readonly nxaRole?: string | null;
  readonly nxaNeed?: string | null;
  readonly nxaReferent?: string | null;
  readonly nxaReferentSource?: string | null;
  readonly nxaNavigationAllowed?: boolean;
  readonly nxaEvidenceRequired?: boolean;
  readonly nxa2Identity?: string | null;
  readonly nxa2Behavior?: string | null;
  readonly nxa2Valuable?: boolean;
  readonly nxa2QuestionGap?: string | null;
  readonly nxa2RepetitionBlocked?: boolean;
  readonly nxa3Identity?: string | null;
  readonly nxa3Goal?: string | null;
  readonly nxa3Focus?: string | null;
  readonly nxa3CausalStatus?: string | null;
  readonly nxa3RecommendationStatus?: string | null;
  readonly nxa3DecisionState?: string | null;
  readonly nxa3ExecutionState?: string | null;
  readonly nxa3OutcomeState?: string | null;
  readonly nxa3ChangeKind?: string | null;
  readonly nxa3ConflictCount?: number;
  readonly nxa4Identity?: string | null;
  readonly nxa4Disposition?: string | null;
  readonly nxa4Intensity?: string | null;
  readonly nxa4Materiality?: string | null;
  readonly nxa4Evidence?: string | null;
  readonly nxa4Novelty?: string | null;
  readonly nxa5Identity?: string | null;
  readonly nxa5JudgmentType?: string | null;
  readonly nxa5Preferred?: string | null;
  readonly nxa5RecommendationType?: string | null;
  readonly nxa5Strength?: string | null;
  readonly nxa5Readiness?: string | null;
};

export type NexoraConversationalExperienceResult = {
  readonly status: NexoraConversationalExperienceStatus;
  readonly response: string;
  readonly intentResult: NexoraConversationalIntentResolution;
  readonly contextResult: NexoraConversationalContextResolution;
  readonly experienceResult: NexoraConversationalExperienceContextResolution | null;
  readonly commandResult: NexoraConversationalCommandMappingResult | null;
  readonly runtimeResult: NexoraConversationalRuntimeBridgeResult | null;
  /** CC:8 advisory output when recommendation commands are applied. */
  readonly recommendationResult: NexoraExecutiveRecommendationResult | null;
  /** CC:9 scenario conversation output (session drafts). */
  readonly scenarioResult: NexoraExecutiveScenarioConversationResult | null;
  readonly nextScenarioSession: NexoraExecutiveScenarioSession | null;
  /** CC:10 Decision commitment output. */
  readonly decisionCommitmentResult: NexoraDecisionCommitmentResult | null;
  readonly nextDecisionSession: NexoraExecutiveDecisionSession | null;
  /** UX:4-FIX2 session-only dialogue expectation; never durable memory. */
  readonly nextPendingTurnExpectation: NexoraPendingTurnExpectation | null;
  readonly pendingTurnResolution: NexoraPendingTurnResolution | null;
  readonly nextConversationContext: NexoraConversationContextSnapshot;
  /** CC:7 structured executive context (session-scoped). */
  readonly nextExecutiveContext: NexoraExecutiveContextSnapshot;
  readonly executiveContextUpdate: NexoraExecutiveContextUpdateResult | null;
  readonly managerMessage: NexoraConversationalMessage;
  readonly nexoraMessage: NexoraConversationalMessage;
  readonly trace: NexoraConversationalExperienceTrace;
  /** True only when CC:4 applied and Runtime state should be committed. */
  readonly shouldCommitRuntime: boolean;
  /** MO:1 manager–object turn. Reader of CC/Stage; not a parallel truth system. */
  readonly managerObjectTurn: import("@/app/lib/manager-object/managerObjectInteraction.ts").ManagerObjectTurn;
  /** FINAL:6.1 canonical interpretation of the current manager turn. */
  readonly naturalLanguageUnderstanding: CanonicalManagerMeaning;
  /** FINAL:6.2 contextual interpretation of the current turn. */
  readonly contextualManagerMeaning: ContextualManagerMeaning;
  readonly clarificationTurn: ClarificationTurnResult;
  readonly trustedCommunication: TrustedExecutiveCommunication;
  readonly guidanceTurn: GuidanceTurnResult;
  /** NCA:1 advisor interpretation of the current manager turn. */
  readonly ncaTurn: import("@/app/lib/manager-object/nexoraNca1ConversationTypes.ts").ManagerConversationTurn;
  readonly ncaDialogueMove?: string | null;
  readonly ncaConversationState?: import("@/app/lib/manager-object/nexoraNca2ConversationStateTypes.ts").NexoraConversationState | null;
  readonly nca3Strategy?: import("@/app/lib/manager-object/nexoraNca3QuestionIntelligenceTypes.ts").ExecutiveQuestionStrategy | null;
  readonly nca4Strategy?: import("@/app/lib/manager-object/nexoraNca4AdvisoryIntelligenceTypes.ts").ExecutiveAdvisoryStrategy | null;
  readonly nca5Strategy?: import("@/app/lib/manager-object/nexoraNca5InitiativeIntelligenceTypes.ts").ExecutiveInitiativeStrategy | null;
  readonly nca6Strategy?: import("@/app/lib/manager-object/nexoraNca6CommunicationIntelligenceTypes.ts").ExecutiveCommunicationStrategy | null;
  readonly nca7Turn?: import("@/app/lib/manager-object/nexoraNca7EndToEndOrchestrationTypes.ts").NexoraConversationTurnResult | null;
  /** NXA:1 policy projection over NCA/MO; never a second intent authority. */
  readonly nxaAdvisorContract?: import("@/app/lib/manager-object/nexoraNxa1ExecutiveAdvisorContract.ts").NxaAdvisorTurnContract | null;
  readonly nxaGuidanceContract?: import("@/app/lib/manager-object/nexoraNxa2ConversationGuidanceContract.ts").NxaConversationGuidanceContract | null;
  readonly executiveSituation?: import("@/app/lib/manager-object/nexoraNxa3ExecutiveSituation.ts").ExecutiveSituation | null;
  /** NXA:4 conversational-entry decision over MO:6 + NCA:5 + NXA:3. */
  readonly proactiveAdvisoryEvaluation?: import("@/app/lib/manager-object/nexoraNxa4ProactiveAdvisory.ts").Nxa4ProactiveAdvisoryEvaluation | null;
  /** NXA:5 read-only judgment composed from POST:4/EI/MO/NXA authorities. */
  readonly executiveJudgment?: import("@/app/lib/manager-object/nexoraNxa5ExecutiveJudgment.ts").Nxa5ExecutiveJudgment | null;
  /** DIR:1 presentation decision; never a business mutation command. */
  readonly directorPlan?: import("@/app/lib/director/nexoraSemanticPresentationDirector.ts").NexoraDirectorPlan | null;
  readonly ncaPost3Diagnostics?: import("@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts").NcaPost3Diagnostics | null;
  readonly ncaPost4Comparison?: import("@/app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts").ExecutiveCollectionComparisonResult | null;
  /** NEX-EXP:1 session. Omitted when entrance is not active. */
  readonly nextEntranceSession?: import("@/app/lib/nexora-entrance/nexoraEntranceTypes.ts").NexoraEntranceSession | null;
};

export const CONVERSATIONAL_EXPERIENCE_REASON = Object.freeze({
  PIPELINE_CC1_CC4: "pipeline-cc1-through-cc4",
  RESPONSE_FROM_RUNTIME: "response-reflects-runtime-result",
  CONTEXT_UPDATED_ON_SUCCESS: "context-updated-only-on-trusted-success",
  CONTEXT_PRESERVED_ON_FAILURE: "context-preserved-on-failure",
  NO_DIRECT_FOCUS_WRITE: "ui-did-not-write-focus",
  DETERMINISTIC: "deterministic-experience-orchestration",
} as const);
