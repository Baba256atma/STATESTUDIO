/** ASSISTANT-2:2 — Immutable Registry constants. */
import { AssistantExecutiveMemoryRegistryCollections } from "./assistantExecutiveMemoryRegistry.collections.ts";
import { AssistantExecutiveMemoryRegistryEntries } from "./assistantExecutiveMemoryRegistry.entries.ts";

export const AssistantExecutiveMemoryRegistryConstants = Object.freeze({
  registryIdentifier: "ASSISTANT-2:2/ExecutiveMemoryRegistry",
  namespace: "nexora.assistant.executive-memory.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  collectionCount:
    Object.keys(AssistantExecutiveMemoryRegistryCollections).length,
  entryCount: AssistantExecutiveMemoryRegistryEntries.length,
} as const);
