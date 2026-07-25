/** ASSISTANT-9:2 — Public registry surface metadata for Model consumers. */
import {
  AssistantActionMonitoringControlRegistryCollections,
  AssistantActionMonitoringControlRegistryEntries,
  AssistantActionMonitoringControlRegistryRelationships,
} from "./assistantActionMonitoringControlRegistryEntries.ts";
import { AssistantActionMonitoringControlRegistryIdentity } from "./assistantActionMonitoringControlRegistryIdentity.ts";
import { AssistantActionMonitoringControlRegistryLookup } from "./assistantActionMonitoringControlRegistryLookup.ts";
import { AssistantActionMonitoringControlRegistryMetadata } from "./assistantActionMonitoringControlRegistryMetadata.ts";

export const AssistantActionMonitoringControlRegistryPublic = Object.freeze({
  identity: AssistantActionMonitoringControlRegistryIdentity,
  metadata: AssistantActionMonitoringControlRegistryMetadata,
  collections: AssistantActionMonitoringControlRegistryCollections,
  entries: AssistantActionMonitoringControlRegistryEntries,
  relationships: AssistantActionMonitoringControlRegistryRelationships,
  lookup: AssistantActionMonitoringControlRegistryLookup,
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlRegistry",
  ]),
  consumer: "ASSISTANT-9:3 Executive Action Monitoring & Control Model",
  runtimeExports: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
} as const);
