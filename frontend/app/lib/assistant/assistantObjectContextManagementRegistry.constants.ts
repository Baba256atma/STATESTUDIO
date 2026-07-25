/** ASSISTANT-6:2 — Immutable Registry constants. */
import { AssistantObjectContextManagementRegistryCollections } from "./assistantObjectContextManagementRegistry.collections.ts";
import { AssistantObjectContextManagementRegistryEntries } from "./assistantObjectContextManagementRegistry.entries.ts";

export const AssistantObjectContextManagementRegistryConstants = Object.freeze({
  registryIdentifier: "ASSISTANT-6:2/ObjectContextManagementRegistry",
  namespace: "nexora.assistant.object-context-management.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  collectionCount:
    Object.keys(AssistantObjectContextManagementRegistryCollections).length,
  entryCount: AssistantObjectContextManagementRegistryEntries.length,
} as const);
