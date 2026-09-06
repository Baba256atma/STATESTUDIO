/**
 * NEX-ENT:4 — Advisor & guided conversation education.
 * Bounded session UI over the real CC:5 / NCA conversation path.
 * Does not create a second conversation engine, NLU, Advisor, or Stage.
 */

import {
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import type { NexoraMVPContextSubjectFixture } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_CONVERSATION_EDUCATION_ASK_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_COMPARE_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_EXPLAIN_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_REVIEW_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_SHOW_ACTIONS,
  inactiveNexoraConversationEducationSession,
  inactiveNexoraObjectEducationSession,
  verifyNexoraConversationEducation,
  type NexoraConversationEducationSession,
  type NexoraConversationEducationState,
  type NexoraEducationalObjectKind,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraObjectEducationSession,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import {
  NEXORA_EDUCATIONAL_COMPARE_SCENARIO,
  classifyObjectEducationMove,
  educationalActorForKind,
  isNexoraEducationalObjectId,
  objectEducationOf,
} from "./nexoraObjectEducationExperience.ts";

export {
  NEXORA_CONVERSATION_EDUCATION_BOUNDARY,
  NEXORA_CONVERSATION_EDUCATION_ASK_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_COMPARE_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_EXPLAIN_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_REVIEW_ACTIONS,
  NEXORA_CONVERSATION_EDUCATION_SHOW_ACTIONS,
  getNexoraConversationEducationIdentity,
  inactiveNexoraConversationEducationSession,
  verifyNexoraConversationEducation,
} from "./nexoraGuidedEntranceTypes.ts";

const CONTEXT_KINDS = new Set<NexoraEducationalObjectKind>([
  "problem",
  "scenario",
  "decision",
  "execution",
]);

const VISIBLE: Readonly<
  Record<NexoraConversationEducationState, readonly NexoraEducationalObjectKind[]>
> = Object.freeze({
  NOT_STARTED: Object.freeze([]),
  SKIPPED: Object.freeze([]),
  ASK: Object.freeze(["problem" as const]),
  SHOW: Object.freeze(["problem" as const, "risk" as const]),
  EXPLAIN: Object.freeze(["problem" as const]),
  INVESTIGATE: Object.freeze(["problem" as const]),
  COMPARE: Object.freeze(["problem" as const, "scenario" as const]),
  REVIEW: Object.freeze(["problem" as const, "scenario" as const]),
  COMPLETED: Object.freeze(["problem" as const, "scenario" as const]),
});

const FOCUS_KIND: Readonly<
  Partial<Record<NexoraConversationEducationState, NexoraEducationalObjectKind>>
> = Object.freeze({
  ASK: "problem",
  SHOW: "problem",
  EXPLAIN: "problem",
  INVESTIGATE: "problem",
  COMPARE: "scenario",
  REVIEW: "problem",
  COMPLETED: "problem",
});

const ASK_COPY =
  "You don’t need commands to work with me. Just tell me what you want to understand or see.";
const SHOW_COPY =
  "You can also ask me to bring relevant things into view. Conversation can change what the Stage presents when the request is about Stage content.";
const EXPLAIN_COPY =
  "You can also ask me to explain or investigate something you’re looking at. If you select it on Stage, I can use that as context.";
const INVESTIGATE_COPY =
  "Investigate means we look more closely. We do not treat something as the cause unless evidence supports it.";
const COMPARE_COPY =
  "When there are alternatives, you can ask me to compare them. Compare means we examine differences together — I do not silently pick a winner.";
const REVIEW_COPY =
  "You don’t need to learn commands. Just tell me what you want to understand or do. Ask naturally. If I need clarification, I’ll ask. If you’re looking at something on Stage, I can use that context too.";
const UNKNOWN_HONEST =
  "That’s fine. You don’t have to decide that now. We can keep looking at what’s on Stage, or you can tell me what you want to understand next.";
const DATA_COPY =
  "Yes. Nexora can work with connected data, and I’ll show you how shortly. We won’t start that here.";
const CHART_COPY =
  "Charts can help when we have something worth observing. We won’t start chart education here, and I won’t invent a chart just for this introduction.";
const COMPARE_SAFE =
  "Compare means I can place alternatives together so you can examine their differences. These educational Scenarios are possible paths, not a ranked choice. I don’t have evidence here to say one is better, cheaper, or less risky.";
const INVESTIGATE_SAFE =
  "In a real situation, we’d look at the available evidence before treating anything as the cause. This educational example does not establish a cause.";
const CHOOSE_SAFE =
  "I can help you examine alternatives. Which one to choose depends on evidence and context, and that commitment stays yours. This educational example does not have enough evidence for a recommendation.";
const WORK_COPY = ASK_COPY;

export type NexoraConversationEducationMove =
  | "NEXT"
  | "UNKNOWN"
  | "DATA"
  | "CHART"
  | "COMPARE"
  | "INVESTIGATE"
  | "CHOOSE"
  | "WORK";

export function conversationEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraConversationEducationSession {
  return (
    session?.guidedIntroduction?.conversationEducation ??
    inactiveNexoraConversationEducationSession()
  );
}

export function isNexoraConversationEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = conversationEducationOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED";
}

export function shouldBeginNexoraConversationEducation(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraConversationEducationActive(session)) return false;
  const objectState = objectEducationOf(session).state;
  if (objectState !== "REVIEW" && objectState !== "COMPLETED") return false;
  const objectMove = classifyObjectEducationMove(utterance, session);
  const conversationMove = classifyConversationEducationMove(utterance);
  return objectMove === "NEXT" || conversationMove === "NEXT" || conversationMove === "WORK";
}

export function shouldNexoraConversationEducationOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraConversationEducation(session, utterance)) return true;
  if (!isNexoraConversationEducationActive(session)) return false;
  return classifyConversationEducationMove(utterance) != null;
}

export function overlayConversationEducationOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  education: NexoraConversationEducationSession | null | undefined,
): NexoraMVPObjectInteractionCatalog {
  const state = education?.state ?? "NOT_STARTED";
  if (state === "NOT_STARTED") return catalog;
  const withoutEducational = Object.freeze({
    ...catalog,
    objects: Object.freeze(
      catalog.objects.filter((object) => !isNexoraEducationalObjectId(object.id)),
    ),
    contextSubjects: Object.freeze(
      catalog.contextSubjects.filter((subject) => !isNexoraEducationalObjectId(subject.id)),
    ),
  });
  const kinds = VISIBLE[state];
  if (!kinds.length) return withoutEducational;
  const extras =
    state === "COMPARE" || state === "REVIEW" || state === "COMPLETED"
      ? [NEXORA_EDUCATIONAL_COMPARE_SCENARIO]
      : [];
  const objects: NexoraMVPStageObjectFixture[] = [
    ...kinds.map((kind) => {
      const actor = educationalActorForKind(kind);
      return Object.freeze({
        id: actor.id,
        label: actor.label,
        kind: "object" as const,
        position: actor.position,
        status: "stable" as const,
        attention: kind === FOCUS_KIND[state] ? ("important" as const) : ("normal" as const),
        catalogProvenance: "object-education" as const,
      });
    }),
    ...extras.map((actor) =>
      Object.freeze({
        id: actor.id,
        label: actor.label,
        kind: "object" as const,
        position: actor.position,
        status: "stable" as const,
        attention: "normal" as const,
        catalogProvenance: "object-education" as const,
      }),
    ),
  ];
  const contextSubjects: NexoraMVPContextSubjectFixture[] = [
    ...kinds
      .filter((kind) => CONTEXT_KINDS.has(kind))
      .map((kind) => {
        const actor = educationalActorForKind(kind);
        return Object.freeze({
          id: actor.id,
          label: actor.label,
          kind: actor.kind as NexoraMVPContextSubjectFixture["kind"],
          status: "stable" as const,
          attention: "normal" as const,
          catalogProvenance: "object-education" as const,
        });
      }),
    ...extras.map((actor) =>
      Object.freeze({
        id: actor.id,
        label: actor.label,
        kind: actor.kind as NexoraMVPContextSubjectFixture["kind"],
        status: "stable" as const,
        attention: "normal" as const,
      }),
    ),
  ];
  return Object.freeze({
    objects: Object.freeze([...withoutEducational.objects, ...objects]),
    relationships: withoutEducational.relationships,
    contextSubjects: Object.freeze([
      ...withoutEducational.contextSubjects,
      ...contextSubjects,
    ]),
    contextLinks: withoutEducational.contextLinks,
  });
}

export function resolveNexoraConversationEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraConversationEducation();
  const move = classifyConversationEducationMove(input.utterance);
  const education = conversationEducationOf(input.session);
  if (!isNexoraConversationEducationActive(input.session)) {
    if (shouldBeginNexoraConversationEducation(input.session, input.utterance)) {
      return presentStep(input.session, input.runtimeState, "ASK", ASK_COPY);
    }
    return idle(input.session, input.runtimeState);
  }
  if (move == null) {
    return idle(input.session, input.runtimeState);
  }
  if (move === "NEXT") {
    const following = nextState(education.state);
    return presentStep(
      input.session,
      input.runtimeState,
      following,
      copyForState(following),
    );
  }
  return answerWithoutAdvancing(
    input.session,
    input.runtimeState,
    replyFor(move, education.state),
    actionsFor(education.state),
  );
}

function presentStep(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  state: NexoraConversationEducationState,
  response: string,
): NexoraGuidedEntranceTurnResult {
  const focusKind = FOCUS_KIND[state] ?? "problem";
  const focusId = educationalActorForKind(focusKind).id;
  const objectEducation: NexoraObjectEducationSession = Object.freeze({
    state:
      objectEducationOf(session).state === "REVIEW"
        ? ("COMPLETED" as const)
        : objectEducationOf(session).state,
    currentObjectId: focusId,
    lastReferenceId: focusId,
  });
  const conversationEducation: NexoraConversationEducationSession = Object.freeze({
    state,
  });
  const nextSession = Object.freeze({
    ...withConversationEducation(session, conversationEducation, objectEducation),
    centerSubjectId: focusId,
  });
  const catalog = overlayConversationEducationOnEntranceCatalog(
    emptyCatalog(),
    conversationEducation,
  );
  const focused = selectNexoraMVPInteractionSubject(
    Object.freeze({
      ...runtimeState,
      mode: "overview" as const,
      focusedSubject: null,
      selectedSubject: null,
      environmentIntent: "investigate" as const,
      presentationState: "minimum" as const,
      workspace: "overview" as const,
    }),
    focusId,
    catalog,
  );
  return freezeTurn({
    session: nextSession,
    runtimeState: focused,
    response,
    ownsResponse: true,
    shouldCommitRuntime: true,
    centerTransferred: true,
    suggestedActions: actionsFor(state),
    move: "CONTINUE",
    presentationCue: "orient",
  });
}

function answerWithoutAdvancing(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  response: string,
  suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[],
): NexoraGuidedEntranceTurnResult {
  return freezeTurn({
    session,
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions,
    move: null,
    presentationCue: null,
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
  });
}

function withConversationEducation(
  session: NexoraEntranceSession,
  conversationEducation: NexoraConversationEducationSession,
  objectEducation: NexoraObjectEducationSession,
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
      conversationEducation,
      objectEducation:
        objectEducation.state === "NOT_STARTED"
          ? guided.objectEducation ?? inactiveNexoraObjectEducationSession()
          : objectEducation,
    }),
  });
}

function nextState(
  state: NexoraConversationEducationState,
): NexoraConversationEducationState {
  switch (state) {
    case "NOT_STARTED":
      return "ASK";
    case "ASK":
      return "SHOW";
    case "SHOW":
      return "EXPLAIN";
    case "EXPLAIN":
      return "INVESTIGATE";
    case "INVESTIGATE":
      return "COMPARE";
    case "COMPARE":
      return "REVIEW";
    case "REVIEW":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function copyForState(state: NexoraConversationEducationState): string {
  switch (state) {
    case "ASK":
      return ASK_COPY;
    case "SHOW":
      return SHOW_COPY;
    case "EXPLAIN":
      return EXPLAIN_COPY;
    case "INVESTIGATE":
      return INVESTIGATE_COPY;
    case "COMPARE":
      return COMPARE_COPY;
    case "REVIEW":
    case "COMPLETED":
      return REVIEW_COPY;
    default:
      return ASK_COPY;
  }
}

function actionsFor(
  state: NexoraConversationEducationState,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  switch (state) {
    case "ASK":
      return NEXORA_CONVERSATION_EDUCATION_ASK_ACTIONS;
    case "SHOW":
      return NEXORA_CONVERSATION_EDUCATION_SHOW_ACTIONS;
    case "EXPLAIN":
    case "INVESTIGATE":
      return NEXORA_CONVERSATION_EDUCATION_EXPLAIN_ACTIONS;
    case "COMPARE":
      return NEXORA_CONVERSATION_EDUCATION_COMPARE_ACTIONS;
    case "REVIEW":
    case "COMPLETED":
      return NEXORA_CONVERSATION_EDUCATION_REVIEW_ACTIONS;
    default:
      return NEXORA_CONVERSATION_EDUCATION_ASK_ACTIONS;
  }
}

function replyFor(
  move: NexoraConversationEducationMove,
  state: NexoraConversationEducationState,
): string {
  if (move === "UNKNOWN") return UNKNOWN_HONEST;
  if (move === "DATA") return DATA_COPY;
  if (move === "CHART") return CHART_COPY;
  if (move === "WORK") return WORK_COPY;
  if (move === "COMPARE") return COMPARE_SAFE;
  if (move === "INVESTIGATE") return INVESTIGATE_SAFE;
  if (move === "CHOOSE") return CHOOSE_SAFE;
  return copyForState(state);
}

function emptyCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: Object.freeze([]),
    relationships: Object.freeze([]),
    contextSubjects: Object.freeze([]),
    contextLinks: Object.freeze([]),
  });
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
  });
}

export function classifyConversationEducationMove(
  utterance: string,
): NexoraConversationEducationMove | null {
  const normalized = utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  if (
    /^show me the problems$/.test(normalized) ||
    /^let me see the issues$/.test(normalized) ||
    /^explain this$/.test(normalized) ||
    /^what is this$/.test(normalized) ||
    /^why$/.test(normalized) ||
    /^show me that one$/.test(normalized) ||
    /^no, i meant/.test(normalized)
  ) {
    return null;
  }
  if (
    normalized === "show me the next one" ||
    normalized === "continue" ||
    normalized === "show me something"
  ) {
    return "NEXT";
  }
  if (/how do i work with (?:you|nexora)/.test(normalized) || /how (?:do|can) i talk to (?:you|nexora)/.test(normalized)) {
    return "WORK";
  }
  if (/can you make charts/.test(normalized) || /show (?:me )?a chart/.test(normalized)) {
    return "CHART";
  }
  if (
    normalized === "i don't know" ||
    normalized === "i do not know" ||
    normalized === "i'm not sure" ||
    normalized === "im not sure"
  ) {
    return "UNKNOWN";
  }
  if (
    /^compare (?:these|them)$/.test(normalized) ||
    /what(?:'s| is) different between these scenarios/.test(normalized)
  ) {
    return "COMPARE";
  }
  if (
    /^investigate this$/.test(normalized) ||
    /what might be behind this/.test(normalized) ||
    /why is this problem happening/.test(normalized) ||
    /what should we look at$/.test(normalized)
  ) {
    return "INVESTIGATE";
  }
  if (
    /which one should i (?:choose|pick)/.test(normalized) ||
    /which one deserves attention/.test(normalized)
  ) {
    return "CHOOSE";
  }
  return null;
}
