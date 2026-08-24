/**
 * NEX-MVP-FINAL:6.2 — Contextual Manager Meaning contract.
 * Conversation continuity, not business truth. Builds on CanonicalManagerMeaning.
 */

import type {
  CanonicalManagerAmbiguity,
  CanonicalManagerConfidence,
  CanonicalManagerMeaning,
  CanonicalManagerObjectReference,
  CanonicalManagerOperation,
  CanonicalManagerQuestionType,
} from "./canonicalManagerMeaning.ts";

export const CONTEXT_REFERENT_PROVENANCE = Object.freeze([
  "EXPLICIT_CURRENT_TURN",
  "NLU_CURRENT_TURN",
  "CONTEXT_ACTIVE_SUBJECT",
  "CONTEXT_ACTIVE_INVESTIGATION",
  "CONTEXT_TYPED_REFERENCE",
  "CONTEXT_RECENT_SUBJECT",
  "CONTEXT_PREVIOUS_SUBJECT",
  "CONTEXT_PRESENTED_SET",
  "EXISTING_STAGE_CONTEXT",
  "CONTEXT_CORRECTION",
  "UNRESOLVED",
] as const);

export type ContextReferentProvenance =
  (typeof CONTEXT_REFERENT_PROVENANCE)[number];

export const CONTINUITY_MOVES = Object.freeze([
  "none",
  "pronoun",
  "typed-reference",
  "previous-referent",
  "other-referent",
  "what-else",
  "continue",
  "backtrack",
  "resume-parked",
] as const);

export type ContinuityMove = (typeof CONTINUITY_MOVES)[number];

export type ConversationThreadFrame = {
  readonly subjectId: string;
  readonly subjectKind: string;
  readonly operation: CanonicalManagerOperation;
  readonly turnIndex: number;
};

export type ConversationContinuitySnapshot = {
  readonly identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity";
  readonly activeSubjectId: string | null;
  readonly activeSubjectKind: string | null;
  readonly activeInvestigationId: string | null;
  readonly activeOperation: CanonicalManagerOperation;
  readonly activeQuestionType: CanonicalManagerQuestionType;
  readonly previousSubjectId: string | null;
  readonly thread: readonly ConversationThreadFrame[];
  readonly presentedIds: readonly string[];
  readonly continuationIndex: number;
  readonly lastRecommendedTargetId: string | null;
  readonly lastRecommendationId: string | null;
  readonly parkedThread: readonly ConversationThreadFrame[] | null;
  readonly parkedActiveSubjectId: string | null;
  readonly correctedSubjectId: string | null;
  readonly turnIndex: number;
};

export type ContextualReferentCandidate = {
  readonly subjectId: string;
  readonly canonicalName: string | null;
  readonly subjectKind: string;
  readonly provenance: ContextReferentProvenance;
};

export type ContextualManagerMeaning = {
  readonly identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity";
  readonly turnMeaning: CanonicalManagerMeaning;
  readonly requestedOperation: CanonicalManagerOperation;
  readonly questionType: CanonicalManagerQuestionType;
  readonly objectReference: CanonicalManagerObjectReference | null;
  readonly confidence: CanonicalManagerConfidence;
  readonly ambiguity: CanonicalManagerAmbiguity;
  readonly provenance: ContextReferentProvenance;
  readonly continuityMove: ContinuityMove;
  readonly continuationTargetId: string | null;
  readonly candidates: readonly ContextualReferentCandidate[];
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly inventsBusinessTruth: false;
};
