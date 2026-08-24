/**
 * NEX-MVP-FINAL:6.2 — session-scoped conversation continuity.
 * Stores references only. Bounded. Resets with the executive session.
 */

import type { CanonicalManagerOperation } from "./canonicalManagerMeaning.ts";
import type {
  ConversationContinuitySnapshot,
  ConversationThreadFrame,
} from "./contextualManagerMeaning.ts";

export const CONVERSATION_CONTINUITY_BOUNDS = Object.freeze({
  thread: 8,
  presented: 12,
});

export function createEmptyConversationContinuity(): ConversationContinuitySnapshot {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
    activeSubjectId: null,
    activeSubjectKind: null,
    activeInvestigationId: null,
    activeOperation: "NONE",
    activeQuestionType: "NONE",
    previousSubjectId: null,
    thread: Object.freeze([]),
    presentedIds: Object.freeze([]),
    continuationIndex: 0,
    lastRecommendedTargetId: null,
    lastRecommendationId: null,
    parkedThread: null,
    parkedActiveSubjectId: null,
    correctedSubjectId: null,
    turnIndex: 0,
  });
}

export function freezeConversationContinuity(
  snapshot: ConversationContinuitySnapshot,
): ConversationContinuitySnapshot {
  return Object.freeze({
    ...snapshot,
    identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
    thread: Object.freeze([...snapshot.thread]),
    presentedIds: Object.freeze([...snapshot.presentedIds]),
    parkedThread: snapshot.parkedThread
      ? Object.freeze([...snapshot.parkedThread])
      : null,
  });
}

export function correctConversationSubject(
  snapshot: ConversationContinuitySnapshot,
  subjectId: string,
  subjectKind = "object",
): ConversationContinuitySnapshot {
  const previous = snapshot.activeSubjectId;
  const frame: ConversationThreadFrame = Object.freeze({
    subjectId,
    subjectKind,
    operation: snapshot.activeOperation,
    turnIndex: snapshot.turnIndex,
  });
  return freezeConversationContinuity({
    ...snapshot,
    activeSubjectId: subjectId,
    activeSubjectKind: subjectKind,
    previousSubjectId:
      previous && previous !== subjectId ? previous : snapshot.previousSubjectId,
    correctedSubjectId: subjectId,
    thread: pushThread(snapshot.thread, frame),
  });
}

export function repairConversationSubject(
  snapshot: ConversationContinuitySnapshot,
  subjectId: string,
  subjectKind = "object",
): ConversationContinuitySnapshot {
  const last = snapshot.thread[snapshot.thread.length - 1];
  const repaired: ConversationThreadFrame = Object.freeze({
    subjectId,
    subjectKind,
    operation: last?.operation ?? snapshot.activeOperation,
    turnIndex: snapshot.turnIndex,
  });
  const thread =
    snapshot.thread.length === 0
      ? Object.freeze([repaired])
      : Object.freeze([...snapshot.thread.slice(0, -1), repaired]);
  return freezeConversationContinuity({
    ...snapshot,
    activeSubjectId: subjectId,
    activeSubjectKind: subjectKind,
    correctedSubjectId: subjectId,
    thread,
  });
}

export function pushThread(
  thread: readonly ConversationThreadFrame[],
  frame: ConversationThreadFrame,
): readonly ConversationThreadFrame[] {
  if (thread[thread.length - 1]?.subjectId === frame.subjectId) {
    const next = [...thread];
    next[next.length - 1] = frame;
    return Object.freeze(next.slice(-CONVERSATION_CONTINUITY_BOUNDS.thread));
  }
  return Object.freeze(
    [...thread, frame].slice(-CONVERSATION_CONTINUITY_BOUNDS.thread),
  );
}

export function popThread(
  thread: readonly ConversationThreadFrame[],
): {
  readonly previous: ConversationThreadFrame | null;
  readonly remaining: readonly ConversationThreadFrame[];
} {
  if (thread.length < 2) {
    return Object.freeze({
      previous: thread[0] ?? null,
      remaining: thread,
    });
  }
  const remaining = thread.slice(0, -1);
  return Object.freeze({
    previous: remaining[remaining.length - 1] ?? null,
    remaining: Object.freeze(remaining),
  });
}

export function isBusinessOperation(operation: CanonicalManagerOperation): boolean {
  return operation !== "HELP" && operation !== "NONE" && operation !== "OBSERVE";
}
