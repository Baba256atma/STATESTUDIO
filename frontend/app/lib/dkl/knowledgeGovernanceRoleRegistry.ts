/**
 * DKL-8:2 — Knowledge Governance Role and Capability Registries.
 *
 * Registers eight foundation roles and declarative governance capabilities.
 * No user assignment. No enforcement capabilities.
 *
 * Ownership: owned exclusively by DKL-8:2.
 */

import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import type {
  KnowledgeGovernanceCapabilityRegistration,
  KnowledgeGovernanceRoleRegistration,
} from "./knowledgeGovernanceRegistryTypes.ts";

const foundation = KnowledgeGovernanceFoundationPlatform;

const ROLE_PROHIBITIONS = Object.freeze({
  Owner: Object.freeze([
    "Runtime authorization",
    "Policy execution",
    "User identity management",
  ]),
  Steward: Object.freeze([
    "Repository mutation",
    "Authorization enforcement",
    "Workflow execution",
  ]),
  Custodian: Object.freeze([
    "Governance ownership accountability",
    "Policy authority",
    "Executive decision-making",
  ]),
  Producer: Object.freeze([
    "Authorization enforcement",
    "Audit logging runtime",
    "Policy execution",
  ]),
  Consumer: Object.freeze([
    "Ownership assignment",
    "Policy authority",
    "Disposition execution",
  ]),
  Approver: Object.freeze([
    "Automatic approval workflows",
    "Notification systems",
    "Task orchestration",
  ]),
  Auditor: Object.freeze([
    "Audit event storage",
    "Compliance scoring",
    "Legal interpretation",
  ]),
  PolicyAuthority: Object.freeze([
    "Policy engine execution",
    "RBAC runtime",
    "ABAC runtime",
  ]),
} as const);

const role = (
  foundationRole: (typeof foundation.roles)[number],
): KnowledgeGovernanceRoleRegistration =>
  Object.freeze({
    id: `DKL-8:2/Role/${foundationRole.roleKind}`,
    name: foundationRole.roleKind,
    description: foundationRole.description,
    category: "role" as const,
    status: "Registered" as const,
    owner: "DKL-8" as const,
    sourcePhase: "DKL-8:1" as const,
    version: "1.0.0" as const,
    stability: "FoundationAligned" as const,
    public: true as const,
    deprecated: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder: foundationRole.deterministicOrder,
    roleKind: foundationRole.roleKind,
    accountability: foundationRole.accountability,
    prohibitedResponsibilities:
      ROLE_PROHIBITIONS[
        foundationRole.roleKind as keyof typeof ROLE_PROHIBITIONS
      ],
    assignmentStatus: "Unassigned" as const,
    assignsUsers: false as const,
    assignsOrganizations: false as const,
  });

/** Exactly eight governance role registrations. */
export const KnowledgeGovernanceRoleRegistry: readonly KnowledgeGovernanceRoleRegistration[] =
  Object.freeze(foundation.roles.map(role));

const capability = (
  capabilityKey: string,
  name: string,
  description: string,
  order: number,
): KnowledgeGovernanceCapabilityRegistration =>
  Object.freeze({
    id: `DKL-8:2/Capability/${capabilityKey}`,
    name,
    description,
    category: "capability" as const,
    status: "Registered" as const,
    owner: "DKL-8" as const,
    sourcePhase: "DKL-8:2" as const,
    version: "1.0.0" as const,
    stability: "Stable" as const,
    public: true as const,
    deprecated: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder: order,
    capabilityKey,
    declarativeOnly: true as const,
    enforcesPolicy: false as const,
    authorizesUsers: false as const,
  });

/** Eighteen declarative governance capabilities. No enforcement capabilities. */
export const KnowledgeGovernanceCapabilityRegistry: readonly KnowledgeGovernanceCapabilityRegistration[] =
  Object.freeze([
    capability(
      "DeclareGovernanceSubject",
      "Declare Governance Subject",
      "Declare a supported governance subject type.",
      1,
    ),
    capability(
      "DescribeGovernanceOwnership",
      "Describe Governance Ownership",
      "Describe ownership semantics for governed knowledge.",
      2,
    ),
    capability(
      "DescribeGovernanceStewardship",
      "Describe Governance Stewardship",
      "Describe stewardship semantics for governed knowledge.",
      3,
    ),
    capability(
      "ClassifyKnowledge",
      "Classify Knowledge",
      "Declare classification metadata for governed knowledge.",
      4,
    ),
    capability(
      "DescribeKnowledgeSensitivity",
      "Describe Knowledge Sensitivity",
      "Declare sensitivity dimensions for governed knowledge.",
      5,
    ),
    capability(
      "DescribeAccessIntent",
      "Describe Access Intent",
      "Declare access intent metadata without enforcement.",
      6,
    ),
    capability(
      "DescribeUsagePolicy",
      "Describe Usage Policy",
      "Declare usage policy applicability without execution.",
      7,
    ),
    capability(
      "DescribeRetentionIntent",
      "Describe Retention Intent",
      "Declare retention intent without scheduling deletion.",
      8,
    ),
    capability(
      "DescribeDispositionIntent",
      "Describe Disposition Intent",
      "Declare disposition intent without repository mutation.",
      9,
    ),
    capability(
      "DescribeAuditIntent",
      "Describe Audit Intent",
      "Declare audit intent without audit storage.",
      10,
    ),
    capability(
      "DescribeComplianceIntent",
      "Describe Compliance Intent",
      "Declare compliance intent without legal evaluation.",
      11,
    ),
    capability(
      "DescribeLifecycleGovernance",
      "Describe Lifecycle Governance",
      "Declare lifecycle governance states and transitions.",
      12,
    ),
    capability(
      "ReferenceGovernanceEvidence",
      "Reference Governance Evidence",
      "Reference governance evidence without embedding objects.",
      13,
    ),
    capability(
      "DescribeGovernanceException",
      "Describe Governance Exception",
      "Describe exception categories without approval workflows.",
      14,
    ),
    capability(
      "ReferenceGovernanceDecision",
      "Reference Governance Decision",
      "Reference governance decisions without decision-making.",
      15,
    ),
    capability(
      "DescribePolicyApplicability",
      "Describe Policy Applicability",
      "Declare which policies apply to a governed subject.",
      16,
    ),
    capability(
      "DescribeGovernanceBoundary",
      "Describe Governance Boundary",
      "Declare governance ownership and prohibited surfaces.",
      17,
    ),
    capability(
      "ExposeGovernanceMetadata",
      "Expose Governance Metadata",
      "Expose immutable governance registry metadata.",
      18,
    ),
  ]);
