/**
 * S:2 — Scenario Simulation certification contract.
 */

export const S2_SCENARIO_SIMULATION_CERTIFICATION_TAG =
  "[S2_SCENARIO_SIMULATION_CERTIFICATION]" as const;

export const S2_CERTIFIED_TAG = "[S2_CERTIFIED]" as const;

export const SCENARIO_SIMULATION_COMPLETE_TAG = "[SCENARIO_SIMULATION_COMPLETE]" as const;

export const S2_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[S2_CERTIFICATION_COMPLETE]" as const;

export const S2_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  S2_CERTIFIED_TAG,
  SCENARIO_SIMULATION_COMPLETE_TAG,
] as const);

export type ScenarioSimulationCertificationGateId =
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

export type ScenarioSimulationCertificationGate = Readonly<{
  id: ScenarioSimulationCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type ScenarioSimulationCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type ScenarioSimulationCertificationResult = Readonly<{
  tag: typeof S2_SCENARIO_SIMULATION_CERTIFICATION_TAG;
  version: "1.0.0";
  certified: boolean;
  diagnostics: readonly [typeof S2_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly ScenarioSimulationCertificationGate[];
  freezeTags: typeof S2_CERTIFICATION_FREEZE_TAGS;
}>;
