/**
 * DKL-6:3 — Knowledge Repository Record Models.
 *
 * Identity, repository aggregate structure, and seven knowledge record models.
 * Logical declarations only — no instance generation or persistence.
 *
 * Ownership: owned exclusively by DKL-6:3.
 */

import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type { KnowledgeRepositoryModelDescriptor } from "./knowledgeRepositoryModelTypes.ts";

const BASE_RECORD_FIELDS = Object.freeze([
  "recordId",
  "recordType",
  "repositoryType",
  "knowledgeIdentity",
  "sourceReference",
  "ownerReference",
  "versionReference",
  "status",
  "metadataReference",
] as const);

const descriptor = (
  modelId: string,
  modelName: string,
  modelCategory: string,
  description: string,
  registryGroup: string,
  registryEntryReference: string,
  fields: readonly string[],
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory,
    description,
    registryGroup,
    registryEntryReference,
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: Object.freeze([...fields]),
    deterministicOrder,
  });

const recordTypeRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.knowledgeRecordTypes.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/KnowledgeRecordType/${name}`;
};

const componentRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.components.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/Component/${name}`;
};

const repositoryTypeRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.repositoryTypes.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/RepositoryType/${name}`;
};

/** Repository identity model descriptor. */
export const KnowledgeRepositoryIdentityModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/KnowledgeRepositoryIdentity",
    "KnowledgeRepositoryIdentityModel",
    "RepositoryIdentity",
    "Logical identity model for a Knowledge Repository.",
    "RepositoryComponent",
    componentRef("RepositoryIdentity"),
    Object.freeze([
      "repositoryId",
      "repositoryType",
      "namespace",
      "owner",
      "status",
      "createdFrom",
    ]),
    1,
  );

/** Top-level repository aggregate structure descriptor. */
export const KnowledgeRepositoryAggregateStructureDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/KnowledgeRepositoryAggregate",
    "KnowledgeRepositoryAggregateModel",
    "RepositoryAggregate",
    "Canonical top-level logical structure of a Knowledge Repository.",
    "RepositoryType",
    repositoryTypeRef("OrganizationalKnowledgeRepository"),
    Object.freeze([
      "identity",
      "records",
      "versions",
      "snapshots",
      "history",
      "archive",
      "retention",
      "indexes",
      "retrieval",
      "metadata",
      "relationships",
      "lifecycle",
      "ownership",
      "boundaries",
    ]),
    1,
  );

/** Shared base record contract descriptor. */
export const KnowledgeRepositoryBaseRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/KnowledgeRepositoryRecord",
    "KnowledgeRepositoryRecordModel",
    "RepositoryRecord",
    "Shared immutable logical record contract for repository records.",
    "RepositoryComponent",
    componentRef("RepositoryRecord"),
    BASE_RECORD_FIELDS,
    0,
  );

export const KnowledgeObjectRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/KnowledgeObjectRecord",
    "KnowledgeObjectRecordModel",
    "KnowledgeRecord",
    "Logical repository record model for a DKL knowledge object.",
    "KnowledgeRecordType",
    recordTypeRef("KnowledgeObjectRecord"),
    Object.freeze([
      ...BASE_RECORD_FIELDS,
      "knowledgeObjectTypeReference",
      "knowledgeDomainReference",
      "relationshipReferences",
      "evidenceReferences",
      "validationReference",
    ]),
    1,
  );

export const BusinessObjectRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/BusinessObjectRecord",
    "BusinessObjectRecordModel",
    "KnowledgeRecord",
    "Logical repository record model for a Business Object reference.",
    "KnowledgeRecordType",
    recordTypeRef("BusinessObjectRecord"),
    Object.freeze([
      ...BASE_RECORD_FIELDS,
      "businessObjectTypeReference",
      "businessIdentityReference",
      "relationshipReferences",
      "sourceReferences",
      "validationReference",
    ]),
    2,
  );

export const RelationshipRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/RelationshipRecord",
    "RelationshipRecordModel",
    "KnowledgeRecord",
    "Logical relationship record between repository records.",
    "KnowledgeRecordType",
    recordTypeRef("RelationshipRecord"),
    Object.freeze([
      "relationshipIdentity",
      "sourceRecordReference",
      "targetRecordReference",
      "relationshipType",
      "direction",
      "status",
      "evidenceReference",
      "versionReference",
    ]),
    3,
  );

export const EvidenceRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/EvidenceRecord",
    "EvidenceRecordModel",
    "KnowledgeRecord",
    "Logical evidence record associated with repository knowledge.",
    "KnowledgeRecordType",
    recordTypeRef("EvidenceRecord"),
    Object.freeze([
      "evidenceIdentity",
      "evidenceType",
      "sourceReference",
      "subjectReference",
      "validationStatus",
      "confidenceReference",
      "versionReference",
      "metadataReference",
    ]),
    4,
  );

export const ValidationRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/ValidationRecord",
    "ValidationRecordModel",
    "KnowledgeRecord",
    "Logical validation result record inherited from DKL-5.",
    "KnowledgeRecordType",
    recordTypeRef("ValidationRecord"),
    Object.freeze([
      "validationIdentity",
      "subjectReference",
      "validationStatus",
      "ruleReferences",
      "evidenceReferences",
      "issueReferences",
      "certificationReference",
      "versionReference",
    ]),
    5,
  );

export const DecisionContextRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/DecisionContextRecord",
    "DecisionContextRecordModel",
    "KnowledgeRecord",
    "Logical decision-context knowledge record for the repository.",
    "KnowledgeRecordType",
    recordTypeRef("DecisionContextRecord"),
    Object.freeze([
      "contextIdentity",
      "decisionReference",
      "relatedKnowledgeReferences",
      "evidenceReferences",
      "snapshotReference",
      "versionReference",
      "status",
    ]),
    6,
  );

export const RepositoryMetadataRecordModelDescriptor: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/RepositoryMetadataRecord",
    "RepositoryMetadataRecordModel",
    "KnowledgeRecord",
    "Logical metadata record for another repository record.",
    "KnowledgeRecordType",
    recordTypeRef("RepositoryMetadataRecord"),
    Object.freeze([
      "metadataIdentity",
      "subjectReference",
      "metadataType",
      "sourceReference",
      "ownershipReference",
      "lifecycleState",
      "versionReference",
      "status",
    ]),
    7,
  );

/** Ordered canonical knowledge record model inventory. */
export const KnowledgeRepositoryRecordModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    KnowledgeObjectRecordModelDescriptor,
    BusinessObjectRecordModelDescriptor,
    RelationshipRecordModelDescriptor,
    EvidenceRecordModelDescriptor,
    ValidationRecordModelDescriptor,
    DecisionContextRecordModelDescriptor,
    RepositoryMetadataRecordModelDescriptor,
  ]);
