/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Immutable metadata model describing a generic organizational knowledge
 * object. This declarative model also captures the source, ownership, identity,
 * and organizational-knowledge facets of a knowledge object.
 * Metadata only — no runtime behavior.
 */

import type {
  DataKnowledgeObjectModelDescriptor,
  ModelFacetDescriptor,
} from "./dataKnowledgeFoundationModelTypes.ts";

const facet = (
  name: string,
  description: string,
  options: readonly string[]
): ModelFacetDescriptor =>
  Object.freeze({
    facet: name,
    description,
    options: Object.freeze([...options]),
  } as const satisfies ModelFacetDescriptor);

export const DataKnowledgeObjectModel = Object.freeze({
  id: "dkl-model-knowledge-object",
  name: "Knowledge Object Model",
  kind: "knowledge-object",
  identifier: facet("identifier", "Immutable identity metadata of a knowledge object.", [
    "knowledgeId",
    "namespace",
    "kind",
    "version",
  ]),
  category: facet("category", "Conceptual category a knowledge object belongs to.", [
    "structural",
    "operational",
    "reference",
    "organizational",
  ]),
  source: facet("source", "Origin metadata (always normalized upstream by NEA).", [
    "nea-normalized",
    "internal",
    "derived",
  ]),
  ownership: facet("ownership", "Ownership scope metadata for a knowledge object.", [
    "tenant",
    "department",
    "role",
    "system",
  ]),
  lifecycle: facet("lifecycle", "Lifecycle stage metadata of a knowledge object.", [
    "draft",
    "active",
    "archived",
    "deprecated",
  ]),
  visibility: facet("visibility", "Visibility scope metadata of a knowledge object.", [
    "private",
    "internal",
    "shared",
    "public",
  ]),
  stability: facet("stability", "Stability level metadata of a knowledge object.", [
    "experimental",
    "stable",
    "frozen",
  ]),
  organizationalKnowledge: facet(
    "organizationalKnowledge",
    "Organizational knowledge scope a knowledge object contributes to.",
    ["enterprise", "domain", "team", "individual"]
  ),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeObjectModelDescriptor);
