/**
 * DKL-2:1 — Data Source & Knowledge Registry Foundation.
 *
 * The canonical, immutable, metadata-only foundation for the Nexora Data Source
 * & Knowledge Registry Platform. It aggregates — by reference — the registry
 * identity, contracts, ownership, boundaries, and category metadata into a
 * single deep-frozen structure and publishes exactly seven public APIs.
 *
 * Responsibility: define immutable architecture for describing data sources and
 * knowledge definitions. It performs no discovery, ingestion, parsing,
 * synchronization, storage, AI reasoning, validation, transformation, or
 * runtime execution.
 * Ownership: owned exclusively by DKL-2:1.
 * Dependency rules: may depend only on the DKL-1 Public Index.
 * Architectural purpose: the descriptive root of the DKL-2 registry platform.
 * Zero runtime behavior: no I/O, no network, no parsing, no AI, no async, no
 * side effects.
 */

import {
  DataKnowledgeFoundationPublicIndexId,
  DataKnowledgeFoundationPublicIndexVersion,
} from "./dataKnowledgeFoundationPublicIndex.ts";
import { DataSourceKnowledgeRegistryBoundaries } from "./dataSourceKnowledgeRegistryBoundaries.ts";
import { DataSourceKnowledgeRegistryContracts } from "./dataSourceKnowledgeRegistryContracts.ts";
import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryMetadata.ts";
import { DataSourceKnowledgeRegistryOwnership } from "./dataSourceKnowledgeRegistryOwnership.ts";
import type {
  DataSourceKnowledgeRegistryFoundationDescriptor,
  RegistryIdentityDescriptor,
  RegistrySummaryDescriptor,
} from "./dataSourceKnowledgeRegistryFoundationTypes.ts";

export {
  DataSourceKnowledgeRegistryContracts,
  DataSourceKnowledgeRegistryOwnership,
  DataSourceKnowledgeRegistryBoundaries,
  DataSourceKnowledgeRegistryMetadata,
};

export const DataSourceKnowledgeRegistryVersion = "1.0.0";

const IDENTITY: RegistryIdentityDescriptor = Object.freeze({
  platformName: "Nexora Data Source & Knowledge Registry",
  namespace: "nexora.dkl.dsk-registry.foundation",
  layerId: "DKL-2",
  phaseId: "DKL-2:1",
  version: DataSourceKnowledgeRegistryVersion,
  stability: "Stable",
  dependsOn: Object.freeze([
    `${DataKnowledgeFoundationPublicIndexId} (${DataKnowledgeFoundationPublicIndexVersion})`,
  ]),
  metadataOnly: true,
  immutable: true,
});

export const DataSourceKnowledgeRegistryFoundation = Object.freeze({
  identity: IDENTITY,
  contracts: DataSourceKnowledgeRegistryContracts,
  ownership: DataSourceKnowledgeRegistryOwnership,
  boundaries: DataSourceKnowledgeRegistryBoundaries,
  metadata: DataSourceKnowledgeRegistryMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataSourceKnowledgeRegistryFoundationDescriptor);

export const DataSourceKnowledgeRegistrySummary = Object.freeze({
  platformName: IDENTITY.platformName,
  layerId: IDENTITY.layerId,
  phaseId: IDENTITY.phaseId,
  version: IDENTITY.version,
  stability: IDENTITY.stability,
  dataSourceCategoryCount: DataSourceKnowledgeRegistryMetadata.dataSourceCategories.length,
  knowledgeCategoryCount: DataSourceKnowledgeRegistryMetadata.knowledgeCategories.length,
  connectorTypeCount: DataSourceKnowledgeRegistryMetadata.connectorTypes.length,
  contentTypeCount: DataSourceKnowledgeRegistryMetadata.contentTypes.length,
  metadataTypeCount: DataSourceKnowledgeRegistryMetadata.metadataTypes.length,
  sourceCategoryCount: DataSourceKnowledgeRegistryMetadata.sourceCategories.length,
  ownedResponsibilityCount: DataSourceKnowledgeRegistryOwnership.owns.length,
  allowedDependencyCount: DataSourceKnowledgeRegistryContracts.allowedDependencies.length,
  forbiddenResponsibilityCount: DataSourceKnowledgeRegistryContracts.forbiddenResponsibilities.length,
  metadataOnly: true,
  immutable: true,
} as const satisfies RegistrySummaryDescriptor);
