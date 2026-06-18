/**
 * S:1 — Scenario Authoring certification contract.
 */

export const S1_SCENARIO_AUTHORING_CERTIFICATION_TAG =
  "[S1_SCENARIO_AUTHORING_CERTIFICATION]" as const;

export const S1_CERTIFIED_TAG = "[S1_CERTIFIED]" as const;

export const SCENARIO_AUTHORING_COMPLETE_TAG = "[SCENARIO_AUTHORING_COMPLETE]" as const;

export const S1_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[S1_CERTIFICATION_COMPLETE]" as const;

export const S1_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  S1_CERTIFIED_TAG,
  SCENARIO_AUTHORING_COMPLETE_TAG,
] as const);

export type ScenarioAuthoringCertificationGateId =
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

export type ScenarioAuthoringCertificationGate = Readonly<{
  id: ScenarioAuthoringCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type ScenarioAuthoringCertificationResult = Readonly<{
  tag: typeof S1_SCENARIO_AUTHORING_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof S1_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly ScenarioAuthoringCertificationGate[];
  freezeTags: typeof S1_CERTIFICATION_FREEZE_TAGS;
}>;
