/** ASSISTANT-2:1 — Readonly metadata types for Executive Memory Foundation. */
export type AssistantExecutiveMemoryFoundationStatus = "Foundation";
export type AssistantExecutiveMemoryFoundationReadiness = "ReadyForRegistry";

export interface AssistantExecutiveMemoryIdentityMetadata {
  readonly id: "ASSISTANT-2:1/ExecutiveMemoryFoundation";
  readonly name: "Assistant Executive Memory Foundation";
  readonly phaseId: "ASSISTANT-2:1";
  readonly namespace: "nexora.assistant.executive-memory.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveMemoryFoundationStatus;
  readonly readiness: AssistantExecutiveMemoryFoundationReadiness;
  readonly sourceConversation: "ASSISTANT-1:9/ConversationPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryScopeMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
