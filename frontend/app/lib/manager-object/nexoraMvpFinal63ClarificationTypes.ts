/**
 * NEX-MVP-FINAL:6.3 — clarification/correction contracts.
 * Trust gate over 6.1 + 6.2. Not a second conversation engine.
 */

import type {
  CanonicalManagerOperation,
  CanonicalManagerObjectReference,
} from "./canonicalManagerMeaning.ts";

export const CLARIFICATION_REASONS = Object.freeze([
  "REFERENCE_AMBIGUITY",
  "OBJECT_AMBIGUITY",
  "TYPE_AMBIGUITY",
  "OPERATION_AMBIGUITY",
  "COMPARISON_AMBIGUITY",
  "CORRECTION_TARGET_AMBIGUITY",
  "MISSING_SUBJECT",
  "MISSING_OPERATION",
  "UNSAFE_COMMITMENT_REFERENT",
  "NONE",
] as const);

export type ClarificationReason = (typeof CLARIFICATION_REASONS)[number];

export const CLARIFICATION_CONSEQUENCES = Object.freeze([
  "NAVIGATION",
  "INQUIRY",
  "COMMITMENT",
] as const);

export type ClarificationConsequence = (typeof CLARIFICATION_CONSEQUENCES)[number];

export const CORRECTION_SCOPES = Object.freeze([
  "TURN_REFERENT",
  "ACTIVE_SUBJECT",
  "COMPARISON_SLOT",
  "PENDING_CLARIFICATION",
  "OBSERVATION_VALUE",
  "OTHER_SUPPORTED_SCOPE",
] as const);

export type CorrectionScope = (typeof CORRECTION_SCOPES)[number];

export type ClarificationCandidate = {
  readonly subjectId: string;
  readonly canonicalName: string;
  readonly subjectKind: string;
};

export type PendingClarification = {
  readonly identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection";
  readonly reason: ClarificationReason;
  readonly originalUtterance: string;
  readonly requestedOperation: CanonicalManagerOperation;
  readonly candidates: readonly ClarificationCandidate[];
  readonly expectedAnswer: "choice" | "binary" | "subject" | "operation";
  readonly binaryCandidateId: string | null;
  readonly question: string;
  readonly questionSignature: string;
  readonly loopCount: number;
  readonly parked: boolean;
  readonly consequence: ClarificationConsequence;
  readonly originalIntentKind: string;
};

export type ClarificationTurnResult = {
  readonly identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection";
  readonly action:
    | "proceed"
    | "clarify"
    | "resume"
    | "cancel"
    | "park"
    | "unpark"
    | "fail";
  readonly question: string | null;
  readonly reason: ClarificationReason;
  readonly pending: PendingClarification | null;
  readonly resumeOperation: CanonicalManagerOperation | null;
  readonly resumeReference: CanonicalManagerObjectReference | null;
  readonly resumeIntentKind: string | null;
  readonly correctionDetected: boolean;
  readonly correctionScope: CorrectionScope | null;
  readonly correctionBeforeId: string | null;
  readonly correctionAfterId: string | null;
  readonly cancelled: boolean;
  readonly consequence: ClarificationConsequence;
  readonly commitsDecision: false;
  readonly startsExecution: false;
};
