/**
 * DKL-2:2 — Data Source & Knowledge Registry Platform.
 *
 * The single canonical, immutable, metadata-only aggregate root for the DKL-2:2
 * registry platform. It exposes every registry by reference alongside the
 * derived manifest and the DKL-2:1 foundation metadata. It publishes exactly
 * eight public APIs and nothing else.
 *
 * Responsibility: aggregate and publish the registry platform.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: consumes DKL-2:1 only through its public foundation API.
 * Architectural purpose: the authoritative entry point for the registry
 * platform. Zero runtime behavior: no I/O, no network, no parsing, no AI, no
 * async, no side effects.
 */

import { ConnectorTypeRegistry, ContentTypeRegistry, SourceGroupRegistry } from "./connectorContentRegistry.ts";
import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryManifest } from "./dataSourceKnowledgeRegistryManifest.ts";
import { DataSourceRegistry } from "./dataSourceRegistry.ts";
import { KnowledgeTypeRegistry } from "./knowledgeTypeRegistry.ts";
import { SourceKnowledgeCompatibilityRegistry } from "./sourceKnowledgeCompatibilityRegistry.ts";
import type { DataSourceKnowledgeRegistryPlatformDescriptor } from "./dataSourceRegistryTypes.ts";

export { DataSourceRegistry } from "./dataSourceRegistry.ts";
export { KnowledgeTypeRegistry } from "./knowledgeTypeRegistry.ts";
export {
  ConnectorTypeRegistry,
  ContentTypeRegistry,
  SourceGroupRegistry,
} from "./connectorContentRegistry.ts";
export { SourceKnowledgeCompatibilityRegistry } from "./sourceKnowledgeCompatibilityRegistry.ts";
export { DataSourceKnowledgeRegistryManifest } from "./dataSourceKnowledgeRegistryManifest.ts";

export const DataSourceKnowledgeRegistryPlatform = Object.freeze({
  foundation: DataSourceKnowledgeRegistryMetadata,
  dataSources: DataSourceRegistry,
  knowledgeTypes: KnowledgeTypeRegistry,
  connectors: ConnectorTypeRegistry,
  contentTypes: ContentTypeRegistry,
  sourceGroups: SourceGroupRegistry,
  compatibility: SourceKnowledgeCompatibilityRegistry,
  manifest: DataSourceKnowledgeRegistryManifest,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataSourceKnowledgeRegistryPlatformDescriptor);
