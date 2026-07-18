/**
 * DKL-2:3 — Connector Models.
 *
 * Canonical, immutable metadata models describing each registered connector
 * category. Every model is derived deterministically from a DKL-2:2 connector
 * registry entry by reference. Metadata only — no connectors are implemented.
 *
 * Responsibility: publish the connector models + lookup.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on the DKL-2:2 public registry platform and
 * DKL-2:3 model types.
 * Architectural purpose: answer "what is the metadata model of a connector?".
 */

import { ConnectorTypeRegistry, ContentTypeRegistry } from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  createModelIdentity,
  modelIdFor,
  type AuthenticationCategory,
  type CommunicationDirection,
  type ConnectorDefinitionKey,
  type ConnectorModel,
  type ConnectorModelsContainer,
  type PayloadStyle,
  type TransportStyle,
} from "./dataSourceRegistryModelTypes.ts";

type ContentKey = (typeof ContentTypeRegistry.entries)[number]["contentKey"];

interface ConnectorConfig {
  readonly transportStyle: TransportStyle;
  readonly communicationDirection: CommunicationDirection;
  readonly authenticationCategory: AuthenticationCategory;
  readonly payloadStyle: PayloadStyle;
  readonly expectedContent: readonly ContentKey[];
}

const CONFIG: Readonly<Record<ConnectorDefinitionKey, ConnectorConfig>> = Object.freeze({
  "direct-database": { transportStyle: "connection", communicationDirection: "bidirectional", authenticationCategory: "credentials", payloadStyle: "structured", expectedContent: ["tabular", "structured-payload"] },
  "file-upload": { transportStyle: "upload", communicationDirection: "inbound", authenticationCategory: "none", payloadStyle: "document", expectedContent: ["document", "tabular", "binary-attachment"] },
  api: { transportStyle: "request-response", communicationDirection: "bidirectional", authenticationCategory: "token", payloadStyle: "structured", expectedContent: ["structured-payload", "semi-structured-payload"] },
  webhook: { transportStyle: "push", communicationDirection: "inbound", authenticationCategory: "key", payloadStyle: "structured", expectedContent: ["structured-payload"] },
  messaging: { transportStyle: "stream", communicationDirection: "bidirectional", authenticationCategory: "token", payloadStyle: "message", expectedContent: ["message"] },
  "email-gateway": { transportStyle: "push", communicationDirection: "inbound", authenticationCategory: "credentials", payloadStyle: "message", expectedContent: ["message", "document"] },
  "voice-gateway": { transportStyle: "stream", communicationDirection: "inbound", authenticationCategory: "key", payloadStyle: "message", expectedContent: ["audio-transcript"] },
  sdk: { transportStyle: "request-response", communicationDirection: "bidirectional", authenticationCategory: "key", payloadStyle: "structured", expectedContent: ["structured-payload"] },
  "manual-entry": { transportStyle: "manual", communicationDirection: "inbound", authenticationCategory: "none", payloadStyle: "manual", expectedContent: ["manual-record"] },
});

const contentIdByKey: ReadonlyMap<ContentKey, string> = new Map(
  ContentTypeRegistry.entries.map((entry) => [entry.contentKey, entry.identity.registryEntryId])
);

const resolveContentIds = (keys: readonly ContentKey[]): readonly string[] =>
  Object.freeze(
    keys.reduce<string[]>((acc, key) => {
      const id = contentIdByKey.get(key);
      if (id !== undefined) {
        acc.push(id);
      }
      return acc;
    }, [])
  );

const connectorModel = (
  entry: (typeof ConnectorTypeRegistry.entries)[number]
): ConnectorModel => {
  const config = CONFIG[entry.connectorKey];
  return Object.freeze({
    identity: createModelIdentity({
      id: modelIdFor(entry.identity.registryEntryId),
      name: `${entry.identity.registryEntryName} Connector Model`,
      category: "connector",
      tags: Object.freeze(["connector-model", entry.connectorKey]),
    }),
    registryEntryId: entry.identity.registryEntryId,
    connectorCategory: entry.connectorKey,
    transportStyle: config.transportStyle,
    communicationDirection: config.communicationDirection,
    authenticationCategory: config.authenticationCategory,
    payloadStyle: config.payloadStyle,
    expectedContentCategoryIds: resolveContentIds(config.expectedContent),
    metadataOnly: true,
    immutable: true,
  } as const satisfies ConnectorModel);
};

const connectorModelEntries: readonly ConnectorModel[] = Object.freeze(
  ConnectorTypeRegistry.entries.map(connectorModel)
);

export const ConnectorModels: ConnectorModelsContainer = Object.freeze({
  kind: "ConnectorModels",
  models: connectorModelEntries,
  getById: (id: string): ConnectorModel | undefined =>
    connectorModelEntries.find((model) => model.identity.id === id),
});
