/**
 * DKL-2:1 — Data Source & Knowledge Registry Contracts.
 *
 * Immutable architectural contracts for the Data Source & Knowledge Registry
 * platform: its responsibilities, extension points, allowed dependencies, and
 * explicitly forbidden responsibilities.
 *
 * Responsibility: declare the descriptive architectural contract only.
 * Ownership: owned exclusively by DKL-2:1.
 * Dependency rules: may depend only on the DKL-1 Public Index.
 * Architectural purpose: define what the registry foundation promises and,
 * equally, what it must never do. Metadata only — no runtime behavior.
 */

import type { RegistryContractsDescriptor } from "./dataSourceKnowledgeRegistryFoundationTypes.ts";

export const DataSourceKnowledgeRegistryContracts = Object.freeze({
  responsibilities: Object.freeze([
    "Define canonical data source categories",
    "Define canonical knowledge categories",
    "Define connector, content, and metadata type vocabularies",
    "Declare registry ownership boundaries",
    "Declare allowed dependencies and forbidden responsibilities",
    "Publish immutable public metadata and constants",
  ]),
  extensionPoints: Object.freeze([
    "Additional data source categories (additive-only)",
    "Additional knowledge categories (additive-only)",
    "Additional connector types (additive-only)",
    "Additional content types (additive-only)",
    "Additional metadata types (additive-only)",
    "Additional source category groupings (additive-only)",
  ]),
  allowedDependencies: Object.freeze(["DKL-1 Public Index"]),
  forbiddenResponsibilities: Object.freeze([
    "Database connections",
    "File loading",
    "PDF parsing",
    "OCR",
    "AI extraction",
    "LLM calls",
    "Embeddings",
    "Indexing",
    "Synchronization",
    "Ingestion",
    "Crawling",
    "ETL",
    "Runtime validation",
    "Knowledge graph creation",
    "Storage",
    "Business logic",
  ]),
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const satisfies RegistryContractsDescriptor);
