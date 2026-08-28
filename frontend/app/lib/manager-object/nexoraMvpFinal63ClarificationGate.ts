/**
 * NEX-MVP-FINAL:6.3 — decide whether contextual meaning is safe to route.
 */

import type { CanonicalManagerOperation } from "./canonicalManagerMeaning.ts";
import type { ContextualManagerMeaning } from "./contextualManagerMeaning.ts";
import type { ConversationContinuitySnapshot } from "./contextualManagerMeaning.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type {
  ClarificationCandidate,
  ClarificationConsequence,
  ClarificationReason,
  PendingClarification,
} from "./nexoraMvpFinal63ClarificationTypes.ts";
import { classifyManagerSpeechAct } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";

const KIND_LABEL: Record<string, string> = {
  object: "KPI",
  goal: "goal",
  problem: "problem",
  scenario: "scenario",
  decision: "decision",
  execution: "execution",
  outcome: "outcome",
};

export function clarificationConsequence(
  operation: CanonicalManagerOperation,
  intentKind: string,
): ClarificationConsequence {
  if (
    /commit|confirm-decision|start-execution|cancel-decision/.test(
      intentKind,
    )
  ) {
    return "COMMITMENT";
  }
  if (operation === "FOCUS" || operation === "STATUS") return "NAVIGATION";
  return "INQUIRY";
}

function kindPhrase(kind: string): string {
  return KIND_LABEL[kind] ?? kind;
}

function uniqueCandidates(
  contextual: ContextualManagerMeaning,
  subjects: readonly NexoraConversationalSubjectRecord[],
  extraIds: readonly string[] = [],
  limit = 4,
): readonly ClarificationCandidate[] {
  const seen = new Set<string>();
  const next: ClarificationCandidate[] = [];
  const push = (id: string | null | undefined, kind?: string, name?: string) => {
    if (!id || seen.has(id) || next.length >= limit) return;
    const record = subjects.find((item) => item.subjectId === id);
    seen.add(id);
    next.push(
      Object.freeze({
        subjectId: id,
        canonicalName: record?.canonicalName ?? name ?? id,
        subjectKind: record?.subjectKind ?? kind ?? "object",
      }),
    );
  };
  for (const item of contextual.ambiguity.candidates) {
    push(item.subjectId, item.subjectKind ?? undefined, item.canonicalName ?? undefined);
  }
  for (const item of contextual.candidates) {
    push(item.subjectId, item.subjectKind ?? undefined, item.canonicalName ?? undefined);
  }
  for (const id of extraIds) {
    push(id);
  }
  return Object.freeze(next);
}

export function composeClarificationQuestion(
  reason: ClarificationReason,
  candidates: readonly ClarificationCandidate[],
  operation: CanonicalManagerOperation,
): { readonly question: string; readonly expected: PendingClarification["expectedAnswer"] } {
  if (reason === "MISSING_OPERATION" && candidates.length >= 2) {
    return {
      question: `Do you want to compare ${candidates[0]?.canonicalName} and ${candidates[1]?.canonicalName}, or look at one of them?`,
      expected: "operation",
    };
  }
  if (reason === "UNSAFE_COMMITMENT_REFERENT") {
    const kind = candidates[0]?.subjectKind === "execution" ? "execution" : "decision";
    return {
      question:
        candidates.length >= 2
          ? `Which ${kind} do you mean — ${candidates[0]?.canonicalName} or ${candidates[1]?.canonicalName}?`
          : `Which ${kind} do you want to ${kind === "execution" ? "start" : "approve"}?`,
      expected: candidates.length === 1 ? "binary" : "choice",
    };
  }
  if (candidates.length === 0) {
    const verb =
      operation === "FOCUS"
        ? "show"
        : operation === "EXPLAIN"
          ? "explain"
          : "look at";
    return {
      question: `Which one do you want me to ${verb}?`,
      expected: "subject",
    };
  }
  if (candidates.length === 1) {
    return {
      question: `Do you mean ${candidates[0]?.canonicalName}?`,
      expected: "binary",
    };
  }
  const kinds = new Set(candidates.map((item) => item.subjectKind));
  if (candidates.length > 4 || (candidates.length > 2 && kinds.size >= 2)) {
    const labels = [...kinds].slice(0, 2).map(kindPhrase);
    return {
      question: `Are you asking about the ${labels[0]} or the ${labels[1]}?`,
      expected: "choice",
    };
  }
  if (kinds.size >= 2 && candidates.length === 2) {
    const left = candidates[0]!;
    const right = candidates[1]!;
    return {
      question: `Do you mean the ${left.canonicalName} ${kindPhrase(left.subjectKind)} or the ${right.canonicalName}?`,
      expected: "choice",
    };
  }
  return {
    question: `Do you mean ${candidates[0]?.canonicalName} or ${candidates[1]?.canonicalName}?`,
    expected: "choice",
  };
}

export function evaluateClarificationGate(input: {
  readonly contextual: ContextualManagerMeaning;
  readonly intentKind: string;
  readonly continuity: ConversationContinuitySnapshot | null;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
}): {
  readonly required: boolean;
  readonly reason: ClarificationReason;
  readonly consequence: ClarificationConsequence;
  readonly candidates: readonly ClarificationCandidate[];
} {
  const contextual = input.contextual;
  const consequence = clarificationConsequence(
    contextual.requestedOperation,
    input.intentKind,
  );
  const candidates = uniqueCandidates(contextual, input.subjects);
  const explicit =
    contextual.provenance === "EXPLICIT_CURRENT_TURN" &&
    contextual.objectReference != null;
  const namedNlu = contextual.turnMeaning.objectReference != null;
  const help = contextual.requestedOperation === "HELP";
  const correct = contextual.turnMeaning.communicativeIntent === "CORRECT";
  const existingAuthorityIntent =
    /^(?:overview|navigate-back|navigate-forward|show-problems|show-goals|show-related|show-scenarios|show-decisions|show-execution|switch-workspace|help|situation|evidence)$/.test(
      input.intentKind,
    );

  const deicticPrior =
    /\b(?:that one|this one|that option)\b/.test(contextual.turnMeaning.preparedUtterance) &&
    (contextual.requestedOperation === "CAUSE" ||
      contextual.requestedOperation === "EXPLAIN" ||
      contextual.turnMeaning.communicativeIntent === "REJECT" ||
      classifyManagerSpeechAct(contextual.turnMeaning.rawUtterance) === "PREFERENCE" ||
      (input.continuity?.thread.length ?? 0) > 0);

  if (help || correct || explicit || namedNlu || existingAuthorityIntent || deicticPrior) {
    if (consequence !== "COMMITMENT") {
      return {
        required: false,
        reason: "NONE",
        consequence,
        candidates,
      };
    }
  }

  if (
    /\bthat\b/.test(contextual.turnMeaning.preparedUtterance) &&
    !/\bit\b/.test(contextual.turnMeaning.preparedUtterance) &&
    !/\bthat one\b/.test(contextual.turnMeaning.preparedUtterance) &&
    !/\bthat option\b/.test(contextual.turnMeaning.preparedUtterance) &&
    !/\b(?:do|go with|lets do|let us do) that\b/.test(
      contextual.turnMeaning.preparedUtterance,
    ) &&
    !/^why\b/.test(contextual.turnMeaning.preparedUtterance) &&
    !/\bwhich\b/.test(contextual.turnMeaning.preparedUtterance) &&
    (input.continuity?.thread.length ?? 0) >= 2 &&
    !namedNlu &&
    contextual.requestedOperation !== "COMPARE"
  ) {
    const threadIds = (input.continuity?.thread ?? []).map((frame) => frame.subjectId);
    const threadCandidates = uniqueCandidates(
      contextual,
      input.subjects,
      threadIds,
    );
    return {
      required: true,
      reason: "REFERENCE_AMBIGUITY",
      consequence,
      candidates:
        threadCandidates.length >= 2
          ? threadCandidates
          : candidates,
    };
  }

  if (
    contextual.requestedOperation === "COMPARE" &&
    contextual.turnMeaning.ambiguity.candidates.length >= 2
  ) {
    return {
      required: false,
      reason: "NONE",
      consequence,
      candidates,
    };
  }

  if (consequence === "COMMITMENT") {
    const unique =
      contextual.objectReference != null &&
      contextual.confidence === "HIGH" &&
      !contextual.ambiguity.unresolved;
    if (!unique) {
      return {
        required: true,
        reason: "UNSAFE_COMMITMENT_REFERENT",
        consequence,
        candidates,
      };
    }
  }

  if (
    contextual.ambiguity.unresolved &&
    contextual.requestedOperation !== "NONE" &&
    contextual.requestedOperation !== "HELP"
  ) {
    if (
      candidates.length === 0 &&
      !input.continuity?.activeSubjectId &&
      contextual.requestedOperation === "FOCUS"
    ) {
      return {
        required: false,
        reason: "NONE",
        consequence,
        candidates,
      };
    }
    const reason: ClarificationReason =
      candidates.length === 0
        ? "MISSING_SUBJECT"
        : new Set(candidates.map((item) => item.subjectKind)).size > 1
          ? "TYPE_AMBIGUITY"
          : "REFERENCE_AMBIGUITY";
    return { required: true, reason, consequence, candidates };
  }

  if (
    contextual.turnMeaning.ambiguity.reason === "multiple-objects" &&
    contextual.requestedOperation === "NONE" &&
    candidates.length >= 2
  ) {
    const speech = classifyManagerSpeechAct(contextual.turnMeaning.rawUtterance);
    const shortListing =
      contextual.turnMeaning.preparedUtterance.split(" ").filter(Boolean).length <= 8;
    if (speech === "QUESTION" || speech === "COMMAND" || (speech !== "ASSERTION" && speech !== "OBSERVATION" && shortListing)) {
      return {
        required: true,
        reason: "MISSING_OPERATION",
        consequence,
        candidates: candidates.slice(0, 2),
      };
    }
  }

  if (
    contextual.confidence === "LOW" &&
    contextual.objectReference == null &&
    contextual.requestedOperation !== "NONE" &&
    contextual.requestedOperation !== "HELP" &&
    contextual.requestedOperation !== "OBSERVE"
  ) {
    if (
      candidates.length === 0 &&
      !input.continuity?.activeSubjectId &&
      contextual.requestedOperation === "FOCUS"
    ) {
      return {
        required: false,
        reason: "NONE",
        consequence,
        candidates,
      };
    }
    return {
      required: true,
      reason: "MISSING_SUBJECT",
      consequence,
      candidates,
    };
  }

  return {
    required: false,
    reason: "NONE",
    consequence,
    candidates,
  };
}

export function freezePendingClarification(
  pending: PendingClarification,
): PendingClarification {
  return Object.freeze({
    ...pending,
    identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    candidates: Object.freeze([...pending.candidates]),
  });
}
