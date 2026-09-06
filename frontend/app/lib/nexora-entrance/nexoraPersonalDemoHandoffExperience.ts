/**
 * NEX-ENT:10 — Personal Demo Handoff. Orchestrates; does not own identity, Goal, Data, or BCA.
 */

import {
  createInitialNexoraMVPObjectInteractionState,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_PERSONAL_DEMO_HANDOFF_CONTEXT_ACTIONS,
  NEXORA_PERSONAL_DEMO_HANDOFF_DATA_ACTIONS,
  NEXORA_PERSONAL_DEMO_HANDOFF_INTRO_ACTIONS,
  inactiveNexoraPersonalDemoHandoffSession,
  verifyNexoraPersonalDemoHandoff,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraPersonalDemoHandoffSession,
  type NexoraPersonalDemoHandoffState,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import { trustReviewOf } from "./nexoraTrustReviewExperience.ts";
import {
  conversationContinuityOf,
  recordContinuity,
} from "./nexoraEntranceConversationContinuity.ts";

export {
  NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY,
  NEXORA_PERSONAL_DEMO_HANDOFF_INTRO_ACTIONS,
  getNexoraPersonalDemoHandoffIdentity,
  inactiveNexoraPersonalDemoHandoffSession,
  verifyNexoraPersonalDemoHandoff,
} from "./nexoraGuidedEntranceTypes.ts";

const INTRO_COPY =
  "You’ve learned the important parts of Nexora. Now let’s make this workspace yours.\n\nI only need a little context to get started. I’ll ask only for what is still missing.";

const NAME_COPY =
  "What should I call you? Say it in your own words — for example, I’m Alex. I run operations for a logistics company.";

const WORK_COPY =
  "What are we managing here? A business, a project, both, or you’re not sure — not sure is a valid answer.";

const WORKSPACE_COPY =
  "If this work has a name, you can tell me using Nexora’s identity phrasing — for example, the company is BAHA Doors. I won’t rename Problems or other Objects.";

const GOAL_COPY =
  "What would you most like to improve or achieve? I’ll use Nexora’s Goal understanding. I won’t invent a target number.";

const DATA_COPY =
  "Would you like to use your own data now, or start with the context we have? Data is optional. I won’t open a file picker for you.";

const SKIP_COPY =
  "That’s fine. This is your workspace. I didn’t invent identity, a Goal, or Data to finish the introduction.";

const HOW_DATA_COPY =
  "You choose the file when you’re ready. I’ll highlight where Data lives. Preview stays pending until you explicitly Use it. I won’t treat example introduction data as yours.";

export type NexoraPersonalDemoHandoffMove =
  | "START"
  | "NEED"
  | "SKIP"
  | "NEXT"
  | "UNSURE"
  | "BOTH"
  | "USE_DATA"
  | "NO_DATA"
  | "HOW_DATA";

export function personalDemoHandoffOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraPersonalDemoHandoffSession {
  return (
    session?.guidedIntroduction?.personalDemoHandoff ??
    inactiveNexoraPersonalDemoHandoffSession()
  );
}

export function isNexoraPersonalDemoHandoffActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = personalDemoHandoffOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED" && state !== "COMPLETED";
}

export function isNexoraPersonalDemoHandoffFinished(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = personalDemoHandoffOf(session).state;
  return state === "COMPLETED" || state === "SKIPPED";
}

export function shouldBeginNexoraPersonalDemoHandoff(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraPersonalDemoHandoffActive(session)) return false;
  if (isNexoraPersonalDemoHandoffFinished(session)) return false;
  const trust = trustReviewOf(session).state;
  if (trust !== "READY" && trust !== "COMPLETED") return false;
  const move = classifyPersonalDemoHandoffMove(utterance);
  return move === "START" || move === "NEED" || move === "SKIP" || move === "NEXT";
}

export function shouldNexoraPersonalDemoHandoffOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraPersonalDemoHandoffFinished(session)) return false;
  if (shouldBeginNexoraPersonalDemoHandoff(session, utterance)) return true;
  if (!isNexoraPersonalDemoHandoffActive(session)) return false;
  return classifyPersonalDemoHandoffMove(utterance) != null;
}

export function resolveNexoraPersonalDemoHandoffTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraPersonalDemoHandoff();
  const move = classifyPersonalDemoHandoffMove(input.utterance);
  const education = personalDemoHandoffOf(input.session);
  if (!isNexoraPersonalDemoHandoffActive(input.session)) {
    if (shouldBeginNexoraPersonalDemoHandoff(input.session, input.utterance)) {
      if (move === "SKIP") {
        return present(input.session, input.runtimeState, { state: "SKIPPED" }, SKIP_COPY, null, true);
      }
      return present(input.session, input.runtimeState, { state: "INTRO" }, INTRO_COPY, null, false);
    }
    return idle(input.session, input.runtimeState);
  }
  if (move === "SKIP") {
    return present(input.session, input.runtimeState, { state: "SKIPPED" }, SKIP_COPY, null, true);
  }
  if (move === "UNSURE") {
    const following = nextMissing(input.session, "WORK_CONTEXT");
    return present(
      input.session,
      input.runtimeState,
      { state: following },
      "Unknown is valid. We can keep going with only what is established.\n\n" +
        copyFor(following, input.session),
      null,
      false,
    );
  }
  if (move === "BOTH") {
    const following = nextMissing(input.session, "WORK_CONTEXT");
    return present(
      input.session,
      input.runtimeState,
      { state: following },
      "I’ll treat this as mixed business and project work until more is confirmed. That isn’t a new context store — just how I’ll talk with you.\n\n" +
        copyFor(following, input.session),
      null,
      false,
    );
  }
  if (move === "HOW_DATA") {
    return present(
      input.session,
      input.runtimeState,
      { state: "DATA_CHOICE" },
      HOW_DATA_COPY,
      "DATA_ENTRY",
      false,
    );
  }
  if (move === "USE_DATA") {
    return present(
      input.session,
      input.runtimeState,
      { state: "COMPLETED" },
      completeCopy(input.session) +
        "\n\nWhen you’re ready, use the Data control. I won’t open the file picker for you. Tell me what you want to work on.",
      "DATA_ENTRY",
      false,
    );
  }
  if (move === "NO_DATA") {
    return present(
      input.session,
      input.runtimeState,
      { state: "COMPLETED" },
      completeCopy(input.session) +
        "\n\nWe haven’t connected your data yet, so I’ll keep evidence limits explicit. Tell me what you want to work on.",
      null,
      true,
    );
  }
  if (move === "START" || move === "NEED" || move === "NEXT") {
    if (education.state === "HANDOFF" || education.state === "READY") {
      return present(
        input.session,
        input.runtimeState,
        { state: "COMPLETED" },
        completeCopy(input.session) + "\n\nTell me what you want to work on.",
        null,
        true,
      );
    }
    const following = nextMissing(input.session, education.state);
    return present(
      input.session,
      input.runtimeState,
      { state: following },
      copyFor(following, input.session),
      null,
      following === "COMPLETED",
    );
  }
  return present(
    input.session,
    input.runtimeState,
    education,
    copyFor(education.state, input.session),
    null,
    false,
  );
}

function hasName(session: NexoraEntranceSession): boolean {
  return Boolean(session.identity.managerName || session.identity.organizationName);
}

function hasContextKind(session: NexoraEntranceSession): boolean {
  return Boolean(session.identity.contextKind);
}

function hasGoal(session: NexoraEntranceSession): boolean {
  return Boolean(
    session.goalDiscovery?.context.managerConfirmed && session.goalDiscovery.object,
  );
}

function nextMissing(
  session: NexoraEntranceSession,
  from: NexoraPersonalDemoHandoffState,
): NexoraPersonalDemoHandoffState {
  if (from === "INTRO" || from === "NOT_STARTED") {
    if (!hasName(session)) return "MANAGER_CONTEXT";
    if (!hasContextKind(session)) return "WORK_CONTEXT";
    if (!session.identity.organizationName) return "WORKSPACE_IDENTITY";
    if (!hasGoal(session)) return "GOAL";
    return "DATA_CHOICE";
  }
  if (from === "MANAGER_CONTEXT") {
    if (!hasContextKind(session)) return "WORK_CONTEXT";
    if (!session.identity.organizationName) return "WORKSPACE_IDENTITY";
    if (!hasGoal(session)) return "GOAL";
    return "DATA_CHOICE";
  }
  if (from === "WORK_CONTEXT") {
    if (!session.identity.organizationName) return "WORKSPACE_IDENTITY";
    if (!hasGoal(session)) return "GOAL";
    return "DATA_CHOICE";
  }
  if (from === "WORKSPACE_IDENTITY") {
    if (!hasGoal(session)) return "GOAL";
    return "DATA_CHOICE";
  }
  if (from === "GOAL") return "DATA_CHOICE";
  if (from === "DATA_CHOICE") return "HANDOFF";
  if (from === "READY" || from === "HANDOFF") return "COMPLETED";
  return from;
}

function copyFor(
  state: NexoraPersonalDemoHandoffState,
  session: NexoraEntranceSession,
): string {
  if (state === "INTRO") return INTRO_COPY;
  if (state === "MANAGER_CONTEXT") return NAME_COPY;
  if (state === "WORK_CONTEXT") return WORK_COPY;
  if (state === "WORKSPACE_IDENTITY") return WORKSPACE_COPY;
  if (state === "GOAL") {
    return hasGoal(session)
      ? `We already have ${session.goalDiscovery?.object?.displayName ?? "a Goal"}. We can start from there.\n\n${DATA_COPY}`
      : GOAL_COPY;
  }
  if (state === "DATA_CHOICE") return DATA_COPY;
  if (state === "COMPLETED" || state === "HANDOFF" || state === "READY") {
    return completeCopy(session);
  }
  return INTRO_COPY;
}

function completeCopy(session: NexoraEntranceSession): string {
  const name = session.identity.managerName;
  const goal = session.goalDiscovery?.object?.displayName;
  const known: string[] = [];
  if (name) known.push(`I’ll work with you, ${name}.`);
  else known.push("I don’t have a manager name yet.");
  if (session.identity.contextKind) {
    known.push(`Work context: ${session.identity.contextKind}.`);
  } else {
    known.push("Work kind is still unknown.");
  }
  if (goal) known.push(`Your current Goal is ${goal}.`);
  else known.push("No Goal has been established yet.");
  known.push(
    "You have no accepted data source of your own yet. Example introduction data is not your Data Library.",
  );
  return `This is your workspace now.\n\n${known.join(" ")}`;
}

function present(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraPersonalDemoHandoffSession,
  response: string,
  pendingOfferTarget: NexoraGuidedAttentionTarget | null,
  clearGuidedAttention: boolean,
): NexoraGuidedEntranceTurnResult {
  return freezeTurn({
    session: withHandoff(session, Object.freeze(education)),
    runtimeState:
      education.state === "COMPLETED" || education.state === "SKIPPED"
        ? createInitialNexoraMVPObjectInteractionState({
            workspace: runtimeState.workspace,
            presentationState: "minimum",
            environmentIntent: "neutral",
          })
        : runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime:
      education.state === "COMPLETED" || education.state === "SKIPPED",
    centerTransferred: false,
    suggestedActions: actionsFor(education.state),
    move: "CONTINUE",
    presentationCue: null,
    pendingOfferTarget,
    clearGuidedAttention,
    dismissVisualView: education.state === "COMPLETED" || education.state === "SKIPPED",
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

function withHandoff(
  session: NexoraEntranceSession,
  personalDemoHandoff: NexoraPersonalDemoHandoffSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  const trust = trustReviewOf(session);
  const prior = conversationContinuityOf(session);
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: personalDemoHandoff.state === "SKIPPED",
      trustReview: Object.freeze({
        state:
          trust.state === "READY" ||
          trust.state === "COMPLETED" ||
          trust.state === "SKIPPED"
            ? ("COMPLETED" as const)
            : trust.state,
        reviewStep: trust.reviewStep,
      }),
      personalDemoHandoff,
      conversationContinuity: recordContinuity(prior, {
        working: Object.freeze({
          ...prior.working,
          pendingOffer: null,
          pendingClarification: null,
          conversationThread: prior.working.conversationThread
            ? Object.freeze({
                ...prior.working.conversationThread,
                status: "SUPERSEDED" as const,
              })
            : null,
        }),
      }),
    }),
  });
}

function actionsFor(
  state: NexoraPersonalDemoHandoffState,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (state === "INTRO" || state === "NOT_STARTED") {
    return NEXORA_PERSONAL_DEMO_HANDOFF_INTRO_ACTIONS;
  }
  if (state === "WORK_CONTEXT") return NEXORA_PERSONAL_DEMO_HANDOFF_CONTEXT_ACTIONS;
  if (state === "DATA_CHOICE") return NEXORA_PERSONAL_DEMO_HANDOFF_DATA_ACTIONS;
  if (state === "SKIPPED" || state === "COMPLETED") return Object.freeze([]);
  return Object.freeze([
    Object.freeze({
      id: "continue-handoff" as const,
      label: "Continue",
      utterance: "Continue",
      kind: "answer" as const,
    }),
    Object.freeze({
      id: "skip-handoff-q" as const,
      label: "Skip for now",
      utterance: "Skip for now",
      kind: "answer" as const,
    }),
  ]);
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
    dismissVisualView: input.dismissVisualView,
  });
}

export function classifyPersonalDemoHandoffMove(
  utterance: string,
): NexoraPersonalDemoHandoffMove | null {
  const normalized = utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  if (normalized === "skip for now" || normalized === "skip this") return "SKIP";
  if (normalized === "let's do it" || normalized === "lets do it") return "START";
  if (normalized === "what do you need") return "NEED";
  if (
    normalized === "show me the next one" ||
    normalized === "continue" ||
    normalized === "show me"
  ) {
    return "NEXT";
  }
  if (normalized === "i'm not sure" || normalized === "i am not sure") return "UNSURE";
  if (normalized === "both") return "BOTH";
  if (normalized === "use my data") return "USE_DATA";
  if (normalized === "start without data") return "NO_DATA";
  if (normalized === "show me how") return "HOW_DATA";
  if (
    /^show me the problems$/.test(normalized) ||
    /^where is data/.test(normalized) ||
    /^show me where/.test(normalized) ||
    /over time|show me delivery over time/.test(normalized) ||
    /^approve/.test(normalized) ||
    /^start (?:the )?execution/.test(normalized) ||
    /^compare (?:these|them|the scenarios)/.test(normalized) ||
    /^explain this$/.test(normalized) ||
    /^i(?:'m| am) /.test(normalized) ||
    /my name is|call me /.test(normalized) ||
    /^this is a (?:business|project)/.test(normalized) ||
    /improve |finish the project|reduce backlog|improve cash/.test(normalized) ||
    /the company is |we(?:'re| are) (?:called|named)/.test(normalized) ||
    /what do you know about my situation/.test(normalized) ||
    /what is on stage/.test(normalized) ||
    /what is my goal/.test(normalized) ||
    /what data do you have/.test(normalized)
  ) {
    return null;
  }
  return null;
}
