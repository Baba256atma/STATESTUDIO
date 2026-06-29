/**
 * APP-2:13 — Scenario Intelligence Platform certification contract.
 * Platform certification interfaces — certification only, no runtime changes.
 */

import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";

export const SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION = "APP-2/13" as const;
export const SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-2/13" as const;

export const SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_TAG =
  "[APP2_13_SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION]" as const;

export const SCENARIO_INTELLIGENCE_PLATFORM_LAYERS = Object.freeze([
  "intelligence",
  "executive",
  "export",
  "integration",
] as const);

export type ScenarioIntelligencePlatformLayer =
  (typeof SCENARIO_INTELLIGENCE_PLATFORM_LAYERS)[number];

export const SCENARIO_INTELLIGENCE_PLATFORM_GATE_IDS = Object.freeze([
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const);

export type ScenarioIntelligencePlatformGateId =
  (typeof SCENARIO_INTELLIGENCE_PLATFORM_GATE_IDS)[number];

export const SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST = Object.freeze({
  stageId: "APP-2/13",
  title: "Scenario Intelligence Platform Certification",
  goal: "Certify the complete APP-2 executive intelligence platform.",
  certificationVersion: SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  introducesCapabilities: false,
  modifiesPhases: false,
  certificationOnly: true,
} as const);

export type ScenarioIntelligencePlatformCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  platformReady: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  regressionSummary: string;
  diagnostics: readonly import("./scenarioIntelligencePlatformDiagnostics.ts").ScenarioIntelligencePlatformDiagnostic[];
  summary: string;
  generatedAt: string;
}>;

export type ScenarioIntelligencePlatformPhaseRegressionEntry = Readonly<{
  phaseId: string;
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checkCount: number;
  failedCheckCount: number;
}>;

export type ScenarioIntelligencePlatformRegressionResult = Readonly<{
  status: "PASS" | "FAIL";
  allPhasesCertified: boolean;
  phaseCount: number;
  passedPhaseCount: number;
  phases: readonly ScenarioIntelligencePlatformPhaseRegressionEntry[];
  summary: string;
  generatedAt: string;
}>;
