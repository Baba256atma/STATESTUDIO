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
  classifyExecutiveInvestigationAsk,
  normalizeNexoraConversationalUtterance,
} from "./conversationalIntentNormalization.ts";
import { mapNexoraConversationalCommand } from "./conversationalCommandMapper.ts";
import { resolveNexoraConversationalExperienceContext } from "./conversationalExperienceContextResolver.ts";
import { buildNexoraConversationalExperienceResponse } from "./conversationalExperienceResponse.ts";
import { answerNexoraExiUtterance } from "@/app/lib/nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  type NexoraConversationalExperienceResult,
  type NexoraConversationalExperienceStatus,
  type NexoraConversationalAdvisorGrounding,
  type NexoraConversationalMessage,
  type NexoraConversationalExperienceTrace,
} from "./conversationalExperience.ts";
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
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";
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
  composeNexoraSemanticTurn,
  hydrateCanonicalCollectionMembers,
} from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
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
  conversationalIntentKindForCollection,
  interpretExecutiveCollectionQuery,
} from "@/app/lib/manager-object/nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  classifyRequestStageRelationship,
  composeCollectionConfirmationReply,
  composeKnowledgeConsentOffer,
  composePresentationReasonReply,
  composeStageSceneExplanation,
  isCollectionConfirmation,
  isExplicitPresentationRequest,
  isPresentationConsentReply,
  isStageMetaUtterance,
  projectAuthoritativeStageContext,
  shouldSkipScenarioEngineForStageGroundedComparison,
  type PendingPresentationConsent,
} from "@/app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
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
  /** NCA:5 caller-provided observations. Optional; evaluation remains deterministic without monitoring. */
  readonly initiativeSignals?: readonly ProactiveExecutiveSignal[];
  readonly conversationImportance?: import("@/app/lib/manager-object/nexoraNca5InitiativeIntelligenceTypes.ts").ConversationImportance;
  readonly managerCommunicationContext?: import("@/app/lib/manager-object/nexoraNca6CommunicationIntelligenceTypes.ts").Nca6ManagerContextInput | null;
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
  const ids = deriveMessageIds(input.messageIdSeed);
  const persistEntranceSession = input.previousEntranceSession ?? null;
  const finish = (
    args: Parameters<typeof finalize>[0],
  ): ReturnType<typeof finalize> =>
    finalize({
      ...args,
      runtimeStateBeforeTurn: input.runtimeState,
      nextEntranceSession:
        args.nextEntranceSession !== undefined
          ? args.nextEntranceSession
          : persistEntranceSession,
      initiativeSignals: input.initiativeSignals,
      conversationImportance: input.conversationImportance,
      managerCommunicationContext: input.managerCommunicationContext,
    });
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
  const previousContext = toNexoraConversationContextSnapshot(
    previousExecutiveContext,
  );

  try {
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
        decisionRuntime: input.decisionRuntime ?? null,
        executionRuntime: input.executionRuntime ?? null,
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
      consentReply == null
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
    const clarification: ClarificationTurnResult = situationResolvesClarification ||
      (clarificationRaw.action === "clarify" && clarificationOwnedByCanonicalIntent) ||
      clarificationOwnedByMultiEntitySemantics
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
    if (clarification.action === "resume" && managerOverrideSemanticUtterance(utterance) === utterance) {
      intentResult = applyResumedMeaningToIntent(
        intentResult,
        contextualManagerMeaning,
        clarification,
      );
    } else if (clarification.action !== "park") {
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
    if (
      hasActiveScenarioAssessment(
        previousExecutiveContext,
        input.scenarioSession ?? null,
      ) &&
      intent.kind === "explain" &&
      !intent.targetHints.some((hint) => hint.role === "primary") &&
      input.previousManagerObjectSession?.attentionPrompted !== true &&
      !isExecutiveAttentionUtterance(utterance)
    ) {
      intent = Object.freeze({
        ...intent,
        kind: "explain-scenario" as const,
        requiresTarget: false,
        requiresContext: true,
        scenarioPayload: Object.freeze({ operation: "impact-why" as const }),
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
      actionInvocation.status !== "resolved"
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
          !(pendingCriterion && isExecutiveComparisonCriterionAnswer(utterance))
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
    const isSafeActionNavigation =
      intent.kind === "focus" &&
      (actionInvocation.status === "resolved" ||
        /^(?:review|investigate)\b/i.test(utterance.trim()));

    let recommendationResult: NexoraExecutiveRecommendationResult | null = null;
    let scenarioResult: NexoraExecutiveScenarioConversationResult | null = null;
    let decisionCommitmentResult: NexoraDecisionCommitmentResult | null = null;

    if (
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
          !(intent.targetHints ?? []).some((hint) => hint.role === "primary")))
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

    if (isDecisionCommitment && applied.result.status === "applied") {
      decisionCommitmentResult = resolveDecisionCommitmentForTurn({
        intent,
        primarySubjectId: context.primarySubject?.subjectId ?? null,
        executiveContext: previousExecutiveContext,
        scenarioSession: input.scenarioSession ?? null,
        decisionSession: input.decisionSession ?? null,
        decisionRuntime: input.decisionRuntime ?? null,
        commandId: commandResult.command.commandId,
        utterance,
        committedAt: input.decisionCommittedAt,
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
      naturalLanguageUnderstanding.requestedOperation === "FOCUS";
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
      preservePresentedResponse: Boolean(scenarioResult),
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
  readonly preservePresentedResponse?: boolean;
  readonly lockPresentedResponse?: boolean;
  readonly preserveConversationContinuity?: boolean;
  readonly pendingClarification?: PendingClarification | null;
  readonly clarificationTurn?: ClarificationTurnResult | null;
  readonly nextEntranceSession?: NexoraEntranceSession | null;
  readonly initiativeSignals?: readonly ProactiveExecutiveSignal[];
  readonly conversationImportance?: import("@/app/lib/manager-object/nexoraNca5InitiativeIntelligenceTypes.ts").ConversationImportance;
  readonly managerCommunicationContext?: import("@/app/lib/manager-object/nexoraNca6CommunicationIntelligenceTypes.ts").Nca6ManagerContextInput | null;
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

  const hasNamedHint = args.intentResult.intent.targetHints.some(
    (hint) => hint.role === "primary",
  );
  const comparativeFollowUp = /^\s*what about\b/i.test(args.utterance);
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
    stageFocusedId: args.nextRuntimeState.focusedSubject?.id ?? null,
    conversationSubjectId:
      (comparativeFollowUp
        ? args.previousManagerObjectSession?.activeObjectId ?? null
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
    committedDecisionIds: args.nextEntranceSession?.decisionExperience
      ?.canonicalRecord?.status === "Approved" &&
      args.nextEntranceSession.decisionExperience.canonicalRecord.decisionId
      ? [
          args.nextEntranceSession.decisionExperience.canonicalRecord
            .decisionId,
        ]
      : undefined,
    journeyFacts: args.nextEntranceSession?.executionPlanning
      ?.canonicalExecutionId
      ? {
          executionStates: Object.freeze({
            [args.nextEntranceSession.executionPlanning.canonicalExecutionId]:
              args.nextEntranceSession.executionPlanning.canonicalStatus ===
              "in-progress"
                ? ("ACTIVE" as const)
                : args.nextEntranceSession.executionPlanning.canonicalStatus ===
                    "blocked"
                  ? ("BLOCKED" as const)
                  : args.nextEntranceSession.executionPlanning
                        .canonicalStatus === "completed"
                    ? ("COMPLETED" as const)
                    : ("NOT_STARTED" as const),
          }),
          outcomeStates: Object.freeze({
            [args.nextEntranceSession.executionPlanning.canonicalExecutionId]:
              mapOutcomeJourneyState(args.nextEntranceSession.outcomeMonitoring),
          }),
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
    stageFocusedId: args.nextRuntimeState.focusedSubject?.id ?? null,
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
      contextualManagerMeaning.continuityMove === "resume-parked"
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
      managerObjectTurn.session.investigationSubjectId ??
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
    locked: Boolean(args.lockPresentedResponse),
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
    runtimeState: args.runtimeStateBeforeTurn ?? args.nextRuntimeState,
    catalog,
    lastAuthorizedPresentation:
      args.previousManagerObjectSession?.ncaConversationState?.lastAuthorizedPresentation ?? null,
    goalLabel: args.previousExecutiveContext.currentGoal?.canonicalName ?? null,
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
    [
      ...(args.nextRuntimeState.trail ?? []).map((item) => item.label),
      args.nextRuntimeState.focusedSubject?.label ?? null,
    ].filter((item, index, all): item is string => Boolean(item) && all.indexOf(item) === index),
  );
  const semanticTurn = composeNexoraSemanticTurn({
    utterance: args.utterance,
    catalog: args.catalog,
    previousCollection: hydrateCanonicalCollectionMembers(
      previousNcaState?.lastCollection?.items ?? [],
      args.catalog,
    ),
    stageLabels: trailLabels,
    focusedLabel: args.nextRuntimeState.focusedSubject?.label ?? null,
    stageSnapshot: incomingStage.snapshot ?? stageSnapshot,
    presentationOnlyChange: /\b(?:shown|view|filter|focus)\b/i.test(args.utterance),
  });
  const explicitSingularFocus =
    args.intentResult.intent.kind === "focus" &&
    nxaResponseContract.navigationAllowed &&
    semanticTurn.owner === "BUSINESS" &&
    !/\b(?:problems|risks|opportunities|scenarios|decisions|executions|goals)\b/i.test(args.utterance) &&
    (isExplicitPresentationRequest(args.utterance, args.intentResult.intent.kind) ||
      incomingStage.visibleMembers.some(
        (member) => member.id === args.contextResult.context.primarySubject?.subjectId,
      ));
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
  let presentedResponse =
    semanticTurn.reply && semanticTurn.owner !== "BUSINESS" &&
    (!earlierCapabilityOwnsResponse ||
      (semanticTurn.owner === "COLLECTION_QUERY" &&
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
  if (semanticTurn.owner === "BUSINESS" && nxaGuidanceForResponse.behavior === "WAIT") {
    presentedResponse = /thank/i.test(args.utterance) ? "You're welcome." : "Understood.";
  }
  if (semanticTurn.owner === "BUSINESS" && nxaGuidanceForResponse.behavior === "ASK" && nxaGuidanceForResponse.question) {
    presentedResponse = nxaGuidanceForResponse.question;
  }
  if (semanticTurn.owner === "BUSINESS" && nxaGuidanceForResponse.behavior === "CHALLENGE") {
    presentedResponse = composeNxaEvidenceChallenge({
      references: semanticTurn.references.references.map((item) => item.name),
      activeSubject: nxaResponseContract.referentName,
    });
  }
  if (nxaGuidanceForResponse.behavior === "GUIDE" && semanticTurn.owner === "BUSINESS") {
    presentedResponse = composeNxaContextualGuide({
      subject: nxaResponseContract.referentName,
      nextTarget: managerObjectTurn.exploration.recommendedPaths[0]?.label ?? null,
    });
  }
  if (
    args.intentResult.intent.kind === "explain-scenario" &&
    !/not an observed outcome/i.test(presentedResponse)
  ) {
    presentedResponse = `${presentedResponse} This is a scenario projection, not an observed outcome; its causal interpretation remains uncertain.`;
  }
  if (
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
  });
  if (comparisonMeaning.active) {
    // Comparison/judgment is knowledge work, not navigation. Preserve the
    // authoritative executive referent even when an upstream lexical intent
    // happened to resemble singular focus.
    nextExecutiveContext = args.previousExecutiveContext;
    executiveContextUpdate = null;
  }
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
  if (ncaPost4Comparison?.response && !comparisonClarification) {
    presentedResponse = ncaPost4Comparison.response;
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
  let directorRuntimeState = (
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
    ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().includes("scenario") ? "SCENARIO" :
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
  if (comparisonClarification && !args.lockPresentedResponse) {
    presentedResponse = comparisonClarification.question;
  }
  const priorConsent = args.previousManagerObjectSession?.ncaConversationState?.pendingPresentationConsent ?? null;
  const consentReply = priorConsent ? isPresentationConsentReply(args.utterance) : null;
  let nextPresentationConsent: PendingPresentationConsent | null = priorConsent;
  if (consentReply === "yes" && priorConsent) {
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
    stageRelationship === "STAGE_META" &&
    !args.lockPresentedResponse &&
    (incomingStage.collection || incomingStage.focus)
  ) {
    presentedResponse = /\bwhy\b/.test(args.utterance.toLowerCase())
      ? composePresentationReasonReply(incomingStage)
      : composeStageSceneExplanation(incomingStage);
    nextPresentationConsent = null;
  } else if (isCollectionConfirmation(args.utterance) && incomingStage.collection) {
    presentedResponse = composeCollectionConfirmationReply(incomingStage) ?? presentedResponse;
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
  const nextNcaState = freezeNcaConversationState({
    ...baseNextNcaState,
    lastCollection:
      semanticTurn.owner === "COLLECTION_QUERY"
        ? Object.freeze({
            kind: semanticTurn.diagnostics.collectionKind ?? "UNKNOWN",
            items: Object.freeze(semanticTurn.canonicalCollectionMembers.map((item) => item.label)),
            memberIds: Object.freeze(semanticTurn.canonicalCollectionMembers.map((item) => item.id)),
            establishedAtTurn: baseNextNcaState.turnIndex,
            scope: semanticTurn.diagnostics.collectionScope,
            source: "NCA-POST:3_CANONICAL_COLLECTION",
          })
        : baseNextNcaState.lastCollection,
    activeComparison: ncaPost4Comparison && ncaPost4Comparison.candidateSet.candidateIds.length >= 2
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
    nextScenarioSession: scenarioResult?.nextSession ?? null,
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
    nexoraMessage,
    trace,
    shouldCommitRuntime: comparisonMeaning.active
      ? false
      : clarificationTurn.action === "clarify" || clarificationTurn.action === "fail"
        ? false
        : consentReply === "yes"
          ? true
          : stageRelationship === "STAGE_META" || stageRelationship === "STAGE_COMPATIBLE" || isCollectionConfirmation(args.utterance)
            ? false
            : args.shouldCommitRuntime || directorPlan.mutationRequired,
    nextRuntimeState: directorRuntimeState,
    managerObjectTurn,
    nextEntranceSession: args.nextEntranceSession ?? null,
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
  });
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

export const submitExecutiveUtterance = executeNexoraConversationalExperience;
