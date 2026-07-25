/** ASSISTANT-2:1 — Canonical immutable Foundation identity. */
import { AssistantExecutiveMemoryFoundationConstants } from "./assistantExecutiveMemoryFoundation.constants.ts";
import type { AssistantExecutiveMemoryIdentityMetadata } from "./assistantExecutiveMemoryFoundation.types.ts";

export const AssistantExecutiveMemoryFoundationIdentity:
AssistantExecutiveMemoryIdentityMetadata = Object.freeze({
  id: AssistantExecutiveMemoryFoundationConstants.canonicalIdentity,
  name: "Assistant Executive Memory Foundation",
  phaseId: AssistantExecutiveMemoryFoundationConstants.phaseIdentifier,
  namespace: AssistantExecutiveMemoryFoundationConstants.namespace,
  version: AssistantExecutiveMemoryFoundationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantExecutiveMemoryFoundationConstants.foundationStatus,
  readiness: AssistantExecutiveMemoryFoundationConstants.readiness,
  sourceConversation: "ASSISTANT-1:9/ConversationPublicIndex",
  metadataOnly: true,
  immutable: true,
});
