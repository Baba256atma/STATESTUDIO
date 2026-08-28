/**
 * NEX-MVP-FINAL:6.3 — pending-answer, correction, and resume resolution.
 */

import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type { CanonicalManagerMeaning } from "./canonicalManagerMeaning.ts";
import type { ContextualManagerMeaning } from "./contextualManagerMeaning.ts";
import type { ConversationContinuitySnapshot } from "./contextualManagerMeaning.ts";
import { prepareManagerUtterance, prepareManagerUtteranceLight } from "./canonicalManagerMeaningInterpreter.ts";
import { evaluateClarificationGate, composeClarificationQuestion, freezePendingClarification } from "./nexoraMvpFinal63ClarificationGate.ts";
import type {
  ClarificationCandidate,
  ClarificationTurnResult,
  PendingClarification,
} from "./nexoraMvpFinal63ClarificationTypes.ts";

function emptyResult(
  overrides: Partial<ClarificationTurnResult>,
): ClarificationTurnResult {
  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    action: "proceed",
    question: null,
    reason: "NONE",
    pending: null,
    resumeOperation: null,
    resumeReference: null,
    resumeIntentKind: null,
    correctionDetected: false,
    correctionScope: null,
    correctionBeforeId: null,
    correctionAfterId: null,
    cancelled: false,
    consequence: "INQUIRY",
    commitsDecision: false,
    startsExecution: false,
    ...overrides,
  });
}

function normalize(value: string): string {
  return prepareManagerUtterance(value);
}

function namesOf(candidate: ClarificationCandidate): readonly string[] {
  return Object.freeze([
    normalize(candidate.canonicalName),
    normalize(candidate.subjectKind),
  ]);
}

function matchCandidate(
  prepared: string,
  candidates: readonly ClarificationCandidate[],
): ClarificationCandidate | null {
  if (/\bkpi\b/.test(prepared)) {
    const typed = candidates.filter((item) => item.subjectKind === "object");
    if (typed.length === 1) return typed[0] ?? null;
  }
  if (/\b(?:problem|issue)\b/.test(prepared)) {
    const typed = candidates.filter((item) => item.subjectKind === "problem");
    if (typed.length === 1) return typed[0] ?? null;
  }
  const hits = candidates.filter((item) =>
    namesOf(item).some((name) => name && (prepared === name || prepared.includes(name))),
  );
  if (hits.length === 1) return hits[0] ?? null;
  return null;
}

function ordinalCandidate(
  prepared: string,
  candidates: readonly ClarificationCandidate[],
): ClarificationCandidate | null {
  if (candidates.length < 2) return null;
  if (/\b(?:first|option one|the earlier one)\b/.test(prepared)) {
    return candidates[0] ?? null;
  }
  if (/\b(?:second|option two|the latter|the later one)\b/.test(prepared)) {
    return candidates[1] ?? null;
  }
  return null;
}

function isCancel(prepared: string): boolean {
  return /^(?:never mind|forget it|cancel that|lets talk about something else)$/.test(
    prepared,
  );
}

function isParkMeta(meaning: CanonicalManagerMeaning): boolean {
  return (
    meaning.requestedOperation === "HELP" ||
    meaning.communicativeIntent === "ASK_CAPABILITY"
  );
}

function isExplicitCollectionIntent(intentKind: string): boolean {
  return /^(?:show-problems|show-goals|show-scenarios|show-decisions|show-execution|show-related|overview)$/.test(
    intentKind,
  );
}

function isNewCompleteRequest(
  meaning: CanonicalManagerMeaning,
  prepared: string,
  pending: PendingClarification | null,
  intentKind: string,
): boolean {
  if (meaning.requestedOperation === "HELP") return false;
  if (isExplicitCollectionIntent(intentKind)) return true;
  if (meaning.communicativeIntent === "CORRECT" && meaning.objectReference) {
    const targetId = meaning.objectReference.subjectId;
    if (pending?.candidates.some((item) => item.subjectId === targetId)) {
      return false;
    }
    return true;
  }
  if (meaning.communicativeIntent === "CORRECT") return false;
  if (
    pending &&
    meaning.requestedOperation === "FOCUS" &&
    !/\b(?:show|look at|open|bring|display|explain|compare|list|see)\b/.test(prepared)
  ) {
    return false;
  }
  return (
    meaning.objectReference != null &&
    (meaning.requestedOperation === "FOCUS" ||
      meaning.requestedOperation === "EXPLAIN" ||
      meaning.requestedOperation === "COMPARE" ||
      meaning.requestedOperation === "INVESTIGATE")
  );
}

function isCorrection(
  meaning: CanonicalManagerMeaning,
  prepared: string,
): boolean {
  if (meaning.communicativeIntent === "CORRECT") return true;
  if (/\b(?:not the one|wrong one|scratch that)\b/.test(prepared)) return true;
  const rawLight = prepareManagerUtteranceLight(meaning.rawUtterance);
  if (
    meaning.objectReference != null &&
    /^(?:no|actually)\b/.test(rawLight) &&
    !/\b(?:show|explain|compare|look|open|going on)\b/.test(rawLight)
  ) {
    return true;
  }
  if (
    meaning.polarity === "NEGATIVE" &&
    meaning.objectReference != null &&
    meaning.requestedOperation === "NONE"
  ) {
    return true;
  }
  return /^(?:the other one|wrong one)$/.test(prepared);
}

function toRef(
  candidate: ClarificationCandidate,
): ClarificationTurnResult["resumeReference"] {
  return Object.freeze({
    subjectId: candidate.subjectId,
    canonicalName: candidate.canonicalName,
    lexicalHint: candidate.canonicalName,
    subjectKind: candidate.subjectKind,
  });
}

function ask(
  original: CanonicalManagerMeaning,
  operation: CanonicalManagerMeaning["requestedOperation"],
  reason: PendingClarification["reason"],
  candidates: readonly ClarificationCandidate[],
  consequence: PendingClarification["consequence"],
  previous: PendingClarification | null | undefined,
  originalIntentKind: string,
): ClarificationTurnResult {
  const composed = composeClarificationQuestion(reason, candidates, operation);
  const signature = `${reason}:${candidates.map((item) => item.subjectId).join(",")}:${composed.question}`;
  const loopCount =
    previous && previous.questionSignature === signature ? previous.loopCount + 1 : 0;
  if (loopCount >= 2) {
    return emptyResult({
      action: "fail",
      reason,
      question: "I'm not sure which issue you mean. Name the one you want to investigate.",
      consequence,
    });
  }
  const pending = freezePendingClarification({
    identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    reason,
    originalUtterance: original.rawUtterance,
    requestedOperation: operation,
    candidates,
    expectedAnswer: composed.expected,
    binaryCandidateId:
      composed.expected === "binary" ? candidates[0]?.subjectId ?? null : null,
    question: composed.question,
    questionSignature: signature,
    loopCount,
    parked: false,
    consequence,
    originalIntentKind,
  });
  return emptyResult({
    action: "clarify",
    reason,
    question: composed.question,
    pending,
    consequence,
  });
}

export function interpretClarificationTurn(input: {
  readonly turnMeaning: CanonicalManagerMeaning;
  readonly contextual: ContextualManagerMeaning;
  readonly pending: PendingClarification | null | undefined;
  readonly continuity: ConversationContinuitySnapshot | null;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
  readonly intentKind: string;
}): ClarificationTurnResult {
  const prepared = input.turnMeaning.preparedUtterance || prepareManagerUtterance(input.turnMeaning.rawUtterance);
  const pending = input.pending ?? null;

  if (pending && isParkMeta(input.turnMeaning)) {
    return emptyResult({
      action: "park",
      pending: freezePendingClarification({ ...pending, parked: true }),
      reason: pending.reason,
      consequence: pending.consequence,
    });
  }

  if (pending?.parked && /^(?:back to that|where were we|continue)$/.test(prepared)) {
    return emptyResult({
      action: "unpark",
      question: pending.question,
      pending: freezePendingClarification({ ...pending, parked: false }),
      reason: pending.reason,
      consequence: pending.consequence,
    });
  }

  if (pending && isCancel(prepared)) {
    return emptyResult({
      action: "cancel",
      cancelled: true,
      pending: null,
      consequence: pending.consequence,
    });
  }

  if (
    pending &&
    /commit|prefer-option|start-execution|confirm-decision/.test(input.intentKind)
  ) {
    return emptyResult({
      action: "proceed",
      cancelled: true,
      pending: null,
      consequence: pending.consequence,
    });
  }

  if (pending && isNewCompleteRequest(input.turnMeaning, prepared, pending, input.intentKind)) {
    return emptyResult({
      action: "proceed",
      cancelled: true,
      pending: null,
      consequence: pending.consequence,
    });
  }

  if (pending && !pending.parked) {
    if (pending.expectedAnswer === "binary") {
      if (/^(?:yes|yeah|yep|ok|okay)$/.test(prepared) && pending.candidates[0]) {
        return emptyResult({
          action: "resume",
          pending: null,
          resumeOperation: pending.requestedOperation,
          resumeReference: toRef(pending.candidates[0]!),
          resumeIntentKind: pending.originalIntentKind,
          reason: pending.reason,
          consequence: pending.consequence,
        });
      }
      if (/^(?:no|nope)$/.test(prepared)) {
        return ask(
          input.turnMeaning,
          pending.requestedOperation,
          pending.reason,
          Object.freeze([]),
          pending.consequence,
          pending,
          pending.originalIntentKind,
        );
      }
    }
    if (/^(?:yes|yeah|yep)$/.test(prepared) && pending.expectedAnswer === "choice") {
      return ask(
        input.turnMeaning,
        pending.requestedOperation,
        pending.reason,
        pending.candidates,
        pending.consequence,
        pending,
        pending.originalIntentKind,
      );
    }
    if (/^(?:neither|none of those)$/.test(prepared)) {
      return ask(
        input.turnMeaning,
        pending.requestedOperation,
        "MISSING_SUBJECT",
        Object.freeze([]),
        pending.consequence,
        pending,
        pending.originalIntentKind,
      );
    }
    const ordinal = ordinalCandidate(prepared, pending.candidates);
    const named = matchCandidate(prepared, pending.candidates);
    const other =
      /\bthe other one\b/.test(prepared) && pending.candidates.length === 2
        ? pending.candidates.find(
            (item) => item.subjectId !== pending.binaryCandidateId,
          ) ?? pending.candidates[1]
        : null;
    const picked = ordinal ?? named ?? other ?? null;
    if (picked) {
      return emptyResult({
        action: "resume",
        pending: null,
        resumeOperation: pending.requestedOperation,
        resumeReference: toRef(picked),
        resumeIntentKind: pending.originalIntentKind,
        reason: pending.reason,
        consequence: pending.consequence,
      });
    }
    if (input.turnMeaning.objectReference) {
      const matched = pending.candidates.find(
        (item) => item.subjectId === input.turnMeaning.objectReference?.subjectId,
      );
      if (matched) {
        return emptyResult({
          action: "resume",
          pending: null,
          resumeOperation: pending.requestedOperation,
          resumeReference: toRef(matched),
          resumeIntentKind: pending.originalIntentKind,
          reason: pending.reason,
          consequence: pending.consequence,
        });
      }
      if (pending.expectedAnswer === "choice" || pending.expectedAnswer === "subject") {
        return emptyResult({
          action: "resume",
          pending: null,
          resumeOperation: pending.requestedOperation,
          resumeReference: input.turnMeaning.objectReference,
          resumeIntentKind: pending.originalIntentKind,
          reason: pending.reason,
          consequence: pending.consequence,
        });
      }
    }
    if (/\bthe other one\b/.test(prepared) && pending.candidates.length > 2) {
      return ask(
        input.turnMeaning,
        pending.requestedOperation,
        "REFERENCE_AMBIGUITY",
        pending.candidates,
        pending.consequence,
        pending,
        pending.originalIntentKind,
      );
    }
    return ask(
      input.turnMeaning,
      pending.requestedOperation,
      pending.reason,
      pending.candidates,
      pending.consequence,
      pending,
      pending.originalIntentKind,
    );
  }

  if (isCorrection(input.turnMeaning, prepared)) {
    const target =
      input.turnMeaning.objectReference ??
      (/\bthe other one\b/.test(prepared) && input.continuity?.previousSubjectId
        ? Object.freeze({
            subjectId: input.continuity.previousSubjectId,
            canonicalName: input.subjects.find(
              (item) => item.subjectId === input.continuity?.previousSubjectId,
            )?.canonicalName ?? null,
            lexicalHint: null,
            subjectKind:
              input.subjects.find(
                (item) => item.subjectId === input.continuity?.previousSubjectId,
              )?.subjectKind ?? "object",
          })
        : null);
    if (!target?.subjectId) {
      return ask(
        input.turnMeaning,
        input.continuity?.activeOperation ?? "EXPLAIN",
        "CORRECTION_TARGET_AMBIGUITY",
        evaluateClarificationGate({
          contextual: input.contextual,
          intentKind: input.intentKind,
          continuity: input.continuity,
          subjects: input.subjects,
        }).candidates,
        "INQUIRY",
        pending,
        input.intentKind,
      );
    }
    return emptyResult({
      action: "resume",
      correctionDetected: true,
      correctionScope: pending ? "PENDING_CLARIFICATION" : "ACTIVE_SUBJECT",
      correctionBeforeId: input.continuity?.activeSubjectId ?? null,
      correctionAfterId: target.subjectId,
      resumeOperation:
        input.continuity?.activeOperation && input.continuity.activeOperation !== "NONE"
          ? input.continuity.activeOperation
          : "FOCUS",
      resumeReference: target,
      resumeIntentKind: null,
      pending: null,
      consequence: "INQUIRY",
    });
  }

  const gate = evaluateClarificationGate({
    contextual: input.contextual,
    intentKind: input.intentKind,
    continuity: input.continuity,
    subjects: input.subjects,
  });
  if (!gate.required) {
    return emptyResult({
      action: "proceed",
      consequence: gate.consequence,
      reason: "NONE",
    });
  }
  return ask(
    input.turnMeaning,
    input.contextual.requestedOperation,
    gate.reason,
    gate.candidates,
    gate.consequence,
    pending,
    input.intentKind,
  );
}
