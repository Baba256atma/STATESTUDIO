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

function namedReturnKind(token: string | undefined): string | null {
  if (!token) return null;
  if (token === "issue" || token === "problem") return "problem";
  if (token === "option") return "scenario";
  return token;
}

function parseNamedHistoricalReturn(prepared: string): {
  readonly phrase: string;
  readonly expectedKind: string | null;
} | null {
  if (collectionOrdinalIndex(prepared) != null) return null;
  if (
    /^(?:(?:okay|ok|now|then)[, ]+)?(?:let(?:'s| us) )?(?:go )?back to\s+(?:the |all |our |current |active )?(problems?|risks?|opportunit(?:y|ies)|scenarios?|decisions?|executions?|goals?)$/.test(
      prepared,
    )
  ) {
    return null;
  }
  const match =
    prepared.match(
      /^(?:(?:okay|ok|now|then)[, ]+)?(?:let(?:'s| us) )?(?:(?:go )?back to|return to)\s+(.+)$/,
    ) ??
    prepared.match(/^show me\s+(.+?)\s+again$/) ??
    prepared.match(/^open\s+(.+?)\s+we discussed(?:\s+earlier)?$/) ??
    prepared.match(/^what about\s+(.+)$/);
  const phrase = (match?.[1] ?? "").replace(/[.?!]+$/u, "").trim();
  if (!phrase || phrase === "overview") return null;
  if (
    /^(?:this|that|it|this one|that one)(?:\s+(?:problem|issue|one))?$/.test(phrase)
  ) {
    return null;
  }
  if (
    /^(?:the |that )?other(?:\s+one|\s+option|\s+problem|\s+scenario|\s+item)?$/.test(
      phrase,
    )
  ) {
    return null;
  }
  const typed = phrase.match(
    /\b(problem|issue|risk|scenario|option|goal|decision|execution|outcome)\b/,
  );
  return Object.freeze({
    phrase,
    expectedKind: namedReturnKind(typed?.[1]),
  });
}

function namedReturnNameTokens(phrase: string): readonly string[] {
  const kindAndFiller =
    /\b(?:the|that|this|our|my|a|an|again|discussed|earlier|we|problem|issue|risk|scenario|option|goal|decision|execution|outcome|impact|effect|situation|status|performance|implications|pressure|known|started|starting|with|from|originally|initially|beginning)\b/g;
  const fillerOnly =
    /\b(?:the|that|this|our|my|a|an|again|discussed|earlier|we|impact|effect|situation|status|performance|implications)\b/g;
  const named = Object.freeze(
    phrase.replace(kindAndFiller, " ").split(/\s+/).filter((token) => token.length > 1),
  );
  if (named.length > 0) return named;
  return Object.freeze(
    phrase.replace(fillerOnly, " ").split(/\s+/).filter((token) => token.length > 1),
  );
}

function candidateMatchesNamedReturn(
  candidate: ContextualReferentCandidate,
  tokens: readonly string[],
  expectedKind: string | null,
): boolean {
  const haystack = `${candidate.canonicalName ?? ""} ${candidate.subjectId}`.toLowerCase();
  if (tokens.length === 0) return false;
  if (!tokens.every((token) => haystack.includes(token))) return false;
  if (!expectedKind) return true;
  if (expectedKind === "problem") return candidate.subjectKind === "problem";
  if (expectedKind === "risk") return kindCompatible("risk", candidate.subjectKind);
  if (typedReferenceCompatible(expectedKind, candidate)) return true;
  return kindCompatible(expectedKind, candidate.subjectKind);
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
    ) ||
    /\b(?:go|return)\s+back\s+to\b.*\b(?:issue|problem)\b.*\b(?:discussed|reviewed|looked\s+at)\b.*\b(?:earlier|beginning|start)\b/.test(
      prepared,
    )
  ) {
    if (collectionOrdinalIndex(prepared) == null) {
      return { move: "backtrack", expectedKind: null };
    }
  }
  const namedReturn = parseNamedHistoricalReturn(prepared);
  if (namedReturn) {
    return { move: "previous-referent", expectedKind: namedReturn.expectedKind };
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
      /\b(?:it|that|this|this one|that one|them|why|how|really|explain|show|what|does|affect|about|with|happens|if|we|ignore|should|i|do|tell|me|more|look|deeper|into|investigate|know|else|go|dig|can)\b/g,
      " ",
    ).replace(/\s+/g, " ").trim();
    if (!named) return { move: "pronoun", expectedKind: null };
  }
  if (
    /^(?:why|how|really|how bad|since when|what changed|what happens next|which one|why that(?: one)?|how confident are we|based on what|tell me more|look deeper|then what|after that|go on|same|and if we wait)$/.test(
      prepared,
    )
  ) {
    return { move: "pronoun", expectedKind: null };
  }
  return { move: "none", expectedKind: null };
}

function isGenericCurrentIssueOrProblemQuestion(prepared: string): boolean {
  const text = prepared.replace(/[.?!]+$/g, "").trim();
  if (
    /^(?:what is|what's|whats|explain|tell me about)\s+(?:the )?(?:problem|issue)(?:\s+(?:here|there|now))?$/.test(
      text,
    )
  ) {
    return true;
  }
  const withoutAsk = text.replace(
    /^(?:what is|what's|whats|explain|tell me about|what about)\s+/,
    "",
  );
  const head =
    withoutAsk.split(/\s+(?:what|how|why|is it|does it)\b/)[0]?.trim() ?? withoutAsk;
  return /^(?:this|that|the)\s+(?:problem|issue)(?:\s+(?:here|there|now))?$/.test(head);
}

function kindCompatible(expected: string | null, actual: string | null): boolean {
  if (!expected) return true;
  if (!actual) return false;
  if (expected === actual) return true;
  if (expected === "risk" && (actual === "object" || actual === "problem")) return true;
  if (expected === "problem" && actual === "problem") return true;
  return false;
}

function typedReferenceCompatible(
  expected: string | null,
  candidate: ContextualReferentCandidate,
): boolean {
  if (expected === "risk") {
    return (
      candidate.subjectKind === "risk" ||
      /\brisk\b/i.test(candidate.canonicalName ?? "")
    );
  }
  return kindCompatible(expected, candidate.subjectKind);
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
  for (const prior of executive?.previousSubjects ?? []) {
    push(prior.subjectId, "CONTEXT_PREVIOUS_SUBJECT");
  }
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
  let namedReturnAmbiguous = false;

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

  if (move === "previous-referent") {
    const named = parseNamedHistoricalReturn(prepared);
    const tokens = named ? namedReturnNameTokens(named.phrase) : [];
    const visitedNamedExplicit = Boolean(
      explicit &&
        tokens.length > 0 &&
        candidateMatchesNamedReturn(explicit, tokens, null) &&
        (continuity.previousSubjectId === explicit.subjectId ||
          continuity.thread.some((frame) => frame.subjectId === explicit.subjectId) ||
          (executive?.previousSubjects ?? []).some(
            (item) => item.subjectId === explicit.subjectId,
          )),
    );
    if (
      explicit &&
      visitedNamedExplicit &&
      (classified.expectedKind == null || classified.expectedKind === "problem")
    ) {
      selected = Object.freeze({ ...explicit, provenance: "CONTEXT_PREVIOUS_SUBJECT" });
      provenance = "CONTEXT_PREVIOUS_SUBJECT";
      if (operation === "NONE" || operation === "EXPLAIN") operation = "FOCUS";
    } else {
    const historical = pool.filter(
      (item) =>
        item.provenance === "CONTEXT_PREVIOUS_SUBJECT" ||
        item.provenance === "CONTEXT_RECENT_SUBJECT" ||
        item.provenance === "CONTEXT_TYPED_REFERENCE" ||
        item.provenance === "CONTEXT_PRESENTED_SET" ||
        item.provenance === "CONTEXT_ACTIVE_INVESTIGATION" ||
        item.provenance === "CONTEXT_ACTIVE_SUBJECT",
    );
    const typedHits = historical.filter((item) =>
      candidateMatchesNamedReturn(item, tokens, classified.expectedKind),
    );
    const nameOnly =
      typedHits.length > 0
        ? typedHits
        : historical.filter((item) => {
            if (!candidateMatchesNamedReturn(item, tokens, null)) return false;
            if (classified.expectedKind === "problem" && /kpi\b/i.test(item.canonicalName ?? "")) {
              return false;
            }
            return true;
          });
    const uniqueIds = [...new Set(nameOnly.map((item) => item.subjectId))];
    if (uniqueIds.length === 1) {
      selected =
        nameOnly.find((item) => item.provenance === "CONTEXT_PREVIOUS_SUBJECT") ??
        nameOnly[0] ??
        null;
      provenance = selected ? "CONTEXT_PREVIOUS_SUBJECT" : "UNRESOLVED";
      if (operation === "NONE" || operation === "EXPLAIN") operation = "FOCUS";
    } else if (uniqueIds.length > 1) {
      selected = null;
      provenance = "UNRESOLVED";
      namedReturnAmbiguous = true;
    } else if (
      explicit &&
      (candidateMatchesNamedReturn(explicit, tokens, classified.expectedKind) ||
        (!classified.expectedKind &&
          candidateMatchesNamedReturn(explicit, tokens, null)))
    ) {
      selected = Object.freeze({ ...explicit, provenance: "EXPLICIT_CURRENT_TURN" });
      provenance = "EXPLICIT_CURRENT_TURN";
      move = "none";
      if (operation === "NONE" || operation === "EXPLAIN") operation = "FOCUS";
    } else {
      const catalogMatches = subjects.filter((record) => {
        const item = candidate(record, "EXPLICIT_CURRENT_TURN");
        if (!item || tokens.length === 0) return false;
        if (!candidateMatchesNamedReturn(item, tokens, null)) return false;
        if (classified.expectedKind === "problem") {
          return record.subjectKind === "problem" || record.subjectKind === "object";
        }
        if (classified.expectedKind && !kindCompatible(classified.expectedKind, record.subjectKind)) {
          return false;
        }
        return true;
      });
      const uniqueCatalog = [...new Set(catalogMatches.map((record) => record.subjectId))];
      if (uniqueCatalog.length === 1) {
        selected = candidate(recordOf(uniqueCatalog[0], subjects), "EXPLICIT_CURRENT_TURN");
        provenance = selected ? "EXPLICIT_CURRENT_TURN" : "UNRESOLVED";
        if (selected) move = "none";
        if (selected && (operation === "NONE" || operation === "EXPLAIN")) operation = "FOCUS";
      } else {
        selected = null;
        provenance = "UNRESOLVED";
      }
    }
    }
  } else if (explicit && move !== "typed-reference" && move !== "pronoun") {
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
    const historicalIssueFrames = continuity.thread.filter((frame, index, frames) => {
      const record = recordOf(frame.subjectId, subjects);
      return (
        record?.subjectKind === "problem" &&
        frames.findIndex((candidate) => candidate.subjectId === frame.subjectId) === index
      );
    });
    const historicalIssueRequest = /\b(?:issue|problem)\b.*\b(?:earlier|beginning|start)\b/.test(prepared);
    const asksForBeginning = /\b(?:beginning|start)\b/.test(prepared);
    const historicalId = historicalIssueRequest
      ? asksForBeginning
        ? historicalIssueFrames[0]?.subjectId ?? null
        : historicalIssueFrames.length === 1
          ? historicalIssueFrames[0]?.subjectId ?? null
          : null
      : null;
    const popped = popThread(continuity.thread);
    const previousId = historicalIssueRequest
      ? historicalId
      : popped.previous?.subjectId ??
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
    const contrastsWithActive = (id: string | null): boolean => {
      if (!id || id === activeId) return false;
      const record = recordOf(id, subjects);
      if (!record || /watch$/i.test(record.canonicalName)) return false;
      return !activeRecord?.subjectKind || record.subjectKind === activeRecord.subjectKind;
    };
    // "The other" binds only a uniquely determined same-kind contrast; several stay unresolved.
    const presentedOthers = [...new Set(presented)].filter(contrastsWithActive);
    const otherPresented = presentedOthers.length === 1 ? presentedOthers[0]! : null;
    const previousOther = contrastsWithActive(continuity.previousSubjectId)
      ? continuity.previousSubjectId
      : null;
    const siblings = activeRecord?.subjectKind
      ? subjects.filter((item) => contrastsWithActive(item.subjectId))
      : [];
    const sibling = siblings.length === 1 ? siblings[0]! : null;
    const other =
      presentedOthers.length > 1
        ? null
        : (otherPresented ?? previousOther ?? sibling?.subjectId ?? null);
    selected = candidate(
      recordOf(other, subjects),
      otherPresented ? "CONTEXT_PRESENTED_SET" : "CONTEXT_TYPED_REFERENCE",
    );
    provenance = selected
      ? (otherPresented ? "CONTEXT_PRESENTED_SET" : "CONTEXT_TYPED_REFERENCE")
      : "UNRESOLVED";
    if (operation === "NONE" && selected) operation = "EXPLAIN";
  } else if (move === "typed-reference") {
    const currentTurnCompoundAmbiguity =
      turnMeaning.ambiguity.unresolved &&
      new Set(turnMeaning.semanticEvidence.objectCues).size > 1;
    const genericCurrentProblemQuestion = isGenericCurrentIssueOrProblemQuestion(prepared);
    if (currentTurnCompoundAmbiguity) {
      selected = null;
      provenance = "UNRESOLVED";
    } else if (genericCurrentProblemQuestion) {
      const activeId =
        continuity.activeSubjectId ??
        session?.ncaConversationState?.activeSubject?.id ??
        session?.activeObjectId ??
        executive?.currentSubject?.subjectId ??
        null;
      selected =
        pool.find((item) => item.subjectId === activeId) ??
        candidate(recordOf(activeId, subjects), "CONTEXT_ACTIVE_SUBJECT");
      provenance = selected ? "CONTEXT_ACTIVE_SUBJECT" : "UNRESOLVED";
      if (operation === "NONE") operation = "EXPLAIN";
    } else {
      const typedPool = pool.filter(
        (item) =>
          item.provenance !== "NLU_CURRENT_TURN" &&
          item.provenance !== "CONTEXT_PREVIOUS_SUBJECT" &&
          item.provenance !== "CONTEXT_PRESENTED_SET" &&
          item.provenance !== "CONTEXT_RECENT_SUBJECT" &&
          typedReferenceCompatible(classified.expectedKind, item),
      );
      selected =
        typedPool.find((item) => item.provenance === "CONTEXT_ACTIVE_SUBJECT") ??
        typedPool.find((item) => item.provenance === "CONTEXT_CORRECTION") ??
        typedPool.find((item) => item.provenance === "EXISTING_STAGE_CONTEXT") ??
        typedPool.find(
          (item) => item.provenance === "CONTEXT_ACTIVE_INVESTIGATION",
        ) ??
        typedPool.find((item) => item.provenance === "CONTEXT_TYPED_REFERENCE") ??
        null;
      provenance = selected ? "CONTEXT_TYPED_REFERENCE" : "UNRESOLVED";
      if (operation === "NONE") operation = "EXPLAIN";
    }
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
      operation === "INVESTIGATE" ||
      (operation === "NONE" &&
        /\b(?:it|this|that|this one|that one)\b/.test(prepared));
    if (followUp) {
      const activeId =
        continuity.activeSubjectId ??
        session?.ncaConversationState?.activeSubject?.id ??
        session?.activeObjectId ??
        executive?.currentSubject?.subjectId ??
        null;
      const activeCandidate =
        pool.find((item) => item.subjectId === activeId) ??
        candidate(recordOf(activeId, subjects), "CONTEXT_ACTIVE_SUBJECT");
      const distinctInvestigation = pool.find(
        (item) =>
          item.provenance === "CONTEXT_ACTIVE_INVESTIGATION" &&
          item.subjectId !== activeId,
      );
      const preferDistinctInvestigation =
        Boolean(distinctInvestigation) &&
        /\b(?:this problem|that problem|the issue)\b/.test(prepared);
      selected = preferDistinctInvestigation
        ? distinctInvestigation ?? activeCandidate ?? pool[0] ?? null
        : pool.find((item) => item.provenance === "CONTEXT_CORRECTION") ??
          (session?.activationSource === "click" || input.stageFocusedId
            ? pool.find((item) => item.provenance === "EXISTING_STAGE_CONTEXT")
            : null) ??
          activeCandidate ??
          pool.find((item) => item.provenance === "CONTEXT_ACTIVE_SUBJECT") ??
          pool.find((item) => item.provenance === "EXISTING_STAGE_CONTEXT") ??
          pool.find((item) => item.provenance === "CONTEXT_RECENT_SUBJECT") ??
          pool[0] ??
          null;
      provenance =
        selected?.subjectId === activeId && activeId
          ? (pool.find((item) => item.subjectId === activeId)?.provenance ??
            "CONTEXT_ACTIVE_SUBJECT")
          : (selected?.provenance ?? "UNRESOLVED");
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
    (namedReturnAmbiguous ||
      (uniqueIds.size > 1 &&
        (move === "pronoun" || move === "typed-reference" || collisionPronouns || unsafeThat || parkedCrossDomainIt)));
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

  const namedTargetFailed =
    !selected &&
    (move === "previous-referent" || move === "backtrack") &&
    !namedReturnAmbiguous;
  const objectReference = selected
    ? toRef(recordOf(selected.subjectId, subjects))
    : move === "typed-reference" || move === "previous-referent"
      ? null
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
      unresolved: !selected && (ambiguous || namedReturnAmbiguous || move !== "none"),
      reason: namedReturnAmbiguous || ambiguous
        ? "multiple-objects"
        : !selected && move !== "none"
          ? "missing-referent"
          : turnMeaning.ambiguity.reason,
      candidates: Object.freeze(
        (namedTargetFailed
          ? []
          : ambiguous
            ? pool
            : turnMeaning.ambiguity.candidates).map((item) =>
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
