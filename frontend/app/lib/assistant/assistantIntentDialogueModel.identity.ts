/** ASSISTANT-3:3 — Canonical immutable Intent & Dialogue Model identity. */
import { AssistantIntentDialogueModelConstants } from "./assistantIntentDialogueModel.constants.ts";
import type { AssistantIntentDialogueModelIdentityMetadata } from "./assistantIntentDialogueModel.types.ts";

export const AssistantIntentDialogueModelIdentity:
AssistantIntentDialogueModelIdentityMetadata = Object.freeze({
  id: AssistantIntentDialogueModelConstants.modelIdentifier,
  name: "Assistant Intent & Dialogue Understanding Model",
  phaseId: "ASSISTANT-3:3",
  namespace: AssistantIntentDialogueModelConstants.namespace,
  version: AssistantIntentDialogueModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantIntentDialogueModelConstants.status,
  readiness: AssistantIntentDialogueModelConstants.readiness,
  sourceRegistry: "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry",
  metadataOnly: true,
  immutable: true,
});
