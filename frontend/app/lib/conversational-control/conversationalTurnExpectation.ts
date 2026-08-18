/**
 * UX:4-FIX2 — short-lived dialogue-turn expectation.
 *
 * This is CC session state, not product Runtime or durable Executive Memory.
 * Consequential intent is never inferred from rendered response text.
 */

import type {
  NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";

export const NEXORA_PENDING_TURN_EXPECTATION_KINDS = Object.freeze([
  "review-subject",
  "show-evidence",
  "compare-scenarios",
  "select-subject",
  "select-scenario",
  "decision-commitment",
  "clarification",
] as const);

export type NexoraPendingTurnExpectationKind =
  (typeof NEXORA_PENDING_TURN_EXPECTATION_KINDS)[number];

export type NexoraPendingTurnAnswerKind =
  | "confirmation"
  | "subject-selection"
  | "scenario-selection"
  | "decision-option"
  | "clarification";

export type NexoraPendingTurnExpectation = {
  readonly expectationId: string;
  readonly questionKind: NexoraPendingTurnExpectationKind;
  readonly expectedAnswerKind: NexoraPendingTurnAnswerKind;
  readonly subjectId: string | null;
  readonly optionIds: readonly string[];
  readonly sourceCapability: "CC:2" | "CC:5" | "CC:8" | "CC:9" | "CC:10";
  readonly consequential: boolean;
  readonly confirmationLevel: "none" | "review" | "consequential";
};

export type NexoraPendingTurnResolution = {
  readonly status:
    | "answered"
    | "declined"
    | "clarification-required"
    | "interrupted";
  readonly answerKind:
    | "affirmative"
    | "negative"
    | "entity"
    | "ambiguous"
    | "explicit-intent";
  readonly expectation: NexoraPendingTurnExpectation;
  readonly subjectId: string | null;
  /** Existing CC:1 understands this semantic utterance. */
  readonly semanticUtterance: string | null;
};

export type NexoraBareSubjectResolution = {
  readonly status: "resolved" | "ambiguous" | "not-found";
  readonly subject: NexoraConversationalSubjectRecord | null;
  readonly candidates: readonly NexoraConversationalSubjectRecord[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[?!.,]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesFor(subject: NexoraConversationalSubjectRecord): readonly string[] {
  return Object.freeze([
    normalize(subject.canonicalName),
    ...(subject.aliases ?? []).map(normalize),
  ]);
}

export function resolveBareNexoraSubjectReference(input: {
  readonly utterance: string;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
  readonly allowedSubjectIds?: readonly string[];
}): NexoraBareSubjectResolution {
  const normalized = normalize(input.utterance);
  if (!normalized || normalized.split(" ").length > 5) {
    return Object.freeze({
      status: "not-found",
      subject: null,
      candidates: Object.freeze([]),
    });
  }
  const allowed =
    input.allowedSubjectIds && input.allowedSubjectIds.length > 0
      ? new Set(input.allowedSubjectIds)
      : null;
  const candidates = input.subjects.filter(
    (subject) =>
      (allowed == null || allowed.has(subject.subjectId)) &&
      namesFor(subject).includes(normalized),
  );
  if (candidates.length === 1) {
    return Object.freeze({
      status: "resolved",
      subject: candidates[0]!,
      candidates: Object.freeze(candidates),
    });
  }
  return Object.freeze({
    status: candidates.length > 1 ? "ambiguous" : "not-found",
    subject: null,
    candidates: Object.freeze(candidates),
  });
}

export function isNexoraAffirmativeReply(utterance: string): boolean {
  return /^(?:yes|yeah|yep|sure|ok|okay|please|please do|go ahead|do it|proceed)$/.test(
    normalize(utterance),
  );
}

export function isNexoraNegativeReply(utterance: string): boolean {
  return /^(?:no|nope|no cancel|not now|no thanks|no thank you|don t|do not)$/.test(
    normalize(utterance).replace(/[',]/g, " ").replace(/\s+/g, " "),
  );
}

function subjectName(
  subjectId: string | null,
  subjects: readonly NexoraConversationalSubjectRecord[],
): string | null {
  if (!subjectId) return null;
  return (
    subjects.find((subject) => subject.subjectId === subjectId)?.canonicalName ??
    null
  );
}

export function resolveNexoraPendingTurnAnswer(input: {
  readonly utterance: string;
  readonly initialIntentKind: string;
  readonly expectation: NexoraPendingTurnExpectation | null;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
}): NexoraPendingTurnResolution | null {
  const expectation = input.expectation;
  if (!expectation) return null;

  const genericDecisionReply =
    input.initialIntentKind === "confirm-decision-commitment" ||
    input.initialIntentKind === "cancel-decision-commitment" ||
    input.initialIntentKind === "unknown";
  const affirmative = isNexoraAffirmativeReply(input.utterance);
  const negative = isNexoraNegativeReply(input.utterance);

  // An explicit new command/question interrupts and clears the old expectation.
  if (!genericDecisionReply && !affirmative && !negative) {
    return Object.freeze({
      status: "interrupted",
      answerKind: "explicit-intent",
      expectation,
      subjectId: null,
      semanticUtterance: null,
    });
  }

  if (affirmative) {
    const subjectLabel = subjectName(expectation.subjectId, input.subjects);
    switch (expectation.questionKind) {
      case "review-subject":
        return Object.freeze({
          status: subjectLabel ? "answered" : "clarification-required",
          answerKind: subjectLabel ? "affirmative" : "ambiguous",
          expectation,
          subjectId: expectation.subjectId,
          semanticUtterance: subjectLabel
            ? `Focus on ${subjectLabel}`
            : null,
        });
      case "show-evidence":
        return Object.freeze({
          status: "answered",
          answerKind: "affirmative",
          expectation,
          subjectId: expectation.subjectId,
          semanticUtterance: "What evidence do we have?",
        });
      case "compare-scenarios":
        return Object.freeze({
          status: "answered",
          answerKind: "affirmative",
          expectation,
          subjectId: expectation.subjectId,
          semanticUtterance: "Compare the scenarios",
        });
      case "decision-commitment":
        return Object.freeze({
          status: "answered",
          answerKind: "affirmative",
          expectation,
          subjectId: expectation.subjectId,
          semanticUtterance: "Confirm decision commitment",
        });
      default:
        return Object.freeze({
          status: "clarification-required",
          answerKind: "ambiguous",
          expectation,
          subjectId: expectation.subjectId,
          semanticUtterance: null,
        });
    }
  }

  if (negative) {
    return Object.freeze({
      status: "declined",
      answerKind: "negative",
      expectation,
      subjectId: expectation.subjectId,
      semanticUtterance:
        expectation.questionKind === "decision-commitment"
          ? "Cancel decision commitment"
          : null,
    });
  }

  if (
    expectation.expectedAnswerKind === "subject-selection" ||
    expectation.expectedAnswerKind === "scenario-selection"
  ) {
    const entity = resolveBareNexoraSubjectReference({
      utterance: input.utterance,
      subjects: input.subjects,
      allowedSubjectIds: expectation.optionIds,
    });
    if (entity.status === "resolved" && entity.subject) {
      return Object.freeze({
        status: "answered",
        answerKind: "entity",
        expectation,
        subjectId: entity.subject.subjectId,
        semanticUtterance: `Focus on ${entity.subject.canonicalName}`,
      });
    }
    if (/^(?:it|this|that|that one|this one)$/.test(normalize(input.utterance))) {
      return Object.freeze({
        status: "clarification-required",
        answerKind: "ambiguous",
        expectation,
        subjectId: null,
        semanticUtterance: null,
      });
    }
  }

  return null;
}

export function createNexoraPendingTurnExpectation(input: {
  readonly expectationId: string;
  readonly questionKind: NexoraPendingTurnExpectationKind;
  readonly expectedAnswerKind: NexoraPendingTurnAnswerKind;
  readonly subjectId?: string | null;
  readonly optionIds?: readonly string[];
  readonly sourceCapability: NexoraPendingTurnExpectation["sourceCapability"];
  readonly consequential?: boolean;
  readonly confirmationLevel?: NexoraPendingTurnExpectation["confirmationLevel"];
}): NexoraPendingTurnExpectation {
  return Object.freeze({
    expectationId: input.expectationId,
    questionKind: input.questionKind,
    expectedAnswerKind: input.expectedAnswerKind,
    subjectId: input.subjectId ?? null,
    optionIds: Object.freeze([...(input.optionIds ?? [])]),
    sourceCapability: input.sourceCapability,
    consequential: input.consequential === true,
    confirmationLevel: input.confirmationLevel ?? "none",
  });
}

