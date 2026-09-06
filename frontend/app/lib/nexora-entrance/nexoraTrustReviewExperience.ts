/**
 * NEX-ENT:9 — Trust + Quick Review. Does not score trust, write semantics, or start ENT:10.
 */

import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_TRUST_REVIEW_INTRO_ACTIONS,
  NEXORA_TRUST_REVIEW_Q1_ACTIONS,
  NEXORA_TRUST_REVIEW_Q2_ACTIONS,
  NEXORA_TRUST_REVIEW_Q3_ACTIONS,
  NEXORA_TRUST_REVIEW_QUESTION_ACTIONS,
  NEXORA_PERSONAL_DEMO_HANDOFF_INTRO_ACTIONS,
  inactiveNexoraTrustReviewSession,
  verifyNexoraTrustReview,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraStagePresentationCue,
  type NexoraTrustReviewSession,
  type NexoraTrustReviewState,
} from "./nexoraGuidedEntranceTypes.ts";
import { decisionLoopEducationOf } from "./nexoraDecisionLoopEducationExperience.ts";

export {
  NEXORA_TRUST_REVIEW_BOUNDARY,
  NEXORA_TRUST_REVIEW_INTRO_ACTIONS,
  getNexoraTrustReviewIdentity,
  inactiveNexoraTrustReviewSession,
  verifyNexoraTrustReview,
} from "./nexoraGuidedEntranceTypes.ts";

const SOURCE_COPY =
  "You’ve now seen how Nexora works. Before we make this workspace yours, let me show you the rules I follow when I advise you.\n\nWhen data matters, I should be able to tell you where it came from. The example observations come from the example operations source used in this introduction — not your business library. Knowing the source does not automatically make every interpretation correct.";

const UNCERTAINTY_COPY =
  "If I don’t know what something means, I should not pretend I do. Sometimes the most trustworthy answer is: I don’t know yet. I can see a generic value field in the example, but I need its business meaning before I rely on it. A likely meaning, such as OTD in the example, is still different from knowing.";

const EVIDENCE_COPY =
  "Evidence can tell us what is happening and what deserves investigation. It does not automatically prove why it happened. A chart can make a pattern easier to see. The pattern still doesn’t prove causality. An improvement after a Decision also doesn’t prove the Decision caused it.";

const EXPLANATION_COPY =
  "If I recommend something, you should be able to ask why. A recommendation is an advised next move based on available evidence and uncertainty. It is not a fact. If the evidence isn’t strong enough, I may tell you I can’t recommend one option yet.";

const AUTHORITY_COPY =
  "I can investigate, compare, and recommend. You decide. Focus, a click, a comparison, or a recommendation is not a Decision. Explicit commitment is. A Decision also doesn’t automatically start Execution. I may surface issues and suggest next steps — initiative is not unauthorized commitment.";

const CONTRACT_AND_Q1 =
  "Here’s how I’ll work with you: I’ll show my evidence when I can, tell you when I’m uncertain, explain my recommendations, avoid treating patterns as causes, and leave commitment with you.\n\nQuick review. If I’m not sure what a field means, what should I do?";

const Q2_COPY =
  "If two things move together, does that prove one caused the other?";

const Q3_COPY =
  "If I recommend a Scenario, is it already a Decision?";

const READY_COPY =
  "Good. You now know the most important part of Nexora: how to work with it without confusing advice with truth or recommendation with authority. I should show you what I know, what I’m inferring, and what still needs your judgment.\n\nYou’re ready to make this workspace yours.";

export type NexoraTrustReviewMove =
  | "NEXT"
  | "SHOW_ME"
  | "RULES"
  | "SKIP"
  | "SOURCE_Q"
  | "MEANING"
  | "LIKELY"
  | "DONT_KNOW"
  | "WHY_ASK"
  | "CAUSE"
  | "OUTCOME_CAUSE"
  | "WHY_REC"
  | "DECIDE_FOR"
  | "ASK"
  | "GUESS"
  | "YES"
  | "NO"
  | "I_DECIDE";

export function trustReviewOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraTrustReviewSession {
  return session?.guidedIntroduction?.trustReview ?? inactiveNexoraTrustReviewSession();
}

export function isNexoraTrustReviewActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = trustReviewOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED" && state !== "COMPLETED";
}

export function shouldBeginNexoraTrustReview(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraTrustReviewActive(session)) return false;
  const loop = decisionLoopEducationOf(session).state;
  if (loop !== "REVIEW" && loop !== "COMPLETED") return false;
  const move = classifyTrustReviewMove(utterance);
  return move === "NEXT" || move === "SHOW_ME" || move === "RULES" || move === "SKIP";
}

export function shouldNexoraTrustReviewOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraTrustReview(session, utterance)) return true;
  if (!isNexoraTrustReviewActive(session)) return false;
  return classifyTrustReviewMove(utterance) != null;
}

export function resolveNexoraTrustReviewTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraTrustReview();
  const move = classifyTrustReviewMove(input.utterance);
  const education = trustReviewOf(input.session);
  if (!isNexoraTrustReviewActive(input.session)) {
    if (shouldBeginNexoraTrustReview(input.session, input.utterance)) {
      if (move === "SKIP") {
        return present(
          input.session,
          input.runtimeState,
          { state: "SKIPPED", reviewStep: 0 },
          "That’s fine. We can make this workspace yours when you’re ready. Nothing about trust, data, or Decisions was changed by skipping this review.",
        );
      }
      return present(
        input.session,
        input.runtimeState,
        { state: "SOURCE", reviewStep: 0 },
        SOURCE_COPY,
      );
    }
    return idle(input.session, input.runtimeState);
  }
  if (move === "SKIP") {
    return present(
      input.session,
      input.runtimeState,
      { state: "SKIPPED", reviewStep: 0 },
      "That’s fine. We can make this workspace yours when you’re ready. Nothing about trust, data, or Decisions was changed by skipping this review.",
    );
  }
  if (move === "SOURCE_Q") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "The example delivery observations come from the example operations source used in this introduction. That is provenance, not confirmation that every interpretation is correct.",
    );
  }
  if (move === "MEANING" || move === "DONT_KNOW") {
    return present(
      input.session,
      input.runtimeState,
      education.state === "SOURCE" ? { state: "UNCERTAINTY", reviewStep: 0 } : education,
      "I don’t know the business meaning of that generic value field yet. I can see the field, but I need its meaning before I rely on it. Keeping it unresolved is the trustworthy move.",
    );
  }
  if (move === "LIKELY") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "OTD in the example is a likely meaning. That is still different from knowing. I will not treat it as confirmed just because we are reviewing trust.",
    );
  }
  if (move === "WHY_ASK") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "Because these rules are how I avoid turning uncertainty into false confidence or advice into an automatic Decision.",
    );
  }
  if (move === "CAUSE") {
    return present(
      input.session,
      input.runtimeState,
      education.state === "UNCERTAINTY" ? { state: "EVIDENCE", reviewStep: 0 } : education,
      "No. If capacity and delivery move together, that is a reason to investigate. It does not prove capacity caused the situation.",
    );
  }
  if (move === "OUTCOME_CAUSE") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "No. An improvement after a Decision and Execution does not, by itself, prove they caused it.",
    );
  }
  if (move === "WHY_REC") {
    return present(
      input.session,
      input.runtimeState,
      education.state === "EVIDENCE" || education.state === "EXPLANATION"
        ? { state: "EXPLANATION", reviewStep: 0 }
        : education,
      "I’m not scoring options. Temporary Capacity was the first option I would investigate because the example shows delivery pressure and no established cost ranking. That was a recommendation, not a fact and not a Decision.",
    );
  }
  if (move === "DECIDE_FOR") {
    return present(
      input.session,
      input.runtimeState,
      education.state === "EXPLANATION" || education.state === "AUTHORITY"
        ? { state: "AUTHORITY", reviewStep: 0 }
        : education,
      "I can recommend an option and explain why. The commitment remains yours. I will not decide for you.",
    );
  }
  if (education.state === "QUICK_REVIEW") {
    const answered = answerReview(education, move);
    if (answered) {
      return present(input.session, input.runtimeState, answered.education, answered.response);
    }
  }
  if (move === "NEXT" || move === "SHOW_ME" || move === "RULES") {
    if (education.state === "READY") {
      return present(
        input.session,
        input.runtimeState,
        { state: "COMPLETED", reviewStep: 3 },
        READY_COPY,
      );
    }
    if (education.state === "QUICK_REVIEW") {
      return present(input.session, input.runtimeState, education, promptFor(education.reviewStep));
    }
    const following = nextState(education.state);
    const reviewStep = following === "QUICK_REVIEW" ? (1 as const) : (0 as const);
    return present(
      input.session,
      input.runtimeState,
      { state: following, reviewStep },
      copyFor(following, reviewStep),
    );
  }
  return present(
    input.session,
    input.runtimeState,
    education,
    copyFor(education.state, education.reviewStep),
  );
}

function answerReview(
  education: NexoraTrustReviewSession,
  move: NexoraTrustReviewMove | null,
): { readonly education: NexoraTrustReviewSession; readonly response: string } | null {
  const step = education.reviewStep;
  if (step === 1 && move === "ASK") {
    return {
      education: { state: "QUICK_REVIEW", reviewStep: 2 },
      response: `I’ll ask or keep it unresolved rather than treat a guess as a fact.\n\n${Q2_COPY}`,
    };
  }
  if (step === 1 && (move === "GUESS" || move === "YES")) {
    return {
      education: { state: "QUICK_REVIEW", reviewStep: 2 },
      response: `I may suggest a likely meaning, but I should keep it provisional or ask rather than treat it as confirmed.\n\n${Q2_COPY}`,
    };
  }
  if (step === 2 && move === "NO") {
    return {
      education: { state: "QUICK_REVIEW", reviewStep: 3 },
      response: `No. Moving together is not proof of cause.\n\n${Q3_COPY}`,
    };
  }
  if (step === 2 && move === "YES") {
    return {
      education: { state: "QUICK_REVIEW", reviewStep: 3 },
      response: `Moving together can deserve investigation, but it does not prove one caused the other.\n\n${Q3_COPY}`,
    };
  }
  if (step === 3 && (move === "NO" || move === "I_DECIDE")) {
    return {
      education: { state: "READY", reviewStep: 3 },
      response: READY_COPY,
    };
  }
  if (step === 3 && (move === "YES" || move === "GUESS")) {
    return {
      education: { state: "READY", reviewStep: 3 },
      response: `A recommendation is not already a Decision. You still decide.\n\n${READY_COPY}`,
    };
  }
  return null;
}

function nextState(state: NexoraTrustReviewState): NexoraTrustReviewState {
  switch (state) {
    case "NOT_STARTED":
      return "SOURCE";
    case "SOURCE":
      return "UNCERTAINTY";
    case "UNCERTAINTY":
      return "EVIDENCE";
    case "EVIDENCE":
      return "EXPLANATION";
    case "EXPLANATION":
      return "AUTHORITY";
    case "AUTHORITY":
      return "QUICK_REVIEW";
    case "QUICK_REVIEW":
      return "QUICK_REVIEW";
    case "READY":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function promptFor(step: NexoraTrustReviewSession["reviewStep"]): string {
  if (step === 2) return Q2_COPY;
  if (step === 3) return Q3_COPY;
  return CONTRACT_AND_Q1;
}

function copyFor(
  state: NexoraTrustReviewState,
  reviewStep: NexoraTrustReviewSession["reviewStep"],
): string {
  switch (state) {
    case "SOURCE":
      return SOURCE_COPY;
    case "UNCERTAINTY":
      return UNCERTAINTY_COPY;
    case "EVIDENCE":
      return EVIDENCE_COPY;
    case "EXPLANATION":
      return EXPLANATION_COPY;
    case "AUTHORITY":
      return AUTHORITY_COPY;
    case "QUICK_REVIEW":
      return promptFor(reviewStep);
    case "READY":
    case "COMPLETED":
      return READY_COPY;
    default:
      return SOURCE_COPY;
  }
}

function present(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraTrustReviewSession,
  response: string,
): NexoraGuidedEntranceTurnResult {
  return freezeTurn({
    session: withTrustReview(session, Object.freeze(education)),
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: actionsFor(education),
    move: "CONTINUE",
    presentationCue: null,
    pendingOfferTarget: null,
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

function withTrustReview(
  session: NexoraEntranceSession,
  trustReview: NexoraTrustReviewSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  const loop = decisionLoopEducationOf(session);
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      decisionLoopEducation: Object.freeze({
        state:
          loop.state === "REVIEW" || loop.state === "COMPLETED"
            ? ("COMPLETED" as const)
            : loop.state,
      }),
      trustReview,
    }),
  });
}

function actionsFor(
  education: NexoraTrustReviewSession,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (education.state === "SOURCE") return NEXORA_TRUST_REVIEW_INTRO_ACTIONS;
  if (education.state === "SKIPPED" || education.state === "COMPLETED") {
    return Object.freeze([]);
  }
  if (education.state === "READY") return NEXORA_PERSONAL_DEMO_HANDOFF_INTRO_ACTIONS;
  if (education.state === "QUICK_REVIEW") {
    if (education.reviewStep === 2) return NEXORA_TRUST_REVIEW_Q2_ACTIONS;
    if (education.reviewStep === 3) return NEXORA_TRUST_REVIEW_Q3_ACTIONS;
    return NEXORA_TRUST_REVIEW_Q1_ACTIONS;
  }
  return NEXORA_TRUST_REVIEW_QUESTION_ACTIONS;
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

export function classifyTrustReviewMove(utterance: string): NexoraTrustReviewMove | null {
  const normalized = utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  if (
    /^show me the problems$/.test(normalized) ||
    /^show capacity problem/.test(normalized) ||
    /^where is data/.test(normalized) ||
    /^show me where/.test(normalized) ||
    /over time|show me delivery over time/.test(normalized) ||
    /^approve/.test(normalized) ||
    /^start (?:the )?execution/.test(normalized) ||
    /^compare (?:these|them|the scenarios)/.test(normalized) ||
    /^explain this$/.test(normalized)
  ) {
    return null;
  }
  if (
    normalized === "skip review" ||
    normalized === "skip for now" ||
    normalized === "skip this"
  ) {
    return "SKIP";
  }
  if (normalized === "what rules" || normalized === "what rules?") return "RULES";
  if (normalized === "show me") return "SHOW_ME";
  if (
    normalized === "show me the next one" ||
    normalized === "continue" ||
    normalized === "show me something"
  ) {
    return "NEXT";
  }
  if (/where did this (?:information )?come from/.test(normalized)) return "SOURCE_Q";
  if (/what does (?:this|value|the field) mean/.test(normalized)) return "MEANING";
  if (/are you sure|how sure/.test(normalized)) return "LIKELY";
  if (/^i don't know$|^i do not know$/.test(normalized)) return "DONT_KNOW";
  if (/why are you asking/.test(normalized)) return "WHY_ASK";
  if (
    /move together|prove(?:s)? (?:capacity )?caus|correlation isn't cause|correlation is not cause/.test(
      normalized,
    )
  ) {
    return "CAUSE";
  }
  if (/improved after|did (?:our |the )?decision cause/.test(normalized)) {
    return "OUTCOME_CAUSE";
  }
  if (/why did you recommend|why that/.test(normalized)) return "WHY_REC";
  if (/can you decide for me/.test(normalized)) return "DECIDE_FOR";
  if (/ask me|keep (?:it )?unresolved|you should ask/.test(normalized)) return "ASK";
  if (/guess|most likely meaning/.test(normalized)) return "GUESS";
  if (/^no, i still decide$|^i (?:still )?decide$|^i decide$/.test(normalized)) {
    return "I_DECIDE";
  }
  if (/^no$/.test(normalized)) return "NO";
  if (/^yes$/.test(normalized)) return "YES";
  return null;
}
