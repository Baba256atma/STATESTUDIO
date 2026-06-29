/**
 * APP-2:1 — Scenario Intelligence certification contract.
 * Certification interfaces only — no certification runner or regression execution.
 */

import type {
  ScenarioIntelligenceCertificationGate,
  ScenarioIntelligenceCertificationResult,
  ScenarioIntelligenceCertificationScope,
} from "./scenarioIntelligenceTypes.ts";
import { SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";

export const SCENARIO_INTELLIGENCE_CERTIFICATION_CONTRACT_VERSION = "APP-2/1" as const;

export const SCENARIO_INTELLIGENCE_CERTIFICATION_TAG =
  "[APP2_1_SCENARIO_INTELLIGENCE_CERTIFICATION]" as const;

export const SCENARIO_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  "[APP2_CONTRACT_CERTIFIED]",
  "[APP2_CONTRACT_FROZEN]",
] as const);

export const SCENARIO_INTELLIGENCE_CERTIFICATION_SCOPES = Object.freeze([
  "architecture",
  "lifecycle",
  "interfaces",
  "diagnostics",
  "regression",
  "read_only_compliance",
  "freeze",
] as const satisfies readonly ScenarioIntelligenceCertificationScope[]);

export const SCENARIO_INTELLIGENCE_CERTIFICATION_GATES: readonly ScenarioIntelligenceCertificationGate[] =
  Object.freeze([
    Object.freeze({
      scope: "architecture",
      checkId: "contract-exists",
      title: "Scenario Intelligence contract exists.",
      required: true,
    }),
    Object.freeze({
      scope: "architecture",
      checkId: "identity-defined",
      title: "APP-2 identity metadata is defined.",
      required: true,
    }),
    Object.freeze({
      scope: "lifecycle",
      checkId: "lifecycle-defined",
      title: "Scenario lifecycle stages are defined.",
      required: true,
    }),
    Object.freeze({
      scope: "interfaces",
      checkId: "public-api-defined",
      title: "Public API interfaces are declared.",
      required: true,
    }),
    Object.freeze({
      scope: "diagnostics",
      checkId: "diagnostics-defined",
      title: "Diagnostics vocabulary is complete.",
      required: true,
    }),
    Object.freeze({
      scope: "regression",
      checkId: "no-certified-phase-modification",
      title: "No certified DS, INT, APP-1, or simulation phases were modified.",
      required: true,
    }),
    Object.freeze({
      scope: "read_only_compliance",
      checkId: "read-only-boundary",
      title: "Contract remains read-only and workspace-aware.",
      required: true,
    }),
    Object.freeze({
      scope: "freeze",
      checkId: "freeze-rules-documented",
      title: "Freeze and extension rules are documented.",
      required: true,
    }),
  ]);

export type ScenarioIntelligenceCertificationRunner = Readonly<{
  phaseName: string;
  version: typeof SCENARIO_INTELLIGENCE_CERTIFICATION_CONTRACT_VERSION;
  runCertification: () => ScenarioIntelligenceCertificationResult;
}>;

export const ScenarioIntelligenceCertificationRunnerDeclaration: ScenarioIntelligenceCertificationRunner =
  Object.freeze({
    phaseName: "APP-2:1 Scenario Intelligence Contract",
    version: SCENARIO_INTELLIGENCE_CERTIFICATION_CONTRACT_VERSION,
    runCertification: () => {
      throw new Error("Certification runner deferred — contract interfaces only.");
    },
  });

export function listScenarioIntelligenceCertificationScopes(): readonly ScenarioIntelligenceCertificationScope[] {
  return SCENARIO_INTELLIGENCE_CERTIFICATION_SCOPES;
}

export function listScenarioIntelligenceRequiredCertificationGates(): readonly ScenarioIntelligenceCertificationGate[] {
  return SCENARIO_INTELLIGENCE_CERTIFICATION_GATES.filter((gate) => gate.required);
}
