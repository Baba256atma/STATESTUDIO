/**
 * DKL-6:3 — Knowledge Repository Model Types.
 *
 * Readonly contracts for canonical Knowledge Repository logical models.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:3.
 */

export type RepositoryLifecycleState =
  | "Created"
  | "Validated"
  | "Stored"
  | "Versioned"
  | "Retrieved"
  | "Archived"
  | "Frozen";

export type ArchiveStateName =
  | "Active"
  | "PendingArchive"
  | "Archived"
  | "RestorationPending"
  | "Restored"
  | "PermanentlyRetained"
  | "Frozen";

export type ModelRelationshipDirection =
  | "Forward"
  | "Bidirectional"
  | "Containment";

/** Logical repository identity — metadata only. */
export type KnowledgeRepositoryIdentityModel = Readonly<{
  repositoryId: string;
  repositoryType: string;
  namespace: string;
  owner: "DKL-6";
  status: string;
  createdFrom: string;
}>;

/** Shared base repository record contract — logical references only. */
export type KnowledgeRepositoryRecordModel = Readonly<{
  recordId: string;
  recordType: string;
  repositoryType: string;
  knowledgeIdentity: string;
  sourceReference: string;
  ownerReference: string;
  versionReference: string;
  status: string;
  metadataReference: string;
}>;

export type KnowledgeObjectRecordModel = KnowledgeRepositoryRecordModel &
  Readonly<{
    knowledgeObjectTypeReference: string;
    knowledgeDomainReference: string;
    relationshipReferences: readonly string[];
    evidenceReferences: readonly string[];
    validationReference: string;
  }>;

export type BusinessObjectRecordModel = KnowledgeRepositoryRecordModel &
  Readonly<{
    businessObjectTypeReference: string;
    businessIdentityReference: string;
    relationshipReferences: readonly string[];
    sourceReferences: readonly string[];
    validationReference: string;
  }>;

export type RelationshipRecordModel = Readonly<{
  relationshipIdentity: string;
  sourceRecordReference: string;
  targetRecordReference: string;
  relationshipType: string;
  direction: string;
  status: string;
  evidenceReference: string;
  versionReference: string;
}>;

export type EvidenceRecordModel = Readonly<{
  evidenceIdentity: string;
  evidenceType: string;
  sourceReference: string;
  subjectReference: string;
  validationStatus: string;
  confidenceReference: string;
  versionReference: string;
  metadataReference: string;
}>;

export type ValidationRecordModel = Readonly<{
  validationIdentity: string;
  subjectReference: string;
  validationStatus: string;
  ruleReferences: readonly string[];
  evidenceReferences: readonly string[];
  issueReferences: readonly string[];
  certificationReference: string;
  versionReference: string;
}>;

export type DecisionContextRecordModel = Readonly<{
  contextIdentity: string;
  decisionReference: string;
  relatedKnowledgeReferences: readonly string[];
  evidenceReferences: readonly string[];
  snapshotReference: string;
  versionReference: string;
  status: string;
}>;

export type RepositoryMetadataRecordModel = Readonly<{
  metadataIdentity: string;
  subjectReference: string;
  metadataType: string;
  sourceReference: string;
  ownershipReference: string;
  lifecycleState: string;
  versionReference: string;
  status: string;
}>;

export type RepositoryVersionModelBase = Readonly<{
  versionId: string;
  versionType: string;
  subjectReference: string;
  previousVersionReference: string | null;
  nextVersionReference: string | null;
  reason: string;
  status: string;
  lifecycleState: string;
  metadataReference: string;
}>;

export type RepositorySnapshotModelBase = Readonly<{
  snapshotId: string;
  snapshotType: string;
  repositoryReference: string;
  subjectReferences: readonly string[];
  versionReferences: readonly string[];
  contextReference: string;
  lifecycleState: string;
  status: string;
  metadataReference: string;
}>;

export type RepositoryHistoryEventModelBase = Readonly<{
  eventId: string;
  eventType: string;
  subjectReference: string;
  repositoryReference: string;
  versionReference: string;
  lifecycleState: string;
  status: string;
  metadataReference: string;
}>;

export type RepositoryArchiveModel = Readonly<{
  archiveId: string;
  subjectReference: string;
  archiveState: ArchiveStateName;
  versionReference: string;
  retentionPolicyReference: string;
  previousState: ArchiveStateName | null;
  nextState: ArchiveStateName | null;
  status: string;
  metadataReference: string;
}>;

export type RepositoryRetentionPolicyModel = Readonly<{
  policyId: string;
  policyType: string;
  subjectType: string;
  retentionClass: string;
  disposition: string;
  status: string;
  metadataReference: string;
}>;

export type RepositoryIndexDeclarationModel = Readonly<{
  indexId: string;
  indexType: string;
  subjectType: string;
  indexedFieldReference: string;
  uniqueness: string;
  status: string;
  metadataReference: string;
}>;

export type RepositoryRetrievalDeclarationModel = Readonly<{
  retrievalId: string;
  retrievalType: string;
  subjectType: string;
  inputReference: string;
  resultReference: string;
  status: string;
  metadataReference: string;
}>;

/** Canonical model category descriptor — declaration metadata only. */
export type KnowledgeRepositoryModelDescriptor = Readonly<{
  modelId: string;
  modelName: string;
  modelCategory: string;
  description: string;
  registryGroup: string;
  registryEntryReference: string;
  owner: "DKL-6";
  status: "Modeled";
  metadataOnly: true;
  runtimeBehavior: "None";
  fields: readonly string[];
  deterministicOrder: number;
}>;

export type KnowledgeRepositoryModelRelationship = Readonly<{
  id: string;
  sourceModel: string;
  targetModel: string;
  relationshipType: string;
  direction: ModelRelationshipDirection;
  owner: "DKL-6";
  status: "Modeled";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

export type RegistryTraceabilityEntry = Readonly<{
  group: string;
  registrySection: string;
  entryCount: number;
  modeled: true;
  deterministicOrder: number;
}>;

export interface KnowledgeRepositoryModelIdentityDescriptor {
  readonly modelId: "DKL-6:3/KnowledgeRepositoryModel";
  readonly modelName: "Knowledge Repository Model";
  readonly modelVersion: string;
  readonly modelNamespace: "nexora.dkl.repository.model";
  readonly phase: "DKL-6:3";
  readonly owner: "DKL-6";
  readonly status: "Modeled";
  readonly readiness: "ReadyForDKL6Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryModelSummaryDescriptor {
  readonly modelId: "DKL-6:3/KnowledgeRepositoryModel";
  readonly version: string;
  readonly name: "Knowledge Repository Model";
  readonly namespace: "nexora.dkl.repository.model";
  readonly status: "Modeled";
  readonly foundationDependencyId: string;
  readonly registryDependencyId: string;
  readonly repositoryAggregateCount: number;
  readonly recordModelCount: number;
  readonly versionModelCount: number;
  readonly snapshotModelCount: number;
  readonly historyModelCount: number;
  readonly archiveModelCount: number;
  readonly retentionModelCount: number;
  readonly indexModelCount: number;
  readonly retrievalModelCount: number;
  readonly relationshipCount: number;
  readonly lifecycleCount: number;
  readonly registryTraceabilityCount: number;
  readonly totalModelCount: number;
  readonly readiness: "ReadyForDKL6Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
