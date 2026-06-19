/**
 * D:2:7 — Decision Confidence Engine certification contract.
 */

export const D2_DECISION_CONFIDENCE_CERTIFICATION_TAG =
  "[D2_DECISION_CONFIDENCE_CERTIFICATION]" as const;

export const D2_CERTIFIED_TAG = "[D2_CERTIFIED]" as const;

export const DECISION_CONFIDENCE_COMPLETE_TAG = "[DECISION_CONFIDENCE_COMPLETE]" as const;

export const D2_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[D2_CERTIFICATION_COMPLETE]" as const;

export const D2_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  D2_CERTIFIED_TAG,
  DECISION_CONFIDENCE_COMPLETE_TAG,
] as const);

export type DecisionConfidenceCertificationGateId =
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
  | "O"
  | "P";

export type DecisionConfidenceCertificationGate = Readonly<{
  id: DecisionConfidenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type DecisionConfidenceCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type DecisionConfidenceCertificationResult = Readonly<{
  tag: typeof D2_DECISION_CONFIDENCE_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof D2_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly DecisionConfidenceCertificationGate[];
  freezeTags: typeof D2_CERTIFICATION_FREEZE_TAGS;
}>;
