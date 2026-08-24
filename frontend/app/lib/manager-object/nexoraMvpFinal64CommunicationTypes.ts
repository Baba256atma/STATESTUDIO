/**
 * NEX-MVP-FINAL:6.4 — trusted executive communication contracts.
 * Presentation only. Does not own business truth.
 */

export const TRUSTED_CLAIM_KINDS = Object.freeze([
  "FACT",
  "OBSERVATION",
  "ASSUMPTION",
  "HYPOTHESIS",
  "PREDICTION",
  "UNKNOWN",
  "RECOMMENDATION",
  "CHALLENGE",
] as const);

export type TrustedClaimKind = (typeof TRUSTED_CLAIM_KINDS)[number];

export const TRUSTED_RESPONSE_DEPTHS = Object.freeze([
  "BRIEF",
  "NORMAL",
  "DEEP",
] as const);

export type TrustedResponseDepth = (typeof TRUSTED_RESPONSE_DEPTHS)[number];

export const TRUSTED_CLAIM_CONFIDENCE = Object.freeze([
  "HIGH",
  "MEDIUM",
  "LOW",
  "UNKNOWN",
] as const);

export type TrustedClaimConfidence = (typeof TRUSTED_CLAIM_CONFIDENCE)[number];

export type TrustedExecutiveClaim = {
  readonly kind: TrustedClaimKind;
  readonly text: string;
  readonly confidence: TrustedClaimConfidence;
};

export type TrustedExecutiveCommunication = {
  readonly identity: "NEX-MVP-FINAL:6.4/TrustedExecutiveCommunication";
  readonly depth: TrustedResponseDepth;
  readonly sourceText: string;
  readonly answer: string;
  readonly claims: readonly TrustedExecutiveClaim[];
  readonly challengePresent: boolean;
  readonly recommendationPresent: boolean;
  readonly uncertaintyPreserved: boolean;
  readonly causalClaimValidated: boolean;
  readonly decisionStateWording: "none" | "recommended" | "selected" | "approved";
  readonly executionStateWording: "none" | "planned" | "started";
  readonly skippedRewrite: boolean;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly inventsBusinessTruth: false;
  readonly usesLlm: false;
};
