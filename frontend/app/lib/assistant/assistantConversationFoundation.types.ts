/** ASSISTANT-1:1 — Readonly metadata types for Conversation Foundation. */
export type AssistantConversationFoundationStatus = "Foundation";
export type AssistantConversationFoundationReadiness = "ReadyForRegistry";

export interface AssistantConversationIdentityMetadata {
  readonly id: "ASSISTANT-1:1/ConversationFoundation";
  readonly name: "Assistant Conversation Foundation";
  readonly phaseId: "ASSISTANT-1:1";
  readonly namespace: "nexora.assistant.conversation.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantConversationFoundationStatus;
  readonly readiness: AssistantConversationFoundationReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
