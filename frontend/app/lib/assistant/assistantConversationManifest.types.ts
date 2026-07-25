/** ASSISTANT-1:5 — Readonly metadata types for Conversation Manifest. */
export interface AssistantConversationManifestIdentityMetadata {
  readonly id: "ASSISTANT-1:5/ConversationManifest";
  readonly name: "Assistant Conversation Manifest";
  readonly phaseId: "ASSISTANT-1:5";
  readonly namespace: "nexora.assistant.conversation.manifest";
  readonly version: "1.0.0";
  readonly status: "Manifest";
  readonly readiness: "ReadyForPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationCompatibilityMetadata {
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly freezeCompatible: true;
  readonly publicIndexCompatible: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationManifestSummaryMetadata {
  readonly manifestId: string;
  readonly validationStatus: "Passed";
  readonly readiness: "ReadyForPlatform";
  readonly publishedInventoryCount: number;
  readonly validationRuleCount: number;
  readonly validationGateCount: number;
  readonly canonicalInventoryRuleSatisfied: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
