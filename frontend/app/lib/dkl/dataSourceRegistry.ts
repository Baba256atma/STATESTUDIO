/**
 * DKL-2:2 — Data Source Registry.
 *
 * The canonical, immutable registry of every approved DKL-2:1 data-source
 * category. Each category is represented exactly once. Entries are metadata
 * declarations only — they do not prove a real connector exists or connect to
 * any source.
 *
 * Responsibility: publish the authoritative data-source registry + lookup.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: depends only on DKL-2:2 registry types and the DKL-2:1
 * public foundation metadata.
 * Architectural purpose: answer "which data sources does Nexora recognize?".
 */

import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import {
  connectorTypeId,
  contentTypeId,
  createRegistryIdentity,
  dataSourceId,
  REGISTRY_OWNER,
  sourceGroupId,
  type ConnectorDefinitionKey,
  type ContentDefinitionKey,
  type DataSourceCategoryKey,
  type DataSourceRegistryContainer,
  type DataSourceRegistryEntry,
  type SourceGroupKey,
  type StructureClassification,
} from "./dataSourceRegistryTypes.ts";

interface DataSourceConfig {
  readonly group: SourceGroupKey;
  readonly classification: StructureClassification;
  readonly connectors: readonly ConnectorDefinitionKey[];
  readonly contentTypes: readonly ContentDefinitionKey[];
}

const CONFIG: Readonly<Record<DataSourceCategoryKey, DataSourceConfig>> = Object.freeze({
  database: { group: "operational-systems", classification: "structured", connectors: ["direct-database", "api"], contentTypes: ["tabular", "structured-payload"] },
  "data-warehouse": { group: "analytical-systems", classification: "structured", connectors: ["direct-database", "api"], contentTypes: ["tabular", "structured-payload"] },
  "data-lake": { group: "analytical-systems", classification: "semi-structured", connectors: ["api", "file-upload"], contentTypes: ["semi-structured-payload", "binary-attachment"] },
  spreadsheet: { group: "documents-and-files", classification: "structured", connectors: ["file-upload"], contentTypes: ["tabular"] },
  csv: { group: "documents-and-files", classification: "structured", connectors: ["file-upload"], contentTypes: ["tabular"] },
  json: { group: "documents-and-files", classification: "semi-structured", connectors: ["file-upload", "api"], contentTypes: ["semi-structured-payload"] },
  xml: { group: "documents-and-files", classification: "semi-structured", connectors: ["file-upload", "api"], contentTypes: ["semi-structured-payload"] },
  pdf: { group: "documents-and-files", classification: "unstructured", connectors: ["file-upload"], contentTypes: ["document", "binary-attachment"] },
  word: { group: "documents-and-files", classification: "unstructured", connectors: ["file-upload"], contentTypes: ["document", "binary-attachment"] },
  presentation: { group: "documents-and-files", classification: "unstructured", connectors: ["file-upload"], contentTypes: ["document", "binary-attachment"] },
  email: { group: "communication-channels", classification: "unstructured", connectors: ["email-gateway"], contentTypes: ["message", "document"] },
  chat: { group: "communication-channels", classification: "unstructured", connectors: ["messaging"], contentTypes: ["message"] },
  "voice-transcript": { group: "communication-channels", classification: "unstructured", connectors: ["voice-gateway"], contentTypes: ["audio-transcript"] },
  "rest-api": { group: "developer-interfaces", classification: "semi-structured", connectors: ["api", "webhook"], contentTypes: ["structured-payload", "semi-structured-payload"] },
  "graphql-api": { group: "developer-interfaces", classification: "semi-structured", connectors: ["api"], contentTypes: ["structured-payload", "semi-structured-payload"] },
  mcp: { group: "developer-interfaces", classification: "semi-structured", connectors: ["api", "sdk"], contentTypes: ["structured-payload"] },
  sdk: { group: "developer-interfaces", classification: "semi-structured", connectors: ["sdk"], contentTypes: ["structured-payload"] },
  erp: { group: "business-applications", classification: "structured", connectors: ["api", "direct-database"], contentTypes: ["structured-payload", "tabular"] },
  crm: { group: "business-applications", classification: "structured", connectors: ["api"], contentTypes: ["structured-payload", "tabular"] },
  "file-system": { group: "documents-and-files", classification: "unstructured", connectors: ["file-upload"], contentTypes: ["document", "binary-attachment"] },
  "cloud-storage": { group: "documents-and-files", classification: "unstructured", connectors: ["file-upload", "api"], contentTypes: ["document", "binary-attachment"] },
  "manual-input": { group: "manual-sources", classification: "unstructured", connectors: ["manual-entry"], contentTypes: ["manual-record"] },
  "external-knowledge-base": { group: "external-knowledge-sources", classification: "semi-structured", connectors: ["api"], contentTypes: ["semi-structured-payload", "document"] },
});

const dataSourceEntry = (
  category: (typeof DataSourceKnowledgeRegistryMetadata.dataSourceCategories)[number]
): DataSourceRegistryEntry => {
  const key = category.key;
  const config = CONFIG[key];
  return Object.freeze({
    identity: createRegistryIdentity({
      id: dataSourceId(key),
      name: category.name,
      description: category.description,
      kind: "DataSource",
      category: key,
      owner: REGISTRY_OWNER,
      tags: Object.freeze(["data-source", key, config.group]),
    }),
    sourceCategory: key,
    sourceGroupId: sourceGroupId(config.group),
    supportedContentTypeIds: Object.freeze(config.contentTypes.map(contentTypeId)),
    supportedConnectorTypeIds: Object.freeze(config.connectors.map(connectorTypeId)),
    classification: config.classification,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataSourceRegistryEntry);
};

const dataSourceEntries: readonly DataSourceRegistryEntry[] = Object.freeze(
  DataSourceKnowledgeRegistryMetadata.dataSourceCategories.map(dataSourceEntry)
);

export const DataSourceRegistry: DataSourceRegistryContainer = Object.freeze({
  kind: "DataSource",
  entries: dataSourceEntries,
  getById: (id: string): DataSourceRegistryEntry | undefined =>
    dataSourceEntries.find((entry) => entry.identity.registryEntryId === id),
});
