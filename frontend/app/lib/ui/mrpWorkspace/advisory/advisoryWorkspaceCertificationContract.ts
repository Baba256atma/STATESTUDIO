/**
 * MRP:5A:6 — Advisory workspace certification contract.
 *
 * Certification only — validates frozen Advisory workspace architecture (MRP:5A:1–5A:5).
 */

export const ADVISORY_WORKSPACE_CERTIFICATION_VERSION = "5A.6.0";

export const MRP_ADVISORY_CERTIFIED_TAG = "[MRP_ADVISORY_CERTIFIED]" as const;
export const MRP_PHASE5A_COMPLETE_TAG = "[MRP_PHASE5A_COMPLETE]" as const;

export type AdvisoryWorkspaceCertificationGateId =
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

export type AdvisoryWorkspaceCertificationVerdict = "PASS" | "PASS WITH WARNINGS" | "FAIL";

export type AdvisoryWorkspaceCertificationGate = Readonly<{
  id: AdvisoryWorkspaceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type AdvisoryWorkspaceValidationCheck = Readonly<{
  id:
    | "creates_recommendations"
    | "explains_recommendations"
    | "produces_confidence_analysis"
    | "creates_governance_package"
    | "executes_decisions"
    | "approves_decisions";
  label: string;
  expected: boolean;
  actual: boolean;
  status: "PASS" | "FAIL";
}>;

export type AdvisoryWorkspaceCertificationResult = Readonly<{
  verdict: AdvisoryWorkspaceCertificationVerdict;
  certifiedAt: string;
  version: string;
  gates: readonly AdvisoryWorkspaceCertificationGate[];
  validationChecks: readonly AdvisoryWorkspaceValidationCheck[];
  warnings: readonly string[];
  blockers: readonly string[];
  freezeTags: readonly string[];
}>;

export const ADVISORY_WORKSPACE_CERTIFICATION_GATE_ORDER: readonly AdvisoryWorkspaceCertificationGateId[] =
  Object.freeze(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]);

export const ADVISORY_WORKSPACE_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  MRP_ADVISORY_CERTIFIED_TAG,
  MRP_PHASE5A_COMPLETE_TAG,
]);
