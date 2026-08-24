/**
 * NCA:2 — Dialogue-state intelligence over NCA:1.
 * Session conversation organization. Reads 6.1/6.2/NCA:1. Does not own executive truth.
 */

import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import type { ContextualManagerMeaning } from "./contextualManagerMeaning.ts";
import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import { isSocialAckUtterance } from "./nexoraNca1ConversationArchitecture.ts";
import {
  classifyManagerSpeechAct,
  collectionOrdinalIndex,
  greetingAllowsInitiative,
  inferNexoraQuestionPurpose,
  interpretExecutiveCollectionQuery,
  isGreetingSocialUtterance,
  polarReplyCompatibleWithPurpose,
  pendingQuestionFieldsFor,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  isAbandonRepairUtterance,
  isRepairFollowUpUtterance,
  stripReferenceFillers,
} from "./nexoraRegisteredReferenceRecovery.ts";
import {
  NCA2_STATE_BOUNDS,
  NEXORA_NCA2_BOUNDARY,
  nexoraNca2Identity,
  nexoraNca2Namespace,
  nexoraNca2Version,
  type DialogueMove,
  type ExpectedInformationKind,
  type NcaAnswerPayload,
  type NcaConversationSubject,
  type NcaConversationThread,
  type NcaFailedConversationTurn,
  type NcaPendingQuestion,
  type NexoraConversationState,
} from "./nexoraNca2ConversationStateTypes.ts";

export {
  NEXORA_NCA2_BOUNDARY,
  nexoraNca2Identity,
  nexoraNca2Namespace,
  nexoraNca2Version,
};
export type {
  DialogueMove,
  NexoraConversationState,
  NcaPendingQuestion,
  NcaConversationThread,
} from "./nexoraNca2ConversationStateTypes.ts";

export function getNexoraNca2Identity() {
  return Object.freeze({
    id: nexoraNca2Identity,
    version: nexoraNca2Version,
    namespace: nexoraNca2Namespace,
  });
}

export function verifyNexoraNca2(): { readonly ok: true } {
  if (getNexoraNca2Identity().id !== nexoraNca2Identity) {
    throw new Error("NCA:2 identity mismatch");
  }
  if (NEXORA_NCA2_BOUNDARY.createsSecondDurableMemory) {
    throw new Error("NCA:2 must not create a second durable memory");
  }
  if (NEXORA_NCA2_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:2 must not claim a live LLM");
  }
  return Object.freeze({ ok: true as const });
}

export function createEmptyNcaConversationState(): NexoraConversationState {
  return freezeNcaConversationState({
    identity: nexoraNca2Identity,
    turnIndex: 0,
    activeTopic: null,
    activeSubject: null,
    currentThreadId: null,
    threads: Object.freeze([]),
    dialogueMove: "UNKNOWN",
    pendingQuestion: null,
    lastAnswer: null,
    lastOfferedOptions: Object.freeze([]),
    lastRecommendation: null,
    lastAdvisoryPosition: null,
    lastInitiativeSnapshot: null,
    lastCommunicationSnapshot: null,
    dismissedInitiativeKeys: Object.freeze([]),
    suppressedInitiativeKeys: Object.freeze([]),
    lastNexoraQuestion: null,
    topicHistory: Object.freeze([]),
    recentSubjects: Object.freeze([]),
    openAdvisoryWork: Object.freeze([]),
    answeredMissing: Object.freeze([]),
    lastFailedTurn: null,
    lastCollection: null,
  });
}

export function freezeNcaConversationState(
  state: NexoraConversationState,
): NexoraConversationState {
  return Object.freeze({
    ...state,
    identity: nexoraNca2Identity,
    threads: Object.freeze(state.threads.map((thread) => Object.freeze({ ...thread }))),
    lastOfferedOptions: Object.freeze([...state.lastOfferedOptions]),
    topicHistory: Object.freeze(state.topicHistory.map((topic) => Object.freeze({ ...topic }))),
    recentSubjects: Object.freeze(
      state.recentSubjects.map((subject) => Object.freeze({ ...subject })),
    ),
    openAdvisoryWork: Object.freeze(
      state.openAdvisoryWork.map((item) => Object.freeze({ ...item })),
    ),
    answeredMissing: Object.freeze([...state.answeredMissing]),
    pendingQuestion: state.pendingQuestion
      ? Object.freeze({ ...state.pendingQuestion })
      : null,
    lastAnswer: state.lastAnswer ? Object.freeze({ ...state.lastAnswer }) : null,
    lastAdvisoryPosition: state.lastAdvisoryPosition
      ? Object.freeze({ ...state.lastAdvisoryPosition })
      : null,
    lastInitiativeSnapshot: state.lastInitiativeSnapshot
      ? Object.freeze({ ...state.lastInitiativeSnapshot })
      : null,
    lastCommunicationSnapshot: state.lastCommunicationSnapshot
      ? Object.freeze({ ...state.lastCommunicationSnapshot })
      : null,
    dismissedInitiativeKeys: Object.freeze([...(state.dismissedInitiativeKeys ?? [])]),
    suppressedInitiativeKeys: Object.freeze([...(state.suppressedInitiativeKeys ?? [])]),
    activeTopic: state.activeTopic ? Object.freeze({ ...state.activeTopic }) : null,
    activeSubject: state.activeSubject
      ? Object.freeze({ ...state.activeSubject })
      : null,
    lastFailedTurn: state.lastFailedTurn
      ? Object.freeze({
          ...state.lastFailedTurn,
          candidates: Object.freeze([...(state.lastFailedTurn.candidates ?? [])]),
        })
      : null,
  });
}

export function topicLabelFor(name: string | null, needFamily: string | null): string {
  const lower = (name ?? "").toLowerCase();
  if (needFamily === "TEACH") return "Nexora Orientation";
  if (/goal/i.test(lower)) return "Goal Discovery";
  if (/delivery/i.test(lower)) return "Delivery Performance";
  if (/capacity/i.test(lower)) return "Capacity Investigation";
  if (/inventory/i.test(lower)) return "Inventory Risk";
  if (/scenario|option/i.test(lower) || needFamily === "COMPARE") {
    return "Scenario Comparison";
  }
  if (/decision/i.test(lower) || needFamily === "DECIDE") return "Decision Discussion";
  if (/execution/i.test(lower) || needFamily === "ACT") return "Execution Follow-Up";
  if (/outcome/i.test(lower) || needFamily === "FOLLOW_UP" || needFamily === "LEARN") {
    return "Outcome Review";
  }
  if (name) return `${name} Discussion`;
  return "Executive Conversation";
}

function topicId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function subjectOf(
  nca: ManagerConversationTurn,
  meaning: CanonicalManagerMeaning,
  contextual: ContextualManagerMeaning,
): NcaConversationSubject {
  return Object.freeze({
    id:
      contextual.objectReference?.subjectId ??
      meaning.objectReference?.subjectId ??
      nca.reference.resolvedId,
    name:
      contextual.objectReference?.canonicalName ??
      meaning.objectReference?.canonicalName ??
      nca.reference.resolvedName,
    kind:
      contextual.objectReference?.subjectKind ??
      meaning.objectReference?.subjectKind ??
      null,
  });
}

function preparedOf(utterance: string): string {
  return utterance.trim().toLowerCase().replace(/[.!]+$/g, "");
}

export function inferExpectedInformation(question: string): ExpectedInformationKind {
  const text = question.toLowerCase();
  if (/\b(?:how much|percent|%)\b/.test(text)) return "PERCENTAGE";
  if (/\b(?:how long|until|duration)\b/.test(text)) return "DURATION";
  if (/\b(?:which|first|second|orders or|throughput)\b/.test(text)) return "OPTION";
  if (/\b(?:when|friday|deadline)\b/.test(text)) return "DATE";
  if (/\b(?:budget|cost|constraint)\b/.test(text)) return "CONSTRAINT";
  if (/\b(?:whether|has |did |is |expected|continue|persist|temporary)\b/.test(text)) {
    return "BOOLEAN";
  }
  return "FREE_TEXT";
}

export function inferQuestionPurpose(question: string): string {
  const text = question.toLowerCase();
  if (/orders or slower|throughput/.test(text)) return "demand-driver";
  if (/how long|continue|persist|temporary/.test(text)) return "demand-persistence";
  if (/how much|percent/.test(text)) return "demand-magnitude";
  if (/backlog/.test(text)) return "backlog";
  return "advisory-context";
}

function extractAnswer(
  utterance: string,
  expected: ExpectedInformationKind,
  options: readonly string[],
): NcaAnswerPayload | null {
  const raw = utterance.trim();
  const prepared = preparedOf(utterance);
  const percent = raw.match(/(\d+(?:\.\d+)?)\s*%/);
  const number = raw.match(/\b(\d+(?:\.\d+)?)\b/);
  const duration = prepared.match(
    /\b(?:\d+\s*(?:day|week|month|quarter|year)s?|three months|until q[1-4]|through q[1-4]|q[1-4]|until december)\b/,
  );
  const yes =
    /^(?:yes|yeah|yep|y|true|correct|exactly|probably(?: through q[1-4])?)/.test(prepared) ||
    /\byes\b/.test(prepared);
  const no = /^(?:no|nope|false|not anymore|not really)\b/.test(prepared);
  const maybe = /^(?:maybe|not sure|possibly)\b/.test(prepared);

  if (percent && (expected === "PERCENTAGE" || expected === "BOOLEAN" || expected === "NUMBER")) {
    return Object.freeze({
      kind: "PERCENTAGE",
      raw,
      display: `${percent[1]}%`,
      booleanValue: true,
      numericValue: Number(percent[1]),
      optionIndex: null,
      optionLabel: null,
    });
  }
  if (expected === "PERCENTAGE") return null;
  if (duration && (expected === "DURATION" || expected === "BOOLEAN" || expected === "FREE_TEXT")) {
    return Object.freeze({
      kind: "DURATION",
      raw,
      display: duration[0] ?? raw,
      booleanValue: true,
      numericValue: /three months/.test(prepared) ? 3 : number ? Number(number[1]) : null,
      optionIndex: null,
      optionLabel: null,
    });
  }
  if (expected === "DURATION") return null;
  if (expected === "OPTION" || /^(?:the )?(?:first|second|third)(?: one)?$/.test(prepared)) {
    const index = /second/.test(prepared)
      ? 1
      : /third/.test(prepared)
        ? 2
        : /first/.test(prepared)
          ? 0
          : -1;
    if (index >= 0 && options[index]) {
      return Object.freeze({
        kind: "OPTION",
        raw,
        display: options[index] ?? `option ${index + 1}`,
        booleanValue: true,
        numericValue: index + 1,
        optionIndex: index,
        optionLabel: options[index] ?? null,
      });
    }
    if (/more orders|\borders\b/.test(prepared)) {
      return Object.freeze({
        kind: "OPTION",
        raw,
        display: "more orders",
        booleanValue: true,
        numericValue: null,
        optionIndex: 0,
        optionLabel: "more orders",
      });
    }
    if (/throughput|slower/.test(prepared)) {
      return Object.freeze({
        kind: "OPTION",
        raw,
        display: "slower throughput",
        booleanValue: true,
        numericValue: null,
        optionIndex: 1,
        optionLabel: "slower throughput",
      });
    }
  }
  if (expected === "NUMBER" && number) {
    return Object.freeze({
      kind: "NUMBER",
      raw,
      display: number[1] ?? raw,
      booleanValue: true,
      numericValue: Number(number[1]),
      optionIndex: null,
      optionLabel: null,
    });
  }
  if (yes || no || maybe) {
    return Object.freeze({
      kind: "BOOLEAN",
      raw,
      display: raw,
      booleanValue: no ? false : maybe ? null : true,
      numericValue: null,
      optionIndex: null,
      optionLabel: null,
    });
  }
  if (expected === "BOOLEAN") return null;
  if (prepared.length < 1) return null;
  if (expected === "FREE_TEXT" || expected === "BUSINESS_FACT" || expected === "MANAGER_PREFERENCE") {
    return Object.freeze({
      kind: expected,
      raw,
      display: raw,
      booleanValue: null,
      numericValue: null,
      optionIndex: null,
      optionLabel: null,
    });
  }
  return null;
}

export function isContextualShortAnswer(
  utterance: string,
  pending: NcaPendingQuestion | null,
  options: readonly string[],
): boolean {
  if (!pending?.valid) return false;
  if (pending.status && pending.status !== "ACTIVE") return false;
  const prepared = preparedOf(utterance);
  if (prepared.length > 80) return false;
  if (
    /^(?:show|open|bring|what|how|why|where|who|can you|could you|forget|go back|before that|compare|explain)\b/.test(
      prepared,
    )
  ) {
    return false;
  }
  if (/\?/.test(utterance)) return false;
  const polar = /^(?:yes|yeah|yep|y|no|nope|maybe|sure|not now|ok|okay)$/i.test(prepared);
  const purpose = inferNexoraQuestionPurpose(pending.question);
  const expected = pending.expectedInformation;
  if (
    polar &&
    expected !== "BOOLEAN" &&
    !polarReplyCompatibleWithPurpose(purpose)
  ) {
    return false;
  }
  return extractAnswer(utterance, pending.expectedInformation, options) != null;
}

function isReturnUtterance(prepared: string): boolean {
  return /^(?:go back|back to|return to|continue where we were|continue the previous|what were we discussing|let'?s return)\b/.test(
    prepared,
  );
}

function isAbandonUtterance(prepared: string): boolean {
  return /\bforget\b/.test(prepared) && /\b(?:focus|look|talk|discuss)\b/.test(prepared);
}

function focusSubjectFromAbandon(prepared: string): string | null {
  const match = prepared.match(
    /\b(?:focus|look|talk|discuss)(?:\s+on)?\s+([a-z0-9][a-z0-9\s-]*)$/i,
  );
  return match?.[1]?.trim() ?? null;
}

function isCorrectionUtterance(prepared: string): boolean {
  return /^(?:no,? i meant|that'?s not what i meant|i was asking about)/.test(prepared);
}

function isAcceptUtterance(prepared: string): boolean {
  return /^(?:that makes sense|i agree|let'?s do that|sounds right)$/.test(prepared);
}

function isRejectUtterance(prepared: string): boolean {
  return /\bdon'?t like that option\b/.test(prepared) || /^(?:forget it|give me another approach)$/.test(prepared);
}

function isCloseUtterance(prepared: string): boolean {
  return /that answers my question/.test(prepared);
}

function looksLikeFailedReferenceAttempt(utterance: string, resolvedName: string | null): boolean {
  if (resolvedName) return false;
  const prepared = utterance.trim().toLowerCase();
  return /^(?:show|open|explain|what if|what happens if|suppose|why is|compare)\b/.test(prepared)
    && prepared.split(/\s+/).length >= 2;
}

function attemptedReferenceToken(utterance: string): string {
  const stripped = stripReferenceFillers(utterance);
  const tokens = stripped
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !/^(?:late|very|too|what|happens|happen|badly|delayed|changing|high)$/.test(token));
  return tokens.at(-1) ?? stripped;
}

function isShiftUtterance(prepared: string): boolean {
  return /^(?:what about|before that|let'?s look at|let'?s talk about)\b/.test(prepared);
}

function threadById(
  threads: readonly NcaConversationThread[],
  id: string | null,
): NcaConversationThread | null {
  if (!id) return null;
  return threads.find((thread) => thread.id === id) ?? null;
}

function matchThread(
  threads: readonly NcaConversationThread[],
  token: string,
): NcaConversationThread | null {
  const needle = token.toLowerCase();
  const haystack = (thread: NcaConversationThread) =>
    `${thread.subject.name ?? ""} ${thread.topic.label} ${thread.purpose} ${thread.pendingQuestion?.purpose ?? ""} ${thread.pendingQuestion?.question ?? ""}`.toLowerCase();
  const scored = threads.filter((thread) => haystack(thread).includes(needle));
  const related =
    scored.length > 0
      ? scored
      : /capacity/.test(needle)
        ? threads.filter((thread) => /delivery|capacity|demand|backlog/.test(haystack(thread)))
        : [];
  return (
    related.find((thread) => thread.state === "SUSPENDED") ??
    related.find((thread) => thread.state === "ACTIVE") ??
    related[0] ??
    null
  );
}

function pushBounded<T>(items: readonly T[], item: T, limit: number): readonly T[] {
  return Object.freeze([...items, item].slice(-limit));
}

function upsertThread(
  threads: readonly NcaConversationThread[],
  next: NcaConversationThread,
): readonly NcaConversationThread[] {
  const without = threads.filter((thread) => thread.id !== next.id);
  return Object.freeze([...without, next].slice(-NCA2_STATE_BOUNDS.threads));
}

function suspendOthers(
  threads: readonly NcaConversationThread[],
  activeId: string,
  turn: number,
): readonly NcaConversationThread[] {
  return Object.freeze(
    threads.map((thread) =>
      thread.id === activeId || thread.state !== "ACTIVE"
        ? thread
        : Object.freeze({
            ...thread,
            state: "SUSPENDED" as const,
            lastActiveAtTurn: turn,
          }),
    ),
  );
}

export type NcaDialogueInterpretation = {
  readonly move: DialogueMove;
  readonly state: NexoraConversationState;
  readonly answer: NcaAnswerPayload | null;
  readonly restoredThread: NcaConversationThread | null;
  readonly resolvedDeictic: string | null;
};

export function interpretNcaDialogueTurn(input: {
  readonly previous: NexoraConversationState | null | undefined;
  readonly utterance: string;
  readonly nca: ManagerConversationTurn;
  readonly meaning: CanonicalManagerMeaning;
  readonly contextual: ContextualManagerMeaning;
}): NcaDialogueInterpretation {
  const previous = input.previous ?? createEmptyNcaConversationState();
  const prepared = preparedOf(input.utterance);
  const turn = previous.turnIndex + 1;
  const incoming = subjectOf(input.nca, input.meaning, input.contextual);
  const pending = previous.pendingQuestion;

  let move: DialogueMove = "CONTINUE_TOPIC";
  let answer: NcaAnswerPayload | null = null;
  let restoredThread: NcaConversationThread | null = null;
  let resolvedDeictic: string | null = null;
  let threads: readonly NcaConversationThread[] = previous.threads;
  let currentId = previous.currentThreadId;
  let activeSubject = previous.activeSubject;
  let activeTopic = previous.activeTopic;
  let pendingQuestion = pending;
  let lastAnswer = previous.lastAnswer;
  let answeredMissing = [...previous.answeredMissing];
  let advisory = [...previous.openAdvisoryWork];

  const activate = (subject: NcaConversationSubject, purpose: string, asNew: boolean) => {
    const label = topicLabelFor(subject.name, input.nca.need.family);
    const topic = Object.freeze({ id: topicId(label), label });
    const existing = threads.find(
      (thread) =>
        thread.state !== "ABANDONED" &&
        ((thread.subject.id && subject.id && thread.subject.id === subject.id) ||
          (thread.subject.name &&
            subject.name &&
            thread.subject.name.toLowerCase() === subject.name.toLowerCase())),
    );
    const id = existing?.id ?? `thread-${subject.id ?? topic.id}-${turn}`;
    const thread: NcaConversationThread = Object.freeze({
      id,
      topic,
      subject,
      goal: input.nca.conversationContext.activeGoal,
      purpose: existing?.purpose ?? purpose,
      state: "ACTIVE",
      pendingQuestion: asNew ? null : existing?.pendingQuestion ?? null,
      lastAnswer: existing?.lastAnswer ?? null,
      unresolvedNeed: existing?.unresolvedNeed ?? purpose,
      startedAtTurn: existing?.startedAtTurn ?? turn,
      lastActiveAtTurn: turn,
      pendingExpired: existing?.pendingExpired === true,
    });
    threads = suspendOthers(upsertThread(threads, thread), id, turn);
    currentId = id;
    activeSubject = subject;
    activeTopic = topic;
    pendingQuestion = thread.pendingQuestion;
    return thread;
  };

  let lastFailedTurn: NcaFailedConversationTurn | null = previous.lastFailedTurn ?? null;

  if (lastFailedTurn && isAbandonRepairUtterance(input.utterance)) {
    lastFailedTurn = null;
    move = "CONTINUE_TOPIC";
  } else if (
    lastFailedTurn &&
    isRepairFollowUpUtterance(input.utterance) &&
    !input.meaning.objectReference?.canonicalName
  ) {
    move = "FOLLOW_UP";
    resolvedDeictic = lastFailedTurn.attemptedReference ?? lastFailedTurn.managerMessage;
  } else if (/\bwhy that one\b/i.test(input.utterance) && previous.lastRecommendation) {
    move = "FOLLOW_UP";
    resolvedDeictic = previous.lastRecommendation;
    activeSubject = Object.freeze({
      id: previous.activeSubject?.id ?? null,
      name: previous.lastRecommendation,
      kind: previous.activeSubject?.kind ?? "scenario",
    });
  } else if (isGreetingSocialUtterance(input.utterance)) {
    move = "ACKNOWLEDGE";
    if (pendingQuestion?.valid) {
      pendingQuestion = Object.freeze({
        ...pendingQuestion,
        status: "SUSPENDED" as const,
      });
    }
  } else if (isCorrectionUtterance(prepared)) {
    move = "CORRECT";
    activate(
      incoming.name
        ? incoming
        : Object.freeze({
            id: incoming.id,
            name: prepared.replace(/^no,? i meant\s+/i, ""),
            kind: incoming.kind,
          }),
      "corrected-subject",
      false,
    );
  } else if (isAbandonUtterance(prepared)) {
    move = "CLOSE_TOPIC";
    const current = threadById(threads, currentId);
    if (current) {
      threads = upsertThread(threads, {
        ...current,
        state: "ABANDONED",
        pendingQuestion: current.pendingQuestion
          ? { ...current.pendingQuestion, valid: false }
          : null,
        pendingExpired: true,
        lastActiveAtTurn: turn,
      });
      pendingQuestion = null;
    }
    const focusedName = focusSubjectFromAbandon(prepared);
    if (focusedName) {
      const named =
        incoming.name && incoming.name.toLowerCase() === focusedName
          ? incoming
          : Object.freeze({
              id: null,
              name: focusedName.replace(/\b\w/g, (char) => char.toUpperCase()),
              kind: "object",
            });
      activate(named, "replacement-topic", true);
    } else if (incoming.name) {
      activate(incoming, "replacement-topic", true);
    }
  } else if (isReturnUtterance(prepared)) {
    move = "RETURN_TO_TOPIC";
    const token = prepared
      .replace(/^(?:go back(?: to)?|back to|return to|let'?s return to)\s+/i, "")
      .replace(/[.!]+$/g, "");
    const generic = /continue where we were|previous|what were we discussing/.test(prepared);
    restoredThread = generic
      ? [...threads]
          .filter((thread) => thread.state === "SUSPENDED")
          .sort((a, b) => b.lastActiveAtTurn - a.lastActiveAtTurn)[0] ?? null
      : matchThread(threads, token.replace(/^(?:the|to)\s+/, ""));
    if (restoredThread) {
      const restoredPending =
        restoredThread.pendingExpired || restoredThread.state === "ABANDONED"
          ? null
          : restoredThread.pendingQuestion?.valid
            ? restoredThread.pendingQuestion
            : null;
      const restored: NcaConversationThread = Object.freeze({
        ...restoredThread,
        state: restoredThread.state === "ABANDONED" ? "ACTIVE" : "ACTIVE",
        pendingQuestion: restoredPending,
        lastActiveAtTurn: turn,
      });
      threads = suspendOthers(upsertThread(threads, restored), restored.id, turn);
      currentId = restored.id;
      activeSubject = restored.subject;
      activeTopic = restored.topic;
      pendingQuestion = restoredPending;
      restoredThread = restored;
    }
  } else if (
    collectionOrdinalIndex(input.utterance) != null &&
    (previous.lastCollection?.items.length ?? previous.lastOfferedOptions.length) > 0
  ) {
    move = "FOLLOW_UP";
    const items =
      previous.lastCollection?.items.length
        ? previous.lastCollection.items
        : previous.lastOfferedOptions;
    answer = extractAnswer(input.utterance, "OPTION", items);
    resolvedDeictic = answer?.optionLabel ?? items[collectionOrdinalIndex(input.utterance) ?? 0] ?? null;
    if (resolvedDeictic) {
      activeSubject = Object.freeze({
        id: previous.activeSubject?.id ?? null,
        name: resolvedDeictic,
        kind: previous.lastCollection?.kind ?? "problem",
      });
    }
  } else if (
    /^(?:the )?(?:first|second|third)(?: one)?$/.test(prepared) &&
    previous.lastOfferedOptions.length > 0
  ) {
    move = "FOLLOW_UP";
    answer = extractAnswer(input.utterance, "OPTION", previous.lastOfferedOptions);
    resolvedDeictic = answer?.optionLabel ?? null;
    if (resolvedDeictic) {
      activeSubject = Object.freeze({
        id: previous.activeSubject?.id ?? null,
        name: resolvedDeictic,
        kind: "scenario",
      });
    }
  } else if (
    pending?.valid &&
    isContextualShortAnswer(input.utterance, pending, previous.lastOfferedOptions)
  ) {
    move = "ANSWER_NEXORA";
    answer = extractAnswer(
      input.utterance,
      pending.expectedInformation,
      previous.lastOfferedOptions,
    );
    lastAnswer = answer;
    pendingQuestion = null;
    answeredMissing = [...new Set([...answeredMissing, pending.purpose])];
    const current = threadById(threads, currentId);
    if (current) {
      threads = upsertThread(threads, {
        ...current,
        pendingQuestion: null,
        lastAnswer: answer,
        lastActiveAtTurn: turn,
      });
    }
    activeSubject = previous.activeSubject;
    activeTopic = previous.activeTopic;
  } else if (/\bwhy that one\b/.test(prepared) && previous.lastRecommendation) {
    move = "FOLLOW_UP";
    resolvedDeictic = previous.lastRecommendation;
    activeSubject = Object.freeze({
      id: previous.activeSubject?.id ?? null,
      name: previous.lastRecommendation,
      kind: previous.activeSubject?.kind ?? "scenario",
    });
  } else if (isCloseUtterance(prepared)) {
    move = "CLOSE_TOPIC";
    const current = threadById(threads, currentId);
    if (current) {
      threads = upsertThread(threads, {
        ...current,
        state: "RESOLVED",
        pendingQuestion: null,
        lastActiveAtTurn: turn,
      });
      pendingQuestion = null;
      advisory = advisory.map((item) =>
        item.threadId === current.id ? { ...item, open: false } : item,
      );
    }
  } else if (isAcceptUtterance(prepared)) {
    move = "ACCEPT";
  } else if (isRejectUtterance(prepared)) {
    move = "REJECT";
  } else if (isSocialAckUtterance(input.utterance)) {
    move = "ACKNOWLEDGE";
  } else if (isShiftUtterance(prepared) && incoming.name) {
    move = pending?.valid ? "PAUSE_TOPIC" : "TOPIC_SHIFT";
    activate(incoming, "side-topic", false);
  } else if (
    incoming.name &&
    previous.activeSubject?.name &&
    incoming.name.toLowerCase() !== previous.activeSubject.name.toLowerCase() &&
    input.nca.need.family !== "SOCIAL_CONVERSATION" &&
    classifyManagerSpeechAct(input.utterance) !== "PREFERENCE"
  ) {
    move = "TOPIC_SHIFT";
    activate(incoming, input.nca.need.family.toLowerCase(), false);
  } else if (incoming.name && !previous.activeSubject?.name) {
    move = "NEW_TOPIC";
    activate(incoming, input.nca.need.family.toLowerCase(), true);
  } else if (input.nca.advisorBehavior === "CLARIFY") {
    move = "CLARIFY";
  } else {
    move = previous.currentThreadId ? "CONTINUE_TOPIC" : "NEW_TOPIC";
    const speech = classifyManagerSpeechAct(input.utterance);
    if (
      incoming.name &&
      speech !== "PREFERENCE"
    ) {
      activate(incoming, input.nca.need.family.toLowerCase(), false);
    }
  }

  let lastCollection = previous.lastCollection ?? null;
  const collectionQuery = interpretExecutiveCollectionQuery(input.utterance);
  if (collectionQuery && !collectionQuery["ambiguousIssueNoun"]) {
    lastCollection = Object.freeze({
      kind: String(collectionQuery["collectionKind"] ?? "PROBLEM"),
      items: previous.lastCollection?.items ?? Object.freeze([]),
    });
  }

  const history = activeTopic
    ? pushBounded(
        previous.topicHistory.filter((topic) => topic.id !== activeTopic?.id),
        activeTopic,
        NCA2_STATE_BOUNDS.topics,
      )
    : previous.topicHistory;
  const recent = activeSubject?.name
    ? pushBounded(
        previous.recentSubjects.filter((item) => item.name !== activeSubject?.name),
        activeSubject,
        NCA2_STATE_BOUNDS.subjects,
      )
    : previous.recentSubjects;

  const state = freezeNcaConversationState({
    ...previous,
    turnIndex: turn,
    activeTopic,
    activeSubject,
    currentThreadId: currentId,
    threads: Object.freeze(threads),
    dialogueMove: move,
    pendingQuestion,
    lastAnswer,
    topicHistory: history,
    recentSubjects: recent,
    openAdvisoryWork: Object.freeze(advisory),
    answeredMissing: Object.freeze(answeredMissing),
    lastCollection,
    lastFailedTurn:
      isReturnUtterance(prepared)
        ? null
        : lastFailedTurn && move === "FOLLOW_UP"
          ? lastFailedTurn
          : looksLikeFailedReferenceAttempt(
              input.utterance,
              input.meaning.objectReference?.canonicalName ?? null,
            )
            ? Object.freeze({
                managerMessage: input.utterance,
                attemptedNeed: input.nca.need.family,
                attemptedReference: attemptedReferenceToken(input.utterance),
                failureKind: "UNRESOLVED_REFERENCE",
                candidates: Object.freeze([]),
                response: null,
                recoverable: true,
              })
            : incoming.name
              ? null
              : lastFailedTurn,
  });

  return Object.freeze({
    move,
    state,
    answer,
    restoredThread,
    resolvedDeictic,
  });
}

function parseOfferedOptions(text: string): readonly string[] {
  const named = [...text.matchAll(/\bOption\s+([A-Z1-9])\b[:\s-]*([^.?\n]*)/gi)].map(
    (match) => (match[2] ?? `Option ${match[1]}`).trim() || `Option ${match[1]}`,
  );
  if (named.length >= 2) return Object.freeze(named.slice(0, NCA2_STATE_BOUNDS.options));
  if (/temporary capacity/i.test(text) && /permanent/i.test(text)) {
    return Object.freeze(["Temporary capacity", "Permanent expansion"]);
  }
  return Object.freeze([]);
}

export function nextInvestigationQuestion(
  answeredPurpose: string | null,
  answer: NcaAnswerPayload | null,
): { readonly question: string; readonly purpose: string } | null {
  if (answeredPurpose === "demand-persistence" && answer?.booleanValue !== false) {
    return {
      question: "Was that increase driven mainly by more orders or slower throughput?",
      purpose: "demand-driver",
    };
  }
  if (answeredPurpose === "backlog" && answer?.booleanValue !== false) {
    return {
      question: "Was that increase driven mainly by more orders or slower throughput?",
      purpose: "demand-driver",
    };
  }
  return null;
}

export function applyNexoraDialogueEffects(input: {
  readonly state: NexoraConversationState;
  readonly nca: ManagerConversationTurn;
  readonly response: string;
  readonly locked: boolean;
  readonly followUpQuestion?: { readonly question: string; readonly purpose: string } | null;
}): NexoraConversationState {
  if (input.locked) return input.state;
  const options = parseOfferedOptions(input.response);
  const recommendation =
    input.nca.strategy.recommendedAction ??
    (/temporary capacity/i.test(input.response) ? "Temporary capacity" : null);
  let pending = input.state.pendingQuestion;
  let threads: readonly NcaConversationThread[] = input.state.threads;
  let advisory = [...input.state.openAdvisoryWork];
  const current = threadById(threads, input.state.currentThreadId);
  const followUp = input.followUpQuestion;
  const questionFromResponse = /\?/.test(input.response)
    ? `${input.response.split("?").filter(Boolean).pop()?.trim()}?`
    : null;
  const questionText =
    followUp?.question ?? input.nca.strategy.question ?? questionFromResponse;
  const preserveMove =
    input.state.dialogueMove === "ANSWER_NEXORA" ||
    input.state.dialogueMove === "FOLLOW_UP" ||
    input.state.dialogueMove === "REJECT" ||
    input.state.dialogueMove === "ACCEPT" ||
    input.state.dialogueMove === "ACKNOWLEDGE" ||
    input.state.dialogueMove === "CLOSE_TOPIC" ||
    input.state.dialogueMove === "CORRECT" ||
    input.state.dialogueMove === "RETURN_TO_TOPIC" ||
    input.state.dialogueMove === "PAUSE_TOPIC";
  const asked =
    Boolean(followUp?.question) ||
    (!preserveMove && Boolean(questionText && questionText.includes("?")));
  if (asked && questionText) {
    pending = Object.freeze({
      askedBy: "NEXORA" as const,
      question: questionText.slice(-240),
      purpose: followUp?.purpose ?? inferQuestionPurpose(questionText),
      expectedInformation: inferExpectedInformation(questionText),
      relatedSubjectId: input.state.activeSubject?.id ?? null,
      relatedSubjectName: input.state.activeSubject?.name ?? null,
      relatedGoal: input.nca.conversationContext.activeGoal,
      valid: true,
      expiresOn: "answered" as const,
      askedAtTurn: input.state.turnIndex,
      status: "ACTIVE" as const,
      questionPurpose: inferNexoraQuestionPurpose(questionText),
    });
    if (current) {
      threads = upsertThread(threads, {
        ...current,
        pendingQuestion: pending,
        lastActiveAtTurn: input.state.turnIndex,
      });
    }
    if (!advisory.some((item) => item.threadId === current?.id && item.open)) {
      advisory = [
        ...advisory,
        {
          id: `adv-${input.state.currentThreadId ?? "none"}`,
          summary: `Need ${pending.purpose} before recommending a lasting change.`,
          threadId: current?.id ?? "none",
          open: true,
        },
      ].slice(-NCA2_STATE_BOUNDS.advisory);
    }
  }
  const unresolvedReference = /don'?t have a clear match|couldn'?t find|no clear match/i.test(
    input.response,
  );
  const lastFailedTurn = unresolvedReference
    ? Object.freeze({
        managerMessage: input.nca.message,
        attemptedNeed: input.nca.need.family,
        attemptedReference: attemptedReferenceToken(input.nca.message),
        failureKind: "UNRESOLVED_REFERENCE" as const,
        candidates: Object.freeze([]),
        response: input.response.slice(0, 240),
        recoverable: true,
      })
    : isRepairFollowUpUtterance(input.nca.message)
      ? input.state.lastFailedTurn
      : input.nca.reference.resolvedName
        ? null
        : input.state.lastFailedTurn;

  return freezeNcaConversationState({
    ...input.state,
    pendingQuestion: pending,
    lastOfferedOptions: options.length > 0 ? options : input.state.lastOfferedOptions,
    lastRecommendation: recommendation ?? input.state.lastRecommendation,
    lastNexoraQuestion: pending?.question ?? input.state.lastNexoraQuestion,
    threads: Object.freeze(threads),
    openAdvisoryWork: Object.freeze(advisory),
    lastFailedTurn,
    lastCollection: (() => {
      const listed = input.response.match(/Current Problems:\s*([^.]+)/i);
      if (listed?.[1]) {
        return Object.freeze({
          kind: "PROBLEM",
          items: Object.freeze(
            listed[1]
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
        });
      }
      if (/opened problems|current problems/i.test(input.response)) {
        return Object.freeze({
          kind: "PROBLEM",
          items: options.length > 0 ? options : input.state.lastCollection?.items ?? Object.freeze([]),
        });
      }
      return input.state.lastCollection;
    })(),
    dialogueMove:
      asked && input.state.dialogueMove !== "ANSWER_NEXORA"
        ? "ASK_MANAGER"
        : input.state.dialogueMove,
  });
}

export function composeNca2ContinuityResponse(input: {
  readonly source: string;
  readonly interpretation: NcaDialogueInterpretation;
  readonly nca: ManagerConversationTurn;
  readonly locked: boolean;
}): { readonly text: string; readonly followUp: { readonly question: string; readonly purpose: string } | null } {
  if (input.locked) {
    return { text: input.source, followUp: null };
  }
  const source = input.source.trim();
  const { move, answer, restoredThread, resolvedDeictic, state } = input.interpretation;
  if (move === "ANSWER_NEXORA" && answer) {
    const purpose = inferNexoraQuestionPurpose(state.lastNexoraQuestion ?? "");
    if (
      purpose === "REVIEW_OFFER" ||
      purpose === "YES_NO_PERMISSION" ||
      purpose === "YES_NO_CONFIRMATION" ||
      purpose === "NAVIGATION_CHOICE"
    ) {
      const accepted = answer.booleanValue !== false;
      return {
        text: accepted
          ? "Understood. I'll keep that subject in view."
          : "Understood. I won't open that now.",
        followUp: null,
      };
    }
    const next = nextInvestigationQuestion(
      [...state.answeredMissing].at(-1) ?? null,
      answer,
    );
    const magnitude =
      answer.kind === "PERCENTAGE"
        ? `That ${answer.display} increase makes persistent demand pressure more likely.`
        : answer.booleanValue === false
          ? "Understood — that weakens the lasting-capacity case."
          : "That helps. It strengthens the capacity-pressure hypothesis.";
    if (next) {
      return { text: `${magnitude} ${next.question}`, followUp: next };
    }
    if (answer.optionLabel === "more orders") {
      return {
        text: "Then demand pressure is the stronger hypothesis. Capacity is worth investigating before adding lasting production.",
        followUp: null,
      };
    }
    return {
      text: `${magnitude} It strengthens the case for investigating capacity, without treating capacity as a confirmed cause.`,
      followUp: null,
    };
  }
  if (move === "RETURN_TO_TOPIC" && restoredThread) {
    const pending = restoredThread.pendingQuestion;
    const checking = pending?.question
      ? `We were checking: ${pending.question.replace(/\?+\s*$/, "")}.`
      : "We can continue the unresolved advisory work.";
    return {
      text: `Returning to ${restoredThread.subject.name ?? restoredThread.topic.label}. ${checking}`,
      followUp: null,
    };
  }
  if (move === "FOLLOW_UP" && state.lastFailedTurn && /why|what do you mean|what happened|explain/i.test(input.nca.message)) {
    const raw = state.lastFailedTurn.attemptedReference ?? "that reference";
    return {
      text: `I don't have a clear match for “${raw}” in the current executive context, so I didn't switch the discussion.`,
      followUp: null,
    };
  }
  if (move === "FOLLOW_UP" && resolvedDeictic && /why/i.test(input.nca.message)) {
    return {
      text: `${resolvedDeictic} is the option under discussion. The current evidence supports it as the more conservative path, not as a committed decision.`,
      followUp: null,
    };
  }
  if (move === "FOLLOW_UP" && resolvedDeictic) {
    return { text: `Understood — ${resolvedDeictic}.`, followUp: null };
  }
  if (move === "ACCEPT") {
    return {
      text:
        source.length > 12
          ? source
          : "Understood. That is a conversational agreement, not an approved decision.",
      followUp: null,
    };
  }
  if (move === "REJECT") {
    return {
      text: "Understood. We can keep the comparison open and look at another approach without changing any committed decision.",
      followUp: null,
    };
  }
  if (move === "CLOSE_TOPIC") {
    return {
      text:
        source.length > 8
          ? source
          : "Understood. I’ll treat that question as resolved in this conversation.",
      followUp: null,
    };
  }
  if (move === "CORRECT") {
    const name = state.activeSubject?.name ?? "that subject";
    if (!source.toLowerCase().includes(name.toLowerCase())) {
      return { text: `${name} — understood. ${source}`.trim(), followUp: null };
    }
  }
  return { text: source, followUp: null };
}

export function overlayNcaTurnWithDialogue(
  nca: ManagerConversationTurn,
  interpretation: NcaDialogueInterpretation,
): ManagerConversationTurn {
  if (interpretation.move === "ANSWER_NEXORA") {
    return Object.freeze({
      ...nca,
      need: Object.freeze({
        family: "PROVIDE_INFORMATION" as const,
        confidence: 0.9,
      }),
      advisorBehavior: "ANSWER" as const,
      strategy: Object.freeze({
        ...nca.strategy,
        question: null,
        behavior: "ANSWER" as const,
      }),
      conversationContext: Object.freeze({
        ...nca.conversationContext,
        activeTopic:
          interpretation.state.activeTopic?.label ?? nca.conversationContext.activeTopic,
        activeObject:
          interpretation.state.activeSubject?.id ?? nca.conversationContext.activeObject,
      }),
    });
  }
  if (interpretation.move === "ACKNOWLEDGE" || interpretation.move === "ACCEPT") {
    return Object.freeze({
      ...nca,
      advisorBehavior: "ACKNOWLEDGE" as const,
    });
  }
  if (interpretation.move === "RETURN_TO_TOPIC" && interpretation.restoredThread) {
    const restored = interpretation.restoredThread;
    return Object.freeze({
      ...nca,
      need: Object.freeze({
        family: "INVESTIGATE" as const,
        confidence: 0.86,
      }),
      advisorBehavior: "INVESTIGATE" as const,
      conversationContext: Object.freeze({
        ...nca.conversationContext,
        activeTopic: restored.topic.label,
        activeObject: restored.subject.id ?? nca.conversationContext.activeObject,
      }),
    });
  }
  return nca;
}

export function investigationSeedQuestion(nca: ManagerConversationTurn): string | null {
  if (nca.strategy.question) return nca.strategy.question;
  if (nca.need.family !== "INVESTIGATE" && nca.advisorBehavior !== "INVESTIGATE") {
    return null;
  }
  const subject = `${nca.reference.resolvedName ?? ""} ${nca.message}`;
  if (/delivery|capacity/i.test(subject)) {
    return "Has backlog increased recently?";
  }
  return null;
}
