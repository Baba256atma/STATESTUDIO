/**
 * DS:3:8 — Object Intelligence certification contract.
 */

export const DS_3_8_OBJECT_INTELLIGENCE_CERTIFICATION_TAG =
  "[DS:3:8_OBJECT_INTELLIGENCE_CERTIFICATION]" as const;

export const DS3_CERTIFIED_TAG = "[DS3_CERTIFIED]" as const;

export const OBJECT_INTELLIGENCE_COMPLETE_TAG = "[OBJECT_INTELLIGENCE_COMPLETE]" as const;

export const DS3_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  DS3_CERTIFIED_TAG,
  OBJECT_INTELLIGENCE_COMPLETE_TAG,
] as const);

export type ObjectIntelligenceCertificationGateId =
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
  | "K";

export type ObjectIntelligenceCertificationGate = Readonly<{
  id: ObjectIntelligenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type ObjectIntelligenceCertificationResult = Readonly<{
  tag: typeof DS_3_8_OBJECT_INTELLIGENCE_CERTIFICATION_TAG;
  version: "3.8.0";
  certified: boolean;
  gates: readonly ObjectIntelligenceCertificationGate[];
  freezeTags: typeof DS3_CERTIFICATION_FREEZE_TAGS;
}>;
