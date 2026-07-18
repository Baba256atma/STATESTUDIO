/**
 * DKL-8:3 — Knowledge Governance Composite Models.
 *
 * Profile, snapshot, record, relationship, finding, issue, conflict,
 * ambiguity, result, and references structural definitions.
 * Composition by reference. No evaluation or validation.
 *
 * Ownership: owned exclusively by DKL-8:3.
 */

import type {
  KnowledgeGovernanceModelKindDescriptor,
  KnowledgeGovernanceRelationshipKind,
  KnowledgeGovernanceRelationshipKindDescriptor,
} from "./knowledgeGovernanceModelTypes.ts";

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

const relationship = (
  relationshipKind: KnowledgeGovernanceRelationshipKind,
  description: string,
  order: number,
  direction: "Directed" | "Bidirectional" = "Directed",
): KnowledgeGovernanceRelationshipKindDescriptor =>
  Object.freeze({
    relationshipKindId: `DKL-8:3/RelationshipKind/${relationshipKind}`,
    relationshipKind,
    description,
    direction,
    runtimeBehavior: "None" as const,
    traversableAtRuntime: false as const,
    deterministicOrder: order,
  });

/** Composite model kind descriptors. */
export const KnowledgeGovernanceCompositeModelKinds: readonly KnowledgeGovernanceModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "GovernanceProfile",
      "Composite governance profile composing canonical component references.",
      Object.freeze([
        "subject",
        "scope",
        "ownership",
        "stewardship",
        "classification",
        "sensitivities",
        "accessIntents",
        "usagePolicies",
        "retentionIntents",
        "dispositionIntents",
        "auditIntents",
        "complianceIntents",
        "policyApplicability",
        "lifecycle",
        "evidence",
        "exceptions",
        "decisionReferences",
        "boundaries",
      ]),
      22,
    ),
    descriptor(
      "GovernanceSnapshot",
      "Point-in-model snapshot without system-generated time.",
      Object.freeze([
        "snapshotId",
        "governanceProfileReference",
        "subjectReference",
        "modelVersion",
        "lifecycleState",
        "componentReferences",
        "previousSnapshotReference",
        "evidenceReferences",
        "status",
      ]),
      23,
    ),
    descriptor(
      "GovernanceRecord",
      "Complete governance model instance — not a persistence entity.",
      Object.freeze([
        "recordId",
        "recordVersion",
        "subjectReference",
        "governanceProfile",
        "snapshotReference",
        "relationships",
        "references",
        "status",
      ]),
      24,
    ),
    descriptor(
      "GovernanceRelationship",
      "Typed relationship between governance model components.",
      Object.freeze([
        "sourceReference",
        "targetReference",
        "relationshipKind",
        "direction",
        "status",
        "evidenceReferences",
      ]),
      25,
    ),
    descriptor(
      "GovernanceFinding",
      "Structural finding envelope for later validation — not generated here.",
      Object.freeze([
        "findingId",
        "findingType",
        "subjectReference",
        "modelReference",
        "severity",
        "message",
        "evidenceReferences",
        "relatedRuleReference",
        "status",
      ]),
      26,
    ),
    descriptor(
      "GovernanceIssue",
      "Structural issue envelope for later validation defects.",
      Object.freeze([
        "issueId",
        "issueCategory",
        "severity",
        "subjectReference",
        "affectedComponentReferences",
        "description",
        "evidenceReferences",
        "ruleReference",
        "status",
      ]),
      27,
    ),
    descriptor(
      "GovernanceConflict",
      "Structural conflict envelope without precedence or resolution.",
      Object.freeze([
        "conflictId",
        "conflictType",
        "leftReference",
        "rightReference",
        "subjectReference",
        "description",
        "evidenceReferences",
        "status",
      ]),
      28,
    ),
    descriptor(
      "GovernanceAmbiguity",
      "Structural ambiguity envelope without user questioning or NEA messages.",
      Object.freeze([
        "ambiguityId",
        "ambiguityType",
        "subjectReference",
        "affectedComponentReference",
        "description",
        "clarificationIntent",
        "evidenceReferences",
        "status",
      ]),
      29,
    ),
    descriptor(
      "GovernanceModelResult",
      "Result envelope for future construction and validation — structural only.",
      Object.freeze([
        "resultId",
        "subjectReference",
        "governanceRecordReference",
        "profileReference",
        "snapshotReference",
        "findingReferences",
        "issueReferences",
        "conflictReferences",
        "ambiguityReferences",
        "evidenceReferences",
        "modelStatus",
        "readiness",
      ]),
      30,
    ),
    descriptor(
      "GovernanceModelReferences",
      "Typed reference collections without embedding related components.",
      Object.freeze([
        "subjectReferences",
        "roleReferences",
        "policyReferences",
        "evidenceReferences",
        "decisionReferences",
        "exceptionReferences",
        "boundaryReferences",
        "profileReferences",
        "snapshotReferences",
        "recordReferences",
        "relationshipReferences",
        "findingReferences",
        "issueReferences",
        "conflictReferences",
        "ambiguityReferences",
      ]),
      31,
    ),
  ]);

/** Closed canonical relationship kind vocabulary. */
export const KnowledgeGovernanceRelationshipKinds: readonly KnowledgeGovernanceRelationshipKindDescriptor[] =
  Object.freeze([
    relationship("Governs", "Source governs target.", 1),
    relationship("OwnedBy", "Source is owned by target.", 2),
    relationship("StewardedBy", "Source is stewarded by target.", 3),
    relationship("ClassifiedAs", "Source is classified as target.", 4),
    relationship("SensitiveAs", "Source carries sensitivity target.", 5),
    relationship("SubjectToPolicy", "Source is subject to policy target.", 6),
    relationship("PermitsIntent", "Source permits intent target.", 7),
    relationship("RestrictsIntent", "Source restricts intent target.", 8),
    relationship("RetainedBy", "Source is retained by intent target.", 9),
    relationship("DisposedBy", "Source is disposed by intent target.", 10),
    relationship("AuditedBy", "Source is audited by intent target.", 11),
    relationship(
      "SubjectToCompliance",
      "Source is subject to compliance target.",
      12,
    ),
    relationship(
      "SupportedByEvidence",
      "Source is supported by evidence target.",
      13,
    ),
    relationship("GrantedException", "Source is granted exception target.", 14),
    relationship("Supersedes", "Source supersedes target.", 15),
    relationship("DerivedFrom", "Source is derived from target.", 16),
    relationship("AppliesToScope", "Source applies to scope target.", 17),
    relationship(
      "ReferencesDecision",
      "Source references decision target.",
      18,
    ),
    relationship("BoundedBy", "Source is bounded by boundary target.", 19),
  ]);

/** Composite composition and prohibition anchors. */
export const KnowledgeGovernanceCompositeAnchors = Object.freeze({
  profileComposesByReference: true as const,
  profileDuplicatesRegistryEntries: false as const,
  profileEvaluatesCompleteness: false as const,
  snapshotUsesSystemTime: false as const,
  snapshotPersists: false as const,
  snapshotReconstructsDkl6: false as const,
  recordIsPersistenceEntity: false as const,
  recordIsOrmModel: false as const,
  relationshipTraversalEngine: false as const,
  generatesFindings: false as const,
  detectsIssues: false as const,
  resolvesConflicts: false as const,
  selectsWinners: false as const,
  asksUserQuestions: false as const,
  createsNeaMessages: false as const,
  runsValidation: false as const,
  calculatesReadinessDynamically: false as const,
  metadataOnly: true as const,
});
