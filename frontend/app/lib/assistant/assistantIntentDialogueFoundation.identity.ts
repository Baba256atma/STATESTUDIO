/** ASSISTANT-3:1 — Canonical immutable Foundation identity. */
import { AssistantIntentDialogueFoundationConstants } from "./assistantIntentDialogueFoundation.constants.ts";
import type { AssistantIntentDialogueIdentityMetadata } from "./assistantIntentDialogueFoundation.types.ts";

export const AssistantIntentDialogueFoundationIdentity:
AssistantIntentDialogueIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueFoundationConstants.canonicalIdentity,
  name: "Assistant Intent & Dialogue Understanding Foundation",
  phaseId: AssistantIntentDialogueFoundationConstants.phaseIdentifier,
  namespace: AssistantIntentDialogueFoundationConstants.namespace,
  version: AssistantIntentDialogueFoundationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantIntentDialogueFoundationConstants.foundationStatus,
  readiness: AssistantIntentDialogueFoundationConstants.readiness,
  sourceExecutiveMemory: "ASSISTANT-2:9/ExecutiveMemoryPublicIndex",
  metadataOnly: true,
  immutable: true,
});
