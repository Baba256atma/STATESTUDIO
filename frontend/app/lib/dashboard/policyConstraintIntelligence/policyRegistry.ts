/**
 * Phase 6:3 — Policy Registry.
 * Generic institutional framework — not organization-specific policies.
 */

export const POLICY_REGISTRY_VERSION = "6.3.0";

export type PolicyId = "policy_alpha" | "policy_beta" | "policy_gamma";

export type ConstraintId = "constraint_alpha" | "constraint_beta" | "constraint_gamma";

export type BoundaryId = "boundary_alpha" | "boundary_beta";

export type ApprovalRequirementId = "approval_alpha" | "approval_beta";

export type PolicyCategory = "operational" | "governance" | "resource" | "strategic";

export type PolicyEntry = Readonly<{
  id: PolicyId;
  label: string;
  category: PolicyCategory;
  summary: string;
}>;

export type ConstraintEntry = Readonly<{
  id: ConstraintId;
  label: string;
  category: PolicyCategory;
  summary: string;
}>;

export type BoundaryEntry = Readonly<{
  id: BoundaryId;
  label: string;
  category: PolicyCategory;
  summary: string;
}>;

export type ApprovalRequirementEntry = Readonly<{
  id: ApprovalRequirementId;
  label: string;
  authority: string;
  summary: string;
}>;

export const POLICY_REGISTRY: Readonly<Record<PolicyId, PolicyEntry>> = Object.freeze({
  policy_alpha: Object.freeze({
    id: "policy_alpha",
    label: "Institutional Policy Alpha",
    category: "governance",
    summary: "Core governance boundary for executive decisions",
  }),
  policy_beta: Object.freeze({
    id: "policy_beta",
    label: "Institutional Policy Beta",
    category: "resource",
    summary: "Resource allocation and capacity boundary policy",
  }),
  policy_gamma: Object.freeze({
    id: "policy_gamma",
    label: "Institutional Policy Gamma",
    category: "operational",
    summary: "Operational execution and readiness boundary policy",
  }),
});

export const CONSTRAINT_REGISTRY: Readonly<Record<ConstraintId, ConstraintEntry>> = Object.freeze({
  constraint_alpha: Object.freeze({
    id: "constraint_alpha",
    label: "Resource Constraint Alpha",
    category: "resource",
    summary: "Budget and capacity limitation boundary",
  }),
  constraint_beta: Object.freeze({
    id: "constraint_beta",
    label: "Operational Constraint Beta",
    category: "operational",
    summary: "Execution readiness and dependency limitation",
  }),
  constraint_gamma: Object.freeze({
    id: "constraint_gamma",
    label: "Governance Constraint Gamma",
    category: "governance",
    summary: "Approval and authority limitation boundary",
  }),
});

export const BOUNDARY_REGISTRY: Readonly<Record<BoundaryId, BoundaryEntry>> = Object.freeze({
  boundary_alpha: Object.freeze({
    id: "boundary_alpha",
    label: "Institutional Boundary Alpha",
    category: "governance",
    summary: "Executive authority and escalation boundary",
  }),
  boundary_beta: Object.freeze({
    id: "boundary_beta",
    label: "Institutional Boundary Beta",
    category: "strategic",
    summary: "Strategic direction and objective boundary",
  }),
});

export const APPROVAL_REQUIREMENT_REGISTRY: Readonly<
  Record<ApprovalRequirementId, ApprovalRequirementEntry>
> = Object.freeze({
  approval_alpha: Object.freeze({
    id: "approval_alpha",
    label: "Executive Approval Alpha",
    authority: "Executive",
    summary: "Formal executive approval before commitment",
  }),
  approval_beta: Object.freeze({
    id: "approval_beta",
    label: "Governance Review Beta",
    authority: "Governance Review",
    summary: "Institutional governance review before proceeding",
  }),
});

export function listPolicies(): readonly PolicyEntry[] {
  return Object.freeze(Object.values(POLICY_REGISTRY));
}

export function listConstraints(): readonly ConstraintEntry[] {
  return Object.freeze(Object.values(CONSTRAINT_REGISTRY));
}

export function listBoundaries(): readonly BoundaryEntry[] {
  return Object.freeze(Object.values(BOUNDARY_REGISTRY));
}

export function listApprovalRequirements(): readonly ApprovalRequirementEntry[] {
  return Object.freeze(Object.values(APPROVAL_REQUIREMENT_REGISTRY));
}
