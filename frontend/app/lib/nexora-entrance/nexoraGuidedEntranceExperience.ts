/**
 * NEX-ENT:1 — guided introduction over the existing executive entrance.
 * Consumes NEX-EXP:1 session, CC:5 conversation, and Stage catalog projection.
 * Does not create a parallel Executive experience.
 */

import { interpretCanonicalManagerMeaning } from "@/app/lib/manager-object/canonicalManagerMeaningInterpreter.ts";
import {
  createEmptyManagerObjectSession,
} from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { resolveManagerObjectTurn } from "@/app/lib/manager-object/managerObjectInteraction.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type { NexoraConversationalMessage } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { emptyManagerIdentityContext } from "./nexoraEntranceIdentity.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import {
  NEXORA_ENTRANCE_OBJECT_ID,
  type NexoraEntranceSession,
} from "./nexoraEntranceTypes.ts";
import {
  NEXORA_GUIDED_ENTRANCE_BOUNDARY,
  NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS,
  NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
  getNexoraGuidedEntranceIdentity,
  inactiveNexoraAttentionEducationSession,
  inactiveNexoraConversationEducationSession,
  inactiveNexoraDataEducationSession,
  inactiveNexoraGuidedEntranceSession,
  inactiveNexoraObjectEducationSession,
  inactiveNexoraStageEducationSession,
  inactiveNexoraVisualEducationSession,
  inactiveNexoraDecisionLoopEducationSession,
  inactiveNexoraTrustReviewSession,
  inactiveNexoraPersonalDemoHandoffSession,
  inactiveNexoraEntranceConversationContinuitySession,
  readyNexoraGuidedEntranceSession,
  verifyNexoraGuidedEntrance,
  verifyNexoraObjectEducation,
  verifyNexoraStageEducation,
  type NexoraGuidedEntranceSession,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraStageEducationSession,
  type NexoraStagePresentationCue,
  type NexoraEntranceConversationContinuitySession,
} from "./nexoraGuidedEntranceTypes.ts";
import {
  isNexoraObjectEducationActive,
  resolveNexoraObjectEducationTurn,
  shouldNexoraObjectEducationOwnUtterance,
} from "./nexoraObjectEducationExperience.ts";
import {
  resolveNexoraConversationEducationTurn,
  shouldNexoraConversationEducationOwnUtterance,
} from "./nexoraConversationEducationExperience.ts";
import {
  resolveNexoraAttentionEducationTurn,
  shouldNexoraAttentionEducationOwnUtterance,
} from "./nexoraAttentionEducationExperience.ts";
import {
  resolveNexoraDataEducationTurn,
  shouldNexoraDataEducationOwnUtterance,
  verifyNexoraDataEducation,
} from "./nexoraDataEducationExperience.ts";
import {
  resolveNexoraVisualEducationTurn,
  shouldNexoraVisualEducationOwnUtterance,
} from "./nexoraVisualEducationExperience.ts";
import {
  resolveNexoraDecisionLoopEducationTurn,
  shouldNexoraDecisionLoopEducationOwnUtterance,
} from "./nexoraDecisionLoopEducationExperience.ts";
import {
  resolveNexoraTrustReviewTurn,
  shouldNexoraTrustReviewOwnUtterance,
} from "./nexoraTrustReviewExperience.ts";
import {
  isNexoraPersonalDemoHandoffFinished,
  resolveNexoraPersonalDemoHandoffTurn,
  shouldNexoraPersonalDemoHandoffOwnUtterance,
} from "./nexoraPersonalDemoHandoffExperience.ts";
import {
  emptyConversationCapabilities,
  resolveConversationalMove,
} from "@/app/lib/nexora-conversation/nexoraConversationPolicy.ts";
import { resolveThreadIntelligence } from "@/app/lib/nexora-conversation/nexoraConversationThreadApply.ts";
import { coverageOf, coverageThreadOf } from "@/app/lib/nexora-conversation/nexoraConversationWorkingContext.ts";
import type { NexoraConversationCoverage } from "@/app/lib/nexora-conversation/nexoraConversationProgression.ts";
import type { NexoraConversationPurpose } from "@/app/lib/nexora-conversation/nexoraConversationalMove.ts";
import {
  APPEARS_NOW_PREFIX,
  CORRECTION_COPY,
  DASHBOARD_WHY_COPY,
  KNOW_FOCUS_COPY,
  STAGE_SIMPLE_COPY,
  advanceExplanationDepth,
  composeAppearsCopy,
  composeCapabilityCopy,
  composeRelevanceCopy,
  composeFocusDemoCopy,
  composeFocusExplainCopy,
  composeFocusExplainProgressionCopy,
  composeFocusWhyCopy,
  conversationContinuityOf,
  objectEducationHasStarted,
  recordContinuity,
  recordKernelContinuity,
  suggestedActionsForContinuity,
  verifyNexoraEntranceConversationContinuity,
} from "./nexoraEntranceConversationContinuity.ts";

export {
  NEXORA_GUIDED_ATTENTION_RESERVED,
  NEXORA_GUIDED_ENTRANCE_BOUNDARY,
  NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS,
  NEXORA_STAGE_EDUCATION_BOUNDARY,
  NEXORA_STAGE_EDUCATION_FOCUS_ACTIONS,
  NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
  getNexoraGuidedEntranceIdentity,
  getNexoraStageEducationIdentity,
  inactiveNexoraGuidedEntranceSession,
  readyNexoraGuidedEntranceSession,
  verifyNexoraGuidedEntrance,
  verifyNexoraObjectEducation,
  verifyNexoraStageEducation,
} from "./nexoraGuidedEntranceTypes.ts";
export {
  NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY,
  verifyNexoraEntranceConversationContinuity,
} from "./nexoraEntranceConversationContinuity.ts";
export {
  NEXORA_OBJECT_EDUCATION_BOUNDARY,
  getNexoraObjectEducationIdentity,
  isNexoraObjectEducationActive,
  objectEducationOf,
  overlayObjectEducationOnEntranceCatalog,
  shouldNexoraObjectEducationOwnUtterance,
} from "./nexoraObjectEducationExperience.ts";
export {
  NEXORA_CONVERSATION_EDUCATION_BOUNDARY,
  conversationEducationOf,
  getNexoraConversationEducationIdentity,
  isNexoraConversationEducationActive,
  overlayConversationEducationOnEntranceCatalog,
  shouldNexoraConversationEducationOwnUtterance,
  verifyNexoraConversationEducation,
} from "./nexoraConversationEducationExperience.ts";
export {
  NEXORA_ATTENTION_EDUCATION_BOUNDARY,
  attentionEducationOf,
  getNexoraAttentionEducationIdentity,
  isNexoraAttentionEducationActive,
  shouldNexoraAttentionEducationOwnUtterance,
  verifyNexoraAttentionEducation,
} from "./nexoraAttentionEducationExperience.ts";
export {
  NEXORA_DATA_EDUCATION_BOUNDARY,
  dataEducationOf,
  getNexoraDataEducationIdentity,
  isNexoraDataEducationActive,
  shouldNexoraDataEducationOwnUtterance,
  verifyNexoraDataEducation,
} from "./nexoraDataEducationExperience.ts";
export {
  NEXORA_VISUAL_EDUCATION_BOUNDARY,
  getNexoraVisualEducationIdentity,
  isNexoraVisualEducationActive,
  shouldNexoraVisualEducationOwnUtterance,
  verifyNexoraVisualEducation,
  visualEducationOf,
} from "./nexoraVisualEducationExperience.ts";
export {
  NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY,
  decisionLoopEducationOf,
  getNexoraDecisionLoopEducationIdentity,
  isNexoraDecisionLoopEducationActive,
  shouldNexoraDecisionLoopEducationOwnUtterance,
  verifyNexoraDecisionLoopEducation,
} from "./nexoraDecisionLoopEducationExperience.ts";
export {
  NEXORA_TRUST_REVIEW_BOUNDARY,
  getNexoraTrustReviewIdentity,
  isNexoraTrustReviewActive,
  shouldNexoraTrustReviewOwnUtterance,
  trustReviewOf,
  verifyNexoraTrustReview,
} from "./nexoraTrustReviewExperience.ts";
export {
  NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY,
  isNexoraPersonalDemoHandoffActive,
  isNexoraPersonalDemoHandoffFinished,
  personalDemoHandoffOf,
  shouldNexoraPersonalDemoHandoffOwnUtterance,
  verifyNexoraPersonalDemoHandoff,
} from "./nexoraPersonalDemoHandoffExperience.ts";

export const NEXORA_GUIDED_ENTRANCE_INTRO =
  "Welcome to Nexora.\n\nI work with you to understand what matters, examine the situation, explore possible actions, and support better decisions.\n\nI’ll show you how this workspace works as we build it together.";

export const NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY =
  "Nexora is an executive decision workspace. We work together to understand situations, organize what is relevant, examine possibilities, and support decisions and their outcomes.";

const WHAT_IS_COPY = NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY;

const WHY_HERE_COPY =
  "You’re already inside the Nexora executive workspace. I’ll introduce how we work together, and you can continue, ask a question, or skip this introduction at any time.";

const CONTINUE_COPY =
  "This is your Stage — the active workspace where we bring the things that matter to the current situation into view.\n\nInstead of filling it with everything at once, Nexora can focus the workspace around what you’re examining.";

const STAGE_COPY =
  "The Stage is your active executive workspace. We use it to bring what matters to the current situation into view so we can examine it together.";

const DASHBOARD_COPY =
  "No. This isn’t a fixed dashboard of permanent charts. The Stage is a contextual workspace — what you see can change with the situation we’re examining.";

const APPEARS_COPY =
  "Relevant things from the current situation can appear here when we need them. We don’t fill the Stage with everything at once.";

const FOCUS_ACK_COPY =
  "Exactly. When something matters, we can focus the workspace around it.";

const CLICK_COPY =
  "Yes. You can select something on the Stage to examine it. That changes what the workspace is organized around — it doesn’t silently change your business decisions.";

const MOVE_COPY =
  "You don’t need to rearrange the Stage yourself. Nexora brings what matters into view and can focus the workspace around it.";

const CONTROL_COPY =
  "Yes. You can ask questions, choose what to examine, skip this introduction, or continue in the workspace as it is.";

const COME_BACK_COPY =
  "Yes. This is the same Nexora workspace you’ll keep using. You can return to it any time.";

const SKIP_COPY =
  "Understood. You can use the workspace as it is. Ask whenever you want help.";

const HANDOFF_COPY =
  "Now that you know the Stage, we can look at what appears on it when you’re ready.";

export type NexoraGuidedEntranceMove =
  | "SKIP"
  | "CONTINUE"
  | "CAPABILITY"
  | "RELEVANCE"
  | "STATUS"
  | "WHAT_IS"
  | "WHY_HERE"
  | "GREETING"
  | "STAGE"
  | "DASHBOARD"
  | "APPEARS"
  | "APPEARS_NOW"
  | "FOCUS_DEMO"
  | "FOCUS_EXPLAIN"
  | "FOCUS_WHY"
  | "APPEARS_EXAMPLES"
  | "KNOW_FOCUS"
  | "CORRECTION"
  | "EXPLICIT_REPEAT"
  | "SIMPLIFY"
  | "MORE_DETAIL"
  | "CLICK"
  | "MOVE"
  | "CONTROL"
  | "COME_BACK";

export type NexoraGuidedEntranceTurnResult = {
  readonly session: NexoraEntranceSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly centerTransferred: boolean;
  readonly suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[];
  readonly move: NexoraGuidedEntranceMove | null;
  readonly presentationCue: NexoraStagePresentationCue;
  readonly pendingOfferTarget?: NexoraGuidedAttentionTarget | null;
  readonly clearGuidedAttention?: boolean;
  readonly visualViewRequest?: import("@/app/lib/director/nexoraVisualIntelligence.ts").NexoraVisualView | null;
  readonly dismissVisualView?: boolean;
};

export function guidedEntranceOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraGuidedEntranceSession {
  return session?.guidedIntroduction ?? inactiveNexoraGuidedEntranceSession();
}

export function stageEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraStageEducationSession {
  return (
    guidedEntranceOf(session).stageEducation ??
    inactiveNexoraStageEducationSession()
  );
}

export function isNexoraStageEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = stageEducationOf(session).state;
  return (
    state === "INTRODUCING" ||
    state === "AWAITING_FOCUS" ||
    state === "FOCUS_DEMONSTRATED" ||
    state === "COMPLETED"
  );
}

export function isNexoraGuidedEntranceActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = guidedEntranceOf(session).state;
  return (
    state === "READY" ||
    state === "INTRODUCING" ||
    state === "AWAITING_MANAGER" ||
    state === "COMPLETED"
  );
}

export function isNexoraGuidedEntranceScene(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  if (isNexoraPersonalDemoHandoffFinished(session)) return false;
  return isNexoraGuidedEntranceActive(session);
}

export function withActiveNexoraGuidedEntrance(
  session: NexoraEntranceSession,
): NexoraEntranceSession {
  if (session.workspaceResolution !== "first-time") return session;
  if (isNexoraGuidedEntranceActive(session)) return session;
  return Object.freeze({
    ...session,
    guidedIntroduction: readyNexoraGuidedEntranceSession(),
  });
}

export function beginNexoraGuidedEntranceIntroduction(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
): NexoraGuidedEntranceTurnResult {
  const next = Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      state: "AWAITING_MANAGER" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      stageEducation: inactiveNexoraStageEducationSession(),
      objectEducation: inactiveNexoraObjectEducationSession(),
      conversationEducation: inactiveNexoraConversationEducationSession(),
      attentionEducation: inactiveNexoraAttentionEducationSession(),
      dataEducation: inactiveNexoraDataEducationSession(),
      visualEducation: inactiveNexoraVisualEducationSession(),
      decisionLoopEducation: inactiveNexoraDecisionLoopEducationSession(),
      trustReview: inactiveNexoraTrustReviewSession(),
      personalDemoHandoff: inactiveNexoraPersonalDemoHandoffSession(),
      conversationContinuity: inactiveNexoraEntranceConversationContinuitySession(),
    }),
  });
  return completeGuidedTurn({
    session: next,
    runtimeState,
    response: NEXORA_GUIDED_ENTRANCE_INTRO,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS,
    move: null,
    presentationCue: null,
  });
}

export function composeNexoraGuidedEntranceIntroMessage(input: {
  readonly seed: string;
}): NexoraConversationalMessage {
  return Object.freeze({
    id: `${input.seed}-nexora`,
    role: "nexora" as const,
    text: NEXORA_GUIDED_ENTRANCE_INTRO,
    status: "applied" as const,
    suggestedActions: NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS,
  });
}

export function shouldNexoraGuidedEntranceOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
  subjects: readonly NexoraConversationalSubjectRecord[] = Object.freeze([]),
): boolean {
  if (!isNexoraGuidedEntranceActive(session)) return false;
  if (isNexoraPersonalDemoHandoffFinished(session)) return false;
  if (shouldNexoraPersonalDemoHandoffOwnUtterance(session, utterance)) return true;
  if (shouldNexoraTrustReviewOwnUtterance(session, utterance)) return true;
  if (shouldNexoraDecisionLoopEducationOwnUtterance(session, utterance)) return true;
  if (shouldNexoraVisualEducationOwnUtterance(session, utterance)) return true;
  if (shouldNexoraDataEducationOwnUtterance(session, utterance)) return true;
  if (shouldNexoraAttentionEducationOwnUtterance(session, utterance)) return true;
  if (shouldNexoraConversationEducationOwnUtterance(session, utterance)) return true;
  if (shouldNexoraObjectEducationOwnUtterance(session, utterance)) return true;
  return classifyGuidedEntranceMove(utterance, session, subjects) != null;
}

export function resolveNexoraGuidedEntranceTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): NexoraGuidedEntranceTurnResult {
  const move = classifyGuidedEntranceMove(
    input.utterance,
    input.session,
    projectManagerObjectConversationalSubjects(entranceEducationCatalog(input.catalog)),
  );
  if (shouldNexoraPersonalDemoHandoffOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraPersonalDemoHandoffTurn(input);
  }
  if (shouldNexoraTrustReviewOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraTrustReviewTurn(input);
  }
  if (shouldNexoraDecisionLoopEducationOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraDecisionLoopEducationTurn(input);
  }
  if (shouldNexoraVisualEducationOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraVisualEducationTurn(input);
  }
  if (shouldNexoraDataEducationOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraDataEducationTurn(input);
  }
  if (shouldNexoraAttentionEducationOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraAttentionEducationTurn(input);
  }
  if (shouldNexoraConversationEducationOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraConversationEducationTurn(input);
  }
  if (shouldNexoraObjectEducationOwnUtterance(input.session, input.utterance)) {
    return resolveNexoraObjectEducationTurn(input);
  }
  if (move == null) {
    return idleGuidedTurn(input.session, input.runtimeState);
  }
  if (move === "SKIP") {
    return skipGuidedEntrance(input.session, input.runtimeState);
  }
  if (move === "RELEVANCE") {
    return answerRelevanceWithKernel(input);
  }
  if (move === "STATUS") {
    return answerStatusWithExplain(input);
  }
  if (move === "EXPLICIT_REPEAT") {
    const previousCopy = conversationContinuityOf(input.session).lastEducationalResponse;
    return completeGuidedTurn({
      session: input.session,
      runtimeState: input.runtimeState,
      response:
        previousCopy ??
        "I don’t have a previous answer to repeat yet. Ask what you want to understand.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: isNexoraStageEducationActive(input.session),
        focusDemonstrated: stageEducationOf(input.session).focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: conversationContinuityOf(input.session).subject,
        lastAction: conversationContinuityOf(input.session).lastAction,
        appearsDepth: conversationContinuityOf(input.session).appearsDepth,
        capabilityDepth: conversationContinuityOf(input.session).capabilityDepth,
      }),
      move,
      presentationCue: null,
    });
  }
  if (isNexoraStageEducationActive(input.session) || move === "CONTINUE") {
    return resolveStageEducationTurn({
      ...input,
      move,
    });
  }

  const next = Object.freeze({
    ...input.session,
    guidedIntroduction: Object.freeze({
      state:
        guidedEntranceOf(input.session).state === "READY" ||
        guidedEntranceOf(input.session).state === "INTRODUCING"
          ? ("AWAITING_MANAGER" as const)
          : guidedEntranceOf(input.session).state,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      stageEducation: stageEducationOf(input.session),
      objectEducation: input.session.guidedIntroduction?.objectEducation ??
        inactiveNexoraObjectEducationSession(),
      conversationEducation: input.session.guidedIntroduction?.conversationEducation ??
        inactiveNexoraConversationEducationSession(),
      attentionEducation: input.session.guidedIntroduction?.attentionEducation ??
        inactiveNexoraAttentionEducationSession(),
      dataEducation: input.session.guidedIntroduction?.dataEducation ??
        inactiveNexoraDataEducationSession(),
      visualEducation: input.session.guidedIntroduction?.visualEducation ??
        inactiveNexoraVisualEducationSession(),
      decisionLoopEducation: input.session.guidedIntroduction?.decisionLoopEducation ??
        inactiveNexoraDecisionLoopEducationSession(),
      trustReview: input.session.guidedIntroduction?.trustReview ??
        inactiveNexoraTrustReviewSession(),
      personalDemoHandoff: input.session.guidedIntroduction?.personalDemoHandoff ??
        inactiveNexoraPersonalDemoHandoffSession(),
      conversationContinuity: composeMoveContinuity(input.session, move),
    }),
  });

  const composed = composeEducationalResponse(input.session, move);
  return completeGuidedTurn({
    session: next,
    runtimeState: input.runtimeState,
    response: composed.response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: composed.suggestedActions,
    move,
    presentationCue: null,
  });
}

function skipGuidedEntrance(
  session: NexoraEntranceSession,
  _runtimeState: NexoraMVPObjectInteractionState,
): NexoraGuidedEntranceTurnResult {
  const next: NexoraEntranceSession = Object.freeze({
    ...session,
    workspaceResolution: "existing-workspace",
    state: "READY_FOR_GOAL_DISCOVERY",
    identity: emptyManagerIdentityContext(),
    askedQuestionKeys: Object.freeze([]),
    lastQuestionKey: null,
    knownGoalSignals: Object.freeze([]),
    conversationNotes: Object.freeze([]),
    centerSubjectId: null,
    identityObject: null,
    handoff: null,
    introduced: true,
    goalDiscovery: null,
    realityDiscovery: null,
    issueDiscovery: null,
    scenarioDiscovery: null,
    scenarioComparison: null,
    decisionExperience: null,
    executionPlanning: null,
    outcomeMonitoring: null,
    learningReassessment: null,
    guidedIntroduction: Object.freeze({
      state: "SKIPPED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: true,
      stageEducation: Object.freeze({
        state: "SKIPPED" as const,
        focusDemonstrated: stageEducationOf(session).focusDemonstrated,
        managerInteracted: stageEducationOf(session).managerInteracted,
      }),
      objectEducation: Object.freeze({
        state: "SKIPPED" as const,
        currentObjectId: null,
        lastReferenceId: null,
      }),
      conversationEducation: Object.freeze({
        state: "SKIPPED" as const,
      }),
      attentionEducation: Object.freeze({
        state: "SKIPPED" as const,
      }),
      dataEducation: Object.freeze({
        state: "SKIPPED" as const,
        examplePath: false,
      }),
      visualEducation: Object.freeze({
        state: "SKIPPED" as const,
      }),
      decisionLoopEducation: Object.freeze({
        state: "SKIPPED" as const,
      }),
      trustReview: Object.freeze({
        state: "SKIPPED" as const,
        reviewStep: 0 as const,
      }),
      personalDemoHandoff: Object.freeze({
        state: "SKIPPED" as const,
      }),
      conversationContinuity: inactiveNexoraEntranceConversationContinuitySession(),
    }),
  });
  const restored = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  return completeGuidedTurn({
    session: next,
    runtimeState: restored,
    response: SKIP_COPY,
    ownsResponse: true,
    shouldCommitRuntime: true,
    centerTransferred: false,
    suggestedActions: Object.freeze([]),
    move: "SKIP",
    presentationCue: null,
    pendingOfferTarget: null,
    clearGuidedAttention: true,
    dismissVisualView: true,
  });
}

function resolveStageEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly move: NexoraGuidedEntranceMove;
}): NexoraGuidedEntranceTurnResult {
  const education = stageEducationOf(input.session);
  if (!isNexoraStageEducationActive(input.session) && input.move === "CONTINUE") {
    const nextEducation: NexoraStageEducationSession = Object.freeze({
      state: "INTRODUCING" as const,
      focusDemonstrated: false,
      managerInteracted: false,
    });
    const next = withStageEducation(
      input.session,
      "COMPLETED",
      nextEducation,
      recordContinuity(conversationContinuityOf(input.session), {
        subject: "STAGE",
        lastAction: "CONTINUE",
        lastResult: "PRESENTED",
      }),
    );
    return completeGuidedTurn({
      session: next,
      runtimeState: orientStageWorkspace(input.runtimeState, input.catalog),
      response: CONTINUE_COPY,
      ownsResponse: true,
      shouldCommitRuntime: true,
      centerTransferred: false,
      suggestedActions: NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
      move: input.move,
      presentationCue: "orient",
    });
  }

  if (
    input.move === "FOCUS_DEMO" ||
    (input.move === "CONTINUE" &&
      !education.focusDemonstrated &&
      !isNexoraObjectEducationActive(input.session) &&
      (education.state === "INTRODUCING" || education.state === "AWAITING_FOCUS"))
  ) {
    return demonstrateFocus(input.session, input.runtimeState, input.catalog);
  }
  if (input.move === "FOCUS_EXPLAIN") {
    const prior = conversationContinuityOf(input.session);
    const afterDemonstration = prior.lastAction === "DEMONSTRATE";
    const nextDepth = afterDemonstration
      ? prior.focusExplainDepth === "NONE"
        ? ("INTRODUCTORY" as const)
        : prior.focusExplainDepth
      : advanceExplanationDepth(prior.focusExplainDepth);
    const demonstratedCopy = composeFocusExplainCopy({
      demonstrated: education.focusDemonstrated,
      alreadyExplained: prior.focusExplained,
      lastAction: prior.lastAction,
    });
    const nextEducation: NexoraStageEducationSession = Object.freeze({
      state: education.focusDemonstrated ? ("FOCUS_DEMONSTRATED" as const) : ("AWAITING_FOCUS" as const),
      focusDemonstrated: education.focusDemonstrated,
      managerInteracted: education.managerInteracted,
    });
    const continuity = recordContinuity(prior, {
      subject: "FOCUS",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      focusExplained: true,
      focusExplainDepth: nextDepth,
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", nextEducation, continuity),
      runtimeState: input.runtimeState,
      response: afterDemonstration
        ? demonstratedCopy
        : composeFocusExplainProgressionCopy(nextDepth, demonstratedCopy),
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: true,
        subject: "FOCUS",
        lastAction: "EXPLAIN",
      }),
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "FOCUS_WHY") {
    const prior = conversationContinuityOf(input.session);
    const decision = resolveLessonMove({
      subjectId: "lesson:FOCUS",
      purpose: "WHY_PRESENT",
      coverage: prior.focusWhyDepth,
      capabilities: Object.freeze({
        ...emptyConversationCapabilities(),
        show: true,
        connect: true,
      }),
      previousMove: prior.working.lastDecision?.move ?? null,
      lastCapabilityRequest: prior.working.lastDecision?.requestedCapability ?? null,
      lastCapabilityResult: education.focusDemonstrated ? "SUCCEEDED" : "NONE",
    });
    const depth = decision.progression;
    const continuity = recordKernelContinuity(prior, decision, {
      subject: "FOCUS",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      focusWhyDepth: depth,
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response: composeFocusWhyCopy(depth),
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: "FOCUS",
        lastAction: "EXPLAIN",
      }),
      move: input.move,
      presentationCue: null,
    });
  }
  if (
    input.move === "APPEARS" ||
    input.move === "APPEARS_EXAMPLES"
  ) {
    const prior = conversationContinuityOf(input.session);
    const decision = resolveLessonMove({
      subjectId: "lesson:APPEARS",
      purpose: "APPEARS",
      coverage: prior.appearsDepth,
      capabilities: Object.freeze({
        ...emptyConversationCapabilities(),
        show: !education.focusDemonstrated,
        offerNext: true,
        connect: true,
      }),
      previousMove: prior.working.lastDecision?.move ?? null,
      lastCapabilityRequest: prior.working.lastDecision?.requestedCapability ?? null,
      lastCapabilityResult: education.focusDemonstrated ? "SUCCEEDED" : "NONE",
    });
    const depth = decision.progression;
    const continuity = recordKernelContinuity(prior, decision, {
      subject: "APPEARS",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      appearsDepth: depth,
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response: composeAppearsCopy(depth),
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: "APPEARS",
        lastAction: "EXPLAIN",
        appearsDepth: depth,
      }),
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "APPEARS_NOW") {
    const continuity = recordContinuity(conversationContinuityOf(input.session), {
      subject: "APPEARS",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
    });
    const focused = input.runtimeState.focusedSubject?.label ?? "Nexora";
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response: `${APPEARS_NOW_PREFIX} The current focus is ${focused}.`,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: "FOCUS",
        lastAction: education.focusDemonstrated ? "DEMONSTRATE" : "EXPLAIN",
      }),
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "EXPLICIT_REPEAT") {
    const previousCopy = conversationContinuityOf(input.session).lastEducationalResponse;
    return completeGuidedTurn({
      session: input.session,
      runtimeState: input.runtimeState,
      response: previousCopy ?? "I don’t have a previous answer to repeat yet. Ask what you want to understand.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: conversationContinuityOf(input.session).subject,
        lastAction: conversationContinuityOf(input.session).lastAction,
        appearsDepth: conversationContinuityOf(input.session).appearsDepth,
      }),
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "SIMPLIFY") {
    const continuity = recordContinuity(conversationContinuityOf(input.session), {
      subject: "STAGE",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response: STAGE_SIMPLE_COPY,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "MORE_DETAIL") {
    if (conversationContinuityOf(input.session).subject === "APPEARS") {
      return resolveStageEducationTurn({ ...input, move: "APPEARS" });
    }
    if (conversationContinuityOf(input.session).subject === "FOCUS") {
      return resolveStageEducationTurn({ ...input, move: "FOCUS_EXPLAIN" });
    }
    if (conversationContinuityOf(input.session).subject === "CAPABILITY") {
      return resolveStageEducationTurn({ ...input, move: "CAPABILITY" });
    }
    const depth = advanceExplanationDepth(conversationContinuityOf(input.session).stageExplainDepth);
    const continuity = recordContinuity(conversationContinuityOf(input.session), {
      subject: "STAGE",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      stageExplainDepth: depth,
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response:
        depth === "SATURATED" || depth === "PRACTICAL"
          ? composeAppearsCopy("PRACTICAL")
          : `${STAGE_COPY} ${APPEARS_COPY}`,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: "STAGE",
        lastAction: "EXPLAIN",
        appearsDepth: depth,
      }),
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "DASHBOARD") {
    const depth = advanceExplanationDepth(conversationContinuityOf(input.session).dashboardDepth);
    const continuity = recordContinuity(conversationContinuityOf(input.session), {
      subject: "STAGE",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      dashboardDepth: depth,
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response: depth === "INTRODUCTORY" ? DASHBOARD_COPY : DASHBOARD_WHY_COPY,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "KNOW_FOCUS") {
    const continuity = recordContinuity(conversationContinuityOf(input.session), {
      subject: conversationContinuityOf(input.session).subject ?? "FOCUS",
      lastAction: "EXPLAIN",
      lastResult: "ACKNOWLEDGED",
    });
    return completeGuidedTurn({
      session: withStageEducation(input.session, "COMPLETED", education, continuity),
      runtimeState: input.runtimeState,
      response:
        conversationContinuityOf(input.session).subject === "APPEARS"
          ? "Understood. We can continue, or I can show you how Focus changes the Stage."
          : KNOW_FOCUS_COPY,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
      move: input.move,
      presentationCue: null,
    });
  }
  if (input.move === "CORRECTION") {
    return completeGuidedTurn({
      session: withStageEducation(
        input.session,
        "COMPLETED",
        education,
        recordContinuity(conversationContinuityOf(input.session), {
          lastResult: "ACKNOWLEDGED",
        }),
      ),
      runtimeState: input.runtimeState,
      response: CORRECTION_COPY,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: suggestedActionsForContinuity({
        stageActive: true,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: conversationContinuityOf(input.session).focusExplained,
        subject: conversationContinuityOf(input.session).subject,
        lastAction: conversationContinuityOf(input.session).lastAction,
      }),
      move: input.move,
      presentationCue: null,
    });
  }

  const composed = composeEducationalResponse(input.session, input.move);
  const continuity = composeMoveContinuity(input.session, input.move);
  return completeGuidedTurn({
    session: withStageEducation(input.session, "COMPLETED", education, continuity),
    runtimeState: input.runtimeState,
    response:
      education.focusDemonstrated && input.move === "STAGE"
        ? `${STAGE_COPY} ${HANDOFF_COPY}`
        : composed.response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: composed.suggestedActions,
    move: input.move,
    presentationCue: null,
  });
}

export function acknowledgeNexoraStageEducationInteraction(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly subjectId: string | null;
}): NexoraGuidedEntranceTurnResult | null {
  const education = stageEducationOf(input.session);
  if (
    education.state !== "AWAITING_FOCUS" &&
    education.state !== "FOCUS_DEMONSTRATED"
  ) {
    return null;
  }
  if (input.subjectId !== NEXORA_ENTRANCE_OBJECT_ID) return null;
  if (education.managerInteracted) return null;
  const nextEducation: NexoraStageEducationSession = Object.freeze({
    state: "FOCUS_DEMONSTRATED" as const,
    focusDemonstrated: true,
    managerInteracted: true,
  });
  return completeGuidedTurn({
    session: withStageEducation(
      input.session,
      "COMPLETED",
      nextEducation,
      recordContinuity(conversationContinuityOf(input.session), {
        subject: "FOCUS",
        lastAction: "DEMONSTRATE",
        lastResult: "PRESENTED",
      }),
    ),
    runtimeState: input.runtimeState,
    response: FOCUS_ACK_COPY,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
    move: null,
    presentationCue: null,
  });
}

function demonstrateFocus(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  catalog?: NexoraMVPObjectInteractionCatalog,
): NexoraGuidedEntranceTurnResult {
  const already = stageEducationOf(session).focusDemonstrated;
  const nextEducation: NexoraStageEducationSession = Object.freeze({
    state: "AWAITING_FOCUS" as const,
    focusDemonstrated: true,
    managerInteracted: stageEducationOf(session).managerInteracted,
  });
  const continuity = recordContinuity(conversationContinuityOf(session), {
    subject: "FOCUS",
    lastAction: "DEMONSTRATE",
    lastResult: "PRESENTED",
    appearsDepth: "NONE",
  });
  return completeGuidedTurn({
    session: withStageEducation(session, "COMPLETED", nextEducation, continuity),
    runtimeState: focusEntranceSubject(runtimeState, catalog),
    response: composeFocusDemoCopy(already),
    ownsResponse: true,
    shouldCommitRuntime: true,
    centerTransferred: true,
    suggestedActions: suggestedActionsForContinuity({
      stageActive: true,
      focusDemonstrated: true,
      focusExplained: conversationContinuityOf(session).focusExplained,
      subject: "FOCUS",
      lastAction: "DEMONSTRATE",
    }),
    move: "FOCUS_DEMO",
    presentationCue: "demonstrate-focus",
  });
}

function withStageEducation(
  session: NexoraEntranceSession,
  guidedState: NexoraGuidedEntranceSession["state"],
  education: NexoraStageEducationSession,
  continuity: NexoraEntranceConversationContinuitySession = conversationContinuityOf(session),
): NexoraEntranceSession {
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guidedEntranceOf(session),
      state: guidedState,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      stageEducation: education,
      conversationContinuity: continuity,
    }),
  });
}

function entranceEducationCatalog(
  catalog?: NexoraMVPObjectInteractionCatalog,
): NexoraMVPObjectInteractionCatalog {
  if (catalog?.objects.some((object) => object.id === NEXORA_ENTRANCE_OBJECT_ID)) {
    return catalog;
  }
  return Object.freeze({
    objects: Object.freeze([
      Object.freeze({
        id: NEXORA_ENTRANCE_OBJECT_ID,
        label: "NEXORA",
        kind: "object" as const,
        position: [0, 0, 0] as const,
        status: "stable" as const,
        attention: "normal" as const,
        catalogProvenance: "entrance-education" as const,
      }),
    ]),
    relationships: Object.freeze([]),
    contextSubjects: Object.freeze([]),
    contextLinks: Object.freeze([]),
  });
}

function orientStageWorkspace(
  runtimeState: NexoraMVPObjectInteractionState,
  catalog?: NexoraMVPObjectInteractionCatalog,
): NexoraMVPObjectInteractionState {
  const oriented = Object.freeze({
    ...runtimeState,
    workspace: "overview" as const,
    presentationState: "minimum" as const,
    environmentIntent: "investigate" as const,
  });
  return focusEntranceSubject(oriented, catalog);
}

function focusEntranceSubject(
  runtimeState: NexoraMVPObjectInteractionState,
  catalog?: NexoraMVPObjectInteractionCatalog,
): NexoraMVPObjectInteractionState {
  const nextCatalog = entranceEducationCatalog(catalog);
  const overview = Object.freeze({
    ...runtimeState,
    mode: "overview" as const,
    focusedSubject: null,
    selectedSubject: null,
    environmentIntent: "investigate" as const,
    presentationState: "minimum" as const,
    workspace: "overview" as const,
  });
  return selectNexoraMVPInteractionSubject(
    overview,
    NEXORA_ENTRANCE_OBJECT_ID,
    nextCatalog,
  );
}

function composeMoveContinuity(
  session: NexoraEntranceSession,
  move: NexoraGuidedEntranceMove,
): NexoraEntranceConversationContinuitySession {
  const previous = conversationContinuityOf(session);
  if (move === "CAPABILITY") {
    const decision = resolveLessonMove({
      subjectId: "lesson:CAPABILITY",
      purpose: "CAPABILITY",
      coverage: previous.capabilityDepth,
      capabilities: Object.freeze({
        ...emptyConversationCapabilities(),
        connect: true,
        show: true,
      }),
      previousMove: previous.working.lastDecision?.move ?? null,
      lastCapabilityRequest: previous.working.lastDecision?.requestedCapability ?? null,
      lastCapabilityResult: "NONE",
    });
    return recordKernelContinuity(previous, decision, {
      subject: "CAPABILITY",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      capabilityDepth: decision.progression,
    });
  }
  if (move === "APPEARS") {
    return recordContinuity(previous, {
      subject: "APPEARS",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      appearsDepth: previous.appearsDepth === "NONE" ? "INTRODUCTORY" : "DEEPENED",
    });
  }
  if (move === "STAGE" || move === "CONTINUE") {
    return recordContinuity(previous, {
      subject: "STAGE",
      lastAction: move === "CONTINUE" ? "CONTINUE" : "EXPLAIN",
      lastResult: move === "CONTINUE" ? "PRESENTED" : "EXPLAINED",
    });
  }
  if (move === "WHAT_IS" || move === "WHY_HERE" || move === "GREETING") {
    return recordContinuity(previous, {
      subject: "CAPABILITY",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
    });
  }
  return previous;
}

function composeEducationalResponse(
  session: NexoraEntranceSession,
  move: NexoraGuidedEntranceMove,
): {
  readonly response: string;
  readonly suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[];
} {
  const continuity = conversationContinuityOf(session);
  const education = stageEducationOf(session);
  const stageActive = isNexoraStageEducationActive(session);
  if (move === "CAPABILITY") {
    const decision = resolveLessonMove({
      subjectId: "lesson:CAPABILITY",
      purpose: "CAPABILITY",
      coverage: continuity.capabilityDepth,
      capabilities: Object.freeze({
        ...emptyConversationCapabilities(),
        show: !stageActive,
        offerNext: stageActive,
        connect: true,
      }),
      previousMove: continuity.working.lastDecision?.move ?? null,
      lastCapabilityRequest: continuity.working.lastDecision?.requestedCapability ?? null,
      lastCapabilityResult: "NONE",
    });
    const depth = decision.progression;
    return {
      response: composeCapabilityCopy(depth),
      suggestedActions: suggestedActionsForContinuity({
        stageActive,
        focusDemonstrated: education.focusDemonstrated,
        focusExplained: continuity.focusExplained,
        subject: "CAPABILITY",
        lastAction: "EXPLAIN",
        capabilityDepth: depth,
      }),
    };
  }
  const response =
    move === "WHAT_IS"
      ? WHAT_IS_COPY
      : move === "WHY_HERE"
        ? WHY_HERE_COPY
        : move === "STAGE"
          ? STAGE_COPY
          : move === "DASHBOARD"
            ? DASHBOARD_COPY
            : move === "APPEARS"
              ? APPEARS_COPY
              : move === "CLICK"
                ? CLICK_COPY
                : move === "MOVE"
                  ? MOVE_COPY
                  : move === "CONTROL"
                    ? CONTROL_COPY
                    : move === "COME_BACK"
                      ? COME_BACK_COPY
                      : move === "CONTINUE"
                        ? CONTINUE_COPY
                        : NEXORA_GUIDED_ENTRANCE_INTRO;
  return {
    response,
    suggestedActions: suggestedActionsForContinuity({
      stageActive,
      focusDemonstrated: education.focusDemonstrated,
      focusExplained: continuity.focusExplained,
      subject: continuity.subject,
      lastAction: continuity.lastAction,
    }),
  };
}

function answerRelevanceWithKernel(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  const prior = conversationContinuityOf(input.session);
  const subjectId = NEXORA_ENTRANCE_OBJECT_ID;
  const purpose: NexoraConversationPurpose = "WHY_RELEVANT";
  const previousCoverage = coverageOf(prior.working, subjectId, purpose);
  const thread = coverageThreadOf(prior.working, subjectId, purpose);
  const capabilities = Object.freeze({
    ...emptyConversationCapabilities(),
    show: true,
    offerNext: true,
    connect: true,
  });
  const decision = resolveConversationalMove({
    meaning: interpretCanonicalManagerMeaning({
      utterance: input.utterance,
      subjects: Object.freeze([]),
    }),
    subjectId,
    purpose,
    coverage: previousCoverage,
    previousMove: thread?.lastMove ?? prior.working.lastDecision?.move ?? null,
    lastCapabilityRequest: thread?.lastCapabilityRequest ?? null,
    lastCapabilityResult: thread?.lastCapabilityResult ?? "NONE",
    capabilities,
    explicitRepeat: false,
    materialContextChanged: false,
    pendingOfferAccepted: false,
  });
  const threadDecision = resolveThreadIntelligence({
    working: prior.working,
    turn: decision,
    capabilities,
    availablePurposes: Object.freeze(["WHY_RELEVANT", "CAPABILITY"]),
    objective: "LEARN_CAPABILITY",
  });
  const resolved = threadDecision.resolvedMove;
  const depth = decision.progression;
  const response =
    resolved === "SUMMARIZE" || resolved === "OFFER_NEXT" || resolved === "CONNECT"
      ? composeRelevanceCopy("PRACTICAL")
      : composeRelevanceCopy(depth);
  const continuity = recordKernelContinuity(
    prior,
    decision,
    {
      subject: "CAPABILITY",
      lastAction: "EXPLAIN",
      lastResult: "EXPLAINED",
      capabilityDepth: prior.capabilityDepth,
    },
    {
      conversationThread: threadDecision.thread,
      lastThreadDecision: threadDecision,
    },
  );
  return completeGuidedTurn({
    session: Object.freeze({
      ...input.session,
      guidedIntroduction: input.session.guidedIntroduction
        ? Object.freeze({
            ...input.session.guidedIntroduction,
            state:
              guidedEntranceOf(input.session).state === "READY" ||
              guidedEntranceOf(input.session).state === "INTRODUCING"
                ? ("AWAITING_MANAGER" as const)
                : guidedEntranceOf(input.session).state,
            introduced: true,
            introductionSeeded: true,
            conversationContinuity: continuity,
          })
        : input.session.guidedIntroduction,
    }),
    runtimeState: input.runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: suggestedActionsForContinuity({
      stageActive: isNexoraStageEducationActive(input.session),
      focusDemonstrated: stageEducationOf(input.session).focusDemonstrated,
      focusExplained: prior.focusExplained,
      subject: "CAPABILITY",
      lastAction: "EXPLAIN",
      capabilityDepth: depth === "NONE" ? "INTRODUCTORY" : depth,
    }),
    move: "RELEVANCE",
    presentationCue: null,
  });
}

function answerStatusWithExplain(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): NexoraGuidedEntranceTurnResult {
  const catalog = entranceEducationCatalog(input.catalog);
  const turn = resolveManagerObjectTurn({
    utterance: input.utterance,
    conversationalKind: "situation",
    conversationSubjectId: NEXORA_ENTRANCE_OBJECT_ID,
    stageFocusedId:
      input.runtimeState.focusedSubject?.id ?? NEXORA_ENTRANCE_OBJECT_ID,
    catalog,
    subjects: projectManagerObjectConversationalSubjects(catalog),
    previousSession: Object.freeze({
      ...createEmptyManagerObjectSession(),
      activeObjectId: NEXORA_ENTRANCE_OBJECT_ID,
      activationSource: "preserved" as const,
    }),
  });
  return completeGuidedTurn({
    session: input.session,
    runtimeState: input.runtimeState,
    response: turn.explanation.managerFacingText,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: suggestedActionsForContinuity({
      stageActive: isNexoraStageEducationActive(input.session),
      focusDemonstrated: stageEducationOf(input.session).focusDemonstrated,
      focusExplained: conversationContinuityOf(input.session).focusExplained,
      subject: conversationContinuityOf(input.session).subject,
      lastAction: conversationContinuityOf(input.session).lastAction,
      appearsDepth: conversationContinuityOf(input.session).appearsDepth,
      capabilityDepth: conversationContinuityOf(input.session).capabilityDepth,
    }),
    move: "STATUS",
    presentationCue: null,
  });
}

function classifyGuidedEntranceMove(
  utterance: string,
  session?: NexoraEntranceSession | null,
  subjects: readonly NexoraConversationalSubjectRecord[] = Object.freeze([]),
): NexoraGuidedEntranceMove | null {
  const normalized = normalizeUtterance(utterance);
  if (!normalized) return null;

  if (isSkipUtterance(normalized)) return "SKIP";
  if (isExplicitRepeatUtterance(normalized) && isNexoraGuidedEntranceActive(session)) {
    return "EXPLICIT_REPEAT";
  }
  if (isAppearsNowUtterance(normalized) && isNexoraGuidedEntranceActive(session)) {
    return "APPEARS_NOW";
  }
  if (isCorrectionUtterance(normalized) && isNexoraGuidedEntranceActive(session) && !objectEducationHasStarted(session)) {
    return "CORRECTION";
  }
  if (isNexoraStageEducationActive(session) && !objectEducationHasStarted(session)) {
    if (isStageAgainUtterance(normalized)) return "STAGE";
    if (isSimplifyUtterance(normalized)) return "SIMPLIFY";
    if (isMoreDetailUtterance(normalized)) return "MORE_DETAIL";
    if (isFocusDemoUtterance(normalized) || isRepeatDemoUtterance(normalized)) return "FOCUS_DEMO";
    if (isFocusExplainUtterance(normalized)) return "FOCUS_EXPLAIN";
    if (isFocusWhyUtterance(normalized)) return "FOCUS_WHY";
    if (isKnowFocusUtterance(normalized)) return "KNOW_FOCUS";
    if (isAppearsExamplesUtterance(normalized)) return "APPEARS_EXAMPLES";
    if (isNextStepUtterance(normalized)) return "CONTINUE";
    if (isDashboardUtterance(normalized)) return "DASHBOARD";
    if (isAppearsUtterance(normalized)) return "APPEARS";
    if (isStageUtterance(normalized)) return "STAGE";
    if (isClickUtterance(normalized)) return "CLICK";
    if (isMoveUtterance(normalized)) return "MOVE";
    if (isControlUtterance(normalized)) return "CONTROL";
    if (isComeBackUtterance(normalized)) return "COME_BACK";
    if (isContinueUtterance(normalized)) return "CONTINUE";
  }
  if (objectEducationHasStarted(session) && isAppearsUtterance(normalized)) return "APPEARS";
  if (objectEducationHasStarted(session) && isAppearsNowUtterance(normalized)) return "APPEARS_NOW";
  if (isContinueUtterance(normalized)) return "CONTINUE";
  if (isWhyHereUtterance(normalized)) return "WHY_HERE";
  const lastPurpose =
    conversationContinuityOf(session).working.lastDecision?.purpose ?? null;
  if (
    (normalized === "why" || normalized === "why?") &&
    lastPurpose === "WHY_RELEVANT"
  ) {
    return "RELEVANCE";
  }
  if (
    (normalized === "what do you mean" ||
      normalized === "what does that mean" ||
      normalized === "what do you mean by that") &&
    (lastPurpose === "WHY_RELEVANT" || !isNexoraStageEducationActive(session))
  ) {
    return lastPurpose === "WHY_RELEVANT" || !isNexoraStageEducationActive(session)
      ? "RELEVANCE"
      : "MORE_DETAIL";
  }
  if (
    (normalized === "how" || normalized === "how?") &&
    lastPurpose === "WHY_RELEVANT"
  ) {
    return "CAPABILITY";
  }
  if (isWhatIsNexoraUtterance(normalized) && !isNexoraStageEducationActive(session)) {
    return "WHAT_IS";
  }
  if (isGreetingUtterance(normalized) && !isNexoraStageEducationActive(session)) {
    return "GREETING";
  }

  const meaning = interpretCanonicalManagerMeaning({
    utterance,
    subjects,
  });
  if (isDecisionAuthorityUtterance(normalized, meaning)) return null;
  if (
    meaning.communicativeIntent === "ASK_CAPABILITY" ||
    (meaning.requestedOperation === "HELP" && meaning.objectReference == null)
  ) {
    return "CAPABILITY";
  }
  if (meaning.questionType === "GOAL_RELEVANCE") {
    return "RELEVANCE";
  }
  if (
    meaning.communicativeIntent === "ASK_STATUS" ||
    meaning.requestedOperation === "STATUS"
  ) {
    return "STATUS";
  }
  if (
    lastPurpose === "WHY_RELEVANT" &&
    (meaning.communicativeIntent === "ASK_WHY" ||
      meaning.communicativeIntent === "ASK_EXPLANATION")
  ) {
    return "RELEVANCE";
  }
  return null;
}

function isSkipUtterance(normalized: string): boolean {
  return (
    normalized === "skip" ||
    normalized === "skip this" ||
    normalized === "skip introduction" ||
    normalized === "skip the introduction" ||
    normalized === "skip this education" ||
    normalized === "not now" ||
    normalized === "exit" ||
    normalized === "leave introduction"
  );
}

function isFocusDemoUtterance(normalized: string): boolean {
  return (
    normalized === "show me how focus works" ||
    normalized === "show me focus" ||
    normalized === "demonstrate focus" ||
    normalized === "how does focus work"
  );
}

function isRepeatDemoUtterance(normalized: string): boolean {
  return (
    normalized === "do it again" ||
    normalized === "show it again" ||
    normalized === "show me again" ||
    normalized === "show again"
  );
}

function isFocusExplainUtterance(normalized: string): boolean {
  return (
    normalized === "explain first" ||
    normalized === "what does focus mean" ||
    normalized === "what is focus" ||
    normalized === "explain it" ||
    normalized === "explain that" ||
    normalized === "explain what i saw" ||
    normalized === "explain focus" ||
    normalized === "explain focus again"
  );
}

function isStageAgainUtterance(normalized: string): boolean {
  return (
    normalized === "explain the stage again" ||
    normalized === "explain stage again"
  );
}

function isFocusWhyUtterance(normalized: string): boolean {
  return (
    normalized === "why" ||
    normalized === "why is that useful" ||
    normalized === "why is that" ||
    normalized === "why is this useful"
  );
}

function isKnowFocusUtterance(normalized: string): boolean {
  return (
    normalized === "i already understand" ||
    normalized === "i already understand focus" ||
    normalized === "i understand" ||
    normalized === "i know" ||
    normalized === "i already know"
  );
}

function isAppearsExamplesUtterance(normalized: string): boolean {
  return normalized === "like what" || normalized === "for example" || normalized === "such as";
}

function isNextStepUtterance(normalized: string): boolean {
  return (
    normalized === "and then" ||
    normalized === "what next" ||
    normalized === "what's next"
  );
}

function isCorrectionUtterance(normalized: string): boolean {
  return (
    normalized === "no, that's not what i mean" ||
    normalized === "that's not what i mean" ||
    normalized === "no that's not what i mean"
  );
}

function isDecisionAuthorityUtterance(
  normalized: string,
  meaning: ReturnType<typeof interpretCanonicalManagerMeaning>,
): boolean {
  return (
    /\bdecid(?:e|es|ed|ing|ion|ions)\b/.test(normalized) &&
    meaning.communicativeIntent !== "ASK_CAPABILITY"
  ) || /\bwhat can nexora decide\b/.test(normalized);
}

function isDashboardUtterance(normalized: string): boolean {
  return (
    normalized === "is this a dashboard" ||
    normalized === "is it a dashboard" ||
    normalized === "is the stage a dashboard" ||
    normalized === "so it isn't a dashboard" ||
    normalized === "so it is not a dashboard" ||
    normalized === "why isn't it a dashboard" ||
    normalized === "why is it not a dashboard"
  );
}

function isAppearsUtterance(normalized: string): boolean {
  return (
    normalized === "what appears here" ||
    normalized === "what appears on the stage" ||
    normalized === "what appears on stage" ||
    normalized === "what can appear here" ||
    normalized === "what can appear on the stage" ||
    normalized === "what can appear on stage" ||
    normalized === "what kinds of things do i see here" ||
    normalized === "what can this workspace show" ||
    normalized === "what can appear on stage again" ||
    normalized === "go back - what can appear on the stage" ||
    normalized === "go back — what can appear on the stage"
  );
}

function isAppearsNowUtterance(normalized: string): boolean {
  return (
    normalized === "what is here right now" ||
    normalized === "what is actually on the stage now" ||
    normalized === "what is on the stage right now" ||
    normalized === "what appears here now" ||
    normalized === "no, i mean what is actually on the stage now" ||
    normalized === "no i mean what is actually on the stage now"
  );
}

function isExplicitRepeatUtterance(normalized: string): boolean {
  return (
    normalized === "repeat exactly what you said" ||
    normalized === "repeat exactly" ||
    normalized === "say that again" ||
    normalized === "repeat what you said" ||
    normalized === "repeat that"
  );
}

function isSimplifyUtterance(normalized: string): boolean {
  return (
    normalized === "explain it more simply" ||
    normalized === "explain more simply" ||
    normalized === "say that more simply"
  );
}

function isMoreDetailUtterance(normalized: string): boolean {
  return (
    normalized === "tell me more" ||
    normalized === "explain in more detail" ||
    normalized === "more detail"
  );
}

function isStageUtterance(normalized: string): boolean {
  return (
    normalized === "what is the stage" ||
    normalized === "what is this stage" ||
    normalized === "what is this space" ||
    normalized === "what is this"
  );
}

function isClickUtterance(normalized: string): boolean {
  return (
    normalized === "can i click things" ||
    normalized === "can i click this" ||
    normalized === "can i select things"
  );
}

function isMoveUtterance(normalized: string): boolean {
  return (
    normalized === "can i move things" ||
    normalized === "can i move this"
  );
}

function isControlUtterance(normalized: string): boolean {
  return (
    normalized === "can i control the stage" ||
    normalized === "can i control this"
  );
}

function isComeBackUtterance(normalized: string): boolean {
  return (
    normalized === "can i come back here later" ||
    normalized === "can i come back later"
  );
}

function isContinueUtterance(normalized: string): boolean {
  return (
    normalized === "show me" ||
    normalized === "continue" ||
    normalized === "lets go" ||
    normalized === "let's go" ||
    normalized === "lets begin" ||
    normalized === "let's begin"
  );
}

function isWhyHereUtterance(normalized: string): boolean {
  return (
    normalized === "why am i here" ||
    normalized === "why are we here" ||
    normalized === "why is this"
  );
}

function isWhatIsNexoraUtterance(normalized: string): boolean {
  return (
    normalized === "what is nexora" ||
    normalized === "who are you" ||
    normalized === "what is this"
  );
}

function isGreetingUtterance(normalized: string): boolean {
  return /^(?:hi|hello|hey|good (?:morning|afternoon|evening))(?: there)?$/.test(
    normalized,
  );
}

function normalizeUtterance(utterance: string): string {
  return utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLessonMove(input: {
  readonly subjectId: string;
  readonly purpose: NexoraConversationPurpose;
  readonly coverage: NexoraConversationCoverage;
  readonly capabilities: ReturnType<typeof emptyConversationCapabilities> & {
    readonly show: boolean;
    readonly compare: boolean;
    readonly investigate: boolean;
    readonly offerNext: boolean;
    readonly connect: boolean;
  };
  readonly previousMove: ReturnType<typeof resolveConversationalMove>["move"] | null;
  readonly lastCapabilityRequest: ReturnType<typeof resolveConversationalMove>["requestedCapability"];
  readonly lastCapabilityResult: "SUCCEEDED" | "FAILED" | "NONE";
}) {
  return resolveConversationalMove({
    meaning: null,
    subjectId: input.subjectId,
    purpose: input.purpose,
    coverage: input.coverage,
    previousMove: input.previousMove,
    lastCapabilityRequest: input.lastCapabilityRequest,
    lastCapabilityResult: input.lastCapabilityResult,
    capabilities: input.capabilities,
    explicitRepeat: false,
    materialContextChanged: false,
    pendingOfferAccepted: false,
  });
}

function idleGuidedTurn(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
): NexoraGuidedEntranceTurnResult {
  return completeGuidedTurn({
    session,
    runtimeState,
    response: "",
    ownsResponse: false,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: Object.freeze([]),
    move: null,
    presentationCue: null,
  });
}

function completeGuidedTurn(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly centerTransferred: boolean;
  readonly suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[];
  readonly move: NexoraGuidedEntranceMove | null;
  readonly presentationCue: NexoraStagePresentationCue;
  readonly pendingOfferTarget?: NexoraGuidedAttentionTarget | null;
  readonly clearGuidedAttention?: boolean;
  readonly visualViewRequest?: import("@/app/lib/director/nexoraVisualIntelligence.ts").NexoraVisualView | null;
  readonly dismissVisualView?: boolean;
}): NexoraGuidedEntranceTurnResult {
  const withRecordedCopy =
    input.ownsResponse && input.response
      ? Object.freeze({
          ...input.session,
          guidedIntroduction: Object.freeze({
            ...guidedEntranceOf(input.session),
            conversationContinuity: recordContinuity(conversationContinuityOf(input.session), {
              lastEducationalResponse: input.response,
            }),
          }),
        })
      : input.session;
  return Object.freeze({
    session: withRecordedCopy,
    response: input.response,
    ownsResponse: input.ownsResponse,
    shouldCommitRuntime: input.shouldCommitRuntime,
    nextRuntimeState: input.runtimeState,
    centerTransferred: input.centerTransferred,
    suggestedActions: Object.freeze([...input.suggestedActions]),
    move: input.move,
    presentationCue: input.presentationCue,
    pendingOfferTarget: input.pendingOfferTarget ?? null,
    clearGuidedAttention: input.clearGuidedAttention === true,
    visualViewRequest: input.visualViewRequest,
    dismissVisualView: input.dismissVisualView === true,
  });
}

export function nexoraGuidedEntranceCopyIsManagerReadable(text: string): boolean {
  return !/\b(?:NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection)\b/i.test(
    text,
  );
}

export function assertNexoraGuidedEntranceArchitecture(): void {
  verifyNexoraGuidedEntrance();
  verifyNexoraStageEducation();
  verifyNexoraObjectEducation();
  verifyNexoraDataEducation();
  verifyNexoraEntranceConversationContinuity();
  if (NEXORA_GUIDED_ENTRANCE_BOUNDARY.keywordRouter) {
    throw new Error("NEX-ENT:1 must not become a keyword router");
  }
  if (getNexoraGuidedEntranceIdentity().id !== "NEX-ENT:1/NexoraEntranceAndIntroduction") {
    throw new Error("NEX-ENT:1 identity mismatch");
  }
}
