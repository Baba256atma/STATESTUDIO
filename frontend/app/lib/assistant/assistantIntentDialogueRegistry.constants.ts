/** ASSISTANT-3:2 — Immutable Registry constants. */
import { AssistantIntentDialogueRegistryCollections } from "./assistantIntentDialogueRegistry.collections.ts";
import { AssistantIntentDialogueRegistryEntries } from "./assistantIntentDialogueRegistry.entries.ts";

export const AssistantIntentDialogueRegistryConstants = Object.freeze({
  registryIdentifier: "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry",
  namespace: "nexora.assistant.intent-dialogue.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  collectionCount:
    Object.keys(AssistantIntentDialogueRegistryCollections).length,
  entryCount: AssistantIntentDialogueRegistryEntries.length,
} as const);
