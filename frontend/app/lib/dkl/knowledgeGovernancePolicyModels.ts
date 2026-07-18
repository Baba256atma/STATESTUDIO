/**
 * DKL-8:3 — Knowledge Governance Policy Models.
 *
 * Access, usage, retention, disposition, audit, compliance, and policy
 * applicability structural model definitions. Metadata only.
 *
 * Ownership: owned exclusively by DKL-8:3.
 */

import { KnowledgeGovernanceRegistryPlatform } from "./knowledgeGovernanceRegistry.ts";
import type { KnowledgeGovernanceModelKindDescriptor } from "./knowledgeGovernanceModelTypes.ts";

const registry = KnowledgeGovernanceRegistryPlatform;

const descriptor = (
  modelKind: KnowledgeGovernanceModelKindDescriptor["modelKind"],
  description: string,
  fields: readonly string[],
  order: number,
): KnowledgeGovernanceModelKindDescriptor =>
  Object.freeze({
    modelKindId: `DKL-8:3/ModelKind/${modelKind}`,
    modelKind,
    description,
    fields: Object.freeze([...fields]),
    sourcePhase: "DKL-8:3" as const,
    registryAligned: true as const,
    runtimeBehavior: "None" as const,
    generatesFindings: false as const,
    evaluatesGovernance: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Policy and intent assignment model kind descriptors. */
export const KnowledgeGovernancePolicyModelKinds: readonly KnowledgeGovernanceModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "AccessIntentAssignment",
      "Descriptive access intent assignment — not authorization.",
      Object.freeze([
        "accessIntent",
        "subjectReference",
        "scope",
        "requestingRoleReference",
        "targetRoleReference",
        "policyReferences",
        "constraints",
        "evidenceReferences",
        "status",
      ]),
      9,
    ),
    descriptor(
      "UsagePolicyAssignment",
      "Usage policy applicability without policy execution.",
      Object.freeze([
        "policyReference",
        "subjectReference",
        "scope",
        "permittedUsageIntent",
        "restrictedUsageIntent",
        "obligations",
        "evidenceReferences",
        "decisionReferences",
        "status",
      ]),
      10,
    ),
    descriptor(
      "RetentionIntentAssignment",
      "Retention intent without timers, schedulers, or deletion.",
      Object.freeze([
        "retentionIntent",
        "subjectReference",
        "scope",
        "durationDescriptor",
        "triggerReference",
        "reviewIntent",
        "policyReference",
        "evidenceReferences",
        "status",
      ]),
      11,
    ),
    descriptor(
      "DispositionIntentAssignment",
      "Disposition intent without repository mutation.",
      Object.freeze([
        "dispositionIntent",
        "subjectReference",
        "scope",
        "triggerReference",
        "preconditions",
        "policyReference",
        "approvalIntent",
        "evidenceReferences",
        "status",
      ]),
      12,
    ),
    descriptor(
      "AuditIntentAssignment",
      "Audit intent without logging or event storage.",
      Object.freeze([
        "auditIntent",
        "subjectReference",
        "scope",
        "auditorRoleReference",
        "requiredEvidenceKinds",
        "reviewFrequencyDescriptor",
        "policyReferences",
        "status",
      ]),
      13,
    ),
    descriptor(
      "ComplianceIntentAssignment",
      "Compliance intent without legal evaluation or control execution.",
      Object.freeze([
        "complianceIntent",
        "subjectReference",
        "scope",
        "controlReferences",
        "authorityReferences",
        "requiredEvidenceKinds",
        "exceptionReferences",
        "status",
      ]),
      14,
    ),
    descriptor(
      "PolicyApplicability",
      "Policy applicability without precedence resolution.",
      Object.freeze([
        "applicabilityId",
        "policyReference",
        "subjectReference",
        "scope",
        "priority",
        "inheritanceIntent",
        "overrideIntent",
        "effectiveLifecycleState",
        "evidenceReferences",
        "status",
      ]),
      15,
    ),
  ]);

/** Registry vocabulary anchors used by policy models. */
export const KnowledgeGovernancePolicyRegistryAnchors = Object.freeze({
  accessIntentIds: Object.freeze(registry.accessIntents.map((item) => item.id)),
  usagePolicyIds: Object.freeze(registry.usagePolicies.map((item) => item.id)),
  retentionIntentIds: Object.freeze(
    registry.retentionIntents.map((item) => item.id),
  ),
  dispositionIntentIds: Object.freeze(
    registry.dispositionIntents.map((item) => item.id),
  ),
  auditIntentIds: Object.freeze(registry.auditIntents.map((item) => item.id)),
  complianceIntentIds: Object.freeze(
    registry.complianceIntents.map((item) => item.id),
  ),
  policyReferenceKindIds: Object.freeze(
    registry.policyReferenceKinds.map((item) => item.id),
  ),
  returnsAuthorizationOutcomes: false as const,
  schedulesRetention: false as const,
  executesDisposition: false as const,
  implementsAuditLogging: false as const,
  evaluatesCompliance: false as const,
  resolvesPolicyPrecedence: false as const,
  metadataOnly: true as const,
});
