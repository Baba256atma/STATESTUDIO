/**
 * DKL-7:1 — Knowledge Services Contracts.
 *
 * Canonical Knowledge Service contracts for identity, metadata, requests,
 * responses, ownership, boundaries, and namespaces. Contract definitions only —
 * no repository access, search, graph traversal, or query execution.
 *
 * Ownership: owned exclusively by DKL-7:1.
 */

import type { KnowledgeServiceContract } from "./knowledgeServicesFoundationTypes.ts";

const contract = (
  contractId: string,
  contractName: string,
  description: string,
  fields: readonly string[],
): KnowledgeServiceContract =>
  Object.freeze({
    contractId,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    readOnly: true as const,
  });

export const KNOWLEDGE_SERVICE_CONTRACTS: readonly KnowledgeServiceContract[] =
  Object.freeze([
    contract(
      "DKL-7:1/KnowledgeService",
      "Knowledge Service",
      "Canonical declaration of a read-only organizational knowledge service.",
      Object.freeze([
        "identity",
        "metadata",
        "capabilityIds",
        "contractIds",
        "lifecycleStage",
        "readOnly",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceIdentity",
      "Knowledge Service Identity",
      "Identity of a logical Knowledge Service instance.",
      Object.freeze([
        "serviceId",
        "serviceName",
        "serviceNamespace",
        "owner",
        "sourcePhase",
        "version",
        "status",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceMetadata",
      "Knowledge Service Metadata",
      "Structural metadata describing a Knowledge Service declaration.",
      Object.freeze([
        "metadataId",
        "serviceId",
        "description",
        "capabilityIds",
        "contractIds",
        "owner",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceCapability",
      "Knowledge Service Capability",
      "Declared capability of a Knowledge Service — declaration only.",
      Object.freeze([
        "capabilityId",
        "name",
        "description",
        "declaredOnly",
        "implemented",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceLifecycle",
      "Knowledge Service Lifecycle",
      "Lifecycle stage declarations for Knowledge Services.",
      Object.freeze([
        "lifecycleId",
        "stages",
        "transitions",
        "terminalStage",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceBoundary",
      "Knowledge Service Boundary",
      "Boundary declaration separating Knowledge Services from implementation.",
      Object.freeze([
        "boundaryId",
        "readOnlyAccessLayer",
        "prohibitedSurfaces",
        "owner",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceOwnership",
      "Knowledge Service Ownership",
      "Ownership and non-ownership declarations for Knowledge Services.",
      Object.freeze([
        "ownershipId",
        "owner",
        "owns",
        "doesNotOwn",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceContract",
      "Knowledge Service Contract",
      "Contract descriptor for Knowledge Service surfaces.",
      Object.freeze([
        "contractId",
        "contractName",
        "description",
        "fields",
        "readOnly",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceRequest",
      "Knowledge Service Request",
      "Logical request metadata — no query execution.",
      Object.freeze([
        "requestId",
        "serviceId",
        "capabilityId",
        "consumer",
        "purpose",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceResponse",
      "Knowledge Service Response",
      "Logical response metadata — no result materialization.",
      Object.freeze([
        "responseId",
        "requestId",
        "serviceId",
        "status",
        "knowledgeReferences",
        "limitations",
      ]),
    ),
    contract(
      "DKL-7:1/KnowledgeServiceNamespace",
      "Knowledge Service Namespace",
      "Canonical namespace for Knowledge Services Foundation surfaces.",
      Object.freeze([
        "namespace",
        "owner",
        "sourcePhase",
        "immutable",
      ]),
    ),
  ]);

/** Canonical immutable Knowledge Service contracts. */
export const KnowledgeServicesContracts = Object.freeze({
  contractsId: "DKL-7:1/KnowledgeServicesContracts",
  sourcePhase: "DKL-7:1" as const,
  contracts: KNOWLEDGE_SERVICE_CONTRACTS,
  contractCount: KNOWLEDGE_SERVICE_CONTRACTS.length,
  definition: Object.freeze({
    knowledgeServices:
      "The official read-only access layer over organizational knowledge. Knowledge Services expose knowledge; they never create knowledge, never modify knowledge, and never perform executive reasoning.",
  }),
  notes: Object.freeze({
    metadataOnly: true,
    noRepositoryAccess: true,
    noSearchEngine: true,
    noGraphTraversal: true,
    noIndexing: true,
    noCaching: true,
    noQueryExecution: true,
    noPersistence: true,
    noNetworking: true,
    noAiReasoning: true,
    noExecutiveEngineBehavior: true,
    noAdvisorBehavior: true,
    noSceneBehavior: true,
    noBusinessObjectImplementation: true,
    createsKnowledge: false,
    modifiesKnowledge: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
