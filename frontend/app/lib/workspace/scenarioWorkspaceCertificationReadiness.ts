/** WS-5:7 — Derived Freeze readiness metadata. */
import { ScenarioWorkspaceCertificationCriteria } from "./scenarioWorkspaceCertificationCriteria.ts";
import { ScenarioWorkspaceCertificationGates } from "./scenarioWorkspaceCertificationGates.ts";
import { ScenarioWorkspaceCertificationGuarantees } from "./scenarioWorkspaceCertificationGuarantees.ts";
import { ScenarioWorkspacePlatform } from "./scenarioWorkspacePlatform.ts";

export const ScenarioWorkspaceCertificationReadiness = Object.freeze({
  certificationStatus: "Certified",
  certificationResult: "Pass",
  certificationReadiness: "ReadyForFreeze",
  platformStatus: "Complete",
  guaranteeStatus: "Satisfied",
  criteriaPass: ScenarioWorkspaceCertificationCriteria.every(
    ({ result }) => result === "Pass",
  ),
  gatesPass: ScenarioWorkspaceCertificationGates.every(
    ({ result }) => result === "Pass",
  ),
  guaranteesSatisfied: ScenarioWorkspaceCertificationGuarantees.every(
    ({ state }) => state === "Satisfied",
  ),
  source: ScenarioWorkspacePlatform,
  metadataOnly: true,
  immutable: true,
} as const);
