/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Immutable registry of the architectural components published by the
 * DKL-1:1 Foundation, plus the declaration-only architectural capabilities.
 * Metadata only — no runtime behavior.
 */

import type {
  DataKnowledgeCapabilityDescriptor,
  DataKnowledgeComponentDescriptor,
  DataKnowledgeComponentKind,
} from "./dataKnowledgeFoundationRegistryTypes.ts";

const component = (
  kind: DataKnowledgeComponentKind,
  name: string,
  publicApi: string,
  description: string
): DataKnowledgeComponentDescriptor =>
  Object.freeze({
    id: `dkl-component-${kind}`,
    name,
    kind,
    description,
    publicApi,
    stability: "Stable",
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgeComponentDescriptor);

export const DataKnowledgeFoundationComponentRegistry = Object.freeze([
  component("identity", "Foundation Identity", "DataKnowledgeFoundationIdentity", "Immutable identity metadata component of the DKL Foundation."),
  component("ownership", "Foundation Ownership", "DataKnowledgeFoundationOwnership", "Immutable ownership declarations component of the DKL Foundation."),
  component("dependencies", "Foundation Dependencies", "DataKnowledgeFoundationDependencies", "Immutable dependency declarations component of the DKL Foundation."),
  component("contracts", "Foundation Contracts", "DataKnowledgeFoundationContracts", "Immutable architectural contracts component of the DKL Foundation."),
  component("foundation-object", "Foundation Object", "DataKnowledgeFoundation", "Aggregate immutable foundation object of the DKL Foundation."),
] as const);

const capability = (
  key: DataKnowledgeCapabilityDescriptor["key"],
  name: string,
  description: string
): DataKnowledgeCapabilityDescriptor =>
  Object.freeze({
    id: `dkl-capability-${key}`,
    key,
    name,
    description,
    declarationOnly: true,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgeCapabilityDescriptor);

export const DataKnowledgeFoundationCapabilityRegistry = Object.freeze([
  capability("knowledge-modeling", "Knowledge Modeling", "Declares the capability to model structured organizational knowledge metadata."),
  capability("business-object-ownership", "Business Object Ownership", "Declares ownership of organizational business object metadata."),
  capability("knowledge-metadata", "Knowledge Metadata", "Declares descriptive metadata management for knowledge entities."),
  capability("relationship-modeling", "Relationship Modeling", "Declares modeling of relationships between knowledge entities."),
  capability("organizational-knowledge", "Organizational Knowledge", "Declares publication of structured organizational knowledge."),
] as const);
