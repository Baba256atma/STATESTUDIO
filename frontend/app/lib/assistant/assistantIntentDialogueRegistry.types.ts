/** ASSISTANT-3:2 — Readonly metadata types for Intent & Dialogue Registry. */
export type AssistantIntentDialogueRegistryStatus = "Registry";
export type AssistantIntentDialogueRegistryReadiness = "ReadyForModel";

export interface AssistantIntentDialogueRegistryEntry {
  readonly identifier: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly version: "1.0.0";
  readonly lifecycle: "Active";
  readonly status: "Registered";
  readonly tags: readonly string[];
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueRegistryIdentityMetadata {
  readonly id: "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry";
  readonly name: "Assistant Intent & Dialogue Understanding Registry";
  readonly phaseId: "ASSISTANT-3:2";
  readonly namespace: "nexora.assistant.intent-dialogue.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantIntentDialogueRegistryStatus;
  readonly readiness: AssistantIntentDialogueRegistryReadiness;
  readonly sourceFoundation: "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
