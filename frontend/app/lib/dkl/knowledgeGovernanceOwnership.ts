/**
 * DKL-8:1 — Knowledge Governance Ownership.
 *
 * Ownership, non-ownership, and governance role separation.
 * Roles are declared only — no real users or organizations assigned.
 *
 * Ownership: owned exclusively by DKL-8:1.
 */

import type { KnowledgeGovernanceRole } from "./knowledgeGovernanceFoundationTypes.ts";

export const KNOWLEDGE_GOVERNANCE_OWNS = Object.freeze([
  "Governance vocabulary",
  "Governance foundation contracts",
  "Ownership semantics",
  "Stewardship semantics",
  "Classification semantics",
  "Sensitivity semantics",
  "Access intent semantics",
  "Retention intent semantics",
  "Disposition intent semantics",
  "Audit intent semantics",
  "Compliance intent semantics",
  "Governance lifecycle declarations",
  "Governance evidence references",
  "Governance exception contracts",
  "Governance boundaries",
] as const);

export const KNOWLEDGE_GOVERNANCE_DOES_NOT_OWN = Object.freeze([
  "Channel communication",
  "Authentication",
  "Authorization enforcement",
  "Identity provider integration",
  "Database access",
  "Repository persistence",
  "Knowledge retrieval",
  "Knowledge search",
  "Knowledge graph traversal",
  "Knowledge interpretation",
  "Knowledge validation",
  "Business Object construction",
  "Executive reasoning",
  "Decision-making",
  "Recommendations",
  "Workflow execution",
  "Task creation",
  "Notifications",
  "UI rendering",
  "Scene rendering",
  "Advisor responses",
  "External API transport",
  "Legal interpretation",
  "Runtime compliance evaluation",
  "Runtime audit logging",
  "Policy execution",
] as const);

const role = (
  roleKind: KnowledgeGovernanceRole["roleKind"],
  description: string,
  accountability: string,
  order: number,
): KnowledgeGovernanceRole =>
  Object.freeze({
    roleId: `DKL-8:1/Role/${roleKind}`,
    roleKind,
    description,
    accountability,
    assignsUsers: false as const,
    assignsOrganizations: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Eight distinct governance roles — no user assignment. */
export const KnowledgeGovernanceRoles: readonly KnowledgeGovernanceRole[] =
  Object.freeze([
    role(
      "Owner",
      "Accountable party for governed knowledge.",
      "Accountable for the governed knowledge.",
      1,
    ),
    role(
      "Steward",
      "Maintains governance quality and policy alignment.",
      "Maintains governance quality and policy alignment.",
      2,
    ),
    role(
      "Custodian",
      "Operates storage or technical handling.",
      "Operates storage or technical handling of governed knowledge.",
      3,
    ),
    role(
      "Producer",
      "Originates or contributes knowledge.",
      "Originates or contributes governed knowledge.",
      4,
    ),
    role(
      "Consumer",
      "Uses governed knowledge.",
      "Uses governed knowledge within declared access intent.",
      5,
    ),
    role(
      "Approver",
      "Authorizes specific governance actions.",
      "Authorizes specific governance actions when required by policy.",
      6,
    ),
    role(
      "Auditor",
      "Reviews governance evidence.",
      "Reviews governance evidence and audit intent.",
      7,
    ),
    role(
      "PolicyAuthority",
      "Owns the governing policy.",
      "Owns the governing policy applicable to knowledge subjects.",
      8,
    ),
  ]);

/** Canonical immutable ownership declarations. */
export const KnowledgeGovernanceOwnership = Object.freeze({
  ownershipId: "DKL-8:1/KnowledgeGovernanceOwnership",
  owner: "DKL-8 Knowledge Governance Foundation",
  sourcePhase: "DKL-8:1" as const,
  owns: KNOWLEDGE_GOVERNANCE_OWNS,
  doesNotOwn: KNOWLEDGE_GOVERNANCE_DOES_NOT_OWN,
  ownsCount: KNOWLEDGE_GOVERNANCE_OWNS.length,
  doesNotOwnCount: KNOWLEDGE_GOVERNANCE_DOES_NOT_OWN.length,
  roles: KnowledgeGovernanceRoles,
  roleCount: KnowledgeGovernanceRoles.length,
  ownerAccountable: true as const,
  stewardMaintainsQuality: true as const,
  custodianOperatesStorage: true as const,
  producerOriginates: true as const,
  consumerUses: true as const,
  approverAuthorizes: true as const,
  auditorReviewsEvidence: true as const,
  policyAuthorityOwnsPolicy: true as const,
  assignsRealUsers: false as const,
  assignsOrganizations: false as const,
  separationNote:
    "DKL-8:1 declares governance ownership and role semantics; it does not assign users, enforce authorization, execute policy, or persist knowledge.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
