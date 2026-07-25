/** ASSISTANT-3:3 — Immutable Model constants derived from canonical metadata. */
import { AssistantIntentDialogueModelLifecycle } from "./assistantIntentDialogueModel.lifecycle.ts";
import { AssistantIntentDialogueDomainModels } from "./assistantIntentDialogueModel.metadata.ts";
import { AssistantIntentDialogueModelRelationships } from "./assistantIntentDialogueModel.relationships.ts";

export const AssistantIntentDialogueModelConstants = Object.freeze({
  modelIdentifier: "ASSISTANT-3:3/IntentDialogueUnderstandingModel",
  namespace: "nexora.assistant.intent-dialogue.model",
  version: "1.0.0",
  status: "Model",
  readiness: "ReadyForValidation",
  domainModelCount: AssistantIntentDialogueDomainModels.length,
  relationshipCount: AssistantIntentDialogueModelRelationships.length,
  lifecycleCount: AssistantIntentDialogueModelLifecycle.length,
} as const);
