/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Immutable registry of the seven public APIs exported by the DKL-1:1
 * Foundation. Each entry is metadata describing an exported artifact — the
 * registry does not invoke, wrap, or execute any of them.
 */

import type {
  DataKnowledgePublicApiCategory,
  DataKnowledgePublicApiDescriptor,
  DataKnowledgePublicApiKind,
} from "./dataKnowledgeFoundationRegistryTypes.ts";

const api = (
  name: string,
  kind: DataKnowledgePublicApiKind,
  category: DataKnowledgePublicApiCategory,
  description: string
): DataKnowledgePublicApiDescriptor =>
  Object.freeze({
    id: `dkl-public-api-${name}`,
    name,
    kind,
    category,
    phase: "DKL-1:1",
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgePublicApiDescriptor);

export const DataKnowledgeFoundationPublicApiRegistry = Object.freeze([
  api("DataKnowledgeFoundation", "value", "object", "Aggregate immutable foundation object."),
  api("DataKnowledgeFoundationContracts", "value", "collection", "Immutable architectural contracts bundle."),
  api("DataKnowledgeFoundationOwnership", "value", "object", "Immutable ownership declarations."),
  api("DataKnowledgeFoundationDependencies", "value", "object", "Immutable dependency declarations."),
  api("DataKnowledgeFoundationIdentity", "value", "object", "Immutable identity metadata."),
  api("getDataKnowledgeFoundation", "function", "accessor", "Deterministic accessor for the foundation object."),
  api("getDataKnowledgeFoundationSummary", "function", "accessor", "Deterministic accessor for the foundation summary."),
] as const);
