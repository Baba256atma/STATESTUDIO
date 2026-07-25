/** ASSISTANT-3:3 — Readonly metadata types for Intent & Dialogue Model. */
export type AssistantIntentDialogueModelStatus = "Model";
export type AssistantIntentDialogueModelReadiness = "ReadyForValidation";

export interface AssistantIntentDialogueDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Intent & Dialogue Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-3:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueRelationshipMetadata {
  readonly identifier: string;
  readonly source: string;
  readonly target: string;
  readonly relationshipType: string;
  readonly registryReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueModelIdentityMetadata {
  readonly id: "ASSISTANT-3:3/IntentDialogueUnderstandingModel";
  readonly name: "Assistant Intent & Dialogue Understanding Model";
  readonly phaseId: "ASSISTANT-3:3";
  readonly namespace: "nexora.assistant.intent-dialogue.model";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantIntentDialogueModelStatus;
  readonly readiness: AssistantIntentDialogueModelReadiness;
  readonly sourceRegistry: "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
}
