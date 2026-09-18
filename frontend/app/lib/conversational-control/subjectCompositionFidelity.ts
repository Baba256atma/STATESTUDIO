/**
 * Read-only composition fidelity: a resolved conversational subject must remain
 * compatible with the subject-specific candidate used for the manager-facing answer.
 *
 * Not a referent store, Stage store, or Scenario authority. Consumes CC:7 current
 * subject and FINAL:6.2 continuity.
 */

import { isTargetedDeicticInvestigationUtterance } from "./conversationalIntentNormalization.ts";

export type CompositionSubjectRef = Readonly<{
  readonly id: string | null;
  readonly kind: string | null;
}>;

export type SubjectCompositionFidelityDecision = Readonly<{
  readonly identity: "MRA:3-FINAL-FIX1-FIX1/SubjectCompositionFidelity";
  readonly resolvedSubject: CompositionSubjectRef;
  readonly candidateSubject: CompositionSubjectRef;
  readonly candidateSource: string | null;
  readonly selectedSubject: CompositionSubjectRef;
  readonly compatible: boolean;
  readonly relatedOnly: boolean;
  readonly blockedStaleScenarioAssessment: boolean;
}>;

const NON_SCENARIO_SUBJECT_KINDS = new Set([
  "problem",
  "object",
  "decision",
  "execution",
  "data",
  "goal",
  "risk",
  "kpi",
]);

export function resolveConversationalCompositionSubject(input: {
  readonly continuityId?: string | null;
  readonly continuityKind?: string | null;
  readonly currentSubjectId?: string | null;
  readonly currentSubjectKind?: string | null;
}): CompositionSubjectRef {
  if (input.continuityId && input.continuityKind) {
    return Object.freeze({
      id: input.continuityId,
      kind: input.continuityKind,
    });
  }
  if (input.currentSubjectId && input.currentSubjectKind) {
    return Object.freeze({
      id: input.currentSubjectId,
      kind: input.currentSubjectKind,
    });
  }
  return Object.freeze({
    id: input.continuityId ?? input.currentSubjectId ?? null,
    kind: input.continuityKind ?? input.currentSubjectKind ?? null,
  });
}

export function isRelatedObjectInquiry(
  intentKind: string,
  normalizedUtterance: string,
): boolean {
  if (intentKind === "show-related") return true;
  return (
    /\brelated\b/.test(normalizedUtterance) &&
    /\b(?:scenario|problem|decision|execution|risk|goal|kpi|object|data)\b/.test(
      normalizedUtterance,
    )
  );
}

export function isScenarioAssessmentFollowUpOperation(
  intentKind: string,
  normalizedUtterance: string,
): boolean {
  if (
    intentKind === "explore-scenario" ||
    intentKind === "explain-scenario" ||
    intentKind === "compare-scenarios" ||
    intentKind === "define-scenario" ||
    intentKind === "evaluate-scenario" ||
    intentKind === "modify-scenario" ||
    intentKind === "evidence" ||
    intentKind === "risk"
  ) {
    return true;
  }
  return (
    /^(?:how sure(?: are (?:you|we))?|how confident(?: are (?:you|we))?|are you sure)$/.test(
      normalizedUtterance,
    ) ||
    /^(?:what could be affected|which kpi|what risks?|what(?: is|s) the downside)$/.test(
      normalizedUtterance,
    ) ||
    /^(?:why|why this|why that)$/.test(normalizedUtterance)
  );
}

export function isSubjectPreservingAnalyticalFollowUpOperation(
  intentKind: string,
  normalizedUtterance: string,
): boolean {
  if (
    intentKind === "evidence" ||
    intentKind === "risk" ||
    intentKind === "impact"
  ) {
    return true;
  }
  if (isDeicticSubjectFollowUpUtterance(normalizedUtterance)) return true;
  return /^(?:why|how sure(?: are (?:you|we))?|how confident(?: are (?:you|we))?|are you sure|what(?: is| s) uncertain|what don(?:'| )?t we know|what are we missing|what evidence(?: do we have| supports (?:it|this|that))?|what(?: is| s) the (?:trend|impact)|is (?:it|this|that) good or bad|how serious is (?:it|this|that))$/.test(
    normalizedUtterance,
  );
}

export function isDeicticSubjectExplainUtterance(
  normalizedUtterance: string,
): boolean {
  return /^(?:explain(?: it| this| that)?|tell me about (?:it|this|that)|tell me more(?: about (?:it|this|that|this one|that one))?|what is (?:it|this|that))$/.test(
    normalizedUtterance,
  );
}

export function isDeicticRelatedObjectUtterance(
  normalizedUtterance: string,
): boolean {
  return /^(?:what is related(?: to (?:it|this|that|this one|that one))?|what is connected(?: to (?:it|this|that|this one|that one))?)$/.test(
    normalizedUtterance,
  );
}

export function isDeicticSubjectFollowUpUtterance(
  normalizedUtterance: string,
): boolean {
  if (isDeicticSubjectExplainUtterance(normalizedUtterance)) return true;
  if (isDeicticRelatedObjectUtterance(normalizedUtterance)) return true;
  if (/^why(?: is (?:it|this|that) important)?$/.test(normalizedUtterance)) return true;
  if (
    /^(?:where is this in (?:my )?business|why is this (?:in attention|here)|where are we with this(?: problem)?|what is missing)$/.test(
      normalizedUtterance,
    )
  ) {
    return true;
  }
  return isTargetedDeicticInvestigationUtterance(normalizedUtterance);
}

export function isDeicticSubjectExplain(
  intentKind: string,
  normalizedUtterance: string,
): boolean {
  if (intentKind !== "explain" && intentKind !== "explain-scenario") {
    return false;
  }
  return isDeicticSubjectExplainUtterance(normalizedUtterance);
}

export function staleScenarioAssessmentWouldCaptureComposition(input: {
  readonly hasActiveScenarioAssessment: boolean;
  readonly hasEstablishedConversationSubject?: boolean;
  readonly hasPrimaryTargetHint: boolean;
  readonly resolvedSubjectKind: string | null;
  readonly intentKind: string;
  readonly normalizedUtterance: string;
}): boolean {
  if (!input.hasActiveScenarioAssessment) return false;
  if (input.hasPrimaryTargetHint) return false;
  if (isRelatedObjectInquiry(input.intentKind, input.normalizedUtterance)) {
    return false;
  }
  if (
    input.intentKind === "explore-scenario" ||
    input.intentKind === "explain-scenario" ||
    input.intentKind === "compare-scenarios" ||
    input.intentKind === "define-scenario" ||
    input.intentKind === "evaluate-scenario" ||
    input.intentKind === "modify-scenario"
  ) {
    return false;
  }
  if (
    !input.resolvedSubjectKind ||
    input.resolvedSubjectKind === "scenario"
  ) {
    return false;
  }
  if (!NON_SCENARIO_SUBJECT_KINDS.has(input.resolvedSubjectKind)) {
    return false;
  }
  if (
    input.hasEstablishedConversationSubject === false &&
    isScenarioAssessmentFollowUpOperation(
      input.intentKind,
      input.normalizedUtterance,
    )
  ) {
    return false;
  }
  return isSubjectPreservingAnalyticalFollowUpOperation(
    input.intentKind,
    input.normalizedUtterance,
  );
}

export function subjectSpecificCandidateCompatible(input: {
  readonly resolvedSubject: CompositionSubjectRef;
  readonly candidateSubject: CompositionSubjectRef;
  readonly intentKind: string;
  readonly normalizedUtterance: string;
  readonly relatedObjectInquiry?: boolean;
}): {
  readonly compatible: boolean;
  readonly relatedOnly: boolean;
} {
  if (input.relatedObjectInquiry) {
    return Object.freeze({ compatible: true, relatedOnly: true });
  }
  if (input.intentKind === "compare-scenarios") {
    return Object.freeze({ compatible: true, relatedOnly: false });
  }
  const resolvedKind = input.resolvedSubject.kind;
  const candidateKind = input.candidateSubject.kind;
  if (!candidateKind || !input.candidateSubject.id) {
    return Object.freeze({ compatible: true, relatedOnly: false });
  }
  if (!resolvedKind || !input.resolvedSubject.id) {
    return Object.freeze({ compatible: true, relatedOnly: false });
  }
  if (input.resolvedSubject.id === input.candidateSubject.id) {
    return Object.freeze({ compatible: true, relatedOnly: false });
  }
  if (
    isDeicticSubjectFollowUpUtterance(input.normalizedUtterance) ||
    isDeicticSubjectExplainUtterance(input.normalizedUtterance)
  ) {
    return Object.freeze({ compatible: false, relatedOnly: true });
  }
  if (
    candidateKind === "scenario" &&
    NON_SCENARIO_SUBJECT_KINDS.has(resolvedKind) &&
    isSubjectPreservingAnalyticalFollowUpOperation(
      input.intentKind,
      input.normalizedUtterance,
    )
  ) {
    return Object.freeze({ compatible: false, relatedOnly: true });
  }
  if (
    isScenarioAssessmentFollowUpOperation(
      input.intentKind,
      input.normalizedUtterance,
    )
  ) {
    return Object.freeze({ compatible: true, relatedOnly: false });
  }
  return Object.freeze({ compatible: true, relatedOnly: false });
}

export function decideSubjectCompositionFidelity(input: {
  readonly resolvedSubject: CompositionSubjectRef;
  readonly candidateSubject: CompositionSubjectRef;
  readonly candidateSource: string | null;
  readonly intentKind: string;
  readonly normalizedUtterance: string;
  readonly blockedStaleScenarioAssessment: boolean;
}): SubjectCompositionFidelityDecision {
  const relatedObjectInquiry = isRelatedObjectInquiry(
    input.intentKind,
    input.normalizedUtterance,
  );
  const compatibility = subjectSpecificCandidateCompatible({
    resolvedSubject: input.resolvedSubject,
    candidateSubject: input.candidateSubject,
    intentKind: input.intentKind,
    normalizedUtterance: input.normalizedUtterance,
    relatedObjectInquiry,
  });
  const compatible =
    !input.blockedStaleScenarioAssessment && compatibility.compatible;
  const selectedSubject = compatible
    ? input.candidateSubject.id
      ? input.candidateSubject
      : input.resolvedSubject
    : input.resolvedSubject;
  return Object.freeze({
    identity: "MRA:3-FINAL-FIX1-FIX1/SubjectCompositionFidelity",
    resolvedSubject: input.resolvedSubject,
    candidateSubject: input.candidateSubject,
    candidateSource: input.candidateSource,
    selectedSubject,
    compatible,
    relatedOnly: compatibility.relatedOnly,
    blockedStaleScenarioAssessment: input.blockedStaleScenarioAssessment,
  });
}
