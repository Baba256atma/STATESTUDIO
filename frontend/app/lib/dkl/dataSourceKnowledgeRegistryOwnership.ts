/**
 * DKL-2:1 — Data Source & Knowledge Registry Ownership.
 *
 * Immutable ownership declarations for the Data Source & Knowledge Registry
 * platform. Declares the responsibilities DKL-2:1 exclusively owns and those it
 * never owns (which belong to later DKL phases or other Nexora layers).
 *
 * Responsibility: declare descriptive ownership only.
 * Ownership: owned exclusively by DKL-2:1.
 * Dependency rules: may depend only on the DKL-1 Public Index.
 * Architectural purpose: lock the ownership boundary of the registry
 * foundation. Metadata only — no runtime behavior.
 */

import type { RegistryOwnershipDescriptor } from "./dataSourceKnowledgeRegistryFoundationTypes.ts";

export const DataSourceKnowledgeRegistryOwnership = Object.freeze({
  owns: Object.freeze([
    "architectural-definitions",
    "registry-contracts",
    "metadata",
    "ownership-declarations",
    "public-constants",
    "dependency-declarations",
  ]),
  neverOwns: Object.freeze([
    "discovery",
    "ingestion",
    "parsing",
    "synchronization",
    "storage",
    "ai-reasoning",
    "runtime-validation",
    "transformation",
    "knowledge-graph-creation",
    "business-logic",
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies RegistryOwnershipDescriptor);
