/**
 * NPA-T RMS:4 — conversation error classification. Observer records; does not repair.
 */

import type { Rms4ConversationClassification, Rms4ConversationErrorKind } from "./rmsManagerContract.ts";
import type { RmsCc5Turn } from "./rmsManagerCc5Adapter.ts";

export function classifyRmsConversationTurn(input: {
  readonly classificationId: string;
  readonly utterance: string;
  readonly result: RmsCc5Turn;
  readonly previousSubjectId: string | null;
  readonly expectedSubjectLabel?: string | null;
}): readonly Rms4ConversationClassification[] {
  const records: Rms4ConversationClassification[] = [];
  const focused = input.result.nextRuntimeState.focusedSubject?.label ?? input.result.trace.executiveCurrentSubjectId;
  if (
    input.expectedSubjectLabel &&
    /\b(it|that|this)\b/i.test(input.utterance) &&
    focused &&
    !focused.toLowerCase().includes(input.expectedSubjectLabel.toLowerCase().slice(0, 8)) &&
    input.result.nextRuntimeState.focusedSubject?.label &&
    input.result.nextRuntimeState.focusedSubject.label !== input.expectedSubjectLabel
  ) {
    records.push(classify(input.classificationId, "WRONG_REFERENT", `focused ${input.result.nextRuntimeState.focusedSubject.label} after deictic turn`, "nexora-product"));
  }
  if (input.previousSubjectId && /\b(it|that)\b/i.test(input.utterance) && input.result.trace.executiveCurrentSubjectId && input.result.trace.executiveCurrentSubjectId !== input.previousSubjectId) {
    records.push(classify(`${input.classificationId}:stale`, "STALE_SUBJECT", "subject changed on deictic follow-up", "nexora-product"));
  }
  if (/availableCapacity|machineAvailability|confirmedCausal/i.test(input.result.response)) {
    records.push(classify(`${input.classificationId}:gt`, "GROUND_TRUTH_LEAKAGE", "Nexora response contains sealed Ground Truth keys", "rms-integration"));
  }
  if (/CAP_AV is Available Capacity/i.test(input.result.response)) {
    records.push(classify(`${input.classificationId}:sem`, "SEMANTIC_LEAKAGE", "unconfirmed operational field was confirmed", "rms-integration"));
  }
  if (input.result.status === "failed") {
    records.push(classify(`${input.classificationId}:rt`, "CONVERSATION_RUNTIME_FAILURE", String(input.result.status), "nexora-product"));
  }
  if (/\bfallback\b/i.test(input.result.response)) {
    records.push(classify(`${input.classificationId}:fb`, "NEXORA_FALLBACK", "response mentions fallback", "nexora-product"));
  }
  return Object.freeze(records);
}

export function classifyRmsConversationManual(
  classificationId: string,
  kind: Rms4ConversationErrorKind,
  note: string,
  origin: Rms4ConversationClassification["origin"],
): Rms4ConversationClassification {
  return classify(classificationId, kind, note, origin);
}

function classify(
  classificationId: string,
  kind: Rms4ConversationErrorKind,
  note: string,
  origin: Rms4ConversationClassification["origin"],
): Rms4ConversationClassification {
  return Object.freeze({
    classificationId,
    kind,
    note,
    origin,
    repaired: false as const,
  });
}
