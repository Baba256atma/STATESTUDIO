/** ASSISTANT-1:8 — Readonly metadata types for Conversation Freeze. */
export interface AssistantConversationFreezeBaselineMetadata {
  readonly baselineId: string;
  readonly name: string;
  readonly description: string;
  readonly sourcePhase: string;
  readonly status: "Frozen";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification: "ASSISTANT-1:7/ConversationCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationFreezeArchitecturalLockMetadata {
  readonly lockId: string;
  readonly name: string;
  readonly description: string;
  readonly protectedTarget: string;
  readonly lockStatus: "Locked";
  readonly version: "1.0.0";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationFreezeRegistryEntryMetadata {
  readonly entryId: string;
  readonly name: string;
  readonly canonicalIdentity: string;
  readonly status: "Frozen";
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationFreezeIdentityMetadata {
  readonly id: "ASSISTANT-1:8/ConversationFreeze";
  readonly name: "Assistant Conversation Freeze";
  readonly phaseId: "ASSISTANT-1:8";
  readonly namespace: "nexora.assistant.conversation.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification: "ASSISTANT-1:7/ConversationCertification";
  readonly lockIdentifier: "ASSISTANT-1-CONVERSATION-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
