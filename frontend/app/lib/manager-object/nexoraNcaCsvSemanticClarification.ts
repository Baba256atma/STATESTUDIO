/** DATA-UX:3/5-FIX1 adapter into the existing NCA:2 pending-question authority. */
import { classifyManagerSpeechAct } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import type { CsvSemanticClarification } from "../data-reality/csvSemanticUnderstanding.ts";
import {
  createEmptyNcaConversationState,
  freezeNcaConversationState,
} from "./nexoraNca2ConversationState.ts";
import type { NcaAnswerPayload } from "./nexoraNca2ConversationStateTypes.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";

type NcaSessionCarrier = Readonly<{
  ncaConversationState?: NexoraConversationState | null;
  readonly [key: string]: unknown;
}>;

export const NCA_CSV_SEMANTIC_PURPOSE = "csv-semantic-clarification" as const;

export type CsvSemanticClarificationUtteranceKind =
  | "affirm"
  | "reject"
  | "correct"
  | "unknown"
  | "defer"
  | "ignore"
  | "tentative"
  | "unrelated";

export type NcaCsvSemanticReply<TSession extends NcaSessionCarrier = NcaSessionCarrier> = Readonly<{
  fieldId: string;
  sourceColumn: string;
  sourceContextId: string | null;
  utterance: string;
  disposition: "answer" | "unknown" | "defer" | "reject" | "ignore";
  kind: Exclude<CsvSemanticClarificationUtteranceKind, "unrelated" | "tentative">;
  consumesPending: true;
  nextSession: TSession;
}>;

function prepared(utterance: string): string {
  return utterance.trim().replace(/[.!]+$/g, "").trim();
}

export function classifyCsvSemanticClarificationUtterance(utterance: string): CsvSemanticClarificationUtteranceKind {
  const text = prepared(utterance);
  const lower = text.toLowerCase();
  if (/\b(?:ignore(?: it| this(?: column| field)?)?|don'?t use this (?:column|field)|(?:this field|this column) isn'?t relevant)\b/i.test(lower)) {
    return "ignore";
  }
  if (/\b(?:ask me later|later|not now)\b/i.test(lower)) return "defer";
  if (/\b(?:i don'?t know|not sure|no idea)\b/i.test(lower)) return "unknown";
  if (/^(?:maybe|i think so|perhaps|possibly|probably)$/i.test(lower)) return "tentative";
  const speech = classifyManagerSpeechAct(utterance);
  if (speech === "QUESTION") return "unrelated";
  if (speech === "COMMAND") return "unrelated";
  if (speech === "SOCIAL") return "unrelated";
  if (/^no\b/i.test(lower) && /\bmeans\b/i.test(lower)) return "correct";
  if (/^(?:no|nope|that is not correct|that'?s not correct|that is not right)\b/i.test(lower)) return "reject";
  if (/^(?:yes|yeah|yep|correct|that'?s (?:right|correct)|yes,? it does|yes,? it is)\b/i.test(lower)) return "affirm";
  if (/\b(?:is|means|represents)\b/i.test(lower)) return "correct";
  if (speech === "CORRECTION") return "correct";
  if (speech === "ANSWER" && /^yes\b/i.test(lower)) return "affirm";
  if (speech === "ANSWER" && /^no\b/i.test(lower)) return "reject";
  return "unrelated";
}

export function csvSemanticClarificationTopicId(sourceContextId: string): string {
  return `csv-semantic:${sourceContextId}`;
}

export function beginNcaCsvSemanticClarification<TSession extends NcaSessionCarrier>(
  session: TSession,
  need: CsvSemanticClarification,
): TSession {
  const nca = session.ncaConversationState ?? createEmptyNcaConversationState();
  const existing = nca.pendingQuestion;
  if (
    existing?.valid &&
    existing.purpose === NCA_CSV_SEMANTIC_PURPOSE &&
    existing.relatedSubjectId === need.fieldId &&
    existing.question === need.question
  ) {
    return session;
  }
  const pending = Object.freeze({
    askedBy: "NEXORA" as const,
    question: need.question,
    purpose: NCA_CSV_SEMANTIC_PURPOSE,
    expectedInformation: "FREE_TEXT" as const,
    relatedSubjectId: need.fieldId,
    relatedSubjectName: need.sourceColumn,
    relatedGoal: null,
    valid: true,
    expiresOn: "answered" as const,
    askedAtTurn: nca.turnIndex,
    status: "ACTIVE" as const,
    questionPurpose: "CLARIFY_CSV_FIELD_MEANING",
  });
  return Object.freeze({
    ...session,
    ncaConversationState: freezeNcaConversationState({
      ...nca,
      activeSubject: Object.freeze({ id: need.fieldId, name: need.sourceColumn, kind: "csv-field" }),
      activeTopic: Object.freeze({ id: csvSemanticClarificationTopicId(need.sourceContextId), label: `${need.sourceColumn} meaning` }),
      dialogueMove: "CLARIFY",
      pendingQuestion: pending,
      lastNexoraQuestion: need.question,
    }),
  }) as TSession;
}

export function endNcaCsvSemanticClarification<TSession extends NcaSessionCarrier>(
  session: TSession,
  sourceContextId?: string,
): TSession {
  const nca = session.ncaConversationState;
  const pending = nca?.pendingQuestion;
  if (!nca || pending?.purpose !== NCA_CSV_SEMANTIC_PURPOSE) return session;
  if (sourceContextId && nca.activeTopic?.id !== csvSemanticClarificationTopicId(sourceContextId)) {
    return session;
  }
  return Object.freeze({
    ...session,
    ncaConversationState: freezeNcaConversationState({
      ...nca,
      pendingQuestion: null,
      dialogueMove: "CLOSE_TOPIC",
    }),
  }) as TSession;
}

export function resolveNcaCsvSemanticReply<TSession extends NcaSessionCarrier>(
  session: TSession,
  utterance: string,
): NcaCsvSemanticReply<TSession> | null {
  const nca = session.ncaConversationState;
  const pending = nca?.pendingQuestion;
  if (!nca || !pending?.valid || pending.purpose !== NCA_CSV_SEMANTIC_PURPOSE || !pending.relatedSubjectId) return null;
  const kind = classifyCsvSemanticClarificationUtterance(utterance);
  if (kind === "unrelated" || kind === "tentative") return null;
  const disposition: NcaCsvSemanticReply["disposition"] =
    kind === "unknown" ? "unknown"
      : kind === "defer" ? "defer"
        : kind === "reject" ? "reject"
          : kind === "ignore" ? "ignore"
            : "answer";
  const answer: NcaAnswerPayload = Object.freeze({
    kind: "FREE_TEXT",
    raw: utterance,
    display: utterance.trim(),
    booleanValue: kind === "affirm" ? true : kind === "reject" ? false : null,
    numericValue: null,
    optionIndex: null,
    optionLabel: null,
  });
  const nextNca = freezeNcaConversationState({
    ...nca,
    turnIndex: nca.turnIndex + 1,
    dialogueMove: disposition === "answer" ? "ANSWER_NEXORA" : kind === "reject" ? "REJECT" : "ACKNOWLEDGE",
    pendingQuestion: null,
    lastAnswer: answer,
    answeredMissing: disposition === "answer" || disposition === "ignore"
      ? Object.freeze([...new Set([...nca.answeredMissing, NCA_CSV_SEMANTIC_PURPOSE])])
      : nca.answeredMissing,
  });
  const sourceContextId = nca.activeTopic?.id.startsWith("csv-semantic:")
    ? nca.activeTopic.id.slice("csv-semantic:".length)
    : null;
  return Object.freeze({
    fieldId: pending.relatedSubjectId,
    sourceColumn: pending.relatedSubjectName ?? "this field",
    sourceContextId,
    utterance,
    disposition,
    kind,
    consumesPending: true as const,
    nextSession: Object.freeze({ ...session, ncaConversationState: nextNca }) as TSession,
  });
}
