/** ASSISTANT-1:6 — Readonly metadata types for Conversation Platform. */
export interface AssistantConversationPlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Published" | "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-1:5/ConversationManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationPlatformIdentityMetadata {
  readonly id: "ASSISTANT-1:6/ConversationPlatform";
  readonly name: "Assistant Conversation Platform";
  readonly phaseId: "ASSISTANT-1:6";
  readonly namespace: "nexora.assistant.conversation.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-1:5/ConversationManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
