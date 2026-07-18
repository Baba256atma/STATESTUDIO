/**
 * DKL-2:3 — Data Source Models.
 *
 * Canonical, immutable metadata models describing each registered data source.
 * Every model is derived deterministically from a DKL-2:2 data-source registry
 * entry by reference. Metadata only — nothing connects to any source.
 *
 * Responsibility: publish the data-source models + lookup.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on the DKL-2:2 public registry platform and
 * DKL-2:3 model types.
 * Architectural purpose: answer "what is the metadata model of a source?".
 */

import { DataSourceRegistry } from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  createModelIdentity,
  modelIdFor,
  type DataSourceModel,
  type DataSourceModelsContainer,
} from "./dataSourceRegistryModelTypes.ts";

const dataSourceModel = (
  entry: (typeof DataSourceRegistry.entries)[number]
): DataSourceModel =>
  Object.freeze({
    identity: createModelIdentity({
      id: modelIdFor(entry.identity.registryEntryId),
      name: `${entry.identity.registryEntryName} Model`,
      category: "data-source",
      tags: Object.freeze(["data-source-model", entry.sourceCategory]),
    }),
    registryEntryId: entry.identity.registryEntryId,
    sourceCategory: entry.sourceCategory,
    structureClassification: entry.classification,
    sourceGroupId: entry.sourceGroupId,
    supportedConnectorCategoryIds: entry.supportedConnectorTypeIds,
    supportedContentCategoryIds: entry.supportedContentTypeIds,
    capabilities: Object.freeze([
      `${entry.classification}-source`,
      "registry-backed",
      "compatibility-declared",
    ]),
    limitations: Object.freeze([
      "metadata-only",
      "no-live-connection",
      "no-runtime-validation",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataSourceModel);

const dataSourceModelEntries: readonly DataSourceModel[] = Object.freeze(
  DataSourceRegistry.entries.map(dataSourceModel)
);

export const DataSourceModels: DataSourceModelsContainer = Object.freeze({
  kind: "DataSourceModels",
  models: dataSourceModelEntries,
  getById: (id: string): DataSourceModel | undefined =>
    dataSourceModelEntries.find((model) => model.identity.id === id),
});
