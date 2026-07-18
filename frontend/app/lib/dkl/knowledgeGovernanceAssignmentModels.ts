/**
 * DKL-8:3 — Knowledge Governance Assignment Models.
 *
 * Subject, scope, actor-role, ownership, stewardship, classification, and
 * sensitivity structural model definitions. Registry-aligned. Metadata only.
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

/** Assignment-oriented model kind descriptors. */
export const KnowledgeGovernanceAssignmentModelKinds: readonly KnowledgeGovernanceModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "GovernanceIdentity",
      "Canonical identity for a governance model structure.",
      Object.freeze([
        "id",
        "version",
        "kind",
        "namespace",
        "sourcePhase",
        "status",
      ]),
      1,
    ),
    descriptor(
      "GovernanceSubjectReference",
      "Reference to a governed subject without embedding upstream objects.",
      Object.freeze([
        "subjectId",
        "subjectType",
        "subjectReference",
        "subjectVersionReference",
        "subjectSnapshotReference",
        "sourceReference",
      ]),
      2,
    ),
    descriptor(
      "GovernanceScope",
      "Declarative scope where a governance declaration applies.",
      Object.freeze([
        "scopeType",
        "scopeReference",
        "includedSubjectReferences",
        "excludedSubjectReferences",
        "parentScopeReference",
        "inheritanceIntent",
      ]),
      3,
    ),
    descriptor(
      "GovernanceActorRoleReference",
      "Actor-role reference without identity resolution or authentication.",
      Object.freeze([
        "role",
        "actorReference",
        "actorType",
        "assignmentReference",
        "authorityReference",
      ]),
      4,
    ),
    descriptor(
      "OwnershipAssignment",
      "Descriptive ownership assignment — no automatic user assignment.",
      Object.freeze([
        "assignmentId",
        "subjectReference",
        "ownerRole",
        "ownerActorReference",
        "scope",
        "policyReference",
        "effectiveState",
        "evidenceReferences",
        "decisionReferences",
        "status",
      ]),
      5,
    ),
    descriptor(
      "StewardshipAssignment",
      "Stewardship assignment independent from ownership.",
      Object.freeze([
        "stewardRole",
        "stewardActorReference",
        "responsibilityScope",
        "reviewIntent",
        "evidenceReferences",
        "status",
      ]),
      6,
    ),
    descriptor(
      "ClassificationAssignment",
      "Assigns exactly one registered classification to a subject or scope.",
      Object.freeze([
        "classification",
        "subjectReference",
        "scope",
        "assignedByRole",
        "policyReference",
        "evidenceReferences",
        "decisionReferences",
        "lifecycleState",
        "status",
      ]),
      7,
    ),
    descriptor(
      "SensitivityAssignment",
      "Attaches multiple unique registered sensitivity dimensions.",
      Object.freeze([
        "sensitivities",
        "subjectReference",
        "scope",
        "policyReferences",
        "evidenceReferences",
        "decisionReferences",
        "status",
      ]),
      8,
    ),
  ]);

/** Registry vocabulary anchors used by assignment models. */
export const KnowledgeGovernanceAssignmentRegistryAnchors = Object.freeze({
  subjectIds: Object.freeze(registry.subjects.map((item) => item.id)),
  roleIds: Object.freeze(registry.roles.map((item) => item.id)),
  classificationIds: Object.freeze(
    registry.classifications.map((item) => item.id),
  ),
  sensitivityIds: Object.freeze(registry.sensitivities.map((item) => item.id)),
  ownerRoleId: "DKL-8:2/Role/Owner" as const,
  stewardRoleId: "DKL-8:2/Role/Steward" as const,
  classificationCardinality: "ExactlyOne" as const,
  sensitivityCardinality: "ZeroOrMoreUnique" as const,
  embedsUpstreamObjects: false as const,
  resolvesScopeInheritance: false as const,
  assignsUsers: false as const,
  authenticatesActors: false as const,
  calculatesClassification: false as const,
  calculatesSensitivity: false as const,
  metadataOnly: true as const,
});
