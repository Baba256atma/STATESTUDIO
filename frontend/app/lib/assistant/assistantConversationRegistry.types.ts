/** ASSISTANT-1:2 — Readonly metadata types for Conversation Registry. */
export type AssistantConversationRegistryStatus = "Registry";
export type AssistantConversationRegistryReadiness = "ReadyForModel";

export interface AssistantConversationRegistryEntry {
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

export interface AssistantConversationRegistryIdentityMetadata {
  readonly id: "ASSISTANT-1:2/ConversationRegistry";
  readonly name: "Assistant Conversation Registry";
  readonly phaseId: "ASSISTANT-1:2";
  readonly namespace: "nexora.assistant.conversation.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantConversationRegistryStatus;
  readonly readiness: AssistantConversationRegistryReadiness;
  readonly sourceFoundation: "ASSISTANT-1:1/ConversationFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
