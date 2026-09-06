/**
 * NEX-ENT:8 — teaches the Decision Loop. Does not own Decision, Execution, Outcome, or Learning.
 */

import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_DECISION_LOOP_EDUCATION_INTRO_ACTIONS,
  NEXORA_DECISION_LOOP_EDUCATION_QUESTION_ACTIONS,
  inactiveNexoraDecisionLoopEducationSession,
  verifyNexoraDecisionLoopEducation,
  type NexoraDecisionLoopEducationSession,
  type NexoraDecisionLoopEducationState,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import { visualEducationOf } from "./nexoraVisualEducationExperience.ts";

export {
  NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY,
  NEXORA_DECISION_LOOP_EDUCATION_INTRO_ACTIONS,
  getNexoraDecisionLoopEducationIdentity,
  inactiveNexoraDecisionLoopEducationSession,
  verifyNexoraDecisionLoopEducation,
} from "./nexoraGuidedEntranceTypes.ts";

const EVIDENCE_COPY =
  "You’ve seen how Nexora understands and presents evidence. Now let me show you how that becomes a managed decision.\n\nWe’ll use one simple situation and work through it together. We start with what we know. The example observations show OTD around 90 across two months. That is evidence about delivery. It is not automatically a confirmed Problem, and it does not prove a cause.";

const ISSUE_COPY =
  "The evidence gives us a reason to investigate delivery performance. A Problem describes what needs attention. It is not the same as a cause.";

const INVESTIGATE_COPY =
  "Before choosing an action, we investigate what the evidence supports and what remains uncertain. Capacity is worth investigating because it appears alongside delivery pressure, but it isn’t established as the cause.";

const SCENARIOS_COPY =
  "A Scenario is an option we can consider. It is not yet a Decision. We can look at Temporary Capacity, External Capacity, and Do Nothing when those options are available. Appearing on the Stage does not recommend, approve, or commit anything.";

const COMPARE_COPY =
  "We compare supported differences. Cost, duration, and probability stay unknown unless evidence establishes them. Comparison does not pick a winner or commit a Decision.";

const RECOMMEND_COPY =
  "I don’t have enough comparable cost evidence to rank these as a scored list. Based on the operational pressure in the example, Temporary Capacity is the option I would investigate first. That is a recommendation, not a Decision.";

const COMMIT_COPY =
  "I can recommend. You decide. Clicking a Scenario or hearing a recommendation does not commit anything. If you want to proceed, say so through Nexora’s Decision confirmation — I won’t approve it for you.";

const EXECUTION_COPY =
  "A Decision says what we’re choosing. Execution is how we carry it out. A committed Decision does not mean work has started. Owner, progress, and blockers stay unknown unless Execution authority has them. I won’t start Execution for you.";

const OUTCOME_COPY =
  "Execution describes what we’re doing. Outcome describes what we observe afterward. Completing work does not prove success, and an improvement after a Decision does not prove the Decision caused it.";

const REVIEW_COPY =
  "That’s the Nexora decision loop: evidence → issue → scenarios → comparison → recommendation → your Decision → Execution → Outcome. I help you understand, investigate, compare, and follow the result. You remain the Decision authority.";

export type NexoraDecisionLoopEducationMove =
  | "NEXT"
  | "SHOW_ME"
  | "HOW"
  | "SKIP"
  | "KNOW"
  | "CAUSE"
  | "WHY"
  | "SCENARIO_Q"
  | "RECOMMEND"
  | "NOT_YET"
  | "DECIDED"
  | "EXEC_STARTED"
  | "HAPPENED"
  | "NOTHING"
  | "READINESS";

export function decisionLoopEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraDecisionLoopEducationSession {
  return (
    session?.guidedIntroduction?.decisionLoopEducation ??
    inactiveNexoraDecisionLoopEducationSession()
  );
}

export function isNexoraDecisionLoopEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = decisionLoopEducationOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED" && state !== "COMPLETED";
}

export function shouldBeginNexoraDecisionLoopEducation(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraDecisionLoopEducationActive(session)) return false;
  const visual = visualEducationOf(session).state;
  if (visual !== "REVIEW" && visual !== "COMPLETED") return false;
  const move = classifyDecisionLoopEducationMove(utterance);
  return (
    move === "NEXT" ||
    move === "SHOW_ME" ||
    move === "HOW" ||
    move === "SKIP"
  );
}

export function shouldNexoraDecisionLoopEducationOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraDecisionLoopEducation(session, utterance)) return true;
  if (!isNexoraDecisionLoopEducationActive(session)) return false;
  return classifyDecisionLoopEducationMove(utterance) != null;
}

export function resolveNexoraDecisionLoopEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraDecisionLoopEducation();
  const move = classifyDecisionLoopEducationMove(input.utterance);
  const education = decisionLoopEducationOf(input.session);
  if (!isNexoraDecisionLoopEducationActive(input.session)) {
    if (shouldBeginNexoraDecisionLoopEducation(input.session, input.utterance)) {
      if (move === "SKIP") {
        return present(
          input.session,
          input.runtimeState,
          { state: "SKIPPED" },
          "That’s fine. No Decision, Execution, or Outcome was created by this introduction.",
          null,
        );
      }
      return present(
        input.session,
        input.runtimeState,
        { state: "EVIDENCE" },
        EVIDENCE_COPY,
        "STAGE",
      );
    }
    return idle(input.session, input.runtimeState);
  }
  if (move === "SKIP") {
    return present(
      input.session,
      input.runtimeState,
      { state: "SKIPPED" },
      "That’s fine. No Decision, Execution, or Outcome was created by this introduction.",
      null,
    );
  }
  if (move === "NOT_YET") {
    return present(
      input.session,
      input.runtimeState,
      education.state === "EXECUTION" ? education : { state: "COMMIT" },
      education.state === "EXECUTION"
        ? "Understood. The Decision lesson is unchanged, and Execution has not started."
        : "Understood. No Decision was committed. We can keep comparing.",
      null,
    );
  }
  if (move === "KNOW") {
    return present(input.session, input.runtimeState, education, EVIDENCE_COPY, null);
  }
  if (move === "CAUSE") {
    return present(
      input.session,
      input.runtimeState,
      education.state === "EVIDENCE" ? { state: "ISSUE" } : education,
      "No. The example delivery observations are a reason to investigate. They do not prove capacity caused the situation.",
      null,
    );
  }
  if (move === "WHY") {
    const recommendWhy =
      education.state === "RECOMMEND" || education.state === "COMMIT";
    return present(
      input.session,
      input.runtimeState,
      education,
      recommendWhy
        ? "I’m not scoring these. Temporary Capacity is the first option I would investigate because the example shows delivery pressure and no established cost ranking. That still isn’t a Decision."
        : education.state === "ISSUE" || education.state === "EVIDENCE"
          ? ISSUE_COPY
          : INVESTIGATE_COPY,
      null,
    );
  }
  if (move === "SCENARIO_Q") {
    return present(input.session, input.runtimeState, education, SCENARIOS_COPY, null);
  }
  if (move === "RECOMMEND") {
    return present(
      input.session,
      input.runtimeState,
      { state: "RECOMMEND" },
      RECOMMEND_COPY,
      null,
    );
  }
  if (move === "NOTHING") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "Do Nothing is a real option to compare. I won’t invent consequences for it. If outcome evidence isn’t established, it stays unknown.",
      null,
    );
  }
  if (move === "DECIDED") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "Not through this introduction. A Decision exists only after you confirm it through Nexora’s Decision authority. I have not committed one.",
      null,
    );
  }
  if (move === "EXEC_STARTED") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "No. Execution starts only when you confirm it through Execution authority. A Decision, even a committed one, does not start the work.",
      null,
    );
  }
  if (move === "HAPPENED") {
    const observed =
      education.state === "OUTCOME" ||
      education.state === "REVIEW" ||
      education.state === "COMPLETED";
    return present(
      input.session,
      input.runtimeState,
      education,
      observed
        ? OUTCOME_COPY
        : "We have not observed an Outcome yet in this introduction. Execution describes what we are doing; Outcome is what we observe afterward. I will not invent a result.",
      null,
    );
  }
  if (move === "READINESS") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "Readiness can include owner, blockers, and milestones when Execution authority has them. I won’t invent an owner or a progress percentage.",
      null,
    );
  }
  if (move === "NEXT" || move === "SHOW_ME" || move === "HOW") {
    const following = nextState(education.state);
    return present(
      input.session,
      input.runtimeState,
      { state: following },
      copyFor(following),
      following === "EVIDENCE" || following === "SCENARIOS" ? "STAGE" : null,
    );
  }
  return present(input.session, input.runtimeState, education, copyFor(education.state), null);
}

function nextState(
  state: NexoraDecisionLoopEducationState,
): NexoraDecisionLoopEducationState {
  switch (state) {
    case "NOT_STARTED":
      return "EVIDENCE";
    case "EVIDENCE":
      return "ISSUE";
    case "ISSUE":
      return "INVESTIGATE";
    case "INVESTIGATE":
      return "SCENARIOS";
    case "SCENARIOS":
      return "COMPARE";
    case "COMPARE":
      return "RECOMMEND";
    case "RECOMMEND":
      return "COMMIT";
    case "COMMIT":
      return "EXECUTION";
    case "EXECUTION":
      return "OUTCOME";
    case "OUTCOME":
      return "REVIEW";
    case "REVIEW":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function copyFor(state: NexoraDecisionLoopEducationState): string {
  switch (state) {
    case "EVIDENCE":
      return EVIDENCE_COPY;
    case "ISSUE":
      return ISSUE_COPY;
    case "INVESTIGATE":
      return INVESTIGATE_COPY;
    case "SCENARIOS":
      return SCENARIOS_COPY;
    case "COMPARE":
      return COMPARE_COPY;
    case "RECOMMEND":
      return RECOMMEND_COPY;
    case "COMMIT":
      return COMMIT_COPY;
    case "EXECUTION":
      return EXECUTION_COPY;
    case "OUTCOME":
      return OUTCOME_COPY;
    case "REVIEW":
    case "COMPLETED":
      return REVIEW_COPY;
    default:
      return EVIDENCE_COPY;
  }
}

function present(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraDecisionLoopEducationSession,
  response: string,
  pendingOfferTarget: NexoraGuidedAttentionTarget | null,
): NexoraGuidedEntranceTurnResult {
  return freezeTurn({
    session: withDecisionLoopEducation(session, Object.freeze(education)),
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: actionsFor(education.state),
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

function withDecisionLoopEducation(
  session: NexoraEntranceSession,
  decisionLoopEducation: NexoraDecisionLoopEducationSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  const visual = visualEducationOf(session);
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      visualEducation: Object.freeze({
        state:
          visual.state === "REVIEW" || visual.state === "COMPLETED"
            ? ("COMPLETED" as const)
            : visual.state,
      }),
      decisionLoopEducation,
    }),
  });
}

function actionsFor(
  state: NexoraDecisionLoopEducationState,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (state === "EVIDENCE") return NEXORA_DECISION_LOOP_EDUCATION_INTRO_ACTIONS;
  if (state === "SKIPPED") return Object.freeze([]);
  return NEXORA_DECISION_LOOP_EDUCATION_QUESTION_ACTIONS;
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

export function classifyDecisionLoopEducationMove(
  utterance: string,
): NexoraDecisionLoopEducationMove | null {
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
    /^yes, confirm|^confirm$/.test(normalized)
  ) {
    return null;
  }
  if (normalized === "show me") return "SHOW_ME";
  if (normalized === "how does it work") return "HOW";
  if (
    normalized === "skip for now" ||
    normalized === "skip this" ||
    normalized === "skip introduction"
  ) {
    return "SKIP";
  }
  if (normalized === "not yet") return "NOT_YET";
  if (/what do we know/.test(normalized)) return "KNOW";
  if (/is (?:this|capacity) the cause|does (?:this|the evidence) prove/.test(normalized)) {
    return "CAUSE";
  }
  if (/why are we investigating|^why$|why is this a problem/.test(normalized)) {
    return "WHY";
  }
  if (/what is a scenario/.test(normalized)) return "SCENARIO_Q";
  if (/which would you recommend|what do you recommend/.test(normalized)) {
    return "RECOMMEND";
  }
  if (/what happens if we do nothing|^do nothing$/.test(normalized)) return "NOTHING";
  if (/have i decided/.test(normalized)) return "DECIDED";
  if (/has execution started/.test(normalized)) return "EXEC_STARTED";
  if (/what happened/.test(normalized)) return "HAPPENED";
  if (/execution readiness|who owns/.test(normalized)) return "READINESS";
  if (
    normalized === "show me the next one" ||
    normalized === "continue" ||
    normalized === "show me something"
  ) {
    return "NEXT";
  }
  return null;
}
