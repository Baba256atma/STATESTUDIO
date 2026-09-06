/**
 * NEX-ENT:7 — teaches Visual Intelligence. Does not own DIR:VI, evidence, or Stage.
 */

import {
  composeNexoraVisualAdvisorCopy,
  nexoraExampleOperationsVisualEvidence,
  resolveNexoraVisualView,
  type NexoraVisualResolution,
  type NexoraVisualView,
} from "@/app/lib/director/nexoraVisualIntelligence.ts";
import { resolveNexoraVisualGuidanceIntent } from "@/app/lib/manager-object/nexoraVisualGuidanceIntent.ts";
import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_VISUAL_EDUCATION_INTRO_ACTIONS,
  NEXORA_VISUAL_EDUCATION_QUESTION_ACTIONS,
  inactiveNexoraVisualEducationSession,
  verifyNexoraVisualEducation,
  type NexoraVisualEducationSession,
  type NexoraVisualEducationState,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import { dataEducationOf } from "./nexoraDataEducationExperience.ts";
import { classifyDataEducationMove } from "./nexoraDataEducationExperience.ts";

export {
  NEXORA_VISUAL_EDUCATION_BOUNDARY,
  NEXORA_VISUAL_EDUCATION_INTRO_ACTIONS,
  getNexoraVisualEducationIdentity,
  inactiveNexoraVisualEducationSession,
  verifyNexoraVisualEducation,
} from "./nexoraGuidedEntranceTypes.ts";

const PURPOSE_COPY =
  "You’ve seen how Nexora gets evidence. Now let me show you how we can make that evidence easier to understand.\n\nYou don’t need to choose a chart. Tell me what you want to understand.";

const WHAT_VISUALIZE_COPY =
  "Ask me how something changed over time, or ask me to compare supported values. I’ll choose a useful view when the evidence supports it. You don’t pick a chart type first.";

const REVIEW_COPY =
  "A view is a way to see supported evidence. It is not a Goal, KPI, Problem, Scenario, Decision, or Data Object. Closing the view does not delete the source. You can ask me what you want to understand, and I’ll choose a useful way to show it when the evidence supports it.";

const CHANGE_COPY =
  "You can ask me to show the same evidence another way when that representation is meaningful. There isn’t a chart-builder panel here.";

const CORRECT_COPY =
  "Nexora can propose a meaning, and you can correct it through the existing Data conversation. This view does not write field meaning itself.";

export type NexoraVisualEducationMove =
  | "NEXT"
  | "SHOW_ME"
  | "WHAT_VISUALIZE"
  | "SKIP"
  | "TREND"
  | "COMPARE"
  | "INSPECT"
  | "LIMITS"
  | "DISMISS"
  | "CORRECT"
  | "UNRELATED";

export function visualEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraVisualEducationSession {
  return (
    session?.guidedIntroduction?.visualEducation ??
    inactiveNexoraVisualEducationSession()
  );
}

export function isNexoraVisualEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = visualEducationOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED" && state !== "COMPLETED";
}

export function shouldBeginNexoraVisualEducation(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraVisualEducationActive(session)) return false;
  const data = dataEducationOf(session).state;
  if (data !== "REVIEW" && data !== "COMPLETED") return false;
  const move = classifyVisualEducationMove(utterance);
  return (
    move === "NEXT" ||
    move === "SHOW_ME" ||
    move === "WHAT_VISUALIZE" ||
    move === "TREND" ||
    move === "COMPARE" ||
    move === "SKIP"
  );
}

export function shouldNexoraVisualEducationOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraVisualEducation(session, utterance)) return true;
  if (!isNexoraVisualEducationActive(session)) return false;
  return classifyVisualEducationMove(utterance) != null;
}

export function resolveNexoraVisualEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraVisualEducation();
  const move = classifyVisualEducationMove(input.utterance);
  const education = visualEducationOf(input.session);
  if (!isNexoraVisualEducationActive(input.session)) {
    if (shouldBeginNexoraVisualEducation(input.session, input.utterance)) {
      if (move === "SKIP") {
        return present(
          input.session,
          input.runtimeState,
          { state: "SKIPPED" },
          "That’s fine. No visual was kept as business truth.",
          null,
          undefined,
          true,
        );
      }
      if (move === "TREND" || move === "COMPARE") {
        return resolveVisualRequest(input, { state: "PURPOSE" }, move);
      }
      return present(
        input.session,
        input.runtimeState,
        { state: "PURPOSE" },
        PURPOSE_COPY,
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
      "That’s fine. No visual was kept as business truth.",
      null,
      undefined,
      true,
    );
  }
  if (move === "DISMISS") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "I’ve put the view away. The source and evidence are unchanged.",
      null,
      undefined,
      true,
    );
  }
  if (move === "WHAT_VISUALIZE") {
    return present(
      input.session,
      input.runtimeState,
      { state: "PURPOSE" },
      WHAT_VISUALIZE_COPY,
      "STAGE",
    );
  }
  if (move === "SHOW_ME" && education.state === "PURPOSE") {
    return present(
      input.session,
      input.runtimeState,
      education,
      "When you ask me to show something, I can present the visual here on the Stage. Ask me how delivery changed over time.",
      "STAGE",
    );
  }
  if (move === "CORRECT") {
    return present(input.session, input.runtimeState, education, CORRECT_COPY, null);
  }
  if (move === "TREND" || move === "COMPARE" || move === "LIMITS") {
    return resolveVisualRequest(input, education, move);
  }
  if (move === "INSPECT") {
    return inspectActive(input, education);
  }
  if (move === "NEXT") {
    const next = nextState(education.state);
    if (next === "REVIEW" || next === "COMPLETED") {
      return present(
        input.session,
        input.runtimeState,
        { state: next === "REVIEW" ? "REVIEW" : "COMPLETED" },
        REVIEW_COPY,
        null,
      );
    }
    return present(
      input.session,
      input.runtimeState,
      { state: next },
      copyFor(next),
      next === "PURPOSE" ? "STAGE" : null,
    );
  }
  return present(input.session, input.runtimeState, education, PURPOSE_COPY, "STAGE");
}

function resolveVisualRequest(
  input: {
    readonly utterance: string;
    readonly session: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
  },
  education: NexoraVisualEducationSession,
  move: NexoraVisualEducationMove,
): NexoraGuidedEntranceTurnResult {
  const intent = resolveNexoraVisualGuidanceIntent({ utterance: input.utterance });
  const evidence = nexoraExampleOperationsVisualEvidence();
  const purpose =
    move === "COMPARE" || intent.purpose === "COMPARE"
      ? "COMPARE"
      : intent.purpose === "NONE"
        ? "TREND"
        : intent.purpose;
  const resolution = resolveNexoraVisualView({
    purpose,
    evidence,
    subjectId: intent.subjectId,
    requestedMonths: intent.requestedMonths,
    requestedRepresentation: intent.requestedRepresentation,
    comparableIds: intent.comparableIds,
  });
  const lessonState = lessonStateFor(resolution, education.state, intent.requestedMonths);
  const copy = composeLessonCopy(resolution, intent.inspect);
  return present(
    input.session,
    input.runtimeState,
    { state: lessonState },
    copy,
    "STAGE",
    resolution.status === "SUPPORTED" ? resolution.view : undefined,
    false,
  );
}

function inspectActive(
  input: {
    readonly utterance: string;
    readonly session: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
  },
  education: NexoraVisualEducationSession,
): NexoraGuidedEntranceTurnResult {
  const intent = resolveNexoraVisualGuidanceIntent({ utterance: input.utterance });
  if (intent.inspect === "CHANGE") {
    return present(input.session, input.runtimeState, education, CHANGE_COPY, null);
  }
  const evidence = nexoraExampleOperationsVisualEvidence();
  const resolution = resolveNexoraVisualView({
    purpose: education.state === "COMPARE" ? "COMPARE" : "TREND",
    evidence,
    subjectId: "delivery",
    comparableIds:
      education.state === "COMPARE" ? Object.freeze(["otd-periods", "otd-periods"]) : null,
  });
  const kind =
    intent.inspect === "WHY"
      ? "WHY"
      : intent.inspect === "PROVENANCE"
        ? "PROVENANCE"
        : intent.inspect === "CAUSE"
          ? "CAUSE"
          : intent.inspect === "DECISION"
            ? "DECISION"
            : "EXPLAIN";
  const nextStateValue =
    kind === "CAUSE" || kind === "DECISION"
      ? ("LIMITS" as const)
      : education.state;
  return present(
    input.session,
    input.runtimeState,
    { state: nextStateValue },
    composeNexoraVisualAdvisorCopy(resolution, kind),
    null,
    resolution.status === "SUPPORTED" ? resolution.view : undefined,
  );
}

function lessonStateFor(
  resolution: NexoraVisualResolution,
  current: NexoraVisualEducationState,
  requestedMonths: number | null,
): NexoraVisualEducationState {
  if (requestedMonths && requestedMonths > 2) return "LIMITS";
  if (resolution.status === "SUPPORTED" && resolution.view.purpose === "COMPARE") {
    return "COMPARE";
  }
  if (resolution.status === "SUPPORTED") return "TREND";
  if (resolution.status === "INSUFFICIENT_EVIDENCE") return "LIMITS";
  if (resolution.status === "AMBIGUOUS") {
    return current === "NOT_STARTED" ? "PURPOSE" : current;
  }
  return current === "NOT_STARTED" ? "PURPOSE" : current;
}

function composeLessonCopy(
  resolution: NexoraVisualResolution,
  inspect: ReturnType<typeof resolveNexoraVisualGuidanceIntent>["inspect"],
): string {
  if (inspect) return composeNexoraVisualAdvisorCopy(resolution, inspect === "EXPLAIN" ? "EXPLAIN" : inspect === "WHY" ? "WHY" : "PRESENT");
  if (resolution.status === "SUPPORTED" && resolution.view.purpose === "TREND") {
    return `${composeNexoraVisualAdvisorCopy(resolution, "PRESENT")} ${composeNexoraVisualAdvisorCopy(resolution, "EXPLAIN")}`;
  }
  return composeNexoraVisualAdvisorCopy(resolution, "PRESENT");
}

function present(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraVisualEducationSession,
  response: string,
  pendingOfferTarget: NexoraGuidedAttentionTarget | null,
  visualViewRequest?: NexoraVisualView,
  dismissVisualView = false,
): NexoraGuidedEntranceTurnResult {
  const nextSession = withVisualEducation(session, Object.freeze(education));
  return freezeTurn({
    session: nextSession,
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
    visualViewRequest,
    dismissVisualView,
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

function withVisualEducation(
  session: NexoraEntranceSession,
  visualEducation: NexoraVisualEducationSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  const data = dataEducationOf(session);
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      dataEducation: Object.freeze({
        state:
          data.state === "REVIEW" || data.state === "COMPLETED"
            ? ("COMPLETED" as const)
            : data.state,
        examplePath: data.examplePath,
      }),
      visualEducation,
    }),
  });
}

function nextState(state: NexoraVisualEducationState): NexoraVisualEducationState {
  switch (state) {
    case "NOT_STARTED":
      return "PURPOSE";
    case "PURPOSE":
      return "TREND";
    case "TREND":
      return "COMPARE";
    case "COMPARE":
      return "LIMITS";
    case "LIMITS":
      return "REVIEW";
    case "REVIEW":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function copyFor(state: NexoraVisualEducationState): string {
  if (state === "PURPOSE") return PURPOSE_COPY;
  if (state === "REVIEW" || state === "COMPLETED") return REVIEW_COPY;
  return PURPOSE_COPY;
}

function actionsFor(
  state: NexoraVisualEducationState,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (state === "PURPOSE") return NEXORA_VISUAL_EDUCATION_INTRO_ACTIONS;
  if (state === "SKIPPED") return Object.freeze([]);
  return NEXORA_VISUAL_EDUCATION_QUESTION_ACTIONS;
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
  readonly visualViewRequest?: NexoraVisualView;
  readonly dismissVisualView?: boolean;
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
    visualViewRequest: input.visualViewRequest,
    dismissVisualView: input.dismissVisualView === true,
  });
}

export function classifyVisualEducationMove(
  utterance: string,
): NexoraVisualEducationMove | null {
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
    /^show me where/.test(normalized)
  ) {
    return null;
  }
  if (normalized === "show me") return "SHOW_ME";
  if (normalized === "what can i visualize") return "WHAT_VISUALIZE";
  if (
    normalized === "skip for now" ||
    normalized === "skip this" ||
    normalized === "skip introduction"
  ) {
    return "SKIP";
  }
  if (/close the view|put the view away|dismiss the (?:view|chart)/.test(normalized)) {
    return "DISMISS";
  }
  if (/last six months|six months/.test(normalized)) return "LIMITS";
  if (/compare /.test(normalized)) return "COMPARE";
  if (
    /over time|how has delivery changed|show me delivery|trend|what does this data look like/.test(
      normalized,
    )
  ) {
    return "TREND";
  }
  if (
    /what does this show|why did you choose|why this visual|what data is this using|does this prove|should we choose scenario|can i change the/.test(
      normalized,
    )
  ) {
    return "INSPECT";
  }
  if (/^no, that field|^no that field isn't backlog/.test(normalized)) return "CORRECT";
  if (normalized === "show me the next one" || normalized === "continue") return "NEXT";
  if (classifyDataEducationMove(utterance) === "FIELD") return null;
  return null;
}
