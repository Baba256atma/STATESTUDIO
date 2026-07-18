/**
 * DKL-1:1 — Data Knowledge Layer Foundation.
 *
 * Immutable architectural contracts for the Data Knowledge Layer.
 * Declares the public responsibilities, architectural boundaries, extension
 * policy, and stability level of DKL.
 * Metadata only — no runtime behavior.
 */

import type {
  DataKnowledgeContractDescriptor,
  DataKnowledgeContractKind,
  DataKnowledgeContractsDescriptor,
} from "./dataKnowledgeFoundationTypes.ts";

const contract = (
  kind: DataKnowledgeContractKind,
  name: string,
  description: string
): DataKnowledgeContractDescriptor =>
  Object.freeze({
    id: `dkl-contract-${kind}`,
    name,
    kind,
    description,
    status: "Defined",
    stability: "Stable",
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgeContractDescriptor);

export const DataKnowledgeFoundationContracts = Object.freeze({
  contracts: Object.freeze([
    contract("knowledge-object", "Knowledge Object", "Describes the metadata contract for data knowledge objects."),
    contract("business-object", "Business Object", "Describes the metadata contract for organizational business objects."),
    contract("organizational-knowledge", "Organizational Knowledge", "Describes structured organizational knowledge metadata."),
    contract("knowledge-relationship", "Knowledge Relationship", "Describes metadata contracts for relationships between knowledge entities."),
    contract("knowledge-metadata", "Knowledge Metadata", "Describes descriptive metadata attached to knowledge entities."),
    contract("knowledge-identity", "Knowledge Identity", "Describes immutable identity metadata for knowledge entities."),
    contract("knowledge-ownership", "Knowledge Ownership", "Describes ownership metadata for knowledge entities."),
  ]),
  responsibilities: Object.freeze([
    "Knowledge Objects",
    "Business Objects",
    "Organizational Knowledge",
    "Knowledge Relationships",
    "Knowledge Metadata",
    "Knowledge Identity",
    "Knowledge Ownership",
  ]),
  boundaries: Object.freeze([
    "No authentication",
    "No gateway communication",
    "No REST APIs",
    "No SDK communication",
    "No Telegram integration",
    "No WhatsApp integration",
    "No email communication",
    "No voice communication",
    "No database querying",
    "No SQL execution",
    "No file parsing",
    "No PDF reading",
    "No decision making",
    "No visualization",
    "No UI rendering",
  ]),
  extensionPolicy: Object.freeze({
    policy: "additive-only",
    allowsNewKnowledgeTypes: true,
    allowsRuntimeBehavior: false,
    requiresBackwardCompatibility: true,
  }),
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeContractsDescriptor);
