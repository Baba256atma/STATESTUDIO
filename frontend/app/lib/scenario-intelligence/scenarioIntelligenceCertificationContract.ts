/**
 * DS:7:10 — Scenario Intelligence certification contract.
 */

export const DS_7_10_SCENARIO_INTELLIGENCE_CERTIFICATION_TAG =
  "[DS:7:10_SCENARIO_INTELLIGENCE_CERTIFICATION]" as const;

export const DS7_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  "[DS7_CERTIFIED]",
  "[SCENARIO_GENERATION_COMPLETE]",
] as const);

export type ScenarioIntelligenceCertificationGateId =
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

export type ScenarioIntelligenceCertificationGate = Readonly<{
  id: ScenarioIntelligenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type ScenarioIntelligenceCertificationResult = Readonly<{
  tag: typeof DS_7_10_SCENARIO_INTELLIGENCE_CERTIFICATION_TAG;
  version: "7.10.0";
  certified: boolean;
  gates: readonly ScenarioIntelligenceCertificationGate[];
  freezeTags: typeof DS7_CERTIFICATION_FREEZE_TAGS;
}>;
