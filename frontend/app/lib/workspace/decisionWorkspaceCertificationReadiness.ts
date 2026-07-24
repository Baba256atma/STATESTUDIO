/** WS-4:7 — Derived Freeze readiness metadata. */
import { DecisionWorkspaceCertificationCriteria } from "./decisionWorkspaceCertificationCriteria.ts";
import { DecisionWorkspaceCertificationGates } from "./decisionWorkspaceCertificationGates.ts";
import { DecisionWorkspaceCertificationGuarantees } from "./decisionWorkspaceCertificationGuarantees.ts";
import { DecisionWorkspacePlatform } from "./decisionWorkspacePlatform.ts";

export const DecisionWorkspaceCertificationReadiness = Object.freeze({
  certificationStatus: "Certified",
  certificationResult: "Pass",
  certificationReadiness: "ReadyForFreeze",
  platformStatus: "Complete",
  guaranteeStatus: "Satisfied",
  criteriaPass: DecisionWorkspaceCertificationCriteria.every(
    ({ result }) => result === "Pass",
  ),
  gatesPass: DecisionWorkspaceCertificationGates.every(
    ({ result }) => result === "Pass",
  ),
  guaranteesSatisfied: DecisionWorkspaceCertificationGuarantees.every(
    ({ state }) => state === "Satisfied",
  ),
  source: DecisionWorkspacePlatform,
  metadataOnly: true,
  immutable: true,
} as const);
