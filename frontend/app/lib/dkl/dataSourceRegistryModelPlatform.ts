/**
 * DKL-2:3 — Data Source & Knowledge Registry Model Platform.
 *
 * The single canonical, immutable, metadata-only aggregate root for the DKL-2:3
 * model platform. It exposes every model registry by reference alongside the
 * derived manifest, a summary, and the platform version. It publishes exactly
 * nine public runtime APIs and nothing else.
 *
 * Responsibility: aggregate and publish the model platform.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: consumes DKL-2:1 and DKL-2:2 only through their public APIs.
 * Architectural purpose: the authoritative entry point for registry models. Zero
 * runtime behavior: no I/O, no network, no parsing, no AI, no async, no side
 * effects.
 */

import { CompatibilityModels } from "./dataSourceRegistryCompatibilityModels.ts";
import { ConnectorModels } from "./dataSourceRegistryConnectorModels.ts";
import { RegistryIdentityModels } from "./dataSourceRegistryIdentityModels.ts";
import { KnowledgeModels } from "./dataSourceRegistryKnowledgeModels.ts";
import { DataSourceRegistryModelManifest } from "./dataSourceRegistryModelManifest.ts";
import { DataSourceModels } from "./dataSourceRegistrySourceModels.ts";
import type {
  DataSourceRegistryModelPlatformDescriptor,
  ModelSummaryDescriptor,
} from "./dataSourceRegistryModelTypes.ts";

export { RegistryIdentityModels } from "./dataSourceRegistryIdentityModels.ts";
export { DataSourceModels } from "./dataSourceRegistrySourceModels.ts";
export { KnowledgeModels } from "./dataSourceRegistryKnowledgeModels.ts";
export { ConnectorModels } from "./dataSourceRegistryConnectorModels.ts";
export { CompatibilityModels } from "./dataSourceRegistryCompatibilityModels.ts";
export { DataSourceRegistryModelManifest } from "./dataSourceRegistryModelManifest.ts";

/** The canonical platform version for the DKL-2:3 model platform. */
export const DataSourceRegistryModelVersion: string = DataSourceRegistryModelManifest.version;

/** Deterministic summary derived from the immutable model manifest. */
export const DataSourceRegistryModelSummary = Object.freeze({
  phaseId: DataSourceRegistryModelManifest.phaseId,
  version: DataSourceRegistryModelManifest.version,
  totalModels: DataSourceRegistryModelManifest.totalModels,
  completion: DataSourceRegistryModelManifest.completion,
  readiness: DataSourceRegistryModelManifest.readiness,
  metadataOnly: true,
  deterministic: true,
  immutable: true,
} as const satisfies ModelSummaryDescriptor);

/** The canonical, deeply frozen aggregate root for the DKL-2:3 model platform. */
export const DataSourceRegistryModelPlatform = Object.freeze({
  identityModels: RegistryIdentityModels,
  sourceModels: DataSourceModels,
  knowledgeModels: KnowledgeModels,
  connectorModels: ConnectorModels,
  compatibilityModels: CompatibilityModels,
  manifest: DataSourceRegistryModelManifest,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataSourceRegistryModelPlatformDescriptor);
