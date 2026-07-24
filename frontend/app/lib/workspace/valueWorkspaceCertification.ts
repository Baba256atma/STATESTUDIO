/** WS-9:7 — Canonical Value Workspace Certification surface. */
import {
  ValueWorkspaceCertificationCompliance,
  ValueWorkspaceCertificationDependencyVerification,
} from "./valueWorkspaceCertificationCompliance.ts";
import { ValueWorkspaceCertificationCriteria } from "./valueWorkspaceCertificationCriteria.ts";
import { ValueWorkspaceCertificationGates } from "./valueWorkspaceCertificationGates.ts";
import { ValueWorkspaceCertificationGuarantees } from "./valueWorkspaceCertificationGuarantees.ts";
import { ValueWorkspaceCertificationIdentity } from "./valueWorkspaceCertificationIdentity.ts";
import { ValueWorkspaceCertificationOutcomes } from "./valueWorkspaceCertificationOutcomes.ts";
import { ValueWorkspacePlatform } from "./valueWorkspacePlatform.ts";

export const ValueWorkspaceCertification = Object.freeze({
  identity: ValueWorkspaceCertificationIdentity,
  platform: ValueWorkspacePlatform,
  criteria: ValueWorkspaceCertificationCriteria,
  gates: ValueWorkspaceCertificationGates,
  outcomes: ValueWorkspaceCertificationOutcomes,
  guarantees: ValueWorkspaceCertificationGuarantees,
  dependencyVerification: ValueWorkspaceCertificationDependencyVerification,
  compliance: ValueWorkspaceCertificationCompliance,
  certificationOutcome: "Certified",
  status: "ReadyForFreeze",
  readiness: "ReadyForFreeze",
  upstreamDependencies: Object.freeze([
    "WS-9:6 Value Workspace Platform",
  ]),
  publicApiSurface: Object.freeze(["ValueWorkspaceCertification"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  certificationEngine: false,
  validators: false,
  runtime: false,
  businessValueCalculation: false,
  roiCalculation: false,
  financialAnalysis: false,
  forecasting: false,
  aiReasoning: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
