/**
 * NEX-ENT:5 — teaches Guided Attention. Does not own the attention capability.
 */

import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_ATTENTION_EDUCATION_INTRO_ACTIONS,
  NEXORA_ATTENTION_EDUCATION_NEXT_ACTIONS,
  NEXORA_ATTENTION_EDUCATION_OFFER_ACTIONS,
  inactiveNexoraAttentionEducationSession,
  verifyNexoraAttentionEducation,
  type NexoraAttentionEducationSession,
  type NexoraAttentionEducationState,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import {
  classifyConversationEducationMove,
  conversationEducationOf,
} from "./nexoraConversationEducationExperience.ts";

export {
  NEXORA_ATTENTION_EDUCATION_BOUNDARY,
  NEXORA_ATTENTION_EDUCATION_INTRO_ACTIONS,
  getNexoraAttentionEducationIdentity,
  inactiveNexoraAttentionEducationSession,
  verifyNexoraAttentionEducation,
} from "./nexoraGuidedEntranceTypes.ts";

const INTRO_COPY =
  "You can also ask me where something is. If it’s available here, I can help direct your attention to it.";
const OFFER_COPY = "Want me to show you where Data is?";
const REVIEW_COPY =
  "I can point to where something is without taking the action for you. You stay in control.";

export type NexoraAttentionEducationMove = "NEXT" | "NOT_NOW" | "WORK";

export function attentionEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraAttentionEducationSession {
  return (
    session?.guidedIntroduction?.attentionEducation ??
    inactiveNexoraAttentionEducationSession()
  );
}

export function isNexoraAttentionEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = attentionEducationOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED";
}

export function shouldBeginNexoraAttentionEducation(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraAttentionEducationActive(session)) return false;
  const conversation = conversationEducationOf(session).state;
  if (conversation !== "REVIEW" && conversation !== "COMPLETED") return false;
  const conversationMove = classifyConversationEducationMove(utterance);
  const attentionMove = classifyAttentionEducationMove(utterance);
  return conversationMove === "NEXT" || attentionMove === "NEXT" || attentionMove === "WORK";
}

export function shouldNexoraAttentionEducationOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraAttentionEducation(session, utterance)) return true;
  if (!isNexoraAttentionEducationActive(session)) return false;
  return classifyAttentionEducationMove(utterance) != null;
}

export function resolveNexoraAttentionEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraAttentionEducation();
  const move = classifyAttentionEducationMove(input.utterance);
  const education = attentionEducationOf(input.session);
  if (!isNexoraAttentionEducationActive(input.session)) {
    if (shouldBeginNexoraAttentionEducation(input.session, input.utterance)) {
      return presentStep(
        input.session,
        input.runtimeState,
        "INTRODUCING",
        `${INTRO_COPY} ${OFFER_COPY}`,
        "DATA_ENTRY",
      );
    }
    return idle(input.session, input.runtimeState);
  }
  if (move === "NOT_NOW") {
    return presentStep(
      input.session,
      input.runtimeState,
      education.state,
      "That’s fine. You can ask where something is whenever you want.",
      null,
    );
  }
  if (move === "NEXT") {
    const following = nextState(education.state);
    return presentStep(
      input.session,
      input.runtimeState,
      following,
      copyForState(following),
      following === "INTRODUCING" || following === "DATA_GUIDANCE" ? "DATA_ENTRY" : null,
    );
  }
  return presentStep(
    input.session,
    input.runtimeState,
    education.state,
    copyForState(education.state),
    education.state === "INTRODUCING" ? "DATA_ENTRY" : null,
  );
}

function presentStep(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  state: NexoraAttentionEducationState,
  response: string,
  pendingOfferTarget: NexoraGuidedAttentionTarget | null,
): NexoraGuidedEntranceTurnResult {
  const nextSession = withAttentionEducation(session, Object.freeze({ state }));
  return freezeTurn({
    session: nextSession,
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: actionsFor(state),
    move: "CONTINUE",
    presentationCue: null,
    pendingOfferTarget,
    clearGuidedAttention: false,
  });
}

function idle(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
): NexoraGuidedEntranceTurnResult {
  return freezeTurn({
    session,
    runtimeState,
    response: "",
    ownsResponse: false,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: Object.freeze([]),
    move: null,
    presentationCue: null,
    pendingOfferTarget: null,
    clearGuidedAttention: false,
  });
}

function withAttentionEducation(
  session: NexoraEntranceSession,
  attentionEducation: NexoraAttentionEducationSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      conversationEducation: Object.freeze({
        state:
          conversationEducationOf(session).state === "REVIEW"
            ? ("COMPLETED" as const)
            : conversationEducationOf(session).state,
      }),
      attentionEducation,
    }),
  });
}

function nextState(
  state: NexoraAttentionEducationState,
): NexoraAttentionEducationState {
  switch (state) {
    case "NOT_STARTED":
      return "INTRODUCING";
    case "INTRODUCING":
      return "DATA_GUIDANCE";
    case "DATA_GUIDANCE":
      return "SECOND_TARGET";
    case "SECOND_TARGET":
      return "REVIEW";
    case "REVIEW":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function copyForState(state: NexoraAttentionEducationState): string {
  switch (state) {
    case "INTRODUCING":
      return `${INTRO_COPY} ${OFFER_COPY}`;
    case "DATA_GUIDANCE":
      return "Ask where Data is, or how to add data. I’ll point to it without opening it for you.";
    case "SECOND_TARGET":
      return "You can ask about other places too — for example where objects appear, or how to go back.";
    case "REVIEW":
    case "COMPLETED":
      return REVIEW_COPY;
    default:
      return INTRO_COPY;
  }
}

function actionsFor(
  state: NexoraAttentionEducationState,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (state === "INTRODUCING") {
    return Object.freeze([
      ...NEXORA_ATTENTION_EDUCATION_INTRO_ACTIONS,
      ...NEXORA_ATTENTION_EDUCATION_OFFER_ACTIONS,
    ]);
  }
  if (state === "REVIEW" || state === "COMPLETED") {
    return NEXORA_ATTENTION_EDUCATION_INTRO_ACTIONS;
  }
  return NEXORA_ATTENTION_EDUCATION_NEXT_ACTIONS;
}

function freezeTurn(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly centerTransferred: boolean;
  readonly suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[];
  readonly move: NexoraGuidedEntranceTurnResult["move"];
  readonly presentationCue: NexoraStagePresentationCue;
  readonly pendingOfferTarget: NexoraGuidedAttentionTarget | null;
  readonly clearGuidedAttention: boolean;
}): NexoraGuidedEntranceTurnResult {
  return Object.freeze({
    session: input.session,
    response: input.response,
    ownsResponse: input.ownsResponse,
    shouldCommitRuntime: input.shouldCommitRuntime,
    nextRuntimeState: input.runtimeState,
    centerTransferred: input.centerTransferred,
    suggestedActions: Object.freeze([...input.suggestedActions]),
    move: input.move,
    presentationCue: input.presentationCue,
    pendingOfferTarget: input.pendingOfferTarget,
    clearGuidedAttention: input.clearGuidedAttention,
  });
}

export function classifyAttentionEducationMove(
  utterance: string,
): NexoraAttentionEducationMove | null {
  const normalized = utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  if (
    /^where is data/.test(normalized) ||
    /^how do i add/.test(normalized) ||
    /^show me the problems$/.test(normalized) ||
    /^how do i go back$/.test(normalized) ||
    /^where do objects appear$/.test(normalized) ||
    /^show me where i add my data$/.test(normalized)
  ) {
    return null;
  }
  if (normalized === "not now") return "NOT_NOW";
  if (
    normalized === "show me the next one" ||
    normalized === "continue" ||
    normalized === "show me something"
  ) {
    return "NEXT";
  }
  if (/how does nexora guide/.test(normalized) || /help me (?:see|find) (?:it|things)/.test(normalized)) {
    return "WORK";
  }
  return null;
}
