/**
 * DKL-2:2 — Connector, Content, and Source Group Registries.
 *
 * Immutable capability declarations for the connector categories, content
 * categories, and high-level source groups recognized by the registry platform.
 * These are metadata declarations only — no connectors are implemented and no
 * content is processed.
 *
 * Responsibility: publish connector, content, and source-group registries.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: depends only on DKL-2:2 registry types.
 * Architectural purpose: the vocabularies referenced by data-source entries.
 */

import {
  connectorTypeId,
  contentTypeId,
  createRegistryIdentity,
  REGISTRY_OWNER,
  sourceGroupId,
  type ConnectorDefinitionKey,
  type ConnectorTypeRegistryContainer,
  type ConnectorTypeRegistryEntry,
  type ContentDefinitionKey,
  type ContentTypeRegistryContainer,
  type ContentTypeRegistryEntry,
  type SourceGroupKey,
  type SourceGroupRegistryContainer,
  type SourceGroupRegistryEntry,
  type StructureClassification,
} from "./dataSourceRegistryTypes.ts";

const connectorEntry = (
  connectorKey: ConnectorDefinitionKey,
  name: string,
  description: string
): ConnectorTypeRegistryEntry =>
  Object.freeze({
    identity: createRegistryIdentity({
      id: connectorTypeId(connectorKey),
      name,
      description,
      kind: "ConnectorType",
      category: "connector",
      owner: REGISTRY_OWNER,
      tags: Object.freeze(["connector", connectorKey]),
    }),
    connectorKey,
    metadataOnly: true,
    immutable: true,
  } as const satisfies ConnectorTypeRegistryEntry);

const contentEntry = (
  contentKey: ContentDefinitionKey,
  name: string,
  description: string,
  classification: StructureClassification
): ContentTypeRegistryEntry =>
  Object.freeze({
    identity: createRegistryIdentity({
      id: contentTypeId(contentKey),
      name,
      description,
      kind: "ContentType",
      category: "content",
      owner: REGISTRY_OWNER,
      tags: Object.freeze(["content", contentKey]),
    }),
    contentKey,
    classification,
    metadataOnly: true,
    immutable: true,
  } as const satisfies ContentTypeRegistryEntry);

const groupEntry = (
  groupKey: SourceGroupKey,
  name: string,
  description: string
): SourceGroupRegistryEntry =>
  Object.freeze({
    identity: createRegistryIdentity({
      id: sourceGroupId(groupKey),
      name,
      description,
      kind: "SourceGroup",
      category: "source-group",
      owner: REGISTRY_OWNER,
      tags: Object.freeze(["source-group", groupKey]),
    }),
    groupKey,
    metadataOnly: true,
    immutable: true,
  } as const satisfies SourceGroupRegistryEntry);

const connectorEntries: readonly ConnectorTypeRegistryEntry[] = Object.freeze([
  connectorEntry("direct-database", "Direct Database", "Direct connection capability to a database source."),
  connectorEntry("file-upload", "File Upload", "File upload capability for document and tabular sources."),
  connectorEntry("api", "API", "Request/response API connectivity capability."),
  connectorEntry("webhook", "Webhook", "Inbound webhook delivery capability."),
  connectorEntry("messaging", "Messaging", "Messaging/chat channel capability."),
  connectorEntry("email-gateway", "Email Gateway", "Email gateway ingestion capability."),
  connectorEntry("voice-gateway", "Voice Gateway", "Voice/telephony gateway capability."),
  connectorEntry("sdk", "SDK", "Programmatic SDK integration capability."),
  connectorEntry("manual-entry", "Manual Entry", "Manual data-entry capability."),
]);

const contentEntries: readonly ContentTypeRegistryEntry[] = Object.freeze([
  contentEntry("tabular", "Tabular", "Row-and-column tabular content.", "structured"),
  contentEntry("document", "Document", "Document-oriented content.", "unstructured"),
  contentEntry("message", "Message", "Discrete message content.", "unstructured"),
  contentEntry("audio-transcript", "Audio Transcript", "Transcribed audio content.", "unstructured"),
  contentEntry("structured-payload", "Structured Payload", "Structured API payload content.", "structured"),
  contentEntry("semi-structured-payload", "Semi-Structured Payload", "Semi-structured payload content.", "semi-structured"),
  contentEntry("binary-attachment", "Binary Attachment", "Opaque binary attachment content.", "unstructured"),
  contentEntry("manual-record", "Manual Record", "Manually entered record content.", "structured"),
]);

const groupEntries: readonly SourceGroupRegistryEntry[] = Object.freeze([
  groupEntry("operational-systems", "Operational Systems", "Transactional operational data systems."),
  groupEntry("analytical-systems", "Analytical Systems", "Analytical warehouses and lakes."),
  groupEntry("business-applications", "Business Applications", "ERP, CRM, and business application systems."),
  groupEntry("documents-and-files", "Documents and Files", "Document and file-based sources."),
  groupEntry("communication-channels", "Communication Channels", "Email, chat, and voice channels."),
  groupEntry("developer-interfaces", "Developer Interfaces", "APIs, MCP, and SDK interfaces."),
  groupEntry("manual-sources", "Manual Sources", "Manually entered sources."),
  groupEntry("external-knowledge-sources", "External Knowledge Sources", "External knowledge base sources."),
]);

export const ConnectorTypeRegistry: ConnectorTypeRegistryContainer = Object.freeze({
  kind: "ConnectorType",
  entries: connectorEntries,
  getById: (id: string): ConnectorTypeRegistryEntry | undefined =>
    connectorEntries.find((entry) => entry.identity.registryEntryId === id),
});

export const ContentTypeRegistry: ContentTypeRegistryContainer = Object.freeze({
  kind: "ContentType",
  entries: contentEntries,
  getById: (id: string): ContentTypeRegistryEntry | undefined =>
    contentEntries.find((entry) => entry.identity.registryEntryId === id),
});

export const SourceGroupRegistry: SourceGroupRegistryContainer = Object.freeze({
  kind: "SourceGroup",
  entries: groupEntries,
  getById: (id: string): SourceGroupRegistryEntry | undefined =>
    groupEntries.find((entry) => entry.identity.registryEntryId === id),
});
