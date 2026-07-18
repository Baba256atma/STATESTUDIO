/**
 * DKL-2:1 — Data Source & Knowledge Registry Metadata.
 *
 * Immutable canonical categories describing the data sources, knowledge domains,
 * connector types, content types, metadata types, and high-level source
 * groupings recognized by the Nexora Data Source & Knowledge Registry.
 *
 * Responsibility: publish descriptive category metadata only.
 * Ownership: owned exclusively by DKL-2:1.
 * Dependency rules: no dependencies beyond its own type contracts.
 * Architectural purpose: the single source of canonical registry categories.
 * Metadata only — no discovery, ingestion, parsing, or runtime behavior.
 */

import type {
  ConnectorTypeDescriptor,
  ConnectorTypeKey,
  ContentTypeDescriptor,
  ContentTypeKey,
  DataSourceCategoryDescriptor,
  DataSourceCategoryKey,
  KnowledgeCategoryDescriptor,
  KnowledgeCategoryKey,
  MetadataTypeDescriptor,
  MetadataTypeKey,
  RegistryMetadataDescriptor,
  SourceCategoryDescriptor,
  SourceCategoryKey,
} from "./dataSourceKnowledgeRegistryFoundationTypes.ts";

const dataSourceCategory = (
  key: DataSourceCategoryKey,
  name: string,
  description: string
): DataSourceCategoryDescriptor =>
  Object.freeze({
    id: `dsk-source-${key}`,
    key,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataSourceCategoryDescriptor);

const knowledgeCategory = (
  key: KnowledgeCategoryKey,
  name: string,
  description: string
): KnowledgeCategoryDescriptor =>
  Object.freeze({
    id: `dsk-knowledge-${key}`,
    key,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies KnowledgeCategoryDescriptor);

const connectorType = (
  key: ConnectorTypeKey,
  name: string,
  description: string
): ConnectorTypeDescriptor =>
  Object.freeze({
    id: `dsk-connector-${key}`,
    key,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies ConnectorTypeDescriptor);

const contentType = (
  key: ContentTypeKey,
  name: string,
  description: string
): ContentTypeDescriptor =>
  Object.freeze({
    id: `dsk-content-${key}`,
    key,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies ContentTypeDescriptor);

const metadataType = (
  key: MetadataTypeKey,
  name: string,
  description: string
): MetadataTypeDescriptor =>
  Object.freeze({
    id: `dsk-metadata-${key}`,
    key,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies MetadataTypeDescriptor);

const sourceCategory = (
  key: SourceCategoryKey,
  name: string,
  description: string
): SourceCategoryDescriptor =>
  Object.freeze({
    id: `dsk-source-category-${key}`,
    key,
    name,
    description,
    metadataOnly: true,
    immutable: true,
  } as const satisfies SourceCategoryDescriptor);

const dataSourceCategories = Object.freeze([
  dataSourceCategory("database", "Database", "Relational or non-relational operational database source."),
  dataSourceCategory("data-warehouse", "Data Warehouse", "Analytical data warehouse source."),
  dataSourceCategory("data-lake", "Data Lake", "Raw or curated data lake source."),
  dataSourceCategory("spreadsheet", "Spreadsheet", "Spreadsheet workbook source."),
  dataSourceCategory("csv", "CSV", "Comma-separated values file source."),
  dataSourceCategory("json", "JSON", "JSON document source."),
  dataSourceCategory("xml", "XML", "XML document source."),
  dataSourceCategory("pdf", "PDF", "Portable Document Format source."),
  dataSourceCategory("word", "Word", "Word-processing document source."),
  dataSourceCategory("presentation", "Presentation", "Slide presentation source."),
  dataSourceCategory("email", "Email", "Email message source."),
  dataSourceCategory("chat", "Chat", "Chat or messaging thread source."),
  dataSourceCategory("voice-transcript", "Voice Transcript", "Transcribed voice or call source."),
  dataSourceCategory("rest-api", "REST API", "RESTful API endpoint source."),
  dataSourceCategory("graphql-api", "GraphQL API", "GraphQL API endpoint source."),
  dataSourceCategory("mcp", "MCP", "Model Context Protocol server source."),
  dataSourceCategory("sdk", "SDK", "Software development kit source."),
  dataSourceCategory("erp", "ERP", "Enterprise resource planning system source."),
  dataSourceCategory("crm", "CRM", "Customer relationship management system source."),
  dataSourceCategory("file-system", "File System", "Local or mounted file system source."),
  dataSourceCategory("cloud-storage", "Cloud Storage", "Cloud object or file storage source."),
  dataSourceCategory("manual-input", "Manual Input", "Manually entered data source."),
  dataSourceCategory("external-knowledge-base", "External Knowledge Base", "External knowledge base source."),
] as const);

const knowledgeCategories = Object.freeze([
  knowledgeCategory("customer", "Customer", "Customer knowledge domain."),
  knowledgeCategory("organization", "Organization", "Organizational knowledge domain."),
  knowledgeCategory("employee", "Employee", "Employee knowledge domain."),
  knowledgeCategory("project", "Project", "Project knowledge domain."),
  knowledgeCategory("task", "Task", "Task knowledge domain."),
  knowledgeCategory("meeting", "Meeting", "Meeting knowledge domain."),
  knowledgeCategory("decision", "Decision", "Decision knowledge domain."),
  knowledgeCategory("goal", "Goal", "Goal knowledge domain."),
  knowledgeCategory("strategy", "Strategy", "Strategy knowledge domain."),
  knowledgeCategory("kpi", "KPI", "Key performance indicator knowledge domain."),
  knowledgeCategory("okr", "OKR", "Objectives and key results knowledge domain."),
  knowledgeCategory("risk", "Risk", "Risk knowledge domain."),
  knowledgeCategory("opportunity", "Opportunity", "Opportunity knowledge domain."),
  knowledgeCategory("product", "Product", "Product knowledge domain."),
  knowledgeCategory("service", "Service", "Service knowledge domain."),
  knowledgeCategory("contract", "Contract", "Contract knowledge domain."),
  knowledgeCategory("invoice", "Invoice", "Invoice knowledge domain."),
  knowledgeCategory("purchase", "Purchase", "Purchase knowledge domain."),
  knowledgeCategory("revenue", "Revenue", "Revenue knowledge domain."),
  knowledgeCategory("cost", "Cost", "Cost knowledge domain."),
  knowledgeCategory("document", "Document", "Document knowledge domain."),
  knowledgeCategory("conversation", "Conversation", "Conversation knowledge domain."),
  knowledgeCategory("event", "Event", "Event knowledge domain."),
] as const);

const connectorTypes = Object.freeze([
  connectorType("database-connector", "Database Connector", "Describes connectivity to database sources."),
  connectorType("file-connector", "File Connector", "Describes connectivity to file-based sources."),
  connectorType("api-connector", "API Connector", "Describes connectivity to API sources."),
  connectorType("mcp-connector", "MCP Connector", "Describes connectivity to MCP servers."),
  connectorType("sdk-connector", "SDK Connector", "Describes connectivity via SDK sources."),
  connectorType("cloud-storage-connector", "Cloud Storage Connector", "Describes connectivity to cloud storage."),
  connectorType("enterprise-system-connector", "Enterprise System Connector", "Describes connectivity to ERP/CRM systems."),
  connectorType("messaging-connector", "Messaging Connector", "Describes connectivity to messaging/chat/email."),
  connectorType("manual-connector", "Manual Connector", "Describes manually provided source input."),
] as const);

const contentTypes = Object.freeze([
  contentType("structured", "Structured", "Fully structured content with a fixed schema."),
  contentType("semi-structured", "Semi-Structured", "Partially structured content such as JSON or XML."),
  contentType("unstructured", "Unstructured", "Free-form unstructured content."),
  contentType("tabular", "Tabular", "Row-and-column tabular content."),
  contentType("document", "Document", "Document-oriented content."),
  contentType("message", "Message", "Discrete message content."),
  contentType("transcript", "Transcript", "Transcribed conversation content."),
  contentType("binary", "Binary", "Opaque binary content."),
] as const);

const metadataTypes = Object.freeze([
  metadataType("identity", "Identity", "Identity metadata for a source or knowledge entity."),
  metadataType("descriptive", "Descriptive", "Descriptive metadata for a source or knowledge entity."),
  metadataType("structural", "Structural", "Structural metadata describing composition."),
  metadataType("administrative", "Administrative", "Administrative and governance metadata."),
  metadataType("provenance", "Provenance", "Provenance and lineage metadata."),
  metadataType("classification", "Classification", "Classification and sensitivity metadata."),
  metadataType("relationship", "Relationship", "Relationship metadata between entities."),
] as const);

const sourceCategories = Object.freeze([
  sourceCategory("structured-data", "Structured Data", "Databases, warehouses, lakes, and tabular sources."),
  sourceCategory("document", "Document", "Document and file-based sources."),
  sourceCategory("communication", "Communication", "Email, chat, and voice transcript sources."),
  sourceCategory("api", "API", "REST, GraphQL, MCP, and SDK sources."),
  sourceCategory("enterprise-system", "Enterprise System", "ERP and CRM system sources."),
  sourceCategory("storage", "Storage", "File system and cloud storage sources."),
  sourceCategory("manual", "Manual", "Manually entered sources."),
  sourceCategory("external-knowledge", "External Knowledge", "External knowledge base sources."),
] as const);

export const DataSourceKnowledgeRegistryMetadata = Object.freeze({
  dataSourceCategories,
  knowledgeCategories,
  connectorTypes,
  contentTypes,
  metadataTypes,
  sourceCategories,
  metadataOnly: true,
  immutable: true,
} as const satisfies RegistryMetadataDescriptor);
