/**
 * DKL-2:1 — Data Source & Knowledge Registry Boundaries.
 *
 * Immutable architectural boundaries for the Data Source & Knowledge Registry
 * platform: the behaviors it must never perform and the strict allowed and
 * forbidden dependency directions.
 *
 * Responsibility: declare descriptive boundaries only.
 * Ownership: owned exclusively by DKL-2:1.
 * Dependency rules: may depend only on the DKL-1 Public Index; must never depend
 * on Engine, OPS, BUS, Advisor, Scene, NEA, Persistence, or Integrations.
 * Architectural purpose: guarantee the foundation stays descriptive and
 * runtime-free. Metadata only — no runtime behavior.
 */

import type { RegistryBoundariesDescriptor } from "./dataSourceKnowledgeRegistryFoundationTypes.ts";

export const DataSourceKnowledgeRegistryBoundaries = Object.freeze({
  mustNeverPerform: Object.freeze([
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
  allowedDependencies: Object.freeze(["DKL-1 Public Index"]),
  forbiddenDependencies: Object.freeze([
    "Engine",
    "OPS",
    "BUS",
    "Advisor",
    "Scene",
    "NEA",
    "Persistence",
    "Integrations",
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies RegistryBoundariesDescriptor);
