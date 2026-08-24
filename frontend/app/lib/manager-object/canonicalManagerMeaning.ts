/**
 * NEX-MVP-FINAL:6.1 — Canonical Manager Meaning contract.
 *
 * NLU proposes what the manager means. It does not own business truth.
 * Fields are optional by design: unknown is valid; fake precision is not.
 */

export const CANONICAL_MANAGER_COMMUNICATIVE_INTENTS = Object.freeze([
  "ASK_INFORMATION",
  "ASK_EXPLANATION",
  "ASK_WHY",
  "ASK_IMPACT",
  "ASK_CONSEQUENCE",
  "ASK_ALTERNATIVES",
  "ASK_COMPARISON",
  "ASK_RECOMMENDATION",
  "ASK_EVIDENCE",
  "ASK_UNCERTAINTY",
  "ASK_STATUS",
  "ASK_CAPABILITY",
  "REQUEST_FOCUS",
  "REQUEST_INVESTIGATION",
  "OBSERVE",
  "SUGGEST",
  "CHALLENGE",
  "CORRECT",
  "ACCEPT",
  "REJECT",
  "EXPRESS_UNCERTAINTY",
  "SUPPLY_INFORMATION",
  "UNKNOWN",
] as const);

export type CanonicalManagerCommunicativeIntent =
  (typeof CANONICAL_MANAGER_COMMUNICATIVE_INTENTS)[number];

export const CANONICAL_MANAGER_OPERATIONS = Object.freeze([
  "FOCUS",
  "EXPLAIN",
  "CAUSE",
  "IMPACT",
  "CONSEQUENCE",
  "EVIDENCE",
  "RECOMMEND",
  "COMPARE",
  "INVESTIGATE",
  "STATUS",
  "ATTENTION",
  "HELP",
  "CHALLENGE",
  "OBSERVE",
  "NONE",
] as const);

export type CanonicalManagerOperation =
  (typeof CANONICAL_MANAGER_OPERATIONS)[number];

export const CANONICAL_MANAGER_QUESTION_TYPES = Object.freeze([
  "EXPLANATION",
  "CAUSE",
  "IMPACT",
  "CONSEQUENCE",
  "EVIDENCE",
  "RECOMMENDATION",
  "ALTERNATIVES",
  "COMPARISON",
  "GOAL_RELEVANCE",
  "STATUS",
  "CAPABILITY",
  "ATTENTION",
  "NONE",
] as const);

export type CanonicalManagerQuestionType =
  (typeof CANONICAL_MANAGER_QUESTION_TYPES)[number];

export const CANONICAL_MANAGER_CONFIDENCE = Object.freeze([
  "HIGH",
  "MEDIUM",
  "LOW",
  "UNKNOWN",
] as const);

export type CanonicalManagerConfidence =
  (typeof CANONICAL_MANAGER_CONFIDENCE)[number];

export const CANONICAL_MANAGER_DEPTH = Object.freeze([
  "SHALLOW",
  "STANDARD",
  "DEEP",
] as const);

export type CanonicalManagerDepth = (typeof CANONICAL_MANAGER_DEPTH)[number];

export const CANONICAL_MANAGER_MODALITY = Object.freeze([
  "IMPERATIVE",
  "INTERROGATIVE",
  "DECLARATIVE",
  "FRAGMENT",
  "HYPOTHETICAL",
] as const);

export type CanonicalManagerModality =
  (typeof CANONICAL_MANAGER_MODALITY)[number];

export const CANONICAL_MANAGER_POLARITY = Object.freeze([
  "AFFIRMATIVE",
  "NEGATIVE",
  "TENTATIVE",
] as const);

export type CanonicalManagerPolarity =
  (typeof CANONICAL_MANAGER_POLARITY)[number];

export type CanonicalManagerObjectReference = {
  readonly subjectId: string | null;
  readonly canonicalName: string | null;
  readonly lexicalHint: string | null;
  readonly subjectKind: string | null;
};

export type CanonicalManagerAmbiguity = {
  readonly unresolved: boolean;
  readonly reason:
    | "none"
    | "multiple-objects"
    | "missing-referent"
    | "underspecified-action"
    | "conflicting-cues";
  readonly candidates: readonly CanonicalManagerObjectReference[];
};

export type CanonicalManagerSemanticEvidence = {
  readonly operationCues: readonly string[];
  readonly objectCues: readonly string[];
  readonly speechActCues: readonly string[];
  readonly reasoningPath: "feature-frame-interpreter";
  readonly usesLlm: false;
};

export type CanonicalManagerMeaning = {
  readonly identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding";
  readonly rawUtterance: string;
  readonly preparedUtterance: string;
  readonly communicativeIntent: CanonicalManagerCommunicativeIntent;
  readonly requestedOperation: CanonicalManagerOperation;
  readonly subject: CanonicalManagerObjectReference | null;
  readonly objectReference: CanonicalManagerObjectReference | null;
  readonly questionType: CanonicalManagerQuestionType;
  readonly requestedDepth: CanonicalManagerDepth;
  readonly modality: CanonicalManagerModality;
  readonly polarity: CanonicalManagerPolarity;
  readonly confidence: CanonicalManagerConfidence;
  readonly ambiguity: CanonicalManagerAmbiguity;
  readonly semanticEvidence: CanonicalManagerSemanticEvidence;
  readonly selectedAuthority: string | null;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly inventsBusinessTruth: false;
};
