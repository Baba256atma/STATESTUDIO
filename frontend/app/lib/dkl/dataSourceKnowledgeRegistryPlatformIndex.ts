/**
 * DKL-2:6 — Data Source & Knowledge Registry Platform Index.
 *
 * The single canonical, immutable, metadata-only aggregate root for the complete
 * DKL-2 Data Source & Knowledge Registry Platform. It aggregates — strictly by
 * reference — the DKL-2:1 foundation, DKL-2:2 registry, DKL-2:3 model, DKL-2:4
 * validation, and DKL-2:5 manifest platforms, alongside the DKL-2:6 platform
 * registry, metadata, summary, and readiness.
 *
 * It introduces no new architecture, no runtime behavior, no registries, no
 * models, no validation rules, and no manifests. It publishes exactly six
 * runtime public APIs and is the official surface consumed by future DKL phases.
 *
 * Ownership: owned exclusively by DKL-2:6.
 * Dependency rules: consumes DKL-2:1..2:5 only through their public APIs and the
 * DKL-2:6 platform components. Forward-only, cycle-free, public-API-only.
 * Architectural purpose: the canonical DKL-2 platform. Zero runtime behavior:
 * no I/O, no network, no reflection, no async, no side effects.
 */

import { DataSourceKnowledgeRegistryFoundation } from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryPlatform as RegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceRegistryModelPlatform } from "./dataSourceRegistryModelPlatform.ts";
import { DataSourceKnowledgeValidationPlatform } from "./dataSourceKnowledgeValidationRunner.ts";
import { DataSourceKnowledgeRegistryManifestPlatform } from "./dataSourceKnowledgeRegistryManifestPlatform.ts";

import { DataSourceKnowledgePlatformMetadata } from "./dataSourceKnowledgePlatformMetadata.ts";
import { DataSourceKnowledgePlatformSummary } from "./dataSourceKnowledgePlatformSummary.ts";
import { DataSourceKnowledgePlatformReadiness } from "./dataSourceKnowledgePlatformReadiness.ts";

export { DataSourceKnowledgePlatformRegistry } from "./dataSourceKnowledgePlatformRegistry.ts";
export { DataSourceKnowledgePlatformMetadata } from "./dataSourceKnowledgePlatformMetadata.ts";
export { DataSourceKnowledgePlatformSummary } from "./dataSourceKnowledgePlatformSummary.ts";
export { DataSourceKnowledgePlatformReadiness } from "./dataSourceKnowledgePlatformReadiness.ts";

/** Immutable platform version string for the complete DKL-2 platform. */
export const DataSourceKnowledgePlatformVersion: string =
  DataSourceKnowledgePlatformMetadata.version;

/**
 * The canonical, deeply frozen aggregate root for the complete DKL-2 Data Source
 * & Knowledge Registry Platform. Every member is a direct reference to a prior
 * immutable platform object — no copies, no recreation.
 */
export const DataSourceKnowledgeRegistryPlatform = Object.freeze({
  foundation: DataSourceKnowledgeRegistryFoundation,
  registry: RegistryPlatform,
  model: DataSourceRegistryModelPlatform,
  validation: DataSourceKnowledgeValidationPlatform,
  manifest: DataSourceKnowledgeRegistryManifestPlatform,
  metadata: DataSourceKnowledgePlatformMetadata,
  summary: DataSourceKnowledgePlatformSummary,
  readiness: DataSourceKnowledgePlatformReadiness,
  metadataOnly: true,
  deterministic: true,
  immutable: true,
});
