/**
 * INT:3 — Assistant Intelligence integration certification contract.
 */

export const INT3_ASSISTANT_INTEGRATION_CERTIFICATION_TAG =
  "[INT3_ASSISTANT_INTEGRATION_CERTIFICATION]" as const;

export const INT3_CERTIFIED_TAG = "[INT3_CERTIFIED]" as const;

export const ASSISTANT_INTELLIGENCE_COMPLETE_TAG = "[ASSISTANT_INTELLIGENCE_COMPLETE]" as const;

export const INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[INT3_CERTIFICATION_COMPLETE]" as const;

export const INT3_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  INT3_CERTIFIED_TAG,
  ASSISTANT_INTELLIGENCE_COMPLETE_TAG,
] as const);

export type AssistantIntelligenceCertificationGateId =
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
  | "N";

export type AssistantIntelligenceCertificationGate = Readonly<{
  id: AssistantIntelligenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type AssistantIntelligenceCertificationResult = Readonly<{
  tag: typeof INT3_ASSISTANT_INTEGRATION_CERTIFICATION_TAG;
  version: "3.6.0";
  certified: boolean;
  diagnostics: readonly [typeof INT3_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly AssistantIntelligenceCertificationGate[];
  freezeTags: typeof INT3_CERTIFICATION_FREEZE_TAGS;
}>;
