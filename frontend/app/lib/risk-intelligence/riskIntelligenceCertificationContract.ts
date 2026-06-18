/**
 * DS:6:9 — Risk Intelligence certification contract.
 */

export const DS_6_9_RISK_INTELLIGENCE_CERTIFICATION_TAG =
  "[DS:6:9_RISK_INTELLIGENCE_CERTIFICATION]" as const;

export const DS6_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  "[DS6_CERTIFIED]",
  "[RISK_INTELLIGENCE_COMPLETE]",
] as const);

export type RiskIntelligenceCertificationGateId =
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

export type RiskIntelligenceCertificationGate = Readonly<{
  id: RiskIntelligenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type RiskIntelligenceCertificationResult = Readonly<{
  tag: typeof DS_6_9_RISK_INTELLIGENCE_CERTIFICATION_TAG;
  version: "6.9.0";
  certified: boolean;
  gates: readonly RiskIntelligenceCertificationGate[];
  freezeTags: typeof DS6_CERTIFICATION_FREEZE_TAGS;
}>;
