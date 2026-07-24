/** WS-6:7 — Canonical Problem Workspace Certification surface. */
import {
  ProblemWorkspaceCertificationCompliance,
  ProblemWorkspaceCertificationDependencyVerification,
} from "./problemWorkspaceCertificationCompliance.ts";
import { ProblemWorkspaceCertificationCriteria } from "./problemWorkspaceCertificationCriteria.ts";
import { ProblemWorkspaceCertificationGates } from "./problemWorkspaceCertificationGates.ts";
import { ProblemWorkspaceCertificationGuarantees } from "./problemWorkspaceCertificationGuarantees.ts";
import { ProblemWorkspaceCertificationIdentity } from "./problemWorkspaceCertificationIdentity.ts";
import { ProblemWorkspaceCertificationOutcomes } from "./problemWorkspaceCertificationOutcomes.ts";
import { ProblemWorkspacePlatform } from "./problemWorkspacePlatform.ts";

export const ProblemWorkspaceCertification = Object.freeze({
  identity: ProblemWorkspaceCertificationIdentity,
  platform: ProblemWorkspacePlatform,
  criteria: ProblemWorkspaceCertificationCriteria,
  gates: ProblemWorkspaceCertificationGates,
  outcomes: ProblemWorkspaceCertificationOutcomes,
  guarantees: ProblemWorkspaceCertificationGuarantees,
  dependencyVerification:
    ProblemWorkspaceCertificationDependencyVerification,
  compliance: ProblemWorkspaceCertificationCompliance,
  certificationOutcome: "Certified",
  status: "ReadyForFreeze",
  readiness: "ReadyForFreeze",
  upstreamDependencies: Object.freeze([
    "WS-6:6 Problem Workspace Platform",
  ]),
  publicApiSurface: Object.freeze(["ProblemWorkspaceCertification"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  validators: false,
  aiReasoning: false,
  problemSolving: false,
  rootCauseAnalysis: false,
  workflowExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
