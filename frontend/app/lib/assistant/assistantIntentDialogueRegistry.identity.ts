/** ASSISTANT-3:2 — Canonical immutable Registry identity. */
import { AssistantIntentDialogueRegistryConstants } from "./assistantIntentDialogueRegistry.constants.ts";
import type { AssistantIntentDialogueRegistryIdentityMetadata } from "./assistantIntentDialogueRegistry.types.ts";

export const AssistantIntentDialogueRegistryIdentity:
AssistantIntentDialogueRegistryIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueRegistryConstants.registryIdentifier,
  name: "Assistant Intent & Dialogue Understanding Registry",
  phaseId: "ASSISTANT-3:2",
  namespace: AssistantIntentDialogueRegistryConstants.namespace,
  version: AssistantIntentDialogueRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantIntentDialogueRegistryConstants.status,
  readiness: AssistantIntentDialogueRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation",
  metadataOnly: true,
  immutable: true,
});
