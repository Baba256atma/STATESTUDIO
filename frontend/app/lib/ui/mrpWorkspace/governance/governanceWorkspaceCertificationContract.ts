/**
 * MRP:5B:6 — Governance workspace certification contract.
 *
 * Certification only — validates frozen Governance workspace architecture (MRP:5B:1–5B:5).
 */

export const GOVERNANCE_WORKSPACE_CERTIFICATION_VERSION = "5B.6.0";

export const MRP_GOVERNANCE_CERTIFIED_TAG = "[MRP_GOVERNANCE_CERTIFIED]" as const;
export const MRP_PHASE5B_COMPLETE_TAG = "[MRP_PHASE5B_COMPLETE]" as const;

export type GovernanceWorkspaceCertificationGateId =
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
  | "L";

export type GovernanceWorkspaceCertificationVerdict = "PASS" | "PASS WITH WARNINGS" | "FAIL";

export type GovernanceWorkspaceCertificationGate = Readonly<{
  id: GovernanceWorkspaceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type GovernanceWorkspaceValidationCheckId =
  | "policy_review"
  | "constraint_review"
  | "approval_chain"
  | "authority_review"
  | "governance_outcome"
  | "forecast_generation"
  | "scenario_creation"
  | "decision_execution";

export type GovernanceWorkspaceValidationCheck = Readonly<{
  id: GovernanceWorkspaceValidationCheckId;
  label: string;
  expected: boolean;
  actual: boolean;
  status: "PASS" | "FAIL";
}>;

export type GovernanceWorkspaceCertificationResult = Readonly<{
  verdict: GovernanceWorkspaceCertificationVerdict;
  certifiedAt: string;
  version: string;
  gates: readonly GovernanceWorkspaceCertificationGate[];
  validationChecks: readonly GovernanceWorkspaceValidationCheck[];
  warnings: readonly string[];
  blockers: readonly string[];
  freezeTags: readonly string[];
  status: "Governance Workspace Frozen";
}>;

export const GOVERNANCE_WORKSPACE_CERTIFICATION_GATE_ORDER: readonly GovernanceWorkspaceCertificationGateId[] =
  Object.freeze(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]);

export const GOVERNANCE_WORKSPACE_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  MRP_GOVERNANCE_CERTIFIED_TAG,
  MRP_PHASE5B_COMPLETE_TAG,
]);
