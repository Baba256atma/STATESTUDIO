/**
 * NEX-MVP-FINAL:6.2 — resolve CanonicalManagerMeaning against conversation context.
 * Semantic typed reference resolution. Not a pronoun dictionary.
 */

import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import type { ManagerObjectSession } from "./managerObjectActive.ts";
import type {
  CanonicalManagerMeaning,
  CanonicalManagerObjectReference,
} from "./canonicalManagerMeaning.ts";
import type {
  ContextReferentProvenance,
  ContextualManagerMeaning,
  ContextualReferentCandidate,
  ContinuityMove,
  ConversationContinuitySnapshot,
} from "./contextualManagerMeaning.ts";
import {
  createEmptyConversationContinuity,
  popThread,
} from "./conversationContinuitySnapshot.ts";
import { prepareManagerUtterance } from "./canonicalManagerMeaningInterpreter.ts";
import { collectionOrdinalIndex } from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";

export type ContinuityResolutionInput = {
  readonly turnMeaning: CanonicalManagerMeaning;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
  readonly previousContinuity?: ConversationContinuitySnapshot | null;
  readonly executiveContext?: NexoraExecutiveContextSnapshot | null;
  readonly managerSession?: ManagerObjectSession | null;
  readonly stageFocusedId?: string | null;
};

function recordOf(
  id: string | null | undefined,
  subjects: readonly NexoraConversationalSubjectRecord[],
): NexoraConversationalSubjectRecord | null {
  if (!id) return null;
  return subjects.find((item) => item.subjectId === id) ?? null;
}

function toRef(
  record: NexoraConversationalSubjectRecord | null,
): CanonicalManagerObjectReference | null {
  if (!record) return null;
  return Object.freeze({
    subjectId: record.subjectId,
    canonicalName: record.canonicalName,
    lexicalHint: record.canonicalName,
    subjectKind: record.subjectKind,
  });
}

function candidate(
  record: NexoraConversationalSubjectRecord | null,
  provenance: ContextReferentProvenance,
): ContextualReferentCandidate | null {
  if (!record) return null;
  return Object.freeze({
    subjectId: record.subjectId,
    canonicalName: record.canonicalName,
    subjectKind: record.subjectKind,
    provenance,
  });
}

function classifyMove(prepared: string): {
  readonly move: ContinuityMove;
  readonly expectedKind: string | null;
} {
  if (
    /^(?:what else|anything else|and then|then what|after that)$/.test(prepared)
  ) {
    return { move: "what-else", expectedKind: null };
  }
  if (
    /^(?:continue|go on|keep going|where were we)$/.test(prepared)
  ) {
    return { move: "continue", expectedKind: null };
  }
  if (
    /^(?:go back|back|the previous one|the one before|what we were looking at earlier|earlier)$/.test(
      prepared,
    ) &&
    collectionOrdinalIndex(prepared) == null
  ) {
    return { move: "backtrack", expectedKind: null };
  }
  if (
    /^(?:and\s+)?(?:what about\s+)?(?:the\s+|that\s+)?other(?:\s+one|\s+option|\s+problem|\s+scenario|\s+item)?$/.test(
      prepared,
    )
  ) {
    return { move: "other-referent", expectedKind: null };
  }
  const typed = prepared.match(
    /\b(?:this|that|the)\s+(problem|issue|risk|scenario|option|goal|decision|execution|outcome)\b/,
  );
  if (typed) {
    const token = typed[1] ?? "";
    const kind =
      token === "issue" || token === "problem"
        ? "problem"
        : token === "option"
          ? "scenario"
          : token;
    return { move: "typed-reference", expectedKind: kind };
  }
  if (
    /^(?:it|that|this|this one|that one|them)$/.test(prepared) ||
    /\b(?:it|that|this|this one|that one)\b/.test(prepared)
  ) {
    const named = prepared.replace(
      /\b(?:it|that|this|this one|that one|them|why|how|really|explain|show|what|does|affect|about|with|happens|if|we|ignore|should|i|do)\b/g,
      " ",
    ).replace(/\s+/g, " ").trim();
    if (!named) return { move: "pronoun", expectedKind: null };
  }
  if (
    /^(?:why|how|really|how bad|since when|what changed|what happens next|which one|why that(?: one)?|how confident are we|based on what|tell me more|then what|after that|go on|same|and if we wait)$/.test(
      prepared,
    )
  ) {
    return { move: "pronoun", expectedKind: null };
  }
  return { move: "none", expectedKind: null };
}

function kindCompatible(expected: string | null, actual: string | null): boolean {
  if (!expected) return true;
  if (!actual) return false;
  if (expected === actual) return true;
  if (expected === "risk" && (actual === "object" || actual === "problem")) return true;
  if (expected === "problem" && actual === "problem") return true;
  return false;
}

function isWeakLexicalHint(turnMeaning: CanonicalManagerMeaning): boolean {
  const hint = (turnMeaning.objectReference?.lexicalHint ?? "").trim();
  const name = prepareManagerUtterance(turnMeaning.objectReference?.canonicalName ?? "");
  if (!hint || turnMeaning.ambiguity.candidates.length < 2) return false;
  return name !== hint && !name.split(/\s+/).includes(hint);
}

function pickContextRankedCandidate(
  candidates: readonly CanonicalManagerObjectReference[],
  continuity: ConversationContinuitySnapshot,
  session: ManagerObjectSession | null | undefined,
): CanonicalManagerObjectReference | null {
  const contextIds = new Set<string>([
    ...continuity.presentedIds,
    ...continuity.thread.map((frame) => frame.subjectId),
    ...(session?.ncaConversationState?.lastCollection?.memberIds ?? []),
  ]);
  const lastKind = (session?.ncaConversationState?.lastCollection?.kind ?? "").toLowerCase();
  const inContext = candidates.filter(
    (item) => item.subjectId != null && contextIds.has(item.subjectId),
  );
  const pool = inContext.length > 0 ? inContext : candidates;
  const kindMatched = lastKind
    ? pool.filter((item) =>
        item.subjectKind ? kindCompatible(lastKind, item.subjectKind) : false,
      )
    : inContext;
  return kindMatched[0] ?? inContext[0] ?? null;
}

function pickByKind(
  expected: string | null,
  pool: readonly ContextualReferentCandidate[],
): ContextualReferentCandidate | null {
  if (!expected) return pool[0] ?? null;
  return pool.find((item) => kindCompatible(expected, item.subjectKind)) ?? null;
}

function nextPresented(
  presented: readonly string[],
  activeId: string | null,
  index: number,
): { readonly id: string | null; readonly nextIndex: number } {
  if (presented.length === 0) return { id: null, nextIndex: index };
  const start = Math.max(0, index);
  for (let offset = 0; offset < presented.length; offset += 1) {
    const next = presented[(start + offset) % presented.length];
    if (next && next !== activeId) {
      return { id: next, nextIndex: start + offset + 1 };
    }
  }
  return { id: presented[0] ?? null, nextIndex: start + 1 };
}

export function resolveContextualManagerMeaning(
  input: ContinuityResolutionInput,
): ContextualManagerMeaning {
  const turnMeaning = input.turnMeaning;
  const continuity =
    input.previousContinuity ?? createEmptyConversationContinuity();
  const prepared = turnMeaning.preparedUtterance || prepareManagerUtterance(turnMeaning.rawUtterance);
  const classified = classifyMove(prepared);
  const subjects = input.subjects;
  const executive = input.executiveContext;
  const session = input.managerSession;

  const pool: ContextualReferentCandidate[] = [];
  const push = (
    id: string | null | undefined,
    provenance: ContextReferentProvenance,
  ) => {
    const record = recordOf(id, subjects);
    const item = candidate(record, provenance);
    if (!item) return;
    if (pool.some((entry) => entry.subjectId === item.subjectId)) return;
    pool.push(item);
  };

  if (continuity.correctedSubjectId) {
    push(continuity.correctedSubjectId, "CONTEXT_CORRECTION");
  }
  push(turnMeaning.objectReference?.subjectId, "NLU_CURRENT_TURN");
  if (session?.activationSource === "click") {
    push(session.activeObjectId, "EXISTING_STAGE_CONTEXT");
  }
  push(session?.investigationSubjectId, "CONTEXT_ACTIVE_INVESTIGATION");
  push(continuity.activeInvestigationId, "CONTEXT_ACTIVE_INVESTIGATION");
  push(continuity.lastRecommendedTargetId, "CONTEXT_ACTIVE_INVESTIGATION");
  push(continuity.activeSubjectId, "CONTEXT_ACTIVE_SUBJECT");
  push(session?.ncaConversationState?.activeSubject?.id, "CONTEXT_ACTIVE_SUBJECT");
  push(session?.activeObjectId, "CONTEXT_ACTIVE_SUBJECT");
  push(executive?.currentSubject?.subjectId, "CONTEXT_ACTIVE_SUBJECT");
  push(executive?.currentProblem?.subjectId, "CONTEXT_TYPED_REFERENCE");
  push(executive?.currentScenario?.subjectId, "CONTEXT_TYPED_REFERENCE");
  push(executive?.currentGoal?.subjectId, "CONTEXT_TYPED_REFERENCE");
  push(executive?.currentDecision?.subjectId, "CONTEXT_TYPED_REFERENCE");
  push(executive?.currentExecution?.subjectId, "CONTEXT_TYPED_REFERENCE");
  push(continuity.previousSubjectId, "CONTEXT_PREVIOUS_SUBJECT");
  push(session?.previousActiveObjectId, "CONTEXT_PREVIOUS_SUBJECT");
  push(executive?.previousSubjects[0]?.subjectId, "CONTEXT_PREVIOUS_SUBJECT");
  push(input.stageFocusedId, "EXISTING_STAGE_CONTEXT");
  for (const id of continuity.presentedIds) {
    push(id, "CONTEXT_PRESENTED_SET");
  }
  for (const frame of [...continuity.thread].reverse()) {
    push(frame.subjectId, "CONTEXT_RECENT_SUBJECT");
  }

  const deicticLexical = /^(?:it|this|that|this one|that one|them)$/i.test(
    (turnMeaning.objectReference?.lexicalHint ?? "").trim(),
  );
  const explicit =
    !deicticLexical && turnMeaning.objectReference?.subjectId
      ? candidate(
          recordOf(turnMeaning.objectReference.subjectId, subjects),
          turnMeaning.objectReference.lexicalHint
            ? "EXPLICIT_CURRENT_TURN"
            : "NLU_CURRENT_TURN",
        )
      : null;

  let move = classified.move;
  let provenance: ContextReferentProvenance = "UNRESOLVED";
  let selected: ContextualReferentCandidate | null = null;
  let operation = turnMeaning.requestedOperation;
  let continuationTargetId: string | null = null;

  if (
    operation === "NONE" &&
    /what if we (?:wait|ignore|do nothing)|and if we wait|leave this alone/.test(
      prepared,
    )
  ) {
    operation = "CONSEQUENCE";
  }
  if (
    operation === "NONE" &&
    /what could we do|what should we do/.test(prepared)
  ) {
    operation = "RECOMMEND";
  }
  if (
    (operation === "NONE" || operation === "EXPLAIN") &&
    /based on what|how do we know/.test(prepared)
  ) {
    operation = "EVIDENCE";
  }

  if (explicit && move !== "typed-reference" && move !== "pronoun") {
    const contextualOverride =
      isWeakLexicalHint(turnMeaning)
        ? pickContextRankedCandidate(
            turnMeaning.ambiguity.candidates,
            continuity,
            session,
          )
        : null;
    if (contextualOverride) {
      selected = candidate(
        recordOf(contextualOverride.subjectId, subjects),
        "CONTEXT_PRESENTED_SET",
      );
      provenance = "CONTEXT_PRESENTED_SET";
      move = "none";
    } else {
      selected = Object.freeze({ ...explicit, provenance: "EXPLICIT_CURRENT_TURN" });
      provenance = "EXPLICIT_CURRENT_TURN";
      move = "none";
    }
  } else if (turnMeaning.communicativeIntent === "ASK_CAPABILITY" || operation === "HELP") {
    selected = null;
    provenance = "UNRESOLVED";
    move = "none";
    operation = "HELP";
  } else if (move === "backtrack") {
    const popped = popThread(continuity.thread);
    const previousId =
      popped.previous?.subjectId ??
      continuity.previousSubjectId ??
      session?.previousActiveObjectId ??
      null;
    selected = candidate(recordOf(previousId, subjects), "CONTEXT_PREVIOUS_SUBJECT");
    provenance = selected ? "CONTEXT_PREVIOUS_SUBJECT" : "UNRESOLVED";
    if (operation === "NONE" || operation === "FOCUS") operation = "FOCUS";
  } else if (move === "what-else") {
    const presented =
      continuity.presentedIds.length > 0
        ? continuity.presentedIds
        : (session?.investigationCandidateIds ?? []);
    const next = nextPresented(
      presented,
      continuity.activeSubjectId,
      continuity.continuationIndex,
    );
    selected = candidate(
      recordOf(next.id, subjects),
      "CONTEXT_PRESENTED_SET",
    );
    continuationTargetId = next.id;
    provenance = selected ? "CONTEXT_PRESENTED_SET" : "UNRESOLVED";
    operation =
      continuity.activeOperation === "COMPARE"
        ? "COMPARE"
        : continuity.activeOperation === "IMPACT"
          ? "IMPACT"
          : continuity.activeOperation === "ATTENTION"
            ? "ATTENTION"
            : selected
              ? "FOCUS"
              : "NONE";
    if (!selected) {
      const fallbackId =
        continuity.activeSubjectId ?? session?.activeObjectId ?? null;
      selected = candidate(
        recordOf(fallbackId, subjects),
        "CONTEXT_ACTIVE_SUBJECT",
      );
      continuationTargetId = fallbackId;
      provenance = selected ? "CONTEXT_ACTIVE_SUBJECT" : "UNRESOLVED";
      operation =
        continuity.activeOperation !== "NONE" &&
        continuity.activeOperation !== "HELP"
          ? continuity.activeOperation
          : selected
            ? "IMPACT"
            : "NONE";
    }
  } else if (move === "continue") {
    const resumeId =
      continuity.parkedActiveSubjectId ??
      continuity.activeSubjectId ??
      continuity.activeInvestigationId ??
      session?.activeObjectId ??
      null;
    selected = candidate(
      recordOf(resumeId, subjects),
      continuity.parkedActiveSubjectId
        ? "CONTEXT_RECENT_SUBJECT"
        : "CONTEXT_ACTIVE_SUBJECT",
    );
    provenance = selected
      ? (continuity.parkedActiveSubjectId
          ? "CONTEXT_RECENT_SUBJECT"
          : "CONTEXT_ACTIVE_SUBJECT")
      : "UNRESOLVED";
    operation =
      continuity.activeOperation !== "NONE" && continuity.activeOperation !== "HELP"
        ? continuity.activeOperation
        : selected
          ? "EXPLAIN"
          : "NONE";
    if (continuity.parkedActiveSubjectId) move = "resume-parked";
  } else if (move === "other-referent") {
    const activeId =
      continuity.activeSubjectId ?? session?.activeObjectId ?? null;
    const presented = continuity.presentedIds;
    const activeRecord = recordOf(activeId, subjects);
    const otherPresented =
      presented.find((id) => {
        if (id === activeId) return false;
        const record = recordOf(id, subjects);
        if (!record || /watch$/i.test(record.canonicalName)) return false;
        if (activeRecord?.subjectKind && record.subjectKind !== activeRecord.subjectKind) {
          return false;
        }
        return true;
      }) ?? null;
    const sibling =
      subjects.find(
        (item) =>
          item.subjectId !== activeId &&
          Boolean(activeRecord?.subjectKind) &&
          item.subjectKind === activeRecord?.subjectKind &&
          !/watch$/i.test(item.canonicalName),
      ) ?? null;
    const other =
      otherPresented ??
      continuity.previousSubjectId ??
      sibling?.subjectId ??
      null;
    selected = candidate(
      recordOf(other, subjects),
      otherPresented ? "CONTEXT_PRESENTED_SET" : "CONTEXT_TYPED_REFERENCE",
    );
    provenance = selected
      ? (otherPresented ? "CONTEXT_PRESENTED_SET" : "CONTEXT_TYPED_REFERENCE")
      : "UNRESOLVED";
    if (operation === "NONE" && selected) operation = "EXPLAIN";
  } else if (move === "typed-reference") {
    const typedPool = pool.filter((item) =>
      kindCompatible(classified.expectedKind, item.subjectKind),
    );
    selected =
      typedPool.find((item) => item.provenance === "CONTEXT_ACTIVE_SUBJECT") ??
      typedPool.find((item) => item.provenance === "CONTEXT_CORRECTION") ??
      pickByKind(classified.expectedKind, typedPool);
    provenance = selected ? "CONTEXT_TYPED_REFERENCE" : "UNRESOLVED";
    if (operation === "NONE") operation = "EXPLAIN";
  } else if (
    (operation === "FOCUS" || operation === "EXPLAIN" || operation === "INVESTIGATE") &&
    turnMeaning.objectReference == null &&
    turnMeaning.ambiguity.candidates.length >= 2 &&
    move === "none"
  ) {
    const contextIds = new Set<string>([
      ...continuity.presentedIds,
      ...continuity.thread.map((frame) => frame.subjectId),
      ...(session?.ncaConversationState?.lastCollection?.memberIds ?? []),
    ]);
    const lastKind = (session?.ncaConversationState?.lastCollection?.kind ?? "").toLowerCase();
    const inContext = turnMeaning.ambiguity.candidates.filter(
      (item) => item.subjectId != null && contextIds.has(item.subjectId),
    );
    const kindMatched = lastKind
      ? (inContext.length > 0 ? inContext : turnMeaning.ambiguity.candidates).filter(
          (item) =>
            Boolean(item.subjectKind) &&
            kindCompatible(lastKind, item.subjectKind as string),
        )
      : inContext;
    const picked = kindMatched[0] ?? inContext[0] ?? null;
    selected = picked
      ? candidate(
          recordOf(picked.subjectId, subjects),
          inContext.length > 0 ? "CONTEXT_PRESENTED_SET" : "CONTEXT_TYPED_REFERENCE",
        )
      : null;
    provenance = selected
      ? inContext.length > 0
        ? "CONTEXT_PRESENTED_SET"
        : "CONTEXT_TYPED_REFERENCE"
      : "UNRESOLVED";
  } else if (move === "pronoun" || turnMeaning.objectReference == null) {
    const followUp =
      move === "pronoun" ||
      operation === "CAUSE" ||
      operation === "EXPLAIN" ||
      operation === "IMPACT" ||
      operation === "EVIDENCE" ||
      operation === "CONSEQUENCE" ||
      operation === "RECOMMEND" ||
      operation === "COMPARE" ||
      operation === "STATUS" ||
      operation === "ATTENTION" ||
      operation === "INVESTIGATE";
    if (followUp) {
      const preferInvestigation =
        operation === "INVESTIGATE" ||
        /\b(?:this problem|that problem|the issue)\b/.test(prepared);
      selected = preferInvestigation
        ? pool.find((item) => item.provenance === "CONTEXT_ACTIVE_INVESTIGATION") ??
          pool.find((item) => item.provenance === "CONTEXT_ACTIVE_SUBJECT") ??
          pool[0] ??
          null
        : pool.find((item) => item.provenance === "CONTEXT_CORRECTION") ??
          (session?.activationSource === "click" || input.stageFocusedId
            ? pool.find((item) => item.provenance === "EXISTING_STAGE_CONTEXT")
            : null) ??
          pool.find((item) => item.provenance === "CONTEXT_ACTIVE_SUBJECT") ??
          pool.find((item) => item.provenance === "EXISTING_STAGE_CONTEXT") ??
          pool.find((item) => item.provenance === "CONTEXT_RECENT_SUBJECT") ??
          pool[0] ??
          null;
      provenance = selected?.provenance ?? "UNRESOLVED";
      if (operation === "NONE" && selected) operation = "EXPLAIN";
      if (move === "none" && selected) move = "pronoun";
    }
  }

  const uniqueIds = new Set(pool.map((item) => item.subjectId));
  const pronounCount = (prepared.match(/\bit\b/g) ?? []).length;
  const thatWithoutIt = /\bthat\b/.test(prepared) && !/\bit\b/.test(prepared);
  const noDominantRecommendation = !continuity.lastRecommendedTargetId;
  const threadDistinct = new Set(continuity.thread.map((frame) => frame.subjectId)).size;
  const collisionPronouns = pronounCount >= 2 && uniqueIds.size > 1;
  const unsafeThat =
    thatWithoutIt &&
    (move === "pronoun" || move === "none") &&
    noDominantRecommendation &&
    threadDistinct >= 2;
  const mixedDomainThread =
    continuity.activeSubjectKind === "data" ||
    continuity.thread.some((frame) => frame.subjectKind === "data");
  const parkedCrossDomainIt =
    Boolean(continuity.parkedThread) &&
    mixedDomainThread &&
    threadDistinct >= 2 &&
    (move === "pronoun" ||
      (/\b(?:it|that|this)\b/.test(prepared) &&
        (operation === "EXPLAIN" || operation === "FOCUS" || operation === "INVESTIGATE")));
  if (collisionPronouns || unsafeThat || parkedCrossDomainIt) {
    selected = null;
    provenance = "UNRESOLVED";
    if (move === "none") move = "pronoun";
  }
  const ambiguous =
    !selected &&
    uniqueIds.size > 1 &&
    (move === "pronoun" || move === "typed-reference" || collisionPronouns || unsafeThat || parkedCrossDomainIt);
  const confidence: ContextualManagerMeaning["confidence"] = selected
    ? provenance === "EXPLICIT_CURRENT_TURN"
      ? turnMeaning.confidence === "LOW"
        ? "MEDIUM"
        : "HIGH"
      : uniqueIds.size > 2 && move === "pronoun"
        ? "MEDIUM"
        : provenance === "UNRESOLVED"
          ? "LOW"
          : "HIGH"
    : ambiguous
      ? "LOW"
      : turnMeaning.confidence;

  const objectReference = selected
    ? toRef(recordOf(selected.subjectId, subjects))
    : turnMeaning.objectReference;

  return Object.freeze({
    identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
    turnMeaning,
    requestedOperation: operation,
    questionType:
      turnMeaning.questionType !== "NONE"
        ? turnMeaning.questionType
        : continuity.activeQuestionType,
    objectReference,
    confidence: selected && provenance === "UNRESOLVED" ? "LOW" : confidence,
    ambiguity: Object.freeze({
      unresolved: !selected && (ambiguous || move !== "none"),
      reason: ambiguous
        ? "multiple-objects"
        : !selected && move !== "none"
          ? "missing-referent"
          : turnMeaning.ambiguity.reason,
      candidates: Object.freeze(
        (ambiguous ? pool : turnMeaning.ambiguity.candidates).map((item) =>
          "subjectId" in item && "provenance" in item
            ? Object.freeze({
                subjectId: item.subjectId,
                canonicalName: item.canonicalName,
                lexicalHint: item.canonicalName,
                subjectKind: item.subjectKind,
              })
            : item,
        ),
      ),
    }),
    provenance: selected ? provenance : "UNRESOLVED",
    continuityMove: move,
    continuationTargetId,
    candidates: Object.freeze(pool),
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  });
}
