/**
 * INT:1 — Analyze Intelligence integration certification contract.
 */

export const INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG =
  "[INT:1_ANALYZE_INTEGRATION_CERTIFICATION]" as const;

export const INT1_CERTIFIED_TAG = "[INT1_CERTIFIED]" as const;

export const ANALYZE_INTELLIGENCE_COMPLETE_TAG = "[ANALYZE_INTELLIGENCE_COMPLETE]" as const;

export const INT1_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  INT1_CERTIFIED_TAG,
  ANALYZE_INTELLIGENCE_COMPLETE_TAG,
] as const);

export type AnalyzeIntelligenceCertificationGateId =
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
  | "L";

export type AnalyzeIntelligenceCertificationGate = Readonly<{
  id: AnalyzeIntelligenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type AnalyzeIntelligenceCertificationResult = Readonly<{
  tag: typeof INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG;
  version: "1.5.0";
  certified: boolean;
  gates: readonly AnalyzeIntelligenceCertificationGate[];
  freezeTags: typeof INT1_CERTIFICATION_FREEZE_TAGS;
}>;

/** @deprecated use INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG */
export const INT_1_5_ANALYZE_INTELLIGENCE_CERTIFICATION_TAG =
  INT_1_ANALYZE_INTEGRATION_CERTIFICATION_TAG;
