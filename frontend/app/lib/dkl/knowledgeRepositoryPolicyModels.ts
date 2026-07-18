/**
 * DKL-6:3 — Knowledge Repository Policy Models.
 *
 * Retention, index, retrieval declaration models, and model relationships.
 * Declarations only — no execution, scheduling, or query behavior.
 *
 * Ownership: owned exclusively by DKL-6:3.
 */

import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type {
  KnowledgeRepositoryModelDescriptor,
  KnowledgeRepositoryModelRelationship,
} from "./knowledgeRepositoryModelTypes.ts";

const RETENTION_FIELDS = Object.freeze([
  "policyId",
  "policyType",
  "subjectType",
  "retentionClass",
  "disposition",
  "status",
  "metadataReference",
] as const);

const INDEX_FIELDS = Object.freeze([
  "indexId",
  "indexType",
  "subjectType",
  "indexedFieldReference",
  "uniqueness",
  "status",
  "metadataReference",
] as const);

const RETRIEVAL_FIELDS = Object.freeze([
  "retrievalId",
  "retrievalType",
  "subjectType",
  "inputReference",
  "resultReference",
  "status",
  "metadataReference",
] as const);

const retentionRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.retentionPolicies.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/RetentionPolicyType/${name}`;
};

const indexRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.indexDeclarations.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/IndexDeclaration/${name}`;
};

const retrievalRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.retrievalDeclarations.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/RetrievalDeclaration/${name}`;
};

const retention = (
  modelId: string,
  modelName: string,
  policyTypeName: string,
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory: "RetentionPolicyModel",
    description,
    registryGroup: "RetentionPolicyType",
    registryEntryReference: retentionRef(policyTypeName),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: RETENTION_FIELDS,
    deterministicOrder,
  });

const indexModel = (
  modelId: string,
  modelName: string,
  indexTypeName: string,
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory: "IndexDeclarationModel",
    description,
    registryGroup: "IndexDeclarationType",
    registryEntryReference: indexRef(indexTypeName),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: INDEX_FIELDS,
    deterministicOrder,
  });

const retrieval = (
  modelId: string,
  modelName: string,
  retrievalTypeName: string,
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory: "RetrievalDeclarationModel",
    description,
    registryGroup: "RetrievalDeclarationType",
    registryEntryReference: retrievalRef(retrievalTypeName),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: RETRIEVAL_FIELDS,
    deterministicOrder,
  });

export const TemporaryRetentionModel: KnowledgeRepositoryModelDescriptor =
  retention(
    "DKL-6:3/Model/TemporaryRetention",
    "TemporaryRetentionModel",
    "TemporaryRetention",
    "Logical retention policy model for temporary retention.",
    1,
  );

export const OperationalRetentionModel: KnowledgeRepositoryModelDescriptor =
  retention(
    "DKL-6:3/Model/OperationalRetention",
    "OperationalRetentionModel",
    "OperationalRetention",
    "Logical retention policy model for operational retention.",
    2,
  );

export const HistoricalRetentionModel: KnowledgeRepositoryModelDescriptor =
  retention(
    "DKL-6:3/Model/HistoricalRetention",
    "HistoricalRetentionModel",
    "HistoricalRetention",
    "Logical retention policy model for historical retention.",
    3,
  );

export const LegalRetentionModel: KnowledgeRepositoryModelDescriptor = retention(
  "DKL-6:3/Model/LegalRetention",
  "LegalRetentionModel",
  "LegalRetention",
  "Logical retention policy model for legal retention.",
  4,
);

export const PermanentRetentionModel: KnowledgeRepositoryModelDescriptor =
  retention(
    "DKL-6:3/Model/PermanentRetention",
    "PermanentRetentionModel",
    "PermanentRetention",
    "Logical retention policy model for permanent retention.",
    5,
  );

export const FrozenRetentionModel: KnowledgeRepositoryModelDescriptor = retention(
  "DKL-6:3/Model/FrozenRetention",
  "FrozenRetentionModel",
  "FrozenRetention",
  "Logical retention policy model for frozen retention.",
  6,
);

export const KnowledgeRepositoryRetentionModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    TemporaryRetentionModel,
    OperationalRetentionModel,
    HistoricalRetentionModel,
    LegalRetentionModel,
    PermanentRetentionModel,
    FrozenRetentionModel,
  ]);

export const IdentityIndexModel: KnowledgeRepositoryModelDescriptor = indexModel(
  "DKL-6:3/Model/IdentityIndex",
  "IdentityIndexModel",
  "IdentityIndex",
  "Logical index declaration model keyed by identity.",
  1,
);

export const ObjectTypeIndexModel: KnowledgeRepositoryModelDescriptor =
  indexModel(
    "DKL-6:3/Model/ObjectTypeIndex",
    "ObjectTypeIndexModel",
    "ObjectTypeIndex",
    "Logical index declaration model keyed by object type.",
    2,
  );

export const RelationshipIndexModel: KnowledgeRepositoryModelDescriptor =
  indexModel(
    "DKL-6:3/Model/RelationshipIndex",
    "RelationshipIndexModel",
    "RelationshipIndex",
    "Logical index declaration model keyed by relationship.",
    3,
  );

export const TimeIndexModel: KnowledgeRepositoryModelDescriptor = indexModel(
  "DKL-6:3/Model/TimeIndex",
  "TimeIndexModel",
  "TimeIndex",
  "Logical index declaration model keyed by time.",
  4,
);

export const VersionIndexModel: KnowledgeRepositoryModelDescriptor = indexModel(
  "DKL-6:3/Model/VersionIndex",
  "VersionIndexModel",
  "VersionIndex",
  "Logical index declaration model keyed by version.",
  5,
);

export const SourceIndexModel: KnowledgeRepositoryModelDescriptor = indexModel(
  "DKL-6:3/Model/SourceIndex",
  "SourceIndexModel",
  "SourceIndex",
  "Logical index declaration model keyed by source.",
  6,
);

export const OwnerIndexModel: KnowledgeRepositoryModelDescriptor = indexModel(
  "DKL-6:3/Model/OwnerIndex",
  "OwnerIndexModel",
  "OwnerIndex",
  "Logical index declaration model keyed by owner.",
  7,
);

export const StatusIndexModel: KnowledgeRepositoryModelDescriptor = indexModel(
  "DKL-6:3/Model/StatusIndex",
  "StatusIndexModel",
  "StatusIndex",
  "Logical index declaration model keyed by status.",
  8,
);

export const KnowledgeRepositoryIndexModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    IdentityIndexModel,
    ObjectTypeIndexModel,
    RelationshipIndexModel,
    TimeIndexModel,
    VersionIndexModel,
    SourceIndexModel,
    OwnerIndexModel,
    StatusIndexModel,
  ]);

export const RetrieveByIdentityModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveByIdentity",
    "RetrieveByIdentityModel",
    "RetrieveByIdentity",
    "Logical retrieval declaration model for identity-based retrieval.",
    1,
  );

export const RetrieveByObjectTypeModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveByObjectType",
    "RetrieveByObjectTypeModel",
    "RetrieveByObjectType",
    "Logical retrieval declaration model for object-type retrieval.",
    2,
  );

export const RetrieveByRelationshipModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveByRelationship",
    "RetrieveByRelationshipModel",
    "RetrieveByRelationship",
    "Logical retrieval declaration model for relationship retrieval.",
    3,
  );

export const RetrieveByTimeModel: KnowledgeRepositoryModelDescriptor = retrieval(
  "DKL-6:3/Model/RetrieveByTime",
  "RetrieveByTimeModel",
  "RetrieveByTime",
  "Logical retrieval declaration model for time-based retrieval.",
  4,
);

export const RetrieveByVersionModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveByVersion",
    "RetrieveByVersionModel",
    "RetrieveByVersion",
    "Logical retrieval declaration model for version-based retrieval.",
    5,
  );

export const RetrieveBySourceModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveBySource",
    "RetrieveBySourceModel",
    "RetrieveBySource",
    "Logical retrieval declaration model for source-based retrieval.",
    6,
  );

export const RetrieveByOwnerModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveByOwner",
    "RetrieveByOwnerModel",
    "RetrieveByOwner",
    "Logical retrieval declaration model for owner-based retrieval.",
    7,
  );

export const RetrieveByStatusModel: KnowledgeRepositoryModelDescriptor =
  retrieval(
    "DKL-6:3/Model/RetrieveByStatus",
    "RetrieveByStatusModel",
    "RetrieveByStatus",
    "Logical retrieval declaration model for status-based retrieval.",
    8,
  );

export const KnowledgeRepositoryRetrievalModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    RetrieveByIdentityModel,
    RetrieveByObjectTypeModel,
    RetrieveByRelationshipModel,
    RetrieveByTimeModel,
    RetrieveByVersionModel,
    RetrieveBySourceModel,
    RetrieveByOwnerModel,
    RetrieveByStatusModel,
  ]);

const relationship = (
  id: string,
  sourceModel: string,
  targetModel: string,
  relationshipType: string,
  direction: KnowledgeRepositoryModelRelationship["direction"],
  deterministicOrder: number,
): KnowledgeRepositoryModelRelationship =>
  Object.freeze({
    id,
    sourceModel,
    targetModel,
    relationshipType,
    direction,
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

/** Exact canonical model relationship inventory. */
export const KnowledgeRepositoryModelRelationships: readonly KnowledgeRepositoryModelRelationship[] =
  Object.freeze([
    relationship(
      "DKL-6:3/Relationship/RepositoryContainsRecord",
      "KnowledgeRepositoryAggregateModel",
      "KnowledgeRepositoryRecordModel",
      "RepositoryContainsRecord",
      "Containment",
      1,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordHasVersion",
      "KnowledgeRepositoryRecordModel",
      "InitialVersionModel",
      "RecordHasVersion",
      "Forward",
      2,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordIncludedInSnapshot",
      "KnowledgeRepositoryRecordModel",
      "CurrentSnapshotModel",
      "RecordIncludedInSnapshot",
      "Forward",
      3,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordProducesHistory",
      "KnowledgeRepositoryRecordModel",
      "CreatedHistoryEventModel",
      "RecordProducesHistory",
      "Forward",
      4,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordHasMetadata",
      "KnowledgeRepositoryRecordModel",
      "RepositoryMetadataRecordModel",
      "RecordHasMetadata",
      "Forward",
      5,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordHasArchiveState",
      "KnowledgeRepositoryRecordModel",
      "KnowledgeRepositoryArchiveModel",
      "RecordHasArchiveState",
      "Forward",
      6,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordUsesRetentionPolicy",
      "KnowledgeRepositoryRecordModel",
      "TemporaryRetentionModel",
      "RecordUsesRetentionPolicy",
      "Forward",
      7,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordDeclaredByIndex",
      "KnowledgeRepositoryRecordModel",
      "IdentityIndexModel",
      "RecordDeclaredByIndex",
      "Forward",
      8,
    ),
    relationship(
      "DKL-6:3/Relationship/RecordAccessibleByRetrieval",
      "KnowledgeRepositoryRecordModel",
      "RetrieveByIdentityModel",
      "RecordAccessibleByRetrieval",
      "Forward",
      9,
    ),
    relationship(
      "DKL-6:3/Relationship/RelationshipConnectsRecords",
      "RelationshipRecordModel",
      "KnowledgeRepositoryRecordModel",
      "RelationshipConnectsRecords",
      "Bidirectional",
      10,
    ),
    relationship(
      "DKL-6:3/Relationship/EvidenceSupportsRecord",
      "EvidenceRecordModel",
      "KnowledgeRepositoryRecordModel",
      "EvidenceSupportsRecord",
      "Forward",
      11,
    ),
    relationship(
      "DKL-6:3/Relationship/ValidationQualifiesRecord",
      "ValidationRecordModel",
      "KnowledgeRepositoryRecordModel",
      "ValidationQualifiesRecord",
      "Forward",
      12,
    ),
    relationship(
      "DKL-6:3/Relationship/DecisionContextReferencesKnowledge",
      "DecisionContextRecordModel",
      "KnowledgeObjectRecordModel",
      "DecisionContextReferencesKnowledge",
      "Forward",
      13,
    ),
  ]);
