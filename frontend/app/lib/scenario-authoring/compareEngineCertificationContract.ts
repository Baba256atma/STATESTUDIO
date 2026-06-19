/**
 * C:1 — Compare Engine certification contract.
 */

export const C1_COMPARE_ENGINE_CERTIFICATION_TAG = "[C1_COMPARE_ENGINE_CERTIFICATION]" as const;

export const C1_CERTIFIED_TAG = "[C1_CERTIFIED]" as const;

export const COMPARE_ENGINE_COMPLETE_TAG = "[COMPARE_ENGINE_COMPLETE]" as const;

export const C1_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[C1_CERTIFICATION_COMPLETE]" as const;

export const C1_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  C1_CERTIFIED_TAG,
  COMPARE_ENGINE_COMPLETE_TAG,
] as const);

export type CompareEngineCertificationGateId =
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
  | "M";

export type CompareEngineCertificationGate = Readonly<{
  id: CompareEngineCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type CompareEngineCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type CompareEngineCertificationResult = Readonly<{
  tag: typeof C1_COMPARE_ENGINE_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof C1_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly CompareEngineCertificationGate[];
  freezeTags: typeof C1_CERTIFICATION_FREEZE_TAGS;
}>;
