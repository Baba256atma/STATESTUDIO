/** WS-7:7 — Canonical Decision Workspace Certification surface. */
import {
  DecisionWorkspaceV7CertificationCompliance,
  DecisionWorkspaceV7CertificationDependencyVerification,
} from "./decisionWorkspaceV7CertificationCompliance.ts";
import { DecisionWorkspaceV7CertificationCriteria } from "./decisionWorkspaceV7CertificationCriteria.ts";
import { DecisionWorkspaceV7CertificationGates } from "./decisionWorkspaceV7CertificationGates.ts";
import { DecisionWorkspaceV7CertificationGuarantees } from "./decisionWorkspaceV7CertificationGuarantees.ts";
import { DecisionWorkspaceV7CertificationIdentity } from "./decisionWorkspaceV7CertificationIdentity.ts";
import { DecisionWorkspaceV7CertificationOutcomes } from "./decisionWorkspaceV7CertificationOutcomes.ts";
import { DecisionWorkspaceV7Platform } from "./decisionWorkspaceV7Platform.ts";

export const DecisionWorkspaceV7Certification = Object.freeze({
  identity: DecisionWorkspaceV7CertificationIdentity,
  platform: DecisionWorkspaceV7Platform,
  criteria: DecisionWorkspaceV7CertificationCriteria,
  gates: DecisionWorkspaceV7CertificationGates,
  outcomes: DecisionWorkspaceV7CertificationOutcomes,
  guarantees: DecisionWorkspaceV7CertificationGuarantees,
  dependencyVerification:
    DecisionWorkspaceV7CertificationDependencyVerification,
  compliance: DecisionWorkspaceV7CertificationCompliance,
  certificationOutcome: "Certified",
  status: "ReadyForFreeze",
  readiness: "ReadyForFreeze",
  upstreamDependencies: Object.freeze([
    "WS-7:6 Decision Workspace Platform",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceV7Certification"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  certificationEngine: false,
  validators: false,
  runtime: false,
  aiReasoning: false,
  decisionGeneration: false,
  decisionExecution: false,
  optimization: false,
  ranking: false,
  scoring: false,
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
