/**
 * D:1 — Decision Recommendation Engine certification contract.
 */

export const D1_DECISION_RECOMMENDATION_CERTIFICATION_TAG =
  "[D1_DECISION_RECOMMENDATION_CERTIFICATION]" as const;

export const D1_CERTIFIED_TAG = "[D1_CERTIFIED]" as const;

export const DECISION_RECOMMENDATION_COMPLETE_TAG = "[DECISION_RECOMMENDATION_COMPLETE]" as const;

export const D1_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[D1_CERTIFICATION_COMPLETE]" as const;

export const D1_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  D1_CERTIFIED_TAG,
  DECISION_RECOMMENDATION_COMPLETE_TAG,
] as const);

export type DecisionRecommendationCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O";

export type DecisionRecommendationCertificationGate = Readonly<{
  id: DecisionRecommendationCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type DecisionRecommendationCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type DecisionRecommendationCertificationResult = Readonly<{
  tag: typeof D1_DECISION_RECOMMENDATION_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof D1_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly DecisionRecommendationCertificationGate[];
  freezeTags: typeof D1_CERTIFICATION_FREEZE_TAGS;
}>;
