/** ASSISTANT-3:1 — Readonly metadata types for Intent & Dialogue Foundation. */
export type AssistantIntentDialogueFoundationStatus = "Foundation";
export type AssistantIntentDialogueFoundationReadiness = "ReadyForRegistry";

export interface AssistantIntentDialogueIdentityMetadata {
  readonly id: "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation";
  readonly name: "Assistant Intent & Dialogue Understanding Foundation";
  readonly phaseId: "ASSISTANT-3:1";
  readonly namespace: "nexora.assistant.intent-dialogue.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantIntentDialogueFoundationStatus;
  readonly readiness: AssistantIntentDialogueFoundationReadiness;
  readonly sourceExecutiveMemory: "ASSISTANT-2:9/ExecutiveMemoryPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueCategoryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueConceptMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
