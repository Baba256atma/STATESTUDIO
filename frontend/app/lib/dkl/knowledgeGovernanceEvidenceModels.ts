/**
 * DKL-8:3 — Knowledge Governance Evidence Models.
 *
 * Evidence, decision, exception, and boundary structural definitions.
 * References only. No workflows or embedded documents.
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

/** Evidence, decision, exception, and boundary model kind descriptors. */
export const KnowledgeGovernanceEvidenceModelKinds: readonly KnowledgeGovernanceModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "GovernanceEvidenceReference",
      "Evidence reference to one registered evidence kind — no embedded documents.",
      Object.freeze([
        "evidenceId",
        "evidenceKind",
        "reference",
        "sourceReference",
        "versionReference",
        "description",
        "relevance",
        "status",
      ]),
      18,
    ),
    descriptor(
      "GovernanceDecisionReference",
      "Decision reference without Executive Engine decision reconstruction.",
      Object.freeze([
        "decisionReferenceId",
        "decisionReferenceKind",
        "reference",
        "decisionAuthorityRole",
        "scope",
        "evidenceReferences",
        "status",
      ]),
      19,
    ),
    descriptor(
      "GovernanceException",
      "Exception structure using a registered exception category — no workflows.",
      Object.freeze([
        "exceptionId",
        "exceptionCategory",
        "affectedSubjectReference",
        "affectedPolicyReference",
        "scope",
        "reason",
        "requestingRoleReference",
        "approvingRoleReference",
        "validityDescriptor",
        "evidenceReferences",
        "decisionReferences",
        "reviewIntent",
        "lifecycleState",
        "status",
      ]),
      20,
    ),
    descriptor(
      "GovernanceBoundaryReference",
      "Boundary reference preserving anti-duplication without external dependencies.",
      Object.freeze([
        "boundaryReference",
        "affectedModelKind",
        "externalOwner",
        "restriction",
        "reason",
        "status",
      ]),
      21,
    ),
  ]);

/** Registry anchors for evidence-family models. */
export const KnowledgeGovernanceEvidenceRegistryAnchors = Object.freeze({
  evidenceKindIds: Object.freeze(registry.evidenceKinds.map((item) => item.id)),
  decisionReferenceKindIds: Object.freeze(
    registry.decisionReferenceKinds.map((item) => item.id),
  ),
  exceptionCategoryIds: Object.freeze(
    registry.exceptionCategories.map((item) => item.id),
  ),
  boundaryIds: Object.freeze(
    registry.boundaries.ownershipBoundaries.map((item) => item.id),
  ),
  embedsDocuments: false as const,
  reconstructsEngineDecisions: false as const,
  submitsExceptions: false as const,
  approvesExceptions: false as const,
  calculatesValidity: false as const,
  createsExternalDependencies: false as const,
  metadataOnly: true as const,
});
